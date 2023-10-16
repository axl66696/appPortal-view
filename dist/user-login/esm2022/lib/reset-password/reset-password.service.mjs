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
     * @return {*}  {Observable<string>}
     * @memberof ResetPasswordService
     */
    getUserCode(payload) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('appPortal.userAccount.userCode', payload);
    }
    /** 將新密碼送至後端更新
     * @param {string} userCode
     * @param {string} passwordHash
     * @memberof ResetPasswordService
     */
    async pubPassword(userCode, passwordHash) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        await this.#jetStreamWsService.publish('appPortal.userAccount.modifyPassword', { 'userCode': userCode, 'passwordHash': passwordHash });
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtcGFzc3dvcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9yZXNldC1wYXNzd29yZC9yZXNldC1wYXNzd29yZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLHNEQUFzRDtBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBSzdELE1BQU0sT0FBTyxvQkFBb0I7SUFFL0I7OztPQUdHO0lBQ0gsUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFFN0IsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFFaEQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxPQUFlO1FBQ3pCLGFBQWE7UUFDYixvQkFBb0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFnQixFQUFFLFlBQW9CO1FBQ3RELGFBQWE7UUFDYixvQkFBb0I7UUFDcEIsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztJQUN2SSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN4QyxDQUFDOzhHQTVDVSxvQkFBb0I7a0hBQXBCLG9CQUFvQixjQUZuQixNQUFNOzsyRkFFUCxvQkFBb0I7a0JBSGhDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudCAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXNldFBhc3N3b3JkU2VydmljZSB7XG5cbiAgLyoqIOiIh05hdHPpgKPmjqXnmoRVcmxcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICAjbmF0c1VybCA9IGVudmlyb25tZW50LndzVXJsO1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKVxuXG4gIC8qKiDku6XlgrPlhaXnmoR0b2tlbuiHs+W+jOerr+aKk+WPluS9v+eUqOiAheS7o+iZn1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgKiBAcmV0dXJuIHsqfSAge09ic2VydmFibGU8c3RyaW5nPn1cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICBnZXRVc2VyQ29kZShwYXlsb2FkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvLyDpnIDluLblhaXmjIflrprnmbzluIPkuLvpoYzku6Xlj4ropoHlgrPpgIHnmoToqIrmga9cbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ2FwcFBvcnRhbC51c2VyQWNjb3VudC51c2VyQ29kZScsIHBheWxvYWQpO1xuICB9XG5cbiAgLyoqIOWwh+aWsOWvhueivOmAgeiHs+W+jOerr+abtOaWsFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlckNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkSGFzaFxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZFNlcnZpY2VcbiAgICovXG4gIGFzeW5jIHB1YlBhc3N3b3JkKHVzZXJDb2RlOiBzdHJpbmcsIHBhc3N3b3JkSGFzaDogc3RyaW5nKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKCdhcHBQb3J0YWwudXNlckFjY291bnQubW9kaWZ5UGFzc3dvcmQnLCB7J3VzZXJDb2RlJzogdXNlckNvZGUsICdwYXNzd29yZEhhc2gnOiBwYXNzd29yZEhhc2h9KTtcbiAgfVxuXG4gIC8qKiBuYXRzIHNlcnZlcumAo+e3mlxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZFNlcnZpY2VcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKSB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLmNvbm5lY3QodGhpcy4jbmF0c1VybCk7XG4gIH1cblxuICAvKiogbmF0cyBzZXJ2ZXLkuK3mlrfpgKPnt5pcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCkge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5kcmFpbigpXG4gIH1cbn1cbiJdfQ==