import {Fragment, type CSSProperties} from 'react';

/**
 * Inspirado no Vertical Cut Reveal do Fancy Components (danielpetho/fancy, MIT):
 * cada palavra sobe de dentro de uma máscara, em sequência. Feito em CSS para
 * o título já vir visível no HTML estático.
 */
export function CutReveal({text, className}: {text: string; className?: string}) {
  const palavras = text.split(' ');
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {palavras.map((p, i) => (
          <Fragment key={i}>
            <span className="cut-mask">
              <span className="cut-word" style={{'--i': i} as CSSProperties}>
                {p}
              </span>
            </span>
            {i < palavras.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
