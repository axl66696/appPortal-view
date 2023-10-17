/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import * as i0 from "@angular/core";
export class UserProfileService {
    constructor() {
        this.#jetStreamWsService = inject(JetstreamWsService);
        /** 使用Signal變數儲存UserAccount型別的使用者帳號
         * @memberof UserProfileService
         */
        this.userProfile = signal({});
    }
    #jetStreamWsService;
    getUserProfile(userCode, appId) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        // this.#jetStreamWsService.request('appPortal.userProfile.find', {'userCode':userCode,'appId':appId})
        // .subscribe((result: any) => {
        //   this.userProfile.set(result);
        // });
        return this.#jetStreamWsService.request('appPortal.userProfile.find', { 'userCode': userCode, 'appId': appId });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1wcm9maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBS2pFLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLRSx3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVqRDs7V0FFRztRQUNILGdCQUFXLEdBQUcsTUFBTSxDQUFjLEVBQWlCLENBQUMsQ0FBQztLQWV0RDtJQXBCQyxtQkFBbUIsQ0FBOEI7SUFTbkQsY0FBYyxDQUFDLFFBQWdCLEVBQUMsS0FBWTtRQUMxQyxhQUFhO1FBQ2Isa0JBQWtCO1FBQ2xCLHNHQUFzRztRQUN0RyxnQ0FBZ0M7UUFDaEMsa0NBQWtDO1FBQ2xDLE1BQU07UUFFTixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFBO0lBQzVHLENBQUM7OEdBcEJZLGtCQUFrQjtrSEFBbEIsa0JBQWtCLGNBRmpCLE1BQU07OzJGQUVQLGtCQUFrQjtrQkFIOUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1VzZXJQcm9maWxlIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0Jztcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpldHN0cmVhbVdzU2VydmljZSB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5pbXBvcnQgeyBDb2RpbmcsIEluZGV4T2JqZWN0IH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgVXNlclByb2ZpbGVTZXJ2aWNlIHtcblxuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmFVzZXJBY2NvdW505Z6L5Yil55qE5L2/55So6ICF5biz6JmfXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIHVzZXJQcm9maWxlID0gc2lnbmFsPFVzZXJQcm9maWxlPih7fSBhcyBVc2VyUHJvZmlsZSk7XG5cblxuXG5nZXRVc2VyUHJvZmlsZSh1c2VyQ29kZTogc3RyaW5nLGFwcElkOnN0cmluZyl7XG4gIC8vIEB0cy1pZ25vcmVcbiAgLy8g6ZyA5bi25YWl5oyH5a6a55qE5Li76aGM6Lef6KaB5YKz6YGe55qE6LOH5paZXG4gIC8vIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdhcHBQb3J0YWwudXNlclByb2ZpbGUuZmluZCcsIHsndXNlckNvZGUnOnVzZXJDb2RlLCdhcHBJZCc6YXBwSWR9KVxuICAvLyAuc3Vic2NyaWJlKChyZXN1bHQ6IGFueSkgPT4ge1xuICAvLyAgIHRoaXMudXNlclByb2ZpbGUuc2V0KHJlc3VsdCk7XG4gIC8vIH0pO1xuXG4gIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLnVzZXJQcm9maWxlLmZpbmQnLCB7J3VzZXJDb2RlJzp1c2VyQ29kZSwnYXBwSWQnOmFwcElkfSlcbn1cblxufVxuIl19