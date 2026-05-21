import * as pdfjsLib from 'pdfjs-dist';
export { pdfjsLib };
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import 'pdfjs-dist/web/pdf_viewer.css';
import '../css/pdf-viewer.css';
import { CBTSystem } from './cbt-mode.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ICONS = {
  sidebar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`,
  fileOpts: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  hand: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`,
  select: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h6l-3 3 6 6-3 3-6-6 3-3z"/><path d="M14 3h7v7"/><path d="M21 14v7h-7"/><path d="M10 21H3v-7"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  highlight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>`,
  underline: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>`,
  squiggle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22c2-2 4 0 4 0s2-2 4 0 4 0 4 0 2-2 4 0"/><path d="M6 4v6a6 6 0 0 0 12 0V4"/></svg>`,
  strikeout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  text: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  rectangle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`,
  circle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
  arc: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19A10 10 0 0 1 19 5"/></svg>`,
  pentagon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 18.2 22 5.8 22 2 8.5"/></svg>`,
  line: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>`,
  zigzag: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"/></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  ink: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M8 18h1"/><path d="M18.4 9.6a2 2 0 1 1 3 3L17 19l-4 1 1-4Z"/></svg>`,
  marker: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
  undo: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
  redo: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>`,
  rotateCW: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
  eraser: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  pageContinuous: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M5 8h14"/><path d="M5 16h14"/></svg>`,
  pageSingle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"/></svg>`,
  pageDouble: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20h16V2H4zm8 0v20"/></svg>`,
  pageCover: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 2v20"/><rect x="4" y="2" width="8" height="20" fill="currentColor" fill-opacity="0.3"/></svg>`
};

class PDFViewer {
  constructor() {
    this.container = null;
    this.pdfDocument = null;
    this.currentTool = 'none'; // 'none', 'highlight', 'marker', 'eraser', 'rectangle', 'circle'
    this.currentTab = 'view';
    this.drawingColor = 'rgba(255, 255, 0, 0.4)';
    this.strokeColor = '#ff0000';
    this.lineWidth = 2;
    this.isDrawing = false;
    this.annotations = [];
    this.undoStack = [];
    this.redoStack = [];
    this.scale = 1.5;
    this.rotation = 0;
    this.pages = [];
    this.pageMode = 'continuous'; // 'continuous', 'single'
    this.pageLayout = 'single'; // 'single', 'double', 'cover'
    this.currentPage = 1;
    this.currentUrl = null;
    this.isSidebarOpen = false;
  }

