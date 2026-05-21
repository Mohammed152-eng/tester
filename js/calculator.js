export class CalculatorUI {
    constructor(parent) {
        this.parent = parent;
        this.expression = "";
        this.container = null;
    }

    toggle() {
        if (this.container) {
            this.container.remove();
            this.container = null;
            return;
        }

        this.container = document.createElement("div");
        this.container.className = "cbt-calculator-wrapper";
        this.container.innerHTML = `
            <div style="background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); width: 320px; padding: 24px; position: fixed; top: 80px; right: 24px; z-index: 1000000; font-family: -apple-system, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span style="font-size: 13px; font-weight: 700; color: #94a3b8; letter-spacing: 1px;">CALCULATOR</span>
                    <button id="calc-close" style="background: transparent; border: 1px solid #e2e8f0; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div style="background: #fdfbf7; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 20px; text-align: right;">
                    <div id="calc-expr" style="font-size: 14px; color: #94a3b8; min-height: 20px; margin-bottom: 4px; word-break: break-all;"></div>
                    <div id="calc-result" style="font-size: 32px; font-weight: 800; color: #0f172a;">0</div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <button class="calc-btn calc-btn-c">C</button>
                    <button class="calc-btn calc-btn-action">⌫</button>
                    <button class="calc-btn calc-btn-action">(</button>
                    <button class="calc-btn calc-btn-action">)</button>
                    
                    <button class="calc-btn">7</button>
                    <button class="calc-btn">8</button>
                    <button class="calc-btn">9</button>
                    <button class="calc-btn calc-btn-action">÷</button>
                    
                    <button class="calc-btn">4</button>
                    <button class="calc-btn">5</button>
                    <button class="calc-btn">6</button>
                    <button class="calc-btn calc-btn-action">×</button>
                    
                    <button class="calc-btn">1</button>
                    <button class="calc-btn">2</button>
                    <button class="calc-btn">3</button>
                    <button class="calc-btn calc-btn-action">-</button>
                    
                    <button class="calc-btn">0</button>
                    <button class="calc-btn">.</button>
                    <button class="calc-btn calc-btn-action">%</button>
                    <button class="calc-btn calc-btn-action">+</button>
                    
                    <button class="calc-btn calc-btn-eq" style="grid-column: 1 / -1;">=</button>
                </div>
                <style>
                    .calc-btn {
                        background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 18px; font-weight: 700; color: #0f172a; cursor: pointer; transition: 0.1s;
                    }
                    .calc-btn:active { transform: scale(0.95); }
                    .calc-btn-action { color: #0f172a; }
                    .calc-btn-c { color: #0f172a; border-color: #bbf7d0; box-shadow: 0 0 0 1px #bbf7d0; }
                    .calc-btn-eq { background: #f0fdf4; border-color: #bbf7d0; color: #4ade80; }
                </style>
            </div>
        `;
        this.parent.appendChild(this.container);

        this.container.querySelector("#calc-close").onclick = () => this.toggle();

        let btns = this.container.querySelectorAll(".calc-btn");
        btns.forEach(btn => {
            btn.onclick = () => this.handleInput(btn.innerText);
        });
    }

    handleInput(val) {
        if (val === "C") {
            this.expression = "";
        } else if (val === "⌫") {
            this.expression = this.expression.slice(0, -1);
        } else if (val === "=") {
            try {
                let evalString = this.expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
                let result = eval(evalString);
                this.expression = String(result);
            } catch (e) {
                this.expression = "Error";
            }
        } else {
            if (this.expression === "Error") this.expression = "";
            this.expression += val;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.container.querySelector("#calc-result").innerText = this.expression || "0";
    }
}
