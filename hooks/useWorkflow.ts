'use client';

import { useState, useCallback, useRef } from 'react';
import { WorkflowState, WorkflowNode, NodeType, HistoryEntry } from '@/types/workflow';

const generateId = (): string => Math.random().toString(36).substring(2, 11);

const calculatePositions = (state: WorkflowState): WorkflowState => {
  const nodesCopy: Record<string, WorkflowNode> = JSON.parse(JSON.stringify(state.nodes));
  const levelMap = new Map<string, number>();
  const levelNodes = new Map<number, string[]>();

  // First pass: determine levels
  const assignLevels = (nodeId: string, level: number) => {
    if (levelMap.has(nodeId)) return;
    levelMap.set(nodeId, level);
    
    if (!levelNodes.has(level)) {
      levelNodes.set(level, []);
    }
    levelNodes.get(level)!.push(nodeId);

    const node = nodesCopy[nodeId];
    node.children.forEach((childId) => {
      assignLevels(childId, level + 1);
    });
  };

  assignLevels(state.rootId, 0);

  // Second pass: assign x positions based on node count at each level
  levelNodes.forEach((nodes, level) => {
    const nodesAtLevel = nodes.length;
    const spacing = 200;
    const totalWidth = nodesAtLevel * spacing;
    const startX = -totalWidth / 2 + spacing / 2;

    nodes.forEach((nodeId, index) => {
      const node = nodesCopy[nodeId];
      node.position = {
        x: startX + index * spacing,
        y: level * 150,
      };
    });
  });

  return { ...state, nodes: nodesCopy };
};

export const useWorkflow = () => {
  const [state, setState] = useState<WorkflowState>(() => {
    const initialState: WorkflowState = {
      nodes: {
        root: {
          id: 'root',
          type: 'action',
          label: 'Start',
          children: [],
          position: { x: 0, y: 0 },
        },
      },
      rootId: 'root',
    };
    return calculatePositions(initialState);
  });

  const [history, setHistory] = useState<HistoryEntry[]>([
    { state, timestamp: Date.now() },
  ]);
  const historyIndex = useRef(0);

  const saveToHistory = useCallback((newState: WorkflowState) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.slice(0, historyIndex.current + 1);
      updatedHistory.push({ state: newState, timestamp: Date.now() });
      historyIndex.current = updatedHistory.length - 1;
      return updatedHistory;
    });
    setState(newState);
  }, []);

  const addNode = useCallback((parentId: string, nodeType: NodeType, branchLabel?: string) => {
    const newNodeId = generateId();
    const newState = JSON.parse(JSON.stringify(state)) as WorkflowState;
    const parentNode = newState.nodes[parentId];

    if (!parentNode) return;

    const labelMap: Record<NodeType, string> = {
      action: 'Action',
      branch: 'Condition',
      end: 'End',
    };

    newState.nodes[newNodeId] = {
      id: newNodeId,
      type: nodeType,
      label: labelMap[nodeType],
      children: [],
    };

    if (parentNode.type === 'branch') {
      parentNode.branchLabels ??= {};
      parentNode.branchLabels[newNodeId] = branchLabel || `Branch ${parentNode.children.length + 1}`;
    }

    parentNode.children.push(newNodeId);
    saveToHistory(calculatePositions(newState));
  }, [state, saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === state.rootId) return;

    const newState = JSON.parse(JSON.stringify(state)) as WorkflowState;
    const nodeToDelete = newState.nodes[nodeId];
    if (!nodeToDelete) return;

    const parentEntry = Object.entries(newState.nodes).find(([, node]) =>
      node.children.includes(nodeId)
    );

    if (parentEntry) {
      const [, parent] = parentEntry;
      parent.children = parent.children.filter((id) => id !== nodeId);
      parent.children.push(...nodeToDelete.children);

      if (parent.type === 'branch' && parent.branchLabels?.[nodeId]) {
        const branchLabel = parent.branchLabels[nodeId];
        delete parent.branchLabels[nodeId];
        nodeToDelete.children.forEach((childId) => {
          parent.branchLabels![childId] = branchLabel;
        });
      }
    }

    delete newState.nodes[nodeId];
    saveToHistory(calculatePositions(newState));
  }, [state, saveToHistory]);

  const editNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    const newState = JSON.parse(JSON.stringify(state)) as WorkflowState;
    if (newState.nodes[nodeId]) {
      newState.nodes[nodeId].label = newLabel;
      saveToHistory(newState);
    }
  }, [state, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      setState(history[historyIndex.current].state);
    }
  }, [history]);

  const redo = useCallback(() => {
    if (historyIndex.current < history.length - 1) {
      historyIndex.current++;
      setState(history[historyIndex.current].state);
    }
  }, [history]);

  const saveWorkflow = useCallback(() => {
    console.log('=== Workflow State ===');
    console.log(JSON.stringify(state, null, 2));
    console.log('=== End Workflow State ===');
  }, [state]);

  return {
    state,
    addNode,
    deleteNode,
    editNodeLabel,
    undo,
    redo,
    saveWorkflow,
    canUndo: historyIndex.current > 0,
    canRedo: historyIndex.current < history.length - 1,
  };
};
