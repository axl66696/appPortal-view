import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from '../environments/environment';
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
        // 連線關閉前，會先將目前訂閱給排空
        await this.#jetStreamWsService.drain();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtbmF0cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdXNlci1sb2dpbi9zcmMvbGliL3dzLW5hdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSzFELE1BQU0sT0FBTyxhQUFhO0lBRXhCOzs7T0FHRztJQUNILFFBQVEsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBRTdCLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWpEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ2QsbUJBQW1CO1FBQ25CLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3pDLENBQUM7OEdBdkJVLGFBQWE7a0hBQWIsYUFBYSxjQUZaLE1BQU07OzJGQUVQLGFBQWE7a0JBSHpCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBXc05hdHNTZXJ2aWNlIHtcblxuICAvKiog6IiHTmF0c+mAo+aOpeeahFVybFxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgV3NOYXRzU2VydmljZVxuICAgKi9cbiAgI25hdHNVcmwgPSBlbnZpcm9ubWVudC53c1VybDtcblxuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cbiAgLyoqIOiIh05hdHPpgKPmjqVcbiAgICogQG1lbWJlcm9mIFdzTmF0c1NlcnZpY2VcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKSB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLmNvbm5lY3QodGhpcy4jbmF0c1VybCk7XG4gIH1cblxuICAvKiog6IiHTmF0c+aWt+mWi+mAo+aOpVxuICAgKiBAbWVtYmVyb2YgV3NOYXRzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgZGlzY29ubmVjdCgpIHtcbiAgICAvLyDpgKPnt5rpl5zplonliY3vvIzmnIPlhYjlsIfnm67liY3oqILplrHntabmjpLnqbpcbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UuZHJhaW4oKTtcbiAgfVxufVxuIl19