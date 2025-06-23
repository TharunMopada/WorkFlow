import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ToggleLeft, ToggleRight, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Node } from '@xyflow/react';
import { FileAnalysis } from '../types';
import { analyzeFile } from '../services/fileService';

interface ConfigPanelProps {
  node: Node;
  onClose: () => void;
  onUpdateConfig: (nodeId: string, config: any) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ node, onClose, onUpdateConfig }) => {
  const [config, setConfig] = useState(node.data.config || {});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setConfig(node.data.config || {});
    setUploadedFiles(node.data.config?.files || []);
    setFileAnalyses(node.data.config?.fileAnalyses || []);
  }, [node]);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdateConfig(node.id, newConfig);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadedFiles(prev => [...prev, ...files]);
    setIsAnalyzing(true);

    try {
      const analyses = await Promise.all(
        files.map(file => analyzeFile(file))
      );
      
      const newAnalyses = [...fileAnalyses, ...analyses];
      setFileAnalyses(newAnalyses);
      
      const newConfig = {
        ...config,
        files: [...uploadedFiles, ...files],
        fileAnalyses: newAnalyses
      };
      
      setConfig(newConfig);
      onUpdateConfig(node.id, newConfig);
    } catch (error) {
      console.error('Error analyzing files:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newAnalyses = fileAnalyses.filter((_, i) => i !== index);
    
    setUploadedFiles(newFiles);
    setFileAnalyses(newAnalyses);
    
    const newConfig = {
      ...config,
      files: newFiles,
      fileAnalyses: newAnalyses
    };
    
    setConfig(newConfig);
    onUpdateConfig(node.id, newConfig);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderUserQueryConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter point for queries
        </label>
        <input
          type="text"
          value={config.placeholder || ''}
          onChange={(e) => handleConfigChange('placeholder', e.target.value)}
          placeholder="Write your query here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Query</label>
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-md">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Query</span>
        </div>
      </div>
    </div>
  );

  const renderLLMEngineConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Run a query with OpenAI LLM
        </label>
        <select
          value={config.model || 'GPT 4o+ Mini'}
          onChange={(e) => handleConfigChange('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>GPT 4o+ Mini</option>
          <option>GPT-4</option>
          <option>GPT-3.5 Turbo</option>
          <option>Gemini Pro</option>
          <option>Claude 3</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
        <input
          type="password"
          value={config.apiKey || ''}
          onChange={(e) => handleConfigChange('apiKey', e.target.value)}
          placeholder="••••••••••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => handleConfigChange('prompt', e.target.value)}
          placeholder="You are a helpful PDF assistant. Use web search if the PDF lacks context"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">{config.temperature || 0.7}</div>
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">WebSearch Tool</label>
          <button
            onClick={() => handleConfigChange('webSearchEnabled', !config.webSearchEnabled)}
            className="flex items-center"
          >
            {config.webSearchEnabled ? (
              <ToggleRight className="w-6 h-6 text-green-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {config.webSearchEnabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SERP API</label>
          <input
            type="password"
            value={config.serpApiKey || ''}
            onChange={(e) => handleConfigChange('serpApiKey', e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );

  const renderKnowledgeBaseConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          File for Knowledge Base
        </label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Drop files here or click to upload</p>
          <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX, TXT files</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Embedding Model</label>
        <select
          value={config.embeddingModel || 'text-embedding-3-large'}
          onChange={(e) => handleConfigChange('embeddingModel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>text-embedding-3-large</option>
          <option>text-embedding-3-small</option>
          <option>text-embedding-ada-002</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
        <input
          type="password"
          value={config.apiKey || ''}
          onChange={(e) => handleConfigChange('apiKey', e.target.value)}
          placeholder="••••••••••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* File Analysis Results */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Uploaded Files</label>
          {uploadedFiles.map((file, index) => {
            const analysis = fileAnalyses[index];
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    {analysis?.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {analysis?.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Size: {formatFileSize(file.size)}</div>
                  <div>Type: {file.type || 'Unknown'}</div>
                  {analysis && (
                    <>
                      <div>Pages: {analysis.pageCount || 'N/A'}</div>
                      <div>Word Count: {analysis.wordCount || 'N/A'}</div>
                      {analysis.extractedText && (
                        <div className="mt-2">
                          <div className="font-medium">Preview:</div>
                          <div className="bg-white p-2 rounded text-xs max-h-20 overflow-y-auto">
                            {analysis.extractedText.substring(0, 200)}...
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span>Analyzing files...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderOutputConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output will be generated based on query
        </label>
        <p className="text-sm text-gray-600">
          Output of this will not nodes as text
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Output Text</label>
        <textarea
          value={config.outputText || ''}
          onChange={(e) => handleConfigChange('outputText', e.target.value)}
          placeholder="Output will be generated based on query"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
        />
      </div>
      
      <div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Output</span>
        </div>
      </div>
    </div>
  );

  const renderConfigContent = () => {
    switch (node.data.componentType) {
      case 'userQuery':
        return renderUserQueryConfig();
      case 'llmEngine':
        return renderLLMEngineConfig();
      case 'knowledgeBase':
        return renderKnowledgeBaseConfig();
      case 'output':
        return renderOutputConfig();
      default:
        return <div>No configuration available</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{node.data.label}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {renderConfigContent()}
      </div>
    </div>
  );
};

export default ConfigPanel;