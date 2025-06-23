import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ComponentType } from '../../types/workflow';
import { WorkflowNode } from './WorkflowNode';
import { useWorkflow } from '../../hooks/useWorkflow';

const nodeTypes = {
  workflow: WorkflowNode,
};

interface WorkflowCanvasProps {
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ selectedNodeId, onNodeSelect }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { workflow, addNode, onNodesChange, onEdgesChange, onConnect } = useWorkflow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const componentType = event.dataTransfer.getData('application/reactflow') as ComponentType;

      if (typeof componentType === 'undefined' || !componentType || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(componentType, position);
    },
    [reactFlowInstance, addNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    onNodeSelect(node.id);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="flex-1 bg-gray-50" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={workflow.nodes.map(node => ({
          ...node,
          selected: node.id === selectedNodeId
        }))}
        edges={workflow.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionLineType="smoothstep"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2 }
        }}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls className="bg-white border border-gray-300" />
        <MiniMap
          className="bg-white border border-gray-300"
          nodeColor="#9ca3af"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};