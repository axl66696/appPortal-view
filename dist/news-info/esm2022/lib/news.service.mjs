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
        return this.#jetStreamWsService.request('news.find', userCode);
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
        this.#jetStreamWsService.publish(`news.${news.userCode.code}`, news);
        this.#jetStreamWsService.publish("news.setNews", news);
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
            console.log("news", news);
            console.log("start", typeof news.period.start);
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
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.${userCode.code}`);
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsElement) => {
            console.log("newsElement", newsElement);
            this.originalNews.mutate(newsList => {
                const tmpNews = this.formatNews([newsElement.data]);
                console.log("tmpNews", tmpNews);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRy9DOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFNeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0E0SmxEO0lBcktDOztPQUVHO0lBQ0gsT0FBTyxDQUFpQjtJQUV4Qjs7T0FFRztJQUNILGdCQUFnQixDQUFnQztJQUNoRCxtQkFBbUIsQ0FBOEI7SUFHakQ7O09BRUc7SUFDSCxXQUFXLENBQUMsUUFBZTtRQUN6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxP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QUssRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUMxQixJQUFJLEtBQUssRUFBRSxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNmO1FBQ0gsQ0FBQyxDQUFDLENBQ0g7YUFDQSxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFlLEVBQUUsRUFBRTtZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUEsRUFBRTtnQkFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2dCQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFDL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQixDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzhHQWpMVSxXQUFXO2tIQUFYLFdBQVcsY0FGVixNQUFNOzsyRkFFUCxXQUFXO2tCQUh2QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlTWFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb25zdW1lck1lc3NhZ2VzLCBKU09OQ29kZWMsIEpldHN0cmVhbVdzU2VydmljZSwgU3Vic2NyaWJlVHlwZSB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MnO1xuaW1wb3J0IHsgTmV3cyB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdCc7XG5pbXBvcnQgeyBDb2RpbmcgfSBmcm9tICdAaGlzLWJhc2UvZGF0YXR5cGVzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmV3c1NlcnZpY2Uge1xuXG4gIC8qKiDkvb/nlKhTaWduYWzorormlbjlhLLlrZjlkITpoZ7lnovmnIDmlrDmtojmga/nmoTos4foqIpcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgb3JpZ2luYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgYWxsTm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbFRvZG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgbm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIHRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBjaGVja2VkVG9Eb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuXG5cbiAgLyoqIOS9v+eUqFN1YmplY3Torormlbjoh6puYXRz5ou/5Y+W5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gICNteU5ld3MgPSBuZXcgU3ViamVjdCgpO1xuXG4gIC8qKiDkvb/nlKhDb25zdW1lck1lc3NhZ2Vz6KiC6Zax5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gICNteU5ld3NDb25zdW1lciQhOiBPYnNlcnZhYmxlPENvbnN1bWVyTWVzc2FnZXM+O1xuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cblxuICAvKiog6aaW5qyh6YCy5YWl6aCB6Z2i5pmC77yM6Ieq6LOH5paZ5bqr5Yid5aeL5YyW5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGdldEluaXROZXdzKHVzZXJDb2RlOkNvZGluZyk6IE9ic2VydmFibGU8TmV3c1tdPntcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ25ld3MuZmluZCcsIHVzZXJDb2RlKTtcbiAgfVxuXG4gIC8qKiDnmbzpgIFg5pyA5paw5raI5oGv54uA5oWL5pS554K65bey6K6AL+W3suWujOaIkGDliLBuYXRzXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGNoYW5nZVN0YXR1cyhuZXdzOk5ld3Mpe1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgY29uc3QgaW5kZXggPSBuZXdzTGlzdC5maW5kSW5kZXgobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50Ll9pZD09bmV3cy5faWQpXG4gICAgICBuZXdzTGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICB9KVxuICAgIG5ld3MuZXhlY1N0YXR1cyA9IHtjb2RlOlwiNjBcIixkaXNwbGF5Olwi5bey6K6AL+W3suWujOaIkFwifVxuICAgIG5ld3MuZXhlY1RpbWUgPSBkYXRlXG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goYG5ld3MuJHtuZXdzLnVzZXJDb2RlLmNvZGV9YCwgbmV3cyk7XG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goXCJuZXdzLnNldE5ld3NcIiwgbmV3cyk7XG4gIH1cblxuICAvKiog5L6d4oCY5LiA6Iis5raI5oGv4oCZ44CB4oCZ5b6F6L6m5bel5L2c4oCZ5YiG6aGe5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclR5cGUobmV3c0xpc3Q6TmV3c1tdLCBjb2RlOkNvZGluZ1snY29kZSddKTogTmV3c1tde1xuICAgIGlmKGNvZGUpe1xuICAgICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQudHlwZVsnY29kZSddPT1jb2RlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXdzTGlzdDtcbiAgICB9XG4gIH1cblxuICAvKiog5L6dYOW3suiugC/lt7LlrozmiJBg44CBYOacquiugC/mnKrlrozmiJBg5YiG6aGe5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclN0YXR1cyhuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5leGVjU3RhdHVzWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDlg4Xpoa/npLrmnKrotoXpgY4yNOWwj+aZguW3suiugC/lt7LlrozmiJDnmoTkuIDoiKzmtojmga8v5b6F6L6m5bel5L2cXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlck92ZXJkdWUobmV3c0xpc3Q6TmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZTtcbiAgICBjb25zdCBhRGF5ID0gMjQqNjAqNjAqMTAwMDtcbiAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5kYXRlLnZhbHVlT2YoKSAtIG5ld3NFbGVtZW50LmV4ZWNUaW1lLnZhbHVlT2YoKSA8IGFEYXkpO1xuICB9XG5cbiAgLyoqIOaQnOWwi+WQq3N1YmplY3TlrZfkuLLnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3ViamVjdChzdWJqZWN0OnN0cmluZyl7XG4gICAgY29uc3QgbmV3c0xpc3Q9dGhpcy5vcmlnaW5hbE5ld3MoKTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5zdWJqZWN0Lm1hdGNoKHN1YmplY3QpKSk7XG4gIH1cblxuICAvKiog5Lulb3JpZ2luYWxOZXdz6YeN572u5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclJlc2V0KCl7XG4gICAgdGhpcy51cHNlcnROZXdzKHRoaXMub3JpZ2luYWxOZXdzKCkpXG4gIH1cblxuICAvKiog6Kit5a6a6Zmk5LqG5Y6f5aeL5pyA5paw5raI5oGvb3JpZ2luYWxOZXdz5Lul5aSW55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHVwc2VydE5ld3MobmV3czpOZXdzW10pOiB2b2lke1xuICAgIHRoaXMuYWxsTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiMTBcIikpO1xuICAgIHRoaXMuYWxsVG9kb0xpc3Quc2V0KHRoaXMuZmlsdGVyVHlwZShuZXdzLCBcIjYwXCIpKTtcbiAgICB0aGlzLm5vcm1hbE5ld3Muc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjEwXCIpKTtcbiAgICB0aGlzLnRvRG9MaXN0LnNldCh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksXCIxMFwiKSk7XG4gICAgdGhpcy5jaGVja2VkTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjYwXCIpKSk7XG4gICAgdGhpcy5jaGVja2VkVG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyT3ZlcmR1ZSh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksIFwiNjBcIikpKTtcbiAgfVxuXG4gIC8qKiDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIHVwc2VydEFsbE5ld3MobmV3c0xpc3Q6TmV3c1tdKTp2b2lke1xuICAgIHRoaXMub3JpZ2luYWxOZXdzLnNldChuZXdzTGlzdCk7XG4gICAgdGhpcy51cHNlcnROZXdzKG5ld3NMaXN0KTtcbiAgfVxuXG4gIC8qKiDopo/moLzljJblvp5uYXRz5Y+W5b6X55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZvcm1hdE5ld3MobmV3c0xpc3Q6IE5ld3NbXSk6IE5ld3NbXXtcbiAgICBjb25zdCBmb3JtYXROZXdzTGlzdDogTmV3c1tdID0gW107XG4gICAgICBuZXdzTGlzdC5mb3JFYWNoKChuZXdzOiBOZXdzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibmV3c1wiLCBuZXdzKVxuICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0XCIsIHR5cGVvZiBuZXdzLnBlcmlvZC5zdGFydClcbiAgICAgICAgY29uc3QgZm9ybWF0TmV3c0VsZW1lbnQ6TmV3cyA9IHtcbiAgICAgICAgICBcIl9pZFwiOiBuZXdzLl9pZCxcbiAgICAgICAgICBcImFwcElkXCI6IG5ld3MuYXBwSWQsXG4gICAgICAgICAgXCJ1c2VyQ29kZVwiOiBuZXdzLnVzZXJDb2RlLFxuICAgICAgICAgIFwic3ViamVjdFwiOiBuZXdzLnN1YmplY3QsXG4gICAgICAgICAgXCJ1cmxcIjogbmV3cy51cmwsXG4gICAgICAgICAgXCJzaGFyZWREYXRhXCI6IG5ld3Muc2hhcmVkRGF0YSxcbiAgICAgICAgICBcInBlcmlvZFwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLnN0YXJ0KSxcbiAgICAgICAgICAgIFwiZW5kXCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLmVuZClcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidHlwZVwiOiBuZXdzLnR5cGUsXG4gICAgICAgICAgXCJleGVjVGltZVwiOiBuZXcgRGF0ZShuZXdzLmV4ZWNUaW1lKSxcbiAgICAgICAgICBcImV4ZWNTdGF0dXNcIjogbmV3cy5leGVjU3RhdHVzLFxuICAgICAgICAgIFwidXBkYXRlZEJ5XCI6IG5ld3MudXBkYXRlZEJ5LFxuICAgICAgICAgIFwidXBkYXRlZEF0XCI6IG5ldyBEYXRlKG5ld3MudXBkYXRlZEF0KVxuICAgICAgICB9O1xuICAgICAgICBmb3JtYXROZXdzTGlzdC5wdXNoKGZvcm1hdE5ld3NFbGVtZW50KTtcbiAgICAgIH0pO1xuICAgIHJldHVybiBmb3JtYXROZXdzTGlzdDtcbiAgfVxuXG4gIC8qKiDoqILplrHmnIDmlrDmtojmga9cbiAgICogQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBzdWJNeU5ld3ModXNlckNvZGU6Q29kaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy4jbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKTtcbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgYG5ld3MuJHt1c2VyQ29kZS5jb2RlfWBcbiAgICApO1xuXG4gICAgdGhpcy4jbXlOZXdzQ29uc3VtZXIkXG4gICAgICAucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoYXN5bmMgKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLiNteU5ld3MubmV4dChqc29uQ29kZWMuZGVjb2RlKG1lc3NhZ2UuZGF0YSkpO1xuICAgICAgICAgICAgbWVzc2FnZS5hY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHt9KTtcblxuICAgIHRoaXMuI215TmV3cy5zdWJzY3JpYmUoKG5ld3NFbGVtZW50OmFueSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJuZXdzRWxlbWVudFwiLCBuZXdzRWxlbWVudClcbiAgICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXROZXdzKFtuZXdzRWxlbWVudC5kYXRhXSlcbiAgICAgICAgY29uc29sZS5sb2coXCJ0bXBOZXdzXCIsIHRtcE5ld3MpXG4gICAgICAgIG5ld3NMaXN0LnB1c2godG1wTmV3c1swXSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgICB9KTtcbiAgfVxuXG59XG5cbiJdfQ==