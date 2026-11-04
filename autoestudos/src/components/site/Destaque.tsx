'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {ArrowRight, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {cn} from '@/lib/base';

export type ItemDestaque = {
  slug: string;
  parceiro: string;
  periodo: string;
  titulo: string;
  resumo: string;
  status: 'em-andamento' | 'em-breve' | 'concluido';
  tapi?: string;
  trilha?: string;
};

/** Tempo que cada projeto fica parado em destaque. */
const INTERVALO_MS = 5000;
/** Duração do deslize entre um projeto e o próximo. */
const DESLIZE_MS = 650;
const CURVA = 'cubic-bezier(0.65, 0, 0.35, 1)';

const botaoSecundario =
  'press inline-flex h-10 items-center rounded-full px-4.5 text-[14px] font-medium shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10';
const botaoControle =
  'press inline-flex size-9 items-center justify-center rounded-full text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10 hover:text-white';

function Slide({p}: {p: ItemDestaque}) {
  const andamento = p.status === 'em-andamento';
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/14 px-2.5 text-[12px] font-medium">
          <span className={andamento ? 'size-1.5 animate-pulse rounded-full bg-white' : 'size-1.5 rounded-full ring-[1.5px] ring-inset ring-white'} aria-hidden />
          {andamento ? 'Projeto em andamento' : 'Próximo projeto'}
        </span>
        <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-white/70">
          {p.parceiro} · {p.periodo}
        </span>
      </div>
      <h2 className="mt-6 max-w-[22ch] text-[30px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[40px]">{p.titulo}</h2>
      <p className="mt-4 max-w-[60ch] text-[16px] leading-7 text-white/80">{p.resumo}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/projetos/${p.slug}/`}
          className="press group inline-flex h-10 items-center gap-2 rounded-full bg-white px-4.5 text-[14px] font-medium text-[#17161c] hover:bg-white/90"
        >
          Abrir o projeto
          <ArrowRight className="size-4 transition-[translate] duration-150 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
        </Link>
        {p.tapi && (
          <Link href={`/${p.tapi}/`} className={botaoSecundario}>
            Ler o TAPI
          </Link>
        )}
        {p.trilha && (
          <Link href={`/aulas/${p.trilha}/`} className={botaoSecundario}>
            Trilha de estudos
          </Link>
        )}
      </div>
    </>
  );
}

/**
 * Destaque da página inicial. Com um projeto, mostra só ele. Com vários, os
 * projetos deslizam para a esquerda em loop contínuo: depois do último vem
 * uma cópia do primeiro, e ao terminar o deslize a trilha volta para o
 * início sem animação, então nunca há "rebobinada". O botão de pausa
 * interrompe a troca; com "reduzir movimento", a troca é instantânea.
 */
export function Destaque({itens}: {itens: ItemDestaque[]}) {
  const n = itens.length;
  const varios = n > 1;
  // pos vai de 0 a n; a posição n é a cópia do primeiro projeto
  const [pos, setPos] = useState(0);
  const [animar, setAnimar] = useState(true);
  const [pausadoPeloUsuario, setPausadoPeloUsuario] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const [menosMovimento, setMenosMovimento] = useState(false);
  const destinoPendente = useRef<number | null>(null);

  const atual = n ? pos % n : 0;
  const rodando = varios && !pausadoPeloUsuario && !focoDentro;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualiza = () => setMenosMovimento(mq.matches);
    atualiza();
    mq.addEventListener('change', atualiza);
    return () => mq.removeEventListener('change', atualiza);
  }, []);

  const proximo = useCallback(() => {
    if (menosMovimento) setPos((p) => (p + 1) % n);
    else setPos((p) => Math.min(p + 1, n));
  }, [menosMovimento, n]);

  const anterior = useCallback(() => {
    if (menosMovimento) {
      setPos((p) => (p - 1 + n) % n);
    } else if (pos === 0) {
      // salta sem animação para a cópia do fim e desliza para o último
      destinoPendente.current = n - 1;
      setAnimar(false);
      setPos(n);
    } else {
      setPos((p) => p - 1);
    }
  }, [menosMovimento, n, pos]);

  const ir = useCallback((i: number) => setPos(i), []);

  // troca automática
  useEffect(() => {
    if (!rodando) return;
    const id = window.setTimeout(proximo, INTERVALO_MS);
    return () => window.clearTimeout(id);
  }, [rodando, atual, proximo]);

  // chegou na cópia do primeiro: ao fim do deslize, volta ao início sem animação
  useEffect(() => {
    if (pos !== n || destinoPendente.current !== null) return;
    const id = window.setTimeout(() => {
      setAnimar(false);
      setPos(0);
    }, DESLIZE_MS + 30);
    return () => window.clearTimeout(id);
  }, [pos, n]);

  // depois de um salto sem animação, religa a animação no quadro seguinte
  useEffect(() => {
    if (animar) return;
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        setAnimar(true);
        if (destinoPendente.current !== null) {
          setPos(destinoPendente.current);
          destinoPendente.current = null;
        }
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [animar]);

  if (n === 0) return null;

  const comAnimacao = animar && !menosMovimento;
  const slides = varios ? [...itens, itens[0]] : itens;

  return (
    <section
      aria-roledescription={varios ? 'carrossel' : undefined}
      aria-label={varios ? 'Projetos em destaque' : undefined}
      className="relative overflow-hidden rounded-[28px] bg-[#3f01ff] text-white"
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setFocoDentro(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoDentro(false);
      }}
    >
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translate3d(${-pos * 100}%, 0, 0)`,
            transition: comAnimacao ? `transform ${DESLIZE_MS}ms ${CURVA}` : 'none',
          }}
        >
          {slides.map((p, i) => {
            const copia = i === n && varios;
            const visivel = i === pos;
            return (
              <div
                key={copia ? `${p.slug}-copia` : p.slug}
                role={varios && !copia ? 'group' : undefined}
                aria-roledescription={varios && !copia ? 'slide' : undefined}
                aria-label={varios && !copia ? `${i + 1} de ${n}: ${p.parceiro}` : undefined}
                aria-hidden={!visivel || copia}
                inert={!visivel || copia}
                className="w-full shrink-0 p-7 pb-0 sm:p-10 sm:pb-0"
                style={{
                  opacity: visivel ? 1 : 0.25,
                  transition: comAnimacao ? `opacity ${DESLIZE_MS}ms ${CURVA}` : 'none',
                }}
              >
                <Slide p={p} />
              </div>
            );
          })}
        </div>
      </div>

      {varios ? (
        <div className="px-7 pb-7 sm:px-10 sm:pb-10">
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
            <div className="flex items-center gap-2" role="group" aria-label="Escolher projeto">
              {itens.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Mostrar ${p.parceiro}`}
                  aria-current={i === atual ? 'true' : undefined}
                  className={cn(
                    'press h-8 rounded-full px-3 text-[12px] font-medium transition-colors duration-300',
                    i === atual ? 'bg-white text-[#17161c]' : 'text-white/75 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10 hover:text-white',
                  )}
                >
                  {p.parceiro}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={anterior} aria-label="Projeto anterior" className={botaoControle}>
                <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPausadoPeloUsuario((v) => !v)}
                aria-label={pausadoPeloUsuario ? 'Retomar a troca automática' : 'Pausar a troca automática'}
                className={botaoControle}
              >
                {pausadoPeloUsuario ? <Play className="size-4" strokeWidth={1.75} aria-hidden /> : <Pause className="size-4" strokeWidth={1.75} aria-hidden />}
              </button>
              <button type="button" onClick={proximo} aria-label="Próximo projeto" className={botaoControle}>
                <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-7 sm:pb-10" />
      )}

      {rodando && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10" aria-hidden>
          <div key={atual} className="h-full origin-left bg-white/60 motion-reduce:hidden" style={{animation: `destaque-progresso ${INTERVALO_MS}ms linear forwards`}} />
        </div>
      )}
    </section>
  );
}
