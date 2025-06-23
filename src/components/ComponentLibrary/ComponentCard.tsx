import React from 'react';
import * as Icons from 'lucide-react';
import { ComponentTemplate } from '../../constants/components';

interface ComponentCardProps {
  component: ComponentTemplate;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const IconComponent = Icons[component.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', component.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="p-4 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${component.color}`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {component.label}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {component.description}
          </p>
          
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {component.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};