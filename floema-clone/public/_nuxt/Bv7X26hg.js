import{Pn as e,cr as t,pn as n,zn as r}from"./cgz0BpdW.js";import{At as i,I as a,N as o,R as s,X as c,Y as l,b as u,f as d,h as f,k as p,m,mt as h,p as g}from"./xJNWDYji.js";import{W as _,Y as v,c as y,n as b,o as x,s as S,t as C}from"./CegNqfpt.js";import{i as w,m as T,o as E}from"./DKtYPyz8.js";import{t as D}from"./BDNMzG2s.js";import{t as O}from"./B8Og-qgs.js";import{a as k,i as A,n as j,o as M,r as N,t as P}from"#entry";import{t as F}from"./CNs_Ozdc.js";import{t as I}from"./Br7f-3ZK.js";var L={"data-component":`product-page`,class:`inner-page`},R=D({__name:`Product`,props:{metadata:{type:[Boolean,Object],default:!1},sections:{type:[Boolean,Array],default:!1},productSetup:{type:[Boolean,Object],default:!1},sameCollection:{type:[Boolean,Object],default:!1}},setup(e){let n=e,r=O(),{$preview:c}=t(),l=e=>n.sections.find(t=>t._type==e);return o(()=>{}),a(()=>{r.emit(`change-menu-theme`,`main`)}),(t,n)=>(s(),f(`div`,L,[h(c)?(s(),g(h(I),{key:0})):m(``,!0),u(h(A),p({...l(`productDetails`),...e.productSetup},{metadata:e.metadata}),null,16,[`metadata`]),d(`main`,null,[l(`inTheField`)?(s(),g(h(N),i(p({key:0},l(`inTheField`))),null,16)):m(``,!0),l(`integrations`)?.caseStudyList.length>=1?(s(),g(h(j),i(p({key:1},l(`integrations`))),null,16)):m(``,!0),e.sameCollection?(s(),g(h(P),i(p({key:2},e.sameCollection)),null,16)):m(``,!0)]),u(h(x))]))}},[[`__scopeId`,`data-v-ddf3bee3`]]),z=`
"productSetup": productSetup{
	"collection": collection->{
		name,
		"slug":slug.current,
		icon {
			...${k()}
		},
		featuredImage {
			...${k()}
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
			...${k()}
		},
	},
	structureOptions[]->{
		...,
		image{
			...${k()}
		},
	},
	displayOptions[]->{
		...,
		image{
			...${k()}
		},
	},
	availableHPLColors[]->{
		...,
		image{
			...${k()}
		},
	},
	uniqueSize{
		name,
		dimensions,
		printingArea,
		technicalImage {
			...${k()}
		},
	},
	availableSizes[]{
		name,
		label,
		dimensions,
		printingArea,
		technicalImage {
			...${k()}
		},
	},
}
`;function B(e){return`
	_type == "productDetails" => {
		title,
		description,

		"mainImage":modelObjectRef->mainImage{
			...${k()}
		},
		"modelFile":modelObjectRef->modelFile{
			'asset': asset->.url, 
			scene
		},
		"productImages":modelObjectRef->productImages{
			images[]{
				...${k()}
			},
		},

		additionalSpecifications,
		productReferences,
		'productFiles':  *[_type match 'sharedContent' && lang == '${e}'][0].fileRequest{
			title,
			buttonLabel,
			filesDescription,
			privacyText,
			privacyPage->{
				lang,
				metadata
			}
		},
		additionalLinks[]{
			...,
			details[]{
				...,
				_type == 'block' => {
					...,
					markDefs[]{
						...,
						"to": select(
							_type == "internalLink" && defined(href._ref) => href->metadata.slug.current,
							_type == "href" => null,
							defined(to._ref) => to->metadata.slug.current,
							to
						),
						"href": select(
							_type == "href" => to,
							_type == "fileLink" => file.asset->url,
							_type == "internalLink" => null,
							href
						)
					}
				},
			}
		},
	}
`}var V=`
	_type == "inTheField" => {
		title,
		images[]{
		 ...${k()}
		},
		${M()},
}
`,H=`
	_type == "integrations" => {
		title,
		caseStudyList[]->{
			metadata{
				"slug":slug.current
			},
			presentation{
				title,
				description,
				date,
				"category": category->{
					name,
					"slug": slug.current
				},
				${M()},
			}
		},
	}
`,U=`
...,
"sections": sections[]{
	_type == "productDetails" => {
			title,

			"mainImage": modelObjectRef->mainImage{
				...${k()}
			},
	},
},
"productSetup": productSetup{
		"collection": collection->{
			name,
			"slug":slug.current,
			icon {
				...${k()}
			},
			featuredImage {
				...${k()}
			},
			subCategories[]->{
				name
			}
		},

		"subCollection": subCollection->,

		availableColors[]->{
			...,
			image{
				...${k()}
			},
		},
		availableStructure[]->{
			...,
			image{
				...${k()}
			},
		},
		availableSizes[]{
			name,
			label,
			dimensions,
			technicalImage {
				...${k()}
			},
		},
		availableDisplay[]->{
			...,
			image{
				...${k()}
			},
		},
		availableHPLColors[]->{
			...,
			image{
				...${k()}
			},
		},
	}`;function W(e){return`
	"sameCollection": {
		"productList": coalesce(
			productList[]->{${U}}, 
			*[_type == "page.product" && productSetup.collection._ref == ^.productSetup.collection._ref && lang == '${e}' && !(_id in path("drafts.**"))]{${U}}
  		)
	}
`}function G(e,t=`pt`){return C`
	*[_type == 'page.product' && metadata.slug.current == "${e}" && lang == '${t}' && !(_id in path("drafts.**"))][0] {
		_type,
		"metadata": metadata{...${S({includeStructuredData:!0})}},
		"sections": sections[] {
			_type,
			${B(t)},
			${V},
			${H},
		},
		${z},
		${W(t)},

	}
	`}var K={__name:`[slug]`,async setup(t){let a,o,{locales:u,locale:d,setLocale:f}=T(),{slug:x}=r().params,S=G(x,d.value),{data:C,pending:D,error:O}=([a,o]=l(()=>b(S)),a=await a,o(),a);if(O.value)throw e({statusCode:O.value?.statusCode||500,statusMessage:O.value?.message||`An error occurred`});!D.value&&C.value;let k=([a,o]=l(()=>w({page:C.value,locale:d})),a=await a,o(),a);E(C.value.metadata,d,k,{pageType:C.value._type}),F({pageTransition:y});let{onEnter:A,onLeave:j}=v();return n({bodyAttrs:{class:C.value.metadata.slug}}),(e,t)=>(s(),g(h(_),{slug:h(C).metadata.slug,name:h(C).metadata.name,metadata:h(C).metadata,"transition-enter":h(A),"transition-leave":h(j)},{default:c(()=>[h(C)?(s(),g(h(R),i(p({key:0},h(C))),null,16)):m(``,!0)]),_:1},8,[`slug`,`name`,`metadata`,`transition-enter`,`transition-leave`]))}};export{K as default};