import {evaluate} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode, {type Options as PrettyCodeOptions} from 'rehype-pretty-code';
import type {MDXContent} from 'mdx/types';
import {remarkAdmonitions, remarkStripH1, rehypeToc, type TocItem} from './remark';

const prettyCode: PrettyCodeOptions = {
  theme: {light: 'github-light', dark: 'github-dark-default'},
  keepBackground: false,
  defaultLang: {block: 'text', inline: 'plaintext'},
  bypassInlineCode: true,
};

export async function compileMdx(source: string): Promise<{Content: MDXContent; toc: TocItem[]}> {
  const toc: TocItem[] = [];
  const mod = await evaluate(source, {
    ...runtime,
    format: 'mdx',
    development: false,
    remarkPlugins: [
      remarkGfm,
      remarkDirective,
      remarkAdmonitions,
      // "R$ 10 ... R$ 20" não deve virar fórmula: só $$...$$
      [remarkMath, {singleDollarTextMath: false}],
      remarkStripH1,
    ],
    rehypePlugins: [rehypeSlug, [rehypeToc, {out: toc}], rehypeKatex, [rehypePrettyCode, prettyCode]],
  });
  return {Content: mod.default, toc};
}
