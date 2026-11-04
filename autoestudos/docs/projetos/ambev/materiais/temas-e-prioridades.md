---
secao: guias
sidebar_position: 2
sidebar_label: 'Temas e prioridades'
title: 'Temas e prioridades dos materiais'
description: 'A regra de corte entre trilha geral e materiais da Ambev, os 15 materiais específicos, as 10 aulas gerais e o que reaproveitar da trilha ML Preditivo e Agentes.'
---

# Temas e prioridades dos materiais

## A regra de corte

As trilhas continuam **gerais** e servem a qualquer case. Cada projeto ganha uma seção de **materiais específicos** que cobre só o que é dele.

> Se o tema ajudaria outro case de ML, vai para a **trilha geral**. Se só faz sentido com pizza, Guaraná, território e as fontes do TAPI, vai para `docs/projetos/ambev/materiais/`.

O precedente é `docs/projetos/btg-pactual/materiais/`.

:::info[Estado desta página]
É o plano dos materiais. Os 15 temas já têm página (aparecem como link). Os temas 1 a 4 e 6 a 15 estão em "Material de estudo"; o tema 5 está em "Guias".
:::

---

## O que reaproveitar das trilhas existentes

Cerca de metade do TAPI já está coberta pela trilha ML Preditivo e Agentes e pela trilha de evals. Nesses pontos, o material da Ambev só precisa linkar para a aula e mostrar como ela se aplica à ocasião.

| Exigência do TAPI | Aula existente | Cobertura |
| :--- | :--- | :--- |
| Data Card, LGPD | [Documentação, ética e termos](/aulas/ml-preditivo-e-agentes/formulacao-e-dados/documentacao-etica-e-termos) | Conceito sim, fontes não |
| Instante de previsão, tempo | [O tempo mente](/aulas/ml-preditivo-e-agentes/formulacao-e-dados/o-tempo-mente) | Boa |
| Baseline obrigatório | [Baselines](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/baselines) | Conceito sim, exemplo de regressão |
| Prevenção de leakage | [Vazamento de dados](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/vazamento-de-dados) | Boa |
| Validação temporal e por região | [Validação temporal e por canal](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/validacao-temporal-e-por-canal) | Boa (trocar canal por região) |
| Métricas de classificação e calibração | [Métricas de erro e ordenação](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/metricas-de-erro-e-ordenacao) | **Não cobre** (só regressão) |
| Análise por segmentos | [Análise de erros e ablação](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/analise-de-erros-e-ablacao) | Boa |
| MLflow, pytest (opcional) | [Experimentos rastreáveis](/aulas/ml-preditivo-e-agentes/avaliacao-honesta/experimentos-rastreaveis) | Boa |
| Random Forest, XGBoost, LightGBM | [Gradient Boosting](/aulas/ml-preditivo-e-agentes/gradient-boosting) (6 aulas) | Boa |
| Features de calendário e histórico | [Features do canal e do tempo](/aulas/ml-preditivo-e-agentes/gradient-boosting/features-do-canal-e-do-tempo) | Boa |
| SHAP ou permutation importance, `top_factors` | [SHAP na prática](/aulas/ml-preditivo-e-agentes/incerteza-e-explicabilidade/shap-na-pratica) | Boa |
| Camada generativa (opcional) | [Da explicação à narrativa](/aulas/ml-preditivo-e-agentes/incerteza-e-explicabilidade/da-explicacao-a-narrativa) | Boa |
| Contrato Pydantic | [O LLM orquestra, o modelo prevê](/aulas/ml-preditivo-e-agentes/agente-preditivo-e-mcp/o-llm-orquestra-o-modelo-preve) | Parcial (não tem FastAPI) |
| Vídeo e README | [Demo e README](/aulas/ml-preditivo-e-agentes/agente-preditivo-e-mcp/demo-e-readme) | Boa |
| Drift (opcional) | [Conformal adaptativo e drift](/aulas/ml-preditivo-e-agentes/ir-alem/conformal-adaptativo) | Parcial |
| LLM-as-a-judge para o texto (opcional) | [LLM-as-a-judge e G-Eval](/aulas/eval-driven-development/llm-as-a-judge-e-g-eval) | Boa |

