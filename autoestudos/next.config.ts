import type {NextConfig} from 'next';

// Site estático. Sem prefixo por padrão; o deploy no GitHub Pages do repositório
// inteliacademyclub/docs define BASE_PATH=/docs, porque lá o site vive em /docs/.
const basePath = process.env.BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {unoptimized: true},
  env: {NEXT_PUBLIC_BASE_PATH: basePath},
  turbopack: {root: import.meta.dirname},
};

export default config;
