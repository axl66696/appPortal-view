import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {AppStore} from '@his-viewmodel/app-portal/dist'
import { NavigationService } from './navigation.service';
@Component({
  selector: 'his-navigation',
  standalone: true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [NavigationService]
})
export class NavigationComponent {

  appInfo = signal<AppStore>({} as AppStore)

  navigationService = inject(NavigationService);
  collapsedButtonIcon = computed(() => {
    if (
      !this.navigationService.isCollapsed() &&
      this.navigationService.isShowBody()
    ) {
      return 'pi pi-angle-double-left';
    }
    return 'pi pi-angle-double-right';
  });

  /** 開合導覽列
   * @memberof NavigationComponent
   */
      changeCollapsed(): void {
        this.navigationService.onCollapsClick();
      }
}
