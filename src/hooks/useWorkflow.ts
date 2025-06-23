import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Node, Edge, Connection, addEdge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { Workflow, WorkflowNode, WorkflowEdge, ComponentData, ComponentType } from '../types/workflow';
import { COMPONENT_TEMPLATES } from '../constants/components';

export const useWorkflow = () => {
  const [workflow, setWorkflow] = useState<Workflow>({
    id: uuidv4(),
    name: 'Untitled Workflow',
    nodes: [],
    edges: [],
    isValid: false,
    lastModified: new Date()
  });

  const addNode = useCallback((componentType: ComponentType, position: { x: number; y: number }) => {
    const template = COMPONENT_TEMPLATES.find(t => t.type === componentType);
    if (!template) return;

    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'workflow',
      position,
      data: {
        id: uuidv4(),
        type: componentType,
        label: template.label,
        description: template.description,
        config: { ...template.defaultConfig },
        status: 'idle'
      }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      lastModified: new Date()
    }));
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: applyNodeChanges(changes, prev.nodes as Node[]) as WorkflowNode[],
      lastModified: new Date()
    }));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setWorkflow(prev => ({
      ...prev,
      edges: applyEdgeChanges(changes, prev.edges as Edge[]) as WorkflowEdge[],
      lastModified: new Date()
    }));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const newEdge: WorkflowEdge = {
      id: uuidv4(),
      source: connection.source!,
      target: connection.target!,
      type: 'default',
      animated: true
    };

    setWorkflow(prev => ({
      ...prev,
      edges: addEdge(newEdge, prev.edges as Edge[]) as WorkflowEdge[],
      lastModified: new Date()
    }));
  }, []);

  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, config } }
          : node
      ),
      lastModified: new Date()
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      edges: prev.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
      lastModified: new Date()
    }));
  }, []);

  const validateWorkflow = useCallback(() => {
    // Find nodes by type
    const userQueryNode = workflow.nodes.find(node => node.data.type === 'userQuery');
    const knowledgeBaseNode = workflow.nodes.find(node => node.data.type === 'knowledgeBase');
    const llmEngineNode = workflow.nodes.find(node => node.data.type === 'llmEngine');
    const outputNode = workflow.nodes.find(node => node.data.type === 'output');

    // Must have at least userQuery, llmEngine, and output
    if (!userQueryNode || !llmEngineNode || !outputNode) {
      setWorkflow(prev => ({ ...prev, isValid: false, lastModified: new Date() }));
      return false;
    }

    // Helper to find outgoing edge from a node
    const getOutgoing = (nodeId: string) => workflow.edges.find(e => e.source === nodeId);
    // Helper to find incoming edge to a node
    const getIncoming = (nodeId: string) => workflow.edges.find(e => e.target === nodeId);

    // User Query must connect to Knowledge Base or LLM Engine
    const userQueryOut = getOutgoing(userQueryNode.id);
    if (!userQueryOut) {
      setWorkflow(prev => ({ ...prev, isValid: false, lastModified: new Date() }));
      return false;
    }
    let nextNodeId = userQueryOut.target;
    let valid = false;

    if (knowledgeBaseNode && nextNodeId === knowledgeBaseNode.id) {
      // Knowledge Base must connect to LLM Engine
      const kbOut = getOutgoing(knowledgeBaseNode.id);
      if (!kbOut || kbOut.target !== llmEngineNode.id) {
        setWorkflow(prev => ({ ...prev, isValid: false, lastModified: new Date() }));
        return false;
      }
      nextNodeId = kbOut.target;
      valid = true;
    } else if (nextNodeId === llmEngineNode.id) {
      valid = true;
    }

    // LLM Engine must connect to Output
    if (!valid) {
      setWorkflow(prev => ({ ...prev, isValid: false, lastModified: new Date() }));
      return false;
    }
    const llmOut = getOutgoing(llmEngineNode.id);
    if (!llmOut || llmOut.target !== outputNode.id) {
      setWorkflow(prev => ({ ...prev, isValid: false, lastModified: new Date() }));
      return false;
    }

    setWorkflow(prev => ({ ...prev, isValid: true, lastModified: new Date() }));
    return true;
  }, [workflow.nodes, workflow.edges]);

  const clearWorkflow = useCallback(() => {
    setWorkflow({
      id: uuidv4(),
      name: 'Untitled Workflow',
      nodes: [],
      edges: [],
      isValid: false,
      lastModified: new Date()
    });
  }, []);

  return {
    workflow,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeConfig,
    deleteNode,
    validateWorkflow,
    clearWorkflow
  };
};