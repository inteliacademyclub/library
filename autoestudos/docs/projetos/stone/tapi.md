---
secao: tapi
sidebar_position: 1
sidebar_label: 'Termo de abertura'
title: 'Case Stone: Conteúdo de Alto Engajamento para Micro e Pequenos Empreendedores'
description: 'Proposta do case Stone: mapear as publicações de maior engajamento entre MPEs e transformar os achados em criativos, com um agente rastreável.'
---

# Case Stone: Conteúdo de Alto Engajamento para Micro e Pequenos Empreendedores

:::note[Proposta em montagem]
Este TAPI ainda é uma proposta. As decisões de escopo são validadas no kickoff com a Stone e podem mudar até lá.
:::

:::info[Datas fixas]
- **26/10/2026, 15h ou 16h:** kickoff com a Stone (escopo, rota de extração do Instagram e dúvidas)
- **25/11/2026:** apresentação e entrega final, presencial na Stone
:::

Projeto individual, com duração estimada de 4 semanas.

## Contexto

A Stone atende micro e pequenos empreendedores (MPEs) de todo o Brasil. Para esse público, as redes sociais são vitrine e canal de venda ao mesmo tempo, e também um dos principais pontos de contato com a Stone. Hoje, a escolha do que publicar se apoia em intuição, referências pontuais ou na cópia de formatos em alta, sem um levantamento sistemático do que de fato engaja.

O problema tem dois lados:

- **Para a Stone:** saber quais formatos, temas, perfis de criador e tipos de vídeo chamam mais atenção entre MPEs permite produzir conteúdo com mais potencial de engajamento e de captação de leads.
- **Para o empreendedor:** o mesmo mapeamento vira orientação prática para o lojista fortalecer a presença digital do próprio negócio.

As métricas de engajamento são públicas: cada post mostra curtidas, comentários, visualizações e data. Isso permite achar as publicações de melhor desempenho e categorizar suas características de forma estruturada.

## Objetivo

Construir um agente que identifica as publicações de maior engajamento entre MPEs, categoriza conteúdo, formato e perfil de criador e, a partir disso, gera recomendações e criativos para a Stone, sempre fundamentados em exemplos reais.

:::tip[Pergunta norteadora]
Quais características de conteúdo, formato e perfil de criador aparecem nas publicações de maior engajamento voltadas a micro e pequenos empreendedores, e como transformar esse conhecimento em criativos para a Stone?
:::

Objetivos específicos:

1. Coletar, documentar e analisar criticamente uma base de publicações e métricas de perfis relevantes para MPEs.
2. Ranquear as publicações por engajamento e identificar as de maior desempenho.
3. Categorizar essas publicações com uma rubrica fixa (tipo de post, formato de vídeo, tema, gancho, chamada para ação e perfil do criador), com extração automática e validação manual por amostragem.
4. Levantar as características mais recorrentes e os criadores mais presentes entre as publicações de maior desempenho.
5. Integrar a análise a um agente que responde perguntas, gera um playbook de conteúdo e propõe criativos (roteiros, legendas e ganchos).
6. Disponibilizar o fluxo como função Python e servidor MCP.

## Decisões de escopo (a validar no kickoff)

| Tema | Proposta | Por quê |
|---|---|---|
| Caso de uso | Mapear o conteúdo de maior engajamento e gerar criativos para o canal da Stone voltado a MPEs | Demanda direta da Stone, com aplicação imediata no Instagram |
| Público do conteúdo | Lojistas, prestadores de serviço e autônomos | Base de clientes e potenciais clientes da Stone |
| Plataforma | Instagram (Reels e carrossel) como foco; YouTube Shorts como fonte complementar | O Instagram é o canal indicado pela Stone; a YouTube Data API v3 é oficial, gratuita e dá mais volume |
| Coleta | Responsabilidade do estudante. YouTube pela Data API v3; a rota do Instagram é definida pela organização e apresentada no kickoff | O Instagram não tem rota pública simples para outros perfis; a rota conjunta garante um caminho viável e dentro dos Termos de Serviço |
| Abordagem | Coleta, ranking por engajamento e categorização, **sem modelo preditivo** | Ação de curto prazo para entender e replicar o que já funciona |
| Métrica de ranking | (curtidas + comentários) ÷ seguidores | Sem normalizar, o ranking mede o tamanho do perfil, não a qualidade do conteúdo |
| Lead | Indicador indireto: presença e tipo de CTA e comentários com intenção de contato ("quero", "como faço", "qual o link") | Conversão não é pública; com dados do perfil da Stone, dá para observar a conversão real |
| Multimodal | Obrigatório em versão leve: thumbnail ou frames, transcrição e categorias extraídas por um VLM gratuito | Formato e gancho visual estão no centro do que a Stone quer entender |
| Criativos | Obrigatórios: roteiro, gancho, legenda e CTA, cada um ligado às publicações que o inspiraram | Converte o diagnóstico em algo que a equipe da Stone usa direto |

