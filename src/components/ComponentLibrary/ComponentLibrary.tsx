import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Brain, Database, Monitor, ChevronRight } from 'lucide-react';
import { ComponentCard } from './ComponentCard';
import { COMPONENT_TEMPLATES, COMPONENT_CATEGORIES } from '../../constants/components';

const ICONS: Record<string, React.ReactNode> = {
  'User Query': <MessageSquare className="w-5 h-5 text-blue-500" />,
  'LLM (OpenAI)': <Brain className="w-5 h-5 text-purple-500" />,
  'Knowledge Base': <Database className="w-5 h-5 text-green-500" />,
  'Output': <Monitor className="w-5 h-5 text-orange-500" />,
};

export const ComponentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredComponents = COMPONENT_TEMPLATES.filter(component => {
    const matchesSearch = component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col min-h-0">
      {/* Chat With AI button */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm text-base font-semibold text-gray-800 hover:bg-gray-100 transition mb-4">
          <span className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span>Chat With AI</span>
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-sm font-semibold text-gray-700 mb-2 mt-2">Components</h2>
      </div>
      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredComponents.map((component) => (
          <div
            key={component.type}
            className="flex items-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 cursor-pointer transition group"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', component.type);
              event.dataTransfer.effectAllowed = 'move';
            }}
          >
            {ICONS[component.label] || <MessageSquare className="w-5 h-5 text-gray-400" />}
            <span className="text-base font-medium text-gray-800 flex-1">{component.label}</span>
          </div>
        ))}
        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No components found</p>
          </div>
        )}
      </div>
    </div>
  );
};