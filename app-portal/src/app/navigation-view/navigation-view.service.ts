import { Injectable, Signal, computed, inject,signal } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class NavigationViewService {



  isDockVisible = signal<boolean>(true)


    /**設置Dock是否顯示
   * @param {boolean} isDockVisible Dock顯示
   */
    setDockVisible(isDockVisible:boolean){
      this.isDockVisible.set(isDockVisible)
    }

  /**取得Dock是否顯示
   * @returns {boolean} Dock顯示
   */
  getDockVisible():boolean{
    return this.isDockVisible()
  }
}
