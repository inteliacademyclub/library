import React from 'react';
import {ArrowUpRight, Diamond, TriangleAlert} from 'lucide-react';
import Link from '@/components/site/DocLink';
import {inline} from './inline';

type PaperProps = {
  titulo: string;
  referencia: string;
  link: string;
  resumo: React.ReactNode;
  numeros?: string[];
  usar?: React.ReactNode[];
  criticar?: React.ReactNode[];
};

const card = 'flex flex-col rounded-2xl bg-surface p-5 shadow-ring [&_p]:m-0';
const titulo = 'group inline-flex items-start gap-1.5 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink no-underline';
const seta = 'mt-[3px] size-4 shrink-0 text-subtle transition-[translate,color] duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink';
const tag = 'inline-flex h-6 items-center rounded-full bg-surface-2 px-2.5 font-mono text-[11.5px] text-muted';
const lista = 'm-0 list-none space-y-1.5 p-0 text-[14px] leading-[1.6] text-ink-2';
const item = 'relative ps-3.5 before:absolute before:start-0 before:top-[0.68em] before:size-1 before:rounded-full before:bg-subtle';

/** Leitura comentada: o que o paper faz, números-chave, o que aproveitar e o que criticar. */
export function PaperCard({titulo: t, referencia, link, resumo, numeros, usar, criticar}: PaperProps): React.ReactElement {
  return (
    <article className={card}>
      <header>
        <a href={link} target="_blank" rel="noopener noreferrer" className={titulo}>
          {t}
          <ArrowUpRight className={seta} strokeWidth={1.75} aria-hidden />
        </a>
        <div className="mt-1 font-mono text-[12px] text-subtle">{referencia}</div>
      </header>
      <p className="!mt-3 text-[14.5px] leading-[1.65] text-ink-2">{inline(resumo)}</p>
      {numeros && numeros.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {numeros.map((n) => (
            <span key={n} className="inline-flex min-h-6 items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-[12.5px] font-medium text-brand-ink">
              {inline(n)}
            </span>
          ))}
        </div>
      )}
      {(usar || criticar) && (
        <div className="mt-4 grid gap-4 @container sm:grid-cols-2">
          {usar && (
            <div>
              <div className="eyebrow mb-1.5 !text-[11px] !text-ok">Aproveite</div>
              <ul className={lista}>
                {usar.map((u, i) => (
                  <li key={i} className={item}>
                    {inline(u)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {criticar && (
            <div>
              <div className="eyebrow mb-1.5 !text-[11px] !text-warn">Olhe com senso crítico</div>
              <ul className={lista}>
                {criticar.map((c, i) => (
                  <li key={i} className={item}>
                    {inline(c)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

type ToolProps = {
  nome: string;
  papel: React.ReactNode;
  versao?: string;
  licenca?: string;
  custo?: string;
  link?: string;
  alerta?: React.ReactNode;
};

/** Link interno (começa com "/") abre no próprio site; externo abre em nova aba. */
function SmartLink({href, className, children}: {href: string; className?: string; children: React.ReactNode}) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/** Ficha de ferramenta: para que serve, versão verificada, licença, custo e pegadinhas. */
export function ToolCard({nome, papel, versao, licenca, custo, link, alerta}: ToolProps): React.ReactElement {
  return (
    <article className={card}>
      <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        {link ? (
          <SmartLink href={link} className={titulo}>
            {nome}
            <ArrowUpRight className={seta} strokeWidth={1.75} aria-hidden />
          </SmartLink>
        ) : (
          <span className={titulo}>{nome}</span>
        )}
        <span className="flex flex-wrap gap-1">
          {versao && <span className={tag}>{/^\d/.test(versao) ? `v${versao}` : versao}</span>}
          {licenca && <span className={tag}>{licenca}</span>}
          {custo && <span className={tag}>{custo}</span>}
        </span>
      </header>
      <p className="!mt-2.5 text-[14.5px] leading-[1.65] text-ink-2">{inline(papel)}</p>
      {alerta && (
        <p className="!mt-3 flex gap-2 rounded-xl bg-warn-soft px-3 py-2.5 text-[13.5px] leading-[1.55] text-ink-2">
          <TriangleAlert className="mt-[3px] size-3.5 shrink-0 text-warn" strokeWidth={2} aria-hidden />
          <span>{inline(alerta)}</span>
        </p>
      )}
    </article>
  );
}

export function CardGrid({children}: {children: React.ReactNode}): React.ReactElement {
  return <div className="my-6 grid gap-3 md:grid-cols-2">{children}</div>;
}

/** Caixa do fio condutor: o que a aula muda na decisão entre os Shorts A e B da Lumina. */
export function NoProjeto({titulo = 'No projeto: Lumina A vs. B', children}: {titulo?: string; children: React.ReactNode}): React.ReactElement {
  return (
    <aside className="my-8 rounded-2xl bg-brand-soft px-5 py-4 text-[15px] leading-[1.65]">
      <div className="mb-1.5 flex items-center gap-2 font-semibold text-ink">
        <Diamond className="size-4 shrink-0 text-brand-ink" strokeWidth={2} aria-hidden />
        {titulo}
      </div>
      <div className="[&>:last-child]:mb-0">{children}</div>
    </aside>
  );
}