**Não entram no case Ambev:** o módulo 4 inteiro (vídeo e VLM), MCP e LangGraph (o TAPI pede FastAPI e Streamlit) e as aulas de coleta do YouTube.

---

## Materiais específicos da Ambev

São 15 temas. Se o tempo apertar, os de **prioridade alta** cobrem o que o TAPI exige e a biblioteca ainda não tem.

| # | Tema | Etapa | Prioridade | O que resolve |
| :-- | :--- | :--- | :--- | :--- |
| 1 | [Occasion Intelligence: score não é decisão](/projetos/ambev/materiais/occasion-intelligence-score-nao-e-decisao) | Formulação | Alta | As 3 camadas (modelo, Decision Engine, LLM) e o que cada uma pode afirmar |
| 2 | [O target que não existe: ground truth vs. proxy](/projetos/ambev/materiais/o-target-que-nao-existe) | Formulação | Alta | Aplica a aula geral de proxy ao case: o que POF, Vigitel e delivery medem, e por que a ativação nunca é target |
| 3 | [Unidade de análise e formulação do score](/projetos/ambev/materiais/unidade-de-analise-e-formulacao-do-score) | Formulação | Alta | Pedido, consumidor por período ou município por semana; target binário ou de intensidade; significado do Occasion Score definido antes da avaliação |
| 4 | [Instante de previsão com dados de contexto](/projetos/ambev/materiais/instante-de-previsao-com-dados-de-contexto) | Dados | Alta | Clima observado vs. previsto, Trends da mesma semana, feriados conhecidos de antemão |
| 5 | [Guia de fontes e APIs do case](/projetos/ambev/materiais/guia-de-fontes-e-apis) | Dados | Alta | Um lugar só para todas as fontes, com papel, chave de join e limites. Ele não traz código de coleta: cada grupo escreve o seu |
| 6 | [Juntando granularidades no DuckDB](/projetos/ambev/materiais/juntando-granularidades-no-duckdb) | Dados | Alta | Aplica a aula geral de integração: o painel final sem misturar períodos incompatíveis |
| 7 | [EDA da ocasião e features de contexto](/projetos/ambev/materiais/eda-da-ocasiao-e-features-de-contexto) | Dados | Alta | Entregável 2 do TAPI: padrões por dia, período, região e clima; interações como dia por período |
| 8 | [Data Card da ocasião](/projetos/ambev/materiais/data-card-da-ocasiao) | Dados | Média | Template com os itens exigidos pelo TAPI, preenchido para um exemplo |
| 9 | [Baseline "sexta à noite" e Occasion Score](/projetos/ambev/materiais/baseline-sexta-a-noite-e-occasion-score) | Modelo | Alta | Frequência histórica por dia e período, e o que o modelo precisa provar acima dela |
| 10 | [Decision Engine: tabela de regras testável](/projetos/ambev/materiais/decision-engine-tabela-de-regras-testavel) | Decisão | Alta | Score, contexto e fatores para categoria e justificativa, com `pytest` |
| 11 | [Contrato, API e reprodutibilidade](/projetos/ambev/materiais/contrato-api-e-reprodutibilidade) | Aplicação | Média | FastAPI com os 6 campos de saída e metadados de versão na entrada; ambiente fixado com `uv`, Docker se necessário, `pytest` |
| 12 | [Mapa de Oportunidade como regra territorial](/projetos/ambev/materiais/mapa-de-oportunidade-como-regra-territorial) | Decisão | Opcional | Priorizar municípios sem criar uma nova previsão |
| 13 | [Clusterização de contextos](/projetos/ambev/materiais/clusterizacao-de-contextos) | Extra | Opcional | Agrupar contextos parecidos para descrever perfis de ocasião |
| 14 | [Trend Radar](/projetos/ambev/materiais/trend-radar) | Extra | Opcional | Alerta de tendência por cidade, sem tratar busca como consumo |
| 15 | [Laboratório de Preço: protocolo de experimento](/projetos/ambev/materiais/laboratorio-de-preco-protocolo-de-experimento) | Extra | Opcional | Hipótese, grupos de teste e controle, métrica de margem e critério de decisão |

