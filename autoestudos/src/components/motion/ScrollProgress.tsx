'use client';
// Adaptado de Motion Primitives (ibelick/motion-primitives, MIT).
import {motion, useScroll, useSpring} from 'motion/react';
import {cn} from '@/lib/base';

/** Barra fina de progresso de leitura no topo da página. */
export function ScrollProgress({className}: {className?: string}) {
  const {scrollYProgress} = useScroll();
  const scaleX = useSpring(scrollYProgress, {stiffness: 200, damping: 50, restDelta: 0.001});
  return <motion.div aria-hidden className={cn('h-0.5 origin-left', className)} style={{scaleX}} />;
}
