import type {ReactNode} from 'react';
import {AlertTriangle, Info, Lightbulb, OctagonAlert} from 'lucide-react';
import {cn} from '@/lib/base';

const ESTILOS = {
  tip: {icone: Lightbulb, padrao: 'Dica', classe: 'bg-ok-soft', cor: 'text-ok'},
  info: {icone: Info, padrao: 'Nota', classe: 'bg-brand-soft', cor: 'text-brand-ink'},
  note: {icone: Info, padrao: 'Nota', classe: 'bg-surface-2', cor: 'text-muted'},
  important: {icone: Info, padrao: 'Importante', classe: 'bg-brand-soft', cor: 'text-brand-ink'},
  warning: {icone: AlertTriangle, padrao: 'Atenção', classe: 'bg-warn-soft', cor: 'text-warn'},
  caution: {icone: AlertTriangle, padrao: 'Cuidado', classe: 'bg-warn-soft', cor: 'text-warn'},
  danger: {icone: OctagonAlert, padrao: 'Perigo', classe: 'bg-bad-soft', cor: 'text-bad'},
} as const;

/** Caixa de destaque (`:::tip`, `:::warning`...). Cor só no fundo e no ícone. */
export function Callout({tipo = 'info', titulo, children}: {tipo?: keyof typeof ESTILOS; titulo?: string; children: ReactNode}) {
  const e = ESTILOS[tipo] ?? ESTILOS.info;
  const Icone = e.icone;
  return (
    <aside className={cn('callout my-6 rounded-2xl px-5 py-4 text-[15px] leading-[1.65]', e.classe)}>
      <div className={cn('mb-1.5 flex items-center gap-2 font-semibold text-ink')}>
        <Icone className={cn('size-4 shrink-0', e.cor)} strokeWidth={2} aria-hidden />
        <span>{titulo ?? e.padrao}</span>
      </div>
      <div className="[&>:last-child]:mb-0 [&_figure[data-rehype-pretty-code-figure]]:bg-surface">{children}</div>
    </aside>
  );
}
