import{a as e,r,D as t,E as n,o as a,l as u,m as o,s as i,G as l}from"./entry.9cfb39b7.js";
/*! @license Rematrix v0.7.2

	Copyright 2021 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/function f(e){if(e&&e.constructor===Array){var r=e.filter((function(e){return"number"==typeof e})).filter((function(e){return!isNaN(e)}));if(6===e.length&&6===r.length){var t=s();return t[0]=r[0],t[1]=r[1],t[4]=r[2],t[5]=r[3],t[12]=r[4],t[13]=r[5],t}if(16===e.length&&16===r.length)return e}throw new TypeError("Expected a `number[]` with length 6 or 16.")}function s(){for(var e=[],r=0;r<16;r++)r%5==0?e.push(1):e.push(0);return e}function c(e,r){for(var t=f(e),n=f(r),a=[],u=0;u<4;u++)for(var o=[t[u],t[u+4],t[u+8],t[u+12]],i=0;i<4;i++){var l=4*i,s=[n[l],n[l+1],n[l+2],n[l+3]],c=o[0]*s[0]+o[1]*s[1]+o[2]*s[2]+o[3]*s[3];a[u+l]=c}return a}const d=e({__name:"content-mask",props:{scale:{default:1},width:{},height:{},outerX:{default:0},outerY:{default:0},innerScale:{default:1},innerX:{default:0},innerY:{default:0},active:{default:!1},rounded:{default:!1}},setup(e){const d=e,h=r(),{width:v,height:m}=t(h),p=r(),g=r(),y=function(e,r=0,t=0,n=0,a=0,u=0,o=1,i=1){try{const m=(l=r,d=t,h=n,v=s(),void 0!==l&&void 0!==d&&void 0!==h&&(v[12]=l,v[13]=d,v[14]=h),v),p=function(e){var r=Math.PI/180*e,t=s();return t[5]=t[10]=Math.cos(r),t[6]=t[9]=Math.sin(r),t[9]*=-1,t}(a),g=function(e){var r=Math.PI/180*e,t=s();return t[0]=t[10]=Math.cos(r),t[2]=t[8]=Math.sin(r),t[2]*=-1,t}(u),y=function(e){var r=s();return r[0]=e,r}(o),k=function(e){var r=s();return r[5]=e,r}(i),w=[m,p,g,y,k].reduce(c);e.style.transform="matrix3d("+f(w).join(", ")+")"}catch(m){}var l,d,h,v};return n(d,(()=>{let e=d.scale,r=d.scale;null!=d.width&&(e=d.width/v.value),null!=d.height&&(r=d.height/m.value),y(p.value,d.outerX,d.outerY,0,0,0,e,r),y(g.value,d.innerX-d.outerX,d.innerY-d.outerY,0,0,0,1/e*d.innerScale,1/r*d.innerScale)}),{deep:!0}),(r,t)=>(a(),u("div",{class:"content-mask full",ref_key:"rootRef",ref:h},[o("div",{class:l(["mask full",{rounded:e.rounded}]),ref_key:"maskRef",ref:p},[o("div",{class:"inner full",ref_key:"innerRef",ref:g},[i(r.$slots,"default")],512)],2)],512))}});export{d as default};
