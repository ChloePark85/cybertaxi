export class GameUI {
  private container: HTMLDivElement;
  private scoreElement: HTMLDivElement;
  private timerElement: HTMLDivElement;
  private messageElement: HTMLDivElement;

  constructor() {
    // 메인 컨테이너
    this.container = document.createElement("div");
    this.container.style.position = "fixed";
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.pointerEvents = "none";
    this.container.style.zIndex = "1000";
    this.container.style.fontFamily = "'Press Start 2P', system-ui, sans-serif";
    document.body.appendChild(this.container);

    // 점수 표시
    this.scoreElement = this.createScoreElement();
    this.container.appendChild(this.scoreElement);

    // 타이머 표시
    this.timerElement = this.createTimerElement();
    this.container.appendChild(this.timerElement);

    // 메시지 표시 (미션 성공/실패 등)
    this.messageElement = this.createMessageElement();
    this.container.appendChild(this.messageElement);

    // 웹폰트 로드
    this.loadFont();
  }

  private createScoreElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "20px";
    element.style.bottom = "20px";
    element.style.color = "#00ff00";
    element.style.fontSize = "24px";
    element.style.textShadow = "0 0 10px #00ff00";
    element.style.zIndex = "1001";
    return element;
  }

  private createTimerElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.left = "20px";
    element.style.bottom = "60px";
    element.style.color = "#ffffff";
    element.style.fontSize = "28px";
    element.style.textShadow = "0 0 10px #ffffff";
    element.style.zIndex = "1001";
    element.style.fontFamily = "'Press Start 2P', system-ui, sans-serif";
    return element;
  }

  private createMessageElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "50%";
    element.style.top = "30%";
    element.style.transform = "translate(-50%, -50%)";
    element.style.color = "#ffffff";
    element.style.fontSize = "32px";
    element.style.textAlign = "center";
    element.style.opacity = "0";
    element.style.transition = "opacity 0.3s ease";
    element.style.zIndex = "1002";
    return element;
  }

  private loadFont(): void {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(link);
  }

  public updateScore(score: number): void {
    this.scoreElement.textContent = `SCORE: ${score}`;
  }

  public updateTimer(time: number): void {
    const timeStr = Math.ceil(time).toString().padStart(2, "0");
    this.timerElement.textContent = `남은 시간: ${timeStr}초`;

    // 10초 이하면 빨간색으로 변경
    if (time <= 10) {
      this.timerElement.style.color = "#ff0000";
      this.timerElement.style.textShadow = "0 0 10px #ff0000";
    } else {
      this.timerElement.style.color = "#ffffff";
      this.timerElement.style.textShadow = "0 0 10px #ffffff";
    }
  }

  public showMessage(message: string, type: "success" | "failure"): void {
    this.messageElement.textContent = message;
    this.messageElement.style.color =
      type === "success" ? "#00ff00" : "#ff0000";
    this.messageElement.style.textShadow = `0 0 10px ${
      type === "success" ? "#00ff00" : "#ff0000"
    }`;
    this.messageElement.style.opacity = "1";

    setTimeout(() => {
      this.messageElement.style.opacity = "0";
    }, 2000);
  }
}
