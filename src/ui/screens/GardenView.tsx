import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Garden, GardenDB } from '../../utils/db.js';
import { ColorManager } from '../../utils/colorThemes.js';
import { PlantRenderer, EmotionBadge } from '../widgets/PlantRenderer.js';
import { LSystemPlant } from '../../utils/l-system.js';

interface GardenViewProps {
  garden: Garden;
  db: GardenDB;
  colorManager: ColorManager;
  onBack: () => void;
}

export const GardenView: React.FC<GardenViewProps> = ({
  garden,
  db,
  colorManager,
  onBack,
}) => {
  const [currentGarden, setCurrentGarden] = useState(garden);
  const [showDetails, setShowDetails] = useState(true);
  const [waterAnimation, setWaterAnimation] = useState(false);

  useEffect(() => {
    // Refresh garden data
    const updated = db.getGarden(garden.id);
    if (updated) {
      setCurrentGarden(updated);
    }
  }, [garden.id, db]);

  useInput((input: string, key: { escape?: boolean; upArrow?: boolean; downArrow?: boolean; ctrl?: boolean; meta?: boolean; shift?: boolean; name?: string }) => {
  if (input === 'q' || key.escape) {
    onBack();
  } else if (input === 'w') {
    waterPlant();
  } else if (input === 'd') {
    setShowDetails(!showDetails);
  } else if (input === 'g') {
    growPlant();
  }
});


  const waterPlant = () => {
    setWaterAnimation(true);
    
    const updated = db.waterGarden(currentGarden.id);
    if (updated) {
      setCurrentGarden(updated);
    }

    setTimeout(() => {
      setWaterAnimation(false);
    }, 2000);
  };

  const growPlant = () => {
    const newStage = Math.min(currentGarden.growthStage + 0.5, 3);
    const updated = db.updateGarden(currentGarden.id, {
      growthStage: newStage,
    });
    if (updated) {
      setCurrentGarden(updated);
    }
  };

  const daysSinceWatered = Math.floor(
    (Date.now() - currentGarden.lastWatered) / (1000 * 60 * 60 * 24)
  );

  const daysSincePlanted = Math.floor(
    (Date.now() - currentGarden.plantedAt) / (1000 * 60 * 60 * 24)
  );

  const plant = new LSystemPlant(
    currentGarden.emotion,
    currentGarden.health,
    currentGarden.growthStage
  );

  const border = colorManager.getBorder(80, currentGarden.name);

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Text>{border.top}</Text>
        <Box>
          <Text>{border.side}</Text>
          <Box width={78} justifyContent="center">
            <Text bold>{colorManager.gradient(`  ${currentGarden.name.toUpperCase()}  `)}</Text>
          </Box>
          <Text>{border.side}</Text>
        </Box>
        <Text>{border.bottom}</Text>
      </Box>

      {/* Main content area */}
      <Box flexDirection="row" marginBottom={1}>
        {/* Left side - Plant display */}
        <Box flexDirection="column" width="60%">
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="green"
            padding={1}
            alignItems="center"
          >
            <PlantRenderer
              garden={currentGarden}
              colorManager={colorManager}
              animate={true}
              width={45}
              height={18}
            />
          </Box>

          {/* Water animation */}
          {waterAnimation && (
            <Box marginTop={1} justifyContent="center">
              <Text color="cyan" bold>
                💧 💧 💧 Watering... 💧 💧 💧
              </Text>
            </Box>
          )}

          {/* Plant description */}
          <Box marginTop={1} justifyContent="center">
            <Text italic dimColor>
              "{plant.getDescription()}"
            </Text>
          </Box>
        </Box>

        {/* Right side - Details */}
        {showDetails && (
          <Box flexDirection="column" marginLeft={2} width="40%">
            {/* Health section */}
            <Box
              flexDirection="column"
              borderStyle="round"
              borderColor="cyan"
              paddingX={1}
              marginBottom={1}
            >
              <Text bold color="cyan">
                ❤ Health Status
              </Text>
              <Box marginTop={1} flexDirection="column">
                <Text>
                  Health: {colorManager.getHealthBar(currentGarden.health, 15)}
                </Text>
                <Text dimColor>
                  {currentGarden.health}% • {getHealthStatus(currentGarden.health)}
                </Text>
              </Box>
              <Box marginTop={1} flexDirection="column">
                <Text dimColor>
                  Last watered: {daysSinceWatered === 0 ? 'today' : `${daysSinceWatered}d ago`}
                </Text>
                <Text dimColor>
                  Age: {daysSincePlanted} days
                </Text>
                <Text dimColor>
                  Growth stage: {currentGarden.growthStage.toFixed(1)}/3.0
                </Text>
              </Box>
            </Box>

            {/* Emotion section */}
            <Box
              flexDirection="column"
              borderStyle="round"
              borderColor="magenta"
              paddingX={1}
              marginBottom={1}
            >
              <Text bold color="magenta">
                🎭 Emotional Profile
              </Text>
              <Box marginTop={1} flexDirection="column">
                <EmotionBadge
                  emotion="Energy"
                  value={currentGarden.emotion.energy}
                  colorManager={colorManager}
                />
                <EmotionBadge
                  emotion="Melancholy"
                  value={currentGarden.emotion.melancholy}
                  colorManager={colorManager}
                />
                <EmotionBadge
                  emotion="Chaos"
                  value={currentGarden.emotion.chaos}
                  colorManager={colorManager}
                />
                <EmotionBadge
                  emotion="Peace"
                  value={currentGarden.emotion.peace}
                  colorManager={colorManager}
                />
              </Box>
            </Box>

            {/* Directory info */}
            <Box
              flexDirection="column"
              borderStyle="round"
              borderColor="yellow"
              paddingX={1}
            >
              <Text bold color="yellow">
                📁 Directory Info
              </Text>
              <Box marginTop={1} flexDirection="column">
                <Text dimColor wrap="truncate-end">
                  Path: {currentGarden.directoryPath}
                </Text>
                <Text dimColor>
                  Files: {currentGarden.fileCount}
                </Text>
                <Text dimColor>
                  Size: {formatSize(currentGarden.totalSize)}
                </Text>
                <Text dimColor>
                  Complexity: {plant.getComplexity()} nodes
                </Text>
              </Box>
              {currentGarden.description && (
                <Box marginTop={1}>
                  <Text italic dimColor wrap="wrap">
                    "{currentGarden.description}"
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold dimColor>
          Controls
        </Text>
        <Box justifyContent="space-between" marginTop={1}>
          <Text>
            <Text color="cyan" bold>w</Text> Water Plant
          </Text>
          <Text>
            <Text color="cyan" bold>g</Text> Grow (+0.5 stage)
          </Text>
          <Text>
            <Text color="cyan" bold>d</Text> Toggle Details
          </Text>
          <Text>
            <Text color="cyan" bold>q</Text> Back to Dashboard
          </Text>
        </Box>
      </Box>

      {/* Status messages */}
      <Box marginTop={1} justifyContent="center">
        <Text dimColor>
          {getStatusMessage(currentGarden)}
        </Text>
      </Box>
    </Box>
  );
};

function getHealthStatus(health: number): string {
  if (health >= 90) return 'Thriving';
  if (health >= 70) return 'Healthy';
  if (health >= 50) return 'Stable';
  if (health >= 30) return 'Wilting';
  return 'Critical';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getStatusMessage(garden: Garden): string {
  const health = garden.health;
  const daysSinceWatered = Math.floor(
    (Date.now() - garden.lastWatered) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceWatered > 7) {
    return '🥀 This plant needs water desperately!';
  }
  
  if (health < 30) {
    return '⚠️  Critical health - water immediately!';
  }
  
  if (health < 50) {
    return '💧 This plant could use some care';
  }
  
  if (daysSinceWatered === 0) {
    return '✨ Freshly watered and happy!';
  }
  
  if (health >= 90) {
    return '🌟 This plant is thriving beautifully!';
  }

  return '🌱 Everything looks peaceful here';
}
