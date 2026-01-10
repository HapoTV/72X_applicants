import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'box-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          type?: 'solid' | 'logo' | 'regular';
          color?: string;
          size?: string;
          rotate?: number;
          flip?: 'horizontal' | 'vertical';
          border?: 'square' | 'circle' | 'rounded';
          animation?: 'spin' | 'tada' | 'flash' | 'bounce' | 'spin-hover' | 'tada-hover' | 'flash-hover' | 'bounce-hover';
          pull?: 'left' | 'right';
          className?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}
