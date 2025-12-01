// import React, { useState, useEffect } from 'react';
// import { Box, Text } from 'ink';
// import { LSystemPlant } from '../../utils/l-system.js';
// import { ColorManager } from '../../utils/colorThemes.js';
// import { Garden } from '../../utils/db.js';

// interface PlantRendererProps {
//   garden: Garden;
//   colorManager: ColorManager;
//   animate?: boolean;
//   width?: number;
//   height?: number;
// }

// export const PlantRenderer: React.FC<PlantRendererProps> = ({
//   garden,
//   colorManager,
//   animate = true,
//   width = 50,
//   height = 20,
// }) => {
//   const [frame, setFrame] = useState(0);
//   const [windBurst, setWindBurst] = useState(false);

//   useEffect(() => {
//     if (!animate) return;

//     // Main animation loop
//     const animationInterval = setInterval(() => {
//       setFrame((prev) => prev + 1);
//     }, 100);

//     // Random wind bursts
//     const windInterval = setInterval(() => {
//       if (Math.random() > 0.7) {
//         setWindBurst(true);
//         setTimeout(() => setWindBurst(false), 800);
//       }
//     }, 12000);

//     return () => {
//       clearInterval(animationInterval);
//       clearInterval(windInterval);
//     };
//   }, [animate]);

//   // Create plant from emotion
//   const plant = new LSystemPlant(
//     garden.emotion,
//     garden.health,
//     garden.growthStage
//   );

//   // Render plant to ASCII
//   const effectiveFrame = windBurst ? frame * 3 : frame;
//   const plantLines = plant.renderToASCII(width, height, effectiveFrame);

//   // Apply colors
//   const coloredLines = colorManager.colorPlant(plantLines);

//   // Add decorative elements based on emotion
//   const decorativeElements = getDecorativeElements(garden, frame);

//   return (
//     <Box flexDirection="column" alignItems="center">
//       {/* Plant display */}
//       <Box flexDirection="column">
//         {coloredLines.map((line, index) => (
//           <Text key={index}>{line}</Text>
//         ))}
//       </Box>

//       {/* Decorative floating elements */}
//       {animate && decorativeElements.length > 0 && (
//         <Box marginTop={1}>
//           <Text>{decorativeElements.join('  ')}</Text>
//         </Box>
//       )}
//     </Box>
//   );
// };

// function getDecorativeElements(garden: Garden, frame: number): string[] {
//   const { energy, melancholy, chaos } = garden.emotion;
//   const elements: string[] = [];

//   // Falling leaves for melancholy
//   if (melancholy > 0.4 && frame % 30 < 15) {
//     elements.push('🍂', '🍃');
//   }

//   // Sparkles for energy
//   if (energy > 0.4 && frame % 20 < 10) {
//     elements.push('✨', '💫');
//   }

//   // Swirls for chaos
//   if (chaos > 0.4 && frame % 25 < 12) {
//     elements.push('🌀', '💨');
//   }

//   // Gentle glow for peace
//   if (garden.emotion.peace > 0.4 && frame % 40 < 20) {
//     elements.push('・', '･');
//   }

//   return elements;
// }

// interface PlantCardProps {
//   garden: Garden;
//   colorManager: ColorManager;
//   selected?: boolean;
//   compact?: boolean;
// }

// export const PlantCard: React.FC<PlantCardProps> = ({
//   garden,
//   colorManager,
//   selected = false,
//   compact = false,
// }) => {
//   const plant = new LSystemPlant(garden.emotion, garden.health, garden.growthStage);
  
//   // Mini version for list view
//   const miniLines = plant.renderToASCII(20, 8, 0);
//   const coloredMini = colorManager.colorPlant(miniLines);

//   const daysSinceWatered = Math.floor(
//     (Date.now() - garden.lastWatered) / (1000 * 60 * 60 * 24)
//   );

//   const healthBar = colorManager.getHealthBar(garden.health, 10);

//   const border = colorManager.getBorder(compact ? 25 : 50);
//   const cursor = selected ? '▶ ' : '  ';