---

## Aulas gerais (entram na trilha 04)

Servem a qualquer case, por isso vão para a trilha geral e não para os materiais da Ambev.

| Tema | Onde encaixa | Por que é geral |
| :--- | :--- | :--- |
| Ground truth vs. proxy: quando o alvo não é observado direto | Módulo 1, depois de "Anatomia de um problema supervisionado" | Todo case com target indireto enfrenta isso: curtidas como proxy de performance, buscas como proxy de consumo |
| Coletando dados de APIs públicas (`httpx`, paginação, rate limit, retry com backoff, cache, coleta incremental, snapshots datados em Parquet) | Módulo 1, generalizando "Construindo o coletor" | A aula atual é presa à YouTube Data API |
| Validando dados na entrada (`pandera` ou Pydantic, testes de qualidade, alerta quando a fonte muda) | Módulo 1, junto da coleta | APIs mudam formato sem aviso |
| Integrando fontes de granularidades diferentes (`merge_asof`, agregação para a unidade de análise, chaves coerentes) | Módulo 1 ou 3, perto de "Features do canal e do tempo" | Juntar fontes com períodos e níveis diferentes é o erro mais comum de integração |
| Dados geoespaciais para ML (`geopandas`, CRS, spatial join, features por área, mapas) | Módulo 3, como bloco de features | Serve a qualquer case com território, loja ou região |
| Scraping e termos de uso (`robots.txt`, ToS, LGPD, quando usar API em vez de scraper) | Módulo 1, junto de "Documentação, ética e termos" | A aula atual trata só das políticas do YouTube |
| Regressão logística (primeiro modelo sério, coeficientes interpretáveis, regularização, pipeline com scikit-learn) | Módulo 3, antes de "Árvores de decisão por dentro" | É o primeiro modelo candidato citado no TAPI e não existe em nenhuma trilha |
| Métricas de classificação e custo dos erros (precision, recall, PR-AUC, escolha de threshold) | Módulo 2, ao lado de "Métricas de erro e ordenação" | A trilha só tem métricas de regressão |
| Desbalanceamento de classes | Módulo 2 ou 3 | Aparece em qualquer target raro |
| Calibração de probabilidade (Brier, curva de confiabilidade, Platt e isotônica) | Módulo 5, antes de "Por que um número só não basta" | Todo score que se apresenta como probabilidade precisa disso |

Um ponto de atenção: a trilha 04 se apresenta como geral, mas os exemplos (Lumina, YouTube, curtidas) são todos da Galaxies. Os módulos 2, 3 e 5 se reaproveitam bem; os módulos 1, 4 e 6 são quase inteiros da Galaxies.

---

## Decisões e perguntas em aberto

**Decisões**
- Aprovar a regra de corte (trilha geral vs. materiais do projeto).
- Escolher quais temas entram na primeira leva (sugestão: os de prioridade alta).
- Decidir se as 10 aulas gerais entram agora na trilha 04 ou depois.
- Definir o exemplo fixo das aulas, no papel que a Lumina tem na Galaxies (sugestão: "Campinas, sexta 20h, chuva" vs. "Recife, terça 13h").
- Decidir se os módulos 1, 4 e 6 da trilha 04 migram para `projetos/galaxies/materiais/`.

**Perguntas em aberto**
1. Existe alguma base pública de pedidos de delivery com data e hora no Brasil? Se não existir, a unidade de análise mais defensável tende a ser **município por período**, com target vindo de POF ou Vigitel, e o material sobre target precisa dizer isso com clareza.
2. Que variável aberta pode representar a **"associação atual à marca"** por segmento, que a regra de awareness do TAPI exige? O Google Trends de "guaraná antarctica" por UF é no máximo um proxy fraco. Se não houver alternativa, a regra precisa ser redesenhada e a limitação documentada.
3. De onde vem o recorte de **"público"** na análise por segmentos? Com fontes abertas, só POF, Vigitel e Censo trazem renda ou classe, e cada um numa granularidade diferente.
