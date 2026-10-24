import Link from 'next/link';
import type {ReactNode} from 'react';
import {ArrowRight, ChevronRight} from 'lucide-react';
import {cn} from '@/lib/base';
import type {Projeto} from '@/lib/content';

export function Breadcrumbs({itens}: {itens: {label: string; href?: string}[]}) {
  return (
    <nav aria-label="Você está em" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-[12px] text-subtle">
        {itens.map((i, k) => (
          <li key={k} className="flex items-center gap-1">
            {k > 0 && <ChevronRight className="size-3 shrink-0" strokeWidth={1.5} aria-hidden />}
            {i.href ? (
              <Link href={i.href} className="rounded transition-colors duration-150 hover:text-ink">
                {i.label}
              </Link>
            ) : (
              <span className="text-muted">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Botao({href, children, variante = 'primario', className}: {href: string; children: ReactNode; variante?: 'primario' | 'secundario'; className?: string}) {
  return (
    <Link
      href={href}
      className={cn(
        'press group inline-flex h-10 items-center gap-2 rounded-full px-4.5 text-[14px] font-medium',
        variante === 'primario' ? 'bg-ink text-bg hover:bg-ink-2' : 'bg-surface text-ink shadow-ring hover:shadow-ring-hover',
        className,
      )}
    >
      {children}
      {variante === 'primario' && <ArrowRight className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />}
    </Link>
  );
}

const STATUS = {
  'em-andamento': {label: 'Em andamento', pill: 'bg-brand-soft text-brand-ink', dot: 'animate-pulse bg-brand-ink'},
  'em-breve': {label: 'Em breve', pill: 'bg-brand-soft text-brand-ink', dot: 'ring-[1.5px] ring-inset ring-brand-ink'},
  concluido: {label: 'Concluído', pill: 'bg-surface-2 text-muted', dot: 'bg-subtle'},
} as const;

export function Status({status}: {status: Projeto['status']}) {
  const s = STATUS[status];
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-sans text-[12px] font-medium normal-case tracking-normal', s.pill)}>
      <span className={cn('size-1.5 rounded-full', s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}

/** Cabeçalho das páginas de índice (trilha, módulo, projeto). */
export function Cabecalho({eyebrow, titulo, children}: {eyebrow?: ReactNode; titulo: string; children?: ReactNode}) {
  return (
    <header className="max-w-[760px]">
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      <h1 className="text-[40px] font-medium leading-[1.06] tracking-[-0.035em] text-ink sm:text-[52px]">{titulo}</h1>
      {children}
    </header>
  );
}
