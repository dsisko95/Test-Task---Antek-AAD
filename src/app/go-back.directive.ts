import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGoBack]'
})
export class GoBackDirective implements AfterViewInit {

  frontAction: HTMLElement;
  behindAction: HTMLElement;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

  @HostListener('click') changeVisibleElements() {
    this.renderer2.setStyle(this.frontAction, 'display', 'flex');
    this.renderer2.setStyle(this.behindAction, 'display', 'none');
  }

  ngAfterViewInit() {
    this.frontAction = this.elementRef.nativeElement.parentElement.parentElement.querySelector('#front-action');
    this.behindAction = this.elementRef.nativeElement.parentElement;
  }

}
