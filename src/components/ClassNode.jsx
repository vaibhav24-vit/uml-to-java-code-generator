import { Handle, Position } from "@xyflow/react";

import { Box, MoreVertical } from "lucide-react";

function ClassNode({ data }) {

  return (

    <div className="uml-node">

      <Handle type="target" position={Position.Top} id="target-top" className="uml-handle handle-top target-port" />
      <Handle type="source" position={Position.Top} id="source-top" className="uml-handle handle-top source-port" />
      <Handle type="target" position={Position.Right} id="target-right" className="uml-handle handle-right target-port" />
      <Handle type="source" position={Position.Right} id="source-right" className="uml-handle handle-right source-port" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="uml-handle handle-bottom target-port" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="uml-handle handle-bottom source-port" />
      <Handle type="target" position={Position.Left} id="target-left" className="uml-handle handle-left target-port" />
      <Handle type="source" position={Position.Left} id="source-left" className="uml-handle handle-left source-port" />

      {/* Header */}

      <div className="uml-header">

        <div className="class-name">

          <Box size={18} />

          <span>
            {data.name}
          </span>

        </div>

        <MoreVertical size={17} aria-label="Class options" />

      </div>

      {/* Attributes */}

      <div className="uml-section">

        {data.attributes.length ? data.attributes.map((attribute, index) => (

          <div
            className="uml-row"
            key={index}
          >
            - {attribute.name} : {attribute.type}
          </div>

        )) : <div className="uml-row muted-row">No attributes</div>}

      </div>

      {/* Methods */}

      <div className="uml-section methods">

        {data.methods.length ? data.methods.map((method, index) => (

          <div
            className="uml-row"
            key={index}
          >
            + {method.name} : {method.type}
          </div>

        )) : <div className="uml-row muted-row">No methods</div>}

      </div>

    </div>

  );
}

export default ClassNode;