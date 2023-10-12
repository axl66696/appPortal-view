import { EventEmitter } from '@angular/core';
import { AppStore } from '@his-viewmodel/app-portal/dist';
import { NavigationService } from './navigation.service';
import * as i0 from "@angular/core";
export declare class NavigationComponent {
    setCollapsed: EventEmitter<any>;
    appInfo: import("@angular/core").WritableSignal<AppStore>;
    navigationService: NavigationService;
    collapsedButtonIcon: import("@angular/core").Signal<"pi pi-angle-double-left" | "pi pi-angle-double-right">;
    /** 開合導覽列
     * @memberof NavigationComponent
     */
    changeCollapsed(isCollapsed: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NavigationComponent, "his-navigation", never, {}, { "setCollapsed": "setCollapsed"; }, never, never, true, never>;
}
