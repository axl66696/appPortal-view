import * as i0 from '@angular/core';
import { signal, inject, computed, Injectable, EventEmitter, Component, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from 'primeng/button';
import { ButtonModule } from 'primeng/button';

class NavigationService {
    constructor() {
        this.isCollapsed = signal(true);
        this.router = inject(Router);
        this.event$ = this.router.events.pipe(filter((e) => e instanceof NavigationEnd));
        this.routerSignal = toSignal(this.event$);
        this.isShowBody = computed(() => {
            if (!this.routerSignal())
                return false;
            if (!(this.routerSignal() instanceof NavigationEnd))
                return false;
            let event = this.routerSignal();
            console.log("is the view?", event.urlAfterRedirects !== '/appStore' && event.urlAfterRedirects !== '/home' && event.urlAfterRedirects !== '/news');
            return event.urlAfterRedirects !== '/appStore' && event.urlAfterRedirects !== '/home' && event.urlAfterRedirects !== '/news';
        });
    }
    /** navigation收合
    * @memberof NavigationService
  */
    onCollapsClick() {
        this.isCollapsed.set(!this.isCollapsed());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NavigationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NavigationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class NavigationComponent {
    constructor() {
        this.setCollapsed = new EventEmitter;
        this.appInfo = signal({});
        this.navigationService = inject(NavigationService);
        this.collapsedButtonIcon = computed(() => {
            if (!this.navigationService.isCollapsed() &&
                this.navigationService.isShowBody()) {
                console.log('pi pi-angle-double-left');
                return 'pi pi-angle-double-left';
            }
            return 'pi pi-angle-double-right';
        });
    }
    /** 開合導覽列
     * @memberof NavigationComponent
     */
    changeCollapsed(isCollapsed) {
        this.navigationService.onCollapsClick();
        this.setCollapsed.emit(!isCollapsed);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NavigationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: NavigationComponent, isStandalone: true, selector: "his-navigation", outputs: { setCollapsed: "setCollapsed" }, providers: [NavigationService], ngImport: i0, template: "\n  <div class=\"navigation-container\">\n    <div class=\"navigation-header\" [ngClass]=\"{'collapsed-inactive': !navigationService.isCollapsed}\">\n      <ng-container *ngIf=\"navigationService.isCollapsed\">\n        <div class=\"m-1\">\n          <span class=\"material-symbols-outlined\">\n            {{appInfo().icon}}\n          </span>\n        </div>\n        <div>\n          <div>{{appInfo().title}}</div>\n        </div>\n      </ng-container>\n      <ng-container *ngIf=\"navigationService.isShowBody()\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          (click)=\"changeCollapsed(navigationService.isCollapsed())\"\n          icon=\"{{ this.collapsedButtonIcon() }}\"\n          class=\"p-button-rounded p-button-text\"\n        > </button>\n      </ng-container>\n    </div>\n    <!-- <ng-container *ngIf=\"navigationService.isShowBody()\">\n      <his-navigation-body class=\"navigation-body\" [bodyItems]=\"navigationBodyItems()\" [iscollapsed]=\"navigationService.isCollapseNavigation()\"></his-navigation-body>\n    </ng-container>\n    <his-navigation-footer></his-navigation-footer> -->\n  </div>\n\n", styles: [":host ::ng-deep .navigation-header .p-button.p-button-icon-only.p-button-rounded.p-button-text{color:var(--primary-main)}:host ::ng-deep .appList .p-dialog-content .p-button.p-button-icon-only .pi,:host ::ng-deep .navigation-footer .p-button.p-button-icon-only .pi{font-size:1.2rem}.layout-sidebar{position:fixed;display:flex;justify-content:center;width:60px;height:100%;z-index:999;overflow-y:auto;-webkit-user-select:none;user-select:none;top:0;left:0;transition:transform .2s,left .2s;background-color:var(--surface-overlay);border-right:1px solid var(--outline-variant);padding:.5rem 0rem;border-radius:0;box-shadow:none}.layout-sidebar.collapsed-inactive{width:200px}.layout-content{margin-left:60px;height:100%}.layout-content.collapsed-inactive{margin-left:200px}.systemTitle{font-size:20px;font-style:normal;font-weight:500;line-height:100%}.navigation-container{height:100%;width:100%;display:flex;flex-direction:column;justify-content:space-between;gap:2px;padding-bottom:10px}.navigation-body{flex:1}.navigation-header{width:100%;display:flex;align-items:center;justify-content:center}.navigation-header.collapsed-inactive{justify-content:space-between}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i2.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NavigationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-navigation', standalone: true, imports: [CommonModule, ButtonModule], providers: [NavigationService], template: "\n  <div class=\"navigation-container\">\n    <div class=\"navigation-header\" [ngClass]=\"{'collapsed-inactive': !navigationService.isCollapsed}\">\n      <ng-container *ngIf=\"navigationService.isCollapsed\">\n        <div class=\"m-1\">\n          <span class=\"material-symbols-outlined\">\n            {{appInfo().icon}}\n          </span>\n        </div>\n        <div>\n          <div>{{appInfo().title}}</div>\n        </div>\n      </ng-container>\n      <ng-container *ngIf=\"navigationService.isShowBody()\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          (click)=\"changeCollapsed(navigationService.isCollapsed())\"\n          icon=\"{{ this.collapsedButtonIcon() }}\"\n          class=\"p-button-rounded p-button-text\"\n        > </button>\n      </ng-container>\n    </div>\n    <!-- <ng-container *ngIf=\"navigationService.isShowBody()\">\n      <his-navigation-body class=\"navigation-body\" [bodyItems]=\"navigationBodyItems()\" [iscollapsed]=\"navigationService.isCollapseNavigation()\"></his-navigation-body>\n    </ng-container>\n    <his-navigation-footer></his-navigation-footer> -->\n  </div>\n\n", styles: [":host ::ng-deep .navigation-header .p-button.p-button-icon-only.p-button-rounded.p-button-text{color:var(--primary-main)}:host ::ng-deep .appList .p-dialog-content .p-button.p-button-icon-only .pi,:host ::ng-deep .navigation-footer .p-button.p-button-icon-only .pi{font-size:1.2rem}.layout-sidebar{position:fixed;display:flex;justify-content:center;width:60px;height:100%;z-index:999;overflow-y:auto;-webkit-user-select:none;user-select:none;top:0;left:0;transition:transform .2s,left .2s;background-color:var(--surface-overlay);border-right:1px solid var(--outline-variant);padding:.5rem 0rem;border-radius:0;box-shadow:none}.layout-sidebar.collapsed-inactive{width:200px}.layout-content{margin-left:60px;height:100%}.layout-content.collapsed-inactive{margin-left:200px}.systemTitle{font-size:20px;font-style:normal;font-weight:500;line-height:100%}.navigation-container{height:100%;width:100%;display:flex;flex-direction:column;justify-content:space-between;gap:2px;padding-bottom:10px}.navigation-body{flex:1}.navigation-header{width:100%;display:flex;align-items:center;justify-content:center}.navigation-header.collapsed-inactive{justify-content:space-between}\n"] }]
        }], propDecorators: { setCollapsed: [{
                type: Output
            }] } });

/*
 * Public API Surface of navigation
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NavigationComponent, NavigationService };
//# sourceMappingURL=his-view-navigation.mjs.map
