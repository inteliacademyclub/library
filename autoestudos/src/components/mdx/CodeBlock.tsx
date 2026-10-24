'use client';
import {useRef, useState, type ComponentProps} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Check, Copy} from 'lucide-react';

/** <pre> com botão de copiar (aparece no hover e no foco). */
export function Pre(props: ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? '');
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {}
  };
  return (
    <div className="group/code relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copiar}
        aria-label={copiado ? 'Copiado' : 'Copiar código'}
        className="press absolute end-2 top-2 grid size-8 place-items-center rounded-lg bg-surface text-muted opacity-0 shadow-ring transition-[opacity,scale] duration-150 hover:text-ink focus-visible:opacity-100 group-hover/code:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copiado ? 'ok' : 'copy'}
            initial={{opacity: 0, scale: 0.25, filter: 'blur(4px)'}}
            animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
            exit={{opacity: 0, scale: 0.25, filter: 'blur(4px)'}}
            transition={{type: 'spring', duration: 0.3, bounce: 0}}
            className="grid place-items-center"
          >
            {copiado ? <Check className="size-3.5 text-ok" strokeWidth={2} /> : <Copy className="size-3.5" strokeWidth={1.75} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
