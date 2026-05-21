import createModal from "./modal.js";
import JSConfetti from "js-confetti";
import { CalculatorUI } from "./calculator.js";
import { DrawingTool } from "./drawing-tool.js";
import { pdfjsLib } from "./pdf-system.js";
const jsConfetti = new JSConfetti();

export class CBTSystem {
  constructor() {
    this.container = null;
    this.pdfDoc = null;
    this.pagesData = [];
    this.selectedAnswers = {}; // qNum -> "A", "B", etc.
    this.elapsedSeconds = 45 * 60; // 45 minutes
    this.timerInterval = null;
    this.timerRunning = false;
    this.optionsData = {};
    this.totalQuestionsCount = 0;
  }

  async init(pdfDoc, optionsData) {
    this.pdfDoc = pdfDoc;
    this.optionsData = optionsData || {}; // { modelAnswers, basePdfUrl }
    this.modelAnswers = this.optionsData.modelAnswers || [];

    await this.showLoading();
    await this.parsePages();
    this.createLayout();
    await this.renderAllPages();
    this.hideLoading();
  }

  async showLoading() {
    this.loadingOverlay = document.createElement("div");
    this.loadingOverlay.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#1e293b; color:white; font-family:-apple-system, system-ui, sans-serif;">
                <div style="width: 40px; height: 40px; border: 4px solid #fff; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <h2 style="margin-top: 20px;">Preparing Exam Paper...</h2>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </div>
        `;
    this.loadingOverlay.style.position = "fixed";
    this.loadingOverlay.style.top = "0";
    this.loadingOverlay.style.left = "0";
    this.loadingOverlay.style.width = "100%";
    this.loadingOverlay.style.height = "100%";
    this.loadingOverlay.style.zIndex = "999999";
    document.body.appendChild(this.loadingOverlay);
  }

  hideLoading() {
    if (this.loadingOverlay) this.loadingOverlay.remove();
  }

  async parsePages() {
    this.pagesData = [];
    let expectedQ = 1;
    let currentQ = null;

    for (let p = 1; p <= this.pdfDoc.numPages; p++) {
      let page = await this.pdfDoc.getPage(p);
      let textContent = await page.getTextContent();
      let viewport = page.getViewport({ scale: 1.5 }); // scale we will use for rendering

      let items = textContent.items.filter((i) => i.str.trim() !== "");

      // Sort top-to-bottom
      items.sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) < 5) {
          return a.transform[4] - b.transform[4];
        }
        return b.transform[5] - a.transform[5];
      });

      let pageOptions = [];

      for (let item of items) {
        let str = item.str.trim();
        let x = item.transform[4]; // unscaled X
        let y = item.transform[5]; // unscaled Y from bottom

        if (
          x < 120 &&
          (str === expectedQ.toString() ||
            str === expectedQ.toString() + "." ||
            str === expectedQ.toString() + ")")
        ) {
          currentQ = expectedQ;
          expectedQ++;
        }

        // Identify options A, B, C, D
        if (str === "A" || str === "B" || str === "C" || str === "D") {
          // we assume it's an option if it's standalone like this
          if (currentQ !== null) {
            // translate to pixel coords for the canvas overlay
            // y is from bottom in PDF scale 1.0!
            let pixelY = viewport.height - y * 1.5;
            let pixelX = x * 1.5;

            pageOptions.push({
              q: currentQ,
              opt: str,
              x: pixelX,
              y: pixelY,
              w: item.width * 1.5,
              h: item.height * 1.5,
            });
          }
        }
      }
      this.pagesData.push({ pageIndex: p, options: pageOptions, viewport });
    }
    this.totalQuestionsCount = expectedQ - 1;
  }

  createLayout() {
    this.container = document.createElement("div");
    this.container.id = "cbt-layout";
    this.container.innerHTML = `
            <div class="cbt-header" style="height: 80px; background: #ffffff; border-bottom: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div class="cbt-header-left" style="display:flex; align-items:center;">
                    <button id="cbt-exit" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; color:#475569; font-weight:600; font-size:14px; cursor:pointer; display:flex; align-items:center; padding: 6px 12px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.background='#e2e8f0'; this.style.color='#1e293b';" onmouseout="this.style.background='#f1f5f9'; this.style.color='#475569';">
                        <svg fill="currentColor" viewBox="0 0 24 24" style="width:18px; height:18px; margin-right:4px;"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        Change Layout
                    </button>
                    <div style="width:1px; height:20px; background:#e2e8f0; margin:0 12px;"></div>
                    <div id="cbt-subject-context" style="font-weight:600; color:#334155; font-size:15px; letter-spacing:0.2px;"></div>
                </div>
                
                <div class="cbt-header-center" style="display: flex; align-items: center; gap: 4px;">
                    <div class="cbt-timer-pill" id="cbt-timer-box">
                         <div class="cbt-timer-dot" id="cbt-timer-dot"></div>
                         <div class="cbt-timer-text" id="cbt-timer-text">0:45:00</div>
                    </div>
                    <button id="cbt-timer-playpause" class="cbt-btn-icon" title="Play/Pause">
                         <svg id="cbt-icon-play" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                         <svg id="cbt-icon-pause" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    </button>
                    <button id="cbt-timer-reset" class="cbt-btn-icon cbt-btn-arrow" title="Reset Timer">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                    </button>
            
                    <a class="cbt-doc-btn" id="cbt-btn-qp" target="_blank" style="text-decoration:none; display:flex; align-items:center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>QP
                    </a>
                    <a class="cbt-doc-btn" id="cbt-btn-ms" target="_blank" style="text-decoration:none; display:flex; align-items:center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>MS
                    </a>
                    
                    <div class="cbt-answered-pill">
                        <span style="font-size:11px; font-weight:700; color:#64748b; letter-spacing:0.5px;">ANSWERED</span> 
                        <strong id="cbt-answered-count" style="font-size:14px; font-weight:800; color:#0f172a; margin-left:6px;">0</strong> 
                        <span id="cbt-answered-total" style="font-size:13px; font-weight:600; color: #94a3b8;">/${this.totalQuestionsCount > 0 ? this.totalQuestionsCount : this.modelAnswers.length}</span>
                    </div>
                </div>

                <div class="cbt-header-right" style="display:flex; align-items:center; gap: 12px;">    
                    <div style="display:flex; align-items:center; gap: 4px; background: white; padding: 4px; border-radius: 20px; border: 1px solid #e2e8f0; height: 36px;">
                        <button id="cbt-zoom-out" style="background:transparent; border:none; width: 26px; height: 26px; border-radius: 50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Zoom Out"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        <span id="cbt-zoom-text" style="font-size:12px; font-weight:700; color:#334155; min-width:36px; text-align:center;">100%</span>
                        <button id="cbt-zoom-in" style="background:transparent; border:none; width: 26px; height: 26px; border-radius: 50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Zoom In"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>
                
                    <div style="display:flex; align-items:center; gap: 8px; background: white; padding: 4px 10px; border-radius: 20px; border: 1px solid #e2e8f0; height: 36px;">
                        <span style="font-size:13px; font-weight:600; color:#334155;">Realtime</span>
                        <label class="cbt-switch">
                            <input type="checkbox" id="cbt-realtime-toggle">
                            <span class="cbt-slider round"></span>
                        </label>
                    </div>
            
                    <button class="cbt-submit-btn" id="cbt-submit" style="white-space:nowrap;">Submit Paper</button>
                    
                    <button class="cbt-btn-icon cbt-btn-border" id="cbt-calculator" title="Calculator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14.01"></line><line x1="16" y1="10" x2="16" y2="10.01"></line><line x1="16" y1="18" x2="16" y2="18.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="12" y1="10" x2="12" y2="10.01"></line><line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="8" y1="10" x2="8" y2="10.01"></line><line x1="8" y1="18" x2="8" y2="18.01"></line></svg>
                    </button>
                    <button class="cbt-btn-icon" id="cbt-fullscreen" title="Enter Fullscreen">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                    </button>
                </div>
            </div>
            
            <div class="cbt-main">
                <div class="cbt-paper-scroll" id="cbt-paper-scroll">
                    <!-- Pages will be appended here -->
                </div>
            </div>
            <style>
                #cbt-layout {
                    position: fixed; inset: 0; background: #e2e8f0; z-index: 1000000;
                    display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }
                .cbt-header {
                    height: 80px; background: #ffffff;
                    border-bottom: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
                    z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .cbt-topbar {
                    display: flex; align-items: center; gap: 4px; background: white;
                }
                
                .cbt-timer-pill {
                    border: 2px solid #0f172a; border-radius: 30px; padding: 6px 16px;
                    display: flex; align-items: center; gap: 8px; margin-right: 8px;
                    background: white;
                }
                .cbt-timer-dot {
                    width: 8px; height: 8px; background: #4ae082; border-radius: 50%;
                }
                .cbt-timer-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; }
                
