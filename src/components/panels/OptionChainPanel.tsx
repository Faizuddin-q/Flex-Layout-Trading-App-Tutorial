import React, { useState, useCallback } from 'react';
import { VscTriangleDown, VscTriangleUp } from 'react-icons/vsc';
import { TradeModal } from '../modals/TradeModal';
import { MarketDepthModal } from '../modals/MarketDepthModal';
import * as FlexLayout from 'flexlayout-react';

interface OptionChainPanelProps {
  nodeId?: string;
  symbol?: string;
  model?: FlexLayout.Model;
}

interface OptionData {
  strike: number;
  callBid: number;
  callAsk: number;
  callLast: number;
  callChange: number;
  callVolume: number;
  callOI: number;
  putBid: number;
  putAsk: number;
  putLast: number;
  putChange: number;
  putVolume: number;
  putOI: number;
}

// Generate mock option chain data
const generateMockOptionChain = (basePrice: number): OptionData[] => {
  const strikes = [];
  const startStrike = Math.floor(basePrice / 5) * 5 - 20;
  
  for (let i = 0; i < 15; i++) {
    const strike = startStrike + (i * 2.5);
    const itm = strike < basePrice;
    const callPremium = Math.max(0.05, (basePrice - strike) + (Math.random() * 3));
    const putPremium = Math.max(0.05, (strike - basePrice) + (Math.random() * 3));
    
    strikes.push({
      strike,
      callBid: Math.max(0.01, callPremium - 0.05),
      callAsk: callPremium + 0.05,
      callLast: callPremium,
      callChange: (Math.random() - 0.3) * 2,
      callVolume: Math.floor(Math.random() * 10000) + 100,
      callOI: Math.floor(Math.random() * 50000) + 1000,
      putBid: Math.max(0.01, putPremium - 0.05),
      putAsk: putPremium + 0.05,
      putLast: putPremium,
      putChange: (Math.random() - 0.5) * 2,
      putVolume: Math.floor(Math.random() * 10000) + 100,
      putOI: Math.floor(Math.random() * 50000) + 1000,
    });
  }
  
  return strikes;
};

