import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimationService } from './shared/set-animation.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpDataService } from './shared/http-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('matState', [
      state('normal', style({
        'height': '90%',
      })),
      state('shortened', style({
        'height': '58%'
      })),
      transition('normal => shortened', [animate(200)]),
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'phone-book';
  matState: string;
  subscription: Subscription = new Subscription();

  constructor(private animationService: AnimationService, private httpService: HttpDataService) { }

  ngOnInit() {
    this.subscription = this.animationService.getAnimationState()
      .subscribe(data => {
        this.matState = data;
      });
    this.httpService.getContacts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.httpService.subscription.unsubscribe();
  }

}

