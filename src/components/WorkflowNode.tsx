import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, Bot, Database, ArrowRight } from 'lucide-react';
import { ComponentType } from '../types';

const getNodeIcon = (type: ComponentType) => {
  switch (type) {
    case 'userQuery': return MessageSquare;
    case 'llmEngine': return Bot;
    case 'knowledgeBase': return Database;
    case 'output': return ArrowRight;
    default: return MessageSquare;
  }
};

const getNodeColor = (type: ComponentType) => {
  switch (type) {
    case 'userQuery': return 'from-blue-500 to-blue-600';
    case 'llmEngine': return 'from-purple-500 to-purple-600';
    case 'knowledgeBase': return 'from-green-500 to-green-600';
    case 'output': return 'from-orange-500 to-orange-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getNodeBorder = (type: ComponentType) => {
  switch (type) {
    case 'userQuery': return 'border-blue-200';
    case 'llmEngine': return 'border-purple-200';
    case 'knowledgeBase': return 'border-green-200';
    case 'output': return 'border-orange-200';
    default: return 'border-gray-200';
  }
};

const WorkflowNode: React.FC<NodeProps> = ({ data, selected }) => {
  const IconComponent = getNodeIcon(data.componentType);
  const colorClass = getNodeColor(data.componentType);
  const borderClass = getNodeBorder(data.componentType);

  return (
    <div className={`bg-white rounded-lg border-2 ${selected ? borderClass : 'border-gray-200'} shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px]`}>
      {data.componentType !== 'userQuery' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
        
        <div className="text-sm text-gray-600">
          {data.componentType === 'userQuery' && 'Enter point for user queries'}
          {data.componentType === 'llmEngine' && `Run a query with ${data.config?.model || 'OpenAI'} LLM`}
          {data.componentType === 'knowledgeBase' && 'File for Knowledge Base'}
          {data.componentType === 'output' && 'Output will be generated based on query'}
        </div>
        
        {data.componentType === 'knowledgeBase' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>APIguard_file.Pdf</span>
            </div>
          </div>
        )}
        
        {data.componentType === 'llmEngine' && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-500">
              <div>• CONTEXT (contents)</div>
              <div>• User Query (query)</div>
            </div>
          </div>
        )}
        
        {data.componentType === 'output' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Output</span>
            </div>
          </div>
        )}
      </div>
      
      {data.componentType !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
    </div>
  );
};

export default WorkflowNode;