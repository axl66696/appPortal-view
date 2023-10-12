import * as i0 from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { Coding } from '@his-base/datatypes';

class ServiceService {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ServiceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ServiceService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ServiceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
class UserAccountService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserAccountService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserAccountService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserAccountService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
class UserProfileService {
    #jetStreamWsService;
    constructor() {
        this.#jetStreamWsService = inject(JetstreamWsService);
        /** 使用Signal變數儲存UserAccount型別的使用者帳號
         * @memberof UserProfileService
         */
        this.userProfile = signal({});
        this.userProfile.set({
            "_id": "jidweqjiefwi",
            "userCode": {
                "code": "Neo",
                "display": "alphaTeam-001"
            },
            "appId": 'web-client',
            "profile": {
                isDockVisible: true,
            },
            "updatedBy": new Coding(),
            "updatedAt": new Date(),
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
        }], ctorParameters: function () { return []; } });

/*
 * Public API Surface of service
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ServiceService, UserAccountService, UserProfileService };
//# sourceMappingURL=his-view-service.mjs.map
