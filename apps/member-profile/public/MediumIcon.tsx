
/// <reference types="react" />
import { FC, SVGAttributes } from 'react';
interface IconProps extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}
type Icon = FC<IconProps>;

const MediumIcon: Icon = ({color='currentColor',size=24,...props}) => (

    <svg 
        width={size}
        height={size}
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M 0.306 21.7513 l 2.7984 -3.6234 v -12.474 L 0.6228 2.5057 V 2.0305 H 7.2228 l 5.28 12.5928 L 17.1492 2.0305 H 23.538 v 0.4752 l -2.112 2.1978 V 19.6129 l 2.112 2.1384 v 0.4281 H 14.3508 v -0.4752 l 2.1648 -2.8512 V 7.7329 L 11.2356 22.2265 H 10.5492 L 4.4244 8.0299 V 18.0091 l 2.7984 3.7422 V 22.2265 H 0.306 Z"/>

    </svg>
);

export default MediumIcon;

