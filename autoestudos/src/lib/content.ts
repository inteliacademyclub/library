// Lê a pasta docs/ e monta o catálogo do site: trilhas de aulas, módulos,
// projetos e páginas. Só roda no servidor (build estático).
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.join(process.cwd(), 'docs');

export type Secao = 'tapi' | 'entregas' | 'guias';

export type Page = {
  /** Caminho da URL sem barras nas pontas, ex.: "aulas/rag-e-rerankers/chunking". */
  slug: string;
  file: string;
  title: string;
  label: string;
  description?: string;
  position: number;
  body: string;
  /** "45 min" vindo do LessonMeta, ou estimativa de leitura. */
  tempo: string;
  semana?: string;
  opcional?: boolean;
  area: 'aulas' | 'projetos';
  /** Slug da trilha ou do projeto a que a página pertence. */
  grupo: string;
  modulo?: string;
  secao?: Secao;
  /** Rótulo da subpasta (ex.: "Materiais"), quando houver. */
  subgrupo?: string;
};

export type Modulo = {
  slug: string;
  n: number;
  title: string;
  description?: string;
  pages: Page[];
};

export type Trilha = {
  slug: string;
  title: string;
  description: string;
  position: number;
  modulos: Modulo[];
  /** Aulas na ordem de leitura (todas, inclusive dentro de módulos). */
  pages: Page[];
};

export type Projeto = {
  slug: string;
  nome: string;
  titulo: string;
  parceiro: string;
  status: 'em-andamento' | 'em-breve' | 'concluido';
  periodo: string;
  resumo: string;
  trilha?: string;
  position: number;
  pages: Page[];
};

type Category = {label: string; position?: number; description?: string; link?: {description?: string}} & Record<string, unknown>;

const stripNum = (s: string) => s.replace(/^\d+-/, '');
const numOf = (s: string) => {
  const m = s.match(/^(\d+)-/);
  return m ? Number(m[1]) : undefined;
};

function readCategory(dir: string): Category | undefined {
  const f = path.join(dir, '_category_.json');
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as Category) : undefined;
}

function firstH1(body: string): string | undefined {
  // ignora blocos de código para não pegar comentários de shell
  const semCodigo = body.replace(/```[\s\S]*?```/g, '');
  return semCodigo.match(/^#\s+(.+)$/m)?.[1].trim();
}

function tempoDe(body: string): {tempo: string; semana?: string; opcional?: boolean} {
  const meta = body.match(/<LessonMeta[\s\S]*?\/>/)?.[0];
  if (meta) {
    const tempo = meta.match(/tempo="([^"]+)"/)?.[1];
    const semana = meta.match(/semana=\{?"?([^}"\s]+)"?\}?/)?.[1];
    const opcional = /\bopcional\b/.test(meta);
    if (tempo) return {tempo, semana, opcional};
  }
  const palavras = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).length;
  return {tempo: `${Math.max(3, Math.round(palavras / 200))} min`};
}

function readPage(file: string, area: Page['area'], grupo: string, extra: Partial<Page> = {}): Page {
  const raw = fs.readFileSync(file, 'utf8');
  const {data, content} = matter(raw);
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const parts = rel.replace(/\.mdx?$/, '').split('/').map(stripNum);
  if (parts.at(-1) === 'index') parts.pop();
  const base = path.basename(path.dirname(file));
  const position = (data.sidebar_position as number | undefined) ?? numOf(path.basename(file) === 'index.md' || path.basename(file) === 'index.mdx' ? base : path.basename(file)) ?? 99;
  const title = (data.title as string | undefined) ?? firstH1(content) ?? parts.at(-1)!;
  return {
    slug: parts.join('/'),
    file,
    title,
    label: (data.sidebar_label as string | undefined) ?? title,
    description: data.description as string | undefined,
    position,
    body: content,
    area,
    grupo,
    secao: data.secao as Secao | undefined,
    ...tempoDe(content),
    ...extra,
  };
}

/** Páginas .md/.mdx de um diretório (arquivo solto ou pasta com index). */
type Entrada = {file: string; isDir: boolean; name: string};

function pagesIn(dir: string): Entrada[] {
  return fs
    .readdirSync(dir, {withFileTypes: true})
    .flatMap((e): Entrada[] => {
      const p = path.join(dir, e.name);
      if (e.isFile() && /\.mdx?$/.test(e.name)) return [{file: p, isDir: false, name: e.name}];
      if (e.isDirectory()) {
        const idx = ['index.mdx', 'index.md'].map((f) => path.join(p, f)).find((f) => fs.existsSync(f));
        if (idx) return [{file: idx, isDir: false, name: e.name}];
        return [{file: p, isDir: true, name: e.name}];
      }
      return [];
    });
}

const byPos = <T extends {position: number}>(a: T, b: T) => a.position - b.position;

