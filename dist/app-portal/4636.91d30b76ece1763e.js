(self.webpackChunkapp_portal=self.webpackChunkapp_portal||[]).push([[4636],{5807:(Z,u,a)=>{a.r(u),a.d(u,{OVERLAY_VALUE_ACCESSOR:()=>f,Overlay:()=>_,OverlayModule:()=>M});var l=a(7724),d=a(575),t=a(5863),g=a(8426),p=a(25),r=a(5799),c=a(8520);const O=["overlay"],C=["content"];function E(i,h){1&i&&t.\u0275\u0275elementContainer(0)}const b=function(i,h,e){return{showTransitionParams:i,hideTransitionParams:h,transform:e}},x=function(i){return{value:"visible",params:i}},D=function(i){return{mode:i}},T=function(i){return{$implicit:i}};function w(i,h){if(1&i){const e=t.\u0275\u0275getCurrentView();t.\u0275\u0275elementStart(0,"div",1,3),t.\u0275\u0275listener("click",function(o){t.\u0275\u0275restoreView(e);const s=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(s.onOverlayContentClick(o))})("@overlayContentAnimation.start",function(o){t.\u0275\u0275restoreView(e);const s=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(s.onOverlayContentAnimationStart(o))})("@overlayContentAnimation.done",function(o){t.\u0275\u0275restoreView(e);const s=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(s.onOverlayContentAnimationDone(o))}),t.\u0275\u0275projection(2),t.\u0275\u0275template(3,E,1,0,"ng-container",4),t.\u0275\u0275elementEnd()}if(2&i){const e=t.\u0275\u0275nextContext(2);t.\u0275\u0275classMap(e.contentStyleClass),t.\u0275\u0275property("ngStyle",e.contentStyle)("ngClass","p-overlay-content")("@overlayContentAnimation",t.\u0275\u0275pureFunction1(11,x,t.\u0275\u0275pureFunction3(7,b,e.showTransitionOptions,e.hideTransitionOptions,e.transformOptions[e.modal?e.overlayResponsiveDirection:"default"]))),t.\u0275\u0275advance(3),t.\u0275\u0275property("ngTemplateOutlet",e.contentTemplate)("ngTemplateOutletContext",t.\u0275\u0275pureFunction1(15,T,t.\u0275\u0275pureFunction1(13,D,e.overlayMode)))}}const S=function(i,h,e,n,o,s,v,y,m,k,H,V,j,P){return{"p-overlay p-component":!0,"p-overlay-modal p-component-overlay p-component-overlay-enter":i,"p-overlay-center":h,"p-overlay-top":e,"p-overlay-top-start":n,"p-overlay-top-end":o,"p-overlay-bottom":s,"p-overlay-bottom-start":v,"p-overlay-bottom-end":y,"p-overlay-left":m,"p-overlay-left-start":k,"p-overlay-left-end":H,"p-overlay-right":V,"p-overlay-right-start":j,"p-overlay-right-end":P}};function L(i,h){if(1&i){const e=t.\u0275\u0275getCurrentView();t.\u0275\u0275elementStart(0,"div",1,2),t.\u0275\u0275listener("click",function(o){t.\u0275\u0275restoreView(e);const s=t.\u0275\u0275nextContext();return t.\u0275\u0275resetView(s.onOverlayClick(o))}),t.\u0275\u0275template(2,w,4,17,"div",0),t.\u0275\u0275elementEnd()}if(2&i){const e=t.\u0275\u0275nextContext();t.\u0275\u0275classMap(e.styleClass),t.\u0275\u0275property("ngStyle",e.style)("ngClass",t.\u0275\u0275pureFunctionV(5,S,[e.modal,e.modal&&"center"===e.overlayResponsiveDirection,e.modal&&"top"===e.overlayResponsiveDirection,e.modal&&"top-start"===e.overlayResponsiveDirection,e.modal&&"top-end"===e.overlayResponsiveDirection,e.modal&&"bottom"===e.overlayResponsiveDirection,e.modal&&"bottom-start"===e.overlayResponsiveDirection,e.modal&&"bottom-end"===e.overlayResponsiveDirection,e.modal&&"left"===e.overlayResponsiveDirection,e.modal&&"left-start"===e.overlayResponsiveDirection,e.modal&&"left-end"===e.overlayResponsiveDirection,e.modal&&"right"===e.overlayResponsiveDirection,e.modal&&"right-start"===e.overlayResponsiveDirection,e.modal&&"right-end"===e.overlayResponsiveDirection])),t.\u0275\u0275advance(2),t.\u0275\u0275property("ngIf",e.visible)}}const R=["*"],f={provide:g.NG_VALUE_ACCESSOR,useExisting:(0,t.forwardRef)(()=>_),multi:!0},I=(0,l.animation)([(0,l.style)({transform:"{{transform}}",opacity:0}),(0,l.animate)("{{showTransitionParams}}")]),A=(0,l.animation)([(0,l.animate)("{{hideTransitionParams}}",(0,l.style)({transform:"{{transform}}",opacity:0}))]);let _=(()=>{class i{document;platformId;el;renderer;config;overlayService;zone;get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return c.ObjectUtils.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return c.ObjectUtils.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return c.ObjectUtils.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return c.ObjectUtils.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){const e=this._target||this.overlayOptions?.target;return void 0===e?"@prev":e}set target(e){this._target=e}get appendTo(){return this._appendTo||this.overlayOptions?.appendTo}set appendTo(e){this._appendTo=e}get autoZIndex(){const e=this._autoZIndex||this.overlayOptions?.autoZIndex;return void 0===e||e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){const e=this._baseZIndex||this.overlayOptions?.baseZIndex;return void 0===e?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){const e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return void 0===e?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){const e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return void 0===e?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}visibleChange=new t.EventEmitter;onBeforeShow=new t.EventEmitter;onShow=new t.EventEmitter;onBeforeHide=new t.EventEmitter;onHide=new t.EventEmitter;onAnimationStart=new t.EventEmitter;onAnimationDone=new t.EventEmitter;templates;overlayViewChild;contentViewChild;contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_appendTo;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;documentKeyboardListener;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if((0,d.isPlatformBrowser)(this.platformId))return"modal"===this.mode||this.overlayResponsiveOptions&&this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return{...this.config?.overlayOptions,...this.options}}get overlayResponsiveOptions(){return{...this.overlayOptions?.responsive,...this.responsive}}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return r.DomHandler.getTargetElement(this.target,this.el?.nativeElement)}constructor(e,n,o,s,v,y,m){this.document=e,this.platformId=n,this.el=o,this.renderer=s,this.config=v,this.overlayService=y,this.zone=m,this.window=this.document.defaultView}ngAfterContentInit(){this.templates?.forEach(e=>{e.getType(),this.contentTemplate=e.template})}show(e,n=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),n&&r.DomHandler.focus(this.targetEl),this.modal&&r.DomHandler.addClass(this.document?.body,"p-overflow-hidden")}hide(e,n=!1){this.visible&&(this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),n&&r.DomHandler.focus(this.targetEl),this.modal&&r.DomHandler.removeClass(this.document?.body,"p-overflow-hidden"))}alignOverlay(){!this.modal&&r.DomHandler.alignOverlay(this.overlayEl,this.targetEl,this.appendTo)}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(e){switch(e.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&c.ZIndexUtils.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),r.DomHandler.appendOverlay(this.overlayEl,"body"===this.appendTo?this.document.body:this.appendTo,this.appendTo),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&r.DomHandler.addClass(this.overlayEl,"p-component-overlay-leave")}this.handleEvents("onAnimationStart",e)}onOverlayContentAnimationDone(e){const n=this.overlayEl||e.element.parentElement;switch(e.toState){case"visible":this.show(n,!0),this.bindListeners();break;case"void":this.hide(n,!0),this.unbindListeners(),r.DomHandler.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),c.ZIndexUtils.clear(n),this.modalVisible=!1}this.handleEvents("onAnimationDone",e)}handleEvents(e,n){this[e].emit(n),this.options&&this.options[e]&&this.options[e](n),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](n)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new r.ConnectedOverlayScrollHandler(this.targetEl,e=>{(!this.listener||this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}))&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{const o=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target))||this.isOverlayContentClicked);(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:3!==e.which&&o}):o)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.window,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!r.DomHandler.isTouchDevice()}):!r.DomHandler.isTouchDevice())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.window,"keydown",e=>{this.overlayOptions.hideOnEscape&&27===e.keyCode&&(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!r.DomHandler.isTouchDevice()}):!r.DomHandler.isTouchDevice())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}ngOnDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&(r.DomHandler.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),c.ZIndexUtils.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners()}static \u0275fac=function(n){return new(n||i)(t.\u0275\u0275directiveInject(d.DOCUMENT),t.\u0275\u0275directiveInject(t.PLATFORM_ID),t.\u0275\u0275directiveInject(t.ElementRef),t.\u0275\u0275directiveInject(t.Renderer2),t.\u0275\u0275directiveInject(p.PrimeNGConfig),t.\u0275\u0275directiveInject(p.OverlayService),t.\u0275\u0275directiveInject(t.NgZone))};static \u0275cmp=t.\u0275\u0275defineComponent({type:i,selectors:[["p-overlay"]],contentQueries:function(n,o,s){if(1&n&&t.\u0275\u0275contentQuery(s,p.PrimeTemplate,4),2&n){let v;t.\u0275\u0275queryRefresh(v=t.\u0275\u0275loadQuery())&&(o.templates=v)}},viewQuery:function(n,o){if(1&n&&(t.\u0275\u0275viewQuery(O,5),t.\u0275\u0275viewQuery(C,5)),2&n){let s;t.\u0275\u0275queryRefresh(s=t.\u0275\u0275loadQuery())&&(o.overlayViewChild=s.first),t.\u0275\u0275queryRefresh(s=t.\u0275\u0275loadQuery())&&(o.contentViewChild=s.first)}},hostAttrs:[1,"p-element"],inputs:{visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",appendTo:"appendTo",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options"},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[t.\u0275\u0275ProvidersFeature([f])],ngContentSelectors:R,decls:1,vars:1,consts:[[3,"ngStyle","class","ngClass","click",4,"ngIf"],[3,"ngStyle","ngClass","click"],["overlay",""],["content",""],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,o){1&n&&(t.\u0275\u0275projectionDef(),t.\u0275\u0275template(0,L,3,20,"div",0)),2&n&&t.\u0275\u0275property("ngIf",o.modalVisible)},dependencies:[d.NgClass,d.NgIf,d.NgTemplateOutlet,d.NgStyle],styles:["@layer primeng{.p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}}\n"],encapsulation:2,data:{animation:[(0,l.trigger)("overlayContentAnimation",[(0,l.transition)(":enter",[(0,l.useAnimation)(I)]),(0,l.transition)(":leave",[(0,l.useAnimation)(A)])])]},changeDetection:0})}return i})(),M=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=t.\u0275\u0275defineNgModule({type:i});static \u0275inj=t.\u0275\u0275defineInjector({imports:[d.CommonModule,p.SharedModule,p.SharedModule]})}return i})()}}]);