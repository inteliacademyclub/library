import type {Metadata, Viewport} from 'next';
import {Inter, JetBrains_Mono} from 'next/font/google';
import {Header} from '@/components/site/Header';
import {Footer} from '@/components/site/Footer';
import {SearchDialog} from '@/components/site/Search';
import {catalogo} from '@/lib/catalogo';
import {withBase} from '@/lib/base';
import './globals.css';
import './prose.css';

const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'});
const mono = JetBrains_Mono({subsets: ['latin'], variable: '--font-jetbrains', display: 'swap'});

export const metadata: Metadata = {
  metadataBase: new URL('https://inteliacademyclub.github.io'),
  title: {default: 'Autoestudos · Inteli Academy', template: '%s · Autoestudos'},
  description: 'A biblioteca de estudos da Liga Inteli Academy: trilhas de aulas e o material de cada projeto.',
  icons: {icon: withBase('/img/logobranca.png')},
};

export const viewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f7f7f5'},
    {media: '(prefers-color-scheme: dark)', color: '#0d0d10'},
  ],
};

// aplica o tema antes da primeira pintura (sem flash)
const temaInicial = `try{var t=localStorage.getItem('tema');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: temaInicial}} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#conteudo"
          className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-[14px] text-bg focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <div id="conteudo">{children}</div>
        <Footer />
        <SearchDialog entradas={catalogo()} />
      </body>
    </html>
  );
}
