import * as THREE from "three";
import { Scene } from "./Scene";
import { Camera } from "../game/Camera";
import { City } from "../objects/City";
import { Taxi } from "../objects/Taxi";
import { Controls } from "./Controls";
import { Passenger } from "../objects/Passenger";
import { Minimap } from "./Minimap";
import { GameState } from "./GameState";
import { GameUI } from "./GameUI";
import { ShopUI } from "../shop/ShopUI";

export class Game {
  private scene: Scene;
  private camera: Camera;
  private renderer: THREE.WebGLRenderer;
  private city: City;
  private taxi: Taxi;
  private controls: Controls;
  private currentPassenger: Passenger | null = null;
  private hasPassenger: boolean = false;
  private citySize: number = 1000; // City 클래스의 citySize와 동일하게 설정
  private minimap: Minimap;
  private gameState: GameState;
  private gameUI: GameUI;
  private shopUI: ShopUI;

  constructor() {
    const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });

    this.scene = new Scene();
    this.camera = new Camera();
    this.city = new City();
    this.taxi = new Taxi();
    this.controls = new Controls();
    this.minimap = new Minimap(this.scene.getInstance());
    this.gameState = new GameState();
    this.gameUI = new GameUI();
    this.shopUI = new ShopUI(() => {
      this.startGame();
    });
  }

  public init(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Scene에 객체들 추가
    this.scene.getInstance().add(this.city.getGroup());
    this.scene.getInstance().add(this.taxi.getObject());

    // Post-processing 설정
    this.scene.setupPostProcessing(this.renderer, this.camera.getInstance());

    // 초기 카메라 위치 설정
    const taxiPosition = this.taxi.getObject().position;
    this.camera
      .getInstance()
      .position.set(taxiPosition.x, taxiPosition.y + 30, taxiPosition.z + 30);
    this.camera.getInstance().lookAt(taxiPosition);

    // 게임 설명 추가
    this.addGameInstructions();

    // 애니메이션 루프 시작 (게임 배경 렌더링)
    this.animate();

    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener("resize", () => this.onWindowResize());
  }

  private onWindowResize(): void {
    this.camera.getInstance().aspect = window.innerWidth / window.innerHeight;
    this.camera.getInstance().updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private startGame(): void {
    // 첫 승객 생성 및 미션 시작
    this.spawnNewPassenger();
    this.gameState.startMission();
    this.gameUI.updateTimer(this.gameState.getRemainingTime());
  }

  private spawnNewPassenger(): void {
    if (this.currentPassenger) {
      // 기존 승객과 목적지 마커 제거
      if (this.hasPassenger) {
        this.scene
          .getInstance()
          .remove(this.currentPassenger.getDestinationObject());
      } else {
        this.scene
          .getInstance()
          .remove(this.currentPassenger.getPassengerObject());
      }
    }

    this.currentPassenger = new Passenger(this.citySize);
    this.scene.getInstance().add(this.currentPassenger.getPassengerObject());
    this.hasPassenger = false;
  }

  private addGameInstructions(): void {
    const instructions = document.createElement("div");
    instructions.style.position = "absolute";
    instructions.style.left = "20px";
    instructions.style.top = "20px";
    instructions.style.background = "rgba(0, 0, 0, 0.5)";
    instructions.style.color = "white";
    instructions.style.padding = "10px";
    instructions.style.borderRadius = "5px";
    instructions.style.zIndex = "999";
    instructions.innerHTML = `
        <h3>CYBER TAXI</h3>
        <p>🟢 GREEN PILLAR: PASSENGER</p>
        <p>🔴 RED ARROW: DESTINATION</p>
        <p>PICK UP PASSENGER AND DRIVE TO DESTINATION!</p>
    `;
    document.body.appendChild(instructions);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // 씬 렌더링
    this.scene.getComposer().render();

    // 게임 상태 업데이트
    this.gameState.update();

    // UI 업데이트를 먼저 수행
    this.gameUI.updateScore(this.gameState.getScore());
    this.gameUI.updateTimer(this.gameState.getRemainingTime());

    // 택시 업데이트
    this.taxi.update(this.controls.getControls());

    // 카메라 위치 조정
    const taxiPosition = this.taxi.getObject().position;
    this.camera
      .getInstance()
      .position.set(taxiPosition.x, taxiPosition.y + 30, taxiPosition.z + 30);
    this.camera.getInstance().lookAt(taxiPosition);

    if (!this.currentPassenger) return;

    // 시간 초과 체크
    if (this.gameState.isMissionFailed() && !this.gameState.isMissionActive) {
      // 승객을 태웠는지 여부에 따라 다른 메시지 표시
      const message = this.hasPassenger
        ? "DESTINATION NOT REACHED!"
        : "TIME OVER!";
      this.gameUI.showMessage(message, "failure");

      setTimeout(() => {
        this.gameState.resetGame(); // 게임을 다시 시작
        this.spawnNewPassenger(); // 새로운 승객 생성
      }, 2000);

      return;
    }

    if (
      !this.hasPassenger &&
      this.currentPassenger.isNearPassenger(taxiPosition)
    ) {
      this.hasPassenger = true;
      // 승객 오브젝트 제거
      this.scene
        .getInstance()
        .remove(this.currentPassenger.getPassengerObject());
      // 목적지 마커 추가
      this.scene
        .getInstance()
        .add(this.currentPassenger.getDestinationObject());
      this.gameUI.showMessage("PASSENGER ON!", "success");
    }

    // 미니맵 업데이트
    this.minimap.update(
      taxiPosition,
      this.hasPassenger ? undefined : this.currentPassenger.getPosition(),
      this.hasPassenger
        ? this.currentPassenger.getDestinationPosition()
        : undefined
    );

    if (
      this.hasPassenger &&
      this.currentPassenger.isNearDestination(taxiPosition)
    ) {
      this.gameUI.showMessage("MISSION SUCCESS!", "success");
      this.gameState.endMission(true);
      this.spawnNewPassenger();
    }
  }
}
