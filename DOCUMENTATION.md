# Workflow Builder - Complete Documentation

## Project Overview

**Workflow Builder** is a professional-grade, visual node-based application that enables users to design and manage complex workflows without writing code. Built with React, TypeScript, and Tailwind CSS—featuring a custom layout engine, SVG-based connection rendering, and full undo/redo history management.

**Version:** 1.0.0  
**Tech Stack:** React 19, TypeScript, Next.js 16, Tailwind CSS  
**Key Feature:** No external UI/workflow libraries required

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
5. [Component Guide](#component-guide)
6. [Usage Examples](#usage-examples)
7. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

### System Design Pattern

```
┌─────────────────────────────────────────┐
│         React Application               │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────┐    │
│  │   Page Component (page.tsx)    │    │
│  │   - Entry point                │    │
│  │   - State orchestration        │    │
│  └────────────────────────────────┘    │
│            │                            │
│   ┌────────┼────────┐                  │
│   ▼        ▼        ▼                  │
│  Toolbar Canvas InfoPanel              │
│                                         │
│   All components consume state from:   │
│   └─→ useWorkflow Hook ←─┘             │
│                                         │
└─────────────────────────────────────────┘
```

### State Management Flow

```
User Action
    ↓
Component Handler (onClick, onDoubleClick)
    ↓
Callback to Page (onAddNode, onDeleteNode, onEditLabel)
    ↓
useWorkflow Mutation (addNode, deleteNode, editNodeLabel)
    ↓
State Updated + History Saved
    ↓
Components Re-render
    ↓
SVG Connections Update
```

---

## File Structure

```
project-root/
├── /app
│   ├── layout.tsx           # Global layout & metadata
│   ├── page.tsx             # Main page, component orchestration
│   └── globals.css          # Global styles & Tailwind config
│
├── /types
│   └── workflow.ts          # TypeScript interfaces
│
├── /hooks
│   └── useWorkflow.ts       # State management & history
│
├── /components
│   ├── WorkflowCanvas.tsx   # SVG container & rendering
│   ├── WorkflowNode.tsx     # Node UI & interactions
│   ├── NodeCreationModal.tsx# Add node dialog
│   ├── Toolbar.tsx          # Header controls
│   └── InfoPanel.tsx        # Floating help guide
│
└── DOCUMENTATION.md         # This file
```

---

## Core Concepts

### 1. Data Model

**WorkflowNode** - Individual node in workflow
```typescript
interface WorkflowNode {
  id: string;                          // Unique identifier
  type: 'action' | 'branch' | 'end';  // Node classification
  label: string;                       // Display name
  children: string[];                  // Child node IDs
  branchLabels?: Record<string, string>; // Branch condition labels
  position?: { x: number; y: number }; // Calculated layout position
}
```

**WorkflowState** - Complete workflow snapshot
```typescript
interface WorkflowState {
  nodes: Record<string, WorkflowNode>; // All nodes indexed by ID
  rootId: string;                      // Entry point node ID
}
```

**HistoryEntry** - Undo/redo snapshot
```typescript
interface HistoryEntry {
  state: WorkflowState;
  timestamp: number;
}
```

### 2. Node Types

| Type | Color | Purpose | Children |
|------|-------|---------|----------|
| **Action** | Blue | Execute task/step | Single path |
| **Branch** | Orange | Decision point | Multiple paths (labeled) |
| **End** | Red | Workflow termination | None |

### 3. Layout Algorithm

**Hierarchical Tree Layout** - Positions nodes based on tree depth:

1. **Assign Levels:** Traverse from root, assign level to each node based on depth
2. **Group by Level:** Collect nodes at each level
3. **Calculate Positions:**
   - Horizontal: Spread nodes evenly at each level (200px spacing)
   - Vertical: Fixed 150px gap between levels
   - Center: Align to middle of container

```typescript
// Example: 3-level workflow
Level 0: [Start]                    // x: 0, y: 0
Level 1: [Action1, Action2]         // x: -100/100, y: 150
Level 2: [End1, End2, End3]         // x: -200/0/200, y: 300
```

### 4. History Management

**Immutable State Pattern:**
- Each operation creates new state copy (no mutation)
- History maintains chronological snapshots
- Index pointer tracks current position in history
- Undo: Move pointer backward, restore state
- Redo: Move pointer forward, restore state

---

## API Reference

### useWorkflow Hook

Main hook for workflow state management.

```typescript
const {
  state,              // Current WorkflowState
  addNode,            // (parentId, nodeType, branchLabel?) → void
  deleteNode,         // (nodeId) → void
  editNodeLabel,      // (nodeId, newLabel) → void
  undo,               // () → void
  redo,               // () → void
  saveWorkflow,       // () → void (logs to console)
  canUndo,            // boolean
  canRedo,            // boolean
} = useWorkflow();
```

#### addNode(parentId, nodeType, branchLabel?)

Add a new child node to specified parent.

**Parameters:**
- `parentId: string` - Parent node ID
- `nodeType: 'action' | 'branch' | 'end'` - Node type
- `branchLabel?: string` - Label for branch connection (optional)

**Behavior:**
- Creates new node with auto-generated ID
- Assigns default label based on type
- Adds to parent's children
- Recalculates layout positions
- Saves to history

**Example:**
```typescript
addNode('root', 'action');              // Add action as root child
addNode('node1', 'branch', 'True');     // Add branch with label
```

#### deleteNode(nodeId)

Remove node and reconnect its children to parent.

**Parameters:**
- `nodeId: string` - Node to delete

**Behavior:**
- Cannot delete root node
- Orphaned children connect to parent
- Branch labels preserved on reconnection
- Layout recalculated
- Saved to history

**Example:**
```typescript
deleteNode('node2');  // Delete node, promote its children
```

#### editNodeLabel(nodeId, newLabel)

Update node's display label.

**Parameters:**
- `nodeId: string` - Node to update
- `newLabel: string` - New label text

**Behavior:**
- Updates label immediately
- Saves to history
- No layout recalculation needed

#### undo() / redo()

Navigate history stack.

**Behavior:**
- Undo: Move backward if history available
- Redo: Move forward if history available
- Restores complete workflow state
- Triggers component re-render

---

## Component Guide

### WorkflowCanvas

Renders workflow tree with SVG connections.

**Props:**
```typescript
interface WorkflowCanvasProps {
  state: WorkflowState;
  onAddNode: (parentId, nodeType, branchLabel?) => void;
  onDeleteNode: (nodeId) => void;
  onEditLabel: (nodeId, newLabel) => void;
}
```

**Features:**
- Full-screen scrollable container
- SVG-based connection rendering
- Real-time position tracking
- Quadratic bezier curves for smooth connections
- Branch labels on connection lines

**Key Functions:**

`createArrowMarker()` - SVG marker definition for arrow heads

`renderNode(nodeId)` - Recursively render node and children

### WorkflowNode

Individual node UI with interactions.

**Props:**
```typescript
interface WorkflowNodeProps {
  node: WorkflowNode;
  onAddNode: (nodeType, branchLabel?) => void;
  onDeleteNode: () => void;
  onEditLabel: (newLabel) => void;
  children?: React.ReactNode;
}
```

**Interactions:**
- **Double-click:** Enter edit mode for label
- **Click "+":** Open node creation modal
- **Click "Delete":** Remove node
- **Click "Edit":** Enter edit mode

**States:**
- `isEditing` - Label edit mode active
- `showModal` - Node creation dialog visible

### NodeCreationModal

Dialog for creating nodes with configuration.

**Props:**
```typescript
interface NodeCreationModalProps {
  isOpen: boolean;
  isBranch: boolean;  // True if parent is branch
  onCreateNode: (type, label?, branchLabel?) => void;
  onClose: () => void;
}
```

**Features:**
- Type selection (Action/Branch/End)
- Custom label input
- Branch label input (for branch parents)
- Form validation
- Click-outside-to-close

### Toolbar

Header with controls and help guide.

**Props:**
```typescript
interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

**Features:**
- Undo/Redo buttons (disabled when unavailable)
- Save workflow to console
- Help modal with quick reference
- Dark theme with gradient background

### InfoPanel

Floating help guide and documentation.

**Features:**
- Toggleable floating button (bottom-right)
- Node type reference
- Keyboard shortcuts
- Usage instructions
- Browser console guidance

---

## Usage Examples

### Example 1: Create a Simple Workflow

```typescript
const { addNode } = useWorkflow();

// Add action to root
addNode('root', 'action');  // Creates node1

// Add branch to action
addNode('node1', 'branch', 'Condition 1');  // Creates node2

// Add end nodes to branch
addNode('node2', 'end', 'Yes');   // Creates node3
addNode('node2', 'end', 'No');    // Creates node4
```

**Result:**
```
      Start
        ↓
     Action
        ↓
   Condition
      ↙  ↖
    Yes   No
    ↓     ↓
   End   End
```

### Example 2: Edit and Delete

```typescript
const { editNodeLabel, deleteNode } = useWorkflow();

// Rename action node
editNodeLabel('node1', 'Process Payment');

// Delete the node (promotes children to parent)
deleteNode('node2');
```

### Example 3: Undo/Redo Operations

```typescript
const { undo, redo, canUndo, canRedo } = useWorkflow();

if (canUndo) undo();
if (canRedo) redo();
```

### Example 4: Export Workflow

```typescript
const { saveWorkflow } = useWorkflow();

// Click button → Logs to console
saveWorkflow();
// Output: { nodes: {...}, rootId: 'root' }
```

---

## Performance Optimization

### 1. Immutable State Pattern

**Benefit:** Enables React's efficient reconciliation

```typescript
// ✅ Correct - new object created
const newState = JSON.parse(JSON.stringify(state));
newState.nodes[id].label = 'New Label';
setState(newState);

// ❌ Wrong - mutates original
state.nodes[id].label = 'New Label';
setState(state);
```

### 2. useCallback Dependencies

**Memoized to prevent unnecessary re-renders:**

```typescript
// Optimized - function recreated only when dependencies change
const addNode = useCallback((parentId, nodeType, branchLabel?) => {
  // Implementation
}, [state, saveToHistory]);
```

### 3. Lazy Position Calculation

**DOM queries deferred to useEffect:**

```typescript
// Positions calculated after DOM renders
useEffect(() => {
  updatePositions();
}, [state]);
```

### 4. SVG Ref-Based Rendering

**Direct DOM manipulation avoids React overhead:**

```typescript
// Fast SVG updates without React reconciliation
const svg = svgRef.current;
svg.appendChild(path);  // Direct manipulation
```

---

## Development Workflow

### Adding a New Node Type

1. **Update types** in `/types/workflow.ts`:
```typescript
export type NodeType = 'action' | 'branch' | 'end' | 'custom';
```

2. **Update label map** in `useWorkflow.ts`:
```typescript
const labelMap: Record<NodeType, string> = {
  action: 'Action',
  branch: 'Condition',
  end: 'End',
  custom: 'Custom',  // Add here
};
```

3. **Update color logic** in `WorkflowNode.tsx`:
```typescript
const getNodeColor = (): string => {
  switch (node.type) {
    case 'custom':
      return 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50';
    // ... other cases
  }
};
```

4. **Update modal** in `NodeCreationModal.tsx`:
```typescript
const NODE_TYPES = [
  // ... existing types
  {
    type: 'custom',
    label: 'Custom',
    description: 'Custom node type',
    color: 'bg-purple-500',
  },
];
```

### Debugging

Use browser console logs during development:

```typescript
console.log('[v0] Node positions:', nodePositionsRef.current);
console.log('[v0] History index:', historyIndex.current);
console.log('[v0] Current state:', state);
```

Remove before production.

---

## Browser Compatibility

- **Modern browsers** with ES6+ support (Chrome, Firefox, Safari, Edge)
- **SVG support** required
- **No polyfills** needed
- **Session-only state** (all data in memory)

---

## Future Enhancements

- [ ] LocalStorage/IndexedDB persistence
- [ ] Workflow execution engine
- [ ] Node parameter/configuration panels
- [ ] Import/export workflows as JSON
- [ ] Drag-and-drop node reordering
- [ ] Zoom/pan controls
- [ ] Search/filter nodes
- [ ] Keyboard shortcuts
- [ ] Touch/mobile support

---

## License

This project is provided as-is for educational and commercial use.

**Created:** January 2026  
**Framework:** Next.js 16 + React 19 + TypeScript  
**Styling:** Tailwind CSS v4
