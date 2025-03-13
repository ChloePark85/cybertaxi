import * as THREE from "three";
import { Scene } from "./Scene";
import { Camera } from "../game/Camera";
import { City } from "../objects/City";
import { Taxi } from "../objects/Taxi";
import { Controls } from "./Controls";
import { Passenger } from "../objects/Passenger";
import { Minimap } from "./Minimap";

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
    this.scene.getInstance().add(this.city.getGroup());
    this.scene.getInstance().add(this.taxi.getObject());

    // 카메라 초기 위치를 더 높게 조정
    this.camera.getInstance().position.set(0, 50, 50);
    this.camera.getInstance().lookAt(0, 0, 0);

    this.minimap = new Minimap(this.scene.getInstance());
    this.spawnNewPassenger();

    // 게임 설명 추가
    this.addGameInstructions();
  }

  public init(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Three.js r137 이후 변경된 인코딩 설정
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene.setupPostProcessing(this.renderer, this.camera.getInstance());

    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener("resize", () => this.onWindowResize());

    this.animate();
  }

  private onWindowResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private spawnNewPassenger(): void {
    if (this.currentPassenger) {
      // 기존 승객과 목적지 마커 제거
      this.scene
        .getInstance()
        .remove(this.currentPassenger.getPassengerObject());
      this.scene
        .getInstance()
        .remove(this.currentPassenger.getDestinationObject());
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
    instructions.innerHTML = `
        <h3>택시 게임</h3>
        <p>🟢 초록색 기둥: 승객</p>
        <p>🔴 빨간색 화살표: 목적지</p>
        <p>승객을 태우고 목적지까지 운전하세요!</p>
    `;
    document.body.appendChild(instructions);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // 택시 업데이트
    this.taxi.update(this.controls.getControls());

    // 승객 관리
    if (this.currentPassenger) {
      const taxiPosition = this.taxi.getObject().position;

      if (
        !this.hasPassenger &&
        this.currentPassenger.isNearPassenger(taxiPosition)
      ) {
        // 승객 탑승
        this.hasPassenger = true;
        this.scene
          .getInstance()
          .remove(this.currentPassenger.getPassengerObject());
        this.scene
          .getInstance()
          .add(this.currentPassenger.getDestinationObject());
        console.log("승객이 탑승했습니다!");

        // 디버그용 로그 추가
        console.log("택시 위치:", taxiPosition);
        console.log(
          "승객과의 거리:",
          taxiPosition.distanceTo(
            this.currentPassenger.getPassengerObject().position
          )
        );
      } else if (
        this.hasPassenger &&
        this.currentPassenger.isNearDestination(taxiPosition)
      ) {
        // 목적지 도착
        console.log("목적지에 도착했습니다!");
        this.spawnNewPassenger();
      }
    }

    // 카메라 위치 조정
    const taxiPosition = this.taxi.getObject().position;
    this.camera.getInstance().position.set(
      taxiPosition.x,
      taxiPosition.y + 30, // 높이 조정
      taxiPosition.z + 30 // 거리 조정
    );
    this.camera.getInstance().lookAt(taxiPosition);

    // 미니맵 업데이트 추가
    if (this.currentPassenger) {
      this.minimap.update(
        taxiPosition,
        this.hasPassenger ? undefined : this.currentPassenger.getPosition(),
        this.hasPassenger
          ? this.currentPassenger.getDestinationPosition()
          : undefined
      );
    }

    this.scene.getComposer().render();
  }
}
