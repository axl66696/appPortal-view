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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1wcm9maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBS2pFLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLRSx3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVqRDs7V0FFRztRQUNILGdCQUFXLEdBQUcsTUFBTSxDQUFjLEVBQWlCLENBQUMsQ0FBQztLQVF0RDtJQWJDLG1CQUFtQixDQUE4QjtJQVNuRCxjQUFjLENBQUMsUUFBZ0IsRUFBQyxLQUFZO1FBQzFDLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUE7SUFDNUcsQ0FBQzs4R0FiWSxrQkFBa0I7a0hBQWxCLGtCQUFrQixjQUZqQixNQUFNOzsyRkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVc2VyUHJvZmlsZSB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nLCBJbmRleE9iamVjdCB9IGZyb20gJ0BoaXMtYmFzZS9kYXRhdHlwZXMnO1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJQcm9maWxlU2VydmljZSB7XG5cbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpO1xuXG4gIC8qKiDkvb/nlKhTaWduYWzorormlbjlhLLlrZhVc2VyQWNjb3VudOWei+WIpeeahOS9v+eUqOiAheW4s+iZn1xuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICB1c2VyUHJvZmlsZSA9IHNpZ25hbDxVc2VyUHJvZmlsZT4oe30gYXMgVXNlclByb2ZpbGUpO1xuXG5cblxuZ2V0VXNlclByb2ZpbGUodXNlckNvZGU6IHN0cmluZyxhcHBJZDpzdHJpbmcpe1xuICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ2FwcFBvcnRhbC51c2VyUHJvZmlsZS5maW5kJywgeyd1c2VyQ29kZSc6dXNlckNvZGUsJ2FwcElkJzphcHBJZH0pXG59XG5cbn1cbiJdfQ==