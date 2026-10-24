import Link from 'next/link';
import {getProjetos, getTrilhas} from '@/lib/content';
import {Logo} from './Header';

export function Footer() {
  const trilhas = getTrilhas();
  const projetos = getProjetos();
  return (
    <footer className="mt-32 shadow-[0_-1px_0_var(--line)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-ink">
            <Logo className="h-[18px] text-brand-ink" />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">Autoestudos</span>
          </div>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-6 text-muted">
            A biblioteca de estudos da Liga Inteli Academy: trilhas de aulas e o material de cada projeto.
          </p>
        </div>
        <nav aria-label="Trilhas">
          <h2 className="text-[13px] font-medium text-ink">Trilhas</h2>
          <ul className="mt-3 space-y-2 text-[14px]">
            {trilhas.map((t) => (
              <li key={t.slug}>
                <Link href={`/aulas/${t.slug}/`} className="text-muted transition-colors duration-150 hover:text-ink">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Projetos">
          <h2 className="text-[13px] font-medium text-ink">Projetos</h2>
          <ul className="mt-3 space-y-2 text-[14px]">
            {projetos.map((p) => (
              <li key={p.slug}>
                <Link href={`/projetos/${p.slug}/`} className="text-muted transition-colors duration-150 hover:text-ink">
                  {p.parceiro}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://github.com/inteliacademyclub/library" target="_blank" rel="noopener noreferrer" className="text-muted transition-colors duration-150 hover:text-ink">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-10 font-mono text-[12px] text-subtle sm:px-6">Inteli Academy · {new Date().getFullYear()}</div>
    </footer>
  );
}
