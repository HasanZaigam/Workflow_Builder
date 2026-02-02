# Workflow Builder - Quick Reference Guide

## Installation & Setup

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Core API at a Glance

### useWorkflow Hook

```typescript
const {
  state,              // { nodes: {...}, rootId: 'root' }
  addNode,            // (parentId, type, branchLabel?) → void
  deleteNode,         // (nodeId) → void
  editNodeLabel,      // (nodeId, label) → void
  undo,               // () → void
  redo,               // () → void
  saveWorkflow,       // () → void (logs to console)
  canUndo,            // boolean
  canRedo,            // boolean
} = useWorkflow();
```

---

## Node Types

| Type | Color | Max Children | Use Case |
|------|-------|--------------|----------|
| Action | Blue | 1 | Single task/step |
| Branch | Orange | ∞ | Decision/conditional |
| End | Red | 0 | Workflow termination |

---

## Component Props

### WorkflowCanvas
```typescript
<WorkflowCanvas
  state={state}
  onAddNode={(parentId, type, branchLabel) => {...}}
  onDeleteNode={(nodeId) => {...}}
  onEditLabel={(nodeId, label) => {...}}
/>
```

### WorkflowNode
```typescript
<WorkflowNode
  node={nodeObject}
  onAddNode={(type, branchLabel) => {...}}
  onDeleteNode={() => {...}}
  onEditLabel={(label) => {...}}
  children={childNodes}
/>
```

### NodeCreationModal
```typescript
<NodeCreationModal
  isOpen={boolean}
  isBranch={boolean}
  onCreateNode={(type, label, branchLabel) => {...}}
  onClose={() => {...}}
/>
```

### Toolbar
```typescript
<Toolbar
  onUndo={() => {...}}
  onRedo={() => {...}}
  onSave={() => {...}}
  canUndo={boolean}
  canRedo={boolean}
/>
```

---

## Common Tasks

### Create a Workflow Programmatically

```typescript
const { addNode, state } = useWorkflow();

// 1. Add first action
addNode('root', 'action');
const firstNode = Object.values(state.nodes).find(n => n.type === 'action');

// 2. Add branch
addNode(firstNode.id, 'branch', 'Check');

// 3. Add outcomes
addNode(firstNode.id, 'end', 'Success');
addNode(firstNode.id, 'end', 'Failed');
```

### Export Workflow

```typescript
const { saveWorkflow } = useWorkflow();
saveWorkflow();
// Open browser DevTools console to see full workflow JSON
```

### Navigate History

```typescript
const { undo, redo, canUndo, canRedo } = useWorkflow();

if (canUndo) undo();
if (canRedo) redo();
```

### Rename Node

```typescript
const { editNodeLabel } = useWorkflow();
editNodeLabel('node-id', 'New Name');
```

### Delete Node

```typescript
const { deleteNode } = useWorkflow();
deleteNode('node-id');
// Children automatically promoted to parent
```

---

## Data Structure

### WorkflowState
```typescript
{
  nodes: {
    'root': {
      id: 'root',
      type: 'action',
      label: 'Start',
      children: ['node1', 'node2'],
      position: { x: 0, y: 0 }
    },
    'node1': {
      id: 'node1',
      type: 'branch',
      label: 'Decision',
      children: ['node3', 'node4'],
      branchLabels: {
        'node3': 'True',
        'node4': 'False'
      },
      position: { x: -100, y: 150 }
    }
    // ... more nodes
  },
  rootId: 'root'
}
```

---

## File Locations

```
/hooks/useWorkflow.ts        ← State management (edit here)
/components/WorkflowCanvas   ← SVG rendering (edit here)
/components/WorkflowNode     ← Node UI (edit here)
/types/workflow.ts           ← Types (edit here)
/app/page.tsx                ← Main page (orchestration)
/app/globals.css             ← Styling
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Edit Label | Double-click node |
| Cancel Edit | Esc key |
| Confirm Edit | Enter key |
| Open Help | Click ? button |
| Close Help | Click outside or X |

---

## Styling Classes

### Node Colors
```typescript
// Action
'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50'

