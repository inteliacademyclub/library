import Link from 'next/link';
import type {ComponentProps, ReactNode} from 'react';

type Props = Omit<ComponentProps<'a'>, 'href'> & {to?: string; href?: string; children?: ReactNode};

/** Link interno (começa com "/") navega no site; externo abre em nova aba. */
export default function DocLink({to, href, children, ...rest}: Props) {
  const dest = to ?? href ?? '#';
  if (dest.startsWith('/')) {
    return (
      <Link href={dest} {...rest}>
        {children}
      </Link>
    );
  }
  if (dest.startsWith('#') || dest.startsWith('mailto:')) {
    return (
      <a href={dest} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={dest} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
