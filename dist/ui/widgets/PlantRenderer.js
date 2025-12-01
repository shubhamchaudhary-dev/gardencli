import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { LSystemPlant } from '../../utils/l-system.js';
/**
 * Clamp helper: ensures numeric and bounded
 */
function clampNumber(v, min = 0, max = 100) {
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
export const EmotionBadge = ({ emotion, value, colorManager, width = 12 }) => {
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
    let chalk;
    try {
        // require here so bundlers/tsc don't force chalk in non-node contexts
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        chalk = require('chalk');
    }
    catch {
        chalk = null;
    }
    const filledDisplay = chalk ? chalk.hex(color)(filled) : filled;
    return (_jsxs(Box, { children: [_jsx(Box, { width: 14, children: _jsx(Text, { dimColor: true, children: emotion }) }), _jsx(Box, { children: _jsxs(Text, { children: [filledDisplay, empty] }) }), _jsx(Box, { marginLeft: 1, children: _jsxs(Text, { dimColor: true, children: [v, "%"] }) })] }));
};
/**
 * PlantCard — compact summary used in Dashboard list
 */
export const PlantCard = ({ garden, colorManager, selected = false, compact = false }) => {
    const name = garden.name ?? 'Unnamed';
    const health = clampNumber(garden.health ?? 0, 0, 100);
    const heart = health >= 90 ? '❤' : health >= 50 ? '♡' : '⚠';
    return (_jsxs(Box, { flexDirection: "row", paddingX: 1, paddingY: 0, justifyContent: "space-between", children: [_jsxs(Box, { children: [_jsxs(Text, { bold: selected, children: [selected ? '▶ ' : '  ', name] }), compact ? null : (_jsxs(Text, { dimColor: true, children: [" \u2014 ", garden.description ?? ''] }))] }), _jsx(Box, { children: _jsxs(Text, { color: "green", children: [heart, " ", health, "%"] }) })] }));
};
/**
 * PlantRenderer — placeholder L-system renderer integration
 * Uses LSystemPlant (if provided) to produce a textual description and sample ASCII art.
 */
export const PlantRenderer = ({ garden, colorManager, animate = false, width = 40, height = 12 }) => {
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
    }
    catch {
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
    let chalk;
    try {
        chalk = require('chalk');
    }
    catch {
        chalk = null;
    }
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", children: [_jsx(Box, { children: art.map((line, i) => (_jsx(Text, { children: chalk ? chalk.hex(accent)(line.padEnd(width).slice(0, width)) : line }, i))) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dimColor: true, italic: true, children: plantDesc }) }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsx(EmotionBadge, { emotion: "Energy", value: emotion.energy, colorManager: colorManager, width: 12 }), _jsx(EmotionBadge, { emotion: "Melancholy", value: emotion.melancholy, colorManager: colorManager, width: 12 }), _jsx(EmotionBadge, { emotion: "Chaos", value: emotion.chaos, colorManager: colorManager, width: 12 }), _jsx(EmotionBadge, { emotion: "Peace", value: emotion.peace, colorManager: colorManager, width: 12 })] })] }));
};
export default PlantRenderer;
