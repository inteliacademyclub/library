// Índice leve (títulos e rotas) entregue ao cliente para a busca rápida.
import {getProjetos, getTrilhas} from './content';

export type Entrada = {
  titulo: string;
  url: string;
  tipo: 'Trilha' | 'Módulo' | 'Aula' | 'Projeto' | 'TAPI' | 'Entregas' | 'Guia';
  contexto: string;
};

export function catalogo(): Entrada[] {
  const out: Entrada[] = [];
  for (const t of getTrilhas()) {
    out.push({titulo: t.title, url: `/aulas/${t.slug}/`, tipo: 'Trilha', contexto: `${t.pages.length} aulas`});
    for (const m of t.modulos) out.push({titulo: m.title, url: `/aulas/${t.slug}/${m.slug}/`, tipo: 'Módulo', contexto: t.title});
    for (const p of t.pages) out.push({titulo: p.label, url: `/${p.slug}/`, tipo: 'Aula', contexto: t.title});
  }
  for (const pr of getProjetos()) {
    out.push({titulo: pr.titulo, url: `/projetos/${pr.slug}/`, tipo: 'Projeto', contexto: pr.parceiro});
    for (const p of pr.pages) {
      const tipo = p.secao === 'tapi' ? 'TAPI' : p.secao === 'entregas' ? 'Entregas' : 'Guia';
      out.push({titulo: p.label, url: `/${p.slug}/`, tipo, contexto: pr.nome});
    }
  }
  return out;
}
