const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Parse args manually since Electron combines own args
// Structure is: electron_binary main.js --watch --output ...
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
let outputDir = path.join(os.homedir(), 'Desktop');

const outputIndex = args.indexOf('--output');
if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputDir = args[outputIndex + 1];
}

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.bounds;

    mainWindow = new BrowserWindow({
        width,
        height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        movable: false,
        hasShadow: false,
        enableLargerThanScreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.setIgnoreMouseEvents(ignore, options);
});

ipcMain.on('close-app', () => {
    app.quit();
});

ipcMain.on('save-screenshot', async (event, rect) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.hide(); // Hide before capturing

    setTimeout(async () => {
        try {
            const primaryDisplay = screen.getPrimaryDisplay();

            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: {
                    width: primaryDisplay.size.width * primaryDisplay.scaleFactor,
                    height: primaryDisplay.size.height * primaryDisplay.scaleFactor
                }
            });

            const img = sources[0].thumbnail;
            const scale = primaryDisplay.scaleFactor;
            const cropRect = {
                x: Math.round(rect.x * scale),
                y: Math.round(rect.y * scale),
                width: Math.round(rect.width * scale),
                height: Math.round(rect.height * scale)
            };

            const crop = img.crop(cropRect);
            const pngBuffer = crop.toPNG();

            const pad = (n) => n.toString().padStart(2, "0");
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
            const filename = `Screenshot_${timestamp}.png`;
            const filePath = path.join(outputDir, filename);

            fs.writeFile(filePath, pngBuffer, (err) => {
                if (err) console.error('Failed to save:', err);

                if (isWatch) {
                    // Restore window if watch mode
                    win.show();
                    console.log(`Saved to ${filePath}. Continuing...`);
                } else {
                    console.log(`Saved to ${filePath}. Exiting.`);
                    app.quit();
                }
            });

        } catch (e) {
            console.error(e);
            app.quit();
        }
    }, 100);
});
