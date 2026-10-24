// Plugins de remark/rehype que mantêm a sintaxe herdada do Docusaurus.
import type {Root as MdastRoot, Paragraph, PhrasingContent} from 'mdast';
import type {Root as HastRoot, Element} from 'hast';
import {visit, SKIP} from 'unist-util-visit';
import {toString as hastToString} from 'hast-util-to-string';

const TIPOS = new Set(['tip', 'info', 'warning', 'danger', 'note', 'caution', 'important']);

type DirectiveNode = {
  type: 'containerDirective' | 'leafDirective' | 'textDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: (PhrasingContent | Paragraph)[];
  data?: Record<string, unknown>;
};

/**
 * `:::tip[Título]` vira `<Callout tipo="tip" titulo="Título">`. Diretivas de
 * texto desconhecidas (ex.: "10:30", "ex.:abc") voltam a ser texto, porque
 * remark-directive as interpreta mesmo quando não são diretivas.
 */
export function remarkAdmonitions() {
  return (tree: MdastRoot) => {
    visit(tree, (node, index, parent) => {
      const n = node as unknown as DirectiveNode;
      if (n.type === 'containerDirective' && TIPOS.has(n.name)) {
        let titulo: string | undefined;
        const first = n.children[0] as Paragraph & {data?: {directiveLabel?: boolean}};
        if (first?.type === 'paragraph' && first.data?.directiveLabel) {
          titulo = first.children.map((c) => ('value' in c ? c.value : '')).join('');
          n.children.shift();
        }
        const attrs = [{type: 'mdxJsxAttribute', name: 'tipo', value: n.name}];
        if (titulo) attrs.push({type: 'mdxJsxAttribute', name: 'titulo', value: titulo});
        Object.assign(n, {type: 'mdxJsxFlowElement', name: 'Callout', attributes: attrs});
        return;
      }
      if ((n.type === 'textDirective' || n.type === 'leafDirective') && parent && index !== undefined) {
        const texto = `${n.type === 'leafDirective' ? '::' : ':'}${n.name}`;
        const filhos = n.children ?? [];
        const repl: PhrasingContent[] = [{type: 'text', value: texto}, ...(filhos as PhrasingContent[])];
        if (n.type === 'leafDirective') {
          (parent.children as unknown[]).splice(index, 1, {type: 'paragraph', children: repl});
        } else {
          (parent.children as unknown[]).splice(index, 1, ...repl);
        }
        return [SKIP, index + repl.length];
      }
    });
  };
}

/** Remove o primeiro `# Título`: o cabeçalho da página já mostra o título. */
export function remarkStripH1() {
  return (tree: MdastRoot) => {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) tree.children.splice(i, 1);
  };
}

export type TocItem = {id: string; text: string; depth: 2 | 3};

/** Coleta h2/h3 (já com id do rehype-slug) para o sumário lateral. */
export function rehypeToc({out}: {out: TocItem[]}) {
  return (tree: HastRoot) => {
    visit(tree, 'element', (el: Element) => {
      if ((el.tagName === 'h2' || el.tagName === 'h3') && el.properties?.id) {
        out.push({id: String(el.properties.id), text: hastToString(el).trim(), depth: el.tagName === 'h2' ? 2 : 3});
      }
    });
  };
}
