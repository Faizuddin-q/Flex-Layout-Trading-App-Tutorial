import React, { useState } from 'react';
import { VscArrowUp, VscArrowDown } from 'react-icons/vsc';
import { TradeModal } from '../modals/TradeModal';

interface MarketDepthPanelProps {
  nodeId?: string;
  symbol?: string;
  strikePrice?: number;
  optionType?: 'call' | 'put';
}

interface DepthLevel {
  price: number;
  bidQty: number;
  askQty: number;
  bidOrders: number;
  askOrders: number;
}

// Mock market depth data
const generateMockDepth = (basePrice: number): DepthLevel[] => {
  const levels: DepthLevel[] = [];
  for (let i = 0; i < 10; i++) {
    levels.push({
      price: basePrice - (i * 0.05),
      bidQty: Math.floor(Math.random() * 5000) + 500,
      askQty: Math.floor(Math.random() * 5000) + 500,
      bidOrders: Math.floor(Math.random() * 50) + 5,
      askOrders: Math.floor(Math.random() * 50) + 5,
    });
  }
  return levels;
};

export const MarketDepthPanel: React.FC<MarketDepthPanelProps> = ({ 
  symbol = 'RELIANCE',
  strikePrice,
  optionType 
}) => {
  const basePrice = strikePrice || 193.50;
  const [depthData] = useState(() => generateMockDepth(basePrice));
  
  const [tradeModal, setTradeModal] = useState<{
    open: boolean;
    type: 'buy' | 'sell';
    price: number;
  }>({
    open: false,
    type: 'buy',
    price: basePrice,
  });

  const maxQty = Math.max(...depthData.flatMap(d => [d.bidQty, d.askQty]));

  const openTradeModal = (type: 'buy' | 'sell', price: number) => {
    setTradeModal({ open: true, type, price });
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              Market Depth
              <span className="text-primary">{symbol}</span>
              {strikePrice && optionType && (
                <span className="text-sm font-normal text-muted-foreground">
                  ₹{strikePrice} {optionType.toUpperCase()}
                </span>
              )}
            </h2>
            <span className="text-xs text-muted-foreground">10 Levels • Live Data</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">₹{basePrice.toFixed(2)}</div>
            <div className="flex items-center justify-end gap-1 text-sm text-green-600">
              <VscArrowUp size={12} />
              <span>+0.85 (0.44%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Depth Table */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="text-muted-foreground text-xs">
              <th className="text-left py-2 px-2">Action</th>
              <th className="text-right py-2 px-1">Orders</th>
              <th className="text-right py-2 px-1">Bid Qty</th>
              <th className="text-center py-2 px-2 font-bold text-foreground">Price</th>
              <th className="text-left py-2 px-1">Ask Qty</th>
              <th className="text-left py-2 px-1">Orders</th>
              <th className="text-right py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {depthData.map((level, index) => {
              const bidWidth = (level.bidQty / maxQty) * 100;
              const askWidth = (level.askQty / maxQty) * 100;
              
              return (
                <tr key={index} className="hover:bg-muted/30 group">
                  {/* Bid Side Actions */}
                  <td className="py-1.5 px-2">
                    <button
                      onClick={() => openTradeModal('sell', level.price)}
                      className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      Sell
                    </button>
                  </td>
                  
                  {/* Bid Orders */}
                  <td className="text-right py-1.5 px-1 text-muted-foreground">
                    {level.bidOrders}
                  </td>
                  
                  {/* Bid Quantity with bar */}
                  <td className="py-1.5 px-1 relative">
                    <div 
                      className="absolute right-0 top-0 bottom-0 bg-green-500/20"
                      style={{ width: `${bidWidth}%` }}
                    />
                    <span className="relative z-10 text-green-600 font-medium text-right block">
                      {level.bidQty.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td className="text-center py-1.5 px-2 font-bold bg-muted/30">
                    ₹{level.price.toFixed(2)}
                  </td>
                  
                  {/* Ask Quantity with bar */}
                  <td className="py-1.5 px-1 relative">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-red-500/20"
                      style={{ width: `${askWidth}%` }}
                    />
                    <span className="relative z-10 text-red-600 font-medium">
                      {level.askQty.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Ask Orders */}
                  <td className="py-1.5 px-1 text-muted-foreground">
                    {level.askOrders}
                  </td>
                  
                  {/* Ask Side Actions */}
                  <td className="py-1.5 px-2 text-right">
                    <button
                      onClick={() => openTradeModal('buy', level.price)}
                      className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-3 border-t border-border grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-500/10 rounded-lg p-2">
          <div className="text-muted-foreground text-xs">Total Bid</div>
          <div className="font-bold text-green-600">
            {depthData.reduce((sum, d) => sum + d.bidQty, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-2">
          <div className="text-muted-foreground text-xs">Total Ask</div>
          <div className="font-bold text-red-600">
            {depthData.reduce((sum, d) => sum + d.askQty, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <TradeModal
        open={tradeModal.open}
        onClose={() => setTradeModal(prev => ({ ...prev, open: false }))}
        type={tradeModal.type}
        symbol={symbol}
        strikePrice={strikePrice}
        optionType={optionType}
        currentPrice={tradeModal.price}
      />
    </div>
  );
};
