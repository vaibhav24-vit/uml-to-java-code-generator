import { useCallback, useMemo, useRef, useState } from "react";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { Download, FileCode2, Pencil, Save } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DiagramCanvas, { getRelationshipMarkers, initialEdges, initialNodes } from "./components/DiagramCanvas";
import CodePanel from "./components/CodePanel";
import { generateJavaFiles } from "./ustils/codeGenerator";
import "./App.css";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = useState(initialNodes[0].id);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [relationship, setRelationship] = useState("association");
  const [projectName, setProjectName] = useState("Student Management System");
  const [savedAt, setSavedAt] = useState("Just now");
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const canvasRef = useRef(null);
  const selectedNode = nodes.find((node) => node.id === selectedId) || null;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) || null;
  const files = useMemo(() => generateJavaFiles(nodes, edges), [nodes, edges]);

  const remember = useCallback(() => {
    setPast((currentPast) => [...currentPast.slice(-19), { nodes, edges }]);
    setFuture([]);
  }, [edges, nodes]);

  const updateNodeData = useCallback((id, data) => {
    remember();
    setNodes((currentNodes) => currentNodes.map((node) => (
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    )));
  }, [remember, setNodes]);

  const addClass = useCallback(() => {
    remember();
    const id = `class-${Date.now()}`;
    const newNode = {
      id,
      type: "umlClass",
      position: { x: 180 + (nodes.length % 3) * 290, y: 110 + (nodes.length % 3) * 180 },
      data: { name: "NewClass", attributes: [], methods: [] }
    };
    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSelectedId(id);
  }, [nodes.length, remember, setNodes]);

  const onConnect = useCallback((connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    remember();
    setEdges((currentEdges) => addEdge({
      ...connection,
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      label: relationship,
      type: relationship === "extends" ? "smoothstep" : "straight",
      ...getRelationshipMarkers(relationship)
    }, currentEdges));
  }, [relationship, remember, setEdges]);

  const onRelationshipChange = (nextRelationship) => {
    setRelationship(nextRelationship);
    if (!selectedEdgeId) return;
    remember();
    setEdges((currentEdges) => currentEdges.map((edge) => (
      edge.id === selectedEdgeId
        ? {
          ...edge,
          label: nextRelationship,
          type: nextRelationship === "extends" ? "smoothstep" : "straight",
          markerStart: undefined,
          markerEnd: undefined,
          ...getRelationshipMarkers(nextRelationship)
        }
        : edge
    )));
  };

  const undo = () => {
    const previous = past[past.length - 1];
    if (!previous) return;
    setFuture((currentFuture) => [{ nodes, edges }, ...currentFuture]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setPast((currentPast) => currentPast.slice(0, -1));
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((currentPast) => [...currentPast, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setFuture((currentFuture) => currentFuture.slice(1));
  };

  const saveProject = () => {
    localStorage.setItem("umlforge-project", JSON.stringify({ projectName, nodes, edges }));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const loadProject = () => {
    const saved = localStorage.getItem("umlforge-project");
    if (!saved) return;
    const project = JSON.parse(saved);
    setProjectName(project.projectName || "Untitled project");
    setNodes(project.nodes || []);
    setEdges(project.edges || []);
    setSelectedId(project.nodes?.[0]?.id || null);
    setSavedAt("Recovered");
  };

  const exportDiagram = async () => {
    const { toPng } = await import("html-to-image");
    const element = canvasRef.current?.querySelector(".react-flow__viewport");
    if (!element) return;
    const dataUrl = await toPng(element, { backgroundColor: "#060a12", pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const deleteSelectedNode = () => {
    if (!selectedId) return;
    remember();
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedId));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== selectedId && edge.target !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-container">
        <Sidebar
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          relationship={relationship}
          onAddClass={addClass}
          onRelationshipChange={onRelationshipChange}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteSelectedNode}
          onUndo={undo}
          onRedo={redo}
        />
        <section className="workspace">
          <div className="workspace-header">
            <div className="project-title">
              <div className="project-icon"><FileCode2 size={18} /></div>
              <div>
                <h2>{projectName}</h2>
                <p>Design your UML architecture</p>
              </div>
              <button className="edit-button" title="Rename project" onClick={() => {
                const nextName = window.prompt("Project name", projectName);
                if (nextName?.trim()) setProjectName(nextName.trim());
              }}><Pencil size={14} /></button>
            </div>
            <div className="project-actions">
              <span className="saved-status">● Last saved: {savedAt}</span>
              <button className="action-button" onClick={saveProject}><Save size={14} /> Save</button>
              <button className="action-button" onClick={loadProject}>Load</button>
              <button className="action-button" onClick={exportDiagram}><Download size={14} /> Export PNG</button>
              <button className="generate-button" onClick={() => document.querySelector(".code-panel")?.scrollIntoView({ behavior: "smooth" })}>&lt;/&gt; Generate Java Code</button>
            </div>
          </div>
          <div className="editor-area">
            <div className="diagram-shell" ref={canvasRef}>
              <DiagramCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => { setSelectedId(node.id); setSelectedEdgeId(null); }}
                onEdgeClick={(_, edge) => { setSelectedEdgeId(edge.id); setSelectedId(null); setRelationship(["extends", "aggregation", "composition"].includes(edge.label) ? edge.label : "association"); }}
                onPaneClick={() => { setSelectedId(null); setSelectedEdgeId(null); }}
              />
            </div>
            <CodePanel files={files} />
          </div>
          <div className="bottom-banner">
            <div><strong>From Diagrams to Real Code</strong><span>Design → Visualize → Generate → Build</span></div>
            <div className="banner-text">Bridging Design and Development</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
