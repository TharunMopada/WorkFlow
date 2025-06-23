import React from 'react';
import { Settings, Trash2, Copy } from 'lucide-react';
import { WorkflowNode } from '../../types/workflow';
import { ConfigForm } from './ConfigForm';

interface ConfigurationPanelProps {
  selectedNode: WorkflowNode | null;
  onConfigUpdate: (nodeId: string, config: Record<string, any>) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  selectedNode,
  onConfigUpdate,
  onDeleteNode
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Configuration</h3>
          <p className="text-sm">Select a component to configure its settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Copy node configuration
                navigator.clipboard.writeText(JSON.stringify(selectedNode.data.config, null, 2));
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy configuration"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteNode(selectedNode.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete component"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{selectedNode.data.label}</h3>
            <p className="text-xs text-gray-600">{selectedNode.data.description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ConfigForm
          nodeType={selectedNode.data.type}
          config={selectedNode.data.config}
          onConfigChange={(config) => onConfigUpdate(selectedNode.id, config)}
        />
      </div>
    </div>
  );
};