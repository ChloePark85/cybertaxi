import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export class Scene {
  private scene: THREE.Scene;
  private composer!: EffectComposer;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0015);

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
      1.5, // 강도
      0.4, // 반경
      0.85 // 임계값
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
