import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnimationService {

    animationState: BehaviorSubject<string> = new BehaviorSubject<string>('normal');

    constructor() { }

    setMinimizedState():void {
        this.animationState.next('shortened');
    }

    setNormalState():void {
        this.animationState.next('normal');
    }

    getAnimationState(): BehaviorSubject<string> {
        return this.animationState;
    }
}
