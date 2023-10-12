import { trigger, style, animate, transition, state } from '@angular/animations';

export const easeOut = trigger('slideDown', [
  state('void', style({
    top: '0',
    transform: 'translate(-50%,-50%)',
    opacity: 0
  })),
  state('*', style({

    transform: 'translate(-50%,-100%)',
    opacity: 1
  })),
  transition('void <=> *', [
    animate('0.4s ease-out')
  ])
]);
