import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WsNatsService {

  #natsUrl = environment.wsUrl;

  #jetStreamWsService = inject(JetstreamWsService);

  async connect() {
    await this.#jetStreamWsService.connect(this.#natsUrl);
  }

  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }
}
