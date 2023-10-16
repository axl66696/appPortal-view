/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import jsSHA from 'jssha';
import * as i0 from "@angular/core";
export class LoginService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 取得使用者權杖
     * @param {LoginReq} payload
     * @return {*}  {Observable<UserToken>}
     * @memberof LoginService
     */
    getUserToken(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        return this.#jetStreamWsService.request('appPortal.userAccount.userToken', payload);
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
     * @return {*}  {Observable<UserAccount>}
     * @memberof LoginService
     */
    getUserAccount(payload) {
        return this.#jetStreamWsService.request('appPortal.userAccount.find', payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9sb2dpbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDtBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVoRSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7O0FBSzFCLE1BQU0sT0FBTyxZQUFZO0lBRXZCLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWpEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsT0FBaUI7UUFDNUIsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsaUNBQWlDLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDckYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsUUFBZ0I7UUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE9BQWU7UUFDNUIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ2hGLENBQUM7OEdBakNVLFlBQVk7a0hBQVosWUFBWSxjQUZYLE1BQU07OzJGQUVQLFlBQVk7a0JBSHhCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50ICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2V9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5pbXBvcnQgeyBMb2dpblJlcSwgVXNlckFjY291bnQsIFVzZXJUb2tlbiB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdCc7XG5pbXBvcnQganNTSEEgZnJvbSAnanNzaGEnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuICAvKiog5Y+W5b6X5L2/55So6ICF5qyK5p2WXG4gICAqIEBwYXJhbSB7TG9naW5SZXF9IHBheWxvYWRcbiAgICogQHJldHVybiB7Kn0gIHtPYnNlcnZhYmxlPFVzZXJUb2tlbj59XG4gICAqIEBtZW1iZXJvZiBMb2dpblNlcnZpY2VcbiAgICovXG4gIGdldFVzZXJUb2tlbihwYXlsb2FkOiBMb2dpblJlcSk6IE9ic2VydmFibGU8VXNlclRva2VuPntcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy8g6ZyA5bi25YWl5oyH5a6a55qE5Li76aGM6Lef6KaB5YKz6YGe55qE6LOH5paZXG4gICAgcmV0dXJuIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdhcHBQb3J0YWwudXNlckFjY291bnQudXNlclRva2VuJywgcGF5bG9hZClcbiAgfVxuXG4gIC8qKiDliqDlr4blr4bnorxcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkXG4gICAqIEByZXR1cm4geyp9ICB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgTG9naW5TZXJ2aWNlXG4gICAqL1xuICBnZXRIYXNoUGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2hhT2JqID0gbmV3IGpzU0hBKCdTSEEzLTI1NicsICdURVhUJywgeyBlbmNvZGluZzogJ1VURjgnIH0pO1xuICAgIHNoYU9iai51cGRhdGUocGFzc3dvcmQpO1xuICAgIHJldHVybiBzaGFPYmouZ2V0SGFzaCgnSEVYJyk7XG4gIH1cblxuICAvKiog5Y+W5b6X5L2/55So6ICF5biz6Jmf6LOH6KiKXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEByZXR1cm4geyp9ICB7T2JzZXJ2YWJsZTxVc2VyQWNjb3VudD59XG4gICAqIEBtZW1iZXJvZiBMb2dpblNlcnZpY2VcbiAgICovXG4gIGdldFVzZXJBY2NvdW50KHBheWxvYWQ6IHN0cmluZyk6IE9ic2VydmFibGU8VXNlckFjY291bnQ+e1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLnVzZXJBY2NvdW50LmZpbmQnLCBwYXlsb2FkKVxuICB9XG59XG4iXX0=