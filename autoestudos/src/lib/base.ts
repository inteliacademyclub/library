export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefixa caminhos de arquivos em public/ com o basePath (o next/link já faz isso para rotas). */
export function withBase(src: string): string {
  return src.startsWith('/') && !src.startsWith(`${BASE}/`) ? `${BASE}${src}` : src;
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
