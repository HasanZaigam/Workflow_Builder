'use client';

import React, { useState } from 'react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg text-white">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Workflow Builder</h1>
            <p className="text-gray-400 text-sm mt-1">Create visual workflows with nodes and connections</p>
          </div>
          
          <div className="flex items-center gap-3 border-r border-gray-600 pr-4">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo last action"
              className={`px-3 py-2 rounded font-medium transition-colors ${
                canUndo
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ↶ Undo
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo last action"
              className={`px-3 py-2 rounded font-medium transition-colors ${
                canRedo
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ↷ Redo
            </button>
          </div>

          <button
            onClick={onSave}
            title="Save workflow to console"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
          >
            Save Workflow
          </button>

          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
              title="Show help"
            >
              ?
            </button>
            {showHelp && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900 text-white rounded-lg shadow-xl z-50 w-64 p-4 border border-gray-700">
                <h3 className="font-bold mb-2">Quick Guide</h3>
                <ul className="text-xs space-y-1 text-gray-300">
                  <li>• <strong>Double-click</strong> a node to edit its label</li>
                  <li>• Click <strong>+</strong> to add child nodes</li>
                  <li>• Click <strong>Delete</strong> to remove nodes</li>
                  <li>• Blue = Action, Orange = Branch, Red = End</li>
                  <li>• Use Undo/Redo to go back/forward</li>
                  <li>• Save logs workflow data to console</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
