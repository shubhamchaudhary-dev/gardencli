import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/ui/App.tsx
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { GardenDB } from '../utils/db.js';
import { ColorManager } from '../utils/colorThemes.js';
import { Dashboard } from './screens/Dashboard.js';
import { GardenView } from './screens/GardenView.js';
import { PlantForm } from './screens/PlantForm.js';
import { ThemeSelector } from './screens/ThemeSelector.js';
export const App = () => {
    const [db] = useState(() => new GardenDB());
    const [colorManager] = useState(() => new ColorManager('melancholy-green'));
    const [screen, setScreen] = useState('landing');
    const [selectedGarden, setSelectedGarden] = useState(null);
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
    const handleViewPlant = (garden) => {
        setSelectedGarden(garden);
        setScreen('view');
    };
    const handlePlantNew = () => {
        setScreen('plant');
    };
    const handleChangeTheme = () => {
        setScreen('theme');
    };
    const handleThemeSelect = (theme) => {
        colorManager.setTheme(theme);
        setScreen('dashboard');
    };
    const handleBack = () => {
        setSelectedGarden(null);
        setScreen('dashboard');
    };
    // Handlers for PlantForm (moved into App so they are in scope where <PlantForm /> is rendered)
    const handlePlantCreated = (id) => {
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
                if (maybe)
                    setSelectedGarden(maybe);
            }
        }
        catch {
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
        return _jsx(LandingScreen, {});
    }
    return (_jsxs(Box, { flexDirection: "column", children: [screen === 'dashboard' && (_jsx(Dashboard, { db: db, colorManager: colorManager, onViewPlant: handleViewPlant, onPlantNew: handlePlantNew, onChangeTheme: handleChangeTheme })), screen === 'view' && selectedGarden && (_jsx(GardenView, { garden: selectedGarden, db: db, colorManager: colorManager, onBack: handleBack })), screen === 'plant' && (_jsx(PlantForm, { db: db, colorManager: colorManager, onCreated: handlePlantCreated, onCancel: handlePlantCancel })), screen === 'theme' && (_jsx(ThemeSelector, { colorManager: colorManager, onSelect: handleThemeSelect, onCancel: handleBack }))] }));
};
const LandingScreen = () => {
    const [dots, setDots] = useState('');
    React.useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", paddingY: 2, children: [_jsx(Box, { marginBottom: 1, children: _jsx(Gradient, { name: "pastel", children: _jsx(BigText, { text: "GARDEN", font: "block" }) }) }), _jsx(Box, { marginBottom: 2, children: _jsx(Gradient, { name: "vice", children: _jsx(BigText, { text: "OF DEAD", font: "block" }) }) }), _jsx(Box, { marginBottom: 3, children: _jsx(Gradient, { name: "fruit", children: _jsx(BigText, { text: "PROJECTS", font: "block" }) }) }), _jsx(Box, { marginBottom: 1, children: _jsx(Text, { italic: true, dimColor: true, children: "Where abandoned directories bloom into art" }) }), _jsx(Box, { marginY: 2, children: _jsx(Text, { color: "green", children: "\uD83C\uDF31 \u00B7 \uD83C\uDF3F \u00B7 \uD83C\uDF43 \u00B7 \uD83C\uDF33 \u00B7 \uD83C\uDF42 \u00B7 \uD83C\uDF3A \u00B7 \uD83C\uDF38" }) }), _jsx(Box, { marginTop: 2, children: _jsxs(Text, { color: "cyan", children: ["Initializing garden", dots] }) }), _jsx(Box, { marginTop: 3, paddingX: 10, children: _jsxs(Text, { italic: true, dimColor: true, wrap: "wrap", textAlign: "center", children: ["\"In the digital soil where forgotten code sleeps,", '\n', "new life emerges from directories deep.\""] }) }), _jsx(Box, { marginTop: 4, children: _jsx(Text, { dimColor: true, children: "v1.0.0 \u2022 A dreamlike terminal experience" }) })] }));
};
export default App;
