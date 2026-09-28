import{Bn as e,Pn as t,S as n,Zt as r,pn as i}from"./cgz0BpdW.js";import{A as a,At as o,D as s,I as c,Mt as l,N as u,R as d,V as f,X as p,Y as m,b as h,d as g,f as _,h as v,i as y,k as b,kt as x,m as S,mt as C,p as w,q as T,s as E,st as D,w as O,y as k}from"./xJNWDYji.js";import{$ as A,F as j,H as M,J as N,O as P,W as F,Y as I,c as L,k as R,n as z,o as B,s as V,t as H,y as U}from"./CegNqfpt.js";import{d as W,f as G,i as K,m as q,n as J,o as ee}from"./DKtYPyz8.js";import{t as Y}from"./BDNMzG2s.js";import{t as X}from"./DQ4Nlvfy.js";import{t as Z}from"./CHE2-zLL.js";import{t as te}from"./B8Og-qgs.js";import{a as Q,o as $,s as ne}from"#entry";import{t as re}from"./CNs_Ozdc.js";var ie={class:`g-row`},ae={class:`xxl-14 sm-22 g-col`},oe={class:`-title-4-medium title`},se=Y({__name:`Header`,props:{title:{type:[Boolean,String],default:!1}},setup(e){G.registerPlugin(Z);let t=D(null),n,r,i,a=()=>{if(!t.value)return;let e=t.value.querySelector(`.title`);r=new Z(e,{type:`lines, words`,linesClass:`line`,wordsClass:`word`,autoSplit:!0}),i=r.lines,G.set(e,{opacity:1}),G.set(i,{yPercent:-100,opacity:0}),n=G.timeline({paused:!0}),n.to(i,{opacity:1,yPercent:0,opacity:1,stagger:.05,duration:.8,ease:`circ.out`})},o=()=>{t.value&&n.play()},f=s(`pageContext`);return u(()=>{}),c(()=>{f.$page.loader.loaded.then(()=>a()),f.$page.loader.ready.then(()=>o())}),(n,r)=>(d(),v(`header`,{ref_key:`el`,ref:t,"data-component":`products-header`},[_(`div`,ie,[_(`div`,ae,[_(`h1`,oe,l(e.title),1)])])],512))}},[[`__scopeId`,`data-v-dd80f6ce`]]),ce={class:`g-row main-categories`},le={class:`xxl-24 g-col`},ue={class:`titles-wrapper`},de={class:`-body-smaller-medium label`},fe={class:`-body-smaller-medium label`},pe={class:`tags-wrapper`},me={class:`g-row sub-categories`},he={class:`xxl-8 g-col product-count`},ge={class:`-body-smaller-medium label`},_e={key:0,class:`xxl-16 g-col sub-wrapper`},ve=Y({__name:`CategorySelector`,props:{products:{type:[Boolean,Array],default:!1},collections:{type:[Boolean,Array],default:!1},productTypes:{type:[Boolean,Array],default:!1}},setup(e){let t=e,r=D(null),i=J(),o=s(`pageContext`),{availableProducts:m,productFilter:h,filteredProducts:b,addFilter:E,removeFilter:O,clearFilters:M,productTypeHasResults:P,setActiveCategory:F,setActiveSubCollection:I}=N(t.products),L=g(()=>{let e=m.value.length,t=b.value.length;return`${i(`showing`)} ${t} ${i(`of`)} ${e} ${i(`results`)} ↓`}),z=g(()=>{if(h.value.collections.length>0){let e=h.value.collections[0];if(Array.isArray(t.collections)){let n=t.collections.find(t=>t.name===e);return n&&n.subCategories?n.subCategories:[]}}return[]}),B=g(()=>JSON.stringify(z.value.map(e=>e.name))),V,H,U=()=>{r.value&&(G.set(r.value.querySelector(`.titles-wrapper`).children,{yPercent:-100,opacity:0}),G.set(r.value.querySelector(`.tags-wrapper`).children,{yPercent:-50,opacity:0}),G.set(r.value.querySelector(`.product-count`).children,{yPercent:-100,opacity:0}),V=G.timeline({paused:!0}),V.to(r.value.querySelector(`.tags-wrapper`).children,{yPercent:0,opacity:1,stagger:.02,duration:.8,ease:`circ.out`}).to(r.value.querySelector(`.titles-wrapper`).children,{yPercent:0,opacity:1,duration:1.2,ease:`power4.out`},`-=0.4`).to(r.value.querySelector(`.product-count`).children,{yPercent:0,opacity:1,duration:.8,ease:`power4.out`},`-=0.8`))},W=async()=>{if(!r.value||z.value.length===0)return;await a();let e=r.value.querySelector(`.sub-wrapper`);e&&e.children.length!==0&&(H&&H.kill(),G.set(e.children,{yPercent:35,opacity:0}),H=G.timeline(),H.to(e.children,{yPercent:0,opacity:1,stagger:.04,duration:.6,ease:`power3.out`,overwrite:`auto`}))},K=()=>{r.value&&V.play()};return T(B,()=>{if(o?.$page?.loader?.ready){o.$page.loader.ready.then(()=>W());return}W()},{immediate:!0,flush:`post`}),u(()=>{}),c(()=>{Array.from(r.value.querySelectorAll(`.tags-wrapper img`)).forEach(e=>{o.$page.loader.deferLoad(A(e))}),o.$page.loader.loaded.then(()=>U()),o.$page.loader.ready.then(()=>K())}),(t,a)=>{let o=n;return d(),v(`div`,{ref_key:`el`,ref:r,"data-component":`category-selector`},[_(`div`,ce,[_(`div`,le,[_(`div`,ue,[_(`p`,de,[_(`span`,null,l(C(i)(`filter`)),1),k(` `+l(C(i)(`byCollections`)),1)]),_(`p`,fe,[_(`span`,null,l(C(i)(`filter`)),1),k(` `+l(C(i)(`byProducts`)),1)])]),_(`div`,pe,[(d(!0),v(y,null,f(e.collections,(e,t)=>(d(),v(y,null,[e.oldCatalogue?S(``,!0):(d(),w(C(R),{key:t,collection:e,size:`full`,active:C(h).collections[0]===e.name,onClick:t=>C(F)(e.name,`collections`)},null,8,[`collection`,`active`,`onClick`])),e.oldCatalogue?(d(),w(o,{to:e.oldCatalogue,key:t,target:`_blank`},{default:p(()=>[(d(),w(C(R),{key:t,collection:e,size:`full`,"has-link":!0},null,8,[`collection`]))]),_:2},1032,[`to`])):S(``,!0)],64))),256)),(d(!0),v(y,null,f(e.productTypes,(e,t)=>(d(),w(C(R),{key:t,collection:e,size:`full`,active:C(h).productTypes[0]===e.name,class:x({"-disabled":!C(P)(e.name)}),onClick:t=>C(F)(e.name,`productTypes`)},null,8,[`collection`,`active`,`class`,`onClick`]))),128))])])]),_(`div`,me,[_(`div`,he,[_(`p`,ge,l(L.value),1)]),z.value.length>0?(d(),v(`div`,_e,[(d(!0),v(y,null,f(z.value,(e,t)=>(d(),w(C(j),{key:t,label:e.name,active:C(h).subCollections.includes(e.name),onClick:t=>C(I)(e.name)},null,8,[`label`,`active`,`onClick`]))),128))])):S(``,!0)])],512)}}},[[`__scopeId`,`data-v-42ca5119`]]),ye={class:`main`},be={class:`collection-filter`},xe={class:`-body-smaller-medium`},Se={class:`tags-wrapper`},Ce={class:`product-filter`},we={class:`-body-smaller-medium`},Te={class:`tags-wrapper`},Ee={key:0,class:`dividor`},De={key:1,class:`sub`},Oe={class:`product-count`},ke={class:`-body-smaller-medium`},Ae={class:`button-wrapper`},je={class:`-caption-semibold`},Me={key:0,class:`-caption-semibold category`},Ne=Y({__name:`CategorySelectorFloat`,props:{products:{type:[Boolean,Array],default:!1},collections:{type:[Boolean,Array],default:!1},productTypes:{type:[Boolean,Array],default:!1},enabled:{type:Boolean,default:!1}},setup(e){W.registerPlugin(X);let t=e,n=D(null),r=J(),i=s(`$scroller`,null),{productFilter:o,productTypeHasResults:p,setActiveCategory:m,setActiveSubCollection:b}=N(t.products),O=async()=>{await a(),requestAnimationFrame(()=>{let e=document.querySelector(`[data-component="product-list"]`);if(!e)return;let t=i?.value?.getScrollerInstance?.().value||null,n=(typeof t?.animatedScroll==`number`?t.animatedScroll:window.scrollY||window.pageYOffset||0)+e.getBoundingClientRect().top-200,r=Math.max(0,Math.round(n));if(i?.value?.scrollTo){i.value.scrollTo(r,1,!1),X.refresh();return}window.scrollTo({top:r,behavior:`smooth`})})},A=(e,t)=>{let n=o.value?.[t]?.[0];m(e,t),n!==e&&O()},M=g(()=>{if(o.value.collections.length>0){let e=o.value.collections[0];if(Array.isArray(t.collections)){let n=t.collections.find(t=>t.name===e);return n&&n.subCategories?n.subCategories:[]}}return[]}),P=g(()=>o.value.collections.length>0?o.value.collections[0]:o.value.productTypes.length>0?o.value.productTypes[0]:``),F=D(!1),I=D(`body`),L=D(null),z=D(null),B=D(null),V=D(null),H=()=>{F.value&&(W.to(L.value,{duration:.5,y:50,opacity:0,ease:`power2.out`,onStart:()=>{L.value.classList.remove(`open`)},onComplete:()=>{F.value=!1,W.set(n.value,{pointerEvents:`none`})}}),W.fromTo(z.value,{y:-50,opacity:0},{duration:.5,y:0,opacity:1,ease:`power2.out`}),W.fromTo(B.value,{scale:1,opacity:1},{duration:.5,scale:0,opacity:0,ease:`power2.out`}))},U=()=>{F.value?H():(F.value=!0,W.set(n.value,{pointerEvents:`all`}),W.fromTo(L.value,{y:50,opacity:0},{duration:.5,y:0,opacity:1,ease:`power2.out`,onStart:()=>{L.value.classList.add(`open`),W.set(L.value,{clearProps:`pointerEvents`})}}),W.fromTo(z.value,{y:0,opacity:1},{duration:.5,y:-50,opacity:0,ease:`power2.out`}),W.fromTo(B.value,{scale:0,opacity:0},{duration:.5,scale:1,opacity:1,ease:`power2.out`}))};T(()=>t.enabled,e=>{e?W.to(n.value,{duration:.5,y:0,opacity:1,ease:`power2.out`,onStart:()=>{}}):(H(),W.to(n.value,{duration:.5,y:50,opacity:0,ease:`power2.out`,onComplete:()=>{W.set(n.value,{pointerEvents:`none`})}}))}),T(()=>M.value.length,async(e,t)=>{let n=L.value;if(!n)return;let r=n.offsetHeight;if(await a(),e>0&&V.value){let e=V.value.children;W.set(e,{opacity:0,y:8})}let i=n.offsetHeight;W.set(n,{height:r,overflow:`hidden`}),W.to(n,{height:i,duration:.5,ease:`power2.out`,onComplete:()=>{if(W.set(n,{clearProps:`height,overflow`}),e>0&&V.value){let e=V.value.children;W.to(e,{opacity:1,y:0,duration:.35,stagger:.06,ease:`power2.out`})}}})});let G=e=>{e.key===`Escape`&&F.value&&H()};return u(()=>{window.removeEventListener(`keydown`,G)}),c(()=>{{let e=document.querySelector(`.inner-page[data-component="products-page"]`);e&&(I.value=e)}W.set(n.value,{y:50,opacity:0}),!F.value&&L.value&&W.set(L.value,{opacity:0,y:50}),window.addEventListener(`keydown`,G)}),(t,i)=>(d(),v(`div`,{ref_key:`el`,ref:n,"data-component":`category-selector-float`},[(d(),w(E,{to:I.value},[_(`span`,{class:x([`click-outside`,{active:F.value}]),onClick:H},null,2)],8,[`to`])),_(`div`,{ref_key:`categoriesWrapper`,ref:L,class:`categories-wrapper`},[_(`div`,ye,[_(`div`,be,[_(`p`,xe,[_(`span`,null,l(C(r)(`filter`)),1),k(` `+l(C(r)(`byCollections`)),1)]),_(`div`,Se,[(d(!0),v(y,null,f(e.collections,(e,t)=>(d(),v(y,null,[e.oldCatalogue?S(``,!0):(d(),w(C(R),{key:t,collection:e,size:`full-small`,active:C(o).collections[0]===e.name,onClick:t=>A(e.name,`collections`)},null,8,[`collection`,`active`,`onClick`])),e.oldCatalogue?(d(),v(`div`,{class:`-disabled`,key:t},[h(C(R),{collection:e,size:`full-small catalogue`,oldWebsite:!0},null,8,[`collection`])])):S(``,!0)],64))),256))])]),_(`div`,Ce,[_(`p`,we,[_(`span`,null,l(C(r)(`filter`)),1),k(` `+l(C(r)(`byProducts`)),1)]),_(`div`,Te,[(d(!0),v(y,null,f(e.productTypes,(e,t)=>(d(),w(C(R),{key:t,collection:e,size:`full-small`,active:C(o).productTypes[0]===e.name,class:x({"-disabled":!C(p)(e.name)}),onClick:t=>A(e.name,`productTypes`)},null,8,[`collection`,`active`,`class`,`onClick`]))),128))])])]),M.value.length>0?(d(),v(`div`,Ee,[...i[0]||=[_(`span`,{class:`line`},null,-1)]])):S(``,!0),M.value.length>0?(d(),v(`div`,De,[_(`div`,Oe,[_(`p`,ke,l(C(r)(`subFilter`))+` Urban`,1)]),_(`div`,{ref_key:`subWrapper`,ref:V,class:`sub-wrapper`},[(d(!0),v(y,null,f(M.value,(e,t)=>(d(),w(C(j),{key:t,label:e.name,active:C(o).subCollections.includes(e.name),onClick:t=>C(b)(e.name)},null,8,[`label`,`active`,`onClick`]))),128))],512)])):S(``,!0)],512),_(`div`,Ae,[_(`button`,{class:`button`,onClick:U},[_(`div`,{ref_key:`filtering`,ref:z,class:`filtering`},[i[1]||=_(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`},[_(`path`,{d:`M2.00391 12.6686V3.33529C2.00391 2.59891 2.60086 2.00195 3.33724 2.00195H12.6706C13.407 2.00195 14.0039 2.59891 14.0039 3.33529V12.6686C14.0039 13.405 13.407 14.002 12.6706 14.002H3.33724C2.60086 14.002 2.00391 13.405 2.00391 12.6686Z`,stroke:`#241F21`,"stroke-width":`1.5`}),_(`path`,{d:`M5.33594 9.33464L8.0026 6.66797L10.6693 9.33464`,stroke:`#241F21`,"stroke-width":`1.5`,"stroke-linecap":`round`,"stroke-linejoin":`round`})],-1),_(`p`,je,[k(l(C(r)(`filter`))+` `,1),P.value?(d(),v(`span`,Me,l(P.value),1)):S(``,!0)])],512),_(`div`,{ref_key:`close`,ref:B,class:`close`},[...i[2]||=[_(`svg`,{width:`25`,height:`24`,viewBox:`0 0 25 24`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`},[_(`path`,{"fill-rule":`evenodd`,"clip-rule":`evenodd`,d:`M7.72798 6.16667C7.43509 5.87377 6.96021 5.87377 6.66732 6.16667C6.37443 6.45956 6.37443 6.93443 6.66732 7.22733L10.3781 10.9381C10.9639 11.5239 10.9639 12.4736 10.3781 13.0594L6.66412 16.7734C6.37123 17.0663 6.37122 17.5411 6.66412 17.834C6.95701 18.1269 7.43189 18.1269 7.72478 17.834L11.4387 14.1201C12.0245 13.5343 12.9743 13.5343 13.5601 14.1201L17.2739 17.8339C17.5668 18.1268 18.0417 18.1268 18.3346 17.8339C18.6275 17.541 18.6275 17.0662 18.3346 16.7733L14.6207 13.0594C14.0349 12.4736 14.0349 11.5239 14.6207 10.9381L18.3314 7.22744C18.6243 6.93455 18.6243 6.45967 18.3314 6.16678C18.0385 5.87389 17.5636 5.87389 17.2707 6.16678L13.5601 9.87743C12.9743 10.4632 12.0245 10.4632 11.4387 9.87743L7.72798 6.16667Z`,fill:`black`})],-1)]],512)])])],512))}},[[`__scopeId`,`data-v-06fb3510`]]),Pe={class:`g-row`},Fe={class:`xxl-24 g-col`},Ie={key:0,class:`grid-layout squared-grid`},Le=Y({__name:`ProductList`,props:{products:{type:[Boolean,Array],default:!1},collections:{type:[Boolean,Array],default:!1}},setup(e){let t=e,n=D(null),{filteredProducts:r,productFilter:i}=N(t.products),o=g(()=>{if(!Array.isArray(t.collections))return null;let e=i.value.collections[0];return e&&t.collections.find(t=>t.name===e)||null}),l=e=>(Array.isArray(e?.caseStudyList)?e.caseStudyList:[]).filter(Boolean).map(t=>({...t,collection:e,source:`caseStudy`})),m=e=>{let t=e?.catalogue;if(!t?.file)return null;let n=t.title||t.smallTitle||`Catalogue`;return{_id:`catalogue-${e?.name||`collection`}`,file:t.file,title:n,mediaAsset:t.mediaAsset,presentation:{title:n,mediaAsset:t.mediaAsset},collection:e,source:`catalogue`}},E=g(()=>{if(!Array.isArray(t.collections))return[];if(!o.value)return t.collections.flatMap(e=>l(e));let e=l(o.value),n=m(o.value);return n?[n,...e]:e}),O=D([...r.value]),k=g(()=>[...O.value]),A={layout1:{areas:[[`square1`,`vertical`,`square2`,`square3`],[`square4`,`vertical`,`horizontal`,`horizontal`]]},layout2:{areas:[[`horizontal`,`horizontal`,`square1`,`square2`]]},layout3:{areas:[[`horizontal`,`horizontal`,`vertical`,`square1`],[`square2`,`square3`,`vertical`,`square4`]]},layout4:{areas:[[`square1`,`square2`,`horizontal`,`horizontal`]]}},j={layout2:[`horizontal`],layout4:[`horizontal`]};function F(e){let t=new Set;e.areas.forEach(e=>{e.forEach(e=>t.add(e))});let n=t.size,r={square:0,vertical:0,horizontal:0};return t.forEach(e=>{e.startsWith(`square`)?r.square++:e.startsWith(`vertical`)?r.vertical++:e.startsWith(`horizontal`)&&r.horizontal++}),{total:n,counts:r}}let I={};for(let[e,t]of Object.entries(A))I[e]=F(t);let L=g(()=>k.value.map(e=>{let t=e.sections&&e.sections[0]&&e.sections[0].mainImage,n=null;if(t&&t.width&&t.height){let e=t.width/t.height;e>2&&(n=`horizontal`),e<.9&&(n=`vertical`),e<1.2&&e>.99&&(n=`square`)}return{...e,aspectRatio:n}}));function R(e,t){let n=[...t],r=[],i=new Set,a=[];for(let t of e.areas)for(let e of t)i.has(e)||(i.add(e),a.push(e));for(let e of a){let t=e.replace(/[0-9]/g,``),i=n.findIndex(e=>e.aspectRatio===t),a=null;i>=0&&(a=n[i],n.splice(i,1)),r.push({product:a,area:e})}return{assignments:r,remaining:n}}let z=g(()=>{let e=[...L.value],t={},n=[...E.value];for(let[r,i]of Object.entries(A)){let a=R(i,e),o=j[r]||[],s=[...a.remaining];t[r]=a.assignments.map(e=>{if(!(o.includes(e.area)&&n.length))return e;let t=n.shift();return e.product&&s.push(e.product),{...e,product:null,caseStudy:t,source:t?.source||`caseStudy`}}),e=s}return{templatesAssignments:t,remainingProducts:e}}),B=(e,t)=>{if(!e)return`${t}-empty`;let n=e.area||`area`,r=e.caseStudy?.metadata?.slug?.current;if(r)return`${t}-${n}-case-${r}`;let i=e.caseStudy?.file;if(i)return`${t}-${n}-case-${i}`;let a=e.caseStudy?._id;if(a)return`${t}-${n}-case-${a}`;let o=e.product?.metadata?.slug?.current;if(o)return`${t}-${n}-product-${o}`;let s=e.product?._id;return s?`${t}-${n}-product-${s}`:`${t}-${n}-empty`},V=(e,t)=>e?.metadata?.slug?.current||e?._id||e?.slug?.current||e?.slug||`product-${t}`,H=e=>e?.file?{href:e.file}:{to:{name:`journal-category-slug`,params:{category:e?.presentation?.category?.slug?.current,slug:e?.metadata?.slug?.current}}},W,K,q=(e,t)=>new Promise(n=>{if(!e.length){n();return}K=G.to(e,{...t,onComplete:()=>{K=null,n()},onInterrupt:()=>{K=null,n()}})});T(()=>r.value,async(e,t,r)=>{let i=!1;if(r(()=>{i=!0,K&&K.kill()}),!n.value){O.value=[...e];return}let o=Array.from(n.value.querySelectorAll(`.product`));if(G.killTweensOf(o),await q(o,{autoAlpha:0,y:30,duration:.35,ease:`power1.out`}),i||(O.value=[...e],await a(),i))return;let s=Array.from(n.value.querySelectorAll(`.product`));G.set(s,{autoAlpha:0,y:30}),await q(s,{delay:.1,autoAlpha:1,y:0,duration:.45,ease:`power2.out`})});let J=()=>{if(!n.value)return;let e=Array.from(n.value.querySelectorAll(`.product`)).slice(0,6);G.set(e,{y:200,opacity:0}),W=G.timeline({paused:!0}),W.to(e,{y:0,opacity:1,duration:.8,stagger:.1,delay:.4,ease:`circ.out`})},ee=()=>{n.value&&W.play()},Y=s(`pageContext`);return u(()=>{W&&W.kill(),K&&K.kill(),n.value&&G.killTweensOf(n.value.querySelectorAll(`.product`))}),c(()=>{Y.$page.loader.loaded.then(()=>J()),Y.$page.loader.ready.then(()=>ee())}),(e,t)=>(d(),v(`section`,{ref_key:`el`,ref:n,"data-component":`product-list`},[_(`div`,Pe,[_(`div`,Fe,[(d(!0),v(y,null,f(z.value.templatesAssignments,(e,t)=>(d(),v(`div`,{class:x([`grid-layout`,t]),key:t},[(d(!0),v(y,null,f(e,e=>(d(),v(`div`,{class:x([`product`,[{"-case-study":e.caseStudy},e.area]]),key:B(e,t)},[e.caseStudy?(d(),w(C(M),b({key:0,ref_for:!0},H(e.caseStudy),{class:`case-study-card`,title:!1}),{default:p(()=>[(d(),w(C(U),b({key:B(e,t)+`-`+(o.value?o.value.name:`all`)},{ref_for:!0},e),null,16))]),_:2},1040)):(d(),v(y,{key:1},[e.product&&e.product.metadata?.slug?.current?(d(),w(C(M),{key:0,to:{name:`products-category-slug`,params:{category:e.product.productSetup.collection.slug,slug:e.product.metadata.slug.current}},title:!1},{default:p(()=>[h(C(P),b({ref_for:!0},{...e.product.sections[0],...e.product.productSetup}),null,16)]),_:2},1032,[`to`])):S(``,!0)],64))],2))),128))],2))),128)),z.value.remainingProducts.length?(d(),v(`div`,Ie,[(d(!0),v(y,null,f(z.value.remainingProducts,(e,t)=>(d(),v(`div`,{key:V(e,t),class:`product`},[e.metadata?.slug?.current?(d(),w(C(M),{key:0,to:{name:`products-category-slug`,params:{category:e.productSetup.collection.slug,slug:e.metadata.slug.current}}},{default:p(()=>[h(C(P),b({ref_for:!0},{...e.sections[0],...e.productSetup},{class:`square`}),null,16)]),_:2},1032,[`to`])):S(``,!0)]))),128))])):S(``,!0)])])],512))}},[[`__scopeId`,`data-v-5f39a563`]]),Re={"data-component":`products-page`,class:`inner-page`},ze={class:`desktop-category-selector`},Be=200,Ve=2e3,He=Y({__name:`Products`,props:{metadata:{type:[Boolean,Object],default:!1},sections:{type:[Boolean,Array],default:!1},products:{type:[Boolean,Array],default:!1},collections:{type:[Boolean,Array],default:!1},productTypes:{type:[Boolean,Array],default:!1}},setup(t){G.registerPlugin(X);let n=t,i=te(),a=e(),{clearFilters:s}=N(n.products,{syncRoute:!0}),l=D(!1),f=D(null),p=null,m=null,g=null,y=()=>{m&&=(m(),null),g&&=(clearTimeout(g),null)};c(()=>{let e=f.value;e&&e.$el&&(e=e.$el),X.create({trigger:e,start:`top center`,end:`bottom bottom`,onEnter:()=>{l.value=!0},onLeave:()=>{l.value=!1},onEnterBack:()=>{l.value=!0},onLeaveBack:()=>{l.value=!1}})});let b=()=>{p&&=(p(),null),p=a.afterEach((e,t,n)=>{if(p){let e=p;p=null,e()}n||(y(),m=i.on(`transition-enter-complete`,()=>{y(),setTimeout(()=>{s({suppressQuerySync:!0})},Be)}),g=setTimeout(()=>{y(),s({suppressQuerySync:!0})},Ve))})};return r(e=>{`${e?.name||``}`.startsWith(`products-category-slug`)||b()}),u(()=>{X.getAll().forEach(e=>e.kill())}),c(()=>{i.emit(`change-menu-theme`,`main`)}),(e,n)=>(d(),v(`div`,Re,[h(C(Ne),{products:t.products,collections:t.collections,productTypes:t.productTypes,enabled:l.value},null,8,[`products`,`collections`,`productTypes`,`enabled`]),h(C(se),o(O(t.sections[0])),null,16),_(`main`,null,[_(`div`,ze,[h(C(ve),{products:t.products,collections:t.collections,productTypes:t.productTypes},null,8,[`products`,`collections`,`productTypes`])]),h(C(Le),{ref_key:`productListRef`,ref:f,products:t.products,collections:t.collections},null,8,[`products`,`collections`])]),h(C(B))]))}},[[`__scopeId`,`data-v-fbda4eb1`]]);function Ue(e=`pt`){return`
		*[ _type == "page.product" && lang == '${e}' && !(_id in path("drafts.**"))]{
			...,
			"sections": sections[]{
				_type == "productDetails" => {
					title,

					"mainImage": modelObjectRef->mainImage{
						...${Q()}
					},
				},
			},
			"productSetup": productSetup{
				"collection": collection->{
					name,
					"slug":slug.current,
					icon {
						...${Q()}
					},
					featuredImage {
						...${Q()}
					},
					subCategories[]->{
						name
					}
				},
				"subCollections": subCollections[]->,
				"productType": productType->,


				availableColors[]->{
					...,
					image{
						...${Q()}
					},
				},
				structureOptions[]->{
					...,
					image{
						...${Q()}
					},
				},
				availableSizes[]{
					name,
					label,
					dimensions,
					technicalImage {
						...${Q()}
					},
				},
				displayOptions[]->{
					...,
					image{
						...${Q()}
					},
				},
				availableHPLColors[]->{
					...,
					image{
						...${Q()}
					},
				},
			}
		}
    `}function We(e=`pt`){return`
		*[ _type == "collection" && lang == '${e}' && !(_id in path("drafts.**"))]{
			name,
			subCategories[]->{
				name
			},
			featuredImage {
				...${Q()}
			},
			icon {
				...${Q()}
			},
			caseStudyList[]->{
				metadata,
				presentation{
					...,
					category->,
					${$()},
				}
			},
			catalogue {
				"file": file.asset->.url,
				title,
				${$()},
				smallTitle,
				${ne(`catalogueCover`)},
			},
			oldCatalogue,
		}
    `}function Ge(e=`pt`){return`
		*[ _type == "productType" && lang == '${e}' && !(_id in path("drafts.**"))]{
			name,
			featuredImage {
				...${Q()}
			},
		}
    `}var Ke=`
	_type == "productsHeader" => {
		title,
	}
`;function qe(e=`pt`){return H`
	*[_type == 'page.products' && !(_id in path("drafts.**")) && lang == '${e}'][0] {
		_type,
		"metadata": metadata{...${V({includeStructuredData:!0})}},
		"sections": sections[] {
			_type,
			${Ke},
		},
		"products": ${Ue(e)},
		"collections": ${We(e)},
		"productTypes": ${Ge(e)}
	}
	`}var Je=Y({__name:`index`,async setup(e){let n,r,{locales:a,locale:s,setLocale:c}=q(),l=qe(s.value),{data:u,error:f}=([n,r]=m(()=>z(l)),n=await n,r(),n);if(f.value)throw t({statusCode:f.value?.statusCode||500,statusMessage:f.value?.message||`An error occurred`});if(!u.value)throw t({statusCode:404,statusMessage:`Page not found`});let g=([n,r]=m(()=>K({page:u.value,locale:s})),n=await n,r(),n);ee(u.value.metadata,s,g,{pageType:u.value._type}),re({pageTransition:L});let{onEnter:_,onLeave:v}=I();return i({bodyAttrs:{class:u.value.metadata.slug.current}}),(e,t)=>(d(),w(C(F),{slug:C(u).metadata.slug,name:C(u).metadata.name,metadata:C(u).metadata,"transition-enter":C(_),"transition-leave":C(v)},{default:p(()=>[h(C(He),o(O(C(u))),null,16)]),_:1},8,[`slug`,`name`,`metadata`,`transition-enter`,`transition-leave`]))}},[[`__scopeId`,`data-v-c790d2c4`]]);export{Je as default};