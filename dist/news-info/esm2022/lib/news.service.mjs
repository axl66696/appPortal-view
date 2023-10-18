/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Subject, mergeMap } from 'rxjs';
import { JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import * as i0 from "@angular/core";
export class NewsService {
    constructor() {
        /** 宣告Signal變數
         *  使用Signal變數儲存各類型最新消息的資訊
         */
        this.originalNews = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        /** 宣告Subject變數
         *  使用Subject變數自nats拿取最新消息
         */
        this.#myNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** 宣告Subject變數
     *  使用Subject變數自nats拿取最新消息
     */
    #myNews;
    /** 宣告ConsumerMessages變數
     *  使用ConsumerMessages訂閱最新消息
     */
    #myNewsConsumer$;
    #jetStreamWsService;
    /** 初始化最新消息
     *  首次進入頁面時，自資料庫初始化最新消息
     */
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.news.find', userCode);
    }
    /** 更改最新消息狀態
     *  發送`最新消息狀態改為已讀/已完成`到nats
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            const index = newsList.findIndex(newsElement => newsElement._id == news._id);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        this.#jetStreamWsService.publish(`news.news.setNews.${news.userCode.code}`, news);
    }
    /** 分類‘一般消息’、’待辦工作’
     *  依‘一般消息’、’待辦工作’分類最新消息
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.type['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 分類`已讀/已完成`、`未讀/未完成`
     *  依`已讀/已完成`、`未讀/未完成`分類最新消息
     */
    filterStatus(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 不顯示逾期的最新消息
     *  僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsElement => date.valueOf() - newsElement.execTime.valueOf() < aDay);
    }
    /** 搜尋最新消息
     *  搜尋含subject字串的最新消息
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsElement => newsElement.subject.match(subject)));
    }
    /** 重置最新消息
     *  以originalNews重置所有最新消息
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定最新消息
     *  設定除了原始最新消息originalNews以外的最新消息
     */
    upsertNews(news) {
        this.allNormalNews.set(this.filterType(news, "10"));
        this.allTodoList.set(this.filterType(news, "60"));
        this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
        this.toDoList.set(this.filterStatus(this.allTodoList(), "10"));
        this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
        this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
    }
    /** 設定/更新所有最新消息
     *  設定/更新所有最新消息Signal變數
     */
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
    }
    /** 規格化最新消息
     *  規格化從nats取得的最新消息
     */
    formatNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsElement = {
                "_id": news._id,
                "appId": news.appId,
                "userCode": news.userCode,
                "subject": news.subject,
                "url": news.url,
                "sharedData": news.sharedData,
                "period": {
                    "start": new Date(news.period.start),
                    "end": new Date(news.period.end)
                },
                "type": news.type,
                "execTime": new Date(news.execTime),
                "execStatus": news.execStatus,
                "updatedBy": news.updatedBy,
                "updatedAt": new Date(news.updatedAt)
            };
            formatNewsList.push(formatNewsElement);
        });
        return formatNewsList;
    }
    /** 訂閱最新消息
     *  從nats訂閱最新消息
     */
    async subMyNews(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.news.setNews.${userCode.code}`);
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsElement) => {
            this.originalNews.mutate(newsList => {
                const tmpNews = this.formatNews([newsElement.data]);
                newsList.push(tmpNews[0]);
            });
            this.upsertNews(this.originalNews());
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRy9DOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFNeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0F1SmxEO0lBaEtDOztPQUVHO0lBQ0gsT0FBTyxDQUFpQjtJQUV4Qjs7T0FFRztJQUNILGdCQUFnQixDQUFnQztJQUNoRCxtQkFBbUIsQ0FBOEI7SUFHakQ7O09BRUc7SUFDSCxXQUFXLENBQUMsUUFBZTtRQUN6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxP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QUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUMsQ0FDSDthQUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQWUsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQSxFQUFFO2dCQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Z0JBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0IsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0E1S1UsV0FBVztrSEFBWCxXQUFXLGNBRlYsTUFBTTs7MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZU1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29uc3VtZXJNZXNzYWdlcywgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFN1YnNjcmliZVR5cGUgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzJztcbmltcG9ydCB7IE5ld3MgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5ld3NTZXJ2aWNlIHtcblxuICAvKiog5a6j5ZGKU2lnbmFs6K6K5pW4XG4gICAqICDkvb/nlKhTaWduYWzorormlbjlhLLlrZjlkITpoZ7lnovmnIDmlrDmtojmga/nmoTos4foqIpcbiAgICovXG4gIG9yaWdpbmFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhbGxUb2RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIG5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICB0b0RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGNoZWNrZWROb3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZFRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcblxuXG4gIC8qKiDlrqPlkYpTdWJqZWN06K6K5pW4XG4gICAqICDkvb/nlKhTdWJqZWN06K6K5pW46IeqbmF0c+aLv+WPluacgOaWsOa2iOaBr1xuICAgKi9cbiAgI215TmV3cyA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIOWuo+WRikNvbnN1bWVyTWVzc2FnZXPorormlbhcbiAgICogIOS9v+eUqENvbnN1bWVyTWVzc2FnZXPoqILplrHmnIDmlrDmtojmga9cbiAgICovXG4gICNteU5ld3NDb25zdW1lciQhOiBPYnNlcnZhYmxlPENvbnN1bWVyTWVzc2FnZXM+O1xuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cblxuICAvKiog5Yid5aeL5YyW5pyA5paw5raI5oGvXG4gICAqICDpppbmrKHpgLLlhaXpoIHpnaLmmYLvvIzoh6ros4fmlpnluqvliJ3lp4vljJbmnIDmlrDmtojmga9cbiAgICovXG4gIGdldEluaXROZXdzKHVzZXJDb2RlOkNvZGluZyk6IE9ic2VydmFibGU8TmV3c1tdPntcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ25ld3MubmV3cy5maW5kJywgdXNlckNvZGUpO1xuICB9XG5cbiAgLyoqIOabtOaUueacgOaWsOa2iOaBr+eLgOaFi1xuICAgKiAg55m86YCBYOacgOaWsOa2iOaBr+eLgOaFi+aUueeCuuW3suiugC/lt7LlrozmiJBg5YiwbmF0c1xuICAgKi9cbiAgY2hhbmdlU3RhdHVzKG5ld3M6TmV3cyl7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5vcmlnaW5hbE5ld3MubXV0YXRlKG5ld3NMaXN0PT57XG4gICAgICBjb25zdCBpbmRleCA9IG5ld3NMaXN0LmZpbmRJbmRleChuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQuX2lkPT1uZXdzLl9pZClcbiAgICAgIG5ld3NMaXN0LnNwbGljZShpbmRleCwxKVxuICAgIH0pXG4gICAgbmV3cy5leGVjU3RhdHVzID0ge2NvZGU6XCI2MFwiLGRpc3BsYXk6XCLlt7LoroAv5bey5a6M5oiQXCJ9XG4gICAgbmV3cy5leGVjVGltZSA9IGRhdGVcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaChgbmV3cy5uZXdzLnNldE5ld3MuJHtuZXdzLnVzZXJDb2RlLmNvZGV9YCwgbmV3cyk7XG4gIH1cblxuICAvKiog5YiG6aGe4oCY5LiA6Iis5raI5oGv4oCZ44CB4oCZ5b6F6L6m5bel5L2c4oCZXG4gICAqICDkvp3igJjkuIDoiKzmtojmga/igJnjgIHigJnlvoXovqblt6XkvZzigJnliIbpoZ7mnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclR5cGUobmV3c0xpc3Q6TmV3c1tdLCBjb2RlOkNvZGluZ1snY29kZSddKTogTmV3c1tde1xuICAgIGlmKGNvZGUpe1xuICAgICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQudHlwZVsnY29kZSddPT1jb2RlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXdzTGlzdDtcbiAgICB9XG4gIH1cblxuICAvKiog5YiG6aGeYOW3suiugC/lt7LlrozmiJBg44CBYOacquiugC/mnKrlrozmiJBgXG4gICAqICDkvp1g5bey6K6AL+W3suWujOaIkGDjgIFg5pyq6K6AL+acquWujOaIkGDliIbpoZ7mnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclN0YXR1cyhuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5leGVjU3RhdHVzWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDkuI3poa/npLrpgL7mnJ/nmoTmnIDmlrDmtojmga9cbiAgICogIOWDhemhr+ekuuacqui2hemBjjI05bCP5pmC5bey6K6AL+W3suWujOaIkOeahOS4gOiIrOa2iOaBry/lvoXovqblt6XkvZxcbiAgICovXG4gIGZpbHRlck92ZXJkdWUobmV3c0xpc3Q6TmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZTtcbiAgICBjb25zdCBhRGF5ID0gMjQqNjAqNjAqMTAwMDtcbiAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5kYXRlLnZhbHVlT2YoKSAtIG5ld3NFbGVtZW50LmV4ZWNUaW1lLnZhbHVlT2YoKSA8IGFEYXkpO1xuICB9XG5cbiAgLyoqIOaQnOWwi+acgOaWsOa2iOaBr1xuICAgKiAg5pCc5bCL5ZCrc3ViamVjdOWtl+S4sueahOacgOaWsOa2iOaBr1xuICAgKi9cbiAgZmlsdGVyU3ViamVjdChzdWJqZWN0OnN0cmluZyl7XG4gICAgY29uc3QgbmV3c0xpc3Q9dGhpcy5vcmlnaW5hbE5ld3MoKTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5zdWJqZWN0Lm1hdGNoKHN1YmplY3QpKSk7XG4gIH1cblxuICAvKiog6YeN572u5pyA5paw5raI5oGvXG4gICAqICDku6VvcmlnaW5hbE5ld3Pph43nva7miYDmnInmnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclJlc2V0KCl7XG4gICAgdGhpcy51cHNlcnROZXdzKHRoaXMub3JpZ2luYWxOZXdzKCkpXG4gIH1cblxuICAvKiog6Kit5a6a5pyA5paw5raI5oGvXG4gICAqICDoqK3lrprpmaTkuobljp/lp4vmnIDmlrDmtojmga9vcmlnaW5hbE5ld3Pku6XlpJbnmoTmnIDmlrDmtojmga9cbiAgICovXG4gIHVwc2VydE5ld3MobmV3czpOZXdzW10pOiB2b2lke1xuICAgIHRoaXMuYWxsTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiMTBcIikpO1xuICAgIHRoaXMuYWxsVG9kb0xpc3Quc2V0KHRoaXMuZmlsdGVyVHlwZShuZXdzLCBcIjYwXCIpKTtcbiAgICB0aGlzLm5vcm1hbE5ld3Muc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjEwXCIpKTtcbiAgICB0aGlzLnRvRG9MaXN0LnNldCh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksXCIxMFwiKSk7XG4gICAgdGhpcy5jaGVja2VkTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjYwXCIpKSk7XG4gICAgdGhpcy5jaGVja2VkVG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyT3ZlcmR1ZSh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksIFwiNjBcIikpKTtcbiAgfVxuXG4gIC8qKiDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvU2lnbmFs6K6K5pW4XG4gICAqL1xuICB1cHNlcnRBbGxOZXdzKG5ld3NMaXN0Ok5ld3NbXSk6dm9pZHtcbiAgICB0aGlzLm9yaWdpbmFsTmV3cy5zZXQobmV3c0xpc3QpO1xuICAgIHRoaXMudXBzZXJ0TmV3cyhuZXdzTGlzdCk7XG4gIH1cblxuICAvKiog6KaP5qC85YyW5pyA5paw5raI5oGvXG4gICAqICDopo/moLzljJblvp5uYXRz5Y+W5b6X55qE5pyA5paw5raI5oGvXG4gICAqL1xuICBmb3JtYXROZXdzKG5ld3NMaXN0OiBOZXdzW10pOiBOZXdzW117XG4gICAgY29uc3QgZm9ybWF0TmV3c0xpc3Q6IE5ld3NbXSA9IFtdO1xuICAgICAgbmV3c0xpc3QuZm9yRWFjaCgobmV3czogTmV3cykgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXROZXdzRWxlbWVudDpOZXdzID0ge1xuICAgICAgICAgIFwiX2lkXCI6IG5ld3MuX2lkLFxuICAgICAgICAgIFwiYXBwSWRcIjogbmV3cy5hcHBJZCxcbiAgICAgICAgICBcInVzZXJDb2RlXCI6IG5ld3MudXNlckNvZGUsXG4gICAgICAgICAgXCJzdWJqZWN0XCI6IG5ld3Muc3ViamVjdCxcbiAgICAgICAgICBcInVybFwiOiBuZXdzLnVybCxcbiAgICAgICAgICBcInNoYXJlZERhdGFcIjogbmV3cy5zaGFyZWREYXRhLFxuICAgICAgICAgIFwicGVyaW9kXCI6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIjogbmV3IERhdGUobmV3cy5wZXJpb2Quc3RhcnQpLFxuICAgICAgICAgICAgXCJlbmRcIjogbmV3IERhdGUobmV3cy5wZXJpb2QuZW5kKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ0eXBlXCI6IG5ld3MudHlwZSxcbiAgICAgICAgICBcImV4ZWNUaW1lXCI6IG5ldyBEYXRlKG5ld3MuZXhlY1RpbWUpLFxuICAgICAgICAgIFwiZXhlY1N0YXR1c1wiOiBuZXdzLmV4ZWNTdGF0dXMsXG4gICAgICAgICAgXCJ1cGRhdGVkQnlcIjogbmV3cy51cGRhdGVkQnksXG4gICAgICAgICAgXCJ1cGRhdGVkQXRcIjogbmV3IERhdGUobmV3cy51cGRhdGVkQXQpXG4gICAgICAgIH07XG4gICAgICAgIGZvcm1hdE5ld3NMaXN0LnB1c2goZm9ybWF0TmV3c0VsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIGZvcm1hdE5ld3NMaXN0O1xuICB9XG5cbiAgLyoqIOiogumWseacgOaWsOa2iOaBr1xuICAgKiAg5b6ebmF0c+iogumWseacgOaWsOa2iOaBr1xuICAgKi9cbiAgYXN5bmMgc3ViTXlOZXdzKHVzZXJDb2RlOkNvZGluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuI215TmV3cyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgY29uc3QganNvbkNvZGVjID0gSlNPTkNvZGVjKCk7XG4gICAgdGhpcy4jbXlOZXdzQ29uc3VtZXIkID0gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnN1YnNjcmliZShcbiAgICAgIFN1YnNjcmliZVR5cGUuUHVzaCxcbiAgICAgIGBuZXdzLm5ld3Muc2V0TmV3cy4ke3VzZXJDb2RlLmNvZGV9YFxuICAgICk7XG5cbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciRcbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcChhc3luYyAobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuI215TmV3cy5uZXh0KGpzb25Db2RlYy5kZWNvZGUobWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICBtZXNzYWdlLmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuXG4gICAgdGhpcy4jbXlOZXdzLnN1YnNjcmliZSgobmV3c0VsZW1lbnQ6YW55KSA9PiB7XG4gICAgICB0aGlzLm9yaWdpbmFsTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgICAgY29uc3QgdG1wTmV3cyA9IHRoaXMuZm9ybWF0TmV3cyhbbmV3c0VsZW1lbnQuZGF0YV0pXG4gICAgICAgIG5ld3NMaXN0LnB1c2godG1wTmV3c1swXSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgICB9KTtcbiAgfVxuXG59XG5cbiJdfQ==