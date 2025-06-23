import React from 'react';
import { MessageSquare, Bot, Database, ArrowRight, Search } from 'lucide-react';
import { ComponentType } from '../types';

const components = [
  {
    type: 'userQuery' as ComponentType,
    label: 'User Query',
    icon: MessageSquare,
    description: 'Input component for user queries',
    color: 'from-blue-500 to-blue-600'
  },
  {
    type: 'llmEngine' as ComponentType,
    label: 'LLM (OpenAI)',
    icon: Bot,
    description: 'Language model processing',
    color: 'from-purple-500 to-purple-600'
  },
  {
    type: 'knowledgeBase' as ComponentType,
    label: 'Knowledge Base',
    icon: Database,
    description: 'Document storage and retrieval',
    color: 'from-green-500 to-green-600'
  },
  {
    type: 'output' as ComponentType,
    label: 'Output',
    icon: ArrowRight,
    description: 'Display results and responses',
    color: 'from-orange-500 to-orange-600'
  }
];

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: ComponentType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Chat With AI</h2>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-gray-600 font-medium">Components</div>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-3">
        {components.map((component) => {
          const IconComponent = component.icon;
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => onDragStart(e, component.type)}
              className="group p-4 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-lg cursor-move transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${component.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm group-hover:text-gray-700 transition-colors">
                    {component.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {component.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="w-4 h-4" />
            <span>Web Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;