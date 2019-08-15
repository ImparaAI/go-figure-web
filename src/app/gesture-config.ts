import * as hammer from 'hammerjs';
import { GestureConfig, HammerInstance, HammerManager } from '@angular/material';

export class PatchedGestureConfig extends GestureConfig {

  buildHammer (element: HTMLElement): HammerInstance {
    const mc = <HammerManager> super.buildHammer(element);
    const pinch = new hammer.Pinch();

    mc.add(pinch);

    return <HammerInstance> mc;
  }
}