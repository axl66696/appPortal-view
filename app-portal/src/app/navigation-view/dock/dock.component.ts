import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { easeOut } from './dock-animation';
import { AppStoreService } from 'dist/app-store';
import { NavigationViewService } from '../navigation-view.service'
@Component({
  selector: 'his-dock',
  standalone: true,
  imports: [CommonModule,ButtonModule,DividerModule,ImageModule],
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  animations: [easeOut]
})
export class DockComponent {

  hoveredItemIndex: string | null = null;
  hoveredAppId: string | null = null;
  focusedIndex: string = "";
  isShiftKeyPressed: boolean = true;
  isDockDisplay: boolean = true;
  isCursorOnDock: boolean = false;
  appStoreService = inject(AppStoreService)
  navigationViewService = inject(NavigationViewService)
  #router = inject(Router);


  /** 判斷shift+tab觸發dock顯示
   * @param {KeyboardEvent} event
   * @memberof DockerComponent
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {

    // 檢查 'Shift' 鍵是否被按下
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();

       if(this.navigationViewService.getDockVisible() === false){
        this.isDockDisplay = false
      }
      else{
        this.isDockDisplay = true;
      }
    }
    if (event.key === 'F5' || (event.metaKey && event.key === 'r')||event.key === 'Tab') {
      event.preventDefault();
  }
  }

  /** 放開shift觸發dock關閉
   * @param {KeyboardEvent} event
   * @memberof DockerComponent
   */
  @HostListener('window:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    // 檢查 'Shift' 鍵是否被釋放
    if (event.key === 'Shift') {
      this.isDockDisplay = false;
    }
  }

  /** 偵測滑鼠距離top 20px內觸發dock顯示
   * @param {MouseEvent} event
   * @memberof DockerComponent
   */
  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    const buffer = 20; // 10 pixels buffer
    if (!this.isCursorOnDock) {
      if (event.clientY < buffer && this.navigationViewService.getDockVisible()== true) {

        this.isDockDisplay = true;
      }
      else {
        this.isDockDisplay = false;

      }
    }
  }

  /** 偵測滑鼠移到icon
   * @param {string} index
   * @memberof DockerComponent
   */
  onMouseOver(index: string): void {
    this.focusedIndex = index;
    // console.log(this.navigationFooterService.getDockVisible())
  }

  /** 偵測滑鼠移出icon
   * @memberof DockerComponent
   */
  onMouseLeave(): void {
    this.focusedIndex = "";
    this.hoveredAppId = null;
  }

  /** 偵測滑鼠在dock上
   * @memberof DockerComponent
   */
  onMouseOverDock() {
      this.isCursorOnDock = true;
  }

  /** 偵測滑鼠移出dock
   * @memberof DockerComponent
   */
  onMouseLeaveDock() {
    this.isCursorOnDock = false;
  }

  /** 點擊icon並跳轉頁面
   * @param {string} path
   * @memberof DockerComponent
   */
  onIconClick(path: string): void {
    this.#router.navigate([path])
  }

  /** 點擊icon上的取消關閉
   * @param {string} path
   * @memberof DockerComponent
   */
  onCancelClick(appId: string): void {
    this.appStoreService.setAppClose(appId)
  }

  /** hovor icon css效果
   * @param {string} index
   * @memberof DockerComponent
   */
  getTransform(index: string): string {
    if (index === this.focusedIndex) {
      return 'scale(1.15)';
    } else {
      return 'scale(1) translateY(0px)';
    }
  }
}