## Escopo

### Núcleo obrigatório

- **Base de dados documentada:** origem, período, volume, perfis incluídos, critérios de seleção, licença e limitações de representatividade.
- **Ranking de engajamento:** métrica normalizada declarada e critério explícito de alto desempenho (por exemplo, os 10% superiores).
- **Categorização:** rubrica fixa aplicada por VLM/LLM a cada publicação de alto desempenho, com validação manual de uma amostra.
- **Características recorrentes:** frequência de cada categoria no grupo de alto desempenho, recortes por tema e formato e exemplos reais de cada categoria.
- **Perfis em destaque:** criadores mais presentes no grupo de alto desempenho, com tema e formato predominantes.
- **Agente em LangGraph** com ferramentas de consulta à base, busca de publicações de referência e geração de criativos.
- **Playbook de conteúdo** com as características, exemplos reais e recomendações para a Stone.
- **Integração** como função Python documentada e servidor MCP, com demonstração executável.
- **README** com a metodologia e o registro das análises.

### Extensões opcionais

- Comparar o grupo de alto desempenho com o resto da base, para separar o que se associa ao sucesso do que só é comum no nicho.
- RAG sobre as publicações de alto desempenho, para fundamentar cada criativo.
- Avaliar se um rascunho de criativo segue as características identificadas, com sugestões de ajuste.
- Classificar comentários por intenção, dúvidas recorrentes e objeções.
- Recortar por segmento: alimentação, beleza, varejo e serviços.
- Analisar horário e frequência de publicação e propor um calendário editorial.
- Fazer uma versão do playbook para o próprio lojista, como material educativo.

### Fora do escopo

- Modelos preditivos de engajamento.
- Publicação automática ou integração com as contas oficiais da Stone.
- Produção final de peças: o entregável são roteiros, briefs e criativos preliminares.
- Mídia paga e otimização de campanhas.
- Dados internos de clientes da Stone sem autorização formal.
- Scraping ou qualquer rota que viole os Termos de Serviço das plataformas.

## Dados

Cada estudante coleta a própria base, define e justifica os critérios de seleção dos perfis e documenta o processo. **A base precisa estar pronta até o fim da primeira semana**, para o resto do projeto se concentrar em categorização e criativos.

| Fonte | Papel | O que traz |
|---|---|---|
| Instagram | Principal | Perfis públicos voltados a MPEs: criadores sobre empreendedorismo, educação financeira e marketing para pequenos negócios, além de bancos, fintechs e marcas do setor. Legenda, tipo de mídia, data, curtidas, comentários e seguidores |
| YouTube Shorts (Data API v3) | Complementar | Título, descrição, tags, duração, data, inscritos, visualizações, curtidas, comentários e thumbnail. Prefira playlists de canais (1 unidade de cota) a buscas (100 unidades) |
| Instagram da Stone (Insights) | Opcional, se disponibilizado | Alcance, salvamentos, compartilhamentos, cliques no link e visitas ao perfil |

- **Volume de referência:** 2.000 a 5.000 publicações de pelo menos 30 perfis, com a data de coleta registrada e só posts com 14 dias ou mais (métricas estabilizadas).
- **Seleção:** público declaradamente MPE, atividade regular nos últimos 12 meses e contas pequenas, médias e grandes, para não enviesar a favor dos perfis de grande alcance.

