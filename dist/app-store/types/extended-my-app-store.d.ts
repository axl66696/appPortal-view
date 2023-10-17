import { MyAppStore } from "@his-viewmodel/app-portal/dist";
export declare class ExtendedMyAppStore extends MyAppStore {
    isOpen: boolean;
    /** 建構式
     ** @param that MyAppStore
     **/
    constructor(that?: Partial<ExtendedMyAppStore>);
}