export const OptionChainPanel: React.FC<OptionChainPanelProps> = ({ 
  symbol = 'NIFTY',
  model 
}) => {
  const basePrice = 193.50;
  const [optionData] = useState(() => generateMockOptionChain(basePrice));
  const [selectedExpiry] = useState('2024-01-19');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<'call' | 'put' | null>(null);
  
  const [tradeModal, setTradeModal] = useState<{
    open: boolean;
    type: 'buy' | 'sell';
    optionType: 'call' | 'put';
    strikePrice: number;
    price: number;
  }>({
    open: false,
    type: 'buy',
    optionType: 'call',
    strikePrice: 0,
    price: 0,
  });

  const [marketDepthModal, setMarketDepthModal] = useState<{
    open: boolean;
    strikePrice: number;
    optionType: 'call' | 'put';
  }>({
    open: false,
    strikePrice: 0,
    optionType: 'call',
  });

  const openTradeModal = (
    type: 'buy' | 'sell',
    optionType: 'call' | 'put',
    strikePrice: number,
    price: number
  ) => {
    setTradeModal({
      open: true,
      type,
      optionType,
      strikePrice,
      price,
    });
  };

  const openMarketDepth = useCallback((strikePrice: number, optionType: 'call' | 'put') => {
    setMarketDepthModal({
      open: true,
      strikePrice,
      optionType,
    });
    if (model && symbol) {
      model.doAction(FlexLayout.Actions.addNode(
        {
          type: 'tab',
          component: 'market-depth',
          name: `Depth ${symbol} ₹${strikePrice} ${optionType.toUpperCase()}`,
          config: {
            symbol,
            strikePrice,
            optionType,
          },
        },
        'market-depth-tabset', // Assuming a tabset ID for market depth
        FlexLayout.DockLocation.CENTER,
        -1
      ));
    }
  }, [model, symbol]);

  const expiryDates = [
    '2024-01-19',
    '2024-01-26',
    '2024-02-02',
    '2024-02-16',
    '2024-03-15',
  ];

  return (
    <div className="flex flex-col h-full bg-card text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg">
              Option Chain <span className="text-primary">{symbol}</span>
            </h2>
            <span className="text-xs text-muted-foreground">
              Underlying: ₹{basePrice.toFixed(2)} • Hover for actions
            </span>
          </div>
        </div>
        
        {/* Expiry Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {expiryDates.map((date) => (
            <button
              key={date}
              className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${
                date === selectedExpiry
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>
      </div>

      {/* Option Chain Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th colSpan={5} className="py-2 text-center bg-green-500/10 text-green-600 font-semibold text-xs">
                CALLS
              </th>
              <th className="py-2 text-center bg-muted font-semibold text-xs">STRIKE</th>
              <th colSpan={5} className="py-2 text-center bg-red-500/10 text-red-600 font-semibold text-xs">
                PUTS
              </th>
            </tr>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="py-2 px-2 text-left">Actions</th>
              <th className="py-2 px-1 text-right">OI</th>
              <th className="py-2 px-1 text-right">Vol</th>
              <th className="py-2 px-1 text-right">Bid</th>
              <th className="py-2 px-1 text-right">Ask</th>
              <th className="py-2 px-2 text-center font-bold text-foreground">Price</th>
              <th className="py-2 px-1 text-left">Bid</th>
              <th className="py-2 px-1 text-left">Ask</th>
              <th className="py-2 px-1 text-left">Vol</th>
              <th className="py-2 px-1 text-left">OI</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {optionData.map((option, index) => {
              const isITMCall = option.strike < basePrice;
              const isITMPut = option.strike > basePrice;
              const isATM = Math.abs(option.strike - basePrice) < 2.5;
              const isHoveredCall = hoveredRow === index && hoveredSide === 'call';
              const isHoveredPut = hoveredRow === index && hoveredSide === 'put';
              
              return (
                <tr 
                  key={option.strike}
                  className={`border-b border-border/50 ${isATM ? 'bg-primary/5' : ''}`}
                >
                  {/* Call Side */}
                  <td 
                    className={`py-2 px-2 ${isITMCall ? 'bg-green-500/10' : ''}`}
                    onMouseEnter={() => { setHoveredRow(index); setHoveredSide('call'); }}
                    onMouseLeave={() => { setHoveredRow(null); setHoveredSide(null); }}
                  >
                    <div className={`flex gap-1 transition-opacity ${isHoveredCall ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={() => openTradeModal('buy', 'call', option.strike, option.callAsk)}
                        className="px-1.5 py-0.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        B
                      </button>
                      <button
                        onClick={() => openTradeModal('sell', 'call', option.strike, option.callBid)}
                        className="px-1.5 py-0.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        S
                      </button>
                      <button
                        onClick={() => openMarketDepth(option.strike, 'call')}
                        className="px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/80"
                      >
                        D
                      </button>
                    </div>
                  </td>
                  <td className={`py-2 px-1 text-right text-muted-foreground ${isITMCall ? 'bg-green-500/10' : ''}`}>
                    {option.callOI.toLocaleString()}
                  </td>
                  <td className={`py-2 px-1 text-right ${isITMCall ? 'bg-green-500/10' : ''}`}>
                    {option.callVolume.toLocaleString()}
                  </td>
                  <td className={`py-2 px-1 text-right font-medium text-green-600 ${isITMCall ? 'bg-green-500/10' : ''}`}>
                    {option.callBid.toFixed(2)}
                  </td>
                  <td className={`py-2 px-1 text-right font-medium ${isITMCall ? 'bg-green-500/10' : ''}`}>
                    {option.callAsk.toFixed(2)}
                  </td>
                  
                  {/* Strike Price */}
                  <td className={`py-2 px-2 text-center font-bold bg-muted/50 ${isATM ? 'ring-2 ring-primary' : ''}`}>
                    ₹{option.strike.toFixed(2)}
                  </td>
                  
                  {/* Put Side */}
                  <td className={`py-2 px-1 text-left font-medium text-green-600 ${isITMPut ? 'bg-red-500/10' : ''}`}>
                    {option.putBid.toFixed(2)}
                  </td>
                  <td className={`py-2 px-1 text-left font-medium ${isITMPut ? 'bg-red-500/10' : ''}`}>
                    {option.putAsk.toFixed(2)}
                  </td>
                  <td className={`py-2 px-1 text-left ${isITMPut ? 'bg-red-500/10' : ''}`}>
                    {option.putVolume.toLocaleString()}
                  </td>
                  <td className={`py-2 px-1 text-left text-muted-foreground ${isITMPut ? 'bg-red-500/10' : ''}`}>
                    {option.putOI.toLocaleString()}
                  </td>
                  <td 
                    className={`py-2 px-2 ${isITMPut ? 'bg-red-500/10' : ''}`}
                    onMouseEnter={() => { setHoveredRow(index); setHoveredSide('put'); }}
                    onMouseLeave={() => { setHoveredRow(null); setHoveredSide(null); }}
                  >
                    <div className={`flex gap-1 justify-end transition-opacity ${isHoveredPut ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={() => openTradeModal('buy', 'put', option.strike, option.putAsk)}
                        className="px-1.5 py-0.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        B
                      </button>
                      <button
                        onClick={() => openTradeModal('sell', 'put', option.strike, option.putBid)}
                        className="px-1.5 py-0.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        S
                      </button>
                      <button
                        onClick={() => openMarketDepth(option.strike, 'put')}
                        className="px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/80"
                      >
                        D
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500/20" /> ITM Calls
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/20" /> ITM Puts
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded ring-2 ring-primary" /> ATM
        </span>
        <span className="ml-auto">
          B = Buy • S = Sell • D = Market Depth
        </span>
      </div>

      {/* Trade Modal */}
      <TradeModal
        open={tradeModal.open}
        onClose={() => setTradeModal(prev => ({ ...prev, open: false }))}
        type={tradeModal.type}
        symbol={symbol}
        strikePrice={tradeModal.strikePrice}
        optionType={tradeModal.optionType}
        currentPrice={tradeModal.price}
      />

      {/* Market Depth Modal */}
      <MarketDepthModal
        open={marketDepthModal.open}
        onClose={() => setMarketDepthModal(prev => ({ ...prev, open: false }))}
        symbol={symbol}
        strikePrice={marketDepthModal.strikePrice}
        optionType={marketDepthModal.optionType}
      />
    </div>
  );
};
