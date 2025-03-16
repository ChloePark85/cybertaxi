export class ShopUI {
  private container: HTMLDivElement;
  private onStartGame: (isPremium: boolean) => void;
  private isPremium: boolean = false;

  constructor(onStartGame: (isPremium: boolean) => void) {
    this.container = document.createElement("div");
    this.onStartGame = onStartGame;

    // 개발 환경에서 테스트 모드 활성화 (배포 시 제거)
    const isTestMode = true; // 테스트 시 true로 설정

    if (isTestMode) {
      this.isPremium = true;
    } else {
      // 기존 코드 (URL 파라미터 및 로컬 스토리지 확인)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("payment_success") === "true") {
        this.isPremium = true;
        // URL에서 파라미터 제거 (히스토리 유지)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        // 로컬 스토리지에 프리미엄 상태 저장
        localStorage.setItem("cybertaxi_premium", "true");
      } else {
        // 이전에 결제한 적이 있는지 확인
        this.isPremium = localStorage.getItem("cybertaxi_premium") === "true";
      }
    }

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

    let content = `
      <h1 style="color: #4CAF50; margin-bottom: 40px; font-size: 32px; text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);">CYBER TAXI</h1>
      <p style="color: white; margin-bottom: 20px;">Choose your taxi to start driving</p>
      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <button id="free-taxi-btn" style="padding: 20px; background: #4CAF50; border: none; color: white; border-radius: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🚖 BASIC TAXI<br>FREE
        </button>`;

    // 프리미엄 상태에 따라 버튼 변경
    if (this.isPremium) {
      content += `
        <button id="premium-taxi-btn" style="padding: 20px; background: #2196F3; border: none; color: white; border-radius: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(33, 150, 243, 0.3); position: relative;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🏎️ PREMIUM TAXI<br>PURCHASED
          <span style="position: absolute; top: -10px; right: -10px; background: #ff0066; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</span>
        </button>`;
    } else {
      content += `
        <button id="premium-taxi-btn" style="padding: 20px; background: #2196F3; border: none; color: white; border-radius: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(33, 150, 243, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🏎️ PREMIUM TAXI<br>$9.99
        </button>`;
    }

    content += `
      </div>
      <p style="color: #888; font-size: 12px; text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);">Premium taxi runs 2x faster!</p>
    `;

    this.container.innerHTML = content;
    document.body.appendChild(this.container);

    // 무료 택시 버튼 이벤트 리스너
    const freeButton = document.getElementById("free-taxi-btn");
    if (freeButton) {
      freeButton.addEventListener("click", () => {
        this.hide();
        this.onStartGame(false); // 일반 택시로 시작
      });
    }

    // 프리미엄 택시 버튼 이벤트 리스너
    const premiumButton = document.getElementById("premium-taxi-btn");
    if (premiumButton) {
      premiumButton.addEventListener("click", () => {
        if (this.isPremium) {
          // 이미 구매한 경우 프리미엄 택시로 시작
          this.hide();
          this.onStartGame(true);
        } else {
          // 구매 페이지로 이동
          // 성공 시 현재 URL + ?payment_success=true로 리디렉션되도록 설정
          const successUrl = `${window.location.href}${
            window.location.search ? "&" : "?"
          }payment_success=true`;
          window.location.href = `https://buy.stripe.com/여기에_실제_링크_입력?success_url=${encodeURIComponent(
            successUrl
          )}`;
        }
      });
    }
  }

  public hide() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  public isPremiumPurchased(): boolean {
    return this.isPremium;
  }
}
