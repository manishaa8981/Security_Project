declare module 'react-color-extractor' {
    import { ReactNode } from 'react';
  
    interface ColorExtractorProps {
      getColors: (colors: string[]) => void;
      children: ReactNode;
    }
  
    const ColorExtractor: (props: ColorExtractorProps) => JSX.Element;
    
    export { ColorExtractor };
  }