// src/ui/screens/ThemeSelector.tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import chalk from 'chalk';
import { ColorManager, ThemeName, themes } from '../../utils/colorThemes.js';

interface ThemeSelectorProps {
  colorManager: ColorManager;
  onSelect: (theme: ThemeName) => void;
  onCancel: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  colorManager,
  onSelect,
  onCancel,
}) => {
  const themeNames = colorManager.getAllThemeNames();
  const [selectedIndex, setSelectedIndex] = useState(
    themeNames.indexOf(colorManager.getTheme().name)
  );
  const [previewFrame, setPreviewFrame] = useState(0);

  // Animation for preview
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPreviewFrame((prev) => prev + 1);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // typed handler to avoid implicit any
  useInput((input: string, key: { upArrow?: boolean; downArrow?: boolean; return?: boolean; escape?: boolean; name?: string }) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : themeNames.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < themeNames.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(themeNames[selectedIndex]);
    } else if (key.escape || input === 'q') {
      onCancel();
    }
  });

  const selectedTheme = themeNames[selectedIndex];
  const border = colorManager.getBorder(80, 'Theme Selector');

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Text>{border.top}</Text>
        <Box>
          <Text>{border.side}</Text>
          <Box width={78} justifyContent="center">
            <Text bold>{colorManager.gradient('  CHOOSE YOUR THEME  ')}</Text>
          </Box>
          <Text>{border.side}</Text>
        </Box>
        <Text>{border.bottom}</Text>
      </Box>

      {/* Main content */}
      <Box flexDirection="row" marginBottom={1}>
        {/* Left side - Theme list */}
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor="cyan"
          padding={1}
          width="40%"
        >
          <Text bold color="cyan" marginBottom={1}>
            Available Themes
          </Text>

          {themeNames.map((themeName, index) => {
            const theme = themes[themeName];
            const isSelected = index === selectedIndex;
            const isCurrent = themeName === colorManager.getTheme().name;

            return (
              <Box key={themeName} marginY={0}>
                <Text>
                  {isSelected ? '▶ ' : '  '}
                  {theme.displayName}
                  {isCurrent && <Text color="green"> ✓</Text>}
                </Text>
              </Box>
            );
          })}
        </Box>

        {/* Right side - Theme preview */}
        <Box flexDirection="column" marginLeft={2} width="60%">
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="magenta"
            padding={1}
          >
            <Text bold color="magenta" marginBottom={1}>
              Preview: {themes[selectedTheme].displayName}
            </Text>

            {/* Color swatches */}
            <Box flexDirection="column" marginTop={1}>
              <Text bold dimColor>
                Color Palette:
              </Text>
              <Box marginTop={1}>
                {renderColorSwatch(themes[selectedTheme])}
              </Box>
            </Box>

            {/* Sample plant preview */}
            <Box flexDirection="column" marginTop={2}>
              <Text bold dimColor>
                Sample Plant:
              </Text>
              <Box marginTop={1} flexDirection="column">
                {renderSamplePlant(themes[selectedTheme], previewFrame)}
              </Box>
            </Box>

            {/* Theme description */}
            <Box marginTop={2} flexDirection="column">
              <Text italic dimColor>
                {getThemeDescription(selectedTheme)}
              </Text>
            </Box>
          </Box>
        </Box>
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
            <Text color="cyan" bold>↑↓</Text> Navigate Themes
          </Text>
          <Text>
            <Text color="cyan" bold>Enter</Text> Select Theme
          </Text>
          <Text>
            <Text color="cyan" bold>ESC/q</Text> Cancel
          </Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box marginTop={1} justifyContent="center">
        <Text dimColor>
          🎨 Choose a theme that matches your garden's mood
        </Text>
      </Box>
    </Box>
  );
};

function renderColorSwatch(theme: typeof themes[ThemeName]): React.ReactElement {
  const allColors = [
    ...theme.primary,
    ...theme.secondary,
    ...theme.accent,
  ];

  return (
    <Box>
      {allColors.map((color, index) => {
        return (
          <Text key={index}>
            {chalk.hex(color)('███ ')}
          </Text>
        );
      })}
    </Box>
  );
}

function renderSamplePlant(
  theme: typeof themes[ThemeName],
  frame: number
): React.ReactElement[] {
  // Simple animated plant
  const sway = Math.sin(frame * 0.1) > 0 ? ' ' : '';
  
  const plantLines = [
    `${sway}      *`,
    `${sway}    * | *`,
    `${sway}   * \\|/ *`,
    `     \\|/`,
    `      |`,
    `      |`,
    `     |||`,
    `    ~~~~~`,
  ];

  return plantLines.map((line, index) => {
    const relativePos = index / plantLines.length;
    let color: string;

    if (relativePos < 0.4) {
      color = theme.accent[0];
    } else if (relativePos < 0.7) {
      color = theme.primary[1];
    } else {
      color = theme.secondary[1] || theme.secondary[0];
    }

    return (
      <Text key={index}>
        {chalk.hex(color)(line)}
      </Text>
    );
  });
}

function getThemeDescription(themeName: ThemeName): string {
  const descriptions: Record<ThemeName, string> = {
    'melancholy-green': 
      'A nostalgic forest palette. Deep greens evoke abandoned gardens slowly returning to nature.',
    'twilight-blue': 
      'Mysterious and dreamy. Blues of dusk when day meets night, perfect for introspective projects.',
    'overgrowth-red': 
      'Intense and passionate. Crimson hues suggest wild growth and untamed creative energy.',
    'lucid-dream-pink': 
      'Surreal and ethereal. Magenta tones create a dreamlike atmosphere between reality and imagination.',
    'foggy-memory-grey': 
      'Subtle and contemplative. Cool greys evoke distant memories and forgotten directories.',
  };

  return descriptions[themeName];
}

