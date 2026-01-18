import React, { useState, useRef, useCallback, useMemo } from 'react';
import * as FlexLayout from 'flexlayout-react';
import { Layout, Model, ITabSetRenderValues, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import { complexLayout } from './defaultLayout';
import { createComponentFactory } from '../components/factory/ComponentFactory';
import { loadLayoutFromStorage, saveLayoutToStorage, clearLayoutStorage } from '../utils/storage';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { 
  VscAdd, 
  VscSettingsGear, 
  VscRefresh, 
  VscTerminal,
  VscColorMode,
  VscLayoutSidebarLeft,
  VscChevronDown,
  VscGraph,
  VscSymbolMisc,
  VscDashboard,
  VscEdit,
  VscFile
} from 'react-icons/vsc';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

interface PanelConfig {
  name: string;
  component: string;
  icon: React.ReactNode;
  config?: Record<string, unknown>;
}

const tradingPanels: PanelConfig[] = [
  { name: 'Charts - AAPL', component: 'ChartsPanel', icon: <VscGraph size={14} />, config: { symbol: 'AAPL' } },
  { name: 'Charts - GOOGL', component: 'ChartsPanel', icon: <VscGraph size={14} />, config: { symbol: 'GOOGL' } },
  { name: 'Charts - MSFT', component: 'ChartsPanel', icon: <VscGraph size={14} />, config: { symbol: 'MSFT' } },
  { name: 'Charts - TSLA', component: 'ChartsPanel', icon: <VscGraph size={14} />, config: { symbol: 'TSLA' } },
];

const optionPanels: PanelConfig[] = [
  { name: 'Option Chain - AAPL', component: 'OptionChainPanel', icon: <VscSymbolMisc size={14} />, config: { symbol: 'AAPL' } },
  { name: 'Option Chain - GOOGL', component: 'OptionChainPanel', icon: <VscSymbolMisc size={14} />, config: { symbol: 'GOOGL' } },
  { name: 'Option Chain - MSFT', component: 'OptionChainPanel', icon: <VscSymbolMisc size={14} />, config: { symbol: 'MSFT' } },
  { name: 'Option Chain - TSLA', component: 'OptionChainPanel', icon: <VscSymbolMisc size={14} />, config: { symbol: 'TSLA' } },
];

const depthPanels: PanelConfig[] = [
  { name: 'Market Depth - AAPL', component: 'MarketDepthPanel', icon: <VscDashboard size={14} />, config: { symbol: 'AAPL' } },
  { name: 'Market Depth - GOOGL', component: 'MarketDepthPanel', icon: <VscDashboard size={14} />, config: { symbol: 'GOOGL' } },
];

const utilityPanels: PanelConfig[] = [
  { name: 'Editor', component: 'EditorPanel', icon: <VscEdit size={14} /> },
  { name: 'Console', component: 'ConsolePanel', icon: <VscTerminal size={14} /> },
  { name: 'Design', component: 'DesignPanel', icon: <VscFile size={14} /> },
];

export const LayoutManager: React.FC = () => {
  const layoutRef = useRef<Layout>(null);
  const { theme, setTheme } = useTheme();

  const [model] = useState<Model>(() => {
    return loadLayoutFromStorage(complexLayout);
  });

  const factory = useMemo(() => createComponentFactory(model), [model]);

  const handleModelChange = useCallback((newModel: Model) => {
    saveLayoutToStorage(newModel);
  }, []);

  const addPanel = useCallback((panel: PanelConfig, location: 'center' | 'right' = 'center') => {
    const targetId = location === 'right' ? 'inspector-panel' : 'workspace';
    model.doAction(
      FlexLayout.Actions.addNode(
        {
          type: 'tab',
          component: panel.component,
          name: panel.name,
          config: panel.config,
          enableClose: true,
        },
        targetId,
        FlexLayout.DockLocation.CENTER,
        -1
      )
    );
  }, [model]);

  const addPanelAsNewTabSet = useCallback((panel: PanelConfig) => {
    // Add as a new tabset to the right of the workspace
    model.doAction(
      FlexLayout.Actions.addNode(
        {
          type: 'tab',
          component: panel.component,
          name: panel.name,
          config: panel.config,
          enableClose: true,
        },
        'workspace',
        FlexLayout.DockLocation.RIGHT,
        -1
      )
    );
  }, [model]);

  const onAddTerminal = useCallback(() => {
    model.doAction(
      FlexLayout.Actions.addNode(
        {
          type: 'tab',
          component: 'ConsolePanel',
          name: `Terminal ${Date.now() % 1000}`,
          enableClose: true,
        },
        'console',
        FlexLayout.DockLocation.CENTER,
        -1
      )
    );
  }, [model]);

  const onResetLayout = useCallback(() => {
    clearLayoutStorage();
    window.location.reload();
  }, []);

  const onRenderTabSet = useCallback((
    tabSetNode: FlexLayout.TabSetNode,
    renderValues: ITabSetRenderValues
  ) => {
    renderValues.stickyButtons.push(
      <button
        key="add"
        className="flexlayout__tab_toolbar_button"
        title="Add Tab"
        onClick={() => {
          model.doAction(
            FlexLayout.Actions.addNode(
              {
                type: 'tab',
                component: 'EditorPanel',
                name: 'New Editor',
                enableClose: true,
              },
              tabSetNode.getId(),
              FlexLayout.DockLocation.CENTER,
              -1
            )
          );
        }}
      >
        <VscAdd size={12} />
      </button>
    );
  }, [model]);

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'red', label: 'Red Focus' },
    { value: 'gray', label: 'Neutral' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top Toolbar */}
      <header className="h-12 bg-card border-b border-border flex items-center px-4 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <VscLayoutSidebarLeft className="text-primary" size={20} />
          <h1 className="font-semibold text-lg text-foreground">
            Mosaic<span className="text-primary">IDE</span>
          </h1>
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Add Panels Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium">
              <VscAdd size={14} />
              Add Panel
              <VscChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <VscGraph size={14} className="mr-2" />
                Charts
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {tradingPanels.map((panel) => (
                  <DropdownMenuItem key={panel.name} onClick={() => addPanel(panel)}>
                    {panel.icon}
                    <span className="ml-2">{panel.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <VscSymbolMisc size={14} className="mr-2" />
                Option Chain
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {optionPanels.map((panel) => (
                  <DropdownMenuItem key={panel.name} onClick={() => addPanel(panel)}>
                    {panel.icon}
                    <span className="ml-2">{panel.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <VscDashboard size={14} className="mr-2" />
                Market Depth
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {depthPanels.map((panel) => (
                  <DropdownMenuItem key={panel.name} onClick={() => addPanel(panel)}>
                    {panel.icon}
                    <span className="ml-2">{panel.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            
            {utilityPanels.map((panel) => (
              <DropdownMenuItem key={panel.name} onClick={() => addPanel(panel)}>
                {panel.icon}
                <span className="ml-2">{panel.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add as New TabSet Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium">
              <VscLayoutSidebarLeft size={14} />
              New TabSet
              <VscChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <VscGraph size={14} className="mr-2" />
                Charts
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {tradingPanels.map((panel) => (
                  <DropdownMenuItem key={panel.name} onClick={() => addPanelAsNewTabSet(panel)}>
                    {panel.icon}
                    <span className="ml-2">{panel.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <VscSymbolMisc size={14} className="mr-2" />
                Option Chain
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {optionPanels.map((panel) => (
                  <DropdownMenuItem key={panel.name} onClick={() => addPanelAsNewTabSet(panel)}>
                    {panel.icon}
                    <span className="ml-2">{panel.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <VscTerminal size={14} />
            Terminal
          </button>
          <button
            onClick={onResetLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            <VscRefresh size={14} />
            Reset
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <VscColorMode size={14} className="text-muted-foreground" />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            className="bg-muted/50 border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
          >
            {themeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button className="p-2 hover:bg-muted rounded-md transition-colors">
          <VscSettingsGear size={16} className="text-muted-foreground" />
        </button>
      </header>

      {/* Layout Container */}
      <div className="flex-1 relative">
        <Layout
          ref={layoutRef}
          model={model}
          factory={factory}
          onModelChange={handleModelChange}
          onRenderTabSet={onRenderTabSet}
          realtimeResize={true}
        />
      </div>
    </div>
  );
};
