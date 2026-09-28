var t=Object.defineProperty,e=(e,s,o)=>(((e,s,o)=>{s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[s]=o})(e,"symbol"!=typeof s?s+"":s,o),o);import{at as s,b0 as o,b1 as i,a$ as n,x as a,a7 as r,r as l,e as p,j as c,b as h,E as d,H as u,o as m,l as v}from"./entry.9cfb39b7.js";import{L as y}from"./loader-globals.d8a67046.js";import{g,s as f}from"./globals.b114dd32.js";import{s as w,d as b}from"./store.4d67c1b5.js";import{L as S,g as x}from"./LoaderMixin.13fbd445.js";import{C as _,e as T,h as M,k as L,i as k,q as A,b as P,H as $,d as C,l as I,o as E,s as O,c as j,T as F,u as D,p as z,r as R}from"./custom-material.e347eaa2.js";import{C as q,t as B,g as H}from"./index.6c8f1534.js";import{D as U,x as N}from"./dom-component.59802661.js";import{R as W}from"./index.d22011ff.js";import{a as G,g as V}from"./index-default.25f36e61.js";import{a as K,i as X}from"./gozer-env.ed057cb2.js";import{aC as Y,t as J,d as Z,a as Q,aB as tt,ak as et}from"./three.module.c9112413.js";import{m as st}from"./MathUtils.08fed4e9.js";import{T as ot}from"./three-object.b70b8d57.js";import"./simple-three.1b842056.js";import{L as it}from"./constants.a4ba8ea6.js";import{W as nt,p as at}from"./tweakpane.07e91d40.js";import{e as rt}from"./index.77e4f8bb.js";import{p as lt}from"./number-pad.7e255fcb.js";import{r as pt}from"./random-int.6625ac30.js";import{b as ct,A as ht,r as dt,a as ut}from"./index.0678059b.js";import{l as mt}from"./lerp.a6fc2763.js";import{r as vt}from"./resize-observer.8438de8e.js";import"./load-font.bdf13add.js";import"./in-range.d69fbb78.js";import"./create-canvas.f1f3dfa0.js";class yt extends q{constructor(){super(...arguments),e(this,"options",{text:"Btn Main",textClass:"ShellManager1",link:"/"}),e(this,"props",{}),e(this,"onUpdate",(()=>{}))}async onSetup(){}show({delay:t=0}){s.to(g.app.simpleFrame,{opacity:1,color:1,delay:t})}setupTimeline(){var t;null==(t=this.tl)||t.kill(),this.tl=s.timeline({onUpdate:this.onUpdate});const{tl:e}=this;w().state;const{app:o}=g;null==o||o.isFirstEnter,e.set(o.simpleFrame,{color:1},0),o&&K&&(e.add((()=>o.setNavTheme("")),9),e.add((()=>o.setNavTheme("white")),10)),e.seek(.001),this.options.tl.add(e,0)}onPostResize(){this.setupTimeline()}onDestroy(){var t;null==(t=this.tl)||t.kill()}}class gt extends q{constructor(){super(...arguments),e(this,"options",{}),e(this,"props",{})}async onSetup(){const{gltfRef:t,maxLayers:e}=this.options,s=this.mesh=t,{order:o}=s.userData,i=s.material.map;i&&(i.encoding=Y),s.matrixAutoUpdate=!1,s.layers.set(it.MAIN),s.updateMatrix(),s.material=new _({uniforms:{uMap:i,uProgress:0,uLevelsMin:0,uLevelsMax:0,uColor:new J("#2c3b52"),uOverlayColor:new J("red")},fs:`\n        varying vec2 vUv;\n        uniform sampler2D uMap;\n        uniform float uProgress;\n        uniform float uLevelsMin;\n        uniform float uLevelsMax;\n        uniform vec3 uColor;\n        uniform vec3 uOverlayColor;\n\n        #define GLSLIFY 1\n#ifndef FNC_BLENDMULTIPLY\n#define FNC_BLENDMULTIPLY\nfloat blendMultiply(in float base,in float blend){return base*blend;}vec3 blendMultiply(in vec3 base,in vec3 blend){return base*blend;}vec3 blendMultiply(in vec3 base,in vec3 blend,float opacity){return(blendMultiply(base,blend)*opacity+base*(1.-opacity));}\n#endif\n\n        ${T}\n\n        void main() {\n            vec4 tDiffuse = texture2D(uMap, vUv);\n            float a = tDiffuse.a;\n\n            vec3 color = blendMultiply(tDiffuse.rgb, uColor, 0.3);\n            color = blendMultiply(color, uOverlayColor, uProgress);\n            color = levelRange(color, mix(0.0, uLevelsMin, uProgress), mix(1.0, uLevelsMax, uProgress));\n\n            gl_FragColor = vec4(color, a);\n        }`}),o&&(s.material.depthWrite=s.material.depthTest=!1,s.renderOrder=e-o)}setOverlayProgress(t){this.mesh.material.uProgress=t}setColor(t){this.mesh.material.uOverlayColor.set(t)}setLevelsMin(t){this.mesh.material.uLevelsMin=t}setLevelsMax(t){this.mesh.material.uLevelsMax=t}}G(gt,[ot]);const ft=L,wt=[{id:"female-cloth",totalSheets:3},{id:"female-hair",totalSheets:2},{id:"male-hair",totalSheets:2}],bt={},St=X?"-mobile":"";M.hasMobileFallback||wt.forEach((t=>new Array(t.totalSheets).fill().map(((e,s)=>{const o=`${t.id}${s}-json`,i=`${t.id}${s}-texture`,n=`/images/project-story/${t.id}/${t.id}-${s}.json#json`,a=`${ft}project-story/${t.id}/${t.id}-${s}${St}.ktx2`;bt[o]=n,bt[i]=a}))));class xt extends q{constructor(){super(...arguments),e(this,"options",{id:"project",useMasking:!0}),e(this,"props",{active:!1,viewport:()=>w().state.viewport,overlayProgress:()=>w().state.protocol.overlayProgress,top:K?33:44,bottom:K?-5:-5.1,testProgress:0,levelsMin:.055,levelsMax:.46,color:"#4c3227",aspectNarrow:1.6,aspectWide:3.2,zoomStart:1,zoomEnd:2,timelineProps:t=>({top:t.top,bottom:t.bottom})}),e(this,"rect",{width:1,height:1}),e(this,"assets",{...bt,gltf:`${M.gltfBaseFolder}protocol/protocol-scene-${M.textureSize}.glb`}),e(this,"objects",[...M.hasMobileFallback?[]:[{id:"male_hair_fx",class:k,options:{fps:30,spritesheets:{id:"male-hair",amount:2},sequences:[{id:"default",from:0,to:48,loop:-1}]}},{id:"female_hair_fx",class:k,options:{fps:30,spritesheets:{id:"female-hair",amount:2},sequences:[{id:"default",from:0,to:48,loop:-1}]}},{id:"female_cloth_fx",class:k,options:{fps:30,spritesheets:{id:"female-cloth",amount:3},sequences:[{id:"default",from:0,to:48,loop:-1}]}}]]),e(this,"onTlUpdate",(()=>{}))}async onSetup(){await this.setupScene(),await this.setupCamera()}async setupScene(){this.scene=new Z;const{objects:t,assets:e}=this,s=[];this.gltfScene=this.assets.gltf.scene,this.gltfScene.traverse((o=>{if(o.isMesh&&o.material){const{name:i}=o.userData,n=t.find((t=>t.id===i)),a=n&&n.class||gt;let r=null;if(n){const{id:t,amount:s}=n.options.spritesheets;r=new Array(s).fill().map(((s,o)=>({texture:e[`${t}${o}-texture`],json:e[`${t}${o}-json`]})))}const l=(new a).setup({options:{addTo:this.scene,gltfRef:o,preventAddTo:!0,maxLayers:20,assets:e,data:r,...null==n?void 0:n.options},props:{enter:()=>this.props.active,levelsMin:()=>this.props.levelsMin,levelsMax:()=>this.props.levelsMax,color:()=>this.props.color}});s.push(l)}})),this.scene.add(this.gltfScene),this.sceneObjects=await Promise.all(s)}async setupCamera(){const t=this.gltfScene.getObjectByName("Camera");this.vCameraLookAt=new Q(0,-1.5,-30),this.vCameraPos=new Q(0,-1.5,t.position.z),this.cameraSystem=await(new A).setup({options:{vLookAt:this.vCameraLookAt,vPos:this.vCameraPos},props:{disableInteraction:X,active:()=>this.props.active,maxRotation:.2,fov:t.fov,aspectNarrow:()=>this.props.aspectNarrow,aspectWide:()=>this.props.aspectWide,zoomStart:()=>this.props.zoomStart,zoomEnd:()=>this.props.zoomEnd,zoom:t=>K?.5:st(w().state.viewport.aspect,t.aspectNarrow,t.aspectWide,t.zoomStart,t.zoomEnd,!0)}})}setupTimeline(){w().state,this.tl&&(this.options.tl.remove(this.tl),this.tl.kill()),this.tl=s.timeline({onUpdate:this.onTlUpdate});const{tl:t}=this,{top:e,bottom:i}=this.props,{height:n}=this.rect,a=n,r=o.create("cameraEaseOut","M0,0 C0.252,0.4 0.386,0.623 0.502,0.78 0.66,0.994 0.78,1 1,1 "),l=e,p=i;t.fromTo(this.vCameraLookAt,{y:l},{y:p,duration:a,ease:r},0),t.fromTo(this.vCameraPos,{y:l},{y:p,duration:a,ease:r},0),t.seek(.001),this.options.tl.add(t,0)}setOverlayProgress(t){this.sceneObjects.forEach((e=>e.setOverlayProgress(t)))}render(){const{renderer:t,orthoCamera:e}=W.getInstance();return t.render(this.scene,this.cameraSystem.camera),null}resize({rect:t}={}){this.rect=t}onPostResize(){this.setupTimeline()}offActive(){}onBeforeDestroy(){var t;null==(t=this.tl)||t.kill(),this.sceneObjects.forEach((t=>t.destroy())),this.scene.traverse((t=>{var e,s,o,i,n,a,r,l,p,c;null==(i=null==(o=null==(s=null==(e=t.material)?void 0:e.uniforms)?void 0:s.uTexture)?void 0:o.value)||i.dispose(),null==(l=null==(r=null==(a=null==(n=t.material)?void 0:n.uniforms)?void 0:a.tMap)?void 0:r.value)||l.dispose(),null==(p=t.material)||p.dispose(),null==(c=t.geometry)||c.dispose()}));for(const e in this.assets){const t=this.assets[e];(t instanceof tt||t instanceof et)&&t.dispose()}}setTimelineProps(){this.setupTimeline()}setTestProgress(t){w().state.protocol.overlayProgress=t}}G(xt,[S(),nt(at,{expanded:!0,withoutViews:"",withoutKeys:"active overlayProgress top bottom",keysOptions:{testProgress:{min:0,max:1,step:.001},top:{min:0,max:60,step:.01},bottom:{min:-10,max:0,step:.01},levelsMin:{min:0,max:.2,step:.001},levelsMax:{min:0,max:1,step:.001}}})]);const _t={root:null,rootMargin:"-1px",threshold:0};const Tt=new class extends rt{constructor(){super(),e(this,"onIntersection",((t,e)=>{this.emit("intersects",t,e);for(let s of t){const t=this.all.find((t=>t.el===s.target));t&&t.handler(s)}})),this.all=[],this.observer=new IntersectionObserver(this.onIntersection,_t)}observe(t,e){this.all.push({el:t,handler:e}),this.observer.observe(t)}unobserve(t){const e=this.all.find((e=>e.el===t));if(e){const t=this.all.indexOf(e);this.all.slice(t,1)}this.observer.unobserve(t)}},Mt=({options:t,props:e})=>N` <header class="protocolSectionHeader">
    ${I("top")} ${I("bottom","d-only")}

    <div class="protocolSectionHeader__left">
    ${I("top","m-only")}
      <h1
        data-ui="title"
        class="protocolSectionHeader__title"
      >
        ${t.title}
      </h1>
      <p class="protocolSectionHeader__body  type-body1">${E(t.body)}</p>
    </div>
    <div
      data-ui="right"
      class="protocolSectionHeader__right"
    >
      ${I("left")}
    </div>
  </header>`;class Lt extends q{constructor(){super(...arguments),e(this,"options",{template:Mt,title:"Section Title",body:"Sagittis proin nisl magna arcu amet. Imperdiet eget dictum vitae pharetra mauris. Fermentum bibendum neque tincidunt viverra odio cras. Pellentesque sed urna tristique scelerisque sed tincidunt. Sit non volutpat duis placerat amet neque turpis lacus.",chapterIndex:0,videoSrc:"/videos/protocol/desktop/exp_symbol_mark"}),e(this,"props",{active:!1,intersecting:!1,hasShown:!1,show:t=>t.active&&t.intersecting}),e(this,"height",1),e(this,"handleIntersection",(t=>{w().state.scrollPaused||t.isIntersecting&&(this.props.intersecting=!0)}))}async onSetup(){const t=`Chapter ${lt(this.options.chapterIndex,2)}`;this.caption=await(new P).setup({options:{insertBefore:this.ui.title,text:t},props:{active:!0}}),this.title=await(new $).setup({options:{el:this.ui.title}}),this.video=await(new C).setup({options:{appendTo:this.ui.right,src:this.options.videoSrc,browserPrefix:!1},props:{active:()=>this.props.active}}),Tt.observe(this.ui.title,this.handleIntersection)}onShow(){var t,e;null==(t=this.title)||t.show({delay:.1,speed:1.2}),null==(e=this.caption)||e.show({delay:.1,speed:1.2}),this.props.hasShown=!0}offShow({firstTrigger:t}){var e,s;t||(null==(e=this.title)||e.reset(),null==(s=this.caption)||s.hide())}resize(){this.height=this.el.clientHeight}onDestroy(){Tt.unobserve(this.ui.title)}}G(Lt,[U]);const kt=["Exploring","In Progress","Completed"],At=({options:t,props:e})=>N`<header class="protocolFeatureStatus  type-caption3" status="${e.status}">
    ${kt.map(((t,e)=>N`
        <div
          class="js-dot  dot"
        ></div>
      `))}
    <p class="protocolFeatureStatus__text  type-caption3">
      ${e.statusText}
    </p>
  </header>`;class Pt extends q{constructor(){super(...arguments),e(this,"options",{template:At,blockSize:1}),e(this,"props",{status:0,statusText:t=>kt[t.status]})}async onSetup(){}setStatus(t){}}G(Pt,[U]);const $t=new i({oauthToken:"6XPqtHmS8tYs5aqs6O0o6wtt-114891-NzsJS4f2GrUmN4Ax5E2_"}),Ct=t=>{if("string"==typeof t)return t;if(t.content){return $t.richTextResolver.render(t)}},It=["⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ","⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ","⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ","⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  ⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂⍂\n\n  "],Et=({options:t,props:e})=>N` <header class="protocolSectionFeatures">
    ${I("top","m-only")} 
    <!-- ${I("bottom")} -->

    <ul
      data-ui="list"
      class="protocolSectionFeatures__list"
    >
      ${I("left")}
    </ul>
  </header>`;class Ot extends q{constructor(){super(...arguments),e(this,"options",{template:Et,last:!1,features:[{status:0,title:"Feature one",description:"Sagittis proin nisl magna arcu amet. Imperdiet eget dictum vitae pharetra mauris. Fermentum bibendum neque tincidunt viverra odio cras. Pellentesque sed urna tristique scelerisque sed tincidunt. Sit non volutpat duis placerat amet neque turpis lacus."}]}),e(this,"props",{active:!1,aiMode:!1})}async onSetup(){await this.setupItems()}async setupItems(){const{features:t}=this.options;this.items=Promise.all(t.map(((e,s)=>{const o=pt(0,It.length-1),i=e.encrypted?It[o]:e.description;return(new Ft).setup({options:{appendTo:this.ui.list,last:s===t.length-1,title:`Feature ${s}`,status:parseInt(e.status),title:e.title,encrypted:e.encrypted,description:Ct(i)},props:{active:()=>this.props.active,aiMode:()=>this.props.aiMode}})})))}onDestroy(){}}G(Ot,[U]);const jt=({options:t,props:e})=>N`<li class="protocolSectionFeatures__item">
    <h1
      data-ui="title"
      class="protocolSectionFeatures__title"
    >
      ${t.title}
    </h1>
    <p
      data-ui="body"
      class="protocolSectionFeatures__body  type-body1"
      ?encrypted=${t.encrypted}
    >
      ${t.encrypted?N`<span class="encrypted type-caption2">[Encrypted]</span>`:null} <span class="bodySpan">${E(t.description)}</span> 
    </p>

    ${t.last?null:I("bottom")}
  </li>`;class Ft extends q{constructor(){super(...arguments),e(this,"options",{template:jt,last:!1,status:0,encrypted:!1,title:"Feature one",description:"Sagittis proin nisl magna arcu amet. Imperdiet eget dictum vitae pharetra mauris. Fermentum bibendum neque tincidunt viverra odio cras. Pellentesque sed urna tristique scelerisque sed tincidunt. Sit non volutpat duis placerat amet neque turpis lacus."}),e(this,"props",{active:!1,intersecting:!1,canShow:!1,show:t=>t.intersecting&&!w().state.protocol.aiMode}),e(this,"handleIntersection",(t=>{w().state.scrollPaused||t.isIntersecting&&(this.props.intersecting=!0)}))}async onSetup(){this.options.status>-1&&(this.status=await(new Pt).setup({options:{insertBefore:this.ui.title,status:this.options.status},props:{status:this.options.status}})),X||(this.title=await(new $).setup({options:{el:this.ui.title}}),this.el.style.opacity=0,this.ui.body.style.opacity=0,Tt.observe(this.el,this.handleIntersection))}onShow(){this.el.style.opacity=1,this.title.show({delay:.1}),s.killTweensOf(this.ui.body),s.to(this.ui.body,{alpha:1,delay:.3,duration:.3})}offShow({firstTrigger:t}){t||(s.killTweensOf(this.ui.body),this.el.style.opacity=0,this.ui.body.style.opacity=0,this.title.reset())}onDestroy(){Tt.unobserve(this.el)}}G(Ft,[U]);const Dt=({options:t,props:e})=>N` <footer class="protocolSectionFooter">
    ${I("top")} 
    <!-- ${I("bottom")} -->

    <div class="protocolSectionFooter__rest"></div>
    <div
      data-ui="block"
      class="protocolSectionFooter__block"
    >
      ${I("diagonal")} ${t.order<0?I("right"):I("left")}
    </div>
  </footer>`;class zt extends q{constructor(){super(...arguments),e(this,"options",{template:Dt,order:-1,blockSize:1}),e(this,"props",{})}async onSetup(){this.el.style.setProperty("--order",this.options.order),this.el.style.setProperty("--blockSize",this.options.blockSize)}onDestroy(){}onPostResize(){const{width:t,height:e}=this.ui.block.getBoundingClientRect(),s=Math.atan(t/e)*(180/Math.PI)+90;this.ui.block.style.setProperty("--angle",-s+"deg")}}G(zt,[U]);const Rt=({options:t,props:e})=>N`<div class="protocolSectionOverlayText">
    <div class="protocolSectionOverlayText__inner">
      <div class="protocolSectionOverlayText__under">${E(t.text)}</div>
      <div
        data-ui="over"
        class="protocolSectionOverlayText__over"
      >
        ${E(t.text)}
      </div>
    </div>
  </div>`;class qt extends q{constructor(){super(...arguments),e(this,"options",{template:Rt,vh:1,index:0,id:"landing",aiAudio:{filename:"/audio/ai-test.mp3"},text:"AI Overlay Text Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, eveniet velit. Pariatur hic asperiores accusantium nisi dolorum. Totam, dolorem autem!"}),e(this,"props",{progress:0,active:!1}),e(this,"lines",[]),e(this,"height",1)}async onSetup(){}async setupText(){this.text?(this.text.revert(),this.text.split(),this.lines.forEach((t=>t.destroy())),this.lines=null):this.text=new n(this.ui.over,{type:"lines"}),this.lines=await Promise.all(this.text.lines.map((t=>(new Bt).setup({options:{el:t,skipLine:t.innerText.length<=1},props:{active:()=>this.props.active}})))),this.animatedLines=this.lines.filter((t=>!t.options.skipLine))}onActive(){this.el.style.opacity=1}offActive({firstTrigger:t}){t||(this.el.style.opacity=0,this.animatedLines.forEach(((t,e)=>t.props.visible=!1)))}setProgress(t){if(!this.props.active)return;const e=Math.floor(t*this.animatedLines.length);this.animatedLines.forEach(((t,s)=>{t.props.visible=s<=e}))}async resize(){this.height=this.el.clientHeight,await this.setupText()}onBeforeDestroy(){this.animatedLines=null,this.lines.forEach((t=>t.destroy()))}}G(qt,[U]);class Bt extends q{constructor(){super(...arguments),e(this,"props",{active:!1,visible:!1,show:t=>t.active&&t.visible})}async onSetup(){this.anim=await(new $).setup({options:{el:this.options.el}})}onShow(){this.anim.show()}offShow(){this.anim.reset()}}const Ht={options:{aiAudio:{filename:"/audio/ai-test.mp3"},onAudioProgress:()=>{},onAiCancel:()=>{},onAiEnd:()=>{}},props:{aiMode:!1,disableWheel:!1,scrollTop:0},async onSetup(){V(this,"handleAiModeScrollComplete","handleMouseWheel"),X||this.setupAudio()},setupAudio(){const{filename:t}=this.options.aiAudio;this.sound=new a.Howl({src:[t],onend:()=>{this.options.onAudioProgress(1),this.endDelay=s.delayedCall(.5,(()=>{this.options.onAiEnd(),this.props.aiMode=!1}))}}),this.soundNode=this.sound._sounds[0]._node,ct().connect(this.soundNode)},onAiMode(){if(X)return;this.addEvents(),this.sound.seek(0),this.options.onAudioProgress(0);const{app:t}=g,{scrollTop:e}=this.props,o=t.scrollTop(),i=Math.abs(o-e),n=i>5?st(i,5,500,1,2,!0):0;s.killTweensOf(t.scroller),s.to(t.scroller,{scrollTop:e,duration:n,onStart:()=>this.props.disableWheel=!0,onComplete:this.handleAiModeScrollComplete,ease:"power3.inOut"})},offAiMode({firstTrigger:t}){t||X||(this.removeEvents(),this.sound.pause())},whileAiMode(){if(X||!this.sound.playing())return;const t=this.sound.seek()/this.sound.duration();this.options.onAudioProgress(t),this.setAudioProgress(t)},setAudioProgress(t){},handleAiModeScrollComplete(){this.sound.play(),this.props.disableWheel=!1},handleMouseWheel(){var t;this.props.disableWheel||(null==(t=this.endDelay)||t.kill(),this.options.onAiCancel())},addEvents(){window.addEventListener("wheel",this.handleMouseWheel)},removeEvents(){window.removeEventListener("wheel",this.handleMouseWheel)},onDestroy(){this.removeEvents(),this.soundNode&&ct().disconnect(this.soundNode)}};var Ut,Nt={};Ut={get exports(){return Nt},set exports(t){Nt=t}},function(t){function e(t){var e=new Error(t);return e.name="ValueError",e}function s(t){return function(s){var o=Array.prototype.slice.call(arguments,1),i=0,n="UNDEFINED";return s.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,(function(s,a,r,l){if(null!=a)return a;var p=r;if(p.length>0){if("IMPLICIT"===n)throw e("cannot switch from implicit to explicit numbering");n="EXPLICIT"}else{if("EXPLICIT"===n)throw e("cannot switch from explicit to implicit numbering");n="IMPLICIT",p=String(i),i+=1}var c=p.split("."),h=(/^\d+$/.test(c[0])?c:["0"].concat(c)).reduce((function(t,e){return t.reduce((function(t,s){return null!=s&&e in Object(s)?["function"==typeof s[e]?s[e]():s[e]]:[]}),[])}),[o]).reduce((function(t,e){return e}),"");if(null==l)return h;if(Object.prototype.hasOwnProperty.call(t,l))return t[l](h);throw e('no transformer named "'+l+'"')}))}}var o=s({});o.create=s,o.extend=function(e,o){var i=s(o);e.format=function(){var e=Array.prototype.slice.call(arguments);return e.unshift(this),i.apply(t,e)}},Ut.exports=o}.call(r,r);const Wt=({options:t,props:e})=>N`<section
    class="protocolChapter  lightTheme"
    chapterIndex="${t.chapterIndex}"
  >
    <div
      data-ui="inner"
      class="sectionInner"
    >
      <div
        data-ui="content"
        class="protocolChapter__content"
      ></div>
    </div>
  </section>`;class Gt extends q{constructor(){super(...arguments),e(this,"options",{template:Wt,index:0,chapterIndex:0,setVisOnIntersection:!1,aiOverlayText:"AI Overlay Text Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, eveniet velit. Pariatur hic asperiores accusantium nisi dolorum. Totam, dolorem autem!",includeFooter:!0}),e(this,"props",{shellheaderHeight:70})}async onSetup(){const{includeFooter:t}=this.options;await this.setupScrollTo(),await this.setupHeader(),await this.setupFeatures(),t&&await this.setupFooter(),X||(await this.setupOverlayText(),Object.assign(this.el.style,{top:0,position:"absolute"}))}setupScrollTo(){const t=j(`<div id="${this.options.id}" class="scrollTo"></div>`);this.triggerEl.appendChild(t)}setupTimeline(){if(X)return;this.tl&&(this.options.tl.remove(this.tl),this.tl.kill());const t=this.tl=s.timeline(),{vh:e}=w().state,{bounds:o,start:i}=this.props,n=e,a=o.height+e,r=n-a;t.fromTo(this.el,{y:n},{y:r,duration:a,ease:"none"},i),t.seek(.001),this.options.tl.add(t,0)}async setupHeader(){const{title:t,description:e,chapterIndex:s,symbol_id:o}=this.options,i=["mark","focus","portal","exposition","union"].find((t=>t==o)),n=`/videos/protocol/${X?"mobile":"desktop"}/exp_symbol_${i}`;this.header=await(new Lt).setup({options:{insertBefore:this.ui.content,title:this.options.title,body:Ct(this.options.description),chapterIndex:this.options.chapterIndex,videoSrc:n},props:{active:()=>this.props.enter}})}async setupFeatures(){this.features=await(new Ot).setup({options:{appendTo:this.ui.content,features:this.options.features},props:{aiMode:()=>this.props.aiMode,active:()=>this.props.enter}})}async setupOverlayText(){const t=this.options.aiOverlayText.replaceAll("\n","<br/>");this.overlayText=await(new qt).setup({options:{appendTo:this.ui.content,text:t},props:{active:()=>w().state.protocol.aiMode}})}async setupFooter(){this.footer=await(new zt).setup({options:{appendTo:this.ui.content,order:this.options.index%2==1?-1:1}})}show(){}onEnter(){var t;null==(t=g.app)||t.setActiveSection(`${this.options.id}`)}onLeave(){}setAudioProgress(t){var e;X||(null==(e=this.overlayText)||e.setProgress(t),this.setScroll(t))}setScroll(t){if(this.props.disableWheel)return;const{vh:e}=w().state,{app:s}=g,{top:o,shellheaderHeight:i}=this.props,n=o-i,a=n+this.header.height+this.overlayText.height-.5*e,r=mt(t,n,a);s.scroller.scrollTo(r,!0)}preResize(){X||(this.props.bounds.height=this.el.clientHeight,this.triggerEl.style.height=`${this.props.bounds.height}px`,this.el.style.transform="")}resize(){var t;this.header.resize(),null==(t=this.overlayText)||t.resize(),this.props.scrollTop=this.props.top-this.props.shellheaderHeight,this.setupTimeline()}onDestroy(){}}G(Gt,[Ht,O,U]);const Vt=({options:t,props:e})=>N`<button
    class="btnClose"
    @click=${t.onClick}
    @pointerenter=${()=>{e.rollover=!0}}
    @pointerleave=${()=>{e.rollover=!1}}
  >
    ${(({className:t="closeBtnIcon",ui:e="closeBtn"}={})=>N`
  <svg
    class="${t}"
    data-ui="${e}"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12.82 12.28"
  >
    <defs></defs>
    <path
      class="stroke"
      d="M12.82,12.16l-4.48-4.25M0,0L4.56,4.32"
    />
    <line
      class="stroke2"
      x1=".34"
      y1="12.28"
      x2="12.54"
      y2=".22"
    />
  </svg>
  </svg>
