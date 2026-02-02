'use client';

import React, { useState } from 'react';
import { NodeType } from '@/types/workflow';

interface NodeCreationModalProps {
  isOpen: boolean;
  isBranch: boolean;
  onCreateNode: (type: NodeType, label?: string, branchLabel?: string) => void;
  onClose: () => void;
}

const NODE_TYPES: { type: NodeType; label: string; description: string; color: string }[] = [
  {
    type: 'action',
    label: 'Action',
    description: 'Execute a single task or step',
    color: 'bg-blue-500',
  },
  {
    type: 'branch',
    label: 'Branch',
    description: 'Create a decision point with multiple paths',
    color: 'bg-orange-500',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Terminate the workflow',
    color: 'bg-red-500',
  },
];

export const NodeCreationModal: React.FC<NodeCreationModalProps> = ({
  isOpen,
  isBranch,
  onCreateNode,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<NodeType | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [branchLabel, setBranchLabel] = useState('');

  const handleCreate = () => {
    if (selectedType) {
      onCreateNode(selectedType, customLabel || undefined, branchLabel || undefined);
      setSelectedType(null);
      setCustomLabel('');
      setBranchLabel('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Node</h2>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {NODE_TYPES.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => setSelectedType(nodeType.type)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === nodeType.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${nodeType.color}`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{nodeType.label}</h3>
                  <p className="text-xs text-gray-600">{nodeType.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedType && selectedType !== 'end' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Node Label</label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder={`Enter ${selectedType} label...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {isBranch && selectedType && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch Label</label>
            <input
              type="text"
              value={branchLabel}
              onChange={(e) => setBranchLabel(e.target.value)}
              placeholder="e.g., True, False, Yes, No"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!selectedType}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-white ${
              selectedType
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
