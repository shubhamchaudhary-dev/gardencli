import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { PlantRenderer, EmotionBadge } from '../widgets/PlantRenderer.js';
import { LSystemPlant } from '../../utils/l-system.js';
export const GardenView = ({ garden, db, colorManager, onBack, }) => {
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
    useInput((input, key) => {
        if (input === 'q' || key.escape) {
            onBack();
        }
        else if (input === 'w') {
            waterPlant();
        }
        else if (input === 'd') {
            setShowDetails(!showDetails);
        }
        else if (input === 'g') {
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
    const daysSinceWatered = Math.floor((Date.now() - currentGarden.lastWatered) / (1000 * 60 * 60 * 24));
    const daysSincePlanted = Math.floor((Date.now() - currentGarden.plantedAt) / (1000 * 60 * 60 * 24));
    const plant = new LSystemPlant(currentGarden.emotion, currentGarden.health, currentGarden.growthStage);
    const border = colorManager.getBorder(80, currentGarden.name);
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: border.top }), _jsxs(Box, { children: [_jsx(Text, { children: border.side }), _jsx(Box, { width: 78, justifyContent: "center", children: _jsx(Text, { bold: true, children: colorManager.gradient(`  ${currentGarden.name.toUpperCase()}  `) }) }), _jsx(Text, { children: border.side })] }), _jsx(Text, { children: border.bottom })] }), _jsxs(Box, { flexDirection: "row", marginBottom: 1, children: [_jsxs(Box, { flexDirection: "column", width: "60%", children: [_jsx(Box, { flexDirection: "column", borderStyle: "round", borderColor: "green", padding: 1, alignItems: "center", children: _jsx(PlantRenderer, { garden: currentGarden, colorManager: colorManager, animate: true, width: 45, height: 18 }) }), waterAnimation && (_jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsx(Text, { color: "cyan", bold: true, children: "\uD83D\uDCA7 \uD83D\uDCA7 \uD83D\uDCA7 Watering... \uD83D\uDCA7 \uD83D\uDCA7 \uD83D\uDCA7" }) })), _jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsxs(Text, { italic: true, dimColor: true, children: ["\"", plant.getDescription(), "\""] }) })] }), showDetails && (_jsxs(Box, { flexDirection: "column", marginLeft: 2, width: "40%", children: [_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 1, marginBottom: 1, children: [_jsx(Text, { bold: true, color: "cyan", children: "\u2764 Health Status" }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsxs(Text, { children: ["Health: ", colorManager.getHealthBar(currentGarden.health, 15)] }), _jsxs(Text, { dimColor: true, children: [currentGarden.health, "% \u2022 ", getHealthStatus(currentGarden.health)] })] }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsxs(Text, { dimColor: true, children: ["Last watered: ", daysSinceWatered === 0 ? 'today' : `${daysSinceWatered}d ago`] }), _jsxs(Text, { dimColor: true, children: ["Age: ", daysSincePlanted, " days"] }), _jsxs(Text, { dimColor: true, children: ["Growth stage: ", currentGarden.growthStage.toFixed(1), "/3.0"] })] })] }), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "magenta", paddingX: 1, marginBottom: 1, children: [_jsx(Text, { bold: true, color: "magenta", children: "\uD83C\uDFAD Emotional Profile" }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsx(EmotionBadge, { emotion: "Energy", value: currentGarden.emotion.energy, colorManager: colorManager }), _jsx(EmotionBadge, { emotion: "Melancholy", value: currentGarden.emotion.melancholy, colorManager: colorManager }), _jsx(EmotionBadge, { emotion: "Chaos", value: currentGarden.emotion.chaos, colorManager: colorManager }), _jsx(EmotionBadge, { emotion: "Peace", value: currentGarden.emotion.peace, colorManager: colorManager })] })] }), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "yellow", paddingX: 1, children: [_jsx(Text, { bold: true, color: "yellow", children: "\uD83D\uDCC1 Directory Info" }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsxs(Text, { dimColor: true, wrap: "truncate-end", children: ["Path: ", currentGarden.directoryPath] }), _jsxs(Text, { dimColor: true, children: ["Files: ", currentGarden.fileCount] }), _jsxs(Text, { dimColor: true, children: ["Size: ", formatSize(currentGarden.totalSize)] }), _jsxs(Text, { dimColor: true, children: ["Complexity: ", plant.getComplexity(), " nodes"] })] }), currentGarden.description && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { italic: true, dimColor: true, wrap: "wrap", children: ["\"", currentGarden.description, "\""] }) }))] })] }))] }), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "gray", paddingX: 1, children: [_jsx(Text, { bold: true, dimColor: true, children: "Controls" }), _jsxs(Box, { justifyContent: "space-between", marginTop: 1, children: [_jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "w" }), " Water Plant"] }), _jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "g" }), " Grow (+0.5 stage)"] }), _jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "d" }), " Toggle Details"] }), _jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "q" }), " Back to Dashboard"] })] })] }), _jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsx(Text, { dimColor: true, children: getStatusMessage(currentGarden) }) })] }));
};
function getHealthStatus(health) {
    if (health >= 90)
        return 'Thriving';
    if (health >= 70)
        return 'Healthy';
    if (health >= 50)
        return 'Stable';
    if (health >= 30)
        return 'Wilting';
    return 'Critical';
}
function formatSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function getStatusMessage(garden) {
    const health = garden.health;
    const daysSinceWatered = Math.floor((Date.now() - garden.lastWatered) / (1000 * 60 * 60 * 24));
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
