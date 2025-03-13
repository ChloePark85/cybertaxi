import * as THREE from "three";

export class Minimap {
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private minimapSize = 200; // 미니맵 크기 (픽셀)
  private mapScale = 0.2; // citySize에 맞춰 조정

  constructor(mainScene: THREE.Scene) {
    // 직교 카메라 생성 (2D 뷰를 위해)
    this.camera = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 1000);
    this.camera.position.set(0, 500, 0);
    this.camera.rotation.set(-Math.PI / 2, 0, 0); // 카메라를 아래로 회전
    this.camera.up.set(0, 0, -1); // 카메라 방향 수정

    // 렌더러 설정
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.minimapSize, this.minimapSize);
    this.renderer.setClearAlpha(0); // 렌더러의 투명도 설정

    // DOM에 추가
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.right = "20px";
    container.style.top = "20px";
    container.style.background = "rgba(0, 0, 0, 0.7)"; // 컨테이너 배경색 조정
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.appendChild(this.renderer.domElement);
    document.body.appendChild(container);

    // 씬 설정
    this.scene = new THREE.Scene();

    // 미니맵 씬에 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    // 배경색 설정
    this.scene.background = new THREE.Color(0x000000);

    // 격자 추가 (선택사항 - 방향 감각을 위해)
    const gridHelper = new THREE.GridHelper(1000, 10);
    gridHelper.rotation.x = Math.PI / 2;
    this.scene.add(gridHelper);
  }

  public update(
    taxiPosition: THREE.Vector3,
    passengerPosition?: THREE.Vector3,
    destinationPosition?: THREE.Vector3
  ): void {
    // 씬 초기화
    this.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        this.scene.remove(child);
      }
    });

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
      const geometry = new THREE.PlaneGeometry(15, 15); // 크기 증가
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      });
      dot = new THREE.Mesh(geometry, material);
      dot.rotation.x = -Math.PI / 2; // 평면을 수평으로 회전
      dot.name = name;
      this.scene.add(dot);
    }
    dot.position.set(position.x * this.mapScale, 0, position.z * this.mapScale);

    // 디버그용 로그
    console.log(
      `Updating ${name} dot at:`,
      position.x * this.mapScale,
      position.z * this.mapScale
    );
  }
}
