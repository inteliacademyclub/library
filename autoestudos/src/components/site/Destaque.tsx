'use client';

import {useCallback, useEffect, useRef, useState, type CSSProperties} from 'react';
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
const INTERVALO_MS = 2800;
/** Quanto tempo o projeto que sai continua visível, esmaecendo. */
const SAIDA_MS = 440;
/** Onde fica o brilho de fundo em cada projeto (x, y em % do bloco). */
const BRILHOS: [number, number][] = [
  [78, 18],
  [22, 82],
  [62, 92],
  [12, 12],
];

const botaoSecundario =
  'press inline-flex h-10 items-center rounded-full px-4.5 text-[14px] font-medium shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10';
const botaoControle =
  'press inline-flex size-9 items-center justify-center rounded-full text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32)] hover:bg-white/10 hover:text-white';

/** Cada bloco do slide entra com um pequeno atraso em relação ao anterior. */
const item = (i: number) => ({className: 'destaque-item', style: {'--i': i} as CSSProperties});

function Slide({p}: {p: ItemDestaque}) {
  const andamento = p.status === 'em-andamento';
  return (
    <>
      <div {...item(0)}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/14 px-2.5 text-[12px] font-medium">
            <span className={andamento ? 'size-1.5 animate-pulse rounded-full bg-white' : 'size-1.5 rounded-full ring-[1.5px] ring-inset ring-white'} aria-hidden />
            {andamento ? 'Projeto em andamento' : 'Próximo projeto'}
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-white/70">
            {p.parceiro} · {p.periodo}
          </span>
        </div>
      </div>
      <h2 {...item(1)} className="destaque-item mt-6 max-w-[22ch] text-[30px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
        {p.titulo}
      </h2>
      <p {...item(2)} className="destaque-item mt-4 max-w-[60ch] text-[16px] leading-7 text-white/80">
        {p.resumo}
      </p>
      <div {...item(3)} className="destaque-item mt-8 flex flex-wrap gap-3">
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
 * Destaque da página inicial. Com um projeto, mostra só ele. Com vários,
 * alterna em loop: o projeto que sai desliza e esmaece para um lado, e o
 * novo entra do outro em cascata (selo, título, texto, botões), enquanto
 * um brilho no fundo muda de lugar. A direção acompanha a navegação.
 * As animações ficam em globals.css (destaque-entra / destaque-sai);
 * com "reduzir movimento", a troca é instantânea.
 */
export function Destaque({itens}: {itens: ItemDestaque[]}) {
  const n = itens.length;
  const varios = n > 1;
  const [atual, setAtual] = useState(0);
  const [saindo, setSaindo] = useState<number | null>(null);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  const [pausadoPeloUsuario, setPausadoPeloUsuario] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const timerSaida = useRef<number | undefined>(undefined);

  const rodando = varios && !pausadoPeloUsuario && !focoDentro;

  const ir = useCallback(
    (destino: number, dir: 1 | -1) => {
      const prox = ((destino % n) + n) % n;
      if (prox === atual) return;
      setDirecao(dir);
      setSaindo(atual);
      setAtual(prox);
      window.clearTimeout(timerSaida.current);
      timerSaida.current = window.setTimeout(() => setSaindo(null), SAIDA_MS);
    },
    [n, atual],
  );

  const proximo = useCallback(() => ir(atual + 1, 1), [ir, atual]);
  const anterior = useCallback(() => ir(atual - 1, -1), [ir, atual]);

  useEffect(() => () => window.clearTimeout(timerSaida.current), []);

  // troca automática
  useEffect(() => {
    if (!rodando) return;
    const id = window.setTimeout(proximo, INTERVALO_MS);
    return () => window.clearTimeout(id);
  }, [rodando, proximo]);

  if (n === 0) return null;

  const [bx, by] = BRILHOS[atual % BRILHOS.length];

  return (
    <section
      aria-roledescription={varios ? 'carrossel' : undefined}
      aria-label={varios ? 'Projetos em destaque' : undefined}
      className="destaque relative isolate overflow-hidden rounded-[28px] bg-[#3f01ff] p-7 text-white sm:p-10"
      style={{'--dir': direcao} as CSSProperties}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setFocoDentro(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoDentro(false);
      }}
    >
      {/* brilho de fundo que muda de lugar a cada projeto */}
      <div
        className="destaque-brilho pointer-events-none absolute -z-10 size-[560px] rounded-full bg-[#9b85ff] opacity-45 blur-[110px]"
        style={{left: `${bx}%`, top: `${by}%`}}
        aria-hidden
      />

      <div className="grid">
        {itens.map((p, i) => {
          const estado = i === atual ? 'ativo' : i === saindo ? 'saindo' : 'oculto';
          return (
            <div
              key={p.slug}
              role={varios ? 'group' : undefined}
              aria-roledescription={varios ? 'slide' : undefined}
              aria-label={varios ? `${i + 1} de ${n}: ${p.parceiro}` : undefined}
              aria-hidden={estado !== 'ativo'}
              inert={estado !== 'ativo'}
              data-estado={varios ? estado : 'ativo'}
              className="destaque-slide [grid-area:1/1]"
            >
              <Slide p={p} />
            </div>
          );
        })}
      </div>

      {varios && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
          <div className="flex items-center gap-2" role="group" aria-label="Escolher projeto">
            {itens.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => ir(i, i >= atual ? 1 : -1)}
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
      )}

      {rodando && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10" aria-hidden>
          <div key={atual} className="h-full origin-left bg-white/60 motion-reduce:hidden" style={{animation: `destaque-progresso ${INTERVALO_MS}ms linear forwards`}} />
        </div>
      )}
    </section>
  );
}
