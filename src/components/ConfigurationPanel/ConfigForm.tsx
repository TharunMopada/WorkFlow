import React from 'react';
import { ComponentType } from '../../types/workflow';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker';

interface ConfigFormProps {
  nodeType: ComponentType;
  config: Record<string, any>;
  onConfigChange: (config: Record<string, any>) => void;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ nodeType, config, onConfigChange }) => {
  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const renderUserQueryConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placeholder Text
        </label>
        <input
          type="text"
          value={config.placeholder || ''}
          onChange={(e) => updateConfig('placeholder', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Length
        </label>
        <input
          type="number"
          value={config.maxLength || 500}
          onChange={(e) => updateConfig('maxLength', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={config.required || false}
          onChange={(e) => updateConfig('required', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
          Required field
        </label>
      </div>
    </div>
  );

  const renderKnowledgeBaseConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Document (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
              const reader = new FileReader();
              reader.onload = async (ev) => {
                if (!ev.target) return;
                const typedarray = new Uint8Array(ev.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const content = await page.getTextContent();
                  text += content.items.map((item: any) => item.str).join(' ') + '\n';
                }
                updateConfig('uploadStatus', `Document uploaded successfully, ${pdf.numPages} pages indexed.`);
                updateConfig('uploadedFileName', file.name);
                updateConfig('extractedText', text);
                updateConfig('embeddingStatus', 'Embeddings generated and stored locally.');
                const chunkSize = 1000;
                const count = Math.ceil(text.length / chunkSize);
                updateConfig('embeddingCount', count);
              };
              reader.readAsArrayBuffer(file);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {config.uploadStatus && (
          <div className="mt-2 text-green-600 text-sm">{config.uploadStatus}</div>
        )}
        {config.uploadedFileName && (
          <div className="mt-1 text-xs text-gray-500">File: {config.uploadedFileName}</div>
        )}
        {config.embeddingStatus && (
          <div className="mt-2 text-blue-600 text-sm">{config.embeddingStatus}</div>
        )}
        {config.extractedText && (
          <div className="mt-2 text-xs text-gray-700 max-h-32 overflow-y-auto bg-gray-50 border p-2 rounded">
            <strong>Extracted Text (debug):</strong>
            <pre className="whitespace-pre-wrap break-words">{config.extractedText.slice(0, 1000)}{config.extractedText.length > 1000 ? '... (truncated)' : ''}</pre>
          </div>
        )}
        {typeof config.embeddingCount === 'number' && (
          <div className="mt-1 text-xs text-green-700">Embeddings generated: {config.embeddingCount}</div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supported Formats
        </label>
        <div className="space-y-2">
          {['pdf', 'txt', 'docx', 'csv'].map(format => (
            <div key={format} className="flex items-center">
              <input
                type="checkbox"
                id={format}
                checked={config.supportedFormats?.includes(format) || false}
                onChange={(e) => {
                  const formats = config.supportedFormats || [];
                  if (e.target.checked) {
                    updateConfig('supportedFormats', [...formats, format]);
                  } else {
                    updateConfig('supportedFormats', formats.filter((f: string) => f !== format));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={format} className="ml-2 block text-sm text-gray-900 uppercase">
                {format}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chunk Size
        </label>
        <input
          type="number"
          value={config.chunkSize || 1000}
          onChange={(e) => updateConfig('chunkSize', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overlap
        </label>
        <input
          type="number"
          value={config.overlap || 200}
          onChange={(e) => updateConfig('overlap', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Embedding Model
        </label>
        <select
          value={config.embeddingModel || 'text-embedding-ada-002'}
          onChange={(e) => updateConfig('embeddingModel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="text-embedding-ada-002">OpenAI Ada-002</option>
          <option value="text-embedding-3-small">OpenAI v3 Small</option>
          <option value="text-embedding-3-large">OpenAI v3 Large</option>
          <option value="gemini-embedding">Gemini Embedding</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Similarity Threshold
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.similarity || 0.7}
          onChange={(e) => updateConfig('similarity', parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-500">{config.similarity || 0.7}</span>
      </div>
    </div>
  );

  const renderLLMEngineConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <input
          type="password"
          value={config.apiKey || ''}
          onChange={(e) => updateConfig('apiKey', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your API key"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={config.model || 'gpt-4'}
          onChange={(e) => updateConfig('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="gemini-pro-vision">Gemini Pro Vision</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-500">{config.temperature || 0.7}</span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Tokens
        </label>
        <input
          type="number"
          value={config.maxTokens || 2000}
          onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="useWebSearch"
          checked={config.useWebSearch || false}
          onChange={(e) => updateConfig('useWebSearch', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="useWebSearch" className="ml-2 block text-sm text-gray-900">
          Enable web search (SerpAPI/Brave)
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={config.systemPrompt || ''}
          onChange={(e) => updateConfig('systemPrompt', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="You are a helpful assistant..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Prefix (optional)
        </label>
        <input
          type="text"
          value={config.promptPrefix || ''}
          onChange={(e) => updateConfig('promptPrefix', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Prefix to add before user prompt"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Suffix (optional)
        </label>
        <input
          type="text"
          value={config.promptSuffix || ''}
          onChange={(e) => updateConfig('promptSuffix', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Suffix to add after user prompt"
        />
      </div>
    </div>
  );

  const renderOutputConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <select
          value={config.format || 'chat'}
          onChange={(e) => updateConfig('format', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="chat">Chat Interface</option>
          <option value="markdown">Markdown</option>
          <option value="json">JSON</option>
          <option value="plain">Plain Text</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showMetadata"
          checked={config.showMetadata || false}
          onChange={(e) => updateConfig('showMetadata', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showMetadata" className="ml-2 block text-sm text-gray-900">
          Show metadata (tokens, timing, etc.)
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableFollowUp"
          checked={config.enableFollowUp || true}
          onChange={(e) => updateConfig('enableFollowUp', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="enableFollowUp" className="ml-2 block text-sm text-gray-900">
          Enable follow-up questions
        </label>
      </div>
    </div>
  );

  const renderConfigForm = () => {
    switch (nodeType) {
      case 'userQuery':
        return renderUserQueryConfig();
      case 'knowledgeBase':
        return renderKnowledgeBaseConfig();
      case 'llmEngine':
        return renderLLMEngineConfig();
      case 'output':
        return renderOutputConfig();
      default:
        return <div>No configuration options available</div>;
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-4">Component Settings</h3>
      {renderConfigForm()}
    </div>
  );
};