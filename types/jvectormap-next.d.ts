declare module 'jvectormap-next' {
  import { ComponentType } from 'react';
  
  interface VectorMapProps {
    map: string;
    backgroundColor?: string;
    containerStyle?: React.CSSProperties;
    regionStyle?: {
      initial?: Record<string, any>;
      hover?: Record<string, any>;
    };
    markerStyle?: {
      initial?: Record<string, any>;
    };
    markers?: Array<{
      latLng: [number, number];
      name: string;
    }>;
    onMarkerClick?: (event: any, index: number) => void;
    labels?: {
      regions?: {
        render: (code: string) => {
          fontSize: string;
          fontFamily: string;
          fill: string;
        };
      };
    };
  }

  const VectorMap: ComponentType<VectorMapProps>;
  export default VectorMap;
} 