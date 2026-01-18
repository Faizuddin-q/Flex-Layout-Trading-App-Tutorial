import React, { useState, useEffect, useRef } from 'react';
import { VscTrash, VscFilter, VscWarning, VscError, VscInfo, VscDebug } from 'react-icons/vsc';

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogEntry {
  id: number;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: 1, timestamp: new Date(), level: 'info', message: '[MosaicIDE] Development server started' },
  { id: 2, timestamp: new Date(), level: 'log', message: '[vite] Dev server running at http://localhost:5173/' },
  { id: 3, timestamp: new Date(), level: 'log', message: '[vite] ready in 234ms' },
  { id: 4, timestamp: new Date(), level: 'info', message: '[React] StrictMode enabled' },
  { id: 5, timestamp: new Date(), level: 'debug', message: '[HMR] Connected to development server' },
];

const LogIcon: React.FC<{ level: LogLevel }> = ({ level }) => {
  switch (level) {
    case 'warn':
      return <VscWarning className="text-amber-400" size={12} />;
    case 'error':
      return <VscError className="text-destructive" size={12} />;
    case 'info':
      return <VscInfo className="text-blue-400" size={12} />;
    case 'debug':
      return <VscDebug className="text-purple-400" size={12} />;
    default:
      return <span className="w-3 h-3 rounded-full bg-ide-console-text/30 inline-block"></span>;
  }
};

export const ConsolePanel: React.FC<{ nodeId?: string }> = ({ nodeId }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messages = [
      { level: 'log' as LogLevel, message: '[App] Component mounted' },
      { level: 'debug' as LogLevel, message: '[State] Initial render complete' },
      { level: 'log' as LogLevel, message: '[Network] Fetching data...' },
      { level: 'info' as LogLevel, message: '[Cache] Using cached response' },
      { level: 'warn' as LogLevel, message: '[Deprecation] componentWillMount is deprecated' },
      { level: 'log' as LogLevel, message: '[Event] User interaction detected' },
    ];
    
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < messages.length) {
        const msg = messages[idx];
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            timestamp: new Date(),
            level: msg.level,
            message: msg.message,
          },
        ]);
        idx++;
      } else {
        idx = 0;
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.level === filter);

  const clearLogs = () => setLogs([]);

  const formatTime = (date: Date) => {
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
    }) + '.' + ms;
  };

  return (
    <div className="flex flex-col h-full bg-ide-console-bg font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-ide-console-bg">
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogLevel | 'all')}
            className="bg-transparent border border-border/30 rounded px-2 py-1 text-ide-console-text/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="all">All Levels</option>
            <option value="log">Log</option>
            <option value="info">Info</option>
            <option value="warn">Warnings</option>
            <option value="error">Errors</option>
            <option value="debug">Debug</option>
          </select>
          <span className="text-ide-console-text/50">
            {filteredLogs.length} messages
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={clearLogs}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Clear Console"
          >
            <VscTrash size={14} className="text-ide-console-text/60" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Filter">
            <VscFilter size={14} className="text-ide-console-text/60" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start gap-2 py-1 px-2 hover:bg-white/5 rounded ${
              log.level === 'error' ? 'bg-destructive/10' : 
              log.level === 'warn' ? 'bg-amber-500/5' : ''
            }`}
          >
            <LogIcon level={log.level} />
            <span className="text-ide-console-text/40 shrink-0">
              {formatTime(log.timestamp)}
            </span>
            <span className={`flex-1 ${
              log.level === 'error' ? 'text-destructive' :
              log.level === 'warn' ? 'text-amber-400' :
              'text-ide-console-text'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="flex items-center px-3 py-2 border-t border-border/30">
        <span className="text-ide-console-text/30 mr-2">{'>'}</span>
        <input
          type="text"
          placeholder="Type a command..."
          className="flex-1 bg-transparent outline-none text-ide-console-text placeholder:text-ide-console-text/30"
        />
      </div>
    </div>
  );
};
