'use client';

import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { Toolbar } from '@/components/Toolbar';
import { InfoPanel } from '@/components/InfoPanel';
import { useWorkflow } from '@/hooks/useWorkflow';

export default function Home() {
  const {
    state,
    addNode,
    deleteNode,
    editNodeLabel,
    undo,
    redo,
    saveWorkflow,
    canUndo,
    canRedo,
  } = useWorkflow();

  return (
    <main className="min-h-screen bg-gray-50">
      <Toolbar
        onUndo={undo}
        onRedo={redo}
        onSave={saveWorkflow}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <WorkflowCanvas
        state={state}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onEditLabel={editNodeLabel}
      />
      <InfoPanel />
    </main>
  );
}
