import * as THREE from "three";

export class Passenger {
  private passenger: THREE.Group;
  private destination: THREE.Group;
  private position: THREE.Vector3;
  private destinationPosition: THREE.Vector3;

  constructor(citySize: number) {
    this.passenger = new THREE.Group();
    this.destination = new THREE.Group();

    // 랜덤 위치 생성 (도로 위)
    this.position = this.getRandomPosition(citySize);
    this.destinationPosition = this.getRandomPosition(citySize);

    this.createPassenger();
    this.createDestinationMarker();
  }

  private getRandomPosition(citySize: number): THREE.Vector3 {
    const halfSize = citySize / 2;
    return new THREE.Vector3(
      Math.random() * citySize - halfSize,
      0,
      Math.random() * citySize - halfSize
    );
  }

  private createPassenger(): void {
    // 승객 표시 (크기 증가)
    const geometry = new THREE.CylinderGeometry(2, 2, 8, 8); // 크기 2배 증가
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 2.0, // 발광 강도 증가
    });

    const body = new THREE.Mesh(geometry, material);
    body.position.y = 4; // 높이 증가

    // 위로 움직이는 애니메이션 추가
    const animate = () => {
      body.position.y = 4 + Math.sin(Date.now() * 0.003) * 1;
      requestAnimationFrame(animate);
    };
    animate();

    this.passenger.add(body);
    this.passenger.position.copy(this.position);
  }

  private createDestinationMarker(): void {
    // 목적지 표시 (크기 증가)
    const geometry = new THREE.ConeGeometry(2, 6, 8); // 크기 2배 증가
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 2.0, // 발광 강도 증가
      transparent: true,
      opacity: 0.8,
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.y = 4; // 높이 증가

    this.destination.add(marker);
    this.destination.position.copy(this.destinationPosition);

    // 마커 애니메이션
    const animate = () => {
      marker.position.y = 4 + Math.sin(Date.now() * 0.003) * 1;
      requestAnimationFrame(animate);
    };
    animate();
  }

  public isNearPassenger(position: THREE.Vector3): boolean {
    return position.distanceTo(this.position) < 5;
  }

  public isNearDestination(position: THREE.Vector3): boolean {
    return position.distanceTo(this.destinationPosition) < 5;
  }

  public getPassengerObject(): THREE.Group {
    return this.passenger;
  }

  public getDestinationObject(): THREE.Group {
    return this.destination;
  }

  public getDestinationPosition(): THREE.Vector3 {
    return this.destinationPosition;
  }

  public getPosition(): THREE.Vector3 {
    return this.position;
  }
}
