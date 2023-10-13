/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import jsSHA from 'jssha';
import * as i0 from "@angular/core";
export class LoginService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 取得使用者權杖
     * @param {LoginReq} payload
     * @return {*}  {Promise<Msg>}
     * @memberof LoginService
     */
    getUserToken(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        return this.#jetStreamWsService.request('UserAccount.GetUserToken', payload);
    }
    /** 加密密碼
     * @param {string} password
     * @return {*}  {string}
     * @memberof LoginService
     */
    getHashPassword(password) {
        const shaObj = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
        shaObj.update(password);
        return shaObj.getHash('HEX');
    }
    /** 取得使用者帳號資訊
     * @param {string} payload
     * @return {*}  {Promise<UserAccount>}
     * @memberof LoginService
     */
    getUserAccount(payload) {
        return this.#jetStreamWsService.request('UserAccount.GetUserAccount', payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: LoginService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: LoginService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: LoginService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9sb2dpbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDtBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQWEsa0JBQWtCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUUzRSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7O0FBSzFCLE1BQU0sT0FBTyxZQUFZO0lBRXZCLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWpEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsT0FBaUI7UUFDNUIsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDOUUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsUUFBZ0I7UUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE9BQWU7UUFDNUIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ2hGLENBQUM7OEdBakNVLFlBQVk7a0hBQVosWUFBWSxjQUZYLE1BQU07OzJGQUVQLFlBQVk7a0JBSHhCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50ICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBsYXN0VmFsdWVGcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKU09OQ29kZWMsIEpldHN0cmVhbVdzU2VydmljZX0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbmltcG9ydCB7IExvZ2luUmVxLCBVc2VyQWNjb3VudCwgVXNlclRva2VuIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0JztcbmltcG9ydCBqc1NIQSBmcm9tICdqc3NoYSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XG5cbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpO1xuXG4gIC8qKiDlj5blvpfkvb/nlKjogIXmrIrmnZZcbiAgICogQHBhcmFtIHtMb2dpblJlcX0gcGF5bG9hZFxuICAgKiBAcmV0dXJuIHsqfSAge1Byb21pc2U8TXNnPn1cbiAgICogQG1lbWJlcm9mIExvZ2luU2VydmljZVxuICAgKi9cbiAgZ2V0VXNlclRva2VuKHBheWxvYWQ6IExvZ2luUmVxKTogT2JzZXJ2YWJsZTxVc2VyVG9rZW4+e1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvLyDpnIDluLblhaXmjIflrprnmoTkuLvpoYzot5/opoHlgrPpgZ7nmoTos4fmlplcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBY2NvdW50LkdldFVzZXJUb2tlbicsIHBheWxvYWQpXG4gIH1cblxuICAvKiog5Yqg5a+G5a+G56K8XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZFxuICAgKiBAcmV0dXJuIHsqfSAge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIExvZ2luU2VydmljZVxuICAgKi9cbiAgZ2V0SGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNoYU9iaiA9IG5ldyBqc1NIQSgnU0hBMy0yNTYnLCAnVEVYVCcsIHsgZW5jb2Rpbmc6ICdVVEY4JyB9KTtcbiAgICBzaGFPYmoudXBkYXRlKHBhc3N3b3JkKTtcbiAgICByZXR1cm4gc2hhT2JqLmdldEhhc2goJ0hFWCcpO1xuICB9XG5cbiAgLyoqIOWPluW+l+S9v+eUqOiAheW4s+iZn+izh+ioilxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgKiBAcmV0dXJuIHsqfSAge1Byb21pc2U8VXNlckFjY291bnQ+fVxuICAgKiBAbWVtYmVyb2YgTG9naW5TZXJ2aWNlXG4gICAqL1xuICBnZXRVc2VyQWNjb3VudChwYXlsb2FkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFVzZXJBY2NvdW50PntcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBY2NvdW50LkdldFVzZXJBY2NvdW50JywgcGF5bG9hZClcbiAgfVxufVxuIl19