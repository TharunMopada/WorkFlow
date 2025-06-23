import React from 'react';
import { Handle, Position } from 'reactflow';
import * as Icons from 'lucide-react';
import { WorkflowNode as WorkflowNodeType } from '../../types/workflow';
import { COMPONENT_TEMPLATES } from '../../constants/components';

interface WorkflowNodeProps {
  data: WorkflowNodeType['data'];
  selected: boolean;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data, selected }) => {
  const template = COMPONENT_TEMPLATES.find(t => t.type === data.type);
  const IconComponent = Icons[template?.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const getStatusColor = () => {
    switch (data.status) {
      case 'running':
        return 'border-yellow-400 bg-yellow-50';
      case 'success':
        return 'border-green-400 bg-green-50';
      case 'error':
        return 'border-red-400 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getStatusIndicator = () => {
    switch (data.status) {
      case 'running':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />;
      case 'success':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className={`
      relative px-4 py-3 rounded-lg border-2 shadow-sm min-w-[200px] max-w-[250px] transition-all duration-200
      ${getStatusColor()}
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      hover:shadow-md
    `}>
      {/* Input Handle */}
      {data.type !== 'userQuery' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      )}

      {/* Node Content */}
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${template?.color || 'bg-gray-500'} flex-shrink-0`}>
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {data.label}
            </h3>
            {getStatusIndicator()}
          </div>
          
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {data.description}
          </p>

          {/* Configuration Preview */}
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.keys(data.config).slice(0, 2).map(key => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {key}
              </span>
            ))}
            {Object.keys(data.config).length > 2 && (
              <span className="text-xs text-gray-500">
                +{Object.keys(data.config).length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Output Handle */}
      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      )}
    </div>
  );
};