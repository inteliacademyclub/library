import type {Metadata} from 'next';
import {getProjetos} from '@/lib/content';
import {Cabecalho} from '@/components/site/ui';
import {LinhaProjeto} from '@/components/views/Indices';
import {Reveal} from '@/components/motion/Reveal';

export const metadata: Metadata = {title: 'Projetos', description: 'Projetos da Liga Inteli Academy com parceiros: TAPI, entregas e guias.'};

export default function Projetos() {
  const projetos = getProjetos();
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <Cabecalho eyebrow={`${projetos.length} projetos com parceiros`} titulo="Projetos">
        <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-muted">
          Tudo o que um projeto exige, separado das aulas: o TAPI com o problema e o escopo, o que entregar e quando, e os guias feitos para aquele case.
        </p>
      </Cabecalho>
      <Reveal className="mt-14 space-y-3">
        {projetos.map((p) => (
          <LinhaProjeto key={p.slug} p={p} />
        ))}
      </Reveal>
    </main>
  );
}
