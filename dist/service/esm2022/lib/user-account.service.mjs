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
        this.#jetStreamWsService
            .request('UserImage.GetUserImage', payload)
            .subscribe((result) => {
            this.userImage.set(result);
            console.log("get image", result);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1hY2NvdW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1hY2NvdW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSWpFLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLRSx3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVqRDs7V0FFRztRQUNILGdCQUFXLEdBQUcsTUFBTSxDQUFjLEVBQWlCLENBQUMsQ0FBQztRQUVyRDs7V0FFRztRQUNILGNBQVMsR0FBRyxNQUFNLENBQVksRUFBZSxDQUFDLENBQUM7S0FjaEQ7SUF4QkMsbUJBQW1CLENBQThCO0lBWWpEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxPQUFlO1FBQzFCLElBQUksQ0FBQyxtQkFBbUI7YUFDckIsT0FBTyxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUMxQyxTQUFTLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OEdBekJVLGtCQUFrQjtrSEFBbEIsa0JBQWtCLGNBRmpCLE1BQU07OzJGQUVQLGtCQUFrQjtrQkFIOUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyQWNjb3VudCwgVXNlckltYWdlIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0Jztcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpldHN0cmVhbVdzU2VydmljZSB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgVXNlckFjY291bnRTZXJ2aWNlIHtcblxuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmFVzZXJBY2NvdW505Z6L5Yil55qE5L2/55So6ICF5biz6JmfXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIHVzZXJBY2NvdW50ID0gc2lnbmFsPFVzZXJBY2NvdW50Pih7fSBhcyBVc2VyQWNjb3VudCk7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmFVzZXJJbWFnZeWei+WIpeeahOS9v+eUqOiAheeFp+eJh1xuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICB1c2VySW1hZ2UgPSBzaWduYWw8VXNlckltYWdlPih7fSBhcyBVc2VySW1hZ2UpO1xuXG4gIC8qKiDlj5blvpfkvb/nlKjogIXluLPomZ/nhafniYdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlU2VydmljZVxuICAgKi9cbiAgZ2V0VXNlckltYWdlKHBheWxvYWQ6IHN0cmluZykge1xuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZVxuICAgICAgLnJlcXVlc3QoJ1VzZXJJbWFnZS5HZXRVc2VySW1hZ2UnLCBwYXlsb2FkKVxuICAgICAgLnN1YnNjcmliZSgocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy51c2VySW1hZ2Uuc2V0KHJlc3VsdCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGltYWdlXCIscmVzdWx0KVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==