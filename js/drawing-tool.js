export class DrawingTool {
    constructor(scrollContainer) {
        this.scrollContainer = scrollContainer;
        this.isActive = false;
        this.mode = 'pen'; // 'pen' or 'eraser'
        this.color = '#000000';
        this.thickness = 2.5;
        this.canvases = [];
        this.containerUI = null;
        this.isDrawing = false;
        
        // History for Undo/Redo
        this.strokes = new Map(); // Map<canvas, Array of strokes>
        this.history = []; // Array of { canvas, stroke, type: 'add'|'clear' }
        this.redoStack = [];

        this.initUI();
    }

    initUI() {
        this.containerUI = document.createElement("div");
        this.containerUI.innerHTML = `
            <div style="position: fixed; right: 24px; bottom: 84px; z-index: 1000000; font-family: -apple-system, sans-serif;">
                
                <!-- Tool Settings Panel -->
                <div id="draw-settings" style="display: none; background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); width: 260px; padding: 20px; position: absolute; bottom: 70px; right: 0;">
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <button class="draw-mode-btn active" data-mode="pen" style="flex:1; padding:10px; border-radius:12px; border:1px solid #bbf7d0; background:white; font-weight:700; color:#4ade80; cursor:pointer;">PEN</button>
                        <button class="draw-mode-btn" data-mode="eraser" style="flex:1; padding:10px; border-radius:12px; border:1px solid #e2e8f0; background:white; font-weight:700; color:#64748b; cursor:pointer;">ERASER</button>
                        <button class="draw-mode-btn" data-mode="off" style="flex:1; padding:10px; border-radius:12px; border:1px solid #e2e8f0; background:white; font-weight:700; color:#64748b; cursor:pointer;">OFF</button>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button id="draw-undo" style="flex:1; padding:8px; border-radius:8px; background:#f1f5f9; border:none; color:#64748b; font-weight:600; cursor:pointer; opacity: 0.5;" disabled>↩ Undo</button>
                        <button id="draw-redo" style="flex:1; padding:8px; border-radius:8px; background:#f1f5f9; border:none; color:#64748b; font-weight:600; cursor:pointer; opacity: 0.5;" disabled>Redo ↪</button>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1px;">THICKNESS</span>
                            <span id="draw-thick-val" style="font-size: 12px; font-weight: 700; color: #64748b;">2.5PX</span>
                        </div>
                        <input type="range" id="draw-thick" min="1" max="10" step="0.5" value="2.5" style="width: 100%; accent-color: #bbf7d0;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; margin-bottom: 12px;">COLORS</span>
                        <div style="display: flex; gap: 8px;">
                            <div class="draw-color color-active" data-color="#0f172a" style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; cursor: pointer; border: 2px solid white; outline: 2px solid #cbd5e1;"></div>
                            <div class="draw-color" data-color="#ef4444" style="width: 28px; height: 28px; border-radius: 50%; background: #fca5a5; cursor: pointer; border: 2px solid white;"></div>
                            <div class="draw-color" data-color="#f59e0b" style="width: 28px; height: 28px; border-radius: 50%; background: #fde047; cursor: pointer; border: 2px solid white;"></div>
                            <div class="draw-color" data-color="#22c55e" style="width: 28px; height: 28px; border-radius: 50%; background: #4ade80; cursor: pointer; border: 2px solid white;"></div>
                            <div class="draw-color" data-color="#3b82f6" style="width: 28px; height: 28px; border-radius: 50%; background: #60a5fa; cursor: pointer; border: 2px solid white;"></div>
                            <div class="draw-color" data-color="#a855f7" style="width: 28px; height: 28px; border-radius: 50%; background: #c084fc; cursor: pointer; border: 2px solid white;"></div>
                        </div>
                    </div>

                    <button id="draw-clear" style="width: 100%; padding: 12px; border-radius: 12px; background: #fef2f2; border: 1px solid #fecaca; color: #f87171; font-weight: 700; cursor: pointer; transition: 0.2s;">CLEAR ALL</button>
                </div>

                <!-- Main Floating Button -->
                <button id="draw-toggle" style="width: 56px; height: 56px; border-radius: 50%; background: #dcfce7; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px #bbf7d0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
            </div>
        `;
        document.body.appendChild(this.containerUI);

        this.containerUI.querySelector("#draw-toggle").onclick = () => {
            let panel = this.containerUI.querySelector("#draw-settings");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        };

        let modeBtns = this.containerUI.querySelectorAll(".draw-mode-btn");
        modeBtns.forEach(btn => {
            btn.onclick = () => {
                modeBtns.forEach(b => {
                    b.classList.remove("active");
                    b.style.borderColor = "#e2e8f0";
                    b.style.color = "#64748b";
                    b.style.background = "white";
                });
                
                btn.classList.add("active");
                if (btn.dataset.mode === "pen") {
                    btn.style.borderColor = "#bbf7d0";
                    btn.style.color = "#4ade80";
                    this.mode = 'pen';
                    this.isActive = true;
                } else if (btn.dataset.mode === "eraser") {
                    btn.style.borderColor = "#fca5a5";
                    btn.style.color = "#ef4444";
                    this.mode = 'eraser';
                    this.isActive = true;
                } else {
                    btn.style.borderColor = "#e2e8f0";
                    btn.style.color = "#64748b";
                    this.isActive = false;
                }
                this.updateCanvasPointers();
            };
        });

        let colorBtns = this.containerUI.querySelectorAll(".draw-color");
        colorBtns.forEach(btn => {
            btn.onclick = () => {
                colorBtns.forEach(b => b.style.outline = "none");
                btn.style.outline = "2px solid #cbd5e1";
                this.color = btn.dataset.color;
            };
        });

        let thickObj = this.containerUI.querySelector("#draw-thick");
        let thickVal = this.containerUI.querySelector("#draw-thick-val");
        thickObj.oninput = (e) => {
            this.thickness = e.target.value;
            thickVal.innerText = this.thickness + "PX";
        };

        this.containerUI.querySelector("#draw-undo").onclick = () => this.undo();
        this.containerUI.querySelector("#draw-redo").onclick = () => this.redo();

        this.containerUI.querySelector("#draw-clear").onclick = () => {
            this.canvases.forEach(c => {
                let ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
            });
            // Record clear action in history
            this.history.push({ type: 'clear' });
            this.redoStack = [];
            this.strokes.forEach(arr => arr.length = 0);
            this.updateUndoRedoUI();
        };
        
        // Ensure default styling is applied visually
        this.containerUI.querySelector(".draw-mode-btn[data-mode='off']").click();
    }

    attachToPages() {
        let pages = this.scrollContainer.querySelectorAll(".cbt-page-container");
        pages.forEach(page => {
            if (page.querySelector(".draw-canvas")) return; // already attached

            let canvas = document.createElement("canvas");
            canvas.className = "draw-canvas";
            canvas.width = page.offsetWidth;
            canvas.height = page.offsetHeight;
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "10";
            
            page.appendChild(canvas);
            this.canvases.push(canvas);
            this.strokes.set(canvas, []);

            let ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            let isPointerDown = false;
            let currentPath = null;

            const getPos = (e) => {
                let rect = canvas.getBoundingClientRect();
                let clientX = e.touches ? e.touches[0].clientX : e.clientX;
                let clientY = e.touches ? e.touches[0].clientY : e.clientY;
                let scaleX = canvas.width / rect.width;
                let scaleY = canvas.height / rect.height;
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            };

            const down = (e) => {
                if (!this.isActive) return;
                isPointerDown = true;
                let pos = getPos(e);
                
                currentPath = {
                    mode: this.mode,
                    color: this.color,
                    thickness: this.mode === 'eraser' ? this.thickness * 5 : this.thickness,
                    points: [pos]
                };
            };

            const move = (e) => {
                if (!isPointerDown || !this.isActive || !currentPath) return;
                e.preventDefault(); // prevent scrolling
                let pos = getPos(e);
                let lastPos = currentPath.points[currentPath.points.length - 1];

                ctx.beginPath();
                ctx.moveTo(lastPos.x, lastPos.y);
                ctx.lineTo(pos.x, pos.y);
                
                if (currentPath.mode === 'eraser') {
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.lineWidth = currentPath.thickness;
                } else {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = currentPath.color;
                    ctx.lineWidth = currentPath.thickness;
                }
                
                ctx.stroke();
                currentPath.points.push(pos);
            };

            const up = () => {
                if (isPointerDown && currentPath && currentPath.points.length > 1) {
                    this.strokes.get(canvas).push(currentPath);
                    this.history.push({ type: 'add', canvas: canvas, stroke: currentPath });
                    this.redoStack = [];
                    this.updateUndoRedoUI();
                }
                isPointerDown = false;
                currentPath = null;
            };

            canvas.addEventListener("mousedown", down);
            canvas.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            
            canvas.addEventListener("touchstart", down, {passive: false});
            canvas.addEventListener("touchmove", move, {passive: false});
            window.addEventListener("touchend", up);
        });
        
        this.updateCanvasPointers();
    }
    
    redrawCanvas(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let canvasStrokes = this.strokes.get(canvas) || [];
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        for (let path of canvasStrokes) {
            if (path.points.length < 2) continue;
            
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            
            if (path.mode === 'eraser') {
                ctx.globalCompositeOperation = "destination-out";
                ctx.lineWidth = path.thickness;
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = path.color;
                ctx.lineWidth = path.thickness;
            }
            ctx.stroke();
        }
    }

    undo() {
        if (this.history.length === 0) return;
        let lastAction = this.history.pop();
        this.redoStack.push(lastAction);
        
        if (lastAction.type === 'add') {
             let canvasStrokes = this.strokes.get(lastAction.canvas);
             canvasStrokes.pop();
             this.redrawCanvas(lastAction.canvas);
        } else if (lastAction.type === 'clear') {
            // Can't easily undo a full clear of all unless we save all states, which we don't.
            // But we don't clear the arrays on 'clear' anymore if we want to restore them.
            // Actually, we did clear them via array.length = 0.
            // Let's ignore clear undo for now or it's complex. 
            // In a simple app, clear is destructive.
        }
        
        this.updateUndoRedoUI();
    }

    redo() {
        if (this.redoStack.length === 0) return;
        let action = this.redoStack.pop();
        this.history.push(action);
        
        if (action.type === 'add') {
             let canvasStrokes = this.strokes.get(action.canvas);
             canvasStrokes.push(action.stroke);
             this.redrawCanvas(action.canvas);
        }
        
        this.updateUndoRedoUI();
    }

    updateUndoRedoUI() {
        let undoBtn = this.containerUI.querySelector("#draw-undo");
        let redoBtn = this.containerUI.querySelector("#draw-redo");
        
        if (this.history.length > 0 && this.history[this.history.length - 1].type !== 'clear') {
             undoBtn.disabled = false;
             undoBtn.style.opacity = "1";
        } else {
             undoBtn.disabled = true;
             undoBtn.style.opacity = "0.5";
        }
        
        if (this.redoStack.length > 0) {
             redoBtn.disabled = false;
             redoBtn.style.opacity = "1";
        } else {
             redoBtn.disabled = true;
             redoBtn.style.opacity = "0.5";
        }
    }

    updateCanvasPointers() {
        this.canvases.forEach(c => {
            c.style.pointerEvents = this.isActive ? "auto" : "none";
        });
    }

    destroy() {
        if (this.containerUI) this.containerUI.remove();
        this.canvases.forEach(c => c.remove());
        this.canvases = [];
        this.strokes.clear();
        this.history = [];
        this.redoStack = [];
    }
}