## Formulação do problema

### Métrica e alto desempenho

| Elemento | Definição recomendada |
|---|---|
| Métrica principal | Taxa de engajamento: (curtidas + comentários) ÷ seguidores |
| Alto desempenho | Os 10% superiores da base pela métrica principal, declarado no README |
| Análise | Frequência de cada categoria no grupo de alto desempenho, com recortes por tema e formato |
| Indicador de lead | Presença de CTA e comentários com intenção de contato |
| Validação | Concordância entre a categorização automática e uma amostra manual de pelo menos 50 publicações |

### Rubrica de categorização

O VLM/LLM responde **só em JSON**, com um objeto fixo por publicação. Campos terminados em `0a10` são notas de 0 a 10.

| Grupo | Campos |
|---|---|
| Formato | `tipo_post` (reels, carrossel, imagem, short), `duracao_faixa`, `formato_video` (talking head, tutorial, bastidores, antes/depois, humor/esquete, depoimento, lista/dicas, trend) |
| Gancho | `hook_primeiros_3s`, `tipo_hook` (pergunta, promessa, dor, número, polêmica, curiosidade), `forca_hook_0a10` |
| Tema | `tema_principal` (vendas, finanças, marketing, atendimento, gestão, motivação, ferramentas/maquininha, história de empreendedor) |
| Pessoas | `tem_rosto`, `criador_e_empreendedor_real`, `prova_social` |
| Texto e edição | `texto_na_tela`, `legenda_tamanho`, `ritmo_cortes_0a10` |
| Linguagem | `tom` (informal, técnico, inspiracional, humorístico), `usa_linguagem_regional`, `clareza_mensagem_0a10` |
| Conversão | `tem_cta`, `tipo_cta` (comentar, salvar, link na bio, DM, seguir), `oferta_ou_beneficio_explicito` |
| Síntese | `elementos_top5` |

### Níveis de ambição

| Nível | O que inclui | Custo e risco |
|---|---|---|
| 1. Mínimo (obrigatório) | Coleta, ranking normalizado, categorização por LLM a partir de legenda e thumbnail e playbook gerado pelo agente | Sem custo; roda no Colab gratuito |
| 2. Recomendado | Nível 1 mais frames e transcrição, rubrica completa por VLM e criativos ligados às publicações de referência | Sem custo dentro dos limites gratuitos; risco de limite de requisições, com modelo local como alternativa |
| 3. Avançado | Nível 2 mais comparação com o resto da base, RAG sobre o grupo de alto desempenho e intenção nos comentários | Mais tempo de processamento; só depois de estabilizar o nível 2 |

### Riscos conhecidos

- **Limites de requisição:** qualquer que seja a rota do Instagram, preveja cache e reenvio com espera (backoff) desde o início.
- **Viés de sobrevivência:** perfis grandes são mais fáceis de achar. Inclua contas menores na amostra.
- **Métrica absoluta favorece contas grandes:** use a métrica normalizada em todas as análises.
- **Padrão não é garantia:** características recorrentes no alto desempenho não garantem resultado. O playbook as apresenta como padrões observados, com exemplos.
- **Limites gratuitos mudam sem aviso:** trate o erro 429 e tenha uma alternativa local.

## Arquitetura de referência

1. **Entrada:** pergunta, objetivo ou pedido de criativo.
2. **Agente orquestrador** (LangGraph), que decide quais ferramentas acionar.
3. **Ferramentas:** consulta à base (ranking e filtros por tema, formato e perfil), busca de publicações de referência semelhantes ao pedido e geração de criativos (roteiro, gancho, legenda e CTA).
4. **Saída:** recomendação ou criativo, com as publicações de referência e a justificativa.
5. **Registro** de cada execução.

Pode ser um agente único ou componentes especializados. O requisito indispensável é a **rastreabilidade**: quem lê o resultado precisa ver em quais publicações reais cada recomendação se apoia. O LLM orquestra, interpreta e redige, mas os dados vêm sempre da base coletada.

