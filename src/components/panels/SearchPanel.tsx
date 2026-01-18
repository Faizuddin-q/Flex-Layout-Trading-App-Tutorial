import React, { useState } from 'react';
import { VscSearch, VscCaseSensitive, VscWholeWord, VscRegex, VscReplace, VscReplaceAll } from 'react-icons/vsc';

interface SearchResult {
  file: string;
  line: number;
  content: string;
  match: string;
}

const mockResults: SearchResult[] = [
  { file: 'src/App.tsx', line: 12, content: 'const App = () => {', match: 'App' },
  { file: 'src/components/Button.tsx', line: 5, content: 'export const Button = ({ label }) => {', match: 'Button' },
  { file: 'src/pages/Home.tsx', line: 8, content: 'return <div className="home">', match: 'home' },
];

export const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [replace, setReplace] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const results = query.length > 0 ? mockResults : [];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <VscSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-7 pr-2 py-1.5 text-sm bg-muted/50 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-0.5">
            <button
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`p-1.5 rounded transition-colors ${caseSensitive ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
              title="Match Case"
            >
              <VscCaseSensitive size={14} />
            </button>
            <button
              onClick={() => setWholeWord(!wholeWord)}
              className={`p-1.5 rounded transition-colors ${wholeWord ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
              title="Match Whole Word"
            >
              <VscWholeWord size={14} />
            </button>
            <button
              onClick={() => setUseRegex(!useRegex)}
              className={`p-1.5 rounded transition-colors ${useRegex ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
              title="Use Regular Expression"
            >
              <VscRegex size={14} />
            </button>
          </div>
        </div>
        
        {showReplace && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replace..."
              className="flex-1 px-2 py-1.5 text-sm bg-muted/50 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
            <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Replace">
              <VscReplace size={14} className="text-muted-foreground" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Replace All">
              <VscReplaceAll size={14} className="text-muted-foreground" />
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowReplace(!showReplace)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showReplace ? 'Hide Replace' : 'Show Replace'}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {results.length > 0 ? (
          <div className="p-2 space-y-1">
            <div className="text-xs text-muted-foreground px-2 py-1">
              {results.length} results in {new Set(results.map(r => r.file)).size} files
            </div>
            {results.map((result, idx) => (
              <div
                key={idx}
                className="px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer text-sm"
              >
                <div className="text-xs text-primary/80 truncate">{result.file}</div>
                <div className="text-muted-foreground font-mono text-xs">
                  <span className="text-muted-foreground/50">{result.line}: </span>
                  {result.content}
                </div>
              </div>
            ))}
          </div>
        ) : query.length > 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No results found
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Enter a search term to begin
          </div>
        )}
      </div>
    </div>
  );
};
