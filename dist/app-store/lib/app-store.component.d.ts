import { AppStoreService } from './app-store.service';
import * as i0 from "@angular/core";
export declare class AppStoreComponent {
    #private;
    isGridView: import("@angular/core").WritableSignal<boolean>;
    appStoreService: AppStoreService;
    Options: any[];
    value: string;
    /** 返回上一頁
      * @memberof AppStoreComponent
    */
    onBackClick(): void;
    /** 選擇應用程式列表顯示方式
      * @memberof AppStoreComponent
    */
    onSelectedChange(): void;
    ngOnInit(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppStoreComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppStoreComponent, "his-app-store", never, {}, {}, never, never, true, never>;
}
