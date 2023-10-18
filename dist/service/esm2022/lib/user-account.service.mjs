/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import * as i0 from "@angular/core";
export class UserAccountService {
    constructor() {
        this.#jetStreamWsService = inject(JetstreamWsService);
        /** 使用Signal變數儲存UserAccount型別的使用者帳號
         * @memberof UserProfileService
         */
        this.userAccount = signal({});
        /** 使用Signal變數儲存UserImage型別的使用者照片
         * @memberof UserProfileService
         */
        this.userImage = signal({});
    }
    #jetStreamWsService;
    /** 取得使用者帳號照片
     * @param {string} payload
     * @memberof UserProfileService
     */
    getUserImage(payload) {
        // return this.#jetStreamWsService.request('appPortal.userProfile.getUserImage', payload)
        return this.#jetStreamWsService.request('UserImage.getUserImage', payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserAccountService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserAccountService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserAccountService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1hY2NvdW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1hY2NvdW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSWpFLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLRSx3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVqRDs7V0FFRztRQUNILGdCQUFXLEdBQUcsTUFBTSxDQUFjLEVBQWlCLENBQUMsQ0FBQztRQUVyRDs7V0FFRztRQUNILGNBQVMsR0FBRyxNQUFNLENBQVksRUFBZSxDQUFDLENBQUM7S0FVaEQ7SUFwQkMsbUJBQW1CLENBQThCO0lBWWpEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxPQUFlO1FBQzFCLHlGQUF5RjtRQUN6RixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDNUUsQ0FBQzs4R0FyQlUsa0JBQWtCO2tIQUFsQixrQkFBa0IsY0FGakIsTUFBTTs7MkZBRVAsa0JBQWtCO2tCQUg5QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJBY2NvdW50LCBVc2VySW1hZ2UgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBVc2VyQWNjb3VudFNlcnZpY2Uge1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2YVXNlckFjY291bnTlnovliKXnmoTkvb/nlKjogIXluLPomZ9cbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlU2VydmljZVxuICAgKi9cbiAgdXNlckFjY291bnQgPSBzaWduYWw8VXNlckFjY291bnQ+KHt9IGFzIFVzZXJBY2NvdW50KTtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2YVXNlckltYWdl5Z6L5Yil55qE5L2/55So6ICF54Wn54mHXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIHVzZXJJbWFnZSA9IHNpZ25hbDxVc2VySW1hZ2U+KHt9IGFzIFVzZXJJbWFnZSk7XG5cbiAgLyoqIOWPluW+l+S9v+eUqOiAheW4s+iZn+eFp+eJh1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICBnZXRVc2VySW1hZ2UocGF5bG9hZDogc3RyaW5nKSB7XG4gICAgLy8gcmV0dXJuIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdhcHBQb3J0YWwudXNlclByb2ZpbGUuZ2V0VXNlckltYWdlJywgcGF5bG9hZClcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJJbWFnZS5nZXRVc2VySW1hZ2UnLCBwYXlsb2FkKVxuICB9XG59XG4iXX0=