### Contrato mínimo da ferramenta

Entradas e saídas validadas com Pydantic.

| Entrada | Descrição |
|---|---|
| `mode` | `analisar`, `recomendar` ou `gerar_criativo` |
| `query` | Pergunta ou objetivo, por exemplo: "quais formatos de Reels mais aparecem no alto desempenho de pequenos negócios de alimentação?" |
| `segment` | Recorte de público ou setor (opcional) |
| `filters` | Plataforma, período e tamanho de perfil (opcional) |

| Saída | Descrição |
|---|---|
| `findings` | Características mais recorrentes no alto desempenho, com frequências |
| `reference_posts` | Publicações usadas como referência: link, métrica e categorias |
| `creatives` | Gancho, roteiro, legenda e CTA, cada um ligado às publicações que o inspiraram |
| `confidence_flag` | Sinaliza quando a característica se apoia em poucas publicações |
| `explanation` | Justificativa em linguagem natural |

## Tecnologias recomendadas

A referência de viabilidade são modelos abertos, execução local e ferramentas gratuitas. Nada é obrigatório; justifique as escolhas no README.

| Camada | Recomendação | Alternativas |
|---|---|---|
| Coleta | Instagram pela rota do kickoff; YouTube com `google-api-python-client` e `yt-dlp` para a mídia de vídeos públicos | Insights da Stone |
| Dados | pandas, Parquet, SQLite | DuckDB, Supabase (plano gratuito) |
| Multimodal | faster-whisper, Gemini Flash-Lite (plano gratuito) ou Qwen2.5-VL local | SmolVLM2, Gemma multimodal |
| Agente | LangGraph + LangChain | Pydantic AI, smolagents |
| Integração | Função Python + servidor MCP (FastMCP) | FastAPI |
| Análise | pandas, Plotly | Matplotlib, Seaborn |
| Demonstração | Streamlit ou Gradio (opcional) | Notebook executável |

## Entregáveis

1. **Base de dados** coletada pelo estudante, documentada, com critérios de seleção e limitações.
2. **Mapeamento do alto desempenho:** ranking normalizado, categorização validada, características recorrentes e perfis em destaque.
3. **Agente funcionando**, que responde sobre engajamento e gera recomendações e criativos ligados às publicações de referência, disponível como função e servidor MCP.
4. **Playbook de conteúdo para a Stone:** características, perfis em destaque, formatos recomendados, exemplos reais e **pelo menos cinco criativos prontos para produção**.
5. **Demonstração executável** com análise, referências, criativo gerado e justificativa.
6. **README:** problema e recorte, base (origem, período, licença e limitações), arquitetura, instalação e execução, modelos e configurações, metodologia, resultados, limitações e próximos passos.

## Critérios de avaliação

- Qualidade e documentação da coleta e da base.
- Coerência técnica da solução.
- Consistência da categorização e rigor sobre o que os dados de fato sustentam.
- Aplicabilidade das recomendações e dos criativos para a Stone.
- Tratamento de limitações, vieses e riscos.
- Reprodutibilidade.
- Qualidade da demonstração.

## Materiais de apoio

- [Understanding Virality: A Rubric-based VLM Framework for Short-Form Edutainment Evaluation](https://arxiv.org/abs/2512.21402): extração de atributos de vídeos curtos com VLM a partir de uma rubrica.
- Documentação: [YouTube Data API v3](https://developers.google.com/youtube/v3), [LangGraph](https://langchain-ai.github.io/langgraph/) e [Model Context Protocol](https://modelcontextprotocol.io). A documentação da rota do Instagram sai no kickoff.
- Ferramentas: [faster-whisper](https://github.com/SYSTRAN/faster-whisper), [Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL) e a [Gemini API](https://ai.google.dev/gemini-api/docs) (compreensão de vídeo e limites de uso).
- Na trilha [ML Preditivo e Agentes](/aulas/ml-preditivo-e-agentes/), os módulos sobre features de vídeo (VLM como extrator estruturado) e sobre servir o agente via MCP cobrem boa parte da base técnica deste case.