//   if (compact) {
//     return (
//       <Box flexDirection="column" marginY={0}>
//         <Text>{cursor}{colorManager.colorize(garden.name, 'primary')}</Text>
//         <Box marginLeft={2}>
//           <Text dimColor>{plant.getDescription()} • Health: {healthBar}</Text>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box flexDirection="column" marginY={1} borderStyle="round" borderColor={selected ? 'cyan' : 'gray'} paddingX={1}>
//       <Text bold>{colorManager.gradient(garden.name)}</Text>
      
//       <Box marginTop={1}>
//         {coloredMini.slice(0, 5).map((line, i) => (
//           <Box key={i} flexDirection="column">
//             <Text>{line}</Text>
//           </Box>
//         ))}
//       </Box>

//       <Box marginTop={1} flexDirection="column">
//         <Text>
//           <Text dimColor>Health: </Text>
//           {healthBar} <Text dimColor>{garden.health}%</Text>
//         </Text>
//         <Text dimColor>
//           Last watered: {daysSinceWatered === 0 ? 'today' : `${daysSinceWatered}d ago`}
//         </Text>
//         <Text dimColor>Emotion: {colorManager.colorize(plant.getDescription(), 'accent')}</Text>
//       </Box>
//     </Box>
//   );
// };

// interface EmotionBadgeProps {
//   emotion: string;
//   value: number;
//   colorManager: ColorManager;
// }

// export const EmotionBadge: React.FC<EmotionBadgeProps> = ({
//   emotion,
//   value,
//   colorManager,
// }) => {
//   const percentage = Math.round(value * 100);
//   const bars = Math.floor(value * 10);
//   const barDisplay = '█'.repeat(bars) + '░'.repeat(10 - bars);

//   return (
//     <Box flexDirection="column">
//       <Text>
//         {colorManager.colorize(emotion.toUpperCase(), 'accent')}: {percentage}%
//       </Text>
//       <Text dimColor>{barDisplay}</Text>
//     </Box>
//   );
// };


// src/ui/widgets/PlantRenderer.tsx
import React from 'react';
import { Box, Text } from 'ink';
import { Garden } from '../../utils/db.js';
import { ColorManager } from '../../utils/colorThemes.js';
import { LSystemPlant } from '../../utils/l-system.js';

interface PlantRendererProps {
  garden: Garden;
  colorManager: ColorManager;
  animate?: boolean;
  width?: number;
  height?: number;
}

interface PlantCardProps {
  garden: Garden;
  colorManager: ColorManager;
  selected?: boolean;
  compact?: boolean;
}

interface EmotionBadgeProps {
  emotion: string;
  value?: number | null;
  colorManager: ColorManager;
  width?: number; // maximum character width for bar
}

/**
 * Clamp helper: ensures numeric and bounded
 */
function clampNumber(v: any, min = 0, max = 100): number {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return Math.max(min, Math.min(max, Math.round(v)));
  }
  // attempt parse
  const n = Number(v);
  if (Number.isFinite(n)) {
    return Math.max(min, Math.min(max, Math.round(n)));
  }
  return min;
}

/**
 * EmotionBadge
 * Renders a label and a small progress-like bar. Defensive against negative values.
 */
export const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion, value, colorManager, width = 12 }) => {
  const v = clampNumber(value, 0, 100); // 0..100
  // compute how many blocks (0..width)
  const count = Math.round((v / 100) * width);
  const safeCount = Math.max(0, Math.min(width, count));
  const filled = '█'.repeat(safeCount);
  const empty = ' '.repeat(width - safeCount);

  // choose color based on emotion — fallback to cyan
  const color = (() => {
    const theme = colorManager.getTheme();
    switch (emotion.toLowerCase()) {
      case 'energy':
        return theme.accent?.[0] ?? '#00FFFF';
      case 'melancholy':
        return theme.primary?.[0] ?? '#8888FF';
      case 'chaos':
        return theme.secondary?.[0] ?? '#FF8888';
      case 'peace':
        return theme.primary?.[1] ?? '#88FFAA';
      default:
        return theme.accent?.[0] ?? '#AAAAAA';
    }
  })();

  // use chalk hex for colored blocks (avoid importing chalk at top-level if not available)
  let chalk: any;
  try {
    // require here so bundlers/tsc don't force chalk in non-node contexts
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    chalk = require('chalk');
  } catch {
    chalk = null;
  }

  const filledDisplay = chalk ? chalk.hex(color)(filled) : filled;

  return (
    <Box>
      <Box width={14}>
        <Text dimColor>{emotion}</Text>
      </Box>
      <Box>
        <Text>{filledDisplay}{empty}</Text>
      </Box>
      <Box marginLeft={1}>
        <Text dimColor>{v}%</Text>
      </Box>
    </Box>
  );
};

