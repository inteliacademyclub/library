import React from 'react';
import Link from '@/components/site/DocLink';
import {cn} from '@/lib/base';

export const ETAPAS = [
  {id: 'dados', label: 'Dados'},
  {id: 'avaliacao', label: 'Avaliação'},
  {id: 'modelo', label: 'Modelo'},
  {id: 'multimodal', label: 'Multimodal'},
  {id: 'incerteza', label: 'Incerteza'},
  {id: 'explicacao', label: 'Explicação'},
  {id: 'agente', label: 'Agente'},
  {id: 'mcp', label: 'MCP'},
] as const;

export type Etapa = (typeof ETAPAS)[number]['id'];

type Prereq = string | {label: string; to: string};

type Props = {
  objetivos: string[];
  prerequisitos?: Prereq[];
  /** Ex.: "40 min" */
  tempo: string;
  /** Etapa(s) do pipeline do projeto em que a aula se encaixa. */
  etapa: Etapa | Etapa[];
  /** Semana do projeto (1–4) em que o conteúdo é necessário. */
  semana?: number | string;
  opcional?: boolean;
};

const lista = 'm-0 list-none space-y-2 p-0 text-[15px] leading-[1.6] text-ink-2';
const item = 'relative ps-4 before:absolute before:start-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-subtle';

/**
 * Cabeçalho padrão das aulas da trilha: objetivos, pré-requisitos e onde a aula
 * entra no pipeline. tempo, semana e opcional aparecem no cabeçalho da página.
 */
export default function LessonMeta({objetivos, prerequisitos, etapa}: Props): React.ReactElement {
  const ativas = new Set<string>(Array.isArray(etapa) ? etapa : [etapa]);
  return (
    <aside className="mb-10 rounded-3xl bg-surface p-5 shadow-ring sm:p-6" aria-label="Sobre esta aula">
      <div className="eyebrow mb-2.5 !text-[11px]">Etapa do pipeline</div>
      <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Etapas do pipeline do projeto">
        {ETAPAS.map((e, i) => {
          const on = ativas.has(e.id);
          return (
            <li
              key={e.id}
              aria-current={on ? 'step' : undefined}
              className={cn(
                'm-0 inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium',
                on ? 'bg-brand text-white' : 'bg-surface-2 text-muted',
              )}
            >
              <span className={cn('font-mono text-[10.5px] tabular', on ? 'text-white/70' : 'text-subtle')}>{i + 1}</span>
              {e.label}
            </li>
          );
        })}
      </ol>
      <div className="mt-6 grid gap-6 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-2.5 text-[14px] font-semibold text-ink">Ao final desta aula você vai conseguir</div>
          <ul className={lista}>
            {objetivos.map((o) => (
              <li key={o} className={item}>
                {o}
              </li>
            ))}
          </ul>
        </div>
        {prerequisitos && prerequisitos.length > 0 && (
          <div>
            <div className="mb-2.5 text-[14px] font-semibold text-ink">Antes, vale ter visto</div>
            <ul className={lista}>
              {prerequisitos.map((p) =>
                typeof p === 'string' ? (
                  <li key={p} className={item}>
                    {p}
                  </li>
                ) : (
                  <li key={p.to} className={item}>
                    <Link to={p.to}>{p.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
