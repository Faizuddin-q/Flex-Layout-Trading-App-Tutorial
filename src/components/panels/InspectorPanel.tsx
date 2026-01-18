import React, { useState } from 'react';
import { VscChevronDown, VscChevronRight, VscSymbolProperty, VscSymbolMethod, VscSymbolEvent } from 'react-icons/vsc';

interface PropertyGroup {
  name: string;
  icon: React.ReactNode;
  properties: { key: string; value: string; type: 'string' | 'number' | 'boolean' | 'object' }[];
}

const mockInspectorData: PropertyGroup[] = [
  {
    name: 'Layout',
    icon: <VscSymbolProperty className="text-blue-400" size={14} />,
    properties: [
      { key: 'display', value: 'flex', type: 'string' },
      { key: 'flexDirection', value: 'column', type: 'string' },
      { key: 'width', value: '100%', type: 'string' },
      { key: 'height', value: 'auto', type: 'string' },
      { key: 'padding', value: '16px', type: 'string' },
    ],
  },
  {
    name: 'Typography',
    icon: <VscSymbolProperty className="text-emerald-400" size={14} />,
    properties: [
      { key: 'fontFamily', value: 'Inter', type: 'string' },
      { key: 'fontSize', value: '14px', type: 'string' },
      { key: 'fontWeight', value: '500', type: 'number' },
      { key: 'lineHeight', value: '1.5', type: 'number' },
      { key: 'color', value: '#1f2937', type: 'string' },
    ],
  },
  {
    name: 'Appearance',
    icon: <VscSymbolProperty className="text-purple-400" size={14} />,
    properties: [
      { key: 'backgroundColor', value: '#ffffff', type: 'string' },
      { key: 'borderRadius', value: '8px', type: 'string' },
      { key: 'boxShadow', value: '0 1px 3px rgba(0,0,0,0.1)', type: 'string' },
      { key: 'opacity', value: '1', type: 'number' },
    ],
  },
  {
    name: 'Events',
    icon: <VscSymbolEvent className="text-amber-400" size={14} />,
    properties: [
      { key: 'onClick', value: 'handleClick()', type: 'object' },
      { key: 'onMouseEnter', value: 'handleHover()', type: 'object' },
    ],
  },
  {
    name: 'Methods',
    icon: <VscSymbolMethod className="text-rose-400" size={14} />,
    properties: [
      { key: 'render', value: '() => ReactNode', type: 'object' },
      { key: 'componentDidMount', value: '() => void', type: 'object' },
    ],
  },
];

const PropertyGroupComponent: React.FC<{ group: PropertyGroup }> = ({ group }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        {isOpen ? (
          <VscChevronDown size={12} className="text-muted-foreground" />
        ) : (
          <VscChevronRight size={12} className="text-muted-foreground" />
        )}
        {group.icon}
        <span className="text-sm font-medium text-foreground">{group.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">{group.properties.length}</span>
      </button>
      
      {isOpen && (
        <div className="pb-2">
          {group.properties.map((prop, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-6 py-1.5 hover:bg-muted/30 transition-colors group"
            >
              <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">
                {prop.key}
              </span>
              <input
                type="text"
                defaultValue={prop.value}
                className={`flex-1 text-xs bg-transparent px-2 py-1 rounded border border-transparent hover:border-border focus:border-primary/50 focus:outline-none transition-colors ${
                  prop.type === 'number' ? 'text-amber-500' :
                  prop.type === 'boolean' ? 'text-blue-500' :
                  prop.type === 'object' ? 'text-purple-500' :
                  'text-emerald-600'
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const InspectorPanel: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState('Button');

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </span>
        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
          className="text-xs bg-muted/50 border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
        >
          <option value="Button">Button</option>
          <option value="Card">Card</option>
          <option value="Container">Container</option>
          <option value="Text">Text</option>
        </select>
      </div>
      
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-lg text-primary font-semibold">
              {selectedElement[0]}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">{selectedElement}</div>
            <div className="text-xs text-muted-foreground">React.FC</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {mockInspectorData.map((group, idx) => (
          <PropertyGroupComponent key={idx} group={group} />
        ))}
      </div>
      
      <div className="px-3 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <span>Element selected in Editor</span>
      </div>
    </div>
  );
};
