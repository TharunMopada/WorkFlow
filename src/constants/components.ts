import { ComponentType } from '../types/workflow';

export interface ComponentTemplate {
  type: ComponentType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  defaultConfig: Record<string, any>;
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'userQuery',
    label: 'User Query',
    description: 'Accepts user input and starts the workflow',
    icon: 'MessageSquare',
    color: 'bg-blue-500',
    category: 'Input',
    defaultConfig: {
      placeholder: 'Enter your question...',
      maxLength: 500,
      required: true
    }
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    description: 'Process documents and retrieve relevant context',
    icon: 'Database',
    color: 'bg-green-500',
    category: 'Data',
    defaultConfig: {
      supportedFormats: ['pdf', 'txt', 'docx'],
      chunkSize: 1000,
      overlap: 200,
      embeddingModel: 'text-embedding-ada-002',
      similarity: 0.7
    }
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    description: 'Generate responses using language models',
    icon: 'Brain',
    color: 'bg-purple-500',
    category: 'AI',
    defaultConfig: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      useWebSearch: false,
      systemPrompt: 'You are a helpful assistant.'
    }
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Display final results to users',
    icon: 'Monitor',
    color: 'bg-orange-500',
    category: 'Output',
    defaultConfig: {
      format: 'chat',
      showMetadata: false,
      enableFollowUp: true
    }
  }
];

export const COMPONENT_CATEGORIES = [
  'All',
  ...Array.from(new Set(COMPONENT_TEMPLATES.map(c => c.category)))
];