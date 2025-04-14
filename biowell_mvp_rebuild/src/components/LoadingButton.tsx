import React, { useState } from 'react';
import Button from './Button';
import type { ButtonProps } from './Button';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  onAction: () => Promise<void>;
  loadingText?: string;
}

export default function LoadingButton({
  children,
  onAction,
  loadingText = 'Loading...',
  ...props
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onAction();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      {...props}
      loading={loading}
      onClick={handleClick}
      disabled={loading || props.disabled}
    >
      {loading ? loadingText : children}
    </Button>
  );
}