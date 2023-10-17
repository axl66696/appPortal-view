import { MyAppStore } from "@his-viewmodel/app-portal/dist";

export class ExtendedMyAppStore extends MyAppStore{

  isOpen: boolean = false;

  /** 建構式
   ** @param that MyAppStore
   **/
   constructor(that?: Partial<ExtendedMyAppStore>) {
    super();
    Object.assign(this, structuredClone(that));
  }

}
