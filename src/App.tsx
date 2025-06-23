import React, { useState, useCallback } from 'react';
import { 
  ReactFlowProvider, 
  ReactFlow, 
  Node, 
  Edge, 
  addEdge, 
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './components/Sidebar';
import WorkflowNode from './components/WorkflowNode';
import ChatModal from './components/ChatModal';
import ConfigPanel from './components/ConfigPanel';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { ComponentType } from './types';
import { AuthProvider, useAuth } from './hooks/useAuth';

const nodeTypes = {
  workflow: WorkflowNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function AppContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user } = useAuth();

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'workflow',
        position,
        data: { 
          componentType: type as ComponentType,
          label: getComponentLabel(type as ComponentType),
          config: getDefaultConfig(type as ComponentType)
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const getComponentLabel = (type: ComponentType): string => {
    switch (type) {
      case 'userQuery': return 'User Query';
      case 'llmEngine': return 'LLM (OpenAI)';
      case 'knowledgeBase': return 'Knowledge Base';
      case 'output': return 'Output';
      default: return 'Component';
    }
  };

  const getDefaultConfig = (type: ComponentType) => {
    switch (type) {
      case 'userQuery':
        return { placeholder: 'Enter your query here...' };
      case 'llmEngine':
        return { 
          model: 'GPT 4o+ Mini',
          apiKey: '',
          temperature: 0.7,
          webSearchEnabled: false,
          serpApiKey: ''
        };
      case 'knowledgeBase':
        return { 
          files: [],
          fileAnalyses: [],
          embeddingModel: 'text-embedding-3-large'
        };
      case 'output':
        return { format: 'text' };
      default:
        return {};
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigPanelOpen(true);
  }, []);

  const updateNodeConfig = useCallback((nodeId: string, newConfig: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: newConfig } }
          : node
      )
    );
  }, [setNodes]);

  const buildStack = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Validate workflow logic here
    console.log('Building stack with nodes:', nodes);
    console.log('Edges:', edges);
    
    // Show success message
    alert('Workflow built successfully! You can now chat with your stack.');
  };

  const chatWithStack = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (nodes.length === 0) {
      alert('Please build your workflow first!');
      return;
    }
    setIsChatModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Background color="#e5e7eb" gap={20} />
              <Controls 
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                showInteractive={false}
              />
              
              {nodes.length === 0 && (
                <Panel position="center">
                  <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop to get started</h3>
                    <p className="text-gray-600">Build your AI workflow by dragging components from the sidebar</p>
                  </div>
                </Panel>
              )}
              
              <Panel position="bottom-right" className="mb-4 mr-4">
                <div className="flex gap-3">
                  <button
                    onClick={buildStack}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
                  >
                    Build Stack
                  </button>
                  <button
                    onClick={chatWithStack}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with Stack
                  </button>
                </div>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {isConfigPanelOpen && selectedNode && (
          <ConfigPanel
            node={selectedNode}
            onClose={() => setIsConfigPanelOpen(false)}
            onUpdateConfig={updateNodeConfig}
          />
        )}
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        workflow={{ nodes, edges }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;