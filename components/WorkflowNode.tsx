'use client';

import React, { useState } from 'react';
import { WorkflowNode as WorkflowNodeType, NodeType } from '@/types/workflow';
import { NodeCreationModal } from './NodeCreationModal';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  onAddNode: (nodeType: NodeType, branchLabel?: string) => void;
  onDeleteNode: () => void;
  onEditLabel: (newLabel: string) => void;
  children?: React.ReactNode;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  node,
  onAddNode,
  onDeleteNode,
  onEditLabel,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [showModal, setShowModal] = useState(false);

  const handleSaveLabel = () => {
    if (editLabel.trim()) {
      onEditLabel(editLabel.trim());
    }
    setIsEditing(false);
  };

  const getNodeColor = (): string => {
    switch (node.type) {
      case 'action':
        return 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50';
      case 'branch':
        return 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/50';
      case 'end':
        return 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Node Box */}
      <div
        className={`
          relative px-6 py-4 rounded-lg text-white font-semibold text-center
          min-w-[150px] cursor-pointer transition-all
          ${getNodeColor()}
          ${node.type === 'branch' ? 'border-4 border-yellow-300' : 'border border-gray-400'}
        `}
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveLabel();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="w-full px-2 py-1 text-black bg-white rounded border-2 border-gray-400 focus:outline-none focus:border-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm md:text-base">{node.label}</span>
            {node.type !== 'end' && (
              <div className="relative">
                <button
                  className="ml-2 text-lg font-bold hover:bg-white/30 rounded px-1 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  title="Add child node"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {node.id !== 'root' && (
        <div className="absolute -bottom-8 flex gap-2">
          <button
            onClick={onDeleteNode}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          {node.type !== 'end' && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      )}

      {/* Children Container */}
      {children && <div className="mt-16">{children}</div>}

      {/* Node Creation Modal */}
      <NodeCreationModal
        isOpen={showModal}
        isBranch={node.type === 'branch'}
        onCreateNode={(type, label, branchLabel) => {
          onAddNode(type, branchLabel);
          setShowModal(false);
        }}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
