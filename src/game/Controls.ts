export class Controls {
  private keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };
  private touchControls: HTMLDivElement | null = null;

  constructor() {
    // 키보드 이벤트
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    // 모바일 터치 컨트롤 생성
    if (this.isMobileDevice()) {
      this.createTouchControls();
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code in this.keys) {
      this.keys[event.code] = true;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.code in this.keys) {
      this.keys[event.code] = false;
    }
  }

  private createTouchControls(): void {
    // 컨테이너 생성
    this.touchControls = document.createElement("div");
    this.touchControls.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      z-index: 2000;
      pointer-events: none;
    `;

    // 상단 행 (위 버튼)
    const topRow = document.createElement("div");
    topRow.style.cssText = "display: flex; justify-content: center;";
    topRow.appendChild(this.createButton("▲", "ArrowUp"));

    // 중간 행 (좌, 우 버튼)
    const middleRow = document.createElement("div");
    middleRow.style.cssText = "display: flex; gap: 60px;";
    middleRow.appendChild(this.createButton("◀", "ArrowLeft"));
    middleRow.appendChild(this.createButton("▶", "ArrowRight"));

    // 하단 행 (아래 버튼)
    const bottomRow = document.createElement("div");
    bottomRow.style.cssText = "display: flex; justify-content: center;";
    bottomRow.appendChild(this.createButton("▼", "ArrowDown"));

    this.touchControls.appendChild(topRow);
    this.touchControls.appendChild(middleRow);
    this.touchControls.appendChild(bottomRow);

    document.body.appendChild(this.touchControls);
  }

  private createButton(label: string, key: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText = `
      width: 60px;
      height: 60px;
      font-size: 24px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      color: white;
      pointer-events: auto;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    `;

    // 터치 이벤트
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.keys[key] = true;
      button.style.background = "rgba(0, 255, 255, 0.6)";
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.keys[key] = false;
      button.style.background = "rgba(255, 255, 255, 0.3)";
    });

    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.keys[key] = false;
      button.style.background = "rgba(255, 255, 255, 0.3)";
    });

    // 마우스 이벤트 (데스크톱 테스트용)
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.keys[key] = true;
      button.style.background = "rgba(0, 255, 255, 0.6)";
    });

    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.keys[key] = false;
      button.style.background = "rgba(255, 255, 255, 0.3)";
    });

    button.addEventListener("mouseleave", () => {
      this.keys[key] = false;
      button.style.background = "rgba(255, 255, 255, 0.3)";
    });

    return button;
  }

  public getControls() {
    return {
      forward: this.keys["ArrowUp"],
      backward: this.keys["ArrowDown"],
      left: this.keys["ArrowLeft"],
      right: this.keys["ArrowRight"],
      brake: this.keys["Space"],
    };
  }
}
