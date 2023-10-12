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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserAccountService } from 'dist/service';
import * as SelectButtonOption from '../assets/option/ SelectButtonOption.json'
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
    CardListComponent,
    TranslateModule
  ],
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss'],
})
export class AppStoreComponent {

  isGridView = signal<boolean>(true);
  Options: string[] = [];
  value = 'grid';
  appStoreService = inject(AppStoreService);
  userAccountService = inject(UserAccountService);
  #sharedService = inject(SharedService);
  #translate = inject(TranslateService)




  async ngOnInit(){
    this.#translate.setDefaultLang(`zh-Hant`)
    this.Options = Object.values(SelectButtonOption)[0] as unknown as string[];
  }

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

}
