import chalk from 'chalk';
import gradient from 'gradient-string';
export const themes = {
    'melancholy-green': {
        name: 'melancholy-green',
        displayName: '🍃 Melancholy Green',
        primary: ['#2d5016', '#4a7c17', '#6ba820'],
        secondary: ['#1a3a0f', '#2d5016'],
        accent: ['#8bc34a', '#9ccc65'],
        border: ['#4a7c17', '#6ba820'],
        gradient: gradient(['#2d5016', '#4a7c17', '#6ba820', '#8bc34a']),
    },
    'twilight-blue': {
        name: 'twilight-blue',
        displayName: '🌀 Twilight Blue',
        primary: ['#1a237e', '#283593', '#3949ab'],
        secondary: ['#0d1442', '#1a237e'],
        accent: ['#5c6bc0', '#7986cb'],
        border: ['#283593', '#3949ab'],
        gradient: gradient(['#1a237e', '#283593', '#3949ab', '#5c6bc0']),
    },
    'overgrowth-red': {
        name: 'overgrowth-red',
        displayName: '🔥 Overgrowth Red',
        primary: ['#b71c1c', '#c62828', '#d32f2f'],
        secondary: ['#7f0000', '#b71c1c'],
        accent: ['#e57373', '#ef5350'],
        border: ['#c62828', '#d32f2f'],
        gradient: gradient(['#b71c1c', '#c62828', '#d32f2f', '#e57373']),
    },
    'lucid-dream-pink': {
        name: 'lucid-dream-pink',
        displayName: '✨ Lucid Dream Pink',
        primary: ['#880e4f', '#ad1457', '#c2185b'],
        secondary: ['#560027', '#880e4f'],
        accent: ['#f06292', '#ec407a'],
        border: ['#ad1457', '#c2185b'],
        gradient: gradient(['#880e4f', '#ad1457', '#c2185b', '#f06292']),
    },
    'foggy-memory-grey': {
        name: 'foggy-memory-grey',
        displayName: '🌫 Foggy Memory Grey',
        primary: ['#37474f', '#455a64', '#546e7a'],
        secondary: ['#263238', '#37474f'],
        accent: ['#78909c', '#90a4ae'],
        border: ['#455a64', '#546e7a'],
        gradient: gradient(['#37474f', '#455a64', '#546e7a', '#78909c']),
    },
};
export class ColorManager {
    currentTheme;
    constructor(themeName = 'melancholy-green') {
        this.currentTheme = themes[themeName];
    }
    setTheme(themeName) {
        this.currentTheme = themes[themeName];
    }
    getTheme() {
        return this.currentTheme;
    }
    colorize(text, type = 'primary') {
        const colors = this.currentTheme[type];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return chalk.hex(color)(text);
    }
    gradient(text) {
        return this.currentTheme.gradient(text);
    }
    colorPlant(lines, depth = 0) {
        const theme = this.currentTheme;
        return lines.map((line, index) => {
            const relativePosition = index / lines.length;
            let coloredLine = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === ' ') {
                    coloredLine += char;
                    continue;
                }
                // Color based on character type and position
                let color;
                if (relativePosition < 0.3) {
                    // Top - leaves/flowers - use accent colors
                    if (char === '*' || char === '+' || char === '❀' || char === '@') {
                        color = theme.accent[0];
                    }
                    else if (char === 'o' || char === '.') {
                        color = theme.accent[1] || theme.accent[0];
                    }
                    else {
                        color = theme.primary[2] || theme.primary[1];
                    }
                }
                else if (relativePosition < 0.7) {
                    // Middle - branches - use primary colors
                    color = theme.primary[1];
                }
                else {
                    // Bottom - trunk/roots - use secondary colors
                    if (char === '~' || char === '≈' || char === '∼') {
                        color = theme.secondary[0];
                    }
                    else {
                        color = theme.secondary[1] || theme.secondary[0];
                    }
                }
                coloredLine += chalk.hex(color)(char);
            }
            return coloredLine;
        });
    }
    getBorder(width, title) {
        const theme = this.currentTheme;
        const color = theme.border[0];
        const top = chalk.hex(color)('┌' + '─'.repeat(width - 2) + '┐');
        const bottom = chalk.hex(color)('└' + '─'.repeat(width - 2) + '┘');
        const side = chalk.hex(color)('│');
        if (title) {
            const titleText = ` ${title} `;
            const padding = Math.floor((width - titleText.length - 2) / 2);
            const topWithTitle = chalk.hex(color)('┌' + '─'.repeat(padding) + titleText + '─'.repeat(width - padding - titleText.length - 2) + '┐');
            return { top: topWithTitle, bottom, side };
        }
        return { top, bottom, side };
    }
    getHealthBar(health, width = 10) {
        const filled = Math.floor((health / 100) * width);
        const empty = width - filled;
        let color;
        if (health > 70) {
            color = this.currentTheme.accent[0];
        }
        else if (health > 40) {
            color = '#ffa726'; // Orange
        }
        else {
            color = '#ef5350'; // Red
        }
        return chalk.hex(color)('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    }
    getAllThemeNames() {
        return Object.keys(themes);
    }
    getThemeDisplayNames() {
        return Object.values(themes).map(t => t.displayName);
    }
}
export function getEmotionColor(emotion) {
    const emotionColors = {
        energy: '#8bc34a',
        melancholy: '#5c6bc0',
        chaos: '#ef5350',
        peace: '#78909c',
        'energy-chaos': '#ffa726',
        'melancholy-peace': '#7986cb',
        'energy-peace': '#81c784',
        'melancholy-chaos': '#ba68c8',
    };
    return emotionColors[emotion.toLowerCase()] || '#90a4ae';
}
export function colorizeEmotion(emotion) {
    const color = getEmotionColor(emotion);
    return chalk.hex(color)(emotion.charAt(0).toUpperCase() + emotion.slice(1));
}
