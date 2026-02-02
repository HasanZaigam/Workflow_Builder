'use client';

import React, { useState } from 'react';

export const InfoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-110 z-40"
        title="Show help"
      >
        ?
      </button>

      {/* Info Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Workflow Builder Guide</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Node Types</h4>
              <ul className="space-y-1">
                <li className="flex gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Action:</strong> Single task in workflow</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-3 h-3 rounded bg-orange-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Branch:</strong> Decision point with multiple paths</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-3 h-3 rounded bg-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>End:</strong> Workflow termination point</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">How to Use</h4>
              <ul className="space-y-1">
                <li>• <strong>Click +</strong> on any node to add children</li>
                <li>• <strong>Double-click</strong> to edit node labels</li>
                <li>• Click <strong>Delete</strong> to remove nodes</li>
                <li>• <strong>Undo/Redo</strong> to navigate changes</li>
                <li>• Click <strong>Save</strong> to export to console</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Branch Labels</h4>
              <p>
                For Branch nodes, provide labels like "True/False" or "Yes/No" to clarify
                conditional paths. These appear on connection lines.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Open the browser console after clicking "Save Workflow" to view the complete
                workflow structure in JSON format.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
