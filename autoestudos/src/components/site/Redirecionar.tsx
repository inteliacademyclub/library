'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

/** Página antiga que mudou de endereço (o site é estático, então o redirecionamento acontece no navegador). */
export function Redirecionar({para}: {para: string}) {
  const router = useRouter();
  useEffect(() => router.replace(para), [router, para]);
  return (
    <main className="mx-auto max-w-[560px] px-4 py-32 text-center">
      <p className="text-[15px] text-muted">
        Esta página mudou de endereço.{' '}
        <Link href={para} className="text-brand-ink underline underline-offset-4">
          Ir para a nova página
        </Link>
      </p>
    </main>
  );
}
