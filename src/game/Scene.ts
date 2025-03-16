import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export class Scene {
  private scene: THREE.Scene;
  private composer!: EffectComposer;

  constructor() {
    this.scene = new THREE.Scene();

    // 어두운 배경으로 변경 (사이버펑크 분위기)
    this.scene.background = new THREE.Color(0x050510);

    // 안개 효과 (네온 빛이 안개에 반사되는 효과)
    this.scene.fog = new THREE.Fog(0x050510, 100, 700);

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0x222233, 1.0); // 어두운 파란 기본 조명
    const directionalLight = new THREE.DirectionalLight(0x9900ff, 1.0); // 보라색 조명
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;

    // 그림자 품질 향상
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;

    // 추가 네온 조명
    const redLight = new THREE.PointLight(0xff0066, 2, 300);
    redLight.position.set(-100, 50, -100);

    const blueLight = new THREE.PointLight(0x00ffff, 2, 300);
    blueLight.position.set(100, 50, 100);

    const purpleLight = new THREE.PointLight(0x9900ff, 2, 300);
    purpleLight.position.set(0, 100, 0);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(redLight);
    this.scene.add(blueLight);
    this.scene.add(purpleLight);

    // 비 효과 추가
    this.addRain();
  }

  private addRain() {
    // 비 파티클 시스템
    const rainCount = 15000;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount * 3; i += 3) {
      // 넓은 영역에 비 생성
      rainPositions[i] = (Math.random() * 2 - 1) * 1000; // x
      rainPositions[i + 1] = Math.random() * 500; // y
      rainPositions[i + 2] = (Math.random() * 2 - 1) * 1000; // z

      // 다양한 낙하 속도
      rainVelocities[i / 3] = 1 + Math.random() * 3;
    }

    rainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(rainPositions, 3)
    );
    rainGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(rainVelocities, 1)
    );

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x99ccff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    this.scene.add(rain);

    // 비 애니메이션
    const animateRain = () => {
      const positions = rainGeometry.attributes.position.array;
      const velocities = rainGeometry.attributes.velocity.array;

      for (let i = 0; i < rainCount * 3; i += 3) {
        // 비가 내리는 애니메이션
        positions[i + 1] -= velocities[i / 3];

        // 바닥에 닿으면 다시 위로
        if (positions[i + 1] < 0) {
          positions[i + 1] = Math.random() * 500;
        }
      }

      rainGeometry.attributes.position.needsUpdate = true;
      requestAnimationFrame(animateRain);
    };

    animateRain();
  }

  public setupPostProcessing(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera
  ): void {
    this.composer = new EffectComposer(renderer);

    // 기본 렌더 패스
    const renderPass = new RenderPass(this.scene, camera);
    this.composer.addPass(renderPass);

    // 네온 효과를 위한 블룸 패스 (강화)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // 강도 증가
      0.4, // 반경 감소
      0.85 // 임계값 감소
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
