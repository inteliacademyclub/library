import type {Metadata} from 'next';
import {getTrilhas} from '@/lib/content';
import {Cabecalho} from '@/components/site/ui';
import {CartaoTrilha} from '@/components/views/Indices';
import {Reveal} from '@/components/motion/Reveal';

export const metadata: Metadata = {title: 'Aulas', description: 'Trilhas de aulas da Liga Inteli Academy.'};

export default function Aulas() {
  const trilhas = getTrilhas();
  const total = trilhas.reduce((s, t) => s + t.pages.length, 0);
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <Cabecalho eyebrow={`${total} aulas em ${trilhas.length} trilhas`} titulo="Aulas">
        <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-muted">
          Cada trilha vai do conceito à prática, na ordem em que vale a pena estudar. Comece por qualquer uma: os pré-requisitos aparecem no início de cada aula.
        </p>
      </Cabecalho>
      <Reveal className="mt-14 grid gap-3 sm:grid-cols-2">
        {trilhas.map((t, i) => (
          <CartaoTrilha key={t.slug} t={t} n={i + 1} />
        ))}
      </Reveal>
    </main>
  );
}
