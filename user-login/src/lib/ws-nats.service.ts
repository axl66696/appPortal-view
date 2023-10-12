import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WsNatsService {

  /** 與Nats連接的Url
   * @type {string}
   * @memberof WsNatsService
   */
  #natsUrl = environment.wsUrl;

  #jetStreamWsService = inject(JetstreamWsService);

  /** 與Nats連接
   * @memberof WsNatsService
   */
  async connect() {
    await this.#jetStreamWsService.connect(this.#natsUrl);
  }

  /** 與Nats斷開連接
   * @memberof WsNatsService
   */
  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }
}
