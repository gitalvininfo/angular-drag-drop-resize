import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { Control, IControl } from './control.model';
import { CardControl } from "./card.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dragDisabled = false;

  dragPosition;

  selectedControl?: Control;
  controls?: Control[];
  cardControls?: CardControl[];
  lockAxis?: any = 'x|y'
  @ViewChildren('resizeBox') resizeBox?: QueryList<ElementRef>;
  @ViewChildren('dragHandleRB') dragHandleRB?: QueryList<ElementRef>;
  // @ViewChildren('dragHandleRight') dragHandleRight?: QueryList<ElementRef>;
  // @ViewChildren('dragHandleBottom') dragHandleBottom?: QueryList<ElementRef>;

  constructor(private zone: NgZone) {
    this.controls = [];
    this.cardControls = [];
  }

  ngOnInit(): void {
    try {
      const position = JSON.parse(localStorage.getItem('position'));
      const defaultPosition = { x: 0, y: 0 }
      this.dragPosition = (position) ? position : defaultPosition;
    } catch (e) {

    }
  }


  addControl(): void {
    const templateControl = new Control();
    templateControl.width = 40;
    templateControl.height = 40;
    templateControl.index = this.controls === undefined ? 0 : this.controls.length;

    this.controls.push(templateControl);
    this.selectedControl = templateControl;

    this.setCreateHandleTransform();
  }


  addCard(): void {
    const templateCard = new CardControl();
    templateCard.width = 100;
    templateCard.height = 100;
    templateCard.index = this.cardControls === undefined ? 0 : this.cardControls.length;

    this.controls.push(templateCard);

    // this.cardControls.push(templateCard);

    console.log(templateCard);

  }

  addWatchlist(): void {
    const templateControl = new Control();
    templateControl.width = 200;
    templateControl.height = 200;
    templateControl.index = this.controls === undefined ? 0 : this.controls.length;

    this.controls.push(templateControl);
    this.selectedControl = templateControl;

    this.setCreateHandleTransform();
  }

  setCreateHandleTransform(): void {
    let rect: any = null;
    this.resizeBox!.changes.subscribe(() => {
      rect = this.resizeBox!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement.getBoundingClientRect();

      this.dragHandleRB!.changes.subscribe(() => {
        this.setHandleTransform(this.dragHandleRB!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'both');
      });

      // this.dragHandleBottom!.changes.subscribe(() => {
      //   this.setHandleTransform(this.dragHandleBottom!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'y');
      // });

      // this.dragHandleRight!.changes.subscribe(() => {
      //   this.setHandleTransform(this.dragHandleRight!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'x');
      // });
    });
  }

  dragMove(dragHandle: HTMLElement, $event: CdkDragMove<any>, control: Control): void {
    // this.selectedControl = control;
    this.zone.runOutsideAngular(() => {
      this.resize(dragHandle, this.resizeBox!.filter((element, index) => index === control.index!)[0].nativeElement);
    });
  }

  resize(dragHandle: HTMLElement, target: HTMLElement): void {

    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // console.warn(dragRect);
    // console.log(targetRect);

    //this.selectedControl!.width = dragRect.left - targetRect.left + dragRect.width;
    //this.selectedControl!.height = dragRect.top - targetRect.top + dragRect.height;

    const width = dragRect.left - targetRect.left + dragRect.width;
    const height = dragRect.top - targetRect.top + dragRect.height;

    // if (width > 200 || height > 200) {
    //   this.dragDisabled = true;
    //   return;
    // }

    //this.selectedControl!.width = width;
    //this.selectedControl!.height = height;
    target.style.width = width + 'px';
    target.style.height = height + 'px';

    this.setUpdateHandleTransform();
  }

  dragEnd(event: CdkDragEnd) {
    // const { offsetHeight, offsetWidth } = event.source.element.nativeElement;
    let { x, y } = event.source.getFreeDragPosition();
    // this.dragPosition = { x: x, y: y };
    // localStorage.setItem("position", JSON.stringify(this.dragPosition));
  }

  clickControl(control: Control): void {
    this.selectedControl = control;
  }


  setUpdateHandleTransform(): void {
    console.log('exppanding....')
    const rect = this.resizeBox!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement.getBoundingClientRect();
    // this.setHandleTransform(this.dragHandleBottom!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'y');
    this.setHandleTransform(this.dragHandleRB!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'both');
    // this.setHandleTransform(this.dragHandleRight!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement, rect, 'x');

  }

  setHandleTransform(dragHandle: HTMLElement, targetRect: ClientRect | DOMRect, position: 'x' | 'y' | 'both'): void {
    const dragRect = dragHandle.getBoundingClientRect();
    const translateX = targetRect.width - dragRect.width;
    const translateY = targetRect.height - dragRect.height;

    // if (position === 'x') {
    //   dragHandle.style.transform = `translate3d(${translateX}px, 0, 0)`;
    // }

    // if (position === 'y') {
    //   dragHandle.style.transform = `translate3d(0, ${translateY}px, 0)`;
    // }

    if (position === 'both') {
      dragHandle.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    }
  }


}
