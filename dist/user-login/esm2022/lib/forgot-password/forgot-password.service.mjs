import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import * as i0 from "@angular/core";
export class ForgotPasswordService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 向後端拿userMail
     * @param {string} userCode
     * @param {string} eMail
     * @return {*}  {Promise<boolean>}
     * @memberof ForgotPasswordService
     */
    getUserMail(userCode, eMail) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('UserAccount.GetUserMail', { 'userCode': userCode, 'eMail': eMail });
    }
    /** 向後端publish發送email的訊息
     * @param {string} userCode
     * @param {string} eMail
     * @memberof ForgotPasswordService
     */
    async pubSendMail(userCode, eMail) {
        await this.#jetStreamWsService.publish('UserAccount.SendMail', { 'userCode': userCode, 'eMail': eMail });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LXBhc3N3b3JkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi91c2VyLWxvZ2luL3NyYy9saWIvZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBYSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOztBQUs1RSxNQUFNLE9BQU8scUJBQXFCO0lBRWhDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRWhEOzs7OztPQUtHO0lBQ0gsV0FBVyxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUN6QyxhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDNUcsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUMvQyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUMsRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO0lBQ3ZHLENBQUM7OEdBdkJVLHFCQUFxQjtrSEFBckIscUJBQXFCLGNBRnBCLE1BQU07OzJGQUVQLHFCQUFxQjtrQkFIakMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbmltcG9ydCB7IE9ic2VydmFibGUsIGxhc3RWYWx1ZUZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGb3Jnb3RQYXNzd29yZFNlcnZpY2Uge1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKVxuXG4gIC8qKiDlkJHlvoznq6/mi791c2VyTWFpbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlckNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVNYWlsXG4gICAqIEByZXR1cm4geyp9ICB7UHJvbWlzZTxib29sZWFuPn1cbiAgICogQG1lbWJlcm9mIEZvcmdvdFBhc3N3b3JkU2VydmljZVxuICAgKi9cbiAgZ2V0VXNlck1haWwodXNlckNvZGU6IHN0cmluZywgZU1haWw6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFjY291bnQuR2V0VXNlck1haWwnLCB7J3VzZXJDb2RlJzogdXNlckNvZGUsJ2VNYWlsJzogZU1haWx9KTtcbiAgfVxuXG4gIC8qKiDlkJHlvoznq69wdWJsaXNo55m86YCBZW1haWznmoToqIrmga9cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlTWFpbFxuICAgKiBAbWVtYmVyb2YgRm9yZ290UGFzc3dvcmRTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBwdWJTZW5kTWFpbCh1c2VyQ29kZTogc3RyaW5nLCBlTWFpbDogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goJ1VzZXJBY2NvdW50LlNlbmRNYWlsJyx7J3VzZXJDb2RlJzogdXNlckNvZGUsICdlTWFpbCc6IGVNYWlsfSlcbiAgfVxufVxuIl19