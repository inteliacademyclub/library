import React from 'react';
import {withBase} from '@/lib/base';
import styles from './aula.module.css';
import Icon from './Icon';

type Props = {
  /** Caminho do diagrama dentro de public/diagramas, sem extensão. Ex.: "galaxies/arquitetura" */
  name: string;
  alt: string;
  caption?: React.ReactNode;
  /** Largura máxima em px (padrão: 100% da coluna). */
  maxWidth?: number;
};

/**
 * Diagrama Excalidraw exportado em SVG (claro/escuro). O arquivo .excalidraw
 * fica ao lado para quem quiser abrir e editar no excalidraw.com.
 */
export default function Sketch({name, alt, caption, maxWidth}: Props): React.ReactElement {
  const light = withBase(`/diagramas/${name}.light.svg`);
  const dark = withBase(`/diagramas/${name}.dark.svg`);
  const source = withBase(`/diagramas/${name}.excalidraw`);
  return (
    <figure className={styles.sketch} style={maxWidth ? {maxWidth} : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light} alt={alt} className={`${styles.sketchImg} only-light`} loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark} alt={alt} className={`${styles.sketchImg} only-dark`} loading="lazy" />
      <figcaption className={styles.sketchCaption}>
        {caption && <span>{caption}</span>}
        <a href={source} download data-pagefind-ignore className={styles.sketchSource} title="Baixe e arraste para o excalidraw.com para editar">
          <Icon nome="download" tamanho="0.95em" /> .excalidraw
        </a>
      </figcaption>
    </figure>
  );
}
