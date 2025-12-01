import fs from 'fs-extra';
import path from 'path';
const CODE_EXTENSIONS = [
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
    '.rb', '.go', '.rs', '.php', '.swift', '.kt', '.scala', '.html', '.css'
];
const TEMP_PATTERNS = [
    'node_modules', '.git', 'dist', 'build', 'tmp', 'temp',
    '.cache', '__pycache__', '.next', '.nuxt'
];
export class EmotionAnalyzer {
    stats;
    constructor(directoryPath) {
        this.stats = this.analyzeDirectory(directoryPath);
    }
    analyzeDirectory(dirPath) {
        let fileCount = 0;
        let totalSize = 0;
        let totalAge = 0;
        let lastModified = 0;
        let codeFiles = 0;
        let hasHiddenFiles = false;
        let hasTempFiles = false;
        let largeFileCount = 0;
        let maxDepthSeen = 0;
        const now = Date.now();
        const traverse = (currentPath, depth = 0) => {
            // track deepest recursion
            if (depth > maxDepthSeen)
                maxDepthSeen = depth;
            let items;
            try {
                items = fs.readdirSync(currentPath);
            }
            catch (err) {
                return; // can't read this directory
            }
            for (const item of items) {
                const itemPath = path.join(currentPath, item);
                // Detect hidden files/directories (leading dot)
                if (item.startsWith('.')) {
                    hasHiddenFiles = true;
                }
                // If item looks like a "temp" or vendor dir, mark and skip
                if (TEMP_PATTERNS.some(pattern => item.includes(pattern))) {
                    hasTempFiles = true;
                    continue;
                }
                let stat;
                try {
                    stat = fs.statSync(itemPath);
                }
                catch (err) {
                    // skip inaccessible files
                    continue;
                }
                if (stat.isFile()) {
                    fileCount++;
                    totalSize += stat.size;
                    const fileAge = now - (stat.mtimeMs || stat.mtime?.getTime?.() || now);
                    totalAge += fileAge;
                    if ((stat.mtimeMs || 0) > lastModified) {
                        lastModified = stat.mtimeMs || 0;
                    }
                    // Check if code file
                    const ext = path.extname(item).toLowerCase();
                    if (CODE_EXTENSIONS.includes(ext)) {
                        codeFiles++;
                    }
                    // Check for large files (> 1MB)
                    if (stat.size > 1024 * 1024) {
                        largeFileCount++;
                    }
                }
                else if (stat.isDirectory()) {
                    // Recurse up to a reasonable limit (avoid extremely deep scans)
                    if (depth < 6) {
                        traverse(itemPath, depth + 1);
                    }
                    else {
                        // mark that deeper structure exists but avoid scanning forever
                        if (depth >= 6) {
                            maxDepthSeen = Math.max(maxDepthSeen, depth);
                        }
                    }
                }
            }
        };
        // If the directory doesn't exist or is not a directory, return empty stats
        try {
            const rootStat = fs.statSync(dirPath);
            if (!rootStat.isDirectory()) {
                // return a minimal "empty" stats object
                return {
                    fileCount: 0,
                    totalSize: 0,
                    avgFileAge: 0,
                    lastModified: 0,
                    depth: 0,
                    hasHiddenFiles: false,
                    hasTempFiles: false,
                    codeFileRatio: 0,
                    largeFileCount: 0,
                };
            }
        }
        catch (err) {
            return {
                fileCount: 0,
                totalSize: 0,
                avgFileAge: 0,
                lastModified: 0,
                depth: 0,
                hasHiddenFiles: false,
                hasTempFiles: false,
                codeFileRatio: 0,
                largeFileCount: 0,
            };
        }
        traverse(dirPath, 0);
        return {
            fileCount,
            totalSize,
            avgFileAge: fileCount > 0 ? (totalAge / fileCount) : 0,
            lastModified,
            depth: maxDepthSeen,
            hasHiddenFiles,
            hasTempFiles,
            codeFileRatio: fileCount > 0 ? (codeFiles / fileCount) : 0,
            largeFileCount,
        };
    }
    // public getEmotionVector(): EmotionVector {
    //   const { fileCount, avgFileAge, lastModified, codeFileRatio, largeFileCount, totalSize, hasHiddenFiles, hasTempFiles } = this.stats;
    //   // If no files, return a sensible "abandoned" profile
    //   if (fileCount === 0) {
    //     return {
    //       energy: 0.05,
    //       melancholy: 0.7,
    //       chaos: 0.1,
    //       peace: 0.15,
    //     };
    //   }
    //   const now = Date.now();
    //   // days since last modification (if lastModified is 0 -> treat as very old)
    //   const daysSinceModified = lastModified > 0 ? (now - lastModified) / (1000 * 60 * 60 * 24) : 3650;
    //   const avgAgeDays = avgFileAge > 0 ? (avgFileAge / (1000 * 60 * 60 * 24)) : 3650;
    //   // ENERGY: Recently modified, many files, high code ratio
    //   let energy = 0;
    //   energy += Math.max(0, 1 - daysSinceModified / 60) * 0.45; // recent activity strong signal
    //   energy += Math.min(1, fileCount / 200) * 0.25; // many files
    //   energy += Math.min(1, codeFileRatio) * 0.25; // code presence
    //   // if there are many large files, slightly reduce "energy" (heavy assets don't mean active dev)
    //   energy -= Math.min(1, largeFileCount / 20) * 0.1;
    //   energy = Math.max(0, Math.min(1, energy));
    //   // MELANCHOLY: Old files, abandoned, low activity
    //   let melancholy = 0;
    //   melancholy += Math.min(1, daysSinceModified / 180) * 0.5; // long time since modified
    //   melancholy += Math.min(1, avgAgeDays / 365) * 0.3; // old files
    //   melancholy += (1 - energy) * 0.2; // inverse of energy
    //   // hidden files and temp presence increase melancholy slightly (neglected or messy)
    //   if (hasHiddenFiles) melancholy = Math.min(1, melancholy + 0.05);
    //   melancholy = Math.max(0, Math.min(1, melancholy));
    //   // CHAOS: Many files, large size, temp folders, many large files, low code ratio mixed with many files
    //   let chaos = 0;
    //   chaos += Math.min(1, fileCount / 300) * 0.35; // lots of files
    //   chaos += Math.min(1, totalSize / (100 * 1024 * 1024)) * 0.25; // large total size
    //   chaos += Math.min(1, largeFileCount / 20) * 0.2; // many large files
    //   // temp dirs and hidden (dot) files often indicate noise — increase chaos
    //   if (hasTempFiles) chaos = Math.min(1, chaos + 0.1);
    //   if (!codeFileRatio) chaos = Math.min(1, chaos + 0.05);
    //   chaos = Math.max(0, Math.min(1, chaos));
    //   // PEACE: Clean structure, moderate size, organized
    //   let peace = 0;
    //   // moderate file count is calming
    //   peace += (fileCount > 5 && fileCount < 200) ? 0.35 : 0;
    //   // strong code ratio suggests organization
    //   peace += codeFileRatio > 0.6 ? 0.35 : (codeFileRatio > 0.3 ? 0.15 : 0);
    //   // inverse of chaos contributes to peace
    //   peace += (1 - chaos) * 0.3;
    //   // presence of many hidden/temp files reduces peace
    //   if (hasTempFiles) peace = Math.max(0, peace - 0.05);
    //   peace = Math.max(0, Math.min(1, peace));
    //   // Normalize so emotions sum to 1
    //   let total = energy + melancholy + chaos + peace;
    //   if (total <= 0) total = 1;
    //   energy = energy / total;
    //   melancholy = melancholy / total;
    //   chaos = chaos / total;
    //   peace = peace / total;
    //   // Round to two decimals for display stability
    //   return {
    //     energy: Math.round(energy * 100) / 100,
    //     melancholy: Math.round(melancholy * 100) / 100,
    //     chaos: Math.round(chaos * 100) / 100,
    //     peace: Math.round(peace * 100) / 100,
    //   };
    // }
    // public getEmotionVector(): EmotionVector {
    //   const s = this.stats;
    //   const fileCount = s.fileCount;
    //   const lastModified = s.lastModified || 0;
    //   const avgFileAge = s.avgFileAge || 0;
    //   const codeFileRatio = s.codeFileRatio ?? 0;
    //   const largeFileCount = s.largeFileCount ?? 0;
    //   const hasHiddenFiles = !!s.hasHiddenFiles;
    //   const hasTempFiles = !!s.hasTempFiles;
    //   const totalSize = s.totalSize ?? 0;
    //   // If no files at all, return a sensible "abandoned" profile (not zeros)
    //   if (fileCount === 0) {
    //     const fallback = { energy: 0.05, melancholy: 0.72, chaos: 0.08, peace: 0.15 };
    //     console.debug('[EmotionAnalyzer] empty directory ->', fallback);
    //     return fallback;
    //   }
    //   const now = Date.now();
    //   const daysSinceModified = lastModified > 0 ? (now - lastModified) / (1000 * 60 * 60 * 24) : 3650;
    //   const avgAgeDays = avgFileAge > 0 ? (avgFileAge / (1000 * 60 * 60 * 24)) : 3650;
    //   // ENERGY
    //   let energy = 0;
    //   energy += Math.max(0, 1 - daysSinceModified / 60) * 0.45;
    //   energy += Math.min(1, fileCount / 200) * 0.25;
    //   energy += Math.min(1, codeFileRatio) * 0.25;
    //   energy -= Math.min(1, largeFileCount / 20) * 0.1;
    //   energy = Math.max(0, Math.min(1, energy));
    //   // MELANCHOLY
    //   let melancholy = 0;
    //   melancholy += Math.min(1, daysSinceModified / 180) * 0.5;
    //   melancholy += Math.min(1, avgAgeDays / 365) * 0.3;
    //   melancholy += (1 - energy) * 0.2;
    //   if (hasHiddenFiles) melancholy = Math.min(1, melancholy + 0.05);
    //   melancholy = Math.max(0, Math.min(1, melancholy));
    //   // CHAOS
    //   let chaos = 0;
    //   chaos += Math.min(1, fileCount / 300) * 0.35;
    //   chaos += Math.min(1, totalSize / (100 * 1024 * 1024)) * 0.25;
    //   chaos += Math.min(1, largeFileCount / 20) * 0.2;
    //   if (hasTempFiles) chaos = Math.min(1, chaos + 0.1);
    //   if (codeFileRatio < 0.2) chaos = Math.min(1, chaos + 0.05);
    //   chaos = Math.max(0, Math.min(1, chaos));
    //   // PEACE
    //   let peace = 0;
    //   peace += (fileCount > 5 && fileCount < 200) ? 0.35 : 0;
    //   peace += codeFileRatio > 0.6 ? 0.35 : (codeFileRatio > 0.3 ? 0.15 : 0);
    //   peace += (1 - chaos) * 0.3;
    //   if (hasTempFiles) peace = Math.max(0, peace - 0.05);
    //   peace = Math.max(0, Math.min(1, peace));
    //   // normalize, avoid divide-by-zero producing zeros
    //   let total = energy + melancholy + chaos + peace;
    //   if (total <= 0.00001) {
    //     // fallback vector to avoid zeros
    //     const fallback = { energy: 0.1, melancholy: 0.6, chaos: 0.1, peace: 0.2 };
    //     console.debug('[EmotionAnalyzer] normalized total too small ->', fallback);
    //     return fallback;
    //   }
    //   energy /= total;
    //   melancholy /= total;
    //   chaos /= total;
    //   peace /= total;
    //   const result = {
    //     energy: Math.round(energy * 100) / 100,
    //     melancholy: Math.round(melancholy * 100) / 100,
    //     chaos: Math.round(chaos * 100) / 100,
    //     peace: Math.round(peace * 100) / 100,
    //   };
    //   console.debug('[EmotionAnalyzer] stats:', { fileCount, lastModified, avgAgeDays, codeFileRatio, largeFileCount, hasHiddenFiles, hasTempFiles }, '=>', result);
    //   return result;
    // }
    getEmotionVector() {
        const { fileCount, avgFileAge, lastModified, codeFileRatio, largeFileCount, totalSize } = this.stats;
        const now = Date.now();
        const daysSinceModified = (now - lastModified) / (1000 * 60 * 60 * 24);
        const avgAgeDays = avgFileAge / (1000 * 60 * 60 * 24);
        // ENERGY
        let energy = 0;
        energy += Math.max(0, 1 - daysSinceModified / 30) * 0.4;
        energy += Math.min(1, fileCount / 100) * 0.3;
        energy += codeFileRatio * 0.3;
        // MELANCHOLY
        let melancholy = 0;
        melancholy += Math.min(1, daysSinceModified / 90) * 0.5;
        melancholy += Math.min(1, avgAgeDays / 180) * 0.3;
        melancholy += (1 - energy) * 0.2;
        // CHAOS
        let chaos = 0;
        chaos += Math.min(1, fileCount / 200) * 0.4;
        chaos += Math.min(1, totalSize / (50 * 1024 * 1024)) * 0.3;
        chaos += Math.min(1, largeFileCount / 10) * 0.3;
        // PEACE
        let peace = 0;
        peace += (fileCount > 5 && fileCount < 50) ? 0.4 : 0;
        peace += codeFileRatio > 0.5 ? 0.3 : 0;
        peace += (1 - chaos) * 0.3;
        // --- NEW PART: Set minimum % floors ---
        energy = Math.max(0.2, energy); // at least 20%
        melancholy = Math.max(0.2, melancholy);
        chaos = Math.max(0.2, chaos);
        peace = Math.max(0.2, peace);
        // --- Normalize values ---
        const total = energy + melancholy + chaos + peace;
        energy /= total;
        melancholy /= total;
        chaos /= total;
        peace /= total;
        return {
            energy: Math.round(energy * 100),
            melancholy: Math.round(melancholy * 100),
            chaos: Math.round(chaos * 100),
            peace: Math.round(peace * 100)
        };
    }
    getStats() {
        return this.stats;
    }
    getDominantEmotion() {
        const emotions = this.getEmotionVector();
        const entries = Object.entries(emotions);
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        if (sorted.length >= 2 && sorted[0][1] - sorted[1][1] < 0.15) {
            // Close emotions -> combine into a readable hybrid label
            const first = sorted[0][0];
            const second = sorted[1][0];
            return `${first}-${second}`;
        }
        return sorted[0][0];
    }
}
