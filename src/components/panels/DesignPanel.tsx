import React, { useState } from 'react';
import { VscZoomIn, VscZoomOut, VscScreenFull, VscDeviceMobile, VscDesktopDownload } from 'react-icons/vsc';

export const DesignPanel: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'desktop' ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="Desktop View"
          >
            <VscDesktopDownload size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'mobile' ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="Mobile View"
          >
            <VscDeviceMobile size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-muted rounded transition-colors" title="Zoom Out">
            <VscZoomOut size={16} className="text-muted-foreground" />
          </button>
          <button onClick={handleZoomReset} className="px-2 py-1 text-xs text-muted-foreground hover:bg-muted rounded transition-colors">
            {zoom}%
          </button>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-muted rounded transition-colors" title="Zoom In">
            <VscZoomIn size={16} className="text-muted-foreground" />
          </button>
          <button onClick={handleZoomReset} className="p-1.5 hover:bg-muted rounded transition-colors" title="Fit to Screen">
            <VscScreenFull size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 bg-[repeating-linear-gradient(0deg,hsl(var(--muted))_0px,hsl(var(--muted))_1px,transparent_1px,transparent_20px),repeating-linear-gradient(90deg,hsl(var(--muted))_0px,hsl(var(--muted))_1px,transparent_1px,transparent_20px)]">
        <div 
          className="mx-auto bg-card shadow-xl rounded-lg overflow-hidden transition-all duration-300"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: viewMode === 'mobile' ? '375px' : '100%',
            maxWidth: viewMode === 'desktop' ? '800px' : '375px',
          }}
        >
          {/* Mock Preview */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse-subtle"></div>
              <div>
                <div className="h-3 w-32 bg-primary/20 rounded mb-1.5"></div>
                <div className="h-2 w-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-3 w-full bg-muted/50 rounded"></div>
            <div className="h-3 w-5/6 bg-muted/50 rounded"></div>
            <div className="h-3 w-4/6 bg-muted/50 rounded"></div>
            
            <div className="pt-4 flex gap-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                Primary Action
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                Secondary
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-muted/30 rounded-lg border border-border flex items-center justify-center text-muted-foreground text-xs">
                  Card {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <span>{viewMode === 'mobile' ? '375 × 667' : '800 × Auto'}</span>
        <span>Preview Mode</span>
      </div>
    </div>
  );
};
