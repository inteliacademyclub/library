import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {formatarDuracao, getProjetos, getTrilhas, minutos, type Modulo, type Page, type Trilha} from '@/lib/content';
import {Botao, Breadcrumbs, Cabecalho} from '@/components/site/ui';
import {Reveal} from '@/components/motion/Reveal';

const duracao = (pages: Page[]) => formatarDuracao(pages.reduce((s, p) => s + minutos(p.tempo), 0));

function Aulas({pages, inicio = 0}: {pages: Page[]; inicio?: number}) {
  return (
    <ol className="divide-y divide-[var(--line)]">
      {pages.map((p, i) => (
        <li key={p.slug}>
          <Link href={`/${p.slug}/`} className="group -mx-3 flex items-baseline gap-4 rounded-xl px-3 py-3.5 transition-colors duration-150 ease-out hover:bg-surface">
            <span className="w-6 shrink-0 font-mono text-[12px] text-subtle tabular transition-colors duration-150 group-hover:text-brand-ink">
              {String(inicio + i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-medium leading-snug text-ink">{p.label}</span>
              {p.description && <span className="mt-1 line-clamp-2 block text-[14px] leading-6 text-muted">{p.description}</span>}
            </span>
            <span className="hidden shrink-0 items-center gap-2 font-mono text-[12px] text-subtle sm:flex">
              {p.opcional && <span className="rounded-full bg-warn-soft px-2 py-0.5 text-warn">opcional</span>}
              {p.tempo}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function BlocoModulo({trilha, m}: {trilha: Trilha; m: Modulo}) {
  const semana = m.pages.find((p) => p.semana)?.semana;
  return (
    <section className="grid gap-6 py-12 md:grid-cols-[260px_1fr] md:gap-12" aria-labelledby={`m-${m.slug}`}>
      <div className="md:sticky md:top-[calc(var(--header-h)+32px)] md:self-start">
        <div className="eyebrow">Módulo {m.n}</div>
        <h2 id={`m-${m.slug}`} className="mt-2 text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">
          <Link href={`/aulas/${trilha.slug}/${m.slug}/`} className="transition-colors duration-150 hover:text-brand-ink">
            {m.title}
          </Link>
        </h2>
        <p className="mt-3 font-mono text-[12px] text-muted">
          {m.pages.length} aulas · {duracao(m.pages)}
          {semana && <span className="block">Semana {semana} do projeto</span>}
        </p>
      </div>
      <Aulas pages={m.pages} />
    </section>
  );
}

export function TrilhaView({trilha}: {trilha: Trilha}) {
  const n = getTrilhas().findIndex((t) => t.slug === trilha.slug) + 1;
  const projeto = getProjetos().find((p) => p.trilha === `/aulas/${trilha.slug}`);
  const soltas = trilha.pages.filter((p) => !p.modulo);
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <Breadcrumbs itens={[{label: 'Aulas', href: '/aulas/'}, {label: trilha.title}]} />
      <Cabecalho eyebrow={`Trilha ${String(n).padStart(2, '0')}`} titulo={trilha.title}>
        <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.6] text-muted">{trilha.description}</p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            ['Aulas', trilha.pages.length],
            ...(trilha.modulos.length ? [['Módulos', trilha.modulos.length]] : []),
            ['Duração', duracao(trilha.pages)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow !text-[11px]">{k}</dt>
              <dd className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-ink tabular">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          {trilha.pages[0] && <Botao href={`/${trilha.pages[0].slug}/`}>Começar pela aula 1</Botao>}
          {projeto && (
            <Botao href={`/projetos/${projeto.slug}/`} variante="secundario">
              Usada no projeto {projeto.parceiro} <ArrowUpRight className="size-4 text-muted" strokeWidth={1.5} aria-hidden />
            </Botao>
          )}
        </div>
      </Cabecalho>

      <Reveal className="mt-16">
        {soltas.length > 0 && (
          <section className="max-w-[820px] py-4">
            <Aulas pages={soltas} />
          </section>
        )}
        <div className="divide-y divide-[var(--line)]">
          {trilha.modulos.map((m) => (
            <BlocoModulo key={m.slug} trilha={trilha} m={m} />
          ))}
        </div>
      </Reveal>
    </main>
  );
}

export function ModuloView({trilha, modulo}: {trilha: Trilha; modulo: Modulo}) {
  const i = trilha.modulos.findIndex((m) => m.slug === modulo.slug);
  const prox = trilha.modulos[i + 1];
  const semana = modulo.pages.find((p) => p.semana)?.semana;
  return (
    <main className="mx-auto max-w-[880px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <Breadcrumbs itens={[{label: 'Aulas', href: '/aulas/'}, {label: trilha.title, href: `/aulas/${trilha.slug}/`}, {label: `Módulo ${modulo.n}`}]} />
      <Cabecalho eyebrow={`Módulo ${modulo.n} de ${trilha.modulos.length}`} titulo={modulo.title}>
        <p className="mt-5 font-mono text-[13px] text-muted">
          {modulo.pages.length} aulas · {duracao(modulo.pages)}
          {semana && ` · semana ${semana} do projeto`}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {modulo.pages[0] && <Botao href={`/${modulo.pages[0].slug}/`}>Começar o módulo</Botao>}
          <Botao href={`/aulas/${trilha.slug}/`} variante="secundario">
            Ver a trilha inteira
          </Botao>
        </div>
      </Cabecalho>
      <div className="mt-14">
        <Aulas pages={modulo.pages} />
      </div>
      {prox && (
        <Link href={`/aulas/${trilha.slug}/${prox.slug}/`} className="press group mt-14 block rounded-2xl bg-surface p-6 shadow-ring hover:shadow-ring-hover">
          <span className="eyebrow !text-[11px]">Próximo módulo</span>
          <span className="mt-2 block text-[18px] font-medium tracking-[-0.01em] text-ink">
            {prox.n}. {prox.title}
          </span>
        </Link>
      )}
    </main>
  );
}
