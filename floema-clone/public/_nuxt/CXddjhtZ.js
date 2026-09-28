import{V as e,n as t,zn as n}from"./cgz0BpdW.js";import{D as r,I as i,M as a,Mt as o,N as s,R as c,V as l,b as u,d,f,h as p,i as m,k as h,m as g,mt as _,p as v,q as y,st as b,v as x}from"./xJNWDYji.js";import{C as S,F as C,L as w,R as T,S as E,Y as D,Z as O,m as k,o as A,r as j,s as M,t as N}from"./CegNqfpt.js";import{f as P,l as ee,m as F,n as I}from"./DKtYPyz8.js";import{r as L}from"./BKSz1Hp1.js";import{t as R}from"./BDNMzG2s.js";import{t as z}from"./DQ4Nlvfy.js";import{t as B}from"./CHE2-zLL.js";import{t as V}from"./B8Og-qgs.js";import{o as H}from"#entry";var te=e=>{let t=e.container,n=e.scrollbar,r=e.thumb,a=e.onScrollEnd,o=b(!1),c=b(0),l=b(0),u=b(null),d=()=>{let e=t.value,i=n.value,a=r.value;if(!e||!i||!a)return;let o=e.querySelector(`.inner`);if(!o)return;let s=e.clientWidth,c=o.clientWidth;if(!s||!c||s>=c){i.style.display=`none`,a.style.width=`0px`,a.style.left=`0px`;return}i.style.display=`flex`;let l=e.scrollWidth,u=i.clientWidth;if(!l||!u)return;let d=s/l*u;a.style.width=`${d}px`;let f=e.scrollLeft,p=l-s,m=u-d,h=p>0?f/p*m:0;a.style.left=`${h}px`},f=()=>{d(),a&&(clearTimeout(u.value),u.value=setTimeout(()=>{a()},300))},p=e=>e?.touches?.length?e.touches[0].pageX:e?.changedTouches?.length?e.changedTouches[0].pageX:e.pageX,m=e=>{o.value=!0,c.value=p(e)-r.value.offsetLeft,l.value=t.value.scrollLeft,document.body.style.userSelect=`none`},h=()=>{o.value=!1,document.body.style.userSelect=``},g=e=>{if(!o.value)return;e.cancelable&&e.preventDefault();let i=p(e)-n.value.offsetLeft,a=r.value.clientWidth,s=t.value.scrollWidth-t.value.clientWidth,c=(i-a/2)/(n.value.clientWidth-a);t.value.scrollLeft=c*s},_=e=>{m(e)},v=()=>{h()},y=e=>{g(e)};return i(()=>{let e=O();t.value&&r.value&&n.value&&(t.value.addEventListener(`scroll`,f),r.value.addEventListener(`mousedown`,m),r.value.addEventListener(`touchstart`,_,{passive:!1}),document.addEventListener(`mouseup`,h),document.addEventListener(`mousemove`,g),document.addEventListener(`touchend`,v),document.addEventListener(`touchcancel`,v),document.addEventListener(`touchmove`,y,{passive:!1}),e.loader.ready.then(()=>d()))}),s(()=>{t.value&&t.value.removeEventListener(`scroll`,f),r.value&&r.value.removeEventListener(`mousedown`,m),r.value&&r.value.removeEventListener(`touchstart`,_),document.removeEventListener(`mouseup`,h),document.removeEventListener(`mousemove`,g),document.removeEventListener(`touchend`,v),document.removeEventListener(`touchcancel`,v),document.removeEventListener(`touchmove`,y)}),{handleScrollbarClick:e=>{let i=n.value,a=r.value,o=i.clientWidth-a.clientWidth,s=e.pageX-i.offsetLeft-a.clientWidth/2,c=Math.min(Math.max(s,0),o),l=t.value.scrollWidth-t.value.clientWidth,u=c/o;t.value.scrollTo({left:u*l,behavior:`smooth`})}}},ne={class:`g-row`},re={class:`xxl-14 xs-24 g-col`},ie={class:`-body-smaller-medium label`},ae={class:`-title-4-medium title`},oe=R({__name:`Header`,props:{upperTitle:{type:[Boolean,String],default:!1},title:{type:[Boolean,String],default:!1}},setup(e){P.registerPlugin(B);let t=b(null),n=r(`pageContext`),a,l,u,d=()=>{if(!t.value)return;let e=t.value.querySelector(`.title`);l=new B(e,{type:`lines, words`,linesClass:`line`,wordsClass:`word`,autoSplit:!0}),u=l.lines,P.set(e,{opacity:1}),P.set(u,{yPercent:-100,opacity:0});let n=t.value.querySelector(`.label`);P.set(n,{yPercent:-100,opacity:0}),a=P.timeline({paused:!0}),a.to(n,{yPercent:0,opacity:1,duration:1,ease:`circ.out`},`<`).to(u,{opacity:1,yPercent:0,opacity:1,stagger:.1,duration:.7,ease:`circ.out`},`-=0.8`)},m=()=>{t.value&&a.play()};return i(()=>{n.$page.loader.loaded.then(()=>d()),n.$page.loader.ready.then(()=>m())}),s(()=>{a&&a.kill()}),(n,r)=>(c(),p(`header`,{ref_key:`el`,ref:t,"data-component":`journal-header`},[f(`div`,ne,[f(`div`,re,[f(`h2`,ie,o(e.upperTitle),1),f(`h1`,ae,o(e.title),1)])])],512))}},[[`__scopeId`,`data-v-450d4f04`]]);P.registerPlugin(z);var U=()=>{let r=n(),{locale:i}=F(),a=t(),o=V(),s=e=>e.split(`?`)[0].split(`/`).filter(Boolean),c=e=>{let t=s(e);return t[+(t[0]===i.value)]||``};c(r.path);let l=()=>`/${c(r.path)}/`,u=e(`journalFilter`,()=>({category:{name:`All`,slug:`all`}})),d=b([]);return y(()=>u.value.category&&u.value.category.slug,e=>{if(!e)return;let t=l(),n=e===`all`?t:`${t}${e}/`,i=a(n);r.path!==i&&window.history.replaceState({},``,i),o.emit(`scroller-reset`),setTimeout(()=>{z.refresh()},100)}),y(()=>u.value.category,e=>{console.log(`Journal filter changed to:`,e)}),{journalFilter:u,availableArticles:d,filteredArticles:e=>!e||e.slug===`all`?d.value:d.value.filter(t=>t.presentation.category&&t.presentation.category.slug===e.slug),setCategory:e=>{u.value.category=e}}},se={class:`categories-wrapper`},ce=R({__name:`CategorySelector`,props:{categories:{type:[Boolean,Array],default:!1}},setup(e){let{journalFilter:t,availableArticles:n,filteredArticles:a,setArticles:o,setCategory:h}=U(),g=d(()=>t.value.category),y=b(null),x=r(`pageContext`),S,w,T=!1,E=()=>{if(!y.value)return;let e=y.value.querySelector(`.categories-wrapper`).children;w&&w.kill(),w=P.matchMedia();let t=L.xs,n=L.xs+1;w.add({isMobile:`(max-width: ${t}px)`,isDesktop:`(min-width: ${n}px)`},t=>{let{isMobile:n}=t.conditions;return P.set(e,{clearProps:`xPercent,yPercent,opacity`}),S=P.timeline({paused:!0}),n?(P.set(e,{xPercent:-20,opacity:0}),S.to(e,{xPercent:0,opacity:1,delay:.3,stagger:.05,duration:1,ease:`circ.out`},`<`)):(P.set(e,{yPercent:-100,opacity:0}),S.to(e,{yPercent:0,opacity:1,delay:.3,stagger:.05,duration:1,ease:`circ.out`},`<`)),T&&S.play(),()=>{S&&S.kill()}})},D=()=>{y.value&&(T=!0,S&&S.play())};return i(()=>{x.$page.loader.loaded.then(()=>E()),x.$page.loader.ready.then(()=>D())}),s(()=>{S&&S.kill(),w&&w.kill()}),(t,n)=>(c(),p(`div`,{ref_key:`el`,ref:y,"data-component":`category-selector`},[f(`div`,se,[u(_(C),{class:`button`,label:`All`,active:g.value.slug===`all`,onClick:n[0]||=e=>_(h)({name:`All`,slug:`all`})},null,8,[`active`]),(c(!0),p(m,null,l(e.categories,(e,t)=>(c(),v(_(C),{class:`button`,key:t,label:e.name,active:g.value.slug===e.slug,onClick:t=>_(h)(e)},null,8,[`label`,`active`,`onClick`]))),128))])],512))}},[[`__scopeId`,`data-v-ef4aacb2`]]),le={class:`g-row`},ue={class:`g-col xxl-24`},de={key:0,class:`-body-smaller-medium label`},fe={key:1,class:`category-title`},pe={class:`-title-4-medium`},me={class:`inner`},W=R({__name:`ArticlesSet`,props:{highlighted:{type:[Boolean,String],default:`left`},type:{type:[Boolean,String],default:!1},category:{type:[Boolean,Object],default:!1},posts:{type:[Boolean,Array],default:!1}},setup(e){P.registerPlugin(z);let t=I(),n=e,{setCategory:a}=U(),y=()=>{n.category&&a(n.category)},x=d(()=>{if(!Array.isArray(n.posts))return[];let e={bsm:[`large`,`small`,`medium`],msb:[`medium`,`small`,`large`],sbm:[`small`,`large`,`medium`]},t=n.type===`latest`?e.bsm:e[n.highlighted]||e.bsm;return n.posts.map((e,n)=>t[n]??`small`)}),C=b(null),T=b(null),E=b(null),{handleScrollbarClick:D}=te({container:C,scrollbar:T,thumb:E}),O=b(null),k,A,j=()=>{if(!O.value)return;let e;n.type===`latest`&&(e=O.value.querySelector(`.label`)),n.type===`latest-category`&&(e=O.value.querySelector(`.category-title`).children),P.set(e,{yPercent:100,opacity:0});let t=O.value.querySelector(`.cards-wrapper .inner`).children;P.set(t,{yPercent:100,opacity:0}),k=P.timeline({paused:!0}),n.type!==`latest`&&(A=z.create({trigger:O.value,start:`top 70%`,end:`bottom 70%`,once:!0,onEnter:()=>{k.play(0)}})),k.to(t,{yPercent:0,opacity:1,duration:1,ease:`circ.out`},`<`).to(e,{yPercent:0,opacity:1,duration:1,ease:`circ.out`},`-=0.5`)},M=()=>{O.value&&n.type===`latest`&&k.play(0)},N=r(`pageContext`);return i(()=>{N.$page.loader.loaded.then(()=>j()),N.$page.loader.ready.then(()=>M())}),s(()=>{A&&A.kill(),k&&k.kill()}),(n,r)=>(c(),p(`section`,{ref_key:`el`,ref:O,"data-component":`articles-set`},[f(`div`,le,[f(`div`,ue,[e.type===`latest`?(c(),p(`p`,de,o(_(t)(`latestArticles`,`NEEDS TRANSLATION`))+` ↓`,1)):g(``,!0),e.type===`latest-category`?(c(),p(`div`,fe,[f(`h4`,pe,o(e.category.name),1),u(_(w),{class:`view-more-btn`,label:_(t)(`viewAll`,`NEEDS TRANSLATION`),size:`medium`,icon:`arrow-right`,type:`internal`,clickFunc:y},null,8,[`label`])])):g(``,!0),f(`div`,{ref_key:`scrollContainerRef`,ref:C,class:`cards-wrapper`},[f(`div`,me,[(c(!0),p(m,null,l(e.posts,(e,t)=>(c(),v(_(S),h({key:t},{ref_for:!0},{...e.presentation,...e.metadata},{class:_(x)[t]}),null,16,[`class`]))),128))])],512),f(`div`,{ref_key:`scrollbarRef`,ref:T,class:`custom-scrollbar`,onMousedown:r[0]||=(...e)=>_(D)&&_(D)(...e)},[f(`div`,{ref_key:`scrollThumbRef`,ref:E,class:`scroll-thumb`},null,512)],544)])])],512))}},[[`__scopeId`,`data-v-94be86ab`]]),he={class:`g-row`},ge={class:`g-col xxl-24`},_e={class:`cards-wrapper`},G=R({__name:`ArticlesWithPag`,props:{posts:{type:[Boolean,Array],default:!1}},setup(e){P.registerPlugin(z);let t=e,n=d(()=>{if(!Array.isArray(t.posts))return[];let e=[];for(let n=0;n<t.posts.length*3;n++){let t=Math.floor(n/3),r=n%3;t%3==0&&r===1||t%3==1&&r===0||t%3==2&&r===2?e.push(`large`):e.push(``)}return e}),a=b(null),o,u,g=()=>{if(!a.value)return;let e=a.value.querySelector(`.cards-wrapper`).children;P.set(e,{yPercent:100,opacity:0}),o=P.timeline({paused:!0}),t.type!==`latest`&&(u=z.create({trigger:a.value,start:`top 70%`,end:`bottom 70%`,once:!0,onEnter:()=>{o.play(0)}})),o.to(e,{yPercent:0,opacity:1,duration:1,ease:`circ.out`},`<`)},y=()=>{a.value&&t.type===`latest`&&o.play(0)},x=r(`pageContext`);return i(()=>{x.$page.loader.loaded.then(()=>g()),x.$page.loader.ready.then(()=>y())}),s(()=>{u&&u.kill(),o&&o.kill()}),(t,r)=>(c(),p(`section`,{ref_key:`el`,ref:a,"data-component":`articles-pagination`},[f(`div`,he,[f(`div`,ge,[f(`div`,_e,[(c(!0),p(m,null,l(e.posts,(e,t)=>(c(),v(_(S),h({key:t},{ref_for:!0},{...e.presentation,...e.metadata},{class:[_(n)[t]]}),null,16,[`class`]))),128))])])])],512))}},[[`__scopeId`,`data-v-decae1fc`]]),ve={class:`g-row`},ye={class:`g-col xxl-12 xs-24`},be={class:`-body-smaller-medium label`},xe={class:`case-studies-wrapper`},Se={class:`media-wrapper`},Ce={class:`g-row`},we={class:`-title-2-medium title`},Te={class:`category-description`},Ee={class:`-body-small-medium category`},De={class:`description`},Oe={class:`-title-8-regular`},ke=R({__name:`FeaturedCaseStudies`,props:{upperTitle:{type:[Boolean,String],default:!1},featuredCaseStudies:{type:[Boolean,Array],default:!1}},setup(e){let t=I(),n=b(null);b(0);let a=[],d=null,h=()=>{a=n.value.querySelectorAll(`.case-study`),a.forEach((e,t)=>{let n=e.querySelectorAll(` .title, .category, .description p, .description .button, .line`);t!==0&&(e.querySelector(`.media-wrapper`).style.opacity=0),n.forEach((e,t)=>{e.style.opacity=0})}),d=P.timeline({repeat:-1,repeatDelay:0,paused:!0}),a.forEach((e,t)=>{let n=e.querySelector(`.media-wrapper`),r=e.querySelector(`.title`),i=e.querySelector(`.category`),o=e.querySelector(`.description p`),s=e.querySelector(`.description .button`),c=e.querySelector(`.line`),l=e.querySelector(`.line .progress`),u=`item${t}`;d.addLabel(u),t!==0&&d.fromTo([n],{opacity:0,scale:1.1},{opacity:1,scale:1,duration:1,ease:`expo.out`}),d.fromTo([r],{opacity:0,yPercent:-50},{opacity:1,yPercent:0,duration:1,ease:`expo.out`},`<`),d.fromTo([i,o,s],{opacity:0,yPercent:40},{opacity:1,yPercent:0,delay:-.8,duration:.8,stagger:.12,ease:`expo.out`}),d.to(c,{opacity:1,delay:-.7,duration:.3,ease:`none`}),d.fromTo(l,{width:`0%`},{width:`100%`,duration:7,ease:`none`},`<`),d.to(c,{opacity:0,duration:.3}),d.to([r],{opacity:0,yPercent:-50,delay:-.3,duration:1,ease:`expo.out`}),d.to([i,o,s],{opacity:0,yPercent:50,duration:1,ease:`expo.out`},`<`),t===a.length-1&&d.to([n],{opacity:0,scale:1.1,duration:1,ease:`expo.out`})})},g=()=>{d.play()};return r(`pageContext`),s(()=>{}),i(()=>{h(),g()}),(r,i)=>(c(),p(`section`,{ref_key:`el`,ref:n,"data-component":`featured-case-studies`},[f(`div`,ve,[f(`div`,ye,[f(`p`,be,o(e.upperTitle),1)])]),f(`div`,xe,[(c(!0),p(m,null,l([...e.featuredCaseStudies,...e.featuredCaseStudies],(e,n)=>(c(),p(`div`,{class:`case-study`,key:n},[f(`div`,Se,[u(_(k),{media:e.presentation.mediaAsset},null,8,[`media`])]),f(`div`,Ce,[f(`h4`,we,o(e.presentation.title),1),i[0]||=f(`span`,{class:`line`},[f(`span`,{class:`progress`})],-1),f(`div`,Te,[f(`p`,Ee,o(e.presentation.category.name),1),f(`div`,De,[f(`p`,Oe,o(e.presentation.description),1),u(_(T),{to:{name:`journal-category-slug`,params:{category:e.presentation.category.slug,slug:e.metadata.slug}},label:_(t)(`learnMore`,`Saber mais`),theme:`light`,icon:`arrow-right`,iconPlacement:`front`,class:`button`},null,8,[`to`,`label`])])])])]))),128)),i[1]||=x(`<div class="navigation-buttons" data-v-02ab978f><svg width="93" height="44" viewBox="0 0 93 44" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-02ab978f><path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 5.37258 5.37258 0 12 0H32C37.7762 0 42.5993 4.08117 43.7429 9.51729C44.0271 10.8684 45.1193 12 46.5 12C47.8807 12 48.9729 10.8684 49.2571 9.51729C50.4007 4.08117 55.2238 0 61 0H81C87.6274 0 93 5.37258 93 12V32C93 38.6274 87.6274 44 81 44H61C55.2238 44 50.4007 39.9188 49.2571 34.4827C48.9729 33.1316 47.8807 32 46.5 32C45.1193 32 44.0271 33.1316 43.7429 34.4827C42.5993 39.9188 37.7762 44 32 44H12C5.37258 44 0 38.6274 0 32V12Z" fill="white" data-v-02ab978f></path><path fill-rule="evenodd" clip-rule="evenodd" d="M72.0991 23.331C72.8339 22.5955 72.8338 21.4036 72.0988 20.6681C72.0987 20.668 72.0985 20.6679 72.0984 20.6677L68.702 17.2714C68.5207 17.09 68.5207 16.7959 68.702 16.6146L69.1059 16.2107C69.2873 16.0293 69.5813 16.0293 69.7627 16.2107L73.159 19.607L75.0214 21.4694L75.2233 21.6713C75.4047 21.8527 75.4047 22.1468 75.2233 22.3281L75.0214 22.5301L73.159 24.3924L69.7627 27.7888C69.5813 27.9701 69.2873 27.9701 69.1059 27.7888L68.702 27.3849C68.5207 27.2035 68.5207 26.9095 68.702 26.7281L72.0984 23.3318C72.0986 23.3315 72.0989 23.3313 72.0991 23.331Z" fill="#241F21" data-v-02ab978f></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3319 24.393L22.7283 27.7893C22.9096 27.9707 23.2037 27.9707 23.3851 27.7893L23.7889 27.3854C23.9703 27.2041 23.9703 26.91 23.7889 26.7286L20.3926 23.3323C20.3923 23.3321 20.3921 23.3318 20.3919 23.3316C19.6572 22.5961 19.6572 21.4044 20.3919 20.6689C20.3921 20.6687 20.3924 20.6684 20.3926 20.6682L23.7889 17.2719C23.9703 17.0905 23.9703 16.7965 23.7889 16.6151L23.3851 16.2112C23.2037 16.0299 22.9096 16.0299 22.7283 16.2112L19.3319 19.6076L17.2676 21.6719C17.0863 21.8532 17.0863 22.1473 17.2676 22.3287L19.3311 24.3922C19.3314 24.3924 19.3317 24.3927 19.3319 24.393Z" fill="#241F21" data-v-02ab978f></path></svg></div>`,1)])],512))}},[[`__scopeId`,`data-v-02ab978f`]]),Ae={class:`g-row centered`},je={class:`g-col xxl-10 xs-24`},Me={class:`title-wrapper`},Ne={class:`-title-3-medium title`},Pe=R({__name:`Newsletter`,props:{title:{type:[Boolean,String],default:!1}},setup(e){let t=ee(),n=d(()=>t.value?.sharedContentPayload||[]);r(`pageContext`);let a=b(null),{locale:l}=F(),m=d(()=>({...(n.value.find(e=>e.lang===l.value)||{}).newsletter||{newsletter:!1}}));return s(()=>{}),i(()=>{}),(t,n)=>(c(),p(`section`,{ref_key:`el`,ref:a,"data-component":`newsletter`},[f(`div`,Ae,[f(`div`,je,[f(`div`,Me,[n[0]||=f(`svg`,{width:`29`,height:`43`,viewBox:`0 0 29 43`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`},[f(`path`,{d:`M28.9968 0H0V43H6.94503V16.0516C6.94503 14.1452 9.21055 13.1937 10.5337 14.539L21.6968 25.8886L26.1084 21.4032L15.0357 10.1422C13.7126 8.79687 14.6485 6.49348 16.5235 6.49348H29V0H28.9968Z`,fill:`#BEB9B0`})],-1),f(`h3`,Ne,o(e.title),1),u(_(E),{theme:`journal`,class:`newsletter`,privacy:{privacyText:_(m).privacyText,privacyPage:_(m).privacyPage}},null,8,[`privacy`])])])])],512))}},[[`__scopeId`,`data-v-b6d4d537`]]),Fe={"data-component":`journal-page`,class:`inner-page`},Ie=R({__name:`Journal`,props:{metadata:{type:[Boolean,Object],default:!1},sections:{type:[Boolean,Array],default:!1},latestPosts:{type:[Boolean,Array],default:!1},latestByCategory:{type:[Boolean,Array],default:!1},postsByCategory:{type:[Boolean,Array],default:!1},categories:{type:[Boolean,Array],default:!1},posts:{type:[Boolean,Array],default:!1},isCategoryPage:{type:[Boolean,String],default:!1}},setup(e){let t=e,n=V();a(()=>{if(typeof t.isCategoryPage==`string`){let e=t.isCategoryPage,n=t.categories.find(t=>t.slug===e)||{};s.value.category=n}}),i(()=>{n.emit(`change-menu-theme`,`main`)});let r=[`msb`,`bsm`,`sbm`,`msb`],o=d(()=>{if(t.latestByCategory)return t.latestByCategory.filter(e=>e.slug!==`case-studies`)}),{journalFilter:s,filteredArticles:y}=U(),b=d(()=>s.value.category),x=d(()=>{let e=t.postsByCategory.find(e=>e.slug===b.value.slug);return e?e.posts:[]}),S=d(()=>t.isCategoryPage&&b.value.slug===t.isCategoryPage),{onEnter:C,onLeave:w}=D();return(t,n)=>(c(),p(`div`,Fe,[u(_(oe),h(e.sections[0],{"data-section-intersect":`dark`}),null,16),f(`main`,null,[u(_(ce),{categories:e.categories,"data-section-intersect":`dark`},null,8,[`categories`]),S.value?(c(),v(_(G),{key:1,type:`category`,category:b.value,posts:e.posts,"data-section-intersect":`dark`},null,8,[`category`,`posts`])):(c(),p(m,{key:0},[b.value.slug===`all`?(c(),p(m,{key:0},[u(_(W),{type:`latest`,highlighted:`bsm`,posts:e.latestPosts,"data-section-intersect":`dark`},null,8,[`posts`]),u(_(Pe),h(e.sections[1],{"data-section-intersect":`dark`}),null,16),u(_(ke),h(e.sections[2],{"data-section-intersect":`light`}),null,16),(c(!0),p(m,null,l(o.value,(e,t)=>(c(),p(m,null,[e.slug!==`case-studies`&&e.posts.length>=1?(c(),v(_(W),{type:`latest-category`,category:e,key:t,highlighted:r[t%r.length],posts:e.posts,"data-section-intersect":`dark`},null,8,[`category`,`highlighted`,`posts`])):g(``,!0)],64))),256))],64)):(c(),v(_(G),{key:1,type:`category`,category:b.value,posts:x.value,"data-section-intersect":`dark`},null,8,[`category`,`posts`]))],64)),u(_(j),h(e.sections[3],{"data-section-intersect":`dark`}),null,16)]),u(_(A))]))}},[[`__scopeId`,`data-v-28271b9c`]]);function K(e=`pt`){return`
		*[ _type == "journalCategory" && lang == '${e}' && !(_id in path("drafts.**"))]{
			name,
			"slug": slug.current
		}
	`}function q(e=`pt`){return`
		*[ _type == "journalCategory" && lang == '${e}' && !(_id in path("drafts.**"))]{
			name,
			"slug": slug.current,
			"posts": *[ _type == "page.article" && presentation.category._ref == ^._id && lang == '${e}' && !(_id in path("drafts.**"))] | order(presentation.date desc)[0..2] {
				metadata {
					"slug": slug.current
				},
				presentation {
					title,
					description,
					date,
					"category": category->{ 
						name,
						"slug": slug.current
					},
					${H()}
				}
			}
		}
	`}function J(e=`pt`){return`
		*[ _type == "journalCategory" && lang == '${e}' && !(_id in path("drafts.**"))]{
			name,
			"slug": slug.current,
			"posts": *[ _type == "page.article" && presentation.category._ref == ^._id && lang == '${e}' && !(_id in path("drafts.**"))] | order(presentation.date desc) {
				metadata {
					"slug": slug.current
				},
				presentation {
					title,
					description,
					date,
					"category": category->{ 
						name,
						"slug": slug.current
					},
					${H()}
				}
			}
		}
	`}function Y(e=`pt`){return`
		*[ _type == "page.article" && lang == '${e}' && !(_id in path("drafts.**"))] | order(presentation.date desc)[0..2] {
			metadata {
				"slug": slug.current
			},
			presentation {
				title,
				description,
				date,
				"category": category->{ 
					name,
					"slug": slug.current
				},
				${H()}
			}
		}
	`}function Le(e,t=`pt`){return N`*[_type == 'journalCategory' && slug.current == "${e}" && lang == '${t}' && !(_id in path("drafts.**"))][0] {
	name,
	"slug": slug.current,
	"metadata": *[_type == 'page.journal' && lang == '${t}' && !(_id in path("drafts.**"))][0] {
		...metadata{...${M()}}
	},
	"sections": *[_type == 'page.journal' && lang == '${t}' && !(_id in path("drafts.**"))][0] { 
		sections[] {
			_type,
			${X},
			${Z},
			${$},
			${Q},
		},
	}.sections,

		
	"posts": *[ _type == "page.article" && presentation.category._ref == ^._id && lang == '${t}' && !(_id in path("drafts.**"))] | order(presentation.date desc) {
		metadata {
			"slug": slug.current
		},
		presentation {
			title,
			description,
			date,
			"category": category->{ 
				name,
				"slug": slug.current
			},
			${H()}
		}
	},

	"latestPosts": ${Y(t)},
	"latestByCategory": ${q(t)},
	"postsByCategory": ${J(t)},
	"categories": ${K(t)},	
  }
`}var X=`
	_type == "journalHeader" => {
		upperTitle,
     	title,
    }
`,Z=`
	_type == "featuredCaseStudy" => {
     	upperTitle,
		featuredCaseStudies[]->{
			metadata{
				"slug": slug.current
			},
			presentation{
				title,
				description,
				${H()},
				"category": category-> {
					name, 
					"slug": slug.current
				}
			}
		}
    }
`,Q=`
	_type == "newsletter" => {
     	title,
    }
`,$=`
	_type == "lowerTagline" => {
     	title,
    }
`;function Re(e=`pt`){return N`
	*[_type == 'page.journal' && lang == '${e}' && !(_id in path("drafts.**"))][0] {
		_type,
		"metadata": metadata{...${M({includeStructuredData:!0})}},
		"sections": sections[] {
			_type,
			${X},
			${Z},
			${$},
			${Q},
		},
		"latestPosts": ${Y(e)},
		"latestByCategory": ${q(e)},
		"postsByCategory": ${J(e)},
		"categories": ${K(e)},
	}
	`}export{Re as n,Ie as r,Le as t};