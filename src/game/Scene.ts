import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export class Scene {
  private scene: THREE.Scene;
  private composer!: EffectComposer;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a3a5e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 700);

    // 조명 강화
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 100, 100);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  public setupPostProcessing(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera
  ): void {
    this.composer = new EffectComposer(renderer);

    // 기본 렌더 패스
    const renderPass = new RenderPass(this.scene, camera);
    this.composer.addPass(renderPass);

    // 네온 효과를 위한 블룸 패스
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, // 🔥 강도를 기존 1.5 → 1.2로 낮춤
      0.6, // 🔥 반경 증가
      0.9 // 🔥 임계값 증가
    );
    this.composer.addPass(bloomPass);
  }

  public getInstance(): THREE.Scene {
    return this.scene;
  }

  public getComposer(): EffectComposer {
    return this.composer;
  }
}
