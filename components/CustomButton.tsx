import { HStack } from '@/components/ui/hstack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import React from 'react';

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  leftIcon?: any;
  iconColor?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = '',
  textStyles = '',
  isLoading = false,
  leftIcon,
  iconColor,
  ...props
}) => {
  return (
    <Button onPress={handlePress} isDisabled={isLoading} className={`rounded-full min-h-12 ${containerStyles}`}>
      <HStack className='items-center'>
        {leftIcon && (
          <Text className={`mr-2 ${iconColor}`}>
            {leftIcon}
          </Text>
        )}
        <Text className={`text-primary font-semibold text-lg ${textStyles}`}>
          {title}
        </Text>
        {isLoading && <Spinner size="small" color="white" />}
      </HStack>
    </Button>
  );
};

export default CustomButton;
