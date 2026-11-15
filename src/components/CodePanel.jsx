import Editor from "@monaco-editor/react";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

function CodePanel({ files }) {
  const [activeFileId, setActiveFileId] = useState(files[0]?.id);
  const [copied, setCopied] = useState(false);
  const activeFile = files.find((file) => file.id === activeFileId) || files[0];

  const copyCode = async () => {
    if (!activeFile) return;
    await navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const downloadCode = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = activeFile.name;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (

    <section className="code-panel">

      <div className="code-header">

        <h2>
          Generated Java Code
        </h2>

        <button className="copy-button" onClick={copyCode} disabled={!activeFile}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button className="copy-button" onClick={downloadCode} disabled={!activeFile} title="Download Java file">
          <Download size={14} />
        </button>

      </div>

      <div className="code-tabs">

        {files.map((file) => (
          <button key={file.id} className={`code-tab ${file.id === activeFile?.id ? "active" : ""}`} onClick={() => setActiveFileId(file.id)}>
            {file.name}
          </button>
        ))}

      </div>

      <div className="editor">

        <Editor
          height="100%"
          language="java"
          theme="vs-dark"
          value={activeFile?.code || "Add a class to generate Java code."}
          options={{
            minimap: {
              enabled: false
            },
            fontSize: 13,
            padding: {
              top: 15
            },
            readOnly: true,
            scrollBeyondLastLine: false
          }}
        />

      </div>

    </section>

  );
}

export default CodePanel;