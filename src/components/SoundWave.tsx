import React from 'react';
import { Box } from '@mui/material';

interface SoundWaveProps {
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

const SoundWave: React.FC<SoundWaveProps> = ({
  width = '100%',
  height = 300,
  animated = true
}) => {
  // Seeded random for consistent but organic look
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  // Generate frequency-style wave with varying amplitudes
  const generateWavePath = (
    startX: number,
    endX: number,
    centerY: number,
    baseAmplitude: number,
    frequency: number,
    phase: number = 0,
    seed: number = 0
  ) => {
    const points: string[] = [];
    const steps = 300;
    const stepSize = (endX - startX) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = startX + i * stepSize;
      const progress = i / steps;

      // Base envelope - fades at edges
      const edgeFade = Math.sin(progress * Math.PI);

      // Create varying amplitude zones to simulate audio frequency
      // Higher amplitude in center-left and center-right areas
      const zone1 = Math.exp(-Math.pow((progress - 0.3) * 4, 2)) * 1.4; // Peak around 30%
      const zone2 = Math.exp(-Math.pow((progress - 0.5) * 3, 2)) * 1.8; // Highest peak at center
      const zone3 = Math.exp(-Math.pow((progress - 0.7) * 4, 2)) * 1.3; // Peak around 70%

      // Add some organic variation using seeded randomness
      const variation = 0.7 + seededRandom(i * 0.1 + seed) * 0.6;

      // Combine all amplitude modifiers
      const amplitudeModifier = edgeFade * Math.max(zone1, zone2, zone3, 0.3) * variation;
      const amplitude = baseAmplitude * amplitudeModifier;

      // Main wave with slight frequency variation for organic feel
      const freqVariation = 1 + (seededRandom(i * 0.05 + seed + 100) - 0.5) * 0.1;
      const y = centerY + Math.sin((progress * frequency * Math.PI * 2 * freqVariation) + phase) * amplitude;

      if (i === 0) {
        points.push(`M ${x},${y}`);
      } else {
        points.push(`L ${x},${y}`);
      }
    }

    return points.join(' ');
  };

  // Create multiple wave layers with different characteristics
  const waves = [
    { amplitude: 70, frequency: 6, phase: 0, opacity: 1, strokeWidth: 2.5, seed: 1 },
    { amplitude: 65, frequency: 6.2, phase: 0.4, opacity: 0.7, strokeWidth: 2, seed: 2 },
    { amplitude: 60, frequency: 5.8, phase: 0.8, opacity: 0.5, strokeWidth: 1.5, seed: 3 },
  ];

  return (
    <Box sx={{ width, height, position: 'relative' }}>
      <svg
        viewBox="0 0 800 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="soundwave-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger blur for background glow */}
          <filter id="soundwave-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Gradient for the wave - blue to white to blue */}
          <linearGradient id="soundwave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="15%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="65%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          {/* Gradient for glow layer */}
          <linearGradient id="soundwave-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="20%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background glow layers */}
        {waves.map((wave, index) => (
          <path
            key={`glow-${index}`}
            d={generateWavePath(0, 800, 100, wave.amplitude, wave.frequency, wave.phase, wave.seed)}
            fill="none"
            stroke="url(#soundwave-glow-gradient)"
            strokeWidth={wave.strokeWidth * 6}
            strokeLinecap="round"
            filter="url(#soundwave-blur)"
            opacity={wave.opacity * 0.4}
          />
        ))}

        {/* Main wave lines */}
        {waves.map((wave, index) => (
          <path
            key={`wave-${index}`}
            d={generateWavePath(0, 800, 100, wave.amplitude, wave.frequency, wave.phase, wave.seed)}
            fill="none"
            stroke="url(#soundwave-gradient)"
            strokeWidth={wave.strokeWidth}
            strokeLinecap="round"
            filter="url(#soundwave-glow)"
            opacity={wave.opacity}
            className={animated ? 'soundwave-animate' : ''}
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          />
        ))}

        <style>
          {`
            @keyframes soundwavePulse {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 1; }
            }
            .soundwave-animate {
              animation: soundwavePulse 3s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </Box>
  );
};

export default SoundWave;
