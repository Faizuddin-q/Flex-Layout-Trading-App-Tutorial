import React, { useState } from 'react';
import { VscAdd, VscClose, VscSearch } from 'react-icons/vsc';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const AVAILABLE_ITEMS: WatchlistItem[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2780.45, change: 12.30, changePercent: 0.44 },
  { symbol: 'TCS', name: 'Tata Consultancy Svcs', price: 3884.20, change: -15.45, changePercent: -0.40 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1642.65, change: 8.15, changePercent: 0.50 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1653.40, change: -5.60, changePercent: -0.34 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 998.10, change: 5.20, changePercent: 0.52 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 639.90, change: -3.65, changePercent: -0.57 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1074.50, change: 14.85, changePercent: 1.40 },
  { symbol: 'ITC', name: 'ITC Ltd', price: 466.55, change: 2.45, changePercent: 0.53 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', price: 3585.60, change: 30.10, changePercent: 0.85 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 817.50, change: -0.20, changePercent: -0.02 },
];

export const WatchlistPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    AVAILABLE_ITEMS[0], // RELIANCE
    AVAILABLE_ITEMS[2], // HDFCBANK
  ]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredItems = AVAILABLE_ITEMS.filter(
    item => 
      !watchlist.some(w => w.symbol === item.symbol) &&
      (item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist([...watchlist, item]);
    setSearchQuery('');
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground">
      {/* Header / Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <VscSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-muted/50 border border-border rounded-md pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          
          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-48 overflow-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <button
                    key={item.symbol}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex justify-between items-center"
                    onClick={() => addToWatchlist(item)}
                  >
                    <span>
                      <span className="font-bold mr-2">{item.symbol}</span>
                      <span className="text-muted-foreground text-xs">{item.name}</span>
                    </span>
                    <VscAdd className="text-muted-foreground" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="flex-1 overflow-auto">
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <span className="text-sm">Your watchlist is empty</span>
            <span className="text-xs mt-1">Search symbols to add them</span>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {watchlist.map(item => (
              <div key={item.symbol} className="p-3 hover:bg-muted/30 group flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.symbol}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="font-mono">₹{item.price.toFixed(2)}</span>
                    <span className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(item.symbol)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove"
                >
                  <VscClose />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