`)()}
  </button>`;class Kt extends q{constructor(){super(...arguments),e(this,"options",{template:Vt,onClick:()=>{}}),e(this,"props",{active:!1,rollover:!1}),e(this,"tweens",{pr:0})}async onSetup(){this.lines=this.el.querySelectorAll(".stroke"),this.lines2=this.el.querySelectorAll(".stroke2")}onRollover(){s.killTweensOf(this.lines);let t=.1;const e=s.timeline();e.fromTo(this.lines,{drawSVG:"0% 0%"},{drawSVG:"50% 0%",duration:1*t,delay:.3*t,ease:"linear"}),e.to(this.lines,{drawSVG:"100% 100%",duration:1*t,delay:.3*t,ease:"linear"}),e.fromTo(this.lines,{drawSVG:"0% 0%"},{drawSVG:"50% 0%",duration:1*t,delay:.6*t,ease:"quint.out"}),t=.1;const o=s.timeline();o.fromTo(this.lines2,{drawSVG:"0% 0%"},{drawSVG:"100% 0%",duration:1*t,delay:0,ease:"linear"}),o.to(this.lines2,{drawSVG:"100% 100%",duration:1*t,delay:0,ease:"linear"}),o.fromTo(this.lines2,{drawSVG:"0% 0%"},{drawSVG:"100% 0%",duration:2*t,delay:0,ease:"quint.out"})}}G(Kt,[U]);const Xt=({options:t,props:e})=>N` <div class="protocolShell">
    <div class="protocolShell__border"></div>
    <header class="protocolShell__header  type-caption2">
      <div
        data-ui="progress"
        class="protocolShell__progress"
      ></div>
      <div class="protocolShell__headerLeft">
        <img
          class="protocolShell__recordBars"
          src="/svg/record-bars.svg"
          alt="record-bars"
        />
        rec. id #8472 <br />
        approved
      </div>
      <ul class="protocolShell__chapterList">
        ${t.chapters.map((t=>N`
          <li class="js-section  protocolShell__chapterListItem">
            <span class="dot"></span>
            <span>${t.title}</span>
          </li>
        `))}
      </ul>
      <div class="protocolShell__headerRight">
        // scroll at any point to exit
        <div
          data-ui="closeWrap"
          class="protocolShell__headerClose"
        ></div>
      </div>
    </header>
    <div class="protocolShell__side  type-caption2">
      <div class="protocolShell__sideTop">
           <img class="icon" src="/svg/double-arrow-right-white.svg" alt=""> ON
      </div>

      <div class="protocolShell__sideMiddle">
        <div data-ui="audioLines" class="protocolShell__audioLines"></div>
        <p class="protocolShell__sideMiddleText">
          <span>147</span> WPM
        </p>
      </div>

      <div class="protocolShell__sideBottom">
        <p class="protocolShell__sideBottomText">
          K.A.I transmission
        </p>
      </div>
    </div>
  </div>`;class Yt extends q{constructor(){super(...arguments),e(this,"options",{template:Xt,chapters:[],onClose:()=>{}}),e(this,"props",{progress:0,active:!1,activeSection:()=>w().state.activeSection})}async onSetup(){this.sections=this.el.querySelectorAll(".js-section"),this.btnClose=await(new Kt).setup({options:{appendTo:this.ui.closeWrap,onClick:this.options.onClose}}),await this.setupAudioLines()}async setupAudioLines(){this.audioLines=await(new ht).setup({options:{appendTo:this.ui.audioLines,vertical:!1,circle:!1,audioContext:null},props:{active:()=>this.props.active}})}onActive(){this.el.style.visibility="visible"}offActive({firstTrigger:t}){t||(this.el.style.visibility="hidden")}setActiveSection(t){var e,s;const o=this.options.chapters.findIndex((e=>e._uid===t));null==(e=this.currentSection)||e.classList.remove("isActive"),this.currentSection=this.sections[o],null==(s=this.currentSection)||s.classList.add("isActive")}setProgress(t){this.ui.progress.style.transform=`translateX(${mt(t,-100,0)}%)`}onDestroy(){var t;null==(t=this.currentSection)||t.classList.remove("active")}}G(Yt,[U]);const Jt=({options:t,props:e,context:s})=>N` <button class="btnKaiMode" @pointerenter=${s.handleEnter} @pointerleave=${s.handleLeave}  @pointerdown=${s.handlePointerDown} @pointerup=${s.handlePointerUp}>
    <span class="btnKaiMode__light">
      <canvas data-ui="lightCanvas"></canvas>
      <span class="btnKaiMode__text  type-btn">Hold <span class="outline">[spacebar]</span> for K.A.I mode</span>
    </span>
    <span
      data-ui="dark"
      class="btnKaiMode__dark"
    >
      <canvas data-ui="darkCanvas"></canvas>
      <span class="btnKaiMode__text  type-btn">Hold <span class="outline">[spacebar]</span> for K.A.I mode</span>
    </span>
  </button>`;class Zt extends q{constructor(){super(...arguments),e(this,"options",{template:Jt,outline:!1,fill:!0,corner:"right",onComplete:()=>{},onRelease:()=>{}}),e(this,"props",{active:!1,grow:!1,listenMode:!1,aiMode:()=>w().state.protocol.aiMode,overlayProgress:()=>w().state.protocol.overlayProgress}),e(this,"tweens",{pr:0}),e(this,"handleResize",(t=>{const{width:e,height:s}=t.contentRect,{scale:o}=w().state,{corner:i,outline:n,fill:a}=this.options,r=n?2:0;this.bgs.forEach((({canvas:t,ctx:l,color:p})=>{dt(l,e,s),l.clearRect(0,0,e,s),l.beginPath(),l.fillStyle=p,l.strokeStyle=p,l.strokeWidth=r;const c=12*o,h=r/2;let d={x:e-h,y:s-c},u={x:e-c,y:s-h},m={x:h,y:s-h};"left"===i&&(d={x:e-h,y:s-h},u={x:c,y:s-h},m={x:h,y:s-c});ut(l,[{x:h,y:h},{x:e-h,y:h},d,u,m],5*o),n&&l.stroke(),a&&l.fill()}))})),e(this,"handleGrowUpdate",(()=>{w().state.protocol.overlayProgress=this.tweens.pr})),e(this,"handleEnter",(()=>{this.setMask(1)})),e(this,"handleLeave",(()=>{this.props.aiMode||this.setMask(0)})),e(this,"handlePointerDown",(t=>{this.onDown()})),e(this,"handlePointerUp",(t=>{this.onUp()})),e(this,"handleKeyDown",(t=>{"Space"===t.code&&this.onDown(t)})),e(this,"handleKeyUp",(t=>{"Space"===t.code&&this.onUp()}))}async onSetup(){this.setupBgs(),this.addEvents(),this.transitionSound=new a.Howl({src:["audio/FX_TBL_Transition.mp3"],rate:2.2})}setupBgs(){this.bgs=[this.ui.lightCanvas,this.ui.darkCanvas].map(((t,e)=>({canvas:t,ctx:t.getContext("2d"),color:0===e?"white":"black"})))}addEvents(){window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),vt().observe(this.el,this.handleResize)}removeEvents(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),vt().unobserve(this.el)}onActive(){}offActive({firstTrigger:t}){}onGrow(){s.killTweensOf(this.tweens),s.to(this.tweens,{pr:1,duration:.8,ease:"power1.out",onStart:()=>{},onUpdate:this.handleGrowUpdate,onComplete:this.options.onComplete}),this.transitionSound.seek(0),this.transitionSound.play()}offGrow({firstTrigger:t}){t||this.props.aiMode||(this.options.onRelease(),this.shrink(),this.transitionSound.pause())}offAiMode(){this.props.grow=!1}shrink(){s.killTweensOf(this.tweens),s.to(this.tweens,{pr:0,duration:.8,ease:"power2.out",onUpdate:this.handleGrowUpdate})}setOverlayProgress(t){this.setMask(t)}setMask(t){this.ui.dark.style.setProperty("--mask",`${mt(t,100,0)}%`)}onDown(t){null==t||t.preventDefault(),this.props.aiMode||(this.props.grow=!0)}onUp(){this.props.aiMode||(this.props.grow=!1)}onDestroy(){this.removeEvents()}}G(Zt,[U]);const Qt=({options:t,props:e})=>N`<section
    id="section-landing"
    class="protocolLanding  lightTheme"
  >
    <div
      data-ui="inner"
      class="sectionInner"
    >
      <div data-ui="top" class="protocolLanding__top">
        <div data-ui="audioLines" class="protocolLanding__audioLines"></div>
        <div class="protocolLanding__logoBlock">
          <!-- <img
            class="protocolLanding__logo"
            src="/svg/protocol.svg"
            alt=""
          /> -->
          <h1 data-ui="title" class="protocolLanding__logoTitle"><span>P</span><span>r</span><span>o</span><span>t</span><span>o</span><span>c</span><span>o</span><span>l</span></h1>
          <footer data-ui="logoFooter" class="protocolLanding__logoFooter  type-caption3">
            <p data-ui="textLeft">${t.title_subline_left}</p>
          </footer>
        </div>
        <div data-ui="bottomContent" class="protocolLanding__bottomContent">
          <p data-ui="body" class="protocolLanding__body  type-body1">${t.body}</p>
        </div>

      </div>

      <footer class="protocolLanding__footer">
        ${I("top")}
        <p class="protocolLanding__footerCode  textHacky">${t.console_text_loading}</p>
      </footer>
    </div>

  </section>`;class te extends q{constructor(){super(...arguments),e(this,"options",{template:Qt,vh:1,index:0,id:"landing",aiAudio:{filename:"/audio/ai-test.mp3"},setVisOnIntersection:!1,onSpacePressComplete:()=>{}}),e(this,"topHeight",1)}async onSetup(){await this.setupText(),await this.setupAudioLines(),X||("us-en"===g.lang&&await this.setupBtn(),Object.assign(this.el.style,{top:0,position:"absolute"}),this.body=await(new $).setup({options:{el:this.ui.body}}),this.bodyTextSound=new a.Howl({loop:!0,src:["/audio/FX_text_animation_loop.mp3"]}))}async setupText(){this.letters=[...this.ui.title.children],this.textLeft=await(new $).setup({options:{el:this.ui.textLeft}}),this.textRight=await(new P).setup({options:{appendTo:this.ui.logoFooter,text:this.options.title_subline_right}})}async setupAudioLines(){this.audioLines=await(new ht).setup({options:{appendTo:this.ui.audioLines,width:600,height:600,dpr:window.devicePixelRatio,vertical:!1,circle:!0,audioContext:null},props:{active:()=>this.props.enter}})}async setupOverlayText(){this.overlayText=await(new qt).setup({options:{appendTo:this.ui.top,text:this.options.aiOverlayText},props:{active:()=>this.props.aiMode}})}async setupBtn(){this.btn=await(new Zt).setup({options:{appendTo:this.ui.bottomContent,onComplete:this.options.onSpacePressComplete,copy:this.options.spacebar},props:{active:()=>this.props.enter}})}onEnter(){var t;null==(t=g.app)||t.setActiveSection("section-landing")}onLeave(){}setupTimeline(){if(X)return;this.tl&&(this.options.tl.remove(this.tl),this.tl.kill());const t=this.tl=s.timeline();w().state;const{bounds:e,start:o}=this.props,i=e.height,n=0-i;t.fromTo(this.el,{y:0},{y:n,duration:i,ease:"none"},o),t.seek(.001),this.options.tl.add(t,0)}setAudioProgress(t){var e;X||null==(e=this.overlayText)||e.setProgress(t)}show({delay:t=0}={}){if(this.showTitle(t),this.textLeft.show({delay:t}),this.textRight.show({delay:t+.6}),!X){const e=this.body.show({delay:t+.1,speed:.3});s.delayedCall(t,(()=>{this.bodyTextSound.play(),s.delayedCall(e,(()=>this.bodyTextSound.stop()))}))}}onAiMode(){this.props.enter&&(this.body.reset(),this.btn&&(this.btn.el.style.opacity=0))}offAiMode({firstTrigger:t}){this.props.enter&&!t&&(this.body.show({speed:.3}),this.btn&&(this.btn.el.style.opacity=1))}showTitle(t=0){s.killTweensOf(this.letters),s.to(this.letters,{alpha:1,duration:.4,delay:t,stagger:{from:"random",amount:.1},ease:"rough({ template: none.out, strength: 6, points: 40, clamp: true })"})}hideTitle(){s.killTweensOf(this.letters),s.set(this.letters,{alpha:0})}preResize(){X||(this.props.bounds.height=this.el.clientHeight,this.triggerEl.style.height=`${this.props.bounds.height}px`,this.el.style.transform="")}resize(){this.ui.top.style.setProperty("--circleHeight",1.11*this.ui.top.clientHeight+"px"),this.setupTimeline()}onDestroy(){var t;null==(t=this.tl)||t.kill()}}G(te,[Ht,O,U]);const ee=({options:t,props:e})=>N` <footer class="protocolFooter  lightTheme">
    <div
      data-ui="inner"
      class="protocolFooter__inner sectionInner"
    >
      <!-- ${I("bottom")} -->

      <div class="protocolFooter__top">
        ${I("top")}
        <div class="protocolFooter__topLeft">
          <p class="protocolFooter__code  textHacky">${t.consoleText}</p>
        </div>
        <div class="protocolFooter__topRight">
          ${I("left")}

          <img
            class="protocolFooter__discordIcon"
            src="/svg/discord.svg"
            alt="discord"
          />
          <a class="link" href="${t.btnLink.url}" target="_blank"></a>
        </div>
      </div>

      <div class="protocolFooter__bottom">
        ${I("top")}
        <div
          data-ui="bottomLeft"
          class="protocolFooter__bottomLeft"
        ></div>
        <div
          data-ui="bottomRight"
          class="protocolFooter__bottomRight  type-body1"
        >
          ${I("left")}

          <p data-ui="body">${t.body}</p>
        </div>
      </div>
    </div>
  </footer>`;class se extends q{constructor(){super(...arguments),e(this,"options",{template:ee}),e(this,"props",{intersecting:!1}),e(this,"handleIntersection",(t=>{this.props.enter&&t.isIntersecting&&!this.hasShown&&(this.hasShown=!0,this.title.show(),this.btn.show(),this.body.show({speed:.4}))}))}async onSetup(){X||Object.assign(this.el.style,{top:0,position:"absolute"}),await this.setupText(),await this.setupBtn(),Tt.observe(this.ui.bottomLeft,this.handleIntersection)}async setupText(){const{title:t,subtitle:e}=this.options;this.title=await(new F).setup({options:{appendTo:this.ui.bottomLeft,text:t,caption:e}}),this.body=await(new $).setup({options:{el:this.ui.body}})}async setupBtn(){const{btnText:t,btnLink:e}=this.options;this.btn=await(new D).setup({options:{appendTo:this.ui.bottomRight,text:t,link:e.url,external:!0,cbClick:()=>{window.open(e.url,"_blank")}}})}setupTimeline(){if(X)return;this.tl&&(this.options.tl.remove(this.tl),this.tl.kill());const t=this.tl=s.timeline(),{vh:e}=w().state,{bounds:o,start:i}=this.props,n=e,a=o.height+e,r=n-a;t.fromTo(this.el,{y:n},{y:r,duration:a,ease:"none"},i),t.seek(.001),this.options.tl.add(t,0)}show(){}preResize(){X||(this.props.bounds.height=this.el.clientHeight,this.triggerEl.style.height=`${this.props.bounds.height}px`,this.el.style.transform="")}resize(){this.setupTimeline()}onDestroy(){Tt.unobserve(this.ui.bottomLeft)}}G(se,[O,U]);const oe=({options:t,props:e})=>N` <div class="protocol lightTheme"></div>`;class ie extends q{constructor(){super(...arguments),e(this,"options",{template:oe}),e(this,"props",{progress:0,active:!0,viewport:()=>w().state.viewport,aiMode:()=>w().state.protocol.aiMode}),e(this,"rect",{height:1}),e(this,"scrollSectors",[]),e(this,"currSection",null)}async onSetup(){this.tl=new s.timeline({paused:!0}),this.sections=await this.setupSections(),this.chapterSections=this.sections.slice(),await this.setupFooter(),this.scene=await this.setupScene(),this.shell=await this.setupShell(),this.shellManager=await(new yt).setup({options:{tl:this.tl}}),this.tl.seek(.001,!1);const t={src:"TBL3_AFTER_loop.mp3",start:27,dur:21333};this.bgAudio=new a.Howl({src:[`/audio/${t.src}`],autoplay:!1,loop:!0,volume:0,html5PoolSize:1,sprite:{loop:[t.start,t.dur,!0]}})}async setupSections(){const{uiContainer:t,copy:e}=g,s={appendTo:X?this.el:t,uiContainer:t,tl:this.tl,onAudioProgress:t=>{this.props.progress=t},onAiCancel:t=>{w().state.protocol.aiMode=!1},onAiEnd:t=>{this.setNextSectionAI()}};this.chapterData=e.filter((t=>"protocol-chapter"===t.component));const o=[{view:te,options:{...(i="protocol-landing",e.find((t=>t.component===i))),onSpacePressComplete:()=>{w().state.protocol.aiMode=!0}}},...this.chapterData.map(((t,e)=>({view:Gt,options:{...t,chapterIndex:e+1,id:t._uid,includeFooter:e<this.chapterData.length-1}})))];var i;return Promise.all(o.map((({view:t,options:e},o)=>{let i=null;return X||(i=j(`<div class="ref" data-section="${o}"></div>`),this.el.appendChild(i)),(new t).setup({options:{index:o,triggerEl:i,...s,...e},props:{}})})))}async setupFooter(){const{uiContainer:t,copy:e}=g,s=e.find((t=>"protocol-footer"===t.component));let o;X||(o=j(`<div class="ref" data-section="${this.sections.length}"></div>`),this.el.appendChild(o));const i=await(new se).setup({options:{...s,triggerEl:o,appendTo:X?this.el:t,uiContainer:t,tl:this.tl},props:{}});this.sections.push(i)}async setupScene(){return(new xt).setup({options:{tl:this.tl},props:{active:()=>this.props.active}})}async setupShell(){return(new Yt).setup({options:{tl:this.tl,onClose:()=>{w().state.protocol.aiMode=!1},appendTo:document.body,chapters:this.chapterData},props:{active:()=>w().state.protocol.aiMode,progress:()=>this.props.progress}})}show(){this.shellManager.show({delay:1}),this.sections.forEach((t=>t.show({delay:1}))),this.bgAudio.play("loop"),this.bgAudio.fade(this.bgAudio.volume(),.5,2e3),s.delayedCall(1.8,(async()=>{this.setViewport(this.props.viewport),w().state.scrollPaused=!1}))}async prerenderScenes(){this.scene&&await z(this.scene.constructor.name,this.scene.scene)}render(){var t;const{renderer:e}=W.getInstance();return e.clear(),null==(t=this.scene)||t.render(),null}setScroll(t){this.tl.seek(t,!1)}setAiMode(t){var e;null==(e=at)||e.refresh()}onAiMode(t){w().state.hideShell=!0,this.el.classList.add("isAiMode"),this.currSection&&(this.currSection.props.aiMode=!1),this.currSection=this.getClosestSection(),this.currSection.props.aiMode=!0,this.bgAudio.fade(this.bgAudio.volume(),.05,500)}offAiMode({firstTrigger:t}){t||(w().state.hideShell=!1,this.el.classList.remove("isAiMode"),this.currSection&&(this.currSection.props.aiMode=!1),this.bgAudio.fade(this.bgAudio.volume(),.5,2e3))}setViewport(t){var e;this.sections.forEach((e=>e.preResize(t))),this.sections.forEach((e=>e.resize(t))),this.rect=this.el.getBoundingClientRect(),null==(e=this.scene)||e.resize({viewport:t,rect:this.rect});let s=0;this.scrollSectors=this.sections.map((t=>{const e=t.props.bounds.height/this.rect.height,o=s+e,i={start:s,end:o,fr:e};return s=o,i})),B("postResize",t)}onPostResize(t){this.tl.seek(w().state.scroll,!1)}getClosestSection(){const{scroll:t}=w().state;return this.sections.reduce(((e,s)=>Math.abs(s.props.top-t)<Math.abs(e.props.top-t)?s:e))}setNextSectionAI(){const t=this.chapterSections.indexOf(this.currSection);this.currSection=this.chapterSections[t+1],this.currSection?this.currSection.props.aiMode=!0:w().state.protocol.aiMode=!1}onBeforeDestroy(){this.currSection=null,this.tl.kill(),this.chapterSections=[],this.sections.forEach((t=>t.destroy())),this.sections=[],this.bgAudio.unload()}}G(ie,[U,nt(at,{expanded:!0,withoutViews:"",withoutKeys:"active",keysOptions:{progress:{min:0,max:1,step:.001},time:{step:10}}})]);const ne={__name:"Protocol",props:{story:{type:Object,required:!0}},emits:["loaded"],setup(t,{emit:e}){const s=t,o=l(null);let i=null;const{app:n,storyblok:a}=p();return c((async()=>{{const{$gsap:t,$ScrollTrigger:e,$ScrollSmoother:o}=h();f({app:n,gsap:t,ScrollTrigger:e,ScrollSmoother:o,scrollSmoother:n.scroller,copy:s.story.content.body,lang:a.lang})}x().reset(),x().on(y.LOAD_PROGRESS,(t=>{n.setLoadProgress(t)})),x().once(y.LOAD_COMPLETE,(()=>{n.setLoadProgress(1),e("loaded")})),i=await(new R).setup({options:{appendTo:o.value,component:ie}})})),d((()=>n.pageReady),(t=>{setTimeout((()=>{n.toggleScrollerPause(!0)}),10)})),u((()=>{i&&(i.destroy(),i=null),x().removeAllListeners(),b()})),(t,e)=>(m(),v("div",{ref_key:"containerRef",ref:o,class:"protocolContainer"},null,512))}};export{ne as default};
