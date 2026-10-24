---
secao: tapi
sidebar_position: 1
sidebar_label: 'Termo de abertura'
title: 'Case Suno Content: Adaptação de Documentos Financeiros'
description: 'O case de setembro com a Suno: adaptar comunicados financeiros densos para três públicos e três formatos, com um avaliador híbrido e determinístico.'
---

# Case Suno Content: Adaptação de Documentos Financeiros

## Contexto

O mercado financeiro publica todo dia comunicados decisivos: atas do Copom, fatos relevantes, relatórios de inflação e releases de resultados trimestrais. São textos técnicos, densos e formais, uma barreira para o investidor iniciante e o intermediário.

Usar um LLM para resumir esses documentos esbarra em dois problemas:

1. **Resumo por encurtamento.** O modelo corta frases ou simplifica o vocabulário de forma ingênua, perde nuances macroeconômicas importantes ou infantiliza a comunicação.
2. **Avaliação subjetiva.** A qualidade costuma ser julgada por outro prompt genérico (LLM-as-a-judge), que sofre de viés de complacência, de viés de extensão (textos longos ganham notas maiores) e não consegue medir densidade conceitual.

Para funcionar em ambientes regulados e profissionais, o sistema não pode ser só um gerador. Ele precisa de uma camada de avaliação **quantitativa, determinística e baseada em dados** (Eval-Driven Development), capaz de medir adequação de tom, fidelidade factual e densidade de terminologia técnica.

## Objetivo

Desenvolver um sistema baseado em grafos com estado que recebe documentos financeiros públicos e gera conteúdo para **3 níveis de sofisticação** (iniciante, intermediário e avançado) em **3 formatos** (texto analítico, carrossel informativo e roteiro de vídeo curto).

O núcleo do projeto é o **Avaliador Híbrido de Calibração e Rigor**: uma suíte automatizada que combina algoritmos linguísticos determinísticos, extração de entidades financeiras e julgamento estruturado para medir se cada nível foi de fato respeitado, sem recorrer a simples encurtamento.

:::tip[Pergunta norteadora]
Como desenhar e avaliar um pipeline de IA que adapta documentos regulatórios e financeiros complexos para públicos e formatos diferentes, com rigor conceitual, vocabulário adequado e fidelidade factual medidos por métricas objetivas e determinísticas?
:::

## Escopo

### Ingestão

Leitura e estruturação de documentos financeiros públicos reais em PDF ou texto, como atas do Copom, fatos relevantes da CVM e releases de resultados da B3.

### Matriz de adaptação

| Público | Regra |
|---|---|
| Iniciante | Nenhum jargão sem uma analogia do dia a dia; foco no impacto prático no bolso |
| Intermediário | Vocabulário padrão de mercado (CDI, Selic, IPCA, dividendos); foco em alocação e tendências |
| Avançado ou institucional | Jargão pleno preservado (curva de juros, forward guidance, hiato do produto, EBITDA ajustado, covenants); foco analítico e metodológico |

| Formato | Estrutura |
|---|---|
| Texto analítico | Artigo para web ou newsletter |
| Carrossel | Slides com gancho, corpo e conclusão |
| Roteiro de vídeo curto | Marcações de tempo, ganchos visuais e fala em até 60 s |

### Avaliação híbrida (o diferencial)

- **Legibilidade estatística:** Flesch-Kincaid adaptado ao português.
- **Domain Term Density Score:** densidade e contextualização de termos técnicos contra um glossário financeiro fixo.
- **Factuality & Grounding Checker:** fidelidade de cada afirmação gerada ao documento fonte.
- **Refinement loop:** rejeita e reprocessa o texto quando as métricas do nível não são atingidas.

### Interface

Visualização comparativa da matriz de saídas e o relatório de métricas por nível.

### Fora do escopo

- Publicação automática em redes sociais (APIs de Instagram, TikTok ou LinkedIn).
- Renderização de vídeo com avatares sintéticos; o foco é o roteiro.
- Análise de mercado em tempo real com cotações em streaming.

## Arquitetura sugerida

### Workflow com estado (LangGraph ou Pydantic AI)

1. **Document Extractor & Anchor:** extrai pontos centrais, números-chave e declarações factuais do documento original.
2. **Audience Adapters:** nós paralelos, um por público.
3. **Format Synthesizers:** estruturam as saídas em artigo, carrossel e roteiro.
4. **Hybrid Evaluator:** roda as métricas determinísticas e um LLM judge estruturado.
5. **Roteamento condicional:** se a nota ficar abaixo do limiar do nível, o grafo faz outra iteração com o relatório de falha no contexto (padrão Reflection).

### Camada de avaliação

- **Léxico:** `textstat` ou uma implementação própria de Flesch Reading Ease adaptada ao português.
- **Glossário e NER:** spaCy ou extração com Pydantic, para detectar termos como "taxa terminal" ou "hiato do produto" no nível iniciante sem analogia antes.
- **Testes:** DeepEval, Ragas ou pytest para asserções automáticas sobre as saídas do pipeline.

### Interface

Streamlit, Gradio ou FastAPI + React: subir o PDF, comparar as versões lado a lado e auditar o painel de métricas.

## Entregáveis

1. **Pipeline de adaptação** cobrindo todos os níveis e formatos, num GitHub com contribuições consistentes.
2. **Suíte de avaliação híbrida:** código reprodutível com métricas determinísticas (legibilidade e densidade de termos) e testes automatizados.
3. **Reflection loop:** demonstração do agente detectando um desvio de nível (por exemplo, um texto iniciante difícil demais) e reescrevendo com base no feedback numérico.
4. **Interface e dashboard:** aplicação web com o conteúdo gerado, a rastreabilidade das fontes e as notas do avaliador.
5. **Vídeo e apresentação técnica:** arquitetura, aplicação funcionando ao vivo, suíte de avaliação em ação e as decisões de engenharia.
6. **Relatório e documentação:** README com a metodologia de avaliação, a matriz de confusão de níveis, os trade-offs de custo e latência e instruções de reprodução.

:::warning[Vídeo é eliminatório]
O vídeo tem no máximo 5 minutos. Sem vídeo, ou com um vídeo que não mostre o código e a interface funcionando de verdade, a entrega técnica é anulada.
:::

## Para estudar

A trilha [Eval-Driven Development](/aulas/eval-driven-development/) cobre a base do avaliador: métricas determinísticas, LLM-as-a-judge estruturado e seus vieses.
