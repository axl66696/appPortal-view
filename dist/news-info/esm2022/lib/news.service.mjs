/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Subject, mergeMap } from 'rxjs';
import { JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import * as i0 from "@angular/core";
export class NewsService {
    constructor() {
        /** 使用Signal變數儲存各類型最新消息的資訊
         *  @memberof NewsService
         */
        this.originalNews = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        /** 使用Subject變數自nats拿取最新消息
         *  @memberof NewsService
         */
        this.#myNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** 使用Subject變數自nats拿取最新消息
     *  @memberof NewsService
     */
    #myNews;
    /** 使用ConsumerMessages訂閱最新消息
     *  @memberof NewsService
     */
    #myNewsConsumer$;
    #jetStreamWsService;
    /** 首次進入頁面時，自資料庫初始化最新消息
     *  @memberof NewsService
     */
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.appPortal.newsList', userCode);
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            const index = newsList.findIndex(newsElement => newsElement._id == news._id);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        this.#jetStreamWsService.publish("appPortal.news.setNews", news);
    }
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.type['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 依`已讀/已完成`、`未讀/未完成`分類最新消息
     *  @memberof NewsService
     */
    filterStatus(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsElement => date.valueOf() - newsElement.execTime.valueOf() < aDay);
    }
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsElement => newsElement.subject.match(subject)));
    }
    /** 以originalNews重置所有最新消息
     *  @memberof NewsService
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定除了原始最新消息originalNews以外的最新消息
     *  @memberof NewsService
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
     *  @memberof NewsService
     */
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
    }
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
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
     * @memberof NewsService
     */
    async subMyNews(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.appPortal.${userCode.code}`);
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
                const tmpNews = this.formatNews([newsElement]);
                newsList.push(tmpNews[0]);
            });
            this.upsertNews(this.originalNews());
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRy9DOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFNeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0F1SmxEO0lBaEtDOztPQUVHO0lBQ0gsT0FBTyxDQUFpQjtJQUV4Qjs7T0FFRztJQUNILGdCQUFnQixDQUFnQztJQUNoRCxtQkFBbUIsQ0FBOEI7SUFHakQ7O09BRUc7SUFDSCxXQUFXLENBQUMsUUFBZTtRQUN6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxP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QUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQWUsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQSxFQUFFO2dCQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtnQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQixDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzhHQTVLVSxXQUFXO2tIQUFYLFdBQVcsY0FGVixNQUFNOzsyRkFFUCxXQUFXO2tCQUh2QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlTWFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb25zdW1lck1lc3NhZ2VzLCBKU09OQ29kZWMsIEpldHN0cmVhbVdzU2VydmljZSwgU3Vic2NyaWJlVHlwZSB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MnO1xuaW1wb3J0IHsgTmV3cyB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdCc7XG5pbXBvcnQgeyBDb2RpbmcgfSBmcm9tICdAaGlzLWJhc2UvZGF0YXR5cGVzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmV3c1NlcnZpY2Uge1xuXG4gIC8qKiDkvb/nlKhTaWduYWzorormlbjlhLLlrZjlkITpoZ7lnovmnIDmlrDmtojmga/nmoTos4foqIpcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgb3JpZ2luYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgYWxsTm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbFRvZG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgbm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIHRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBjaGVja2VkVG9Eb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuXG5cbiAgLyoqIOS9v+eUqFN1YmplY3Torormlbjoh6puYXRz5ou/5Y+W5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gICNteU5ld3MgPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiDkvb/nlKhDb25zdW1lck1lc3NhZ2Vz6KiC6Zax5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gICNteU5ld3NDb25zdW1lciQhOiBPYnNlcnZhYmxlPENvbnN1bWVyTWVzc2FnZXM+O1xuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cblxuICAvKiog6aaW5qyh6YCy5YWl6aCB6Z2i5pmC77yM6Ieq6LOH5paZ5bqr5Yid5aeL5YyW5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGdldEluaXROZXdzKHVzZXJDb2RlOkNvZGluZyk6IE9ic2VydmFibGU8TmV3c1tdPntcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ25ld3MuYXBwUG9ydGFsLm5ld3NMaXN0JywgdXNlckNvZGUpO1xuICB9XG5cbiAgLyoqIOeZvOmAgWDmnIDmlrDmtojmga/ni4DmhYvmlLnngrrlt7LoroAv5bey5a6M5oiQYOWIsG5hdHNcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgY2hhbmdlU3RhdHVzKG5ld3M6TmV3cyl7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5vcmlnaW5hbE5ld3MubXV0YXRlKG5ld3NMaXN0PT57XG4gICAgICBjb25zdCBpbmRleCA9IG5ld3NMaXN0LmZpbmRJbmRleChuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQuX2lkPT1uZXdzLl9pZClcbiAgICAgIG5ld3NMaXN0LnNwbGljZShpbmRleCwxKVxuICAgIH0pXG4gICAgbmV3cy5leGVjU3RhdHVzID0ge2NvZGU6XCI2MFwiLGRpc3BsYXk6XCLlt7LoroAv5bey5a6M5oiQXCJ9XG4gICAgbmV3cy5leGVjVGltZSA9IGRhdGVcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaChcImFwcFBvcnRhbC5uZXdzLnNldE5ld3NcIiwgbmV3cyk7XG4gIH1cblxuICAvKiog5L6d4oCY5LiA6Iis5raI5oGv4oCZ44CB4oCZ5b6F6L6m5bel5L2c4oCZ5YiG6aGe5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclR5cGUobmV3c0xpc3Q6TmV3c1tdLCBjb2RlOkNvZGluZ1snY29kZSddKTogTmV3c1tde1xuICAgIGlmKGNvZGUpe1xuICAgICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQudHlwZVsnY29kZSddPT1jb2RlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXdzTGlzdDtcbiAgICB9XG4gIH1cblxuICAvKiog5L6dYOW3suiugC/lt7LlrozmiJBg44CBYOacquiugC/mnKrlrozmiJBg5YiG6aGe5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclN0YXR1cyhuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5leGVjU3RhdHVzWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDlg4Xpoa/npLrmnKrotoXpgY4yNOWwj+aZguW3suiugC/lt7LlrozmiJDnmoTkuIDoiKzmtojmga8v5b6F6L6m5bel5L2cXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlck92ZXJkdWUobmV3c0xpc3Q6TmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZTtcbiAgICBjb25zdCBhRGF5ID0gMjQqNjAqNjAqMTAwMDtcbiAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5kYXRlLnZhbHVlT2YoKSAtIG5ld3NFbGVtZW50LmV4ZWNUaW1lLnZhbHVlT2YoKSA8IGFEYXkpO1xuICB9XG5cbiAgLyoqIOaQnOWwi+WQq3N1YmplY3TlrZfkuLLnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3ViamVjdChzdWJqZWN0OnN0cmluZyl7XG4gICAgY29uc3QgbmV3c0xpc3Q9dGhpcy5vcmlnaW5hbE5ld3MoKTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5zdWJqZWN0Lm1hdGNoKHN1YmplY3QpKSk7XG4gIH1cblxuICAvKiog5Lulb3JpZ2luYWxOZXdz6YeN572u5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclJlc2V0KCl7XG4gICAgdGhpcy51cHNlcnROZXdzKHRoaXMub3JpZ2luYWxOZXdzKCkpXG4gIH1cblxuICAvKiog6Kit5a6a6Zmk5LqG5Y6f5aeL5pyA5paw5raI5oGvb3JpZ2luYWxOZXdz5Lul5aSW55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHVwc2VydE5ld3MobmV3czpOZXdzW10pOiB2b2lke1xuICAgIHRoaXMuYWxsTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiMTBcIikpO1xuICAgIHRoaXMuYWxsVG9kb0xpc3Quc2V0KHRoaXMuZmlsdGVyVHlwZShuZXdzLCBcIjYwXCIpKTtcbiAgICB0aGlzLm5vcm1hbE5ld3Muc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjEwXCIpKTtcbiAgICB0aGlzLnRvRG9MaXN0LnNldCh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksXCIxMFwiKSk7XG4gICAgdGhpcy5jaGVja2VkTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjYwXCIpKSk7XG4gICAgdGhpcy5jaGVja2VkVG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyT3ZlcmR1ZSh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksIFwiNjBcIikpKTtcbiAgfVxuXG4gIC8qKiDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHVwc2VydEFsbE5ld3MobmV3c0xpc3Q6TmV3c1tdKTp2b2lke1xuICAgIHRoaXMub3JpZ2luYWxOZXdzLnNldChuZXdzTGlzdCk7XG4gICAgdGhpcy51cHNlcnROZXdzKG5ld3NMaXN0KTtcbiAgfVxuXG4gIC8qKiDopo/moLzljJblvp5uYXRz5Y+W5b6X55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZvcm1hdE5ld3MobmV3c0xpc3Q6IE5ld3NbXSk6IE5ld3NbXXtcbiAgICBjb25zdCBmb3JtYXROZXdzTGlzdDogTmV3c1tdID0gW107XG4gICAgICBuZXdzTGlzdC5mb3JFYWNoKChuZXdzOiBOZXdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1hdE5ld3NFbGVtZW50Ok5ld3MgPSB7XG4gICAgICAgICAgXCJfaWRcIjogbmV3cy5faWQsXG4gICAgICAgICAgXCJhcHBJZFwiOiBuZXdzLmFwcElkLFxuICAgICAgICAgIFwidXNlckNvZGVcIjogbmV3cy51c2VyQ29kZSxcbiAgICAgICAgICBcInN1YmplY3RcIjogbmV3cy5zdWJqZWN0LFxuICAgICAgICAgIFwidXJsXCI6IG5ld3MudXJsLFxuICAgICAgICAgIFwic2hhcmVkRGF0YVwiOiBuZXdzLnNoYXJlZERhdGEsXG4gICAgICAgICAgXCJwZXJpb2RcIjoge1xuICAgICAgICAgICAgXCJzdGFydFwiOiBuZXcgRGF0ZShuZXdzLnBlcmlvZC5zdGFydCksXG4gICAgICAgICAgICBcImVuZFwiOiBuZXcgRGF0ZShuZXdzLnBlcmlvZC5lbmQpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInR5cGVcIjogbmV3cy50eXBlLFxuICAgICAgICAgIFwiZXhlY1RpbWVcIjogbmV3IERhdGUobmV3cy5leGVjVGltZSksXG4gICAgICAgICAgXCJleGVjU3RhdHVzXCI6IG5ld3MuZXhlY1N0YXR1cyxcbiAgICAgICAgICBcInVwZGF0ZWRCeVwiOiBuZXdzLnVwZGF0ZWRCeSxcbiAgICAgICAgICBcInVwZGF0ZWRBdFwiOiBuZXcgRGF0ZShuZXdzLnVwZGF0ZWRBdClcbiAgICAgICAgfTtcbiAgICAgICAgZm9ybWF0TmV3c0xpc3QucHVzaChmb3JtYXROZXdzRWxlbWVudCk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm9ybWF0TmV3c0xpc3Q7XG4gIH1cblxuICAvKiog6KiC6Zax5pyA5paw5raI5oGvXG4gICAqIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgc3ViTXlOZXdzKHVzZXJDb2RlOkNvZGluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuI215TmV3cyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgY29uc3QganNvbkNvZGVjID0gSlNPTkNvZGVjKCk7XG4gICAgdGhpcy4jbXlOZXdzQ29uc3VtZXIkID0gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnN1YnNjcmliZShcbiAgICAgIFN1YnNjcmliZVR5cGUuUHVzaCxcbiAgICAgIGBuZXdzLmFwcFBvcnRhbC4ke3VzZXJDb2RlLmNvZGV9YFxuICAgICk7XG5cbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciRcbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcChhc3luYyAobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuI215TmV3cy5uZXh0KGpzb25Db2RlYy5kZWNvZGUobWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICBtZXNzYWdlLmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuXG4gICAgdGhpcy4jbXlOZXdzLnN1YnNjcmliZSgobmV3c0VsZW1lbnQ6YW55KSA9PiB7XG4gICAgICB0aGlzLm9yaWdpbmFsTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgICAgY29uc3QgdG1wTmV3cyA9IHRoaXMuZm9ybWF0TmV3cyhbbmV3c0VsZW1lbnRdKVxuICAgICAgICBuZXdzTGlzdC5wdXNoKHRtcE5ld3NbMF0pXG4gICAgICB9KVxuICAgICAgdGhpcy51cHNlcnROZXdzKHRoaXMub3JpZ2luYWxOZXdzKCkpXG4gICAgfSk7XG4gIH1cblxufVxuXG4iXX0=