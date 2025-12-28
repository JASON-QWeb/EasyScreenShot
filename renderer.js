const { ipcRenderer } = require('electron');

const selectionBox = document.getElementById('selection-box');
const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const closeBtn = document.getElementById('close-btn');
const saveBtn = document.getElementById('save-btn');

let isDragging = false;
let isResizing = false;
let resizeDir = '';
let startX, startY;
let initialRect = {};

// Initialize Default Box
function initBox() {
    // Center a 600x400 box
    const startW = 600;
    const startH = 400;
    const startL = (window.innerWidth - startW) / 2;
    const startT = (window.innerHeight - startH) / 2;

    updateSelection(startL, startT, startW, startH);
    selectionBox.style.display = 'block';
}

// Mouse Event Forwarding Logic

selectionBox.addEventListener('mouseenter', () => {
    ipcRenderer.send('set-ignore-mouse-events', false);
});

selectionBox.addEventListener('mouseleave', () => {
    // Only ignore if we are NOT dragging/resizing
    if (!isDragging && !isResizing) {
        ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
    }
});

// Dragging Logic
selectionBox.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('handle')) {
        isResizing = true;
        resizeDir = e.target.dataset.dir;
        startX = e.clientX;
        startY = e.clientY;
        initialRect = getRect();
    } else if (e.target.closest('#toolbar')) {
        // Toolbar interaction, naturally handled by buttons/inputs
        // But we need to ensure we don't start dragging the box if clicking empty space in toolbar
        e.stopPropagation();
    } else {
        // Dragging the box
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialRect = getRect();
        document.body.style.cursor = 'move';
    }
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        updateSelection(initialRect.left + dx, initialRect.top + dy, initialRect.width, initialRect.height);
    } else if (isResizing) {
        let { left, top, width, height } = initialRect;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (resizeDir.includes('e')) width += dx;
        if (resizeDir.includes('w')) { left += dx; width -= dx; }
        if (resizeDir.includes('s')) height += dy;
        if (resizeDir.includes('n')) { top += dy; height -= dy; }

        if (width > 0 && height > 0) {
            updateSelection(left, top, width, height);
        }
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    document.body.style.cursor = 'default';
});

function updateSelection(left, top, w, h) {
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = w + 'px';
    selectionBox.style.height = h + 'px';

    widthInput.value = Math.round(w);
    heightInput.value = Math.round(h);
}

function getRect() {
    return {
        left: parseInt(selectionBox.style.left || 0),
        top: parseInt(selectionBox.style.top || 0),
        width: parseInt(selectionBox.style.width || 0),
        height: parseInt(selectionBox.style.height || 0)
    };
}

// Toolbar Inputs
widthInput.addEventListener('change', () => {
    const w = parseInt(widthInput.value);
    if (w > 0) selectionBox.style.width = w + 'px';
});

heightInput.addEventListener('change', () => {
    const h = parseInt(heightInput.value);
    if (h > 0) selectionBox.style.height = h + 'px';
});

// Buttons
closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-app');
});

saveBtn.addEventListener('click', () => {
    const rect = getRect();
    // rect uses CSS pixels (dom coords).
    // main process will handle scaling.
    // Pass x, y, width, height.
    ipcRenderer.send('save-screenshot', {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
    });
});

// Run Init
initBox();
