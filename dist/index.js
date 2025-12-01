if (global.__garden_cli_started__) {
    // Prevent double initialization in dev/watch mode
    // eslint-disable-next-line no-console
    console.log('Garden CLI: startup suppressed (already running in this process).');
    process.exit(0);
}
global.__garden_cli_started__ = true;
// --- end guard ---
// src/index.tsx
(async () => {
    try {
        const React = (await import('react'));
        const ink = await import('ink');
        const { render } = ink;
        let AppModule;
        try {
            // Primary: absolute file URL to compiled JS (should resolve when running node dist/index.js)
            const appUrl = new URL('./ui/App.js', import.meta.url).href;
            AppModule = await import(appUrl);
        }
        catch (primaryErr) {
            // Log the original error so we can see why the file: import failed
            // eslint-disable-next-line no-console
            console.error('Primary import (file URL) failed:', primaryErr);
            // Safer fallback: explicitly try './ui/App.js' relative import
            try {
                AppModule = await import('./ui/App.js');
            }
            catch (secondaryErr) {
                // If that also fails, log it and rethrow so startup fails visibly with both errors.
                // eslint-disable-next-line no-console
                console.error('Secondary import (./ui/App.js) failed:', secondaryErr);
                throw secondaryErr;
            }
        }
        const App = AppModule.default ?? AppModule;
        const rendered = render(React.createElement(App));
        if (rendered && typeof rendered.unmount === 'function') {
            const unmount = rendered.unmount;
            const shutdown = () => {
                try {
                    unmount();
                }
                finally {
                    process.exit(0);
                }
            };
            process.on('SIGINT', shutdown);
            process.on('SIGTERM', shutdown);
        }
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to start app:', err);
        process.exit(1);
    }
})();
export {};
