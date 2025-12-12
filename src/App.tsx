import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from 'reactflow';
import type { Node, Connection } from 'reactflow';
import 'reactflow/dist/style.css';

import familyData from './family_data.json';
import { buildGraphFromData, getLayoutedElements } from './utils/layout';
import PersonNode from './components/PersonNode';
import DetailPanel from './components/DetailPanel';
import StoryPanel from './components/StoryPanel';
import type { Person } from './types';
import { Download, Crosshair, Save, BookOpen } from 'lucide-react';

const nodeTypes = {
  person: PersonNode,
};

// Initial Data Processing
const data = familyData as { persons: Person[] };

// Helper to calculate generations (BFS from root)
const calculateGenerations = (persons: Person[], rootId: string) => {
  const generationMap = new Map<string, number>();
  const queue: { id: string, gen: number }[] = [{ id: rootId, gen: 0 }];
  const visited = new Set<string>([rootId]);
  generationMap.set(rootId, 0);

  let head = 0;
  while (head < queue.length) {
    const { id, gen } = queue[head++];
    const p = persons.find(per => per.id === id);
    if (!p) continue;

    // Parents -> Gen + 1
    p.parents.forEach(parId => {
      if (!visited.has(parId)) {
        visited.add(parId);
        generationMap.set(parId, gen + 1);
        queue.push({ id: parId, gen: gen + 1 });
      }
    });

    // Children -> Gen - 1
    p.children.forEach(childId => {
      if (!visited.has(childId)) {
        visited.add(childId);
        generationMap.set(childId, gen - 1);
        queue.push({ id: childId, gen: gen - 1 });
      }
    });

    // Spouses -> Same Gen
    p.spouses.forEach(spouseId => {
      if (!visited.has(spouseId)) {
        visited.add(spouseId);
        generationMap.set(spouseId, gen);
        queue.push({ id: spouseId, gen: gen });
      }
    });
  }
  return generationMap;
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null); // For Zoom/Center

  useEffect(() => {
    // 1. Calculate Generations
    const rootId = 'p1'; // Nicolas
    const generations = calculateGenerations(data.persons, rootId);

    // 2. Build Graph
    const { nodes: initialNodes, edges: initialEdges } = buildGraphFromData(data.persons);

    // 3. Inject generation info into nodes
    const nodesWithGen = initialNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        generation: generations.get(node.id) ?? 0
      }
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesWithGen,
      initialEdges,
      'BT'
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedPerson(node.data.person);
  };

  const onLayout = useCallback((direction: string) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  // Export
  const handleExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ persons: nodes.map(n => n.data.person) }, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "family_tree.json";
    link.click();
  };

  // Save via API
  const handleSave = async () => {
    try {
      const payload = { persons: nodes.map(n => n.data.person) };
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload, null, 2)
      });

      if (response.ok) {
        alert("Sauvegardé avec succès !");
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Erreur réseau lors de la sauvegarde.");
    }
  };

  // Center on Me Handler
  const centerOnRoot = useCallback(() => {
    if (reactFlowInstance && nodes.length > 0) {
      const rootNode = nodes.find(n => n.id === 'p1');
      if (rootNode) {
        // Node width is 250 (from layout.ts), height is 160.
        // We want to center on the MIDDLE of the node.
        const x = rootNode.position.x + 125;
        const y = rootNode.position.y + 80;
        reactFlowInstance.setCenter(x, y, { zoom: 1, duration: 1000 });
      }
    }
  }, [reactFlowInstance, nodes]);

  const handleAdd = (type: 'parent' | 'child' | 'spouse') => {
    if (!selectedPerson) return;

    const newId = `new-${Date.now()}`;
    // Basic new person template
    const newPerson: Person = {
      id: newId,
      name: "Nouveau Membre",
      raw_dates: "",
      notes: "",
      parents: [],
      children: [],
      spouses: []
    };

    // Add bi-directional links
    if (type === 'parent') {
      // Add this new person as parent of selected
      newPerson.children = [selectedPerson.id];
      selectedPerson.parents.push(newId);
    } else if (type === 'child') {
      // Add this new person as child of selected
      newPerson.parents = [selectedPerson.id];
      selectedPerson.children.push(newId);
    } else if (type === 'spouse') {
      newPerson.spouses = [selectedPerson.id];
      selectedPerson.spouses.push(newId);
    }

    data.persons.push(newPerson);

    // Rebuild Graph
    // Recalculate generations to color correctly
    const generations = calculateGenerations(data.persons, 'p1');

    const { nodes: newNodes, edges: newEdges } = buildGraphFromData(data.persons);
    const nodesWithGen = newNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        generation: generations.get(node.id) ?? 0
      }
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodesWithGen, newEdges, 'BT');

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  const handleUpdate = (field: keyof Person, value: string) => {
    if (!selectedPerson) return;

    // Update local object (immediate feedback)
    const updatedPerson = { ...selectedPerson, [field]: value };
    setSelectedPerson(updatedPerson);

    // Update global data (source of truth)
    const pIndex = data.persons.findIndex(p => p.id === selectedPerson.id);
    if (pIndex !== -1) {
      data.persons[pIndex] = updatedPerson;
    }

    // Update nodes to reflect changes (e.g. name change on node card)
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedPerson.id) {
          return {
            ...node,
            data: { ...node.data, person: updatedPerson }
          };
        }
        return node;
      })
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }} className="font-sans text-slate-900">
      <div style={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          nodeTypes={nodeTypes}
          // fitView
          minZoom={0.05}
          maxZoom={1.5}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap style={{ height: 120 }} zoomable pannable />
          <Background gap={16} size={1} color="#e2e8f0" />

          <Panel position="top-left" className="p-2">
            <button
              onClick={() => setIsStoryOpen(true)}
              className="bg-white p-3 rounded-xl shadow-lg hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-2 transition-all border border-indigo-100"
            >
              <BookOpen size={20} />
              <span>Récits de Famille</span>
            </button>
          </Panel>

          <Panel position="top-right" className="flex gap-2 p-2">
            <button onClick={centerOnRoot} className="bg-white p-2 rounded-lg shadow hover:bg-slate-50 text-indigo-600 tooltip" title="Centrer sur moi">
              <Crosshair size={20} />
            </button>
            <button onClick={() => onLayout('BT')} className="px-4 py-2 bg-white rounded-lg shadow hover:bg-slate-50 font-medium text-sm">Réorganiser</button>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 font-medium text-sm flex items-center gap-2">
              <Save size={16} /> Sauvegarder
            </button>
            <button onClick={handleExport} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 font-medium text-sm flex items-center gap-2">
              <Download size={16} /> Exporter
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Story Panel */}
      <StoryPanel isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />

      {/* Modern Detail Panel Component */}
      {selectedPerson && (
        <DetailPanel
          person={selectedPerson}
          generation={nodes.find(n => n.id === selectedPerson.id)?.data?.generation || 0}
          onClose={() => setSelectedPerson(null)}
          onAddParent={() => handleAdd('parent')}
          onAddChild={() => handleAdd('child')}
          onAddSpouse={() => handleAdd('spouse')}
          onRelationClick={(type) => console.log('Rel click', type)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
