import { Injectable, Signal, computed, inject,signal } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  isCollapsed = signal(true);
  router = inject(Router);
  event$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
  );
  routerSignal: Signal<RouterEvent | undefined> = toSignal(this.event$);

  isShowBody: Signal<boolean> = computed(() => {
    if (!this.routerSignal()) return false;
    if (!(this.routerSignal() instanceof NavigationEnd)) return false;

    let event = this.routerSignal() as NavigationEnd;
    console.log("is the view?", event.urlAfterRedirects !== '/appStore' && event.urlAfterRedirects !== '/home' && event.urlAfterRedirects !== '/news')
    return event.urlAfterRedirects !== '/appStore' && event.urlAfterRedirects !== '/home' && event.urlAfterRedirects !== '/news';
  });


    /** navigation收合
    * @memberof NavigationService
  */
    onCollapsClick(): void {
      this.isCollapsed.set(!this.isCollapsed());
    }
}


