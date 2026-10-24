import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getPage, getPages, getProjeto, getProjetos, getTrilha, getTrilhas} from '@/lib/content';
import {DocPage} from '@/components/views/DocPage';
import {ModuloView, TrilhaView} from '@/components/views/Trilha';
import {ProjetoView} from '@/components/views/Projeto';
import {Redirecionar} from '@/components/site/Redirecionar';

export const dynamicParams = false;

// URLs antigas que mudaram de lugar
const REDIRECTS: Record<string, string> = {
  intro: '/',
  'projetos/openrouter': '/aulas/guias/openrouter/',
};

type Rota =
  | {tipo: 'trilha'; slug: string}
  | {tipo: 'modulo'; trilha: string; modulo: string}
  | {tipo: 'projeto'; slug: string}
  | {tipo: 'pagina'; slug: string}
  | {tipo: 'redirect'; para: string};

function rotas(): Map<string, Rota> {
  const m = new Map<string, Rota>();
  for (const t of getTrilhas()) {
    m.set(`aulas/${t.slug}`, {tipo: 'trilha', slug: t.slug});
    for (const mod of t.modulos) m.set(`aulas/${t.slug}/${mod.slug}`, {tipo: 'modulo', trilha: t.slug, modulo: mod.slug});
  }
  for (const p of getProjetos()) m.set(`projetos/${p.slug}`, {tipo: 'projeto', slug: p.slug});
  for (const p of getPages()) m.set(p.slug, {tipo: 'pagina', slug: p.slug});
  for (const [de, para] of Object.entries(REDIRECTS)) m.set(de, {tipo: 'redirect', para});
  return m;
}

export function generateStaticParams() {
  return [...rotas().keys()].map((k) => ({slug: k.split('/')}));
}

type Props = {params: Promise<{slug: string[]}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const r = rotas().get((await params).slug.join('/'));
  if (!r) return {};
  if (r.tipo === 'trilha') {
    const t = getTrilha(r.slug)!;
    return {title: t.title, description: t.description};
  }
  if (r.tipo === 'modulo') return {title: getTrilha(r.trilha)!.modulos.find((m) => m.slug === r.modulo)!.title};
  if (r.tipo === 'projeto') {
    const p = getProjeto(r.slug)!;
    return {title: `${p.nome}: ${p.titulo}`, description: p.resumo};
  }
  if (r.tipo === 'pagina') {
    const p = getPage(r.slug)!;
    return {title: p.title, description: p.description};
  }
  return {robots: {index: false}};
}

export default async function Pagina({params}: Props) {
  const r = rotas().get((await params).slug.join('/'));
  if (!r) notFound();
  switch (r.tipo) {
    case 'trilha':
      return <TrilhaView trilha={getTrilha(r.slug)!} />;
    case 'modulo': {
      const t = getTrilha(r.trilha)!;
      return <ModuloView trilha={t} modulo={t.modulos.find((m) => m.slug === r.modulo)!} />;
    }
    case 'projeto':
      return <ProjetoView projeto={getProjeto(r.slug)!} />;
    case 'pagina':
      return <DocPage page={getPage(r.slug)!} />;
    case 'redirect':
      return <Redirecionar para={r.para} />;
  }
}
