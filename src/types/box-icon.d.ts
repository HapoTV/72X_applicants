import { SVGProps } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'box-icon': SVGProps<SVGSVGElement> & {
        name?: string;
        type?: 'solid' | 'regular' | 'logo';
        color?: string;
        size?: string;
        [key: string]: any;
      };
    }
  }
}
