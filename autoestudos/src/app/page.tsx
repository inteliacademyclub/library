import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {getProjetos, getTrilhas} from '@/lib/content';
import {SearchTrigger} from '@/components/site/Search';
import {CartaoTrilha, LinhaProjeto} from '@/components/views/Indices';
import {CutReveal} from '@/components/motion/CutReveal';
import {Reveal} from '@/components/motion/Reveal';
import {Destaque, type ItemDestaque} from '@/components/site/Destaque';

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
  // destaque: todos os projetos em andamento, alternando num carrossel; sem nenhum, o próximo a começar
  const emAndamento = projetos.filter((p) => p.status === 'em-andamento');
  const proximo = projetos.find((p) => p.status === 'em-breve');
  const ativos = emAndamento.length ? emAndamento : proximo ? [proximo] : [];
  const aulas = trilhas.reduce((s, t) => s + t.pages.length, 0);
  const destaques: ItemDestaque[] = ativos.map((p) => ({
    slug: p.slug,
    parceiro: p.parceiro,
    periodo: p.periodo,
    titulo: p.titulo,
    resumo: p.resumo,
    status: p.status,
    tapi: p.pages.find((x) => x.secao === 'tapi')?.slug,
    trilha: p.trilha ? trilhas.find((t) => `/aulas/${t.slug}` === p.trilha)?.slug : undefined,
  }));

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

      {destaques.length > 0 && (
        <Reveal>
          <Destaque itens={destaques} />
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
          {projetos.map((p) => (
            <LinhaProjeto key={p.slug} p={p} />
          ))}
        </Reveal>
      </section>
    </main>
  );
}
