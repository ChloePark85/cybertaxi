import * as THREE from "three";

export class City {
  private group: THREE.Group;
  private citySize: number = 1000;
  private buildingCount: number = 300;
  private roadWidth: number = 20;
  private clock: THREE.Clock;

  constructor() {
    this.group = new THREE.Group();
    this.clock = new THREE.Clock();
    this.createGround();
    this.createRoads();
    this.createBuildings();
    this.createHolograms();
    this.createFlyingVehicles();
  }

  private createGround(): void {
    // 어두운 바닥
    const groundGeometry = new THREE.PlaneGeometry(
      this.citySize * 2,
      this.citySize * 2
    );
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x050510,
      roughness: 0.3,
      metalness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  private createRoads(): void {
    // 메인 도로 (네온 효과가 있는 젖은 도로)
    const mainRoadGeometry = new THREE.PlaneGeometry(
      this.roadWidth,
      this.citySize * 2
    );
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1, // 매우 반짝이는 표면
      metalness: 1.0, // 금속성 최대
      envMapIntensity: 3.0, // 환경 반사 강화
    });

    const mainRoad = new THREE.Mesh(mainRoadGeometry, roadMaterial);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.y = 0.1;
    mainRoad.receiveShadow = true;
    this.group.add(mainRoad);

    // 도로 네온 라인 (양쪽)
    const createNeonLine = (color: number, offsetX: number) => {
      const lineGeometry = new THREE.PlaneGeometry(0.5, this.citySize * 2);
      const lineMaterial = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 2.0,
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(offsetX, 0.2, 0);
      this.group.add(line);
    };

    // 도로 양쪽에 네온 라인 추가
    createNeonLine(0xff00ff, this.roadWidth / 2 - 1); // 핑크색 라인
    createNeonLine(0x00ffff, -this.roadWidth / 2 + 1); // 시안색 라인

