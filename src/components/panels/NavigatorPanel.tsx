import React, { useState } from 'react';
import { VscFolder, VscFolderOpened, VscFile, VscChevronRight, VscChevronDown, VscNewFile, VscNewFolder, VscRefresh } from 'react-icons/vsc';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const initialFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Card.tsx', type: 'file' },
          { name: 'Modal.tsx', type: 'file' },
        ],
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'Home.tsx', type: 'file' },
          { name: 'About.tsx', type: 'file' },
        ],
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
      { name: 'index.css', type: 'file' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'favicon.ico', type: 'file' },
      { name: 'robots.txt', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'vite.config.ts', type: 'file' },
];

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  onSelect: (name: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, selectedFile, onSelect }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);

  const toggleOpen = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.name);
    }
  };

  const isSelected = selectedFile === node.name;

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-muted/50 rounded text-sm transition-colors ${
          isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={toggleOpen}
      >
        {node.type === 'folder' && (
          <span className="text-muted-foreground">
            {isOpen ? <VscChevronDown size={14} /> : <VscChevronRight size={14} />}
          </span>
        )}
        {node.type === 'folder' ? (
          isOpen ? (
            <VscFolderOpened className="text-amber-500" size={16} />
          ) : (
            <VscFolder className="text-amber-500" size={16} />
          )
        ) : (
          <VscFile className="text-primary/70 ml-3" size={16} />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <TreeNode
              key={`${child.name}-${idx}`}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const NavigatorPanel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-muted rounded transition-colors" title="New File">
            <VscNewFile size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
          <button className="p-1 hover:bg-muted rounded transition-colors" title="New Folder">
            <VscNewFolder size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
          <button className="p-1 hover:bg-muted rounded transition-colors" title="Refresh">
            <VscRefresh size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-1">
        {initialFiles.map((file, idx) => (
          <TreeNode
            key={`${file.name}-${idx}`}
            node={file}
            depth={0}
            selectedFile={selectedFile}
            onSelect={setSelectedFile}
          />
        ))}
      </div>
    </div>
  );
};
