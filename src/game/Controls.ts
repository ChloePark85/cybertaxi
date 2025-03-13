export class Controls {
  private keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code in this.keys) {
      this.keys[event.code] = true;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.code in this.keys) {
      this.keys[event.code] = false;
    }
  }

  public getControls() {
    return {
      forward: this.keys["ArrowUp"],
      backward: this.keys["ArrowDown"],
      left: this.keys["ArrowLeft"],
      right: this.keys["ArrowRight"],
      brake: this.keys["Space"],
    };
  }
}
