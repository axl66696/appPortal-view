import { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WsNatsService } from './ws-nats.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app-portal';
  #wsNatsService = inject(WsNatsService);
  #translate = inject(TranslateService)

  async ngOnInit(){
    await this.#wsNatsService.connect();
    this.#translate.setDefaultLang(`zh-Hant`)
  }
}
