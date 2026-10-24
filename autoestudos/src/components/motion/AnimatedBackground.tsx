'use client';
// Adaptado de Motion Primitives (ibelick/motion-primitives, MIT): um fundo que
// desliza entre os itens em hover ou na seleção.
import {AnimatePresence, motion, type Transition} from 'motion/react';
import {Children, cloneElement, useEffect, useId, useState, type ReactElement} from 'react';
import {cn} from '@/lib/base';

type Child = ReactElement<{'data-id': string; className?: string; children?: React.ReactNode}>;

export function AnimatedBackground({
  children,
  defaultValue,
  className,
  transition = {type: 'spring', duration: 0.3, bounce: 0},
  enableHover = false,
}: {
  children: Child | Child[];
  defaultValue?: string;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);
  const uid = useId();

  useEffect(() => {
    setActiveId(defaultValue ?? null);
  }, [defaultValue]);

  return Children.map(children, (child: Child) => {
    const id = child.props['data-id'];
    const interaction = enableHover
      ? {onMouseEnter: () => setActiveId(id), onMouseLeave: () => setActiveId(defaultValue ?? null)}
      : {onClick: () => setActiveId(id)};
    return cloneElement(
      child,
      {
        className: cn('relative', child.props.className),
        'data-checked': activeId === id ? 'true' : 'false',
        ...interaction,
      } as unknown as Partial<Child['props']>,
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.span
              layoutId={`bg-${uid}`}
              className={cn('absolute inset-0', className)}
              transition={transition}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              aria-hidden
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{child.props.children}</span>
      </>,
    );
  });
}
