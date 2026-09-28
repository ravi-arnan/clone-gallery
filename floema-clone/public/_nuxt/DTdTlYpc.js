import{Pn as e,cr as t,pn as n,zn as r}from"./cgz0BpdW.js";import{At as i,I as a,N as o,R as s,X as c,Y as l,b as u,f as d,h as f,k as p,m,mt as h,p as g,st as _,w as v}from"./xJNWDYji.js";import{W as y,Y as b,c as x,d as S,f as C,n as w,o as T,p as E,s as D,t as O}from"./CegNqfpt.js";import{i as k,m as A,o as j}from"./DKtYPyz8.js";import{t as M}from"./BDNMzG2s.js";import{t as N}from"./B8Og-qgs.js";import{t as P}from"./BGV7hRp8.js";import{o as F}from"#entry";import{t as I}from"./CNs_Ozdc.js";import{t as L}from"./Br7f-3ZK.js";var R={"data-component":`article-page`,class:`inner-page`},z=M({__name:`Article`,props:{metadata:{type:[Boolean,Object],default:!1},sections:{type:[Boolean,Array],default:!1},gallery:{type:[Boolean,Object],default:!1}},setup(e){let{$preview:n}=t(),r=N(),c=_(!1);r.on(`gallery-open`,()=>l()),r.on(`gallery-close`,()=>l());function l(){c.value=!c.value}o(()=>{}),a(()=>{r.emit(`change-menu-theme`,`main`)});let{onEnter:y,onLeave:x}=b();return(t,r)=>(s(),f(`div`,R,[h(n)?(s(),g(h(L),{key:0})):m(``,!0),h(c)?(s(),g(h(S),i(p({key:1},e.gallery)),null,16)):m(``,!0),u(h(E),i(v({...e.sections[0],...e.gallery})),null,16),d(`main`,null,[u(h(C),i(v(e.sections[1])),null,16)]),u(h(T))]))}},[[`__scopeId`,`data-v-76af37bf`]]),B=`
	_type == "articleHeader" => {
		"category": ^.presentation.category->{
			name,
			"slug": slug.current
		},
		title,
		"date": ^.presentation.date,
		figure {
			...,
			${F()}
		},
		"readTime": ^.sections[1]{
			"time":round(length(pt::text(content)) / 5 / 180 ),
		}.time
	}
`,V=`
	_type == "articleContent" => {
		"type": ^._type,
		"readingTime": round(length(pt::text(content)) / 5 / 180 ),
		content[]{
			...,
			_type == 'block' => {
				...,
				markDefs[]{
					...,
					...${P()}
				}
			},
			_type == "figure" => {
				...,
				${F()}
			},
			_type == "figureSet" => {
				...,
				figures[]{
					...,
					${F()}
				}
			},
		}
	}
`,H=`
	gallery {
		title,
		images[]{
			description,
			${F()}
		}
	}
`;function U(e,t=`pt`){return O`
	*[_type == 'page.article' && metadata.slug.current == "${e}" && lang == '${t}' && !(_id in path("drafts.**"))][0] {
		_type,
		_createdAt,
		_updatedAt,
		"metadata": metadata{...${D({includeStructuredData:!0})}},
		"sections": sections[] {
			_type,
			${B},
			${V},
		},
		"gallery": ${H}
	}
	`}var W={__name:`[slug]`,async setup(t){let a,o,{locales:u,locale:d,setLocale:f}=A(),{slug:_}=r().params,v=U(_,d.value),{data:S,pending:C,error:T}=([a,o]=l(()=>w(v)),a=await a,o(),a);if(T.value)throw e({statusCode:T.value?.statusCode||500,statusMessage:T.value?.message||`An error occurred`});!C.value&&S.value;let E=([a,o]=l(()=>k({page:S.value,locale:d})),a=await a,o(),a);j(S.value.metadata,d,E,{pageType:S.value._type}),I({pageTransition:x});let{onEnter:D,onLeave:O}=b();return n({bodyAttrs:{class:S.value.metadata.slug}}),(e,t)=>(s(),g(h(y),{slug:h(S).metadata.slug,name:h(S).metadata.name,metadata:h(S).metadata,"transition-enter":h(D),"transition-leave":h(O)},{default:c(()=>[h(S)?(s(),g(h(z),i(p({key:0},h(S))),null,16)):m(``,!0)]),_:1},8,[`slug`,`name`,`metadata`,`transition-enter`,`transition-leave`]))}};export{W as default};