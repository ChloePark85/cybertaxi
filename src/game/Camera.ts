import * as THREE from "three";

export class Camera {
  private camera: THREE.PerspectiveCamera;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // 카메라 초기 위치 설정
    this.camera.position.set(0, 100, 200);
    this.camera.lookAt(0, 0, 0);

    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener("resize", () => this.onWindowResize());
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  public getInstance(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
