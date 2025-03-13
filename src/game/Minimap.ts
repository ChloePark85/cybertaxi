import * as THREE from "three";

export class Minimap {
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private minimapSize = 200; // 미니맵 크기 (픽셀)
  private mapScale = 1.0; // 스케일 증가

  constructor(mainScene: THREE.Scene) {
    // 직교 카메라 생성 (2D 뷰를 위해)
    this.camera = new THREE.OrthographicCamera(
      -500,
      500, // left, right
      500,
      -500, // top, bottom
      1,
      1000 // near, far
    );
    this.camera.position.set(0, 500, 0);
    this.camera.lookAt(0, 0, 0);

    // 렌더러 설정
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.minimapSize, this.minimapSize);
    this.renderer.setClearAlpha(0.3); // 렌더러의 투명도 설정

    // DOM에 추가
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.right = "20px";
    container.style.top = "20px";
    container.style.background = "rgba(0, 0, 0, 0.7)"; // 컨테이너 배경색 조정
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.appendChild(this.renderer.domElement);
    document.body.appendChild(container);

    // 씬 설정
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000).convertSRGBToLinear();
  }

  public update(
    taxiPosition: THREE.Vector3,
    passengerPosition?: THREE.Vector3,
    destinationPosition?: THREE.Vector3
  ): void {
    // 택시 위치 표시 (노란색 점)
    this.updateDot("taxi", taxiPosition, 0xffff00);

    // 승객 위치 표시 (사람 아이콘 형태의 초록색 점)
    if (passengerPosition) {
      this.updateDot("passenger", passengerPosition, 0x00ff00);
    }

    // 목적지 위치 표시 (깃발 모양의 빨간색 점)
    if (destinationPosition) {
      this.updateDot("destination", destinationPosition, 0xff0000);
    }

    this.renderer.render(this.scene, this.camera);
  }

  private updateDot(
    name: string,
    position: THREE.Vector3,
    color: number
  ): void {
    let dot = this.scene.getObjectByName(name);
    if (!dot) {
      const geometry = new THREE.CircleGeometry(8, 32);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8,
      });
      dot = new THREE.Mesh(geometry, material);
      dot.name = name;
      this.scene.add(dot);
    }
    dot.position.set(position.x * this.mapScale, position.z * this.mapScale, 0);
  }
}
