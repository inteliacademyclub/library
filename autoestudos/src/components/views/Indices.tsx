import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {formatarDuracao, minutos, SECOES, type Projeto, type Trilha} from '@/lib/content';
import {Status} from '@/components/site/ui';
import {cn} from '@/lib/base';

export function CartaoTrilha({t, n, className}: {t: Trilha; n: number; className?: string}) {
  const total = formatarDuracao(t.pages.reduce((s, p) => s + minutos(p.tempo), 0));
  return (
    <Link href={`/aulas/${t.slug}/`} className={cn('press group flex h-full flex-col rounded-3xl bg-surface p-6 shadow-ring hover:shadow-ring-hover sm:p-7', className)}>
      <span className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-subtle tabular">{String(n).padStart(2, '0')}</span>
        <ArrowRight className="size-4 text-subtle transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="mt-10 block text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{t.title}</span>
      <span className="mt-2.5 line-clamp-3 block text-[14.5px] leading-6 text-muted">{t.description}</span>
      <span className="mt-auto flex flex-wrap gap-x-3 pt-6 font-mono text-[12px] text-subtle">
        <span>{t.pages.length} {t.pages.length === 1 ? 'aula' : 'aulas'}</span>
        {t.modulos.length > 0 && <span>{t.modulos.length} módulos</span>}
        <span>{total}</span>
      </span>
    </Link>
  );
}

export function LinhaProjeto({p}: {p: Projeto}) {
  const contagem = SECOES.map((s) => ({s, n: p.pages.filter((x) => (x.secao ?? 'guias') === s.id).length})).filter((x) => x.n);
  return (
    <Link href={`/projetos/${p.slug}/`} className="press group grid gap-4 rounded-3xl bg-surface p-6 shadow-ring hover:shadow-ring-hover sm:p-7 md:grid-cols-[1fr_auto] md:gap-10">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Status status={p.status} />
          <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-subtle">
            {p.parceiro} · {p.periodo}
          </span>
        </div>
        <span className="mt-4 block text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{p.titulo}</span>
        <span className="mt-2 block max-w-[68ch] text-[14.5px] leading-6 text-muted">{p.resumo}</span>
      </div>
      <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
        <ArrowRight className="hidden size-4 text-subtle transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-ink md:block" strokeWidth={1.5} aria-hidden />
        <ul className="flex gap-4 font-mono text-[12px] text-muted md:flex-col md:items-end md:gap-1">
          {contagem.map(({s, n}) => (
            <li key={s.id}>
              {s.id === 'tapi' ? 'TAPI' : `${s.label} · ${n}`}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
