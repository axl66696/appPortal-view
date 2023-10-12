import { UserAccount, UserImage } from '@his-viewmodel/app-portal/dist';
import { NewsService } from 'dist/news-info';
import { AppStoreService } from 'dist/app-store';
import * as i0 from "@angular/core";
export declare class UserProfileService {
    #private;
    appStoreService: AppStoreService;
    newsService: NewsService;
    /** 使用Signal變數儲存UserAccount型別的使用者帳號
     * @memberof UserProfileService
     */
    userAccount: import("@angular/core").WritableSignal<UserAccount>;
    /** 使用Signal變數儲存UserImage型別的使用者照片
     * @memberof UserProfileService
     */
    userImage: import("@angular/core").WritableSignal<UserImage>;
    /** 更新使用者帳號
     * @param {UserAccount} user
     * @memberof UserProfileService
     */
    getUserAccountFromNats(user: UserAccount): void;
    /** 取得使用者帳號照片
     * @param {string} payload
     * @memberof UserProfileService
     */
    getUserImage(payload: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserProfileService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UserProfileService>;
}
