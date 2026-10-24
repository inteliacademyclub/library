'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Moon, Sun} from 'lucide-react';
import {AnimatedBackground} from '@/components/motion/AnimatedBackground';
import {SearchTrigger} from './Search';
import {withBase, cn} from '@/lib/base';

const NAV = [
  {href: '/aulas/', label: 'Aulas', id: 'aulas'},
  {href: '/projetos/', label: 'Projetos', id: 'projetos'},
];

export function Logo({className}: {className?: string}) {
  // a marca "IA" vira máscara: uma só imagem, colorida pelo currentColor
  return (
    <span
      aria-hidden
      className={cn('inline-block bg-current', className)}
      style={{
        aspectRatio: '525 / 461',
        maskImage: `url(${withBase('/img/logoazul.png')})`,
        WebkitMaskImage: `url(${withBase('/img/logoazul.png')})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}

function ThemeToggle() {
  const [tema, setTema] = useState<'light' | 'dark' | null>(null);
  useEffect(() => {
    setTema(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const trocar = () => {
    const novo = tema === 'dark' ? 'light' : 'dark';
    // sem transições durante a troca, para o tema mudar de uma vez
    const css = document.createElement('style');
    css.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(css);
    document.documentElement.dataset.theme = novo;
    try {
      localStorage.setItem('tema', novo);
    } catch {}
    void window.getComputedStyle(document.body).opacity;
    requestAnimationFrame(() => css.remove());
    setTema(novo);
  };

  return (
    <button
      type="button"
      onClick={trocar}
      className="press relative grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
      aria-label={tema === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {tema && (
          <motion.span
            key={tema}
            initial={{opacity: 0, scale: 0.25, filter: 'blur(4px)'}}
            animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
            exit={{opacity: 0, scale: 0.25, filter: 'blur(4px)'}}
            transition={{type: 'spring', duration: 0.3, bounce: 0}}
            className="grid place-items-center"
          >
            {tema === 'dark' ? <Sun className="size-[18px]" strokeWidth={1.5} /> : <Moon className="size-[18px]" strokeWidth={1.5} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function GitHub() {
  return (
    <a
      href="https://github.com/inteliacademyclub/docs"
      target="_blank"
      rel="noopener noreferrer"
      className="press hidden size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink sm:grid"
      aria-label="Repositório no GitHub"
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
        <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const on = () => setRolou(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, {passive: true});
    return () => window.removeEventListener('scroll', on);
  }, []);
  const atual = NAV.find((n) => pathname.startsWith(`/${n.id}`))?.id;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-[var(--header-h)] bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-xl transition-[box-shadow] duration-150 ease-out',
        rolou && 'shadow-[0_1px_0_var(--line)]',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="press -ms-1 flex items-center gap-2.5 rounded-lg px-1 py-1 text-ink" aria-label="Inteli Academy, início">
          <Logo className="h-[18px] text-brand-ink" />
        </Link>
        <nav aria-label="Principal" className="ms-1 flex items-center sm:ms-6">
          <AnimatedBackground defaultValue={atual} enableHover className="rounded-full bg-surface-2">
            {NAV.map((n) => (
              <Link
                key={n.id}
                data-id={n.id}
                href={n.href}
                aria-current={atual === n.id ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 items-center rounded-full px-3 text-[14px] transition-colors duration-150 ease-out',
                  atual === n.id ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {n.label}
              </Link>
            ))}
          </AnimatedBackground>
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <SearchTrigger className="me-1" />
          <ThemeToggle />
          <GitHub />
        </div>
      </div>
    </header>
  );
}
