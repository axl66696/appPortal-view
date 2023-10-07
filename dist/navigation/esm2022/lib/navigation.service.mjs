import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import * as i0 from "@angular/core";
export class NavigationService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmF2aWdhdGlvbi9zcmMvbGliL25hdmlnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFlLE1BQU0saUJBQWlCLENBQUM7QUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBSXRELE1BQU0sT0FBTyxpQkFBaUI7SUFIOUI7UUFLRSxnQkFBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixXQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLFdBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBc0IsRUFBRSxDQUFDLENBQUMsWUFBWSxhQUFhLENBQUMsQ0FDOUQsQ0FBQztRQUNGLGlCQUFZLEdBQW9DLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEUsZUFBVSxHQUFvQixRQUFRLENBQUMsR0FBRyxFQUFFO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxhQUFhLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFbEUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBbUIsQ0FBQztZQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLE9BQU8sQ0FBQyxDQUFBO1lBQ2xKLE9BQU8sS0FBSyxDQUFDLGlCQUFpQixLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxPQUFPLENBQUM7UUFDL0gsQ0FBQyxDQUFDLENBQUM7S0FTSjtJQU5HOztJQUVBO0lBQ0EsY0FBYztRQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs4R0F4QlEsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FGaEIsTUFBTTs7MkZBRVAsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFNpZ25hbCwgY29tcHV0ZWQsIGluamVjdCxzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25FbmQsIFJvdXRlciwgUm91dGVyRXZlbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0b1NpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25TZXJ2aWNlIHtcblxuICBpc0NvbGxhcHNlZCA9IHNpZ25hbCh0cnVlKTtcbiAgcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gIGV2ZW50JCA9IHRoaXMucm91dGVyLmV2ZW50cy5waXBlKFxuICAgIGZpbHRlcigoZSk6IGUgaXMgTmF2aWdhdGlvbkVuZCA9PiBlIGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXG4gICk7XG4gIHJvdXRlclNpZ25hbDogU2lnbmFsPFJvdXRlckV2ZW50IHwgdW5kZWZpbmVkPiA9IHRvU2lnbmFsKHRoaXMuZXZlbnQkKTtcblxuICBpc1Nob3dCb2R5OiBTaWduYWw8Ym9vbGVhbj4gPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnJvdXRlclNpZ25hbCgpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCEodGhpcy5yb3V0ZXJTaWduYWwoKSBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgZXZlbnQgPSB0aGlzLnJvdXRlclNpZ25hbCgpIGFzIE5hdmlnYXRpb25FbmQ7XG4gICAgY29uc29sZS5sb2coXCJpcyB0aGUgdmlldz9cIiwgZXZlbnQudXJsQWZ0ZXJSZWRpcmVjdHMgIT09ICcvYXBwU3RvcmUnICYmIGV2ZW50LnVybEFmdGVyUmVkaXJlY3RzICE9PSAnL2hvbWUnICYmIGV2ZW50LnVybEFmdGVyUmVkaXJlY3RzICE9PSAnL25ld3MnKVxuICAgIHJldHVybiBldmVudC51cmxBZnRlclJlZGlyZWN0cyAhPT0gJy9hcHBTdG9yZScgJiYgZXZlbnQudXJsQWZ0ZXJSZWRpcmVjdHMgIT09ICcvaG9tZScgJiYgZXZlbnQudXJsQWZ0ZXJSZWRpcmVjdHMgIT09ICcvbmV3cyc7XG4gIH0pO1xuXG5cbiAgICAvKiogbmF2aWdhdGlvbuaUtuWQiFxuICAgICogQG1lbWJlcm9mIE5hdmlnYXRpb25TZXJ2aWNlXG4gICovXG4gICAgb25Db2xsYXBzQ2xpY2soKTogdm9pZCB7XG4gICAgICB0aGlzLmlzQ29sbGFwc2VkLnNldCghdGhpcy5pc0NvbGxhcHNlZCgpKTtcbiAgICB9XG59XG5cblxuIl19