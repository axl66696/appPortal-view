import { AppStoreService } from './app-store.service';
import { UserAccountService } from 'dist/service';
import * as i0 from "@angular/core";
export declare class AppStoreComponent {
    #private;
    isGridView: import("@angular/core").WritableSignal<boolean>;
    Options: string[];
    value: string;
    appStoreService: AppStoreService;
    userAccountService: UserAccountService;
    ngOnInit(): Promise<void>;
    /** 返回上一頁
      * @memberof AppStoreComponent
    */
    onBackClick(): void;
    /** 選擇應用程式列表顯示方式
      * @memberof AppStoreComponent
    */
    onSelectedChange(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppStoreComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppStoreComponent, "his-app-store", never, {}, {}, never, never, true, never>;
}
