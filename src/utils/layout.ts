import dagre from 'dagre';
import { Position } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import type { Person } from '../types';

const nodeWidth = 250;
const nodeHeight = 160;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'BT') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: direction,
        ranksep: 200, // Reduced vertical separation
        nodesep: 150  // Reduced horizontal separation
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    // Separate edges
    const spouseEdges = edges.filter(e => e.id.startsWith('e-spouse-'));
    const hierarchyEdges = edges.filter(e => !e.id.startsWith('e-spouse-'));

    // 1. Add standard hierarchy edges (Child -> Parent)
    hierarchyEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // 2. Handle Spouse Edges with Virtual Nodes to force same rank
    spouseEdges.forEach((edge, index) => {
        const virtualNodeId = `virtual-spouse-${index}`;
        // Add virtual node (tiny size)
        dagreGraph.setNode(virtualNodeId, { width: 1, height: 1 });

        // Connect both spouses to this virtual parent
        // In BT (Bottom-Top), Source is Bottom, Target is Top.
        // We want spouses (Bottom) connected to Virtual (Top).
        // Standard hierarchy is Child -> Parent.
        // So Spouses -> VirtualNode treats VirtualNode as a common "Parent" (generation above).
        // This forces both spouses to alignment at the generation below the virtual node.
        dagreGraph.setEdge(edge.source, virtualNodeId, { minlen: 1, weight: 10 }); // High weight to keep them close?
        dagreGraph.setEdge(edge.target, virtualNodeId, { minlen: 1, weight: 10 });
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // Safety check if dagre failed to node (shouldn't happen)
        if (!nodeWithPosition) return;

        node.targetPosition = direction === 'BT' ? Position.Bottom : Position.Top;
        node.sourcePosition = direction === 'BT' ? Position.Top : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

export const buildGraphFromData = (persons: Person[]) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    persons.forEach(p => {
        nodes.push({
            id: p.id,
            type: 'person',
            data: { label: p.name, person: p },
            position: { x: 0, y: 0 } // Layed out later
        });

        // Add edges from this person to parents
        p.parents.forEach(parentId => {
            edges.push({
                id: `e-${p.id}-${parentId}`,
                source: p.id,
                target: parentId,
                type: 'default',
                animated: false,
                style: { stroke: '#94a3b8', strokeWidth: 2, strokeOpacity: 0.8 },
            });
        });

        // Add edges for Spouses (bi-directional check to avoid duplicates)
        p.spouses.forEach(spouseId => {
            // Only add edge if current ID is "smaller" strings to ensure unique single edge per pair
            if (p.id < spouseId) {
                edges.push({
                    id: `e-spouse-${p.id}-${spouseId}`,
                    source: p.id,
                    target: spouseId,
                    type: 'default',
                    animated: false,
                    style: { stroke: '#ec4899', strokeWidth: 2, strokeOpacity: 0.6, strokeDasharray: '5,5' }, // Pink dashed for spouses
                });
            }
        });
    });

    return { nodes, edges };
};
