import { Game } from "./game/Game";

// 웹폰트 로드 후 게임 시작
window.addEventListener("DOMContentLoaded", () => {
  // 웹폰트 로드
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

  // 폰트 로드 완료 후 게임 시작
  link.onload = () => {
    const game = new Game();
    game.init();
  };

  document.head.appendChild(link);
});
