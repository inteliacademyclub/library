'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useModal} from '@/lib/useModal';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronRight, PanelLeft, X} from 'lucide-react';
import type {Nav, NavGrupo} from '@/lib/nav';
import {cn} from '@/lib/base';

const igual = (a: string, b: string) => a.replace(/\/$/, '') === b.replace(/\/$/, '');

function Grupo({g, pathname, numerar}: {g: NavGrupo; pathname: string; numerar: boolean}) {
  const temAtivo = g.itens.some((i) => igual(i.href, pathname)) || (g.href ? igual(g.href, pathname) : false);
  const [aberto, setAberto] = useState(temAtivo || !g.titulo);
  useEffect(() => {
    if (temAtivo) setAberto(true);
  }, [temAtivo]);

  const lista = (
    <ul className="space-y-px">
      {g.itens.map((i, k) => {
        const ativo = igual(i.href, pathname);
        return (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={ativo ? 'page' : undefined}
              className={cn(
                'flex items-baseline gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] leading-[1.4] transition-colors duration-150 ease-out',
                ativo ? 'bg-surface-2 font-medium text-ink' : 'text-muted hover:bg-surface-2/60 hover:text-ink',
              )}
            >
              {numerar && <span className={cn('w-5 shrink-0 font-mono text-[11px] tabular', ativo ? 'text-brand-ink' : 'text-subtle')}>{String(k + 1).padStart(2, '0')}</span>}
              <span className="min-w-0 flex-1">{i.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  if (!g.titulo) return lista;

  return (
    <div>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-surface-2/60"
      >
        {g.n !== undefined && <span className="font-mono text-[11px] text-subtle tabular">M{g.n}</span>}
        <span className="flex-1">{g.titulo}</span>
        <ChevronRight className={cn('size-3.5 text-subtle transition-[rotate] duration-150 ease-out', aberto && 'rotate-90')} strokeWidth={2} aria-hidden />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.2,0,0,1)]', aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden" inert={!aberto}>
          <div className="pb-2 ps-1">{lista}</div>
        </div>
      </div>
    </div>
  );
}

export function SidebarContent({nav}: {nav: Nav}) {
  const pathname = usePathname();
  const numerar = nav.tipo === 'trilha';
  return (
    <nav aria-label={nav.tipo === 'trilha' ? 'Aulas da trilha' : 'Páginas do projeto'}>
      <Link href={nav.href} className="mb-4 block rounded-lg px-2.5 py-1.5 transition-colors duration-150 hover:bg-surface-2/60">
        <span className="eyebrow block !text-[11px]">{nav.tipo === 'trilha' ? 'Trilha' : 'Projeto'}</span>
        <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.01em] text-ink">{nav.titulo}</span>
      </Link>
      <div className="space-y-1">
        {nav.grupos.map((g, i) =>
          nav.tipo === 'projeto' && g.titulo ? (
            <div key={i} className="pb-3">
              <div className="eyebrow px-2.5 pb-1.5 pt-1 !text-[11px]">{g.titulo}</div>
              <Grupo g={{...g, titulo: undefined}} pathname={pathname} numerar={false} />
            </div>
          ) : (
            <Grupo key={i} g={g} pathname={pathname} numerar={numerar} />
          ),
        )}
      </div>
    </nav>
  );
}

export function Sidebar({nav}: {nav: Nav}) {
  return (
    <aside className="sticky top-[var(--header-h)] hidden h-[calc(100dvh-var(--header-h))] w-[272px] shrink-0 overflow-y-auto overscroll-contain py-8 pe-4 lg:block [scrollbar-width:thin]">
      <SidebarContent nav={nav} />
    </aside>
  );
}

/** Em telas pequenas: botão que abre a navegação numa gaveta. */
export function MobileNav({nav, atual}: {nav: Nav; atual?: string}) {
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();
  const gaveta = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  useEffect(() => setAberto(false), [pathname]);
  useModal(aberto, gaveta);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', esc);
    requestAnimationFrame(() => gaveta.current?.querySelector<HTMLElement>('[aria-current="page"], a')?.focus());
    return () => window.removeEventListener('keydown', esc);
  }, [aberto]);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="press flex h-10 w-full items-center gap-2.5 rounded-xl bg-surface px-3.5 text-start text-[14px] shadow-ring"
        aria-expanded={aberto}
      >
        <PanelLeft className="size-4 shrink-0 text-muted" strokeWidth={1.5} aria-hidden />
        <span className="truncate text-muted">
          {nav.titulo}
          {atual && <span className="text-ink"> / {atual}</span>}
        </span>
      </button>
      {montado &&
        createPortal(
          <AnimatePresence>
            {aberto && (
              <div ref={gaveta} className="fixed inset-0 z-[60]">
                <motion.div className="absolute inset-0 bg-black/40" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.15}} onClick={() => setAberto(false)} />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navegação"
                  className="absolute inset-y-0 start-0 w-[min(340px,88vw)] overflow-y-auto bg-bg px-4 pb-10 pt-4 shadow-pop"
                  initial={{x: '-100%'}}
                  animate={{x: 0}}
                  exit={{x: '-100%'}}
                  transition={{type: 'spring', duration: 0.3, bounce: 0}}
                >
                  <div className="mb-2 flex justify-end">
                    <button type="button" onClick={() => setAberto(false)} className="press grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Fechar navegação">
                      <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                  </div>
                  <SidebarContent nav={nav} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
