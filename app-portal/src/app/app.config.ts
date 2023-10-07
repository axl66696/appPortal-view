import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { JetstreamWsService } from '@his-base/jetstream-ws';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function createTranslateLoader(http: HttpClient) {

  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: JetstreamWsService,
      useValue: new JetstreamWsService({ name: 'OPD'})
    },
    importProvidersFrom(TranslateModule.forRoot({
      loader: {

      provide: TranslateLoader,

      useFactory: createTranslateLoader,

      deps: [HttpClient]

      },

      })),]
};
