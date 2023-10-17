/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { Coding } from '@his-base/datatypes';
import * as i0 from "@angular/core";
export class UserProfileService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: UserProfileService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zZXJ2aWNlL3NyYy9saWIvdXNlci1wcm9maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLE1BQU0sRUFBZSxNQUFNLHFCQUFxQixDQUFDOztBQUkxRCxNQUFNLE9BQU8sa0JBQWtCO0lBRTdCLG1CQUFtQixDQUE4QjtJQU9uRDtRQVBFLHdCQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRWpEOztXQUVHO1FBQ0gsZ0JBQVcsR0FBRyxNQUFNLENBQWMsRUFBaUIsQ0FBQyxDQUFDO1FBR3JELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNsQjtZQUNFLEtBQUssRUFBQyxjQUFjO1lBQ3BCLFVBQVUsRUFBRTtnQkFDVixNQUFNLEVBQUUsS0FBSztnQkFDYixTQUFTLEVBQUUsZUFBZTthQUMzQjtZQUNELE9BQU8sRUFBRyxZQUFZO1lBQ3RCLFNBQVMsRUFBQztnQkFDUixhQUFhLEVBQUUsSUFBSTthQUNwQjtZQUNELFdBQVcsRUFBRSxJQUFJLE1BQU0sRUFBRTtZQUN6QixXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUU7U0FDeEIsQ0FDRixDQUFBO0lBQ0gsQ0FBQzs4R0F6Qlksa0JBQWtCO2tIQUFsQixrQkFBa0IsY0FGakIsTUFBTTs7MkZBRVAsa0JBQWtCO2tCQUg5QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VXNlclByb2ZpbGUgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbmltcG9ydCB7IENvZGluZywgSW5kZXhPYmplY3QgfSBmcm9tICdAaGlzLWJhc2UvZGF0YXR5cGVzJztcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBVc2VyUHJvZmlsZVNlcnZpY2Uge1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2YVXNlckFjY291bnTlnovliKXnmoTkvb/nlKjogIXluLPomZ9cbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlU2VydmljZVxuICAgKi9cbiAgdXNlclByb2ZpbGUgPSBzaWduYWw8VXNlclByb2ZpbGU+KHt9IGFzIFVzZXJQcm9maWxlKTtcblxuY29uc3RydWN0b3IoKSB7XG4gIHRoaXMudXNlclByb2ZpbGUuc2V0KFxuICAgIHtcbiAgICAgIFwiX2lkXCI6XCJqaWR3ZXFqaWVmd2lcIixcbiAgICAgIFwidXNlckNvZGVcIjoge1xuICAgICAgICBcImNvZGVcIjogXCJOZW9cIixcbiAgICAgICAgXCJkaXNwbGF5XCI6IFwiYWxwaGFUZWFtLTAwMVwiXG4gICAgICB9LFxuICAgICAgXCJhcHBJZFwiIDogJ3dlYi1jbGllbnQnLFxuICAgICAgXCJwcm9maWxlXCI6e1xuICAgICAgICBpc0RvY2tWaXNpYmxlOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIFwidXBkYXRlZEJ5XCI6IG5ldyBDb2RpbmcoKSxcbiAgICAgIFwidXBkYXRlZEF0XCI6IG5ldyBEYXRlKCksXG4gICAgfVxuICApXG59XG5cbn1cbiJdfQ==