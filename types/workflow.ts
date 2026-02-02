// Workflow Node Types
export type NodeType = 'action' | 'branch' | 'end';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  children: string[]; // Array of child node IDs
  branchLabels?: Record<string, string>; // For branch nodes: maps child ID to branch label (e.g., "True", "False")
  position?: { x: number; y: number }; // For rendering
}

export interface WorkflowState {
  nodes: Record<string, WorkflowNode>;
  rootId: string;
}

export interface HistoryEntry {
  state: WorkflowState;
  timestamp: number;
}
