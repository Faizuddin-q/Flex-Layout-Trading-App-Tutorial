import React from 'react';
import { TabNode, Model } from 'flexlayout-react';
import { EditorPanel } from '../panels/EditorPanel';
import { ConsolePanel } from '../panels/ConsolePanel';
import { NavigatorPanel } from '../panels/NavigatorPanel';
import { InspectorPanel } from '../panels/InspectorPanel';
import { DesignPanel } from '../panels/DesignPanel';
import { SearchPanel } from '../panels/SearchPanel';
import { ChartsPanel } from '../panels/ChartsPanel';
import { OptionChainPanel } from '../panels/OptionChainPanel';
import { MarketDepthPanel } from '../panels/MarketDepthPanel';

export const createComponentFactory = (model: Model) => (node: TabNode): React.ReactNode => {
  const componentType = node.getComponent();
  const config = node.getConfig();

  switch (componentType) {
    case 'EditorPanel':
      return <EditorPanel nodeId={node.getId()} initialFile={config?.fileId} />;
    
    case 'ConsolePanel':
      return <ConsolePanel nodeId={node.getId()} />;

    case 'NavigatorPanel':
      return <NavigatorPanel />;

    case 'InspectorPanel':
      return <InspectorPanel />;

    case 'DesignPanel':
      return <DesignPanel />;

    case 'SearchPanel':
      return <SearchPanel />;

    case 'ChartsPanel':
      return <ChartsPanel nodeId={node.getId()} symbol={config?.symbol} />;

    case 'OptionChainPanel':
      return <OptionChainPanel nodeId={node.getId()} symbol={config?.symbol} model={model} />;

    case 'MarketDepthPanel':
      return (
        <MarketDepthPanel 
          nodeId={node.getId()} 
          symbol={config?.symbol}
          strikePrice={config?.strikePrice}
          optionType={config?.optionType}
        />
      );

    default:
      return (
        <div className="flex items-center justify-center h-full bg-card text-muted-foreground">
          Unknown Component: {componentType}
        </div>
      );
  }
};

// Keep legacy export for backwards compatibility
export const componentFactory = (node: TabNode): React.ReactNode => {
  const componentType = node.getComponent();
  const config = node.getConfig();

  switch (componentType) {
    case 'EditorPanel':
      return <EditorPanel nodeId={node.getId()} initialFile={config?.fileId} />;
    
    case 'ConsolePanel':
      return <ConsolePanel nodeId={node.getId()} />;

    case 'NavigatorPanel':
      return <NavigatorPanel />;

    case 'InspectorPanel':
      return <InspectorPanel />;

    case 'DesignPanel':
      return <DesignPanel />;

    case 'SearchPanel':
      return <SearchPanel />;

    case 'ChartsPanel':
      return <ChartsPanel nodeId={node.getId()} symbol={config?.symbol} />;

    case 'OptionChainPanel':
      return <OptionChainPanel nodeId={node.getId()} symbol={config?.symbol} />;

    case 'MarketDepthPanel':
      return (
        <MarketDepthPanel 
          nodeId={node.getId()} 
          symbol={config?.symbol}
          strikePrice={config?.strikePrice}
          optionType={config?.optionType}
        />
      );

    default:
      return (
        <div className="flex items-center justify-center h-full bg-card text-muted-foreground">
          Unknown Component: {componentType}
        </div>
      );
  }
};
