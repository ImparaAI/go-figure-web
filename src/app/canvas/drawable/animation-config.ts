export class AnimationConfig {
  running: boolean;
  currentStep: number;
  totalSteps: number;
  centering: boolean;
  connecting: boolean;
  centeringDeltaX: number;
  centeringDeltaY: number;

  constructor(animationSteps?: number) {
    this.totalSteps = animationSteps || 25;
    this.clear();
  }

  clear() {
    this.running = false;
    this.currentStep = 0;
    this.centering = false;
    this.connecting = false;
    this.centeringDeltaX = 0;
    this.centeringDeltaY = 0;
  }
}