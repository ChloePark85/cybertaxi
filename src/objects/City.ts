import * as THREE from "three";

export class City {
  private cityGroup: THREE.Group;
  private buildingCount: number = 100;
  private citySize: number = 1000;

  constructor() {
    this.cityGroup = new THREE.Group();
    this.generateCity();
  }

  private generateCity(): void {
    // 도로 생성 (기존 0x111111에서 밝은 회색으로 변경)
    const roadGeometry = new THREE.PlaneGeometry(this.citySize, this.citySize);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555, // 🔥 밝은 회색으로 변경
      roughness: 0.6,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    this.cityGroup.add(road);

    this.createGround(); // 🔥 바닥 생성 함수 호출 추가

    // 빌딩 생성
    for (let i = 0; i < this.buildingCount; i++) {
      const building = this.createBuilding();
      const x = Math.random() * this.citySize - this.citySize / 2;
      const z = Math.random() * this.citySize - this.citySize / 2;
      building.position.set(x, 0, z);
      this.cityGroup.add(building);
    }
  }

  private createBuilding(): THREE.Mesh {
    const height = Math.random() * 100 + 50;
    const geometry = new THREE.BoxGeometry(20, height, 20);

    // 네온 효과를 위한 재질
    const material = new THREE.MeshStandardMaterial({
      color: 0x202020,
      emissive: new THREE.Color(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5
      ),
      roughness: 0.1,
      metalness: 0.8,
    });

    return new THREE.Mesh(geometry, material);
  }

  public getGroup(): THREE.Group {
    return this.cityGroup;
  }

  private createGround(): void {
    const geometry = new THREE.PlaneGeometry(this.citySize, this.citySize);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc, // 🔥 기존보다 더 밝은 회색
      roughness: 0.2, // 🔥 반사광 증가
      metalness: 0.3, // 🔥 금속성 추가하여 조명 반사 증가
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05; // 🔥 도로와 겹치지 않도록 조정
    this.cityGroup.add(ground);
  }
}
