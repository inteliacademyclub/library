---
secao: guias
sidebar_position: 1
sidebar_label: 'Fontes e APIs do case'
title: 'Fontes e APIs do case'
description: 'As fontes abertas do case Ambev, com o papel de cada uma (ground truth, contexto ou proxy), a chave de join e os cuidados de uso.'
---

# Fontes e APIs do case

O TAPI cita 11 fontes. Ao lado delas, há 6 fontes abertas que ele não menciona e que resolvem problemas reais do case: o join territorial, a oferta de restaurantes e o vazamento do clima. Cada fonte cumpre um **papel diferente**, e isso precisa ficar explícito, porque o TAPI **proíbe usar proxy de interesse como target**.

:::warning[O gargalo do case é o ground truth]
Nenhuma fonte aberta tem pizza com Guaraná por dia e município. Escolher e justificar o target é a decisão mais importante do projeto. Veja [Temas e prioridades](/projetos/ambev/materiais/temas-e-prioridades).
:::

## Ground truth

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **POF 2017-2018** (IBGE) | Sim | Consumo alimentar pessoal: 2 recordatórios de 24 h, 46.164 pessoas acima de 10 anos. Pizza e refrigerante estão entre os itens mais consumidos fora de casa (Rev. Saúde Pública, 2021). | Pesquisa de 2017-2018, sem granularidade semanal. Serve para afinidade por perfil, não para série temporal. |
| **Vigitel** (Ministério da Saúde) | Sim (parcial) | Refrigerante em 5 ou mais dias por semana; 27 capitais; 21.690 entrevistas em 2023. | Não mede pizza. Só cobre capitais, com resultado anual. |
| **Pedidos de delivery** | Sim (exemplo) | O único ground truth com dia e horário. | Não é público. Exige parceiro ou base aberta de terceiros. |

## Contexto: clima

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **Open-Meteo** | Sim | Reanálise ERA5 desde 1940, com temperatura e chuva por hora e por coordenada. | Usa clima **observado**, que vaza se o instante de previsão é anterior ao dia. |
| **Open-Meteo Previous Runs** | Não | O valor previsto 1 a 7 dias antes de cada horário (`_previous_day1` = 24 h antes), ou seja, o que se sabia no instante de previsão. | Na maioria dos modelos, só existe desde jan/2024. A Historical Forecast API, apesar do nome, emenda só as primeiras horas de cada rodada e não serve para isso. |
| **INMET, estações automáticas** | Sim | Medição oficial por estação. | Estações esparsas e com falhas. Precisa mapear estação para município. |

## Contexto: calendário e território

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **BrasilAPI, feriados** | Sim | Feriados nacionais por ano. | Só nacionais. Feriados municipais ficam faltando. |
| **IBGE SIDRA (Censo 2022)** | Sim | População, renda e domicílios por município. | Dado estático: trate como foto, não como série. |
| **API de Localidades do IBGE** | Não | Códigos IBGE de município, UF e região: a **chave de todos os joins**. | |
| **geobr (IPEA)** | Não | Malhas de municípios e setores censitários em Python, para mapas e joins espaciais. | |

## Contexto: oferta

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **Overpass / OSM** | Sim | Contagem de pizzarias (`cuisine=pizza`) por área. | A cobertura do OSM varia muito entre cidades. |
| **CNPJ da Receita Federal** | Não | Restaurantes e lanchonetes ativos por município, via CNAE. | Não existe CNAE específico de pizzaria. Serve para checar a cobertura do OSM. |
| **Base dos Dados** | Não | Censo, CNPJ e outras bases já tratadas no BigQuery. | Exige conta no Google Cloud. Confira a versão de cada tabela. |

## Proxy de interesse

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **Google Trends (`pytrends`)** | Sim | Interesse relativo (0 a 100) por UF e período. | O `pytrends` foi arquivado em 17/04/2025. **Nunca use como target.** |
| **Google Trends API oficial (alpha) / `trendspy`** | Não | Escala consistente entre requisições (alpha). | A alpha é restrita por inscrição. O `trendspy` é não oficial. |

## Dados de parceiro e preço

| Fonte | No TAPI? | O que dá para tirar | Cuidado |
| :--- | :--- | :--- | :--- |
| **Open Delivery (Abrasel)** | Sim | Cardápio, pedidos e status num formato único. | É uma especificação, não uma base. Os dados só vêm de um restaurante parceiro. |
| **Scrapers do iFood** (`ifood-scraper` e outros) | Sim | Preço de vitrine. | O próprio TAPI alerta: sem licença, sujeito aos termos da plataforma e à LGPD, e não comprova vendas. |

## Como escolher

- **Papel antes de fonte.** Decida o que é target (ground truth), o que é feature (contexto) e o que é só sinal de interesse (proxy). Só depois escolha as fontes.
- **Granularidades incompatíveis não se misturam.** POF e Vigitel não têm série semanal; Trends e clima têm. Use chaves coerentes e documente a integração no Data Card.
- **Clima e instante de previsão.** Se você prevê antes do dia, use a previsão emitida antes dele (Previous Runs API), não o observado.
- **Cobertura.** Dado de OSM e INMET é irregular entre cidades. Cruze com o CNPJ e documente o que ficou de fora.
