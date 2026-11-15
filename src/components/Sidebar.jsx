import {
  Plus,
  Minus,
  ArrowUp,
  Diamond,
  FileText,
  Folder,
  MousePointer2,
  Move,
  Trash2,
  Undo2,
  Redo2
} from "lucide-react";

function Sidebar({ selectedNode, selectedEdge, relationship, onAddClass, onRelationshipChange, onUpdateNode, onDeleteNode, onUndo, onRedo }) {
  const updateItem = (key, index, field, value) => {
    const items = selectedNode.data[key].map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    ));
    onUpdateNode(selectedNode.id, { [key]: items });
  };

  const addItem = (key, item) => {
    onUpdateNode(selectedNode.id, { [key]: [...selectedNode.data[key], item] });
  };

  const selectRelationship = (nextRelationship) => {
    onRelationshipChange(nextRelationship);
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        TOOLS
      </div>

      {/* Add Class */}

      <button className="tool-button add-class" onClick={onAddClass}>
        <Plus size={20} />
        <span>Add Class</span>
      </button>

      {/* Relationships */}

      <button className={`tool-button ${relationship === "association" ? "selected-tool" : ""}`} onClick={() => selectRelationship("association")}>
        <Minus size={19} />
        <span>Association</span>
      </button>

      <button className={`tool-button ${relationship === "extends" ? "selected-tool" : ""}`} onClick={() => selectRelationship("extends")}>
        <ArrowUp size={20} />
        <span>Inheritance</span>
      </button>

      <button className={`tool-button ${relationship === "aggregation" ? "selected-tool" : ""}`} onClick={() => selectRelationship("aggregation")}>
        <Diamond size={19} />
        <span>Aggregation</span>
      </button>

      <button className={`tool-button ${relationship === "composition" ? "selected-tool" : ""}`} onClick={() => selectRelationship("composition")}>
        <Diamond size={19} />
        <span>Composition</span>
      </button>

      <div className="sidebar-divider" />

      {/* Other tools */}

      <button className="tool-button">
        <FileText size={18} />
        <span>Text Note</span>
      </button>

      <button className="tool-button">
        <Folder size={18} />
        <span>Package</span>
      </button>

      <div className="sidebar-divider" />

      <div className="sidebar-title">
        ACTIONS
      </div>

      <div className="action-grid">

        <button className="small-tool active-tool">
          <MousePointer2 size={19} />
          <span>Select</span>
        </button>

        <button className="small-tool" title="Move classes on the canvas">
          <Move size={19} />
          <span>Move</span>
        </button>

        <button className="small-tool" onClick={onDeleteNode} disabled={!selectedNode}>
          <Trash2 size={19} />
          <span>Delete</span>
        </button>

        <button className="small-tool" onClick={onUndo}>
          <Undo2 size={19} />
          <span>Undo</span>
        </button>

        <button className="small-tool" onClick={onRedo}>
          <Redo2 size={19} />
          <span>Redo</span>
        </button>

      </div>

      {selectedNode && (
        <div className="class-inspector">
          <div className="sidebar-title">SELECTED CLASS</div>
          <input className="inspector-input" value={selectedNode.data.name} onChange={(event) => onUpdateNode(selectedNode.id, { name: event.target.value })} aria-label="Class name" />
          <div className="inspector-label">Attributes</div>
          {selectedNode.data.attributes.map((attribute, index) => (
            <div className="inspector-row" key={`attribute-${index}`}>
              <input value={attribute.name} onChange={(event) => updateItem("attributes", index, "name", event.target.value)} aria-label="Attribute name" />
              <input value={attribute.type} onChange={(event) => updateItem("attributes", index, "type", event.target.value)} aria-label="Attribute type" />
            </div>
          ))}
          <button className="inspector-add" onClick={() => addItem("attributes", { name: "field", type: "String" })}>+ attribute</button>
          <div className="inspector-label">Methods</div>
          {selectedNode.data.methods.map((method, index) => (
            <div className="inspector-row" key={`method-${index}`}>
              <input value={method.name} onChange={(event) => updateItem("methods", index, "name", event.target.value)} aria-label="Method signature" />
              <input value={method.type} onChange={(event) => updateItem("methods", index, "type", event.target.value)} aria-label="Return type" />
            </div>
          ))}
          <button className="inspector-add" onClick={() => addItem("methods", { name: "method()", type: "void" })}>+ method</button>
        </div>
      )}

      {selectedEdge && (
        <div className="selection-hint">
          <strong>Relationship selected</strong>
          <span>{selectedEdge.source} → {selectedEdge.target}</span>
          <small>Choose a relationship tool above to change this line.</small>
        </div>
      )}

      {/* Quote */}

      <div className="quote-card">

        <div className="quote-mark">
          "
        </div>

        <p>
          Good Design
          <br />
          Builds Better
          <br />
          Software.
        </p>

        <div className="glow-orb" />

      </div>

      {/* Footer */}

      <div className="sidebar-footer">

        <strong>
          UML<span>forge</span>
        </strong>

        <small>
          v1.0.0
        </small>

      </div>

    </aside>
  );
}

export default Sidebar;