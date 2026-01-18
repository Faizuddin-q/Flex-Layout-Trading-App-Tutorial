import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { MarketDepthPanel } from '../panels/MarketDepthPanel';

interface MarketDepthModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  strikePrice: number;
  optionType: 'call' | 'put';
}

export const MarketDepthModal: React.FC<MarketDepthModalProps> = ({
  open,
  onClose,
  symbol,
  strikePrice,
  optionType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] p-0 overflow-hidden">
        <MarketDepthPanel 
          symbol={symbol}
          strikePrice={strikePrice}
          optionType={optionType}
        />
      </DialogContent>
    </Dialog>
  );
};
