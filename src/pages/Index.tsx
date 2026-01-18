import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutManager } from '@/layout/LayoutManager';

const Index = () => {
  return (
    <ThemeProvider>
      <LayoutManager />
    </ThemeProvider>
  );
};

export default Index;
