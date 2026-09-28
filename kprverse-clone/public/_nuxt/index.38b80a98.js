var e=Object.defineProperty,s=(s,r,o)=>(((s,r,o)=>{r in s?e(s,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[r]=o})(s,"symbol"!=typeof r?r+"":r,o),o);import{C as r}from"./index.6c8f1534.js";import{D as o,x as t}from"./dom-component.59802661.js";import{aU as n,at as a}from"./entry.9cfb39b7.js";import{a as i}from"./index-default.25f36e61.js";class l extends r{constructor(){super(...arguments),s(this,"options",{template:({props:e,options:s,context:r})=>t`<div class="sectorMenu ${s.length<=1?"sectorMenu--only":null}" ?display=${e.v}>
    ${s.length<=1?t`<div class='sectorMenu__label'><span>sector ${e.iStr}</span></div>`:t`
<div class="sectorMenu__arrow arrow-l" @click=${()=>r.onArrowSelect({sign:-1})}>
    <svg viewBox="0 0 7 12">
        <use href="#arrow-select"></use>
    </svg>
</div>
<div class='sectorMenu__label'><span>sector
        ${e.iStr}</span><span>/${s.length}</span></div>
<div class="sectorMenu__arrow arrow-r" @click=${()=>r.onArrowSelect({sign:1})}>
    <svg viewBox="0 0 7 12">
        <use href="#arrow-select"></use>
    </svg>
</div>
`}</div>`,length:1,handleArrowSelect:n}),s(this,"props",{i:0,iStr:e=>null!==e.i?e.i+1:"-"}),s(this,"propsAnim",{alpha:0,blink:0})}onArrowSelect({sign:e}){this.options.handleArrowSelect({sign:e})}setV(e){let s=0,r=0;const{propsAnim:o}=this,t=+e;a.to(this.propsAnim,{duration:.4,blink:t,onUpdate:()=>{const e=performance.now();s||(s=e),r+=e-s,s=e,r>1&&o.blink<1?(r=0,o.alpha=Math.random()):o.blink==t&&(o.alpha=t),a.set(this.el,{alpha:o.alpha})}})}}i(l,[o]);export{l as default};
