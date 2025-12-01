// import fs from 'fs-extra';
// import path from 'path';
// import os from 'os';
// import { nanoid } from 'nanoid';
// export interface EmotionVector {
//   energy: number;
//   melancholy: number;
//   chaos: number;
//   peace: number;
// }
// export interface Garden {
//   id: string;
//   name: string;
//   directoryPath: string;
//   description: string;
//   emotion: EmotionVector;
//   health: number;
//   growthStage: number;
//   plantedAt: number;
//   lastWatered: number;
//   lastModified: number;
//   fileCount: number;
//   totalSize: number;
//   colorTheme: string;
// }
// export interface Database {
//   gardens: Garden[];
//   version: string;
//   createdAt: number;
// }
// const DB_PATH = path.join(os.homedir(), '.garden_cli_db.json');
// export class GardenDB {
//   createGarden(arg0: { name: string; directoryPath: string; description: string; plantedAt: number; lastWatered: number; health: number; growthStage: number; fileCount: number; totalSize: number; emotion: { energy: number; melancholy: number; chaos: number; peace: number; }; }) {
//       throw new Error('Method not implemented.');
//   }
//   private db: Database;
//   constructor() {
//     this.db = this.load();
//   }
//   private load(): Database {
//     try {
//       if (fs.existsSync(DB_PATH)) {
//         const data = fs.readJsonSync(DB_PATH);
//         return data;
//       }
//     } catch (error) {
//       // File doesn't exist or is corrupted
//     }
//     // Initialize new database
//     const newDb: Database = {
//       gardens: [],
//       version: '1.0.0',
//       createdAt: Date.now(),
//     };
//     this.save(newDb);
//     return newDb;
//   }
//   private save(db: Database): void {
//     try {
//       fs.writeJsonSync(DB_PATH, db, { spaces: 2 });
//     } catch (error) {
//       console.error('Failed to save database:', error);
//     }
//   }
//   public getAllGardens(): Garden[] {
//     return this.db.gardens;
//   }
//   public getGarden(id: string): Garden | undefined {
//     return this.db.gardens.find((g) => g.id === id);
//   }
//   public addGarden(garden: Omit<Garden, 'id'>): Garden {
//     const newGarden: Garden = {
//       ...garden,
//       id: nanoid(10),
//     };
//     this.db.gardens.push(newGarden);
//     this.save(this.db);
//     return newGarden;
//   }
//   public updateGarden(id: string, updates: Partial<Garden>): Garden | null {
//     const index = this.db.gardens.findIndex((g) => g.id === id);
//     if (index === -1) return null;
//     this.db.gardens[index] = {
//       ...this.db.gardens[index],
//       ...updates,
//     };
//     this.save(this.db);
//     return this.db.gardens[index];
//   }
//   public deleteGarden(id: string): boolean {
//     const initialLength = this.db.gardens.length;
//     this.db.gardens = this.db.gardens.filter((g) => g.id !== id);
//     if (this.db.gardens.length < initialLength) {
//       this.save(this.db);
//       return true;
//     }
//     return false;
//   }
//   public waterGarden(id: string): Garden | null {
//     const garden = this.getGarden(id);
//     if (!garden) return null;
//     const healthBoost = Math.min(15, 100 - garden.health);
//     const newHealth = Math.min(100, garden.health + healthBoost);
//     return this.updateGarden(id, {
//       health: newHealth,
//       lastWatered: Date.now(),
//     });
//   }
// }
// src/utils/db.ts
import fs from 'fs-extra';
import path from 'path';
import { nanoid } from 'nanoid';
import { EmotionAnalyzer } from './emotionAnalyzer.js';
const DB_FILENAME = 'garden-db.json';
export class GardenDB {
    filePath;
    data;
    constructor(dbFilePath) {
        // By default place DB in project root (cwd). You can override in tests.
        this.filePath = dbFilePath || path.join(process.cwd(), DB_FILENAME);
        this.data = { gardens: [] };
        this.ensureFile();
        this.load();
    }
    ensureFile() {
        try {
            const dir = path.dirname(this.filePath);
            fs.ensureDirSync(dir);
            if (!fs.pathExistsSync(this.filePath)) {
                fs.writeJsonSync(this.filePath, this.data, { spaces: 2 });
            }
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to ensure DB file:', err);
        }
    }
    load() {
        try {
            const json = fs.readJsonSync(this.filePath, { throws: false });
            if (json && Array.isArray(json.gardens)) {
                this.data = json;
            }
            else {
                this.data = { gardens: [] };
            }
        }
        catch (err) {
            // If read fails, start with empty DB and try to write it later.
            // eslint-disable-next-line no-console
            console.error('Failed to load DB file, starting fresh:', err);
            this.data = { gardens: [] };
            try {
                fs.writeJsonSync(this.filePath, this.data, { spaces: 2 });
            }
            catch (_) { }
        }
    }
    save() {
        try {
            fs.writeJsonSync(this.filePath, this.data, { spaces: 2 });
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to save DB:', err);
        }
    }
    getAllGardens() {
        // return a shallow copy to avoid external mutation
        // return [...this.data.gardens];
        return JSON.parse(JSON.stringify(this.data.gardens));
    }
    getGarden(id) {
        return this.data.gardens.find((g) => g.id === id);
    }
    // createGarden(gardenPartial: Partial<Garden>): Garden {
    //   const now = Date.now();
    //   const newGarden: Garden = {
    //     id: gardenPartial.id ?? nanoid(8),
    //     name: gardenPartial.name ?? 'Untitled Garden',
    //     directoryPath: gardenPartial.directoryPath ?? '.',
    //     description: gardenPartial.description ?? '',
    //     plantedAt: gardenPartial.plantedAt ?? now,
    //     lastWatered: gardenPartial.lastWatered ?? now,
    //     health: typeof gardenPartial.health === 'number' ? gardenPartial.health : 100,
    //     growthStage: typeof gardenPartial.growthStage === 'number' ? gardenPartial.growthStage : 0,
    //     fileCount: typeof gardenPartial.fileCount === 'number' ? gardenPartial.fileCount : 0,
    //     totalSize: typeof gardenPartial.totalSize === 'number' ? gardenPartial.totalSize : 0,
    //     emotion: gardenPartial.emotion ?? { energy: 50, melancholy: 10, chaos: 5, peace: 35 },
    //   };
    //   this.data.gardens.push(newGarden);
    //   this.save();
    //   return newGarden;
    // }
    // inside src/utils/db.ts (GardenDB class) - replace createGarden with this:
    // add this helper in src/utils/db.ts (inside GardenDB class)
    // private scanDirectory(dirPath: string): { fileCount: number; totalSize: number; newestTs: number | null } {
    //   const res = { fileCount: 0, totalSize: 0, newestTs: null as number | null };
    //   try {
    //     if (!fs.pathExistsSync(dirPath)) return res;
    //     const stack = [dirPath];
    //     while (stack.length) {
    //       const p = stack.pop()!;
    //       const entries = fs.readdirSync(p);
    //       for (const e of entries) {
    //         const full = path.join(p, e);
    //         let stat;
    //         try { stat = fs.statSync(full); } catch { continue; }
    //         if (stat.isDirectory()) {
    //           stack.push(full);
    //         } else if (stat.isFile()) {
    //           res.fileCount += 1;
    //           res.totalSize += stat.size;
    //           const mtime = stat.mtimeMs || stat.mtime?.getTime?.();
    //           if (mtime && (res.newestTs === null || mtime > res.newestTs)) res.newestTs = mtime;
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     // ignore scan errors and return defaults
    //   }
    //   return res;
    // }
    // Replace your old scan / stat function with this implementation.
    // Requires fs-extra and path (you already import those in many files).
    scanDirectory(dirPath) {
        const CODE_EXTENSIONS = new Set([
            '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
            '.rb', '.go', '.rs', '.php', '.swift', '.kt', '.scala', '.html', '.css'
        ]);
        const TEMP_PATTERNS = [
            'node_modules', '.git', 'dist', 'build', 'tmp', 'temp',
            '.cache', '__pycache__', '.next', '.nuxt'
        ];
        let fileCount = 0;
        let totalSize = 0;
        let totalAge = 0;
        let lastModified = 0;
        let codeFiles = 0;
        let hasHiddenFiles = false;
        let hasTempFiles = false;
        let largeFileCount = 0;
        let maxDepth = 0;
        const now = Date.now();
        const safeReaddir = (p) => {
            try {
                return fs.readdirSync(p);
            }
            catch {
                return [];
            }
        };
        const safeStat = (p) => {
            try {
                return fs.statSync(p);
            }
            catch {
                return null;
            }
        };
        const traverse = (current, depth = 0) => {
            if (depth > maxDepth)
                maxDepth = depth;
            const items = safeReaddir(current);
            for (const name of items) {
                const child = path.join(current, name);
                // hidden file/directory
                if (name.startsWith('.')) {
                    hasHiddenFiles = true;
                }
                // mark temp / vendor directories and skip scanning inside them
                if (TEMP_PATTERNS.some(p => name.includes(p))) {
                    hasTempFiles = true;
                    continue;
                }
                const st = safeStat(child);
                if (!st)
                    continue;
                if (st.isDirectory()) {
                    // limit recursion to avoid huge scans; increase if you want
                    if (depth < 6)
                        traverse(child, depth + 1);
                    else
                        maxDepth = Math.max(maxDepth, depth + 1);
                }
                else if (st.isFile()) {
                    fileCount++;
                    totalSize += st.size;
                    const mtime = st.mtimeMs || (st.mtime ? st.mtime.getTime() : 0);
                    if (mtime > lastModified)
                        lastModified = mtime;
                    totalAge += (now - mtime);
                    const ext = path.extname(name).toLowerCase();
                    if (CODE_EXTENSIONS.has(ext))
                        codeFiles++;
                    if (st.size > 1024 * 1024)
                        largeFileCount++;
                }
            }
        };
        // protect: if dirPath doesn't exist, return zeros
        try {
            const rootStat = safeStat(dirPath);
            if (!rootStat || !rootStat.isDirectory()) {
                return {
                    fileCount: 0,
                    totalSize: 0,
                    avgFileAge: 0,
                    lastModified: 0,
                    depth: 0,
                    hasHiddenFiles: false,
                    hasTempFiles: false,
                    codeFileRatio: 0,
                    largeFileCount: 0
                };
            }
        }
        catch {
            return {
                fileCount: 0,
                totalSize: 0,
                avgFileAge: 0,
                lastModified: 0,
                depth: 0,
                hasHiddenFiles: false,
                hasTempFiles: false,
                codeFileRatio: 0,
                largeFileCount: 0
            };
        }
        traverse(dirPath, 0);
        return {
            fileCount,
            totalSize,
            avgFileAge: fileCount > 0 ? Math.floor(totalAge / fileCount) : 0,
            lastModified,
            depth: maxDepth,
            hasHiddenFiles,
            hasTempFiles,
            codeFileRatio: fileCount > 0 ? codeFiles / fileCount : 0,
            largeFileCount
        };
    }
    // createGarden(gardenPartial: Partial<Garden>): Garden {
    //   const now = Date.now();
    //   const dir = gardenPartial.directoryPath ?? '.';
    //   const scan = this.scanDirectory(dir);
    //   const newestActivityTs = scan.newestTs ?? gardenPartial.plantedAt ?? now;
    //   const daysSinceActive = Math.max(0, Math.floor((now - newestActivityTs) / (1000 * 60 * 60 * 24)));
    //   const estimatedHealth = Math.max(10, Math.min(100, 100 - Math.floor(daysSinceActive * 3)));
    //   const newGarden: Garden = {
    //     id: gardenPartial.id ?? nanoid(8),
    //     name: gardenPartial.name ?? 'Untitled Garden',
    //     directoryPath: dir,
    //     description: gardenPartial.description ?? '',
    //     plantedAt: gardenPartial.plantedAt ?? now,
    //     lastWatered: gardenPartial.lastWatered ?? now,
    //     health: typeof gardenPartial.health === 'number' ? gardenPartial.health : estimatedHealth,
    //     growthStage: typeof gardenPartial.growthStage === 'number' ? gardenPartial.growthStage : 0,
    //     fileCount: typeof gardenPartial.fileCount === 'number' ? gardenPartial.fileCount : scan.fileCount,
    //     totalSize: typeof gardenPartial.totalSize === 'number' ? gardenPartial.totalSize : scan.totalSize,
    //     // IMPORTANT: create a new object literal (no shared reference)
    //     emotion: gardenPartial.emotion ? { ...gardenPartial.emotion } : { energy: 50, melancholy: 10, chaos: 5, peace: 35 },
    //   };
    //   this.data.gardens.push(newGarden);
    //   this.save();
    //   return newGarden;
    // }
    // createGarden(gardenPartial: Partial<Garden>): Garden {
    //   const now = Date.now();
    //   const dir = gardenPartial.directoryPath ?? '.';
    //   // Validate path: must exist and be a directory
    //   try {
    //     if (!fs.pathExistsSync(dir)) {
    //       throw new Error(`Path does not exist: ${dir}`);
    //     }
    //     const stat = fs.statSync(dir);
    //     if (!stat.isDirectory()) {
    //       throw new Error(`Path is not a directory: ${dir}`);
    //     }
    //   } catch (err) {
    //     // Re-throw as Error for callers to handle
    //     throw new Error(`Invalid directory path: ${dir} (${(err as Error).message})`);
    //   }
    //   // directory scan (unchanged)
    //   const scan = this.scanDirectory(dir);
    //   const newestActivityTs = scan.newestTs ?? gardenPartial.plantedAt ?? now;
    //   const daysSinceActive = Math.max(0, Math.floor((now - newestActivityTs) / (1000 * 60 * 60 * 24)));
    //   const estimatedHealth = Math.max(10, Math.min(100, 100 - Math.floor(daysSinceActive * 3)));
    //   const newGarden: Garden = {
    //     id: gardenPartial.id ?? nanoid(8),
    //     name: gardenPartial.name ?? 'Untitled Garden',
    //     directoryPath: dir,
    //     description: gardenPartial.description ?? '',
    //     plantedAt: gardenPartial.plantedAt ?? now,
    //     lastWatered: gardenPartial.lastWatered ?? now,
    //     health: typeof gardenPartial.health === 'number' ? gardenPartial.health : estimatedHealth,
    //     growthStage: typeof gardenPartial.growthStage === 'number' ? gardenPartial.growthStage : 0,
    //     fileCount: typeof gardenPartial.fileCount === 'number' ? gardenPartial.fileCount : scan.fileCount,
    //     totalSize: typeof gardenPartial.totalSize === 'number' ? gardenPartial.totalSize : scan.totalSize,
    //     emotion: gardenPartial.emotion ? { ...gardenPartial.emotion } : { energy: 50, melancholy: 10, chaos: 5, peace: 35 },
    //   };
    //   this.data.gardens.push(newGarden);
    //   this.save();
    //   return newGarden;
    // }
    // src/utils/db.ts (or wherever GardenDB lives)
    createGarden(gardenPartial) {
        const now = Date.now();
        if (!gardenPartial.directoryPath) {
            throw new Error("directoryPath is required to create a garden.");
        }
        const dir = gardenPartial.directoryPath;
        // scan the directory for size, file count etc.
        const scan = this.scanDirectory(dir);
        // Estimate basic health
        // const estimatedHealth = Math.max(
        //     10,
        //     Math.min(
        //         100,
        //         100
        //         - Math.max(0, Math.floor(scan.avgFileAge / (1000 * 60 * 60 * 24)) - 30)
        //         - (scan.hasHiddenFiles ? 5 : 0)
        //         - (scan.hasTempFiles ? 10 : 0)
        //         - Math.floor(scan.largeFileCount * 2)
        //     )
        // );
        // Estimate basic health
        const estimatedHealth = Math.max(10, Math.min(100, 100
            - Math.max(0, Math.floor(scan.avgFileAge / (1000 * 60 * 60 * 24)) - 30)
            - (scan.hasHiddenFiles ? 5 : 0)
            - (scan.hasTempFiles ? 10 : 0)
            - Math.floor(scan.largeFileCount * 2)));
        const newGarden = {
            id: gardenPartial.id ?? nanoid(8),
            name: gardenPartial.name ?? "Untitled Garden",
            description: gardenPartial.description ?? "",
            directoryPath: dir,
            plantedAt: now,
            lastWatered: now,
            growthStage: 0,
            health: estimatedHealth,
            // Stats
            fileCount: scan.fileCount,
            totalSize: scan.totalSize,
            // Placeholder; replaced below by analyzer
            emotion: { energy: 0.5, melancholy: 0.1, chaos: 0.05, peace: 0.35 }
        };
        // --- NEW IMPORTANT PART: compute real emotion ---
        try {
            const analyzer = new EmotionAnalyzer(dir);
            newGarden.emotion = analyzer.getEmotionVector();
            console.debug('[DB] createGarden:', newGarden.directoryPath, 'scan =>', scan, 'emotion =>', newGarden.emotion);
            newGarden.dominantEmotion = analyzer.getDominantEmotion?.() ?? "";
        }
        catch (err) {
            console.error("EmotionAnalyzer failed:", err);
        }
        this.data.gardens.push(newGarden);
        this.save();
        return newGarden;
    }
    updateGarden(id, patch) {
        const index = this.data.gardens.findIndex(g => g.id === id);
        if (index === -1)
            return null;
        const existing = this.data.gardens[index];
        const updated = { ...existing, ...patch };
        // --- Recompute emotion on changes ---
        try {
            const analyzer = new EmotionAnalyzer(updated.directoryPath);
            updated.emotion = analyzer.getEmotionVector();
            updated.dominantEmotion = analyzer.getDominantEmotion?.() ?? "";
        }
        catch (err) {
            console.warn("EmotionAnalyzer failed during update:", err);
        }
        this.data.gardens[index] = updated;
        this.save();
        return updated;
    }
    deleteGarden(id) {
        const before = this.data.gardens.length;
        this.data.gardens = this.data.gardens.filter((g) => g.id !== id);
        const after = this.data.gardens.length;
        if (after < before) {
            this.save();
            return true;
        }
        return false;
    }
    waterGarden(id) {
        const idx = this.data.gardens.findIndex((g) => g.id === id);
        if (idx === -1)
            return undefined;
        const g = this.data.gardens[idx];
        // Simple watering logic: increase health, bump lastWatered
        const newHealth = Math.min(100, g.health + 10);
        const updated = {
            ...g,
            health: newHealth,
            lastWatered: Date.now(),
        };
        this.data.gardens[idx] = updated;
        this.save();
        return updated;
    }
}
