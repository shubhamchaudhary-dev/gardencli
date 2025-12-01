// // src/ui/screens/PlantForm.tsx
// import React, { useState, useEffect } from 'react';
// import { Box, Text, useInput } from 'ink';
// import TextInput from 'ink-text-input';
// import fs from 'fs-extra';
// import nodePath from 'path';
// import { GardenDB } from '../../utils/db';
// import { ColorManager } from '../../utils/colorThemes';
// interface PlantFormProps {
//   db: GardenDB;
//   colorManager: ColorManager;
//   onCancel: () => void;
//   onCreated: (gardenId: string) => void;
// }

// export const PlantForm: React.FC<PlantFormProps> = ({ db, colorManager, onCancel, onCreated }) => {
//   // --- All hooks must be inside the component function body ---
// const [name, setName] = useState<string>('');
// const [inputPath, setInputPath] = useState<string>(''); // renamed from `path`
// const [description, setDescription] = useState<string>('');
// const [step, setStep] = useState<number>(0);
// const [submitting, setSubmitting] = useState<boolean>(false);
// const [error, setError] = useState<string | null>(null); // show validation errors


//   useEffect(() => {
//     // placeholder for focus / init logic
//   }, []);

//   // typed key/input handler
//   useInput((input: string, key: { escape?: boolean; ctrl?: boolean; meta?: boolean; shift?: boolean; name?: string }) => {
//     if (input === 'q' || key.escape) {
//       onCancel();
//       return;
//     }

//     if (input === '\r') {
//       if (step < 3) {
//         setStep((s) => s + 1);
//       } else {
//         void submitForm();
//       }
//       return;
//     }

//     if (input === 'b') {
//       setStep((s) => Math.max(0, s - 1));
//     }
//   });

//   // Validate path helper (async)
//   const validatePath = async (p: string): Promise<{ ok: boolean; message?: string }> => {
//     if (!p || p.trim() === '') return { ok: true }; // allow empty -> will use '.'
//     try {
//       const stat = await fs.promises.stat(p);
//       if (!stat.isDirectory()) {
//         return { ok: false, message: `Path is not a directory: ${p}` };
//       }
//       return { ok: true };
//     } catch (err) {
//       return { ok: false, message: `Path not found: ${p}` };
//     }
//   };

//   // const submitForm = async () => {
//   //   if (submitting) return;
//   //   setError(null);
//   //   setSubmitting(true);

//   //   try {
//   //     // Local validation
//   //     const validation = await validatePath(dirPath || '.');
//   //     if (!validation.ok) {
//   //       setError(validation.message ?? 'Invalid path');
//   //       return;
//   //     }

//   //     // Attempt to create garden; DB will also validate and throw if necessary
//   //     const created = db.createGarden({
//   //       name: name || 'Untitled Garden',
//   //       directoryPath: dirPath || '.',
//   //       description: description || '',
//   //       plantedAt: Date.now(),
//   //       lastWatered: Date.now(),
//   //       // let DB compute health/fileCount/totalSize if omitted
//   //     });

//   //     const id = (created && (created.id ?? (created as any))) ?? '';
//   //     onCreated(id);
//   //   } catch (err) {
//   //     const msg = err instanceof Error ? err.message : String(err);
//   //     setError(`Failed to create garden: ${msg}`);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

// // const submitForm = async () => {
// //   if (submitting) return;
// //   setSubmitting(true);

// //   // Validate path exists and is a directory
// //   const target = path.resolve(path || '.'); // import path from 'path' at top
// //   try {
// //     const stat = await fs.stat(target);
// //     if (!stat.isDirectory()) {
// //       setError?.('Path is not a directory');
// //       setSubmitting(false);
// //       return;
// //     }
// //   } catch (err) {
// //     setError?.('Directory not found or inaccessible');
// //     setSubmitting(false);
// //     return;
// //   }

// //   try {
// //     const created = db.createGarden({
// //       name: name || 'Untitled Garden',
// //       directoryPath: target,
// //       description: description,
// //       plantedAt: Date.now(),
// //       lastWatered: Date.now(),
// //       health: 100,
// //       growthStage: 0,
// //       fileCount: 0,
// //       totalSize: 0,
// //     });

// //     const id = (created && (created.id ?? (created as any))) ?? '';
// //     onCreated(id);
// //   } catch (err) {
// //     console.error('Failed to create garden', err);
// //     setError?.('Failed to create garden: ' + (err as Error).message);
// //   } finally {
// //     setSubmitting(false);
// //   }
// // };

