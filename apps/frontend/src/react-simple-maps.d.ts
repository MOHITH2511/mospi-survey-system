declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    projection?: string | Function;
    projectionConfig?: any;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onMouseLeave?: React.MouseEventHandler;
  }

  export interface GeographiesProps {
    geography?: any;
    children?: (data: { geographies: any[] }) => React.ReactNode;
  }

  export interface GeographyProps {
    key?: string | number;
    geography?: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onClick?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  export class ComposableMap extends React.Component<ComposableMapProps> {}
  export class Geographies extends React.Component<GeographiesProps> {}
  export class Geography extends React.Component<GeographyProps> {}
  export class Marker extends React.Component<MarkerProps> {}
}
