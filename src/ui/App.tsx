// src/ui/App.tsx
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { GardenDB, Garden } from '../utils/db.js';
import { ColorManager, ThemeName } from '../utils/colorThemes.js';
import { Dashboard } from './screens/Dashboard.js';
import { GardenView } from './screens/GardenView.js';
import { PlantForm } from './screens/PlantForm.js';
import { ThemeSelector } from './screens/ThemeSelector.js';

type Screen = 'landing' | 'dashboard' | 'view' | 'plant' | 'theme';

export const App: React.FC = () => {
  const [db] = useState(() => new GardenDB());
  const [colorManager] = useState(() => new ColorManager('melancholy-green'));
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  // Auto-transition from landing to dashboard
  React.useEffect(() => {
    if (screen === 'landing') {
      const timer = setTimeout(() => {
        setShowLanding(false);
        setScreen('dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleViewPlant = (garden: Garden) => {
    setSelectedGarden(garden);
    setScreen('view');
  };

  const handlePlantNew = () => {
    setScreen('plant');
  };

  const handleChangeTheme = () => {
    setScreen('theme');
  };

  const handleThemeSelect = (theme: ThemeName) => {
    colorManager.setTheme(theme);
    setScreen('dashboard');
  };

  const handleBack = () => {
    setSelectedGarden(null);
    setScreen('dashboard');
  };

  // Handlers for PlantForm (moved into App so they are in scope where <PlantForm /> is rendered)
  const handlePlantCreated = (id: string) => {
    // Minimal behavior: navigate back to dashboard.
    // Optionally: attempt to load the created garden by id and select it.
    // If your DB returns an object or id, adapt this logic to setSelectedGarden accordingly.
    // eslint-disable-next-line no-console
    console.log('Plant created with id:', id);
    setScreen('dashboard');

    // Try to select the created garden if possible:
    try {
      if (id) {
        const maybe = db.getGarden(id);
        if (maybe) setSelectedGarden(maybe);
      }
    } catch {
      // ignore if db doesn't support getGarden by id
    }
  };

  const handlePlantCancel = () => {
    // Cancel planting and return to dashboard
    // eslint-disable-next-line no-console
    console.log('PlantForm cancelled');
    setScreen('dashboard');
  };

  if (showLanding) {
    return <LandingScreen />;
  }

  return (
    <Box flexDirection="column">
      {screen === 'dashboard' && (
        <Dashboard
          db={db}
          colorManager={colorManager}
          onViewPlant={handleViewPlant}
          onPlantNew={handlePlantNew}
          onChangeTheme={handleChangeTheme}
        />
      )}

      {screen === 'view' && selectedGarden && (
        <GardenView
          garden={selectedGarden}
          db={db}
          colorManager={colorManager}
          onBack={handleBack}
        />
      )}

      {screen === 'plant' && (
        <PlantForm
          db={db}
          colorManager={colorManager}
          onCreated={handlePlantCreated}
          onCancel={handlePlantCancel}
        />
      )}

      {screen === 'theme' && (
        <ThemeSelector
          colorManager={colorManager}
          onSelect={handleThemeSelect}
          onCancel={handleBack}
        />
      )}
    </Box>
  );
};

const LandingScreen: React.FC = () => {
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingY={2}
    >
      {/* Main title */}
      <Box marginBottom={1}>
        <Gradient name="pastel">
          <BigText text="GARDEN" font="block" />
        </Gradient>
      </Box>

      <Box marginBottom={2}>
        <Gradient name="vice">
          <BigText text="OF DEAD" font="block" />
        </Gradient>
      </Box>

      <Box marginBottom={3}>
        <Gradient name="fruit">
          <BigText text="PROJECTS" font="block" />
        </Gradient>
      </Box>

      {/* Subtitle */}
      <Box marginBottom={1}>
        <Text italic dimColor>
          Where abandoned directories bloom into art
        </Text>
      </Box>

      {/* Decorative elements */}
      <Box marginY={2}>
        <Text color="green">🌱 · 🌿 · 🍃 · 🌳 · 🍂 · 🌺 · 🌸</Text>
      </Box>

      {/* Loading indicator */}
      <Box marginTop={2}>
        <Text color="cyan">Initializing garden{dots}</Text>
      </Box>

      {/* Poetic quote */}
      <Box marginTop={3} paddingX={10}>
        <Text italic dimColor wrap="wrap" textAlign="center">
          "In the digital soil where forgotten code sleeps,
          {'\n'}
          new life emerges from directories deep."
        </Text>
      </Box>

      {/* Version footer */}
      <Box marginTop={4}>
        <Text dimColor>v1.0.0 • A dreamlike terminal experience</Text>
      </Box>
    </Box>
  );
};

export default App;

