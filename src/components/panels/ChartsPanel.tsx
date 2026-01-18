import React from 'react';
import { VscGraph, VscArrowUp, VscArrowDown } from 'react-icons/vsc';

interface ChartsPanelProps {
  nodeId?: string;
  symbol?: string;
}

// Mock chart data points
const mockChartData = [
  { time: '09:30', price: 185.20 },
  { time: '10:00', price: 186.45 },
  { time: '10:30', price: 185.80 },
  { time: '11:00', price: 187.10 },
  { time: '11:30', price: 188.25 },
  { time: '12:00', price: 187.90 },
  { time: '12:30', price: 189.15 },
  { time: '13:00', price: 188.70 },
  { time: '13:30', price: 190.20 },
  { time: '14:00', price: 191.45 },
  { time: '14:30', price: 190.80 },
  { time: '15:00', price: 192.30 },
  { time: '15:30', price: 191.85 },
  { time: '16:00', price: 193.50 },
];

export const ChartsPanel: React.FC<ChartsPanelProps> = ({ symbol = 'AAPL' }) => {
  const currentPrice = mockChartData[mockChartData.length - 1].price;
  const openPrice = mockChartData[0].price;
  const change = currentPrice - openPrice;
  const changePercent = ((change / openPrice) * 100).toFixed(2);
  const isPositive = change >= 0;

  const minPrice = Math.min(...mockChartData.map(d => d.price));
  const maxPrice = Math.max(...mockChartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  // Generate SVG path for the chart
  const chartWidth = 100;
  const chartHeight = 60;
  const points = mockChartData.map((d, i) => {
    const x = (i / (mockChartData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.price - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="flex flex-col h-full bg-card text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <VscGraph className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{symbol}</h2>
              <span className="text-xs text-muted-foreground">NASDAQ</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">${currentPrice.toFixed(2)}</div>
            <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <VscArrowUp size={12} /> : <VscArrowDown size={12} />}
              <span>{isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-4">
        <div className="h-full bg-muted/30 rounded-lg p-4 flex flex-col">
          <div className="flex gap-2 mb-4">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  period === '1D'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* SVG Chart */}
          <div className="flex-1 relative min-h-[200px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
              {/* Gradient fill */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d={`${pathD} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                strokeWidth="0.5"
              />
            </svg>
          </div>

          {/* Time labels */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>09:30</span>
            <span>11:00</span>
            <span>12:30</span>
            <span>14:00</span>
            <span>16:00</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="p-4 border-t border-border grid grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Open</span>
          <div className="font-medium">${openPrice.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">High</span>
          <div className="font-medium">${maxPrice.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Low</span>
          <div className="font-medium">${minPrice.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Volume</span>
          <div className="font-medium">48.2M</div>
        </div>
      </div>
    </div>
  );
};
