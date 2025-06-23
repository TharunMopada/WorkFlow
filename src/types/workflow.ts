export interface Position {
  x: number;
  y: number;
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  label: string;
  description: string;
  config: Record<string, any>;
  status: 'idle' | 'running' | 'success' | 'error';
}

export type ComponentType = 'userQuery' | 'knowledgeBase' | 'llmEngine' | 'output';

export interface WorkflowNode {
  id: string;
  type: 'workflow';
  position: Position;
  data: ComponentData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'default';
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isValid: boolean;
  lastModified: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  workflowId?: string;
}