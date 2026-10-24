import Link from 'next/link';
import {ArrowLeft, ArrowRight, Clock3, PencilLine} from 'lucide-react';
import {compileMdx} from '@/lib/mdx';
import {getProjeto, getTrilha, SECOES, vizinhos, type Page} from '@/lib/content';
import {navProjeto, navTrilha} from '@/lib/nav';
import {mdxComponents} from '@/components/mdx';
import {Sidebar, MobileNav} from '@/components/site/Sidebar';
import {Toc} from '@/components/site/Toc';
import {Breadcrumbs} from '@/components/site/ui';
import {ScrollProgress} from '@/components/motion/ScrollProgress';
import path from 'node:path';

const REPO = 'https://github.com/inteliacademyclub/docs/blob/main/autoestudos';

export async function DocPage({page}: {page: Page}) {
  const {Content, toc} = await compileMdx(page.body);
  const {anterior, proxima} = vizinhos(page);
  const nav = page.area === 'aulas' ? navTrilha(page.grupo)! : navProjeto(page.grupo)!;

  const trilha = page.area === 'aulas' ? getTrilha(page.grupo) : undefined;
  const projeto = page.area === 'projetos' ? getProjeto(page.grupo) : undefined;
  const modulo = trilha?.modulos.find((m) => m.slug === page.modulo);

  const migalhas =
    page.area === 'aulas'
      ? [
          {label: 'Aulas', href: '/aulas/'},
          {label: trilha!.title, href: `/aulas/${trilha!.slug}/`},
          ...(modulo ? [{label: `Módulo ${modulo.n}`, href: `/aulas/${trilha!.slug}/${modulo.slug}/`}] : []),
        ]
      : [
          {label: 'Projetos', href: '/projetos/'},
          {label: projeto!.nome, href: `/projetos/${projeto!.slug}/`},
          {label: SECOES.find((s) => s.id === (page.secao ?? 'guias'))!.label},
        ];

  const lista = trilha ? (modulo ? modulo.pages : trilha.pages) : undefined;
  const posicao = lista ? lista.findIndex((p) => p.slug === page.slug) + 1 : 0;
  const contexto = trilha ? trilha.title : projeto!.nome;
  const arquivo = path.relative(process.cwd(), page.file).replace(/\\/g, '/');

  return (
    <>
      <ScrollProgress className="fixed inset-x-0 top-[var(--header-h)] z-40 bg-brand-ink" />
      <div className="mx-auto flex max-w-[1400px] px-4 sm:px-6">
        <Sidebar nav={nav} />
        <main className="min-w-0 flex-1 pb-8 pt-6 lg:ps-10 lg:pt-12 xl:pe-10">
          <MobileNav nav={nav} atual={page.label} />
          <article className="mx-auto mt-8 max-w-[720px] lg:mt-0" data-pagefind-body>
            <span hidden data-pagefind-meta={`contexto:${contexto}`} />
            <span hidden data-pagefind-filter={`area:${page.area === 'aulas' ? 'Aulas' : 'Projetos'}`} />
            <Breadcrumbs itens={migalhas} />
            <h1 data-pagefind-meta="title" className="text-[32px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[40px]">
              {page.title}
            </h1>
            {page.description && <p className="mt-4 text-[18px] leading-[1.6] text-muted">{page.description}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-muted" data-pagefind-ignore>
              {posicao > 0 && (
                <span className="tabular">
                  Aula {String(posicao).padStart(2, '0')} de {String(lista!.length).padStart(2, '0')}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5" strokeWidth={1.5} aria-hidden />
                {page.tempo}
              </span>
              {page.semana && <span>Semana {page.semana} do projeto</span>}
              {page.opcional && <span className="rounded-full bg-warn-soft px-2 py-0.5 text-warn">Opcional</span>}
            </div>
            <div className="prose mt-10">
              <Content components={mdxComponents} />
            </div>
          </article>

          <div className="mx-auto mt-16 max-w-[720px]" data-pagefind-ignore>
            {(anterior || proxima) && (
              <nav aria-label="Continuar" className="grid gap-3 sm:grid-cols-2">
                {anterior ? (
                  <Link href={`/${anterior.slug}/`} className="press group rounded-2xl bg-surface p-5 shadow-ring hover:shadow-ring-hover">
                    <span className="flex items-center gap-1.5 font-mono text-[12px] text-subtle">
                      <ArrowLeft className="size-3.5 transition-[translate] duration-150 group-hover:-translate-x-0.5" strokeWidth={1.5} aria-hidden /> Anterior
                    </span>
                    <span className="mt-2 block text-[15px] font-medium leading-snug text-ink">{anterior.label}</span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {proxima && (
                  <Link href={`/${proxima.slug}/`} className="press group rounded-2xl bg-surface p-5 text-end shadow-ring hover:shadow-ring-hover">
                    <span className="flex items-center justify-end gap-1.5 font-mono text-[12px] text-subtle">
                      Próxima <ArrowRight className="size-3.5 transition-[translate] duration-150 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="mt-2 block text-[15px] font-medium leading-snug text-ink">{proxima.label}</span>
                  </Link>
                )}
              </nav>
            )}
            <a
              href={`${REPO}/${arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors duration-150 hover:text-ink"
            >
              <PencilLine className="size-3.5" strokeWidth={1.5} aria-hidden />
              Sugerir uma correção nesta página
            </a>
          </div>
        </main>
        <aside className="sticky top-[var(--header-h)] hidden h-[calc(100dvh-var(--header-h))] w-[220px] shrink-0 overflow-y-auto py-12 xl:block [scrollbar-width:none]">
          <Toc itens={toc} />
        </aside>
      </div>
    </>
  );
}
