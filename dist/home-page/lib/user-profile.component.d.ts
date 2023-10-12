import { NewsService } from 'dist/news-info';
import { AppStoreService } from 'dist/app-store';
import { UserAccountService } from 'dist/service';
import * as i0 from "@angular/core";
export declare class UserProfileComponent {
    #private;
    appStoreService: AppStoreService;
    newsService: NewsService;
    userAccountService: UserAccountService;
    /**跳轉到查看更多消息的路徑
     * @memberof UserProfileComponent
     */
    onMoreNewsClick(): void;
    /**跳轉到最新消息中appUrl的路徑
     * @param {string} appUrl
     * @param {object} sharedData
     * @memberof UserProfileComponent
     */
    onNavNewsLinkClick(appUrl: string, sharedData: object): void;
    /** 跳轉到應用程式page
     * @memberof UserProfileComponent
     */
    onMoreAppListClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserProfileComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserProfileComponent, "his-user-profile", never, {}, {}, never, never, true, never>;
}
