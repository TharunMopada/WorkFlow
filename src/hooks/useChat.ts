import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Workflow } from '../types/workflow';
import { COMPONENT_TEMPLATES } from '../constants/components';
import { askOpenAI } from '../services/openaiService';

export const useChat = (workflow?: Workflow) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant' | 'system', workflowId?: string) => {
    const message: ChatMessage = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      workflowId
    };

    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const sendMessage = useCallback(async (content: string, workflowId: string) => {
    setIsLoading(true);
    addMessage(content, 'user', workflowId);

    try {
      const lowerContent = content.toLowerCase();
      if (
        lowerContent.includes('available components') ||
        lowerContent.includes('components i can use') ||
        lowerContent.includes('list of components')
      ) {
        const componentList = COMPONENT_TEMPLATES.map(c => `- ${c.label}: ${c.description}`).join('\n');
        const response = `Here are the available components you can use in your workflow:\n\n${componentList}`;
        addMessage(response, 'assistant', workflowId);
        return;
      }

      // Extract LLM config
      let context = 'Sample extracted text from uploaded PDF.';
      let promptPrefix = '';
      let promptSuffix = '';
      let webSearchEnabled = false;
      let apiKey = '';
      let model = 'gpt-3.5-turbo';
      let temperature = 0.7;
      let maxTokens = 1000;
      if (workflow) {
        const kbNode = workflow.nodes.find(n => n.data.type === 'knowledgeBase');
        if (kbNode && kbNode.data.config.uploadStatus) {
          context = kbNode.data.config.extractedText || `Extracted text from: ${kbNode.data.config.uploadedFileName || 'document.pdf'} (${kbNode.data.config.uploadStatus})`;
        }
        const llmNode = workflow.nodes.find(n => n.data.type === 'llmEngine');
        if (llmNode) {
          promptPrefix = llmNode.data.config.promptPrefix || '';
          promptSuffix = llmNode.data.config.promptSuffix || '';
          webSearchEnabled = !!llmNode.data.config.useWebSearch;
          apiKey = llmNode.data.config.apiKey || '';
          model = llmNode.data.config.model || model;
          temperature = llmNode.data.config.temperature ?? temperature;
          maxTokens = llmNode.data.config.maxTokens ?? maxTokens;
        }
      }
      if (!apiKey) {
        addMessage('OpenAI API key is missing. Please enter it in the LLM node configuration.', 'system', workflowId);
        return;
      }
      // Build prompt
      const prompt = `${promptPrefix}Answer the following user question: "${content}"${promptSuffix}`;
      const finalPrompt = webSearchEnabled ? prompt + '\n\nYou may use current web data from search if relevant.' : prompt;
      // Call OpenAI
      const aiResponse = await askOpenAI({
        apiKey,
        prompt: finalPrompt,
        context,
        model,
        temperature,
        maxTokens,
      });
      addMessage(aiResponse, 'assistant', workflowId);
    } catch (error) {
      addMessage('Sorry, there was an error processing your request.', 'system', workflowId);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, workflow]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    addMessage,
    sendMessage,
    clearMessages
  };
};