// Componentes disponíveis em qualquer .md/.mdx, sem import.
import type {ComponentProps} from 'react';
import type {MDXComponents} from 'mdx/types';
import DocLink from '@/components/site/DocLink';
import {withBase} from '@/lib/base';
import {Callout} from './Callout';
import {Pre} from './CodeBlock';

import Sketch from '@/components/aula/Sketch';
import LessonMeta from '@/components/aula/LessonMeta';
import Quiz from '@/components/aula/Quiz';
import Checklist from '@/components/aula/Checklist';
import Termo, {Glossario} from '@/components/aula/Termo';
import {PaperCard, ToolCard, CardGrid, NoProjeto} from '@/components/aula/Cards';

import AgentTrace from '@/components/interativos/AgentTrace';
import BoostingPlayground from '@/components/interativos/BoostingPlayground';
import EmbeddingMap from '@/components/interativos/EmbeddingMap';
import IntervalExplorer from '@/components/interativos/IntervalExplorer';
import LeakageDetective from '@/components/interativos/LeakageDetective';
import LongTailExplorer from '@/components/interativos/LongTailExplorer';
import McpFlow from '@/components/interativos/McpFlow';
import MetricsPlayground from '@/components/interativos/MetricsPlayground';
import PipelineMap from '@/components/interativos/PipelineMap';
import QuotaCalculator from '@/components/interativos/QuotaCalculator';
import ShapWaterfall from '@/components/interativos/ShapWaterfall';
import ShapleyGame from '@/components/interativos/ShapleyGame';
import SplitExplorer from '@/components/interativos/SplitExplorer';
import TreeSplitter from '@/components/interativos/TreeSplitter';
import VideoToFeatures from '@/components/interativos/VideoToFeatures';
import VlmBudgetCalculator from '@/components/interativos/VlmBudgetCalculator';
import WhatIfSimulator from '@/components/interativos/WhatIfSimulator';

function A({href = '', ...rest}: ComponentProps<'a'>) {
  // âncoras de títulos e links internos ficam no site
  return <DocLink href={href} {...rest} />;
}

function Img({src, alt = '', ...rest}: ComponentProps<'img'>) {
  const url = typeof src === 'string' ? withBase(src) : undefined;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} loading="lazy" decoding="async" {...rest} />;
}

function Table(props: ComponentProps<'table'>) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  a: A,
  img: Img,
  pre: Pre,
  table: Table,
  Callout,
  Sketch,
  LessonMeta,
  Quiz,
  Checklist,
  Termo,
  Glossario,
  PaperCard,
  ToolCard,
  CardGrid,
  NoProjeto,
  AgentTrace,
  BoostingPlayground,
  EmbeddingMap,
  IntervalExplorer,
  LeakageDetective,
  LongTailExplorer,
  McpFlow,
  MetricsPlayground,
  PipelineMap,
  QuotaCalculator,
  ShapWaterfall,
  ShapleyGame,
  SplitExplorer,
  TreeSplitter,
  VideoToFeatures,
  VlmBudgetCalculator,
  WhatIfSimulator,
};
