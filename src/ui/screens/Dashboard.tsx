// src/ui/screens/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { GardenDB, Garden } from '../../utils/db';
import { ColorManager } from '../../utils/colorThemes';
import { PlantCard } from '../widgets/PlantRenderer';

interface DashboardProps {
  db: GardenDB;
  colorManager: ColorManager;
  onViewPlant: (garden: Garden) => void;
  onPlantNew: () => void;
  onChangeTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  db,
  colorManager,
  onViewPlant,
  onPlantNew,
  onChangeTheme,
}) => {
  const { exit } = useApp();
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    loadGardens();
  }, []);

  const loadGardens = () => {
    const allGardens = db.getAllGardens();
    setGardens(allGardens);
  };

  useInput((input, key) => {
    // Hide help after first interaction
    if (showHelp) {
      setShowHelp(false);
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : gardens.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < gardens.length - 1 ? prev + 1 : 0));
    } else if (input === 'v' && gardens.length > 0) {
      onViewPlant(gardens[selectedIndex]);
    } else if (input === 'w' && gardens.length > 0) {
      waterSelectedGarden();
    } else if (input === 'p') {
      onPlantNew();
    } else if (input === 'c') {
      onChangeTheme();
    } else if (input === 'd' && gardens.length > 0) {
      deleteSelectedGarden();
    } else if (input === 'q') {
      exit();
    } else if (input === 'h') {
      setShowHelp(!showHelp);
    }
  });

  const waterSelectedGarden = () => {
    const garden = gardens[selectedIndex];
    const updated = db.waterGarden(garden.id);
    if (updated) {
      loadGardens();
    }
  };

  const deleteSelectedGarden = () => {
    const garden = gardens[selectedIndex];
    db.deleteGarden(garden.id);
    setSelectedIndex((prev) => Math.max(0, prev - 1));
    loadGardens();
  };

  const border = colorManager.getBorder(80, 'Your Garden');

  // New: dynamic label - "Garden" when exactly 1, otherwise "Plants"
  const countLabel = gardens.length === 1 ? 'Garden' : 'Plants';

  return (
    <Box flexDirection="column" padding={1}>
      {/* Title */}
      <Box flexDirection="column" marginBottom={1}>
        <Text>{border.top}</Text>
        <Box>
          <Text>{border.side}</Text>
          <Box flexDirection="column" width={78}>
            <Text bold>{colorManager.gradient('  GARDEN OF DEAD PROJECTS  ')}</Text>
            <Text dimColor>  Where abandoned directories bloom into art</Text>
          </Box>
          <Text>{border.side}</Text>
        </Box>
        <Text>{border.bottom}</Text>
      </Box>

      {/* Stats bar */}
      <Box marginBottom={1} justifyContent="space-between">
        <Text>
          <Text dimColor>{countLabel}: </Text>
          <Text bold color="cyan">{gardens.length}</Text>
        </Text>
        <Text>
          <Text dimColor>Theme: </Text>
          <Text>{colorManager.getTheme().displayName}</Text>
        </Text>
        <Text>
          <Text dimColor>Total Health: </Text>
          <Text bold color="green">
            {gardens.length > 0
              ? Math.round(gardens.reduce((sum, g) => sum + g.health, 0) / gardens.length)
              : 0}%
          </Text>
        </Text>
      </Box>

      {/* Gardens list */}
      {gardens.length === 0 ? (
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginY={3}
          borderStyle="round"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
        >
          <Text dimColor>🌱 Your garden is empty</Text>
          <Text dimColor>Press 'p' to plant your first directory</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          <Text bold dimColor marginBottom={1}>
            ═══ Your Plants ═══
          </Text>
          
          <Box flexDirection="column" marginBottom={1}>
            {gardens.map((garden, index) => (
              <PlantCard
                key={garden.id}
                garden={garden}
                colorManager={colorManager}
                selected={index === selectedIndex}
                compact={true}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Controls */}
      <Box
        flexDirection="column"
        marginTop={1}
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold dimColor>
          Controls
        </Text>
        <Box flexDirection="column" marginTop={1}>
          <Box justifyContent="space-between">
            <Text>
              <Text color="cyan" bold>↑↓</Text> Navigate
            </Text>
            <Text>
              <Text color="cyan" bold>v</Text> View Plant
            </Text>
            <Text>
              <Text color="cyan" bold>w</Text> Water
            </Text>
          </Box>
          <Box justifyContent="space-between" marginTop={0}>
            <Text>
              <Text color="cyan" bold>p</Text> Plant New
            </Text>
            <Text>
              <Text color="cyan" bold>c</Text> Change Theme
            </Text>
            <Text>
              <Text color="cyan" bold>d</Text> Delete
            </Text>
          </Box>
          <Box justifyContent="space-between" marginTop={0}>
            <Text>
              <Text color="cyan" bold>h</Text> Toggle Help
            </Text>
            <Text>
              <Text color="cyan" bold>q</Text> Quit
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Help text */}
      {showHelp && (
        <Box
          marginTop={1}
          borderStyle="round"
          borderColor="yellow"
          paddingX={1}
          flexDirection="column"
        >
          <Text color="yellow" bold>
            💡 Welcome to Your Garden!
          </Text>
          <Text dimColor>
            Each directory becomes a living plant with emotions based on its activity.
          </Text>
          <Text dimColor>
            • Recently active projects grow bright and energetic
          </Text>
          <Text dimColor>
            • Abandoned directories become melancholic and wilted
          </Text>
          <Text dimColor>
            • Large, complex projects appear chaotic and tangled
          </Text>
          <Text dimColor marginTop={1}>
            Water your plants regularly to keep them healthy! 💧
          </Text>
        </Box>
      )}

      {/* Footer with animation */}
      <Box marginTop={1} justifyContent="center">
        <Text dimColor>
          {getFooterAnimation(Date.now())}
        </Text>
      </Box>
    </Box>
  );
};

function getFooterAnimation(timestamp: number): string {
  const frames = [
    '🌱 Growing...',
    '🌿 Blooming...',
    '🍃 Swaying...',
    '✨ Dreaming...',
  ];

  const index = Math.floor(timestamp / 1000) % frames.length;
  return frames[index];
}