// const submitForm = async () => {
//   if (submitting) return;
//   setSubmitting(true);
//   setError(null);

//   // Resolve the user-entered path (safe string)
//   const targetPath: string = nodePath.resolve(inputPath || '.');

//   // Validate existence and that it's a directory
//   try {
//     const exists = await fs.pathExists(targetPath);
//     if (!exists) {
//       setError('Directory not found or inaccessible');
//       setSubmitting(false);
//       return;
//     }

//     const st = await fs.stat(targetPath);
//     if (!st.isDirectory()) {
//       setError('Path exists but is not a directory');
//       setSubmitting(false);
//       return;
//     }
//   } catch (err: any) {
//     setError('Failed to access path: ' + (err?.message ?? String(err)));
//     setSubmitting(false);
//     return;
//   }

//   try {
//     const created = db.createGarden({
//       name: name || 'Untitled Garden',
//       directoryPath: targetPath,
//       description: description,
//       plantedAt: Date.now(),
//       lastWatered: Date.now(),
//       health: 100,
//       growthStage: 0,
//       fileCount: 0,
//       totalSize: 0,
//     });

//     const id = (created && (created.id ?? (created as any))) ?? '';
//     onCreated(id);
//   } catch (err: any) {
//     console.error('Failed to create garden', err);
//     setError('Failed to create garden: ' + (err?.message ?? String(err)));
//   } finally {
//     setSubmitting(false);
//   }
// };


//   return (
//     <Box flexDirection="column" padding={1}>
//       <Box marginBottom={1}>
//         <Text bold>{colorManager.gradient('  PLANT A NEW GARDEN  ')}</Text>
//       </Box>

//       {step === 0 && (
//         <Box flexDirection="column">
//           <Text dimColor>Enter a friendly name for the garden</Text>
//           <Box marginTop={1}>
//             <TextInput value={name} onChange={setName} placeholder="e.g. my-old-project" />
//           </Box>
//           <Box marginTop={1}>
//             <Text dimColor>Press Enter to continue, 'q' to cancel</Text>
//           </Box>
//         </Box>
//       )}

//       {step === 1 && (
//         <Box flexDirection="column">
//           <Text dimColor>Enter the directory path to track</Text>
//           <Box marginTop={1}>
//             <TextInput value={dirPath} onChange={setDirPath} placeholder="./path/to/project" />
//           </Box>
//           <Box marginTop={1}>
//             <Text dimColor>Press Enter to continue, 'b' to go back</Text>
//           </Box>
//         </Box>
//       )}

//       {step === 2 && (
//         <Box flexDirection="column">
//           <Text dimColor>Write a short description (optional)</Text>
//           <Box marginTop={1}>
//             <TextInput value={description} onChange={setDescription} placeholder="A melancholic repo..." />
//           </Box>
//           <Box marginTop={1}>
//             <Text dimColor>Press Enter to continue, 'b' to go back</Text>
//           </Box>
//         </Box>
//       )}

//       {step === 3 && (
//         <Box flexDirection="column">
//           <Text bold>Confirm</Text>

//           <Box marginTop={1} flexDirection="column">
//             <Text>
//               <Text dimColor>Name: </Text>
//               <Text>{name || 'Untitled Garden'}</Text>
//             </Text>
//             <Text>
//               <Text dimColor>Path: </Text>
//               <Text>{dirPath || '.'}</Text>
//             </Text>
//             {description && (
//               <Text>
//                 <Text dimColor>Description: </Text>
//                 <Text>{description}</Text>
//               </Text>
//             )}
//           </Box>

//           {/* Error block (inserted where you requested) */}
//           {error && (
//             <Box marginTop={1}>
//               <Text color="red">{error}</Text>
//             </Box>
//           )}

//           <Box marginTop={1}>
//             <Text dimColor>Press Enter to create, 'b' to edit, 'q' to cancel</Text>
//           </Box>

//           <Box marginTop={1}>
//             <Text>{submitting ? <Text dimColor>Creating…</Text> : <Text dimColor>Ready to create</Text>}</Text>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default PlantForm;


// src/ui/screens/PlantForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import fs from 'fs-extra';
import nodePath from 'path';
import { GardenDB } from '../../utils/db';
import { ColorManager } from '../../utils/colorThemes';

interface PlantFormProps {
  db: GardenDB;
  colorManager: ColorManager;
  onCancel: () => void;
  onCreated: (gardenId: string) => void;
}

