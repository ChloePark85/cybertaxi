import * as THREE from "three";

export class Taxi {
  private taxi: THREE.Group;
  private speed: number = 0;
  private maxSpeed: number = 2;
  private acceleration: number = 0.05;
  private deceleration: number = 0.03;
  private rotationSpeed: number = 0.03;

  constructor() {
    this.taxi = new THREE.Group();
    this.createTaxi();
  }

  private createTaxi(): void {
    // 차체
    const bodyGeometry = new THREE.BoxGeometry(4, 2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00, // 택시 노란색
      emissive: 0x444400, // 네온 효과
      metalness: 0.8,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5;
    this.taxi.add(body);

    // 지붕 표시등
    const lightGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 2,
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(0, 3, 0);
    this.taxi.add(light);

    // 바퀴 추가
    this.addWheel(-2, -3); // 왼쪽 앞
    this.addWheel(2, -3); // 오른쪽 앞
    this.addWheel(-2, 3); // 왼쪽 뒤
    this.addWheel(2, 3); // 오른쪽 뒤
  }

  private addWheel(x: number, z: number): void {
    const wheelGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.7,
    });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.75, z);
    this.taxi.add(wheel);
  }

  public update(controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  }): void {
    // 전진/후진
    if (controls.forward && this.speed < this.maxSpeed) {
      this.speed += this.acceleration;
    } else if (controls.backward && this.speed > -this.maxSpeed) {
      this.speed -= this.acceleration;
    } else {
      // 감속
      if (Math.abs(this.speed) > 0) {
        this.speed -= Math.sign(this.speed) * this.deceleration;
        if (Math.abs(this.speed) < this.deceleration) {
          this.speed = 0;
        }
      }
    }

    // 회전
    if (this.speed !== 0) {
      if (controls.left) {
        this.taxi.rotation.y += this.rotationSpeed;
      }
      if (controls.right) {
        this.taxi.rotation.y -= this.rotationSpeed;
      }
    }

    // 이동
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(this.taxi.quaternion);
    direction.multiplyScalar(this.speed);
    this.taxi.position.add(direction);
  }

  public getObject(): THREE.Group {
    return this.taxi;
  }
}
