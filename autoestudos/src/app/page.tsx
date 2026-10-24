import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {getProjetos, getTrilhas} from '@/lib/content';
import {SearchTrigger} from '@/components/site/Search';
import {CartaoTrilha, LinhaProjeto} from '@/components/views/Indices';
import {CutReveal} from '@/components/motion/CutReveal';
import {Reveal} from '@/components/motion/Reveal';

function TituloSecao({titulo, href, rotulo}: {titulo: string; href: string; rotulo: string}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="text-[26px] font-medium tracking-[-0.025em] text-ink">{titulo}</h2>
      <Link href={href} className="group inline-flex items-center gap-1 text-[14px] text-muted transition-colors duration-150 hover:text-ink">
        {rotulo}
        <ArrowRight className="size-3.5 transition-[translate] duration-150 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
      </Link>
    </div>
  );
}

export default function Home() {
  const trilhas = getTrilhas();
  const projetos = getProjetos();
  // destaque: o projeto em andamento; sem um, o próximo a começar
  const ativo = projetos.find((p) => p.status === 'em-andamento') ?? projetos.find((p) => p.status === 'em-breve');
  const aulas = trilhas.reduce((s, t) => s + t.pages.length, 0);
  const tapi = ativo?.pages.find((p) => p.secao === 'tapi');
  const trilhaAtiva = ativo?.trilha ? trilhas.find((t) => `/aulas/${t.slug}` === ativo.trilha) : undefined;

  return (
    <main className="mx-auto max-w-[1120px] px-4 sm:px-6">
      <section className="pb-20 pt-16 sm:pb-28 sm:pt-28">
        <div className="eyebrow">Liga Inteli Academy · Biblioteca</div>
        <h1 className="mt-6 max-w-[15ch] text-[44px] font-medium leading-[1.02] tracking-[-0.04em] text-ink sm:text-[72px]">
          <CutReveal text="Tudo o que a liga estuda, num só lugar." />
        </h1>
        <div>
          <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.6] text-muted">
            Aulas organizadas em trilhas e, separado delas, o material de cada projeto: TAPI, entregas e guias.
          </p>
          <SearchTrigger grande className="mt-10" />
          <p className="mt-4 font-mono text-[12px] text-subtle">
            {aulas} aulas · {trilhas.length} trilhas · {projetos.length} projetos
          </p>
        </div>
      </section>

      {ativo && (
        <Reveal>
          <section aria-labelledby="ativo" className="relative overflow-hidden rounded-[28px] bg-[#3f01ff] p-7 text-white sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/14 px-2.5 text-[12px] font-medium">
                <span className={ativo.status === 'em-andamento' ? 'size-1.5 animate-pulse rounded-full bg-white' : 'size-1.5 rounded-full ring-[1.5px] ring-inset ring-white'} aria-hidden />
                {ativo.status === 'em-andamento' ? 'Projeto em andamento' : 'Próximo projeto'}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-white/70">
                {ativo.parceiro} · {ativo.periodo}
              </span>
            </div>
            <h2 id="ativo" className="mt-6 max-w-[22ch] text-[30px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
              {ativo.titulo}
            </h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-7 text-white/80">{ativo.resumo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/projetos/${ativo.slug}/`}
                className="press group inline-flex h-10 items-center gap-2 rounded-full bg-white px-4.5 text-[14px] font-medium text-[#17161c] hover:bg-white/90"
              >
                Abrir o projeto
                <ArrowRight className="size-4 transition-[translate] duration-150 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
              </Link>
              {tapi && (
                <Link
                  href={`/${tapi.slug}/`}
                  className="press inline-flex h-10 items-center rounded-full px-4.5 text-[14px] font-medium shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10"
                >
                  Ler o TAPI
                </Link>
              )}
              {trilhaAtiva && (
                <Link
                  href={`/aulas/${trilhaAtiva.slug}/`}
                  className="press inline-flex h-10 items-center rounded-full px-4.5 text-[14px] font-medium shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10"
                >
                  Trilha de estudos
                </Link>
              )}
            </div>
          </section>
        </Reveal>
      )}

      <section className="mt-28" aria-label="Trilhas">
        <TituloSecao titulo="Trilhas de aulas" href="/aulas/" rotulo="Todas as aulas" />
        <Reveal className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trilhas.map((t, i) => (
            <CartaoTrilha key={t.slug} t={t} n={i + 1} className={t.modulos.length ? 'lg:col-span-2' : ''} />
          ))}
        </Reveal>
      </section>

      <section className="mt-28" aria-label="Projetos">
        <TituloSecao titulo="Projetos" href="/projetos/" rotulo="Todos os projetos" />
        <Reveal className="space-y-3">
          {projetos
            .filter((p) => p !== ativo)
            .map((p) => (
              <LinhaProjeto key={p.slug} p={p} />
            ))}
        </Reveal>
      </section>
    </main>
  );
}
