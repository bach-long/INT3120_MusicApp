import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const RepeatIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="0 0 256 256" stroke={color} strokeWidth={3.8}>
      <Path
        d="M28 128a68.077 68.077 0 0168-68h118.343l-17.171-17.172a4 4 0 015.656-5.656l23.998 23.998a4.019 4.019 0 01.5.612c.065.097.11.201.165.302a3.947 3.947 0 01.203.386 3.907 3.907 0 01.126.404c.033.115.077.224.101.343a4.012 4.012 0 010 1.566c-.024.119-.068.228-.101.342a3.907 3.907 0 01-.126.405 3.947 3.947 0 01-.203.385c-.055.102-.1.206-.164.303a4.048 4.048 0 01-.5.612l-23.999 23.998a4 4 0 01-5.656-5.656L214.342 68H96a60.068 60.068 0 00-60 60 4 4 0 01-8 0zm196-4a4 4 0 00-4 4 60.068 60.068 0 01-60 60H41.657l17.171-17.172a4 4 0 00-5.656-5.656L29.174 189.17a4.022 4.022 0 00-.5.612c-.066.097-.11.203-.166.304a3.97 3.97 0 00-.202.384 3.93 3.93 0 00-.126.406c-.034.114-.078.223-.101.34a4.012 4.012 0 000 1.567c.023.118.067.227.1.341a3.93 3.93 0 00.127.406 3.97 3.97 0 00.202.384c.056.101.1.207.165.304a4.045 4.045 0 00.5.612l23.999 23.998a4 4 0 105.656-5.656L41.658 196H160a68.077 68.077 0 0068-68 4 4 0 00-4-4z"
        fill={fill}
      />
    </Svg>
  );
};
