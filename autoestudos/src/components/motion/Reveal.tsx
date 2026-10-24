import type {CSSProperties, ReactNode} from 'react';
import {cn} from '@/lib/base';

/**
 * Equivalente ao In View do Motion Primitives, em CSS puro: entrada suave
 * guiada pela rolagem (animation-timeline: view()). Sem suporte, o conteúdo
 * aparece direto, e nada depende de JavaScript para ficar visível.
 */
export function Reveal({children, delay = 0, className}: {children: ReactNode; delay?: number; className?: string}) {
  return (
    <div className={cn('reveal', className)} style={delay ? ({'--reveal-delay': `${delay}s`} as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
