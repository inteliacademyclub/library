'use client';
import {AnimatePresence, motion} from 'motion/react';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import {CornerDownLeft, FileText, FolderKanban, Library, Search as SearchIcon} from 'lucide-react';
import type {Entrada} from '@/lib/catalogo';
import {BASE, cn} from '@/lib/base';
import {useModal} from '@/lib/useModal';

const ABRIR = 'autoestudos:abrir-busca';
export const abrirBusca = () => window.dispatchEvent(new Event(ABRIR));

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

type Resultado = {url: string; titulo: string; detalhe: string; tipo: string; html?: string};

type PagefindResult = {data: () => Promise<{url: string; excerpt: string; meta: {title?: string; contexto?: string}}>};
type Pagefind = {
  options: (o: Record<string, unknown>) => Promise<void>;
  debouncedSearch: (q: string, o?: unknown, ms?: number) => Promise<{results: PagefindResult[]} | null>;
};

let pagefindPromise: Promise<Pagefind | null> | null = null;
function carregarPagefind(): Promise<Pagefind | null> {
  // import dinâmico fora do bundler: o arquivo só existe depois do build
  pagefindPromise ??= (new Function('u', 'return import(u)')(`${BASE}/pagefind/pagefind.js`) as Promise<Pagefind>)
    .then(async (pf) => {
      await pf.options({baseUrl: `${BASE}/`, excerptLength: 22});
      return pf;
    })
    .catch(() => null);
  return pagefindPromise;
}

function iconeDe(tipo: string) {
  if (tipo === 'Trilha' || tipo === 'Módulo') return Library;
  if (tipo === 'Projeto') return FolderKanban;
  return FileText;
}

