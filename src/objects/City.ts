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
    // 도로 생성
    const roadGeometry = new THREE.PlaneGeometry(this.citySize, this.citySize);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    this.cityGroup.add(road);

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
}