let cache: {trilhas: Trilha[]; projetos: Projeto[]; pages: Page[]} | undefined;

function load() {
  if (cache && process.env.NODE_ENV === 'production') return cache;

  const trilhas: Trilha[] = fs
    .readdirSync(path.join(ROOT, 'aulas'), {withFileTypes: true})
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = path.join(ROOT, 'aulas', e.name);
      const cat = readCategory(dir)!;
      const slug = stripNum(e.name);
      const modulos: Modulo[] = [];
      const soltas: Page[] = [];
      for (const it of pagesIn(dir)) {
        if (!it.isDir) {
          soltas.push(readPage(it.file, 'aulas', slug));
          continue;
        }
        const mcat = readCategory(it.file);
        const mslug = stripNum(it.name);
        const pages = pagesIn(it.file)
          .filter((x) => !x.isDir)
          .map((x) => readPage(x.file, 'aulas', slug, {modulo: mslug}))
          .sort(byPos);
        modulos.push({
          slug: mslug,
          n: numOf(it.name) ?? mcat?.position ?? 99,
          // "1 · Formulação e Dados" -> "Formulação e Dados"
          title: (mcat?.label ?? mslug).replace(/^\d+\s*·\s*/, ''),
          description: mcat?.link?.description,
          pages,
        });
      }
      modulos.sort((a, b) => a.n - b.n);
      soltas.sort(byPos);
      return {
        slug,
        title: cat.label,
        description: cat.description ?? '',
        position: cat.position ?? 99,
        modulos,
        pages: [...soltas, ...modulos.flatMap((m) => m.pages)],
      };
    })
    .sort(byPos);

  const projetos: Projeto[] = fs
    .readdirSync(path.join(ROOT, 'projetos'), {withFileTypes: true})
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = path.join(ROOT, 'projetos', e.name);
      const cat = readCategory(dir)!;
      const slug = stripNum(e.name);
      const pages: Page[] = [];
      for (const it of pagesIn(dir)) {
        if (!it.isDir) pages.push(readPage(it.file, 'projetos', slug));
        else {
          const sub = readCategory(it.file)?.label;
          for (const x of pagesIn(it.file).filter((y) => !y.isDir)) pages.push(readPage(x.file, 'projetos', slug, {subgrupo: sub}));
        }
      }
      const ordem: Record<Secao, number> = {tapi: 0, entregas: 1, guias: 2};
      pages.sort((a, b) => ordem[a.secao ?? 'guias'] - ordem[b.secao ?? 'guias'] || a.position - b.position);
      return {
        slug,
        nome: cat.label,
        titulo: String(cat.titulo ?? cat.label),
        parceiro: String(cat.parceiro ?? cat.label),
        status: (cat.status as Projeto['status']) ?? 'concluido',
        periodo: String(cat.periodo ?? ''),
        resumo: String(cat.resumo ?? ''),
        trilha: cat.trilha as string | undefined,
        position: cat.position ?? 99,
        pages,
      };
    })
    .sort(byPos);

  cache = {trilhas, projetos, pages: [...trilhas.flatMap((t) => t.pages), ...projetos.flatMap((p) => p.pages)]};
  return cache;
}

export const getTrilhas = () => load().trilhas;
export const getProjetos = () => load().projetos;
export const getPages = () => load().pages;
export const getTrilha = (slug: string) => load().trilhas.find((t) => t.slug === slug);
export const getProjeto = (slug: string) => load().projetos.find((p) => p.slug === slug);
export const getPage = (slug: string) => load().pages.find((p) => p.slug === slug);

export const SECOES: {id: Secao; label: string; descricao: string}[] = [
  {id: 'tapi', label: 'TAPI', descricao: 'O termo de abertura: problema, objetivo, escopo e critérios.'},
  {id: 'entregas', label: 'Entregas', descricao: 'Cronograma, templates e o que cada entrega precisa ter.'},
  {id: 'guias', label: 'Guias', descricao: 'Materiais de apoio específicos deste projeto.'},
];

/** Soma "45 min" + "1h 10 min" etc. em minutos. */
export function minutos(tempo: string): number {
  const h = Number(tempo.match(/(\d+)\s*h/)?.[1] ?? 0);
  const m = Number(tempo.match(/(\d+)\s*min/)?.[1] ?? 0);
  return h * 60 + m;
}

export function formatarDuracao(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const r = min % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

/** Vizinhos na ordem de leitura da trilha ou do projeto. */
export function vizinhos(page: Page): {anterior?: Page; proxima?: Page} {
  const lista = page.area === 'aulas' ? getTrilha(page.grupo)?.pages : getProjeto(page.grupo)?.pages;
  if (!lista) return {};
  const i = lista.findIndex((p) => p.slug === page.slug);
  return {anterior: lista[i - 1], proxima: lista[i + 1]};
}
