import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface AnimatedPriceProps {
  price: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: string | { xs?: string; sm?: string; md?: string };
  fontWeight?: number;
  color?: string;
  gradient?: string;
}

/**
 * AnimatedPrice - Displays a price with a smooth count-up animation
 * when the value changes (e.g., monthly/yearly toggle)
 */
const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  price,
  duration = 500,
  prefix = '$',
  suffix = '',
  fontSize = '2.5rem',
  fontWeight = 800,
  color,
  gradient,
}) => {
  const [displayValue, setDisplayValue] = useState(price);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousPrice = useRef(price);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = previousPrice.current;
    const endValue = price;
    const startTime = performance.now();

    // Skip animation for initial render or same value
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        previousPrice.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [price, duration]);

  const textStyles = gradient
    ? {
        background: gradient,
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : { color: color || 'inherit' };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'baseline',
        transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.15s ease',
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize,
          fontWeight,
          lineHeight: 1,
          ...textStyles,
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </Typography>
    </Box>
  );
};

export default AnimatedPrice;
