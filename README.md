# Workflow Builder

A professional-grade visual node-based workflow design application built with React, TypeScript, and Tailwind CSS.

## Features

✓ **Visual Workflow Design** - Drag-and-drop free (click-based creation)  
✓ **Three Node Types** - Action, Branch (decision), End  
✓ **Automatic Layout** - Hierarchical tree positioning  
✓ **Full CRUD** - Create, read, update, delete nodes  
✓ **Undo/Redo** - Complete history management  
✓ **SVG Connections** - Smooth bezier curves with labels  
✓ **No Dependencies** - No external workflow/UI libraries  
✓ **TypeScript** - Fully typed codebase  
✓ **Responsive** - Works on desktop and tablets  

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd workflow-builder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Basic Usage

1. **Create Node:** Click the "+" button on any node
2. **Select Type:** Choose Action, Branch, or End
3. **Add Label:** Enter a description for the node
4. **Branch Labels:** For branch nodes, add condition labels (e.g., "True", "False")
5. **Edit:** Double-click a node to rename it
6. **Delete:** Click the Delete button to remove a node
7. **Undo/Redo:** Use toolbar buttons to navigate history
8. **Save:** Click "Save Workflow" to export to console

## Architecture

### Core Layers

```
Page (Orchestration)
    ↓
useWorkflow Hook (State Management)
    ↓
Components (Presentation)
    ├── WorkflowCanvas (SVG Rendering)
    ├── WorkflowNode (UI & Interactions)
    ├── NodeCreationModal (Dialog)
    ├── Toolbar (Controls)
    └── InfoPanel (Help)
```

### State Model

```typescript
WorkflowNode {
  id: string
  type: 'action' | 'branch' | 'end'
  label: string
  children: string[]
  branchLabels?: Record<string, string>
  position?: { x, y }
}

WorkflowState {
  nodes: Record<string, WorkflowNode>
  rootId: string
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| **WorkflowCanvas** | Full-screen SVG container, renders nodes and connections |
| **WorkflowNode** | Individual node UI with editing and deletion |
| **NodeCreationModal** | Dialog for adding nodes with configuration |
| **Toolbar** | Header with undo/redo, save, and help |
| **InfoPanel** | Floating help guide with shortcuts |

## Hook API

```typescript
const {
  state,              // Current workflow state
  addNode,            // Add child node
  deleteNode,         // Remove node
  editNodeLabel,      // Rename node
  undo,               // Undo last action
  redo,               // Redo last action
  saveWorkflow,       // Export to console
  canUndo,            // Boolean
  canRedo,            // Boolean
} = useWorkflow();
```

## Examples

### Add a workflow

```typescript
const { addNode } = useWorkflow();

// Add action to start
addNode('root', 'action');     // Creates node1

// Add branch to action
addNode('node1', 'branch', 'Check Status');

// Add end nodes
addNode('node1', 'end', 'Success');
addNode('node1', 'end', 'Failed');
```

### Render a simple page

```typescript
export default function Page() {
  const { state, addNode, deleteNode, editNodeLabel, undo, redo, saveWorkflow } = useWorkflow();

  return (
    <main>
      <Toolbar onUndo={undo} onRedo={redo} onSave={saveWorkflow} />
      <WorkflowCanvas
        state={state}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onEditLabel={editNodeLabel}
      />
    </main>
  );
}
```

## Performance

- **Immutable State:** Deep cloning for React reconciliation
- **useCallback:** Memoized handlers prevent re-renders
- **Lazy Positioning:** DOM queries in useEffect
- **SVG Direct Manipulation:** Fast rendering without React overhead
- **Efficient History:** Index-based navigation with O(1) access

## Browser Support

- ✓ Chrome/Chromium (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Next.js 16 App Router |
| **Styling** | Tailwind CSS v4 |
| **Rendering** | SVG (native DOM API) |
| **State** | React Hooks |

## Project Structure

```
/app                    # Next.js app directory
  ├── layout.tsx        # Global layout
  ├── page.tsx          # Main page
  └── globals.css       # Global styles

/types
  └── workflow.ts       # TypeScript interfaces

/hooks
  └── useWorkflow.ts    # State management

/components
  ├── WorkflowCanvas.tsx
  ├── WorkflowNode.tsx
  ├── NodeCreationModal.tsx
  ├── Toolbar.tsx
  └── InfoPanel.tsx
```

## Future Roadmap

- Workflow execution engine
- Import/export JSON workflows
- Drag-and-drop reordering
- Advanced node configuration
- Node search/filtering
- Keyboard shortcuts
- Mobile touch support

## Contributing

Contributions welcome! Please follow these guidelines:

1. Keep components focused and single-responsibility
2. Maintain TypeScript types
3. Use semantic HTML
4. Write meaningful commit messages
5. Test across browsers

## License

MIT License - feel free to use this project commercially and personally.

## Support

For issues or questions:
- Check the [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed API reference
- Review the InfoPanel (?) button in-app for quick help
- Check browser console for workflow export

---

**Built with React 19 + TypeScript**  
**Last Updated:** January 2026
