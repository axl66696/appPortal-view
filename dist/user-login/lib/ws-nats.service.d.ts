import * as i0 from "@angular/core";
export declare class WsNatsService {
    #private;
    /** 與Nats連接
     * @memberof WsNatsService
     */
    connect(): Promise<void>;
    /** 與Nats斷開連接
     * @memberof WsNatsService
     */
    disconnect(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WsNatsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WsNatsService>;
}
