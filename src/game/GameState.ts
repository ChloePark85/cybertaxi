export class GameState {
  private score: number = 0;
  private timeLimit: number = 60; // 60초
  private currentTime: number = 0;
  private missionStartTime: number = 0;
  private isMissionActive: boolean = false;

  constructor() {}

  public startMission(): void {
    this.currentTime = 0;
    this.missionStartTime = Date.now();
    this.isMissionActive = true;
  }

  public endMission(success: boolean): void {
    if (!this.isMissionActive) return;

    const timeTaken = (Date.now() - this.missionStartTime) / 1000;
    if (success) {
      // 남은 시간에 따른 보너스 점수
      const timeBonus = Math.max(0, this.timeLimit - timeTaken);
      this.score += Math.floor(100 + timeBonus * 10);
    } else {
      this.score = Math.max(0, this.score - 50); // 실패 시 감점
    }

    this.isMissionActive = false;
    this.startMission();
  }

  public update(): void {
    if (this.isMissionActive) {
      this.currentTime = (Date.now() - this.missionStartTime) / 1000;
      if (this.currentTime >= this.timeLimit) {
        this.endMission(false); // 시간 초과
      }
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getRemainingTime(): number {
    return Math.max(0, this.timeLimit - this.currentTime);
  }

  public isMissionFailed(): boolean {
    return this.currentTime >= this.timeLimit;
  }
}
