'use client';
import React from 'react';
import {Check, ListChecks, RotateCcw, X} from 'lucide-react';
import {cn} from '@/lib/base';
import {inline} from './inline';
import {usePersistent} from './usePersistent';

export type Opcao = {
  texto: React.ReactNode;
  correta?: boolean;
  /** Por que essa alternativa está certa ou errada. Aparece depois da resposta. */
  explicacao?: React.ReactNode;
};

export type Pergunta = {
  pergunta: React.ReactNode;
  opcoes: Opcao[];
  /** Mais de uma alternativa correta (checkbox). */
  multipla?: boolean;
};

type Props = {
  /** Identificador único e estável (ex.: "m2-a3"): usado para salvar o progresso no navegador. */
  id: string;
  titulo?: string;
  perguntas: Pergunta[];
};

type Estado = Record<number, {sel: number[]; enviada: boolean}>;

function acertou(p: Pergunta, sel: number[]): boolean {
  const certas = p.opcoes.map((o, i) => (o.correta ? i : -1)).filter((i) => i >= 0);
  return certas.length === sel.length && certas.every((i) => sel.includes(i));
}

const pill = 'press inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[14px] font-medium';

function Questao({
  p,
  idx,
  qid,
  estado,
  onChange,
}: {
  p: Pergunta;
  idx: number;
  qid: string;
  estado: {sel: number[]; enviada: boolean};
  onChange: (next: {sel: number[]; enviada: boolean}) => void;
}) {
  const {sel, enviada} = estado;
  const ok = enviada && acertou(p, sel);
  const toggle = (i: number) => {
    if (enviada) return;
    if (p.multipla) onChange({sel: sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i], enviada});
    else onChange({sel: [i], enviada});
  };
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-4 flex gap-3 p-0 text-[16.5px] font-medium leading-[1.5] text-ink">
        <span className="mt-[3px] font-mono text-[12px] text-subtle tabular">{String(idx + 1).padStart(2, '0')}</span>
        <span>
          {inline(p.pergunta)}
          {p.multipla && !(typeof p.pergunta === 'string' && /marque/i.test(p.pergunta)) && (
            <span className="font-normal text-muted"> (marque todas as corretas)</span>
          )}
        </span>
      </legend>
      <div className="space-y-2">
        {p.opcoes.map((o, i) => {
          const marcada = sel.includes(i);
          const st = !enviada ? undefined : o.correta ? 'certa' : marcada ? 'errada' : undefined;
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl transition-[background-color,box-shadow] duration-150 ease-out',
                st === 'certa' ? 'bg-ok-soft' : st === 'errada' ? 'bg-bad-soft' : marcada ? 'bg-brand-soft shadow-[inset_0_0_0_1px_var(--brand-soft-2)]' : 'bg-surface-2/60',
                !enviada && !marcada && 'hover:bg-surface-2',
                enviada && !st && 'opacity-60',
              )}
            >
              <label className={cn('flex items-start gap-3 px-4 py-3 text-[15px] leading-[1.6] text-ink-2', !enviada && 'cursor-pointer')}>
                <input
                  type={p.multipla ? 'checkbox' : 'radio'}
                  name={`${qid}-${idx}`}
                  checked={marcada}
                  disabled={enviada}
                  onChange={() => toggle(i)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    'mt-[3px] grid size-[18px] shrink-0 place-items-center transition-[background-color,box-shadow] duration-150 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-ink',
                    p.multipla ? 'rounded-[5px]' : 'rounded-full',
                    st === 'certa'
                      ? 'bg-ok text-white'
                      : st === 'errada'
                        ? 'bg-bad text-white'
                        : marcada
                          ? 'bg-brand text-white'
                          : 'bg-surface shadow-[inset_0_0_0_1.5px_var(--line-strong)]',
                  )}
                >
                  {st === 'certa' ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : st === 'errada' ? (
                    <X className="size-3" strokeWidth={3} />
                  ) : marcada ? (
                    p.multipla ? <Check className="size-3" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="min-w-0">{inline(o.texto)}</span>
              </label>
              {enviada && (marcada || o.correta) && o.explicacao && (
                <div className="-mt-1 px-4 pb-3 ps-[46px] text-[14px] leading-[1.6] text-muted">{inline(o.explicacao)}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!enviada ? (
          <button
            type="button"
            className={cn(pill, 'bg-ink text-bg hover:bg-ink-2 disabled:pointer-events-none disabled:opacity-35')}
            disabled={sel.length === 0}
            onClick={() => onChange({sel, enviada: true})}
          >
            Conferir
          </button>
        ) : (
          <>
            <span role="status" className={cn('inline-flex items-center gap-1.5 text-[14px] font-medium', ok ? 'text-ok' : 'text-bad')}>
              {ok ? <Check className="size-4" strokeWidth={2} aria-hidden /> : <X className="size-4" strokeWidth={2} aria-hidden />}
              {ok ? 'Correto' : 'Ainda não'}
            </span>
            <button type="button" className={cn(pill, 'bg-surface text-ink shadow-ring hover:shadow-ring-hover')} onClick={() => onChange({sel: [], enviada: false})}>
              Tentar de novo
            </button>
          </>
        )}
      </div>
    </fieldset>
  );
}

/** Checkpoint de fim de aula. O progresso fica salvo no navegador do aluno. */
export default function Quiz({id, titulo = 'Checkpoint', perguntas}: Props): React.ReactElement {
  const [estado, setEstado, reset] = usePersistent<Estado>(`quiz:${id}`, {});
  const enviadas = perguntas.filter((_, i) => estado[i]?.enviada).length;
  const certas = perguntas.filter((p, i) => estado[i]?.enviada && acertou(p, estado[i].sel)).length;
  return (
    <section className="my-10 rounded-3xl bg-surface p-5 shadow-ring sm:p-7" aria-label={titulo}>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand-ink">
            <ListChecks className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{titulo}</span>
        </span>
        <span className="flex items-center gap-3 font-mono text-[12px] text-muted tabular">
          {enviadas === 0 ? `${perguntas.length} perguntas` : `${certas}/${perguntas.length} corretas`}
          {enviadas > 0 && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-md text-muted transition-colors duration-150 hover:text-ink">
              <RotateCcw className="size-3" strokeWidth={1.75} aria-hidden /> Recomeçar
            </button>
          )}
        </span>
      </header>
      {enviadas > 0 && (
        <div className="-mt-4 mb-7 flex gap-1" aria-hidden>
          {perguntas.map((p, i) => (
            <span
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-200',
                !estado[i]?.enviada ? 'bg-surface-2' : acertou(p, estado[i].sel) ? 'bg-ok' : 'bg-bad',
              )}
            />
          ))}
        </div>
      )}
      <div className="space-y-9">
        {perguntas.map((p, i) => (
          <Questao
            key={i}
            p={p}
            idx={i}
            qid={id}
            estado={estado[i] ?? {sel: [], enviada: false}}
            onChange={(next) => setEstado({...estado, [i]: next})}
          />
        ))}
      </div>
    </section>
  );
}
