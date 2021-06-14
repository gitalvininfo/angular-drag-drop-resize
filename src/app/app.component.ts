import { CdkDragDrop, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { CardControl } from "./card.model";
import { Control } from './control.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dragDisabled = false;

  sidebarCards: Control[] = [
    { width: 200, height: 200, index: 0, xAxis: 1, yAxis: 1, cardType: "watchlist" },
    { width: 200, height: 200, index: 1, xAxis: 2, yAxis: 2, cardType: "open entries table" },
    { width: 200, height: 200, index: 2, xAxis: 3, yAxis: 3, cardType: "strategies" }
  ];

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
    // this.controls = [];
    this.cardControls = [];
  }

  ngOnInit(): void {
    try {
      // const position = JSON.parse(localStorage.getItem('position'));
      // const defaultPosition = { x: 0, y: 0 }
      // this.dragPosition = (position) ? position : defaultPosition;


      const cards = JSON.parse(localStorage.getItem('controls'));

      this.controls = (cards) ? cards : [];

    } catch (e) {

    }
  }


  counter = 0;
  addWatchlist(type: string): void {
    const templateControl = new Control();
    templateControl.width = (type === 'watchlist') ? 454 : 500;
    templateControl.height = 349;
    templateControl.xAxis = 0;
    templateControl.yAxis = 0;
    templateControl.cardType = type;
    templateControl.dragFreePosition = {
      x: 0,
      y: 0
    }

    templateControl.index = this.controls === undefined ? 0 : this.controls.length;

    this.controls.push(templateControl);
    this.selectedControl = templateControl;
    this.setCreateHandleTransform();
  }

  setCreateHandleTransform(): void {
    let rect: any = null;
    this.resizeBox!.changes.subscribe(() => {
      rect = this.resizeBox!.filter((element, index) => index === this.selectedControl!.index!)[0].nativeElement.getBoundingClientRect();

      // console.warn(this.dragHandleRB)

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

    console.warn(dragRect);
    console.log(targetRect);
    // console.log(this.selectedControl);

    // console.log('&&&', this.selectedControl)

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


  dragger(control: Control) {
    let i = control.index;
    let aw: HTMLElement = this.resizeBox!.filter((element, index) => index === control.index!)[0].nativeElement;
    this.controls[i].width = aw.getBoundingClientRect().width;
    this.controls[i].height = aw.getBoundingClientRect().height;
    localStorage.setItem("controls", JSON.stringify(this.controls));

  }

  dragEnd(event: CdkDragEnd, control: Control) {
    let aw: HTMLElement = this.resizeBox!.filter((element, index) => index === control.index!)[0].nativeElement;

    // console.warn({
    //   freedrag: event.source.getFreeDragPosition(),
    //   distance: event.distance,
    //   droppoint: event.dropPoint,
    // })
    

    console.log(aw.style.transform)

    // console.log(aw.style.getPropertyValue('transform'))

    // const offset = { ...(<any>event.source._dragRef)._passiveTransform };

    // const axisX = this.initialPosition.x + this.offset.x;
    // this.position.y = this.initialPosition.y + this.offset.y;

    // console.log(this.position, this.initialPosition, this.offset);
    // console.log(aw.getBoundingClientRect())

    // console.log(offset)


    let i = control.index;
    // const { offsetHeight, offsetWidth } = event.source.element.nativeElement;
    let { x, y } = event.source.getFreeDragPosition();
    this.controls[i].xAxis = x;
    this.controls[i].yAxis = y;
    this.controls[i].width = aw.getBoundingClientRect().width;
    this.controls[i].height = aw.getBoundingClientRect().height;
    this.controls[i].dragFreePosition = {
      x: x,
      y: y
    }


    // console.warn(this.controls)

    localStorage.setItem("controls", JSON.stringify(this.controls));

    // this.dragPosition = { x: x, y: y };
    // localStorage.setItem("position", JSON.stringify(this.dragPosition));
  }

  clickControl(control: Control): void {
    this.selectedControl = control;
  }


  setUpdateHandleTransform(): void {
    // console.log('exppanding....')
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
      // console.warn('transformmm....', translateX, translateY)
      dragHandle.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    }
  }


  onDropList(event: CdkDragDrop<any[]>) {
    this.addWatchlist('watchlist')
  }

}
