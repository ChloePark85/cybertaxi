export class ShopUI {
  private container: HTMLDivElement;
  private onStartGame: () => void;

  constructor(onStartGame: () => void) {
    this.container = document.createElement("div");
    this.onStartGame = onStartGame;
    this.showWelcomeScreen();
  }

  private showWelcomeScreen() {
    this.container.style.position = "fixed";
    this.container.style.top = "50%";
    this.container.style.left = "50%";
    this.container.style.transform = "translate(-50%, -50%)";
    this.container.style.padding = "40px";
    this.container.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    this.container.style.borderRadius = "15px";
    this.container.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.zIndex = "1000";
    this.container.style.fontFamily = "'Press Start 2P', system-ui, sans-serif";

    // Safari를 위한 backdrop-filter 적용
    this.container.style.backdropFilter = "blur(5px)";
    (this.container.style as any)["-webkit-backdrop-filter"] = "blur(5px)";

    const content = `
      <h1 style="color: #4CAF50; margin-bottom: 40px; font-size: 32px; text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);">CYBER TAXI</h1>
      <p style="color: white; margin-bottom: 20px;">Choose your taxi to start driving</p>
      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <button id="free-taxi-btn" style="padding: 20px; background: #4CAF50; border: none; color: white; border-radius: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🚖 BASIC TAXI<br>FREE
        </button>
        <button onclick="window.location.href='https://buy.stripe.com/test_YYYY'" style="padding: 20px; background: #2196F3; border: none; color: white; border-radius: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(33, 150, 243, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🏎️ PREMIUM TAXI<br>$9.99
        </button>
      </div>
      <p style="color: #888; font-size: 12px; text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);">Premium taxi runs 2x faster!</p>
    `;

    this.container.innerHTML = content;
    document.body.appendChild(this.container);

    // 직접 DOM 요소를 찾아서 이벤트 리스너 추가
    const freeButton = document.getElementById("free-taxi-btn");
    if (freeButton) {
      freeButton.addEventListener("click", () => {
        this.hide();
        this.onStartGame();
      });
    }
  }

  public hide() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
