import { UserProfile } from '@his-viewmodel/app-portal/dist';
import * as i0 from "@angular/core";
export declare class UserProfileService {
    #private;
    /** 使用Signal變數儲存UserAccount型別的使用者帳號
     * @memberof UserProfileService
     */
    userProfile: import("@angular/core").WritableSignal<UserProfile>;
    getUserProfile(userCode: string, appId: string): import("rxjs").Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserProfileService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UserProfileService>;
}
