import React from 'react';
import { Workflow, Settings, Play, MessageSquare, Save } from 'lucide-react';

interface HeaderProps {
  workflowName: string;
  isValid: boolean;
  onSave: () => void;
  onValidate: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  workflowName,
  isValid,
  onSave,
  onValidate,
  onOpenChat
}) => {
  return (
    <header className="relative bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm" style={{ zIndex: 10 }}>
      {/* Blue top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" style={{ zIndex: 11 }} />
      {/* Left: Logo and Title */}
      <div className="flex items-center space-x-3 z-20">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-300">
          {/* Placeholder for logo icon */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#22c55e" strokeWidth="2" fill="#bbf7d0" /></svg>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">AI</span>
      </div>
      {/* Right: Save button and user avatar */}
      <div className="flex items-center space-x-3 z-20">
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
          <span className="text-base font-semibold text-gray-500">S</span>
        </div>
      </div>
    </header>
  );
};