                .cbt-btn-icon { background: transparent; border: none; cursor: pointer; color: #0f172a; padding: 8px; border-radius: 50%; display:flex; align-items:center; justify-content:center; transition: 0.2s;}
                .cbt-btn-icon:hover { background: #f1f5f9; }
                .cbt-btn-border { border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px;}
                .cbt-btn-arrow { margin-right: 8px; color: #94a3b8; }
                
                .cbt-doc-btn { background: white; color: #0f172a; border: none; padding: 8px 12px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 15px;}
                .cbt-doc-btn:hover { background: #f1f5f9; border-radius: 8px; }
                
                .cbt-answered-pill {
                    border: 1px solid #cbd5e1; border-radius: 30px; padding: 6px 16px;
                    display: flex; align-items: center; margin-left: 12px; margin-right: 12px;
                    background: white; white-space: nowrap;
                }
                
                .cbt-submit-btn { background: white; color: #64748b; border: 2px solid #cbd5e1; padding: 8px 24px; border-radius: 30px; font-weight:700; cursor: pointer; transition: 0.2s; font-size:15px;}
                .cbt-submit-btn:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }
                
                .cbt-switch { position: relative; display: inline-block; width: 36px; height: 20px; margin-left: 8px; }
                .cbt-switch input { opacity: 0; width: 0; height: 0; }
                .cbt-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 20px; margin: 0; }
                .cbt-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                input:checked + .cbt-slider { background-color: #22c55e; }
                input:checked + .cbt-slider:before { transform: translateX(16px); }
                
                .cbt-main { flex: 1; overflow-y: auto; padding: 40px 20px; display: flex; justify-content: center; background-color: #8fa0b0;}
                .cbt-paper-scroll { width: 100%; display: flex; flex-direction: column; gap: 24px; align-items: center;}
                
                .cbt-page-container {
                    background: white;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
                    position: relative;
                }
                .cbt-page-container canvas {
                    display: block; width: 100%; height: auto;
                }
                
                .textLayer {
                    position: absolute;
                    left: 0; top: 0; right: 0; bottom: 0;
                    overflow: hidden;
                    opacity: 0.2;
                    line-height: 1.0;
                    opacity: 1; /* allow selection */
                }
                .textLayer > span {
                    color: transparent;
                    position: absolute;
                    white-space: pre;
                    cursor: text;
                    transform-origin: 0% 0%;
                }
                .textLayer ::selection {
                    background: rgba(0, 0, 255, 0.2);
                    color: transparent;
                }
                
                .cbt-overlay-option {
                    position: absolute;
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    border: 2px solid transparent;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; font-weight: bold; color: transparent;
                    transition: all 0.15s;
                    background: rgba(59, 130, 246, 0.25); /* visible hint */
                    z-index: 100;
                    pointer-events: auto;
                }
                .cbt-overlay-option:hover {
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.2);
                }
                .cbt-overlay-option.selected {
                    border-color: #2563eb;
                    background: rgba(37, 99, 235, 0.4);
                }
                /* Realtime Feedback Classes */
                .cbt-overlay-option.correct-ans {
                    border-color: #22c55e !important;
                    background: rgba(34, 197, 94, 0.5) !important;
                }
                .cbt-overlay-option.wrong-ans {
                    border-color: #ef4444 !important;
                    background: rgba(239, 68, 68, 0.5) !important;
                }
                
                .cbt-modal-overlay { position: fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000001; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(4px);}
                .cbt-modal { background:white; padding:40px; border-radius: 16px; max-width: 450px; width:100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); text-align:center;}
                .cbt-modal h2 { margin-top:0; color:#0f172a; font-size:28px; margin-bottom: 8px;}
                .cbt-modal p { color:#475569; margin: 12px 0; font-size:16px;}
                .cbt-modal-grade { font-size: 64px; font-weight:900; color:#3b82f6; margin: 24px 0;}
            </style>
        `;
    document.body.appendChild(this.container);

    let playPauseBtn = this.container.querySelector("#cbt-timer-playpause");
    let resetBtn = this.container.querySelector("#cbt-timer-reset");
    let iconPlay = this.container.querySelector("#cbt-icon-play");
    let iconPause = this.container.querySelector("#cbt-icon-pause");

    const updatePlayPauseIcon = () => {
      if (this.timerRunning) {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      } else {
        iconPlay.style.display = "block";
        iconPause.style.display = "none";
      }
    };

    playPauseBtn.onclick = () => {
      if (this.timerRunning) {
        clearInterval(this.timerInterval);
        this.timerRunning = false;
      } else {
        this.timerRunning = true;
        this.startTimer();
      }
      updatePlayPauseIcon();
    };

    resetBtn.onclick = () => {
      clearInterval(this.timerInterval);
      this.elapsedSeconds = 45 * 60;
      this.timerRunning = false;
      updatePlayPauseIcon();
      this.updateTimerDisplay();
    };

    if (this.optionsData.basePdfUrl) {
      let filenameMatch = this.optionsData.basePdfUrl.match(/([a-zA-Z0-9_]+_qp_[0-9]+)\.pdf/);
      if (filenameMatch) {
        let filename = filenameMatch[0];
        let msFilename = filename.replace("_qp_", "_ms_");
        this.container.querySelector("#cbt-btn-qp").href = `https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/${filename}`;
        this.container.querySelector("#cbt-btn-ms").href = `https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/${msFilename}`;
      }
    }

    // Populate subject context if available
    let subjectContextContainer = this.container.querySelector("#cbt-subject-context");
    if (this.optionsData.basePdfUrl) {
      let filenameMatch = this.optionsData.basePdfUrl.match(/([a-zA-Z0-9_]+)_qp_([0-9]+)\.pdf/);
      if (filenameMatch) {
         let subCode = filenameMatch[1].split("_")[0];
         let sessionYear = filenameMatch[1].split("_")[1]; // e.g. s25
         let varnt = filenameMatch[2]; // e.g. 11
         if (subjectContextContainer) subjectContextContainer.innerText = `${subCode} · 20${sessionYear.substring(1)} · P${varnt}`;
      }
    }

    this.container.querySelector("#cbt-exit").onclick = () => {
      clearInterval(this.timerInterval);
      if (this.drawingTool) this.drawingTool.destroy();
      this.container.remove();
      if (document.exitFullscreen && isFullscreen) {
         document.exitFullscreen().catch(()=>{});
      }
      const handoutOpt = document.querySelector('.custom-layout-option[data-value="handout"]');
      if (handoutOpt) handoutOpt.click();
    };

    let isFullscreen = false;
    this.container.querySelector("#cbt-fullscreen").onclick = () => {
      if (!isFullscreen) {
         if (this.container.requestFullscreen) {
             this.container.requestFullscreen();
         } else if (this.container.webkitRequestFullscreen) { /* Safari */
             this.container.webkitRequestFullscreen();
         } else if (this.container.msRequestFullscreen) { /* IE11 */
             this.container.msRequestFullscreen();
         }
         isFullscreen = true;
      } else {
         if (document.exitFullscreen) {
             document.exitFullscreen();
         } else if (document.webkitExitFullscreen) { /* Safari */
             document.webkitExitFullscreen();
         } else if (document.msExitFullscreen) { /* IE11 */
             document.msExitFullscreen();
         }
         isFullscreen = false;
      }
    };

    let zoomLevel = 1.0;
    const updateZoom = (dir) => {
        let scrollArea = this.container.querySelector(".cbt-main");
        // Center of the visible portion relative to the scrollable content
        let scrollCenterY = (scrollArea.scrollTop + scrollArea.clientHeight / 2) / zoomLevel;
        let scrollCenterX = (scrollArea.scrollLeft + scrollArea.clientWidth / 2) / zoomLevel;
        
        if (dir === 'in') zoomLevel = Math.min(2.5, zoomLevel + 0.1);
        else if (dir === 'out') zoomLevel = Math.max(0.5, zoomLevel - 0.1);
        let pct = Math.round(zoomLevel * 100);
        this.container.querySelector("#cbt-zoom-text").innerText = pct + "%";
        
        this.container.querySelector("#cbt-paper-scroll").style.zoom = zoomLevel;
        
        // Restore scroll position
        scrollArea.scrollTop = scrollCenterY * zoomLevel - scrollArea.clientHeight / 2;
        scrollArea.scrollLeft = scrollCenterX * zoomLevel - scrollArea.clientWidth / 2;
    };
    this.container.querySelector("#cbt-zoom-in").onclick = () => updateZoom('in');
    this.container.querySelector("#cbt-zoom-out").onclick = () => updateZoom('out');

    let calcBtn = this.container.querySelector("#cbt-calculator");
    if (calcBtn) {
      let calculator = new CalculatorUI(this.container);
      calcBtn.onclick = () => calculator.toggle();
    }

    this.drawingTool = new DrawingTool(this.container.querySelector("#cbt-paper-scroll"));

    this.container.querySelector("#cbt-submit").onclick = () => {
      this.finishExam();
    };

    // Check toggle to re-evaluate current answers if turned on
    this.container
      .querySelector("#cbt-realtime-toggle")
      .addEventListener("change", (e) => {
        if (e.target.checked) {
          this.evaluateAllRealtime();
        } else {
          this.clearRealtimeFeedback();
        }
      });

    // default UI updates without auto start
    updatePlayPauseIcon();
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    let hrs = Math.floor(this.elapsedSeconds / 3600);
    let mins = Math.floor((this.elapsedSeconds % 3600) / 60);
    let secs = this.elapsedSeconds % 60;
    
    let timeString = "";
    if (hrs > 0) {
      timeString = `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    
    this.container.querySelector("#cbt-timer-text").innerText = timeString;
    
    if (this.optionsData && this.optionsData.basePdfUrl) {
       localStorage.setItem("cbt_time_" + this.optionsData.basePdfUrl, this.elapsedSeconds.toString());
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.elapsedSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.finishExam();
        return;
      }
      this.elapsedSeconds--;
      this.updateTimerDisplay();
    }, 1000);
  }

  loadAnswers() {
    if (this.optionsData && this.optionsData.basePdfUrl) {
      let saved = localStorage.getItem("cbt_answers_" + this.optionsData.basePdfUrl);
      if (saved) {
        try {
          this.selectedAnswers = JSON.parse(saved);
        } catch(e) {}
      }
      let savedTime = localStorage.getItem("cbt_time_" + this.optionsData.basePdfUrl);
      if (savedTime && !isNaN(parseInt(savedTime))) {
         this.elapsedSeconds = parseInt(savedTime);
      }
      let answeredCountEl = this.container.querySelector("#cbt-answered-count");
      if (answeredCountEl) {
         answeredCountEl.innerText = Object.keys(this.selectedAnswers).length;
      }
    }
  }

  async renderAllPages() {
    let scrollContainer = this.container.querySelector("#cbt-paper-scroll");
    scrollContainer.innerHTML = "";

    this.loadAnswers();

    for (let i = 0; i < this.pagesData.length; i++) {
      let pData = this.pagesData[i];

      let wrapper = document.createElement("div");
      wrapper.className = "cbt-page-container";
      // Fixed dimensions based on viewport to absolute positioning works seamlessly
      wrapper.style.width = pData.viewport.width + "px";
      wrapper.style.height = pData.viewport.height + "px";

      let canvas = document.createElement("canvas");
      canvas.width = pData.viewport.width;
      canvas.height = pData.viewport.height;
      wrapper.appendChild(canvas);

      // Overlay options
      for (let opt of pData.options) {
        let btn = document.createElement("div");
        btn.className = "cbt-overlay-option";
        if (this.selectedAnswers[opt.q] === opt.opt) {
            btn.classList.add("selected");
        }
        btn.innerText = opt.opt; // visually hidden usually, but we keep it
        // Adjust coordinates based on scaled viewport
        btn.style.left = opt.x + "px";
        // Y is tricky, usually the text transform is the bottom-left baseline of the text.
        // Move up by half height of the text roughly
        btn.style.top = opt.y - opt.h / 2 + "px";

        btn.dataset.q = opt.q;
        btn.dataset.opt = opt.opt;

        btn.onclick = () => {
          this.selectAnswer(opt.q, opt.opt, wrapper.parentElement);
        };

        wrapper.appendChild(btn);
      }

      scrollContainer.appendChild(wrapper);

      // render PDF to canvas
      let page = await this.pdfDoc.getPage(pData.pageIndex);
      let ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport: pData.viewport })
        .promise;
        
      // Render text layer for selection
      let textLayerDiv = document.createElement("div");
      textLayerDiv.className = "textLayer";
      textLayerDiv.style.position = 'absolute';
      textLayerDiv.style.left = '0';
      textLayerDiv.style.top = '0';
      textLayerDiv.style.right = '0';
      textLayerDiv.style.bottom = '0';
      textLayerDiv.style.overflow = 'hidden';
      textLayerDiv.style.setProperty('--scale-factor', pData.viewport.scale);
      textLayerDiv.style.setProperty('--total-scale-factor', pData.viewport.scale);
      wrapper.insertBefore(textLayerDiv, canvas.nextSibling);

      let textContent = await page.getTextContent();
      try {
          const textLayer = new pdfjsLib.TextLayer({
              textContentSource: textContent,
              container: textLayerDiv,
              viewport: pData.viewport
          });
          await textLayer.render();
      } catch (err) {
          console.warn("Text layer rendering failed", err);
      }
    }
    
    if (this.drawingTool) {
       this.drawingTool.attachToPages();
    }
  }

  selectAnswer(qNum, opt, rootContainer) {
    this.selectedAnswers[qNum] = opt;
    
    // Save answers
    if (this.optionsData && this.optionsData.basePdfUrl) {
       localStorage.setItem("cbt_answers_" + this.optionsData.basePdfUrl, JSON.stringify(this.selectedAnswers));
    }
    
    let answeredCountEl = this.container.querySelector("#cbt-answered-count");
    if (answeredCountEl) {
       answeredCountEl.innerText = Object.keys(this.selectedAnswers).length;
    }

    // clear 'selected', 'correct-ans', 'wrong-ans' for ALL buttons of this question across pages
    let allBtns = rootContainer.querySelectorAll(
      `.cbt-overlay-option[data-q="${qNum}"]`,
    );
    allBtns.forEach((b) => {
      b.classList.remove("selected", "correct-ans", "wrong-ans");
    });

    // select the clicked one
    let clickedBtn = rootContainer.querySelector(
      `.cbt-overlay-option[data-q="${qNum}"][data-opt="${opt}"]`,
    );
    if (clickedBtn) clickedBtn.classList.add("selected");

    // Realtime check
    let rtToggle = this.container.querySelector("#cbt-realtime-toggle");
    if (rtToggle && rtToggle.checked) {
      let correctAns = this.modelAnswers[qNum - 1]
        ? this.modelAnswers[qNum - 1].toUpperCase()
        : null;
      if (correctAns) {
        if (opt === correctAns) {
          clickedBtn.classList.remove("selected");
          clickedBtn.classList.add("correct-ans");
        } else {
          clickedBtn.classList.remove("selected");
          clickedBtn.classList.add("wrong-ans");
          let rightBtn = rootContainer.querySelector(
            `.cbt-overlay-option[data-q="${qNum}"][data-opt="${correctAns}"]`,
          );
          if (rightBtn) {
            rightBtn.classList.remove("selected");
            rightBtn.classList.add("correct-ans");
          }
        }
      }
    }
  }

  evaluateAllRealtime(forceRevealAll = false) {
    let root = this.container.querySelector("#cbt-paper-scroll");
    let total = this.totalQuestionsCount > 0 ? this.totalQuestionsCount : this.modelAnswers.length;
    for (let i = 1; i <= total; i++) {
       let userOpt = this.selectedAnswers[i];
       
       if (userOpt) {
         this.selectAnswer(i, userOpt, root);
       } else if (forceRevealAll) {
         let correctOpt = this.modelAnswers[i - 1] ? this.modelAnswers[i - 1].toUpperCase() : null;
         if (correctOpt) {
           let rightBtn = root.querySelector(`.cbt-overlay-option[data-q="${i}"][data-opt="${correctOpt}"]`);
           if (rightBtn) {
             rightBtn.classList.remove("selected");
             rightBtn.classList.add("correct-ans");
           }
         }
       }
    }
  }

  clearRealtimeFeedback() {
    let allBtns = this.container.querySelectorAll(".cbt-overlay-option");
    allBtns.forEach((b) => b.classList.remove("correct-ans", "wrong-ans"));
    // re-apply selection class to currently selected answers
    Object.keys(this.selectedAnswers).forEach((qNum) => {
      let opt = this.selectedAnswers[qNum];
      let btn = this.container.querySelector(
        `.cbt-overlay-option[data-q="${qNum}"][data-opt="${opt}"]`,
      );
      if (btn) btn.classList.add("selected");
    });
  }

  finishExam() {
    let totalQuestions =
      this.modelAnswers.length > 0
        ? this.modelAnswers.length
        : this.totalQuestionsCount > 0
          ? this.totalQuestionsCount
          : Object.keys(this.selectedAnswers).length || 40;
          
    let answered = Object.keys(this.selectedAnswers).length;
    let missedCount = totalQuestions - answered;

    const doFinish = () => {
      clearInterval(this.timerInterval);

      let correctCount = 0;
      let wrongCount = 0;

      for (let i = 0; i < totalQuestions; i++) {
        let qNum = i + 1;
        let userAns = this.selectedAnswers[qNum];
        let correctAns = this.modelAnswers[i]
          ? this.modelAnswers[i].toUpperCase()
          : null;

        if (correctAns) {
          if (userAns === correctAns) {
            correctCount++;
          } else if (userAns) {
            wrongCount++;
          }
        }
      }

      let scorePercentage =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;
          
      if (scorePercentage === 100) {
        jsConfetti.addConfetti();
      }

      let grade = "U";
      if (scorePercentage >= 90) grade = "A*";
      else if (scorePercentage >= 80) grade = "A";
      else if (scorePercentage >= 70) grade = "B";
      else if (scorePercentage >= 60) grade = "C";
      else if (scorePercentage >= 50) grade = "D";
      else if (scorePercentage >= 40) grade = "E";

      let modal = document.createElement("div");
      modal.className = "cbt-modal-overlay";
      modal.innerHTML = `
                <div class="cbt-modal" style="padding: 0; max-width: 480px; width: 90%; overflow: hidden; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); animation: cbtSlideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                    <style>
                        @keyframes cbtSlideUpFade {
                            from { opacity: 0; transform: translateY(30px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        .cbt-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 8px;}
                        .cbt-stat-label { font-size: 14px; font-weight: 500; color: #cbd5e1; display: flex; align-items: center; gap: 8px;}
                        .cbt-stat-val { font-size: 16px; font-weight: 700;  color: #fff; }
                        .cbt-stat-val.correct { color: #10b981; }
                        .cbt-stat-val.wrong { color: #ef4444; }
                        .cbt-stat-val.skipped { color: #f59e0b; }
                    </style>
                    <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 48px 32px; text-align: center; position: relative;">
                        <!-- Ornamental Background Rings -->
                        <div style="position:absolute; top:-50px; right:-50px; width:150px; height:150px; border-radius:50%; background: #3b82f6; opacity: 0.15; filter: blur(30px);"></div>
                        <div style="position:absolute; bottom:-50px; left:-50px; width:200px; height:200px; border-radius:50%; background: #10b981; opacity: 0.1; filter: blur(40px);"></div>
                        
                        <div style="position:relative; z-index:10;">
                            <h2 style="color: #94a3b8; margin: 0 0 16px 0; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Performance Report</h2>
                            
                            <div style="display:inline-flex; align-items:center; justify-content:center; width:120px; height:120px; border-radius:50%; background: rgba(255,255,255,0.05); border: 2px solid ${scorePercentage >= 50 ? '#10b981' : '#ef4444'}; box-shadow: 0 0 30px ${scorePercentage >= 50 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}; margin-bottom: 24px;">
                                <div style="font-size: 56px; font-weight: 900; color: #fff; line-height: 1;">${grade}</div>
                            </div>
                            
                            <h3 style="color: #fff; margin: 0 0 8px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${scorePercentage >= 80 ? 'Outstanding!' : (scorePercentage >= 60 ? 'Good Job!' : 'Keep Practicing!')}</h3>
                            <div style="font-size: 16px; color: #cbd5e1; font-weight: 400;">You scored <strong style="color:white; font-size: 18px;">${correctCount}</strong> out of <strong style="color:white; font-size: 18px;">${totalQuestions}</strong> correctly</div>
                        </div>
                    </div>
                    
                    <div style="padding: 32px; background: #0f172a; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="display: flex; flex-direction: column;">
                            <div class="cbt-stat-row">
                                <span class="cbt-stat-label">
                                    <div style="width:10px; height:10px; border-radius:50%; background:#10b981;"></div>
                                    Correct Answers
                                </span>
                                <span class="cbt-stat-val correct">${correctCount}</span>
                            </div>
                            <div class="cbt-stat-row">
                                <span class="cbt-stat-label">
                                    <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
                                    Incorrect Answers
                                </span>
                                <span class="cbt-stat-val wrong">${wrongCount}</span>
                            </div>
                            <div class="cbt-stat-row">
                                <span class="cbt-stat-label">
                                    <div style="width:10px; height:10px; border-radius:50%; background:#f59e0b;"></div>
                                    Unanswered
                                </span>
                                <span class="cbt-stat-val skipped">${totalQuestions - correctCount - wrongCount}</span>
                            </div>
                            <div class="cbt-stat-row" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); margin-top: 8px;">
                                <span class="cbt-stat-label" style="color: #60a5fa; font-weight: 600;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="19.1" y2="4.9"></line></svg>
                                    Overall Accuracy
                                </span>
                                <span class="cbt-stat-val" style="color:#60a5fa; font-size: 20px;">${scorePercentage}%</span>
                            </div>
                        </div>

                        <button id="cbt-close-modal" style="margin-top: 32px; background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; cursor: pointer; font-weight: 700; width: 100%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">
                            Review Mistakes <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            `;
      this.container.appendChild(modal);

      modal.querySelector("#cbt-close-modal").onclick = () => {
        modal.remove();
        // Turn on real-time feedback so they can see their mistakes
        let rtToggle = this.container.querySelector("#cbt-realtime-toggle");
        if (rtToggle) {
          rtToggle.checked = true;
        }
        this.evaluateAllRealtime(true);
        // Disable answering (optional) but at least disable submit
        let submitBtn = this.container.querySelector("#cbt-submit");
        if (submitBtn) submitBtn.style.display = "none";
      };
    };

    if (missedCount > 0) {
      let warnModal = document.createElement("div");
      warnModal.className = "cbt-modal-overlay";
      warnModal.innerHTML = `
        <div class="cbt-modal" style="max-width: 400px;">
           <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
           <h2 style="font-size:20px; font-weight:800; color:#0f172a; margin-bottom:12px;">Are you sure?</h2>
           <p style="color:#64748b; margin-bottom:24px; font-size:15px; line-height:1.5;">Seems like there are some questions you missed.<br>Only the solved questions will be graded.</p>
           <div style="display:flex; gap:12px; width:100%;">
              <button id="cbt-cancel-submit" style="flex:1; background:white; color:#64748b; border:2px solid #cbd5e1; padding:12px; border-radius:8px; font-weight:700; cursor:pointer;">Cancel</button>
              <button id="cbt-confirm-submit" style="flex:1; background:#ef4444; color:white; border:none; padding:12px; border-radius:8px; font-weight:700; cursor:pointer;">Confirm</button>
           </div>
        </div>
      `;
      this.container.appendChild(warnModal);

      warnModal.querySelector("#cbt-cancel-submit").onclick = () => {
         warnModal.remove();
      };
      warnModal.querySelector("#cbt-confirm-submit").onclick = () => {
         warnModal.remove();
         doFinish();
      };
    } else {
       // if all answered, just confirm normally? The task says "work exactly like the exam layout submit button"
       doFinish();
    }
  }
}