export function SearchDialog({entradas}: {entradas: Entrada[]}) {
  const [aberto, setAberto] = useState(false);
  const [q, setQ] = useState('');
  const [ativo, setAtivo] = useState(0);
  const [texto, setTexto] = useState<Resultado[]>([]);
  const [semIndice, setSemIndice] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const uid = useId();

  useEffect(() => {
    const abrir = () => setAberto(true);
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando = alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !digitando)) {
        e.preventDefault();
        setAberto((v) => !v);
      }
    };
    window.addEventListener(ABRIR, abrir);
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener(ABRIR, abrir);
      window.removeEventListener('keydown', tecla);
    };
  }, []);

  useModal(aberto, painel);
  useEffect(() => {
    if (aberto) carregarPagefind().then((pf) => setSemIndice(!pf));
  }, [aberto]);

  const rapidos: Resultado[] = useMemo(() => {
    const termos = norm(q).split(/\s+/).filter(Boolean);
    if (!termos.length) {
      return entradas.filter((e) => e.tipo === 'Trilha' || e.tipo === 'Projeto').map((e) => ({url: e.url, titulo: e.titulo, detalhe: e.contexto, tipo: e.tipo}));
    }
    return entradas
      .map((e) => {
        const alvo = norm(`${e.titulo} ${e.contexto}`);
        const titulo = norm(e.titulo);
        if (!termos.every((t) => alvo.includes(t))) return null;
        const pontos = termos.reduce((s, t) => s + (titulo.startsWith(t) ? 3 : titulo.includes(t) ? 2 : 1), 0) + (e.tipo === 'Trilha' || e.tipo === 'Projeto' ? 1 : 0);
        return {e, pontos};
      })
      .filter((x): x is {e: Entrada; pontos: number} => x !== null)
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, 6)
      .map(({e}) => ({url: e.url, titulo: e.titulo, detalhe: e.contexto, tipo: e.tipo}));
  }, [q, entradas]);

  useEffect(() => {
    let cancelado = false;
    if (!q.trim()) {
      setTexto([]);
      return;
    }
    setBuscando(true);
    carregarPagefind().then(async (pf) => {
      if (!pf) {
        setBuscando(false);
        return;
      }
      const busca = await pf.debouncedSearch(q, {}, 180);
      if (!busca || cancelado) return;
      const dados = await Promise.all(busca.results.slice(0, 6).map((r) => r.data()));
      if (cancelado) return;
      setTexto(
        dados.map((d) => ({
          url: d.url.startsWith(BASE) ? d.url.slice(BASE.length) : d.url,
          titulo: d.meta.title ?? d.url,
          detalhe: d.meta.contexto ?? '',
          tipo: 'Trecho',
          html: d.excerpt,
        })),
      );
      setBuscando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [q]);

  const todos = useMemo(() => {
    const vistos = new Set(rapidos.map((r) => r.url));
    return [...rapidos, ...texto.filter((t) => !vistos.has(t.url))];
  }, [rapidos, texto]);

  useEffect(() => setAtivo(0), [q]);

  const fechar = useCallback(() => {
    setAberto(false);
    setQ('');
  }, []);

  const ir = useCallback(
    (r: Resultado) => {
      fechar();
      router.push(r.url);
    },
    [fechar, router],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAtivo((a) => Math.min(a + 1, todos.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAtivo((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && todos[ativo]) {
      e.preventDefault();
      ir(todos[ativo]);
    } else if (e.key === 'Escape') {
      fechar();
    } else if (e.key === 'Tab') {
      // o campo é o único elemento focável do diálogo
      e.preventDefault();
    }
  };

  useEffect(() => {
    lista.current?.querySelector(`[data-idx="${ativo}"]`)?.scrollIntoView({block: 'nearest'});
  }, [ativo]);

  const grupos: {titulo: string; itens: Resultado[]; offset: number}[] = [];
  const nRapidos = rapidos.length;
  if (nRapidos) grupos.push({titulo: q ? 'Páginas' : 'Comece por aqui', itens: rapidos, offset: 0});
  const extras = todos.slice(nRapidos);
  if (extras.length) grupos.push({titulo: 'No conteúdo', itens: extras, offset: nRapidos});

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.15, ease: 'easeOut'}}
        >
          <div className="absolute inset-0 bg-[oklch(0.2_0.01_280/0.28)] backdrop-blur-[2px] dark:bg-black/60" onClick={fechar} aria-hidden />
          <motion.div
            ref={painel}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar na biblioteca"
            className="relative w-full max-w-[620px] overflow-hidden rounded-2xl bg-surface shadow-pop"
            initial={{opacity: 0, scale: 0.98, y: -6}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.98, y: -4}}
            transition={{type: 'spring', duration: 0.25, bounce: 0}}
          >
            <div className="flex items-center gap-3 px-4 shadow-[inset_0_-1px_0_var(--line)]">
              <SearchIcon className="size-[18px] shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
              <input
                ref={input}
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Buscar aulas, projetos, conceitos…"
                className="h-14 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-subtle"
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-lista`}
                aria-activedescendant={todos[ativo] ? `${uid}-${ativo}` : undefined}
                aria-autocomplete="list"
                spellCheck={false}
              />
              <kbd className="hidden shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">esc</kbd>
            </div>
            <div ref={lista} id={`${uid}-lista`} role="listbox" className="max-h-[min(60vh,480px)] overflow-y-auto overscroll-contain p-2">
              {grupos.map((g) => (
                <div key={g.titulo} role="group" aria-label={g.titulo} className="pb-1">
                  <div className="eyebrow px-3 pb-1.5 pt-2.5 !text-[11px]">{g.titulo}</div>
                  {g.itens.map((r, i) => {
                    const idx = g.offset + i;
                    const Icone = iconeDe(r.tipo);
                    return (
                      <div
                        key={r.url + idx}
                        id={`${uid}-${idx}`}
                        data-idx={idx}
                        role="option"
                        aria-selected={idx === ativo}
                        onMouseMove={() => setAtivo(idx)}
                        onClick={() => ir(r)}
                        className={cn('flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5', idx === ativo ? 'bg-surface-2' : '')}
                      >
                        <Icone className={cn('mt-0.5 size-4 shrink-0', idx === ativo ? 'text-brand-ink' : 'text-subtle')} strokeWidth={1.5} aria-hidden />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-[14px] font-medium text-ink">{r.titulo}</span>
                            <span className="shrink-0 font-mono text-[11px] text-subtle">{r.tipo === 'Trecho' ? r.detalhe : r.tipo}</span>
                          </div>
                          {r.html ? (
                            <p
                              className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-muted [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-ink"
                              dangerouslySetInnerHTML={{__html: r.html}}
                            />
                          ) : (
                            r.detalhe && <p className="mt-0.5 truncate text-[13px] text-muted">{r.detalhe}</p>
                          )}
                        </div>
                        {idx === ativo && <CornerDownLeft className="mt-1 size-3.5 shrink-0 text-subtle" strokeWidth={1.5} aria-hidden />}
                      </div>
                    );
                  })}
                </div>
              ))}
              {q && todos.length === 0 && !buscando && (
                <div className="px-3 py-10 text-center text-[14px] text-muted">
                  Nada encontrado para “{q}”.
                  {semIndice && <span className="mt-1 block text-[12px] text-subtle">A busca no texto completo funciona depois do build.</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 font-mono text-[11px] text-subtle shadow-[inset_0_1px_0_var(--line)]">
              <span>↑↓ navegar</span>
              <span>↵ abrir</span>
              <span className="ms-auto">esc fechar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SearchTrigger({className, grande = false}: {className?: string; grande?: boolean}) {
  return (
    <button
      type="button"
      onClick={abrirBusca}
      className={cn(
        'press group flex items-center gap-2.5 rounded-full bg-surface text-muted shadow-ring hover:shadow-ring-hover',
        grande ? 'h-13 w-full max-w-[520px] px-5 text-[15px]' : 'h-9 px-3.5 text-[13px]',
        className,
      )}
      aria-label={grande ? undefined : 'Buscar'}
      aria-keyshortcuts="Meta+K Control+K"
    >
      <SearchIcon className={grande ? 'size-[18px]' : 'size-4'} strokeWidth={1.75} aria-hidden />
      <span className={grande ? '' : 'hidden lg:inline'}>{grande ? 'O que você quer aprender hoje?' : 'Buscar'}</span>
      <kbd aria-hidden className={cn('ms-auto hidden rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-subtle sm:block', grande ? '' : 'lg:ms-6')}>
        ⌘K
      </kbd>
    </button>
  );
}
