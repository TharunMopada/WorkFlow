export type ComponentType = 'userQuery' | 'llmEngine' | 'knowledgeBase' | 'output';

export interface ComponentConfig {
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    componentType: ComponentType;
    label: string;
    config: ComponentConfig;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: any[];
}

export interface FileAnalysis {
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'success' | 'error' | 'processing';
  extractedText?: string;
  wordCount?: number;
  pageCount?: number;
  error?: string;
  metadata?: {
    lastModified: Date;
    encoding: string;
    [key: string]: any;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}