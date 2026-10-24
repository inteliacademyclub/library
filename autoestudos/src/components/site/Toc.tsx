'use client';
import {useEffect, useState} from 'react';
import type {TocItem} from '@/lib/remark';
import {cn} from '@/lib/base';

/** Sumário da página com destaque da seção visível. */
export function Toc({itens}: {itens: TocItem[]}) {
  const [ativo, setAtivo] = useState<string | undefined>(itens[0]?.id);

  useEffect(() => {
    const els = itens.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const atualizar = () => {
      const topo = 96;
      let atual = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - topo <= 0) atual = el.id;
        else break;
      }
      // no fim da página, o último título visível vence
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) atual = els[els.length - 1].id;
      setAtivo(atual);
    };
    atualizar();
    window.addEventListener('scroll', atualizar, {passive: true});
    return () => window.removeEventListener('scroll', atualizar);
  }, [itens]);

  if (itens.length < 2) return null;

  return (
    <nav aria-label="Nesta página" className="text-[13px]">
      <div className="eyebrow mb-3 !text-[11px]">Nesta página</div>
      <ul className="space-y-0.5">
        {itens.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={ativo === i.id ? 'location' : undefined}
              className={cn(
                'flex items-center gap-2 py-1 leading-[1.45] transition-colors duration-150 ease-out',
                i.depth === 3 && 'ps-3.5',
                ativo === i.id ? 'text-ink' : 'text-muted hover:text-ink',
              )}
            >
              <span
                aria-hidden
                className={cn('size-1 shrink-0 rounded-full transition-[background-color,scale] duration-150', ativo === i.id ? 'scale-100 bg-brand-ink' : 'scale-0 bg-transparent')}
              />
              <span className="min-w-0">{i.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
