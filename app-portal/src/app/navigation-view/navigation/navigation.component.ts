import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {AppStore} from '@his-viewmodel/app-portal/dist'
import { NavigationService } from './navigation.service';
import { FooterComponent } from './footer/footer.component';
import { AppStoreService } from 'dist/app-store';
import { WsNatsService } from '../../ws-nats.service';

@Component({
  selector: 'his-navigation',
  standalone: true,
  imports: [CommonModule,ButtonModule,FooterComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  appInfo = signal<AppStore>({} as AppStore)
  navigationService = inject(NavigationService);
  collapsedButtonIcon = computed(() => {
    if (
      !this.navigationService.isCollapsed() &&
      this.navigationService.isShowBody()
    ) {
      console.log('pi pi-angle-double-left')
      return 'pi pi-angle-double-left';
    }
    return 'pi pi-angle-double-right';
  });
  appStoreService = inject(AppStoreService);
  wsNatsService = inject(WsNatsService);
  async ngOnInit() {
    await this.wsNatsService.connect();
    await this.appStoreService.initAppStore()
  }
  /** 開合導覽列
   * @memberof NavigationComponent
   */
  changeCollapsed(): void {
    this.navigationService.onCollapsClick()
  }
}
