import{Pn as e,pn as t,zn as n}from"./cgz0BpdW.js";import{At as r,D as i,I as a,Mt as o,N as s,R as c,T as l,V as u,X as d,Y as f,b as p,f as m,h,i as g,k as _,m as v,mt as y,p as b,st as x}from"./xJNWDYji.js";import{H as S,W as C,X as w,Y as T,c as E,n as D,o as O,s as k,t as A,w as j}from"./CegNqfpt.js";import{i as M,m as N,n as P,o as F}from"./DKtYPyz8.js";import{t as I}from"./BDNMzG2s.js";import{t as L}from"./B8Og-qgs.js";import{t as R}from"./BGV7hRp8.js";import{t as z}from"./CNs_Ozdc.js";var B={class:`g-row title-row`},ee={class:`g-col xxl-9 xxl-offset-9 md-16 md-offset-7 sm-20 sm-offset-4 xs-offset-2 xs-22`},V={class:`-title-3-medium title`},H={class:`g-row subtitle-row`},U={class:`xxl-9 xxl-offset-9 md-16 md-offset-7 sm-20 sm-offset-4 xs-offset-2 xs-22 g-col`},W={class:`-title-8-medium subtitle`},G=I({__name:`Header`,props:{title:{type:[Boolean,String],default:!1},subtitle:{type:[Boolean,String],default:!1}},setup(e){let{locale:t}=N();P();let n=i(`pageContext`),{formatDate:r}=w(),l=x(null),u=()=>{l.value};return s(()=>{}),a(()=>{n.$page.loader.loaded.then(()=>u()),n.$page.loader.ready.then(()=>void 0)}),(t,n)=>(c(),h(`header`,{ref_key:`el`,ref:l,"data-component":`legal-header`},[m(`div`,B,[m(`div`,ee,[m(`h1`,V,o(e.title),1)])]),m(`div`,H,[m(`div`,U,[m(`h2`,W,o(e.subtitle),1)])])],512))}},[[`__scopeId`,`data-v-41c3a4aa`]]),K={class:`g-row content-row`},q={class:`xxl-9 xxl-offset-9 md-16 md-offset-7 sm-20 sm-offset-4 xs-offset-2 xs-22 g-col`},J={class:`content`},Y={key:0,class:`-body-medium left-title`},X={key:1,class:`-body-medium left-title`},Z=I({__name:`Content`,props:{content:{type:[Boolean,Array],default:!1}},setup(e){let t={marks:{externalLink:({value:e},{slots:t})=>l(S,e,t),internalLink:({value:e},{slots:t})=>l(S,e,t)}},n=e=>`${String(e+1).padStart(2,`0`)}.`,r=x(null);return s(()=>{}),a(()=>{}),(i,a)=>{let s=j;return c(),h(`section`,{ref_key:`el`,ref:r,"data-component":`legal-content`},[m(`div`,K,[m(`div`,q,[m(`div`,J,[(c(!0),h(g,null,u(e.content,(e,r)=>(c(),h(`div`,{key:r,class:`block`},[e.leftTitle?(c(),h(`p`,Y,o(e.leftTitle),1)):(c(),h(`p`,X,o(n(r)),1)),p(s,{value:e.textBlock||[],components:t},null,8,[`value`])]))),128))])])])],512)}}},[[`__scopeId`,`data-v-03ffc42a`]]),Q={"data-component":`legal-page`,class:`inner-page`},$=I({__name:`Legal`,props:{metadata:{type:[Boolean,Object],default:!1},sections:{type:[Boolean,Array],default:!1}},setup(e){return L(),s(()=>{}),a(()=>{}),(t,n)=>(c(),h(`div`,Q,[p(y(G),_(e.sections[0],{"data-section-intersect":`dark`}),null,16),m(`main`,null,[p(y(Z),_(e.sections[1],{"data-section-intersect":`dark`}),null,16)]),p(y(O))]))}},[[`__scopeId`,`data-v-0a918902`]]),te=`
	_type == "header" => {
		title,
		subtitle,
		_updatedAt,

	}
`,ne=`
	_type == "content" => {
		"type": ^._type,
		leftTitle,
		content[]{
			...,
			_type == 'block' => {
				...,
				markDefs[]{
					...,
					...${R()}
				}
			},
		}
	}
`;function re(e,t=`pt`){return A`
	*[_type == 'page.legal' && metadata.slug.current == "${e}" && lang == '${t}' && !(_id in path("drafts.**"))][0] {
		_type,
		"metadata": metadata{...${k({includeStructuredData:!0})}},
		"sections": sections[] {
			_type,
			${te},
			${ne},
		},
	}
	`}var ie={__name:`[slug]`,async setup(i){let a,o,{locales:s,locale:l,setLocale:u}=N(),{slug:p}=n().params,m=re(p,l.value),{data:h,pending:g,error:x}=([a,o]=f(()=>D(m)),a=await a,o(),a);if(x.value)throw e({statusCode:x.value?.statusCode||500,statusMessage:x.value?.message||`An error occurred`});!g.value&&h.value;let S=([a,o]=f(()=>M({page:h.value,locale:l})),a=await a,o(),a);F(h.value.metadata,l,S,{pageType:h.value._type}),z({pageTransition:E});let{onEnter:w,onLeave:O}=T();return t({bodyAttrs:{class:h.value.metadata.slug}}),(e,t)=>(c(),b(y(C),{slug:y(h).metadata.slug,name:y(h).metadata.name,metadata:y(h).metadata,"transition-enter":y(w),"transition-leave":y(O)},{default:d(()=>[y(h)?(c(),b(y($),r(_({key:0},y(h))),null,16)):v(``,!0)]),_:1},8,[`slug`,`name`,`metadata`,`transition-enter`,`transition-leave`]))}};export{ie as default};