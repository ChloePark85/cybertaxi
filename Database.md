데이터 관리 방식 (초기 MVP)

- 로컬 저장소(Local Storage)로 간단한 사용자 데이터 관리 (차량 업그레이드 상태 등)

데이터 예시

// 차량 업그레이드 저장
localStorage.setItem('vehicle_upgrade', 'premium_neon_taxi');

// 업그레이드 확인
const currentUpgrade = localStorage.getItem('vehicle_upgrade');


향후 확장 시 데이터베이스 고려 사항

- Firebase Realtime Database 또는 Firestore 사용 권장

- 사용자 프로필, 결제 정보, 차량 업그레이드 데이터 등 관리


### 데이터 모델 예시

| 컬렉션        | 필드                              | 설명                    |
|---------------|-----------------------------------|-------------------------|
| Users         | user_id, username, email          | 사용자 계정 관리        |
| Vehicles      | vehicle_id, user_id, vehicle_type | 사용자가 소유한 차량 정보 |
| Transactions  | payment_id, user_id, amount       | Stripe 결제 관련 정보   |
