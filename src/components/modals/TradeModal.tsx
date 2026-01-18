import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  symbol: string;
  strikePrice?: number;
  optionType?: 'call' | 'put';
  currentPrice: number;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  open,
  onClose,
  type,
  symbol,
  strikePrice,
  optionType,
  currentPrice,
}) => {
  const [quantity, setQuantity] = useState('1');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toString());

  const totalValue = parseFloat(quantity || '0') * (orderType === 'limit' ? parseFloat(limitPrice || '0') : currentPrice);
  const isBuy = type === 'buy';

  const handleSubmit = () => {
    // Mock submission - just close the modal
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${isBuy ? 'bg-green-600' : 'bg-red-600'}`}>
              {type.toUpperCase()}
            </span>
            {symbol}
            {strikePrice && optionType && (
              <span className="text-muted-foreground font-normal text-sm">
                ${strikePrice} {optionType.toUpperCase()}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current Price Display */}
          <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="font-bold text-lg">${currentPrice.toFixed(2)}</span>
          </div>

          {/* Order Type */}
          <div className="grid gap-2">
            <Label>Order Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={orderType === 'market' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrderType('market')}
                className="flex-1"
              >
                Market
              </Button>
              <Button
                type="button"
                variant={orderType === 'limit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrderType('limit')}
                className="flex-1"
              >
                Limit
              </Button>
            </div>
          </div>

          {/* Limit Price (conditional) */}
          {orderType === 'limit' && (
            <div className="grid gap-2">
              <Label htmlFor="limitPrice">Limit Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="limitPrice"
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Estimated Total */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Total</span>
              <span className={`font-bold text-lg ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
                ${totalValue.toFixed(2)}
              </span>
            </div>
            {optionType && (
              <div className="text-xs text-muted-foreground mt-1">
                (1 contract = 100 shares)
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className={isBuy ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isBuy ? 'Buy' : 'Sell'} {quantity} {optionType ? 'Contract(s)' : 'Share(s)'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