export const PlantForm: React.FC<PlantFormProps> = ({ db, colorManager, onCancel, onCreated }) => {
  // state
  const [name, setName] = useState<string>('');
  const [inputPath, setInputPath] = useState<string>(''); // user entry for path
  const [description, setDescription] = useState<string>('');
  const [step, setStep] = useState<number>(0); // 0=name,1=path,2=desc,3=confirm
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // placeholder for focus/init
  }, []);

  // typed key/input handler
  useInput(
    (input: string, key: { escape?: boolean; ctrl?: boolean; meta?: boolean; shift?: boolean; name?: string }) => {
      if (input === 'q' || key.escape) {
        onCancel();
        return;
      }

      if (input === '\r') {
        if (step < 3) {
          setStep((s) => s + 1);
        } else {
          void submitForm();
        }
        return;
      }

      if (input === 'b') {
        setStep((s) => Math.max(0, s - 1));
      }
    }
  );

  // Validate path helper (resolves and checks)
  const validatePath = async (p: string): Promise<{ ok: boolean; message?: string }> => {
    const resolved = nodePath.resolve(p || '.');
    try {
      const exists = await fs.pathExists(resolved);
      if (!exists) return { ok: false, message: `Path not found: ${resolved}` };
      const st = await fs.stat(resolved);
      if (!st.isDirectory()) return { ok: false, message: `Path is not a directory: ${resolved}` };
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: `Path access error: ${err?.message ?? String(err)}` };
    }
  };

  // submit handler
  const submitForm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const targetPath: string = nodePath.resolve(inputPath || '.');

    // Validate
    try {
      const exists = await fs.pathExists(targetPath);
      if (!exists) {
        setError('Directory not found or inaccessible');
        setSubmitting(false);
        return;
      }

      const st = await fs.stat(targetPath);
      if (!st.isDirectory()) {
        setError('Path exists but is not a directory');
        setSubmitting(false);
        return;
      }
    } catch (err: any) {
      setError('Failed to access path: ' + (err?.message ?? String(err)));
      setSubmitting(false);
      return;
    }

    try {
      const created = db.createGarden({
        name: name || 'Untitled Garden',
        directoryPath: targetPath,
        description: description || '',
        plantedAt: Date.now(),
        lastWatered: Date.now(),
        health: 100,
        growthStage: 0,
        fileCount: 0,
        totalSize: 0,
      });

      const id = (created && (created.id ?? (created as any))) ?? '';
      onCreated(id);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to create garden', err);
      setError('Failed to create garden: ' + (err?.message ?? String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>{colorManager.gradient('  PLANT A NEW GARDEN  ')}</Text>
      </Box>

      {step === 0 && (
        <Box flexDirection="column">
          <Text dimColor>Enter a friendly name for the garden</Text>
          <Box marginTop={1}>
            <TextInput value={name} onChange={setName} placeholder="e.g. my-old-project" />
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Press Enter to continue, 'q' to cancel</Text>
          </Box>
        </Box>
      )}

      {step === 1 && (
        <Box flexDirection="column">
          <Text dimColor>Enter the directory path to track</Text>
          <Box marginTop={1}>
            <TextInput value={inputPath} onChange={setInputPath} placeholder="./path/to/project" />
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Press Enter to continue, 'b' to go back</Text>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box flexDirection="column">
          <Text dimColor>Write a short description (optional)</Text>
          <Box marginTop={1}>
            <TextInput value={description} onChange={setDescription} placeholder="A melancholic repo..." />
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Press Enter to continue, 'b' to go back</Text>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box flexDirection="column">
          <Text bold>Confirm</Text>

          <Box marginTop={1} flexDirection="column">
            <Text>
              <Text dimColor>Name: </Text>
              <Text>{name || 'Untitled Garden'}</Text>
            </Text>
            <Text>
              <Text dimColor>Path: </Text>
              <Text>{inputPath || '.'}</Text>
            </Text>
            {description && (
              <Text>
                <Text dimColor>Description: </Text>
                <Text>{description}</Text>
              </Text>
            )}
          </Box>

          {/* Error block */}
          {error && (
            <Box marginTop={1}>
              <Text color="red">{error}</Text>
            </Box>
          )}

          <Box marginTop={1}>
            <Text dimColor>Press Enter to create, 'b' to edit, 'q' to cancel</Text>
          </Box>

          <Box marginTop={1}>
            <Text>{submitting ? <Text dimColor>Creating…</Text> : <Text dimColor>Ready to create</Text>}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlantForm;