    // 도로 중앙선 (깜빡이는 효과)
    const centerLineGeometry = new THREE.PlaneGeometry(0.5, this.citySize * 2);
    const centerLineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      emissive: 0xffff00,
      emissiveIntensity: 1.0,
    });
    const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = 0.2;
    this.group.add(centerLine);

    // 깜빡이는 효과
    const animateCenterLine = () => {
      const time = this.clock.getElapsedTime();
      centerLineMaterial.opacity = Math.sin(time * 5) * 0.5 + 0.5;
      requestAnimationFrame(animateCenterLine);
    };
    animateCenterLine();

    // 횡단 도로 추가 (교차로)
    for (let i = -this.citySize / 2; i < this.citySize / 2; i += 200) {
      const crossRoadGeometry = new THREE.PlaneGeometry(
        this.citySize * 2,
        this.roadWidth
      );
      const crossRoad = new THREE.Mesh(crossRoadGeometry, roadMaterial);
      crossRoad.rotation.x = -Math.PI / 2;
      crossRoad.position.set(0, 0.1, i);
      crossRoad.receiveShadow = true;
      this.group.add(crossRoad);

      // 교차로 네온 라인
      const crossLineGeometry = new THREE.PlaneGeometry(this.citySize * 2, 0.5);
      const crossLineMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
      });
      const crossLine = new THREE.Mesh(crossLineGeometry, crossLineMaterial);
      crossLine.rotation.x = -Math.PI / 2;
      crossLine.position.set(0, 0.2, i + this.roadWidth / 2 - 1);
      this.group.add(crossLine);

      const crossLine2 = new THREE.Mesh(crossLineGeometry, crossLineMaterial);
      crossLine2.rotation.x = -Math.PI / 2;
      crossLine2.position.set(0, 0.2, i - this.roadWidth / 2 + 1);
      this.group.add(crossLine2);
    }
  }

  private createBuildings(): void {
    // 네온 색상 팔레트
    const neonColors = [
      0xff00ff, 0x00ffff, 0xff0066, 0x33ff00, 0xff3300, 0x9900ff, 0x00ff99,
      0xffff00,
    ];

    for (let i = 0; i < this.buildingCount; i++) {
      // 도로 주변에 건물 배치
      let x, z;
      const roadBuffer = this.roadWidth + 10;

      if (Math.random() > 0.5) {
        // 메인 도로 주변
        x =
          Math.random() > 0.5
            ? Math.random() * (this.citySize / 2 - roadBuffer) + roadBuffer
            : Math.random() * (-this.citySize / 2 + roadBuffer) - roadBuffer;
        z = (Math.random() * 2 - 1) * this.citySize;
      } else {
        // 교차 도로 주변
        x = (Math.random() * 2 - 1) * this.citySize;
        z =
          Math.random() > 0.5
            ? Math.random() * (this.citySize / 2 - roadBuffer) + roadBuffer
            : Math.random() * (-this.citySize / 2 + roadBuffer) - roadBuffer;
      }

      // 건물 크기와 높이 다양화 (더 높은 건물들)
      const width = Math.random() * 30 + 15;
      const height = Math.random() * 150 + 30; // 더 높은 건물
      const depth = Math.random() * 30 + 15;

      // 건물 기본 구조
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.3,
        metalness: 0.8,
      });

      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(x, height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      this.group.add(building);

      // 네온 창문 효과 추가
      this.addWindowsToBuilding(building, neonColors);

      // 옥상 네온 사인 (일부 건물만)
      if (Math.random() > 0.7) {
        this.addRoofNeon(building, neonColors);
      }
    }
  }

  private addWindowsToBuilding(
    building: THREE.Mesh,
    neonColors: number[]
  ): void {
    const buildingBox = new THREE.Box3().setFromObject(building);
    const size = new THREE.Vector3();
    buildingBox.getSize(size);

    // 창문 행/열 수 계산
    const rows = Math.floor(size.y / 5);
    const colsX = Math.floor(size.x / 4);
    const colsZ = Math.floor(size.z / 4);

    // 랜덤 네온 색상 선택
    const windowColor =
      neonColors[Math.floor(Math.random() * neonColors.length)];

    // 창문 생성 (앞면과 뒷면)
    for (let row = 1; row < rows; row++) {
      for (let col = 0; col < colsX; col++) {
        // 일부 창문만 켜짐
        if (Math.random() > 0.3) {
          this.createWindow(
            building.position.x - size.x / 2 + col * 4 + 2,
            row * 5,
            building.position.z + size.z / 2 + 0.1,
            windowColor
          );

          // 뒷면 창문
          this.createWindow(
            building.position.x - size.x / 2 + col * 4 + 2,
            row * 5,
            building.position.z - size.z / 2 - 0.1,
            windowColor
          );
        }
      }
    }

    // 옆면 창문
    for (let row = 1; row < rows; row++) {
      for (let col = 0; col < colsZ; col++) {
        if (Math.random() > 0.3) {
          this.createWindow(
            building.position.x + size.x / 2 + 0.1,
            row * 5,
            building.position.z - size.z / 2 + col * 4 + 2,
            windowColor
          );

          // 반대쪽 옆면
          this.createWindow(
            building.position.x - size.x / 2 - 0.1,
            row * 5,
            building.position.z - size.z / 2 + col * 4 + 2,
            windowColor
          );
        }
      }
    }
  }

  private createWindow(x: number, y: number, z: number, color: number): void {
    const windowGeometry = new THREE.PlaneGeometry(2, 3);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 1.0 + Math.random() * 0.5,
    });

    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(x, y, z);

    // 창문 방향 설정
    if (Math.abs(z) > Math.abs(x)) {
      window.rotation.y = Math.PI / 2;
    }

    this.group.add(window);

    // 깜빡이는 효과 (일부 창문만)
    if (Math.random() > 0.8) {
      const blinkSpeed = Math.random() * 2 + 0.5;
      const blinkIntensity = Math.random() * 0.5 + 0.5;

      const animateWindow = () => {
        const time = this.clock.getElapsedTime();
        windowMaterial.opacity =
          Math.sin(time * blinkSpeed) * blinkIntensity + 0.5;
        requestAnimationFrame(animateWindow);
      };
      animateWindow();
    }
  }

  private addRoofNeon(building: THREE.Mesh, neonColors: number[]): void {
    const buildingBox = new THREE.Box3().setFromObject(building);
    const size = new THREE.Vector3();
    buildingBox.getSize(size);

    const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    const neonGeometry = new THREE.BoxGeometry(size.x * 0.8, 2, size.z * 0.8);
    const neonMaterial = new THREE.MeshStandardMaterial({
      color: neonColor,
      emissive: neonColor,
      emissiveIntensity: 2.0,
    });

    const neonSign = new THREE.Mesh(neonGeometry, neonMaterial);
    neonSign.position.set(
      building.position.x,
      building.position.y + size.y / 2 + 1,
      building.position.z
    );

    this.group.add(neonSign);

    // 깜빡이는 효과
    const blinkSpeed = Math.random() * 3 + 1;

    const animateNeon = () => {
      const time = this.clock.getElapsedTime();
      neonMaterial.emissiveIntensity = Math.sin(time * blinkSpeed) * 1.0 + 1.0;
      requestAnimationFrame(animateNeon);
    };
    animateNeon();
  }

  private createHolograms(): void {
    // 홀로그램 광고 추가
    const holoTexts = [
      "CYBER",
      "NEON",
      "FUTURE",
      "TECH",
      "CORP",
      "BUY",
      "UPGRADE",
      "POWER",
      "CYBER TAXI",
    ];

    const holoColors = [0x00ffff, 0xff00ff, 0x33ff00, 0xff3300, 0x9900ff];

    for (let i = 0; i < 20; i++) {
      const text = holoTexts[Math.floor(Math.random() * holoTexts.length)];
      const color = holoColors[Math.floor(Math.random() * holoColors.length)];

      // 홀로그램 위치 (도로 주변)
      const x = (Math.random() * 2 - 1) * this.citySize * 0.8;
      const y = Math.random() * 100 + 50;
      const z = (Math.random() * 2 - 1) * this.citySize * 0.8;

      // 홀로그램 생성
      const holoGeometry = new THREE.PlaneGeometry(30, 15);
      const holoMaterial = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 1.5,
      });

      const hologram = new THREE.Mesh(holoGeometry, holoMaterial);
      hologram.position.set(x, y, z);
      hologram.rotation.y = Math.random() * Math.PI * 2;
      this.group.add(hologram);

      // 깜빡이는 효과
      const blinkSpeed = Math.random() * 2 + 1;

      const animateHologram = () => {
        const time = this.clock.getElapsedTime();
        hologram.rotation.y += 0.005;
        holoMaterial.opacity = Math.sin(time * blinkSpeed) * 0.3 + 0.4;
        requestAnimationFrame(animateHologram);
      };
      animateHologram();
    }

    // 추가: 홀로그래픽 빌보드
    this.createHolographicBillboards();
  }

  private createHolographicBillboards(): void {
    // 빌보드 이미지 텍스트 배열
    const billboardTexts = [
      "CYBER TAXI",
      "NIGHT CITY",
      "NEON DREAMS",
      "CYBER CORP",
      "NEURAL LINK",
      "DIGITAL SOUL",
      "CHROME EDGE",
      "SYNTH WAVE",
    ];

    // 네온 색상 배열
    const neonColors = [
      0xff00ff, // 핑크
      0x00ffff, // 시안
      0xff3300, // 오렌지
      0x33ff00, // 라임
      0x0066ff, // 블루
    ];

    // 10개의 빌보드 생성
    for (let i = 0; i < 10; i++) {
      // 랜덤 위치 (도로 주변)
      const x = (Math.random() * 2 - 1) * this.citySize * 0.6;
      const z = (Math.random() * 2 - 1) * this.citySize * 0.6;
      const y = Math.random() * 50 + 50; // 낮은 위치로 조정

      // 더 큰 크기로 조정
      const width = Math.random() * 40 + 60;
      const height = width * 0.6;

      // 랜덤 텍스트와 색상
      const text =
        billboardTexts[Math.floor(Math.random() * billboardTexts.length)];
      const color = neonColors[Math.floor(Math.random() * neonColors.length)];

      // 빌보드 생성
      this.createBillboard(x, y, z, width, height, text, color);
    }
  }

  private createBillboard(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    text: string,
    color: number
  ): void {
    // 빌보드 배경 (반투명 패널)
    const panelGeometry = new THREE.PlaneGeometry(width, height);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.8,
      emissive: color,
      emissiveIntensity: 0.5, // 발광 강화
      side: THREE.DoubleSide,
    });

    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(x, y, z);

    // 랜덤 회전 (Y축) - 카메라를 향하도록 조정
    panel.rotation.y = Math.random() * Math.PI * 2;

    this.group.add(panel);

    // 텍스트 생성 (캔버스 사용)
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      // 캔버스 크기 설정 (더 큰 해상도)
      canvas.width = 1024;
      canvas.height = 512;

      // 배경 투명하게
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 텍스트 스타일 설정 (더 굵고 큰 폰트)
      context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      context.font = "bold 120px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";

      // 네온 효과 (여러 겹의 그림자)
      context.shadowBlur = 40;
      context.shadowColor = `#${color.toString(16).padStart(6, "0")}`;

      // 여러 번 그려서 발광 효과 강화
      for (let i = 0; i < 5; i++) {
        context.shadowBlur = 20 + i * 5;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
      }

      // 텍스처 생성
      const texture = new THREE.CanvasTexture(canvas);

      // 텍스트 메시 생성
      const textGeometry = new THREE.PlaneGeometry(width * 0.95, height * 0.95);
      const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, // 가산 블렌딩으로 발광 효과 강화
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0, 0.1); // 패널 앞에 약간 띄움

      panel.add(textMesh);
    }

    // 깜빡이는 효과
    const blinkSpeed = Math.random() * 0.01 + 0.005;
    const minOpacity = Math.random() * 0.3 + 0.5; // 최소 불투명도 증가
    const maxOpacity = Math.random() * 0.2 + 0.8; // 최대 불투명도 증가

    const animateBillboard = () => {
      const time = this.clock.getElapsedTime();

      // 사인파를 이용한 깜빡임
      const opacity =
        minOpacity +
        ((Math.sin(time * blinkSpeed * Math.PI * 2) + 1) / 2) *
          (maxOpacity - minOpacity);

      // 패널 불투명도 조정
      (panelMaterial as THREE.MeshStandardMaterial).opacity = opacity;

      // 발광 강도도 함께 변경
      (panelMaterial as THREE.MeshStandardMaterial).emissiveIntensity =
        opacity * 2;

      // 약간의 회전 효과
      panel.rotation.y += 0.0005;

      requestAnimationFrame(animateBillboard);
    };

    animateBillboard();
  }

  private createFlyingVehicles(): void {
    // 공중을 떠다니는 드론 택시
    for (let i = 0; i < 15; i++) {
      // 드론 택시 본체
      const bodyGeometry = new THREE.BoxGeometry(6, 2, 10);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x333333 : 0x222222,
        roughness: 0.3,
        metalness: 0.8,
      });

      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

      // 네온 라인 추가
      const neonColor = Math.random() > 0.5 ? 0xff00ff : 0x00ffff;
      const neonMaterial = new THREE.MeshStandardMaterial({
        color: neonColor,
        emissive: neonColor,
        emissiveIntensity: 2.0,
      });

      // 앞 라이트
      const frontLightGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
      const frontLight = new THREE.Mesh(frontLightGeometry, neonMaterial);
      frontLight.position.set(0, 0, 5);
      body.add(frontLight);

      // 뒤 라이트
      const rearLightGeometry = new THREE.BoxGeometry(4, 0.5, 0.5);
      const rearLight = new THREE.Mesh(rearLightGeometry, neonMaterial);
      rearLight.position.set(0, 0, -5);
      body.add(rearLight);

      // 프로펠러 추가
      this.addPropellers(body, neonColor);

      // 초기 위치 설정
      const x = (Math.random() * 2 - 1) * this.citySize * 0.8;
      const y = Math.random() * 150 + 50;
      const z = (Math.random() * 2 - 1) * this.citySize * 0.8;

      body.position.set(x, y, z);
      body.rotation.y = Math.random() * Math.PI * 2;

      this.group.add(body);

      // 움직임 애니메이션
      const speed = Math.random() * 0.5 + 0.2;
      const direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        (Math.random() * 0.2 - 0.1) * 0.1, // 약간의 상하 움직임
        Math.random() * 2 - 1
      ).normalize();

      const animateDrone = () => {
        body.position.x += direction.x * speed;
        body.position.y += direction.y * speed;
        body.position.z += direction.z * speed;

        // 경계에 도달하면 방향 전환
        if (
          Math.abs(body.position.x) > this.citySize * 0.9 ||
          Math.abs(body.position.z) > this.citySize * 0.9 ||
          body.position.y < 30 ||
          body.position.y > 200
        ) {
          direction.x *= -1;
          direction.z *= -1;
          direction.y *= -1;
          body.rotation.y = Math.atan2(direction.z, direction.x);
        }

        requestAnimationFrame(animateDrone);
      };
      animateDrone();
    }
  }

  private addPropellers(body: THREE.Mesh, neonColor: number): void {
    const propellerPositions = [
      { x: -4, y: 1, z: -3 },
      { x: 4, y: 1, z: -3 },
      { x: -4, y: 1, z: 3 },
      { x: 4, y: 1, z: 3 },
    ];

    const propellerGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 16);
    const propellerMaterial = new THREE.MeshStandardMaterial({
      color: neonColor,
      transparent: true,
      opacity: 0.7,
      emissive: neonColor,
      emissiveIntensity: 1.5,
    });

    propellerPositions.forEach((pos) => {
      const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller.position.set(pos.x, pos.y, pos.z);
      propeller.rotation.x = Math.PI / 2;
      body.add(propeller);

      // 회전 애니메이션
      const speed = Math.random() * 0.2 + 0.1;

      const animatePropeller = () => {
        propeller.rotation.z += speed;
        requestAnimationFrame(animatePropeller);
      };
      animatePropeller();
    });
  }

  public getGroup(): THREE.Group {
    return this.group;
  }
}
