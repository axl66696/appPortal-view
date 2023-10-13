/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from '../../environments/environment';
import * as i0 from "@angular/core";
export class ResetPasswordService {
    /** 與Nats連接的Url
     * @type {string}
     * @memberof ResetPasswordService
     */
    #natsUrl = environment.wsUrl;
    #jetStreamWsService = inject(JetstreamWsService);
    /** 以傳入的token至後端抓取使用者代號
     * @param {string} payload
     * @return {*}  {Promise<string>}
     * @memberof ResetPasswordService
     */
    getUserCode(payload) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('UserAccount.GetUserCode', payload);
    }
    /** 將新密碼送至後端更新
     * @param {string} userCode
     * @param {string} passwordHash
     * @memberof ResetPasswordService
     */
    async pubPassword(userCode, passwordHash) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        await this.#jetStreamWsService.publish('UserAccount.UpdatePassword', { 'userCode': userCode, 'passwordHash': passwordHash });
    }
    /** nats server連線
     * @memberof ResetPasswordService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#natsUrl);
    }
    /** nats server中斷連線
     * @memberof ResetPasswordService
     */
    async disconnect() {
        await this.#jetStreamWsService.drain();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ResetPasswordService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ResetPasswordService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ResetPasswordService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtcGFzc3dvcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9yZXNldC1wYXNzd29yZC9yZXNldC1wYXNzd29yZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLHNEQUFzRDtBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQWEsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBSzdELE1BQU0sT0FBTyxvQkFBb0I7SUFFL0I7OztPQUdHO0lBQ0gsUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFFN0IsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFFaEQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxPQUFlO1FBQ3pCLGFBQWE7UUFDYixvQkFBb0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFnQixFQUFFLFlBQW9CO1FBQ3RELGFBQWE7UUFDYixvQkFBb0I7UUFDcEIsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztJQUM3SCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN4QyxDQUFDOzhHQTVDVSxvQkFBb0I7a0hBQXBCLG9CQUFvQixjQUZuQixNQUFNOzsyRkFFUCxvQkFBb0I7a0JBSGhDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgIE9ic2VydmFibGUsIGxhc3RWYWx1ZUZyb20gfSBmcm9tICdyeGpzJztcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudCAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKU09OQ29kZWMsIEpldHN0cmVhbVdzU2VydmljZSB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmRTZXJ2aWNlIHtcblxuICAvKiog6IiHTmF0c+mAo+aOpeeahFVybFxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZFNlcnZpY2VcbiAgICovXG4gICNuYXRzVXJsID0gZW52aXJvbm1lbnQud3NVcmw7XG5cbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpXG5cbiAgLyoqIOS7peWCs+WFpeeahHRva2Vu6Iez5b6M56uv5oqT5Y+W5L2/55So6ICF5Luj6JmfXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEByZXR1cm4geyp9ICB7UHJvbWlzZTxzdHJpbmc+fVxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZFNlcnZpY2VcbiAgICovXG4gIGdldFVzZXJDb2RlKHBheWxvYWQ6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFjY291bnQuR2V0VXNlckNvZGUnLCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8qKiDlsIfmlrDlr4bnorzpgIHoh7Plvoznq6/mm7TmlrBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZEhhc2hcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBwdWJQYXNzd29yZCh1c2VyQ29kZTogc3RyaW5nLCBwYXNzd29yZEhhc2g6IHN0cmluZykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvLyDpnIDluLblhaXmjIflrprnmbzluIPkuLvpoYzku6Xlj4ropoHlgrPpgIHnmoToqIrmga9cbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaCgnVXNlckFjY291bnQuVXBkYXRlUGFzc3dvcmQnLCB7J3VzZXJDb2RlJzogdXNlckNvZGUsICdwYXNzd29yZEhhc2gnOiBwYXNzd29yZEhhc2h9KTtcbiAgfVxuXG4gIC8qKiBuYXRzIHNlcnZlcumAo+e3mlxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZFNlcnZpY2VcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKSB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLmNvbm5lY3QodGhpcy4jbmF0c1VybCk7XG4gIH1cblxuICAvKiogbmF0cyBzZXJ2ZXLkuK3mlrfpgKPnt5pcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCkge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5kcmFpbigpXG4gIH1cbn1cbiJdfQ==