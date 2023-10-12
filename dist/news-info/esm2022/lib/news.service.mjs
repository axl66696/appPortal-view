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
        this.news = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        /** nats連線位址
         *  @memberof NewsService
         */
        this.#url = 'ws://localhost:8080';
        /** 使用Subject變數自nats拿取最新消息
         *  @memberof NewsService
         */
        this.#userNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** nats連線位址
     *  @memberof NewsService
     */
    #url;
    /** 使用Subject變數自nats拿取最新消息
     *  @memberof NewsService
     */
    #userNews;
    /** 使用ConsumerMessages訂閱最新消息
     *  @memberof NewsService
     */
    #consumerMessages$;
    #jetStreamWsService;
    /** 建立nats連線
     *  @memberof NewsService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#url);
    }
    /** 中斷nats連線
     *  @memberof NewsService
     */
    async disconnect() {
        await this.#jetStreamWsService.drain();
    }
    /** publish userCode到nats
     *  @memberof NewsService
     */
    publishUserCode(userCode) {
        this.#jetStreamWsService.publish("news.wantNews", userCode);
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(userCode, newsId) {
        const date = new Date();
        this.#jetStreamWsService.publish("news.updateStatus", { userCode, newsId, date });
    }
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsData => newsData.type['code'] == code);
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
            return newsList.filter(newsData => newsData.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 僅顯示未超過24小時的已讀一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsData => date.valueOf() - newsData.execTime.valueOf() < aDay);
    }
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject) {
        const newsList = this.news();
        this.setNews(newsList.filter(newsData => newsData.subject.match(subject)));
    }
    /** 回復到上一次取得最新消息的狀態
     *  @memberof NewsService
     */
    filterReset() {
        this.setNews(this.news());
    }
    /** 設定除了原始最新消息news以外的Signal
     *  @memberof NewsService
     */
    setNews(news) {
        this.allNormalNews.set(this.filterType(news, "10"));
        this.allTodoList.set(this.filterType(news, "60"));
        this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
        this.toDoList.set(this.filterStatus(this.allTodoList(), "10"));
        this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
        this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
    }
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
     */
    formatNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsData = {
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
            formatNewsList.push(formatNewsData);
        });
        return formatNewsList;
    }
    /** 訂閱最新消息
     * @memberof NewsService
     */
    async subNews() {
        this.#userNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#consumerMessages$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, 'news.getNews.dashboard');
        this.#consumerMessages$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#userNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#userNews.subscribe((newsList) => {
            this.news.set(this.formatNews(newsList));
            this.setNews(this.formatNews(newsList));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxTQUFJLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ3BDLGtCQUFhLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzdDLGdCQUFXLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzNDLGVBQVUsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDMUMsYUFBUSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUN4QyxzQkFBaUIsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDakQsb0JBQWUsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFFL0M7O1dBRUc7UUFDSCxTQUFJLEdBQUcscUJBQXFCLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQU8xQix3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQW1KbEQ7SUFsS0M7O09BRUc7SUFDSCxJQUFJLENBQXlCO0lBRTdCOztPQUVHO0lBQ0gsU0FBUyxDQUFpQjtJQUUxQjs7T0FFRztJQUNILGtCQUFrQixDQUFnQztJQUVsRCxtQkFBbUIsQ0FBOEI7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LFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0E3S1UsV0FBVztrSEFBWCxXQUFXLGNBRlYsTUFBTTs7MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZU1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29uc3VtZXJNZXNzYWdlcywgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFN1YnNjcmliZVR5cGUgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzJztcbmltcG9ydCB7IE5ld3MgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5ld3NTZXJ2aWNlIHtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2Y5ZCE6aGe5Z6L5pyA5paw5raI5oGv55qE6LOH6KiKXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIG5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhbGxOb3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgYWxsVG9kb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBub3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgdG9Eb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBjaGVja2VkTm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGNoZWNrZWRUb0RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG5cbiAgLyoqIG5hdHPpgKPnt5rkvY3lnYBcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgI3VybCA9ICd3czovL2xvY2FsaG9zdDo4MDgwJztcblxuICAvKiog5L2/55SoU3ViamVjdOiuiuaVuOiHqm5hdHPmi7/lj5bmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgI3VzZXJOZXdzID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiog5L2/55SoQ29uc3VtZXJNZXNzYWdlc+iogumWseacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjY29uc3VtZXJNZXNzYWdlcyQhOiBPYnNlcnZhYmxlPENvbnN1bWVyTWVzc2FnZXM+O1xuXG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuICAvKiog5bu656uLbmF0c+mAo+e3mlxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5jb25uZWN0KHRoaXMuI3VybCk7XG4gIH1cblxuICAvKiog5Lit5pa3bmF0c+mAo+e3mlxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5kcmFpbigpO1xuICB9XG5cbiAgLyoqIHB1Ymxpc2ggdXNlckNvZGXliLBuYXRzXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHB1Ymxpc2hVc2VyQ29kZSh1c2VyQ29kZTpzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaChcIm5ld3Mud2FudE5ld3NcIiwgdXNlckNvZGUpO1xuICB9XG5cbiAgLyoqIOeZvOmAgWDmnIDmlrDmtojmga/ni4DmhYvmlLnngrrlt7LoroAv5bey5a6M5oiQYOWIsG5hdHNcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgY2hhbmdlU3RhdHVzKHVzZXJDb2RlOkNvZGluZywgbmV3c0lkOnN0cmluZyl7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goXCJuZXdzLnVwZGF0ZVN0YXR1c1wiLCB7dXNlckNvZGUsIG5ld3NJZCwgZGF0ZX0pO1xuICB9XG5cbiAgLyoqIOS+neKAmOS4gOiIrOa2iOaBr+KAmeOAgeKAmeW+hei+puW3peS9nOKAmeWIhumhnuacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJUeXBlKG5ld3NMaXN0Ok5ld3NbXSwgY29kZTpDb2RpbmdbJ2NvZGUnXSk6IE5ld3NbXXtcbiAgICBpZihjb2RlKXtcbiAgICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0RhdGE9Pm5ld3NEYXRhLnR5cGVbJ2NvZGUnXT09Y29kZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3c0xpc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqIOS+nWDlt7LoroAv5bey5a6M5oiQYOOAgWDmnKroroAv5pyq5a6M5oiQYOWIhumhnuacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJTdGF0dXMobmV3c0xpc3Q6TmV3c1tdLCBjb2RlOkNvZGluZ1snY29kZSddKTogTmV3c1tde1xuICAgIGlmKGNvZGUpe1xuICAgICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRGF0YT0+bmV3c0RhdGEuZXhlY1N0YXR1c1snY29kZSddPT1jb2RlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXdzTGlzdDtcbiAgICB9XG4gIH1cblxuICAvKiog5YOF6aGv56S65pyq6LaF6YGOMjTlsI/mmYLnmoTlt7LoroDkuIDoiKzmtojmga8v5b6F6L6m5bel5L2cXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlck92ZXJkdWUobmV3c0xpc3Q6TmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZTtcbiAgICBjb25zdCBhRGF5ID0gMjQqNjAqNjAqMTAwMDtcbiAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NEYXRhPT5kYXRlLnZhbHVlT2YoKSAtIG5ld3NEYXRhLmV4ZWNUaW1lLnZhbHVlT2YoKSA8IGFEYXkpO1xuICB9XG5cbiAgLyoqIOaQnOWwi+WQq3N1YmplY3TlrZfkuLLnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3ViamVjdChzdWJqZWN0OnN0cmluZyl7XG4gICAgY29uc3QgbmV3c0xpc3Q9dGhpcy5uZXdzKCk7XG4gICAgdGhpcy5zZXROZXdzKG5ld3NMaXN0LmZpbHRlcihuZXdzRGF0YT0+bmV3c0RhdGEuc3ViamVjdC5tYXRjaChzdWJqZWN0KSkpO1xuICB9XG5cbiAgLyoqIOWbnuW+qeWIsOS4iuS4gOasoeWPluW+l+acgOaWsOa2iOaBr+eahOeLgOaFi1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJSZXNldCgpe1xuICAgIHRoaXMuc2V0TmV3cyh0aGlzLm5ld3MoKSlcbiAgfVxuXG4gIC8qKiDoqK3lrprpmaTkuobljp/lp4vmnIDmlrDmtojmga9uZXdz5Lul5aSW55qEU2lnbmFsXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHNldE5ld3MobmV3czpOZXdzW10pOiB2b2lke1xuICAgIHRoaXMuYWxsTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiMTBcIikpO1xuICAgIHRoaXMuYWxsVG9kb0xpc3Quc2V0KHRoaXMuZmlsdGVyVHlwZShuZXdzLCBcIjYwXCIpKTtcbiAgICB0aGlzLm5vcm1hbE5ld3Muc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjEwXCIpKTtcbiAgICB0aGlzLnRvRG9MaXN0LnNldCh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksXCIxMFwiKSk7XG4gICAgdGhpcy5jaGVja2VkTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjYwXCIpKSk7XG4gICAgdGhpcy5jaGVja2VkVG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyT3ZlcmR1ZSh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksIFwiNjBcIikpKTtcbiAgfVxuXG4gIC8qKiDopo/moLzljJblvp5uYXRz5Y+W5b6X55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZvcm1hdE5ld3MobmV3c0xpc3Q6IE5ld3NbXSk6IE5ld3NbXXtcbiAgICBjb25zdCBmb3JtYXROZXdzTGlzdDogTmV3c1tdID0gW107XG4gICAgICBuZXdzTGlzdC5mb3JFYWNoKChuZXdzOiBOZXdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1hdE5ld3NEYXRhOk5ld3MgPSB7XG4gICAgICAgICAgXCJfaWRcIjogbmV3cy5faWQsXG4gICAgICAgICAgXCJhcHBJZFwiOiBuZXdzLmFwcElkLFxuICAgICAgICAgIFwidXNlckNvZGVcIjogbmV3cy51c2VyQ29kZSxcbiAgICAgICAgICBcInN1YmplY3RcIjogbmV3cy5zdWJqZWN0LFxuICAgICAgICAgIFwidXJsXCI6IG5ld3MudXJsLFxuICAgICAgICAgIFwic2hhcmVkRGF0YVwiOiBuZXdzLnNoYXJlZERhdGEsXG4gICAgICAgICAgXCJwZXJpb2RcIjoge1xuICAgICAgICAgICAgXCJzdGFydFwiOiBuZXcgRGF0ZShuZXdzLnBlcmlvZC5zdGFydCksXG4gICAgICAgICAgICBcImVuZFwiOiBuZXcgRGF0ZShuZXdzLnBlcmlvZC5lbmQpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInR5cGVcIjogbmV3cy50eXBlLFxuICAgICAgICAgIFwiZXhlY1RpbWVcIjogbmV3IERhdGUobmV3cy5leGVjVGltZSksXG4gICAgICAgICAgXCJleGVjU3RhdHVzXCI6IG5ld3MuZXhlY1N0YXR1cyxcbiAgICAgICAgICBcInVwZGF0ZWRCeVwiOiBuZXdzLnVwZGF0ZWRCeSxcbiAgICAgICAgICBcInVwZGF0ZWRBdFwiOiBuZXcgRGF0ZShuZXdzLnVwZGF0ZWRBdClcbiAgICAgICAgfTtcbiAgICAgICAgZm9ybWF0TmV3c0xpc3QucHVzaChmb3JtYXROZXdzRGF0YSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm9ybWF0TmV3c0xpc3Q7XG4gIH1cblxuICAvKiog6KiC6Zax5pyA5paw5raI5oGvXG4gICAqIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgc3ViTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLiN1c2VyTmV3cyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgY29uc3QganNvbkNvZGVjID0gSlNPTkNvZGVjKCk7XG4gICAgdGhpcy4jY29uc3VtZXJNZXNzYWdlcyQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgJ25ld3MuZ2V0TmV3cy5kYXNoYm9hcmQnXG4gICAgKTtcblxuICAgIHRoaXMuI2NvbnN1bWVyTWVzc2FnZXMkXG4gICAgICAucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoYXN5bmMgKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLiN1c2VyTmV3cy5uZXh0KGpzb25Db2RlYy5kZWNvZGUobWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICBtZXNzYWdlLmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuXG4gICAgdGhpcy4jdXNlck5ld3Muc3Vic2NyaWJlKChuZXdzTGlzdDphbnkpID0+IHtcbiAgICAgIHRoaXMubmV3cy5zZXQodGhpcy5mb3JtYXROZXdzKG5ld3NMaXN0IGFzIE5ld3NbXSkpO1xuICAgICAgdGhpcy5zZXROZXdzKHRoaXMuZm9ybWF0TmV3cyhuZXdzTGlzdCkpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuIl19