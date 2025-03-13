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

    // 기존 조명 강화
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // 🔥 전체 밝기 증가
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // 🔥 밝기 증가
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true; // 🔥 그림자 활성화 (시각적 효과 개선)

    // 새로운 광원 추가
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.8); // 🔥 하늘과 땅 조명 추가
    hemiLight.position.set(0, 300, 0);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(hemiLight);
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
      0.7, // 🔥 강도를 기존 1.2 → 0.7로 낮춤
      0.5, // 🔥 반경 감소
      1.0 // 🔥 임계값 증가
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
