import React, { useState } from 'react';

interface EditorPanelProps {
  nodeId?: string;
  initialFile?: string;
}

const initialCode = `// Welcome to MosaicIDE
// This is a professional multi-panel interface

import React from 'react';

interface AppProps {
  title: string;
  description?: string;
}

export const App: React.FC<AppProps> = ({ 
  title, 
  description 
}) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
    console.log('Button clicked!');
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <button onClick={handleClick}>
        Count: {count}
      </button>
    </div>
  );
};

export default App;
`;

export const EditorPanel: React.FC<EditorPanelProps> = ({ nodeId, initialFile }) => {
  const [code, setCode] = useState(initialCode);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    updateCursorPos(e.target);
  };

  const updateCursorPos = (textarea: HTMLTextAreaElement) => {
    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-card font-mono text-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-destructive/60"></span>
          <span className="w-3 h-3 rounded-full bg-amber-400/60"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-400/60"></span>
        </div>
        <span className="text-xs text-muted-foreground">
          {initialFile || 'App.tsx'} {nodeId && `• ${nodeId}`}
        </span>
        <span className="text-xs text-muted-foreground">TypeScript React</span>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="select-none text-right pr-4 py-3 bg-muted/20 text-muted-foreground/50 text-xs leading-6 overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className={cursorPos.line === num ? 'text-primary' : ''}>
              {num}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => updateCursorPos(e.target as HTMLTextAreaElement)}
          onKeyUp={(e) => updateCursorPos(e.target as HTMLTextAreaElement)}
          className="flex-1 resize-none outline-none bg-transparent p-3 leading-6 text-foreground overflow-auto"
          spellCheck={false}
        />
      </div>
      
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span className="text-primary">TypeScript</span>
        </div>
      </div>
    </div>
  );
};