// Branch  
'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/50'

// End
'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
```

### SVG Elements
```typescript
// Connection lines
stroke: '#3b82f6'
stroke-width: '2.5'

// Arrow marker
fill: '#3b82f6'

// Branch labels (background)
stroke: '#f97316'
fill: 'white'
```

---

## Adding Features

### Add a New Node Type

1. Update `/types/workflow.ts`:
```typescript
export type NodeType = 'action' | 'branch' | 'end' | 'custom';
```

2. Update `/hooks/useWorkflow.ts`:
```typescript
const labelMap: Record<NodeType, string> = {
  // ... existing
  custom: 'Custom',
};
```

3. Update `/components/WorkflowNode.tsx`:
```typescript
case 'custom':
  return 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50';
```

4. Update `/components/NodeCreationModal.tsx`:
```typescript
const NODE_TYPES = [
  // ... existing
  { type: 'custom', label: 'Custom', color: 'bg-purple-500' },
];
```

### Modify Layout Spacing

In `/hooks/useWorkflow.ts`:
```typescript
const spacing = 250;      // Horizontal spacing (200 default)
y: level * 200;           // Vertical spacing (150 default)
```

### Change Colors

In `/components/WorkflowNode.tsx`:
```typescript
case 'action':
  return 'bg-green-500 hover:bg-green-600';  // Change color
```

In `/components/WorkflowCanvas.tsx`:
```typescript
polygon.setAttribute('fill', '#10b981');  // Arrow color (3b82f6 default)
path.setAttribute('stroke', '#10b981');   // Line color
```

---

## Debugging

### Log State Changes
```typescript
const { state } = useWorkflow();
console.log('[v0] Current state:', state);
```

### Monitor History
```typescript
const { canUndo, canRedo } = useWorkflow();
console.log('[v0] History state - Undo:', canUndo, 'Redo:', canRedo);
```

### Check Node Positions
```typescript
const { state } = useWorkflow();
Object.entries(state.nodes).forEach(([id, node]) => {
  console.log(`[v0] Node ${id}: x=${node.position?.x}, y=${node.position?.y}`);
});
```

### View Exported Workflow
```typescript
const { saveWorkflow } = useWorkflow();
saveWorkflow();  // Open DevTools Console
```

---

## Browser Console

After clicking "Save Workflow":

```javascript
// Copy this to console to format the output nicely
copy(console.logs[console.logs.length - 2])
```

Or view raw in console:
```
=== Workflow State ===
{
  "nodes": {...},
  "rootId": "root"
}
=== End Workflow State ===
```

---

## Performance Tips

✅ Use immutable state updates  
✅ Keep callback dependencies minimal  
✅ Avoid re-renders with React.memo (if needed)  
✅ Use useCallback for event handlers  
✅ Profile with React DevTools

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot delete root" | Trying to delete 'root' node | Only delete child nodes |
| Nodes not appearing | State not updated | Check useWorkflow is called |
| Lines not rendering | SVG container missing | Check svgRef assignment |
| Modal not opening | showModal state false | Click + button to open |

---

## Resources

- **Full Documentation:** See `/DOCUMENTATION.md`
- **ReadMe:** See `/README.md`
- **Cleanup Details:** See `/CLEANUP_SUMMARY.md`
- **In-App Help:** Click the ? button in toolbar

---

## Quick Debug Checklist

- [ ] Is `useWorkflow()` called in page component?
- [ ] Are props passed correctly to components?
- [ ] Is svgRef attached to SVG element?
- [ ] Are node IDs unique?
- [ ] Is parent node ID valid when adding child?
- [ ] Check browser console for errors
- [ ] Try hard refresh (Ctrl+Shift+R)
- [ ] Check DevTools React tab for state

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Maintainer:** v0 Assistant
