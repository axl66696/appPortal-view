import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStoreService } from './app-store.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { SharedService } from '@his-base/shared';
import { CardListComponent } from '@his-directive/card-list/dist/card-list'
import { WsNatsService } from './ws-nats.service';
import { UserAccount } from '@his-viewmodel/app-portal/dist';
import * as _ from 'lodash';



@Component({
  selector: 'his-app-store',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    SelectButtonModule,
    FormsModule,
    InputTextModule,
    AvatarModule,
    CardListComponent
  ],
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss'],
})
export class AppStoreComponent {

  isGridView = signal<boolean>(true);
  appStoreService = inject(AppStoreService);
  #sharedService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);
  Options: any[] = [
    { icon: 'material-symbols-outlined', label: 'grid_view' ,value: 'grid'},
    { icon: 'material-symbols-outlined', label: 'view_agenda' ,value: 'list'},
  ];
  value = 'grid';


  /** 返回上一頁
    * @memberof AppStoreComponent
  */
  onBackClick() {
    window.history.back();
  }

  /** 選擇應用程式列表顯示方式
    * @memberof AppStoreComponent
  */
  onSelectedChange() {
    if (this.value === 'grid') {
      this.isGridView.set(true);
    } else {
      this.isGridView.set(false);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  async ngOnInit(){
    await this.#wsNatsService.connect();
    await this.appStoreService.initAppStore();
    // console.log(this.#sharedService.getValue(history.state.token));
  }

}
