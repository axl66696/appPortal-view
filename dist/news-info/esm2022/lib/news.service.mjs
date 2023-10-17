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
        return this.#jetStreamWsService.request('appPortal.news.find', userCode);
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
        this.#jetStreamWsService.publish(`appPortal.news.${news.userCode.code}`, news);
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
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `appPortal.news.${userCode.code}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRy9DOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFNeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0E0SmxEO0lBcktDOztPQUVHO0lBQ0gsT0FBTyxDQUFpQjtJQUV4Qjs7T0FFRztJQUNILGdCQUFnQixDQUFnQztJQUNoRCxtQkFBbUIsQ0FBOEI7SUFHakQ7O09BRUc7SUFDSCxXQUFXLENBQUMsUUFBZTtRQUN6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxP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LENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQzFCLElBQUksS0FBSyxFQUFFLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUMsQ0FDSDthQUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQWUsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQSxFQUFFO2dCQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Z0JBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2dCQUMvQixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQTtRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OEdBakxVLFdBQVc7a0hBQVgsV0FBVyxjQUZWLE1BQU07OzJGQUVQLFdBQVc7a0JBSHZCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENvbnN1bWVyTWVzc2FnZXMsIEpTT05Db2RlYywgSmV0c3RyZWFtV3NTZXJ2aWNlLCBTdWJzY3JpYmVUeXBlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cyc7XG5pbXBvcnQgeyBOZXdzIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0JztcbmltcG9ydCB7IENvZGluZyB9IGZyb20gJ0BoaXMtYmFzZS9kYXRhdHlwZXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZXdzU2VydmljZSB7XG5cbiAgLyoqIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmOWQhOmhnuWei+acgOaWsOa2iOaBr+eahOizh+ioilxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBvcmlnaW5hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhbGxOb3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgYWxsVG9kb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBub3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgdG9Eb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBjaGVja2VkTm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGNoZWNrZWRUb0RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG5cblxuICAvKiog5L2/55SoU3ViamVjdOiuiuaVuOiHqm5hdHPmi7/lj5bmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgI215TmV3cyA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIOS9v+eUqENvbnN1bWVyTWVzc2FnZXPoqILplrHmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgI215TmV3c0NvbnN1bWVyJCE6IE9ic2VydmFibGU8Q29uc3VtZXJNZXNzYWdlcz47XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuXG4gIC8qKiDpppbmrKHpgLLlhaXpoIHpnaLmmYLvvIzoh6ros4fmlpnluqvliJ3lp4vljJbmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZ2V0SW5pdE5ld3ModXNlckNvZGU6Q29kaW5nKTogT2JzZXJ2YWJsZTxOZXdzW10+e1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLm5ld3MuZmluZCcsIHVzZXJDb2RlKTtcbiAgfVxuXG4gIC8qKiDnmbzpgIFg5pyA5paw5raI5oGv54uA5oWL5pS554K65bey6K6AL+W3suWujOaIkGDliLBuYXRzXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGNoYW5nZVN0YXR1cyhuZXdzOk5ld3Mpe1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgY29uc3QgaW5kZXggPSBuZXdzTGlzdC5maW5kSW5kZXgobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50Ll9pZD09bmV3cy5faWQpXG4gICAgICBuZXdzTGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICB9KVxuICAgIG5ld3MuZXhlY1N0YXR1cyA9IHtjb2RlOlwiNjBcIixkaXNwbGF5Olwi5bey6K6AL+W3suWujOaIkFwifVxuICAgIG5ld3MuZXhlY1RpbWUgPSBkYXRlXG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goYGFwcFBvcnRhbC5uZXdzLiR7bmV3cy51c2VyQ29kZS5jb2RlfWAsIG5ld3MpO1xuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKFwiYXBwUG9ydGFsLm5ld3Muc2V0TmV3c1wiLCBuZXdzKTtcbiAgfVxuXG4gIC8qKiDkvp3igJjkuIDoiKzmtojmga/igJnjgIHigJnlvoXovqblt6XkvZzigJnliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyVHlwZShuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC50eXBlWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDkvp1g5bey6K6AL+W3suWujOaIkGDjgIFg5pyq6K6AL+acquWujOaIkGDliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3RhdHVzKG5ld3NMaXN0Ok5ld3NbXSwgY29kZTpDb2RpbmdbJ2NvZGUnXSk6IE5ld3NbXXtcbiAgICBpZihjb2RlKXtcbiAgICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50LmV4ZWNTdGF0dXNbJ2NvZGUnXT09Y29kZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3c0xpc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqIOWDhemhr+ekuuacqui2hemBjjI05bCP5pmC5bey6K6AL+W3suWujOaIkOeahOS4gOiIrOa2iOaBry/lvoXovqblt6XkvZxcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyT3ZlcmR1ZShuZXdzTGlzdDpOZXdzW10pOiBOZXdzW117XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIGNvbnN0IGFEYXkgPSAyNCo2MCo2MCoxMDAwO1xuICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9PmRhdGUudmFsdWVPZigpIC0gbmV3c0VsZW1lbnQuZXhlY1RpbWUudmFsdWVPZigpIDwgYURheSk7XG4gIH1cblxuICAvKiog5pCc5bCL5ZCrc3ViamVjdOWtl+S4sueahOacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJTdWJqZWN0KHN1YmplY3Q6c3RyaW5nKXtcbiAgICBjb25zdCBuZXdzTGlzdD10aGlzLm9yaWdpbmFsTmV3cygpO1xuICAgIHRoaXMudXBzZXJ0TmV3cyhuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50LnN1YmplY3QubWF0Y2goc3ViamVjdCkpKTtcbiAgfVxuXG4gIC8qKiDku6VvcmlnaW5hbE5ld3Pph43nva7miYDmnInmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyUmVzZXQoKXtcbiAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgfVxuXG4gIC8qKiDoqK3lrprpmaTkuobljp/lp4vmnIDmlrDmtojmga9vcmlnaW5hbE5ld3Pku6XlpJbnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgdXBzZXJ0TmV3cyhuZXdzOk5ld3NbXSk6IHZvaWR7XG4gICAgdGhpcy5hbGxOb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlclR5cGUobmV3cywgXCIxMFwiKSk7XG4gICAgdGhpcy5hbGxUb2RvTGlzdC5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiNjBcIikpO1xuICAgIHRoaXMubm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiMTBcIikpO1xuICAgIHRoaXMudG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSxcIjEwXCIpKTtcbiAgICB0aGlzLmNoZWNrZWROb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlck92ZXJkdWUodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiNjBcIikpKTtcbiAgICB0aGlzLmNoZWNrZWRUb0RvTGlzdC5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSwgXCI2MFwiKSkpO1xuICB9XG5cbiAgLyoqIOioreWumi/mm7TmlrDmiYDmnInmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgdXBzZXJ0QWxsTmV3cyhuZXdzTGlzdDpOZXdzW10pOnZvaWR7XG4gICAgdGhpcy5vcmlnaW5hbE5ld3Muc2V0KG5ld3NMaXN0KTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QpO1xuICB9XG5cbiAgLyoqIOimj+agvOWMluW+nm5hdHPlj5blvpfnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZm9ybWF0TmV3cyhuZXdzTGlzdDogTmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGZvcm1hdE5ld3NMaXN0OiBOZXdzW10gPSBbXTtcbiAgICAgIG5ld3NMaXN0LmZvckVhY2goKG5ld3M6IE5ld3MpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJuZXdzXCIsIG5ld3MpXG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRcIiwgdHlwZW9mIG5ld3MucGVyaW9kLnN0YXJ0KVxuICAgICAgICBjb25zdCBmb3JtYXROZXdzRWxlbWVudDpOZXdzID0ge1xuICAgICAgICAgIFwiX2lkXCI6IG5ld3MuX2lkLFxuICAgICAgICAgIFwiYXBwSWRcIjogbmV3cy5hcHBJZCxcbiAgICAgICAgICBcInVzZXJDb2RlXCI6IG5ld3MudXNlckNvZGUsXG4gICAgICAgICAgXCJzdWJqZWN0XCI6IG5ld3Muc3ViamVjdCxcbiAgICAgICAgICBcInVybFwiOiBuZXdzLnVybCxcbiAgICAgICAgICBcInNoYXJlZERhdGFcIjogbmV3cy5zaGFyZWREYXRhLFxuICAgICAgICAgIFwicGVyaW9kXCI6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIjogbmV3IERhdGUobmV3cy5wZXJpb2Quc3RhcnQpLFxuICAgICAgICAgICAgXCJlbmRcIjogbmV3IERhdGUobmV3cy5wZXJpb2QuZW5kKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ0eXBlXCI6IG5ld3MudHlwZSxcbiAgICAgICAgICBcImV4ZWNUaW1lXCI6IG5ldyBEYXRlKG5ld3MuZXhlY1RpbWUpLFxuICAgICAgICAgIFwiZXhlY1N0YXR1c1wiOiBuZXdzLmV4ZWNTdGF0dXMsXG4gICAgICAgICAgXCJ1cGRhdGVkQnlcIjogbmV3cy51cGRhdGVkQnksXG4gICAgICAgICAgXCJ1cGRhdGVkQXRcIjogbmV3IERhdGUobmV3cy51cGRhdGVkQXQpXG4gICAgICAgIH07XG4gICAgICAgIGZvcm1hdE5ld3NMaXN0LnB1c2goZm9ybWF0TmV3c0VsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIGZvcm1hdE5ld3NMaXN0O1xuICB9XG5cbiAgLyoqIOiogumWseacgOaWsOa2iOaBr1xuICAgKiBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGFzeW5jIHN1Yk15TmV3cyh1c2VyQ29kZTpDb2RpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLiNteU5ld3MgPSBuZXcgU3ViamVjdCgpO1xuICAgIGNvbnN0IGpzb25Db2RlYyA9IEpTT05Db2RlYygpO1xuICAgIHRoaXMuI215TmV3c0NvbnN1bWVyJCA9IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5zdWJzY3JpYmUoXG4gICAgICBTdWJzY3JpYmVUeXBlLlB1c2gsXG4gICAgICBgYXBwUG9ydGFsLm5ld3MuJHt1c2VyQ29kZS5jb2RlfWBcbiAgICApO1xuXG4gICAgdGhpcy4jbXlOZXdzQ29uc3VtZXIkXG4gICAgICAucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoYXN5bmMgKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLiNteU5ld3MubmV4dChqc29uQ29kZWMuZGVjb2RlKG1lc3NhZ2UuZGF0YSkpO1xuICAgICAgICAgICAgbWVzc2FnZS5hY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHt9KTtcblxuICAgIHRoaXMuI215TmV3cy5zdWJzY3JpYmUoKG5ld3NFbGVtZW50OmFueSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJuZXdzRWxlbWVudFwiLCBuZXdzRWxlbWVudClcbiAgICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXROZXdzKFtuZXdzRWxlbWVudC5kYXRhXSlcbiAgICAgICAgY29uc29sZS5sb2coXCJ0bXBOZXdzXCIsIHRtcE5ld3MpXG4gICAgICAgIG5ld3NMaXN0LnB1c2godG1wTmV3c1swXSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgICB9KTtcbiAgfVxuXG59XG5cbiJdfQ==