import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import ClassNode from "./ClassNode";

export const getRelationshipMarkers = (relationship) => {
  if (relationship === "extends") {
    return {
      markerEnd: { type: MarkerType.ArrowClosed, color: "#a9b9ff" }
    };
  }

  if (relationship === "aggregation") {
    return {
      markerStart: { type: MarkerType.Diamond, color: "#a9b9ff" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#a9b9ff" }
    };
  }

  if (relationship === "composition") {
    return {
      markerStart: { type: MarkerType.Diamond, color: "#36a9ff" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#36a9ff" }
    };
  }

  return {};
};

const nodeTypes = {
  umlClass: ClassNode
};

export const initialNodes = [
  {
    id: "person",

    type: "umlClass",

    position: {
      x: 180,
      y: 80
    },

    data: {
      name: "Person",

      attributes: [
        {
          name: "name",
          type: "String"
        },
        {
          name: "age",
          type: "int"
        },
        {
          name: "email",
          type: "String"
        }
      ],

      methods: [
        {
          name: "getName()",
          type: "String"
        },
        {
          name: "setName(name : String)",
          type: "void"
        },
        {
          name: "getAge()",
          type: "int"
        }
      ]
    }
  },

  {
    id: "student",

    type: "umlClass",

    position: {
      x: 100,
      y: 400
    },

    data: {
      name: "Student",

      attributes: [
        {
          name: "rollNo",
          type: "int"
        },
        {
          name: "course",
          type: "String"
        },
        {
          name: "semester",
          type: "int"
        }
      ],

      methods: [
        {
          name: "study()",
          type: "void"
        },
        {
          name: "getDetails()",
          type: "String"
        }
      ]
    }
  },

  {
    id: "course",

    type: "umlClass",

    position: {
      x: 520,
      y: 400
    },

    data: {
      name: "Course",

      attributes: [
        {
          name: "courseId",
          type: "int"
        },
        {
          name: "title",
          type: "String"
        },
        {
          name: "credits",
          type: "int"
        }
      ],

      methods: [
        {
          name: "getTitle()",
          type: "String"
        },
        {
          name: "setTitle()",
          type: "void"
        }
      ]
    }
  }
];

export const initialEdges = [
  {
    id: "person-student",
    source: "person",
    target: "student",
    label: "extends",
    type: "smoothstep",
    ...getRelationshipMarkers("extends")
  },

  {
    id: "student-course",
    source: "student",
    target: "course",
    label: "enrolledIn",
    type: "straight",
    ...getRelationshipMarkers("association")
  }
];

function DiagramCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, onEdgeClick, onPaneClick }) {

  return (
    <div className="diagram-container">

      <div className="canvas-label">
        // UML DIAGRAM CANVAS
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}

        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        connectionMode="loose"
        connectionRadius={30}

        nodeTypes={nodeTypes}

        fitView
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#7183ff", strokeWidth: 1.6 }
        }}
      >

        <Background
          gap={22}
          size={1}
        />

        <Controls />

        <MiniMap />

      </ReactFlow>

    </div>
  );
}

export default DiagramCanvas;