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
        return this.#jetStreamWsService.request('appPortal.userProfile.getUserImage', payload);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1hY2NvdW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1hY2NvdW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSWpFLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLRSx3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVqRDs7V0FFRztRQUNILGdCQUFXLEdBQUcsTUFBTSxDQUFjLEVBQWlCLENBQUMsQ0FBQztRQUVyRDs7V0FFRztRQUNILGNBQVMsR0FBRyxNQUFNLENBQVksRUFBZSxDQUFDLENBQUM7S0FTaEQ7SUFuQkMsbUJBQW1CLENBQThCO0lBWWpEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxPQUFlO1FBQzFCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN4RixDQUFDOzhHQXBCVSxrQkFBa0I7a0hBQWxCLGtCQUFrQixjQUZqQixNQUFNOzsyRkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlckFjY291bnQsIFVzZXJJbWFnZSB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJBY2NvdW50U2VydmljZSB7XG5cbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpO1xuXG4gIC8qKiDkvb/nlKhTaWduYWzorormlbjlhLLlrZhVc2VyQWNjb3VudOWei+WIpeeahOS9v+eUqOiAheW4s+iZn1xuICAgKiBAbWVtYmVyb2YgVXNlclByb2ZpbGVTZXJ2aWNlXG4gICAqL1xuICB1c2VyQWNjb3VudCA9IHNpZ25hbDxVc2VyQWNjb3VudD4oe30gYXMgVXNlckFjY291bnQpO1xuXG4gIC8qKiDkvb/nlKhTaWduYWzorormlbjlhLLlrZhVc2VySW1hZ2XlnovliKXnmoTkvb/nlKjogIXnhafniYdcbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlU2VydmljZVxuICAgKi9cbiAgdXNlckltYWdlID0gc2lnbmFsPFVzZXJJbWFnZT4oe30gYXMgVXNlckltYWdlKTtcblxuICAvKiog5Y+W5b6X5L2/55So6ICF5biz6Jmf54Wn54mHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZVNlcnZpY2VcbiAgICovXG4gIGdldFVzZXJJbWFnZShwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ2FwcFBvcnRhbC51c2VyUHJvZmlsZS5nZXRVc2VySW1hZ2UnLCBwYXlsb2FkKVxuICB9XG59XG4iXX0=