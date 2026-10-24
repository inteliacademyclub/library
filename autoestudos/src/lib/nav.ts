// Estrutura serializável da navegação lateral (trilha ou projeto).
import {getProjeto, getTrilha, SECOES, type Page} from './content';

export type NavItem = {label: string; href: string; tempo?: string; opcional?: boolean};
export type NavGrupo = {titulo?: string; n?: number; href?: string; itens: NavItem[]};
export type Nav = {tipo: 'trilha' | 'projeto'; titulo: string; href: string; grupos: NavGrupo[]};

const item = (p: Page): NavItem => ({label: p.label, href: `/${p.slug}/`, tempo: p.tempo, opcional: p.opcional});

export function navTrilha(slug: string): Nav | undefined {
  const t = getTrilha(slug);
  if (!t) return;
  const soltas = t.pages.filter((p) => !p.modulo);
  const grupos: NavGrupo[] = [];
  if (soltas.length) grupos.push({itens: soltas.map(item)});
  for (const m of t.modulos) grupos.push({titulo: m.title, n: m.n, href: `/aulas/${t.slug}/${m.slug}/`, itens: m.pages.map(item)});
  return {tipo: 'trilha', titulo: t.title, href: `/aulas/${t.slug}/`, grupos};
}

export function navProjeto(slug: string): Nav | undefined {
  const p = getProjeto(slug);
  if (!p) return;
  const grupos = SECOES.map((s) => ({titulo: s.label, itens: p.pages.filter((x) => (x.secao ?? 'guias') === s.id).map(item)})).filter((g) => g.itens.length);
  return {tipo: 'projeto', titulo: p.nome, href: `/projetos/${p.slug}/`, grupos};
}
