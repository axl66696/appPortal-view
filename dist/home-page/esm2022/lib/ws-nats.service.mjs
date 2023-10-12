import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from './environments/environment';
import * as i0 from "@angular/core";
export class WsNatsService {
    /** 與Nats連接的Url
     * @type {string}
     * @memberof WsNatsService
     */
    #natsUrl = environment.wsUrl;
    #jetStreamWsService = inject(JetstreamWsService);
    /** 與Nats連接
     * @memberof WsNatsService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#natsUrl);
    }
    /** 與Nats斷開連接
     * @memberof WsNatsService
     */
    async disconnect() {
        await this.#jetStreamWsService.drain();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtbmF0cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vaG9tZS1wYWdlL3NyYy9saWIvd3MtbmF0cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFLekQsTUFBTSxPQUFPLGFBQWE7SUFDeEI7OztPQUdHO0lBQ0gsUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFFN0IsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFakQ7O09BRUc7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzhHQXJCVSxhQUFhO2tIQUFiLGFBQWEsY0FGWixNQUFNOzsyRkFFUCxhQUFhO2tCQUh6QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgV3NOYXRzU2VydmljZSB7XG4gIC8qKiDoiIdOYXRz6YCj5o6l55qEVXJsXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBXc05hdHNTZXJ2aWNlXG4gICAqL1xuICAjbmF0c1VybCA9IGVudmlyb25tZW50LndzVXJsO1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuICAvKiog6IiHTmF0c+mAo+aOpVxuICAgKiBAbWVtYmVyb2YgV3NOYXRzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgY29ubmVjdCgpIHtcbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UuY29ubmVjdCh0aGlzLiNuYXRzVXJsKTtcbiAgfVxuXG4gIC8qKiDoiIdOYXRz5pa36ZaL6YCj5o6lXG4gICAqIEBtZW1iZXJvZiBXc05hdHNTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCkge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5kcmFpbigpO1xuICB9XG59XG4iXX0=