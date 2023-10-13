import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import * as i0 from "@angular/core";
export class ForgotPasswordService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 向後端拿userMail
     * @param {string} userCode
     * @param {string} eMail
     * @return {*}  {Observable<string>}
     * @memberof ForgotPasswordService
     */
    getUserMail(userCode, eMail) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('appPortal.userAccount.userMail', { 'userCode': userCode, 'eMail': eMail });
    }
    /** 向後端publish發送email的訊息
     * @param {string} userCode
     * @param {string} eMail
     * @memberof ForgotPasswordService
     */
    async pubSendMail(userCode, eMail) {
        await this.#jetStreamWsService.publish('appPortal.userAccount.sendMail', { 'userCode': userCode, 'eMail': eMail });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ForgotPasswordService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ForgotPasswordService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ForgotPasswordService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LXBhc3N3b3JkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi91c2VyLWxvZ2luL3NyYy9saWIvZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOztBQUtqRSxNQUFNLE9BQU8scUJBQXFCO0lBRWhDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRWhEOzs7OztPQUtHO0lBQ0gsV0FBVyxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUN6QyxhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUMvQyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQUMsRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO0lBQ2pILENBQUM7OEdBdkJVLHFCQUFxQjtrSEFBckIscUJBQXFCLGNBRnBCLE1BQU07OzJGQUVQLHFCQUFxQjtrQkFIakMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRm9yZ290UGFzc3dvcmRTZXJ2aWNlIHtcblxuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSlcblxuICAvKiog5ZCR5b6M56uv5ou/dXNlck1haWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlTWFpbFxuICAgKiBAcmV0dXJuIHsqfSAge09ic2VydmFibGU8c3RyaW5nPn1cbiAgICogQG1lbWJlcm9mIEZvcmdvdFBhc3N3b3JkU2VydmljZVxuICAgKi9cbiAgZ2V0VXNlck1haWwodXNlckNvZGU6IHN0cmluZywgZU1haWw6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLnVzZXJBY2NvdW50LnVzZXJNYWlsJywgeyd1c2VyQ29kZSc6IHVzZXJDb2RlLCdlTWFpbCc6IGVNYWlsfSk7XG4gIH1cblxuICAvKiog5ZCR5b6M56uvcHVibGlzaOeZvOmAgWVtYWls55qE6KiK5oGvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyQ29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZU1haWxcbiAgICogQG1lbWJlcm9mIEZvcmdvdFBhc3N3b3JkU2VydmljZVxuICAgKi9cbiAgYXN5bmMgcHViU2VuZE1haWwodXNlckNvZGU6IHN0cmluZywgZU1haWw6IHN0cmluZykge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKCdhcHBQb3J0YWwudXNlckFjY291bnQuc2VuZE1haWwnLHsndXNlckNvZGUnOiB1c2VyQ29kZSwgJ2VNYWlsJzogZU1haWx9KVxuICB9XG59XG4iXX0=