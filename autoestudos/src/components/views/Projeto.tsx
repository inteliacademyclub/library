import Link from 'next/link';
import {ArrowRight, ArrowUpRight, FileText} from 'lucide-react';
import {getTrilhas, SECOES, type Page, type Projeto} from '@/lib/content';
import {Botao, Breadcrumbs, Cabecalho, Status} from '@/components/site/ui';
import {Reveal} from '@/components/motion/Reveal';

function CartaoPagina({p}: {p: Page}) {
  return (
    <Link href={`/${p.slug}/`} className="press group flex h-full flex-col rounded-2xl bg-surface p-5 shadow-ring hover:shadow-ring-hover">
      <span className="flex items-start justify-between gap-3">
        <span className="text-[15.5px] font-medium leading-snug text-ink">{p.label}</span>
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-subtle transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.5} aria-hidden />
      </span>
      {p.description && <span className="mt-2 line-clamp-3 text-[14px] leading-6 text-muted">{p.description}</span>}
      <span className="mt-auto pt-4 font-mono text-[12px] text-subtle">{p.subgrupo ? `${p.subgrupo} · ` : ''}{p.tempo} de leitura</span>
    </Link>
  );
}

export function ProjetoView({projeto}: {projeto: Projeto}) {
  const tapi = projeto.pages.find((p) => p.secao === 'tapi');
  const trilha = projeto.trilha ? getTrilhas().find((t) => `/aulas/${t.slug}` === projeto.trilha) : undefined;
  const secoes = SECOES.filter((s) => s.id !== 'tapi')
    .map((s) => ({...s, pages: projeto.pages.filter((p) => (p.secao ?? 'guias') === s.id)}))
    .filter((s) => s.pages.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <Breadcrumbs itens={[{label: 'Projetos', href: '/projetos/'}, {label: projeto.nome}]} />
      <Cabecalho
        eyebrow={
          <span className="flex flex-wrap items-center gap-3 normal-case tracking-normal">
            <Status status={projeto.status} />
            <span className="uppercase tracking-[0.02em]">
              {projeto.parceiro} · {projeto.periodo}
            </span>
          </span>
        }
        titulo={projeto.titulo}
      >
        <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.6] text-muted">{projeto.resumo}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {tapi && <Botao href={`/${tapi.slug}/`}>Ler o TAPI</Botao>}
          {trilha && (
            <Botao href={`/aulas/${trilha.slug}/`} variante="secundario">
              Trilha: {trilha.title} <ArrowUpRight className="size-4 text-muted" strokeWidth={1.5} aria-hidden />
            </Botao>
          )}
        </div>
      </Cabecalho>

      {tapi && (
        <Reveal className="mt-16">
          <Link href={`/${tapi.slug}/`} className="press group grid gap-6 rounded-3xl bg-surface p-6 shadow-ring hover:shadow-ring-hover sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <span className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand-ink">
                  <FileText className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="eyebrow">TAPI · Termo de abertura</span>
              </span>
              <span className="mt-5 block max-w-[30ch] text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">{tapi.title}</span>
              <span className="mt-3 block max-w-[64ch] text-[15px] leading-7 text-muted">
                {tapi.description ?? 'O problema, o objetivo, o escopo e os critérios de avaliação do projeto, como acordados com o parceiro.'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-muted transition-colors duration-150 group-hover:text-ink">
              {tapi.tempo} de leitura <ArrowRight className="size-3.5 transition-[translate] duration-150 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
            </span>
          </Link>
        </Reveal>
      )}

      {secoes.map((s) => (
        <Reveal key={s.id} className="mt-20">
          <section aria-labelledby={`s-${s.id}`}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`s-${s.id}`} className="text-[24px] font-medium tracking-[-0.02em] text-ink">
                {s.label}
              </h2>
              <p className="text-[14px] text-muted">{s.descricao}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.pages.map((p) => (
                <CartaoPagina key={p.slug} p={p} />
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </main>
  );
}
