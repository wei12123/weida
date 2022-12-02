/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';

// External dependencies.
import {
  IconNames,
  IconProps,
} from '../../../component-library/components/Icons/Icon';
import TextWithPrefixIcon from '../../../component-library/components/Texts/TextWithPrefixIcon';
import { TextVariants } from '../../../component-library/components/Texts/Text/Text.types';

// Internal dependencies.
import {
  TILDE_ICON_SIZE_BY_TEXT_VARIANT,
  TEXT_ESTIMATED_TEST_ID,
} from './TextEstimated.constants';
import { TextEstimatedProps } from './TextEstimated.types';

const TextEstimated: React.FC<TextEstimatedProps> = ({
  variant = TextVariants.sBodyMD,
  children,
  ...props
}) => {
  const iconProps: IconProps = {
    name: IconNames.Tilde,
    size: TILDE_ICON_SIZE_BY_TEXT_VARIANT[variant],
  };
  return (
    <TextWithPrefixIcon
      iconProps={iconProps}
      variant={variant}
      testID={TEXT_ESTIMATED_TEST_ID}
      {...props}
    >
      {children}
    </TextWithPrefixIcon>
  );
};

export default TextEstimated;