  initContainer() {
    if (this.container) this.destroy();
    
    this.container = document.createElement('div');
    this.container.id = 'new-x-pdf-viewer';
    
    this.container.innerHTML = `
      <div class="pdf-header">
        <div class="pdf-header-left">
          <button class="pdf-icon-btn" id="pdf-btn-sidebar" title="Toggle Sidebar">${ICONS.sidebar}</button>
          <button class="pdf-icon-btn" title="Options">${ICONS.fileOpts}</button>
          <div class="pdf-toolbar-divider"></div>
          <div class="pdf-zoom-control">
            <span class="pdf-zoom-text" id="pdf-zoom-text">150%</span>
            <span class="pdf-zoom-arrow">${ICONS.chevronDown}</span>
            <button class="pdf-icon-btn" id="pdf-btn-zoom-out" title="Zoom Out" style="width: 24px; height: 24px; padding: 2px;">${ICONS.minus}</button>
            <button class="pdf-icon-btn" id="pdf-btn-zoom-in" title="Zoom In" style="width: 24px; height: 24px; padding: 2px;">${ICONS.plus}</button>
          </div>
          <div class="pdf-toolbar-divider"></div>
          <button class="pdf-icon-btn active" data-tool="none" title="Pan / Select Text">${ICONS.hand}</button>
          <div class="pdf-toolbar-divider"></div>
          <button class="pdf-icon-btn" data-tool="select" title="Select Tool">${ICONS.select}</button>
        </div>
        <div class="pdf-header-center">
          <div class="pdf-tabs-container">
            <button class="pdf-tab-btn active" data-tab="view">View</button>
            <button class="pdf-tab-btn" data-tab="annotate">Annotate</button>
            <button class="pdf-tab-btn" data-tab="shapes">Shapes</button>
          </div>
        </div>
        <div class="pdf-header-right" style="display:flex; align-items:center;">
          <div style="display:flex; align-items:center; background:var(--bg-base); border:1px solid var(--border-color); border-radius:4px; margin-right: 15px; padding-left:8px;" id="pdf-search-container">
               <input type="text" id="pdf-search-input" placeholder="Search document..." style="background:transparent; border:none; color:white; outline:none; width:150px; font-size:13px; height:28px;">
               <button class="pdf-icon-btn" id="pdf-search-btn" title="Find Next" style="padding:4px; width:28px; height:28px; margin-left:4px;">${ICONS.search}</button>
          </div>
          <button class="pdf-icon-btn" id="pdf-btn-cbt" title="CBT Practice Mode" style="border: 1px solid #3b82f6; border-radius: 4px; padding: 4px 12px; font-size: 13px; color: #3b82f6; font-weight: 600; margin-right: 15px; width: auto; height: 28px;">Practice</button>
          <button class="pdf-icon-btn" id="pdf-btn-settings" title="Options">${ICONS.settings}</button>
          <button class="pdf-icon-btn" style="color: #ff5555;" id="pdf-btn-close" title="Close Viewer">${ICONS.close}</button>
        </div>
      </div>

        <div class="pdf-toolbar-secondary" id="pdf-toolbar-annotate">
        <button class="pdf-icon-btn fill-svg" data-tool="highlight" title="Highlight">${ICONS.highlight}</button>
        <button class="pdf-icon-btn fill-svg" data-tool="text" title="Text Box">${ICONS.text}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="pen" title="Pen">${ICONS.ink}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="marker" title="Marker">${ICONS.marker}</button>
        
        <div class="pdf-toolbar-divider"></div>
        <button class="pdf-preset-btn active" id="pdf-btn-color-annotate" title="Color & Stroke">
          <div class="pdf-preset-icon" style="color: #FFEB3B">${ICONS.circle}</div>
        </button>
        
        <div class="pdf-toolbar-divider"></div>
        <button class="pdf-icon-btn stroke-svg" id="pdf-btn-undo-annot" title="Undo">${ICONS.undo}</button>
        <button class="pdf-icon-btn stroke-svg" id="pdf-btn-redo-annot" title="Redo">${ICONS.redo}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="eraser" title="Eraser">${ICONS.eraser}</button>
      </div>

      <div class="pdf-toolbar-secondary" id="pdf-toolbar-shapes">
        <button class="pdf-icon-btn stroke-svg" data-tool="rectangle" title="Rectangle">${ICONS.rectangle}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="circle" title="Circle">${ICONS.circle}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="squiggle" title="Squiggle">${ICONS.squiggle}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="arc" title="Arc">${ICONS.arc}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="pentagon" title="Pentagon">${ICONS.pentagon}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="line" title="Line">${ICONS.line}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="zigzag" title="Zigzag">${ICONS.zigzag}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="arrow" title="Arrow">${ICONS.arrow}</button>
        
        <div class="pdf-toolbar-divider"></div>
        
        <button class="pdf-preset-btn active" id="pdf-btn-color-shapes" title="Color & Stroke">
          <div class="pdf-preset-icon" style="color: #f44336">${ICONS.circle}</div>
        </button>
        
        <div class="pdf-toolbar-divider"></div>
        <button class="pdf-icon-btn stroke-svg" id="pdf-btn-undo-shapes" title="Undo">${ICONS.undo}</button>
        <button class="pdf-icon-btn stroke-svg" id="pdf-btn-redo-shapes" title="Redo">${ICONS.redo}</button>
        <button class="pdf-icon-btn stroke-svg" data-tool="eraser" title="Eraser">${ICONS.eraser}</button>
      </div>

      <div class="pdf-workspace">
        <div class="pdf-sidebar" id="pdf-sidebar">
          <div class="pdf-sidebar-group">
            <div class="pdf-sidebar-title">Page Transition</div>
            <div class="pdf-sidebar-row" style="flex-direction: column;">
              <div class="pdf-sidebar-btn horizontal active" style="justify-content: flex-start;">${ICONS.pageContinuous} Continuous</div>
              <div class="pdf-sidebar-btn horizontal" style="justify-content: flex-start; border-radius:4px; border-left:none;">${ICONS.pageSingle} Page by Page</div>
            </div>
          </div>
          <div class="pdf-sidebar-group">
            <div class="pdf-sidebar-title">Page Orientation</div>
            <div class="pdf-sidebar-row" style="flex-direction:row;">
              <div class="pdf-sidebar-btn horizontal" style="flex:1">${ICONS.rotateCW} CW</div>
              <div class="pdf-sidebar-btn horizontal" style="flex:1; flex-direction:row-reverse;">${ICONS.rotateCW} CCW</div>
            </div>
          </div>
          <div class="pdf-sidebar-group" style="margin-top: 10px;">
             <div class="pdf-sidebar-title">Page Layout</div>
             <div class="pdf-sidebar-btn horizontal active" style="justify-content:flex-start; border-radius:4px; border-left:none;">${ICONS.pageSingle} Single Page</div>
             <div class="pdf-sidebar-btn horizontal" style="justify-content:flex-start; border-radius:4px; border-left:none;">${ICONS.pageDouble} Double Page</div>
             <div class="pdf-sidebar-btn horizontal" style="justify-content:flex-start; border-radius:4px; border-left:none;">${ICONS.pageCover} Cover Facing Page</div>
          </div>
        </div>
        <div class="pdf-main-area" id="pdf-main-area">
           <div class="pdf-pages-scroll" id="pdf-pages-scroll"></div>
        </div>
      </div>
      
      <!-- Popovers -->
      <div class="pdf-popover" id="pdf-color-popover" style="top: 96px; left: 50%;">
        <div class="pdf-popover-title" style="margin-top:0;">Color</div>
        <div class="pdf-color-grid" id="pdf-colors">
          <div class="pdf-color-swatch active" style="background:#e53935;" data-color="#e53935"></div>
          <div class="pdf-color-swatch" style="background:#fb8c00;" data-color="#fb8c00"></div>
          <div class="pdf-color-swatch" style="background:#fdd835;" data-color="#fdd835"></div>
          <div class="pdf-color-swatch" style="background:#43a047;" data-color="#43a047"></div>
          <div class="pdf-color-swatch" style="background:#1e88e5;" data-color="#1e88e5"></div>
          <div class="pdf-color-swatch" style="background:#8e24aa;" data-color="#8e24aa"></div>
          <div class="pdf-color-swatch" style="background:#3949ab;" data-color="#3949ab"></div>
          <div class="pdf-color-swatch" style="background:#000000;" data-color="#000000"></div>
          <div class="pdf-color-swatch" style="background:#f4511e;" data-color="#f4511e"></div>
          <div class="pdf-color-swatch" style="background:#fbc02d;" data-color="#fbc02d"></div>
          <div class="pdf-color-swatch" style="background:#7cb342;" data-color="#7cb342"></div>
          <div class="pdf-color-swatch" style="background:#00acc1;" data-color="#00acc1"></div>
          <div class="pdf-color-swatch" style="background:#039be5;" data-color="#039be5"></div>
          <div class="pdf-color-swatch" style="background:#5e35b1;" data-color="#5e35b1"></div>
          <div class="pdf-color-swatch" style="background:#546e7a;" data-color="#546e7a"></div>
          <div class="pdf-color-swatch" style="background:#ffffff;" data-color="#ffffff"></div>
        </div>
        <div class="pdf-add-color-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg> Add custom color</div>
        <div class="pdf-popover-title">Thickness</div>
        <div class="pdf-slider-row">
          <input type="range" class="pdf-slider" id="pdf-width-slider" min="1" max="10" value="2">
          <div class="pdf-slider-val" id="pdf-width-val">2 pt</div>
        </div>
        <div class="pdf-popover-title">Opacity</div>
        <div class="pdf-slider-row">
          <input type="range" class="pdf-slider" id="pdf-opacity-slider" min="10" max="100" value="100">
          <div class="pdf-slider-val" id="pdf-opacity-val">100%</div>
        </div>
      </div>

      <div class="pdf-floating-menu" id="pdf-settings-menu" style="top: 48px; right: 16px;">
        <div class="pdf-menu-item" id="pdf-btn-fullscreen">${ICONS.fullscreen} View Full Screen</div>
        <div class="pdf-menu-item" id="pdf-btn-download">${ICONS.download} Download Document</div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.setupListeners();
  }

  setupListeners() {
    const q = (sel) => this.container.querySelector(sel);
    const qa = (sel) => this.container.querySelectorAll(sel);

    q('#pdf-btn-close').onclick = () => this.toggle(this.currentUrl);
    
    q('#pdf-btn-cbt').onclick = () => {
        if (!this.pdfDocument) return;
        const cbt = new CBTSystem();
        cbt.init(this.pdfDocument);
    };
    
    const executeSearch = (backwards = false) => {
        const text = q('#pdf-search-input').value;
        if (!text) return;
        
        // Remove current selection so it finds the next instance properly
        // window.getSelection().removeAllRanges();
        
        const found = window.find(text, false, backwards, true, false, false, false);
        if (!found) {
            // Flash red or indicate not found
            const input = q('#pdf-search-input');
            input.style.color = '#ff5555';
            setTimeout(() => input.style.color = 'white', 500);
        }
    };
    q('#pdf-search-btn').onclick = () => executeSearch(false);
    q('#pdf-search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch(e.shiftKey);
        }
    });

    q('#pdf-btn-sidebar').onclick = () => {
      this.isSidebarOpen = !this.isSidebarOpen;
      q('#pdf-sidebar').classList.toggle('open', this.isSidebarOpen);
      q('#pdf-main-area').classList.toggle('sidebar-open', this.isSidebarOpen);
      q('#pdf-btn-sidebar').classList.toggle('active', this.isSidebarOpen);
    };

    const settingsMenu = q('#pdf-settings-menu');
    q('#pdf-btn-settings').onclick = (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle('visible');
    };
    document.addEventListener('click', () => settingsMenu.classList.remove('visible'));

    q('#pdf-btn-zoom-in').onclick = () => this.zoom(0.2);
    q('#pdf-btn-zoom-out').onclick = () => this.zoom(-0.2);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        this.container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    };
    q('#pdf-btn-fullscreen').onclick = () => {
      toggleFullscreen();
      settingsMenu.classList.remove('visible');
    };

    const doUndo = () => this.undo();
    const doRedo = () => this.redo();
    q('#pdf-btn-undo-annot').onclick = doUndo;
    q('#pdf-btn-redo-annot').onclick = doRedo;
    q('#pdf-btn-undo-shapes').onclick = doUndo;
    q('#pdf-btn-redo-shapes').onclick = doRedo;

    qa('.pdf-sidebar-btn').forEach(btn => {
      btn.onclick = () => {
         const text = btn.innerText;
         if (text.includes('CW') || text.includes('CCW')) {
            this.rotate(text.includes('CCW') ? -90 : 90);
            return;
         }
         
         const group = btn.closest('.pdf-sidebar-group');
         group.querySelectorAll('.pdf-sidebar-btn').forEach(b => b.classList.remove('active'));
         btn.classList.add('active');

         if (text.includes('Continuous')) this.pageMode = 'continuous';
         else if (text.includes('Page by Page')) this.pageMode = 'single';
         
         if (text.includes('Single Page')) this.pageLayout = 'single';
         else if (text.includes('Double Page')) this.pageLayout = 'double';
         else if (text.includes('Cover')) this.pageLayout = 'cover';
         
         if (!text.includes('CW') && !text.includes('CCW')) {
            this.refreshPages();
         }
      };
    });

    q('#pdf-btn-download').onclick = () => {
       if (this.currentUrl) {
          const a = document.createElement('a');
          a.href = this.currentUrl;
          a.download = 'document.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
       }
    };

    qa('.pdf-tab-btn').forEach(btn => {
      btn.onclick = () => {
        qa('.pdf-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        
        qa('.pdf-toolbar-secondary').forEach(tb => tb.classList.remove('active'));
        if (this.currentTab === 'annotate') q('#pdf-toolbar-annotate').classList.add('active');
        if (this.currentTab === 'shapes') q('#pdf-toolbar-shapes').classList.add('active');
        
        this.setTool('none');
      };
    });

    qa('[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        if (['highlight', 'underline', 'strikeout'].includes(tool) && this.applySelectionHighlight(tool)) {
           // We just highlighted text, so no need to activate the tool
           return;
        }
        if (btn.classList.contains('active') && tool !== 'none') {
           this.setTool('none');
        } else {
           this.setTool(tool);
        }
      });
    });

    // Setup color popover
    const popover = q('#pdf-color-popover');
    const updatePopoverPos = (btn) => {
       const rect = btn.getBoundingClientRect();
       popover.style.left = `${rect.left}px`;
       popover.style.top = `${rect.bottom + 8}px`;
    };
    
    const togglePopover = (btn, e) => {
       e.stopPropagation();
       if (popover.classList.contains('visible')) {
          popover.classList.remove('visible');
       } else {
          updatePopoverPos(btn);
          popover.classList.add('visible');
       }
    };
    
    q('#pdf-btn-color-annotate').onclick = (e) => togglePopover(e.currentTarget, e);
    q('#pdf-btn-color-shapes').onclick = (e) => togglePopover(e.currentTarget, e);
    document.addEventListener('click', (e) => {
       if (!popover.contains(e.target)) popover.classList.remove('visible');
    });

    qa('.pdf-color-swatch').forEach(swatch => {
      swatch.onclick = (e) => {
        qa('.pdf-color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.strokeColor = swatch.dataset.color;
        // update indicators
        qa('.pdf-preset-icon').forEach(ind => ind.style.color = this.strokeColor);
      };
    });

    qa('.pdf-preset-quick').forEach(swatch => {
      swatch.onclick = (e) => {
        const color = swatch.style.color;
        this.strokeColor = color;
        // update indicator color in the current active preset group
        const groupBtn = swatch.parentElement.querySelector('.pdf-preset-icon');
        if (groupBtn) groupBtn.style.color = color;
      };
    });

    q('#pdf-width-slider').oninput = (e) => { 
       this.lineWidth = parseInt(e.target.value); 
       q('#pdf-width-val').innerText = `${this.lineWidth} pt`;
    };
    q('#pdf-opacity-slider').oninput = (e) => { 
       q('#pdf-opacity-val').innerText = `${e.target.value}%`;
    };

    this.onKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          // If we are typing in an input, don't trigger hotkeys except for Escape/Ctrl+F possibly?
          // Ctrl+F while focused inside input should probably just prevent browser default and select input
          if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
             e.preventDefault();
             q('#pdf-search-input').focus();
             q('#pdf-search-input').select();
          }
          if (e.key === 'Escape') {
             document.activeElement.blur();
             return;
          }
          return;
      }
      
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        if (this.container && this.container.classList.contains('visible')) {
           e.preventDefault();
           q('#pdf-search-input').focus();
           q('#pdf-search-input').select();
           return;
        }
      }
      
      if (e.key === 'Escape') {
        const smenu = q('#pdf-settings-menu');
        if (smenu.classList.contains('visible')) {
           smenu.classList.remove('visible');
           return;
        }
      }

      if (e.key.toLowerCase() === 'x' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        this.toggle(this.currentUrl);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
         this.deleteSelected();
      
      }
    };
    document.addEventListener('keydown', this.onKeyDown);
    
    this.applySelectionHighlight = (tool = 'highlight') => {
       const sel = window.getSelection();
       if (sel.isCollapsed) return false;
       const range = sel.getRangeAt(0);
       const rects = Array.from(range.getClientRects());
       
       const rectsByPage = new Map();
       
       rects.forEach(rect => {
          let bestPage = null;
          let maxIntersect = 0;
          
          this.pages.forEach(p => {
             const prect = p.annotCanvas.getBoundingClientRect();
             const overlapX = Math.max(0, Math.min(rect.right, prect.right) - Math.max(rect.left, prect.left));
             const overlapY = Math.max(0, Math.min(rect.bottom, prect.bottom) - Math.max(rect.top, prect.top));
             const area = overlapX * overlapY;
             if (area > maxIntersect) {
                maxIntersect = area;
                bestPage = p;
             }
          });
          
          if (bestPage) {
             if (!rectsByPage.has(bestPage)) rectsByPage.set(bestPage, []);
             rectsByPage.get(bestPage).push(rect);
          }
       });
       
       if (rectsByPage.size === 0) return false;
       
       this.saveState();
       
       rectsByPage.forEach((pageRects, p) => {
          const prect = p.annotCanvas.getBoundingClientRect();
          const scaleX = p.annotCanvas.width / prect.width;
          const scaleY = p.annotCanvas.height / prect.height;
          
          pageRects.forEach(r => {
             const cx = ((r.left - prect.left) * scaleX) / this.scale;
             const cy = ((r.top - prect.top) * scaleY) / this.scale;
             const cw = (r.width * scaleX) / this.scale;
             const ch = (r.height * scaleY) / this.scale;
             
             this.annotations[p.pageNumber - 1].strokes.push({
                tool: 'text-annot',
                type: tool,
                rect: {x: cx, y: cy, w: cw, h: ch},
                color: this.strokeColor
             });
          });
          this.redrawAnnotCanvas(p.pageNumber);
       });
       
       this.saveAnnotationsToLocal();
       sel.removeAllRanges();
       return true;
    };
  }

  zoom(delta) {
    let newScale = this.scale + delta;
    if (newScale < 0.5) newScale = 0.5;
    if (newScale > 3.0) newScale = 3.0;
    this.scale = newScale;
    this.container.querySelector('#pdf-zoom-text').innerText = `${Math.round(this.scale * 100)}%`;
    this.refreshPages();
  }

  setTool(tool) {
    this.currentTool = tool;
    this.container.querySelectorAll('[data-tool]').forEach(btn => {
      if (btn.dataset.tool === tool) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    
    this.pages.forEach(p => {
      if (tool === 'none') {
        p.annotCanvas.style.cursor = 'default';
        p.annotCanvas.style.pointerEvents = 'none';
      } else {
        p.annotCanvas.style.cursor = tool === 'eraser' ? 'crosshair' : 'crosshair';
        p.annotCanvas.style.pointerEvents = 'auto';
      }
    });
  }

  toggle(url) {
    if (this.currentUrl !== url && url) {
      this.loadPDF(url);
      return;
    }
    if (!this.container) return;
    if (!this.container.classList.contains('visible')) {
      this.container.classList.add('visible');
    } else {
      this.container.classList.remove('visible');
      document.body.classList.remove('split-screen-active');
      const menu = document.getElementById('menu');
      if (menu) {
          menu.style = '';
      }
    }
  }

  destroy() {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
    this.pdfDocument = null;
    this.pages = [];
    this.annotations = [];
    this.undoStack = [];
    this.redoStack = [];
    this.currentUrl = null;
    document.removeEventListener('keydown', this.onKeyDown);
  }

  saveState() {
    // Save current annotations state for undo
    this.undoStack.push(JSON.stringify(this.annotations));
    this.redoStack = []; // Clear redo stack on new action
    // Keep stack manageable
    if (this.undoStack.length > 50) this.undoStack.shift();
  }

  saveAnnotationsToLocal() {
    if (!this.currentUrl || !this.annotations) return;
    try {
        localStorage.setItem(`pdf_annot_${this.currentUrl}`, JSON.stringify(this.annotations));
    } catch(e) {
        console.error('Failed to save annotations', e);
    }
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.annotations));
    this.annotations = JSON.parse(this.undoStack.pop());
    this.saveAnnotationsToLocal();
    this.refreshAllVisiblePages();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.annotations));
    this.annotations = JSON.parse(this.redoStack.pop());
    this.saveAnnotationsToLocal();
    this.refreshAllVisiblePages();
  }

  refreshAllVisiblePages() {
    // Just redraw all canvases
    for (let i = 1; i <= (this.pdfDocument?.numPages || 0); i++) {
        this.redrawAnnotCanvas(i);
    }
  }

  rotate(deg) {
    this.rotation = (this.rotation + deg) % 360;
    this.container.querySelectorAll('.pdf-page-wrapper').forEach(wrap => {
       wrap.style.transform = `rotate(${this.rotation}deg)`;
    });
  }

  async loadPDF(url) {
    this.currentUrl = url;
    if (!this.container) this.initContainer();
    this.container.classList.add('visible');
    
    const pagesContainer = this.container.querySelector('#pdf-pages-scroll');
    pagesContainer.innerHTML = '<div style="color:white; font-size: 20px; padding: 40px;">Loading PDF...</div>';
    
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      this.pdfDocument = await loadingTask.promise;
      
      const savedAnnotations = localStorage.getItem(`pdf_annot_${url}`);
      if (savedAnnotations) {
          try {
             this.annotations = JSON.parse(savedAnnotations);
          } catch(e) {
             this.annotations = Array(this.pdfDocument.numPages).fill(null).map(() => ({ strokes: [] }));
          }
      } else {
          this.annotations = Array(this.pdfDocument.numPages).fill(null).map(() => ({ strokes: [] }));
      }
      
      await this.refreshPages();
    } catch (error) {
      pagesContainer.innerHTML = `<div style="color:#ff5555; font-size: 18px; padding: 40px;">Failed to load PDF: ${error.message}</div>`;
    }
  }

  async refreshPages() {
    if (!this.pdfDocument) return;
    const pagesContainer = this.container.querySelector('#pdf-pages-scroll');
    pagesContainer.innerHTML = '';
    
    const existingPagination = this.container.querySelector('.pdf-pagination');
    if (existingPagination) existingPagination.remove();

    // Add pagination controls if page-by-page
    if (this.pageMode === 'single') {
       const pagination = document.createElement('div');
       pagination.className = 'pdf-pagination';
       pagination.innerHTML = `
         <button id="pdf-btn-prev" class="pdf-icon-btn" style="background:#f1f3f4; border:1px solid #ddd; width:auto; padding:0 12px; font-size:14px; font-weight:500; ${this.currentPage <= 1 ? 'opacity:0.5; pointer-events:none;': ''}">Prev</button>
         <span style="font-size:14px; font-weight:500; margin: 0 16px;">Page ${this.currentPage} of ${this.pdfDocument.numPages}</span>
         <button id="pdf-btn-next" class="pdf-icon-btn" style="background:#f1f3f4; border:1px solid #ddd; width:auto; padding:0 12px; font-size:14px; font-weight:500; ${this.currentPage >= this.pdfDocument.numPages ? 'opacity:0.5; pointer-events:none;': ''}">Next</button>
       `;
       pagination.style.display = 'flex';
       pagination.style.alignItems = 'center';
       pagination.style.justifyContent = 'center';
       pagination.style.padding = '8px';
       pagination.style.position = 'absolute';
       pagination.style.bottom = '20px';
       pagination.style.left = '50%';
       pagination.style.transform = 'translateX(-50%)';
       pagination.style.background = '#fff';
       pagination.style.borderRadius = '24px';
       pagination.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
       pagination.style.zIndex = '50';
       
       this.container.querySelector('#pdf-main-area').appendChild(pagination);
       
       pagination.querySelector('#pdf-btn-prev').onclick = () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.refreshPages();
          }
       };
       pagination.querySelector('#pdf-btn-next').onclick = () => {
          if (this.currentPage < this.pdfDocument.numPages) {
            this.currentPage++;
            this.refreshPages();
          }
       };
    }
    
    this.pages = [];
    
    let start = 1;
    let end = Math.min(this.pdfDocument.numPages, 100);
    
    if (this.pageMode === 'single') {
       start = this.currentPage;
       end = this.currentPage;
       if (this.pageLayout === 'double') {
           // Ensure start is odd and end is even
           if (start % 2 === 0) start--;
           end = Math.min(start + 1, this.pdfDocument.numPages);
       } else if (this.pageLayout === 'cover') {
           if (start === 1) {
              end = 1;
           } else {
              if (start % 2 !== 0) start--; // even is on left
              end = Math.min(start + 1, this.pdfDocument.numPages);
           }
       }
    }
    
    // For mapping pages to rows
    let currentRow = null;
    let pageCountGroup = 0;
    
    for (let i = start; i <= end; i++) {
       // Group into row containers if continuous + double/cover
       if (this.pageLayout === 'single') {
           await this.renderPage(i, pagesContainer);
       } else {
           // Double or Cover
           let startNewRow = false;
           if (i === start || !currentRow) startNewRow = true;
           else if (this.pageLayout === 'cover' && i === 2) startNewRow = true;
           else if (this.pageLayout === 'cover' && i > 2 && i % 2 === 0) startNewRow = true;
           else if (this.pageLayout === 'double' && i % 2 !== 0) startNewRow = true;

           if (startNewRow) {
               currentRow = document.createElement('div');
               currentRow.className = `pdf-pages-layout-row ${this.pageLayout}`;
               currentRow.style.display = 'flex';
               currentRow.style.flexDirection = 'row';
               currentRow.style.justifyContent = 'center';
               currentRow.style.gap = '20px';
               currentRow.style.marginBottom = '20px';
               pagesContainer.appendChild(currentRow);
           }
           await this.renderPage(i, currentRow);
       }
    }
    
    this.setTool(this.currentTool); // reapply tools
  }

  async renderPage(pageNumber, containerOverride) {
    const page = await this.pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: this.scale });
    
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'pdf-page-wrapper';
    pageWrapper.style.width = `${viewport.width}px`;
    pageWrapper.style.height = `${viewport.height}px`;
    pageWrapper.style.transform = `rotate(${this.rotation}deg)`;
    pageWrapper.style.transition = 'transform 0.3s';
    pageWrapper.style.position = 'relative'; // Required for textLayer positioning
    
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    pdfCanvas.style.display = 'block';
    pdfCanvas.style.width = '100%';
    pdfCanvas.style.height = '100%';
    pageWrapper.appendChild(pdfCanvas);
    
    const ctx = pdfCanvas.getContext('2d');
    const renderTask = page.render({ canvasContext: ctx, viewport: viewport });
    await renderTask.promise;
    
    // Create text layer
    const textLayerDiv = document.createElement('div');
    textLayerDiv.className = 'textLayer';
    textLayerDiv.style.position = 'absolute';
    textLayerDiv.style.left = '0';
    textLayerDiv.style.top = '0';
    textLayerDiv.style.right = '0';
    textLayerDiv.style.bottom = '0';
    textLayerDiv.style.overflow = 'hidden';
    textLayerDiv.style.setProperty('--scale-factor', viewport.scale);
    textLayerDiv.style.setProperty('--total-scale-factor', viewport.scale);
    // Let textLayer be under drawing canvas but over background canvas
    pageWrapper.appendChild(textLayerDiv);
    
    try {
      const textContent = await page.getTextContent();
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport: viewport
      });
      await textLayer.render();
    } catch (err) {
      console.warn("Could not render text layer", err);
    }
    
    const annotCanvas = document.createElement('canvas');
    annotCanvas.width = viewport.width;
    annotCanvas.height = viewport.height;
    annotCanvas.style.position = 'absolute';
    annotCanvas.style.top = '0';
    annotCanvas.style.left = '0';
    annotCanvas.style.pointerEvents = 'none'; // so we can select text beneath it when drawing is false
    annotCanvas.style.mixBlendMode = 'multiply';
    pageWrapper.appendChild(annotCanvas);
    
    if (containerOverride) {
      containerOverride.appendChild(pageWrapper);
    } else {
      this.container.querySelector('#pdf-pages-scroll').appendChild(pageWrapper);
    }
    
    const pageData = { pageNumber, pdfCanvas, annotCanvas, textLayerDiv, ctx: annotCanvas.getContext('2d') };
    this.pages.push(pageData);
    this.setupDrawing(pageData);
    this.redrawAnnotCanvas(pageNumber);
  }

  setupDrawing(pageData) {
    const { annotCanvas, pageNumber } = pageData;
    let isDrawing = false;
    let currentStroke = null;
    let isDraggingSelection = false;
    let selectionBoxStart = null;
    let selectionBoxCurrent = null;
    let isDraggingObjects = false;
    let dragStartPos = null;
    let startClickPos = null;
    let hasMovedSinceClick = false;
    
    const getPos = (e) => {
      const rect = annotCanvas.getBoundingClientRect();
      const scaleX = annotCanvas.width / rect.width;
      const scaleY = annotCanvas.height / rect.height;
      return {
        x: ((e.clientX - rect.left) * scaleX) / this.scale,
        y: ((e.clientY - rect.top) * scaleY) / this.scale
      };
    };

    const getStrokeBounds = (stroke) => {
       if (stroke.tool === 'text-annot') {
          return { x1: stroke.rect.x, y1: stroke.rect.y, x2: stroke.rect.x + stroke.rect.w, y2: stroke.rect.y + stroke.rect.h };
       }
       if (stroke.tool === 'text') {
           const approxW = stroke.text.length * (stroke.fontSize || 16) * 0.6;
           const approxH = (stroke.fontSize || 16) * 1.2;
           // The top-left of text is points[0]
           return {
               x1: stroke.points[0].x, y1: stroke.points[0].y,
               x2: stroke.points[0].x + approxW, y2: stroke.points[0].y + approxH
           };
       }
       let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
       stroke.points.forEach(pt => {
           if (pt.x < minX) minX = pt.x;
           if (pt.x > maxX) maxX = pt.x;
           if (pt.y < minY) minY = pt.y;
           if (pt.y > maxY) maxY = pt.y;
       });
       
       if (stroke.tool === 'circle') {
          const r = Math.sqrt(Math.pow(stroke.points[1].x-stroke.points[0].x, 2) + Math.pow(stroke.points[1].y-stroke.points[0].y, 2));
          return { x1: stroke.points[0].x - r, y1: stroke.points[0].y - r, x2: stroke.points[0].x + r, y2: stroke.points[0].y + r };
       }
       
       const pad = stroke.width ? stroke.width / 2 : 0;
       return { x1: minX - pad, y1: minY - pad, x2: maxX + pad, y2: maxY + pad };
    };

    const isPointInBounds = (pos, bounds, padding = 0) => {
        return pos.x >= bounds.x1 - padding && pos.x <= bounds.x2 + padding &&
               pos.y >= bounds.y1 - padding && pos.y <= bounds.y2 + padding;
    };

    // Helper: Hit testing
    const isPointInStroke = (pos, stroke) => {
       const bounds = getStrokeBounds(stroke);
       const hitRadius = Math.max((stroke.width || 2) / 2, 6); // More forgiving hit radius
       
       if (stroke.tool === 'text' || stroke.tool === 'text-annot') {
           return isPointInBounds(pos, bounds);
       }
       
       if (!isPointInBounds(pos, bounds, hitRadius)) return false;
       
       if (stroke.tool === 'rectangle') {
           // check if near border
           const bX1 = bounds.x1, bY1 = bounds.y1, bX2 = bounds.x2, bY2 = bounds.y2;
           // check 4 lines
           const lines = [
               {a: {x: bX1, y: bY1}, b: {x: bX2, y: bY1}},
               {a: {x: bX2, y: bY1}, b: {x: bX2, y: bY2}},
               {a: {x: bX2, y: bY2}, b: {x: bX1, y: bY2}},
               {a: {x: bX1, y: bY2}, b: {x: bX1, y: bY1}}
           ];
           for (let l of lines) {
               if (this.distToSegmentSquared(pos, l.a, l.b) <= hitRadius * hitRadius) return true;
           }
           return false;
       }
       
       if (stroke.tool === 'circle') {
            const p1 = stroke.points[0], p2 = stroke.points[1];
            const r = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            const dist = Math.sqrt(Math.pow(pos.x - p1.x, 2) + Math.pow(pos.y - p1.y, 2));
            return Math.abs(dist - r) <= hitRadius;
       }
       
       if (!stroke.points || stroke.points.length === 0) return false;
       if (stroke.points.length === 1) {
           const dx = stroke.points[0].x - pos.x, dy = stroke.points[0].y - pos.y;
           return (dx*dx + dy*dy) <= hitRadius * hitRadius;
       }
       
       for (let i = 0; i < stroke.points.length - 1; i++) {
           if (this.distToSegmentSquared(pos, stroke.points[i], stroke.points[i+1]) <= hitRadius * hitRadius) return true;
       }
       return false;
    };

    const isStrokeInBox = (stroke, box) => {
       const bx1 = Math.min(box.start.x, box.current.x);
       const by1 = Math.min(box.start.y, box.current.y);
       const bx2 = Math.max(box.start.x, box.current.x);
       const by2 = Math.max(box.start.y, box.current.y);
       
       const bounds = getStrokeBounds(stroke);
       
       // Instead of checking if they just intersect, let's require at least 50% intersection or full containment.
       const cx = (bounds.x1 + bounds.x2) / 2;
       const cy = (bounds.y1 + bounds.y2) / 2;
       
       const centerInBox = cx >= bx1 && cx <= bx2 && cy >= by1 && cy <= by2;
       const boxIsVeryLarge = (bx2 - bx1) > 20 && (by2 - by1) > 20;
       
       // Standard overlap check, but requires box to be somewhat intentional if we do simple intersect.
       const intersects = !(bounds.x1 > bx2 || bounds.x2 < bx1 || bounds.y1 > by2 || bounds.y2 < by1);
       const enclosed = bounds.x1 >= bx1 && bounds.x2 <= bx2 && bounds.y1 >= by1 && bounds.y2 <= by2;

       return enclosed || (intersects && (centerInBox || boxIsVeryLarge));
    };

    const startOp = (e) => {
      if (!this.currentTool || this.currentTool === 'none') return;
      const pos = getPos(e);
      startClickPos = pos;
      hasMovedSinceClick = false;
      
      if (this.currentTool === 'select') {
          const strokes = this.annotations[pageNumber - 1].strokes;
          let hitStrokes = [];
          for (let i = strokes.length - 1; i >= 0; i--) {
             if (isPointInStroke(pos, strokes[i])) {
                 hitStrokes.push(strokes[i]);
                 break; // Prioritize the top-most visible object under the cursor
             }
          }
          
          if (hitStrokes.length > 0) {
             const topHit = hitStrokes[0];
             
             if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                 if (!topHit.selected) {
                     strokes.forEach(s => s.selected = false);
                     topHit.selected = true;
                 }
             } else {
                 topHit.selected = !topHit.selected;
             }
             
             isDraggingObjects = strokes.some(s => s.selected);
             if (isDraggingObjects) {
                 dragStartPos = pos;
             }
             this.redrawAnnotCanvas(pageNumber);
          } else {
             if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                 let changed = false;
                 strokes.forEach(s => { if(s.selected) changed = true; s.selected = false; });
                 if (changed) this.redrawAnnotCanvas(pageNumber);
             }
             selectionBoxStart = pos;
             selectionBoxCurrent = pos;
          }
          return;
      }
      
      this.pages.forEach(p => p.annotCanvas.querySelectorAll(".pdf-select-box").forEach(el => el.remove()));
      this.annotations[pageNumber - 1].strokes.forEach(s => s.selected = false);
      this.redrawAnnotCanvas(pageNumber);
      
      isDrawing = true;
      let startPos = pos;
      
      if (this.currentTool === 'eraser') {
        this.saveState();
        this.erase(pageNumber, startPos);
        return;
      }

      if (this.currentTool === 'text') {
        isDrawing = false;
        
        const wrapper = annotCanvas.parentElement;
        const input = document.createElement('textarea');
        input.style.position = 'absolute';
        input.style.left = startPos.x + 'px';
        input.style.top = (startPos.y - 10) + 'px';
        input.style.color = this.strokeColor;
        input.style.fontSize = (16 * this.scale) + 'px';
        input.style.fontFamily = 'Arial, sans-serif';
        input.style.background = 'transparent';
        input.style.border = '1px dashed #666';
        input.style.outline = 'none';
        input.style.resize = 'both';
        input.style.minWidth = '50px';
        input.style.minHeight = '30px';
        input.style.zIndex = '100';
        input.style.lineHeight = '1.2';
        
        wrapper.appendChild(input);
        setTimeout(() => input.focus(), 10);
        
        let saved = false;
        const saveText = () => {
           if (saved) return;
           saved = true;
           const txt = input.value.trim();
           if (txt) {
              this.saveState();
              this.annotations[pageNumber - 1].strokes.push({
                 tool: 'text',
                 points: [startPos],
                 text: txt,
                 color: this.strokeColor,
                 fontSize: 16
              });
              this.redrawAnnotCanvas(pageNumber);
              this.saveAnnotationsToLocal();
           }
           input.remove();
        };
        input.addEventListener('blur', saveText);
        return;
      }

      this.saveState();
      currentStroke = {
        tool: this.currentTool,
        points: [startPos],
        color: this.strokeColor,
        width: this.lineWidth / this.scale,
        selected: false
      };

      if (this.currentTool === 'highlight' || this.currentTool === 'marker') {
        currentStroke.width = Math.max(16 / this.scale, 12);
      }
      
      this.annotations[pageNumber - 1].strokes.push(currentStroke);
      this.redrawAnnotCanvas(pageNumber);
    };

    const doOp = (e) => {
      // Prevent ghost dragging if mouse button was released outside window
      if (e.type.includes('mouse') && e.buttons !== 1) {
          stopOp(e);
          return;
      }
      const pos = getPos(e);
      
      // Prevent slight movements from triggering dragging immediately
      if (startClickPos) {
          const dx0 = pos.x - startClickPos.x;
          const dy0 = pos.y - startClickPos.y;
          // Threshold set to >8 for dragging intent, reducing accidental tiny box selections
          if (Math.abs(dx0) > 8 || Math.abs(dy0) > 8) hasMovedSinceClick = true;
      }
      
      if (!hasMovedSinceClick) return; // ignore tiny jitters

      if (isDraggingObjects) {
          const dx = pos.x - dragStartPos.x;
          const dy = pos.y - dragStartPos.y;
          
          this.annotations[pageNumber - 1].strokes.forEach(s => {
              if (s.selected) {
                  if (s.tool === 'text-annot') {
                      s.rect.x += dx;
                      s.rect.y += dy;
                  } else {
                      s.points.forEach(pt => {
                          pt.x += dx;
                          pt.y += dy;
                      });
                  }
              }
          });
          dragStartPos = pos;
          this.redrawAnnotCanvas(pageNumber);
          return;
      }
      
      if (selectionBoxStart !== null) {
          isDraggingSelection = true;
          selectionBoxCurrent = pos;
          const strokes = this.annotations[pageNumber - 1].strokes;
          strokes.forEach(s => {
             // Combine with previously selected if Shift is held
             const inBox = isStrokeInBox(s, {start: selectionBoxStart, current: selectionBoxCurrent});
             if (e.shiftKey || e.ctrlKey || e.metaKey) {
                 // For shift-selection, we only ADD, don't remove existing selection? 
                 // Actually this usually toggles, but simpler to just add what's in box
                 if (inBox) s.selected = true;
             } else {
                 s.selected = inBox;
             }
          });
          this.redrawAnnotCanvas(pageNumber);
          this.drawSelectionBox(pageData, selectionBoxStart, selectionBoxCurrent);
          return;
      }
      
      if (!isDrawing) return;
      
      if (this.currentTool === 'eraser') {
        this.erase(pageNumber, pos);
      } else if (currentStroke) {
        const shapeTools = ['rectangle', 'circle', 'arc', 'pentagon', 'line', 'arrow', 'underline', 'strikeout'];
        if (shapeTools.includes(this.currentTool)) {
           currentStroke.points[1] = pos;
        } else {
           currentStroke.points.push(pos);
        }
        this.redrawAnnotCanvas(pageNumber);
      }
    };

    const stopOp = (e) => {
      if (startClickPos && !hasMovedSinceClick && this.currentTool === 'select' && e) {
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
             const strokes = this.annotations[pageNumber - 1].strokes;
             let hitStrokes = [];
             for (let i = strokes.length - 1; i >= 0; i--) {
                if (isPointInStroke(startClickPos, strokes[i])) {
                    hitStrokes.push(strokes[i]);
                    break; // Just grab top one to avoid accidental multi-selection
                }
             }
             if (hitStrokes.length > 0) {
                 const topHit = hitStrokes[0];
                 strokes.forEach(s => s.selected = false);
                 topHit.selected = true;
                 this.redrawAnnotCanvas(pageNumber);
             } else {
                 strokes.forEach(s => s.selected = false);
                 this.redrawAnnotCanvas(pageNumber);
             }
          }
      }
      startClickPos = null;
      if (isDraggingObjects) {
          isDraggingObjects = false;
          dragStartPos = null;
          if (hasMovedSinceClick) this.saveAnnotationsToLocal();
      }
      if (isDraggingSelection || selectionBoxStart !== null) {
          isDraggingSelection = false;
          selectionBoxStart = null;
          this.clearSelectionBox(pageData);
      }
      if (isDrawing || currentStroke) {
          isDrawing = false;
          currentStroke = null;
          if (hasMovedSinceClick) this.saveAnnotationsToLocal();
      }
    };

    annotCanvas.addEventListener('mousedown', startOp);
    annotCanvas.addEventListener('mousemove', doOp);
    annotCanvas.addEventListener('mouseup', stopOp);
    annotCanvas.addEventListener('mouseout', stopOp);
  }
  drawSelectionBox(pageData, startPoint, currentPoint) {
      const { annotCanvas } = pageData;
      let box = annotCanvas.parentElement.querySelector('.pdf-selection-drag-box');
      if (!box) {
          box = document.createElement('div');
          box.className = 'pdf-selection-drag-box';
          box.style.position = 'absolute';
          box.style.border = '1px solid #1e88e5';
          box.style.backgroundColor = 'rgba(30, 136, 229, 0.1)';
          box.style.pointerEvents = 'none';
          box.style.zIndex = '50';
          annotCanvas.parentElement.appendChild(box);
      }
      
      const rect = annotCanvas.getBoundingClientRect();
      const scaleX = rect.width / annotCanvas.width;
      const scaleY = rect.height / annotCanvas.height;
      
      const x1 = Math.min(startPoint.x, currentPoint.x) * this.scale * scaleX;
      const y1 = Math.min(startPoint.y, currentPoint.y) * this.scale * scaleY;
      const x2 = Math.max(startPoint.x, currentPoint.x) * this.scale * scaleX;
      const y2 = Math.max(startPoint.y, currentPoint.y) * this.scale * scaleY;
      
      box.style.left = x1 + 'px';
      box.style.top = y1 + 'px';
      box.style.width = (x2 - x1) + 'px';
      box.style.height = (y2 - y1) + 'px';
  }
  
  clearSelectionBox(pageData) {
      const box = pageData.annotCanvas.parentElement.querySelector('.pdf-selection-drag-box');
      if (box) box.remove();
  }

  deleteSelected() {
      if (!this.annotations) return;
      let changed = false;
      this.annotations.forEach((annot, idx) => {
          const initLen = annot.strokes.length;
          annot.strokes = annot.strokes.filter(s => !s.selected);
          if (annot.strokes.length !== initLen) {
              changed = true;
              this.redrawAnnotCanvas(idx + 1);
          }
      });
      if (changed) this.saveAnnotationsToLocal();
  }
  
  distToSegmentSquared(p, a, b) {
      const lineLenSq = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
      if (lineLenSq === 0) return Math.pow(p.x - a.x, 2) + Math.pow(p.y - a.y, 2);
      let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / lineLenSq;
      t = Math.max(0, Math.min(1, t));
      const projX = a.x + t * (b.x - a.x);
      const projY = a.y + t * (b.y - a.y);
      return Math.pow(p.x - projX, 2) + Math.pow(p.y - projY, 2);
  }

  erase(pageNumber, pos) {
    const strokes = this.annotations[pageNumber - 1].strokes;
    const eraserRadius = 15 / this.scale;
    const initialCount = strokes.length;
    this.annotations[pageNumber - 1].strokes = strokes.filter(stroke => {
      if (stroke.tool === 'text-annot') {
          // Check collision with bounding box
          const r = stroke.rect;
          const left = r.x - eraserRadius;
          const right = r.x + r.w + eraserRadius;
          const top = r.y - eraserRadius;
          const bottom = r.y + r.h + eraserRadius;
          return !(pos.x >= left && pos.x <= right && pos.y >= top && pos.y <= bottom);
      }
      
      if (!stroke.points || stroke.points.length === 0) return true;
      if (stroke.points.length === 1) {
          const dx = stroke.points[0].x - pos.x;
          const dy = stroke.points[0].y - pos.y;
          return (dx * dx + dy * dy) >= (eraserRadius * eraserRadius);
      }
      
      for (let i = 0; i < stroke.points.length - 1; i++) {
          if (this.distToSegmentSquared(pos, stroke.points[i], stroke.points[i+1]) < (eraserRadius * eraserRadius)) {
              return false; // Erase it
          }
      }
      return true;
    });
    if (this.annotations[pageNumber - 1].strokes.length !== initialCount) {
      this.redrawAnnotCanvas(pageNumber);
      this.saveAnnotationsToLocal();
    }
  }

  redrawAnnotCanvas(pageNumber) {
    const pageData = this.pages.find(p => p.pageNumber === pageNumber);
    if (!pageData) return;
    
    const { annotCanvas, ctx } = pageData;
    ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
    
    ctx.save();
    ctx.scale(this.scale, this.scale);
    
    const strokes = this.annotations[pageNumber - 1].strokes;
    strokes.forEach(stroke => {
      if (stroke.tool === 'text-annot') {
          ctx.beginPath();
          if (stroke.type === 'highlight') {
              ctx.globalCompositeOperation = 'source-over';
              // 40% opacity highlight
              let color = stroke.color;
              if (color.startsWith('#') && color.length === 7) color += '80'; // 50% opacity
              ctx.fillStyle = color;
              ctx.rect(stroke.rect.x, Math.max(0, stroke.rect.y - 2), stroke.rect.w, stroke.rect.h + 4);
              ctx.fill();
          } else if (stroke.type === 'underline') {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = stroke.color;
              ctx.lineWidth = 1;
              ctx.moveTo(stroke.rect.x, stroke.rect.y + stroke.rect.h);
              ctx.lineTo(stroke.rect.x + stroke.rect.w, stroke.rect.y + stroke.rect.h);
              ctx.stroke();
          } else if (stroke.type === 'strikeout') {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = stroke.color;
              ctx.lineWidth = 1;
              ctx.moveTo(stroke.rect.x, stroke.rect.y + stroke.rect.h / 2);
              ctx.lineTo(stroke.rect.x + stroke.rect.w, stroke.rect.y + stroke.rect.h / 2);
              ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over'; // reset
          return;
      }
      
      if (!stroke.points || stroke.points.length === 0) return;

      if (stroke.tool === 'text') {
         ctx.font = `${stroke.fontSize || 16}px Arial, sans-serif`;
         ctx.textBaseline = 'top';
         ctx.fillStyle = stroke.color;
         const lines = stroke.text.split('\n');
         let ty = stroke.points[0].y - (10 / this.scale);
         lines.forEach(line => {
             ctx.fillText(line, stroke.points[0].x, ty);
             ty += (stroke.fontSize || 16) * 1.2;
         });
         ctx.globalCompositeOperation = 'source-over'; // reset
         return;
      }
      
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color; // for shapes that need fill like arrowheads
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (stroke.tool === 'highlight' || stroke.tool === 'marker') {
        ctx.globalCompositeOperation = 'source-over';
        // Add transparency to the color
        if (stroke.color.startsWith('#') && stroke.color.length === 7) {
           ctx.strokeStyle = stroke.color + '66'; // 40% opacity
           ctx.fillStyle = stroke.color + '66';
        }
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      const drawFreehand = () => {
         ctx.beginPath();
         ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
         for (let i = 1; i < stroke.points.length; i++) {
           ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
         }
         ctx.stroke();
      };

      if (stroke.points.length < 2) {
         drawFreehand();
         ctx.globalCompositeOperation = 'source-over'; // reset
         return;
      }

      const p1 = stroke.points[0];
      const p2 = stroke.points[1];

      if (stroke.tool === 'rectangle') {
         ctx.beginPath();
         ctx.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
         ctx.stroke();
      } else if (stroke.tool === 'circle') {
         ctx.beginPath();
         const radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
         ctx.arc(p1.x, p1.y, radius, 0, 2 * Math.PI);
         ctx.stroke();
      } else if (stroke.tool === 'line' || stroke.tool === 'strikeout' || stroke.tool === 'underline') {
         ctx.beginPath();
         ctx.moveTo(p1.x, p1.y);
         ctx.lineTo(p2.x, p2.y);
         ctx.stroke();
      } else if (stroke.tool === 'arrow') {
         ctx.beginPath();
         ctx.moveTo(p1.x, p1.y);
         ctx.lineTo(p2.x, p2.y);
         ctx.stroke();
         // Arrowhead
         const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
         const headlen = 10 + stroke.width;
         ctx.beginPath();
         ctx.moveTo(p2.x, p2.y);
         ctx.lineTo(p2.x - headlen * Math.cos(angle - Math.PI / 6), p2.y - headlen * Math.sin(angle - Math.PI / 6));
         ctx.lineTo(p2.x - headlen * Math.cos(angle + Math.PI / 6), p2.y - headlen * Math.sin(angle + Math.PI / 6));
         ctx.lineTo(p2.x, p2.y);
         ctx.fill();
      } else if (stroke.tool === 'arc') {
         ctx.beginPath();
         const radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
         const startAngle = Math.atan2(p1.y - p2.y, p1.x - p2.x);
         ctx.arc(p1.x, p1.y, radius, startAngle, startAngle + Math.PI);
         ctx.stroke();
      } else if (stroke.tool === 'pentagon') {
         ctx.beginPath();
         const radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
         for (let i = 0; i < 5; i++) {
           const angle = -Math.PI / 2 + (i * 2 * Math.PI / 5);
           const x = p1.x + radius * Math.cos(angle);
           const y = p1.y + radius * Math.sin(angle);
           if (i === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
         }
         ctx.closePath();
         ctx.stroke();
      } else if (stroke.tool === 'zigzag') {
         // Zigzag freehand with larger straight segments
         ctx.beginPath();
         ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
         let lastPoint = stroke.points[0];
         for (let i = 1; i < stroke.points.length; i++) {
           const pt = stroke.points[i];
           const dist = Math.sqrt(Math.pow(pt.x - lastPoint.x, 2) + Math.pow(pt.y - lastPoint.y, 2));
           if (dist > 10) {
             ctx.lineTo(pt.x, pt.y);
             lastPoint = pt;
           }
         }
         ctx.stroke();
      } else {
         // Freehand fallback
         drawFreehand();
      }
      
      ctx.globalCompositeOperation = 'source-over'; // reset
    });
    
    
      // Draw selection rectangles around selected strokes
      ctx.globalCompositeOperation = 'source-over';
      strokes.forEach(stroke => {
          if (!stroke.selected) return;
          
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          
          if (stroke.tool === 'text-annot') {
              minX = stroke.rect.x; minY = stroke.rect.y;
              maxX = stroke.rect.x + stroke.rect.w;
              maxY = stroke.rect.y + stroke.rect.h;
          } else if (stroke.tool === 'text') {
              minX = stroke.points[0].x; minY = stroke.points[0].y;
              maxX = stroke.points[0].x + stroke.text.length * (stroke.fontSize || 16) * 0.6;
              maxY = stroke.points[0].y + (stroke.fontSize || 16) * 1.2;
          } else if (stroke.tool === 'circle') {
              const r = Math.sqrt(Math.pow(stroke.points[1].x-stroke.points[0].x, 2) + Math.pow(stroke.points[1].y-stroke.points[0].y, 2));
              minX = stroke.points[0].x - r; minY = stroke.points[0].y - r;
              maxX = stroke.points[0].x + r; maxY = stroke.points[0].y + r;
          } else {
              stroke.points.forEach(pt => {
                 if (pt.x < minX) minX = pt.x;
                 if (pt.x > maxX) maxX = pt.x;
                 if (pt.y < minY) minY = pt.y;
                 if (pt.y > maxY) maxY = pt.y;
              });
          }
          
          const pad = 4;
          ctx.strokeStyle = '#1e88e5';
          ctx.lineWidth = 1 / this.scale;
          ctx.setLineDash([5 / this.scale, 5 / this.scale]);
          ctx.strokeRect(minX - pad, minY - pad, maxX - minX + pad*2, maxY - minY + pad*2);
          ctx.setLineDash([]);
      });
    ctx.restore();
  }
}

const globalPDFSystem = new PDFViewer();
window.globalPDFSystem = globalPDFSystem;
export { globalPDFSystem };
