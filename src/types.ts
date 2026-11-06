export interface Picture {
  asset: string;
  alt: string;
  caption?: string;
}

export interface Option {
  id: string;
  label: string;
  picture?: Picture;
}

export type StepKind = 'hypothesis' | 'detail' | 'explore' | 'quiz' | 'bulb' | 'plant'
  | 'order' | 'map' | 'night' | 'spots' | 'reveal' | 'reflection';

export interface Step {
  id: string;
  station: number;
  kind: StepKind;
  title: string;
  text?: string;
  pictures?: Picture[];
  options?: Option[];
  accepted?: string[];
  hint?: string;
  explanation?: string;
  nextLabel?: string;
  atlas?: string[];
  extra?: 'houseplants' | 'traces';
}

export type AnswerStatus = 'answering' | 'hint' | 'correct' | 'revealed';
export interface Answer {
  selected: string[];
  attempts: number;
  status: AnswerStatus;
}

export type BaseView = 'home' | 'lesson' | 'pause' | 'complete' | 'discoveries' | 'discovery';
export type View = BaseView | 'atlas' | 'sources';
export type Group = 'plants' | 'birds' | 'insects';

export interface LessonState {
  version: 1;
  status: 'new' | 'active' | 'completed';
  view: View;
  returnView: BaseView;
  stepId: string;
  hypothesis: string | null;
  detail: string | null;
  answers: Record<string, Answer>;
  discoveries: Record<string, string[]>;
  dots: string[];
  countMode: boolean;
  atlasGroup: Group;
  atlasPair: string[];
  discoveryId: string;
}

export interface AtlasCard {
  id: string;
  group: Group;
  name: string;
  asset: string;
  description: string;
}

export interface AssetCredit {
  id: string;
  file: string;
  name: string;
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
  modifications: string;
  sha256: string;
}