/**
 * PlantCard — compact summary used in Dashboard list
 */
export const PlantCard: React.FC<PlantCardProps> = ({ garden, colorManager, selected = false, compact = false }) => {
  const name = garden.name ?? 'Unnamed';
  const health = clampNumber(garden.health ?? 0, 0, 100);
  const heart = health >= 90 ? '❤' : health >= 50 ? '♡' : '⚠';
  return (
    <Box flexDirection="row" paddingX={1} paddingY={0} justifyContent="space-between">
      <Box>
        <Text bold={selected}>{selected ? '▶ ' : '  '}{name}</Text>
        {compact ? null : (
          <Text dimColor> — {garden.description ?? ''}</Text>
        )}
      </Box>
      <Box>
        <Text color="green">{heart} {health}%</Text>
      </Box>
    </Box>
  );
};

/**
 * PlantRenderer — placeholder L-system renderer integration
 * Uses LSystemPlant (if provided) to produce a textual description and sample ASCII art.
 */
export const PlantRenderer: React.FC<PlantRendererProps> = ({ garden, colorManager, animate = false, width = 40, height = 12 }) => {
  // Defensive garden fields
  const health = clampNumber(garden.health ?? 0, 0, 100);
  const growthStage = typeof garden.growthStage === 'number' ? Math.max(0, Math.min(3, garden.growthStage)) : 0;
  // const emotion = garden.emotion ?? { energy: 50, melancholy: 10, chaos: 5, peace: 35 };
  const emotion = garden.emotion ? { ...garden.emotion } : { energy: 50, melancholy: 10, chaos: 5, peace: 35 };

  // Use user's L-system if available to generate a description; fallback gracefully
  let plantDesc = '';
  try {
    // const plant = new LSystemPlant(emotion, health, growthStage);
    const plant = new LSystemPlant(emotion, health, growthStage);
    plantDesc = plant.getDescription();
  } catch {
    plantDesc = 'A fragile sprout';
  }

  // Simple ASCII rendering based on growthStage
  const frames = [
    ['  .  ', '  |  ', '     ', '     '],
    ['  .  ', ' /|\\ ', '  |  ', '     '],
    ['  *  ', ' /|\\ ', '/ | \\', '  |  '],
    ['  *  ', ' /|\\ ', '/ | \\', '/ | \\']
  ];
  const art = frames[Math.round(growthStage) % frames.length];

  // Color selection
  const accent = colorManager.getTheme().accent?.[0] ?? '#00FF00';

  // chalk for coloring
  let chalk: any;
  try { chalk = require('chalk'); } catch { chalk = null; }

  return (
    <Box flexDirection="column" alignItems="center">
      <Box>
        {art.map((line, i) => (
          <Text key={i}>{chalk ? chalk.hex(accent)(line.padEnd(width).slice(0, width)) : line}</Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor italic>{plantDesc}</Text>
      </Box>

      {/* small emotion badges */}
      <Box marginTop={1} flexDirection="column">
        <EmotionBadge emotion="Energy" value={emotion.energy} colorManager={colorManager} width={12} />
        <EmotionBadge emotion="Melancholy" value={emotion.melancholy} colorManager={colorManager} width={12} />
        <EmotionBadge emotion="Chaos" value={emotion.chaos} colorManager={colorManager} width={12} />
        <EmotionBadge emotion="Peace" value={emotion.peace} colorManager={colorManager} width={12} />
      </Box>
    </Box>
  );
};

export default PlantRenderer;
