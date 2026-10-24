'use client';
import {useEffect, type RefObject} from 'react';

// Último elemento focado fora de um diálogo: o campo com autoFocus rouba o foco
// antes do efeito rodar, então o gatilho precisa ser lembrado antes.
let ultimoFoco: HTMLElement | null = null;
if (typeof window !== 'undefined') {
  document.addEventListener('focusin', (e) => {
    const alvo = e.target as HTMLElement;
    if (!alvo.closest('[role="dialog"]')) ultimoFoco = alvo;
  });
}

/**
 * Enquanto `aberto`: o resto da página fica `inert` (fora do foco e do leitor
 * de tela), a rolagem de fundo trava e, ao fechar, o foco volta para quem abriu.
 */
export function useModal(aberto: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!aberto) return;
    const gatilho = ultimoFoco;
    // espera o diálogo montar (AnimatePresence) antes de isolar o fundo
    const raf = requestAnimationFrame(() => {
      const el = ref.current;
      for (const filho of Array.from(document.body.children)) {
        if (el && filho.contains(el)) continue;
        if (filho instanceof HTMLElement && filho.tagName !== 'SCRIPT') filho.inert = true;
      }
    });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      for (const filho of Array.from(document.body.children)) if (filho instanceof HTMLElement) filho.inert = false;
      document.body.style.overflow = overflow;
      if (gatilho?.isConnected) gatilho.focus({preventScroll: true});
    };
  }, [aberto, ref]);
}
