# Autoestudos

A biblioteca de estudos da Liga Inteli Academy, publicada em https://inteliacademyclub.github.io/docs/.

Site estático em Next.js (export) + Tailwind v4. O conteúdo fica em `docs/` como Markdown/MDX:

- `docs/aulas/<trilha>/` — trilhas de aulas. Metadados da trilha em `_category_.json` (`label`, `position`, `description`); módulos são subpastas com o próprio `_category_.json`.
- `docs/projetos/<projeto>/` — um projeto por pasta. O `_category_.json` traz `titulo`, `parceiro`, `status` (`em-andamento` | `em-breve` | `concluido`), `periodo`, `resumo` e, opcionalmente, `trilha`. Cada página declara `secao: tapi | entregas | guias` no frontmatter.

Prefixos numéricos (`1-introducao`) só ordenam: saem da URL. Admonitions usam a sintaxe `:::tip[Título]`, e todos os componentes de aula e interativos funcionam sem import. Veja `GUIA-DE-ESTILO-AULAS.md`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera out/ e o índice de busca (Pagefind)
```

A busca no texto completo só funciona depois do build; no `dev`, o ⌘K busca por títulos.
