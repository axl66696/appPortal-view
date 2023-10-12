/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { NewsService } from 'dist/news-info';
import { AppStoreService } from 'dist/app-store';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import * as i0 from "@angular/core";
export class UserProfileService {
    constructor() {
        this.appStoreService = inject(AppStoreService);
        this.newsService = inject(NewsService);
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
    /** 更新使用者帳號
     * @param {UserAccount} user
     * @memberof UserProfileService
     */
    getUserAccountFromNats(user) {
        this.userAccount.set(user);
    }
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserProfileService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserProfileService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserProfileService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ob21lLXBhZ2Uvc3JjL2xpYi91c2VyLXByb2ZpbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSx1REFBdUQ7QUFDdkQseURBQXlEO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOztBQUlqRSxNQUFNLE9BQU8sa0JBQWtCO0lBSC9CO1FBSUUsb0JBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUMsZ0JBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFakQ7O1dBRUc7UUFDSCxnQkFBVyxHQUFHLE1BQU0sQ0FBYyxFQUFpQixDQUFDLENBQUM7UUFFckQ7O1dBRUc7UUFDSCxjQUFTLEdBQUcsTUFBTSxDQUFZLEVBQWUsQ0FBQyxDQUFDO0tBc0JoRDtJQWhDQyxtQkFBbUIsQ0FBOEI7SUFZakQ7OztPQUdHO0lBQ0gsc0JBQXNCLENBQUMsSUFBaUI7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxPQUFlO1FBQzFCLElBQUksQ0FBQyxtQkFBbUI7YUFDckIsT0FBTyxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUMxQyxTQUFTLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OEdBbENVLGtCQUFrQjtrSEFBbEIsa0JBQWtCLGNBRmpCLE1BQU07OzJGQUVQLGtCQUFrQjtrQkFIOUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyQWNjb3VudCwgVXNlckltYWdlIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0Jztcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5ld3NTZXJ2aWNlIH0gZnJvbSAnZGlzdC9uZXdzLWluZm8nO1xuaW1wb3J0IHsgQXBwU3RvcmVTZXJ2aWNlIH0gZnJvbSAnZGlzdC9hcHAtc3RvcmUnO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBVc2VyUHJvZmlsZVNlcnZpY2Uge1xuICBhcHBTdG9yZVNlcnZpY2UgPSBpbmplY3QoQXBwU3RvcmVTZXJ2aWNlKTtcbiAgbmV3c1NlcnZpY2UgPSBpbmplY3QoTmV3c1NlcnZpY2UpO1xuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmFVzZXJBY2NvdW505Z6L5Yil55qE5L2/55So6ICF5biz6JmfXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIHVzZXJBY2NvdW50ID0gc2lnbmFsPFVzZXJBY2NvdW50Pih7fSBhcyBVc2VyQWNjb3VudCk7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmFVzZXJJbWFnZeWei+WIpeeahOS9v+eUqOiAheeFp+eJh1xuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICB1c2VySW1hZ2UgPSBzaWduYWw8VXNlckltYWdlPih7fSBhcyBVc2VySW1hZ2UpO1xuXG4gIC8qKiDmm7TmlrDkvb/nlKjogIXluLPomZ9cbiAgICogQHBhcmFtIHtVc2VyQWNjb3VudH0gdXNlclxuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICBnZXRVc2VyQWNjb3VudEZyb21OYXRzKHVzZXI6IFVzZXJBY2NvdW50KTogdm9pZCB7XG4gICAgdGhpcy51c2VyQWNjb3VudC5zZXQodXNlcik7XG4gIH1cblxuICAvKiog5Y+W5b6X5L2/55So6ICF5biz6Jmf54Wn54mHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIGdldFVzZXJJbWFnZShwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2VcbiAgICAgIC5yZXF1ZXN0KCdVc2VySW1hZ2UuR2V0VXNlckltYWdlJywgcGF5bG9hZClcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIHRoaXMudXNlckltYWdlLnNldChyZXN1bHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldCBpbWFnZVwiLHJlc3VsdClcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=