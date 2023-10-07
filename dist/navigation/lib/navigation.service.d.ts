import { Signal } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import * as i0 from "@angular/core";
export declare class NavigationService {
    isCollapsed: import("@angular/core").WritableSignal<boolean>;
    router: Router;
    event$: import("rxjs").Observable<NavigationEnd>;
    routerSignal: Signal<RouterEvent | undefined>;
    isShowBody: Signal<boolean>;
    /** navigation收合
    * @memberof NavigationService
  */
    onCollapsClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NavigationService>;
}
