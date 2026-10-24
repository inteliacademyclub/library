'use client';
import React from 'react';
import {Check} from 'lucide-react';
import {cn} from '@/lib/base';
import {inline} from './inline';
import {usePersistent} from './usePersistent';

type Item = {texto: React.ReactNode; detalhe?: React.ReactNode};

type Props = {
  /** Identificador único e estável: usado para salvar o progresso no navegador. */
  id: string;
  titulo?: string;
  itens: (Item | string)[];
};

/** Lista de verificação com progresso salvo no navegador. */
export default function Checklist({id, titulo, itens}: Props): React.ReactElement {
  const [feitos, setFeitos] = usePersistent<number[]>(`checklist:${id}`, []);
  const normal = itens.map((it) => (typeof it === 'string' ? {texto: it} : it));
  const pct = Math.round((feitos.length / normal.length) * 100);
  return (
    <section className="my-8 rounded-3xl bg-surface p-5 shadow-ring sm:p-6" aria-label={titulo ?? 'Checklist'}>
      <header className="flex items-baseline justify-between gap-3">
        <span className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{titulo ?? 'Checklist'}</span>
        <span className="font-mono text-[12px] text-muted tabular">
          {feitos.length}/{normal.length}
        </span>
      </header>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label="Itens concluídos"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out-soft" style={{width: `${pct}%`}} />
      </div>
      <ul className="m-0 mt-4 list-none space-y-1 p-0">
        {normal.map((it, i) => {
          const on = feitos.includes(i);
          return (
            <li key={i} className="p-0">
              <label className="-mx-2 flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-surface-2/60">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => setFeitos(on ? feitos.filter((x) => x !== i) : [...feitos, i])}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    'mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-[5px] transition-[background-color,box-shadow] duration-150 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-ink',
                    on ? 'bg-brand text-white' : 'bg-surface shadow-[inset_0_0_0_1.5px_var(--line-strong)]',
                  )}
                >
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className={cn('min-w-0 text-[15px] leading-[1.6] transition-colors duration-150', on ? 'text-muted' : 'text-ink-2')}>
                  {inline(it.texto)}
                  {it.detalhe && <small className="mt-0.5 block text-[13.5px] leading-[1.55] text-muted">{inline(it.detalhe)}</small>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
