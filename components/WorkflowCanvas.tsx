'use client';

import React, { useEffect, useRef } from 'react';
import { WorkflowState, NodeType } from '@/types/workflow';
import { WorkflowNode } from './WorkflowNode';

interface WorkflowCanvasProps {
  state: WorkflowState;
  onAddNode: (parentId: string, nodeType: NodeType, branchLabel?: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onEditLabel: (nodeId: string, newLabel: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  state,
  onAddNode,
  onDeleteNode,
  onEditLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const updatePositions = () => {
      const positions = new Map<string, { x: number; y: number }>();
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      document.querySelectorAll('[data-node-id]').forEach((el) => {
        const nodeId = el.getAttribute('data-node-id');
        if (nodeId) {
          const rect = el.getBoundingClientRect();
          positions.set(nodeId, {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          });
        }
      });
      nodePositionsRef.current = positions;
    };

    updatePositions();
    const timer = setTimeout(updatePositions, 100);
    return () => clearTimeout(timer);
  }, [state]);

  const createArrowMarker = (): SVGDefsElement => {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#3b82f6');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    return defs;
  };

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const positions = nodePositionsRef.current;
    if (positions.size === 0) return;

    const containerRect = container.getBoundingClientRect();
    svg.setAttribute('width', containerRect.width.toString());
    svg.setAttribute('height', containerRect.height.toString());
    svg.appendChild(createArrowMarker());

    // Draw connection lines
    Object.values(state.nodes).forEach((node) => {
      const fromPos = positions.get(node.id);
      if (!fromPos) return;

      node.children.forEach((childId) => {
        const toPos = positions.get(childId);
        if (!toPos) return;

        // Draw curved path
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const controlY = fromPos.y + dy * 0.4;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute(
          'd',
          `M ${fromPos.x} ${fromPos.y} Q ${fromPos.x} ${controlY} ${toPos.x} ${toPos.y}`
        );
        path.setAttribute('stroke', '#3b82f6');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(path);

        // Draw branch label if exists
        if (node.type === 'branch' && node.branchLabels?.[childId]) {
          const midX = fromPos.x + dx * 0.35;
          const midY = fromPos.y + dy * 0.35 - 15;
          
          // Create a background rectangle for better label visibility
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', (midX - 25).toString());
          rect.setAttribute('y', (midY - 10).toString());
          rect.setAttribute('width', '50');
          rect.setAttribute('height', '18');
          rect.setAttribute('fill', 'white');
          rect.setAttribute('stroke', '#f97316');
          rect.setAttribute('stroke-width', '1');
          rect.setAttribute('rx', '3');
          svg.appendChild(rect);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', midX.toString());
          text.setAttribute('y', (midY - 0.5).toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('font-size', '11');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('fill', '#f97316');
          text.textContent = node.branchLabels[childId];
          svg.appendChild(text);
        }
      });
    });
  }, [state]);

  const renderNode = (nodeId: string): React.ReactNode => {
    const node = state.nodes[nodeId];
    if (!node) return null;

    return (
      <div key={node.id} data-node-id={node.id} className="flex flex-col items-center">
        <WorkflowNode
          node={node}
          onAddNode={(nodeType, branchLabel) => onAddNode(node.id, nodeType, branchLabel)}
          onDeleteNode={() => onDeleteNode(node.id)}
          onEditLabel={(newLabel) => onEditLabel(node.id, newLabel)}
        >
          {node.children.length > 0 && (
            <div className="flex gap-12 flex-wrap justify-center">
              {node.children.map((childId) => (
                <div key={childId} className="flex flex-col items-center">
                  {renderNode(childId)}
                </div>
              ))}
            </div>
          )}
        </WorkflowNode>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-auto bg-gray-50">
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />
      <div className="relative p-8 pointer-events-auto">
        {renderNode(state.rootId)}
      </div>
    </div>
  );
};
