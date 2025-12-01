import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/ui/screens/ThemeSelector.tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import chalk from 'chalk';
import { themes } from '../../utils/colorThemes.js';
export const ThemeSelector = ({ colorManager, onSelect, onCancel, }) => {
    const themeNames = colorManager.getAllThemeNames();
    const [selectedIndex, setSelectedIndex] = useState(themeNames.indexOf(colorManager.getTheme().name));
    const [previewFrame, setPreviewFrame] = useState(0);
    // Animation for preview
    React.useEffect(() => {
        const interval = setInterval(() => {
            setPreviewFrame((prev) => prev + 1);
        }, 150);
        return () => clearInterval(interval);
    }, []);
    // typed handler to avoid implicit any
    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : themeNames.length - 1));
        }
        else if (key.downArrow) {
            setSelectedIndex((prev) => (prev < themeNames.length - 1 ? prev + 1 : 0));
        }
        else if (key.return) {
            onSelect(themeNames[selectedIndex]);
        }
        else if (key.escape || input === 'q') {
            onCancel();
        }
    });
    const selectedTheme = themeNames[selectedIndex];
    const border = colorManager.getBorder(80, 'Theme Selector');
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: border.top }), _jsxs(Box, { children: [_jsx(Text, { children: border.side }), _jsx(Box, { width: 78, justifyContent: "center", children: _jsx(Text, { bold: true, children: colorManager.gradient('  CHOOSE YOUR THEME  ') }) }), _jsx(Text, { children: border.side })] }), _jsx(Text, { children: border.bottom })] }), _jsxs(Box, { flexDirection: "row", marginBottom: 1, children: [_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, width: "40%", children: [_jsx(Text, { bold: true, color: "cyan", marginBottom: 1, children: "Available Themes" }), themeNames.map((themeName, index) => {
                                const theme = themes[themeName];
                                const isSelected = index === selectedIndex;
                                const isCurrent = themeName === colorManager.getTheme().name;
                                return (_jsx(Box, { marginY: 0, children: _jsxs(Text, { children: [isSelected ? '▶ ' : '  ', theme.displayName, isCurrent && _jsx(Text, { color: "green", children: " \u2713" })] }) }, themeName));
                            })] }), _jsx(Box, { flexDirection: "column", marginLeft: 2, width: "60%", children: _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "magenta", padding: 1, children: [_jsxs(Text, { bold: true, color: "magenta", marginBottom: 1, children: ["Preview: ", themes[selectedTheme].displayName] }), _jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { bold: true, dimColor: true, children: "Color Palette:" }), _jsx(Box, { marginTop: 1, children: renderColorSwatch(themes[selectedTheme]) })] }), _jsxs(Box, { flexDirection: "column", marginTop: 2, children: [_jsx(Text, { bold: true, dimColor: true, children: "Sample Plant:" }), _jsx(Box, { marginTop: 1, flexDirection: "column", children: renderSamplePlant(themes[selectedTheme], previewFrame) })] }), _jsx(Box, { marginTop: 2, flexDirection: "column", children: _jsx(Text, { italic: true, dimColor: true, children: getThemeDescription(selectedTheme) }) })] }) })] }), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "gray", paddingX: 1, children: [_jsx(Text, { bold: true, dimColor: true, children: "Controls" }), _jsxs(Box, { justifyContent: "space-between", marginTop: 1, children: [_jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "\u2191\u2193" }), " Navigate Themes"] }), _jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "Enter" }), " Select Theme"] }), _jsxs(Text, { children: [_jsx(Text, { color: "cyan", bold: true, children: "ESC/q" }), " Cancel"] })] })] }), _jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsx(Text, { dimColor: true, children: "\uD83C\uDFA8 Choose a theme that matches your garden's mood" }) })] }));
};
function renderColorSwatch(theme) {
    const allColors = [
        ...theme.primary,
        ...theme.secondary,
        ...theme.accent,
    ];
    return (_jsx(Box, { children: allColors.map((color, index) => {
            return (_jsx(Text, { children: chalk.hex(color)('███ ') }, index));
        }) }));
}
function renderSamplePlant(theme, frame) {
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
        let color;
        if (relativePos < 0.4) {
            color = theme.accent[0];
        }
        else if (relativePos < 0.7) {
            color = theme.primary[1];
        }
        else {
            color = theme.secondary[1] || theme.secondary[0];
        }
        return (_jsx(Text, { children: chalk.hex(color)(line) }, index));
    });
}
function getThemeDescription(themeName) {
    const descriptions = {
        'melancholy-green': 'A nostalgic forest palette. Deep greens evoke abandoned gardens slowly returning to nature.',
        'twilight-blue': 'Mysterious and dreamy. Blues of dusk when day meets night, perfect for introspective projects.',
        'overgrowth-red': 'Intense and passionate. Crimson hues suggest wild growth and untamed creative energy.',
        'lucid-dream-pink': 'Surreal and ethereal. Magenta tones create a dreamlike atmosphere between reality and imagination.',
        'foggy-memory-grey': 'Subtle and contemplative. Cool greys evoke distant memories and forgotten directories.',
    };
    return descriptions[themeName];
}
