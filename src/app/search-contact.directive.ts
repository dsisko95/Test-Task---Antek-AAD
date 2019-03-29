import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSearchContact]'
})
export class SearchContactDirective implements AfterViewInit {

  frontAction: HTMLElement;
  behindAction: HTMLElement;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

  @HostListener('click') changeVisibleElements() {
    this.renderer2.setStyle(this.frontAction, 'display', 'none');
    this.renderer2.setStyle(this.behindAction, 'display', 'flex');
  }

  ngAfterViewInit() {
    this.frontAction = this.elementRef.nativeElement.parentElement;
    this.behindAction = this.elementRef.nativeElement.parentElement.nextSibling;
  }

}
