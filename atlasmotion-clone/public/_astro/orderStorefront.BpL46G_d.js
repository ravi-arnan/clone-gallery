const CONTACT_API_URL="/api/contact",SUCCESS_CLEAR_DELAY_MS=6e3,EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,MIN_MESSAGE_LENGTH=10,SUBMIT_LABEL_DEFAULT="Start the Conversation",SUBMIT_LABEL_LOADING="Sending…";function validateRequiredTarget(n,e){return n.trim()?n.trim().length>80?"Please keep this target under 80 characters.":null:`Please enter ${e.toLowerCase()} or TBD.`}function validateOptionalProgramField(n){return n.trim().length>240?"Please keep this detail under 240 characters.":null}const FIELD_CONFIG={name:{label:"Name",validate:n=>n.trim()?n.trim().length<2?"Name must be at least 2 characters.":null:"Please enter your name."},email:{label:"Work email",validate:n=>n.trim()?EMAIL_REGEX.test(n.trim())?null:"Please enter a valid email address.":"Please enter your work email."},role:{label:"Role",validate:n=>n.trim()?null:"Please enter your role."},company:{label:"Company",validate:n=>n.trim()?null:"Please enter your company."},annual_quantity:{label:"Estimated annual quantity",validate:n=>n.trim()?n.trim().length>80?"Please keep your estimate under 80 characters.":null:"Please enter an estimate or TBD."},continuous_torque:{label:"Continuous torque",validate:n=>validateRequiredTarget(n,"Continuous torque")},peak_torque:{label:"Peak torque",validate:n=>validateRequiredTarget(n,"Peak torque")},max_speed:{label:"Max speed",validate:n=>validateRequiredTarget(n,"Max speed")},voltage:{label:"Voltage",validate:n=>validateRequiredTarget(n,"Voltage")},estimated_quantity:{label:"Estimated quantity",validate:n=>validateRequiredTarget(n,"Estimated quantity")},duty_cycle:{label:"Duty cycle",validate:validateOptionalProgramField},target_timing:{label:"Target first units",validate:validateOptionalProgramField},envelope:{label:"Packaging constraints",validate:validateOptionalProgramField},environment:{label:"Operating environment",validate:validateOptionalProgramField},control_requirements:{label:"Control / feedback requirements",validate:validateOptionalProgramField},message:{label:"Message",validate:n=>n.trim()?n.trim().length<10?"Please provide at least 10 characters.":null:"Please tell us what you are building."}};async function submitContactForm(n,e){const t=await fetch(CONTACT_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:e}),i=await t.json().catch(()=>({}));if(!t.ok||i.ok===!1)throw new Error(i.error||"Something went wrong. Please try again.");return i}class ContactForm{isSendingRequest=!1;fieldNames=Object.keys(FIELD_CONFIG);submitLabelDefault=SUBMIT_LABEL_DEFAULT;successMessage="Thank you — we'll be in touch shortly.";fieldConfig=FIELD_CONFIG;domForm=null;domSubmitButton=null;domSubmitLabel=null;domFeedback=null;domFields={};domFieldErrors={};_abortController=null;_successClearTimeout=null;_onSubmitBound=null;_onInputBound=null;_formStartedAt=null;constructor(e,t={}){e.__contactForm=this,this.domForm=e,this.fieldNames=t.fieldNames||Object.keys(FIELD_CONFIG),this.submitLabelDefault=t.submitLabelDefault||SUBMIT_LABEL_DEFAULT,this.successMessage=t.successMessage||this.successMessage,this.fieldConfig={...FIELD_CONFIG,...t.fieldConfig},this.domSubmitButton=e.querySelector(".contact-form__submit"),this.domSubmitLabel=this.domSubmitButton?.querySelector("span:not([aria-hidden])")||this.domSubmitButton,this.domFeedback=e.querySelector(".contact-form__feedback"),this.fieldNames.forEach(i=>{const r=e.querySelector(`[name="${i}"]`),a=e.querySelector(`#contact-${i}-error`);r&&(this.domFields[i]=r),a&&(this.domFieldErrors[i]=a)}),this._onSubmitBound=this._onFormSubmit.bind(this),this._onInputBound=this._onFieldInput.bind(this),this.domForm.addEventListener("submit",this._onSubmitBound),Object.values(this.domFields).forEach(i=>{i.addEventListener("input",this._onInputBound)}),this.domForm.addEventListener("focusin",()=>{this._formStartedAt||(this._formStartedAt=Date.now().toString())})}_onFieldInput(e){const t=e.target.name;this.fieldConfig[t]&&(this._clearFieldError(t),this._clearFeedback())}_onFormSubmit(e){if(e.preventDefault(),this.isSendingRequest)return;this._clearFeedback(),this.domForm.classList.add("is-submitted");const t=new FormData(this.domForm),i=Object.fromEntries(this.fieldNames.map(o=>[o,String(t.get(o)||"").trim()]));if(!this._validateForm(i)){const o=this.fieldNames.find(s=>this.fieldConfig[s].validate(i[s]));o&&this.domFields[o]&&this.domFields[o].focus();return}const a={...i,inquiry_type:String(t.get("inquiry_type")||""),website:String(t.get("website")||""),form_started_at:this._formStartedAt||Date.now().toString()};this._submitForm(a)}_validateForm(e){let t=!0;return this.fieldNames.forEach(i=>{const a=this.fieldConfig[i].validate(e[i]);a?(this._setFieldError(i,a),t=!1):this._clearFieldError(i)}),t}async _submitForm(e){this._abortController?.abort(),this._abortController=new AbortController,this.isSendingRequest=!0,this._setLoadingState(!0);try{await submitContactForm(e,this._abortController.signal),this.domForm.reset(),this.domForm.classList.remove("is-submitted"),this._clearAllFieldErrors(),this._formStartedAt=null,this._showSuccess(this.successMessage),this._successClearTimeout=window.setTimeout(()=>{this._clearFeedback()},6e3)}catch(t){if(t.name==="AbortError")return;this._showError(t.message||"Something went wrong. Please try again.")}finally{this.isSendingRequest=!1,this._setLoadingState(!1),this._abortController=null}}_setLoadingState(e){const t=e?SUBMIT_LABEL_LOADING:this.submitLabelDefault;this.domForm.classList.toggle("is-loading",e),this.domSubmitButton.disabled=e,this.domSubmitButton.setAttribute("aria-busy",e?"true":"false"),this.domSubmitButton.setAttribute("aria-label",t),this.domSubmitLabel?.__splitText||(this.domSubmitLabel.textContent=t),Object.values(this.domFields).forEach(i=>{i.disabled=e})}_setFieldError(e,t){const i=this.domFields[e],r=this.domFieldErrors[e];i?.setAttribute("aria-invalid","true"),i?.closest(".contact-form__field")?.classList.add("is-invalid"),r&&(r.textContent=t)}_clearFieldError(e){const t=this.domFields[e],i=this.domFieldErrors[e];t?.setAttribute("aria-invalid","false"),t?.closest(".contact-form__field")?.classList.remove("is-invalid"),i&&(i.textContent="")}_clearAllFieldErrors(){this.fieldNames.forEach(e=>{this._clearFieldError(e)})}_showError(e){this.domFeedback&&(this.domFeedback.textContent=e,this.domFeedback.classList.add("is-error"),this.domFeedback.classList.remove("is-success"),this.domFeedback.setAttribute("role","alert"))}_showSuccess(e){this.domFeedback&&(this.domFeedback.textContent=e,this.domFeedback.classList.add("is-success"),this.domFeedback.classList.remove("is-error"),this.domFeedback.setAttribute("role","status"))}_clearFeedback(){this.domFeedback&&(window.clearTimeout(this._successClearTimeout),this._successClearTimeout=null,this.domFeedback.textContent="",this.domFeedback.classList.remove("is-error","is-success"),this.domFeedback.removeAttribute("role"))}cancelPending(){this._abortController?.abort(),this._abortController=null,window.clearTimeout(this._successClearTimeout),this._successClearTimeout=null,this.isSendingRequest&&(this.isSendingRequest=!1,this._setLoadingState(!1))}}class OrderInquiryForm{constructor(e){this.contactForm=new ContactForm(e,{fieldNames:["email","annual_quantity","message"],submitLabelDefault:"Discuss a Build"}),this.domMessage=e.querySelector('[name="message"]'),this.onMessageScroll=t=>{this.domMessage.scrollHeight>this.domMessage.clientHeight+1&&t.stopPropagation()},this.domMessage?.addEventListener("wheel",this.onMessageScroll,{passive:!0}),this.domMessage?.addEventListener("touchmove",this.onMessageScroll,{passive:!0})}cancelPending(){this.contactForm?.cancelPending()}}const ACTUATOR_FIELD_NAMES=["name","email","company","continuous_torque","peak_torque","max_speed","voltage","estimated_quantity","message"];class ActuatorInterestForm{constructor(e){this.contactForm=new ContactForm(e,{fieldNames:ACTUATOR_FIELD_NAMES,submitLabelDefault:"Send Interest",successMessage:"Thank you — we'll follow up about your actuator needs.",fieldConfig:{message:{label:"Project notes",validate:t=>t.trim().length>5e3?"Please keep your notes under 5000 characters.":null}}}),this.domMessage=e.querySelector('[name="message"]'),this.onMessageScroll=t=>{this.domMessage.scrollHeight>this.domMessage.clientHeight+1&&t.stopPropagation()},this.domMessage?.addEventListener("wheel",this.onMessageScroll,{passive:!0}),this.domMessage?.addEventListener("touchmove",this.onMessageScroll,{passive:!0})}cancelPending(){this.contactForm?.cancelPending()}}let MathUtils$1=class{PI=Math.PI;PI2=this.PI*2;HALF_PI=this.PI*.5;DEG2RAD=this.PI/180;RAD2DEG=180/this.PI;step(e,t){return t<e?0:1}clamp(e,t,i){return e<t?t:e>i?i:e}mix(e,t,i){return e+(t-e)*i}cMix(e,t,i){return e+(t-e)*this.clamp(i,0,1)}unMix(e,t,i){return(i-e)/(t-e)}cUnMix(e,t,i){return this.clamp((i-e)/(t-e),0,1)}saturate(e){return this.clamp(e,0,1)}fit(e,t,i,r,a,o){return e=this.cUnMix(t,i,e),o&&(e=o(e)),r+e*(a-r)}unClampedFit(e,t,i,r,a,o){return e=this.unMix(t,i,e),o&&(e=o(e)),r+e*(a-r)}loop(e,t,i){return e-=t,i-=t,(e<0?(i-Math.abs(e)%i)%i:e%i)+t}normalize(e,t,i){return Math.max(0,Math.min(1,e-t/i-t))}smoothstep(e,t,i){return i=this.cUnMix(e,t,i),i*i*(3-i*2)}fract(e){return e-Math.floor(e)}hash(e){return this.fract(Math.sin(e)*43758.5453123)}hash2(e,t){return this.fract(Math.sin(e*12.9898+t*4.1414)*43758.5453)}sign(e){return e?e<0?-1:1:0}isPowerOfTwo(e){return(e&-e)===e}powerTwoCeilingBase(e){return Math.ceil(Math.log(e)/Math.log(2))}powerTwoCeiling(e){return this.isPowerOfTwo(e)?e:1<<this.powerTwoCeilingBase(e)}powerTwoFloorBase(e){return Math.floor(Math.log(e)/Math.log(2))}powerTwoFloor(e){return this.isPowerOfTwo(e)?e:1<<this.powerTwoFloorBase(e)}latLngBearing(e,t,i,r){let a=Math.sin(r-t)*Math.cos(i),o=Math.cos(e)*Math.sin(i)-Math.sin(e)*Math.cos(i)*Math.cos(r-t);return Math.atan2(a,o)}distanceTo(e,t){return Math.sqrt(e*e+t*t)}distanceSqrTo(e,t){return e*e+t*t}distanceTo3(e,t,i){return Math.sqrt(e*e+t*t+i*i)}distanceSqrTo3(e,t,i){return e*e+t*t+i*i}latLngDistance(e,t,i,r){let a=Math.sin((i-e)/2),o=Math.sin((r-t)/2),s=a*a+Math.cos(e)*Math.cos(i)*o*o;return 2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}cubicBezier(e,t,i,r,a){let o=(t-e)*3,s=(i-t)*3-o,l=r-e-o-s,c=a*a,d=c*a;return l*d+s*c+o*a+e}cubicBezierFn(e,t,i,r){let a=(t-e)*3,o=(i-t)*3-a,s=r-e-a-o;return l=>{let c=l*l,d=c*l;return s*d+o*c+a*l+e}}normalizeAngle(e){return e+=this.PI,e=e<0?this.PI2-Math.abs(e%PI2):e%this.PI2,e-=this.PI,e}closestAngleTo(e,t){return e+this.normalizeAngle(t-e)}randomRange(e,t){return e+Math.random()*(t-e)}randomRangeInt(e,t){return Math.floor(this.randomRange(e,t+1))}padZero(e,t){return e.toString().length>=t?e:(Math.pow(10,t)+Math.floor(e)).toString().substring(1)}getSeedRandomFn(e){let t=1779033703,i=3144134277,r=1013904242,a=2773480762;for(let o=0,s;o<e.length;o++)s=e.charCodeAt(o),t=i^Math.imul(t^s,597399067),i=r^Math.imul(i^s,2869860233),r=a^Math.imul(r^s,951274213),a=t^Math.imul(a^s,2716044179);return _sfc32(Math.imul(r^t>>>18,597399067),Math.imul(a^i>>>22,2869860233),Math.imul(t^r>>>17,951274213),Math.imul(i^a>>>19,2716044179))}};function _sfc32(n,e,t,i){return function(){n|=0,e|=0,t|=0,i|=0;var r=(n+e|0)+i|0;return i=i+1|0,n=e^e>>>9,e=t+(t<<3)|0,t=t<<21|t>>>11,t=t+r|0,(r>>>0)/4294967296}}const math=new MathUtils$1;/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const REVISION="183",CullFaceNone=0,CullFaceBack=1,CullFaceFront=2,PCFShadowMap=1,PCFSoftShadowMap=2,VSMShadowMap=3,FrontSide=0,BackSide=1,DoubleSide=2,NoBlending=0,NormalBlending=1,AdditiveBlending=2,SubtractiveBlending=3,MultiplyBlending=4,CustomBlending=5,AddEquation=100,SubtractEquation=101,ReverseSubtractEquation=102,MinEquation=103,MaxEquation=104,ZeroFactor=200,OneFactor=201,SrcColorFactor=202,OneMinusSrcColorFactor=203,SrcAlphaFactor=204,OneMinusSrcAlphaFactor=205,DstAlphaFactor=206,OneMinusDstAlphaFactor=207,DstColorFactor=208,OneMinusDstColorFactor=209,SrcAlphaSaturateFactor=210,ConstantColorFactor=211,OneMinusConstantColorFactor=212,ConstantAlphaFactor=213,OneMinusConstantAlphaFactor=214,NeverDepth=0,AlwaysDepth=1,LessDepth=2,LessEqualDepth=3,EqualDepth=4,GreaterEqualDepth=5,GreaterDepth=6,NotEqualDepth=7,MultiplyOperation=0,MixOperation=1,AddOperation=2,NoToneMapping=0,LinearToneMapping=1,ReinhardToneMapping=2,CineonToneMapping=3,ACESFilmicToneMapping=4,CustomToneMapping=5,AgXToneMapping=6,NeutralToneMapping=7,UVMapping=300,CubeReflectionMapping=301,CubeRefractionMapping=302,EquirectangularReflectionMapping=303,EquirectangularRefractionMapping=304,CubeUVReflectionMapping=306,RepeatWrapping=1e3,ClampToEdgeWrapping=1001,MirroredRepeatWrapping=1002,NearestFilter=1003,NearestMipmapNearestFilter=1004,NearestMipMapNearestFilter=1004,NearestMipmapLinearFilter=1005,NearestMipMapLinearFilter=1005,LinearFilter=1006,LinearMipmapNearestFilter=1007,LinearMipMapNearestFilter=1007,LinearMipmapLinearFilter=1008,LinearMipMapLinearFilter=1008,UnsignedByteType=1009,ByteType=1010,ShortType=1011,UnsignedShortType=1012,IntType=1013,UnsignedIntType=1014,FloatType=1015,HalfFloatType=1016,UnsignedShort4444Type=1017,UnsignedShort5551Type=1018,UnsignedInt248Type=1020,UnsignedInt5999Type=35902,UnsignedInt101111Type=35899,AlphaFormat=1021,RGBFormat=1022,RGBAFormat=1023,DepthFormat=1026,DepthStencilFormat=1027,RedFormat=1028,RedIntegerFormat=1029,RGFormat=1030,RGIntegerFormat=1031,RGBAIntegerFormat=1033,RGB_S3TC_DXT1_Format=33776,RGBA_S3TC_DXT1_Format=33777,RGBA_S3TC_DXT3_Format=33778,RGBA_S3TC_DXT5_Format=33779,RGB_PVRTC_4BPPV1_Format=35840,RGB_PVRTC_2BPPV1_Format=35841,RGBA_PVRTC_4BPPV1_Format=35842,RGBA_PVRTC_2BPPV1_Format=35843,RGB_ETC1_Format=36196,RGB_ETC2_Format=37492,RGBA_ETC2_EAC_Format=37496,R11_EAC_Format=37488,SIGNED_R11_EAC_Format=37489,RG11_EAC_Format=37490,SIGNED_RG11_EAC_Format=37491,RGBA_ASTC_4x4_Format=37808,RGBA_ASTC_5x4_Format=37809,RGBA_ASTC_5x5_Format=37810,RGBA_ASTC_6x5_Format=37811,RGBA_ASTC_6x6_Format=37812,RGBA_ASTC_8x5_Format=37813,RGBA_ASTC_8x6_Format=37814,RGBA_ASTC_8x8_Format=37815,RGBA_ASTC_10x5_Format=37816,RGBA_ASTC_10x6_Format=37817,RGBA_ASTC_10x8_Format=37818,RGBA_ASTC_10x10_Format=37819,RGBA_ASTC_12x10_Format=37820,RGBA_ASTC_12x12_Format=37821,RGBA_BPTC_Format=36492,RGB_BPTC_SIGNED_Format=36494,RGB_BPTC_UNSIGNED_Format=36495,RED_RGTC1_Format=36283,SIGNED_RED_RGTC1_Format=36284,RED_GREEN_RGTC2_Format=36285,SIGNED_RED_GREEN_RGTC2_Format=36286,BasicDepthPacking=3200,TangentSpaceNormalMap=0,ObjectSpaceNormalMap=1,NoColorSpace="",SRGBColorSpace="srgb",LinearSRGBColorSpace="srgb-linear",LinearTransfer="linear",SRGBTransfer="srgb",KeepStencilOp=7680,AlwaysStencilFunc=519,NeverCompare=512,LessCompare=513,EqualCompare=514,LessEqualCompare=515,GreaterCompare=516,NotEqualCompare=517,GreaterEqualCompare=518,AlwaysCompare=519,StaticDrawUsage=35044,GLSL3="300 es",WebGLCoordinateSystem=2e3,WebGPUCoordinateSystem=2001;function arrayNeedsUint32(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function createElementNS(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function createCanvasElement(){const n=createElementNS("canvas");return n.style.display="block",n}const _cache={};function log(...n){const e="THREE."+n.shift();console.log(e,...n)}function enhanceLogMessage(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function warn(...n){n=enhanceLogMessage(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function error(...n){n=enhanceLogMessage(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function warnOnce(...n){const e=n.join(" ");e in _cache||(_cache[e]=!0,warn(...n))}function probeAsync(n,e,t){return new Promise(function(i,r){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const ReversedDepthFuncs={[NeverDepth]:AlwaysDepth,[LessDepth]:GreaterDepth,[EqualDepth]:NotEqualDepth,[LessEqualDepth]:GreaterEqualDepth,[AlwaysDepth]:NeverDepth,[GreaterDepth]:LessDepth,[NotEqualDepth]:EqualDepth,[GreaterEqualDepth]:LessEqualDepth};class EventDispatcher{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let a=0,o=r.length;a<o;a++)r[a].call(this,e);e.target=null}}}const _lut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _seed=1234567;const DEG2RAD=Math.PI/180,RAD2DEG=180/Math.PI;function generateUUID(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_lut[n&255]+_lut[n>>8&255]+_lut[n>>16&255]+_lut[n>>24&255]+"-"+_lut[e&255]+_lut[e>>8&255]+"-"+_lut[e>>16&15|64]+_lut[e>>24&255]+"-"+_lut[t&63|128]+_lut[t>>8&255]+"-"+_lut[t>>16&255]+_lut[t>>24&255]+_lut[i&255]+_lut[i>>8&255]+_lut[i>>16&255]+_lut[i>>24&255]).toLowerCase()}function clamp(n,e,t){return Math.max(e,Math.min(t,n))}function euclideanModulo(n,e){return(n%e+e)%e}function mapLinear(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function inverseLerp(n,e,t){return n!==e?(t-n)/(e-n):0}function lerp(n,e,t){return(1-t)*n+t*e}function damp(n,e,t,i){return lerp(n,e,1-Math.exp(-t*i))}function pingpong(n,e=1){return e-Math.abs(euclideanModulo(n,e*2)-e)}function smoothstep(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function smootherstep(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function randInt(n,e){return n+Math.floor(Math.random()*(e-n+1))}function randFloat(n,e){return n+Math.random()*(e-n)}function randFloatSpread(n){return n*(.5-Math.random())}function seededRandom(n){n!==void 0&&(_seed=n);let e=_seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function degToRad(n){return n*DEG2RAD}function radToDeg(n){return n*RAD2DEG}function isPowerOfTwo(n){return(n&n-1)===0&&n!==0}function ceilPowerOfTwo(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function floorPowerOfTwo(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function setQuaternionFromProperEuler(n,e,t,i,r){const a=Math.cos,o=Math.sin,s=a(t/2),l=o(t/2),c=a((e+i)/2),d=o((e+i)/2),f=a((e-i)/2),u=o((e-i)/2),h=a((i-e)/2),_=o((i-e)/2);switch(r){case"XYX":n.set(s*d,l*f,l*u,s*c);break;case"YZY":n.set(l*u,s*d,l*f,s*c);break;case"ZXZ":n.set(l*f,l*u,s*d,s*c);break;case"XZX":n.set(s*d,l*_,l*h,s*c);break;case"YXY":n.set(l*h,s*d,l*_,s*c);break;case"ZYZ":n.set(l*_,l*h,s*d,s*c);break;default:warn("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function denormalize(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function normalize(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const MathUtils={DEG2RAD,RAD2DEG,generateUUID,clamp,euclideanModulo,mapLinear,inverseLerp,lerp,damp,pingpong,smoothstep,smootherstep,randInt,randFloat,randFloatSpread,seededRandom,degToRad,radToDeg,isPowerOfTwo,ceilPowerOfTwo,floorPowerOfTwo,setQuaternionFromProperEuler,normalize,denormalize};class Vector2{constructor(e=0,t=0){Vector2.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=clamp(this.x,e.x,t.x),this.y=clamp(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=clamp(this.x,e,t),this.y=clamp(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(clamp(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(clamp(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),a=this.x-e.x,o=this.y-e.y;return this.x=a*i-o*r+e.x,this.y=a*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Quaternion{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,a,o,s){let l=i[r+0],c=i[r+1],d=i[r+2],f=i[r+3],u=a[o+0],h=a[o+1],_=a[o+2],v=a[o+3];if(f!==v||l!==u||c!==h||d!==_){let m=l*u+c*h+d*_+f*v;m<0&&(u=-u,h=-h,_=-_,v=-v,m=-m);let p=1-s;if(m<.9995){const S=Math.acos(m),M=Math.sin(S);p=Math.sin(p*S)/M,s=Math.sin(s*S)/M,l=l*p+u*s,c=c*p+h*s,d=d*p+_*s,f=f*p+v*s}else{l=l*p+u*s,c=c*p+h*s,d=d*p+_*s,f=f*p+v*s;const S=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=S,c*=S,d*=S,f*=S}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,a,o){const s=i[r],l=i[r+1],c=i[r+2],d=i[r+3],f=a[o],u=a[o+1],h=a[o+2],_=a[o+3];return e[t]=s*_+d*f+l*h-c*u,e[t+1]=l*_+d*u+c*f-s*h,e[t+2]=c*_+d*h+s*u-l*f,e[t+3]=d*_-s*f-l*u-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,a=e._z,o=e._order,s=Math.cos,l=Math.sin,c=s(i/2),d=s(r/2),f=s(a/2),u=l(i/2),h=l(r/2),_=l(a/2);switch(o){case"XYZ":this._x=u*d*f+c*h*_,this._y=c*h*f-u*d*_,this._z=c*d*_+u*h*f,this._w=c*d*f-u*h*_;break;case"YXZ":this._x=u*d*f+c*h*_,this._y=c*h*f-u*d*_,this._z=c*d*_-u*h*f,this._w=c*d*f+u*h*_;break;case"ZXY":this._x=u*d*f-c*h*_,this._y=c*h*f+u*d*_,this._z=c*d*_+u*h*f,this._w=c*d*f-u*h*_;break;case"ZYX":this._x=u*d*f-c*h*_,this._y=c*h*f+u*d*_,this._z=c*d*_-u*h*f,this._w=c*d*f+u*h*_;break;case"YZX":this._x=u*d*f+c*h*_,this._y=c*h*f+u*d*_,this._z=c*d*_-u*h*f,this._w=c*d*f-u*h*_;break;case"XZY":this._x=u*d*f-c*h*_,this._y=c*h*f-u*d*_,this._z=c*d*_+u*h*f,this._w=c*d*f+u*h*_;break;default:warn("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],a=t[8],o=t[1],s=t[5],l=t[9],c=t[2],d=t[6],f=t[10],u=i+s+f;if(u>0){const h=.5/Math.sqrt(u+1);this._w=.25/h,this._x=(d-l)*h,this._y=(a-c)*h,this._z=(o-r)*h}else if(i>s&&i>f){const h=2*Math.sqrt(1+i-s-f);this._w=(d-l)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(a+c)/h}else if(s>f){const h=2*Math.sqrt(1+s-i-f);this._w=(a-c)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(l+d)/h}else{const h=2*Math.sqrt(1+f-i-s);this._w=(o-r)/h,this._x=(a+c)/h,this._y=(l+d)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(clamp(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,a=e._z,o=e._w,s=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+o*s+r*c-a*l,this._y=r*d+o*l+a*s-i*c,this._z=a*d+o*c+i*l-r*s,this._w=o*d-i*s-r*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,a=e._z,o=e._w,s=this.dot(e);s<0&&(i=-i,r=-r,a=-a,o=-o,s=-s);let l=1-t;if(s<.9995){const c=Math.acos(s),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+a*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+a*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Vector3{constructor(e=0,t=0,i=0){Vector3.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_quaternion$5.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_quaternion$5.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*r,this.y=a[1]*t+a[4]*i+a[7]*r,this.z=a[2]*t+a[5]*i+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,a=e.elements,o=1/(a[3]*t+a[7]*i+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*r+a[12])*o,this.y=(a[1]*t+a[5]*i+a[9]*r+a[13])*o,this.z=(a[2]*t+a[6]*i+a[10]*r+a[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,a=e.x,o=e.y,s=e.z,l=e.w,c=2*(o*r-s*i),d=2*(s*t-a*r),f=2*(a*i-o*t);return this.x=t+l*c+o*f-s*d,this.y=i+l*d+s*c-a*f,this.z=r+l*f+a*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r,this.y=a[1]*t+a[5]*i+a[9]*r,this.z=a[2]*t+a[6]*i+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=clamp(this.x,e.x,t.x),this.y=clamp(this.y,e.y,t.y),this.z=clamp(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=clamp(this.x,e,t),this.y=clamp(this.y,e,t),this.z=clamp(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(clamp(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,a=e.z,o=t.x,s=t.y,l=t.z;return this.x=r*l-a*s,this.y=a*o-i*l,this.z=i*s-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return _vector$c.copy(this).projectOnVector(e),this.sub(_vector$c)}reflect(e){return this.sub(_vector$c.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(clamp(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _vector$c=new Vector3,_quaternion$5=new Quaternion;class Matrix3{constructor(e,t,i,r,a,o,s,l,c){Matrix3.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,a,o,s,l,c)}set(e,t,i,r,a,o,s,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=s,d[3]=t,d[4]=a,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,a=this.elements,o=i[0],s=i[3],l=i[6],c=i[1],d=i[4],f=i[7],u=i[2],h=i[5],_=i[8],v=r[0],m=r[3],p=r[6],S=r[1],M=r[4],y=r[7],w=r[2],A=r[5],R=r[8];return a[0]=o*v+s*S+l*w,a[3]=o*m+s*M+l*A,a[6]=o*p+s*y+l*R,a[1]=c*v+d*S+f*w,a[4]=c*m+d*M+f*A,a[7]=c*p+d*y+f*R,a[2]=u*v+h*S+_*w,a[5]=u*m+h*M+_*A,a[8]=u*p+h*y+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*s*c-i*a*d+i*s*l+r*a*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8],f=d*o-s*c,u=s*l-d*a,h=c*a-o*l,_=t*f+i*u+r*h;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=f*v,e[1]=(r*c-d*i)*v,e[2]=(s*i-r*o)*v,e[3]=u*v,e[4]=(d*t-r*l)*v,e[5]=(r*a-s*t)*v,e[6]=h*v,e[7]=(i*l-c*t)*v,e[8]=(o*t-i*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,a,o,s){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*o+c*s)+o+e,-r*c,r*l,-r*(-c*o+l*s)+s+t,0,0,1),this}scale(e,t){return this.premultiply(_m3.makeScale(e,t)),this}rotate(e){return this.premultiply(_m3.makeRotation(-e)),this}translate(e,t){return this.premultiply(_m3.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _m3=new Matrix3,LINEAR_REC709_TO_XYZ=new Matrix3().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),XYZ_TO_LINEAR_REC709=new Matrix3().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function createColorManagement(){const n={enabled:!0,workingColorSpace:LinearSRGBColorSpace,spaces:{},convert:function(r,a,o){return this.enabled===!1||a===o||!a||!o||(this.spaces[a].transfer===SRGBTransfer&&(r.r=SRGBToLinear(r.r),r.g=SRGBToLinear(r.g),r.b=SRGBToLinear(r.b)),this.spaces[a].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[a].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===SRGBTransfer&&(r.r=LinearToSRGB(r.r),r.g=LinearToSRGB(r.g),r.b=LinearToSRGB(r.b))),r},workingToColorSpace:function(r,a){return this.convert(r,this.workingColorSpace,a)},colorSpaceToWorking:function(r,a){return this.convert(r,a,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===NoColorSpace?LinearTransfer:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,a=this.workingColorSpace){return r.fromArray(this.spaces[a].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,a,o){return r.copy(this.spaces[a].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,a){return warnOnce("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,a)},toWorkingColorSpace:function(r,a){return warnOnce("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[LinearSRGBColorSpace]:{primaries:e,whitePoint:i,transfer:LinearTransfer,toXYZ:LINEAR_REC709_TO_XYZ,fromXYZ:XYZ_TO_LINEAR_REC709,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:SRGBColorSpace},outputColorSpaceConfig:{drawingBufferColorSpace:SRGBColorSpace}},[SRGBColorSpace]:{primaries:e,whitePoint:i,transfer:SRGBTransfer,toXYZ:LINEAR_REC709_TO_XYZ,fromXYZ:XYZ_TO_LINEAR_REC709,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:SRGBColorSpace}}}),n}const ColorManagement=createColorManagement();function SRGBToLinear(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function LinearToSRGB(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let _canvas$1;class ImageUtils{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{_canvas$1===void 0&&(_canvas$1=createElementNS("canvas")),_canvas$1.width=e.width,_canvas$1.height=e.height;const r=_canvas$1.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=_canvas$1}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=createElementNS("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let o=0;o<a.length;o++)a[o]=SRGBToLinear(a[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(SRGBToLinear(t[i]/255)*255):t[i]=SRGBToLinear(t[i]);return{data:t,width:e.width,height:e.height}}else return warn("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _sourceId=0;class Source{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_sourceId++}),this.uuid=generateUUID(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let o=0,s=r.length;o<s;o++)r[o].isDataTexture?a.push(serializeImage(r[o].image)):a.push(serializeImage(r[o]))}else a=serializeImage(r);i.url=a}return t||(e.images[this.uuid]=i),i}}function serializeImage(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ImageUtils.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(warn("Texture: Unable to serialize Texture."),{})}let _textureId=0;const _tempVec3=new Vector3;class Texture extends EventDispatcher{constructor(e=Texture.DEFAULT_IMAGE,t=Texture.DEFAULT_MAPPING,i=ClampToEdgeWrapping,r=ClampToEdgeWrapping,a=LinearFilter,o=LinearMipmapLinearFilter,s=RGBAFormat,l=UnsignedByteType,c=Texture.DEFAULT_ANISOTROPY,d=NoColorSpace){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_textureId++}),this.uuid=generateUUID(),this.name="",this.source=new Source(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=s,this.internalFormat=null,this.type=l,this.offset=new Vector2(0,0),this.repeat=new Vector2(1,1),this.center=new Vector2(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Matrix3,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_tempVec3).x}get height(){return this.source.getSize(_tempVec3).y}get depth(){return this.source.getSize(_tempVec3).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){warn(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){warn(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==UVMapping)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case RepeatWrapping:e.x=e.x-Math.floor(e.x);break;case ClampToEdgeWrapping:e.x=e.x<0?0:1;break;case MirroredRepeatWrapping:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case RepeatWrapping:e.y=e.y-Math.floor(e.y);break;case ClampToEdgeWrapping:e.y=e.y<0?0:1;break;case MirroredRepeatWrapping:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Texture.DEFAULT_IMAGE=null;Texture.DEFAULT_MAPPING=UVMapping;Texture.DEFAULT_ANISOTROPY=1;class Vector4{constructor(e=0,t=0,i=0,r=1){Vector4.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,a=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*a,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*a,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*a,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,a;const l=e.elements,c=l[0],d=l[4],f=l[8],u=l[1],h=l[5],_=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(d-u)<.01&&Math.abs(f-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(d+u)<.1&&Math.abs(f+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(h+1)/2,w=(p+1)/2,A=(d+u)/4,R=(f+v)/4,x=(_+m)/4;return M>y&&M>w?M<.01?(i=0,r=.707106781,a=.707106781):(i=Math.sqrt(M),r=A/i,a=R/i):y>w?y<.01?(i=.707106781,r=0,a=.707106781):(r=Math.sqrt(y),i=A/r,a=x/r):w<.01?(i=.707106781,r=.707106781,a=0):(a=Math.sqrt(w),i=R/a,r=x/a),this.set(i,r,a,t),this}let S=Math.sqrt((m-_)*(m-_)+(f-v)*(f-v)+(u-d)*(u-d));return Math.abs(S)<.001&&(S=1),this.x=(m-_)/S,this.y=(f-v)/S,this.z=(u-d)/S,this.w=Math.acos((c+h+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=clamp(this.x,e.x,t.x),this.y=clamp(this.y,e.y,t.y),this.z=clamp(this.z,e.z,t.z),this.w=clamp(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=clamp(this.x,e,t),this.y=clamp(this.y,e,t),this.z=clamp(this.z,e,t),this.w=clamp(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(clamp(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class RenderTarget extends EventDispatcher{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:LinearFilter,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Vector4(0,0,e,t),this.scissorTest=!1,this.viewport=new Vector4(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},a=new Texture(r),o=i.count;for(let s=0;s<o;s++)this.textures[s]=a.clone(),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:LinearFilter,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Source(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class WebGLRenderTarget extends RenderTarget{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class DataArrayTexture extends Texture{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=NearestFilter,this.minFilter=NearestFilter,this.wrapR=ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Data3DTexture extends Texture{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=NearestFilter,this.minFilter=NearestFilter,this.wrapR=ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Matrix4{constructor(e,t,i,r,a,o,s,l,c,d,f,u,h,_,v,m){Matrix4.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,a,o,s,l,c,d,f,u,h,_,v,m)}set(e,t,i,r,a,o,s,l,c,d,f,u,h,_,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=a,p[5]=o,p[9]=s,p[13]=l,p[2]=c,p[6]=d,p[10]=f,p[14]=u,p[3]=h,p[7]=_,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Matrix4().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/_v1$7.setFromMatrixColumn(e,0).length(),a=1/_v1$7.setFromMatrixColumn(e,1).length(),o=1/_v1$7.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,a=e.z,o=Math.cos(i),s=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const u=o*d,h=o*f,_=s*d,v=s*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=h+_*c,t[5]=u-v*c,t[9]=-s*l,t[2]=v-u*c,t[6]=_+h*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*d,h=l*f,_=c*d,v=c*f;t[0]=u+v*s,t[4]=_*s-h,t[8]=o*c,t[1]=o*f,t[5]=o*d,t[9]=-s,t[2]=h*s-_,t[6]=v+u*s,t[10]=o*l}else if(e.order==="ZXY"){const u=l*d,h=l*f,_=c*d,v=c*f;t[0]=u-v*s,t[4]=-o*f,t[8]=_+h*s,t[1]=h+_*s,t[5]=o*d,t[9]=v-u*s,t[2]=-o*c,t[6]=s,t[10]=o*l}else if(e.order==="ZYX"){const u=o*d,h=o*f,_=s*d,v=s*f;t[0]=l*d,t[4]=_*c-h,t[8]=u*c+v,t[1]=l*f,t[5]=v*c+u,t[9]=h*c-_,t[2]=-c,t[6]=s*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,h=o*c,_=s*l,v=s*c;t[0]=l*d,t[4]=v-u*f,t[8]=_*f+h,t[1]=f,t[5]=o*d,t[9]=-s*d,t[2]=-c*d,t[6]=h*f+_,t[10]=u-v*f}else if(e.order==="XZY"){const u=o*l,h=o*c,_=s*l,v=s*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=u*f+v,t[5]=o*d,t[9]=h*f-_,t[2]=_*f-h,t[6]=s*d,t[10]=v*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_zero,e,_one)}lookAt(e,t,i){const r=this.elements;return _z.subVectors(e,t),_z.lengthSq()===0&&(_z.z=1),_z.normalize(),_x.crossVectors(i,_z),_x.lengthSq()===0&&(Math.abs(i.z)===1?_z.x+=1e-4:_z.z+=1e-4,_z.normalize(),_x.crossVectors(i,_z)),_x.normalize(),_y.crossVectors(_z,_x),r[0]=_x.x,r[4]=_y.x,r[8]=_z.x,r[1]=_x.y,r[5]=_y.y,r[9]=_z.y,r[2]=_x.z,r[6]=_y.z,r[10]=_z.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,a=this.elements,o=i[0],s=i[4],l=i[8],c=i[12],d=i[1],f=i[5],u=i[9],h=i[13],_=i[2],v=i[6],m=i[10],p=i[14],S=i[3],M=i[7],y=i[11],w=i[15],A=r[0],R=r[4],x=r[8],T=r[12],z=r[1],P=r[5],B=r[9],F=r[13],V=r[2],C=r[6],I=r[10],N=r[14],K=r[3],q=r[7],J=r[11],ce=r[15];return a[0]=o*A+s*z+l*V+c*K,a[4]=o*R+s*P+l*C+c*q,a[8]=o*x+s*B+l*I+c*J,a[12]=o*T+s*F+l*N+c*ce,a[1]=d*A+f*z+u*V+h*K,a[5]=d*R+f*P+u*C+h*q,a[9]=d*x+f*B+u*I+h*J,a[13]=d*T+f*F+u*N+h*ce,a[2]=_*A+v*z+m*V+p*K,a[6]=_*R+v*P+m*C+p*q,a[10]=_*x+v*B+m*I+p*J,a[14]=_*T+v*F+m*N+p*ce,a[3]=S*A+M*z+y*V+w*K,a[7]=S*R+M*P+y*C+w*q,a[11]=S*x+M*B+y*I+w*J,a[15]=S*T+M*F+y*N+w*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],a=e[12],o=e[1],s=e[5],l=e[9],c=e[13],d=e[2],f=e[6],u=e[10],h=e[14],_=e[3],v=e[7],m=e[11],p=e[15],S=l*h-c*u,M=s*h-c*f,y=s*u-l*f,w=o*h-c*d,A=o*u-l*d,R=o*f-s*d;return t*(v*S-m*M+p*y)-i*(_*S-m*w+p*A)+r*(_*M-v*w+p*R)-a*(_*y-v*A+m*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8],f=e[9],u=e[10],h=e[11],_=e[12],v=e[13],m=e[14],p=e[15],S=t*s-i*o,M=t*l-r*o,y=t*c-a*o,w=i*l-r*s,A=i*c-a*s,R=r*c-a*l,x=d*v-f*_,T=d*m-u*_,z=d*p-h*_,P=f*m-u*v,B=f*p-h*v,F=u*p-h*m,V=S*F-M*B+y*P+w*z-A*T+R*x;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/V;return e[0]=(s*F-l*B+c*P)*C,e[1]=(r*B-i*F-a*P)*C,e[2]=(v*R-m*A+p*w)*C,e[3]=(u*A-f*R-h*w)*C,e[4]=(l*z-o*F-c*T)*C,e[5]=(t*F-r*z+a*T)*C,e[6]=(m*y-_*R-p*M)*C,e[7]=(d*R-u*y+h*M)*C,e[8]=(o*B-s*z+c*x)*C,e[9]=(i*z-t*B-a*x)*C,e[10]=(_*A-v*y+p*S)*C,e[11]=(f*y-d*A-h*S)*C,e[12]=(s*T-o*P-l*x)*C,e[13]=(t*P-i*T+r*x)*C,e[14]=(v*M-_*w-m*S)*C,e[15]=(d*w-f*M+u*S)*C,this}scale(e){const t=this.elements,i=e.x,r=e.y,a=e.z;return t[0]*=i,t[4]*=r,t[8]*=a,t[1]*=i,t[5]*=r,t[9]*=a,t[2]*=i,t[6]*=r,t[10]*=a,t[3]*=i,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),a=1-i,o=e.x,s=e.y,l=e.z,c=a*o,d=a*s;return this.set(c*o+i,c*s-r*l,c*l+r*s,0,c*s+r*l,d*s+i,d*l-r*o,0,c*l-r*s,d*l+r*o,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,a,o){return this.set(1,i,a,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,a=t._x,o=t._y,s=t._z,l=t._w,c=a+a,d=o+o,f=s+s,u=a*c,h=a*d,_=a*f,v=o*d,m=o*f,p=s*f,S=l*c,M=l*d,y=l*f,w=i.x,A=i.y,R=i.z;return r[0]=(1-(v+p))*w,r[1]=(h+y)*w,r[2]=(_-M)*w,r[3]=0,r[4]=(h-y)*A,r[5]=(1-(u+p))*A,r[6]=(m+S)*A,r[7]=0,r[8]=(_+M)*R,r[9]=(m-S)*R,r[10]=(1-(u+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let o=_v1$7.set(r[0],r[1],r[2]).length();const s=_v1$7.set(r[4],r[5],r[6]).length(),l=_v1$7.set(r[8],r[9],r[10]).length();a<0&&(o=-o),_m1$2.copy(this);const c=1/o,d=1/s,f=1/l;return _m1$2.elements[0]*=c,_m1$2.elements[1]*=c,_m1$2.elements[2]*=c,_m1$2.elements[4]*=d,_m1$2.elements[5]*=d,_m1$2.elements[6]*=d,_m1$2.elements[8]*=f,_m1$2.elements[9]*=f,_m1$2.elements[10]*=f,t.setFromRotationMatrix(_m1$2),i.x=o,i.y=s,i.z=l,this}makePerspective(e,t,i,r,a,o,s=WebGLCoordinateSystem,l=!1){const c=this.elements,d=2*a/(t-e),f=2*a/(i-r),u=(t+e)/(t-e),h=(i+r)/(i-r);let _,v;if(l)_=a/(o-a),v=o*a/(o-a);else if(s===WebGLCoordinateSystem)_=-(o+a)/(o-a),v=-2*o*a/(o-a);else if(s===WebGPUCoordinateSystem)_=-o/(o-a),v=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+s);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,a,o,s=WebGLCoordinateSystem,l=!1){const c=this.elements,d=2/(t-e),f=2/(i-r),u=-(t+e)/(t-e),h=-(i+r)/(i-r);let _,v;if(l)_=1/(o-a),v=o/(o-a);else if(s===WebGLCoordinateSystem)_=-2/(o-a),v=-(o+a)/(o-a);else if(s===WebGPUCoordinateSystem)_=-1/(o-a),v=-a/(o-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+s);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const _v1$7=new Vector3,_m1$2=new Matrix4,_zero=new Vector3(0,0,0),_one=new Vector3(1,1,1),_x=new Vector3,_y=new Vector3,_z=new Vector3,_matrix$2=new Matrix4,_quaternion$4=new Quaternion;class Euler{constructor(e=0,t=0,i=0,r=Euler.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,a=r[0],o=r[4],s=r[8],l=r[1],c=r[5],d=r[9],f=r[2],u=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin(clamp(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-clamp(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(s,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(clamp(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,h),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-clamp(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,h),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(clamp(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(s,h));break;case"XZY":this._z=Math.asin(-clamp(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(s,a)):(this._x=Math.atan2(-d,h),this._y=0);break;default:warn("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return _matrix$2.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_matrix$2,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _quaternion$4.setFromEuler(this),this.setFromQuaternion(_quaternion$4,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Euler.DEFAULT_ORDER="XYZ";class Layers{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _object3DId=0;const _v1$6=new Vector3,_q1=new Quaternion,_m1$1$1=new Matrix4,_target=new Vector3,_position$4=new Vector3,_scale$3=new Vector3,_quaternion$3=new Quaternion,_xAxis=new Vector3(1,0,0),_yAxis=new Vector3(0,1,0),_zAxis=new Vector3(0,0,1),_addedEvent={type:"added"},_removedEvent={type:"removed"},_childaddedEvent={type:"childadded",child:null},_childremovedEvent={type:"childremoved",child:null};class Object3D extends EventDispatcher{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_object3DId++}),this.uuid=generateUUID(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Object3D.DEFAULT_UP.clone();const e=new Vector3,t=new Euler,i=new Quaternion,r=new Vector3(1,1,1);function a(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Matrix4},normalMatrix:{value:new Matrix3}}),this.matrix=new Matrix4,this.matrixWorld=new Matrix4,this.matrixAutoUpdate=Object3D.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Layers,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _q1.setFromAxisAngle(e,t),this.quaternion.multiply(_q1),this}rotateOnWorldAxis(e,t){return _q1.setFromAxisAngle(e,t),this.quaternion.premultiply(_q1),this}rotateX(e){return this.rotateOnAxis(_xAxis,e)}rotateY(e){return this.rotateOnAxis(_yAxis,e)}rotateZ(e){return this.rotateOnAxis(_zAxis,e)}translateOnAxis(e,t){return _v1$6.copy(e).applyQuaternion(this.quaternion),this.position.add(_v1$6.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(_xAxis,e)}translateY(e){return this.translateOnAxis(_yAxis,e)}translateZ(e){return this.translateOnAxis(_zAxis,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_m1$1$1.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?_target.copy(e):_target.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),_position$4.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_m1$1$1.lookAt(_position$4,_target,this.up):_m1$1$1.lookAt(_target,_position$4,this.up),this.quaternion.setFromRotationMatrix(_m1$1$1),r&&(_m1$1$1.extractRotation(r.matrixWorld),_q1.setFromRotationMatrix(_m1$1$1),this.quaternion.premultiply(_q1.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(error("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_addedEvent),_childaddedEvent.child=e,this.dispatchEvent(_childaddedEvent),_childaddedEvent.child=null):error("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_removedEvent),_childremovedEvent.child=e,this.dispatchEvent(_childremovedEvent),_childremovedEvent.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_m1$1$1.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_m1$1$1.multiply(e.parent.matrixWorld)),e.applyMatrix4(_m1$1$1),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_addedEvent),_childaddedEvent.child=e,this.dispatchEvent(_childaddedEvent),_childaddedEvent.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_position$4,e,_scale$3),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_position$4,_quaternion$3,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*r,a[13]+=i-a[1]*t-a[5]*i-a[9]*r,a[14]+=r-a[2]*t-a[6]*i-a[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(s=>({...s,boundingBox:s.boundingBox?s.boundingBox.toJSON():void 0,boundingSphere:s.boundingSphere?s.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(s=>({...s})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function a(s,l){return s[l.uuid]===void 0&&(s[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const s=this.geometry.parameters;if(s!==void 0&&s.shapes!==void 0){const l=s.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const f=l[c];a(e.shapes,f)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const s=[];for(let l=0,c=this.material.length;l<c;l++)s.push(a(e.materials,this.material[l]));r.material=s}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let s=0;s<this.children.length;s++)r.children.push(this.children[s].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let s=0;s<this.animations.length;s++){const l=this.animations[s];r.animations.push(a(e.animations,l))}}if(t){const s=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),f=o(e.shapes),u=o(e.skeletons),h=o(e.animations),_=o(e.nodes);s.length>0&&(i.geometries=s),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),h.length>0&&(i.animations=h),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(s){const l=[];for(const c in s){const d=s[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Object3D.DEFAULT_UP=new Vector3(0,1,0);Object3D.DEFAULT_MATRIX_AUTO_UPDATE=!0;Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Group extends Object3D{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _moveEvent={type:"move"};class WebXRController{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Group,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Group,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Vector3,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Vector3),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Group,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Vector3,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Vector3),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,a=null,o=null;const s=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=d.position.distanceTo(f.position),h=.02,_=.005;c.inputState.pinching&&u>h+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=h-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));s!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(s.matrix.fromArray(r.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,r.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(r.linearVelocity)):s.hasLinearVelocity=!1,r.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(r.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(_moveEvent)))}return s!==null&&(s.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Group;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const _colorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_hslA={h:0,s:0,l:0},_hslB={h:0,s:0,l:0};function hue2rgb(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Color{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=SRGBColorSpace){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ColorManagement.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ColorManagement.workingColorSpace){return this.r=e,this.g=t,this.b=i,ColorManagement.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ColorManagement.workingColorSpace){if(e=euclideanModulo(e,1),t=clamp(t,0,1),i=clamp(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,o=2*i-a;this.r=hue2rgb(o,a,e+1/3),this.g=hue2rgb(o,a,e),this.b=hue2rgb(o,a,e-1/3)}return ColorManagement.colorSpaceToWorking(this,r),this}setStyle(e,t=SRGBColorSpace){function i(a){a!==void 0&&parseFloat(a)<1&&warn("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const o=r[1],s=r[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:warn("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(a,16),t);warn("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=SRGBColorSpace){const i=_colorKeywords[e.toLowerCase()];return i!==void 0?this.setHex(i,t):warn("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=SRGBToLinear(e.r),this.g=SRGBToLinear(e.g),this.b=SRGBToLinear(e.b),this}copyLinearToSRGB(e){return this.r=LinearToSRGB(e.r),this.g=LinearToSRGB(e.g),this.b=LinearToSRGB(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=SRGBColorSpace){return ColorManagement.workingToColorSpace(_color$1.copy(this),e),Math.round(clamp(_color$1.r*255,0,255))*65536+Math.round(clamp(_color$1.g*255,0,255))*256+Math.round(clamp(_color$1.b*255,0,255))}getHexString(e=SRGBColorSpace){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ColorManagement.workingColorSpace){ColorManagement.workingToColorSpace(_color$1.copy(this),t);const i=_color$1.r,r=_color$1.g,a=_color$1.b,o=Math.max(i,r,a),s=Math.min(i,r,a);let l,c;const d=(s+o)/2;if(s===o)l=0,c=0;else{const f=o-s;switch(c=d<=.5?f/(o+s):f/(2-o-s),o){case i:l=(r-a)/f+(r<a?6:0);break;case r:l=(a-i)/f+2;break;case a:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=ColorManagement.workingColorSpace){return ColorManagement.workingToColorSpace(_color$1.copy(this),t),e.r=_color$1.r,e.g=_color$1.g,e.b=_color$1.b,e}getStyle(e=SRGBColorSpace){ColorManagement.workingToColorSpace(_color$1.copy(this),e);const t=_color$1.r,i=_color$1.g,r=_color$1.b;return e!==SRGBColorSpace?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(_hslA),this.setHSL(_hslA.h+e,_hslA.s+t,_hslA.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(_hslA),e.getHSL(_hslB);const i=lerp(_hslA.h,_hslB.h,t),r=lerp(_hslA.s,_hslB.s,t),a=lerp(_hslA.l,_hslB.l,t);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*r,this.g=a[1]*t+a[4]*i+a[7]*r,this.b=a[2]*t+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _color$1=new Color;Color.NAMES=_colorKeywords;class Scene extends Object3D{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Euler,this.environmentIntensity=1,this.environmentRotation=new Euler,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const _v0$2$1=new Vector3,_v1$5=new Vector3,_v2$4=new Vector3,_v3$2=new Vector3,_vab=new Vector3,_vac=new Vector3,_vbc=new Vector3,_vap=new Vector3,_vbp=new Vector3,_vcp=new Vector3,_v40=new Vector4,_v41=new Vector4,_v42=new Vector4;class Triangle{constructor(e=new Vector3,t=new Vector3,i=new Vector3){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),_v0$2$1.subVectors(e,t),r.cross(_v0$2$1);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,i,r,a){_v0$2$1.subVectors(r,t),_v1$5.subVectors(i,t),_v2$4.subVectors(e,t);const o=_v0$2$1.dot(_v0$2$1),s=_v0$2$1.dot(_v1$5),l=_v0$2$1.dot(_v2$4),c=_v1$5.dot(_v1$5),d=_v1$5.dot(_v2$4),f=o*c-s*s;if(f===0)return a.set(0,0,0),null;const u=1/f,h=(c*l-s*d)*u,_=(o*d-s*l)*u;return a.set(1-h-_,_,h)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,_v3$2)===null?!1:_v3$2.x>=0&&_v3$2.y>=0&&_v3$2.x+_v3$2.y<=1}static getInterpolation(e,t,i,r,a,o,s,l){return this.getBarycoord(e,t,i,r,_v3$2)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,_v3$2.x),l.addScaledVector(o,_v3$2.y),l.addScaledVector(s,_v3$2.z),l)}static getInterpolatedAttribute(e,t,i,r,a,o){return _v40.setScalar(0),_v41.setScalar(0),_v42.setScalar(0),_v40.fromBufferAttribute(e,t),_v41.fromBufferAttribute(e,i),_v42.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(_v40,a.x),o.addScaledVector(_v41,a.y),o.addScaledVector(_v42,a.z),o}static isFrontFacing(e,t,i,r){return _v0$2$1.subVectors(i,t),_v1$5.subVectors(e,t),_v0$2$1.cross(_v1$5).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _v0$2$1.subVectors(this.c,this.b),_v1$5.subVectors(this.a,this.b),_v0$2$1.cross(_v1$5).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Triangle.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Triangle.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,a){return Triangle.getInterpolation(e,this.a,this.b,this.c,t,i,r,a)}containsPoint(e){return Triangle.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Triangle.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,a=this.c;let o,s;_vab.subVectors(r,i),_vac.subVectors(a,i),_vap.subVectors(e,i);const l=_vab.dot(_vap),c=_vac.dot(_vap);if(l<=0&&c<=0)return t.copy(i);_vbp.subVectors(e,r);const d=_vab.dot(_vbp),f=_vac.dot(_vbp);if(d>=0&&f<=d)return t.copy(r);const u=l*f-d*c;if(u<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(i).addScaledVector(_vab,o);_vcp.subVectors(e,a);const h=_vab.dot(_vcp),_=_vac.dot(_vcp);if(_>=0&&h<=_)return t.copy(a);const v=h*c-l*_;if(v<=0&&c>=0&&_<=0)return s=c/(c-_),t.copy(i).addScaledVector(_vac,s);const m=d*_-h*f;if(m<=0&&f-d>=0&&h-_>=0)return _vbc.subVectors(a,r),s=(f-d)/(f-d+(h-_)),t.copy(r).addScaledVector(_vbc,s);const p=1/(m+v+u);return o=v*p,s=u*p,t.copy(i).addScaledVector(_vab,o).addScaledVector(_vac,s)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Box3{constructor(e=new Vector3(1/0,1/0,1/0),t=new Vector3(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(_vector$b.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(_vector$b.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=_vector$b.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let o=0,s=a.count;o<s;o++)e.isMesh===!0?e.getVertexPosition(o,_vector$b):_vector$b.fromBufferAttribute(a,o),_vector$b.applyMatrix4(e.matrixWorld),this.expandByPoint(_vector$b);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_box$4.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_box$4.copy(i.boundingBox)),_box$4.applyMatrix4(e.matrixWorld),this.union(_box$4)}const r=e.children;for(let a=0,o=r.length;a<o;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,_vector$b),_vector$b.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_center),_extents.subVectors(this.max,_center),_v0$1$1.subVectors(e.a,_center),_v1$4.subVectors(e.b,_center),_v2$3.subVectors(e.c,_center),_f0.subVectors(_v1$4,_v0$1$1),_f1.subVectors(_v2$3,_v1$4),_f2.subVectors(_v0$1$1,_v2$3);let t=[0,-_f0.z,_f0.y,0,-_f1.z,_f1.y,0,-_f2.z,_f2.y,_f0.z,0,-_f0.x,_f1.z,0,-_f1.x,_f2.z,0,-_f2.x,-_f0.y,_f0.x,0,-_f1.y,_f1.x,0,-_f2.y,_f2.x,0];return!satForAxes(t,_v0$1$1,_v1$4,_v2$3,_extents)||(t=[1,0,0,0,1,0,0,0,1],!satForAxes(t,_v0$1$1,_v1$4,_v2$3,_extents))?!1:(_triangleNormal.crossVectors(_f0,_f1),t=[_triangleNormal.x,_triangleNormal.y,_triangleNormal.z],satForAxes(t,_v0$1$1,_v1$4,_v2$3,_extents))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,_vector$b).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(_vector$b).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_points[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_points[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_points[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_points[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_points[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_points[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_points[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_points[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_points),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const _points=[new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3],_vector$b=new Vector3,_box$4=new Box3,_v0$1$1=new Vector3,_v1$4=new Vector3,_v2$3=new Vector3,_f0=new Vector3,_f1=new Vector3,_f2=new Vector3,_center=new Vector3,_extents=new Vector3,_triangleNormal=new Vector3,_testAxis=new Vector3;function satForAxes(n,e,t,i,r){for(let a=0,o=n.length-3;a<=o;a+=3){_testAxis.fromArray(n,a);const s=r.x*Math.abs(_testAxis.x)+r.y*Math.abs(_testAxis.y)+r.z*Math.abs(_testAxis.z),l=e.dot(_testAxis),c=t.dot(_testAxis),d=i.dot(_testAxis);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>s)return!1}return!0}const _vector$a=new Vector3,_vector2$1=new Vector2;let _id$2=0;class BufferAttribute{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:_id$2++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=StaticDrawUsage,this.updateRanges=[],this.gpuType=FloatType,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)_vector2$1.fromBufferAttribute(this,t),_vector2$1.applyMatrix3(e),this.setXY(t,_vector2$1.x,_vector2$1.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)_vector$a.fromBufferAttribute(this,t),_vector$a.applyMatrix3(e),this.setXYZ(t,_vector$a.x,_vector$a.y,_vector$a.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)_vector$a.fromBufferAttribute(this,t),_vector$a.applyMatrix4(e),this.setXYZ(t,_vector$a.x,_vector$a.y,_vector$a.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)_vector$a.fromBufferAttribute(this,t),_vector$a.applyNormalMatrix(e),this.setXYZ(t,_vector$a.x,_vector$a.y,_vector$a.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)_vector$a.fromBufferAttribute(this,t),_vector$a.transformDirection(e),this.setXYZ(t,_vector$a.x,_vector$a.y,_vector$a.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=denormalize(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=normalize(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=denormalize(t,this.array)),t}setX(e,t){return this.normalized&&(t=normalize(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=denormalize(t,this.array)),t}setY(e,t){return this.normalized&&(t=normalize(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=denormalize(t,this.array)),t}setZ(e,t){return this.normalized&&(t=normalize(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=denormalize(t,this.array)),t}setW(e,t){return this.normalized&&(t=normalize(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=normalize(t,this.array),i=normalize(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=normalize(t,this.array),i=normalize(i,this.array),r=normalize(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=normalize(t,this.array),i=normalize(i,this.array),r=normalize(r,this.array),a=normalize(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==StaticDrawUsage&&(e.usage=this.usage),e}}class Uint16BufferAttribute extends BufferAttribute{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Uint32BufferAttribute extends BufferAttribute{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Float32BufferAttribute extends BufferAttribute{constructor(e,t,i){super(new Float32Array(e),t,i)}}const _box$3=new Box3,_v1$3=new Vector3,_v2$2=new Vector3;class Sphere{constructor(e=new Vector3,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):_box$3.setFromPoints(e).getCenter(i);let r=0;for(let a=0,o=e.length;a<o;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_v1$3.subVectors(e,this.center);const t=_v1$3.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(_v1$3,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_v2$2.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_v1$3.copy(e.center).add(_v2$2)),this.expandByPoint(_v1$3.copy(e.center).sub(_v2$2))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let _id$1=0;const _m1$3=new Matrix4,_obj=new Object3D,_offset=new Vector3,_box$2=new Box3,_boxMorphTargets=new Box3,_vector$9=new Vector3;class BufferGeometry extends EventDispatcher{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_id$1++}),this.uuid=generateUUID(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(arrayNeedsUint32(e)?Uint32BufferAttribute:Uint16BufferAttribute)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Matrix3().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return _m1$3.makeRotationFromQuaternion(e),this.applyMatrix4(_m1$3),this}rotateX(e){return _m1$3.makeRotationX(e),this.applyMatrix4(_m1$3),this}rotateY(e){return _m1$3.makeRotationY(e),this.applyMatrix4(_m1$3),this}rotateZ(e){return _m1$3.makeRotationZ(e),this.applyMatrix4(_m1$3),this}translate(e,t,i){return _m1$3.makeTranslation(e,t,i),this.applyMatrix4(_m1$3),this}scale(e,t,i){return _m1$3.makeScale(e,t,i),this.applyMatrix4(_m1$3),this}lookAt(e){return _obj.lookAt(e),_obj.updateMatrix(),this.applyMatrix4(_obj.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_offset).negate(),this.translate(_offset.x,_offset.y,_offset.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Float32BufferAttribute(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const a=e[r];t.setXYZ(r,a.x,a.y,a.z||0)}e.length>t.count&&warn("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Box3);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){error("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Vector3(-1/0,-1/0,-1/0),new Vector3(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const a=t[i];_box$2.setFromBufferAttribute(a),this.morphTargetsRelative?(_vector$9.addVectors(this.boundingBox.min,_box$2.min),this.boundingBox.expandByPoint(_vector$9),_vector$9.addVectors(this.boundingBox.max,_box$2.max),this.boundingBox.expandByPoint(_vector$9)):(this.boundingBox.expandByPoint(_box$2.min),this.boundingBox.expandByPoint(_box$2.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&error('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sphere);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){error("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Vector3,1/0);return}if(e){const i=this.boundingSphere.center;if(_box$2.setFromBufferAttribute(e),t)for(let a=0,o=t.length;a<o;a++){const s=t[a];_boxMorphTargets.setFromBufferAttribute(s),this.morphTargetsRelative?(_vector$9.addVectors(_box$2.min,_boxMorphTargets.min),_box$2.expandByPoint(_vector$9),_vector$9.addVectors(_box$2.max,_boxMorphTargets.max),_box$2.expandByPoint(_vector$9)):(_box$2.expandByPoint(_boxMorphTargets.min),_box$2.expandByPoint(_boxMorphTargets.max))}_box$2.getCenter(i);let r=0;for(let a=0,o=e.count;a<o;a++)_vector$9.fromBufferAttribute(e,a),r=Math.max(r,i.distanceToSquared(_vector$9));if(t)for(let a=0,o=t.length;a<o;a++){const s=t[a],l=this.morphTargetsRelative;for(let c=0,d=s.count;c<d;c++)_vector$9.fromBufferAttribute(s,c),l&&(_offset.fromBufferAttribute(e,c),_vector$9.add(_offset)),r=Math.max(r,i.distanceToSquared(_vector$9))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&error('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){error("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new BufferAttribute(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),s=[],l=[];for(let x=0;x<i.count;x++)s[x]=new Vector3,l[x]=new Vector3;const c=new Vector3,d=new Vector3,f=new Vector3,u=new Vector2,h=new Vector2,_=new Vector2,v=new Vector3,m=new Vector3;function p(x,T,z){c.fromBufferAttribute(i,x),d.fromBufferAttribute(i,T),f.fromBufferAttribute(i,z),u.fromBufferAttribute(a,x),h.fromBufferAttribute(a,T),_.fromBufferAttribute(a,z),d.sub(c),f.sub(c),h.sub(u),_.sub(u);const P=1/(h.x*_.y-_.x*h.y);isFinite(P)&&(v.copy(d).multiplyScalar(_.y).addScaledVector(f,-h.y).multiplyScalar(P),m.copy(f).multiplyScalar(h.x).addScaledVector(d,-_.x).multiplyScalar(P),s[x].add(v),s[T].add(v),s[z].add(v),l[x].add(m),l[T].add(m),l[z].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,T=S.length;x<T;++x){const z=S[x],P=z.start,B=z.count;for(let F=P,V=P+B;F<V;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const M=new Vector3,y=new Vector3,w=new Vector3,A=new Vector3;function R(x){w.fromBufferAttribute(r,x),A.copy(w);const T=s[x];M.copy(T),M.sub(w.multiplyScalar(w.dot(T))).normalize(),y.crossVectors(A,T);const P=y.dot(l[x])<0?-1:1;o.setXYZW(x,M.x,M.y,M.z,P)}for(let x=0,T=S.length;x<T;++x){const z=S[x],P=z.start,B=z.count;for(let F=P,V=P+B;F<V;F+=3)R(e.getX(F+0)),R(e.getX(F+1)),R(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new BufferAttribute(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,h=i.count;u<h;u++)i.setXYZ(u,0,0,0);const r=new Vector3,a=new Vector3,o=new Vector3,s=new Vector3,l=new Vector3,c=new Vector3,d=new Vector3,f=new Vector3;if(e)for(let u=0,h=e.count;u<h;u+=3){const _=e.getX(u+0),v=e.getX(u+1),m=e.getX(u+2);r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),d.subVectors(o,a),f.subVectors(r,a),d.cross(f),s.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),s.add(d),l.add(d),c.add(d),i.setXYZ(_,s.x,s.y,s.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,h=t.count;u<h;u+=3)r.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),d.subVectors(o,a),f.subVectors(r,a),d.cross(f),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)_vector$9.fromBufferAttribute(e,t),_vector$9.normalize(),e.setXYZ(t,_vector$9.x,_vector$9.y,_vector$9.z)}toNonIndexed(){function e(s,l){const c=s.array,d=s.itemSize,f=s.normalized,u=new c.constructor(l.length*d);let h=0,_=0;for(let v=0,m=l.length;v<m;v++){s.isInterleavedBufferAttribute?h=l[v]*s.data.stride+s.offset:h=l[v]*d;for(let p=0;p<d;p++)u[_++]=c[h++]}return new BufferAttribute(u,d,f)}if(this.index===null)return warn("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new BufferGeometry,i=this.index.array,r=this.attributes;for(const s in r){const l=r[s],c=e(l,i);t.setAttribute(s,c)}const a=this.morphAttributes;for(const s in a){const l=[],c=a[s];for(let d=0,f=c.length;d<f;d++){const u=c[d],h=e(u,i);l.push(h)}t.morphAttributes[s]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let s=0,l=o.length;s<l;s++){const c=o[s];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let f=0,u=c.length;f<u;f++){const h=c[f];d.push(h.toJSON(e.data))}d.length>0&&(r[l]=d,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const s=this.boundingSphere;return s!==null&&(e.data.boundingSphere=s.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const a=e.morphAttributes;for(const c in a){const d=[],f=a[c];for(let u=0,h=f.length;u<h;u++)d.push(f[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const s=e.boundingBox;s!==null&&(this.boundingBox=s.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let _materialId=0;class Material extends EventDispatcher{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_materialId++}),this.uuid=generateUUID(),this.name="",this.type="Material",this.blending=NormalBlending,this.side=FrontSide,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=SrcAlphaFactor,this.blendDst=OneMinusSrcAlphaFactor,this.blendEquation=AddEquation,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Color(0,0,0),this.blendAlpha=0,this.depthFunc=LessEqualDepth,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=AlwaysStencilFunc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=KeepStencilOp,this.stencilZFail=KeepStencilOp,this.stencilZPass=KeepStencilOp,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){warn(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){warn(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==NormalBlending&&(i.blending=this.blending),this.side!==FrontSide&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==SrcAlphaFactor&&(i.blendSrc=this.blendSrc),this.blendDst!==OneMinusSrcAlphaFactor&&(i.blendDst=this.blendDst),this.blendEquation!==AddEquation&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==LessEqualDepth&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==AlwaysStencilFunc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==KeepStencilOp&&(i.stencilFail=this.stencilFail),this.stencilZFail!==KeepStencilOp&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==KeepStencilOp&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){const o=[];for(const s in a){const l=a[s];delete l.metadata,o.push(l)}return o}if(t){const a=r(e.textures),o=r(e.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const _vector$7=new Vector3,_segCenter=new Vector3,_segDir=new Vector3,_diff=new Vector3,_edge1=new Vector3,_edge2=new Vector3,_normal$1=new Vector3;class Ray{constructor(e=new Vector3,t=new Vector3(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_vector$7)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_vector$7.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_vector$7.copy(this.origin).addScaledVector(this.direction,t),_vector$7.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){_segCenter.copy(e).add(t).multiplyScalar(.5),_segDir.copy(t).sub(e).normalize(),_diff.copy(this.origin).sub(_segCenter);const a=e.distanceTo(t)*.5,o=-this.direction.dot(_segDir),s=_diff.dot(this.direction),l=-_diff.dot(_segDir),c=_diff.lengthSq(),d=Math.abs(1-o*o);let f,u,h,_;if(d>0)if(f=o*l-s,u=o*s-l,_=a*d,f>=0)if(u>=-_)if(u<=_){const v=1/d;f*=v,u*=v,h=f*(f+o*u+2*s)+u*(o*f+u+2*l)+c}else u=a,f=Math.max(0,-(o*u+s)),h=-f*f+u*(u+2*l)+c;else u=-a,f=Math.max(0,-(o*u+s)),h=-f*f+u*(u+2*l)+c;else u<=-_?(f=Math.max(0,-(-o*a+s)),u=f>0?-a:Math.min(Math.max(-a,-l),a),h=-f*f+u*(u+2*l)+c):u<=_?(f=0,u=Math.min(Math.max(-a,-l),a),h=u*(u+2*l)+c):(f=Math.max(0,-(o*a+s)),u=f>0?a:Math.min(Math.max(-a,-l),a),h=-f*f+u*(u+2*l)+c);else u=o>0?-a:a,f=Math.max(0,-(o*u+s)),h=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(_segCenter).addScaledVector(_segDir,u),h}intersectSphere(e,t){_vector$7.subVectors(e.center,this.origin);const i=_vector$7.dot(this.direction),r=_vector$7.dot(_vector$7)-i*i,a=e.radius*e.radius;if(r>a)return null;const o=Math.sqrt(a-r),s=i-o,l=i+o;return l<0?null:s<0?this.at(l,t):this.at(s,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,a,o,s,l;const c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,r=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,r=(e.min.x-u.x)*c),d>=0?(a=(e.min.y-u.y)*d,o=(e.max.y-u.y)*d):(a=(e.max.y-u.y)*d,o=(e.min.y-u.y)*d),i>o||a>r||((a>i||isNaN(i))&&(i=a),(o<r||isNaN(r))&&(r=o),f>=0?(s=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(s=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),i>l||s>r)||((s>i||i!==i)&&(i=s),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,_vector$7)!==null}intersectTriangle(e,t,i,r,a){_edge1.subVectors(t,e),_edge2.subVectors(i,e),_normal$1.crossVectors(_edge1,_edge2);let o=this.direction.dot(_normal$1),s;if(o>0){if(r)return null;s=1}else if(o<0)s=-1,o=-o;else return null;_diff.subVectors(this.origin,e);const l=s*this.direction.dot(_edge2.crossVectors(_diff,_edge2));if(l<0)return null;const c=s*this.direction.dot(_edge1.cross(_diff));if(c<0||l+c>o)return null;const d=-s*_diff.dot(_normal$1);return d<0?null:this.at(d/o,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class MeshBasicMaterial extends Material{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Color(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Euler,this.combine=MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _inverseMatrix$3=new Matrix4,_ray$3=new Ray,_sphere$6=new Sphere,_sphereHitAt=new Vector3,_vA=new Vector3,_vB=new Vector3,_vC=new Vector3,_tempA=new Vector3,_morphA=new Vector3,_intersectionPoint=new Vector3,_intersectionPointWorld=new Vector3;class Mesh extends Object3D{constructor(e=new BufferGeometry,t=new MeshBasicMaterial){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=r.length;a<o;a++){const s=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=a}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const s=this.morphTargetInfluences;if(a&&s){_morphA.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const d=s[l],f=a[l];d!==0&&(_tempA.fromBufferAttribute(f,e),o?_morphA.addScaledVector(_tempA,d):_morphA.addScaledVector(_tempA.sub(t),d))}t.add(_morphA)}return t}raycast(e,t){const i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere$6.copy(i.boundingSphere),_sphere$6.applyMatrix4(a),_ray$3.copy(e.ray).recast(e.near),!(_sphere$6.containsPoint(_ray$3.origin)===!1&&(_ray$3.intersectSphere(_sphere$6,_sphereHitAt)===null||_ray$3.origin.distanceToSquared(_sphereHitAt)>(e.far-e.near)**2))&&(_inverseMatrix$3.copy(a).invert(),_ray$3.copy(e.ray).applyMatrix4(_inverseMatrix$3),!(i.boundingBox!==null&&_ray$3.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,_ray$3)))}_computeIntersections(e,t,i){let r;const a=this.geometry,o=this.material,s=a.index,l=a.attributes.position,c=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,u=a.groups,h=a.drawRange;if(s!==null)if(Array.isArray(o))for(let _=0,v=u.length;_<v;_++){const m=u[_],p=o[m.materialIndex],S=Math.max(m.start,h.start),M=Math.min(s.count,Math.min(m.start+m.count,h.start+h.count));for(let y=S,w=M;y<w;y+=3){const A=s.getX(y),R=s.getX(y+1),x=s.getX(y+2);r=checkGeometryIntersection(this,p,e,i,c,d,f,A,R,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,h.start),v=Math.min(s.count,h.start+h.count);for(let m=_,p=v;m<p;m+=3){const S=s.getX(m),M=s.getX(m+1),y=s.getX(m+2);r=checkGeometryIntersection(this,o,e,i,c,d,f,S,M,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,v=u.length;_<v;_++){const m=u[_],p=o[m.materialIndex],S=Math.max(m.start,h.start),M=Math.min(l.count,Math.min(m.start+m.count,h.start+h.count));for(let y=S,w=M;y<w;y+=3){const A=y,R=y+1,x=y+2;r=checkGeometryIntersection(this,p,e,i,c,d,f,A,R,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,h.start),v=Math.min(l.count,h.start+h.count);for(let m=_,p=v;m<p;m+=3){const S=m,M=m+1,y=m+2;r=checkGeometryIntersection(this,o,e,i,c,d,f,S,M,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function checkIntersection$1(n,e,t,i,r,a,o,s){let l;if(e.side===BackSide?l=i.intersectTriangle(o,a,r,!0,s):l=i.intersectTriangle(r,a,o,e.side===FrontSide,s),l===null)return null;_intersectionPointWorld.copy(s),_intersectionPointWorld.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(_intersectionPointWorld);return c<t.near||c>t.far?null:{distance:c,point:_intersectionPointWorld.clone(),object:n}}function checkGeometryIntersection(n,e,t,i,r,a,o,s,l,c){n.getVertexPosition(s,_vA),n.getVertexPosition(l,_vB),n.getVertexPosition(c,_vC);const d=checkIntersection$1(n,e,t,i,_vA,_vB,_vC,_intersectionPoint);if(d){const f=new Vector3;Triangle.getBarycoord(_intersectionPoint,_vA,_vB,_vC,f),r&&(d.uv=Triangle.getInterpolatedAttribute(r,s,l,c,f,new Vector2)),a&&(d.uv1=Triangle.getInterpolatedAttribute(a,s,l,c,f,new Vector2)),o&&(d.normal=Triangle.getInterpolatedAttribute(o,s,l,c,f,new Vector3),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a:s,b:l,c,normal:new Vector3,materialIndex:0};Triangle.getNormal(_vA,_vB,_vC,u.normal),d.face=u,d.barycoord=f}return d}class DataTexture extends Texture{constructor(e=null,t=1,i=1,r,a,o,s,l,c=NearestFilter,d=NearestFilter,f,u){super(null,o,s,l,c,d,r,a,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class InstancedBufferAttribute extends BufferAttribute{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const _vector1=new Vector3,_vector2=new Vector3,_normalMatrix=new Matrix3;class Plane{constructor(e=new Vector3(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=_vector1.subVectors(i,t).cross(_vector2.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(_vector1),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||_normalMatrix.getNormalMatrix(e),r=this.coplanarPoint(_vector1).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _sphere$3=new Sphere,_defaultSpriteCenter=new Vector2(.5,.5),_vector$6=new Vector3;class Frustum{constructor(e=new Plane,t=new Plane,i=new Plane,r=new Plane,a=new Plane,o=new Plane){this.planes=[e,t,i,r,a,o]}set(e,t,i,r,a,o){const s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(i),s[3].copy(r),s[4].copy(a),s[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=WebGLCoordinateSystem,i=!1){const r=this.planes,a=e.elements,o=a[0],s=a[1],l=a[2],c=a[3],d=a[4],f=a[5],u=a[6],h=a[7],_=a[8],v=a[9],m=a[10],p=a[11],S=a[12],M=a[13],y=a[14],w=a[15];if(r[0].setComponents(c-o,h-d,p-_,w-S).normalize(),r[1].setComponents(c+o,h+d,p+_,w+S).normalize(),r[2].setComponents(c+s,h+f,p+v,w+M).normalize(),r[3].setComponents(c-s,h-f,p-v,w-M).normalize(),i)r[4].setComponents(l,u,m,y).normalize(),r[5].setComponents(c-l,h-u,p-m,w-y).normalize();else if(r[4].setComponents(c-l,h-u,p-m,w-y).normalize(),t===WebGLCoordinateSystem)r[5].setComponents(c+l,h+u,p+m,w+y).normalize();else if(t===WebGPUCoordinateSystem)r[5].setComponents(l,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_sphere$3.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_sphere$3.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_sphere$3)}intersectsSprite(e){_sphere$3.center.set(0,0,0);const t=_defaultSpriteCenter.distanceTo(e.center);return _sphere$3.radius=.7071067811865476+t,_sphere$3.applyMatrix4(e.matrixWorld),this.intersectsSphere(_sphere$3)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(_vector$6.x=r.normal.x>0?e.max.x:e.min.x,_vector$6.y=r.normal.y>0?e.max.y:e.min.y,_vector$6.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(_vector$6)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class LineBasicMaterial extends Material{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Color(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const _vStart=new Vector3,_vEnd=new Vector3,_inverseMatrix$1=new Matrix4,_ray$1=new Ray,_sphere$1=new Sphere,_intersectPointOnRay=new Vector3,_intersectPointOnSegment=new Vector3;class Line extends Object3D{constructor(e=new BufferGeometry,t=new LineBasicMaterial){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,a=t.count;r<a;r++)_vStart.fromBufferAttribute(t,r-1),_vEnd.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=_vStart.distanceTo(_vEnd);e.setAttribute("lineDistance",new Float32BufferAttribute(i,1))}else warn("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere$1.copy(i.boundingSphere),_sphere$1.applyMatrix4(r),_sphere$1.radius+=a,e.ray.intersectsSphere(_sphere$1)===!1)return;_inverseMatrix$1.copy(r).invert(),_ray$1.copy(e.ray).applyMatrix4(_inverseMatrix$1);const s=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=s*s,c=this.isLineSegments?2:1,d=i.index,u=i.attributes.position;if(d!==null){const h=Math.max(0,o.start),_=Math.min(d.count,o.start+o.count);for(let v=h,m=_-1;v<m;v+=c){const p=d.getX(v),S=d.getX(v+1),M=checkIntersection(this,e,_ray$1,l,p,S,v);M&&t.push(M)}if(this.isLineLoop){const v=d.getX(_-1),m=d.getX(h),p=checkIntersection(this,e,_ray$1,l,v,m,_-1);p&&t.push(p)}}else{const h=Math.max(0,o.start),_=Math.min(u.count,o.start+o.count);for(let v=h,m=_-1;v<m;v+=c){const p=checkIntersection(this,e,_ray$1,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=checkIntersection(this,e,_ray$1,l,_-1,h,_-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=r.length;a<o;a++){const s=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=a}}}}}function checkIntersection(n,e,t,i,r,a,o){const s=n.geometry.attributes.position;if(_vStart.fromBufferAttribute(s,r),_vEnd.fromBufferAttribute(s,a),t.distanceSqToSegment(_vStart,_vEnd,_intersectPointOnRay,_intersectPointOnSegment)>i)return;_intersectPointOnRay.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(_intersectPointOnRay);if(!(c<e.near||c>e.far))return{distance:c,point:_intersectPointOnSegment.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const _start=new Vector3,_end=new Vector3;class LineSegments extends Line{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,a=t.count;r<a;r+=2)_start.fromBufferAttribute(t,r),_end.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+_start.distanceTo(_end);e.setAttribute("lineDistance",new Float32BufferAttribute(i,1))}else warn("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class PointsMaterial extends Material{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Color(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const _inverseMatrix=new Matrix4,_ray=new Ray,_sphere=new Sphere,_position$3=new Vector3;class Points extends Object3D{constructor(e=new BufferGeometry,t=new PointsMaterial){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere.copy(i.boundingSphere),_sphere.applyMatrix4(r),_sphere.radius+=a,e.ray.intersectsSphere(_sphere)===!1)return;_inverseMatrix.copy(r).invert(),_ray.copy(e.ray).applyMatrix4(_inverseMatrix);const s=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=s*s,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,o.start),h=Math.min(c.count,o.start+o.count);for(let _=u,v=h;_<v;_++){const m=c.getX(_);_position$3.fromBufferAttribute(f,m),testPoint(_position$3,m,l,r,e,t,this)}}else{const u=Math.max(0,o.start),h=Math.min(f.count,o.start+o.count);for(let _=u,v=h;_<v;_++)_position$3.fromBufferAttribute(f,_),testPoint(_position$3,_,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=r.length;a<o;a++){const s=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=a}}}}}function testPoint(n,e,t,i,r,a,o){const s=_ray.distanceSqToPoint(n);if(s<t){const l=new Vector3;_ray.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class VideoTexture extends Texture{constructor(e,t,i,r,a=LinearFilter,o=LinearFilter,s,l,c){super(e,t,i,r,a,o,s,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const d=this;function f(){d.needsUpdate=!0,d._requestVideoFrameCallbackId=e.requestVideoFrameCallback(f)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(f))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class CubeTexture extends Texture{constructor(e=[],t=CubeReflectionMapping,i,r,a,o,s,l,c,d){super(e,t,i,r,a,o,s,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class DepthTexture extends Texture{constructor(e,t,i=UnsignedIntType,r,a,o,s=NearestFilter,l=NearestFilter,c,d=DepthFormat,f=1){if(d!==DepthFormat&&d!==DepthStencilFormat)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,r,a,o,s,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Source(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class CubeDepthTexture extends DepthTexture{constructor(e,t=UnsignedIntType,i=CubeReflectionMapping,r,a,o=NearestFilter,s=NearestFilter,l,c=DepthFormat){const d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,i,r,a,o,s,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ExternalTexture extends Texture{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class BoxGeometry extends BufferGeometry{constructor(e=1,t=1,i=1,r=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:a,depthSegments:o};const s=this;r=Math.floor(r),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],d=[],f=[];let u=0,h=0;_("z","y","x",-1,-1,i,t,e,o,a,0),_("z","y","x",1,-1,i,t,-e,o,a,1),_("x","z","y",1,1,e,i,t,r,o,2),_("x","z","y",1,-1,e,i,-t,r,o,3),_("x","y","z",1,-1,e,t,i,r,a,4),_("x","y","z",-1,-1,e,t,-i,r,a,5),this.setIndex(l),this.setAttribute("position",new Float32BufferAttribute(c,3)),this.setAttribute("normal",new Float32BufferAttribute(d,3)),this.setAttribute("uv",new Float32BufferAttribute(f,2));function _(v,m,p,S,M,y,w,A,R,x,T){const z=y/R,P=w/x,B=y/2,F=w/2,V=A/2,C=R+1,I=x+1;let N=0,K=0;const q=new Vector3;for(let J=0;J<I;J++){const ce=J*P-F;for(let oe=0;oe<C;oe++){const Ee=oe*z-B;q[v]=Ee*S,q[m]=ce*M,q[p]=V,c.push(q.x,q.y,q.z),q[v]=0,q[m]=0,q[p]=A>0?1:-1,d.push(q.x,q.y,q.z),f.push(oe/R),f.push(1-J/x),N+=1}}for(let J=0;J<x;J++)for(let ce=0;ce<R;ce++){const oe=u+ce+C*J,Ee=u+ce+C*(J+1),Ne=u+(ce+1)+C*(J+1),Ve=u+(ce+1)+C*J;l.push(oe,Ee,Ve),l.push(Ee,Ne,Ve),K+=6}s.addGroup(h,K,T),h+=K,u+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new BoxGeometry(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class PlaneGeometry extends BufferGeometry{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const a=e/2,o=t/2,s=Math.floor(i),l=Math.floor(r),c=s+1,d=l+1,f=e/s,u=t/l,h=[],_=[],v=[],m=[];for(let p=0;p<d;p++){const S=p*u-o;for(let M=0;M<c;M++){const y=M*f-a;_.push(y,-S,0),v.push(0,0,1),m.push(M/s),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<s;S++){const M=S+c*p,y=S+c*(p+1),w=S+1+c*(p+1),A=S+1+c*p;h.push(M,y,A),h.push(y,w,A)}this.setIndex(h),this.setAttribute("position",new Float32BufferAttribute(_,3)),this.setAttribute("normal",new Float32BufferAttribute(v,3)),this.setAttribute("uv",new Float32BufferAttribute(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new PlaneGeometry(e.width,e.height,e.widthSegments,e.heightSegments)}}function cloneUniforms(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function mergeUniforms(n){const e={};for(let t=0;t<n.length;t++){const i=cloneUniforms(n[t]);for(const r in i)e[r]=i[r]}return e}function cloneUniformsGroups(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function getUnlitUniformColorSpace(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ColorManagement.workingColorSpace}const UniformsUtils={clone:cloneUniforms,merge:mergeUniforms};var default_vertex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,default_fragment=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ShaderMaterial extends Material{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=default_vertex,this.fragmentShader=default_fragment,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cloneUniforms(e.uniforms),this.uniformsGroups=cloneUniformsGroups(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class RawShaderMaterial extends ShaderMaterial{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class MeshNormalMaterial extends Material{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=TangentSpaceNormalMap,this.normalScale=new Vector2(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class MeshDepthMaterial extends Material{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=BasicDepthPacking,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class MeshDistanceMaterial extends Material{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const _position$2=new Vector3,_quaternion$2=new Quaternion,_scale$2=new Vector3;class Camera extends Object3D{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Matrix4,this.projectionMatrix=new Matrix4,this.projectionMatrixInverse=new Matrix4,this.coordinateSystem=WebGLCoordinateSystem,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_position$2,_quaternion$2,_scale$2),_scale$2.x===1&&_scale$2.y===1&&_scale$2.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_position$2,_quaternion$2,_scale$2.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(_position$2,_quaternion$2,_scale$2),_scale$2.x===1&&_scale$2.y===1&&_scale$2.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_position$2,_quaternion$2,_scale$2.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const _v3$1=new Vector3,_minTarget=new Vector2,_maxTarget=new Vector2;class PerspectiveCamera extends Camera{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=RAD2DEG*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(DEG2RAD*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return RAD2DEG*2*Math.atan(Math.tan(DEG2RAD*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){_v3$1.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_v3$1.x,_v3$1.y).multiplyScalar(-e/_v3$1.z),_v3$1.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_v3$1.x,_v3$1.y).multiplyScalar(-e/_v3$1.z)}getViewSize(e,t){return this.getViewBounds(e,_minTarget,_maxTarget),t.subVectors(_maxTarget,_minTarget)}setViewOffset(e,t,i,r,a,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(DEG2RAD*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,a=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class OrthographicCamera extends Camera{constructor(e=-1,t=1,i=1,r=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=i-e,o=i+e,s=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,s-=d*this.view.offsetY,l=s-d*this.view.height}this.projectionMatrix.makeOrthographic(a,o,s,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class InstancedBufferGeometry extends BufferGeometry{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const fov=-90,aspect=1;class CubeCamera extends Object3D{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new PerspectiveCamera(fov,aspect,e,t);r.layers=this.layers,this.add(r);const a=new PerspectiveCamera(fov,aspect,e,t);a.layers=this.layers,this.add(a);const o=new PerspectiveCamera(fov,aspect,e,t);o.layers=this.layers,this.add(o);const s=new PerspectiveCamera(fov,aspect,e,t);s.layers=this.layers,this.add(s);const l=new PerspectiveCamera(fov,aspect,e,t);l.layers=this.layers,this.add(l);const c=new PerspectiveCamera(fov,aspect,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,a,o,s,l]=t;for(const c of t)this.remove(c);if(e===WebGLCoordinateSystem)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===WebGPUCoordinateSystem)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,o,s,l,c,d]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,u,h),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class ArrayCamera extends PerspectiveCamera{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function getByteLength(n,e,t,i){const r=getTextureTypeByteLength(i);switch(t){case AlphaFormat:return n*e;case RedFormat:return n*e/r.components*r.byteLength;case RedIntegerFormat:return n*e/r.components*r.byteLength;case RGFormat:return n*e*2/r.components*r.byteLength;case RGIntegerFormat:return n*e*2/r.components*r.byteLength;case RGBFormat:return n*e*3/r.components*r.byteLength;case RGBAFormat:return n*e*4/r.components*r.byteLength;case RGBAIntegerFormat:return n*e*4/r.components*r.byteLength;case RGB_S3TC_DXT1_Format:case RGBA_S3TC_DXT1_Format:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case RGBA_S3TC_DXT3_Format:case RGBA_S3TC_DXT5_Format:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case RGB_PVRTC_2BPPV1_Format:case RGBA_PVRTC_2BPPV1_Format:return Math.max(n,16)*Math.max(e,8)/4;case RGB_PVRTC_4BPPV1_Format:case RGBA_PVRTC_4BPPV1_Format:return Math.max(n,8)*Math.max(e,8)/2;case RGB_ETC1_Format:case RGB_ETC2_Format:case R11_EAC_Format:case SIGNED_R11_EAC_Format:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case RGBA_ETC2_EAC_Format:case RG11_EAC_Format:case SIGNED_RG11_EAC_Format:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case RGBA_ASTC_4x4_Format:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case RGBA_ASTC_5x4_Format:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case RGBA_ASTC_5x5_Format:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case RGBA_ASTC_6x5_Format:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case RGBA_ASTC_6x6_Format:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case RGBA_ASTC_8x5_Format:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case RGBA_ASTC_8x6_Format:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case RGBA_ASTC_8x8_Format:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case RGBA_ASTC_10x5_Format:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case RGBA_ASTC_10x6_Format:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case RGBA_ASTC_10x8_Format:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case RGBA_ASTC_10x10_Format:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case RGBA_ASTC_12x10_Format:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case RGBA_ASTC_12x12_Format:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case RGBA_BPTC_Format:case RGB_BPTC_SIGNED_Format:case RGB_BPTC_UNSIGNED_Format:return Math.ceil(n/4)*Math.ceil(e/4)*16;case RED_RGTC1_Format:case SIGNED_RED_RGTC1_Format:return Math.ceil(n/4)*Math.ceil(e/4)*8;case RED_GREEN_RGTC2_Format:case SIGNED_RED_GREEN_RGTC2_Format:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function getTextureTypeByteLength(n){switch(n){case UnsignedByteType:case ByteType:return{byteLength:1,components:1};case UnsignedShortType:case ShortType:case HalfFloatType:return{byteLength:2,components:1};case UnsignedShort4444Type:case UnsignedShort5551Type:return{byteLength:2,components:4};case UnsignedIntType:case IntType:case FloatType:return{byteLength:4,components:1};case UnsignedInt5999Type:case UnsignedInt101111Type:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:REVISION}}));typeof window<"u"&&(window.__THREE__?warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=REVISION);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function WebGLAnimation(){let n=null,e=!1,t=null,i=null;function r(a,o){t(a,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function WebGLAttributes(n){const e=new WeakMap;function t(s,l){const c=s.array,d=s.usage,f=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,d),s.onUploadCallback();let h;if(c instanceof Float32Array)h=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=n.HALF_FLOAT;else if(c instanceof Uint16Array)s.isFloat16BufferAttribute?h=n.HALF_FLOAT:h=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=n.SHORT;else if(c instanceof Uint32Array)h=n.UNSIGNED_INT;else if(c instanceof Int32Array)h=n.INT;else if(c instanceof Int8Array)h=n.BYTE;else if(c instanceof Uint8Array)h=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:s.version,size:f}}function i(s,l,c){const d=l.array,f=l.updateRanges;if(n.bindBuffer(c,s),f.length===0)n.bufferSubData(c,0,d);else{f.sort((h,_)=>h.start-_.start);let u=0;for(let h=1;h<f.length;h++){const _=f[u],v=f[h];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++u,f[u]=v)}f.length=u+1;for(let h=0,_=f.length;h<_;h++){const v=f[h];n.bufferSubData(c,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(s){return s.isInterleavedBufferAttribute&&(s=s.data),e.get(s)}function a(s){s.isInterleavedBufferAttribute&&(s=s.data);const l=e.get(s);l&&(n.deleteBuffer(l.buffer),e.delete(s))}function o(s,l){if(s.isInterleavedBufferAttribute&&(s=s.data),s.isGLBufferAttribute){const d=e.get(s);(!d||d.version<s.version)&&e.set(s,{buffer:s.buffer,type:s.type,bytesPerElement:s.elementSize,version:s.version});return}const c=e.get(s);if(c===void 0)e.set(s,t(s,l));else if(c.version<s.version){if(c.size!==s.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,s,l),c.version=s.version}}return{get:r,remove:a,update:o}}var alphahash_fragment=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment="gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_vertex=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,envmap_physical_pars_fragment=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,lights_toon_fragment=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vertex$h=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fragment$h=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$g=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$f=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$e=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fragment$e=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vertex$d=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fragment$d=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,vertex$c=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fragment$c=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$b=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fragment$b=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$a=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fragment$a=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$9=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$9=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$8=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fragment$8=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$7=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fragment$7=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vertex$6=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$6=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$5=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fragment$5=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$4=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$4=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$3=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,fragment$3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fragment$1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ShaderChunk={alphahash_fragment,alphahash_pars_fragment,alphamap_fragment,alphamap_pars_fragment,alphatest_fragment,alphatest_pars_fragment,aomap_fragment,aomap_pars_fragment,batching_pars_vertex,batching_vertex,begin_vertex,beginnormal_vertex,bsdfs,iridescence_fragment,bumpmap_pars_fragment,clipping_planes_fragment,clipping_planes_pars_fragment,clipping_planes_pars_vertex,clipping_planes_vertex,color_fragment,color_pars_fragment,color_pars_vertex,color_vertex,common,cube_uv_reflection_fragment,defaultnormal_vertex,displacementmap_pars_vertex,displacementmap_vertex,emissivemap_fragment,emissivemap_pars_fragment,colorspace_fragment,colorspace_pars_fragment,envmap_fragment,envmap_common_pars_fragment,envmap_pars_fragment,envmap_pars_vertex,envmap_physical_pars_fragment,envmap_vertex,fog_vertex,fog_pars_vertex,fog_fragment,fog_pars_fragment,gradientmap_pars_fragment,lightmap_pars_fragment,lights_lambert_fragment,lights_lambert_pars_fragment,lights_pars_begin,lights_toon_fragment,lights_toon_pars_fragment,lights_phong_fragment,lights_phong_pars_fragment,lights_physical_fragment,lights_physical_pars_fragment,lights_fragment_begin,lights_fragment_maps,lights_fragment_end,logdepthbuf_fragment,logdepthbuf_pars_fragment,logdepthbuf_pars_vertex,logdepthbuf_vertex,map_fragment,map_pars_fragment,map_particle_fragment,map_particle_pars_fragment,metalnessmap_fragment,metalnessmap_pars_fragment,morphinstance_vertex,morphcolor_vertex,morphnormal_vertex,morphtarget_pars_vertex,morphtarget_vertex,normal_fragment_begin,normal_fragment_maps,normal_pars_fragment,normal_pars_vertex,normal_vertex,normalmap_pars_fragment,clearcoat_normal_fragment_begin,clearcoat_normal_fragment_maps,clearcoat_pars_fragment,iridescence_pars_fragment,opaque_fragment,packing,premultiplied_alpha_fragment,project_vertex,dithering_fragment,dithering_pars_fragment,roughnessmap_fragment,roughnessmap_pars_fragment,shadowmap_pars_fragment,shadowmap_pars_vertex,shadowmap_vertex,shadowmask_pars_fragment,skinbase_vertex,skinning_pars_vertex,skinning_vertex,skinnormal_vertex,specularmap_fragment,specularmap_pars_fragment,tonemapping_fragment,tonemapping_pars_fragment,transmission_fragment,transmission_pars_fragment,uv_pars_fragment,uv_pars_vertex,uv_vertex,worldpos_vertex,background_vert:vertex$h,background_frag:fragment$h,backgroundCube_vert:vertex$g,backgroundCube_frag:fragment$g,cube_vert:vertex$f,cube_frag:fragment$f,depth_vert:vertex$e,depth_frag:fragment$e,distance_vert:vertex$d,distance_frag:fragment$d,equirect_vert:vertex$c,equirect_frag:fragment$c,linedashed_vert:vertex$b,linedashed_frag:fragment$b,meshbasic_vert:vertex$a,meshbasic_frag:fragment$a,meshlambert_vert:vertex$9,meshlambert_frag:fragment$9,meshmatcap_vert:vertex$8,meshmatcap_frag:fragment$8,meshnormal_vert:vertex$7,meshnormal_frag:fragment$7,meshphong_vert:vertex$6,meshphong_frag:fragment$6,meshphysical_vert:vertex$5,meshphysical_frag:fragment$5,meshtoon_vert:vertex$4,meshtoon_frag:fragment$4,points_vert:vertex$3,points_frag:fragment$3,shadow_vert:vertex$2,shadow_frag:fragment$2,sprite_vert:vertex$1,sprite_frag:fragment$1},UniformsLib={common:{diffuse:{value:new Color(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Matrix3}},envmap:{envMap:{value:null},envMapRotation:{value:new Matrix3},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Matrix3}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Matrix3}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Matrix3},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Matrix3},normalScale:{value:new Vector2(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Matrix3},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Matrix3}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Matrix3}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Matrix3}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Color(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Color(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0},uvTransform:{value:new Matrix3}},sprite:{diffuse:{value:new Color(16777215)},opacity:{value:1},center:{value:new Vector2(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}}},ShaderLib={basic:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.fog]),vertexShader:ShaderChunk.meshbasic_vert,fragmentShader:ShaderChunk.meshbasic_frag},lambert:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshlambert_vert,fragmentShader:ShaderChunk.meshlambert_frag},phong:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},specular:{value:new Color(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshphong_vert,fragmentShader:ShaderChunk.meshphong_frag},standard:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.roughnessmap,UniformsLib.metalnessmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag},toon:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.gradientmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)}}]),vertexShader:ShaderChunk.meshtoon_vert,fragmentShader:ShaderChunk.meshtoon_frag},matcap:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,{matcap:{value:null}}]),vertexShader:ShaderChunk.meshmatcap_vert,fragmentShader:ShaderChunk.meshmatcap_frag},points:{uniforms:mergeUniforms([UniformsLib.points,UniformsLib.fog]),vertexShader:ShaderChunk.points_vert,fragmentShader:ShaderChunk.points_frag},dashed:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ShaderChunk.linedashed_vert,fragmentShader:ShaderChunk.linedashed_frag},depth:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap]),vertexShader:ShaderChunk.depth_vert,fragmentShader:ShaderChunk.depth_frag},normal:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,{opacity:{value:1}}]),vertexShader:ShaderChunk.meshnormal_vert,fragmentShader:ShaderChunk.meshnormal_frag},sprite:{uniforms:mergeUniforms([UniformsLib.sprite,UniformsLib.fog]),vertexShader:ShaderChunk.sprite_vert,fragmentShader:ShaderChunk.sprite_frag},background:{uniforms:{uvTransform:{value:new Matrix3},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ShaderChunk.background_vert,fragmentShader:ShaderChunk.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Matrix3}},vertexShader:ShaderChunk.backgroundCube_vert,fragmentShader:ShaderChunk.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ShaderChunk.cube_vert,fragmentShader:ShaderChunk.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ShaderChunk.equirect_vert,fragmentShader:ShaderChunk.equirect_frag},distance:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap,{referencePosition:{value:new Vector3},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ShaderChunk.distance_vert,fragmentShader:ShaderChunk.distance_frag},shadow:{uniforms:mergeUniforms([UniformsLib.lights,UniformsLib.fog,{color:{value:new Color(0)},opacity:{value:1}}]),vertexShader:ShaderChunk.shadow_vert,fragmentShader:ShaderChunk.shadow_frag}};ShaderLib.physical={uniforms:mergeUniforms([ShaderLib.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Matrix3},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Matrix3},clearcoatNormalScale:{value:new Vector2(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Matrix3},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Matrix3},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Matrix3},sheen:{value:0},sheenColor:{value:new Color(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Matrix3},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Matrix3},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Matrix3},transmissionSamplerSize:{value:new Vector2},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Matrix3},attenuationDistance:{value:0},attenuationColor:{value:new Color(0)},specularColor:{value:new Color(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Matrix3},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Matrix3},anisotropyVector:{value:new Vector2},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Matrix3}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag};const _rgb={r:0,b:0,g:0},_e1$1=new Euler,_m1$1=new Matrix4;function WebGLBackground(n,e,t,i,r,a){const o=new Color(0);let s=r===!0?0:1,l,c,d=null,f=0,u=null;function h(S){let M=S.isScene===!0?S.background:null;if(M&&M.isTexture){const y=S.backgroundBlurriness>0;M=e.get(M,y)}return M}function _(S){let M=!1;const y=h(S);y===null?m(o,s):y&&y.isColor&&(m(y,1),M=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(S,M){const y=h(M);y&&(y.isCubeTexture||y.mapping===CubeUVReflectionMapping)?(c===void 0&&(c=new Mesh(new BoxGeometry(1,1,1),new ShaderMaterial({name:"BackgroundCubeMaterial",uniforms:cloneUniforms(ShaderLib.backgroundCube.uniforms),vertexShader:ShaderLib.backgroundCube.vertexShader,fragmentShader:ShaderLib.backgroundCube.fragmentShader,side:BackSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),_e1$1.copy(M.backgroundRotation),_e1$1.x*=-1,_e1$1.y*=-1,_e1$1.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_e1$1.y*=-1,_e1$1.z*=-1),c.material.uniforms.envMap.value=y,c.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_m1$1.makeRotationFromEuler(_e1$1)),c.material.toneMapped=ColorManagement.getTransfer(y.colorSpace)!==SRGBTransfer,(d!==y||f!==y.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,d=y,f=y.version,u=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Mesh(new PlaneGeometry(2,2),new ShaderMaterial({name:"BackgroundMaterial",uniforms:cloneUniforms(ShaderLib.background.uniforms),vertexShader:ShaderLib.background.vertexShader,fragmentShader:ShaderLib.background.fragmentShader,side:FrontSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ColorManagement.getTransfer(y.colorSpace)!==SRGBTransfer,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||f!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,d=y,f=y.version,u=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,M){S.getRGB(_rgb,getUnlitUniformColorSpace(n)),t.buffers.color.setClear(_rgb.r,_rgb.g,_rgb.b,M,a)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,M=1){o.set(S),s=M,m(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(S){s=S,m(o,s)},render:_,addToRenderList:v,dispose:p}}function WebGLBindingStates(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=u(null);let a=r,o=!1;function s(P,B,F,V,C){let I=!1;const N=f(P,V,F,B);a!==N&&(a=N,c(a.object)),I=h(P,V,F,C),I&&_(P,V,F,C),C!==null&&e.update(C,n.ELEMENT_ARRAY_BUFFER),(I||o)&&(o=!1,y(P,B,F,V),C!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(C).buffer))}function l(){return n.createVertexArray()}function c(P){return n.bindVertexArray(P)}function d(P){return n.deleteVertexArray(P)}function f(P,B,F,V){const C=V.wireframe===!0;let I=i[B.id];I===void 0&&(I={},i[B.id]=I);const N=P.isInstancedMesh===!0?P.id:0;let K=I[N];K===void 0&&(K={},I[N]=K);let q=K[F.id];q===void 0&&(q={},K[F.id]=q);let J=q[C];return J===void 0&&(J=u(l()),q[C]=J),J}function u(P){const B=[],F=[],V=[];for(let C=0;C<t;C++)B[C]=0,F[C]=0,V[C]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:F,attributeDivisors:V,object:P,attributes:{},index:null}}function h(P,B,F,V){const C=a.attributes,I=B.attributes;let N=0;const K=F.getAttributes();for(const q in K)if(K[q].location>=0){const ce=C[q];let oe=I[q];if(oe===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(oe=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(oe=P.instanceColor)),ce===void 0||ce.attribute!==oe||oe&&ce.data!==oe.data)return!0;N++}return a.attributesNum!==N||a.index!==V}function _(P,B,F,V){const C={},I=B.attributes;let N=0;const K=F.getAttributes();for(const q in K)if(K[q].location>=0){let ce=I[q];ce===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor));const oe={};oe.attribute=ce,ce&&ce.data&&(oe.data=ce.data),C[q]=oe,N++}a.attributes=C,a.attributesNum=N,a.index=V}function v(){const P=a.newAttributes;for(let B=0,F=P.length;B<F;B++)P[B]=0}function m(P){p(P,0)}function p(P,B){const F=a.newAttributes,V=a.enabledAttributes,C=a.attributeDivisors;F[P]=1,V[P]===0&&(n.enableVertexAttribArray(P),V[P]=1),C[P]!==B&&(n.vertexAttribDivisor(P,B),C[P]=B)}function S(){const P=a.newAttributes,B=a.enabledAttributes;for(let F=0,V=B.length;F<V;F++)B[F]!==P[F]&&(n.disableVertexAttribArray(F),B[F]=0)}function M(P,B,F,V,C,I,N){N===!0?n.vertexAttribIPointer(P,B,F,C,I):n.vertexAttribPointer(P,B,F,V,C,I)}function y(P,B,F,V){v();const C=V.attributes,I=F.getAttributes(),N=B.defaultAttributeValues;for(const K in I){const q=I[K];if(q.location>=0){let J=C[K];if(J===void 0&&(K==="instanceMatrix"&&P.instanceMatrix&&(J=P.instanceMatrix),K==="instanceColor"&&P.instanceColor&&(J=P.instanceColor)),J!==void 0){const ce=J.normalized,oe=J.itemSize,Ee=e.get(J);if(Ee===void 0)continue;const Ne=Ee.buffer,Ve=Ee.type,Y=Ee.bytesPerElement,ie=Ve===n.INT||Ve===n.UNSIGNED_INT||J.gpuType===IntType;if(J.isInterleavedBufferAttribute){const ae=J.data,Pe=ae.stride,Te=J.offset;if(ae.isInstancedInterleavedBuffer){for(let we=0;we<q.locationSize;we++)p(q.location+we,ae.meshPerAttribute);P.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let we=0;we<q.locationSize;we++)m(q.location+we);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let we=0;we<q.locationSize;we++)M(q.location+we,oe/q.locationSize,Ve,ce,Pe*Y,(Te+oe/q.locationSize*we)*Y,ie)}else{if(J.isInstancedBufferAttribute){for(let ae=0;ae<q.locationSize;ae++)p(q.location+ae,J.meshPerAttribute);P.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ae=0;ae<q.locationSize;ae++)m(q.location+ae);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let ae=0;ae<q.locationSize;ae++)M(q.location+ae,oe/q.locationSize,Ve,ce,oe*Y,oe/q.locationSize*ae*Y,ie)}}else if(N!==void 0){const ce=N[K];if(ce!==void 0)switch(ce.length){case 2:n.vertexAttrib2fv(q.location,ce);break;case 3:n.vertexAttrib3fv(q.location,ce);break;case 4:n.vertexAttrib4fv(q.location,ce);break;default:n.vertexAttrib1fv(q.location,ce)}}}}S()}function w(){T();for(const P in i){const B=i[P];for(const F in B){const V=B[F];for(const C in V){const I=V[C];for(const N in I)d(I[N].object),delete I[N];delete V[C]}}delete i[P]}}function A(P){if(i[P.id]===void 0)return;const B=i[P.id];for(const F in B){const V=B[F];for(const C in V){const I=V[C];for(const N in I)d(I[N].object),delete I[N];delete V[C]}}delete i[P.id]}function R(P){for(const B in i){const F=i[B];for(const V in F){const C=F[V];if(C[P.id]===void 0)continue;const I=C[P.id];for(const N in I)d(I[N].object),delete I[N];delete C[P.id]}}}function x(P){for(const B in i){const F=i[B],V=P.isInstancedMesh===!0?P.id:0,C=F[V];if(C!==void 0){for(const I in C){const N=C[I];for(const K in N)d(N[K].object),delete N[K];delete C[I]}delete F[V],Object.keys(F).length===0&&delete i[B]}}}function T(){z(),o=!0,a!==r&&(a=r,c(a.object))}function z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:s,reset:T,resetDefaultState:z,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function WebGLBufferRenderer(n,e,t){let i;function r(c){i=c}function a(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function o(c,d,f){f!==0&&(n.drawArraysInstanced(i,c,d,f),t.update(d,i,f))}function s(c,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,f);let h=0;for(let _=0;_<f;_++)h+=d[_];t.update(h,i,1)}function l(c,d,f,u){if(f===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let _=0;_<c.length;_++)o(c[_],d[_],u[_]);else{h.multiDrawArraysInstancedWEBGL(i,c,0,d,0,u,0,f);let _=0;for(let v=0;v<f;v++)_+=d[v]*u[v];t.update(_,i,1)}}this.setMode=r,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=l}function WebGLCapabilities(n,e,t,i){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==RGBAFormat&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(R){const x=R===HalfFloatType&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==UnsignedByteType&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==FloatType&&!x)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(warn("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:s,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:h,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:y,maxSamples:w,samples:A}}function WebGLClipping(n){const e=this;let t=null,i=0,r=!1,a=!1;const o=new Plane,s=new Matrix3,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const h=f.length!==0||u||i!==0||r;return r=u,i=f.length,h},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,u){t=d(f,u,0)},this.setState=function(f,u,h){const _=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!r||_===null||_.length===0||a&&!m)a?d(null):c();else{const S=a?0:i,M=S*4;let y=p.clippingState||null;l.value=y,y=d(_,u,M,h);for(let w=0;w!==M;++w)y[w]=t[w];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,u,h,_){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const p=h+v*4,S=u.matrixWorldInverse;s.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,y=h;M!==v;++M,y+=4)o.copy(f[M]).applyMatrix4(S,s),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const LOD_MIN=4,EXTRA_LOD_SIGMA=[.125,.215,.35,.446,.526,.582],MAX_SAMPLES=20,GGX_SAMPLES=256,_flatCamera=new OrthographicCamera,_clearColor=new Color;let _oldTarget=null,_oldActiveCubeFace=0,_oldActiveMipmapLevel=0,_oldXrEnabled=!1;const _origin=new Vector3;class PMREMGenerator{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,a={}){const{size:o=256,position:s=_origin}=a;_oldTarget=this._renderer.getRenderTarget(),_oldActiveCubeFace=this._renderer.getActiveCubeFace(),_oldActiveMipmapLevel=this._renderer.getActiveMipmapLevel(),_oldXrEnabled=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,s),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(_oldTarget,_oldActiveCubeFace,_oldActiveMipmapLevel),this._renderer.xr.enabled=_oldXrEnabled,e.scissorTest=!1,_setViewport(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_oldTarget=this._renderer.getRenderTarget(),_oldActiveCubeFace=this._renderer.getActiveCubeFace(),_oldActiveMipmapLevel=this._renderer.getActiveMipmapLevel(),_oldXrEnabled=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:LinearFilter,minFilter:LinearFilter,generateMipmaps:!1,type:HalfFloatType,format:RGBAFormat,colorSpace:LinearSRGBColorSpace,depthBuffer:!1},r=_createRenderTarget(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_createRenderTarget(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=_createPlanes(a)),this._blurMaterial=_getBlurShader(a,e,t),this._ggxMaterial=_getGGXShader(a,e,t)}return r}_compileMaterial(e){const t=new Mesh(new BufferGeometry,e);this._renderer.compile(t,_flatCamera)}_sceneToCubeUV(e,t,i,r,a){const l=new PerspectiveCamera(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,h=f.toneMapping;f.getClearColor(_clearColor),f.toneMapping=NoToneMapping,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Mesh(new BoxGeometry,new MeshBasicMaterial({name:"PMREM.Background",side:BackSide,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(_clearColor),p=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+d[M],a.y,a.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+d[M],a.z)):(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+d[M]));const w=this._cubeSize;_setViewport(r,y*w,M>2?w:0,w,w),f.setRenderTarget(r),p&&f.render(v,l),f.render(e,l)}f.toneMapping=h,f.autoClear=u,e.background=S}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial());const a=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=a;const s=a.uniforms;s.envMap.value=e;const l=this._cubeSize;_setViewport(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,_flatCamera)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,a=this._pingPongRenderTarget,o=this._ggxMaterial,s=this._lodMeshes[i];s.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-d*d),u=0+c*1.25,h=f*u,{_lodMax:_}=this,v=this._sizeLods[i],m=3*v*(i>_-LOD_MIN?i-_+LOD_MIN:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=_-t,_setViewport(a,m,p,3*v,2*v),r.setRenderTarget(a),r.render(s,_flatCamera),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=_-i,_setViewport(e,m,p,3*v,2*v),r.setRenderTarget(e),r.render(s,_flatCamera)}_blur(e,t,i,r,a){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",a),this._halfBlur(o,e,i,i,r,"longitudinal",a)}_halfBlur(e,t,i,r,a,o,s){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&error("blur direction must be either latitudinal or longitudinal!");const d=3,f=this._lodMeshes[r];f.material=c;const u=c.uniforms,h=this._sizeLods[i]-1,_=isFinite(a)?Math.PI/(2*h):2*Math.PI/(2*MAX_SAMPLES-1),v=a/_,m=isFinite(a)?1+Math.floor(d*v):MAX_SAMPLES;m>MAX_SAMPLES&&warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${MAX_SAMPLES}`);const p=[];let S=0;for(let R=0;R<MAX_SAMPLES;++R){const x=R/v,T=Math.exp(-x*x/2);p.push(T),R===0?S+=T:R<m&&(S+=2*T)}for(let R=0;R<p.length;R++)p[R]=p[R]/S;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",s&&(u.poleAxis.value=s);const{_lodMax:M}=this;u.dTheta.value=_,u.mipInt.value=M-i;const y=this._sizeLods[r],w=3*y*(r>M-LOD_MIN?r-M+LOD_MIN:0),A=4*(this._cubeSize-y);_setViewport(t,w,A,3*y,2*y),l.setRenderTarget(t),l.render(f,_flatCamera)}}function _createPlanes(n){const e=[],t=[],i=[];let r=n;const a=n-LOD_MIN+1+EXTRA_LOD_SIGMA.length;for(let o=0;o<a;o++){const s=Math.pow(2,r);e.push(s);let l=1/s;o>n-LOD_MIN?l=EXTRA_LOD_SIGMA[o-n+LOD_MIN-1]:o===0&&(l=0),t.push(l);const c=1/(s-2),d=-c,f=1+c,u=[d,d,f,d,f,f,d,d,f,f,d,f],h=6,_=6,v=3,m=2,p=1,S=new Float32Array(v*_*h),M=new Float32Array(m*_*h),y=new Float32Array(p*_*h);for(let A=0;A<h;A++){const R=A%3*2/3-1,x=A>2?0:-1,T=[R,x,0,R+2/3,x,0,R+2/3,x+1,0,R,x,0,R+2/3,x+1,0,R,x+1,0];S.set(T,v*_*A),M.set(u,m*_*A);const z=[A,A,A,A,A,A];y.set(z,p*_*A)}const w=new BufferGeometry;w.setAttribute("position",new BufferAttribute(S,v)),w.setAttribute("uv",new BufferAttribute(M,m)),w.setAttribute("faceIndex",new BufferAttribute(y,p)),i.push(new Mesh(w,null)),r>LOD_MIN&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function _createRenderTarget(n,e,t){const i=new WebGLRenderTarget(n,e,t);return i.texture.mapping=CubeUVReflectionMapping,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _setViewport(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function _getGGXShader(n,e,t){return new ShaderMaterial({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:_getCommonVertexShader(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getBlurShader(n,e,t){const i=new Float32Array(MAX_SAMPLES),r=new Vector3(0,1,0);return new ShaderMaterial({name:"SphericalGaussianBlur",defines:{n:MAX_SAMPLES,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:_getCommonVertexShader(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getEquirectMaterial(){return new ShaderMaterial({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_getCommonVertexShader(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getCubemapMaterial(){return new ShaderMaterial({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_getCommonVertexShader(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getCommonVertexShader(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class WebGLCubeRenderTarget extends WebGLRenderTarget{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new CubeTexture(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new BoxGeometry(5,5,5),a=new ShaderMaterial({name:"CubemapFromEquirect",uniforms:cloneUniforms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:BackSide,blending:NoBlending});a.uniforms.tEquirect.value=t;const o=new Mesh(r,a),s=t.minFilter;return t.minFilter===LinearMipmapLinearFilter&&(t.minFilter=LinearFilter),new CubeCamera(1,10,this).update(e,o),t.minFilter=s,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const a=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(a)}}function WebGLEnvironments(n){let e=new WeakMap,t=new WeakMap,i=null;function r(u,h=!1){return u==null?null:h?o(u):a(u)}function a(u){if(u&&u.isTexture){const h=u.mapping;if(h===EquirectangularReflectionMapping||h===EquirectangularRefractionMapping)if(e.has(u)){const _=e.get(u).texture;return s(_,u.mapping)}else{const _=u.image;if(_&&_.height>0){const v=new WebGLCubeRenderTarget(_.height);return v.fromEquirectangularTexture(n,u),e.set(u,v),u.addEventListener("dispose",c),s(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){const h=u.mapping,_=h===EquirectangularReflectionMapping||h===EquirectangularRefractionMapping,v=h===CubeReflectionMapping||h===CubeRefractionMapping;if(_||v){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new PMREMGenerator(n)),m=_?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const S=u.image;return _&&S&&S.height>0||v&&S&&l(S)?(i===null&&(i=new PMREMGenerator(n)),m=_?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",d),m.texture):null}}}return u}function s(u,h){return h===EquirectangularReflectionMapping?u.mapping=CubeReflectionMapping:h===EquirectangularRefractionMapping&&(u.mapping=CubeRefractionMapping),u}function l(u){let h=0;const _=6;for(let v=0;v<_;v++)u[v]!==void 0&&h++;return h===_}function c(u){const h=u.target;h.removeEventListener("dispose",c);const _=e.get(h);_!==void 0&&(e.delete(h),_.dispose())}function d(u){const h=u.target;h.removeEventListener("dispose",d);const _=t.get(h);_!==void 0&&(t.delete(h),_.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function WebGLExtensions(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&warnOnce("WebGLRenderer: "+i+" extension not supported."),r}}}function WebGLGeometries(n,e,t,i){const r={},a=new WeakMap;function o(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const _ in u.attributes)e.remove(u.attributes[_]);u.removeEventListener("dispose",o),delete r[u.id];const h=a.get(u);h&&(e.remove(h),a.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function s(f,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,t.memory.geometries++),u}function l(f){const u=f.attributes;for(const h in u)e.update(u[h],n.ARRAY_BUFFER)}function c(f){const u=[],h=f.index,_=f.attributes.position;let v=0;if(_===void 0)return;if(h!==null){const S=h.array;v=h.version;for(let M=0,y=S.length;M<y;M+=3){const w=S[M+0],A=S[M+1],R=S[M+2];u.push(w,A,A,R,R,w)}}else{const S=_.array;v=_.version;for(let M=0,y=S.length/3-1;M<y;M+=3){const w=M+0,A=M+1,R=M+2;u.push(w,A,A,R,R,w)}}const m=new(_.count>=65535?Uint32BufferAttribute:Uint16BufferAttribute)(u,1);m.version=v;const p=a.get(f);p&&e.remove(p),a.set(f,m)}function d(f){const u=a.get(f);if(u){const h=f.index;h!==null&&u.version<h.version&&c(f)}else c(f);return a.get(f)}return{get:s,update:l,getWireframeAttribute:d}}function WebGLIndexedBufferRenderer(n,e,t){let i;function r(u){i=u}let a,o;function s(u){a=u.type,o=u.bytesPerElement}function l(u,h){n.drawElements(i,h,a,u*o),t.update(h,i,1)}function c(u,h,_){_!==0&&(n.drawElementsInstanced(i,h,a,u*o,_),t.update(h,i,_))}function d(u,h,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,u,0,_);let m=0;for(let p=0;p<_;p++)m+=h[p];t.update(m,i,1)}function f(u,h,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)c(u[p]/o,h[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,h,0,a,u,0,v,0,_);let p=0;for(let S=0;S<_;S++)p+=h[S]*v[S];t.update(p,i,1)}}this.setMode=r,this.setIndex=s,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function WebGLInfo(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,s){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=s*(a/3);break;case n.LINES:t.lines+=s*(a/2);break;case n.LINE_STRIP:t.lines+=s*(a-1);break;case n.LINE_LOOP:t.lines+=s*a;break;case n.POINTS:t.points+=s*a;break;default:error("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function WebGLMorphtargets(n,e,t){const i=new WeakMap,r=new Vector4;function a(o,s,l){const c=o.morphTargetInfluences,d=s.morphAttributes.position||s.morphAttributes.normal||s.morphAttributes.color,f=d!==void 0?d.length:0;let u=i.get(s);if(u===void 0||u.count!==f){let T=function(){R.dispose(),i.delete(s),s.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();const h=s.morphAttributes.position!==void 0,_=s.morphAttributes.normal!==void 0,v=s.morphAttributes.color!==void 0,m=s.morphAttributes.position||[],p=s.morphAttributes.normal||[],S=s.morphAttributes.color||[];let M=0;h===!0&&(M=1),_===!0&&(M=2),v===!0&&(M=3);let y=s.attributes.position.count*M,w=1;y>e.maxTextureSize&&(w=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*w*4*f),R=new DataArrayTexture(A,y,w,f);R.type=FloatType,R.needsUpdate=!0;const x=M*4;for(let z=0;z<f;z++){const P=m[z],B=p[z],F=S[z],V=y*w*4*z;for(let C=0;C<P.count;C++){const I=C*x;h===!0&&(r.fromBufferAttribute(P,C),A[V+I+0]=r.x,A[V+I+1]=r.y,A[V+I+2]=r.z,A[V+I+3]=0),_===!0&&(r.fromBufferAttribute(B,C),A[V+I+4]=r.x,A[V+I+5]=r.y,A[V+I+6]=r.z,A[V+I+7]=0),v===!0&&(r.fromBufferAttribute(F,C),A[V+I+8]=r.x,A[V+I+9]=r.y,A[V+I+10]=r.z,A[V+I+11]=F.itemSize===4?r.w:1)}}u={count:f,texture:R,size:new Vector2(y,w)},i.set(s,u),s.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let h=0;for(let v=0;v<c.length;v++)h+=c[v];const _=s.morphTargetsRelative?1:1-h;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:a}}function WebGLObjects(n,e,t,i,r){let a=new WeakMap;function o(c){const d=r.render.frame,f=c.geometry,u=e.get(c,f);if(a.get(u)!==d&&(e.update(u),a.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,d))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==d&&(h.update(),a.set(h,d))}return u}function s(){a=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:o,dispose:s}}const toneMappingMap={[LinearToneMapping]:"LINEAR_TONE_MAPPING",[ReinhardToneMapping]:"REINHARD_TONE_MAPPING",[CineonToneMapping]:"CINEON_TONE_MAPPING",[ACESFilmicToneMapping]:"ACES_FILMIC_TONE_MAPPING",[AgXToneMapping]:"AGX_TONE_MAPPING",[NeutralToneMapping]:"NEUTRAL_TONE_MAPPING",[CustomToneMapping]:"CUSTOM_TONE_MAPPING"};function WebGLOutput(n,e,t,i,r){const a=new WebGLRenderTarget(e,t,{type:n,depthBuffer:i,stencilBuffer:r}),o=new WebGLRenderTarget(e,t,{type:HalfFloatType,depthBuffer:!1,stencilBuffer:!1}),s=new BufferGeometry;s.setAttribute("position",new Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),s.setAttribute("uv",new Float32BufferAttribute([0,2,0,0,2,0],2));const l=new RawShaderMaterial({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Mesh(s,l),d=new OrthographicCamera(-1,1,1,-1,0,1);let f=null,u=null,h=!1,_,v=null,m=[],p=!1;this.setSize=function(S,M){a.setSize(S,M),o.setSize(S,M);for(let y=0;y<m.length;y++){const w=m[y];w.setSize&&w.setSize(S,M)}},this.setEffects=function(S){m=S,p=m.length>0&&m[0].isRenderPass===!0;const M=a.width,y=a.height;for(let w=0;w<m.length;w++){const A=m[w];A.setSize&&A.setSize(M,y)}},this.begin=function(S,M){if(h||S.toneMapping===NoToneMapping&&m.length===0)return!1;if(v=M,M!==null){const y=M.width,w=M.height;(a.width!==y||a.height!==w)&&this.setSize(y,w)}return p===!1&&S.setRenderTarget(a),_=S.toneMapping,S.toneMapping=NoToneMapping,!0},this.hasRenderPass=function(){return p},this.end=function(S,M){S.toneMapping=_,h=!0;let y=a,w=o;for(let A=0;A<m.length;A++){const R=m[A];if(R.enabled!==!1&&(R.render(S,w,y,M),R.needsSwap!==!1)){const x=y;y=w,w=x}}if(f!==S.outputColorSpace||u!==S.toneMapping){f=S.outputColorSpace,u=S.toneMapping,l.defines={},ColorManagement.getTransfer(f)===SRGBTransfer&&(l.defines.SRGB_TRANSFER="");const A=toneMappingMap[u];A&&(l.defines[A]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=y.texture,S.setRenderTarget(v),S.render(c,d),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){a.dispose(),o.dispose(),s.dispose(),l.dispose()}}const emptyTexture=new Texture,emptyShadowTexture=new DepthTexture(1,1),emptyArrayTexture=new DataArrayTexture,empty3dTexture=new Data3DTexture,emptyCubeTexture=new CubeTexture,arrayCacheF32=[],arrayCacheI32=[],mat4array=new Float32Array(16),mat3array=new Float32Array(9),mat2array=new Float32Array(4);function flatten(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let a=arrayCacheF32[r];if(a===void 0&&(a=new Float32Array(r),arrayCacheF32[r]=a),e!==0){i.toArray(a,0);for(let o=1,s=0;o!==e;++o)s+=t,n[o].toArray(a,s)}return a}function arraysEqual(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function copyArray(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function allocTexUnits(n,e){let t=arrayCacheI32[e];t===void 0&&(t=new Int32Array(e),arrayCacheI32[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function setValueV1f(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function setValueV2f(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(arraysEqual(t,e))return;n.uniform2fv(this.addr,e),copyArray(t,e)}}function setValueV3f(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(arraysEqual(t,e))return;n.uniform3fv(this.addr,e),copyArray(t,e)}}function setValueV4f(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(arraysEqual(t,e))return;n.uniform4fv(this.addr,e),copyArray(t,e)}}function setValueM2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),copyArray(t,e)}else{if(arraysEqual(t,i))return;mat2array.set(i),n.uniformMatrix2fv(this.addr,!1,mat2array),copyArray(t,i)}}function setValueM3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),copyArray(t,e)}else{if(arraysEqual(t,i))return;mat3array.set(i),n.uniformMatrix3fv(this.addr,!1,mat3array),copyArray(t,i)}}function setValueM4(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),copyArray(t,e)}else{if(arraysEqual(t,i))return;mat4array.set(i),n.uniformMatrix4fv(this.addr,!1,mat4array),copyArray(t,i)}}function setValueV1i(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function setValueV2i(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(arraysEqual(t,e))return;n.uniform2iv(this.addr,e),copyArray(t,e)}}function setValueV3i(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(arraysEqual(t,e))return;n.uniform3iv(this.addr,e),copyArray(t,e)}}function setValueV4i(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(arraysEqual(t,e))return;n.uniform4iv(this.addr,e),copyArray(t,e)}}function setValueV1ui(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function setValueV2ui(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(arraysEqual(t,e))return;n.uniform2uiv(this.addr,e),copyArray(t,e)}}function setValueV3ui(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(arraysEqual(t,e))return;n.uniform3uiv(this.addr,e),copyArray(t,e)}}function setValueV4ui(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(arraysEqual(t,e))return;n.uniform4uiv(this.addr,e),copyArray(t,e)}}function setValueT1(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let a;this.type===n.SAMPLER_2D_SHADOW?(emptyShadowTexture.compareFunction=t.isReversedDepthBuffer()?GreaterEqualCompare:LessEqualCompare,a=emptyShadowTexture):a=emptyTexture,t.setTexture2D(e||a,r)}function setValueT3D1(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||empty3dTexture,r)}function setValueT6(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||emptyCubeTexture,r)}function setValueT2DArray1(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||emptyArrayTexture,r)}function getSingularSetter(n){switch(n){case 5126:return setValueV1f;case 35664:return setValueV2f;case 35665:return setValueV3f;case 35666:return setValueV4f;case 35674:return setValueM2;case 35675:return setValueM3;case 35676:return setValueM4;case 5124:case 35670:return setValueV1i;case 35667:case 35671:return setValueV2i;case 35668:case 35672:return setValueV3i;case 35669:case 35673:return setValueV4i;case 5125:return setValueV1ui;case 36294:return setValueV2ui;case 36295:return setValueV3ui;case 36296:return setValueV4ui;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1;case 35679:case 36299:case 36307:return setValueT3D1;case 35680:case 36300:case 36308:case 36293:return setValueT6;case 36289:case 36303:case 36311:case 36292:return setValueT2DArray1}}function setValueV1fArray(n,e){n.uniform1fv(this.addr,e)}function setValueV2fArray(n,e){const t=flatten(e,this.size,2);n.uniform2fv(this.addr,t)}function setValueV3fArray(n,e){const t=flatten(e,this.size,3);n.uniform3fv(this.addr,t)}function setValueV4fArray(n,e){const t=flatten(e,this.size,4);n.uniform4fv(this.addr,t)}function setValueM2Array(n,e){const t=flatten(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function setValueM3Array(n,e){const t=flatten(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function setValueM4Array(n,e){const t=flatten(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function setValueV1iArray(n,e){n.uniform1iv(this.addr,e)}function setValueV2iArray(n,e){n.uniform2iv(this.addr,e)}function setValueV3iArray(n,e){n.uniform3iv(this.addr,e)}function setValueV4iArray(n,e){n.uniform4iv(this.addr,e)}function setValueV1uiArray(n,e){n.uniform1uiv(this.addr,e)}function setValueV2uiArray(n,e){n.uniform2uiv(this.addr,e)}function setValueV3uiArray(n,e){n.uniform3uiv(this.addr,e)}function setValueV4uiArray(n,e){n.uniform4uiv(this.addr,e)}function setValueT1Array(n,e,t){const i=this.cache,r=e.length,a=allocTexUnits(t,r);arraysEqual(i,a)||(n.uniform1iv(this.addr,a),copyArray(i,a));let o;this.type===n.SAMPLER_2D_SHADOW?o=emptyShadowTexture:o=emptyTexture;for(let s=0;s!==r;++s)t.setTexture2D(e[s]||o,a[s])}function setValueT3DArray(n,e,t){const i=this.cache,r=e.length,a=allocTexUnits(t,r);arraysEqual(i,a)||(n.uniform1iv(this.addr,a),copyArray(i,a));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||empty3dTexture,a[o])}function setValueT6Array(n,e,t){const i=this.cache,r=e.length,a=allocTexUnits(t,r);arraysEqual(i,a)||(n.uniform1iv(this.addr,a),copyArray(i,a));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||emptyCubeTexture,a[o])}function setValueT2DArrayArray(n,e,t){const i=this.cache,r=e.length,a=allocTexUnits(t,r);arraysEqual(i,a)||(n.uniform1iv(this.addr,a),copyArray(i,a));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||emptyArrayTexture,a[o])}function getPureArraySetter(n){switch(n){case 5126:return setValueV1fArray;case 35664:return setValueV2fArray;case 35665:return setValueV3fArray;case 35666:return setValueV4fArray;case 35674:return setValueM2Array;case 35675:return setValueM3Array;case 35676:return setValueM4Array;case 5124:case 35670:return setValueV1iArray;case 35667:case 35671:return setValueV2iArray;case 35668:case 35672:return setValueV3iArray;case 35669:case 35673:return setValueV4iArray;case 5125:return setValueV1uiArray;case 36294:return setValueV2uiArray;case 36295:return setValueV3uiArray;case 36296:return setValueV4uiArray;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1Array;case 35679:case 36299:case 36307:return setValueT3DArray;case 35680:case 36300:case 36308:case 36293:return setValueT6Array;case 36289:case 36303:case 36311:case 36292:return setValueT2DArrayArray}}class SingleUniform{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=getSingularSetter(t.type)}}class PureArrayUniform{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=getPureArraySetter(t.type)}}class StructuredUniform{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let a=0,o=r.length;a!==o;++a){const s=r[a];s.setValue(e,t[s.id],i)}}}const RePathPart=/(\w+)(\])?(\[|\.)?/g;function addUniform(n,e){n.seq.push(e),n.map[e.id]=e}function parseUniform(n,e,t){const i=n.name,r=i.length;for(RePathPart.lastIndex=0;;){const a=RePathPart.exec(i),o=RePathPart.lastIndex;let s=a[1];const l=a[2]==="]",c=a[3];if(l&&(s=s|0),c===void 0||c==="["&&o+2===r){addUniform(t,c===void 0?new SingleUniform(s,n,e):new PureArrayUniform(s,n,e));break}else{let f=t.map[s];f===void 0&&(f=new StructuredUniform(s),addUniform(t,f)),t=f}}}class WebGLUniforms{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=e.getActiveUniform(t,o),l=e.getUniformLocation(t,s.name);parseUniform(s,l,this)}const r=[],a=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):a.push(o);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){const a=this.map[t];a!==void 0&&a.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,o=t.length;a!==o;++a){const s=t[a],l=i[s.id];l.needsUpdate!==!1&&s.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,a=e.length;r!==a;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function WebGLShader(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const COMPLETION_STATUS_KHR=37297;let programIdCount=0;function handleSource(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let o=r;o<a;o++){const s=o+1;i.push(`${s===e?">":" "} ${s}: ${t[o]}`)}return i.join(`
`)}const _m0=new Matrix3;function getEncodingComponents(n){ColorManagement._getMatrix(_m0,ColorManagement.workingColorSpace,n);const e=`mat3( ${_m0.elements.map(t=>t.toFixed(4))} )`;switch(ColorManagement.getTransfer(n)){case LinearTransfer:return[e,"LinearTransferOETF"];case SRGBTransfer:return[e,"sRGBTransferOETF"];default:return warn("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function getShaderErrors(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const o=/ERROR: 0:(\d+)/.exec(a);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+a+`

`+handleSource(n.getShaderSource(e),s)}else return a}function getTexelEncodingFunction(n,e){const t=getEncodingComponents(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const toneMappingFunctions={[LinearToneMapping]:"Linear",[ReinhardToneMapping]:"Reinhard",[CineonToneMapping]:"Cineon",[ACESFilmicToneMapping]:"ACESFilmic",[AgXToneMapping]:"AgX",[NeutralToneMapping]:"Neutral",[CustomToneMapping]:"Custom"};function getToneMappingFunction(n,e){const t=toneMappingFunctions[e];return t===void 0?(warn("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const _v0$3=new Vector3;function getLuminanceFunction(){ColorManagement.getLuminanceCoefficients(_v0$3);const n=_v0$3.x.toFixed(4),e=_v0$3.y.toFixed(4),t=_v0$3.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function generateVertexExtensions(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(filterEmptyLine).join(`
`)}function generateDefines(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function fetchAttributeLocations(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const a=n.getActiveAttrib(e,r),o=a.name;let s=1;a.type===n.FLOAT_MAT2&&(s=2),a.type===n.FLOAT_MAT3&&(s=3),a.type===n.FLOAT_MAT4&&(s=4),t[o]={type:a.type,location:n.getAttribLocation(e,o),locationSize:s}}return t}function filterEmptyLine(n){return n!==""}function replaceLightNums(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function replaceClippingPlaneNums(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const includePattern=/^[ \t]*#include +<([\w\d./]+)>/gm;function resolveIncludes(n){return n.replace(includePattern,includeReplacer)}const shaderChunkMap=new Map;function includeReplacer(n,e){let t=ShaderChunk[e];if(t===void 0){const i=shaderChunkMap.get(e);if(i!==void 0)t=ShaderChunk[i],warn('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return resolveIncludes(t)}const unrollLoopPattern=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function unrollLoops(n){return n.replace(unrollLoopPattern,loopReplacer)}function loopReplacer(n,e,t,i){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function generatePrecision(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const shadowMapTypeDefines={[PCFShadowMap]:"SHADOWMAP_TYPE_PCF",[VSMShadowMap]:"SHADOWMAP_TYPE_VSM"};function generateShadowMapTypeDefine(n){return shadowMapTypeDefines[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const envMapTypeDefines={[CubeReflectionMapping]:"ENVMAP_TYPE_CUBE",[CubeRefractionMapping]:"ENVMAP_TYPE_CUBE",[CubeUVReflectionMapping]:"ENVMAP_TYPE_CUBE_UV"};function generateEnvMapTypeDefine(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":envMapTypeDefines[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const envMapModeDefines={[CubeRefractionMapping]:"ENVMAP_MODE_REFRACTION"};function generateEnvMapModeDefine(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":envMapModeDefines[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const envMapBlendingDefines={[MultiplyOperation]:"ENVMAP_BLENDING_MULTIPLY",[MixOperation]:"ENVMAP_BLENDING_MIX",[AddOperation]:"ENVMAP_BLENDING_ADD"};function generateEnvMapBlendingDefine(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":envMapBlendingDefines[n.combine]||"ENVMAP_BLENDING_NONE"}function generateCubeUVSize(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function WebGLProgram(n,e,t,i){const r=n.getContext(),a=t.defines;let o=t.vertexShader,s=t.fragmentShader;const l=generateShadowMapTypeDefine(t),c=generateEnvMapTypeDefine(t),d=generateEnvMapModeDefine(t),f=generateEnvMapBlendingDefine(t),u=generateCubeUVSize(t),h=generateVertexExtensions(t),_=generateDefines(a),v=r.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(filterEmptyLine).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(filterEmptyLine).join(`
`),p.length>0&&(p+=`
`)):(m=[generatePrecision(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(filterEmptyLine).join(`
`),p=[generatePrecision(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==NoToneMapping?"#define TONE_MAPPING":"",t.toneMapping!==NoToneMapping?ShaderChunk.tonemapping_pars_fragment:"",t.toneMapping!==NoToneMapping?getToneMappingFunction("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ShaderChunk.colorspace_pars_fragment,getTexelEncodingFunction("linearToOutputTexel",t.outputColorSpace),getLuminanceFunction(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(filterEmptyLine).join(`
`)),o=resolveIncludes(o),o=replaceLightNums(o,t),o=replaceClippingPlaneNums(o,t),s=resolveIncludes(s),s=replaceLightNums(s,t),s=replaceClippingPlaneNums(s,t),o=unrollLoops(o),s=unrollLoops(s),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===GLSL3?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===GLSL3?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=S+m+o,y=S+p+s,w=WebGLShader(r,r.VERTEX_SHADER,M),A=WebGLShader(r,r.FRAGMENT_SHADER,y);r.attachShader(v,w),r.attachShader(v,A),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(P){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(v)||"",F=r.getShaderInfoLog(w)||"",V=r.getShaderInfoLog(A)||"",C=B.trim(),I=F.trim(),N=V.trim();let K=!0,q=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,w,A);else{const J=getShaderErrors(r,w,"vertex"),ce=getShaderErrors(r,A,"fragment");error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+C+`
`+J+`
`+ce)}else C!==""?warn("WebGLProgram: Program Info Log:",C):(I===""||N==="")&&(q=!1);q&&(P.diagnostics={runnable:K,programLog:C,vertexShader:{log:I,prefix:m},fragmentShader:{log:N,prefix:p}})}r.deleteShader(w),r.deleteShader(A),x=new WebGLUniforms(r,v),T=fetchAttributeLocations(r,v)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let z=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=r.getProgramParameter(v,COMPLETION_STATUS_KHR)),z},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=programIdCount++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=A,this}let _id=0;class WebGLShaderCache{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new WebGLShaderStage(e),t.set(e,i)),i}}class WebGLShaderStage{constructor(e){this.id=_id++,this.code=e,this.usedTimes=0}}function WebGLPrograms(n,e,t,i,r,a){const o=new Layers,s=new WebGLShaderCache,l=new Set,c=[],d=new Map,f=i.logarithmicDepthBuffer;let u=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,T,z,P,B){const F=P.fog,V=B.geometry,C=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?P.environment:null,I=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,N=e.get(x.envMap||C,I),K=N&&N.mapping===CubeUVReflectionMapping?N.image.height:null,q=h[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&warn("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const J=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ce=J!==void 0?J.length:0;let oe=0;V.morphAttributes.position!==void 0&&(oe=1),V.morphAttributes.normal!==void 0&&(oe=2),V.morphAttributes.color!==void 0&&(oe=3);let Ee,Ne,Ve,Y;if(q){const ke=ShaderLib[q];Ee=ke.vertexShader,Ne=ke.fragmentShader}else Ee=x.vertexShader,Ne=x.fragmentShader,s.update(x),Ve=s.getVertexShaderID(x),Y=s.getFragmentShaderID(x);const ie=n.getRenderTarget(),ae=n.state.buffers.depth.getReversed(),Pe=B.isInstancedMesh===!0,Te=B.isBatchedMesh===!0,we=!!x.map,Qe=!!x.matcap,Fe=!!N,Be=!!x.aoMap,He=!!x.lightMap,De=!!x.bumpMap,Ye=!!x.normalMap,D=!!x.displacementMap,je=!!x.emissiveMap,Oe=!!x.metalnessMap,We=!!x.roughnessMap,xe=x.anisotropy>0,E=x.clearcoat>0,g=x.dispersion>0,U=x.iridescence>0,X=x.sheen>0,j=x.transmission>0,W=xe&&!!x.anisotropyMap,fe=E&&!!x.clearcoatMap,ne=E&&!!x.clearcoatNormalMap,Me=E&&!!x.clearcoatRoughnessMap,Ae=U&&!!x.iridescenceMap,Q=U&&!!x.iridescenceThicknessMap,ee=X&&!!x.sheenColorMap,pe=X&&!!x.sheenRoughnessMap,ge=!!x.specularMap,ue=!!x.specularColorMap,Le=!!x.specularIntensityMap,L=j&&!!x.transmissionMap,re=j&&!!x.thicknessMap,te=!!x.gradientMap,he=!!x.alphaMap,Z=x.alphaTest>0,$=!!x.alphaHash,me=!!x.extensions;let Ce=NoToneMapping;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ce=n.toneMapping);const qe={shaderID:q,shaderType:x.type,shaderName:x.name,vertexShader:Ee,fragmentShader:Ne,defines:x.defines,customVertexShaderID:Ve,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Te,batchingColor:Te&&B._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&B.instanceColor!==null,instancingMorph:Pe&&B.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:LinearSRGBColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:we,matcap:Qe,envMap:Fe,envMapMode:Fe&&N.mapping,envMapCubeUVHeight:K,aoMap:Be,lightMap:He,bumpMap:De,normalMap:Ye,displacementMap:D,emissiveMap:je,normalMapObjectSpace:Ye&&x.normalMapType===ObjectSpaceNormalMap,normalMapTangentSpace:Ye&&x.normalMapType===TangentSpaceNormalMap,metalnessMap:Oe,roughnessMap:We,anisotropy:xe,anisotropyMap:W,clearcoat:E,clearcoatMap:fe,clearcoatNormalMap:ne,clearcoatRoughnessMap:Me,dispersion:g,iridescence:U,iridescenceMap:Ae,iridescenceThicknessMap:Q,sheen:X,sheenColorMap:ee,sheenRoughnessMap:pe,specularMap:ge,specularColorMap:ue,specularIntensityMap:Le,transmission:j,transmissionMap:L,thicknessMap:re,gradientMap:te,opaque:x.transparent===!1&&x.blending===NormalBlending&&x.alphaToCoverage===!1,alphaMap:he,alphaTest:Z,alphaHash:$,combine:x.combine,mapUv:we&&_(x.map.channel),aoMapUv:Be&&_(x.aoMap.channel),lightMapUv:He&&_(x.lightMap.channel),bumpMapUv:De&&_(x.bumpMap.channel),normalMapUv:Ye&&_(x.normalMap.channel),displacementMapUv:D&&_(x.displacementMap.channel),emissiveMapUv:je&&_(x.emissiveMap.channel),metalnessMapUv:Oe&&_(x.metalnessMap.channel),roughnessMapUv:We&&_(x.roughnessMap.channel),anisotropyMapUv:W&&_(x.anisotropyMap.channel),clearcoatMapUv:fe&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Me&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ee&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:pe&&_(x.sheenRoughnessMap.channel),specularMapUv:ge&&_(x.specularMap.channel),specularColorMapUv:ue&&_(x.specularColorMap.channel),specularIntensityMapUv:Le&&_(x.specularIntensityMap.channel),transmissionMapUv:L&&_(x.transmissionMap.channel),thicknessMapUv:re&&_(x.thicknessMap.channel),alphaMapUv:he&&_(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Ye||xe),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!V.attributes.uv&&(we||he),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||V.attributes.normal===void 0&&Ye===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ae,skinning:B.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:oe,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&z.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ce,decodeVideoTexture:we&&x.map.isVideoTexture===!0&&ColorManagement.getTransfer(x.map.colorSpace)===SRGBTransfer,decodeVideoTextureEmissive:je&&x.emissiveMap.isVideoTexture===!0&&ColorManagement.getTransfer(x.emissiveMap.colorSpace)===SRGBTransfer,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===DoubleSide,flipSided:x.side===BackSide,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:me&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&x.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return qe.vertexUv1s=l.has(1),qe.vertexUv2s=l.has(2),qe.vertexUv3s=l.has(3),l.clear(),qe}function m(x){const T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(const z in x.defines)T.push(z),T.push(x.defines[z]);return x.isRawShaderMaterial===!1&&(p(T,x),S(T,x),T.push(n.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function p(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function S(x,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),x.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),x.push(o.mask)}function M(x){const T=h[x.type];let z;if(T){const P=ShaderLib[T];z=UniformsUtils.clone(P.uniforms)}else z=x.uniforms;return z}function y(x,T){let z=d.get(T);return z!==void 0?++z.usedTimes:(z=new WebGLProgram(n,T,x,r),c.push(z),d.set(T,z)),z}function w(x){if(--x.usedTimes===0){const T=c.indexOf(x);c[T]=c[c.length-1],c.pop(),d.delete(x.cacheKey),x.destroy()}}function A(x){s.remove(x)}function R(){s.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:M,acquireProgram:y,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:R}}function WebGLProperties(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let s=n.get(o);return s===void 0&&(s={},n.set(o,s)),s}function i(o){n.delete(o)}function r(o,s,l){n.get(o)[s]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:a}}function painterSortStable(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function reversePainterSortStable(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function WebGLRenderList(){const n=[];let e=0;const t=[],i=[],r=[];function a(){e=0,t.length=0,i.length=0,r.length=0}function o(u){let h=0;return u.isInstancedMesh&&(h+=2),u.isSkinnedMesh&&(h+=1),h}function s(u,h,_,v,m,p){let S=n[e];return S===void 0?(S={id:u.id,object:u,geometry:h,material:_,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:m,group:p},n[e]=S):(S.id=u.id,S.object=u,S.geometry=h,S.material=_,S.materialVariant=o(u),S.groupOrder=v,S.renderOrder=u.renderOrder,S.z=m,S.group=p),e++,S}function l(u,h,_,v,m,p){const S=s(u,h,_,v,m,p);_.transmission>0?i.push(S):_.transparent===!0?r.push(S):t.push(S)}function c(u,h,_,v,m,p){const S=s(u,h,_,v,m,p);_.transmission>0?i.unshift(S):_.transparent===!0?r.unshift(S):t.unshift(S)}function d(u,h){t.length>1&&t.sort(u||painterSortStable),i.length>1&&i.sort(h||reversePainterSortStable),r.length>1&&r.sort(h||reversePainterSortStable)}function f(){for(let u=e,h=n.length;u<h;u++){const _=n[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:r,init:a,push:l,unshift:c,finish:f,sort:d}}function WebGLRenderLists(){let n=new WeakMap;function e(i,r){const a=n.get(i);let o;return a===void 0?(o=new WebGLRenderList,n.set(i,[o])):r>=a.length?(o=new WebGLRenderList,a.push(o)):o=a[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function UniformsCache(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Vector3,color:new Color};break;case"SpotLight":t={position:new Vector3,direction:new Vector3,color:new Color,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Vector3,color:new Color,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Vector3,skyColor:new Color,groundColor:new Color};break;case"RectAreaLight":t={color:new Color,position:new Vector3,halfWidth:new Vector3,halfHeight:new Vector3};break}return n[e.id]=t,t}}}function ShadowUniformsCache(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let nextVersion=0;function shadowCastingAndTexturingLightsFirst(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function WebGLLights(n){const e=new UniformsCache,t=ShadowUniformsCache(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new Vector3);const r=new Vector3,a=new Matrix4,o=new Matrix4;function s(c){let d=0,f=0,u=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let h=0,_=0,v=0,m=0,p=0,S=0,M=0,y=0,w=0,A=0,R=0;c.sort(shadowCastingAndTexturingLightsFirst);for(let T=0,z=c.length;T<z;T++){const P=c[T],B=P.color,F=P.intensity,V=P.distance;let C=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===RGFormat?C=P.shadow.map.texture:C=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=B.r*F,f+=B.g*F,u+=B.b*F;else if(P.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(P.sh.coefficients[I],F);R++}else if(P.isDirectionalLight){const I=e.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const N=P.shadow,K=t.get(P);K.shadowIntensity=N.intensity,K.shadowBias=N.bias,K.shadowNormalBias=N.normalBias,K.shadowRadius=N.radius,K.shadowMapSize=N.mapSize,i.directionalShadow[h]=K,i.directionalShadowMap[h]=C,i.directionalShadowMatrix[h]=P.shadow.matrix,S++}i.directional[h]=I,h++}else if(P.isSpotLight){const I=e.get(P);I.position.setFromMatrixPosition(P.matrixWorld),I.color.copy(B).multiplyScalar(F),I.distance=V,I.coneCos=Math.cos(P.angle),I.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),I.decay=P.decay,i.spot[v]=I;const N=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,N.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[v]=N.matrix,P.castShadow){const K=t.get(P);K.shadowIntensity=N.intensity,K.shadowBias=N.bias,K.shadowNormalBias=N.normalBias,K.shadowRadius=N.radius,K.shadowMapSize=N.mapSize,i.spotShadow[v]=K,i.spotShadowMap[v]=C,y++}v++}else if(P.isRectAreaLight){const I=e.get(P);I.color.copy(B).multiplyScalar(F),I.halfWidth.set(P.width*.5,0,0),I.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=I,m++}else if(P.isPointLight){const I=e.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),I.distance=P.distance,I.decay=P.decay,P.castShadow){const N=P.shadow,K=t.get(P);K.shadowIntensity=N.intensity,K.shadowBias=N.bias,K.shadowNormalBias=N.normalBias,K.shadowRadius=N.radius,K.shadowMapSize=N.mapSize,K.shadowCameraNear=N.camera.near,K.shadowCameraFar=N.camera.far,i.pointShadow[_]=K,i.pointShadowMap[_]=C,i.pointShadowMatrix[_]=P.shadow.matrix,M++}i.point[_]=I,_++}else if(P.isHemisphereLight){const I=e.get(P);I.skyColor.copy(P.color).multiplyScalar(F),I.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[p]=I,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=UniformsLib.LTC_FLOAT_1,i.rectAreaLTC2=UniformsLib.LTC_FLOAT_2):(i.rectAreaLTC1=UniformsLib.LTC_HALF_1,i.rectAreaLTC2=UniformsLib.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=u;const x=i.hash;(x.directionalLength!==h||x.pointLength!==_||x.spotLength!==v||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==S||x.numPointShadows!==M||x.numSpotShadows!==y||x.numSpotMaps!==w||x.numLightProbes!==R)&&(i.directional.length=h,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=y+w-A,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,x.directionalLength=h,x.pointLength=_,x.spotLength=v,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=S,x.numPointShadows=M,x.numSpotShadows=y,x.numSpotMaps=w,x.numLightProbes=R,i.version=nextVersion++)}function l(c,d){let f=0,u=0,h=0,_=0,v=0;const m=d.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const M=c[p];if(M.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(M.isSpotLight){const y=i.spot[h];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(M.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),o.identity(),a.copy(M.matrixWorld),a.premultiply(m),o.extractRotation(a),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const y=i.point[u];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),u++}else if(M.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:s,setupView:l,state:i}}function WebGLRenderState(n){const e=new WebGLLights(n),t=[],i=[];function r(d){c.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function o(d){i.push(d)}function s(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:s,setupLightsView:l,pushLight:a,pushShadow:o}}function WebGLRenderStates(n){let e=new WeakMap;function t(r,a=0){const o=e.get(r);let s;return o===void 0?(s=new WebGLRenderState(n),e.set(r,[s])):a>=o.length?(s=new WebGLRenderState(n),o.push(s)):s=o[a],s}function i(){e=new WeakMap}return{get:t,dispose:i}}const vertex=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragment=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_cubeDirections=[new Vector3(1,0,0),new Vector3(-1,0,0),new Vector3(0,1,0),new Vector3(0,-1,0),new Vector3(0,0,1),new Vector3(0,0,-1)],_cubeUps=[new Vector3(0,-1,0),new Vector3(0,-1,0),new Vector3(0,0,1),new Vector3(0,0,-1),new Vector3(0,-1,0),new Vector3(0,-1,0)],_projScreenMatrix=new Matrix4,_lightPositionWorld=new Vector3,_lookTarget=new Vector3;function WebGLShadowMap(n,e,t){let i=new Frustum;const r=new Vector2,a=new Vector2,o=new Vector4,s=new MeshDepthMaterial,l=new MeshDistanceMaterial,c={},d=t.maxTextureSize,f={[FrontSide]:BackSide,[BackSide]:FrontSide,[DoubleSide]:DoubleSide},u=new ShaderMaterial({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vector2},radius:{value:4}},vertexShader:vertex,fragmentShader:fragment}),h=u.clone();h.defines.HORIZONTAL_PASS=1;const _=new BufferGeometry;_.setAttribute("position",new BufferAttribute(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Mesh(_,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=PCFShadowMap;let p=this.type;this.render=function(A,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;this.type===PCFSoftShadowMap&&(warn("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=PCFShadowMap);const T=n.getRenderTarget(),z=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),B=n.state;B.setBlending(NoBlending),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const F=p!==this.type;F&&R.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(C=>C.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,C=A.length;V<C;V++){const I=A[V],N=I.shadow;if(N===void 0){warn("WebGLShadowMap:",I,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const K=N.getFrameExtents();r.multiply(K),a.copy(N.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(a.x=Math.floor(d/K.x),r.x=a.x*K.x,N.mapSize.x=a.x),r.y>d&&(a.y=Math.floor(d/K.y),r.y=a.y*K.y,N.mapSize.y=a.y));const q=n.state.buffers.depth.getReversed();if(N.camera._reversedDepth=q,N.map===null||F===!0){if(N.map!==null&&(N.map.depthTexture!==null&&(N.map.depthTexture.dispose(),N.map.depthTexture=null),N.map.dispose()),this.type===VSMShadowMap){if(I.isPointLight){warn("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}N.map=new WebGLRenderTarget(r.x,r.y,{format:RGFormat,type:HalfFloatType,minFilter:LinearFilter,magFilter:LinearFilter,generateMipmaps:!1}),N.map.texture.name=I.name+".shadowMap",N.map.depthTexture=new DepthTexture(r.x,r.y,FloatType),N.map.depthTexture.name=I.name+".shadowMapDepth",N.map.depthTexture.format=DepthFormat,N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=NearestFilter,N.map.depthTexture.magFilter=NearestFilter}else I.isPointLight?(N.map=new WebGLCubeRenderTarget(r.x),N.map.depthTexture=new CubeDepthTexture(r.x,UnsignedIntType)):(N.map=new WebGLRenderTarget(r.x,r.y),N.map.depthTexture=new DepthTexture(r.x,r.y,UnsignedIntType)),N.map.depthTexture.name=I.name+".shadowMap",N.map.depthTexture.format=DepthFormat,this.type===PCFShadowMap?(N.map.depthTexture.compareFunction=q?GreaterEqualCompare:LessEqualCompare,N.map.depthTexture.minFilter=LinearFilter,N.map.depthTexture.magFilter=LinearFilter):(N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=NearestFilter,N.map.depthTexture.magFilter=NearestFilter);N.camera.updateProjectionMatrix()}const J=N.map.isWebGLCubeRenderTarget?6:1;for(let ce=0;ce<J;ce++){if(N.map.isWebGLCubeRenderTarget)n.setRenderTarget(N.map,ce),n.clear();else{ce===0&&(n.setRenderTarget(N.map),n.clear());const oe=N.getViewport(ce);o.set(a.x*oe.x,a.y*oe.y,a.x*oe.z,a.y*oe.w),B.viewport(o)}if(I.isPointLight){const oe=N.camera,Ee=N.matrix,Ne=I.distance||oe.far;Ne!==oe.far&&(oe.far=Ne,oe.updateProjectionMatrix()),_lightPositionWorld.setFromMatrixPosition(I.matrixWorld),oe.position.copy(_lightPositionWorld),_lookTarget.copy(oe.position),_lookTarget.add(_cubeDirections[ce]),oe.up.copy(_cubeUps[ce]),oe.lookAt(_lookTarget),oe.updateMatrixWorld(),Ee.makeTranslation(-_lightPositionWorld.x,-_lightPositionWorld.y,-_lightPositionWorld.z),_projScreenMatrix.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),N._frustum.setFromProjectionMatrix(_projScreenMatrix,oe.coordinateSystem,oe.reversedDepth)}else N.updateMatrices(I);i=N.getFrustum(),y(R,x,N.camera,I,this.type)}N.isPointLightShadow!==!0&&this.type===VSMShadowMap&&S(N,x),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(T,z,P)};function S(A,R){const x=e.update(v);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,h.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,h.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new WebGLRenderTarget(r.x,r.y,{format:RGFormat,type:HalfFloatType})),u.uniforms.shadow_pass.value=A.map.depthTexture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(R,null,x,u,v,null),h.uniforms.shadow_pass.value=A.mapPass.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(R,null,x,h,v,null)}function M(A,R,x,T){let z=null;const P=x.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)z=P;else if(z=x.isPointLight===!0?l:s,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const B=z.uuid,F=R.uuid;let V=c[B];V===void 0&&(V={},c[B]=V);let C=V[F];C===void 0&&(C=z.clone(),V[F]=C,R.addEventListener("dispose",w)),z=C}if(z.visible=R.visible,z.wireframe=R.wireframe,T===VSMShadowMap?z.side=R.shadowSide!==null?R.shadowSide:R.side:z.side=R.shadowSide!==null?R.shadowSide:f[R.side],z.alphaMap=R.alphaMap,z.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,z.map=R.map,z.clipShadows=R.clipShadows,z.clippingPlanes=R.clippingPlanes,z.clipIntersection=R.clipIntersection,z.displacementMap=R.displacementMap,z.displacementScale=R.displacementScale,z.displacementBias=R.displacementBias,z.wireframeLinewidth=R.wireframeLinewidth,z.linewidth=R.linewidth,x.isPointLight===!0&&z.isMeshDistanceMaterial===!0){const B=n.properties.get(z);B.light=x}return z}function y(A,R,x,T,z){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&z===VSMShadowMap)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,A.matrixWorld);const F=e.update(A),V=A.material;if(Array.isArray(V)){const C=F.groups;for(let I=0,N=C.length;I<N;I++){const K=C[I],q=V[K.materialIndex];if(q&&q.visible){const J=M(A,q,T,z);A.onBeforeShadow(n,A,R,x,F,J,K),n.renderBufferDirect(x,null,F,J,A,K),A.onAfterShadow(n,A,R,x,F,J,K)}}}else if(V.visible){const C=M(A,V,T,z);A.onBeforeShadow(n,A,R,x,F,C,null),n.renderBufferDirect(x,null,F,C,A,null),A.onAfterShadow(n,A,R,x,F,C,null)}}const B=A.children;for(let F=0,V=B.length;F<V;F++)y(B[F],R,x,T,z)}function w(A){A.target.removeEventListener("dispose",w);for(const x in c){const T=c[x],z=A.target.uuid;z in T&&(T[z].dispose(),delete T[z])}}}function WebGLState(n,e){function t(){let L=!1;const re=new Vector4;let te=null;const he=new Vector4(0,0,0,0);return{setMask:function(Z){te!==Z&&!L&&(n.colorMask(Z,Z,Z,Z),te=Z)},setLocked:function(Z){L=Z},setClear:function(Z,$,me,Ce,qe){qe===!0&&(Z*=Ce,$*=Ce,me*=Ce),re.set(Z,$,me,Ce),he.equals(re)===!1&&(n.clearColor(Z,$,me,Ce),he.copy(re))},reset:function(){L=!1,te=null,he.set(-1,0,0,0)}}}function i(){let L=!1,re=!1,te=null,he=null,Z=null;return{setReversed:function($){if(re!==$){const me=e.get("EXT_clip_control");$?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),re=$;const Ce=Z;Z=null,this.setClear(Ce)}},getReversed:function(){return re},setTest:function($){$?ie(n.DEPTH_TEST):ae(n.DEPTH_TEST)},setMask:function($){te!==$&&!L&&(n.depthMask($),te=$)},setFunc:function($){if(re&&($=ReversedDepthFuncs[$]),he!==$){switch($){case NeverDepth:n.depthFunc(n.NEVER);break;case AlwaysDepth:n.depthFunc(n.ALWAYS);break;case LessDepth:n.depthFunc(n.LESS);break;case LessEqualDepth:n.depthFunc(n.LEQUAL);break;case EqualDepth:n.depthFunc(n.EQUAL);break;case GreaterEqualDepth:n.depthFunc(n.GEQUAL);break;case GreaterDepth:n.depthFunc(n.GREATER);break;case NotEqualDepth:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}he=$}},setLocked:function($){L=$},setClear:function($){Z!==$&&(Z=$,re&&($=1-$),n.clearDepth($))},reset:function(){L=!1,te=null,he=null,Z=null,re=!1}}}function r(){let L=!1,re=null,te=null,he=null,Z=null,$=null,me=null,Ce=null,qe=null;return{setTest:function(ke){L||(ke?ie(n.STENCIL_TEST):ae(n.STENCIL_TEST))},setMask:function(ke){re!==ke&&!L&&(n.stencilMask(ke),re=ke)},setFunc:function(ke,rt,at){(te!==ke||he!==rt||Z!==at)&&(n.stencilFunc(ke,rt,at),te=ke,he=rt,Z=at)},setOp:function(ke,rt,at){($!==ke||me!==rt||Ce!==at)&&(n.stencilOp(ke,rt,at),$=ke,me=rt,Ce=at)},setLocked:function(ke){L=ke},setClear:function(ke){qe!==ke&&(n.clearStencil(ke),qe=ke)},reset:function(){L=!1,re=null,te=null,he=null,Z=null,$=null,me=null,Ce=null,qe=null}}}const a=new t,o=new i,s=new r,l=new WeakMap,c=new WeakMap;let d={},f={},u=new WeakMap,h=[],_=null,v=!1,m=null,p=null,S=null,M=null,y=null,w=null,A=null,R=new Color(0,0,0),x=0,T=!1,z=null,P=null,B=null,F=null,V=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,N=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(N=parseFloat(/^WebGL (\d)/.exec(K)[1]),I=N>=1):K.indexOf("OpenGL ES")!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),I=N>=2);let q=null,J={};const ce=n.getParameter(n.SCISSOR_BOX),oe=n.getParameter(n.VIEWPORT),Ee=new Vector4().fromArray(ce),Ne=new Vector4().fromArray(oe);function Ve(L,re,te,he){const Z=new Uint8Array(4),$=n.createTexture();n.bindTexture(L,$),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let me=0;me<te;me++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(re,0,n.RGBA,1,1,he,0,n.RGBA,n.UNSIGNED_BYTE,Z):n.texImage2D(re+me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Z);return $}const Y={};Y[n.TEXTURE_2D]=Ve(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ve(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ve(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ve(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ie(n.DEPTH_TEST),o.setFunc(LessEqualDepth),De(!1),Ye(CullFaceBack),ie(n.CULL_FACE),Be(NoBlending);function ie(L){d[L]!==!0&&(n.enable(L),d[L]=!0)}function ae(L){d[L]!==!1&&(n.disable(L),d[L]=!1)}function Pe(L,re){return f[L]!==re?(n.bindFramebuffer(L,re),f[L]=re,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=re),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=re),!0):!1}function Te(L,re){let te=h,he=!1;if(L){te=u.get(re),te===void 0&&(te=[],u.set(re,te));const Z=L.textures;if(te.length!==Z.length||te[0]!==n.COLOR_ATTACHMENT0){for(let $=0,me=Z.length;$<me;$++)te[$]=n.COLOR_ATTACHMENT0+$;te.length=Z.length,he=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,he=!0);he&&n.drawBuffers(te)}function we(L){return _!==L?(n.useProgram(L),_=L,!0):!1}const Qe={[AddEquation]:n.FUNC_ADD,[SubtractEquation]:n.FUNC_SUBTRACT,[ReverseSubtractEquation]:n.FUNC_REVERSE_SUBTRACT};Qe[MinEquation]=n.MIN,Qe[MaxEquation]=n.MAX;const Fe={[ZeroFactor]:n.ZERO,[OneFactor]:n.ONE,[SrcColorFactor]:n.SRC_COLOR,[SrcAlphaFactor]:n.SRC_ALPHA,[SrcAlphaSaturateFactor]:n.SRC_ALPHA_SATURATE,[DstColorFactor]:n.DST_COLOR,[DstAlphaFactor]:n.DST_ALPHA,[OneMinusSrcColorFactor]:n.ONE_MINUS_SRC_COLOR,[OneMinusSrcAlphaFactor]:n.ONE_MINUS_SRC_ALPHA,[OneMinusDstColorFactor]:n.ONE_MINUS_DST_COLOR,[OneMinusDstAlphaFactor]:n.ONE_MINUS_DST_ALPHA,[ConstantColorFactor]:n.CONSTANT_COLOR,[OneMinusConstantColorFactor]:n.ONE_MINUS_CONSTANT_COLOR,[ConstantAlphaFactor]:n.CONSTANT_ALPHA,[OneMinusConstantAlphaFactor]:n.ONE_MINUS_CONSTANT_ALPHA};function Be(L,re,te,he,Z,$,me,Ce,qe,ke){if(L===NoBlending){v===!0&&(ae(n.BLEND),v=!1);return}if(v===!1&&(ie(n.BLEND),v=!0),L!==CustomBlending){if(L!==m||ke!==T){if((p!==AddEquation||y!==AddEquation)&&(n.blendEquation(n.FUNC_ADD),p=AddEquation,y=AddEquation),ke)switch(L){case NormalBlending:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:n.blendFunc(n.ONE,n.ONE);break;case SubtractiveBlending:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case MultiplyBlending:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:error("WebGLState: Invalid blending: ",L);break}else switch(L){case NormalBlending:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case SubtractiveBlending:error("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case MultiplyBlending:error("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:error("WebGLState: Invalid blending: ",L);break}S=null,M=null,w=null,A=null,R.set(0,0,0),x=0,m=L,T=ke}return}Z=Z||re,$=$||te,me=me||he,(re!==p||Z!==y)&&(n.blendEquationSeparate(Qe[re],Qe[Z]),p=re,y=Z),(te!==S||he!==M||$!==w||me!==A)&&(n.blendFuncSeparate(Fe[te],Fe[he],Fe[$],Fe[me]),S=te,M=he,w=$,A=me),(Ce.equals(R)===!1||qe!==x)&&(n.blendColor(Ce.r,Ce.g,Ce.b,qe),R.copy(Ce),x=qe),m=L,T=!1}function He(L,re){L.side===DoubleSide?ae(n.CULL_FACE):ie(n.CULL_FACE);let te=L.side===BackSide;re&&(te=!te),De(te),L.blending===NormalBlending&&L.transparent===!1?Be(NoBlending):Be(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),a.setMask(L.colorWrite);const he=L.stencilWrite;s.setTest(he),he&&(s.setMask(L.stencilWriteMask),s.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),s.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),je(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function De(L){z!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),z=L)}function Ye(L){L!==CullFaceNone?(ie(n.CULL_FACE),L!==P&&(L===CullFaceBack?n.cullFace(n.BACK):L===CullFaceFront?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ae(n.CULL_FACE),P=L}function D(L){L!==B&&(I&&n.lineWidth(L),B=L)}function je(L,re,te){L?(ie(n.POLYGON_OFFSET_FILL),(F!==re||V!==te)&&(F=re,V=te,o.getReversed()&&(re=-re),n.polygonOffset(re,te))):ae(n.POLYGON_OFFSET_FILL)}function Oe(L){L?ie(n.SCISSOR_TEST):ae(n.SCISSOR_TEST)}function We(L){L===void 0&&(L=n.TEXTURE0+C-1),q!==L&&(n.activeTexture(L),q=L)}function xe(L,re,te){te===void 0&&(q===null?te=n.TEXTURE0+C-1:te=q);let he=J[te];he===void 0&&(he={type:void 0,texture:void 0},J[te]=he),(he.type!==L||he.texture!==re)&&(q!==te&&(n.activeTexture(te),q=te),n.bindTexture(L,re||Y[L]),he.type=L,he.texture=re)}function E(){const L=J[q];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function g(){try{n.compressedTexImage2D(...arguments)}catch(L){error("WebGLState:",L)}}function U(){try{n.compressedTexImage3D(...arguments)}catch(L){error("WebGLState:",L)}}function X(){try{n.texSubImage2D(...arguments)}catch(L){error("WebGLState:",L)}}function j(){try{n.texSubImage3D(...arguments)}catch(L){error("WebGLState:",L)}}function W(){try{n.compressedTexSubImage2D(...arguments)}catch(L){error("WebGLState:",L)}}function fe(){try{n.compressedTexSubImage3D(...arguments)}catch(L){error("WebGLState:",L)}}function ne(){try{n.texStorage2D(...arguments)}catch(L){error("WebGLState:",L)}}function Me(){try{n.texStorage3D(...arguments)}catch(L){error("WebGLState:",L)}}function Ae(){try{n.texImage2D(...arguments)}catch(L){error("WebGLState:",L)}}function Q(){try{n.texImage3D(...arguments)}catch(L){error("WebGLState:",L)}}function ee(L){Ee.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Ee.copy(L))}function pe(L){Ne.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Ne.copy(L))}function ge(L,re){let te=c.get(re);te===void 0&&(te=new WeakMap,c.set(re,te));let he=te.get(L);he===void 0&&(he=n.getUniformBlockIndex(re,L.name),te.set(L,he))}function ue(L,re){const he=c.get(re).get(L);l.get(re)!==he&&(n.uniformBlockBinding(re,he,L.__bindingPointIndex),l.set(re,he))}function Le(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},q=null,J={},f={},u=new WeakMap,h=[],_=null,v=!1,m=null,p=null,S=null,M=null,y=null,w=null,A=null,R=new Color(0,0,0),x=0,T=!1,z=null,P=null,B=null,F=null,V=null,Ee.set(0,0,n.canvas.width,n.canvas.height),Ne.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ie,disable:ae,bindFramebuffer:Pe,drawBuffers:Te,useProgram:we,setBlending:Be,setMaterial:He,setFlipSided:De,setCullFace:Ye,setLineWidth:D,setPolygonOffset:je,setScissorTest:Oe,activeTexture:We,bindTexture:xe,unbindTexture:E,compressedTexImage2D:g,compressedTexImage3D:U,texImage2D:Ae,texImage3D:Q,updateUBOMapping:ge,uniformBlockBinding:ue,texStorage2D:ne,texStorage3D:Me,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:fe,scissor:ee,viewport:pe,reset:Le}}function WebGLTextures(n,e,t,i,r,a,o){const s=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Vector2,d=new WeakMap;let f;const u=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,g){return h?new OffscreenCanvas(E,g):createElementNS("canvas")}function v(E,g,U){let X=1;const j=xe(E);if((j.width>U||j.height>U)&&(X=U/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const W=Math.floor(X*j.width),fe=Math.floor(X*j.height);f===void 0&&(f=_(W,fe));const ne=g?_(W,fe):f;return ne.width=W,ne.height=fe,ne.getContext("2d").drawImage(E,0,0,W,fe),warn("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+fe+")."),ne}else return"data"in E&&warn("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),E;return E}function m(E){return E.generateMipmaps}function p(E){n.generateMipmap(E)}function S(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(E,g,U,X,j=!1){if(E!==null){if(n[E]!==void 0)return n[E];warn("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let W=g;if(g===n.RED&&(U===n.FLOAT&&(W=n.R32F),U===n.HALF_FLOAT&&(W=n.R16F),U===n.UNSIGNED_BYTE&&(W=n.R8)),g===n.RED_INTEGER&&(U===n.UNSIGNED_BYTE&&(W=n.R8UI),U===n.UNSIGNED_SHORT&&(W=n.R16UI),U===n.UNSIGNED_INT&&(W=n.R32UI),U===n.BYTE&&(W=n.R8I),U===n.SHORT&&(W=n.R16I),U===n.INT&&(W=n.R32I)),g===n.RG&&(U===n.FLOAT&&(W=n.RG32F),U===n.HALF_FLOAT&&(W=n.RG16F),U===n.UNSIGNED_BYTE&&(W=n.RG8)),g===n.RG_INTEGER&&(U===n.UNSIGNED_BYTE&&(W=n.RG8UI),U===n.UNSIGNED_SHORT&&(W=n.RG16UI),U===n.UNSIGNED_INT&&(W=n.RG32UI),U===n.BYTE&&(W=n.RG8I),U===n.SHORT&&(W=n.RG16I),U===n.INT&&(W=n.RG32I)),g===n.RGB_INTEGER&&(U===n.UNSIGNED_BYTE&&(W=n.RGB8UI),U===n.UNSIGNED_SHORT&&(W=n.RGB16UI),U===n.UNSIGNED_INT&&(W=n.RGB32UI),U===n.BYTE&&(W=n.RGB8I),U===n.SHORT&&(W=n.RGB16I),U===n.INT&&(W=n.RGB32I)),g===n.RGBA_INTEGER&&(U===n.UNSIGNED_BYTE&&(W=n.RGBA8UI),U===n.UNSIGNED_SHORT&&(W=n.RGBA16UI),U===n.UNSIGNED_INT&&(W=n.RGBA32UI),U===n.BYTE&&(W=n.RGBA8I),U===n.SHORT&&(W=n.RGBA16I),U===n.INT&&(W=n.RGBA32I)),g===n.RGB&&(U===n.UNSIGNED_INT_5_9_9_9_REV&&(W=n.RGB9_E5),U===n.UNSIGNED_INT_10F_11F_11F_REV&&(W=n.R11F_G11F_B10F)),g===n.RGBA){const fe=j?LinearTransfer:ColorManagement.getTransfer(X);U===n.FLOAT&&(W=n.RGBA32F),U===n.HALF_FLOAT&&(W=n.RGBA16F),U===n.UNSIGNED_BYTE&&(W=fe===SRGBTransfer?n.SRGB8_ALPHA8:n.RGBA8),U===n.UNSIGNED_SHORT_4_4_4_4&&(W=n.RGBA4),U===n.UNSIGNED_SHORT_5_5_5_1&&(W=n.RGB5_A1)}return(W===n.R16F||W===n.R32F||W===n.RG16F||W===n.RG32F||W===n.RGBA16F||W===n.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function y(E,g){let U;return E?g===null||g===UnsignedIntType||g===UnsignedInt248Type?U=n.DEPTH24_STENCIL8:g===FloatType?U=n.DEPTH32F_STENCIL8:g===UnsignedShortType&&(U=n.DEPTH24_STENCIL8,warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===UnsignedIntType||g===UnsignedInt248Type?U=n.DEPTH_COMPONENT24:g===FloatType?U=n.DEPTH_COMPONENT32F:g===UnsignedShortType&&(U=n.DEPTH_COMPONENT16),U}function w(E,g){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==NearestFilter&&E.minFilter!==LinearFilter?Math.log2(Math.max(g.width,g.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?g.mipmaps.length:1}function A(E){const g=E.target;g.removeEventListener("dispose",A),x(g),g.isVideoTexture&&d.delete(g)}function R(E){const g=E.target;g.removeEventListener("dispose",R),z(g)}function x(E){const g=i.get(E);if(g.__webglInit===void 0)return;const U=E.source,X=u.get(U);if(X){const j=X[g.__cacheKey];j.usedTimes--,j.usedTimes===0&&T(E),Object.keys(X).length===0&&u.delete(U)}i.remove(E)}function T(E){const g=i.get(E);n.deleteTexture(g.__webglTexture);const U=E.source,X=u.get(U);delete X[g.__cacheKey],o.memory.textures--}function z(E){const g=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let j=0;j<g.__webglFramebuffer[X].length;j++)n.deleteFramebuffer(g.__webglFramebuffer[X][j]);else n.deleteFramebuffer(g.__webglFramebuffer[X]);g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)n.deleteFramebuffer(g.__webglFramebuffer[X]);else n.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&n.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let X=0;X<g.__webglColorRenderbuffer.length;X++)g.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(g.__webglColorRenderbuffer[X]);g.__webglDepthRenderbuffer&&n.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const U=E.textures;for(let X=0,j=U.length;X<j;X++){const W=i.get(U[X]);W.__webglTexture&&(n.deleteTexture(W.__webglTexture),o.memory.textures--),i.remove(U[X])}i.remove(E)}let P=0;function B(){P=0}function F(){const E=P;return E>=r.maxTextures&&warn("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),P+=1,E}function V(E){const g=[];return g.push(E.wrapS),g.push(E.wrapT),g.push(E.wrapR||0),g.push(E.magFilter),g.push(E.minFilter),g.push(E.anisotropy),g.push(E.internalFormat),g.push(E.format),g.push(E.type),g.push(E.generateMipmaps),g.push(E.premultiplyAlpha),g.push(E.flipY),g.push(E.unpackAlignment),g.push(E.colorSpace),g.join()}function C(E,g){const U=i.get(E);if(E.isVideoTexture&&Oe(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&U.__version!==E.version){const X=E.image;if(X===null)warn("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)warn("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(U,E,g);return}}else E.isExternalTexture&&(U.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,U.__webglTexture,n.TEXTURE0+g)}function I(E,g){const U=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&U.__version!==E.version){Y(U,E,g);return}else E.isExternalTexture&&(U.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,U.__webglTexture,n.TEXTURE0+g)}function N(E,g){const U=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&U.__version!==E.version){Y(U,E,g);return}t.bindTexture(n.TEXTURE_3D,U.__webglTexture,n.TEXTURE0+g)}function K(E,g){const U=i.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&U.__version!==E.version){ie(U,E,g);return}t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+g)}const q={[RepeatWrapping]:n.REPEAT,[ClampToEdgeWrapping]:n.CLAMP_TO_EDGE,[MirroredRepeatWrapping]:n.MIRRORED_REPEAT},J={[NearestFilter]:n.NEAREST,[NearestMipmapNearestFilter]:n.NEAREST_MIPMAP_NEAREST,[NearestMipmapLinearFilter]:n.NEAREST_MIPMAP_LINEAR,[LinearFilter]:n.LINEAR,[LinearMipmapNearestFilter]:n.LINEAR_MIPMAP_NEAREST,[LinearMipmapLinearFilter]:n.LINEAR_MIPMAP_LINEAR},ce={[NeverCompare]:n.NEVER,[AlwaysCompare]:n.ALWAYS,[LessCompare]:n.LESS,[LessEqualCompare]:n.LEQUAL,[EqualCompare]:n.EQUAL,[GreaterEqualCompare]:n.GEQUAL,[GreaterCompare]:n.GREATER,[NotEqualCompare]:n.NOTEQUAL};function oe(E,g){if(g.type===FloatType&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===LinearFilter||g.magFilter===LinearMipmapNearestFilter||g.magFilter===NearestMipmapLinearFilter||g.magFilter===LinearMipmapLinearFilter||g.minFilter===LinearFilter||g.minFilter===LinearMipmapNearestFilter||g.minFilter===NearestMipmapLinearFilter||g.minFilter===LinearMipmapLinearFilter)&&warn("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,q[g.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,q[g.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,q[g.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,J[g.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,J[g.minFilter]),g.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,ce[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===NearestFilter||g.minFilter!==NearestMipmapLinearFilter&&g.minFilter!==LinearMipmapLinearFilter||g.type===FloatType&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");n.texParameterf(E,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function Ee(E,g){let U=!1;E.__webglInit===void 0&&(E.__webglInit=!0,g.addEventListener("dispose",A));const X=g.source;let j=u.get(X);j===void 0&&(j={},u.set(X,j));const W=V(g);if(W!==E.__cacheKey){j[W]===void 0&&(j[W]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,U=!0),j[W].usedTimes++;const fe=j[E.__cacheKey];fe!==void 0&&(j[E.__cacheKey].usedTimes--,fe.usedTimes===0&&T(g)),E.__cacheKey=W,E.__webglTexture=j[W].texture}return U}function Ne(E,g,U){return Math.floor(Math.floor(E/U)/g)}function Ve(E,g,U,X){const W=E.updateRanges;if(W.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,g.width,g.height,U,X,g.data);else{W.sort((Q,ee)=>Q.start-ee.start);let fe=0;for(let Q=1;Q<W.length;Q++){const ee=W[fe],pe=W[Q],ge=ee.start+ee.count,ue=Ne(pe.start,g.width,4),Le=Ne(ee.start,g.width,4);pe.start<=ge+1&&ue===Le&&Ne(pe.start+pe.count-1,g.width,4)===ue?ee.count=Math.max(ee.count,pe.start+pe.count-ee.start):(++fe,W[fe]=pe)}W.length=fe+1;const ne=n.getParameter(n.UNPACK_ROW_LENGTH),Me=n.getParameter(n.UNPACK_SKIP_PIXELS),Ae=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,g.width);for(let Q=0,ee=W.length;Q<ee;Q++){const pe=W[Q],ge=Math.floor(pe.start/4),ue=Math.ceil(pe.count/4),Le=ge%g.width,L=Math.floor(ge/g.width),re=ue,te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Le),n.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,Le,L,re,te,U,X,g.data)}E.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ne),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Me),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ae)}}function Y(E,g,U){let X=n.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),g.isData3DTexture&&(X=n.TEXTURE_3D);const j=Ee(E,g),W=g.source;t.bindTexture(X,E.__webglTexture,n.TEXTURE0+U);const fe=i.get(W);if(W.version!==fe.__version||j===!0){t.activeTexture(n.TEXTURE0+U);const ne=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),Me=g.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(g.colorSpace),Ae=g.colorSpace===NoColorSpace||ne===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let Q=v(g.image,!1,r.maxTextureSize);Q=We(g,Q);const ee=a.convert(g.format,g.colorSpace),pe=a.convert(g.type);let ge=M(g.internalFormat,ee,pe,g.colorSpace,g.isVideoTexture);oe(X,g);let ue;const Le=g.mipmaps,L=g.isVideoTexture!==!0,re=fe.__version===void 0||j===!0,te=W.dataReady,he=w(g,Q);if(g.isDepthTexture)ge=y(g.format===DepthStencilFormat,g.type),re&&(L?t.texStorage2D(n.TEXTURE_2D,1,ge,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,ge,Q.width,Q.height,0,ee,pe,null));else if(g.isDataTexture)if(Le.length>0){L&&re&&t.texStorage2D(n.TEXTURE_2D,he,ge,Le[0].width,Le[0].height);for(let Z=0,$=Le.length;Z<$;Z++)ue=Le[Z],L?te&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,ue.width,ue.height,ee,pe,ue.data):t.texImage2D(n.TEXTURE_2D,Z,ge,ue.width,ue.height,0,ee,pe,ue.data);g.generateMipmaps=!1}else L?(re&&t.texStorage2D(n.TEXTURE_2D,he,ge,Q.width,Q.height),te&&Ve(g,Q,ee,pe)):t.texImage2D(n.TEXTURE_2D,0,ge,Q.width,Q.height,0,ee,pe,Q.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){L&&re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,ge,Le[0].width,Le[0].height,Q.depth);for(let Z=0,$=Le.length;Z<$;Z++)if(ue=Le[Z],g.format!==RGBAFormat)if(ee!==null)if(L){if(te)if(g.layerUpdates.size>0){const me=getByteLength(ue.width,ue.height,g.format,g.type);for(const Ce of g.layerUpdates){const qe=ue.data.subarray(Ce*me/ue.data.BYTES_PER_ELEMENT,(Ce+1)*me/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,Ce,ue.width,ue.height,1,ee,qe)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,ue.width,ue.height,Q.depth,ee,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,ge,ue.width,ue.height,Q.depth,0,ue.data,0,0);else warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,ue.width,ue.height,Q.depth,ee,pe,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Z,ge,ue.width,ue.height,Q.depth,0,ee,pe,ue.data)}else{L&&re&&t.texStorage2D(n.TEXTURE_2D,he,ge,Le[0].width,Le[0].height);for(let Z=0,$=Le.length;Z<$;Z++)ue=Le[Z],g.format!==RGBAFormat?ee!==null?L?te&&t.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,ue.width,ue.height,ee,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,Z,ge,ue.width,ue.height,0,ue.data):warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?te&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,ue.width,ue.height,ee,pe,ue.data):t.texImage2D(n.TEXTURE_2D,Z,ge,ue.width,ue.height,0,ee,pe,ue.data)}else if(g.isDataArrayTexture)if(L){if(re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,ge,Q.width,Q.height,Q.depth),te)if(g.layerUpdates.size>0){const Z=getByteLength(Q.width,Q.height,g.format,g.type);for(const $ of g.layerUpdates){const me=Q.data.subarray($*Z/Q.data.BYTES_PER_ELEMENT,($+1)*Z/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,ee,pe,me)}g.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ee,pe,Q.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ge,Q.width,Q.height,Q.depth,0,ee,pe,Q.data);else if(g.isData3DTexture)L?(re&&t.texStorage3D(n.TEXTURE_3D,he,ge,Q.width,Q.height,Q.depth),te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ee,pe,Q.data)):t.texImage3D(n.TEXTURE_3D,0,ge,Q.width,Q.height,Q.depth,0,ee,pe,Q.data);else if(g.isFramebufferTexture){if(re)if(L)t.texStorage2D(n.TEXTURE_2D,he,ge,Q.width,Q.height);else{let Z=Q.width,$=Q.height;for(let me=0;me<he;me++)t.texImage2D(n.TEXTURE_2D,me,ge,Z,$,0,ee,pe,null),Z>>=1,$>>=1}}else if(Le.length>0){if(L&&re){const Z=xe(Le[0]);t.texStorage2D(n.TEXTURE_2D,he,ge,Z.width,Z.height)}for(let Z=0,$=Le.length;Z<$;Z++)ue=Le[Z],L?te&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,ee,pe,ue):t.texImage2D(n.TEXTURE_2D,Z,ge,ee,pe,ue);g.generateMipmaps=!1}else if(L){if(re){const Z=xe(Q);t.texStorage2D(n.TEXTURE_2D,he,ge,Z.width,Z.height)}te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ee,pe,Q)}else t.texImage2D(n.TEXTURE_2D,0,ge,ee,pe,Q);m(g)&&p(X),fe.__version=W.version,g.onUpdate&&g.onUpdate(g)}E.__version=g.version}function ie(E,g,U){if(g.image.length!==6)return;const X=Ee(E,g),j=g.source;t.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+U);const W=i.get(j);if(j.version!==W.__version||X===!0){t.activeTexture(n.TEXTURE0+U);const fe=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),ne=g.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(g.colorSpace),Me=g.colorSpace===NoColorSpace||fe===ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Ae=g.isCompressedTexture||g.image[0].isCompressedTexture,Q=g.image[0]&&g.image[0].isDataTexture,ee=[];for(let $=0;$<6;$++)!Ae&&!Q?ee[$]=v(g.image[$],!0,r.maxCubemapSize):ee[$]=Q?g.image[$].image:g.image[$],ee[$]=We(g,ee[$]);const pe=ee[0],ge=a.convert(g.format,g.colorSpace),ue=a.convert(g.type),Le=M(g.internalFormat,ge,ue,g.colorSpace),L=g.isVideoTexture!==!0,re=W.__version===void 0||X===!0,te=j.dataReady;let he=w(g,pe);oe(n.TEXTURE_CUBE_MAP,g);let Z;if(Ae){L&&re&&t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Le,pe.width,pe.height);for(let $=0;$<6;$++){Z=ee[$].mipmaps;for(let me=0;me<Z.length;me++){const Ce=Z[me];g.format!==RGBAFormat?ge!==null?L?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me,0,0,Ce.width,Ce.height,ge,Ce.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me,Le,Ce.width,Ce.height,0,Ce.data):warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me,0,0,Ce.width,Ce.height,ge,ue,Ce.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me,Le,Ce.width,Ce.height,0,ge,ue,Ce.data)}}}else{if(Z=g.mipmaps,L&&re){Z.length>0&&he++;const $=xe(ee[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Le,$.width,$.height)}for(let $=0;$<6;$++)if(Q){L?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ee[$].width,ee[$].height,ge,ue,ee[$].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Le,ee[$].width,ee[$].height,0,ge,ue,ee[$].data);for(let me=0;me<Z.length;me++){const qe=Z[me].image[$].image;L?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me+1,0,0,qe.width,qe.height,ge,ue,qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me+1,Le,qe.width,qe.height,0,ge,ue,qe.data)}}else{L?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ge,ue,ee[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Le,ge,ue,ee[$]);for(let me=0;me<Z.length;me++){const Ce=Z[me];L?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me+1,0,0,ge,ue,Ce.image[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,me+1,Le,ge,ue,Ce.image[$])}}}m(g)&&p(n.TEXTURE_CUBE_MAP),W.__version=j.version,g.onUpdate&&g.onUpdate(g)}E.__version=g.version}function ae(E,g,U,X,j,W){const fe=a.convert(U.format,U.colorSpace),ne=a.convert(U.type),Me=M(U.internalFormat,fe,ne,U.colorSpace),Ae=i.get(g),Q=i.get(U);if(Q.__renderTarget=g,!Ae.__hasExternalTextures){const ee=Math.max(1,g.width>>W),pe=Math.max(1,g.height>>W);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,W,Me,ee,pe,g.depth,0,fe,ne,null):t.texImage2D(j,W,Me,ee,pe,0,fe,ne,null)}t.bindFramebuffer(n.FRAMEBUFFER,E),je(g)?s.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,j,Q.__webglTexture,0,D(g)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,j,Q.__webglTexture,W),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(E,g,U){if(n.bindRenderbuffer(n.RENDERBUFFER,E),g.depthBuffer){const X=g.depthTexture,j=X&&X.isDepthTexture?X.type:null,W=y(g.stencilBuffer,j),fe=g.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;je(g)?s.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(g),W,g.width,g.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(g),W,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,W,g.width,g.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,E)}else{const X=g.textures;for(let j=0;j<X.length;j++){const W=X[j],fe=a.convert(W.format,W.colorSpace),ne=a.convert(W.type),Me=M(W.internalFormat,fe,ne,W.colorSpace);je(g)?s.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(g),Me,g.width,g.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(g),Me,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,Me,g.width,g.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(E,g,U){const X=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,E),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(g.depthTexture);if(j.__renderTarget=g,(!j.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X){if(j.__webglInit===void 0&&(j.__webglInit=!0,g.depthTexture.addEventListener("dispose",A)),j.__webglTexture===void 0){j.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),oe(n.TEXTURE_CUBE_MAP,g.depthTexture);const Ae=a.convert(g.depthTexture.format),Q=a.convert(g.depthTexture.type);let ee;g.depthTexture.format===DepthFormat?ee=n.DEPTH_COMPONENT24:g.depthTexture.format===DepthStencilFormat&&(ee=n.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ee,g.width,g.height,0,Ae,Q,null)}}else C(g.depthTexture,0);const W=j.__webglTexture,fe=D(g),ne=X?n.TEXTURE_CUBE_MAP_POSITIVE_X+U:n.TEXTURE_2D,Me=g.depthTexture.format===DepthStencilFormat?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(g.depthTexture.format===DepthFormat)je(g)?s.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Me,ne,W,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,Me,ne,W,0);else if(g.depthTexture.format===DepthStencilFormat)je(g)?s.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Me,ne,W,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,Me,ne,W,0);else throw new Error("Unknown depthTexture format")}function we(E){const g=i.get(E),U=E.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==E.depthTexture){const X=E.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),X){const j=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),g.__depthDisposeCallback=j}g.__boundDepthTexture=X}if(E.depthTexture&&!g.__autoAllocateDepthBuffer)if(U)for(let X=0;X<6;X++)Te(g.__webglFramebuffer[X],E,X);else{const X=E.texture.mipmaps;X&&X.length>0?Te(g.__webglFramebuffer[0],E,0):Te(g.__webglFramebuffer,E,0)}else if(U){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=n.createRenderbuffer(),Pe(g.__webglDepthbuffer[X],E,!1);else{const j=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=g.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,W)}}else{const X=E.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=n.createRenderbuffer(),Pe(g.__webglDepthbuffer,E,!1);else{const j=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=g.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,W)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Qe(E,g,U){const X=i.get(E);g!==void 0&&ae(X.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),U!==void 0&&we(E)}function Fe(E){const g=E.texture,U=i.get(E),X=i.get(g);E.addEventListener("dispose",R);const j=E.textures,W=E.isWebGLCubeRenderTarget===!0,fe=j.length>1;if(fe||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=g.version,o.memory.textures++),W){U.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){U.__webglFramebuffer[ne]=[];for(let Me=0;Me<g.mipmaps.length;Me++)U.__webglFramebuffer[ne][Me]=n.createFramebuffer()}else U.__webglFramebuffer[ne]=n.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){U.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)U.__webglFramebuffer[ne]=n.createFramebuffer()}else U.__webglFramebuffer=n.createFramebuffer();if(fe)for(let ne=0,Me=j.length;ne<Me;ne++){const Ae=i.get(j[ne]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=n.createTexture(),o.memory.textures++)}if(E.samples>0&&je(E)===!1){U.__webglMultisampledFramebuffer=n.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ne=0;ne<j.length;ne++){const Me=j[ne];U.__webglColorRenderbuffer[ne]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,U.__webglColorRenderbuffer[ne]);const Ae=a.convert(Me.format,Me.colorSpace),Q=a.convert(Me.type),ee=M(Me.internalFormat,Ae,Q,Me.colorSpace,E.isXRRenderTarget===!0),pe=D(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,pe,ee,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ne,n.RENDERBUFFER,U.__webglColorRenderbuffer[ne])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(U.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(U.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(W){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),oe(n.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let Me=0;Me<g.mipmaps.length;Me++)ae(U.__webglFramebuffer[ne][Me],E,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Me);else ae(U.__webglFramebuffer[ne],E,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(g)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let ne=0,Me=j.length;ne<Me;ne++){const Ae=j[ne],Q=i.get(Ae);let ee=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ee=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,Q.__webglTexture),oe(ee,Ae),ae(U.__webglFramebuffer,E,Ae,n.COLOR_ATTACHMENT0+ne,ee,0),m(Ae)&&p(ee)}t.unbindTexture()}else{let ne=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ne=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ne,X.__webglTexture),oe(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let Me=0;Me<g.mipmaps.length;Me++)ae(U.__webglFramebuffer[Me],E,g,n.COLOR_ATTACHMENT0,ne,Me);else ae(U.__webglFramebuffer,E,g,n.COLOR_ATTACHMENT0,ne,0);m(g)&&p(ne),t.unbindTexture()}E.depthBuffer&&we(E)}function Be(E){const g=E.textures;for(let U=0,X=g.length;U<X;U++){const j=g[U];if(m(j)){const W=S(E),fe=i.get(j).__webglTexture;t.bindTexture(W,fe),p(W),t.unbindTexture()}}}const He=[],De=[];function Ye(E){if(E.samples>0){if(je(E)===!1){const g=E.textures,U=E.width,X=E.height;let j=n.COLOR_BUFFER_BIT;const W=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=i.get(E),ne=g.length>1;if(ne)for(let Ae=0;Ae<g.length;Ae++)t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);const Me=E.texture.mipmaps;Me&&Me.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let Ae=0;Ae<g.length;Ae++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),ne){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,fe.__webglColorRenderbuffer[Ae]);const Q=i.get(g[Ae]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Q,0)}n.blitFramebuffer(0,0,U,X,0,0,U,X,j,n.NEAREST),l===!0&&(He.length=0,De.length=0,He.push(n.COLOR_ATTACHMENT0+Ae),E.depthBuffer&&E.resolveDepthBuffer===!1&&(He.push(W),De.push(W),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,De)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,He))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ne)for(let Ae=0;Ae<g.length;Ae++){t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,fe.__webglColorRenderbuffer[Ae]);const Q=i.get(g[Ae]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,Q,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const g=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[g])}}}function D(E){return Math.min(r.maxSamples,E.samples)}function je(E){const g=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Oe(E){const g=o.render.frame;d.get(E)!==g&&(d.set(E,g),E.update())}function We(E,g){const U=E.colorSpace,X=E.format,j=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||U!==LinearSRGBColorSpace&&U!==NoColorSpace&&(ColorManagement.getTransfer(U)===SRGBTransfer?(X!==RGBAFormat||j!==UnsignedByteType)&&warn("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):error("WebGLTextures: Unsupported texture color space:",U)),g}function xe(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=B,this.setTexture2D=C,this.setTexture2DArray=I,this.setTexture3D=N,this.setTextureCube=K,this.rebindTextures=Qe,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function WebGLUtils(n,e){function t(i,r=NoColorSpace){let a;const o=ColorManagement.getTransfer(r);if(i===UnsignedByteType)return n.UNSIGNED_BYTE;if(i===UnsignedShort4444Type)return n.UNSIGNED_SHORT_4_4_4_4;if(i===UnsignedShort5551Type)return n.UNSIGNED_SHORT_5_5_5_1;if(i===UnsignedInt5999Type)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===UnsignedInt101111Type)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ByteType)return n.BYTE;if(i===ShortType)return n.SHORT;if(i===UnsignedShortType)return n.UNSIGNED_SHORT;if(i===IntType)return n.INT;if(i===UnsignedIntType)return n.UNSIGNED_INT;if(i===FloatType)return n.FLOAT;if(i===HalfFloatType)return n.HALF_FLOAT;if(i===AlphaFormat)return n.ALPHA;if(i===RGBFormat)return n.RGB;if(i===RGBAFormat)return n.RGBA;if(i===DepthFormat)return n.DEPTH_COMPONENT;if(i===DepthStencilFormat)return n.DEPTH_STENCIL;if(i===RedFormat)return n.RED;if(i===RedIntegerFormat)return n.RED_INTEGER;if(i===RGFormat)return n.RG;if(i===RGIntegerFormat)return n.RG_INTEGER;if(i===RGBAIntegerFormat)return n.RGBA_INTEGER;if(i===RGB_S3TC_DXT1_Format||i===RGBA_S3TC_DXT1_Format||i===RGBA_S3TC_DXT3_Format||i===RGBA_S3TC_DXT5_Format)if(o===SRGBTransfer)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===RGB_S3TC_DXT1_Format)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT1_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT3_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===RGBA_S3TC_DXT5_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===RGB_S3TC_DXT1_Format)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT1_Format)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT3_Format)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===RGBA_S3TC_DXT5_Format)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===RGB_PVRTC_4BPPV1_Format||i===RGB_PVRTC_2BPPV1_Format||i===RGBA_PVRTC_4BPPV1_Format||i===RGBA_PVRTC_2BPPV1_Format)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===RGB_PVRTC_4BPPV1_Format)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===RGB_PVRTC_2BPPV1_Format)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===RGBA_PVRTC_4BPPV1_Format)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===RGBA_PVRTC_2BPPV1_Format)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===RGB_ETC1_Format||i===RGB_ETC2_Format||i===RGBA_ETC2_EAC_Format||i===R11_EAC_Format||i===SIGNED_R11_EAC_Format||i===RG11_EAC_Format||i===SIGNED_RG11_EAC_Format)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===RGB_ETC1_Format||i===RGB_ETC2_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===RGBA_ETC2_EAC_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===R11_EAC_Format)return a.COMPRESSED_R11_EAC;if(i===SIGNED_R11_EAC_Format)return a.COMPRESSED_SIGNED_R11_EAC;if(i===RG11_EAC_Format)return a.COMPRESSED_RG11_EAC;if(i===SIGNED_RG11_EAC_Format)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===RGBA_ASTC_4x4_Format||i===RGBA_ASTC_5x4_Format||i===RGBA_ASTC_5x5_Format||i===RGBA_ASTC_6x5_Format||i===RGBA_ASTC_6x6_Format||i===RGBA_ASTC_8x5_Format||i===RGBA_ASTC_8x6_Format||i===RGBA_ASTC_8x8_Format||i===RGBA_ASTC_10x5_Format||i===RGBA_ASTC_10x6_Format||i===RGBA_ASTC_10x8_Format||i===RGBA_ASTC_10x10_Format||i===RGBA_ASTC_12x10_Format||i===RGBA_ASTC_12x12_Format)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===RGBA_ASTC_4x4_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===RGBA_ASTC_5x4_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===RGBA_ASTC_5x5_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===RGBA_ASTC_6x5_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===RGBA_ASTC_6x6_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===RGBA_ASTC_8x5_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===RGBA_ASTC_8x6_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===RGBA_ASTC_8x8_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===RGBA_ASTC_10x5_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===RGBA_ASTC_10x6_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===RGBA_ASTC_10x8_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===RGBA_ASTC_10x10_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===RGBA_ASTC_12x10_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===RGBA_ASTC_12x12_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===RGBA_BPTC_Format||i===RGB_BPTC_SIGNED_Format||i===RGB_BPTC_UNSIGNED_Format)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===RGBA_BPTC_Format)return o===SRGBTransfer?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===RGB_BPTC_SIGNED_Format)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===RGB_BPTC_UNSIGNED_Format)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===RED_RGTC1_Format||i===SIGNED_RED_RGTC1_Format||i===RED_GREEN_RGTC2_Format||i===SIGNED_RED_GREEN_RGTC2_Format)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===RED_RGTC1_Format)return a.COMPRESSED_RED_RGTC1_EXT;if(i===SIGNED_RED_RGTC1_Format)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===RED_GREEN_RGTC2_Format)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===SIGNED_RED_GREEN_RGTC2_Format)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===UnsignedInt248Type?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const _occlusion_vertex=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_occlusion_fragment=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class WebXRDepthSensing{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ExternalTexture(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ShaderMaterial({vertexShader:_occlusion_vertex,fragmentShader:_occlusion_fragment,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mesh(new PlaneGeometry(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WebXRManager extends EventDispatcher{constructor(e,t){super();const i=this;let r=null,a=1,o=null,s="local-floor",l=1,c=null,d=null,f=null,u=null,h=null,_=null;const v=typeof XRWebGLBinding<"u",m=new WebXRDepthSensing,p={},S=t.getContextAttributes();let M=null,y=null;const w=[],A=[],R=new Vector2;let x=null;const T=new PerspectiveCamera;T.viewport=new Vector4;const z=new PerspectiveCamera;z.viewport=new Vector4;const P=[T,z],B=new ArrayCamera;let F=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ie=w[Y];return ie===void 0&&(ie=new WebXRController,w[Y]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Y){let ie=w[Y];return ie===void 0&&(ie=new WebXRController,w[Y]=ie),ie.getGripSpace()},this.getHand=function(Y){let ie=w[Y];return ie===void 0&&(ie=new WebXRController,w[Y]=ie),ie.getHandSpace()};function C(Y){const ie=A.indexOf(Y.inputSource);if(ie===-1)return;const ae=w[ie];ae!==void 0&&(ae.update(Y.inputSource,Y.frame,c||o),ae.dispatchEvent({type:Y.type,data:Y.inputSource}))}function I(){r.removeEventListener("select",C),r.removeEventListener("selectstart",C),r.removeEventListener("selectend",C),r.removeEventListener("squeeze",C),r.removeEventListener("squeezestart",C),r.removeEventListener("squeezeend",C),r.removeEventListener("end",I),r.removeEventListener("inputsourceschange",N);for(let Y=0;Y<w.length;Y++){const ie=A[Y];ie!==null&&(A[Y]=null,w[Y].disconnect(ie))}F=null,V=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(M),h=null,u=null,f=null,r=null,y=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&warn("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){s=Y,i.isPresenting===!0&&warn("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:h},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(M=e.getRenderTarget(),r.addEventListener("select",C),r.addEventListener("selectstart",C),r.addEventListener("selectend",C),r.addEventListener("squeeze",C),r.addEventListener("squeezestart",C),r.addEventListener("squeezeend",C),r.addEventListener("end",I),r.addEventListener("inputsourceschange",N),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,Pe=null,Te=null;S.depth&&(Te=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=S.stencil?DepthStencilFormat:DepthFormat,Pe=S.stencil?UnsignedInt248Type:UnsignedIntType);const we={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:a};f=this.getBinding(),u=f.createProjectionLayer(we),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new WebGLRenderTarget(u.textureWidth,u.textureHeight,{format:RGBAFormat,type:UnsignedByteType,depthTexture:new DepthTexture(u.textureWidth,u.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ae={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:a};h=new XRWebGLLayer(r,t,ae),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),y=new WebGLRenderTarget(h.framebufferWidth,h.framebufferHeight,{format:RGBAFormat,type:UnsignedByteType,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(s),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function N(Y){for(let ie=0;ie<Y.removed.length;ie++){const ae=Y.removed[ie],Pe=A.indexOf(ae);Pe>=0&&(A[Pe]=null,w[Pe].disconnect(ae))}for(let ie=0;ie<Y.added.length;ie++){const ae=Y.added[ie];let Pe=A.indexOf(ae);if(Pe===-1){for(let we=0;we<w.length;we++)if(we>=A.length){A.push(ae),Pe=we;break}else if(A[we]===null){A[we]=ae,Pe=we;break}if(Pe===-1)break}const Te=w[Pe];Te&&Te.connect(ae)}}const K=new Vector3,q=new Vector3;function J(Y,ie,ae){K.setFromMatrixPosition(ie.matrixWorld),q.setFromMatrixPosition(ae.matrixWorld);const Pe=K.distanceTo(q),Te=ie.projectionMatrix.elements,we=ae.projectionMatrix.elements,Qe=Te[14]/(Te[10]-1),Fe=Te[14]/(Te[10]+1),Be=(Te[9]+1)/Te[5],He=(Te[9]-1)/Te[5],De=(Te[8]-1)/Te[0],Ye=(we[8]+1)/we[0],D=Qe*De,je=Qe*Ye,Oe=Pe/(-De+Ye),We=Oe*-De;if(ie.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(We),Y.translateZ(Oe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const xe=Qe+Oe,E=Fe+Oe,g=D-We,U=je+(Pe-We),X=Be*Fe/E*xe,j=He*Fe/E*xe;Y.projectionMatrix.makePerspective(g,U,X,j,xe,E),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ce(Y,ie){ie===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ie.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let ie=Y.near,ae=Y.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(ae=m.depthFar)),B.near=z.near=T.near=ie,B.far=z.far=T.far=ae,(F!==B.near||V!==B.far)&&(r.updateRenderState({depthNear:B.near,depthFar:B.far}),F=B.near,V=B.far),B.layers.mask=Y.layers.mask|6,T.layers.mask=B.layers.mask&-5,z.layers.mask=B.layers.mask&-3;const Pe=Y.parent,Te=B.cameras;ce(B,Pe);for(let we=0;we<Te.length;we++)ce(Te[we],Pe);Te.length===2?J(B,T,z):B.projectionMatrix.copy(T.projectionMatrix),oe(Y,B,Pe)};function oe(Y,ie,ae){ae===null?Y.matrix.copy(ie.matrixWorld):(Y.matrix.copy(ae.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ie.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=RAD2DEG*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&h===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Y){return p[Y]};let Ee=null;function Ne(Y,ie){if(d=ie.getViewerPose(c||o),_=ie,d!==null){const ae=d.views;h!==null&&(e.setRenderTargetFramebuffer(y,h.framebuffer),e.setRenderTarget(y));let Pe=!1;ae.length!==B.cameras.length&&(B.cameras.length=0,Pe=!0);for(let Fe=0;Fe<ae.length;Fe++){const Be=ae[Fe];let He=null;if(h!==null)He=h.getViewport(Be);else{const Ye=f.getViewSubImage(u,Be);He=Ye.viewport,Fe===0&&(e.setRenderTargetTextures(y,Ye.colorTexture,Ye.depthStencilTexture),e.setRenderTarget(y))}let De=P[Fe];De===void 0&&(De=new PerspectiveCamera,De.layers.enable(Fe),De.viewport=new Vector4,P[Fe]=De),De.matrix.fromArray(Be.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(Be.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(He.x,He.y,He.width,He.height),Fe===0&&(B.matrix.copy(De.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Pe===!0&&B.cameras.push(De)}const Te=r.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const Fe=f.getDepthInformation(ae[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(Fe,r.renderState)}if(Te&&Te.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let Fe=0;Fe<ae.length;Fe++){const Be=ae[Fe].camera;if(Be){let He=p[Be];He||(He=new ExternalTexture,p[Be]=He);const De=f.getCameraImage(Be);He.sourceTexture=De}}}}for(let ae=0;ae<w.length;ae++){const Pe=A[ae],Te=w[ae];Pe!==null&&Te!==void 0&&Te.update(Pe,ie,c||o)}Ee&&Ee(Y,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),_=null}const Ve=new WebGLAnimation;Ve.setAnimationLoop(Ne),this.setAnimationLoop=function(Y){Ee=Y},this.dispose=function(){}}}const _e1=new Euler,_m1=new Matrix4;function WebGLMaterials(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,getUnlitUniformColorSpace(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,S,M,y){p.isMeshBasicMaterial?a(m,p):p.isMeshLambertMaterial?(a(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(m,p),u(m,p),p.isMeshPhysicalMaterial&&h(m,p,y)):p.isMeshMatcapMaterial?(a(m,p),_(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),v(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&s(m,p)):p.isPointsMaterial?l(m,p,S,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===BackSide&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===BackSide&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),M=S.envMap,y=S.envMapRotation;M&&(m.envMap.value=M,_e1.copy(y),_e1.x*=-1,_e1.y*=-1,_e1.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(_e1.y*=-1,_e1.z*=-1),m.envMapRotation.value.setFromMatrix4(_m1.makeRotationFromEuler(_e1)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function s(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===BackSide&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function WebGLUniformsGroups(n,e,t,i){let r={},a={},o=[];const s=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,M){const y=M.program;i.uniformBlockBinding(S,y)}function c(S,M){let y=r[S.id];y===void 0&&(_(S),y=d(S),r[S.id]=y,S.addEventListener("dispose",m));const w=M.program;i.updateUBOMapping(S,w);const A=e.render.frame;a[S.id]!==A&&(u(S),a[S.id]=A)}function d(S){const M=f();S.__bindingPointIndex=M;const y=n.createBuffer(),w=S.__size,A=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,y),y}function f(){for(let S=0;S<s;S++)if(o.indexOf(S)===-1)return o.push(S),S;return error("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const M=r[S.id],y=S.uniforms,w=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let A=0,R=y.length;A<R;A++){const x=Array.isArray(y[A])?y[A]:[y[A]];for(let T=0,z=x.length;T<z;T++){const P=x[T];if(h(P,A,T,w)===!0){const B=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let C=0;C<F.length;C++){const I=F[C],N=v(I);typeof I=="number"||typeof I=="boolean"?(P.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,B+V,P.__data)):I.isMatrix3?(P.__data[0]=I.elements[0],P.__data[1]=I.elements[1],P.__data[2]=I.elements[2],P.__data[3]=0,P.__data[4]=I.elements[3],P.__data[5]=I.elements[4],P.__data[6]=I.elements[5],P.__data[7]=0,P.__data[8]=I.elements[6],P.__data[9]=I.elements[7],P.__data[10]=I.elements[8],P.__data[11]=0):(I.toArray(P.__data,V),V+=N.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(S,M,y,w){const A=S.value,R=M+"_"+y;if(w[R]===void 0)return typeof A=="number"||typeof A=="boolean"?w[R]=A:w[R]=A.clone(),!0;{const x=w[R];if(typeof A=="number"||typeof A=="boolean"){if(x!==A)return w[R]=A,!0}else if(x.equals(A)===!1)return x.copy(A),!0}return!1}function _(S){const M=S.uniforms;let y=0;const w=16;for(let R=0,x=M.length;R<x;R++){const T=Array.isArray(M[R])?M[R]:[M[R]];for(let z=0,P=T.length;z<P;z++){const B=T[z],F=Array.isArray(B.value)?B.value:[B.value];for(let V=0,C=F.length;V<C;V++){const I=F[V],N=v(I),K=y%w,q=K%N.boundary,J=K+q;y+=q,J!==0&&w-J<N.storage&&(y+=w-J),B.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=y,y+=N.storage}}}const A=y%w;return A>0&&(y+=w-A),S.__size=y,S.__cache={},this}function v(S){const M={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(M.boundary=4,M.storage=4):S.isVector2?(M.boundary=8,M.storage=8):S.isVector3||S.isColor?(M.boundary=16,M.storage=12):S.isVector4?(M.boundary=16,M.storage=16):S.isMatrix3?(M.boundary=48,M.storage=48):S.isMatrix4?(M.boundary=64,M.storage=64):S.isTexture?warn("WebGLRenderer: Texture samplers can not be part of an uniforms group."):warn("WebGLRenderer: Unsupported uniform value type.",S),M}function m(S){const M=S.target;M.removeEventListener("dispose",m);const y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(r[M.id]),delete r[M.id],delete a[M.id]}function p(){for(const S in r)n.deleteBuffer(r[S]);o=[],r={},a={}}return{bind:l,update:c,dispose:p}}const DATA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let lut=null;function getDFGLUT(){return lut===null&&(lut=new DataTexture(DATA,16,16,RGFormat,HalfFloatType),lut.name="DFG_LUT",lut.minFilter=LinearFilter,lut.magFilter=LinearFilter,lut.wrapS=ClampToEdgeWrapping,lut.wrapT=ClampToEdgeWrapping,lut.generateMipmaps=!1,lut.needsUpdate=!0),lut}class WebGLRenderer{constructor(e={}){const{canvas:t=createCanvasElement(),context:i=null,depth:r=!0,stencil:a=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:h=UnsignedByteType}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;const v=h,m=new Set([RGBAIntegerFormat,RGIntegerFormat,RedIntegerFormat]),p=new Set([UnsignedByteType,UnsignedIntType,UnsignedShortType,UnsignedInt248Type,UnsignedShort4444Type,UnsignedShort5551Type]),S=new Uint32Array(4),M=new Int32Array(4);let y=null,w=null;const A=[],R=[];let x=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=NoToneMapping,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let z=!1;this._outputColorSpace=SRGBColorSpace;let P=0,B=0,F=null,V=-1,C=null;const I=new Vector4,N=new Vector4;let K=null;const q=new Color(0);let J=0,ce=t.width,oe=t.height,Ee=1,Ne=null,Ve=null;const Y=new Vector4(0,0,ce,oe),ie=new Vector4(0,0,ce,oe);let ae=!1;const Pe=new Frustum;let Te=!1,we=!1;const Qe=new Matrix4,Fe=new Vector3,Be=new Vector4,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let De=!1;function Ye(){return F===null?Ee:1}let D=i;function je(b,O){return t.getContext(b,O)}try{const b={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${REVISION}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",qe,!1),D===null){const O="webgl2";if(D=je(O,b),D===null)throw je(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw error("WebGLRenderer: "+b.message),b}let Oe,We,xe,E,g,U,X,j,W,fe,ne,Me,Ae,Q,ee,pe,ge,ue,Le,L,re,te,he;function Z(){Oe=new WebGLExtensions(D),Oe.init(),re=new WebGLUtils(D,Oe),We=new WebGLCapabilities(D,Oe,e,re),xe=new WebGLState(D,Oe),We.reversedDepthBuffer&&u&&xe.buffers.depth.setReversed(!0),E=new WebGLInfo(D),g=new WebGLProperties,U=new WebGLTextures(D,Oe,xe,g,We,re,E),X=new WebGLEnvironments(T),j=new WebGLAttributes(D),te=new WebGLBindingStates(D,j),W=new WebGLGeometries(D,j,E,te),fe=new WebGLObjects(D,W,j,te,E),ue=new WebGLMorphtargets(D,We,U),ee=new WebGLClipping(g),ne=new WebGLPrograms(T,X,Oe,We,te,ee),Me=new WebGLMaterials(T,g),Ae=new WebGLRenderLists,Q=new WebGLRenderStates(Oe),ge=new WebGLBackground(T,X,xe,fe,_,l),pe=new WebGLShadowMap(T,fe,We),he=new WebGLUniformsGroups(D,E,We,xe),Le=new WebGLBufferRenderer(D,Oe,E),L=new WebGLIndexedBufferRenderer(D,Oe,E),E.programs=ne.programs,T.capabilities=We,T.extensions=Oe,T.properties=g,T.renderLists=Ae,T.shadowMap=pe,T.state=xe,T.info=E}Z(),v!==UnsignedByteType&&(x=new WebGLOutput(v,t.width,t.height,r,a));const $=new WebXRManager(T,D);this.xr=$,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const b=Oe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Oe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Ee},this.setPixelRatio=function(b){b!==void 0&&(Ee=b,this.setSize(ce,oe,!1))},this.getSize=function(b){return b.set(ce,oe)},this.setSize=function(b,O,H=!0){if($.isPresenting){warn("WebGLRenderer: Can't change size while VR device is presenting.");return}ce=b,oe=O,t.width=Math.floor(b*Ee),t.height=Math.floor(O*Ee),H===!0&&(t.style.width=b+"px",t.style.height=O+"px"),x!==null&&x.setSize(t.width,t.height),this.setViewport(0,0,b,O)},this.getDrawingBufferSize=function(b){return b.set(ce*Ee,oe*Ee).floor()},this.setDrawingBufferSize=function(b,O,H){ce=b,oe=O,Ee=H,t.width=Math.floor(b*H),t.height=Math.floor(O*H),this.setViewport(0,0,b,O)},this.setEffects=function(b){if(v===UnsignedByteType){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let O=0;O<b.length;O++)if(b[O].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(I)},this.getViewport=function(b){return b.copy(Y)},this.setViewport=function(b,O,H,G){b.isVector4?Y.set(b.x,b.y,b.z,b.w):Y.set(b,O,H,G),xe.viewport(I.copy(Y).multiplyScalar(Ee).round())},this.getScissor=function(b){return b.copy(ie)},this.setScissor=function(b,O,H,G){b.isVector4?ie.set(b.x,b.y,b.z,b.w):ie.set(b,O,H,G),xe.scissor(N.copy(ie).multiplyScalar(Ee).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(b){xe.setScissorTest(ae=b)},this.setOpaqueSort=function(b){Ne=b},this.setTransparentSort=function(b){Ve=b},this.getClearColor=function(b){return b.copy(ge.getClearColor())},this.setClearColor=function(){ge.setClearColor(...arguments)},this.getClearAlpha=function(){return ge.getClearAlpha()},this.setClearAlpha=function(){ge.setClearAlpha(...arguments)},this.clear=function(b=!0,O=!0,H=!0){let G=0;if(b){let k=!1;if(F!==null){const se=F.texture.format;k=m.has(se)}if(k){const se=F.texture.type,de=p.has(se),le=ge.getClearColor(),ve=ge.getClearAlpha(),be=le.r,Re=le.g,Ie=le.b;de?(S[0]=be,S[1]=Re,S[2]=Ie,S[3]=ve,D.clearBufferuiv(D.COLOR,0,S)):(M[0]=be,M[1]=Re,M[2]=Ie,M[3]=ve,D.clearBufferiv(D.COLOR,0,M))}else G|=D.COLOR_BUFFER_BIT}O&&(G|=D.DEPTH_BUFFER_BIT),H&&(G|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&D.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",qe,!1),ge.dispose(),Ae.dispose(),Q.dispose(),g.dispose(),X.dispose(),fe.dispose(),te.dispose(),he.dispose(),ne.dispose(),$.dispose(),$.removeEventListener("sessionstart",gt),$.removeEventListener("sessionend",vt),lt.stop()};function me(b){b.preventDefault(),log("WebGLRenderer: Context Lost."),z=!0}function Ce(){log("WebGLRenderer: Context Restored."),z=!1;const b=E.autoReset,O=pe.enabled,H=pe.autoUpdate,G=pe.needsUpdate,k=pe.type;Z(),E.autoReset=b,pe.enabled=O,pe.autoUpdate=H,pe.needsUpdate=G,pe.type=k}function qe(b){error("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ke(b){const O=b.target;O.removeEventListener("dispose",ke),rt(O)}function rt(b){at(b),g.remove(b)}function at(b){const O=g.get(b).programs;O!==void 0&&(O.forEach(function(H){ne.releaseProgram(H)}),b.isShaderMaterial&&ne.releaseShaderCache(b))}this.renderBufferDirect=function(b,O,H,G,k,se){O===null&&(O=He);const de=k.isMesh&&k.matrixWorld.determinant()<0,le=wt(b,O,H,G,k);xe.setMaterial(G,de);let ve=H.index,be=1;if(G.wireframe===!0){if(ve=W.getWireframeAttribute(H),ve===void 0)return;be=2}const Re=H.drawRange,Ie=H.attributes.position;let ye=Re.start*be,Ge=(Re.start+Re.count)*be;se!==null&&(ye=Math.max(ye,se.start*be),Ge=Math.min(Ge,(se.start+se.count)*be)),ve!==null?(ye=Math.max(ye,0),Ge=Math.min(Ge,ve.count)):Ie!=null&&(ye=Math.max(ye,0),Ge=Math.min(Ge,Ie.count));const Ke=Ge-ye;if(Ke<0||Ke===1/0)return;te.setup(k,G,le,H,ve);let Xe,ze=Le;if(ve!==null&&(Xe=j.get(ve),ze=L,ze.setIndex(Xe)),k.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*Ye()),ze.setMode(D.LINES)):ze.setMode(D.TRIANGLES);else if(k.isLine){let et=G.linewidth;et===void 0&&(et=1),xe.setLineWidth(et*Ye()),k.isLineSegments?ze.setMode(D.LINES):k.isLineLoop?ze.setMode(D.LINE_LOOP):ze.setMode(D.LINE_STRIP)}else k.isPoints?ze.setMode(D.POINTS):k.isSprite&&ze.setMode(D.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)warnOnce("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ze.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Oe.get("WEBGL_multi_draw"))ze.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const et=k._multiDrawStarts,Se=k._multiDrawCounts,tt=k._multiDrawCount,Ue=ve?j.get(ve).bytesPerElement:1,it=g.get(G).currentProgram.getUniforms();for(let nt=0;nt<tt;nt++)it.setValue(D,"_gl_DrawID",nt),ze.render(et[nt]/Ue,Se[nt])}else if(k.isInstancedMesh)ze.renderInstances(ye,Ke,k.count);else if(H.isInstancedBufferGeometry){const et=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Se=Math.min(H.instanceCount,et);ze.renderInstances(ye,Ke,Se)}else ze.render(ye,Ke)};function _t(b,O,H){b.transparent===!0&&b.side===DoubleSide&&b.forceSinglePass===!1?(b.side=BackSide,b.needsUpdate=!0,ft(b,O,H),b.side=FrontSide,b.needsUpdate=!0,ft(b,O,H),b.side=DoubleSide):ft(b,O,H)}this.compile=function(b,O,H=null){H===null&&(H=b),w=Q.get(H),w.init(O),R.push(w),H.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),b!==H&&b.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),w.setupLights();const G=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const se=k.material;if(se)if(Array.isArray(se))for(let de=0;de<se.length;de++){const le=se[de];_t(le,H,k),G.add(le)}else _t(se,H,k),G.add(se)}),w=R.pop(),G},this.compileAsync=function(b,O,H=null){const G=this.compile(b,O,H);return new Promise(k=>{function se(){if(G.forEach(function(de){g.get(de).currentProgram.isReady()&&G.delete(de)}),G.size===0){k(b);return}setTimeout(se,10)}Oe.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let pt=null;function Et(b){pt&&pt(b)}function gt(){lt.stop()}function vt(){lt.start()}const lt=new WebGLAnimation;lt.setAnimationLoop(Et),typeof self<"u"&&lt.setContext(self),this.setAnimationLoop=function(b){pt=b,$.setAnimationLoop(b),b===null?lt.stop():lt.start()},$.addEventListener("sessionstart",gt),$.addEventListener("sessionend",vt),this.render=function(b,O){if(O!==void 0&&O.isCamera!==!0){error("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;const H=$.enabled===!0&&$.isPresenting===!0,G=x!==null&&(F===null||H)&&x.begin(T,F);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&($.cameraAutoUpdate===!0&&$.updateCamera(O),O=$.getCamera()),b.isScene===!0&&b.onBeforeRender(T,b,O,F),w=Q.get(b,R.length),w.init(O),R.push(w),Qe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Pe.setFromProjectionMatrix(Qe,WebGLCoordinateSystem,O.reversedDepth),we=this.localClippingEnabled,Te=ee.init(this.clippingPlanes,we),y=Ae.get(b,A.length),y.init(),A.push(y),$.enabled===!0&&$.isPresenting===!0){const de=T.xr.getDepthSensingMesh();de!==null&&mt(de,O,-1/0,T.sortObjects)}mt(b,O,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort(Ne,Ve),De=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,De&&ge.addToRenderList(y,b),this.info.render.frame++,Te===!0&&ee.beginShadows();const k=w.state.shadowsArray;if(pe.render(k,b,O),Te===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&x.hasRenderPass())===!1){const de=y.opaque,le=y.transmissive;if(w.setupLights(),O.isArrayCamera){const ve=O.cameras;if(le.length>0)for(let be=0,Re=ve.length;be<Re;be++){const Ie=ve[be];St(de,le,b,Ie)}De&&ge.render(b);for(let be=0,Re=ve.length;be<Re;be++){const Ie=ve[be];xt(y,b,Ie,Ie.viewport)}}else le.length>0&&St(de,le,b,O),De&&ge.render(b),xt(y,b,O)}F!==null&&B===0&&(U.updateMultisampleRenderTarget(F),U.updateRenderTargetMipmap(F)),G&&x.end(T),b.isScene===!0&&b.onAfterRender(T,b,O),te.resetDefaultState(),V=-1,C=null,R.pop(),R.length>0?(w=R[R.length-1],Te===!0&&ee.setGlobalState(T.clippingPlanes,w.state.camera)):w=null,A.pop(),A.length>0?y=A[A.length-1]:y=null};function mt(b,O,H,G){if(b.visible===!1)return;if(b.layers.test(O.layers)){if(b.isGroup)H=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(O);else if(b.isLight)w.pushLight(b),b.castShadow&&w.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Pe.intersectsSprite(b)){G&&Be.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Qe);const de=fe.update(b),le=b.material;le.visible&&y.push(b,de,le,H,Be.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Pe.intersectsObject(b))){const de=fe.update(b),le=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Be.copy(b.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Be.copy(de.boundingSphere.center)),Be.applyMatrix4(b.matrixWorld).applyMatrix4(Qe)),Array.isArray(le)){const ve=de.groups;for(let be=0,Re=ve.length;be<Re;be++){const Ie=ve[be],ye=le[Ie.materialIndex];ye&&ye.visible&&y.push(b,de,ye,H,Be.z,Ie)}}else le.visible&&y.push(b,de,le,H,Be.z,null)}}const se=b.children;for(let de=0,le=se.length;de<le;de++)mt(se[de],O,H,G)}function xt(b,O,H,G){const{opaque:k,transmissive:se,transparent:de}=b;w.setupLightsView(H),Te===!0&&ee.setGlobalState(T.clippingPlanes,H),G&&xe.viewport(I.copy(G)),k.length>0&&ht(k,O,H),se.length>0&&ht(se,O,H),de.length>0&&ht(de,O,H),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function St(b,O,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){const ye=Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new WebGLRenderTarget(1,1,{generateMipmaps:!0,type:ye?HalfFloatType:UnsignedByteType,minFilter:LinearMipmapLinearFilter,samples:Math.max(4,We.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ColorManagement.workingColorSpace})}const se=w.state.transmissionRenderTarget[G.id],de=G.viewport||I;se.setSize(de.z*T.transmissionResolutionScale,de.w*T.transmissionResolutionScale);const le=T.getRenderTarget(),ve=T.getActiveCubeFace(),be=T.getActiveMipmapLevel();T.setRenderTarget(se),T.getClearColor(q),J=T.getClearAlpha(),J<1&&T.setClearColor(16777215,.5),T.clear(),De&&ge.render(H);const Re=T.toneMapping;T.toneMapping=NoToneMapping;const Ie=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),Te===!0&&ee.setGlobalState(T.clippingPlanes,G),ht(b,H,G),U.updateMultisampleRenderTarget(se),U.updateRenderTargetMipmap(se),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let ye=!1;for(let Ge=0,Ke=O.length;Ge<Ke;Ge++){const Xe=O[Ge],{object:ze,geometry:et,material:Se,group:tt}=Xe;if(Se.side===DoubleSide&&ze.layers.test(G.layers)){const Ue=Se.side;Se.side=BackSide,Se.needsUpdate=!0,bt(ze,H,G,et,Se,tt),Se.side=Ue,Se.needsUpdate=!0,ye=!0}}ye===!0&&(U.updateMultisampleRenderTarget(se),U.updateRenderTargetMipmap(se))}T.setRenderTarget(le,ve,be),T.setClearColor(q,J),Ie!==void 0&&(G.viewport=Ie),T.toneMapping=Re}function ht(b,O,H){const G=O.isScene===!0?O.overrideMaterial:null;for(let k=0,se=b.length;k<se;k++){const de=b[k],{object:le,geometry:ve,group:be}=de;let Re=de.material;Re.allowOverride===!0&&G!==null&&(Re=G),le.layers.test(H.layers)&&bt(le,O,H,ve,Re,be)}}function bt(b,O,H,G,k,se){b.onBeforeRender(T,O,H,G,k,se),b.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(T,O,H,G,b,se),k.transparent===!0&&k.side===DoubleSide&&k.forceSinglePass===!1?(k.side=BackSide,k.needsUpdate=!0,T.renderBufferDirect(H,O,G,k,b,se),k.side=FrontSide,k.needsUpdate=!0,T.renderBufferDirect(H,O,G,k,b,se),k.side=DoubleSide):T.renderBufferDirect(H,O,G,k,b,se),b.onAfterRender(T,O,H,G,k,se)}function ft(b,O,H){O.isScene!==!0&&(O=He);const G=g.get(b),k=w.state.lights,se=w.state.shadowsArray,de=k.state.version,le=ne.getParameters(b,k.state,se,O,H),ve=ne.getProgramCacheKey(le);let be=G.programs;G.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?O.environment:null,G.fog=O.fog;const Re=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;G.envMap=X.get(b.envMap||G.environment,Re),G.envMapRotation=G.environment!==null&&b.envMap===null?O.environmentRotation:b.envMapRotation,be===void 0&&(b.addEventListener("dispose",ke),be=new Map,G.programs=be);let Ie=be.get(ve);if(Ie!==void 0){if(G.currentProgram===Ie&&G.lightsStateVersion===de)return Mt(b,le),Ie}else le.uniforms=ne.getUniforms(b),b.onBeforeCompile(le,T),Ie=ne.acquireProgram(le,ve),be.set(ve,Ie),G.uniforms=le.uniforms;const ye=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(ye.clippingPlanes=ee.uniform),Mt(b,le),G.needsLights=Rt(b),G.lightsStateVersion=de,G.needsLights&&(ye.ambientLightColor.value=k.state.ambient,ye.lightProbe.value=k.state.probe,ye.directionalLights.value=k.state.directional,ye.directionalLightShadows.value=k.state.directionalShadow,ye.spotLights.value=k.state.spot,ye.spotLightShadows.value=k.state.spotShadow,ye.rectAreaLights.value=k.state.rectArea,ye.ltc_1.value=k.state.rectAreaLTC1,ye.ltc_2.value=k.state.rectAreaLTC2,ye.pointLights.value=k.state.point,ye.pointLightShadows.value=k.state.pointShadow,ye.hemisphereLights.value=k.state.hemi,ye.directionalShadowMatrix.value=k.state.directionalShadowMatrix,ye.spotLightMatrix.value=k.state.spotLightMatrix,ye.spotLightMap.value=k.state.spotLightMap,ye.pointShadowMatrix.value=k.state.pointShadowMatrix),G.currentProgram=Ie,G.uniformsList=null,Ie}function yt(b){if(b.uniformsList===null){const O=b.currentProgram.getUniforms();b.uniformsList=WebGLUniforms.seqWithValue(O.seq,b.uniforms)}return b.uniformsList}function Mt(b,O){const H=g.get(b);H.outputColorSpace=O.outputColorSpace,H.batching=O.batching,H.batchingColor=O.batchingColor,H.instancing=O.instancing,H.instancingColor=O.instancingColor,H.instancingMorph=O.instancingMorph,H.skinning=O.skinning,H.morphTargets=O.morphTargets,H.morphNormals=O.morphNormals,H.morphColors=O.morphColors,H.morphTargetsCount=O.morphTargetsCount,H.numClippingPlanes=O.numClippingPlanes,H.numIntersection=O.numClipIntersection,H.vertexAlphas=O.vertexAlphas,H.vertexTangents=O.vertexTangents,H.toneMapping=O.toneMapping}function wt(b,O,H,G,k){O.isScene!==!0&&(O=He),U.resetTextureUnits();const se=O.fog,de=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?O.environment:null,le=F===null?T.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:LinearSRGBColorSpace,ve=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,be=X.get(G.envMap||de,ve),Re=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ie=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),ye=!!H.morphAttributes.position,Ge=!!H.morphAttributes.normal,Ke=!!H.morphAttributes.color;let Xe=NoToneMapping;G.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Xe=T.toneMapping);const ze=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,et=ze!==void 0?ze.length:0,Se=g.get(G),tt=w.state.lights;if(Te===!0&&(we===!0||b!==C)){const Ze=b===C&&G.id===V;ee.setState(G,b,Ze)}let Ue=!1;G.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==tt.state.version||Se.outputColorSpace!==le||k.isBatchedMesh&&Se.batching===!1||!k.isBatchedMesh&&Se.batching===!0||k.isBatchedMesh&&Se.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Se.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Se.instancing===!1||!k.isInstancedMesh&&Se.instancing===!0||k.isSkinnedMesh&&Se.skinning===!1||!k.isSkinnedMesh&&Se.skinning===!0||k.isInstancedMesh&&Se.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Se.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Se.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Se.instancingMorph===!1&&k.morphTexture!==null||Se.envMap!==be||G.fog===!0&&Se.fog!==se||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==ee.numPlanes||Se.numIntersection!==ee.numIntersection)||Se.vertexAlphas!==Re||Se.vertexTangents!==Ie||Se.morphTargets!==ye||Se.morphNormals!==Ge||Se.morphColors!==Ke||Se.toneMapping!==Xe||Se.morphTargetsCount!==et)&&(Ue=!0):(Ue=!0,Se.__version=G.version);let it=Se.currentProgram;Ue===!0&&(it=ft(G,O,k));let nt=!1,ct=!1,ut=!1;const $e=it.getUniforms(),Je=Se.uniforms;if(xe.useProgram(it.program)&&(nt=!0,ct=!0,ut=!0),G.id!==V&&(V=G.id,ct=!0),nt||C!==b){xe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),$e.setValue(D,"projectionMatrix",b.projectionMatrix),$e.setValue(D,"viewMatrix",b.matrixWorldInverse);const st=$e.map.cameraPosition;st!==void 0&&st.setValue(D,Fe.setFromMatrixPosition(b.matrixWorld)),We.logarithmicDepthBuffer&&$e.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&$e.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),C!==b&&(C=b,ct=!0,ut=!0)}if(Se.needsLights&&(tt.state.directionalShadowMap.length>0&&$e.setValue(D,"directionalShadowMap",tt.state.directionalShadowMap,U),tt.state.spotShadowMap.length>0&&$e.setValue(D,"spotShadowMap",tt.state.spotShadowMap,U),tt.state.pointShadowMap.length>0&&$e.setValue(D,"pointShadowMap",tt.state.pointShadowMap,U)),k.isSkinnedMesh){$e.setOptional(D,k,"bindMatrix"),$e.setOptional(D,k,"bindMatrixInverse");const Ze=k.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),$e.setValue(D,"boneTexture",Ze.boneTexture,U))}k.isBatchedMesh&&($e.setOptional(D,k,"batchingTexture"),$e.setValue(D,"batchingTexture",k._matricesTexture,U),$e.setOptional(D,k,"batchingIdTexture"),$e.setValue(D,"batchingIdTexture",k._indirectTexture,U),$e.setOptional(D,k,"batchingColorTexture"),k._colorsTexture!==null&&$e.setValue(D,"batchingColorTexture",k._colorsTexture,U));const ot=H.morphAttributes;if((ot.position!==void 0||ot.normal!==void 0||ot.color!==void 0)&&ue.update(k,H,it),(ct||Se.receiveShadow!==k.receiveShadow)&&(Se.receiveShadow=k.receiveShadow,$e.setValue(D,"receiveShadow",k.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&O.environment!==null&&(Je.envMapIntensity.value=O.environmentIntensity),Je.dfgLUT!==void 0&&(Je.dfgLUT.value=getDFGLUT()),ct&&($e.setValue(D,"toneMappingExposure",T.toneMappingExposure),Se.needsLights&&Ct(Je,ut),se&&G.fog===!0&&Me.refreshFogUniforms(Je,se),Me.refreshMaterialUniforms(Je,G,Ee,oe,w.state.transmissionRenderTarget[b.id]),WebGLUniforms.upload(D,yt(Se),Je,U)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(WebGLUniforms.upload(D,yt(Se),Je,U),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&$e.setValue(D,"center",k.center),$e.setValue(D,"modelViewMatrix",k.modelViewMatrix),$e.setValue(D,"normalMatrix",k.normalMatrix),$e.setValue(D,"modelMatrix",k.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ze=G.uniformsGroups;for(let st=0,dt=Ze.length;st<dt;st++){const Tt=Ze[st];he.update(Tt,it),he.bind(Tt,it)}}return it}function Ct(b,O){b.ambientLightColor.needsUpdate=O,b.lightProbe.needsUpdate=O,b.directionalLights.needsUpdate=O,b.directionalLightShadows.needsUpdate=O,b.pointLights.needsUpdate=O,b.pointLightShadows.needsUpdate=O,b.spotLights.needsUpdate=O,b.spotLightShadows.needsUpdate=O,b.rectAreaLights.needsUpdate=O,b.hemisphereLights.needsUpdate=O}function Rt(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(b,O,H){const G=g.get(b);G.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),g.get(b.texture).__webglTexture=O,g.get(b.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:H,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,O){const H=g.get(b);H.__webglFramebuffer=O,H.__useDefaultFramebuffer=O===void 0};const Pt=D.createFramebuffer();this.setRenderTarget=function(b,O=0,H=0){F=b,P=O,B=H;let G=null,k=!1,se=!1;if(b){const le=g.get(b);if(le.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(D.FRAMEBUFFER,le.__webglFramebuffer),I.copy(b.viewport),N.copy(b.scissor),K=b.scissorTest,xe.viewport(I),xe.scissor(N),xe.setScissorTest(K),V=-1;return}else if(le.__webglFramebuffer===void 0)U.setupRenderTarget(b);else if(le.__hasExternalTextures)U.rebindTextures(b,g.get(b.texture).__webglTexture,g.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Re=b.depthTexture;if(le.__boundDepthTexture!==Re){if(Re!==null&&g.has(Re)&&(b.width!==Re.image.width||b.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(b)}}const ve=b.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(se=!0);const be=g.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(be[O])?G=be[O][H]:G=be[O],k=!0):b.samples>0&&U.useMultisampledRTT(b)===!1?G=g.get(b).__webglMultisampledFramebuffer:Array.isArray(be)?G=be[H]:G=be,I.copy(b.viewport),N.copy(b.scissor),K=b.scissorTest}else I.copy(Y).multiplyScalar(Ee).floor(),N.copy(ie).multiplyScalar(Ee).floor(),K=ae;if(H!==0&&(G=Pt),xe.bindFramebuffer(D.FRAMEBUFFER,G)&&xe.drawBuffers(b,G),xe.viewport(I),xe.scissor(N),xe.setScissorTest(K),k){const le=g.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,le.__webglTexture,H)}else if(se){const le=O;for(let ve=0;ve<b.textures.length;ve++){const be=g.get(b.textures[ve]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+ve,be.__webglTexture,H,le)}}else if(b!==null&&H!==0){const le=g.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,le.__webglTexture,H)}V=-1},this.readRenderTargetPixels=function(b,O,H,G,k,se,de,le=0){if(!(b&&b.isWebGLRenderTarget)){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=g.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){xe.bindFramebuffer(D.FRAMEBUFFER,ve);try{const be=b.textures[le],Re=be.format,Ie=be.type;if(b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+le),!We.textureFormatReadable(Re)){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(Ie)){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=b.width-G&&H>=0&&H<=b.height-k&&D.readPixels(O,H,G,k,re.convert(Re),re.convert(Ie),se)}finally{const be=F!==null?g.get(F).__webglFramebuffer:null;xe.bindFramebuffer(D.FRAMEBUFFER,be)}}},this.readRenderTargetPixelsAsync=async function(b,O,H,G,k,se,de,le=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=g.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve)if(O>=0&&O<=b.width-G&&H>=0&&H<=b.height-k){xe.bindFramebuffer(D.FRAMEBUFFER,ve);const be=b.textures[le],Re=be.format,Ie=be.type;if(b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+le),!We.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ye=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,ye),D.bufferData(D.PIXEL_PACK_BUFFER,se.byteLength,D.STREAM_READ),D.readPixels(O,H,G,k,re.convert(Re),re.convert(Ie),0);const Ge=F!==null?g.get(F).__webglFramebuffer:null;xe.bindFramebuffer(D.FRAMEBUFFER,Ge);const Ke=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await probeAsync(D,Ke,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,ye),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,se),D.deleteBuffer(ye),D.deleteSync(Ke),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,O=null,H=0){const G=Math.pow(2,-H),k=Math.floor(b.image.width*G),se=Math.floor(b.image.height*G),de=O!==null?O.x:0,le=O!==null?O.y:0;U.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,H,0,0,de,le,k,se),xe.unbindTexture()};const Dt=D.createFramebuffer(),Lt=D.createFramebuffer();this.copyTextureToTexture=function(b,O,H=null,G=null,k=0,se=0){let de,le,ve,be,Re,Ie,ye,Ge,Ke;const Xe=b.isCompressedTexture?b.mipmaps[se]:b.image;if(H!==null)de=H.max.x-H.min.x,le=H.max.y-H.min.y,ve=H.isBox3?H.max.z-H.min.z:1,be=H.min.x,Re=H.min.y,Ie=H.isBox3?H.min.z:0;else{const Je=Math.pow(2,-k);de=Math.floor(Xe.width*Je),le=Math.floor(Xe.height*Je),b.isDataArrayTexture?ve=Xe.depth:b.isData3DTexture?ve=Math.floor(Xe.depth*Je):ve=1,be=0,Re=0,Ie=0}G!==null?(ye=G.x,Ge=G.y,Ke=G.z):(ye=0,Ge=0,Ke=0);const ze=re.convert(O.format),et=re.convert(O.type);let Se;O.isData3DTexture?(U.setTexture3D(O,0),Se=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(U.setTexture2DArray(O,0),Se=D.TEXTURE_2D_ARRAY):(U.setTexture2D(O,0),Se=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const tt=D.getParameter(D.UNPACK_ROW_LENGTH),Ue=D.getParameter(D.UNPACK_IMAGE_HEIGHT),it=D.getParameter(D.UNPACK_SKIP_PIXELS),nt=D.getParameter(D.UNPACK_SKIP_ROWS),ct=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Xe.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Xe.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,be),D.pixelStorei(D.UNPACK_SKIP_ROWS,Re),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ie);const ut=b.isDataArrayTexture||b.isData3DTexture,$e=O.isDataArrayTexture||O.isData3DTexture;if(b.isDepthTexture){const Je=g.get(b),ot=g.get(O),Ze=g.get(Je.__renderTarget),st=g.get(ot.__renderTarget);xe.bindFramebuffer(D.READ_FRAMEBUFFER,Ze.__webglFramebuffer),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,st.__webglFramebuffer);for(let dt=0;dt<ve;dt++)ut&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,g.get(b).__webglTexture,k,Ie+dt),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,g.get(O).__webglTexture,se,Ke+dt)),D.blitFramebuffer(be,Re,de,le,ye,Ge,de,le,D.DEPTH_BUFFER_BIT,D.NEAREST);xe.bindFramebuffer(D.READ_FRAMEBUFFER,null),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||g.has(b)){const Je=g.get(b),ot=g.get(O);xe.bindFramebuffer(D.READ_FRAMEBUFFER,Dt),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,Lt);for(let Ze=0;Ze<ve;Ze++)ut?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Je.__webglTexture,k,Ie+Ze):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Je.__webglTexture,k),$e?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ot.__webglTexture,se,Ke+Ze):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ot.__webglTexture,se),k!==0?D.blitFramebuffer(be,Re,de,le,ye,Ge,de,le,D.COLOR_BUFFER_BIT,D.NEAREST):$e?D.copyTexSubImage3D(Se,se,ye,Ge,Ke+Ze,be,Re,de,le):D.copyTexSubImage2D(Se,se,ye,Ge,be,Re,de,le);xe.bindFramebuffer(D.READ_FRAMEBUFFER,null),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else $e?b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Se,se,ye,Ge,Ke,de,le,ve,ze,et,Xe.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Se,se,ye,Ge,Ke,de,le,ve,ze,Xe.data):D.texSubImage3D(Se,se,ye,Ge,Ke,de,le,ve,ze,et,Xe):b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,se,ye,Ge,de,le,ze,et,Xe.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,se,ye,Ge,Xe.width,Xe.height,ze,Xe.data):D.texSubImage2D(D.TEXTURE_2D,se,ye,Ge,de,le,ze,et,Xe);D.pixelStorei(D.UNPACK_ROW_LENGTH,tt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ue),D.pixelStorei(D.UNPACK_SKIP_PIXELS,it),D.pixelStorei(D.UNPACK_SKIP_ROWS,nt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ct),se===0&&O.generateMipmaps&&D.generateMipmap(Se),xe.unbindTexture()},this.initRenderTarget=function(b){g.get(b).__webglFramebuffer===void 0&&U.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?U.setTextureCube(b,0):b.isData3DTexture?U.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?U.setTexture2DArray(b,0):U.setTexture2D(b,0),xe.unbindTexture()},this.resetState=function(){P=0,B=0,F=null,xe.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return WebGLCoordinateSystem}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ColorManagement._getDrawingBufferColorSpace(e),t.unpackColorSpace=ColorManagement._getUnpackColorSpace()}}function getDefaultExportFromCjs(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var minSignal$1={exports:{}};(function(n){(function(e){function t(){this._listeners=[],this.dispatchCount=0}var i=t.prototype;i.add=s,i.addOnce=l,i.remove=c,i.dispatch=d;var r="Callback function is missing!",a=Array.prototype.slice;function o(f){f.sort(function(u,h){return u=u.p,h=h.p,h<u?1:h>u?-1:0})}function s(f,u,h,_){if(!f)throw r;h=h||0;for(var v=this._listeners,m,p,S,M=v.length;M--;)if(m=v[M],m.f===f&&m.c===u)return!1;typeof h=="function"&&(p=h,h=_,S=4),v.unshift({f,c:u,p:h,r:p||f,a:a.call(arguments,S||3),j:0}),o(v)}function l(f,u,h,_){if(!f)throw r;var v=this,m=function(){return v.remove.call(v,f,u),f.apply(u,a.call(arguments,0))};_=a.call(arguments,0),_.length===1&&_.push(e),_.splice(2,0,m),s.apply(v,_)}function c(f,u){if(!f)return this._listeners.length=0,!0;for(var h=this._listeners,_,v=h.length;v--;)if(_=h[v],_.f===f&&(!u||_.c===u))return _.j=0,h.splice(v,1),!0;return!1}function d(f){f=a.call(arguments,0),this.dispatchCount++;for(var u=this.dispatchCount,h=this._listeners,_,v,m=h.length;m--;)if(_=h[m],_&&_.j<u&&(_.j=u,_.r.apply(_.c,_.a.concat(f))===!1)){v=_;break}for(h=this._listeners,m=h.length;m--;)h[m].j=0;return v}n.exports=t})()})(minSignal$1);var minSignalExports$1=minSignal$1.exports;const MinSignal$2=getDefaultExportFromCjs(minSignalExports$1);var quickLoader$b={exports:{}},minSignal={exports:{}};(function(n){(function(e){function t(){this._listeners=[],this.dispatchCount=0}var i=t.prototype;i.add=s,i.addOnce=l,i.remove=c,i.dispatch=d;var r="Callback function is missing!",a=Array.prototype.slice;function o(f){f.sort(function(u,h){return u=u.p,h=h.p,h<u?1:u>h?-1:0})}function s(f,u,h,_){if(!f)throw r;h=h||0;for(var v=this._listeners,m,p,S,M=v.length;M--;)if(m=v[M],m.f===f&&m.c===u)return!1;typeof h=="function"&&(p=h,h=_,S=4),v.unshift({f,c:u,p:h,r:p||f,a:a.call(arguments,S||3),j:0}),o(v)}function l(f,u,h,_){if(!f)throw r;var v=this,m=function(){return v.remove.call(v,f,u),f.apply(u,a.call(arguments,0))};_=a.call(arguments,0),_.length===1&&_.push(e),_.splice(2,0,m),s.apply(v,_)}function c(f,u){if(!f)return this._listeners.length=0,!0;for(var h=this._listeners,_,v=h.length;v--;)if(_=h[v],_.f===f&&(!u||_.c===u))return _.j=0,h.splice(v,1),!0;return!1}function d(f){f=a.call(arguments,0),this.dispatchCount++;for(var u=this.dispatchCount,h=this._listeners,_,v,m=h.length;m--;)if(_=h[m],_&&_.j<u&&(_.j=u,_.r.apply(_.c,_.a.concat(f))===!1)){v=_;break}for(h=this._listeners,m=h.length;m--;)h[m].j=0;return v}n.exports=t})()})(minSignal);var minSignalExports=minSignal.exports,MinSignal$1=minSignalExports,undef$3;function QuickLoader(){this.isLoading=!1,this.totalWeight=0,this.loadedWeight=0,this.itemUrls={},this.itemList=[],this.loadingSignal=new MinSignal$1,this.crossOriginMap={},this.queue=[],this.activeItems=[],this.maxActiveItems=4}var _p$9=QuickLoader.prototype;_p$9.addChunk=addChunk;_p$9.setCrossOrigin=setCrossOrigin;_p$9.add=add;_p$9.load=load$7;_p$9.start=start;_p$9.loadNext=loadNext;_p$9._createItem=_createItem;_p$9._onLoading=_onLoading$1;_p$9.VERSION="0.1.17";_p$9.register=register;_p$9.retrieveAll=retrieveAll;_p$9.retrieve=retrieve;_p$9.testExtensions=testExtensions;_p$9.create=create;_p$9.check=check;var addedItems=_p$9.addedItems={},loadedItems=_p$9.loadedItems={},ITEM_CLASS_LIST=_p$9.ITEM_CLASS_LIST=[],ITEM_CLASSES=_p$9.ITEM_CLASSES={};quickLoader$b.exports=create();function setCrossOrigin(n,e){this.crossOriginMap[n]=e}function addChunk(n,e){var t,i,r,a,o,s=retrieveAll(n,e);for(t=0,r=s.length;t<r;t++)for(o=s[t],i=0,a=o.items.length;i<a;i++)this.add(o.items[i],{type:o.type});return s}function add(n,e){var t=addedItems[n];return t||(t=this._createItem(n,e&&e.type?e.type:retrieve(n).type,e)),e&&e.onLoad&&t.onLoaded.addOnce(e.onLoad),this.itemUrls[n]||(this.itemUrls[n]=t,this.itemList.push(t),this.totalWeight+=t.weight),t}function load$7(n,e){var t=addedItems[n];return t||(t=this._createItem(n,e&&e.type?e.type:retrieve(n).type,e)),e&&e.onLoad&&t.onLoaded.addOnce(e.onLoad),loadedItems[n]?t.dispatch():t.isStartLoaded||t.load(),t}function start(n){n&&this.loadingSignal.add(n),this.isLoading=!0;var e=this.itemList.length;if(e){var t=this.itemList.splice(0,this.itemList.length),i;for(var r in this.itemUrls)delete this.itemUrls[r];for(var a=0;a<e;a++){i=t[a];var o=!!loadedItems[i.url];i.onLoaded.addOnce(_onItemLoad,this,-1024,i,t,o),i.hasLoading&&i.loadingSignal.add(_onLoading$1,this,-1024,i,t,undef$3),o?i.dispatch(_onItemLoad):i.isStartLoaded||this.queue.push(i)}this.queue.length&&this.loadNext()}else _onItemLoad.call(this,undef$3,this.itemList)}function loadNext(){if(this.queue.length&&this.activeItems.length<this.maxActiveItems){var n=this.queue.shift();this.activeItems.push(n),this.loadNext(),n.load()}}function _onLoading$1(n,e,t,i,r){n&&!n.isLoaded&&n.getCombinedPercent(i)===1||(r===undef$3&&(this.loadedWeight=_getLoadedWeight(e),r=this.loadedWeight/this.totalWeight),t=t||this.loadingSignal,t.dispatch(r,n))}function _getLoadedWeight(n){for(var e=0,t=0,i=n.length;t<i;t++)e+=n[t].loadedWeight;return e}function _onItemLoad(n,e,t){if(this.loadedWeight=_getLoadedWeight(e),!t){for(var i=this.activeItems,r=i.length;r--;)if(i[r]===n){i.splice(r,1);break}}var a=this.loadingSignal;this.loadedWeight===this.totalWeight?(this.isLoading=!1,this.loadedWeight=0,this.totalWeight=0,this.loadingSignal=new MinSignal$1,this._onLoading(n,e,a,1,1),n&&n.noCache&&_removeItemCache(n)):(this._onLoading(n,e,a,1,this.loadedWeight/this.totalWeight),n&&n.noCache&&_removeItemCache(n),t||this.loadNext())}function _removeItemCache(n){var e=n.url;n.content=undef$3,addedItems[e]=undef$3,loadedItems[e]=undef$3}function _createItem(n,e,t){if(t=t||{},!t.crossOrigin){for(var i in this.crossOriginMap)if(n.indexOf(i)===0){t.crossOrigin=this.crossOriginMap[i];break}}return new ITEM_CLASSES[e](n,t)}function register(n){ITEM_CLASSES[n.type]||(ITEM_CLASS_LIST.push(n),ITEM_CLASSES[n.type]=n)}function retrieveAll(n,e){var t,i,r=n.length,a=[];if(r&&typeof n!="string")for(t=0;t<r;t++)i=retrieve(n[t],e),i&&(a=a.concat(i));else i=retrieve(n,e),i&&(a=a.concat(i));return a}function retrieve(n,e){var t,i,r,a,o;if(e)a=ITEM_CLASSES[e],r=a.retrieve(n);else for(t=0,i=ITEM_CLASS_LIST.length;t<i;t++){if(a=ITEM_CLASS_LIST[t],o=a.type,typeof n=="string"){if(testExtensions(n,a)){r=[n];break}}else if(r=a.retrieve(n),r&&r.length&&typeof r[0]=="string"&&testExtensions(r[0],a))break;r=undef$3,o=undef$3}if(r)return{type:e||o,items:r}}function testExtensions(n,e){if(n){for(var t=_getExtension(n),i=e.extensions,r=i.length;r--;)if(t===i[r])return!0;return!1}}function _getExtension(n){return n.split(".").pop().split(/#|\?/)[0]}function create(){return new QuickLoader}function check(){var n=[],e=[];for(var t in addedItems)n.push(t),loadedItems[t]||e.push(addedItems[t]);console.log({added:n,notLoaded:e})}var quickLoaderExports=quickLoader$b.exports,MinSignal=minSignalExports,quickLoader$a=quickLoaderExports;function AbstractItem$6(n,e){if(n){this.url=n,this.loadedWeight=0,this.weight=1,this.postPercent=0;for(var t in e)this[t]=e[t];this.type||(this.type=this.constructor.type),this.hasLoading&&(this.loadingSignal=new MinSignal,this.loadingSignal.add(_onLoading,this),this.onLoading&&this.loadingSignal.add(this.onLoading)),this.onPost?(this.onPostLoadingSignal=new MinSignal,this.onPostLoadingSignal.add(this._onPostLoading,this),this.postWeightRatio=this.postWeightRatio||.1):this.postWeightRatio=0;var i=this;this.boundOnLoad=function(){i._onLoad()},this.onLoaded=new MinSignal,quickLoader$a.addedItems[n]=this}}var AbstractItem_1=AbstractItem$6,_p$8=AbstractItem$6.prototype;_p$8.load=load$6;_p$8._onLoad=_onLoad$6;_p$8._onLoading=_onLoading;_p$8._onPostLoading=_onPostLoading;_p$8._onLoadComplete=_onLoadComplete;_p$8.getCombinedPercent=getCombinedPercent;_p$8.dispatch=dispatch;AbstractItem$6.extensions=[];AbstractItem$6.retrieve=function(){return!1};function load$6(){this.isStartLoaded=!0}function _onLoad$6(){this.onPost?this.onPost.call(this,this.content,this.onPostLoadingSignal):this._onLoadComplete()}function _onPostLoading(n){this.postPercent=n,this.hasLoading&&this.loadingSignal.dispatch(1),n===1&&this._onLoadComplete()}function _onLoadComplete(){this.isLoaded=!0,this.loadedWeight=this.weight,quickLoader$a.loadedItems[this.url]=this,this.onLoaded.dispatch(this.content)}function getCombinedPercent(n){return n*(1-this.postWeightRatio)+this.postWeightRatio*this.postPercent}function _onLoading(n){this.loadedWeight=this.weight*this.getCombinedPercent(n)}function dispatch(){this.hasLoading&&this.loadingSignal.remove(),this.onLoaded.dispatch(this.content)}var AbstractItem$5=AbstractItem_1,quickLoader$9=quickLoaderExports;function __generateFuncName(){return"_jsonp"+new Date().getTime()+~~(Math.random()*1e8)}function JSONPItem(n){n&&_super$7.constructor.apply(this,arguments)}JSONPItem.type="jsonp";JSONPItem.extensions=[];quickLoader$9.register(JSONPItem);JSONPItem.retrieve=function(n){return typeof n=="string"&&n.indexOf("=")>-1?[n]:!1};var _super$7=AbstractItem$5.prototype,_p$7=JSONPItem.prototype=new AbstractItem$5;_p$7.constructor=JSONPItem;_p$7.load=load$5;function load$5(n){_super$7.load.apply(this,arguments);var e=this,t=this.url.lastIndexOf("=")+1,i=this.url.substr(0,t),r=this.url.substr(t);r.length===0?(r=__generateFuncName(),this.jsonpCallback=n):this.jsonpCallback=this.jsonpCallback||window[r],window[r]=function(o){a.parentNode&&a.parentNode.removeChild(a),e.content=o,e._onLoad()};var a=document.createElement("script");a.type="text/javascript",a.src=i+r,document.getElementsByTagName("head")[0].appendChild(a)}var AbstractItem$4=AbstractItem_1,quickLoader$8=quickLoaderExports,undef$2,IS_SUPPORT_XML_HTTP_REQUEST=!!window.XMLHttpRequest;function XHRItem$1(n){n&&(_super$6.constructor.apply(this,arguments),this.responseType=this.responseType||"",this.method=this.method||"GET")}var XHRItem_1=XHRItem$1;XHRItem$1.type="xhr";XHRItem$1.extensions=[];quickLoader$8.register(XHRItem$1);XHRItem$1.retrieve=function(){return!1};var _super$6=AbstractItem$4.prototype,_p$6=XHRItem$1.prototype=new AbstractItem$4;_p$6.constructor=XHRItem$1;_p$6.load=load$4;_p$6._onXmlHttpChange=_onXmlHttpChange;_p$6._onXmlHttpProgress=_onXmlHttpProgress;_p$6._onLoad=_onLoad$5;function load$4(){_super$6.load.apply(this,arguments);var n=this,e;IS_SUPPORT_XML_HTTP_REQUEST?e=this.xmlhttp=new XMLHttpRequest:e=this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"),this.hasLoading&&(e.onprogress=function(t){n._onXmlHttpProgress(t)}),e.onreadystatechange=function(){n._onXmlHttpChange()},e.open(this.method,this.url,!0),this.xmlhttp.responseType=this.responseType,IS_SUPPORT_XML_HTTP_REQUEST?e.send(null):e.send()}function _onXmlHttpProgress(n){this.loadingSignal.dispatch(n.loaded/n.total)}function _onXmlHttpChange(){this.xmlhttp.readyState===4&&this.xmlhttp.status===200&&this._onLoad(this.xmlhttp)}function _onLoad$5(){this.content||(this.content=this.xmlhttp.response),this.xmlhttp=undef$2,_super$6._onLoad.call(this)}var XHRItem=XHRItem_1,quickLoader$7=quickLoaderExports;function TextItem$1(n,e){n&&(e.responseType="text",_super$5.constructor.apply(this,arguments))}var TextItem_1=TextItem$1;TextItem$1.type="text";TextItem$1.extensions=["html","txt","svg"];quickLoader$7.register(TextItem$1);TextItem$1.retrieve=function(){return!1};var _super$5=XHRItem.prototype,_p$5=TextItem$1.prototype=new XHRItem;_p$5.constructor=TextItem$1;_p$5._onLoad=_onLoad$4;function _onLoad$4(){this.content||(this.content=this.xmlhttp.responseText),_super$5._onLoad.apply(this,arguments)}var TextItem=TextItem_1,quickLoader$6=quickLoaderExports;function JSONItem(n){n&&_super$4.constructor.apply(this,arguments)}JSONItem.type="json";JSONItem.extensions=["json"];quickLoader$6.register(JSONItem);JSONItem.retrieve=function(){return!1};var _super$4=TextItem.prototype,_p$4=JSONItem.prototype=new TextItem;_p$4.constructor=JSONItem;_p$4._onLoad=_onLoad$3;function _onLoad$3(){this.content||(this.content=window.JSON&&window.JSON.parse?JSON.parse(this.xmlhttp.responseText.toString()):eval(this.xmlhttp.responseText.toString())),_super$4._onLoad.call(this)}var AbstractItem$3=AbstractItem_1,quickLoader$5=quickLoaderExports,undef$1;function AudioItem(n,e){if(n){this.loadThrough=!e||e.loadThrough===undef$1?!0:e.loadThrough,_super$3.constructor.apply(this,arguments);try{this.content=this.content||new Audio}catch{this.content=this.content||document.createElement("audio")}this.crossOrigin&&(this.content.crossOrigin=this.crossOrigin)}}AudioItem.type="audio";AudioItem.extensions=["mp3","ogg"];quickLoader$5.register(AudioItem);AudioItem.retrieve=function(n){return!1};var _super$3=AbstractItem$3.prototype,_p$3=AudioItem.prototype=new AbstractItem$3;_p$3.constructor=AudioItem;_p$3.load=load$3;_p$3._onLoad=_onLoad$2;function load$3(){_super$3.load.apply(this,arguments);var n=this,e=n.content;e.src=this.url,this.loadThrough?e.addEventListener("canplaythrough",this.boundOnLoad,!1):e.addEventListener("canplay",this.boundOnLoad,!1),e.load()}function _onLoad$2(){this.content.removeEventListener("canplaythrough",this.boundOnLoad,!1),this.content.removeEventListener("canplay",this.boundOnLoad,!1),!this.isLoaded&&_super$3._onLoad.call(this)}var AbstractItem$2=AbstractItem_1,quickLoader$4=quickLoaderExports,undef;function VideoItem(n,e){if(n){this.loadThrough=!e||e.loadThrough===undef?!0:e.loadThrough,_super$2.constructor.apply(this,arguments);try{this.content=this.content||new Video}catch{this.content=this.content||document.createElement("video")}this.crossOrigin&&(this.content.crossOrigin=this.crossOrigin)}}VideoItem.type="video";VideoItem.extensions=["mp4","webm","ogv"];quickLoader$4.register(VideoItem);VideoItem.retrieve=function(n){return!1};var _super$2=AbstractItem$2.prototype,_p$2=VideoItem.prototype=new AbstractItem$2;_p$2.constructor=VideoItem;_p$2.load=load$2;_p$2._onLoad=_onLoad$1;function load$2(){_super$2.load.apply(this,arguments);var n=this.content;n.preload="auto",n.src=this.url,this.loadThrough?n.addEventListener("canplaythrough",this.boundOnLoad,!1):n.addEventListener("canplay",this.boundOnLoad,!1),n.load()}function _onLoad$1(){this.content.removeEventListener("canplaythrough",this.boundOnLoad),this.content.removeEventListener("canplay",this.boundOnLoad),!this.isLoaded&&_super$2._onLoad.call(this)}var AbstractItem$1=AbstractItem_1,quickLoader$3=quickLoaderExports;function AnyItem(n,e){n&&(_super$1.constructor.call(this,n,e),!this.loadFunc&&console&&console[console.error||console.log]("require loadFunc in the config object."))}AnyItem.type="any";AnyItem.extensions=[];quickLoader$3.register(AnyItem);AnyItem.retrieve=function(){return!1};var _super$1=AbstractItem$1.prototype,_p$1=AnyItem.prototype=new AbstractItem$1;_p$1.constructor=AnyItem;_p$1.load=load$1;function load$1(){var n=this;this.loadFunc(this.url,function(e){n.content=e,_super$1._onLoad.call(n)},this.loadingSignal)}function computedStyle$1(n,e,t,i){if(t=window.getComputedStyle,i=t?t(n):n.currentStyle,i)return i[e.replace(/-(\w)/gi,function(r,a){return a.toUpperCase()})]}var computedStyle_commonjs=computedStyle$1,AbstractItem=AbstractItem_1,computedStyle=computedStyle_commonjs,quickLoader$2=quickLoaderExports;function ImageItem(n,e){n&&(_super.constructor.apply(this,arguments),this.content=this.content||new Image,this.crossOrigin&&(this.content.crossOrigin=this.crossOrigin))}var _super=AbstractItem.prototype,_p=ImageItem.prototype=new AbstractItem;_p.constructor=ImageItem;_p.load=load;_p._onLoad=_onLoad;ImageItem.retrieve=function(n){if(n.nodeType&&n.style){var e=[];n.nodeName.toLowerCase()==="img"&&n.src.indexOf(";")<0&&e.push(n.src),computedStyle(n,"background-image").replace(/s?url\(\s*?['"]?([^;]*?)['"]?\s*?\)/g,function(i,r){e.push(r)});for(var t=e.length;t--;)_isNotData(e[t])||e.splice(t,1);return e.length?e:!1}else return typeof n=="string"?[n]:!1};ImageItem.type="image";ImageItem.extensions=["jpg","gif","png"];quickLoader$2.register(ImageItem);function load(){_super.load.apply(this,arguments);var n=this.content;n.onload=this.boundOnLoad,n.src=this.url}function _onLoad(){delete this.content.onload,this.width=this.content.width,this.height=this.content.height,_super._onLoad.call(this)}function _isNotData(n){return n.indexOf("data:")!==0}var quickLoader=quickLoaderExports;const quickLoader$1=getDefaultExportFromCjs(quickLoader);var isSSR=typeof window>"u",DetectUA=function(){function n(e){this.userAgent=e||(!isSSR&&window.navigator?window.navigator.userAgent:""),this.isAndroidDevice=!/like android/i.test(this.userAgent)&&/android/i.test(this.userAgent),this.iOSDevice=this.match(1,/(iphone|ipod|ipad)/i).toLowerCase(),!isSSR&&navigator.platform==="MacIntel"&&navigator.maxTouchPoints>2&&!window.MSStream&&(this.iOSDevice="ipad")}return n.prototype.match=function(e,t){var i=this.userAgent.match(t);return i&&i.length>1&&i[e]||""},Object.defineProperty(n.prototype,"isMobile",{get:function(){return!this.isTablet&&(/[^-]mobi/i.test(this.userAgent)||this.iOSDevice==="iphone"||this.iOSDevice==="ipod"||this.isAndroidDevice||/nexus\s*[0-6]\s*/i.test(this.userAgent))},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isTablet",{get:function(){return/tablet/i.test(this.userAgent)&&!/tablet pc/i.test(this.userAgent)||this.iOSDevice==="ipad"||this.isAndroidDevice&&!/[^-]mobi/i.test(this.userAgent)||!/nexus\s*[0-6]\s*/i.test(this.userAgent)&&/nexus\s*[0-9]+/i.test(this.userAgent)},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isDesktop",{get:function(){return!this.isMobile&&!this.isTablet},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isMacOS",{get:function(){return/macintosh/i.test(this.userAgent)&&{version:this.match(1,/mac os x (\d+(\.?_?\d+)+)/i).replace(/[_\s]/g,".").split(".").map(function(e){return e})[1]}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isWindows",{get:function(){return/windows /i.test(this.userAgent)&&{version:this.match(1,/Windows ((NT|XP)( \d\d?.\d)?)/i)}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isiOS",{get:function(){return!!this.iOSDevice&&{version:this.match(1,/os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g,".")||this.match(1,/version\/(\d+(\.\d+)?)/i)}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"isAndroid",{get:function(){return this.isAndroidDevice&&{version:this.match(1,/android[ \/-](\d+(\.\d+)*)/i)}},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"browser",{get:function(){var e=this.match(1,/version\/(\d+(\.\d+)?)/i);return/opera/i.test(this.userAgent)?{name:"Opera",version:e||this.match(1,/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)}:/opr\/|opios/i.test(this.userAgent)?{name:"Opera",version:this.match(1,/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i)||e}:/SamsungBrowser/i.test(this.userAgent)?{name:"Samsung Internet for Android",version:e||this.match(1,/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(this.userAgent)?{name:"Yandex Browser",version:e||this.match(1,/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/ucbrowser/i.test(this.userAgent)?{name:"UC Browser",version:this.match(1,/(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i)}:/msie|trident/i.test(this.userAgent)?{name:"Internet Explorer",version:this.match(1,/(?:msie |rv:)(\d+(\.\d+)?)/i)}:/(edge|edgios|edga|edg)/i.test(this.userAgent)?{name:"Microsoft Edge",version:this.match(2,/(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel|fxios/i.test(this.userAgent)?{name:"Firefox",version:this.match(1,/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)}:/chromium/i.test(this.userAgent)?{name:"Chromium",version:this.match(1,/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i)||e}:/chrome|crios|crmo/i.test(this.userAgent)?{name:"Chrome",version:this.match(1,/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/safari|applewebkit/i.test(this.userAgent)?{name:"Safari",version:e}:{name:this.match(1,/^(.*)\/(.*) /),version:this.match(2,/^(.*)\/(.*) /)}},enumerable:!1,configurable:!0}),n}();const detectUA=new DetectUA,userAgent=(navigator.userAgent||navigator.vendor).toLowerCase(),browserName=detectUA.browser.name;class Browser{isMobile=detectUA.isMobile||detectUA.isTablet;isDesktop=detectUA.isDesktop;device=this.isMobile?"mobile":"desktop";isAndroid=!!detectUA.isAndroid;isIOS=!!detectUA.isiOS;isMacOS=!!detectUA.isMacOS;isWindows=detectUA.isWindows.version!==null;isLinux=userAgent.indexOf("linux")!=-1;ua=userAgent;isEdge=browserName==="Microsoft Edge";isIE=browserName==="Internet Explorer";isFirefox=browserName==="Firefox";isChrome=browserName==="Chrome";isOpera=browserName==="Opera";isSafari=browserName==="Safari";isSupportMSAA=!userAgent.match("version/15.4 ");isRetina=window.devicePixelRatio&&window.devicePixelRatio>=1.5;devicePixelRatio=window.devicePixelRatio||1;cpuCoreCount=navigator.hardwareConcurrency||1;baseUrl=document.location.origin;isIFrame=window.self!==window.top;isSupportAvif;constructor(){}testSupport(){properties.loader.add("browserSupport",{type:"any",loadFunc:(e,t)=>{let i=0;function r(){i++,i===1&&t()}_testSupport("Avif","avif","AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=",r)}})}}const browser=new Browser;function _testSupport(n,e,t,i){browser["isSupport"+n]=!1;const r=new Image;r.onload=()=>{browser["isSupport"+n]=!0,i()},r.onerror=i,r.src=`data:image/${e};base64,${t}`}const _c=new Color;class Properties{win=window;isSecureConnection=window.location.protocol==="https:";isResizing=!1;useMobileLayout=!1;loader=quickLoader$1.create();percent=0;easedPercent=0;_isSupportedDevice=!1;_isSupportedBrowser=!1;_isSupportedWebGL=!1;_isSupportedMobileOrientation=!1;_isSupported=!1;time=0;deltaTime=0;tick=0;hasInitialized=!1;hasStarted=!1;startTime=0;viewportWidth=0;viewportHeight=0;width=0;height=0;renderer=null;scene=null;camera=null;postprocessing=null;resolution=new Vector2;viewportResolution=new Vector2;bgColor=new Color;debugAlpha=!1;skipProfileUpdate=!1;canvas=null;gl=null;webglOpts={antialias:!1,alpha:!1,xrCompatible:!0};sharedUniforms={u_useMobileLayout:{value:!1},u_brdfLut:{value:null},u_cameraMVP:{value:null},u_cameraDirection:{value:this.cameraDirection},u_time:{value:0},u_deltaTime:{value:1},u_resolution:{value:this.resolution},u_viewportResolution:{value:this.viewportResolution},u_bgColor:{value:this.bgColor}};glDPR=1;compileList=[];paddingX=0;paddingY=0;bgColorHex="#000000";opacity=1;exporterSignal=new MinSignal$2;onFirstClicked=new MinSignal$2;drawBuffersExt=null;globalColors={};getMobileUrl(e){return e.replace(/\.([^.]+)$/,"_MOBILE.$1")}readCSSProperties(){let e=!1;return["white","warm-white","black","dark-black","grey","dark-grey","thesis-grey","primary"].forEach(i=>{const r=window.getComputedStyle(document.documentElement).getPropertyValue(`--color-${i}`);r&&(e=!0,_c.set(r),this.globalColors[i]={hex:"#"+_c.getHexString(),rgbFloat:_c.getRGB({r:0,g:0,b:0}),hslFloat:_c.getHSL({h:0,s:0,l:0})},this.globalColors[i].rgbInt={r:Math.round(this.globalColors[i].rgbFloat.r*255),g:Math.round(this.globalColors[i].rgbFloat.g*255),b:Math.round(this.globalColors[i].rgbFloat.b*255)},this.globalColors[i].hslInt={h:Math.round(this.globalColors[i].hslFloat.h*360),s:Math.round(this.globalColors[i].hslFloat.s*100),l:Math.round(this.globalColors[i].hslFloat.l*100)})}),e}}const properties=new Properties;var _populated=!1,_ie,_firefox,_opera,_webkit,_chrome,_ie_real_version,_osx,_windows,_linux,_android,_win64,_iphone,_ipad,_native,_mobile;function _populate(){if(!_populated){_populated=!0;var n=navigator.userAgent,e=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(n),t=/(Mac OS X)|(Windows)|(Linux)/.exec(n);if(_iphone=/\b(iPhone|iP[ao]d)/.exec(n),_ipad=/\b(iP[ao]d)/.exec(n),_android=/Android/i.exec(n),_native=/FBAN\/\w+;/i.exec(n),_mobile=/Mobile/i.exec(n),_win64=!!/Win64/.exec(n),e){_ie=e[1]?parseFloat(e[1]):e[5]?parseFloat(e[5]):NaN,_ie&&document&&document.documentMode&&(_ie=document.documentMode);var i=/(?:Trident\/(\d+.\d+))/.exec(n);_ie_real_version=i?parseFloat(i[1])+4:_ie,_firefox=e[2]?parseFloat(e[2]):NaN,_opera=e[3]?parseFloat(e[3]):NaN,_webkit=e[4]?parseFloat(e[4]):NaN,_webkit?(e=/(?:Chrome\/(\d+\.\d+))/.exec(n),_chrome=e&&e[1]?parseFloat(e[1]):NaN):_chrome=NaN}else _ie=_firefox=_opera=_chrome=_webkit=NaN;if(t){if(t[1]){var r=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(n);_osx=r?parseFloat(r[1].replace("_",".")):!0}else _osx=!1;_windows=!!t[2],_linux=!!t[3]}else _osx=_windows=_linux=!1}}var UserAgent_DEPRECATED$1={ie:function(){return _populate()||_ie},ieCompatibilityMode:function(){return _populate()||_ie_real_version>_ie},ie64:function(){return UserAgent_DEPRECATED$1.ie()&&_win64},firefox:function(){return _populate()||_firefox},opera:function(){return _populate()||_opera},webkit:function(){return _populate()||_webkit},safari:function(){return UserAgent_DEPRECATED$1.webkit()},chrome:function(){return _populate()||_chrome},windows:function(){return _populate()||_windows},osx:function(){return _populate()||_osx},linux:function(){return _populate()||_linux},iphone:function(){return _populate()||_iphone},mobile:function(){return _populate()||_iphone||_ipad||_android||_mobile},nativeApp:function(){return _populate()||_native},android:function(){return _populate()||_android},ipad:function(){return _populate()||_ipad}},UserAgent_DEPRECATED_1=UserAgent_DEPRECATED$1,canUseDOM=!!(typeof window<"u"&&window.document&&window.document.createElement),ExecutionEnvironment$1={canUseDOM},ExecutionEnvironment_1=ExecutionEnvironment$1,ExecutionEnvironment=ExecutionEnvironment_1,useHasFeature;ExecutionEnvironment.canUseDOM&&(useHasFeature=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0);/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */function isEventSupported$1(n,e){if(!ExecutionEnvironment.canUseDOM||e&&!("addEventListener"in document))return!1;var t="on"+n,i=t in document;if(!i){var r=document.createElement("div");r.setAttribute(t,"return;"),i=typeof r[t]=="function"}return!i&&useHasFeature&&n==="wheel"&&(i=document.implementation.hasFeature("Events.wheel","3.0")),i}var isEventSupported_1=isEventSupported$1,UserAgent_DEPRECATED=UserAgent_DEPRECATED_1,isEventSupported=isEventSupported_1,PIXEL_STEP=10,LINE_HEIGHT=40,PAGE_HEIGHT=800;function normalizeWheel$2(n){var e=0,t=0,i=0,r=0;return"detail"in n&&(t=n.detail),"wheelDelta"in n&&(t=-n.wheelDelta/120),"wheelDeltaY"in n&&(t=-n.wheelDeltaY/120),"wheelDeltaX"in n&&(e=-n.wheelDeltaX/120),"axis"in n&&n.axis===n.HORIZONTAL_AXIS&&(e=t,t=0),i=e*PIXEL_STEP,r=t*PIXEL_STEP,"deltaY"in n&&(r=n.deltaY),"deltaX"in n&&(i=n.deltaX),(i||r)&&n.deltaMode&&(n.deltaMode==1?(i*=LINE_HEIGHT,r*=LINE_HEIGHT):(i*=PAGE_HEIGHT,r*=PAGE_HEIGHT)),i&&!e&&(e=i<1?-1:1),r&&!t&&(t=r<1?-1:1),{spinX:e,spinY:t,pixelX:i,pixelY:r}}normalizeWheel$2.getEventType=function(){return UserAgent_DEPRECATED.firefox()?"DOMMouseScroll":isEventSupported("wheel")?"wheel":"mousewheel"};var normalizeWheel_1=normalizeWheel$2,normalizeWheel=normalizeWheel_1;const normalizeWheel$1=getDefaultExportFromCjs(normalizeWheel);class SecondOrderDynamics{target0=null;target=null;prevTarget=null;value=null;valueVel=null;k1;k2;k3;_f;_z;_r;_w;_z;_d;_targetVelCache;_cache1;_cache2;_k1Stable;_k2Stable;isVector=null;isRobust=null;constructor(e,t=1.5,i=.8,r=2,a=!0){this.isRobust=a,this.isVector=typeof e=="object",this.setFZR(t,i,r),this.isVector?(this.target=e,this.target0=e.clone(),this.prevTarget=e.clone(),this.value=e.clone(),this.valueVel=e.clone().setScalar(0),this._targetVelCache=this.valueVel.clone(),this._cache1=this.valueVel.clone(),this._cache2=this.valueVel.clone(),this.update=this._updateVector,this.reset=this._resetVector):(this.target0=e,this.prevTarget=e,this.value=e,this.valueVel=0,this.update=this._updateNumber,this.reset=this._resetNumber),this.computeStableCoefficients=a?this._computeRobustStableCoefficients:this._computeStableCoefficients}update(e,t=0){}reset(e=null){}_resetVector(e=this.target0){this.valueVel.setScalar(0),this.prevTarget.copy(e),this.target.copy(e),this.value.copy(e)}_resetNumber(e=this.target0){this.valueVel=0,this.prevTarget=e,this.target=e,this.value=e}setFZR(e=this._f,t=this._z,i=this._r){let r=Math.PI*2*e;this.isRobust&&(this._w=r,this._z=t,this._d=this._w*Math.sqrt(Math.abs(this._z*this._z-1))),this.k1=t/(Math.PI*e),this.k2=1/(r*r),this.k3=i*t/r}_computeStableCoefficients(e){this._k1Stable=this.k1,this._k2Stable=Math.max(this.k2,1.1*e*e/4+e*this.k1/2)}_computeRobustStableCoefficients(e){if(this._w*e<this._z)this._k1Stable=this.k1,this._k2Stable=Math.max(this.k2,e*e/2+e*this.k1/2,e*this.k1);else{let t=Math.exp(-this._z*this._w*e),i=2*t*(this._z<=1?Math.cos(e*this._d):Math.cosh(e*this._d)),r=t*t,a=e/(1+r-i);this._k1Stable=(1-r)*a,this._k2Stable=e*a}}_updateVector(e){e>0&&(this._targetVelCache.copy(this.target).sub(this.prevTarget).divideScalar(e),this.prevTarget.copy(this.target),this.computeStableCoefficients(e),this.value.add(this._cache1.copy(this.valueVel).multiplyScalar(e)),this._cache1.copy(this.target).add(this._targetVelCache.multiplyScalar(this.k3)).sub(this.value).sub(this._cache2.copy(this.valueVel).multiplyScalar(this._k1Stable)).multiplyScalar(e/this._k2Stable),this.valueVel.add(this._cache1))}_updateNumber(e,t=this.target){if(e>0){let i=(t-this.prevTarget)/e;this.prevTarget=t,this.computeStableCoefficients(e),this.value+=this.valueVel*e,this.valueVel+=(t+this.k3*i-this.value-this._k1Stable*this.valueVel)*(e/this._k2Stable)}}}class Input{onDowned=new MinSignal$2;onMoved=new MinSignal$2;onUped=new MinSignal$2;onClicked=new MinSignal$2;onWheeled=new MinSignal$2;onXScrolled=new MinSignal$2;onYScrolled=new MinSignal$2;wasDown=!1;isDown=!1;downTime=0;hasClicked=!1;hasMoved=!1;hadMoved=!1;justClicked=!1;mouseXY=new Vector2;_prevMouseXY=new Vector2;prevMouseXY=new Vector2;mousePixelXY=new Vector2;_prevMousePixelXY=new Vector2;prevMousePixelXY=new Vector2;downXY=new Vector2;downPixelXY=new Vector2;deltaXY=new Vector2;_deltaXY=new Vector2;deltaPixelXY=new Vector2;_deltaPixelXY=new Vector2;deltaDownXY=new Vector2;deltaDownPixelXY=new Vector2;deltaDownPixelDistance=0;deltaWheel=0;deltaDragScrollX=0;deltaScrollX=0;deltaDragScrollY=0;deltaScrollY=0;isDragScrollingX=!1;isDragScrollingY=!1;isWheelScrolling=!1;dragScrollXMomentum=0;dragScrollYMomentum=0;dragScrollMomentumMultiplier=10;canDesktopDragScroll=!1;needsCheckDragScrollDirection=!1;lastScrollXDirection=0;lastScrollYDirection=0;easedMouseDynamics={};dragScrollDynamic;downThroughElems=[];currThroughElems=[];prevThroughElems=[];clickThroughElems=[];preInit(){const e=document.documentElement;e.addEventListener("mousedown",this._onDown.bind(this)),e.addEventListener("touchstart",this._getTouchBound(this,this._onDown)),e.addEventListener("mousemove",this._onMove.bind(this)),e.addEventListener("touchmove",this._getTouchBound(this,this._onMove)),e.addEventListener("mouseup",this._onUp.bind(this)),e.addEventListener("touchend",this._getTouchBound(this,this._onUp)),e.addEventListener("wheel",this._onWheel.bind(this)),e.addEventListener("mousewheel",this._onWheel.bind(this)),this.addEasedInput("default",1.35,.5,1.25),this.dragScrollDynamic=this.addEasedInput("dragScroll",2,1,1),this.goboClickDynamic=this.addEasedInput("gobo",1,.3,2),this.onUped.addOnce(()=>{properties.onFirstClicked.dispatch()}),e.addEventListener("dragend",this._onUp.bind(this))}init(){}resize(){for(let e in this.easedMouseDynamics)this.easedMouseDynamics[e].reset()}update(e){for(let t in this.easedMouseDynamics){let i=this.easedMouseDynamics[t];i.target.copy(this.mouseXY),i.update(e)}}addEasedInput(e,t=1.5,i=.8,r=2){return this.easedMouseDynamics[e]=new SecondOrderDynamics(new Vector2,t,i,r)}postUpdate(e){this.prevThroughElems.length=0,this.prevThroughElems.concat(this.currThroughElems),this.deltaWheel=0,this.deltaDragScrollX=0,this.deltaDragScrollY=0,this.deltaScrollX=0,this.deltaScrollY=0,this.dragScrollXMomentum=0,this.dragScrollYMomentum=0,this.deltaXY.set(0,0),this.deltaPixelXY.set(0,0),this.prevMouseXY.copy(this.mouseXY),this.prevMousePixelXY.copy(this.mousePixelXY),this.hadMoved=this.hasMoved,this.wasDown=this.isDown,this.justClicked=!1,this.isWheelScrolling=!1}_onWheel(e){let t=normalizeWheel$1(e).pixelY;t=math.clamp(t,-200,200),this.deltaWheel+=t,this.deltaScrollX=this.deltaDragScrollX+this.deltaWheel,this.deltaScrollY=this.deltaDragScrollY+this.deltaWheel,this.lastScrollXDirection=this.deltaWheel>0?1:-1,this.lastScrollYDirection=this.deltaWheel>0?1:-1,this.isWheelScrolling=!0,this.onWheeled.dispatch(e.target),this.onXScrolled.dispatch(e.target),this.onYScrolled.dispatch(e.target)}_onDown(e){e.button===2||e.button===1||(this.isDown=!0,this.downTime=+new Date,this.prevThroughElems.length=0,this._setThroughElementsByEvent(e,this.downThroughElems),this._getInputXY(e,this.downXY),this._getInputPixelXY(e,this.downPixelXY),this._prevMouseXY.copy(this.downXY),this._prevMousePixelXY.copy(this.downPixelXY),this._deltaXY.set(0,0),this._deltaPixelXY.set(0,0),this._getInputXY(e,this.mouseXY),this.dragScrollDynamic.reset(this.mouseXY),this.isDragScrollingX=!1,this.isDragScrollingY=!1,this.needsCheckDragScrollDirection=!1,this._onMove(e),this.onDowned.dispatch(e),this.needsCheckDragScrollDirection=!0)}_onMove(e){e.button===2||e.button===1||(this._getInputXY(e,this.mouseXY),this._getInputPixelXY(e,this.mousePixelXY),this._deltaXY.copy(this.mouseXY).sub(this._prevMouseXY),this._deltaPixelXY.copy(this.mousePixelXY).sub(this._prevMousePixelXY),this._prevMouseXY.copy(this.mouseXY),this._prevMousePixelXY.copy(this.mousePixelXY),this.deltaXY.add(this._deltaXY),this.deltaPixelXY.add(this._deltaPixelXY),this.hasMoved=this._deltaXY.length()>0,this.isDown&&(this.deltaDownXY.copy(this.mouseXY).sub(this.downXY),this.deltaDownPixelXY.copy(this.mousePixelXY).sub(this.downPixelXY),this.deltaDownPixelDistance=this.deltaDownPixelXY.length(),(browser.isMobile||this.canDesktopDragScroll)&&(this.needsCheckDragScrollDirection&&(this.isDragScrollingX=Math.abs(this._deltaPixelXY.x)>Math.abs(this._deltaPixelXY.y),this.isDragScrollingY=!this.isDragScrollingX,this.needsCheckDragScrollDirection=!1),this.isDragScrollingX&&(this.deltaDragScrollX+=-this._deltaPixelXY.x,this.deltaScrollX+=-this._deltaPixelXY.x+this.deltaWheel,this.lastScrollXDirection=this.deltaDragScrollX>0?1:-1,this.onXScrolled.dispatch(e.target)),this.isDragScrollingY&&(this.deltaDragScrollY+=-this._deltaPixelXY.y,this.deltaScrollY+=-this._deltaPixelXY.y+this.deltaWheel,this.lastScrollYDirection=this.deltaDragScrollY>0?1:-1,this.onYScrolled.dispatch(e.target)))),this._setThroughElementsByEvent(e,this.currThroughElems),this.onMoved.dispatch(e))}_onUp(e){if(e.button===2||e.button===1||!this.isDown)return;const t=e.clientX-this.downPixelXY.x,i=e.clientY-this.downPixelXY.y;Math.sqrt(t*t+i*i)<40&&+new Date-this.downTime<300&&(this._setThroughElementsByEvent(e,this.clickThroughElems),this._getInputXY(e,this.mouseXY),this.hasClicked=!0,this.justClicked=!0,this.onClicked.dispatch(e)),this.deltaDownXY.set(0,0),this.deltaDownPixelXY.set(0,0),this.deltaDownPixelDistance=0,this.dragScrollXMomentum=this.dragScrollDynamic.valueVel.y*properties.viewportWidth*this.dragScrollMomentumMultiplier*properties.deltaTime,this.dragScrollYMomentum=this.dragScrollDynamic.valueVel.y*properties.viewportHeight*this.dragScrollMomentumMultiplier*properties.deltaTime,this.isDown=!1,this.needsCheckDragScrollDirection=!1,this.onUped.dispatch(e)}_getTouchBound(e,t,i){return function(r){document.documentElement.classList.contains("is-static-fallback")||(i&&r.preventDefault&&r.preventDefault(),t.call(e,r.changedTouches[0]||r.touches[0]))}}_getInputXY(e,t){return t.set(e.clientX/properties.viewportWidth*2-1,1-e.clientY/properties.viewportHeight*2),t}_getInputPixelXY(e,t){t.set(e.clientX,e.clientY)}_setThroughElementsByEvent(e,t){let i=e.target;for(t.length=0;i.parentNode;)t.push(i),i=i.parentNode}hasThroughElem(e,t){let i=this[t+"ThroughElems"]||this.currThroughElems,r=i.length;for(;r--;)if(i[r]===e)return!0;return!1}hasThroughElemWithClass(e,t){let i=this[t+"ThroughElems"]||this.currThroughElems,r=i.length;for(;r--;)if(i[r].classList.contains(e))return i[r];return null}}const input=new Input;class ScrollDomRange{constructor(e,t){let i=Array.isArray(e);this.refDomFrom=i?e[0]:e,this.refDomTo=i?e[1]:e,this.isVertical=t,this.needsUpdate=!0,this.forcedUpdate=!0,this.screenX=0,this.screenY=0,this.ratio=0,this.screenRatio=0,this.isActive=!1,this._left=0,this._right=0,this._top=0,this._bottom=0,this.left=0,this.right=0,this.top=0,this.bottom=0,this.width=0,this.height=0,this.showScreenOffset=0,this.hideScreenOffset=0,this.viewSize=0}update(e,t,i,r){if(r=r||this.needsUpdate,r){let s=this.refDomFrom.getBoundingClientRect(),l=this.refDomFrom===this.refDomTo?s:this.refDomTo.getBoundingClientRect();this.needsUpdate=!1,this._left=s.left,this._right=l.right,this._top=s.top,this._bottom=l.bottom,this.width=l.right-s.left,this.height=l.bottom-s.top,this.forcedUpdate=!1,this.isVertical?(this._top+=e,this._bottom+=e):(this._left+=e,this._right+=e)}this.left=this._left,this.right=this._right,this.top=this._top,this.bottom=this._bottom,this.isVertical?(this.top+=i,this.bottom+=i):(this.left+=i,this.right+=i),this.screenX=this.left,this.screenY=this.top;let a;this.isVertical?a=this.screenY-=e:a=this.screenX-=e;let o=this.isVertical?this.height:this.width;this.viewSize=o/t,this.ratio=Math.min(0,math.unClampedFit(a,t,t-o,-1,0)),this.ratio+=Math.max(0,math.unClampedFit(a,0,-o,0,1)),this.screenRatio=math.fit(a,t,-o,-1,1),this.showScreenOffset=-(a-t)/t,this.hideScreenOffset=-(a+o)/t,this.isActive=this.ratio>=-1&&this.ratio<=1}}function waitForImage(n,e=1e4){return!n||n.complete&&n.naturalWidth?Promise.resolve(!0):(n.loading="eager",new Promise(t=>{let i;const r=s=>{clearTimeout(i),n.removeEventListener("load",a),n.removeEventListener("error",o),t(s)},a=()=>r(!0),o=()=>r(!1);n.addEventListener("load",a,{once:!0}),n.addEventListener("error",o,{once:!0}),i=setTimeout(o,e)}))}function waitForVideo(n,{timeoutMs:e=12e3,bufferSeconds:t=1.5,startPlayback:i=!1}={}){return!n||n.error?Promise.resolve(!1):new Promise(r=>{let a=!1,o;const s=["loadeddata","canplay","progress","timeupdate"],l=()=>{n.readyState>=2&&d(!0)},c=[...n.querySelectorAll("source")],d=h=>{a||(a=!0,clearTimeout(o),s.forEach(_=>n.removeEventListener(_,f)),n.removeEventListener("error",u),n.removeEventListener("playing",l),c.forEach(_=>_.removeEventListener("error",u)),r(h))},f=()=>{if(!(n.readyState<3)){for(let h=0;h<n.buffered.length;h++)if(n.buffered.start(h)<=n.currentTime&&n.buffered.end(h)>=Math.min(n.currentTime+t,n.duration||1/0))return d(!0)}},u=()=>d(!1);if(s.forEach(h=>n.addEventListener(h,f)),n.addEventListener("error",u,{once:!0}),c.forEach(h=>h.addEventListener("error",u,{once:!0})),o=setTimeout(u,e),f(),i&&!a){n.muted=!0,n.playsInline=!0,n.addEventListener("playing",l);try{n.play()?.then(l,u)}catch{u()}}})}class HeroVideo{videoEl;readyPromise;preInit(){this.videoEl=document.getElementById("hero-video")}init(){}prepare(){if(this.videoEl||=document.getElementById("hero-video"),this.readyPromise)return this.readyPromise;const e=this.videoEl;let t=!1;e.querySelectorAll("source[data-src]").forEach(r=>{r.getAttribute("src")||(r.src=r.dataset.src,t=!0)}),e.preload="auto";const i=new Image;return i.src=e.poster,t&&e.load(),this.readyPromise=Promise.all([waitForVideo(e,{startPlayback:!0,timeoutMs:6e3}),waitForImage(i)]).then(([r])=>(document.documentElement.classList.toggle("hero-video-unavailable",!r),r)).finally(()=>{this.readyPromise=null}),this.readyPromise}playVideo(){this.videoEl?.play().then(()=>document.documentElement.classList.remove("hero-video-unavailable")).catch(()=>document.documentElement.classList.add("hero-video-unavailable"))}stopVideo(){this.videoEl?.pause()}}const heroVideo=new HeroVideo;let visit=0;function queuePageEssentials(n){properties.loader.add(`page-essentials-${++visit}`,{type:"any",noCache:!0,loadFunc:(e,t)=>{(async()=>{if(n.path===""){await heroVideo.prepare();return}const r=n.dom.querySelector("research-film [data-preview]");if(r){r.preload="auto";const o=new Image;o.src=r.poster,await Promise.all([waitForVideo(r,{startPlayback:!0,timeoutMs:6e3}),waitForImage(o)]);return}const a=n.dom.querySelector(".editorial-page img, .motor-product-hero img, .research-card img");await waitForImage(a)})().then(t,t)}})}let _c0=new Color,_c1=new Color;class PostProfile{bloomAmount=0;bloomRadius=.25;bloomThreshold=.3;bloomSmoothWidth=.75;bloomLumaStrength=0;bloomSelectiveStrength=0;bloomSaturation=1;haloWidth=.75;haloRGBShift=.03;haloLeftColorHex="#ff0000";haloMidColorHex="#00ff00";haloRightColorHex="#0000ff";haloStrength=0;haloMaskInner=.3;haloMaskOuter=.5;vignetteFrom=2;vignetteTo=3;vignetteColorHex="#000000";saturation=1;contrast=0;brightness=1;tintColorHex="#0044ef";tintOpacity=0;screenPaintDistortionAmount=0;screenPaintDistortionRGBShift=.5;screenPaintDistortionColorMultiplier=20;screenPaintDistortionMultiplier=5;cameraMotionBlurAmount=0;bokehAmount=0;bokehFNumber=.181;bokehFocusDistance=4.5;bokehFocalLength=.344;bokehKFilmHeight=19.26;smaaThreshold=.05;upscalerSharpness=1;constructor(e={}){Object.assign(this,e)}blend(e,t=0){t=math.saturate(t);for(let i in e)if(this.hasOwnProperty(i)){let r=e[i];r!==this[i]&&(typeof this[i]=="string"?this[i]="#"+_c0.setStyle(this[i]).lerp(_c1.setStyle(r),t).getHexString():typeof this[i]=="number"&&(this[i]=math.mix(this[i],r,t)))}}addGui(e){let t=e.addFolder("bloom");t.add(this,"bloomAmount",0,5,1e-5).listen(),t.add(this,"bloomLumaStrength",0,3,1e-5).listen(),t.add(this,"bloomSelectiveStrength",0,3,1e-5).listen(),t.add(this,"bloomSaturation",0,3,1e-5).listen(),t.add(this,"bloomRadius",-1,1,1e-5).listen(),t.add(this,"bloomThreshold",0,1,1e-5).listen(),t.add(this,"bloomSmoothWidth",0,2,1e-5).listen(),t.add(this,"haloWidth",0,2,1e-5).listen(),t.add(this,"haloRGBShift",0,.2,1e-5).listen(),t.addColor(this,"haloLeftColorHex").listen(),t.addColor(this,"haloMidColorHex").listen(),t.addColor(this,"haloRightColorHex").listen(),t.add(this,"haloStrength",0,3,1e-5).listen(),t.add(this,"haloMaskInner",0,1,1e-5).listen(),t.add(this,"haloMaskOuter",0,1,1e-5).listen();let i=e.addFolder("bokeh");i.add(this,"bokehAmount",0,1,1e-5).listen(),i.add(this,"bokehFNumber",1e-4,1,1e-5).listen(),i.add(this,"bokehFocusDistance",0,20,1e-5).listen(),i.add(this,"bokehFocalLength",0,3,1e-5).listen(),i.add(this,"bokehKFilmHeight",1e-5,90,1e-5).listen();let r=e.addFolder("color");r.add(this,"vignetteFrom",0,3,1e-5).listen(),r.add(this,"vignetteTo",0,3,1e-5).listen(),r.addColor(this,"vignetteColorHex").listen(),r.add(this,"saturation",0,3,1e-5).listen(),r.add(this,"contrast",-1,3,1e-5).listen(),r.add(this,"brightness",0,2,1e-5).listen(),r.addColor(this,"tintColorHex").listen(),r.add(this,"tintOpacity",0,1,1e-5).listen();let a=e.addFolder("screenPaintDistortion");a.add(this,"screenPaintDistortionAmount",0,100,1e-5).listen(),a.add(this,"screenPaintDistortionRGBShift",0,3,1e-5).listen(),a.add(this,"screenPaintDistortionColorMultiplier",0,50,1e-5).listen(),a.add(this,"screenPaintDistortionMultiplier",0,20,1e-5).listen(),e.addFolder("smaa").add(this,"smaaThreshold",0,1,1e-5).listen()}}const blitVert=`#define GLSLIFY 1
attribute vec2 position;varying vec2 v_uv;void main(){v_uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`,blitFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;varying vec2 v_uv;void main(){gl_FragColor=texture2D(u_texture,v_uv);}`,uvBlitVert=`#define GLSLIFY 1
attribute vec2 position;attribute vec2 uv;varying vec2 v_uv;void main(){v_uv=uv;gl_Position=vec4(position,0.0,1.0);}`,clearFrag=`#define GLSLIFY 1
uniform vec4 u_color;varying vec2 v_uv;void main(){gl_FragColor=u_color;}`,debugVert=`#define GLSLIFY 1
attribute vec3 position;attribute vec2 uv;uniform vec4 u_transform;varying vec2 v_uv;void main(){v_uv=uv;gl_Position=vec4(position.xy*u_transform.zw+u_transform.xy,0.0,1.0);}`;class FboHelper{isWebGL2;renderer;quadGeom;triGeom;floatType;precisionPrefix;precisionPrefix2;vertexShader;_scene;_camera;_tri;copyMaterial;uvCopyMaterial;clearMaterial;_debugScene;_debugMesh;_debugMaterial;init(e,t){this.renderer=e,this.floatType=t,this.isWebGL2=this.renderer.capabilities.isWebGL2,this._scene=new Scene,this._camera=new Camera,this._camera.position.z=1,this.triGeom=new BufferGeometry,this.triGeom.setAttribute("position",new BufferAttribute(new Float32Array([-1,-1,0,4,-1,0,-1,4,0]),3)),this.quadGeom=new PlaneGeometry(2,2),this._tri=new Mesh(this.triGeom),this._tri.frustumCulled=!1,this._scene.add(this._tri),this.precisionPrefix=`precision ${this.renderer.capabilities.precision} float;
`,this.precisionPrefix2=`
			precision ${this.renderer.capabilities.precision} float;
			precision ${this.renderer.capabilities.precision} int;
			#define IS_WEBGL2 true
		`,this.isWebGL2?(this.vertexPrefix=`${this.precisionPrefix2}
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
			`,this.fragmentPrefix=`${this.precisionPrefix2}
				#define varying in
				layout(location = 0) out vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`):(this.vertexPrefix=this.precisionPrefix,this.fragmentPrefix=this.precisionPrefix),this.renderer.getContext().getExtension("OES_standard_derivatives"),this.vertexShader=this.precisionPrefix+blitVert,this.copyMaterial=new RawShaderMaterial({uniforms:{u_texture:{value:null}},vertexShader:this.vertexShader,fragmentShader:this.precisionPrefix+blitFrag,depthTest:!1,depthWrite:!1,blending:NoBlending}),this.uvCopyMaterial=new RawShaderMaterial({uniforms:{u_texture:{value:null}},vertexShader:this.precisionPrefix+uvBlitVert,fragmentShader:this.precisionPrefix+blitFrag,depthTest:!1,depthWrite:!1,blending:NoBlending}),this.clearMaterial=new RawShaderMaterial({uniforms:{u_color:{value:new Vector4(1,1,1,1)}},vertexShader:this.vertexShader,fragmentShader:this.precisionPrefix+clearFrag,depthTest:!1,depthWrite:!1,blending:NoBlending});const i=new PlaneGeometry(1,1);i.translate(.5,-.5,0),this._debugMaterial=new RawShaderMaterial({uniforms:{u_texture:{value:null},u_transform:{value:new Vector4(0,0,1,1)}},vertexShader:this.precisionPrefix+debugVert,fragmentShader:this.precisionPrefix+blitFrag,depthTest:!1,depthWrite:!1,blending:NoBlending}),this._debugMesh=new Mesh(i,this._debugMaterial),this._debugScene=new Scene,this._debugScene.frustumCulled=!1,this._debugScene.add(this._debugMesh)}copy(e,t){const i=this.copyMaterial;i&&(i.uniforms.u_texture.value=e,this.render(i,t))}uvCopy(e,t){const i=this.uvCopyMaterial;i&&(i.uniforms.u_texture.value=e,this.render(i,t))}render(e,t){this._tri&&this.renderer&&this._scene&&this._camera&&(this._tri.material=e,t&&this.renderer.setRenderTarget(t),this.renderer.render(this._scene,this._camera),t&&this.renderer.setRenderTarget(null))}renderGeometry(e,t,i){this._tri&&this.triGeom&&(this._tri.geometry=e,this.render(t,i),this._tri.geometry=this.triGeom)}renderMesh(e,t,i=this._camera){this._tri&&this.renderer&&this._scene&&i&&(this._tri.visible=!1,this._scene.add(e),t&&this.renderer.setRenderTarget(t||null),this.renderer.render(this._scene,i),t&&this.renderer.setRenderTarget(null),this._scene.remove(e),this._tri.visible=!0)}debugTo(e,t,i,r,a){if(!(this.renderer&&this._debugMaterial&&this._debugScene&&this._camera))return;t=t||e.width||e.image.width,i=i||e.height||e.image.height,r=r||0,a=a||0;const o=this.renderer.getSize(new Vector2);r=r/o.width*2-1,a=1-a/o.height*2,t=t/o.width*2,i=i/o.height*2,this._debugMaterial.uniforms.u_texture.value=e,this._debugMaterial.uniforms.u_transform.value.set(r,a,t,i);const s=this.getColorState();this.renderer.autoClearColor=!1,this.renderer.setRenderTarget(null),this.renderer.render(this._debugScene,this._camera),this.setColorState(s)}parseDefines(e){let t="";for(const i in e){const r=e[i];r===!0?t+=`#define ${i}
`:t+=`#define ${i} ${r}
`}return t}clearColor(e,t,i,r,a){this.clearMaterial&&(this.clearMaterial.uniforms.u_color.value.set(e,t,i,r),this.render(this.clearMaterial,a))}getColorState(){if(!this.renderer)return{autoClear:!0,autoClearColor:!0,autoClearStencil:!0,autoClearDepth:!0,clearColor:0,clearAlpha:1};const e=new Color;return this.renderer.getClearColor(e),{autoClear:this.renderer.autoClear,autoClearColor:this.renderer.autoClearColor,autoClearStencil:this.renderer.autoClearStencil,autoClearDepth:this.renderer.autoClearDepth,clearColor:e.getHex(),clearAlpha:this.renderer.getClearAlpha()}}setColorState(e){this.renderer&&(this.renderer.setClearColor(e.clearColor,e.clearAlpha),this.renderer.autoClear=e.autoClear,this.renderer.autoClearColor=e.autoClearColor,this.renderer.autoClearStencil=e.autoClearStencil,this.renderer.autoClearDepth=e.autoClearDepth)}createRawShaderMaterial(e){return e=Object.assign({depthTest:!1,depthWrite:!1,blending:NoBlending,vertexShader:blitVert,fragmentShader:blitFrag,derivatives:!1},e),e.vertexShader=(e.vertexShaderPrefix?e.vertexShaderPrefix:e.derivatives?this.vertexPrefix:this.precisionPrefix)+e.vertexShader,e.fragmentShader=(e.fragmentShaderPrefix?e.fragmentShaderPrefix:e.derivatives?this.fragmentPrefix:this.precisionPrefix)+e.fragmentShader,delete e.vertexShaderPrefix,delete e.fragmentShaderPrefix,delete e.derivatives,new RawShaderMaterial(e)}createDataTexture(e,t,i,r=!1,a=!0){let o=new DataTexture(e,t,i,RGBAFormat,r?FloatType:UnsignedByteType,UVMapping,ClampToEdgeWrapping,ClampToEdgeWrapping,a?NearestFilter:LinearFilter,a?NearestFilter:LinearFilter,0);return o.needsUpdate=!0,o}createRenderTarget(e,t,i=!1,r=!1,a=0,o=1){return new WebGLRenderTarget(e,t,{wrapS:ClampToEdgeWrapping,wrapT:ClampToEdgeWrapping,magFilter:i?NearestFilter:LinearFilter,minFilter:i?NearestFilter:LinearFilter,type:r===!0?this.floatType:r||UnsignedByteType,anisotropy:0,depthBuffer:!1,stencilBuffer:!1,samples:browser.isSupportMSAA?a:0,count:o})}createMultisampleRenderTarget(e,t,i=!1,r=!1,a=8,o=1){return!(this.renderer&&this.isWebGL2)||!browser.isSupportMSAA?this.createRenderTarget(e,t,o,i,r,a,o):new WebGLRenderTarget(e,t,{wrapS:ClampToEdgeWrapping,wrapT:ClampToEdgeWrapping,magFilter:i?NearestFilter:LinearFilter,minFilter:i?NearestFilter:LinearFilter,type:r===!0?this.floatType:r||UnsignedByteType,anisotropy:0,depthBuffer:!1,stencilBuffer:!1,samples:browser.isSupportMSAA?a:0})}clearMultisampleRenderTargetState(e){if(e=e||this.renderer.getRenderTarget(),e&&e.samples>0){const t=this.renderer.properties.get(e);let i=this.renderer.getContext();i.bindFramebuffer(i.READ_FRAMEBUFFER,t.__webglMultisampledFramebuffer),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,t.__webglFramebuffer);const r=e.width,a=e.height;let o=i.COLOR_BUFFER_BIT;e.depthBuffer&&(o|=i.DEPTH_BUFFER_BIT),e.stencilBuffer&&(o|=i.STENCIL_BUFFER_BIT),i.blitFramebuffer(0,0,r,a,0,0,r,a,o,i.NEAREST),i.bindFramebuffer(i.FRAMEBUFFER,t.__webglMultisampledFramebuffer)}}}const fboHelper=new FboHelper,fromEntries=(n,e)=>[...n].reduce((t,[i,r])=>(t[i]=r,t),{});class Settings{MODEL_PATH="/models/";SPLATS="/splats/";IMAGE_PATH="/images/";TEXTURE_PATH="/textures/";AUDIO_PATH="/audios/";VIDEO_PATH="/videos/";RENDER_TARGET_FLOAT_TYPE=null;DATA_FLOAT_TYPE=null;USE_FLOAT_PACKING=!1;USE_WEBGL2=!0;DPR_RAW=browser.devicePixelRatio;DPR=Math.min(1.5,browser.devicePixelRatio);USE_PIXEL_LIMIT=!0;MAX_PIXEL_COUNT=2560*1440;UP_SCALE=1;JUMP_SECTION="";JUMP_OFFSET=0;CROSS_ORIGINS={"https://example.com/":"anonymous"};IS_DEV=!1;LOG=!1;SKIP_ANIMATION=!1;LOOK_DEV_MODE=!1;HIDE_UI=!1;SHOW_FPS=!1;constructor(){this.override(this.parseQuery(window.location.search,!0))}parseQuery(e,t){return fromEntries(new URLSearchParams(e,t))}override(e){for(const t in e)if(this[t]!==void 0){const i=e[t].toString();typeof this[t]=="boolean"?this[t]=!(i==="0"||i===!1):typeof this[t]=="number"?this[t]=parseFloat(i):typeof this[t]=="string"&&(this[t]=i)}}}const settings=new Settings,frag$6=`#define GLSLIFY 1
uniform sampler2D u_lowPaintTexture;uniform sampler2D u_prevPaintTexture;uniform vec2 u_paintTexelSize;uniform vec4 u_drawFrom;uniform vec4 u_drawTo;uniform float u_pushStrength;uniform vec3 u_dissipations;uniform vec2 u_vel;varying vec2 v_uv;vec2 sdSegment(in vec2 p,in vec2 a,in vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return vec2(length(pa-ba*h),h);}
#ifdef USE_NOISE
uniform float u_curlScale;uniform float u_curlStrength;vec2 hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy)*2.0-1.0;}vec3 noised(in vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);vec2 du=30.0*f*f*(f*(f-2.0)+1.0);vec2 ga=hash(i+vec2(0.0,0.0));vec2 gb=hash(i+vec2(1.0,0.0));vec2 gc=hash(i+vec2(0.0,1.0));vec2 gd=hash(i+vec2(1.0,1.0));float va=dot(ga,f-vec2(0.0,0.0));float vb=dot(gb,f-vec2(1.0,0.0));float vc=dot(gc,f-vec2(0.0,1.0));float vd=dot(gd,f-vec2(1.0,1.0));return vec3(va+u.x*(vb-va)+u.y*(vc-va)+u.x*u.y*(va-vb-vc+vd),ga+u.x*(gb-ga)+u.y*(gc-ga)+u.x*u.y*(ga-gb-gc+gd)+du*(u.yx*(va-vb-vc+vd)+vec2(vb,vc)-va));}
#endif
void main(){vec2 res=sdSegment(gl_FragCoord.xy,u_drawFrom.xy,u_drawTo.xy);vec2 radiusWeight=mix(u_drawFrom.zw,u_drawTo.zw,res.y);float d=1.0-smoothstep(-0.01,radiusWeight.x,res.x);vec4 lowData=texture2D(u_lowPaintTexture,v_uv);vec2 velInv=(0.5-lowData.xy)*u_pushStrength;
#ifdef USE_NOISE
vec3 noise3=noised(gl_FragCoord.xy*u_curlScale*(1.0-lowData.xy));vec2 noise=noised(gl_FragCoord.xy*u_curlScale*(2.0-lowData.xy*(0.5+noise3.x)+noise3.yz*0.1)).yz;velInv+=noise*(lowData.z+lowData.w)*u_curlStrength;
#endif
vec4 data=texture2D(u_prevPaintTexture,v_uv+velInv*u_paintTexelSize);data.xy-=0.5;vec4 delta=(u_dissipations.xxyz-1.0)*data;vec2 newVel=u_vel*d;delta+=vec4(newVel,radiusWeight.yy*d);delta.zw=sign(delta.zw)*max(vec2(0.004),abs(delta.zw));data+=delta;data.xy+=0.5;gl_FragColor=clamp(data,vec4(0.0),vec4(1.0));}`,blur9VaryingVertexShader=`#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_delta;varying vec2 v_uv[9];void main(){vec2 uv=position.xy*0.5+0.5;v_uv[0]=uv;vec2 delta=u_delta;v_uv[1]=uv-delta;v_uv[2]=uv+delta;delta+=u_delta;v_uv[3]=uv-delta;v_uv[4]=uv+delta;delta+=u_delta;v_uv[5]=uv-delta;v_uv[6]=uv+delta;delta+=u_delta;v_uv[7]=uv-delta;v_uv[8]=uv+delta;gl_Position=vec4(position,1.0);}`,blur9VaryingFragmentShader=`#define GLSLIFY 1
uniform sampler2D u_texture;varying vec2 v_uv[9];void main(){vec4 color=texture2D(u_texture,v_uv[0])*0.1633;color+=texture2D(u_texture,v_uv[1])*0.1531;color+=texture2D(u_texture,v_uv[2])*0.1531;color+=texture2D(u_texture,v_uv[3])*0.12245;color+=texture2D(u_texture,v_uv[4])*0.12245;color+=texture2D(u_texture,v_uv[5])*0.0918;color+=texture2D(u_texture,v_uv[6])*0.0918;color+=texture2D(u_texture,v_uv[7])*0.051;color+=texture2D(u_texture,v_uv[8])*0.051;gl_FragColor=color;}`,blur9FragmentShader=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_delta;varying vec2 v_uv;void main(){vec4 color=texture2D(u_texture,v_uv)*0.1633;vec2 delta=u_delta;color+=texture2D(u_texture,v_uv-delta)*0.1531;color+=texture2D(u_texture,v_uv+delta)*0.1531;delta+=u_delta;color+=texture2D(u_texture,v_uv-delta)*0.12245;color+=texture2D(u_texture,v_uv+delta)*0.12245;delta+=u_delta;color+=texture2D(u_texture,v_uv-delta)*0.0918;color+=texture2D(u_texture,v_uv+delta)*0.0918;delta+=u_delta;color+=texture2D(u_texture,v_uv-delta)*0.051;color+=texture2D(u_texture,v_uv+delta)*0.051;gl_FragColor=color;}`;class Blur{material=null;getBlur9Material(){let e=fboHelper.MAX_VARYING_VECTORS>8;return this.blur9Material||(this.blur9Material=new RawShaderMaterial({uniforms:{u_texture:{value:null},u_delta:{value:new Vector2}},vertexShader:e?fboHelper.precisionPrefix+blur9VaryingVertexShader:fboHelper.vertexShader,fragmentShader:fboHelper.precisionPrefix+(e?blur9VaryingFragmentShader:blur9FragmentShader),depthWrite:!1,depthTest:!1})),this.blur9Material}blur(e,t,i,r,a,o){let s=.25,l=Math.ceil(i.width*t)||0,c=Math.ceil(i.height*t)||0;this.material||(this.material=this.getBlur9Material()),r||console.warn("You have to pass intermediateRenderTarget to blur"),(l!==r.width||c!==r.height)&&r.setSize(l,c),a?o||a.setSize(i.width,i.height):a=i,this.material.uniforms.u_texture.value=i.texture||i,this.material.uniforms.u_delta.value.set(e/l*s,0),fboHelper.render(this.material,r),this.material.uniforms.u_texture.value=r.texture||r,this.material.uniforms.u_delta.value.set(0,e/c*s),fboHelper.render(this.material,a)}}const blur=new Blur;let _v$1=new Vector2;class ScreenPaint{_lowRenderTarget;_lowBlurRenderTarget;_prevPaintRenderTarget;_currPaintRenderTarget;_material;_distortionMaterial;_fromDrawData;_toDrawData;drawEnabled=!0;needsMouseDown=!1;enabled=!0;minRadius=0;maxRadius=100;radiusDistanceRange=100;pushStrength=25;accelerationDissipation=.8;velocityDissipation=.985;weight1Dissipation=.985;weight2Dissipation=.75;useNoise=!0;curlScale=.06;curlStrength=1.75;_prevUseNoise=null;sharedUniforms={u_paintTexelSize:{value:new Vector2},u_prevPaintTexture:{value:null},u_currPaintTexture:{value:null},u_lowPaintTexture:{value:null}};init(){this._lowRenderTarget=fboHelper.createRenderTarget(1,1),this._lowBlurRenderTarget=fboHelper.createRenderTarget(1,1),this._prevPaintRenderTarget=fboHelper.createRenderTarget(1,1),this._currPaintRenderTarget=fboHelper.createRenderTarget(1,1),this.sharedUniforms.u_lowPaintTexture.value=this._lowRenderTarget.texture,this._material=new RawShaderMaterial({uniforms:{u_lowPaintTexture:{value:this._lowRenderTarget.texture},u_prevPaintTexture:this.sharedUniforms.u_prevPaintTexture,u_paintTexelSize:this.sharedUniforms.u_paintTexelSize,u_drawFrom:{value:this._fromDrawData=new Vector4(0,0,0,0)},u_drawTo:{value:this._toDrawData=new Vector4(0,0,0,0)},u_pushStrength:{value:0},u_curlScale:{value:0},u_curlStrength:{value:0},u_vel:{value:new Vector2},u_dissipations:{value:new Vector3}},vertexShader:fboHelper.vertexShader,fragmentShader:fboHelper.precisionPrefix+frag$6})}resize(e,t){let i=e>>2,r=t>>2,a=e>>4,o=t>>4;(i!==this._currPaintRenderTarget.width||r!==this._currPaintRenderTarget.height)&&(this._currPaintRenderTarget.setSize(i,r),this._prevPaintRenderTarget.setSize(i,r),this._lowRenderTarget.setSize(a,o),this._lowBlurRenderTarget.setSize(a,o),this.sharedUniforms.u_paintTexelSize.value.set(1/i,1/r),this.clear())}clear=()=>{fboHelper.clearColor(.5,.5,0,0,this._lowRenderTarget),fboHelper.clearColor(.5,.5,0,0,this._lowBlurRenderTarget),fboHelper.clearColor(.5,.5,0,0,this._currPaintRenderTarget),this._material.uniforms.u_vel.value.set(0,0)};update(e){if(!this.enabled)return;this.useNoise!==this._prevUseNoise&&(this._material.defines.USE_NOISE=this.useNoise,this._material.needsUpdate=!0,this._prevUseNoise=this.useNoise);let t=this._currPaintRenderTarget.width,i=this._currPaintRenderTarget.height,r=this._prevPaintRenderTarget;this._prevPaintRenderTarget=this._currPaintRenderTarget,this._currPaintRenderTarget=r,this.sharedUniforms.u_prevPaintTexture.value=this._prevPaintRenderTarget.texture,this.sharedUniforms.u_currPaintTexture.value=this._currPaintRenderTarget.texture,this._material.uniforms.u_drawFrom.value.z=this._material.uniforms.u_drawTo.value.z;let a=input.mousePixelXY.distanceTo(input.prevMousePixelXY),o=math.fit(a,0,this.radiusDistanceRange,this.minRadius,this.maxRadius);(!input.hadMoved||!this.drawEnabled||(this.needsMouseDown||browser.isMobile)&&(!input.isDown||!input.wasDown))&&(o=0),o=o/properties.viewportHeight*i,this._material.uniforms.u_pushStrength.value=this.pushStrength,this._material.uniforms.u_curlScale.value=this.curlScale,this._material.uniforms.u_curlStrength.value=this.curlStrength,this._material.uniforms.u_dissipations.value.set(this.velocityDissipation,this.weight1Dissipation,this.weight2Dissipation),this._fromDrawData.copy(this._toDrawData),this._toDrawData.set((input.mouseXY.x+1)*t/2,(input.mouseXY.y+1)*i/2,o,1),_v$1.set(this._toDrawData.x-this._fromDrawData.x,this._toDrawData.y-this._fromDrawData.y).multiplyScalar(e*.8),this._material.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(_v$1),fboHelper.render(this._material,this._currPaintRenderTarget),fboHelper.copy(this._currPaintRenderTarget.texture,this._lowRenderTarget),blur.blur(4,1,this._lowRenderTarget,this._lowBlurRenderTarget)}}const screenPaint=new ScreenPaint;class PostEffect{sharedUniforms={};enabled=!0;material=null;renderOrder=0;_hasShownWarning=!1;init(e){Object.assign(this,e)}needsRender(){return!0}warn(e){this._hasShownWarning||(console.warn(e),this._hasShownWarning=!0)}render(e,t=!1){this.material.uniforms.u_texture&&(this.material.uniforms.u_texture.value=e.fromTexture),fboHelper.render(this.material,t?null:e.toRenderTarget),e.swap()}}const smaaBlendVert=`#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[2];void SMAANeighborhoodBlendingVS(vec2 texcoord){v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-1.0,0.0,0.0,1.0);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(1.0,0.0,0.0,-1.0);}void main(){v_uv=position.xy*0.5+0.5;SMAANeighborhoodBlendingVS(v_uv);gl_Position=vec4(position,1.0);}`,smaaBlendFrag=`#define GLSLIFY 1
uniform sampler2D u_weightsTexture;uniform sampler2D u_texture;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[2];vec4 SMAANeighborhoodBlendingPS(vec2 texcoord,vec4 offset[2],sampler2D colorTex,sampler2D blendTex){vec4 a;a.xz=texture2D(blendTex,texcoord).xz;a.y=texture2D(blendTex,offset[1].zw).g;a.w=texture2D(blendTex,offset[1].xy).a;if(dot(a,vec4(1.0,1.0,1.0,1.0))<1e-5){return texture2D(colorTex,texcoord,0.0);}else{vec2 offset;offset.x=a.a>a.b ? a.a :-a.b;offset.y=a.g>a.r ?-a.g : a.r;if(abs(offset.x)>abs(offset.y)){offset.y=0.0;}else{offset.x=0.0;}vec4 C=texture2D(colorTex,texcoord,0.0);texcoord+=sign(offset)*u_texelSize;vec4 Cop=texture2D(colorTex,texcoord,0.0);float s=abs(offset.x)>abs(offset.y)? abs(offset.x): abs(offset.y);C.xyz=pow(abs(C.xyz),vec3(2.2));Cop.xyz=pow(abs(Cop.xyz),vec3(2.2));vec4 mixed=mix(C,Cop,s);mixed.xyz=pow(abs(mixed.xyz),vec3(1.0/2.2));return mixed;}}void main(){gl_FragColor=SMAANeighborhoodBlendingPS(v_uv,v_offsets,u_texture,u_weightsTexture);}`,smaaEdgesVert=`#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];void SMAAEdgeDetectionVS(vec2 texcoord){v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-1.0,0.0,0.0,1.0);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(1.0,0.0,0.0,-1.0);v_offsets[2]=texcoord.xyxy+u_texelSize.xyxy*vec4(-2.0,0.0,0.0,2.0);}void main(){v_uv=position.xy*0.5+0.5;SMAAEdgeDetectionVS(v_uv);gl_Position=vec4(position,1.0);}`,smaaEdgesFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_thresholds;varying vec2 v_uv;varying vec4 v_offsets[3];vec4 SMAAColorEdgeDetectionPS(vec2 texcoord,vec4 offset[3],sampler2D colorTex){vec4 delta;vec3 C=texture2D(colorTex,texcoord).rgb;vec3 Cleft=texture2D(colorTex,offset[0].xy).rgb;vec3 t=abs(C-Cleft);delta.x=max(max(t.r,t.g),t.b);vec3 Ctop=texture2D(colorTex,offset[0].zw).rgb;t=abs(C-Ctop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(u_thresholds,delta.xy);if(dot(edges,vec2(1.0,1.0))==0.0)discard;vec3 Cright=texture2D(colorTex,offset[1].xy).rgb;t=abs(C-Cright);delta.z=max(max(t.r,t.g),t.b);vec3 Cbottom=texture2D(colorTex,offset[1].zw).rgb;t=abs(C-Cbottom);delta.w=max(max(t.r,t.g),t.b);float maxDelta=max(max(max(delta.x,delta.y),delta.z),delta.w);vec3 Cleftleft=texture2D(colorTex,offset[2].xy).rgb;t=abs(C-Cleftleft);delta.z=max(max(t.r,t.g),t.b);vec3 Ctoptop=texture2D(colorTex,offset[2].zw).rgb;t=abs(C-Ctoptop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(max(maxDelta,delta.z),delta.w);edges.xy*=step(0.5*maxDelta,delta.xy);return vec4(edges,0.0,0.0);}void main(){gl_FragColor=SMAAColorEdgeDetectionPS(v_uv,v_offsets,u_texture);}`,smaaWeightsVert=`#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];varying vec2 v_pixcoord;void SMAABlendingWeightCalculationVS(vec2 texcoord){v_pixcoord=texcoord/u_texelSize;v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.25,0.125,1.25,0.125);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.125,0.25,-0.125,-1.25);v_offsets[2]=vec4(v_offsets[0].xz,v_offsets[1].yw)+vec4(-2.0,2.0,-2.0,2.0)*u_texelSize.xxyy*float(SMAA_MAX_SEARCH_STEPS);}void main(){v_uv=position.xy*0.5+0.5;SMAABlendingWeightCalculationVS(v_uv);gl_Position=vec4(position,1.0);}`,smaaWeightsFrag=`#define GLSLIFY 1
#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * u_texelSize, 0.0 )
uniform sampler2D u_edgesTexture;uniform sampler2D u_areaTexture;uniform sampler2D u_searchTexture;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];varying vec2 v_pixcoord;vec2 round(vec2 x){return sign(x)*floor(abs(x)+0.5);}float SMAASearchLength(sampler2D searchTex,vec2 e,float bias,float scale){e.r=bias+e.r*scale;return 255.0*texture2D(searchTex,e,0.0).r;}float SMAASearchXLeft(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord-=vec2(2.0,0.0)*u_texelSize;if(!(texcoord.x>end&&e.g>0.8281&&e.r==0.0))break;}texcoord.x+=0.25*u_texelSize.x;texcoord.x+=u_texelSize.x;texcoord.x+=2.0*u_texelSize.x;texcoord.x-=u_texelSize.x*SMAASearchLength(searchTex,e,0.0,0.5);return texcoord.x;}float SMAASearchXRight(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord+=vec2(2.0,0.0)*u_texelSize;if(!(texcoord.x<end&&e.g>0.8281&&e.r==0.0))break;}texcoord.x-=0.25*u_texelSize.x;texcoord.x-=u_texelSize.x;texcoord.x-=2.0*u_texelSize.x;texcoord.x+=u_texelSize.x*SMAASearchLength(searchTex,e,0.5,0.5);return texcoord.x;}float SMAASearchYUp(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord+=vec2(0.0,2.0)*u_texelSize;if(!(texcoord.y>end&&e.r>0.8281&&e.g==0.0))break;}texcoord.y-=0.25*u_texelSize.y;texcoord.y-=u_texelSize.y;texcoord.y-=2.0*u_texelSize.y;texcoord.y+=u_texelSize.y*SMAASearchLength(searchTex,e.gr,0.0,0.5);return texcoord.y;}float SMAASearchYDown(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord-=vec2(0.0,2.0)*u_texelSize;if(!(texcoord.y<end&&e.r>0.8281&&e.g==0.0))break;}texcoord.y+=0.25*u_texelSize.y;texcoord.y+=u_texelSize.y;texcoord.y+=2.0*u_texelSize.y;texcoord.y-=u_texelSize.y*SMAASearchLength(searchTex,e.gr,0.5,0.5);return texcoord.y;}vec2 SMAAArea(sampler2D areaTex,vec2 dist,float e1,float e2,float offset){vec2 texcoord=float(SMAA_AREATEX_MAX_DISTANCE)*round(4.0*vec2(e1,e2))+dist;texcoord=SMAA_AREATEX_PIXEL_SIZE*texcoord+(0.5*SMAA_AREATEX_PIXEL_SIZE);texcoord.y+=SMAA_AREATEX_SUBTEX_SIZE*offset;return texture2D(areaTex,texcoord,0.0).rg;}vec4 SMAABlendingWeightCalculationPS(vec2 texcoord,vec2 pixcoord,vec4 offset[3],sampler2D edgesTex,sampler2D areaTex,sampler2D searchTex,ivec4 subsampleIndices){vec4 weights=vec4(0.0,0.0,0.0,0.0);vec2 e=texture2D(edgesTex,texcoord).rg;if(e.g>0.0){vec2 d;vec2 coords;coords.x=SMAASearchXLeft(edgesTex,searchTex,offset[0].xy,offset[2].x);coords.y=offset[1].y;d.x=coords.x;float e1=texture2D(edgesTex,coords,0.0).r;coords.x=SMAASearchXRight(edgesTex,searchTex,offset[0].zw,offset[2].y);d.y=coords.x;d=d/u_texelSize.x-pixcoord.x;vec2 sqrt_d=sqrt(abs(d));coords.y-=1.0*u_texelSize.y;float e2=SMAASampleLevelZeroOffset(edgesTex,coords,ivec2(1,0)).r;weights.rg=SMAAArea(areaTex,sqrt_d,e1,e2,float(subsampleIndices.y));}if(e.r>0.0){vec2 d;vec2 coords;coords.y=SMAASearchYUp(edgesTex,searchTex,offset[1].xy,offset[2].z);coords.x=offset[0].x;d.x=coords.y;float e1=texture2D(edgesTex,coords,0.0).g;coords.y=SMAASearchYDown(edgesTex,searchTex,offset[1].zw,offset[2].w);d.y=coords.y;d=d/u_texelSize.y-pixcoord.y;vec2 sqrt_d=sqrt(abs(d));coords.y-=1.0*u_texelSize.y;float e2=SMAASampleLevelZeroOffset(edgesTex,coords,ivec2(0,1)).g;weights.ba=SMAAArea(areaTex,sqrt_d,e1,e2,float(subsampleIndices.x));}return weights;}void main(){gl_FragColor=SMAABlendingWeightCalculationPS(v_uv,v_pixcoord,v_offsets,u_edgesTexture,u_areaTexture,u_searchTexture,ivec4(0.0));}`;class Smaa extends PostEffect{isActive=!0;edgesRenderTarget=null;weightsRenderTarget=null;edgesMaterial=null;weightsMaterial=null;threshold=.5;init(e){Object.assign(this,{sharedUniforms:{u_areaTexture:{value:null},u_searchTexture:{value:null}}},e),super.init(),this.weightsRenderTarget=fboHelper.createRenderTarget(1,1),this.edgesRenderTarget=fboHelper.createRenderTarget(1,1),this.edgesMaterial=new RawShaderMaterial({uniforms:{u_texture:{value:null},u_texelSize:null,u_thresholds:{value:new Vector2}},vertexShader:fboHelper.precisionPrefix+smaaEdgesVert,fragmentShader:fboHelper.precisionPrefix+smaaEdgesFrag,blending:NoBlending,depthTest:!1,depthWrite:!1}),this.weightsMaterial=new RawShaderMaterial({uniforms:{u_edgesTexture:{value:this.edgesRenderTarget.texture},u_areaTexture:this.sharedUniforms.u_areaTexture,u_searchTexture:this.sharedUniforms.u_searchTexture,u_texelSize:null},vertexShader:fboHelper.precisionPrefix+smaaWeightsVert,fragmentShader:fboHelper.precisionPrefix+smaaWeightsFrag,defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},transparent:!0,blending:NoBlending,depthTest:!1,depthWrite:!1}),this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_weightsTexture:{value:this.weightsRenderTarget.texture},u_texelSize:null},vertexShader:fboHelper.precisionPrefix+smaaBlendVert,fragmentShader:fboHelper.precisionPrefix+smaaBlendFrag})}setTextures(e,t){let i=this.sharedUniforms.u_areaTexture.value=this._createTexture(e);i.minFilter=LinearFilter;let r=this.sharedUniforms.u_searchTexture.value=this._createTexture(t);r.magFilter=NearestFilter,r.minFilter=NearestFilter}updateTextures(){this.sharedUniforms.u_areaTexture.value.needsUpdate=!0,this.sharedUniforms.u_searchTexture.value.needsUpdate=!0}dispose(){this.edgesRenderTarget&&this.edgesRenderTarget.dispose(),this.weightsRenderTarget&&this.weightsRenderTarget.dispose()}needsRender(){return this.isActive?!this.sharedUniforms.u_areaTexture.value.needsUpdate:!1}render(e,t){let i=e.width,r=e.height;this.edgesRenderTarget.setSize(i,r),this.weightsRenderTarget.setSize(i,r);let a=fboHelper.getColorState();this.sharedUniforms.u_searchTexture.value||console.warn("You need to use Smaa.setImages() to set the smaa textures manually and assign to this class.");let o=fboHelper.renderer;o&&(o.autoClear=!0,o.setClearColor(0,0)),this.edgesMaterial.uniforms.u_thresholds.value.setScalar(this.threshold),this.edgesMaterial.uniforms.u_texelSize=this.weightsMaterial.uniforms.u_texelSize=this.material.uniforms.u_texelSize=e.sharedUniforms.u_texelSize,this.edgesMaterial.uniforms.u_texture.value=e.fromTexture,fboHelper.render(this.edgesMaterial,this.edgesRenderTarget),fboHelper.render(this.weightsMaterial,this.weightsRenderTarget),fboHelper.setColorState(a),this.material.uniforms.u_texture.value=e.fromTexture,super.render(e,t)}_createTexture(e){let t=new Texture(e);return t.generateMipmaps=!1,t.flipY=!1,t}}const bokehCocShader=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform sampler2D u_depthTexture;uniform vec2 u_texelSize;uniform float u_focusDistance;uniform float u_lensCoeff;uniform float u_maxCoC;uniform float u_rcpMaxCoC;uniform float u_cameraNear;uniform float u_cameraFar;varying vec2 v_uv;float max3(vec3 xyz){return max(xyz.x,max(xyz.y,xyz.z));}
#ifndef USE_FLOAT
uniform float u_hashNoise;float hash13(vec3 p3){p3=fract(p3*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
#endif
float getViewZ(vec2 uv){float depth=texture2D(u_depthTexture,uv).r*2.0-1.0;return 2.0*u_cameraNear*u_cameraFar/(u_cameraFar+u_cameraNear-depth*(u_cameraFar-u_cameraNear));}void main(){vec3 duv=u_texelSize.xyx*vec3(0.5,0.5,-0.5);vec3 c0=texture2D(u_texture,v_uv-duv.xy).rgb;vec3 c1=texture2D(u_texture,v_uv-duv.zy).rgb;vec3 c2=texture2D(u_texture,v_uv+duv.zy).rgb;vec3 c3=texture2D(u_texture,v_uv+duv.xy).rgb;vec2 uvAlt=v_uv;float d0=getViewZ(uvAlt-duv.xy);float d1=getViewZ(uvAlt-duv.zy);float d2=getViewZ(uvAlt+duv.zy);float d3=getViewZ(uvAlt+duv.xy);vec4 depths=vec4(d0,d1,d2,d3);float focusDistance=u_focusDistance;vec4 cocs=(depths-focusDistance)*u_lensCoeff/depths;cocs=clamp(cocs,-u_maxCoC,u_maxCoC);vec4 weights=clamp(abs(cocs)*u_rcpMaxCoC,vec4(0.0),vec4(1.0));weights.x*=1.0/(max3(c0)+1.0);weights.y*=1.0/(max3(c1)+1.0);weights.z*=1.0/(max3(c2)+1.0);weights.w*=1.0/(max3(c3)+1.0);vec3 avg=c0*weights.x+c1*weights.y+c2*weights.z+c3*weights.w;avg/=dot(weights,vec4(1.0));float coc=dot(cocs,vec4(0.25));avg*=smoothstep(0.0,u_texelSize.y*2.0,abs(coc));gl_FragColor=vec4(avg,coc);
#ifndef USE_FLOAT
gl_FragColor=sign(gl_FragColor)*sqrt(abs(gl_FragColor));gl_FragColor=gl_FragColor*0.5+0.5+hash13(vec3(gl_FragCoord.xy,u_hashNoise))/255.0;
#endif
}`,bokehSimShader=`#define GLSLIFY 1
#if QUALITY == 0
const int kSampleCount=16;vec2 kDiskKernel[kSampleCount];void initKernel(){kDiskKernel[0]=vec2(0.0,0.0);kDiskKernel[1]=vec2(0.54545456,0.0);kDiskKernel[2]=vec2(0.16855472,0.5187581);kDiskKernel[3]=vec2(-0.44128203,0.3206101);kDiskKernel[4]=vec2(-0.44128197,-0.3206102);kDiskKernel[5]=vec2(0.1685548,-0.5187581);kDiskKernel[6]=vec2(1.0,0.0);kDiskKernel[7]=vec2(0.809017,0.58778524);kDiskKernel[8]=vec2(0.30901697,0.95105654);kDiskKernel[9]=vec2(-0.30901703,0.9510565);kDiskKernel[10]=vec2(-0.80901706,0.5877852);kDiskKernel[11]=vec2(-1.0,0.0);kDiskKernel[12]=vec2(-0.80901694,-0.58778536);kDiskKernel[13]=vec2(-0.30901664,-0.9510566);kDiskKernel[14]=vec2(0.30901712,-0.9510565);kDiskKernel[15]=vec2(0.80901694,-0.5877853);}
#endif
#if QUALITY == 1
const int kSampleCount=22;vec2 kDiskKernel[kSampleCount];void initKernel(){kDiskKernel[0]=vec2(0.0,0.0);kDiskKernel[1]=vec2(0.53333336,0.0);kDiskKernel[2]=vec2(0.3325279,0.4169768);kDiskKernel[3]=vec2(-0.11867785,0.5199616);kDiskKernel[4]=vec2(-0.48051673,0.2314047);kDiskKernel[5]=vec2(-0.48051673,-0.23140468);kDiskKernel[6]=vec2(-0.11867763,-0.51996166);kDiskKernel[7]=vec2(0.33252785,-0.4169769);kDiskKernel[8]=vec2(1.0,0.0);kDiskKernel[9]=vec2(0.90096885,0.43388376);kDiskKernel[10]=vec2(0.6234898,0.7818315);kDiskKernel[11]=vec2(0.22252098,0.9749279);kDiskKernel[12]=vec2(-0.22252095,0.9749279);kDiskKernel[13]=vec2(-0.62349,0.7818314);kDiskKernel[14]=vec2(-0.90096885,0.43388382);kDiskKernel[15]=vec2(-1.0,0.0);kDiskKernel[16]=vec2(-0.90096885,-0.43388376);kDiskKernel[17]=vec2(-0.6234896,-0.7818316);kDiskKernel[18]=vec2(-0.22252055,-0.974928);kDiskKernel[19]=vec2(0.2225215,-0.9749278);kDiskKernel[20]=vec2(0.6234897,-0.7818316);kDiskKernel[21]=vec2(0.90096885,-0.43388376);}
#endif
#if QUALITY == 2
const int kSampleCount=43;vec2 kDiskKernel[kSampleCount];void initKernel(){kDiskKernel[0]=vec2(0.0,0.0);kDiskKernel[1]=vec2(0.36363637,0.0);kDiskKernel[2]=vec2(0.22672357,0.28430238);kDiskKernel[3]=vec2(-0.08091671,0.35451925);kDiskKernel[4]=vec2(-0.32762504,0.15777594);kDiskKernel[5]=vec2(-0.32762504,-0.15777591);kDiskKernel[6]=vec2(-0.08091656,-0.35451928);kDiskKernel[7]=vec2(0.22672352,-0.2843024);kDiskKernel[8]=vec2(0.6818182,0.0);kDiskKernel[9]=vec2(0.614297,0.29582983);kDiskKernel[10]=vec2(0.42510667,0.5330669);kDiskKernel[11]=vec2(0.15171885,0.6647236);kDiskKernel[12]=vec2(-0.15171883,0.6647236);kDiskKernel[13]=vec2(-0.4251068,0.53306687);kDiskKernel[14]=vec2(-0.614297,0.29582986);kDiskKernel[15]=vec2(-0.6818182,0);kDiskKernel[16]=vec2(-0.614297,-0.29582983);kDiskKernel[17]=vec2(-0.42510656,-0.53306705);kDiskKernel[18]=vec2(-0.15171856,-0.66472363);kDiskKernel[19]=vec2(0.1517192,-0.6647235);kDiskKernel[20]=vec2(0.4251066,-0.53306705);kDiskKernel[21]=vec2(0.614297,-0.29582983);kDiskKernel[22]=vec2(1.0,0.0);kDiskKernel[23]=vec2(0.9555728,0.2947552);kDiskKernel[24]=vec2(0.82623875,0.5633201);kDiskKernel[25]=vec2(0.6234898,0.7818315);kDiskKernel[26]=vec2(0.36534098,0.93087375);kDiskKernel[27]=vec2(0.07473,0.9972038);kDiskKernel[28]=vec2(-0.22252095,0.9749279);kDiskKernel[29]=vec2(-0.50000006,0.8660254);kDiskKernel[30]=vec2(-0.73305196,0.6801727);kDiskKernel[31]=vec2(-0.90096885,0.43388382);kDiskKernel[32]=vec2(-0.98883086,0.14904208);kDiskKernel[33]=vec2(-0.9888308,-0.14904249);kDiskKernel[34]=vec2(-0.90096885,-0.43388376);kDiskKernel[35]=vec2(-0.73305184,-0.6801728);kDiskKernel[36]=vec2(-0.4999999,-0.86602545);kDiskKernel[37]=vec2(-0.222521,-0.9749279);kDiskKernel[38]=vec2(0.07473029,-0.99720377);kDiskKernel[39]=vec2(0.36534148,-0.9308736);kDiskKernel[40]=vec2(0.6234897,-0.7818316);kDiskKernel[41]=vec2(0.8262388,-0.56332);kDiskKernel[42]=vec2(0.9555729,-0.29475483);}
#endif
#if QUALITY == 3
const int kSampleCount=71;vec2 kDiskKernel[kSampleCount];void initKernel(){kDiskKernel[0]=vec2(0,0);kDiskKernel[1]=vec2(0.2758621,0.0);kDiskKernel[2]=vec2(0.1719972,0.21567768);kDiskKernel[3]=vec2(-0.061385095,0.26894566);kDiskKernel[4]=vec2(-0.24854316,0.1196921);kDiskKernel[5]=vec2(-0.24854316,-0.11969208);kDiskKernel[6]=vec2(-0.061384983,-0.2689457);kDiskKernel[7]=vec2(0.17199717,-0.21567771);kDiskKernel[8]=vec2(0.51724136,0.0);kDiskKernel[9]=vec2(0.46601835,0.22442262);kDiskKernel[10]=vec2(0.32249472,0.40439558);kDiskKernel[11]=vec2(0.11509705,0.50427306);kDiskKernel[12]=vec2(-0.11509704,0.50427306);kDiskKernel[13]=vec2(-0.3224948,0.40439552);kDiskKernel[14]=vec2(-0.46601835,0.22442265);kDiskKernel[15]=vec2(-0.51724136,0.0);kDiskKernel[16]=vec2(-0.46601835,-0.22442262);kDiskKernel[17]=vec2(-0.32249463,-0.40439564);kDiskKernel[18]=vec2(-0.11509683,-0.5042731);kDiskKernel[19]=vec2(0.11509732,-0.504273);kDiskKernel[20]=vec2(0.32249466,-0.40439564);kDiskKernel[21]=vec2(0.46601835,-0.22442262);kDiskKernel[22]=vec2(0.7586207,0.0);kDiskKernel[23]=vec2(0.7249173,0.22360738);kDiskKernel[24]=vec2(0.6268018,0.4273463);kDiskKernel[25]=vec2(0.47299224,0.59311354);kDiskKernel[26]=vec2(0.27715522,0.7061801);kDiskKernel[27]=vec2(0.056691725,0.75649947);kDiskKernel[28]=vec2(-0.168809,0.7396005);kDiskKernel[29]=vec2(-0.3793104,0.65698475);kDiskKernel[30]=vec2(-0.55610836,0.51599306);kDiskKernel[31]=vec2(-0.6834936,0.32915324);kDiskKernel[32]=vec2(-0.7501475,0.113066405);kDiskKernel[33]=vec2(-0.7501475,-0.11306671);kDiskKernel[34]=vec2(-0.6834936,-0.32915318);kDiskKernel[35]=vec2(-0.5561083,-0.5159932);kDiskKernel[36]=vec2(-0.37931028,-0.6569848);kDiskKernel[37]=vec2(-0.16880904,-0.7396005);kDiskKernel[38]=vec2(0.056691945,-0.7564994);kDiskKernel[39]=vec2(0.2771556,-0.7061799);kDiskKernel[40]=vec2(0.47299215,-0.59311366);kDiskKernel[41]=vec2(0.62680185,-0.4273462);kDiskKernel[42]=vec2(0.72491735,-0.22360711);kDiskKernel[43]=vec2(1.0,0.0);kDiskKernel[44]=vec2(0.9749279,0.22252093);kDiskKernel[45]=vec2(0.90096885,0.43388376);kDiskKernel[46]=vec2(0.7818315,0.6234898);kDiskKernel[47]=vec2(0.6234898,0.7818315);kDiskKernel[48]=vec2(0.43388364,0.9009689);kDiskKernel[49]=vec2(0.22252098,0.9749279);kDiskKernel[50]=vec2(0.0,1.0);kDiskKernel[51]=vec2(-0.22252095,0.9749279);kDiskKernel[52]=vec2(-0.43388385,0.90096885);kDiskKernel[53]=vec2(-0.62349,0.7818314);kDiskKernel[54]=vec2(-0.7818317,0.62348956);kDiskKernel[55]=vec2(-0.90096885,0.43388382);kDiskKernel[56]=vec2(-0.9749279,0.22252093);kDiskKernel[57]=vec2(-1.0,0.0);kDiskKernel[58]=vec2(-0.9749279,-0.22252087);kDiskKernel[59]=vec2(-0.90096885,-0.43388376);kDiskKernel[60]=vec2(-0.7818314,-0.6234899);kDiskKernel[61]=vec2(-0.6234896,-0.7818316);kDiskKernel[62]=vec2(-0.43388346,-0.900969);kDiskKernel[63]=vec2(-0.22252055,-0.974928);kDiskKernel[64]=vec2(0.0,-1.0);kDiskKernel[65]=vec2(0.2225215,-0.9749278);kDiskKernel[66]=vec2(0.4338835,-0.90096897);kDiskKernel[67]=vec2(0.6234897,-0.7818316);kDiskKernel[68]=vec2(0.78183144,-0.62348986);kDiskKernel[69]=vec2(0.90096885,-0.43388376);kDiskKernel[70]=vec2(0.9749279,-0.22252086);}
#endif
uniform sampler2D u_cocTexture;uniform vec2 u_cocTexelSize;uniform float u_rcpAspect;uniform float u_maxCoC;varying vec2 v_uv;void main(){initKernel();vec4 samp0=texture2D(u_cocTexture,v_uv);
#ifndef USE_FLOAT
samp0=samp0*2.0-1.0;samp0=sign(samp0)*samp0*samp0;
#endif
vec4 bgAcc=vec4(0.0);vec4 fgAcc=vec4(0.0);for(int si=0;si<kSampleCount;si++){vec2 disp=kDiskKernel[si]*u_maxCoC;float dist=length(disp);vec2 duv=vec2(disp.x*u_rcpAspect,disp.y);vec4 samp=texture2D(u_cocTexture,v_uv+duv);
#ifndef USE_FLOAT
samp=samp*2.0-1.0;samp=sign(samp)*samp*samp;
#endif
float bgCoC=max(min(samp0.a,samp.a),0.0);float margin=u_cocTexelSize.y*2.0;float bgWeight=clamp((bgCoC-dist+margin)/margin,0.0,1.0);float fgWeight=clamp((-samp.a-dist+margin)/margin,0.0,1.0);fgWeight*=step(u_cocTexelSize.y,-samp.a);bgAcc+=vec4(samp.rgb,1.0)*bgWeight;fgAcc+=vec4(samp.rgb,1.0)*fgWeight;}bgAcc.rgb/=bgAcc.a+step(bgAcc.a,0.0);fgAcc.rgb/=fgAcc.a+step(fgAcc.a,0.0);bgAcc.a=smoothstep(u_cocTexelSize.y,u_cocTexelSize.y*2.0,samp0.a);fgAcc.a*=3.14159265359/float(kSampleCount);vec3 rgb=vec3(0.0);rgb=mix(rgb,bgAcc.rgb,clamp(bgAcc.a,0.0,1.0));rgb=mix(rgb,fgAcc.rgb,clamp(fgAcc.a,0.0,1.0));float alpha=(1.0-clamp(bgAcc.a,0.0,1.0))*(1.0-clamp(fgAcc.a,0.0,1.0));gl_FragColor=vec4(rgb,alpha);}`,bokehBlurShader=`#define GLSLIFY 1
uniform sampler2D u_bokehTexture;uniform vec2 u_bokehTexelSize;varying vec2 v_uv;void main(){vec4 duv=u_bokehTexelSize.xyxy*vec4(1.0,1.0,-1.0,0.0);vec4 acc;acc=texture2D(u_bokehTexture,v_uv-duv.xy);acc+=texture2D(u_bokehTexture,v_uv-duv.wy)*2.0;acc+=texture2D(u_bokehTexture,v_uv-duv.zy);acc+=texture2D(u_bokehTexture,v_uv+duv.zw)*2.0;acc+=texture2D(u_bokehTexture,v_uv)*4.0;acc+=texture2D(u_bokehTexture,v_uv+duv.xw)*2.0;acc+=texture2D(u_bokehTexture,v_uv+duv.zy);acc+=texture2D(u_bokehTexture,v_uv+duv.wy)*2.0;acc+=texture2D(u_bokehTexture,v_uv+duv.xy);gl_FragColor=acc*0.0625;}`,bokehFragmentShader=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_blurTexture;uniform float u_amount;void main(){vec4 cs=texture2D(u_texture,v_uv);vec4 cb=texture2D(u_blurTexture,v_uv);vec3 rgb=cs.rgb*cb.a+cb.rgb;gl_FragColor=mix(cs,vec4(rgb,cs.a),u_amount);}`;class Bokeh extends PostEffect{amount=1;fNumber=.07;focusDistance=5;useCameraFov=!1;focalLength=.463;kFilmHeight=36;quality=1;_prevQuality=-1;useFloatTexture=!1;_prevUseFloatTexture=null;useAdditionalBlur=!0;_halfWidth=0;_halfHeight=0;init(e){Object.assign(this,{sharedUniforms:{u_depthTexture:{value:null},u_texelSize:{value:null},u_focusDistance:{value:0},u_fNumber:{value:0},u_lensCoeff:{value:0},u_maxCoC:{value:0},u_rcpMaxCoC:{value:0},u_rcpAspect:{value:0},u_cameraNear:{value:0},u_cameraFar:{value:0},u_amount:{value:0},u_halfTexelSize:{value:new Vector2}}},e),super.init(),this.rt2=fboHelper.createRenderTarget(1,1,!1,postprocessing.useFloatTexture),this.rt3=fboHelper.createRenderTarget(1,1,!1,postprocessing.useFloatTexture),this.cocMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_hashNoise:{value:0},u_depthTexture:this.sharedUniforms.u_depthTexture,u_texelSize:this.sharedUniforms.u_texelSize,u_focusDistance:this.sharedUniforms.u_focusDistance,u_lensCoeff:this.sharedUniforms.u_lensCoeff,u_maxCoC:this.sharedUniforms.u_maxCoC,u_rcpMaxCoC:this.sharedUniforms.u_rcpMaxCoC,u_cameraNear:this.sharedUniforms.u_cameraNear,u_cameraFar:this.sharedUniforms.u_cameraFar},fragmentShader:bokehCocShader}),this.simMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_cocTexture:{value:null},u_cocTexelSize:this.sharedUniforms.u_halfTexelSize,u_rcpAspect:this.sharedUniforms.u_rcpAspect,u_maxCoC:this.sharedUniforms.u_maxCoC},fragmentShader:bokehSimShader}),this.blurMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_bokehTexture:{value:null},u_bokehTexelSize:this.sharedUniforms.u_halfTexelSize},fragmentShader:bokehBlurShader}),this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_blurTexture:{value:null},u_amount:this.sharedUniforms.u_amount},fragmentShader:fboHelper.precisionPrefix+bokehFragmentShader})}dispose(){this.rt1&&this.rt1.dispose(),this.rt2.dispose(),this.rt3.dispose()}needsRender(){return this.amount>0}_calculateFocalLength(e,t){return .5*t/Math.tan(.5*e)}_calculateMaxCoCRadius(e,t){let i=t*4+6;return Math.min(.05,i/e)}render(e,t=!1){let i=e.width,r=e.height,a=Math.ceil(i/2),o=Math.ceil(r/2);(this.rt2.width!==a||this.rt2.height!==o)&&(this.rt1&&this.rt1.setSize(a,o),this.rt2.setSize(a,o),this.rt3.setSize(a,o),this.sharedUniforms.u_halfTexelSize.value.set(1/a,1/o));let s=this._prevQuality!==this.quality,l=this._prevUseFloatTexture!==this.useFloatTexture,c=this.useCameraFov?this._calculateFocalLength(e.sharedUniforms.u_cameraFovRad.value,e.camera.getFilmHeight()):this.focalLength,d=this.focusDistance,f=this.fNumber,u=c*c/(f*(d-c)*this.kFilmHeight*2),h=this._calculateMaxCoCRadius(e.height,this.quality);this.sharedUniforms.u_amount.value=this.amount,this.sharedUniforms.u_texelSize.value=e.sharedUniforms.u_texelSize.value,this.sharedUniforms.u_depthTexture.value=e.sharedUniforms.u_sceneDepthTexture.value,this.sharedUniforms.u_cameraNear.value=e.sharedUniforms.u_cameraNear.value,this.sharedUniforms.u_cameraFar.value=e.sharedUniforms.u_cameraFar.value,this.sharedUniforms.u_focusDistance.value=d,this.sharedUniforms.u_fNumber.value=f,this.sharedUniforms.u_lensCoeff.value=u,this.sharedUniforms.u_maxCoC.value=h,this.sharedUniforms.u_rcpMaxCoC.value=1/h,this.sharedUniforms.u_rcpAspect.value=e.height/e.width,l&&(this.rt1&&this.rt1.dispose(),this.rt1=fboHelper.createRenderTarget(a,o,!1,this.useFloatTexture||e.useFloatTexture)),e.fromTexture.minFilter=e.fromTexture.magFilter=NearestFilter,l&&(this.cocMaterial.defines.USE_FLOAT=this.useFloatTexture,this.cocMaterial.needsUpdate=!0),this.cocMaterial.uniforms.u_hashNoise.value=(this.cocMaterial.uniforms.u_hashNoise.value+1.2415)%100,this.cocMaterial.uniforms.u_texture.value=e.fromTexture,fboHelper.render(this.cocMaterial,this.rt1),e.fromTexture.minFilter=e.fromTexture.magFilter=LinearFilter,this.simMaterial.defines.QUALITY=this.quality,this.simMaterial.uniforms.u_cocTexture.value=this.rt1.texture,s&&(this.simMaterial.needsUpdate=!0),l&&(this.simMaterial.defines.USE_FLOAT=this.useFloatTexture,this.simMaterial.needsUpdate=!0),fboHelper.render(this.simMaterial,this.rt2),this.useAdditionalBlur&&(this.blurMaterial.uniforms.u_bokehTexture.value=this.rt2.texture,fboHelper.render(this.blurMaterial,this.rt3)),this.material.uniforms.u_blurTexture.value=this.useAdditionalBlur?this.rt3.texture:this.rt2.texture,this._prevQuality=this.quality,this._prevUseFloatTexture=this.useFloatTexture,super.render.call(this,e,t)}}const frag$5=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_blurTexture0;
#if ITERATION > 1
uniform sampler2D u_blurTexture1;
#endif
#if ITERATION > 2
uniform sampler2D u_blurTexture2;
#endif
#if ITERATION > 3
uniform sampler2D u_blurTexture3;
#endif
#if ITERATION > 4
uniform sampler2D u_blurTexture4;
#endif
uniform float u_bloomWeights[ITERATION];uniform float u_saturation;
#include <common>
vec3 dithering(vec3 color){float grid_position=rand(gl_FragCoord.xy);vec3 dither_shift_RGB=vec3(0.25/255.0,-0.25/255.0,0.25/255.0);dither_shift_RGB=mix(2.0*dither_shift_RGB,-2.0*dither_shift_RGB,grid_position);return color+dither_shift_RGB;}void main(){vec4 color=texture2D(u_texture,v_uv);vec3 bloomColor=(u_bloomWeights[0]*texture2D(u_blurTexture0,v_uv)
#if ITERATION > 1
+u_bloomWeights[1]*texture2D(u_blurTexture1,v_uv)
#endif
#if ITERATION > 2
+u_bloomWeights[2]*texture2D(u_blurTexture2,v_uv)
#endif
#if ITERATION > 3
+u_bloomWeights[3]*texture2D(u_blurTexture3,v_uv)
#endif
#if ITERATION > 4
+u_bloomWeights[4]*texture2D(u_blurTexture4,v_uv)
#endif
).rgb;float luma=dot(bloomColor,vec3(0.299,0.587,0.114));color.rgb+=mix(vec3(luma),bloomColor,u_saturation);color.rgb=dithering(color.rgb);gl_FragColor=color;}`,highPassFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_luminosityThreshold;uniform float u_smoothWidth;uniform float u_lumaStrength;uniform float u_selectiveStrength;
#ifdef USE_HALO
uniform vec2 u_texelSize;uniform vec2 u_aspect;uniform float u_haloWidth;uniform float u_haloRGBShift;uniform vec3 u_haloLeftColor;uniform vec3 u_haloMidColor;uniform vec3 u_haloRightColor;uniform float u_haloStrength;uniform float u_haloMaskInner;uniform float u_haloMaskOuter;
#ifdef USE_LENS_DIRT
uniform sampler2D u_dirtTexture;uniform vec2 u_dirtAspect;
#endif
#endif
#ifdef USE_CONVOLUTION
uniform float u_convolutionBuffer;
#endif
varying vec2 v_uv;void main(){vec2 uv=v_uv;
#ifdef USE_CONVOLUTION
uv=(uv-0.5)*(1.0+u_convolutionBuffer)+0.5;
#endif
vec4 texel=texture2D(u_texture,uv);float luma=dot(texel.xyz,vec3(0.299,0.587,0.114));float alpha=smoothstep(u_luminosityThreshold,u_luminosityThreshold+u_smoothWidth,luma);vec3 color=texel.rgb*(alpha*u_lumaStrength+texel.a*u_selectiveStrength);gl_FragColor=vec4(color,1.0);
#ifdef USE_HALO
vec2 toCenter=(uv-0.5)*u_aspect;vec2 ghostUv=1.0-(toCenter+0.5);vec2 ghostVec=(vec2(0.5)-ghostUv);vec2 direction=normalize(ghostVec);vec2 haloVec=direction*u_haloWidth;float weight=length(vec2(0.5)-fract(ghostUv+haloVec));weight=pow(1.0-weight,3.0);vec3 distortion=vec3(-u_texelSize.x,0.0,u_texelSize.x)*u_haloRGBShift;float zoomBlurRatio=fract(atan(toCenter.y,toCenter.x)*40.0)*0.05+0.95;ghostUv*=zoomBlurRatio;vec2 haloUv=ghostUv+haloVec;vec3 halo=(texture2D(u_texture,haloUv+direction*distortion.r).rgb*u_haloLeftColor+texture2D(u_texture,haloUv+direction*distortion.g).rgb*u_haloMidColor+texture2D(u_texture,haloUv+direction*distortion.b).rgb*u_haloRightColor)*u_haloStrength*smoothstep(u_haloMaskInner,u_haloMaskOuter,length(toCenter));
#ifdef USE_LENS_DIRT
vec2 dirtUv=(uv-0.5)*u_dirtAspect+0.5;vec3 dirt=texture2D(u_dirtTexture,dirtUv).rgb;gl_FragColor.rgb+=(halo+alpha+0.05*dirt)*dirt;
#else
gl_FragColor.rgb+=halo;
#endif
#endif
#ifdef USE_CONVOLUTION
gl_FragColor.rgb*=max(abs(uv.x-0.5),abs(uv.y-0.5))>0.5 ? 0. : 1.;
#endif
}`,blurFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_resolution;uniform vec2 u_direction;float gaussianPdf(in float x,in float sigma){return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;}void main(){vec2 invSize=1.0/u_resolution;float fSigma=float(SIGMA);float weightSum=gaussianPdf(0.0,fSigma);vec3 diffuseSum=texture2D(u_texture,v_uv).rgb*weightSum;for(int i=1;i<KERNEL_RADIUS;i++){float x=float(i);float w=gaussianPdf(x,fSigma);vec2 uvOffset=u_direction*invSize*x;vec3 sample1=texture2D(u_texture,v_uv+uvOffset).rgb;vec3 sample2=texture2D(u_texture,v_uv-uvOffset).rgb;diffuseSum+=(sample1+sample2)*w;weightSum+=2.0*w;}gl_FragColor=vec4(diffuseSum/weightSum,1.0);}`,fftFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_texelSize;uniform float u_subtransformSize,u_normalization;uniform bool u_isHorizontal,u_isForward;const float TWOPI=6.283185307179586;void main(){float index=(u_isHorizontal ? gl_FragCoord.x : gl_FragCoord.y)-0.5;float evenIndex=floor(index/u_subtransformSize)*(u_subtransformSize*0.5)+mod(index,u_subtransformSize*0.5)+0.5;vec2 evenPos=(u_isHorizontal ? vec2(evenIndex,gl_FragCoord.y): vec2(gl_FragCoord.x,evenIndex))*u_texelSize;vec2 oddPos=evenPos+vec2(u_isHorizontal,!u_isHorizontal)*.5;vec4 even=texture2D(u_texture,evenPos);vec4 odd=texture2D(u_texture,oddPos);float twiddleArgument=(u_isForward ? TWOPI :-TWOPI)*(index/u_subtransformSize);vec2 twiddle=vec2(cos(twiddleArgument),sin(twiddleArgument));gl_FragColor=(even.rgba+vec4(twiddle.x*odd.xz-twiddle.y*odd.yw,twiddle.y*odd.xz+twiddle.x*odd.yw).xzyw)*u_normalization;}`,convolutionSrcFrag=`#define GLSLIFY 1
uniform vec2 u_aspect;varying vec2 v_uv;void main(){vec2 toCenter=(fract(v_uv+0.5)-0.5)*0.35*u_aspect;vec2 rotToCenter=mat2(0.7071067811865476,-0.7071067811865476,0.7071067811865476,0.7071067811865476)*toCenter;float res=exp(-length(toCenter)*2.0)*0.02+exp(-length(toCenter)*15.0)*0.5+exp(-length(toCenter)*50.0)*3.+exp(-length(rotToCenter*vec2(1.0,8.0))*75.0)*8.+exp(-length(rotToCenter*vec2(8.0,1.0))*75.0)*8.+exp(-length(rotToCenter*vec2(1.0,20.0))*150.0)*40.+exp(-length(rotToCenter*vec2(20.0,1.0))*150.0)*40.+exp(-length(toCenter*vec2(1.0,10.0))*60.0)*8.+exp(-length(toCenter*vec2(10.0,1.0))*60.0)*8.+exp(-length(toCenter*vec2(1.0,20.0))*120.0)*75.+exp(-length(toCenter*vec2(20.0,1.0))*120.0)*75.;gl_FragColor=vec4(res,0.0,res,0.0);}`,convolutionMixFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_kernelTexture;void main(){vec4 a=texture2D(u_texture,v_uv);vec4 b=texture2D(u_kernelTexture,v_uv);gl_FragColor=vec4(a.xz*b.xz-a.yw*b.yw,a.xz*b.yw+a.yw*b.xz).xzyw;}`,convolutionCacheFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_amount;varying vec2 v_uv;void main(){gl_FragColor=texture2D(u_texture,v_uv)*u_amount;}`,convolutionFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_bloomTexture;uniform float u_convolutionBuffer;uniform float u_saturation;
#include <common>
vec3 dithering(vec3 color){float grid_position=rand(gl_FragCoord.xy);vec3 dither_shift_RGB=vec3(0.25/255.0,-0.25/255.0,0.25/255.0);dither_shift_RGB=mix(2.0*dither_shift_RGB,-2.0*dither_shift_RGB,grid_position);return color+dither_shift_RGB;}void main(){vec4 color=texture2D(u_texture,v_uv);vec2 bloomUv=(v_uv-0.5)*(1.0-u_convolutionBuffer)+0.5;vec3 bloomColor=texture2D(u_bloomTexture,bloomUv).rgb;float luma=dot(bloomColor,vec3(0.299,0.587,0.114));color.rgb+=mix(vec3(luma),bloomColor,u_saturation);color.rgb=dithering(color.rgb);gl_FragColor=color;}`;class Bloom extends PostEffect{ITERATION=5;USE_CONVOLUTION=!0;USE_HD=!0;USE_LENS_DIRT=!1;amount=1;radius=0;threshold=.1;smoothWidth=1;lumaStrength=.5;selectiveStrength=1;saturation=1;haloWidth=.8;haloRGBShift=.03;haloStrength=.21;haloLeftColorHex="#ff0000";haloMidColorHex="#00ff00";haloRightColorHex="#0000ff";haloLeftColor=new Color;haloMidColor=new Color;haloRightColor=new Color;haloMaskInner=.3;haloMaskOuter=.5;highPassMaterial;highPassRenderTarget;fftMaterial;srcMaterial;convolutionSrcFrag=convolutionSrcFrag;srcSize=256;srcRT;fftCacheRT1;fftCacheRT2;fftSrcRT;fftBloomOutCacheMaterial;fftBloomOutCacheRT;convolutionMixMaterial;convolutionMixDownScale=1;convolutionBuffer=.1;renderTargetsHorizontal=[];renderTargetsVertical=[];blurMaterials=[];directionX=new Vector2(1,0);directionY=new Vector2(0,1);init(e){Object.assign(this,e),super.init();let t=this.USE_HD?HalfFloatType:!1;if(this.highPassRenderTarget=fboHelper.createRenderTarget(1,1,!this.USE_HD,t),this.highPassMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_luminosityThreshold:{value:1},u_smoothWidth:{value:1},u_lumaStrength:{value:1},u_selectiveStrength:{value:1},u_haloWidth:{value:1},u_haloRGBShift:{value:1},u_haloLeftColor:{value:this.haloLeftColor},u_haloMidColor:{value:this.haloMidColor},u_haloRightColor:{value:this.haloRightColor},u_haloStrength:{value:1},u_haloMaskInner:{value:1},u_haloMaskOuter:{value:1},u_texelSize:null,u_aspect:{value:new Vector2},u_dirtTexture:{value:null},u_dirtAspect:{value:new Vector2}},fragmentShader:highPassFrag}),this.highPassMaterial.defines.USE_LENS_DIRT=this.USE_LENS_DIRT,this.USE_CONVOLUTION)this.highPassMaterial.defines.USE_CONVOLUTION=!0,this.highPassMaterial.uniforms.u_convolutionBuffer={value:.15},this.fftSrcRT=fboHelper.createRenderTarget(1,1,!0,t),this.fftCacheRT1=fboHelper.createRenderTarget(1,1,!0,t),this.fftCacheRT2=this.fftCacheRT1.clone(),this.fftBloomOutCacheRT=fboHelper.createRenderTarget(1,1),this.srcMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_aspect:{value:new Vector2}},fragmentShader:this.convolutionSrcFrag}),this.fftMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_texelSize:{value:new Vector2},u_subtransformSize:{value:0},u_normalization:{value:0},u_isHorizontal:{value:0},u_isForward:{value:0}},fragmentShader:fftFrag}),this.convolutionMixMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_kernelTexture:{value:this.fftSrcRT.texture}},fragmentShader:convolutionMixFrag}),this.fftBloomOutCacheMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_amount:{value:0}},fragmentShader:convolutionCacheFrag}),this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_bloomTexture:{value:this.fftBloomOutCacheRT.texture},u_convolutionBuffer:this.highPassMaterial.uniforms.u_convolutionBuffer,u_saturation:{value:0}},fragmentShader:convolutionFrag,blending:NoBlending});else{for(let i=0;i<this.ITERATION;i++){this.renderTargetsHorizontal.push(fboHelper.createRenderTarget(1,1,!1,t)),this.renderTargetsVertical.push(fboHelper.createRenderTarget(1,1,!1,t));let r=3+i*2;this.blurMaterials[i]=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_resolution:{value:new Vector2},u_direction:{value:null}},fragmentShader:blurFrag,defines:{KERNEL_RADIUS:r,SIGMA:r}})}this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_bloomStrength:{value:1},u_bloomWeights:{value:[]},u_saturation:{value:0}},fragmentShader:frag$5,blending:NoBlending,defines:{ITERATION:this.ITERATION}});for(let i=0;i<this.ITERATION;i++)this.material.uniforms["u_blurTexture"+i]={value:this.renderTargetsVertical[i].texture}}}setDirtTexture(e){this.highPassMaterial.uniforms.u_dirtTexture.value=e}dispose(){if(!this.USE_CONVOLUTION){this.highPassRenderTarget&&this.highPassRenderTarget.dispose();for(let e=0;e<this.ITERATION;e++)this.renderTargetsHorizontal[e]&&this.renderTargetsHorizontal[e].dispose(),this.renderTargetsVertical[e]&&this.renderTargetsVertical[e].dispose()}}needsRender(){return!!this.amount}renderFFT(e,t,i){let r=e.width,a=e.height,o=Math.round(Math.log(r)/Math.log(2)),s=Math.round(Math.log(a)/Math.log(2)),l=o+s,c=l%2===0,d=this.fftMaterial,f=d.uniforms;for(let u=0;u<l;u++){let h=u<o;f.u_texture.value=e.texture,f.u_normalization.value=u===0?1/Math.sqrt(r*a):1,f.u_isHorizontal.value=!!h,f.u_isForward.value=!!i,f.u_texelSize.value.set(1/r,1/a),f.u_subtransformSize.value=Math.pow(2,(h?u:u-o)+1),fboHelper.render(d,t);let _=e;e=t,t=_}c&&fboHelper.copy(e.texture,t)}render(e,t=!1){let i=e.width,r=e.height,a,o;if(this.USE_CONVOLUTION?(a=math.powerTwoCeiling(i/2)>>this.convolutionMixDownScale,o=math.powerTwoCeiling(r/2)>>this.convolutionMixDownScale):(a=Math.ceil(i/2),o=Math.ceil(r/2)),a!==this.highPassRenderTarget.width||o!==this.highPassRenderTarget.height)if(this.highPassRenderTarget.setSize(a,o),this.USE_CONVOLUTION){this.fftSrcRT.setSize(a,o),this.fftCacheRT1.setSize(a,o),this.fftCacheRT2.setSize(a,o),this.fftBloomOutCacheRT.setSize(a,o);let m=r/Math.max(i,r);this.srcMaterial.uniforms.u_aspect.value.set(i/r*m,m),fboHelper.render(this.srcMaterial,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftSrcRT,!0)}else for(let m=0;m<this.ITERATION;m++)this.renderTargetsHorizontal[m].setSize(a,o),this.renderTargetsVertical[m].setSize(a,o),this.blurMaterials[m].uniforms.u_resolution.value.set(a,o),a=Math.ceil(a/2),o=Math.ceil(o/2);let s=this.highPassMaterial.uniforms;s.u_texture.value=e.fromTexture,s.u_luminosityThreshold.value=this.threshold,s.u_smoothWidth.value=this.smoothWidth,s.u_lumaStrength.value=this.lumaStrength,s.u_selectiveStrength.value=this.selectiveStrength,s.u_haloWidth.value=this.haloWidth,s.u_haloRGBShift.value=this.haloRGBShift*i;let l=this.haloLeftColor.setStyle(this.haloLeftColorHex),c=this.haloMidColor.setStyle(this.haloMidColorHex),d=this.haloRightColor.setStyle(this.haloRightColorHex),f=l.r+c.r+d.r,u=l.g+c.g+d.g,h=l.b+c.b+d.b;l.r=f?l.r/f:1,l.g=u?l.g/u:0,l.b=h?l.b/h:0,c.r=f?c.r/f:0,c.g=u?c.g/u:1,c.b=h?c.b/h:0,d.r=f?d.r/f:0,d.g=u?d.g/u:0,d.b=h?d.b/h:1,s.u_haloStrength.value=this.haloStrength,s.u_haloMaskInner.value=this.haloMaskInner,s.u_haloMaskOuter.value=this.haloMaskOuter,s.u_texelSize=e.sharedUniforms.u_texelSize,s.u_aspect=e.sharedUniforms.u_aspect;let _=this.haloStrength>0,v=r/Math.sqrt(i*i+r*r)*2;if(s.u_aspect.value.set(i/r*v,v),v=r/Math.max(i,r),s.u_dirtAspect.value.set(i/r*v,v),this.material.uniforms.u_saturation.value=this.saturation,this.highPassMaterial.defines.USE_HALO!==_&&(this.highPassMaterial.defines.USE_HALO=_,this.highPassMaterial.needsUpdate=!0),this.USE_CONVOLUTION&&(s.u_convolutionBuffer.value=this.convolutionBuffer),fboHelper.render(this.highPassMaterial,this.highPassRenderTarget),this.USE_CONVOLUTION){fboHelper.copy(this.highPassRenderTarget.texture,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftCacheRT2,!0),this.convolutionMixMaterial.uniforms.u_texture.value=this.fftCacheRT2.texture,fboHelper.render(this.convolutionMixMaterial,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftCacheRT2,!1);let m=this.amount*1024;m/=Math.pow(math.powerTwoCeilingBase(this.fftCacheRT1.width*this.fftCacheRT1.height),4),this.fftBloomOutCacheMaterial.uniforms.u_amount.value=m,this.fftBloomOutCacheMaterial.uniforms.u_texture.value=this.fftCacheRT2.texture,fboHelper.render(this.fftBloomOutCacheMaterial,this.fftBloomOutCacheRT),super.render(e,t)}else{let m=this.highPassRenderTarget;for(let p=0;p<this.ITERATION;p++){let S=this.blurMaterials[p];S.uniforms.u_texture.value=m.texture,S.uniforms.u_direction.value=this.directionX,fboHelper.render(S,this.renderTargetsHorizontal[p]),S.uniforms.u_texture.value=this.renderTargetsHorizontal[p].texture,S.uniforms.u_direction.value=this.directionY,fboHelper.render(S,this.renderTargetsVertical[p]),m=this.renderTargetsVertical[p]}this.material.uniforms.u_texture.value=e.fromTexture;for(let p=0;p<this.ITERATION;p++){let S=(this.ITERATION-p)/this.ITERATION;this.material.uniforms.u_bloomWeights.value[p]=this.amount*(S+(1.2-S*2)*this.radius)/Math.pow(2,this.ITERATION-p-1)}super.render(e,t)}}}class ShaderHelper{glslifyStrip(e){return e.replace(/#define\sGLSLIFY\s./,"")}addChunk(e,t){ShaderChunk[e]=this.glslifyStrip(t)}_wrapInclude(e){return"#include <"+e+">"}insertBefore(e,t,i,r){const a=r?this._wrapInclude(t):t;return e.replace(t,this.glslifyStrip(i)+`
`+a)}insertAfter(e,t,i,r){const a=r?this._wrapInclude(t):t;return e.replace(a,a+`
`+this.glslifyStrip(i)+`
`)}replace(e,t,i,r){const a=r?this._wrapInclude(t):t;return e.replace(a,`
`+this.glslifyStrip(i)+`
`)}}const shaderHelper=new ShaderHelper,getBlueNoiseShader=`#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;uniform vec2 u_blueNoiseTexelSize;uniform vec2 u_blueNoiseCoordOffset;vec3 getBlueNoise(vec2 coord){return texture2D(u_blueNoiseTexture,coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;}vec3 getStaticBlueNoise(vec2 coord){return texture2D(u_blueNoiseTexture,coord*u_blueNoiseTexelSize).rgb;}`;class BlueNoise{sharedUniforms={u_blueNoiseTexture:{value:null},u_blueNoiseLinearTexture:{value:null},u_blueNoiseTexelSize:{value:null},u_blueNoiseCoordOffset:{value:new Vector2}};TEXTURE_SIZE=128;preInit(){let e=new Texture;e.generateMipmaps=!1,e.minFilter=e.magFilter=LinearFilter,e.wrapS=e.wrapT=RepeatWrapping;let t=new Texture(properties.loader.add(settings.TEXTURE_PATH+"LDR_RGB1_0.png",{weight:55,onLoad:function(){t.needsUpdate=!0,e.needsUpdate=!0}}).content);e.image=t.image,t.generateMipmaps=!1,t.minFilter=t.magFilter=NearestFilter,t.wrapS=t.wrapT=RepeatWrapping,this.sharedUniforms.u_blueNoiseTexture.value=t,this.sharedUniforms.u_blueNoiseLinearTexture.value=e,this.sharedUniforms.u_blueNoiseTexelSize.value=new Vector2(1/this.TEXTURE_SIZE,1/this.TEXTURE_SIZE),shaderHelper.addChunk("getBlueNoise",getBlueNoiseShader)}update(e){this.sharedUniforms.u_blueNoiseCoordOffset.value.set(Math.random(),Math.random())}}const blueNoise=new BlueNoise,frag$4=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform sampler2D u_screenPaintTexture;uniform vec2 u_screenPaintTexelSize;uniform float u_amount;uniform float u_rgbShift;uniform float u_multiplier;uniform float u_colorMultiplier;uniform float u_shade;varying vec2 v_uv;
#include <getBlueNoise>
void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy+vec2(17.,29.));vec4 data=texture2D(u_screenPaintTexture,v_uv);float weight=(data.z+data.w)*0.5;vec2 vel=(0.5-data.xy-0.001)*2.*weight;vec4 color=vec4(0.0);vec2 velocity=vel*u_amount/4.0*u_screenPaintTexelSize*u_multiplier;vec2 uv=v_uv+bnoise.xy*velocity;for(int i=0;i<9;i++){color+=texture2D(u_texture,uv);uv+=velocity;}color/=9.;color.rgb+=sin(vec3(vel.x+vel.y)*40.0+vec3(0.0,2.0,4.0)*u_rgbShift)*smoothstep(0.4,-0.9,weight)*u_shade*max(abs(vel.x),abs(vel.y))*u_colorMultiplier;gl_FragColor=color;}`;class ScreenPaintDistortion extends PostEffect{amount=20;rgbShift=1;multiplier=1.25;colorMultiplier=1;shade=1.25;renderOrder=10;init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_screenPaintTexture:screenPaint.sharedUniforms.u_currPaintTexture,u_screenPaintTexelSize:screenPaint.sharedUniforms.u_paintTexelSize,u_amount:{value:0},u_rgbShift:{value:0},u_multiplier:{value:0},u_colorMultiplier:{value:0},u_shade:{value:0}},blueNoise.sharedUniforms),fragmentShader:frag$4})}needsRender(){return this.amount>0}syncCamera(e){this.needsSync=!0,e&&(e.matrixWorldInverse.decompose(this._position,this._quaternion,this._scale),this.projectionViewMatrix.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert()),this.prevProjectionViewMatrix.copy(this.projectionViewMatrix)}render(e,t=!1){this.material.uniforms.u_amount.value=this.amount,this.material.uniforms.u_rgbShift.value=this.rgbShift,this.material.uniforms.u_multiplier.value=this.multiplier,this.material.uniforms.u_colorMultiplier.value=this.colorMultiplier,this.material.uniforms.u_shade.value=this.shade,super.render(e,t)}}class Ease{quadIn(e){return e*e}quadOut(e){return e*(2-e)}quadInOut(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}cubicIn(e){return e*e*e}cubicOut(e){return--e*e*e+1}cubicInOut(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}quartIn(e){return e*e*e*e}quartOut(e){return 1- --e*e*e*e}quartInOut(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}quintIn(e){return e*e*e*e*e}quintOut(e){return--e*e*e*e*e+1}quintInOut(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}sineIn(e){return 1-Math.cos(e*Math.PI/2)}sineOut(e){return Math.sin(e*Math.PI/2)}sineInOut(e){return .5*(1-Math.cos(Math.PI*e))}expoIn(e){return e===0?0:Math.pow(1024,e-1)}expoOut(e){return e===1?1:1-Math.pow(2,-10*e)}expoInOut(e){return e===0?0:e===1?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(-Math.pow(2,-10*(e-1))+2)}circIn(e){return 1-Math.sqrt(1-e*e)}circOut(e){return Math.sqrt(1- --e*e)}circInOut(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}elasticIn(e){let t,i=.1,r=.4;return e===0?0:e===1?1:(!i||i<1?(i=1,t=r/4):t=r*Math.asin(1/i)/(2*Math.PI),-(i*Math.pow(2,10*(e-=1))*Math.sin((e-t)*2*Math.PI/r)))}elasticOut(e){let t,i=.1,r=.4;return e===0?0:e===1?1:(!i||i<1?(i=1,t=r/4):t=r*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*e)*Math.sin((e-t)*2*Math.PI/r)+1)}elasticInOut(e){let t,i=.1,r=.4;return e===0?0:e===1?1:(!i||i<1?(i=1,t=r/4):t=r*Math.asin(1/i)/(2*Math.PI),(e*=2)<1?-.5*i*Math.pow(2,10*(e-=1))*Math.sin((e-t)*2*Math.PI/r):i*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*2*Math.PI/r)*.5+1)}backIn(e){let t=1.70158;return e*e*((t+1)*e-t)}backOut(e){let t=1.70158;return--e*e*((t+1)*e+t)+1}backInOut(e){let t=2.5949095;return(e*=2)<1?.5*e*e*((t+1)*e-t):.5*((e-=2)*e*((t+1)*e+t)+2)}bounceIn(e){return 1-this.bounceOut(1-e)}bounceOut(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375}bounceInOut(e){return e<.5?this.bounceIn(e*2)*.5:this.bounceOut(e*2-1)*.5+.5}cubicBezier(e,t,i,r,a){if(e<=0)return 0;if(e>=1)return 1;if(t===i&&r===a)return e;const o=(F,V,C,I)=>1/(3*V*F*F+2*C*F+I),s=(F,V,C,I,N)=>V*(F*F*F)+C*(F*F)+I*F+N,l=(F,V,C,I,N)=>{let K=F*F;return V*(K*F)+C*K+I*F+N};let c=0,d=0,f=t,u=i,h=r,_=a,v=1,m=1,p=v-3*h+3*f-c,S=3*h-6*f+3*c,M=3*f-3*c,y=c,w=m-3*_+3*u-d,A=3*_-6*u+3*d,R=3*u-3*d,x=d,T=e,z,P,B;for(z=0;z<100;z++)P=s(T,p,S,M,y),B=o(T,p,S,M),B===1/0&&(B=e),T-=(P-e)*B,T=Math.min(Math.max(T,0),1);return l(T,w,A,R,x)}}const ease=new Ease,frag$3=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec3 u_bgColor;uniform float u_opacity;uniform float u_vignetteFrom;uniform float u_vignetteTo;uniform vec2 u_vignetteAspect;uniform vec3 u_vignetteColor;uniform float u_saturation;uniform float u_contrast;uniform float u_brightness;uniform vec3 u_tintColor;uniform float u_tintOpacity;uniform float u_ditherSeed;uniform float u_debugAlpha;uniform vec3 u_preloaderBgColor;uniform float u_preloaderRatio;float hash13(vec3 p3){p3=fract(p3*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}vec3 screen(vec3 cb,vec3 cs){return cb+cs-(cb*cs);}vec3 colorDodge(vec3 cb,vec3 cs){return mix(min(vec3(1.0),cb/(1.0-cs)),vec3(1.0),step(vec3(1.0),cs));}void main(){vec2 uv=v_uv;vec4 texel=pow(texture2D(u_texture,uv),vec4(2.2));vec3 color=texel.rgb;float luma=dot(color,vec3(0.299,0.587,0.114));color=mix(vec3(luma),color,1.0+u_saturation);color=clamp(0.5+(1.0+u_contrast)*(color-0.5),0.,1.);color+=u_brightness;color=mix(color,screen(colorDodge(color,u_tintColor),u_tintColor),u_tintOpacity);float dist=length((uv-0.5)*u_vignetteAspect)*2.0;color=mix(color,u_vignetteColor,smoothstep(u_vignetteFrom,u_vignetteTo,dist));gl_FragColor=vec4(mix(u_bgColor,color,u_opacity),1.0);gl_FragColor.rgb=mix(gl_FragColor.rgb,texel.aaa,u_debugAlpha);gl_FragColor.rgb=min(vec3(1.),pow(gl_FragColor.rgb,vec3(1.0/2.2))+hash13(vec3(gl_FragCoord.xy,u_ditherSeed))/255.0);gl_FragColor.rgb=mix(gl_FragColor.rgb,u_preloaderBgColor,u_preloaderRatio);}`,preloaderFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform float u_hideRatio;uniform float u_maskRatio;uniform vec2 u_resolution;uniform vec2 u_viewportResolution;
#include <getBlueNoise>
#include <sampleBlurSRGB>
void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy);float a=u_resolution.x/u_resolution.y*0.2;float l=1.+a;float s=0.6;float x=v_uv.y+v_uv.x*a;float mask=smoothstep(0.,s,u_maskRatio*(l+s)-x)*smoothstep(s,0.,(u_maskRatio-1.)*(l+s)-x);float blurRadius=pow((1.-x/l),2.)*50.*u_viewportResolution.y/1080.*(1.-u_hideRatio);vec3 sceneColor=sampleBlurSRGB(u_texture,v_uv,1./u_resolution,blurRadius,bnoise.z).rgb;vec3 color=mix(vec3(0.0676,0.1063,0.0429),sceneColor,mask);gl_FragColor=vec4(pow(color,vec3(1.0/2.2)),1.);}`;class Final extends PostEffect{vignetteFrom=.6;vignetteTo=1.6;vignetteAspect=new Vector2;vignetteColor=new Color;saturation=1;contrast=0;brightness=1;tintColor=new Color;tintOpacity=1;bgColor=new Color;opacity=1;debugAlpha=!1;cacheRenderTarget=null;preloaderBgColor=new Color;preloaderRatio=1;init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_vignetteFrom:{value:0},u_vignetteTo:{value:0},u_vignetteAspect:{value:this.vignetteAspect},u_vignetteColor:{value:this.vignetteColor},u_saturation:{value:0},u_contrast:{value:0},u_brightness:{value:0},u_tintColor:{value:this.tintColor},u_tintOpacity:{value:0},u_bgColor:{value:this.bgColor},u_opacity:{value:0},u_ditherSeed:{value:0},u_debugAlpha:{value:0},u_preloaderBgColor:{value:this.preloaderBgColor},u_preloaderRatio:{value:this.preloaderRatio}},fragmentShader:frag$3}),this.preloaderMaterial=fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_viewportResolution:properties.sharedUniforms.u_viewportResolution,u_hideRatio:{value:0},u_maskRatio:{value:0}},blueNoise.sharedUniforms),fragmentShader:preloaderFrag,defines:{BLUR_SAMPLE:6}})}render(e,t=!1){const i=e.width,r=e.height;let a=this.material.uniforms;a.u_vignetteFrom.value=this.vignetteFrom,a.u_vignetteTo.value=this.vignetteTo;const o=r/Math.sqrt(i*i+r*r);this.vignetteAspect.set(i/r*o,o),a.u_saturation.value=this.saturation-1,a.u_contrast.value=this.contrast,a.u_brightness.value=this.brightness-1,a.u_tintOpacity.value=this.tintOpacity,a.u_opacity.value=this.opacity,a.u_debugAlpha.value=this.debugAlpha?1:0,a.u_ditherSeed.value=Math.random()*1e3,this.preloaderRatio=math.fit(properties.startTime,0,1,1,0),this.preloaderBgColor.setStyle(properties.bgColorHex,LinearSRGBColorSpace),this.material.uniforms.u_preloaderRatio.value=this.preloaderRatio,this.material.uniforms.u_preloaderBgColor.value=this.preloaderBgColor,this.material.uniforms.u_texture.value=e.fromTexture,fboHelper.render(this.material,t?null:e.toRenderTarget),e.swap()}}const fragmentShader$3=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform sampler2D u_historyTexture;uniform highp sampler2D u_velocityTexture;uniform vec2 u_resolution;uniform float u_historyWeight;varying vec2 v_uv;vec2 unpackRGBATo2Half(const in vec4 v){return vec2(v.x+(v.y/255.0),v.z+(v.w/255.0));}vec4 AdjustHDRColor(vec4 color){float luminance=dot(color.rgb,vec3(0.299,0.587,0.114));float luminanceWeight=1.0/(1.0+luminance);return vec4(color.rgb*luminanceWeight,color.a);}vec4 SampleHistoryCatmullRom(sampler2D tex,vec2 uv,vec2 texelSize){vec2 position=uv*u_resolution;vec2 centerPosition=floor(position-0.5)+0.5;vec2 f=position-centerPosition;vec2 f2=f*f;vec2 f3=f2*f;vec2 w0=f2-0.5*(f3+f);vec2 w1=1.5*f3-2.5*f2+1.0;vec2 w3=0.5*(f3-f2);vec2 w2=1.0-w0-w1-w3;vec2 s0=w0+w1;vec2 s1=w2+w3;vec2 f0=w1/s0;vec2 f1=w3/s1;vec2 t0=(centerPosition-1.0+f0)*texelSize;vec2 t1=(centerPosition+1.0+f1)*texelSize;return(texture2D(tex,vec2(t0.x,t0.y))*s0.x+texture2D(tex,vec2(t1.x,t0.y))*s1.x)*s0.y+(texture2D(tex,vec2(t0.x,t1.y))*s0.x+texture2D(tex,vec2(t1.x,t1.y))*s1.x)*s1.y;}void main(){vec2 texelSize=1.0/u_resolution;vec4 velocityRaw=texture2D(u_velocityTexture,v_uv);vec2 velocity=unpackRGBATo2Half(velocityRaw)-0.5;vec2 previousPixelPos=v_uv-velocity;vec4 currentColor=texture2D(u_texture,v_uv);vec4 historyColorWeighted=SampleHistoryCatmullRom(u_historyTexture,previousPixelPos,texelSize);if(any(lessThan(previousPixelPos,vec2(0.0)))||any(greaterThan(previousPixelPos,vec2(1.0)))){historyColorWeighted=currentColor;}vec4 minColor=vec4(9999.0);vec4 maxColor=vec4(-9999.0);for(int x=-1;x<=1;++x){for(int y=-1;y<=1;++y){vec4 neighbor=texture2D(u_texture,v_uv+vec2(x,y)*texelSize);minColor=min(minColor,neighbor);maxColor=max(maxColor,neighbor);}}historyColorWeighted=clamp(historyColorWeighted,minColor,maxColor);vec4 blendedColor=(currentColor*(1.0-u_historyWeight)+historyColorWeighted*u_historyWeight);gl_FragColor=blendedColor;}`,taaJitteringVert=`#define GLSLIFY 1
varying vec4 v_currentFramePosition;varying vec4 v_previousFramePosition;
#ifdef USE_TAA
uniform mat4 viewProjectionMatrix;uniform mat4 viewProjectionMatrixJittered;uniform mat4 prevViewProjectionMatrix;uniform mat4 prevModelMatrix;void getTAAPositions(vec3 pos,out vec4 outJitteredPosition,out vec4 currentFramePosition,out vec4 previousFramePosition){vec4 worldPosition=modelMatrix*vec4(pos,1.0);currentFramePosition=viewProjectionMatrix*worldPosition;vec4 prevWorldPosition=prevModelMatrix*vec4(pos,1.0);previousFramePosition=prevViewProjectionMatrix*prevWorldPosition;outJitteredPosition=viewProjectionMatrixJittered*modelMatrix*vec4(pos,1.0);}
#else
void getTAAPositions(vec3 pos,out vec4 outJitteredPosition,out vec4 currentFramePosition,out vec4 previousFramePosition){outJitteredPosition=projectionMatrix*modelViewMatrix*vec4(pos,1.0);currentFramePosition=outJitteredPosition;previousFramePosition=outJitteredPosition;}
#endif
`,taaJitteringFragPars=`#define GLSLIFY 1
layout(location=1)out vec4 pc_fragVelocity;
#define gl_FragVelocity pc_fragVelocity
vec4 pack2HalfToRGBA(const in vec2 v){vec4 r=vec4(v.x,fract(v.x*255.0),v.y,fract(v.y*255.0));return vec4(r.x-r.y/255.0,r.y,r.z-r.w/255.0,r.w);}
#ifdef USE_TAA
varying vec4 v_currentFramePosition;varying vec4 v_previousFramePosition;vec4 calcTAAVelocity(){vec4 newPos=v_currentFramePosition;vec4 oldPos=v_previousFramePosition;newPos/=newPos.w;oldPos/=oldPos.w;vec2 velocity=(newPos.xy-oldPos.xy)*0.5;return pack2HalfToRGBA(velocity+0.5);}
#else
vec4 calcTAAVelocity(){return pack2HalfToRGBA(vec2(0.5));}
#endif
`,taaJitteringFrag=`#define GLSLIFY 1
gl_FragVelocity=calcTAAVelocity();`;shaderHelper.addChunk("taaJitteringVert",taaJitteringVert);shaderHelper.addChunk("taaJitteringFragPars",taaJitteringFragPars);shaderHelper.addChunk("taaJitteringFrag",taaJitteringFrag);class TAA extends PostEffect{historyRt=null;isActive=!0;isDebugActive=!0;needsReset=!1;init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_historyTexture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_velocityTexture:{value:null},u_historyWeight:{value:.8}},blueNoise.sharedUniforms),fragmentShader:fragmentShader$3}),window.toggleTAA=()=>{this.isDebugActive=!this.isDebugActive,console.log("TAA active: ",this.isDebugActive)},window.resetTAA=()=>{this.needsReset=!0,console.log("TAA reset requested")}}needsRender(){return(!this.isActive||!this.isDebugActive)&&(this.needsReset=!0),this.isActive&&this.isDebugActive}_reset(e){this.historyRt&&fboHelper.copy(e.fromTexture,this.historyRt),this.needsReset=!1}render(e,t){let i=e.toRenderTarget.width,r=e.toRenderTarget.height;this.historyRt?(this.historyRt.width!==i||this.historyRt.height!==r)&&(this.historyRt.setSize(i,r),this.needsReset=!0):(this.historyRt=e.toRenderTarget.clone(),this.historyRt.setSize(i,r),this.needsReset=!0),this.needsReset?this._reset(e):(this.material.uniforms.u_historyTexture.value=this.historyRt.texture,this.material.uniforms.u_texture.value=e.fromTexture,this.material.uniforms.u_velocityTexture.value=e.sceneRenderTarget._velocityTexture,fboHelper.render(this.material,e.toRenderTarget),fboHelper.copy(e.toRenderTarget.texture,this.historyRt),e.swap())}}const fragmentShader$2=`#define GLSLIFY 1
#define FXAA_QUALITY_P0 1.0
#define FXAA_QUALITY_P1 1.5
#define FXAA_QUALITY_P2 2.0
#define FXAA_QUALITY_P3 4.0
#define FXAA_QUALITY_P4 12.0
#define FxaaBool bool
#define FxaaFloat float
#define FxaaFloat2 vec2
#define FxaaFloat3 vec3
#define FxaaFloat4 vec4
#define FxaaHalf float
#define FxaaHalf2 vec2
#define FxaaHalf3 vec3
#define FxaaHalf4 vec4
#define FxaaInt2 vec2
#define FxaaTex sampler2D
#define FxaaSat(x) clamp(x, 0.0, 1.0)
#define FxaaTexTop(t, p) texture2D(t, p)
#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r))
FxaaFloat FxaaLuma(FxaaFloat4 rgba){return rgba.y;}FxaaFloat4 FxaaPixelShader(FxaaFloat2 pos,FxaaTex tex,FxaaFloat2 fxaaQualityRcpFrame,FxaaFloat fxaaQualitySubpix,FxaaFloat fxaaQualityEdgeThreshold,FxaaFloat fxaaQualityEdgeThresholdMin){FxaaFloat2 posM;posM.x=pos.x;posM.y=pos.y;FxaaFloat4 rgbyM=FxaaTexTop(tex,posM);
#define lumaM rgbyM.y
FxaaFloat lumaS=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(0,1),fxaaQualityRcpFrame.xy));FxaaFloat lumaE=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(1,0),fxaaQualityRcpFrame.xy));FxaaFloat lumaN=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(0,-1),fxaaQualityRcpFrame.xy));FxaaFloat lumaW=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(-1,0),fxaaQualityRcpFrame.xy));FxaaFloat maxSM=max(lumaS,lumaM);FxaaFloat minSM=min(lumaS,lumaM);FxaaFloat maxESM=max(lumaE,maxSM);FxaaFloat minESM=min(lumaE,minSM);FxaaFloat maxWN=max(lumaN,lumaW);FxaaFloat minWN=min(lumaN,lumaW);FxaaFloat rangeMax=max(maxWN,maxESM);FxaaFloat rangeMin=min(minWN,minESM);FxaaFloat rangeMaxScaled=rangeMax*fxaaQualityEdgeThreshold;FxaaFloat range=rangeMax-rangeMin;FxaaFloat rangeMaxClamped=max(fxaaQualityEdgeThresholdMin,rangeMaxScaled);FxaaBool earlyExit=range<rangeMaxClamped;if(earlyExit)return rgbyM;FxaaFloat lumaNW=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(-1,-1),fxaaQualityRcpFrame.xy));FxaaFloat lumaSE=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(1,1),fxaaQualityRcpFrame.xy));FxaaFloat lumaNE=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(1,-1),fxaaQualityRcpFrame.xy));FxaaFloat lumaSW=FxaaLuma(FxaaTexOff(tex,posM,FxaaInt2(-1,1),fxaaQualityRcpFrame.xy));FxaaFloat lumaNS=lumaN+lumaS;FxaaFloat lumaWE=lumaW+lumaE;FxaaFloat subpixRcpRange=1.0/range;FxaaFloat subpixNSWE=lumaNS+lumaWE;FxaaFloat edgeHorz1=(-2.0*lumaM)+lumaNS;FxaaFloat edgeVert1=(-2.0*lumaM)+lumaWE;FxaaFloat lumaNESE=lumaNE+lumaSE;FxaaFloat lumaNWNE=lumaNW+lumaNE;FxaaFloat edgeHorz2=(-2.0*lumaE)+lumaNESE;FxaaFloat edgeVert2=(-2.0*lumaN)+lumaNWNE;FxaaFloat lumaNWSW=lumaNW+lumaSW;FxaaFloat lumaSWSE=lumaSW+lumaSE;FxaaFloat edgeHorz4=(abs(edgeHorz1)*2.0)+abs(edgeHorz2);FxaaFloat edgeVert4=(abs(edgeVert1)*2.0)+abs(edgeVert2);FxaaFloat edgeHorz3=(-2.0*lumaW)+lumaNWSW;FxaaFloat edgeVert3=(-2.0*lumaS)+lumaSWSE;FxaaFloat edgeHorz=abs(edgeHorz3)+edgeHorz4;FxaaFloat edgeVert=abs(edgeVert3)+edgeVert4;FxaaFloat subpixNWSWNESE=lumaNWSW+lumaNESE;FxaaFloat lengthSign=fxaaQualityRcpFrame.x;FxaaBool horzSpan=edgeHorz>=edgeVert;FxaaFloat subpixA=subpixNSWE*2.0+subpixNWSWNESE;if(!horzSpan)lumaN=lumaW;if(!horzSpan)lumaS=lumaE;if(horzSpan)lengthSign=fxaaQualityRcpFrame.y;FxaaFloat subpixB=(subpixA*(1.0/12.0))-lumaM;FxaaFloat gradientN=lumaN-lumaM;FxaaFloat gradientS=lumaS-lumaM;FxaaFloat lumaNN=lumaN+lumaM;FxaaFloat lumaSS=lumaS+lumaM;FxaaBool pairN=abs(gradientN)>=abs(gradientS);FxaaFloat gradient=max(abs(gradientN),abs(gradientS));if(pairN)lengthSign=-lengthSign;FxaaFloat subpixC=FxaaSat(abs(subpixB)*subpixRcpRange);FxaaFloat2 posB;posB.x=posM.x;posB.y=posM.y;FxaaFloat2 offNP;offNP.x=(!horzSpan)? 0.0 : fxaaQualityRcpFrame.x;offNP.y=(horzSpan)? 0.0 : fxaaQualityRcpFrame.y;if(!horzSpan)posB.x+=lengthSign*0.5;if(horzSpan)posB.y+=lengthSign*0.5;FxaaFloat2 posN;posN.x=posB.x-offNP.x*FXAA_QUALITY_P0;posN.y=posB.y-offNP.y*FXAA_QUALITY_P0;FxaaFloat2 posP;posP.x=posB.x+offNP.x*FXAA_QUALITY_P0;posP.y=posB.y+offNP.y*FXAA_QUALITY_P0;FxaaFloat subpixD=((-2.0)*subpixC)+3.0;FxaaFloat lumaEndN=FxaaLuma(FxaaTexTop(tex,posN));FxaaFloat subpixE=subpixC*subpixC;FxaaFloat lumaEndP=FxaaLuma(FxaaTexTop(tex,posP));if(!pairN)lumaNN=lumaSS;FxaaFloat gradientScaled=gradient*1.0/4.0;FxaaFloat lumaMM=lumaM-lumaNN*0.5;FxaaFloat subpixF=subpixD*subpixE;FxaaBool lumaMLTZero=lumaMM<0.0;lumaEndN-=lumaNN*0.5;lumaEndP-=lumaNN*0.5;FxaaBool doneN=abs(lumaEndN)>=gradientScaled;FxaaBool doneP=abs(lumaEndP)>=gradientScaled;if(!doneN)posN.x-=offNP.x*FXAA_QUALITY_P1;if(!doneN)posN.y-=offNP.y*FXAA_QUALITY_P1;FxaaBool doneNP=(!doneN)||(!doneP);if(!doneP)posP.x+=offNP.x*FXAA_QUALITY_P1;if(!doneP)posP.y+=offNP.y*FXAA_QUALITY_P1;if(doneNP){if(!doneN)lumaEndN=FxaaLuma(FxaaTexTop(tex,posN.xy));if(!doneP)lumaEndP=FxaaLuma(FxaaTexTop(tex,posP.xy));if(!doneN)lumaEndN=lumaEndN-lumaNN*0.5;if(!doneP)lumaEndP=lumaEndP-lumaNN*0.5;doneN=abs(lumaEndN)>=gradientScaled;doneP=abs(lumaEndP)>=gradientScaled;if(!doneN)posN.x-=offNP.x*FXAA_QUALITY_P2;if(!doneN)posN.y-=offNP.y*FXAA_QUALITY_P2;doneNP=(!doneN)||(!doneP);if(!doneP)posP.x+=offNP.x*FXAA_QUALITY_P2;if(!doneP)posP.y+=offNP.y*FXAA_QUALITY_P2;if(doneNP){if(!doneN)lumaEndN=FxaaLuma(FxaaTexTop(tex,posN.xy));if(!doneP)lumaEndP=FxaaLuma(FxaaTexTop(tex,posP.xy));if(!doneN)lumaEndN=lumaEndN-lumaNN*0.5;if(!doneP)lumaEndP=lumaEndP-lumaNN*0.5;doneN=abs(lumaEndN)>=gradientScaled;doneP=abs(lumaEndP)>=gradientScaled;if(!doneN)posN.x-=offNP.x*FXAA_QUALITY_P3;if(!doneN)posN.y-=offNP.y*FXAA_QUALITY_P3;doneNP=(!doneN)||(!doneP);if(!doneP)posP.x+=offNP.x*FXAA_QUALITY_P3;if(!doneP)posP.y+=offNP.y*FXAA_QUALITY_P3;if(doneNP){if(!doneN)lumaEndN=FxaaLuma(FxaaTexTop(tex,posN.xy));if(!doneP)lumaEndP=FxaaLuma(FxaaTexTop(tex,posP.xy));if(!doneN)lumaEndN=lumaEndN-lumaNN*0.5;if(!doneP)lumaEndP=lumaEndP-lumaNN*0.5;doneN=abs(lumaEndN)>=gradientScaled;doneP=abs(lumaEndP)>=gradientScaled;if(!doneN)posN.x-=offNP.x*FXAA_QUALITY_P4;if(!doneN)posN.y-=offNP.y*FXAA_QUALITY_P4;doneNP=(!doneN)||(!doneP);if(!doneP)posP.x+=offNP.x*FXAA_QUALITY_P4;if(!doneP)posP.y+=offNP.y*FXAA_QUALITY_P4;}}}FxaaFloat dstN=posM.x-posN.x;FxaaFloat dstP=posP.x-posM.x;if(!horzSpan)dstN=posM.y-posN.y;if(!horzSpan)dstP=posP.y-posM.y;FxaaBool goodSpanN=(lumaEndN<0.0)!=lumaMLTZero;FxaaFloat spanLength=(dstP+dstN);FxaaBool goodSpanP=(lumaEndP<0.0)!=lumaMLTZero;FxaaFloat spanLengthRcp=1.0/spanLength;FxaaBool directionN=dstN<dstP;FxaaFloat dst=min(dstN,dstP);FxaaBool goodSpan=directionN ? goodSpanN : goodSpanP;FxaaFloat subpixG=subpixF*subpixF;FxaaFloat pixelOffset=(dst*(-spanLengthRcp))+0.5;FxaaFloat subpixH=subpixG*fxaaQualitySubpix;FxaaFloat pixelOffsetGood=goodSpan ? pixelOffset : 0.0;FxaaFloat pixelOffsetSubpix=max(pixelOffsetGood,subpixH);if(!horzSpan)posM.x+=pixelOffsetSubpix*lengthSign;if(horzSpan)posM.y+=pixelOffsetSubpix*lengthSign;return FxaaFloat4(FxaaTexTop(tex,posM).xyz,lumaM);}varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_texelSize;const float fxaaQualitySubpix=0.5;const float fxaaQualityEdgeThreshold=0.125;const float fxaaQualityEdgeThresholdMin=0.0833;void main(){vec2 fxaaQualityRcpFrame=u_texelSize;vec4 color=FxaaPixelShader(v_uv,u_texture,fxaaQualityRcpFrame,fxaaQualitySubpix,fxaaQualityEdgeThreshold,fxaaQualityEdgeThresholdMin);
#ifdef SKIP_ALPHA
float alpha=texture2D(u_texture,v_uv).a;gl_FragColor=vec4(color.rgb,alpha);
#else
gl_FragColor=color;
#endif
}`;class Fxaa extends PostEffect{isActive=!0;init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_texelSize:null},fragmentShader:fragmentShader$2}),this.material.defines.SKIP_ALPHA=1}needsRender(){return this.isActive}render(e,t=!1){this.material.uniforms.u_texelSize=e.sharedUniforms.u_texelSize,super.render(e,t)}}const vertexShader=`#define GLSLIFY 1
attribute vec3 position;attribute vec2 uv;uniform vec4 u_rect;uniform vec2 u_boxSize;varying vec2 v_xy;void main(){vec2 pos=position.xy*.5+.5;pos=mix(u_rect.xy,u_rect.xy+u_rect.zw,pos);gl_Position=vec4(pos,0.,1.);v_xy=vec2(uv.x,1.-uv.y)*u_boxSize;}`,fragmentShader$1=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_posA;uniform vec2 u_dir;uniform float u_length;uniform vec2 u_texelSize;uniform vec2 u_blurRadii;uniform vec3 u_color;uniform float u_colorAlphaA;uniform float u_colorAlphaB;uniform vec2 u_boxSize;uniform float u_radius;uniform float u_outline;varying vec2 v_xy;
#include <linearstep>
#include <getBlueNoise>
#include <sampleBlur>
float sdRoundedBox(in vec2 p,in vec2 b,in float r){vec2 q=abs(p)-b+r;return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r;}void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy);vec2 uv=gl_FragCoord.xy*u_texelSize;float ratio=clamp(dot(v_xy-u_posA.xy,u_dir)/u_length,0.,1.);float sdf=sdRoundedBox(v_xy-u_boxSize.xy*0.5,u_boxSize*.5,u_radius);float roundedBox=smoothstep(1.5,0.,sdf);float blurRadius=mix(u_blurRadii.x,u_blurRadii.y,ratio)*roundedBox;vec4 color=sampleBlur(u_texture,uv,u_texelSize,blurRadius,bnoise.z);float colorAlpha=mix(u_colorAlphaA,u_colorAlphaB,ratio)*roundedBox;color.rgb=mix(color.rgb,u_color,colorAlpha);float outline=smoothstep(-1.5,0.,sdf)*roundedBox;vec2 boxUv=v_xy/u_boxSize;color.rgb+=outline*linearstep(0.,2.,2.-boxUv.x-boxUv.y)*max(u_colorAlphaA,u_colorAlphaB)*u_outline;gl_FragColor=color;}`;class BlurBox extends PostEffect{renderOrder=50;blurRadiusA=0;blurRadiusB=0;posA=new Vector2;posB=new Vector2;x=0;y=0;width=0;height=0;color=new Color;colorAlphaA=0;colorAlphaB=0;outline=0;useExtra=!1;extra={blurRadiusA:0,blurRadiusB:0,posA:new Vector2,posB:new Vector2,x:0,y:0,width:0,height:0,color:new Color,colorAlphaA:0,colorAlphaB:0,outline:0};init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_rect:{value:new Vector4},u_posA:{value:this.posA},u_dir:{value:new Vector2},u_length:{value:0},u_texelSize:{value:null},u_blurRadii:{value:new Vector2},u_color:{value:new Color},u_colorAlphaA:{value:1},u_colorAlphaB:{value:1},u_boxSize:{value:new Vector2},u_radius:{value:0},u_outline:{value:0}},blueNoise.sharedUniforms),vertexShader,fragmentShader:fragmentShader$1}),this.material.defines.BLUR_SAMPLE=16}needsRender(){return this.blurRadiusA>0||this.blurRadiusB>0||this.colorAlphaA>0||this.colorAlphaB>0||this.useExtra}reset(){this.blurRadiusA=0,this.blurRadiusB=0,this.colorAlphaA=0,this.colorAlphaB=0,this.outline=0,this.useExtra=!1}anchor(e,t=0){this.x=e.screenX,this.y=e.screenY+t,this.width=e.width,this.height=e.height,this.posA.set(0,0),this.posB.set(0,properties.viewportHeight)}updateUniforms(e,t){const i=e.height,r=properties.viewportWidth,a=properties.viewportHeight,o=this.material.uniforms;o.u_texture.value=e.fromTexture,o.u_rect.value.set(t.x/r*2-1,1-(t.y+t.height)/a*2,t.width/r*2,t.height/a*2),o.u_boxSize.value.set(t.width,t.height),o.u_dir.value.copy(t.posB).sub(t.posA).normalize(),o.u_length.value=Math.max(.1,t.posB.sub(t.posA).length()),o.u_texelSize.value=e.texelSize,o.u_blurRadii.value.set(t.blurRadiusA,t.blurRadiusB).multiplyScalar(i),o.u_color.value.copy(t.color).convertLinearToSRGB(),o.u_colorAlphaA.value=t.colorAlphaA,o.u_colorAlphaB.value=t.colorAlphaB,o.u_outline.value=t.outline}render(e,t=!1){const i=this.material.uniforms;this.updateUniforms(e,this),i.u_radius.value=0,fboHelper.copy(e.fromTexture,t?null:e.toRenderTarget),fboHelper.renderGeometry(fboHelper.quadGeom,this.material,t?null:e.toRenderTarget),this.useExtra&&(this.updateUniforms(e,this.extra),i.u_radius.value=Math.min(this.extra.width,this.extra.height)/2,fboHelper.renderGeometry(fboHelper.quadGeom,this.material,t?null:e.toRenderTarget)),e.swap()}}const blurBox=new BlurBox,fragmentShader=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_textureSize;uniform vec2 u_resolution;uniform float u_aspect;varying vec2 v_uv;
#include <getBlueNoise>
vec4 sampleBlur(sampler2D tex,vec2 uv,vec2 texelSize,float blurAmount,float n,vec2 clampX){const float G=2.39996323;float gc=cos(G);float gs=sin(G);mat2 rot=mat2(gc,gs,-gs,gc);float initialAngle=n*6.28318530718;vec2 d=vec2(cos(initialAngle),sin(initialAngle));float sn=1.0/sqrt(float(BLUR_SAMPLE));vec2 s=texelSize*blurAmount*sn;vec4 c=vec4(0.);for(int i=0;i<BLUR_SAMPLE;i++){float r=sqrt(float(i+1));vec2 imgUv=uv+d*r*s;imgUv.x=clamp(imgUv.x,clampX.x,clampX.y);vec4 t=texture2D(tex,imgUv);t.rgb=pow(t.rgb,vec3(2.2));c+=t;d=rot*d;}return c/float(BLUR_SAMPLE);}void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy);float clampXPadding=max(0.,(u_resolution.x-u_resolution.y*u_aspect)+2.)/2./u_resolution.x;vec2 imgUv=vec2(v_uv.x,v_uv.y);float blurRatio=smoothstep(0.5-clampXPadding,0.6-clampXPadding,abs(v_uv.x-.5));blurRatio=pow(blurRatio,.5);float blurRadius=blurRatio*300.*u_resolution.y/1080.;gl_FragColor=sampleBlur(u_texture,v_uv,1./u_resolution,blurRadius,bnoise.z,vec2(clampXPadding,1.-clampXPadding));gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(1.0/2.2));}`;class ScreenClip extends PostEffect{init(e){Object.assign(this,e),super.init(),this.material=fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_aspect:{value:browser.isMobile?1:2}},blueNoise.sharedUniforms),fragmentShader}),this.material.defines.BLUR_SAMPLE=8}reset(){this.enabled=!1}}let _usedTAA=!1;class Postprocessing{width=1;height=1;scene=null;camera=null;resolution=new Vector2(0,0);texelSize=new Vector2(0,0);aspect=new Vector2(1,1);onBeforeSceneRendered=new MinSignal$2;onAfterSceneRendered=new MinSignal$2;onAfterRendered=new MinSignal$2;sceneCacheRenderTarget=null;sceneCacheBlurCacheRenderTarget=null;sceneCacheBlurredRenderTarget=null;sceneCacheBlurredTextureSize=new Vector2(0,0);sceneRenderTarget=null;fromRenderTarget=null;toRenderTarget=null;useDepthTexture=!0;depthTexture=null;fromTexture=null;toTexture=null;sceneTexture=null;queue=[];hasSizeChanged=!0;useMSAA=!1;postProfile=new PostProfile;useFloatTexture=!1;taa;fxaa;smaa;bokeh;bloom;screenPaintDistortion;final;screenClip;sharedUniforms={u_sceneTexture:{value:null},u_sceneCacheTexture:{value:null},u_sceneCacheBlurredTexture:{value:null},u_sceneCacheBlurredTextureSize:{value:this.sceneCacheBlurredTextureSize},u_fromTexture:{value:null},u_toTexture:{value:null},u_sceneDepthTexture:{value:null},u_cameraNear:{value:0},u_cameraFar:{value:1},u_cameraFovRad:{value:1},u_resolution:{value:this.resolution},u_texelSize:{value:this.texelSize},u_aspect:{value:this.aspect}};init(e,t){if(this.scene=e,this.camera=t,this.useMSAA?(this.sceneRenderTarget=fboHelper.createMultisampleRenderTarget(1,1,!1,this.useFloatTexture),this.sceneRenderTarget._renderTexture=this.sceneRenderTarget.textures[0]):(this.sceneRenderTarget=fboHelper.createRenderTarget(1,1,!1,this.useFloatTexture,0,2),this.sceneRenderTarget.textures[0].name="color",this.sceneRenderTarget.textures[0].minFilter=LinearFilter,this.sceneRenderTarget.textures[0].magFilter=LinearFilter,this.sceneRenderTarget.textures[1].name="velocity",this.sceneRenderTarget.textures[1].minFilter=NearestFilter,this.sceneRenderTarget.textures[1].magFilter=NearestFilter,this.sceneRenderTarget._renderTexture=this.sceneRenderTarget.textures[0],this.sceneRenderTarget._velocityTexture=this.sceneRenderTarget.textures[1]),this.sceneRenderTarget.depthBuffer=!0,this.useMSAA=this.sceneRenderTarget.samples>0,this.fromRenderTarget=fboHelper.createRenderTarget(1,1,!1,this.useFloatTexture),this.toRenderTarget=this.fromRenderTarget.clone(),this.useDepthTexture=!!this.useDepthTexture&&fboHelper.renderer&&(fboHelper.renderer.capabilities.isWebGL2||fboHelper.renderer.extensions.get("WEBGL_depth_texture")),this.fromTexture=this.fromRenderTarget.texture,this.toTexture=this.toRenderTarget.texture,this.sceneTexture=this.sceneRenderTarget.texture,this.sceneCacheRenderTarget=this.fromRenderTarget.clone(),this.sceneCacheBlurCacheRenderTarget=this.fromRenderTarget.clone(),this.sceneCacheBlurredRenderTarget=this.fromRenderTarget.clone(),this.sharedUniforms.u_sceneCacheTexture.value=this.sceneCacheRenderTarget.texture,this.sharedUniforms.u_sceneCacheBlurredTexture.value=this.sceneCacheBlurredRenderTarget.texture,this.useDepthTexture&&fboHelper.renderer){let i=new DepthTexture(this.resolution.width,this.resolution.height);fboHelper.renderer.capabilities.isWebGL2?i.type=UnsignedIntType:(i.format=DepthStencilFormat,i.type=UnsignedInt248Type),i.minFilter=NearestFilter,i.magFilter=NearestFilter,this.sceneRenderTarget.depthTexture=i,this.depthTexture=this.sharedUniforms.u_sceneDepthTexture.value=i}}addQueue(){if(!this.useMSAA){let a=this.taa=new TAA;a.init(),this.queue.push(a);let o=this.fxaa=new Fxaa;o.init(),this.queue.push(o);let s=this.smaa=new Smaa;s.init(),s.setTextures(properties.loader.add(settings.TEXTURE_PATH+"smaa-area.png",{weight:32}).content,properties.loader.add(settings.TEXTURE_PATH+"smaa-search.png",{weight:.1}).content),this.queue.push(s)}if(this.useDepthTexture){let a=this.bokeh=new Bokeh;a.init(),a.quality=browser.isMobile?0:1,this.queue.push(a)}let e=this.screenClip=new ScreenClip;e.init(),this.queue.push(e);let t=this.bloom=new Bloom;t.USE_CONVOLUTION=!1;//!browser.isMobile;
!properties.renderer.extensions.get("OES_texture_float_linear")&&!properties.renderer.extensions.get("OES_texture_half_float_linear")&&(t.USE_HD=!1),t.init(),t.USE_LENS_DIRT&&t.setDirtTexture(properties.loader.add(settings.TEXTURE_PATH+"lens_dirt.jpg",{weight:32,type:"texture"}).content),this.queue.push(t),blurBox.init(),this.queue.push(blurBox);let i=this.screenPaintDistortion=new ScreenPaintDistortion;i.init({screenPaint}),this.queue.push(i);let r=this.final=new Final;r.init(),this.queue.push(r)}updateSmaaTextures(){this.useMSAA||this.smaa.updateTextures()}checkTAARenderTarget(){this.useMSAA||(this.fxaa.isActive=!1,this.smaa.isActive=!1,this.taa.isActive?this.fxaa.isActive=!0:this.smaa.isActive=!0)}syncProfile(){let e=this.postProfile,t=this.smaa,i=this.bokeh,r=this.bloom,a=this.screenPaintDistortion,o=this.final;r.amount=e.bloomAmount,r.radius=e.bloomRadius,r.threshold=e.bloomThreshold,r.smoothWidth=e.bloomSmoothWidth,r.lumaStrength=e.bloomLumaStrength,r.selectiveStrength=e.bloomSelectiveStrength,r.saturation=e.bloomSaturation,r.haloWidth=e.haloWidth,r.haloRGBShift=e.haloRGBShift,r.haloLeftColorHex=e.haloLeftColorHex,r.haloMidColorHex=e.haloMidColorHex,r.haloRightColorHex=e.haloRightColorHex,r.haloStrength=e.haloStrength,r.haloMaskInner=e.haloMaskInner,r.haloMaskOuter=e.haloMaskOuter,a.amount=e.screenPaintDistortionAmount,a.rgbShift=e.screenPaintDistortionRGBShift,a.colorMultiplier=e.screenPaintDistortionColorMultiplier,a.multiplier=e.screenPaintDistortionMultiplier,this.smaa&&(t.threshold=e.smaaThreshold),o.vignetteFrom=e.vignetteFrom,o.vignetteTo=e.vignetteTo,o.vignetteColor.setStyle(e.vignetteColorHex),o.saturation=e.saturation,o.contrast=e.contrast,o.brightness=e.brightness,o.tintColor.setStyle(e.tintColorHex),o.tintOpacity=e.tintOpacity,i&&(i.amount=e.bokehAmount,i.fNumber=e.bokehFNumber,i.focusDistance=e.bokehFocusDistance,i.focalLength=e.bokehFocalLength,i.kFilmHeight=e.bokehKFilmHeight),o.opacity=properties.opacity,o.bgColor.setStyle(properties.bgColorHex,LinearSRGBColorSpace),o.debugAlpha=properties.debugAlpha}swap(){let e=this.fromRenderTarget;this.fromRenderTarget=this.toRenderTarget,this.toRenderTarget=e,this.fromTexture=this.fromRenderTarget.texture,this.toTexture=this.toRenderTarget.texture,this.sharedUniforms.u_fromTexture.value=this.fromTexture,this.sharedUniforms.u_toTexture.value=this.toTexture}setSize(e,t){if(this.width!==e||this.height!==t){this.hasSizeChanged=!0,this.width=e,this.height=t,this.resolution.set(e,t),this.texelSize.set(1/e,1/t);let i=t/Math.sqrt(e*e+t*t)*2;this.aspect.set(e/t*i,i),this.sceneRenderTarget.setSize(e,t),this.fromRenderTarget.setSize(e,t),this.toRenderTarget.setSize(e,t);let r=e>>1,a=t>>1;this.sceneCacheRenderTarget.setSize(e,t),this.sceneCacheBlurCacheRenderTarget.setSize(r,a),this.sceneCacheBlurredRenderTarget.setSize(r,a)}}dispose(){this.fromRenderTarget&&this.fromRenderTarget.dispose(),this.toRenderTarget&&this.toRenderTarget.dispose(),this.sceneRenderTarget&&this.sceneRenderTarget.dispose()}blendProfile(e,t=0){properties.skipProfileUpdate||this.postProfile.blend(e,t)}cacheScene(e,t=4){let i=fboHelper.renderer,r=i.getRenderTarget();i.setRenderTarget(this.sceneRenderTarget),fboHelper.clearMultisampleRenderTargetState(),e&&(fboHelper.copy(this.sceneRenderTarget.texture,this.sceneCacheRenderTarget),this.hasSceneCache=!0),t&&(blur.blur(t,.5,this.sceneRenderTarget,this.sceneCacheBlurCacheRenderTarget,this.sceneCacheBlurredRenderTarget,!0),this.sceneCacheBlurredTextureSize.set(this.sceneCacheBlurredRenderTarget.width,this.sceneCacheBlurredRenderTarget.height),this.hasSceneCacheBlurred=!0),i.setRenderTarget(r)}_filterQueue(e){return e.enabled&&e.needsRender()}render(e,t,i){if(!fboHelper.renderer)return;this.scene=e,this.camera=t;let r=this.sharedUniforms;r.u_sceneTexture.value=this.sceneRenderTarget.texture,r.u_cameraNear.value=t.near,r.u_cameraFar.value=t.far,r.u_cameraFovRad.value=t.fov/180*Math.PI,this.onBeforeSceneRendered.dispatch(),fboHelper.renderer.autoClear=!1,fboHelper.renderer.setClearColor(properties.bgColor,1),fboHelper.renderer.setRenderTarget(this.sceneRenderTarget),fboHelper.renderer.clear();const a=fboHelper.renderer.getContext();a.drawBuffers([a.COLOR_ATTACHMENT0,a.COLOR_ATTACHMENT1]),a.clearBufferfv(a.COLOR,1,new Float32Array([127/255,128/255,127/255,128/255])),a.drawBuffers([a.COLOR_ATTACHMENT0,a.NONE]),this.taa.isActive=!1,fboHelper.renderer.render(e,t),fboHelper.renderer.setRenderTarget(null);let o=this.taa.isActive;o&&!_usedTAA&&(this.taa.needsReset=!0),_usedTAA=o,this.checkTAARenderTarget();let s=this.queue.filter(this._filterQueue);s.sort((l,c)=>l.renderOrder==c.renderOrder?0:l.renderOrder-c.renderOrder),fboHelper.copy(this.sceneRenderTarget.texture,this.fromRenderTarget),this.onAfterSceneRendered.dispatch(this.sceneRenderTarget);for(let l=0,c=s.length;l<c;l++){let d=l===c-1&&i;s[l].render(this,d)}this.onAfterRendered.dispatch(),this.hasSizeChanged=!1}}const postprocessing=new Postprocessing,vert$2=`#define GLSLIFY 1
attribute float Cd;attribute float a_componentId;uniform float u_radialCount;uniform float u_partCount;uniform float u_baseAngle;uniform vec3 u_baseOffset;uniform float u_partOffset;uniform float u_baseColorId;
#ifdef USE_INSTANCING
attribute float instanceId;attribute float instanceColorBase;
#endif
#ifdef IS_PART3
uniform float u_partAnimation;
#endif
varying vec3 v_viewNormal;varying vec3 v_viewPosition;varying vec2 v_outlineRG;varying float v_ao;vec4 quaternion(float angle,vec3 axis){angle*=.5;return vec4(axis*sin(angle),cos(angle));}vec3 qrotate(vec4 q,vec3 v){return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
#include <linearstep>
void main(){vec3 pos=position;vec3 nor=normal;
#ifdef USE_INSTANCING
float radialIndex=floor(instanceId/u_partCount);float partIndex=mod(instanceId,u_partCount);vec3 baseOffset=u_baseOffset;float baseAngle=u_baseAngle;
#ifdef IS_PART3
float radialRatio=radialIndex/(u_radialCount-1.);float partAnimation=linearstep(radialRatio*0.2,0.75+radialRatio*0.25,u_partAnimation);float partAppearRatio=linearstep(0.,0.4,partAnimation);float partOffsetRatio=linearstep(0.,1.,partAnimation);pos.xy*=partAppearRatio;baseOffset.y-=0.2*(1.-partOffsetRatio);baseAngle-=3.2+2.*(1.-partAnimation);
#endif
float angle=baseAngle+6.2831853/u_radialCount*radialIndex;pos=pos+baseOffset+vec3(u_partOffset*partIndex,0.,0.);vec4 instanceQuat=quaternion(angle,vec3(0.,1.,0.));pos=qrotate(instanceQuat,pos);nor=qrotate(instanceQuat,nor);
#endif
vec4 mvPosition=modelViewMatrix*vec4(pos,1.0);gl_Position=projectionMatrix*mvPosition;v_viewNormal=normalMatrix*nor;v_viewPosition=-mvPosition.xyz;
#ifdef USE_INSTANCING
float outlineId=instanceColorBase+a_componentId;
#else
float outlineId=u_baseColorId+a_componentId;
#endif
float idHigh=floor(outlineId/256.0);float idLow=outlineId-idHigh*256.0;v_outlineRG=vec2(idLow,idHigh)/255.0;v_ao=Cd;}`,frag$2=`#define GLSLIFY 1
varying vec3 v_viewNormal;varying vec3 v_viewPosition;varying vec2 v_outlineRG;varying float v_ao;uniform float u_highlight;uniform float u_highlightRatio;void main(){float fresnel=max(0.0,dot(normalize(v_viewPosition),normalize(v_viewNormal)));float shade=fresnel*v_ao*v_ao;float packedB=0.5+shade*0.5;float highlight=u_highlight*u_highlightRatio;gl_FragColor=vec4(v_outlineRG,packedB,highlight);}`,outlineFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_resolution;uniform vec3 u_highlightColor;void main(){vec2 uv=v_uv;vec2 texelSize=1.0/u_resolution;vec4 color=texture2D(u_texture,uv);vec2 c_id=color.rg;float alphaBit=step(0.5,color.b);float shade=(color.b-0.5)*2.0;shade*=0.05;float highlight=color.a;vec2 r_id=texture2D(u_texture,uv+vec2(texelSize.x,0.0)).rg;vec2 d_id=texture2D(u_texture,uv+vec2(0.0,texelSize.y)).rg;float edge=0.0;if(any(greaterThan(abs(c_id-r_id),vec2(0.0001))))edge=1.0;if(any(greaterThan(abs(c_id-d_id),vec2(0.0001))))edge=1.0;vec3 finalColor=mix(vec3(shade),u_highlightColor*(1.0-shade),highlight);finalColor=clamp(finalColor+edge,0.0,1.0);float alpha=clamp(alphaBit+edge,0.0,1.0);gl_FragColor.rgb=finalColor;gl_FragColor.a=alpha;}`,engineOutlinePlaneFrag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_resolution;uniform vec3 u_bgColor;uniform float u_activeRatio;void main(){vec2 uv=v_uv;vec2 texelSize=1.0/u_resolution;vec4 color=texture2D(u_texture,uv);float alpha=color.a;gl_FragColor=vec4(u_bgColor+color.rgb,u_activeRatio*alpha);}`;class Route{constructor(e){this.path=e,this.target=null,this.title="",this.dom=null,this.metadata=null,this.hasContentPreloaded=!1,this.content={}}setDocument(e){const t=i=>e.querySelector(i)?.getAttribute("content")??null;this.metadata={canonical:e.querySelector('link[rel="canonical"]')?.getAttribute("href")??null,description:t('meta[name="description"]'),robots:t('meta[name="robots"]'),openGraph:{title:t('meta[property="og:title"]'),description:t('meta[property="og:description"]'),image:t('meta[property="og:image"]'),url:t('meta[property="og:url"]'),siteName:t('meta[property="og:site_name"]'),type:t('meta[property="og:type"]')},twitter:{card:t('meta[name="twitter:card"]'),title:t('meta[name="twitter:title"]'),description:t('meta[name="twitter:description"]'),image:t('meta[name="twitter:image"]')},structuredData:[...e.querySelectorAll('script[type="application/ld+json"][data-route-structured-data]')].map(i=>i.textContent).filter(Boolean)}}setTitleDom(e,t,i){this.title=e,this.dom=t,i&&this.setDocument(i)}setTarget(e){let t=null;for(let i=0;i<e.length;i++){let r=e[i];if(r.regExp.test(this.path)){t=r;break}}t||console.error("route not found for path: "+this.path),this.target=t.target}}let loc=window.location,ORIGIN=window.location.origin,URL_PREFIX_REGEX=new RegExp("^"+ORIGIN.replace(/\//g,"\\/"));class RouteManager{routes={};matchList=[];currPath=null;_pendingPath=null;queryStr;onRouteChanged=new MinSignal$2;get currRoute(){return this.routes[this.currPath]}init(){let e=this.parseUrl();this.queryStr=e.query,window.addEventListener("popstate",this._onStatePop.bind(this)),this.setUrl()}addPath(e,t){this.matchList.push({regExp:e instanceof RegExp?e:new RegExp("^"+e+"$"),target:t})}_createRoute(e){let t=this.routes[e]=new Route(e);return t.setTarget(this.matchList),t}_fetchHtml(e){const t=this.routes[e];if(t?.dom){this._onDomReady(t);return}if(t?.fetching)return;const i=t||this._createRoute(e);i.fetching=!0;const r=new AbortController,a=setTimeout(()=>r.abort(),1e4);fetch("/"+e,{signal:r.signal}).then(o=>{if(!o.ok)throw new Error("Page request failed");return o.text()}).then(o=>{if(!new DOMParser().parseFromString(o,"text/html").querySelector(".page"))throw new Error("Missing page content");this._initDom(i,o)}).catch(()=>{delete this.routes[e],this._pendingPath===e&&location.assign(location.href)}).finally(()=>{clearTimeout(a),i.fetching=!1})}_initDom(e,t){if(!t)e.setTitleDom(document.title,document.querySelector(".page"),document),this._attachEvents(document.documentElement);else{const i=new DOMParser().parseFromString(t,"text/html");e.setTitleDom(i.title,i.querySelector(".page"),i),this._attachEvents(e.dom)}this._onDomReady(e)}applyDocumentMetadata(e){if(!e?.metadata)return;const t=(a,o,s)=>{let l=document.head.querySelector(a);if(s===null){l?.remove();return}l||(l=document.createElement("meta"),Object.entries(o).forEach(([c,d])=>l.setAttribute(c,d)),document.head.appendChild(l)),l.setAttribute("content",s)},i=(a,o,s)=>{let l=document.head.querySelector(a);if(s===null){l?.remove();return}l||(l=document.createElement("link"),Object.entries(o).forEach(([c,d])=>l.setAttribute(c,d)),document.head.appendChild(l)),l.setAttribute("href",s)},{metadata:r}=e;i('link[rel="canonical"]',{rel:"canonical"},r.canonical),t('meta[name="description"]',{name:"description"},r.description),t('meta[name="robots"]',{name:"robots"},r.robots),t('meta[property="og:title"]',{property:"og:title"},r.openGraph.title),t('meta[property="og:description"]',{property:"og:description"},r.openGraph.description),t('meta[property="og:image"]',{property:"og:image"},r.openGraph.image),t('meta[property="og:url"]',{property:"og:url"},r.openGraph.url),t('meta[property="og:site_name"]',{property:"og:site_name"},r.openGraph.siteName),t('meta[property="og:type"]',{property:"og:type"},r.openGraph.type),t('meta[name="twitter:card"]',{name:"twitter:card"},r.twitter.card),t('meta[name="twitter:title"]',{name:"twitter:title"},r.twitter.title),t('meta[name="twitter:description"]',{name:"twitter:description"},r.twitter.description),t('meta[name="twitter:image"]',{name:"twitter:image"},r.twitter.image),document.head.querySelectorAll('script[type="application/ld+json"][data-route-structured-data]').forEach(a=>a.remove()),r.structuredData.forEach(a=>{const o=document.createElement("script");o.type="application/ld+json",o.dataset.routeStructuredData="",o.textContent=a,document.head.appendChild(o)})}_attachEvents(e){let t=e.querySelectorAll("a");for(let i=0,r=t.length;i<r;i++){let a=t[i];if(!a.hasAttribute("data-native-navigation")&&!a.__hasClickParsed){a.__hasClickParsed=!0;let o=a.href.indexOf(window.location.origin)===0||a.href.indexOf("https://")!==0&&a.href.indexOf("http://")!==0||a.href.indexOf("/")===0;o=o&&!a.href.includes("mailto:")&&!a.href.match(/\.[\w\d]+$/g),o&&(a.addEventListener("mouseenter",s=>{this.preFetch(this.parseUrl(a.href).path)}),a.addEventListener("click",s=>{const l=s.metaKey||s.ctrlKey||s.shiftKey||s.altKey,c=a.target&&a.target!=="_self";s.defaultPrevented||s.button!==0||l||c||a.hasAttribute("download")||(a._onClick&&a._onClick(s),s.preventDefault(),this.setUrl(a.href))}))}}}_onDomReady(e){this._pendingPath==e.path&&(this._pendingPath=null,this.onRouteChanged.dispatch(e))}parseUrl(e=loc.href){let t=e.replace(URL_PREFIX_REGEX,""),i=t.split("#"),r=i[1];i=i[0].split("?");let a=i[1];return t=this.parsePath(i[0]),{path:t,query:a,hash:r}}parsePath(e){return e=e.replace(/^\/|\/$/g,""),e}setUrl(e=loc.href){let t=this.parseUrl(e);this.setPath(t.path,t.query,t.hash)}setPath(e,t,i){e=this.parsePath(e),t=this.mergeQueryStr(this.queryStr,t),i=i,e!==this.currPath?(history.pushState(null,null,(e||"/")+(t?"?"+t:"")+(i?"#"+i:"")),this._onStatePop()):i&&scrollManager.scrollTo(i)}mergeQueryStr(e,t){let i=Object.assign(settings.parseQuery(e?"?"+e:""),settings.parseQuery(t?"?"+t:"")),r="";for(let a in i)r+=a+"="+i[a]+"&";return r?r.slice(0,-1):""}preFetch(e){e=this.parsePath(e),this._fetchHtml(e)}_onStatePop(e){if(document.documentElement.classList.contains("is-static-fallback")){location.reload();return}e&&e.preventDefault();let t=this.parseUrl().path;t!==this.currPath&&(this.currPath=t,this._pendingPath=t,properties.hasInitialized?this._fetchHtml(t):this._initDom(this._createRoute(t)))}}const routeManager=new RouteManager;let _nodes={},_animationTargetList=[],PATHS=["JDM_part_01","JDM_part_02","JDM_part_03","JDM_part_05","JDM_part_06/JDM_part_06_a","JDM_part_06/JDM_part_06_b","JDM_part_07","JDM_part_08","JDM_part_09","JDM_part_10","JDM_part_11"],NEED_HIGHLIGHT=["JDM_part_03","JDM_part_06_b","JDM_part_08","JDM_part_10","JDM_part_11"],ROTATION_SPEEDS=[-.2,1,.3,-.2,.1,1,1,1,1,1,1],colorIndex=1,_animationPositions,_animationOrients,_v0$2=new Vector3,_vY=new Vector3(0,1,0),_q0$1=new Quaternion,_rotationActiveRatio=0,_sharedUniforms={u_highlightRatio:{value:0}};class Engine{container=new Object3D;mesh;partCount=0;scene=new Object3D;subContainer=new Object3D;animation=0;isVisible=!1;rt=null;outlineRt=null;ssMesh=null;ssMaterial=null;activeRatio=0;pathBasedRatio=1;preInit(){this.scene.add(this.subContainer),this.rt=fboHelper.createRenderTarget(1,1,!1,!1),this.rt.depthBuffer=!0,this.outlineRt=fboHelper.createRenderTarget(1,1,!1,!1);for(let e=0,t=-1;e<PATHS.length;e++){let i=PATHS[e],r=i,a=this.subContainer;if(i.includes("/")){let o=i.split("/")[0];_nodes[o]?a=_nodes[o]:(t++,a=new Object3D,a.userData.id=o,this.subContainer.add(a),_nodes[a.userData.id]=a),r=i.split("/")[1]}else t++;properties.loader.add(settings.MODEL_PATH+r+".buf",{onLoad:this._onModelLoad.bind(this,r,a,t)})}properties.loader.add(settings.MODEL_PATH+"ENGINE_ANIMATION.buf",{onLoad:this._onAnimationLoad.bind(this)}),this.outlineMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_highlightColor:{value:new Color(properties.globalColors.primary.hex)}},fragmentShader:outlineFrag,transparent:!0}),this.ssMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_bgColor:{value:new Color("#000000")},u_activeRatio:{value:0}},fragmentShader:engineOutlinePlaneFrag,depthWrite:!1,depthTest:!1,transparent:!0,blending:CustomBlending,blendSrc:SrcAlphaFactor,blendDst:OneMinusSrcAlphaFactor,blendEquation:AddEquation,blendSrcAlpha:SrcAlphaFactor,blendDstAlpha:OneMinusSrcAlphaFactor,blendEquationAlpha:AddEquation}),this.ssMesh=new Mesh(fboHelper.triGeom,this.ssMaterial),this.ssMesh.frustumCulled=!1,this.ssMesh.renderOrder=300,this.container.add(this.ssMesh)}_onAnimationLoad(e){_animationPositions=e.attributes.position.array,_animationOrients=e.attributes.orient.array;let t=new Matrix4;this.subContainer.position.fromArray(_animationPositions,0),this.subContainer.quaternion.fromArray(_animationOrients,0),t.compose(this.subContainer.position,this.subContainer.quaternion,_v0$2.set(1,1,1)),t.invert(),t.decompose(this.subContainer.position,this.subContainer.quaternion,_v0$2)}_assignComponentIds(e,t={}){const{normalAngleThreshold:i=MathUtils.degToRad(30),positionEpsilon:r=1e-4,degenerateAreaThreshold:a=1e-8}=t,o=e.index?e.toNonIndexed():e,s=o.attributes.position.array,l=o.attributes.position.count,c=l/3,d=1/r,f=C=>{const I=Math.round(s[C*3]*d),N=Math.round(s[C*3+1]*d),K=Math.round(s[C*3+2]*d);return`${I}|${N}|${K}`},u=new Float32Array(c*3),h=new Uint8Array(c),_=Math.cos(i),v=new Vector3,m=new Vector3,p=new Vector3,S=new Vector3,M=new Vector3,y=new Vector3;for(let C=0;C<c;C++){v.fromArray(s,C*3*3),m.fromArray(s,(C*3+1)*3),p.fromArray(s,(C*3+2)*3),S.subVectors(m,v),M.subVectors(p,v),y.crossVectors(S,M);const I=y.length();I<a?(h[C]=1,y.set(0,0,1)):y.divideScalar(I),u[C*3]=y.x,u[C*3+1]=y.y,u[C*3+2]=y.z}const w=new Map,A=(C,I,N)=>{const K=C<I?`${C}#${I}`:`${I}#${C}`;let q=w.get(K);q||(q=[],w.set(K,q)),q.push(N)};for(let C=0;C<c;C++){const I=f(C*3),N=f(C*3+1),K=f(C*3+2);A(I,N,C),A(N,K,C),A(K,I,C)}const R=new Int32Array(c);for(let C=0;C<c;C++)R[C]=C;const x=C=>{for(;R[C]!==C;)R[C]=R[R[C]],C=R[C];return C},T=(C,I)=>{const N=x(C),K=x(I);N!==K&&(R[N]=K)},z=(C,I)=>u[C*3]*u[I*3]+u[C*3+1]*u[I*3+1]+u[C*3+2]*u[I*3+2];for(const C of w.values())for(let I=0;I<C.length;I++)for(let N=I+1;N<C.length;N++){const K=C[I],q=C[N];(h[K]===1||h[q]===1||z(K,q)>=_)&&T(K,q)}const P=new Map,B=new Int32Array(c);let F=0;for(let C=0;C<c;C++){const I=x(C);let N=P.get(I);N===void 0&&(N=F++,P.set(I,N)),B[C]=N}const V=new Uint16Array(l);for(let C=0;C<c;C++){const I=B[C];V[C*3]=I,V[C*3+1]=I,V[C*3+2]=I}return o.setAttribute("a_componentId",new BufferAttribute(V,1)),{geometry:o,componentCount:F}}_onModelLoad(e,t,i,r){const{geometry:a,componentCount:o}=this._assignComponentIds(r,{normalAngleThreshold:MathUtils.degToRad(45)});r=a;const s=new ShaderMaterial({uniforms:{u_baseColorId:{value:colorIndex},u_highlight:{value:NEED_HIGHLIGHT.includes(e)?1:0},u_time:{value:0},u_rotationY:{value:0},u_highlightRatio:_sharedUniforms.u_highlightRatio},vertexShader:vert$2,fragmentShader:frag$2});if(e==="JDM_part_03"||e==="JDM_part_06_b"){let c=1,d=1,f=0,u=null,h=0;e==="JDM_part_03"?(c=14,d=1,f=-.229758,u=new Vector3(.464727,.0344088,484288e-13),h=0,s.defines.IS_PART3=0,s.uniforms.u_partAnimation={value:0}):e==="JDM_part_06_b"&&(c=12,d=9,f=-.226779,u=new Vector3(.232854,.0602152,333328e-9),h=.0215043),s.defines.USE_INSTANCING=1,s.uniforms.u_radialCount={value:c},s.uniforms.u_partCount={value:d},s.uniforms.u_baseAngle={value:f},s.uniforms.u_baseOffset={value:u},s.uniforms.u_partOffset={value:h};let _=new InstancedBufferGeometry;for(let p in r.attributes)_.setAttribute(p,r.attributes[p]);_.setIndex(r.index);const v=c*d;_.setAttribute("instanceId",new InstancedBufferAttribute(new Uint8Array(Array.from(Array(v).keys())),1));const m=new Uint16Array(v);for(let p=0;p<v;p++)m[p]=colorIndex+p*o;_.setAttribute("instanceColorBase",new InstancedBufferAttribute(m,1)),colorIndex+=o*v,r=_}else colorIndex+=o;(settings.IS_DEV||settings.LOG)&&console.log(`[Engine] ${e}: ${o} components, colorIndex now ${colorIndex}`);let l=new Mesh(r,s);l.userData.id=e,_nodes[e]=l,t.add(l),_animationTargetList[i]=t===this.subContainer?l:t}init(){}resize(e,t){this.rt.setSize(e,t),this.outlineRt.setSize(e,t)}preUpdate(e){}update(e){if(!properties.hasInitialized)return;const t=routeManager.currPath==="";this.pathBasedRatio=math.saturate(this.pathBasedRatio+(t&&pagesManager.isIdle?1:-1)*e*3.33);const i=this.activeRatio*this.pathBasedRatio;this.isVisible=i>0;let r=math.fit(this.animation,0,1,0,20);r=math.fit(this.animation,1,2,r,40),r=math.fit(this.animation,4,5,r,60);let a=Math.floor(r),o=Math.ceil(r),s=r-a;_rotationActiveRatio=math.mix(_rotationActiveRatio,this.animation>1.5?1:0,1-Math.exp(-e*10));for(let c=0,d=0,f=0,u=_animationTargetList.length;c<u;c++,d+=3,f+=4){let h=_animationTargetList[c];h.position.fromArray(_animationPositions,a*u*3+d).lerp(_v0$2.fromArray(_animationPositions,o*u*3+d),s),h.quaternion.fromArray(_animationOrients,a*u*4+f).slerp(_q0$1.fromArray(_animationOrients,o*u*4+f),s),h.userData.angle=(h.userData.angle||0)+ROTATION_SPEEDS[c]*_rotationActiveRatio*(.01+scrollManager.scrollViewDelta*5),_q0$1.setFromAxisAngle(_vY,h.userData.angle),h.quaternion.multiply(_q0$1)}this.subContainer.visible=this.isVisible,this.subContainer.scale.setScalar(.85);let l=math.fit(this.animation,2,3,0,1);if(_nodes.JDM_part_03.material.uniforms.u_partAnimation.value=l,_nodes.JDM_part_03.visible=l>.01,_sharedUniforms.u_highlightRatio.value=math.fit(this.animation,3,4,0,1),this.isVisible){const c=fboHelper.getColorState(),d=fboHelper.renderer.getRenderTarget();fboHelper.renderer.setClearColor("#000000",0),fboHelper.renderer.autoClear=!0,fboHelper.renderMesh(this.scene,this.rt,properties.camera),this.outlineMaterial.uniforms.u_highlightColor.value.set(properties.globalColors.primary.hex),this.outlineMaterial.uniforms.u_highlightColor.value.convertLinearToSRGB(),this.outlineMaterial.uniforms.u_texture.value=this.rt.texture,fboHelper.render(this.outlineMaterial,this.outlineRt),fboHelper.renderer.setRenderTarget(d),fboHelper.setColorState(c)}this.ssMesh.material.uniforms.u_texture.value=this.outlineRt.texture,this.ssMesh.material.uniforms.u_bgColor.value.copy(properties.bgColor),this.ssMesh.material.uniforms.u_bgColor.value.convertLinearToSRGB(),this.ssMesh.material.uniforms.u_activeRatio.value=i}}const engine=new Engine;class Simple1DNoise{static MAX_VERTICES=256;static MAX_VERTICES_MASK=Simple1DNoise.MAX_VERTICES-1;_scale=1;_amplitude=1;_r=[];constructor(){for(let e=0;e<Simple1DNoise.MAX_VERTICES;++e)this._r.push(Math.random()-.5)}getVal(e){const t=e*this._scale,i=Math.floor(t),r=t-i,a=r*r*(3-2*r),o=i&Simple1DNoise.MAX_VERTICES_MASK,s=o+1&Simple1DNoise.MAX_VERTICES_MASK;return math.mix(this._r[o],this._r[s],a)*this._amplitude}get amplitude(){return this._amplitude}set amplitude(e){this._amplitude=e}get scale(){return this._scale}set scale(e){this._scale=e}}const _v=new Vector3;class BrownianMotion{_position=new Vector3;_rotation=new Quaternion;_euler=new Euler;_scale=new Vector3(1,1,1);_matrix=new Matrix4;_enablePositionNoise=!0;_enableRotationNoise=!0;_autoMatrixUpdate=!0;_positionFrequency=.25;_rotationFrequency=.25;_positionAmplitude=.3;_rotationAmplitude=.003;_positionScale=new Vector3(1,1,1);_rotationScale=new Vector3(1,1,0);_positionFractalLevel=3;_rotationFractalLevel=3;_times=new Float32Array(6);_noise=new Simple1DNoise;static FBM_NORM=1/.75;constructor(){this.rehash()}rehash(){for(let e=0;e<6;e++)this._times[e]=Math.random()*-1e4}_fbm(e,t){let i=0,r=.5;for(let a=0;a<t;a++)i+=r*this._noise.getVal(e),e*=2,r*=.5;return i}update(e){const t=e===void 0?16.666666666666668:e;if(this._enablePositionNoise){for(let i=0;i<3;i++)this._times[i]+=this._positionFrequency*t;_v.set(this._fbm(this._times[0],this._positionFractalLevel),this._fbm(this._times[1],this._positionFractalLevel),this._fbm(this._times[2],this._positionFractalLevel)),_v.multiply(this._positionScale),_v.multiplyScalar(this._positionAmplitude*BrownianMotion.FBM_NORM),this._position.copy(_v)}if(this._enableRotationNoise){for(let i=0;i<3;i++)this._times[i+3]+=this._rotationFrequency*t;_v.set(this._fbm(this._times[3],this._rotationFractalLevel),this._fbm(this._times[4],this._rotationFractalLevel),this._fbm(this._times[5],this._rotationFractalLevel)),_v.multiply(this._rotationScale),_v.multiplyScalar(this._rotationAmplitude*BrownianMotion.FBM_NORM),this._euler.set(_v.x,_v.y,_v.z),this._rotation.setFromEuler(this._euler)}this._autoMatrixUpdate&&this._matrix.compose(this._position,this._rotation,this._scale)}get positionAmplitude(){return this._positionAmplitude}set positionAmplitude(e){this._positionAmplitude=e}get positionFrequency(){return this._positionFrequency}set positionFrequency(e){this._positionFrequency=e}get rotationAmplitude(){return this._rotationAmplitude}set rotationAmplitude(e){this._rotationAmplitude=e}get rotationFrequency(){return this._rotationFrequency}set rotationFrequency(e){this._rotationFrequency=e}get matrix(){return this._matrix}set matrix(e){this._matrix=e}}class DeviceOrientationControls{object=null;enabled=!0;hasValue=!1;deviceOrientation={};screenOrientation=0;alphaOffset=0;zee=new Vector3(0,0,1);euler=new Euler;q0=new Quaternion;q1=new Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5));_onBoundDeviceOrientationChangeEvent;_onBoundScreenOrientationChangeEvent;granted=!1;constructor(e){this.object=e,this.object.rotation.reorder("YXZ"),this._onBoundDeviceOrientationChangeEvent=this._onDeviceOrientationChangeEvent.bind(this),this._onBoundScreenOrientationChangeEvent=this._onScreenOrientationChangeEvent.bind(this),this.connect()}_onDeviceOrientationChangeEvent(e){this.deviceOrientation=e}_onScreenOrientationChangeEvent(){this.screenOrientation=window.orientation||0}setObjectQuaternion(e,t,i,r,a){this.euler.set(i,t,-r,"YXZ"),e.setFromEuler(this.euler),e.multiply(this.q1),e.multiply(this.q0.setFromAxisAngle(this.zee,-a))}connect(){this._onBoundScreenOrientationChangeEvent(),window.DeviceOrientationEvent!==void 0&&typeof window.DeviceOrientationEvent.requestPermission=="function"?window.DeviceOrientationEvent.requestPermission().then(e=>{e=="granted"&&(window.addEventListener("orientationchange",this._onBoundScreenOrientationChangeEvent,!1),window.addEventListener("deviceorientation",this._onBoundDeviceOrientationChangeEvent,!1),this.granted=!0)}).catch(function(e){}):(window.addEventListener("orientationchange",this._onBoundScreenOrientationChangeEvent,!1),window.addEventListener("deviceorientation",this._onBoundDeviceOrientationChangeEvent,!1),this.granted=!0),this.enabled=!0}disconnect(){window.removeEventListener("orientationchange",this._onBoundScreenOrientationChangeEvent,!1),window.removeEventListener("deviceorientation",this._onBoundDeviceOrientationChangeEvent,!1),this.enabled=!1}update(){if(this.enabled===!1)return;let e=this.deviceOrientation;if(e){let t=e.alpha?MathUtils.degToRad(e.alpha)+this.alphaOffset:0,i=e.beta?MathUtils.degToRad(e.beta):0,r=e.gamma?MathUtils.degToRad(e.gamma):0,a=this.screenOrientation?MathUtils.degToRad(this.screenOrientation):0;this.setObjectQuaternion(this.object.quaternion,t,i,r,a),this.hasValue=this.hasValue||e.alpha&&e.beta&&e.gamma}}dispose(){this.disconnect()}}let _scissorTest=!1,_scissor=new Vector4,_deviceOrientationControls,_baseDeviceControlQuaternion,_targetDeviceControlQuaternion,_deviceOrientationCamera,_camera,_v0$1,_e,_q,_m;const DEFAULT_POSITION=new Vector3(0,0,5),DEFAULT_LOOKAT_POSITION=new Vector3(0,0,0);class CameraControls{viewOffsetX=0;viewOffsetY=0;needsClipping=!1;clipScissor=new Vector4;position=new Vector3(0,1,2);quaternion=new Quaternion(0,0,0,1);fov=60;zoom=1;near=.01;far=10;cameraLookX=0;cameraLookY=0;cameraDistance=.01;cameraLookStrength=.05;cameraLookEaseFactor=5;cameraShakePositionStrength=.5;cameraShakePositionSpeed=.15;cameraShakeRotationStrength=.003;cameraShakeRotationSpeed=.3;deviceQuaterion=new Quaternion(0,0,0,1);deviceEuler=new Euler(0,0,0);deviceVirtualMouseXY=new Vector2(0,0);deviceVirtualMouseXYPrev=new Vector2(0,0);isDeviceReady=!1;preInit(e){if(_v0$1=new Vector3,_q=new Quaternion,_e=new Euler,_m=new Matrix4,_camera=properties.camera,_camera.position.copy(DEFAULT_POSITION),new BrownianMotion,browser.isMobile){_deviceOrientationCamera=new Camera,_baseDeviceControlQuaternion=new Quaternion,_targetDeviceControlQuaternion=new Quaternion;let t=()=>{_deviceOrientationControls||(_deviceOrientationControls=new DeviceOrientationControls(_deviceOrientationCamera)),_deviceOrientationControls.granted||_deviceOrientationControls.connect()};browser.isIOS?(t(),properties.onFirstClicked.addOnce(t)):t()}}init(){}initClippingMesh(e){e._onBeforeRender=e.onBeforeRender,e._onAfterRender=e.onAfterRender,e.onBeforeRender=this._onBeforeRenderClip.bind(this,e),e.onAfterRender=this._onAfterRenderClip.bind(this,e)}_onBeforeRenderClip(e,t,i,r,a,o,s){e._onBeforeRender(t,i,r,a,o,s),e.needsClipping&&this.needsClipping&&(_scissorTest=t.getScissorTest(),t.getScissor(_scissor),t.setScissorTest(!0),t.setScissor(this.clipScissor))}_onAfterRenderClip(e,t,i,r,a,o,s){e.needsClipping&&this.needsClipping&&(t.setScissor(_scissor.x,_scissor.y,_scissor.width,_scissor.height),t.setScissorTest(_scissorTest)),e.needsClipping=!1,e._onAfterRender(t,i,r,a,o,s)}resize(e,t){}preUpdate(e){if(_m.setPosition(DEFAULT_POSITION),_m.lookAt(DEFAULT_POSITION,DEFAULT_LOOKAT_POSITION,_v0$1.set(0,1,0)),_m.decompose(this.position,this.quaternion,_v0$1),this.fov=60,this.cameraDistance=.005,this.zoom=1,this.near=.002,this.far=30,this.needsClipping=!1,this.viewOffsetX=0,this.viewOffsetY=0,browser.isMobile&&_deviceOrientationControls&&(_deviceOrientationControls.update(),_deviceOrientationControls.hasValue)){this.isDeviceReady||(this.isDeviceReady=!0,_targetDeviceControlQuaternion.copy(_deviceOrientationCamera.quaternion),_baseDeviceControlQuaternion.copy(_deviceOrientationCamera.quaternion)),_targetDeviceControlQuaternion.slerp(_deviceOrientationCamera.quaternion,1-Math.exp(-e*10)),_baseDeviceControlQuaternion.slerp(_targetDeviceControlQuaternion,1-Math.exp(-e*6)),this.deviceQuaterion.copy(_baseDeviceControlQuaternion).invert().multiply(_targetDeviceControlQuaternion),this.deviceEuler.setFromQuaternion(this.deviceQuaterion);let t=math.clamp(this.deviceEuler.y*5,-1,1),i=math.clamp(this.deviceEuler.x*5,-1,1);this.deviceVirtualMouseXYPrev.copy(this.deviceVirtualMouseXY),this.deviceVirtualMouseXY.set(t,i)}}update(e){let t=_camera;if(t.position.copy(this.position),t.quaternion.copy(this.quaternion),t.fov=this.fov,t.zoom=this.zoom,t.near=this.near,t.far=this.far,t.translateZ(this.cameraDistance*-1),this.isDeviceReady)this.cameraLookX=math.clamp(this.deviceEuler.x,-this.cameraLookStrength,this.cameraLookStrength),this.cameraLookY=math.clamp(this.deviceEuler.y,-this.cameraLookStrength,this.cameraLookStrength);else{let a=math.clamp(input.mouseXY.y,-1,1)*this.cameraLookStrength,o=math.clamp(-input.mouseXY.x,-1,1)*this.cameraLookStrength,s=1-Math.exp(-e*this.cameraLookEaseFactor);s=math.saturate(Math.max(Math.abs(scrollManager.scrollViewDelta)*10,s)),this.cameraLookX+=(a-this.cameraLookX)*s,this.cameraLookY+=(o-this.cameraLookY)*s}_e.set(this.cameraLookX,this.cameraLookY,0),_q.setFromEuler(_e),t.quaternion.multiply(_q),t.translateZ(this.cameraDistance),t.matrix.compose(t.position,t.quaternion,t.scale);let i=properties.viewportWidth,r=properties.viewportHeight;t.setViewOffset(i,r,-this.viewOffsetX*i,-this.viewOffsetY*r,i,r),t.updateProjectionMatrix(),t.updateMatrix(),t.updateMatrixWorld(!0),t.mvp.copy(t.projectionMatrix).multiply(t.matrixWorldInverse)}}const cameraControls=new CameraControls,_v0=new Vector3;new Vector3;const _q0=new Quaternion;class FrameAnimation{target;position;orient;scale;focal;frameCount=0;isUniformScale=!1;aperture=4;viewPixelWidth=1024;viewPixelHeight=512;preInit(e,t){this.target=e||new Object3D,properties.loader.add(t,{onLoad:this._onAnimationLoad.bind(this)})}_onAnimationLoad(e){const{focal:t,position:i,orient:r,scale:a}=e.attributes;this.positions=i?.array,this.orients=r?.array,this.scales=a?.array,this.focals=t?.array,this.frameCount=i?.count,a?.count&&(this.isUniformScale=a.itemSize===1)}getFovFromFocal(e){e=e;const t=this.viewPixelHeight*this.aperture/this.viewPixelWidth;return 2*Math.atan(t/2/e)*(180/Math.PI)}applyTransformByRatio(e){if(!this.frameCount)return;const t=e*(this.frameCount-1);this.applyTransform(t)}applyTransform(e){if(!this.frameCount)return;const t=this.frameCount-1;e=math.clamp(e,0,t);const i=Math.floor(e),r=Math.min(i+1,t),a=e-i;let o=this.target;this.positions&&o.position.fromArray(this.positions,i*3).lerp(_v0.fromArray(this.positions,r*3),a),this.orients&&o.quaternion.fromArray(this.orients,i*4).slerp(_q0.fromArray(this.orients,r*4),a),this.scales&&(this.isUniformScale?o.scale.setScalar(math.mix(this.scales[i],this.scales[r],a)):o.scale.fromArray(this.scales,i*3).lerp(_v0.fromArray(this.scales,r*3),a)),this.focals&&(o.fov=this.getFovFromFocal(math.mix(this.focals[i],this.focals[r],a)))}}const channelMixerFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec4 u_channelMixerR;uniform vec4 u_channelMixerG;uniform vec4 u_channelMixerB;uniform vec4 u_channelMixerA;uniform vec2 u_uvScale;varying vec2 v_uv;void main(){vec4 color=texture2D(u_texture,fract(v_uv*u_uvScale));gl_FragColor=vec4(dot(color,u_channelMixerR),dot(color,u_channelMixerG),dot(color,u_channelMixerB),dot(color,u_channelMixerA));}`,rgbmFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_maxRange;varying vec2 v_uv;void main(){vec4 value=texture2D(u_texture,v_uv);gl_FragColor=vec4(value.xyz*value.w*u_maxRange,1.0);}`;class TextureHelper{blackTexture;whiteTexture;transparentTexture;channelMixerMaterial;rgbmMaterial;init(){this.blackTexture=this._createPixelTexture([0,0,0,255]),this.whiteTexture=this._createPixelTexture([255,255,255,255]),this.transparentTexture=this._createPixelTexture([0,0,0,0])}_createPixelTexture(e){return fboHelper.createDataTexture(new Uint8Array(e),1,1,!1,!0)}mixChannels(e,t,i=-1,r=-1,a=-1,o=-1,s=1,l=1){this.channelMixerMaterial||(this.channelMixerMaterial=new RawShaderMaterial({uniforms:{u_texture:{value:null},u_channelMixerR:{value:new Vector4},u_channelMixerG:{value:new Vector4},u_channelMixerB:{value:new Vector4},u_channelMixerA:{value:new Vector4},u_uvScale:{value:new Vector2}},vertexShader:fboHelper.vertexShader,fragmentShader:fboHelper.precisionPrefix+channelMixerFrag,blending:CustomBlending,blendEquation:AddEquation,blendDst:OneFactor,blendSrc:OneFactor,blendEquationAlpha:AddEquation,blendDstAlpha:OneFactor,blendSrcAlpha:OneFactor}));let c=this.channelMixerMaterial.uniforms;c.u_texture.value=e,c.u_channelMixerR.value.set(+(i%4==0),+(i%4==1),+(i%4==2),+(i%4==3)).multiplyScalar(i<0?0:1),c.u_channelMixerG.value.set(+(r%4==0),+(r%4==1),+(r%4==2),+(r%4==3)).multiplyScalar(r<0?0:1),c.u_channelMixerB.value.set(+(a%4==0),+(a%4==1),+(a%4==2),+(a%4==3)).multiplyScalar(a<0?0:1),c.u_channelMixerA.value.set(+(o%4==0),+(o%4==1),+(o%4==2),+(o%4==3)).multiplyScalar(o<0?0:1),c.u_uvScale.value.set(s,l);let d=fboHelper.getColorState();fboHelper.renderer.autoClear=!1,fboHelper.render(this.channelMixerMaterial,t),fboHelper.setColorState(d)}loadRGBMTexture(e,t){t=Object.assign({isAdd:!0,minFilter:LinearFilter,callback:()=>{},anisotropy:0,rt:null,dispose:!0,wrapS:RepeatWrapping,wrapT:ClampToEdgeWrapping,maxRange:6},t);let i=fboHelper.createRenderTarget(1,1,!1,!0);return i.texture.minFilter=t.minFilter,i.texture.wrapS=t.wrapS,i.texture.wrapT=t.wrapT,this.rgbmMaterial||(this.rgbmMaterial=fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_maxRange:{value:6}},fragmentShader:rgbmFrag})),properties.loader[t.isAdd?"add":"load"](e,{type:"texture",minFilter:NearestFilter,magFilter:NearestFilter,onLoad:r=>{i.setSize(r.image.width,r.image.height),this.rgbmMaterial.uniforms.u_texture.value=r,this.rgbmMaterial.uniforms.u_maxRange.value=t.maxRange,fboHelper.render(this.rgbmMaterial,i),t.dispose&&r.dispose(),t.callback&&t.callback(i.texture)}}),i.texture}loadRGBATexture(e,t,i={}){i=Object.assign({isAdd:!0,minFilter:LinearFilter,callback:()=>{},anisotropy:0,rt:null,dispose:!0,uvScaleX:1,uvScaleY:1,uvScaleXAlpha:1,uvScaleYAlpha:1,wrapS:ClampToEdgeWrapping,wrapT:ClampToEdgeWrapping,colorSpace:NoColorSpace,alphaChannelIndex:0,isAlphaGreyScale:!0},i);let r=0,a=i.isAdd?"add":"get",o={},s=fboHelper.createRenderTarget(1,1);s.texture.minFilter=i.minFilter,s.texture.generateMipmaps=!1,s.texture.wrapS=i.wrapS,s.texture.wrapT=i.wrapT,s.texture.colorSpace=i.colorSpace;let l=()=>{if(r++,r==2){switch(s.setSize(o.rgb.image.width,o.rgb.image.height),fboHelper.copy(this.transparentTexture,s),this.mixChannels(o.rgb,s,0,1,2,-1,i.uvScaleX,i.uvScaleY),s.texture.minFilter){case NearestMipMapNearestFilter:case NearestMipMapLinearFilter:case LinearMipMapNearestFilter:case LinearMipMapLinearFilter:s.texture.generateMipmaps=!0,s.texture.anisotropy=i.anisotropy||properties.renderer.capabilities.getMaxAnisotropy();break;default:s.texture.generateMipmaps=!1}this.mixChannels(o.alpha,s,-1,-1,-1,i.alphaChannelIndex,i.uvScaleXAlpha,i.uvScaleYAlpha),i.dispose&&(o.rgb.dispose(),o.alpha.dispose()),i.isAdd?setTimeout(i.callback,4):i.callback()}};return properties.loader[a](e,{type:"texture",minFilter:LinearFilter,autoMobile:i.autoMobile,colorSpace:i.colorSpace,channel:i.colorSpace===SRGBColorSpace?4:3,onLoad:c=>{o.rgb=c,l()}}),properties.loader[a](t,{type:"texture",minFilter:LinearFilter,autoMobile:i.autoMobile,channel:i.isAlphaGreyScale?1:3,onLoad:c=>{o.alpha=c,l()}}),s.texture}}const textureHelper=new TextureHelper,heroTextures={CLOUD_A:{texture:null,url:"hero/CLOUD_A.webp",width:1400,height:925,mobileWidth:700,mobileHeight:463,alphaUrl:"hero/CLOUD_ALPHAS.webp",alphaChannelIndex:0,isAlphaGreyScale:!1},CLOUD_B:{texture:null,url:"hero/CLOUD_B.webp",width:1280,height:792,mobileWidth:640,mobileHeight:396,alphaUrl:"hero/CLOUD_ALPHAS.webp",alphaChannelIndex:1,isAlphaGreyScale:!1},CLOUD_C:{texture:null,url:"hero/CLOUD_C.webp",width:2048,height:1004,mobileWidth:1024,mobileHeight:502,alphaUrl:"hero/CLOUD_ALPHAS.webp",alphaChannelIndex:2,isAlphaGreyScale:!1},BASE:{texture:null,url:"hero/BASE.webp",width:3296,height:1648,mobileWidth:1648,mobileHeight:1648,wrapT:!0},TERRAIN_BG:{texture:null,url:"hero/TERRAIN_BG.webp",width:3646,height:1648,mobileWidth:2e3,mobileHeight:1648},TERRAIN_FG:{texture:null,url:"hero/TERRAIN_FG.webp",width:3646,height:1075,mobileWidth:2e3,mobileHeight:1075,alphaUrl:"hero/TERRAIN_FG_ALPHA.webp",alphaChannelIndex:0,isAlphaGreyScale:!0}},itemVert=`#define GLSLIFY 1
uniform vec2 u_uvScale;uniform float u_opacity;
#ifdef IS_BASE
uniform float u_offsetY;varying float v_oUvT;
#endif
varying vec2 v_uv;void main(){v_uv=(uv-.5)*u_uvScale+.5;
#ifdef IS_BASE
v_oUvT=v_uv.y;v_uv.y-=u_offsetY;
#endif
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,itemFrag=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_opacity;
#ifdef IS_BASE
uniform float u_fadeRatio;uniform float u_fadeScreen;uniform float u_yOffsetRatio;uniform vec3 u_skyColor1;uniform vec3 u_skyColor2;varying float v_oUvT;
#endif
uniform float u_bgRatio;uniform vec3 u_bgColor;
#include <linearstep>
varying vec2 v_uv;void main(){vec4 color=texture2D(u_texture,v_uv);gl_FragColor=vec4(color.rgb,color.a*u_opacity);
#ifdef IS_BASE
float alpha=linearstep(u_fadeScreen,0.,u_fadeRatio*(1.+u_fadeScreen)-v_oUvT);gl_FragColor.a*=alpha;gl_FragColor.rgb=mix(gl_FragColor.rgb,mix(u_skyColor1,u_skyColor2,u_fadeRatio),u_yOffsetRatio);
#endif
gl_FragColor=sRGBTransferOETF(gl_FragColor);gl_FragColor.rgb=mix(gl_FragColor.rgb,u_bgColor,u_bgRatio);}`;/*!
 * SplitText 3.14.2
 * https://gsap.com
 *
 * @license Copyright 2025, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle
 */let gsap,_fonts,_splitProp=typeof Symbol=="function"?Symbol():"_split",_coreInitted,_initIfNecessary=()=>_coreInitted||SplitText.register(window.gsap),_charSegmenter=typeof Intl<"u"&&"Segmenter"in Intl?new Intl.Segmenter:0,_toArray=n=>typeof n=="string"?_toArray(document.querySelectorAll(n)):"length"in n?Array.from(n).reduce((e,t)=>(typeof t=="string"?e.push(..._toArray(t)):e.push(t),e),[]):[n],_elements=n=>_toArray(n).filter(e=>e instanceof HTMLElement),_emptyArray=[],_context=function(){},_defaultContext={add:n=>n()},_spacesRegEx=/\s+/g,_emojiSafeRegEx=new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.","gu"),_emptyBounds={left:0,top:0,width:0,height:0},_findNextValidBounds=(n,e)=>{for(;++e<n.length&&n[e]===_emptyBounds;);return n[e]||_emptyBounds},_revertOriginal=({element:n,html:e,ariaL:t,ariaH:i})=>{n.innerHTML=e,t?n.setAttribute("aria-label",t):n.removeAttribute("aria-label"),i?n.setAttribute("aria-hidden",i):n.removeAttribute("aria-hidden")},_stretchToFitSpecialChars=(n,e)=>{if(e){let t=new Set(n.join("").match(e)||_emptyArray),i=n.length,r,a,o,s;if(t.size)for(;--i>-1;){a=n[i];for(o of t)if(o.startsWith(a)&&o.length>a.length){for(r=0,s=a;o.startsWith(s+=n[i+ ++r])&&s.length<o.length;);if(r&&s.length===o.length){n[i]=o,n.splice(i+1,r);break}}}}return n},_disallowInline=n=>window.getComputedStyle(n).display==="inline"&&(n.style.display="inline-block"),_insertNodeBefore=(n,e,t)=>e.insertBefore(typeof n=="string"?document.createTextNode(n):n,t),_getWrapper=(n,e,t)=>{let i=e[n+"sClass"]||"",{tag:r="div",aria:a="auto",propIndex:o=!1}=e,s=n==="line"?"block":"inline-block",l=i.indexOf("++")>-1,c=d=>{let f=document.createElement(r),u=t.length+1;return i&&(f.className=i+(l?" "+i+u:"")),o&&f.style.setProperty("--"+n,u+""),a!=="none"&&f.setAttribute("aria-hidden","true"),r!=="span"&&(f.style.position="relative",f.style.display=s),f.textContent=d,t.push(f),f};return l&&(i=i.replace("++","")),c.collection=t,c},_getLineWrapper=(n,e,t,i)=>{let r=_getWrapper("line",t,i),a=window.getComputedStyle(n).textAlign||"left";return(o,s)=>{let l=r("");for(l.style.textAlign=a,n.insertBefore(l,e[o]);o<s;o++)l.appendChild(e[o]);l.normalize()}},_splitWordsAndCharsRecursively=(n,e,t,i,r,a,o,s,l,c)=>{var d;let f=Array.from(n.childNodes),u=0,{wordDelimiter:h,reduceWhiteSpace:_=!0,prepareText:v}=e,m=n.getBoundingClientRect(),p=m,S=!_&&window.getComputedStyle(n).whiteSpace.substring(0,3)==="pre",M=0,y=t.collection,w,A,R,x,T,z,P,B,F,V,C,I,N,K,q,J,ce,oe;for(typeof h=="object"?(R=h.delimiter||h,A=h.replaceWith||""):A=h===""?"":h||" ",w=A!==" ";u<f.length;u++)if(x=f[u],x.nodeType===3){for(q=x.textContent||"",_?q=q.replace(_spacesRegEx," "):S&&(q=q.replace(/\n/g,A+`
`)),v&&(q=v(q,n)),x.textContent=q,T=A||R?q.split(R||A):q.match(s)||_emptyArray,ce=T[T.length-1],B=w?ce.slice(-1)===" ":!ce,ce||T.pop(),p=m,P=w?T[0].charAt(0)===" ":!T[0],P&&_insertNodeBefore(" ",n,x),T[0]||T.shift(),_stretchToFitSpecialChars(T,l),a&&c||(x.textContent=""),F=1;F<=T.length;F++)if(J=T[F-1],!_&&S&&J.charAt(0)===`
`&&((d=x.previousSibling)==null||d.remove(),_insertNodeBefore(document.createElement("br"),n,x),J=J.slice(1)),!_&&J==="")_insertNodeBefore(A,n,x);else if(J===" ")n.insertBefore(document.createTextNode(" "),x);else{if(w&&J.charAt(0)===" "&&_insertNodeBefore(" ",n,x),M&&F===1&&!P&&y.indexOf(M.parentNode)>-1?(z=y[y.length-1],z.appendChild(document.createTextNode(i?"":J))):(z=t(i?"":J),_insertNodeBefore(z,n,x),M&&F===1&&!P&&z.insertBefore(M,z.firstChild)),i)for(C=_charSegmenter?_stretchToFitSpecialChars([..._charSegmenter.segment(J)].map(Ee=>Ee.segment),l):J.match(s)||_emptyArray,oe=0;oe<C.length;oe++)z.appendChild(C[oe]===" "?document.createTextNode(" "):i(C[oe]));if(a&&c){if(q=x.textContent=q.substring(J.length+1,q.length),V=z.getBoundingClientRect(),V.top>p.top&&V.left<=p.left){for(I=n.cloneNode(),N=n.childNodes[0];N&&N!==z;)K=N,N=N.nextSibling,I.appendChild(K);n.parentNode.insertBefore(I,n),r&&_disallowInline(I)}p=V}(F<T.length||B)&&_insertNodeBefore(F>=T.length?" ":w&&J.slice(-1)===" "?" "+A:A,n,x)}n.removeChild(x),M=0}else x.nodeType===1&&(o&&o.indexOf(x)>-1?(y.indexOf(x.previousSibling)>-1&&y[y.length-1].appendChild(x),M=x):(_splitWordsAndCharsRecursively(x,e,t,i,r,a,o,s,l,!0),M=0),r&&_disallowInline(x))};const _SplitText=class At{constructor(e,t){this.isSplit=!1,_initIfNecessary(),this.elements=_elements(e),this.chars=[],this.words=[],this.lines=[],this.masks=[],this.vars=t,this.elements.forEach(o=>{var s;t.overwrite!==!1&&((s=o[_splitProp])==null||s._data.orig.filter(({element:l})=>l===o).forEach(_revertOriginal)),o[_splitProp]=this}),this._split=()=>this.isSplit&&this.split(this.vars);let i=[],r,a=()=>{let o=i.length,s;for(;o--;){s=i[o];let l=s.element.offsetWidth;if(l!==s.width){s.width=l,this._split();return}}};this._data={orig:i,obs:typeof ResizeObserver<"u"&&new ResizeObserver(()=>{clearTimeout(r),r=setTimeout(a,200)})},_context(this),this.split(t)}split(e){return(this._ctx||_defaultContext).add(()=>{this.isSplit&&this.revert(),this.vars=e=e||this.vars||{};let{type:t="chars,words,lines",aria:i="auto",deepSlice:r=!0,smartWrap:a,onSplit:o,autoSplit:s=!1,specialChars:l,mask:c}=this.vars,d=t.indexOf("lines")>-1,f=t.indexOf("chars")>-1,u=t.indexOf("words")>-1,h=f&&!u&&!d,_=l&&("push"in l?new RegExp("(?:"+l.join("|")+")","gu"):l),v=_?new RegExp(_.source+"|"+_emojiSafeRegEx.source,"gu"):_emojiSafeRegEx,m=!!e.ignore&&_elements(e.ignore),{orig:p,animTime:S,obs:M}=this._data,y;(f||u||d)&&(this.elements.forEach((w,A)=>{p[A]={element:w,html:w.innerHTML,ariaL:w.getAttribute("aria-label"),ariaH:w.getAttribute("aria-hidden")},i==="auto"?w.setAttribute("aria-label",(w.textContent||"").trim()):i==="hidden"&&w.setAttribute("aria-hidden","true");let R=[],x=[],T=[],z=f?_getWrapper("char",e,R):null,P=_getWrapper("word",e,x),B,F,V,C;if(_splitWordsAndCharsRecursively(w,e,P,z,h,r&&(d||h),m,v,_,!1),d){let I=_toArray(w.childNodes),N=_getLineWrapper(w,I,e,T),K,q=[],J=0,ce=I.map(Ne=>Ne.nodeType===1?Ne.getBoundingClientRect():_emptyBounds),oe=_emptyBounds,Ee;for(B=0;B<I.length;B++)K=I[B],K.nodeType===1&&(K.nodeName==="BR"?((!B||I[B-1].nodeName!=="BR")&&(q.push(K),N(J,B+1)),J=B+1,oe=_findNextValidBounds(ce,B)):(Ee=ce[B],B&&Ee.top>oe.top&&Ee.left<oe.left+oe.width-1&&(N(J,B),J=B),oe=Ee));J<B&&N(J,B),q.forEach(Ne=>{var Ve;return(Ve=Ne.parentNode)==null?void 0:Ve.removeChild(Ne)})}if(!u){for(B=0;B<x.length;B++)if(F=x[B],f||!F.nextSibling||F.nextSibling.nodeType!==3)if(a&&!d){for(V=document.createElement("span"),V.style.whiteSpace="nowrap";F.firstChild;)V.appendChild(F.firstChild);F.replaceWith(V)}else F.replaceWith(...F.childNodes);else C=F.nextSibling,C&&C.nodeType===3&&(C.textContent=(F.textContent||"")+(C.textContent||""),F.remove());x.length=0,w.normalize()}this.lines.push(...T),this.words.push(...x),this.chars.push(...R)}),c&&this[c]&&this.masks.push(...this[c].map(w=>{let A=w.cloneNode();return w.replaceWith(A),A.appendChild(w),w.className&&(A.className=w.className.trim()+"-mask"),A.style.overflow="clip",A}))),this.isSplit=!0,(y=o&&o(this))&&y.totalTime&&(this._data.anim=S?y.totalTime(S):y),d&&s&&this.elements.forEach((w,A)=>{p[A].width=w.offsetWidth,M&&M.observe(w)})}),this}kill(){let{obs:e}=this._data;e&&e.disconnect(),_fonts?.removeEventListener("loadingdone",this._split)}revert(){var e,t;if(this.isSplit){let{orig:i,anim:r}=this._data;this.kill(),i.forEach(_revertOriginal),this.chars.length=this.words.length=this.lines.length=i.length=this.masks.length=0,this.isSplit=!1,r&&(this._data.animTime=r.totalTime(),r.revert()),(t=(e=this.vars).onRevert)==null||t.call(e,this)}return this}static create(e,t){return new At(e,t)}static register(e){gsap=gsap||e||window.gsap,gsap&&(_toArray=gsap.utils.toArray,_context=gsap.core.context||_context),!_coreInitted&&window.innerWidth>0&&(_fonts=document.fonts,_coreInitted=!0)}};_SplitText.version="3.14.2";let SplitText=_SplitText,instances=[];class Tween{constructor(e,t,i){this.target=e,this.fromProperties={},this.toProperties={},this.onComplete=t,this.onUpdate=i,this.t=0,this.duration=0,this.autoUpdate=!0,instances.push(this)}static autoUpdate(e){for(let t=0;t<instances.length;t++){let i=instances[t];i.autoUpdate&&i.update(e)}}restart(){this.isActive=!0,this.t=0}kill(){this.t=this.duration}to(e,t,i=null){let r={};for(let a in t)r[a]=this.target[a];this.fromTo(e,r,t,i)}fromTo(e,t,i,r){this.duration=e,this.ease=r,this.fromProperties=t,this.toProperties=i,this.restart(),this.update(0,this.duration==0)}update(e=0,t=!1){if(this.t<this.duration||t){this.t=Math.min(this.duration,this.t+e);let i=this.t/this.duration;this.ease&&(i=this.ease(i));for(let r in this.toProperties)this.target[r]=math.mix(this.fromProperties[r],this.toProperties[r],i);this.onUpdate&&this.onUpdate(),this.t==this.duration&&this.onComplete&&this.onComplete()}}}let _canvas,_ctx,_color="#fffde0";class BackgroundGrid{showHorizontalLines=!0;width=0;height=0;yOffset=0;gradientRatio=0;alpha=1;get viewportWidth(){return properties.useMobileLayout&&window.visualViewport?.width?window.visualViewport.width:properties.viewportWidth}get viewportHeight(){return properties.useMobileLayout&&window.visualViewport?.height?window.visualViewport.height:properties.viewportHeight}get viewportOffsetX(){return properties.useMobileLayout&&window.visualViewport?.offsetLeft||0}get viewportOffsetY(){return properties.useMobileLayout&&window.visualViewport?.offsetTop||0}getElementYOffset(e,t=.45){const i=e.getBoundingClientRect();return this.viewportHeight*.5-(i.top-this.viewportOffsetY+i.height*t)}preInit(){_canvas=document.getElementById("background-grid"),_ctx=_canvas.getContext("2d")}init(){}resize(){this._syncViewport()}update(e){this._syncViewport();const t=_canvas.width,i=_canvas.height;if(_ctx.clearRect(0,0,t,i),this.gradientRatio===1||this.alpha===0)return;_ctx.save(),_ctx.translate(t*.5,i*.5);const r=i*.5,a=t*.5,o=10,s=10,l=this.width/2+o,c=this.height/2+o,d=t*.12;_ctx.strokeStyle=_color,_ctx.lineWidth=1,_ctx.globalAlpha=.2,_ctx.beginPath();const f=-l-s,u=-l,h=l,_=l+s;if(_ctx.moveTo(f,-r),_ctx.lineTo(f,r),_ctx.moveTo(u,-r),_ctx.lineTo(u,r),_ctx.moveTo(h,-r),_ctx.lineTo(h,r),_ctx.moveTo(_,-r),_ctx.lineTo(_,r),_ctx.moveTo(f-d,-r),_ctx.lineTo(f-d,r),_ctx.moveTo(u-d,-r),_ctx.lineTo(u-d,r),_ctx.moveTo(h+d,-r),_ctx.lineTo(h+d,r),_ctx.moveTo(_+d,-r),_ctx.lineTo(_+d,r),this.showHorizontalLines){const M=-(c+this.yOffset),y=-(c+s+this.yOffset),w=c-this.yOffset,A=c+s-this.yOffset;_ctx.moveTo(-a,w),_ctx.lineTo(a,w),_ctx.moveTo(-a,M),_ctx.lineTo(a,M),_ctx.moveTo(-a,y),_ctx.lineTo(a,y),_ctx.moveTo(-a,A),_ctx.lineTo(a,A)}_ctx.stroke(),_ctx.restore();const v=i*.15,m=i+v*2,p=i+v-this.gradientRatio*m,S=_ctx.createLinearGradient(0,p+v,0,p-v);S.addColorStop(0,"rgba(255,255,255,0)"),S.addColorStop(1,"rgba(255,255,255,1)"),_ctx.globalCompositeOperation="destination-in",_ctx.globalAlpha=this.alpha,_ctx.fillStyle=S,_ctx.fillRect(0,0,t,i),_ctx.globalAlpha=1,_ctx.globalCompositeOperation="source-over"}_syncViewport(){const e=Math.max(1,Math.round(this.viewportWidth)),t=Math.max(1,Math.round(this.viewportHeight)),i=this.viewportOffsetX,r=this.viewportOffsetY,a=`${e}px`,o=`${t}px`,s=i||r?`translate3d(${i}px, ${r}px, 0)`:"none";_canvas.style.width!==a&&(_canvas.style.width=a),_canvas.style.height!==o&&(_canvas.style.height=o),_canvas.style.transform!==s&&(_canvas.style.transform=s),_canvas.width!==e&&(_canvas.width=e),_canvas.height!==t&&(_canvas.height=t)}}const backgroundGrid=new BackgroundGrid;class Page{domContainer;route=null;isTemplatePage=!1;_showPageTween;_hidePageTween;isActive=!1;hasInitialized=!1;pageOpacity=0;pageTime=0;constructor(){this._showPageTween=new Tween(this),this._hidePageTween=new Tween(this);let e=this._onPageTweenUpdate.bind(this);this._showPageTween.onUpdate=e,this._hidePageTween.onUpdate=e}get isScrollTarget(){return pagesManager.scrollTargetPage===this}preInit(e){}preInitContent(e){this.isTemplatePage&&(e.content.domInner=e.dom.querySelector(".page__inner"))}init(e){}initContent(e){}preShow(e,t){this.isTemplatePage&&(this.domInner&&this.domContainer.removeChild(this.domInner),this.domInner=t.content.domInner,this.domContainer.append(this.domInner))}show(e,t,i,r=!1){this.pageTime=0,this._showPageTween.kill(),this._showPageTween.onComplete=i,this._showPageTween.to(r?.001:.3,{pageOpacity:1})}hide(e,t,i){this._hidePageTween&&this._hidePageTween.kill(),this._hidePageTween.onComplete=i,this._hidePageTween.to(.2,{pageOpacity:0})}onHideComplete(e,t){}_onPageTweenUpdate(){this.domContainer.style.opacity=this.pageOpacity}resize(e,t){}update(e){this.pageTime+=e}}class Section{domContainer;isActive=!1;preInit(e,t){this.domContainer=e.querySelector("#"+t)}init(){}resize(e,t){}testVisibility(){let e=scrollManager.getDomRange(this.domContainer);this.isActive=e.isActive}update(e){this.testVisibility()}}let _domContainer$9,_domCopy,_domContent,_domScrollCta,_domTitle$7,_scrollCtaOpacity=1,_domTitleSpans,_domTitleSpanSplitTexts=[],_domCopySpans,_domCopySpanSplitTexts=[],_domCopySpanLines=[],backgroundYRatio$3=0,backgroundYFrom$3=0,backgroundYOnShow$3=0,isEntered$3=!1,prevIsEntered$3=!1;class HomeHeroSection extends Section{preInit(e){super.preInit(e,"home-hero"),_domContainer$9=this.domContainer,_domContent=_domContainer$9.querySelector("#home-hero__content"),_domCopy=_domContent.querySelector(".hero-copy"),_domTitle$7=_domContent.querySelector(".hero-title"),_domScrollCta=_domContainer$9.querySelector("#home-hero__scroll-to-explore"),_domTitleSpans=_domTitle$7.querySelectorAll("span");for(let t=0;t<_domTitleSpans.length;t++)_domTitleSpanSplitTexts.push(SplitText.create(_domTitleSpans[t],{type:"words,chars",charsClass:"char",autoSplit:!1}));_domCopySpans=_domCopy.querySelectorAll("span");for(let t=0;t<_domCopySpans.length;t++)_domCopySpanSplitTexts.push(SplitText.create(_domCopySpans[t],{type:"lines,words",linesClass:"line",autoSplit:!1}))}init(){super.init()}show(){isEntered$3=!0,prevIsEntered$3=!1,backgroundYOnShow$3=backgroundGrid.yOffset}hide(){isEntered$3=!1}resize(e,t){super.resize(e,t);let i=_domTitle$7.getBoundingClientRect(),r=_domTitleSpans[0].offsetHeight,a=i.width,o=i.height,s=math.getSeedRandomFn("hero-title");for(let u=0;u<_domTitleSpans.length;u++){_domTitleSpanSplitTexts[u].split();let h=_domTitleSpans[u],_=h.getBoundingClientRect(),v=_.width,m=_.left-i.left;h.__fromX=(a-v)/2-m;let p=_.top-i.top;h.__fromY=(o-r*3)/2-p+r*u;for(let S=0;S<_domTitleSpanSplitTexts[u].chars.length;S++){let M=_domTitleSpanSplitTexts[u].chars[S];M.__rand=s()}}_domCopySpanLines.length=0,_domCopySpanSplitTexts[0].split(),_domCopySpanSplitTexts[1].split();let l=_domCopySpans[0].getBoundingClientRect(),c=_domCopySpans[1].getBoundingClientRect(),d=l.width;_domCopySpanSplitTexts[0].split();let f=_domCopySpanSplitTexts[0].words[_domCopySpanSplitTexts[0].words.length-1].getBoundingClientRect();_domCopySpans[1].style.width=d-(f.right-l.left)+"px",_domCopySpanSplitTexts[1].split(),_domCopySpanLines.push(..._domCopySpanSplitTexts[0].lines,..._domCopySpanSplitTexts[1].lines);for(let u=0;u<_domCopySpanLines.length;u++){let h=_domCopySpanLines[u];h.__offsetX=0,h.__offsetY=0,h.__index=u,u>=_domCopySpanSplitTexts[0].lines.length&&(h.__offsetX=f.right-l.left,h.__offsetY=f.top-c.top,h.__index--)}}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=t.showScreenOffset-1,r=math.saturate(hero.videoRatio+(i>.01?1:-1)*e);hero.videoRatio=r,hero.startRatio=r,hero.animation=math.fit(i,0,3,0,1),this.domContainer.style.visibility=t.isActive?"visible":"hidden";const a=hero.animation>0;_scrollCtaOpacity+=4*(a?-1:1)*e,_scrollCtaOpacity=math.saturate(_scrollCtaOpacity),_domScrollCta.style.opacity=_scrollCtaOpacity;const o=scrollManager.getDomRange(_domTitle$7),s=math.fit(.1*homePage.pageTime,0,1,0,1);backgroundGrid.width=math.fit(s,0,1,backgroundGrid.width,o.width),backgroundGrid.height=math.fit(s,0,1,backgroundGrid.height,o.height);let l=-Math.min(0,t.screenY+properties.viewportHeight);isEntered$3&&!prevIsEntered$3&&(Math.abs(l-backgroundYOnShow$3)<properties.viewportHeight*.35?(backgroundYFrom$3=backgroundYOnShow$3,backgroundYRatio$3=0):(backgroundYFrom$3=l,backgroundYRatio$3=1),prevIsEntered$3=isEntered$3),backgroundYRatio$3=backgroundYRatio$3+e*2,backgroundGrid.yOffset=math.fit(backgroundYRatio$3,0,1,backgroundYFrom$3,l,ease.expoOut),backgroundGrid.gradientRatio=math.fit(s,0,1,backgroundGrid.gradientRatio,0),backgroundGrid.gradientRatio=math.fit(t.hideScreenOffset,-1,-.4,backgroundGrid.gradientRatio,1);let c=math.fit(t.hideScreenOffset,-2,-1,properties.viewportHeight/2,0);_domCopy.style.transform=`translateY(${c}px)`;for(let d=0;d<_domTitleSpans.length;d++){let f=_domTitleSpans[d],u=math.fit(homePage.pageTime,1,1.5,f.__fromY,0,ease.expoInOut),h=_domTitleSpanSplitTexts[d].chars;for(let _=0;_<h.length;_++){let v=h[_],p=(d==2?h.length-1-_:_)*.02,S=math.fit(homePage.pageTime,1.5+p,2+p,f.__fromX,0,ease.expoInOut);v.style.transform=`translate(${S}px, ${u}px)`,p=v.__rand*.2,v.style.opacity=math.fit(homePage.pageTime,.25+p,1+p,0,1)}for(let _=0;_<_domCopySpanLines.length;_++){let v=_domCopySpanLines[_],m=v.__index/(_domCopySpanLines.length-2),p=math.fit(t.showScreenOffset,m*.1+1.8,m*.1+2.3,0,1,ease.expoOut),S=math.mix(1,0,p);_domCopySpanLines[_].style.transform=`translate(${v.__offsetX}px, ${v.__offsetY}px) translateY(${S}em)`,_domCopySpanLines[_].style.opacity=math.mix(0,1,p)}}}}const homeHeroSection=new HomeHeroSection;let _domMenu,_domButton,_isOpen=!1,_scrollWasActive=!0;class SiteMobileMenu{preInit(){if(_domMenu=document.getElementById("site-mobile-menu"),_domButton=document.getElementById("site-header-mobile-menu-button"),!_domMenu||!_domButton)return;_domButton.addEventListener("click",()=>this.toggle());const e=_domMenu.querySelector('[data-id="jdm"] a');e&&e.addEventListener("click",t=>{t.preventDefault(),this.close(),routeManager.currPath===""?scrollManager.scrollTo("home-motor"):routeManager.setUrl("/#jdm")}),_domMenu.querySelectorAll("a").forEach(t=>{t.closest('[data-id="jdm"]')||t.addEventListener("click",()=>this.close())})}init(){}resize(){}open(){_isOpen||!properties.useMobileLayout||(_isOpen=!0,_scrollWasActive=scrollManager.isActive,scrollManager.isActive=!1,_domMenu.classList.add("is-open"),_domButton.classList.add("is-open"),_domButton.setAttribute("aria-expanded","true"),_domButton.setAttribute("aria-label","Close menu"),_domMenu.setAttribute("aria-hidden","false"))}close(){_isOpen&&(_isOpen=!1,scrollManager.isActive=_scrollWasActive,_domMenu.classList.remove("is-open"),_domButton.classList.remove("is-open"),_domButton.setAttribute("aria-expanded","false"),_domButton.setAttribute("aria-label","Open menu"),_domMenu.setAttribute("aria-hidden","true"))}toggle(){_isOpen?this.close():this.open()}update(){if(!_domMenu)return;const e=properties.useMobileLayout,t=properties.startTime>0;_domMenu.style.visibility=t&&e?"visible":"hidden",!e&&_isOpen&&this.close()}}const siteMobileMenu=new SiteMobileMenu;let _domContainer$8,_domLogo$1,_domButtons,_domCta,_domCtaContainer,_domCtaContainerRect,_domCtaRect,_domSeparator,_domNav,_domNavRect,_bgGridDomRef,_bgGridDomRefRect,_siteOuterPaddingX,_domCtaSubtitle,_domMobileMenuButton;class SiteHeader{isActive=!0;headerHeight=0;preInit(){_domContainer$8=document.getElementById("site-header"),_domLogo$1=_domContainer$8.querySelector("#site-header-logo"),_domNav=_domContainer$8.querySelector("#site-header-nav"),_domButtons=_domContainer$8.querySelectorAll("ul > li"),_domCtaContainer=_domContainer$8.querySelector("#site-header-cta-container"),_domCta=_domContainer$8.querySelector("#site-header-cta"),_bgGridDomRef=document.querySelector("#background-grid-ref__center"),_domSeparator=_domContainer$8.querySelector("#site-header-cta__separator"),_domCtaSubtitle=_domContainer$8.querySelector("#site-header-cta__subtitle"),_domMobileMenuButton=_domContainer$8.querySelector("#site-header-mobile-menu-button"),_domNav.querySelector('[data-id="jdm"] a').addEventListener("click",t=>{t.preventDefault(),routeManager.currPath===""?scrollManager.scrollTo("home-motor"):routeManager.setUrl("/#jdm")}),_domLogo$1.addEventListener("click",t=>{t.preventDefault(),routeManager.currPath===""&&scrollManager.scrollTo("home-hero"),siteMobileMenu.close()})}init(){}resize(e,t){_bgGridDomRefRect=_bgGridDomRef.getBoundingClientRect(),_domNavRect=_domNav.getBoundingClientRect(),_domCtaRect=_domCta.getBoundingClientRect(),_domCtaContainerRect=_domCtaContainer.getBoundingClientRect(),_siteOuterPaddingX=0*properties.viewportWidth/1440,document.documentElement.style.setProperty("--header-height",_domContainer$8.getBoundingClientRect().height+"px")}update(e){const t=properties.useMobileLayout;if(_domContainer$8.style.visibility=properties.startTime>0?"visible":"hidden",t){let i=math.fit(properties.startTime,.25,.75,0,1);_domLogo$1.style.transform=`translateY(${math.fit(i,0,1,-100,0,ease.cubicInOut)}%)`,_domLogo$1.style.opacity=math.fit(i,0,1,0,1),i=math.fit(properties.startTime,.35,.8,0,1),_domCta.style.transform=`translateY(calc(${math.fit(i,0,1,-100,0,ease.cubicInOut)}% - ${math.fit(properties.startTime,1.2,1.5,0,_domCtaContainerRect.height-_domCtaRect.height,ease.cubicInOut)}px))`,_domCta.style.opacity=math.fit(i,0,1,0,1),i=math.fit(properties.startTime,.4,.85,0,1),_domMobileMenuButton.style.transform=`translateY(${math.fit(i,0,1,-100,0,ease.cubicInOut)}%)`,_domMobileMenuButton.style.opacity=math.fit(i,0,1,0,1)}else{let i=math.fit(properties.startTime,.25,.75,0,1);_domLogo$1.style.transform=`translateY(${math.fit(i,0,1,-100,0,ease.cubicInOut)}%)`,_domLogo$1.style.opacity=math.fit(i,0,1,0,1),i=math.fit(properties.startTime,.25,.75,0,1),_domButtons.forEach((s,l)=>{let c=l/(_domButtons.length-1),d=math.fit(i,c*.2,.8+c*.2,0,1);s.style.transform=`translateY(${math.fit(d,0,1,-100,0,ease.cubicInOut)}%)`,s.style.opacity=math.fit(i,0,1,0,1)}),i=math.fit(properties.startTime,.3,.75,0,1),_domCtaSubtitle.style.transform=`translateY(${math.fit(i,0,1,-100,0,ease.cubicInOut)}%)`,_domCtaSubtitle.style.opacity=math.fit(i,0,1,0,1,ease.cubicInOut)*math.fit(properties.startTime,1.2,1.5,1,0,ease.cubicInOut),i=math.fit(properties.startTime,.35,.8,0,1),_domCta.style.transform=`translateY(calc(${math.fit(i,0,1,-100,0,ease.cubicInOut)}% - ${math.fit(properties.startTime,1.2,1.5,0,_domCtaContainerRect.height-_domCtaRect.height,ease.cubicInOut)}px))`,_domCta.style.opacity=math.fit(i,0,1,0,1),i=math.fit(properties.startTime,1,1.3,0,1);const r=math.fit(i,0,1,_bgGridDomRefRect.x-_siteOuterPaddingX,0,ease.cubicInOut);i=math.fit(properties.startTime,1.2,1.5,0,1);const o=math.fit(i,0,1,_bgGridDomRefRect.y-1.5*_domNavRect.height-48,0,ease.cubicInOut);_domNav.style.transform=`translate(${r}px, ${o}px)`,_domCtaContainer.style.transform=`translate(${-r}px, ${o}px)`,_domSeparator.style.transform=`translateY(${o-.5*_domCtaRect.height}px) scale(${math.fit(properties.startTime,.35,.8,0,1,ease.cubicInOut)})`,_domSeparator.style.left=`${_domNavRect.width+r+16}px`,_domSeparator.style.right=`${_domCtaRect.width+r+16}px`,_domSeparator.style.opacity=math.fit(properties.startTime,1,1.5,1,0,ease.cubicInOut)}}}const siteHeader=new SiteHeader;/*! @vimeo/player v2.30.4 | (c) 2026 Vimeo | MIT License | https://github.com/vimeo/player.js */const isNode=typeof global<"u"&&{}.toString.call(global)==="[object global]",isBun=typeof Bun<"u",isDeno=typeof Deno<"u",isCloudflareWorker=typeof WebSocketPair=="function"&&typeof caches?.default<"u",isServerRuntime=isNode||isBun||isDeno||isCloudflareWorker;function getMethodName(n,e){return n.indexOf(e.toLowerCase())===0?n:`${e.toLowerCase()}${n.substr(0,1).toUpperCase()}${n.substr(1)}`}function isDomElement(n){return!!(n&&n.nodeType===1&&"nodeName"in n&&n.ownerDocument&&n.ownerDocument.defaultView)}function isInteger(n){return!isNaN(parseFloat(n))&&isFinite(n)&&Math.floor(n)==n}function isVimeoUrl(n){return/^(https?:)?\/\/((((player|www)\.)?vimeo\.com)|((player\.)?[a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))(?=$|\/)/.test(n)}function isVimeoEmbed(n){return/^https:\/\/player\.((vimeo\.com)|([a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))\/video\/\d+/.test(n)}function getOembedDomain(n){const e=(n||"").match(/^(?:https?:)?(?:\/\/)?([^/?]+)/),t=(e&&e[1]||"").replace("player.",""),i=[".videoji.hk",".vimeo.work",".videoji.cn"];for(const r of i)if(t.endsWith(r))return t;return"vimeo.com"}function getVimeoUrl(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const e=n.id,t=n.url,i=e||t;if(!i)throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");if(isInteger(i))return`https://vimeo.com/${i}`;if(isVimeoUrl(i))return i.replace("http:","https:");throw e?new TypeError(`“${e}” is not a valid video id.`):new TypeError(`“${i}” is not a vimeo.com url.`)}const subscribe=function(n,e,t){let i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"addEventListener",r=arguments.length>4&&arguments[4]!==void 0?arguments[4]:"removeEventListener";const a=typeof e=="string"?[e]:e;return a.forEach(o=>{n[i](o,t)}),{cancel:()=>a.forEach(o=>n[r](o,t))}};function findIframeBySourceWindow(n){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:document;if(!n||!e||typeof e.querySelectorAll!="function")return null;const t=e.querySelectorAll("iframe");for(let i=0;i<t.length;i++)if(t[i]&&t[i].contentWindow===n)return t[i];return null}const arrayIndexOfSupport=typeof Array.prototype.indexOf<"u",postMessageSupport=typeof window<"u"&&typeof window.postMessage<"u";if(!isServerRuntime&&(!arrayIndexOfSupport||!postMessageSupport))throw new Error("Sorry, the Vimeo Player API is not available in this browser.");var commonjsGlobal=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function createCommonjsModule(n,e){return e={exports:{}},n(e,e.exports),e.exports}/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */(function(n){if(n.WeakMap)return;var e=Object.prototype.hasOwnProperty,t=Object.defineProperty&&function(){try{return Object.defineProperty({},"x",{value:1}).x===1}catch{}}(),i=function(a,o,s){t?Object.defineProperty(a,o,{configurable:!0,writable:!0,value:s}):a[o]=s};n.WeakMap=function(){function a(){if(this===void 0)throw new TypeError("Constructor WeakMap requires 'new'");if(i(this,"_id",s("_WeakMap")),arguments.length>0)throw new TypeError("WeakMap iterable is not supported")}i(a.prototype,"delete",function(c){if(o(this,"delete"),!r(c))return!1;var d=c[this._id];return d&&d[0]===c?(delete c[this._id],!0):!1}),i(a.prototype,"get",function(c){if(o(this,"get"),!!r(c)){var d=c[this._id];if(d&&d[0]===c)return d[1]}}),i(a.prototype,"has",function(c){if(o(this,"has"),!r(c))return!1;var d=c[this._id];return!!(d&&d[0]===c)}),i(a.prototype,"set",function(c,d){if(o(this,"set"),!r(c))throw new TypeError("Invalid value used as weak map key");var f=c[this._id];return f&&f[0]===c?(f[1]=d,this):(i(c,this._id,[c,d]),this)});function o(c,d){if(!r(c)||!e.call(c,"_id"))throw new TypeError(d+" method called on incompatible receiver "+typeof c)}function s(c){return c+"_"+l()+"."+l()}function l(){return Math.random().toString().substring(2)}return i(a,"_polyfill",!0),a}();function r(a){return Object(a)===a}})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:commonjsGlobal);var npo_src=createCommonjsModule(function(n){/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/(function(t,i,r){i[t]=i[t]||r(),n.exports&&(n.exports=i[t])})("Promise",commonjsGlobal,function(){var t,i,r,a=Object.prototype.toString,o=typeof setImmediate<"u"?function(M){return setImmediate(M)}:setTimeout;try{Object.defineProperty({},"x",{}),t=function(M,y,w,A){return Object.defineProperty(M,y,{value:w,writable:!0,configurable:A!==!1})}}catch{t=function(y,w,A){return y[w]=A,y}}r=function(){var M,y,w;function A(R,x){this.fn=R,this.self=x,this.next=void 0}return{add:function(x,T){w=new A(x,T),y?y.next=w:M=w,y=w,w=void 0},drain:function(){var x=M;for(M=y=i=void 0;x;)x.fn.call(x.self),x=x.next}}}();function s(S,M){r.add(S,M),i||(i=o(r.drain))}function l(S){var M,y=typeof S;return S!=null&&(y=="object"||y=="function")&&(M=S.then),typeof M=="function"?M:!1}function c(){for(var S=0;S<this.chain.length;S++)d(this,this.state===1?this.chain[S].success:this.chain[S].failure,this.chain[S]);this.chain.length=0}function d(S,M,y){var w,A;try{M===!1?y.reject(S.msg):(M===!0?w=S.msg:w=M.call(void 0,S.msg),w===y.promise?y.reject(TypeError("Promise-chain cycle")):(A=l(w))?A.call(w,y.resolve,y.reject):y.resolve(w))}catch(R){y.reject(R)}}function f(S){var M,y=this;if(!y.triggered){y.triggered=!0,y.def&&(y=y.def);try{(M=l(S))?s(function(){var w=new _(y);try{M.call(S,function(){f.apply(w,arguments)},function(){u.apply(w,arguments)})}catch(A){u.call(w,A)}}):(y.msg=S,y.state=1,y.chain.length>0&&s(c,y))}catch(w){u.call(new _(y),w)}}}function u(S){var M=this;M.triggered||(M.triggered=!0,M.def&&(M=M.def),M.msg=S,M.state=2,M.chain.length>0&&s(c,M))}function h(S,M,y,w){for(var A=0;A<M.length;A++)(function(x){S.resolve(M[x]).then(function(z){y(x,z)},w)})(A)}function _(S){this.def=S,this.triggered=!1}function v(S){this.promise=S,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function m(S){if(typeof S!="function")throw TypeError("Not a function");if(this.__NPO__!==0)throw TypeError("Not a promise");this.__NPO__=1;var M=new v(this);this.then=function(w,A){var R={success:typeof w=="function"?w:!0,failure:typeof A=="function"?A:!1};return R.promise=new this.constructor(function(T,z){if(typeof T!="function"||typeof z!="function")throw TypeError("Not a function");R.resolve=T,R.reject=z}),M.chain.push(R),M.state!==0&&s(c,M),R.promise},this.catch=function(w){return this.then(void 0,w)};try{S.call(void 0,function(w){f.call(M,w)},function(w){u.call(M,w)})}catch(y){u.call(M,y)}}var p=t({},"constructor",m,!1);return m.prototype=p,t(p,"__NPO__",0,!1),t(m,"resolve",function(M){var y=this;return M&&typeof M=="object"&&M.__NPO__===1?M:new y(function(A,R){if(typeof A!="function"||typeof R!="function")throw TypeError("Not a function");A(M)})}),t(m,"reject",function(M){return new this(function(w,A){if(typeof w!="function"||typeof A!="function")throw TypeError("Not a function");A(M)})}),t(m,"all",function(M){var y=this;return a.call(M)!="[object Array]"?y.reject(TypeError("Not an array")):M.length===0?y.resolve([]):new y(function(A,R){if(typeof A!="function"||typeof R!="function")throw TypeError("Not a function");var x=M.length,T=Array(x),z=0;h(y,M,function(B,F){T[B]=F,++z===x&&A(T)},R)})}),t(m,"race",function(M){var y=this;return a.call(M)!="[object Array]"?y.reject(TypeError("Not an array")):new y(function(A,R){if(typeof A!="function"||typeof R!="function")throw TypeError("Not a function");h(y,M,function(T,z){A(z)},R)})}),m})});const callbackMap=new WeakMap;function storeCallback(n,e,t){const i=callbackMap.get(n.element)||{};e in i||(i[e]=[]),i[e].push(t),callbackMap.set(n.element,i)}function getCallbacks(n,e){return(callbackMap.get(n.element)||{})[e]||[]}function removeCallback(n,e,t){const i=callbackMap.get(n.element)||{};if(!i[e])return!0;if(!t)return i[e]=[],callbackMap.set(n.element,i),!0;const r=i[e].indexOf(t);return r!==-1&&i[e].splice(r,1),callbackMap.set(n.element,i),i[e]&&i[e].length===0}function shiftCallbacks(n,e){const t=getCallbacks(n,e);if(t.length<1)return!1;const i=t.shift();return removeCallback(n,e,i),i}function swapCallbacks(n,e){const t=callbackMap.get(n);callbackMap.set(e,t),callbackMap.delete(n)}function parseMessageData(n){if(typeof n=="string")try{n=JSON.parse(n)}catch(e){return console.warn(e),{}}return n}function postMessage(n,e,t){if(!n.element.contentWindow||!n.element.contentWindow.postMessage)return;let i={method:e};t!==void 0&&(i.value=t);const r=parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/,"$1"));r>=8&&r<10&&(i=JSON.stringify(i)),n.element.contentWindow.postMessage(i,n.origin)}function processData(n,e){e=parseMessageData(e);let t=[],i;if(e.event)e.event==="error"&&getCallbacks(n,e.data.method).forEach(a=>{const o=new Error(e.data.message);o.name=e.data.name,a.reject(o),removeCallback(n,e.data.method,a)}),t=getCallbacks(n,`event:${e.event}`),i=e.data;else if(e.method){const r=shiftCallbacks(n,e.method);r&&(t.push(r),i=e.value)}t.forEach(r=>{try{if(typeof r=="function"){r.call(n,i);return}r.resolve(i)}catch{}})}const oEmbedParameters=["airplay","audio_tracks","audiotrack","autopause","autoplay","background","byline","cc","chapter_id","chapters","chromecast","color","colors","controls","disable_context_menu","dnt","end_time","fullscreen","height","id","initial_quality","interactive_params","keyboard","loop","maxheight","max_quality","maxwidth","min_quality","muted","play_button_position","playsinline","portrait","preload","progress_bar","quality","quality_selector","responsive","skipping_forward","speed","start_time","texttrack","thumbnail_id","title","transcript","transparent","unmute_button","url","vimeo_logo","volume","watch_full_video","width"];function getOEmbedParameters(n){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return oEmbedParameters.reduce((t,i)=>{const r=n.getAttribute(`data-vimeo-${i}`);return(r||r==="")&&(t[i]=r===""?1:r),t},e)}function createEmbed(n,e){let{html:t}=n;if(!e)throw new TypeError("An element must be provided");if(e.getAttribute("data-vimeo-initialized")!==null)return e.querySelector("iframe");const i=document.createElement("div");return i.innerHTML=t,e.appendChild(i.firstChild),e.setAttribute("data-vimeo-initialized","true"),e.querySelector("iframe")}function getOEmbedData(n){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=arguments.length>2?arguments[2]:void 0;return new Promise((i,r)=>{if(!isVimeoUrl(n))throw new TypeError(`“${n}” is not a vimeo.com url.`);let o=`https://${getOembedDomain(n)}/api/oembed.json?url=${encodeURIComponent(n)}`;for(const l in e)e.hasOwnProperty(l)&&(o+=`&${l}=${encodeURIComponent(e[l])}`);const s="XDomainRequest"in window?new XDomainRequest:new XMLHttpRequest;s.open("GET",o,!0),s.onload=function(){if(s.status===404){r(new Error(`“${n}” was not found.`));return}if(s.status===403){r(new Error(`“${n}” is not embeddable.`));return}try{const l=JSON.parse(s.responseText);if(l.domain_status_code===403){createEmbed(l,t),r(new Error(`“${n}” is not embeddable.`));return}i(l)}catch(l){r(l)}},s.onerror=function(){const l=s.status?` (${s.status})`:"";r(new Error(`There was an error fetching the embed code from Vimeo${l}.`))},s.send()})}function initializeEmbeds(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:document;const e=[].slice.call(n.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")),t=i=>{"console"in window&&console.error&&console.error(`There was an error creating an embed: ${i}`)};e.forEach(i=>{try{if(i.getAttribute("data-vimeo-defer")!==null)return;const r=getOEmbedParameters(i),a=getVimeoUrl(r);getOEmbedData(a,r,i).then(o=>createEmbed(o,i)).catch(t)}catch(r){t(r)}})}function resizeEmbeds(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:document;if(window.VimeoPlayerResizeEmbeds_)return;window.VimeoPlayerResizeEmbeds_=!0;const e=t=>{if(!isVimeoUrl(t.origin)||!t.data||t.data.event!=="spacechange")return;const i=t.source?findIframeBySourceWindow(t.source,n):null;if(i){const r=i.parentElement;r.style.paddingBottom=`${t.data.data[0].bottom}px`}};window.addEventListener("message",e)}function initAppendVideoMetadata(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:document;if(window.VimeoSeoMetadataAppended)return;window.VimeoSeoMetadataAppended=!0;const e=t=>{if(!isVimeoUrl(t.origin))return;const i=parseMessageData(t.data);if(!i||i.event!=="ready")return;const r=t.source?findIframeBySourceWindow(t.source,n):null;r&&isVimeoEmbed(r.src)&&new Player(r).callMethod("appendVideoMetadata",window.location.href)};window.addEventListener("message",e)}function checkUrlTimeParam(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:document;if(window.VimeoCheckedUrlTimeParam)return;window.VimeoCheckedUrlTimeParam=!0;const e=i=>{"console"in window&&console.error&&console.error(`There was an error getting video Id: ${i}`)},t=i=>{if(!isVimeoUrl(i.origin))return;const r=parseMessageData(i.data);if(!r||r.event!=="ready")return;const a=i.source?findIframeBySourceWindow(i.source,n):null;if(a&&isVimeoEmbed(a.src)){const o=new Player(a);o.getVideoId().then(s=>{const l=new RegExp(`[?&]vimeo_t_${s}=([^&#]*)`).exec(window.location.href);if(l&&l[1]){const c=decodeURI(l[1]);o.setCurrentTime(c)}}).catch(e)}};window.addEventListener("message",t)}function updateDRMEmbeds(){if(window.VimeoDRMEmbedsUpdated)return;window.VimeoDRMEmbedsUpdated=!0;const n=e=>{if(!isVimeoUrl(e.origin))return;const t=parseMessageData(e.data);if(!t||t.event!=="drminitfailed")return;const i=e.source?findIframeBySourceWindow(e.source):null;if(!i)return;const r=i.getAttribute("allow")||"";if(!r.includes("encrypted-media")){i.setAttribute("allow",`${r}; encrypted-media`);const o=new URL(i.getAttribute("src"));o.searchParams.set("forcereload","drm"),i.setAttribute("src",o.toString());return}};window.addEventListener("message",n)}function initializeScreenfull(){const n=function(){let i;const r=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]];let a=0;const o=r.length,s={};for(;a<o;a++)if(i=r[a],i&&i[1]in document){for(a=0;a<i.length;a++)s[r[0][a]]=i[a];return s}return!1}(),e={fullscreenchange:n.fullscreenchange,fullscreenerror:n.fullscreenerror},t={request(i){return new Promise((r,a)=>{const o=function(){t.off("fullscreenchange",o),r()};t.on("fullscreenchange",o),i=i||document.documentElement;const s=i[n.requestFullscreen]();s instanceof Promise&&s.then(o).catch(a)})},exit(){return new Promise((i,r)=>{if(!t.isFullscreen){i();return}const a=function(){t.off("fullscreenchange",a),i()};t.on("fullscreenchange",a);const o=document[n.exitFullscreen]();o instanceof Promise&&o.then(a).catch(r)})},on(i,r){const a=e[i];a&&document.addEventListener(a,r)},off(i,r){const a=e[i];a&&document.removeEventListener(a,r)}};return Object.defineProperties(t,{isFullscreen:{get(){return!!document[n.fullscreenElement]}},element:{enumerable:!0,get(){return document[n.fullscreenElement]}},isEnabled:{enumerable:!0,get(){return!!document[n.fullscreenEnabled]}}}),t}const defaultOptions={role:"viewer",autoPlayMuted:!0,allowedDrift:.3,maxAllowedDrift:1,minCheckInterval:.1,maxRateAdjustment:.2,maxTimeToCatchUp:1};class TimingSrcConnector extends EventTarget{logger;constructor(e,t){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=arguments.length>3?arguments[3]:void 0;super(),this.logger=r,this.init(t,e,{...defaultOptions,...i})}disconnect(){this.dispatchEvent(new Event("disconnect"))}async init(e,t,i){if(await this.waitForTOReadyState(e,"open"),i.role==="viewer"){await this.updatePlayer(e,t,i);const r=subscribe(e,"change",()=>this.updatePlayer(e,t,i)),a=this.maintainPlaybackPosition(e,t,i);this.addEventListener("disconnect",()=>{a.cancel(),r.cancel()})}else{await this.updateTimingObject(e,t);const r=subscribe(t,["seeked","play","pause","ratechange"],()=>this.updateTimingObject(e,t),"on","off");this.addEventListener("disconnect",()=>r.cancel())}}async updateTimingObject(e,t){const[i,r,a]=await Promise.all([t.getCurrentTime(),t.getPaused(),t.getPlaybackRate()]);e.update({position:i,velocity:r?0:a})}async updatePlayer(e,t,i){const{position:r,velocity:a}=e.query();typeof r=="number"&&t.setCurrentTime(r),typeof a=="number"&&(a===0?await t.getPaused()===!1&&t.pause():a>0&&(await t.getPaused()===!0&&(await t.play().catch(async o=>{o.name==="NotAllowedError"&&i.autoPlayMuted&&(await t.setMuted(!0),await t.play().catch(s=>console.error("Couldn't play the video from TimingSrcConnector. Error:",s)))}),this.updatePlayer(e,t,i)),await t.getPlaybackRate()!==a&&t.setPlaybackRate(a)))}maintainPlaybackPosition(e,t,i){const{allowedDrift:r,maxAllowedDrift:a,minCheckInterval:o,maxRateAdjustment:s,maxTimeToCatchUp:l}=i,c=Math.min(l,Math.max(o,a))*1e3,d=async()=>{if(e.query().velocity===0||await t.getPaused()===!0)return;const u=e.query().position-await t.getCurrentTime(),h=Math.abs(u);if(this.log(`Drift: ${u}`),h>a)await this.adjustSpeed(t,0),t.setCurrentTime(e.query().position),this.log("Resync by currentTime");else if(h>r){const _=h/l,v=s,m=_<v?(v-_)/2:v;await this.adjustSpeed(t,m*Math.sign(u)),this.log("Resync by playbackRate")}},f=setInterval(()=>d(),c);return{cancel:()=>clearInterval(f)}}log(e){this.logger?.(`TimingSrcConnector: ${e}`)}speedAdjustment=0;adjustSpeed=async(e,t)=>{if(this.speedAdjustment===t)return;const i=await e.getPlaybackRate()-this.speedAdjustment+t;this.log(`New playbackRate:  ${i}`),await e.setPlaybackRate(i),this.speedAdjustment=t};waitForTOReadyState(e,t){return new Promise(i=>{const r=()=>{e.readyState===t?i():e.addEventListener("readystatechange",r,{once:!0})};r()})}}const playerMap=new WeakMap,readyMap=new WeakMap;let screenfull={};class Player{constructor(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(window.jQuery&&e instanceof jQuery&&(e.length>1&&window.console&&console.warn&&console.warn("A jQuery object with multiple elements was passed, using the first element."),e=e[0]),typeof document<"u"&&typeof e=="string"&&(e=document.getElementById(e)),!isDomElement(e))throw new TypeError("You must pass either a valid element or a valid id.");if(e.nodeName!=="IFRAME"){const r=e.querySelector("iframe");r&&(e=r)}if(e.nodeName==="IFRAME"&&!isVimeoUrl(e.getAttribute("src")||""))throw new Error("The player element passed isn’t a Vimeo embed.");if(playerMap.has(e))return playerMap.get(e);this._window=e.ownerDocument.defaultView,this.element=e,this.origin="*";const i=new npo_src((r,a)=>{if(this._onMessage=o=>{if(!isVimeoUrl(o.origin)||this.element.contentWindow!==o.source)return;this.origin==="*"&&(this.origin=o.origin);const s=parseMessageData(o.data);if(s&&s.event==="error"&&s.data&&s.data.method==="ready"){const u=new Error(s.data.message);u.name=s.data.name,a(u);return}const d=s&&s.event==="ready",f=s&&s.method==="ping";if(d||f){this.element.setAttribute("data-ready","true"),r();return}processData(this,s)},this._window.addEventListener("message",this._onMessage),this.element.nodeName!=="IFRAME"){const o=getOEmbedParameters(e,t),s=getVimeoUrl(o);getOEmbedData(s,o,e).then(l=>{const c=createEmbed(l,e);return this.element=c,this._originalElement=e,swapCallbacks(e,c),playerMap.set(this.element,this),l}).catch(a)}});if(readyMap.set(this,i),playerMap.set(this.element,this),this.element.nodeName==="IFRAME"&&postMessage(this,"ping"),screenfull.isEnabled){const r=()=>screenfull.exit();this.fullscreenchangeHandler=()=>{screenfull.isFullscreen?storeCallback(this,"event:exitFullscreen",r):removeCallback(this,"event:exitFullscreen",r),this.ready().then(()=>{postMessage(this,"fullscreenchange",screenfull.isFullscreen)})},screenfull.on("fullscreenchange",this.fullscreenchangeHandler)}return this}static isVimeoUrl(e){return isVimeoUrl(e)}callMethod(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),r=1;r<t;r++)i[r-1]=arguments[r];if(e==null)throw new TypeError("You must pass a method name.");return new npo_src((a,o)=>this.ready().then(()=>{storeCallback(this,e,{resolve:a,reject:o}),i.length===0?i={}:i.length===1&&(i=i[0]),postMessage(this,e,i)}).catch(o))}get(e){return new npo_src((t,i)=>(e=getMethodName(e,"get"),this.ready().then(()=>{storeCallback(this,e,{resolve:t,reject:i}),postMessage(this,e)}).catch(i)))}set(e,t){return new npo_src((i,r)=>{if(e=getMethodName(e,"set"),t==null)throw new TypeError("There must be a value to set.");return this.ready().then(()=>{storeCallback(this,e,{resolve:i,reject:r}),postMessage(this,e,t)}).catch(r)})}on(e,t){if(!e)throw new TypeError("You must pass an event name.");if(!t)throw new TypeError("You must pass a callback function.");if(typeof t!="function")throw new TypeError("The callback must be a function.");getCallbacks(this,`event:${e}`).length===0&&this.callMethod("addEventListener",e).catch(()=>{}),storeCallback(this,`event:${e}`,t)}off(e,t){if(!e)throw new TypeError("You must pass an event name.");if(t&&typeof t!="function")throw new TypeError("The callback must be a function.");removeCallback(this,`event:${e}`,t)&&this.callMethod("removeEventListener",e).catch(r=>{})}loadVideo(e){return this.callMethod("loadVideo",e)}ready(){const e=readyMap.get(this)||new npo_src((t,i)=>{i(new Error("Unknown player. Probably unloaded."))});return npo_src.resolve(e)}addCuePoint(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.callMethod("addCuePoint",{time:e,data:t})}removeCuePoint(e){return this.callMethod("removeCuePoint",e)}enableTextTrack(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null,i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0;if(!e)throw new TypeError("You must pass a language.");return this.callMethod("enableTextTrack",{language:e,kind:t,showing:i})}disableTextTrack(){return this.callMethod("disableTextTrack")}selectAudioTrack(e,t){if(!e)throw new TypeError("You must pass a language.");return this.callMethod("selectAudioTrack",{language:e,kind:t})}selectDefaultAudioTrack(){return this.callMethod("selectDefaultAudioTrack")}pause(){return this.callMethod("pause")}play(){return this.callMethod("play")}requestFullscreen(){return screenfull.isEnabled?screenfull.request(this.element):this.callMethod("requestFullscreen")}exitFullscreen(){return screenfull.isEnabled?screenfull.exit():this.callMethod("exitFullscreen")}getFullscreen(){return screenfull.isEnabled?npo_src.resolve(screenfull.isFullscreen):this.get("fullscreen")}requestPictureInPicture(){return this.callMethod("requestPictureInPicture")}exitPictureInPicture(){return this.callMethod("exitPictureInPicture")}getPictureInPicture(){return this.get("pictureInPicture")}remotePlaybackPrompt(){return this.callMethod("remotePlaybackPrompt")}unload(){return this.callMethod("unload")}destroy(){return new npo_src(e=>{if(readyMap.delete(this),playerMap.delete(this.element),this._originalElement&&(playerMap.delete(this._originalElement),this._originalElement.removeAttribute("data-vimeo-initialized")),this.element&&this.element.nodeName==="IFRAME"&&this.element.parentNode&&(this.element.parentNode.parentNode&&this._originalElement&&this._originalElement!==this.element.parentNode?this.element.parentNode.parentNode.removeChild(this.element.parentNode):this.element.parentNode.removeChild(this.element)),this.element&&this.element.nodeName==="DIV"&&this.element.parentNode){this.element.removeAttribute("data-vimeo-initialized");const t=this.element.querySelector("iframe");t&&t.parentNode&&(t.parentNode.parentNode&&this._originalElement&&this._originalElement!==t.parentNode?t.parentNode.parentNode.removeChild(t.parentNode):t.parentNode.removeChild(t))}this._window.removeEventListener("message",this._onMessage),screenfull.isEnabled&&screenfull.off("fullscreenchange",this.fullscreenchangeHandler),e()})}getAutopause(){return this.get("autopause")}setAutopause(e){return this.set("autopause",e)}getBuffered(){return this.get("buffered")}getCameraProps(){return this.get("cameraProps")}setCameraProps(e){return this.set("cameraProps",e)}getChapters(){return this.get("chapters")}getCurrentChapter(){return this.get("currentChapter")}getColor(){return this.get("color")}getColors(){return npo_src.all([this.get("colorOne"),this.get("colorTwo"),this.get("colorThree"),this.get("colorFour")])}setColor(e){return this.set("color",e)}setColors(e){if(!Array.isArray(e))return new npo_src((r,a)=>a(new TypeError("Argument must be an array.")));const t=new npo_src(r=>r(null)),i=[e[0]?this.set("colorOne",e[0]):t,e[1]?this.set("colorTwo",e[1]):t,e[2]?this.set("colorThree",e[2]):t,e[3]?this.set("colorFour",e[3]):t];return npo_src.all(i)}getCuePoints(){return this.get("cuePoints")}getCurrentTime(){return this.get("currentTime")}setCurrentTime(e){return this.set("currentTime",e)}getDuration(){return this.get("duration")}getEnded(){return this.get("ended")}getLoop(){return this.get("loop")}setLoop(e){return this.set("loop",e)}setMuted(e){return this.set("muted",e)}getMuted(){return this.get("muted")}getPaused(){return this.get("paused")}getPlaybackRate(){return this.get("playbackRate")}setPlaybackRate(e){return this.set("playbackRate",e)}getPlayed(){return this.get("played")}getQualities(){return this.get("qualities")}getQuality(){return this.get("quality")}setQuality(e){return this.set("quality",e)}getRemotePlaybackAvailability(){return this.get("remotePlaybackAvailability")}getRemotePlaybackState(){return this.get("remotePlaybackState")}getSeekable(){return this.get("seekable")}getSeeking(){return this.get("seeking")}getTextTracks(){return this.get("textTracks")}getAudioTracks(){return this.get("audioTracks")}getEnabledAudioTrack(){return this.get("enabledAudioTrack")}getDefaultAudioTrack(){return this.get("defaultAudioTrack")}getVideoEmbedCode(){return this.get("videoEmbedCode")}getVideoId(){return this.get("videoId")}getVideoTitle(){return this.get("videoTitle")}getVideoWidth(){return this.get("videoWidth")}getVideoHeight(){return this.get("videoHeight")}getVideoUrl(){return this.get("videoUrl")}getVolume(){return this.get("volume")}setVolume(e){return this.set("volume",e)}async setTimingSrc(e,t){if(!e)throw new TypeError("A Timing Object must be provided.");await this.ready();const i=new TimingSrcConnector(this,e,t);return postMessage(this,"notifyTimingObjectConnect"),i.addEventListener("disconnect",()=>postMessage(this,"notifyTimingObjectDisconnect")),i}}isServerRuntime||(screenfull=initializeScreenfull(),initializeEmbeds(),resizeEmbeds(),initAppendVideoMetadata(),checkUrlTimeParam(),updateDRMEmbeds());const VIDEO_LIST={MAIN_VIDEO_REEL:"https://player.vimeo.com/video/1174820580?h=5aaa6219d2"};class VideoOverlay{domVideoContainer;domVideoCursor;isOpened=!1;openedRatio=0;isVideoMuted=!1;isControlsHover=!1;isVideoHover=!1;isVideoPlaying=!1;isVideoReady=!1;videoPercentageWatched=0;videoDuration=0;videoWidth=1920;videoHeight=1080;hasInitialized=!1;currentVideoId=null;isPrefetching=!1;isPrefetched=!1;usesNativePlayer=!1;playingRatio=0;preInit(){this.hasInitialized||(this.domVideoContainer=document.querySelector("#video-overlay"),this.domVideoCursor=document.querySelector("#video-overlay-cursor"),this.domVimeoEntryPoint=document.querySelector("#video-overlay__vimeo-video"),this.domVideoMuteBtn=document.querySelector("#video-overlay__mute-btn"),this.domMobileCloseButton=document.querySelector("#video-overlay__mobile-close-btn"),this.domVideoInner=document.getElementById("video-overlay__inner"),browser.isMobile?this.initMobilePlayer():this.initDesktopPlayer(),this.domVideoContainer.addEventListener("click",()=>{this.close()}),this.domMobileCloseButton.addEventListener("click",()=>{this.close()}),this.hasInitialized=!0)}initDesktopPlayer(){this.usesNativePlayer=!1,this.domVideoMuteBtn.onmouseenter=()=>this.isControlsHover=!0,this.domVideoMuteBtn.onmouseleave=()=>this.isControlsHover=!1;const e={url:VIDEO_LIST.MAIN_VIDEO_REEL,width:"100%",height:"100%",responsive:!0,title:!1,controls:!1,byline:!1,dnt:!0};this.videoPlayer=new Player("video-overlay__vimeo-video",e),this.videoPlayer.element.style.pointerEvents="none",this.videoPlayer.getVideoWidth().then(t=>this.videoWidth=t),this.videoPlayer.getVideoHeight().then(t=>this.videoHeight=t),this.videoPlayer.getDuration().then(t=>this.videoDuration=t),this.domVideoInner.onmouseenter=()=>this.isVideoHover=!0,this.domVideoInner.onmouseleave=()=>this.isVideoHover=!1,this.domVideoInner.addEventListener("click",t=>{t.stopPropagation(),this.togglePlayPause()}),this.videoPlayer.on("ended",()=>{this.close()}),this.videoPlayer.on("play",()=>{this.isVideoPlaying=!0,this.isOpened||this.videoPlayer.pause().catch(()=>{})}),this.videoPlayer.on("pause",()=>{this.isVideoPlaying=!1}),this.domVideoMuteBtn.onclick=t=>{t.stopPropagation(),this.isVideoMuted?(this.videoPlayer.setVolume(1),this.isVideoMuted=!1,this.domVideoMuteBtn.classList.remove("is-muted")):(this.videoPlayer.setVolume(0),this.isVideoMuted=!0,this.domVideoMuteBtn.classList.add("is-muted"))}}initMobilePlayer(){this.usesNativePlayer=!0,this.domVideoCursor&&(this.domVideoCursor.style.display="none"),this.domVideoInner.addEventListener("click",e=>{e.stopPropagation(),this.videoPlayer&&this.togglePlayPause()}),this.domVideoMuteBtn.onclick=e=>{e.stopPropagation(),this.videoPlayer&&(this.isVideoMuted?(this.videoPlayer.setVolume(1),this.isVideoMuted=!1,this.domVideoMuteBtn.classList.remove("is-muted")):(this.videoPlayer.setVolume(0),this.isVideoMuted=!0,this.domVideoMuteBtn.classList.add("is-muted")))}}createMobileIframe(e=VIDEO_LIST.MAIN_VIDEO_REEL){this.destroyMobileIframe();const t=document.createElement("iframe");t.src=`${e}&autoplay=1&muted=1&controls=0&playsinline=1&title=0&byline=0&portrait=0`,t.style.cssText="width:100%;height:100%;border:none;",t.setAttribute("allow","autoplay; fullscreen; picture-in-picture; encrypted-media"),t.setAttribute("playsinline",""),this.domVimeoEntryPoint.appendChild(t),this.videoPlayer=new Player(t),this.videoPlayer.on("ended",()=>this.close()),this.videoPlayer.on("play",()=>this.isVideoPlaying=!0),this.videoPlayer.on("pause",()=>this.isVideoPlaying=!1),this.isVideoMuted=!0,this.domVideoMuteBtn.classList.add("is-muted")}destroyMobileIframe(){if(this.videoPlayer&&this.usesNativePlayer){try{this.videoPlayer.destroy()}catch{}this.videoPlayer=null}const e=this.domVimeoEntryPoint.querySelector("iframe");e&&e.remove(),this.isVideoPlaying=!1}prefetch(e=VIDEO_LIST.MAIN_VIDEO_REEL){this.usesNativePlayer||this.isPrefetched||this.isPrefetching||this.currentVideoId===e&&this.isVideoReady||(this.isPrefetching=!0,this.currentVideoId=e,this.videoPlayer.loadVideo(e).then(async()=>{this.videoWidth=await this.videoPlayer.getVideoWidth(),this.videoHeight=await this.videoPlayer.getVideoHeight(),this.videoDuration=await this.videoPlayer.getDuration(),this.isVideoReady=!0,this.isPrefetching=!1,this.isPrefetched=!0}))}initAndPlayVideo(e=VIDEO_LIST.MAIN_VIDEO_REEL){if(this.usesNativePlayer){this.open(e);return}if((this.isPrefetched||this.isVideoReady)&&this.currentVideoId===e){this.isPrefetched=!1,this.open();return}this.isVideoReady=!1,this.currentVideoId=e,this.videoPlayer.loadVideo(e).then(async()=>{this.videoWidth=await this.videoPlayer.getVideoWidth(),this.videoHeight=await this.videoPlayer.getVideoHeight(),this.videoDuration=await this.videoPlayer.getDuration(),this.isVideoReady=!0,this.open()})}init(){this.domVideoContainer.style.opacity=0,this.domVideoContainer.style.display="none"}resize(){this.hasInitialized}update(e){if(!this.hasInitialized)return;this.openedRatio=math.saturate(this.openedRatio+2*(this.isOpened?e:-e));const t=ease.quadInOut(this.openedRatio);if(this.domVideoContainer.style.opacity=t,this.domVideoContainer.style.display=this.openedRatio>0?"block":"none",!this.isOpened&&this.isVideoPlaying&&this.videoPlayer&&this.videoPlayer.pause().catch(()=>{}),this.openedRatio===0){this.usesNativePlayer&&this.videoPlayer&&this.destroyMobileIframe();return}if(!properties.useMobileLayout&&this.domVideoCursor){const r=input.mouseXY.x,a=input.mouseXY.y,o=(r*.5+.5)*properties.viewportWidth,s=(.5-a*.5)*properties.viewportHeight,c=(this.isControlsHover?.2:1)*this.openedRatio;let d="close";this.isVideoHover&&(d=this.isVideoPlaying?"pause":"play"),this.domVideoCursor.dataset.state=d,this.domVideoCursor.style.display="flex",this.domVideoCursor.style.transform=`translate3d(${o}px, ${s}px, 0) translate3d(-50%, -50%, 0) scale(${c})`}else this.domVideoCursor&&(this.domVideoCursor.style.display="none");this.playingRatio=math.saturate(this.playingRatio+e*(this.isVideoPlaying?1:-1));const i=this.playingRatio*(.5+.25*(Math.sin(.25*properties.time*Math.PI*2)+1));this.domVideoInner.style.setProperty("--pulse",i)}togglePlayPause(){this.videoPlayer&&(this.isVideoPlaying?this.videoPlayer.pause().catch(()=>{}):this.videoPlayer.play().catch(()=>{}))}open(e){if(this.isOpened=!0,this.usesNativePlayer){this.createMobileIframe(e);return}this.isVideoMuted=!1,this.domVideoMuteBtn.classList.remove("is-muted"),this.videoPlayer.setVolume(1),this.videoPlayer.setCurrentTime(0).catch(()=>{}),this.videoPlayer.play().catch(t=>{console.warn("Play blocked, trying muted:",t),this.videoPlayer.setVolume(0).then(()=>{this.videoPlayer.play().catch(()=>{})}),this.isVideoMuted=!0,this.domVideoMuteBtn.classList.add("is-muted")})}close(){if(this.isOpened=!1,this.usesNativePlayer){this.videoPlayer&&this.videoPlayer.pause().catch(()=>{});return}this.videoPlayer.pause().catch(()=>{}),this.videoPlayer.setCurrentTime(0).catch(()=>{})}}const videoOverlay=new VideoOverlay,vert$1=`#define GLSLIFY 1
attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`,frag$1=`#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_textureSize;uniform vec2 u_resolution;uniform vec3 u_baseColor;uniform float u_time;uniform float u_offset;uniform float u_activeRatio;uniform vec3 u_bgColor;
#include <textureBicubic>
#include <colorspace_pars_fragment>
#include <linearstep>
void main(){vec2 uv=gl_FragCoord.xy/u_resolution*vec2(1.,u_resolution.y/u_resolution.x)+vec2(0.,u_offset);vec3 info=textureBicubic(u_texture,uv,u_textureSize).rgb;float line=pow(info.r,u_resolution.y/200.);float level=info.g;float shadow=info.b;vec3 color=u_baseColor;color+=smoothstep(0.4,0.,abs(fract(level-u_time*0.1)-.5))*vec3(0.0075,0.006,0.004);float t=fract(uv.x+uv.y-u_time*.4);t=smoothstep(0.5,.8,t)*smoothstep(1.,.8,t);color+=min(0.005,line*0.05)+line*mix(0.,0.05,t);color*=.4+.6*shadow;gl_FragColor=vec4(color,1.0);gl_FragColor=sRGBTransferOETF(gl_FragColor);gl_FragColor.rgb=mix(u_bgColor,gl_FragColor.rgb,u_activeRatio);gl_FragColor.a=u_activeRatio;}`;let _mesh$2;class Terrain{container=new Object3D;isVisible=!1;pathBasedMix=0;activeRatio=0;homeSectionActiveRatio=0;offsetY=0;clipTop=0;preInit(){const e=new DataTexture(new Uint8Array([0,0,0,255]),1,1);e.needsUpdate=!0,_mesh$2=new Mesh(fboHelper.triGeom,fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:e},u_resolution:properties.sharedUniforms.u_resolution,u_textureSize:{value:new Vector2(1024,1024)},u_offset:{value:0},u_baseColor:{value:new Color("#181818")},u_time:properties.sharedUniforms.u_time,u_bgColor:{value:new Color("#000000")},u_activeRatio:{value:0}},blueNoise.sharedUniforms),vertexShader:vert$1,fragmentShader:frag$1,derivatives:!0,glslVersion:GLSL3,depthWrite:!1,depthTest:!1,transparent:!0,blending:CustomBlending,blendEquation:AddEquation,blendSrc:SrcAlphaFactor,blendDst:OneMinusSrcAlphaFactor,blendEquationAlpha:AddEquation,blendSrcAlpha:SrcAlphaFactor,blendDstAlpha:OneMinusSrcAlphaFactor})),_mesh$2.frustumCulled=!1,_mesh$2.renderOrder=5,this.container.add(_mesh$2)}textureReady=!1;textureRatio=0;loadTexture(){this.pendingTexture=properties.loader.add(settings.TEXTURE_PATH+"TERRAIN/HEIGHT.webp",{type:"texture",minFilter:LinearFilter,magFilter:LinearFilter,wrapT:RepeatWrapping}).content}activateTexture(){_mesh$2.material.uniforms.u_texture.value.dispose(),_mesh$2.material.uniforms.u_texture.value=this.pendingTexture,this.textureReady=!0}init(){}resize(e,t){}preUpdate(e){}update(e){_mesh$2.material.uniforms.u_offset.value=-(scrollManager.scrollView*properties.viewportHeight)/properties.viewportWidth;const t=routeManager.currPath==="";this.pathBasedMix=math.saturate(this.pathBasedMix+(t?1:-1)*e*2);const i=math.mix(this.activeRatio,this.homeSectionActiveRatio,this.pathBasedMix);this.textureRatio=Math.min(1,this.textureRatio+(this.textureReady?e*2:0)),_mesh$2.material.uniforms.u_activeRatio.value=i*this.textureRatio,_mesh$2.material.uniforms.u_bgColor.value.copy(properties.bgColor)}}const terrain=new Terrain;let _domContainer$7,_domInner$4,_domNavContainer,_domNavList,_domTitleList,_domNumberList,_domDesc2Container,_domDesc2List,_copy1SplitText=[],_copy2SplitText=[],_domTitleLeftLine,_domLines=[],_engineIndex=0,backgroundYRatio$2=0,backgroundYFrom$2=0,backgroundYOnShow$2=0,isEntered$2=!1,prevIsEntered$2=!1;class HomeMotorSection extends Section{prevNavIndex=0;navIndex=0;preInit(e){super.preInit(e,"home-motor"),_domContainer$7=this.domContainer,_domInner$4=_domContainer$7.querySelector(".section__inner"),_domNavContainer=_domContainer$7.querySelector("#home-motor__nav-list"),_domNavList=_domNavContainer.querySelectorAll("li"),_domContainer$7.querySelector("#home-motor__title"),_domTitleList=_domContainer$7.querySelectorAll("#home-motor__title-list span"),_domTitleLeftLine=_domContainer$7.querySelector("#home-motor__title > span:first-child"),_domTitleLeftLine.classList.add("is-active"),_domNumberList=_domContainer$7.querySelectorAll("#home-motor__number-list span"),_domDesc2Container=_domContainer$7.querySelector("#home-motor__desc-2"),_domDesc2List=_domDesc2Container.querySelectorAll("p"),_domLines=_domContainer$7.querySelectorAll("#home-motor__lines span"),_domLines.forEach((t,i)=>{t._activeRatio=i===0?1:0}),_domNumberList.forEach((t,i)=>{t._yOffset=i===0?0:-1}),_domDesc2List.forEach((t,i)=>{const r=SplitText.create(t,{type:"lines,words",autoSplit:!1});_copy2SplitText.push(r)}),_domNavList.forEach((t,i)=>{t.addEventListener("click",()=>{const r=scrollManager.getDomRange(this.domContainer),a=r.top+r.height*i/_domNavList.length;scrollManager.scrollToPixel(a)})})}init(){super.init(),this.updateNav()}show(){isEntered$2=!0,prevIsEntered$2=!1,backgroundYOnShow$2=backgroundGrid.yOffset}hide(){isEntered$2=!1}resize(e,t){super.resize(e,t),_copy1SplitText.forEach(i=>{i.split(),i._showRatio=0,i.lines.forEach((r,a)=>{r.style.overflow="hidden"})}),_copy2SplitText.forEach(i=>{i.split(),i._showRatio=0,i.lines.forEach((r,a)=>{r.style.overflow="hidden"})})}updateNav(){this.titleRatio=0;for(let e=0;e<_domNavList.length;e++)_domNavList[e].classList.remove("is-active"),_domTitleList[e].classList.remove("is-active"),_domTitleList[e].classList.remove("is-next"),_domNumberList[e].classList.remove("is-active"),_domNumberList[e].classList.remove("is-next"),e===this.navIndex&&(_domNavList[e].classList.add("is-active"),_domNumberList[e].classList.add("is-active"),_domTitleList[e].classList.add("is-active")),e<this.navIndex&&(_domNumberList[e].classList.add("is-next"),_domTitleList[e].classList.add("is-next"));this.navIndex===2?_domTitleLeftLine.classList.remove("is-active"):_domTitleLeftLine.classList.add("is-active")}copyAnimation(e,t,i){const r=i===this.navIndex&&this.navIndex===this.prevNavIndex,a=i===this.prevNavIndex&&this.navIndex!==this.prevNavIndex;t._showRatio+=2*e*(r?1:-1),t._showRatio=math.saturate(t._showRatio),a&&t._showRatio===0&&(this.prevNavIndex=this.navIndex);for(let o=0,s=t.words.length;o<s;o++){let l=o/(s-1),c=t.words[o],d=math.fit(t._showRatio,l*.15,.45+l*.15,1,0,ease.cubicOut);c.style.transform=`translate3d(0,${d*100}%, 0)`,c.style.opacity=math.fit(t._showRatio,l*.15,l*.15+.4,0,1)}t.elements.forEach((o,s)=>{o.style.display=t._showRatio===0?"none":"block"})}update(e){properties.useMobileLayout,super.update(e);const t=math.fit(homePage.pageTime,0,.33,0,1),i=scrollManager.getDomRange(this.domContainer),r=i.showScreenOffset,a=i.hideScreenOffset;let o=Math.min(0,-i.screenY);const s=math.fit(r,.5,1,0,1);_domInner$4.style.transform=`translateY(${o}px)`,_domInner$4.style.opacity=s*t,_domInner$4.style.visibility=s>0?"visible":"hidden",backgroundGrid.alpha=math.mix(backgroundGrid.alpha,1,s),backgroundGrid.gradientRatio=math.mix(backgroundGrid.gradientRatio,0,s===0?0:1);let l=-Math.min(0,i.screenY+properties.viewportHeight*(i.viewSize-1));l=math.mix(backgroundGrid.yOffset,l,s===0?0:1),isEntered$2&&!prevIsEntered$2&&(Math.abs(l-backgroundYOnShow$2)<properties.viewportHeight*.35&&i.isActive?(backgroundYFrom$2=backgroundYOnShow$2,backgroundYRatio$2=0):(backgroundYFrom$2=l,backgroundYRatio$2=1)),backgroundYRatio$2=backgroundYRatio$2+e*2,backgroundGrid.yOffset=math.fit(backgroundYRatio$2,0,1,backgroundYFrom$2,l,ease.expoOut);const c=math.fit(i.ratio,-.75,.75,0,4),d=math.clamp(Math.floor(c),0,3);d!==this.navIndex&&(this.navIndex=d,this.updateNav()),_copy1SplitText.forEach((u,h)=>this.copyAnimation(e,u,h)),_copy2SplitText.forEach((u,h)=>this.copyAnimation(e,u,h)),_domLines.forEach((u,h)=>{const _=h===this.navIndex;u._activeRatio+=4*e*(_?1:-1),u._activeRatio=math.saturate(u._activeRatio);const v=ease.cubicOut(u._activeRatio);u.style.transform=`translate(-${50*v}%, 0) scale(${1+1*v}, 1)`}),engine.activeRatio*=math.fit(i.hideScreenOffset,-1,0,1,0),visuals.viewOffsetY=math.fit(i.hideScreenOffset,-1,0,0,-1);let f=math.clamp(Math.floor(c),0,4)+(r>.9?1:0);_engineIndex=math.mix(_engineIndex,f,1-Math.exp(-e*5)),engine.animation=_engineIndex,homePage.useWarmWhite=r<.5,terrain.homeSectionActiveRatio=math.fit(a,-1,0,0,1),prevIsEntered$2=isEntered$2}}const homeMotorSection=new HomeMotorSection;let _domContainer$6,_domInner$3,_domTitle$6,_domTitleSplitText$1,_domDesc,_domDescSplitText;class HomeDroneSection extends Section{prevNavIndex=0;navIndex=0;preInit(e){super.preInit(e,"home-drone"),_domContainer$6=this.domContainer,_domInner$3=_domContainer$6.querySelector(".section__inner"),_domTitle$6=_domContainer$6.querySelector(".hero-title"),_domTitleSplitText$1=SplitText.create(_domTitle$6,{type:"words,chars",charsClass:"char",mask:"chars",autoSplit:!1}),_domDesc=_domContainer$6.querySelector("#home-drone__desc p"),_domDescSplitText=SplitText.create(_domDesc,{type:"lines,words",wordsClass:"word",autoSplit:!1})}init(){super.init()}resize(e,t){super.resize(e,t),_domTitleSplitText$1.split(),_domDescSplitText.split();let i=math.getSeedRandomFn("home-drone-0");for(let r=0;r<_domTitleSplitText$1.chars.length;r++){let a=_domTitleSplitText$1.chars[r];a.__rand=i()}for(let r=0;r<_domDescSplitText.words.length;r++){let a=_domDescSplitText.words[r];a.__rand=i()}}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=t.showScreenOffset,r=t.hideScreenOffset;if(hero.animation=math.fit(i,-1,1,hero.animation,2),hero.animation=math.fit(r,-1,0,hero.animation,3),hero.activeRatio=math.fit(r,-1,0,1,0),engine.activeRatio=math.fit(r,-1,0,0,1),this.domContainer.style.visibility=t.isActive?"visible":"hidden",!t.isActive)return;let a=Math.min(0,-t.screenY);a-=Math.min(0,t.screenY+properties.viewportHeight),_domInner$3.style.transform=`translateY(${a}px)`;for(let o=0;o<_domTitleSplitText$1.chars.length;o++){let s=_domTitleSplitText$1.chars[o],l=o/(_domTitleSplitText$1.chars.length-1),c=s.__rand*.7,d=math.fit(i,l*.5,l*.5+.5,0,1,ease.expoOut),f=math.fit(i,c+1.5,c+2,0,1);s.style.transform=`translateY(${math.fit(d,0,1,1,0)}em)`,s.style.opacity=1-f}for(let o=0;o<_domDescSplitText.words.length;o++){let s=_domDescSplitText.words[o],l=o/(_domDescSplitText.words.length-1),c=s.__rand*.7,d=math.fit(i,l*1,l*1+.2,0,1),f=math.fit(i,c+1.5,c+2,0,1);s.style.opacity=d*(1-f)}}}const homeDroneSection=new HomeDroneSection;let _domContainer$5,_domInner$2,_domTitle$5,_domTitleSplitText;class HomeIntroSection extends Section{prevNavIndex=0;navIndex=0;preInit(e){super.preInit(e,"home-intro"),_domContainer$5=this.domContainer,_domInner$2=_domContainer$5.querySelector(".section__inner"),_domTitle$5=_domInner$2.querySelector("#home-intro__copy"),_domTitleSplitText=SplitText.create(_domTitle$5,{type:"lines,words,chars",charsClass:"char",autoSplit:!1})}init(){super.init()}resize(e,t){super.resize(e,t),_domTitleSplitText.split()}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer);_domContainer$5.style.visibility=t.isActive?"visible":"hidden";let i=math.fit(t.ratio,-.6,-.2,0,1),r=math.fit(t.ratio,.2,.6,0,1);_domTitleSplitText.chars.forEach((a,o)=>{let s=o/(_domTitleSplitText.chars.length-1),l=math.fit(i,s*.7,s*.7+.3,0,1,ease.cubicOut),c=math.fit(r,s*.7,s*.7+.3,0,1,ease.cubicIn),d=math.fit(l,0,1,.2,0);d=math.fit(c,0,1,d,.2,ease.cubicIn),a.style.filter="blur("+d+"em)",a.style.opacity=l*(1-c)})}}const homeIntroSection=new HomeIntroSection;class ParagraphAnimation{constructor(e,t){t=t||[e],this.element=e,this.targetList=t,this.splitTexts=[],this.isActive=!1,this.activeTime=0,this.wordStagger=.0075,this.wordDuration=.75,this.wordCount=0,e.classList.add("p-animation");for(let i=0;i<t.length;i++){let r=t[i],a=new SplitText(r,{type:"lines,words",wordsClass:"word",autoSplit:!1});this.splitTexts.push(a)}}resize(e,t){for(let i=0;i<this.splitTexts.length;i++)this.splitTexts[i].split()}reset(){if(this.isActive=!1,this.wordCount=0,this.activeTime>0)for(let e=0;e<this.splitTexts.length;e++){let t=this.splitTexts[e];for(let i=0;i<t.words.length;i++){let r=t.words[i];r.style.opacity=0,this.wordCount++}}this.activeTime=0}update(e){let t=scrollManager.getDomRange(this.element);if(t.showScreenOffset>0){let i=t.showScreenOffset>.25;i&&!this.isActive&&(this.isActive=!0),this.activeTime=this.activeTime+(i?1:0)*e;for(let r=0,a=0;r<this.splitTexts.length;r++){let o=this.splitTexts[r];for(let s=0;s<o.words.length;s++,a++){let l=o.words[s],c=math.fit(this.activeTime,a*this.wordStagger,a*this.wordStagger+this.wordDuration,0,1);l.style.opacity=c}}}else this.reset()}}class TitleAnimation{constructor(e,t){this.element=e,this.target=t=t||e,this.splitText,this.isActive=!1,this.activeTime=0,this.charStagger=.04,this.charDuration=.75,e.classList.add("t-animation"),this.splitText=new SplitText(t,{type:"lines,words,chars",charsClass:"char",mask:"chars",autoSplit:!1})}resize(e,t){this.splitText.split()}reset(){this.isActive=!1,this.activeTime>0&&this.splitText.chars.forEach(e=>{e.style.transform="translateZ(0)"}),this.activeTime=0}update(e){let t=scrollManager.getDomRange(this.element);if(t.showScreenOffset>0){let i=t.showScreenOffset>.25;i&&!this.isActive&&(this.isActive=!0),this.activeTime=this.activeTime+(i?1:0)*e,this.splitText.chars.forEach((r,a)=>{let o=math.fit(this.activeTime,a*this.charStagger,a*this.charStagger+this.charDuration,0,1,ease.expoOut);r.style.transform=`translateY(${math.fit(o,0,1,1.2,0)}em)`})}else this.reset()}}let _domContainer$4,_copyParagraphAnimation,_domImageWrapper,_domImage$1;class HomeThesisSection extends Section{preInit(e){super.preInit(e,"home-thesis"),_domContainer$4=this.domContainer;let t=_domContainer$4.querySelector("#home-thesis__copy"),i=t.querySelector("p");_copyParagraphAnimation=new ParagraphAnimation(t,i.querySelectorAll("span")),_domImageWrapper=_domContainer$4.querySelector("#home-thesis__image"),_domImage$1=_domImageWrapper.querySelector("img")}init(){super.init()}resize(e,t){super.resize(e,t),_copyParagraphAnimation.resize(e,t)}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer);visuals.viewOffsetY=t.showScreenOffset>=1?0:visuals.viewOffsetY;let i=scrollManager.getDomRange(_domImageWrapper);_domImage$1.style.transform=`scale(${math.fit(i.ratio,-1,1,1.25,1)})`,t.isActive?_copyParagraphAnimation.update(e):_copyParagraphAnimation.reset()}}const homeThesisSection=new HomeThesisSection;let _domContainer$3,_domInner$1,_domTitle$4,_domBgImage,_titleAnimation$3;class HomeBuildToSpecSection extends Section{preInit(e){super.preInit(e,"home-build-to-spec"),_domContainer$3=this.domContainer,_domInner$1=_domContainer$3.querySelector(".section__inner"),_domTitle$4=_domContainer$3.querySelector("#home-build-to-spec-title"),_domBgImage=_domContainer$3.querySelector("#home-build-to-spec__bgimage"),_titleAnimation$3=new TitleAnimation(_domTitle$4)}init(){super.init()}resize(e,t){super.resize(e,t),_domTitle$4.getBoundingClientRect(),_titleAnimation$3.resize(e,t)}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(_domInner$1),r=scrollManager.getDomRange(_domTitle$4);if(t.showScreenOffset>=0){let a=.5*properties.viewportHeight-(r.screenY-i.screenY+r.height*.5);backgroundGrid.yOffset=a-t.screenY}backgroundGrid.width=math.fit(t.showScreenOffset,.5,1,backgroundGrid.width,r.width),backgroundGrid.height=math.fit(t.showScreenOffset,.5,1,backgroundGrid.height,r.height),_domBgImage.style.transform=`scale(${math.fit(t.showScreenOffset,0,1,1.75,1)})`,t.isActive?_titleAnimation$3.update(e):_titleAnimation$3.reset()}}const homeBuildToSpecSection=new HomeBuildToSpecSection;class HomeSpecsItem{domContainer;title;titleSplitText;desc;descSplitText;icons;sd;sdItems;isActive=!0;showRatio=0;width=0;height=0;forcedUpdate=!1;rands=[];constructor(e,t){this.domContainer=e,this.title=this.domContainer.querySelector("h6"),this.titleSplitText=SplitText.create(this.title,{type:"words,chars",charsClass:"char",autoSplit:!1}),this.desc=this.domContainer.querySelector(".caption1"),this.descSplitText=SplitText.create(this.desc,{type:"lines,words",wordsClass:"word",autoSplit:!1}),this.icons=this.domContainer.querySelectorAll("li"),this.sd=this.domContainer.querySelector(".squares-decorator"),this.sdItems=this.sd.querySelectorAll("span")}resize(e,t){let i=this.domContainer.getBoundingClientRect();this.width=i.width,this.height=i.height,this.titleSplitText.split(),this.descSplitText.split(),this.forcedUpdate=!0}reset(){this.showRatio=0,this.blinkTime=0,this.domContainer.style.visibility="hidden"}update(e){if(this.isActive){let t=math.saturate(this.showRatio+e*.75);if(t!==this.showRatio||this.forcedUpdate){this.showRatio=t,this.forcedUpdate=!1;let i=math.fit(t,0,.5,0,1,ease.expoOut),r=math.mix(0,this.width,i),a=math.mix(0,this.height,i);this.sd.style.width=r+"px",this.sd.style.height=a+"px",this.sd.style.transform=`translate(${(this.width-r)/2}px, ${(this.height-a)/2}px)`;for(let o=0;o<this.titleSplitText.chars.length;o++){let s=this.titleSplitText.chars[o],l=o/(this.titleSplitText.chars.length-1),c=math.fit(t,l*.5,l*.5+.3,0,1);s.style.opacity=c}for(let o=0;o<this.descSplitText.words.length;o++){let s=this.descSplitText.words[o],l=o/(this.descSplitText.words.length-1),c=math.fit(t,l*.5+.2,l*.5+.5,0,1);s.style.opacity=c}for(let o=0;o<this.icons.length;o++){let s=this.icons[o],l=o/(this.icons.length-1),c=math.fit(t,l*.3+.4,l*.3+.7,0,1);s.style.opacity=c}}this.domContainer.style.visibility="visible"}else this.reset()}}const vert=`#define GLSLIFY 1
attribute vec3 position;attribute vec2 uv;varying vec2 v_uv;uniform vec4 u_xywh;uniform vec2 u_resolution;uniform vec2 u_viewportResolution;void main(){vec2 pos=position.xy;pos*=u_xywh.zw/u_viewportResolution;vec2 centerPx=u_xywh.xy+u_xywh.zw*0.5;vec2 centerClip=(centerPx/u_viewportResolution)*2.0-1.0;centerClip.y*=-1.0;pos+=centerClip;gl_Position=vec4(pos,0.,1.);v_uv=uv;}`,frag=`#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_textureFront;uniform sampler2D u_textureBack;uniform sampler2D u_screenPaintTexture;uniform vec2 u_screenPaintTexelSize;uniform vec2 u_resolution;uniform float u_opacity;
#include <textureBicubic>
#include <colorspace_pars_fragment>
#include <linearstep>
#include <getBlueNoise>
void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy+vec2(17.,29.));vec2 screeUv=gl_FragCoord.xy/u_resolution;vec4 data=texture2D(u_screenPaintTexture,screeUv);float weight=(data.z+data.w)*0.5;vec2 vel=0.01*(0.5-data.xy-0.001)*2.*weight;vec2 uv=v_uv+bnoise.xy*vel;vec4 colorFront=vec4(0.0);for(int i=0;i<9;i++){colorFront+=texture2D(u_textureFront,uv);uv+=vel;}colorFront/=9.;vec4 colorBack=texture2D(u_textureBack,v_uv);vec3 color=0.5*mix(colorFront.rgb,colorBack.rgb,weight);float alpha=max(colorFront.a,colorBack.a);alpha*=0.75*smoothstep(0.0,0.75,v_uv.y);gl_FragColor=vec4(color,alpha*u_opacity);}`;let _mesh$1;class Robot{container=new Object3D;isVisible=!1;width=0;height=0;xOffset=0;yOffset=0;pathBasedRatio=0;preInit(){let e=properties.loader.add(settings.TEXTURE_PATH+"ROBOT/ROBOT.webp",{type:"texture",minFilter:LinearFilter,magFilter:LinearFilter}).content,t=properties.loader.add(settings.TEXTURE_PATH+"ROBOT/ROBOT_2.png",{type:"texture",minFilter:LinearFilter,magFilter:LinearFilter}).content;_mesh$1=new Mesh(new PlaneGeometry(2,2),fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_resolution:properties.sharedUniforms.u_resolution,u_viewportResolution:properties.sharedUniforms.u_viewportResolution,u_offset:{value:0},u_opacity:{value:0},u_xywh:{value:new Vector4},u_textureFront:{value:e},u_textureBack:{value:t},u_screenPaintTexture:screenPaint.sharedUniforms.u_currPaintTexture,u_screenPaintTexelSize:screenPaint.sharedUniforms.u_paintTexelSize},blueNoise.sharedUniforms),vertexShader:vert,fragmentShader:frag,derivatives:!0,glslVersion:GLSL3,depthWrite:!1,depthTest:!1,transparent:!0,blending:CustomBlending,blendEquation:AddEquation,blendSrc:SrcAlphaFactor,blendDst:OneMinusSrcAlphaFactor,blendEquationAlpha:AddEquation,blendSrcAlpha:SrcAlphaFactor,blendDstAlpha:OneMinusSrcAlphaFactor})),_mesh$1.frustumCulled=!1,_mesh$1.renderOrder=10,this.container.add(_mesh$1)}init(){}resize(e,t){}preUpdate(e){}update(e){const t=routeManager.currPath==="";this.pathBasedRatio=math.saturate(this.pathBasedRatio+(t?1:-1)*e*3.33);const i=this.isVisible&&this.pathBasedRatio>0;_mesh$1.visible=i,_mesh$1.material.uniforms.u_xywh.value.set(this.xOffset,this.yOffset,this.width,this.height),_mesh$1.material.uniforms.u_opacity.value=this.pathBasedRatio}}const robot=new Robot;let _domContainer$2,_domInner,_domTitle$3,_domTitleTexts,_domTitleTextSplitTexts=[],_domLogo,_domImage,_items=[],_isLogoActive=!1,_logoTime=0;class HomeSpecsSection extends Section{preInit(e){super.preInit(e,"home-specs"),_domContainer$2=this.domContainer,_domInner=_domContainer$2.querySelector(".section__inner"),_domImage=_domContainer$2.querySelector("#home-specs__image"),_domTitle$3=_domInner.querySelector("#home-specs__title"),_domTitleTexts=_domInner.querySelectorAll("#home-specs__title > span:first-child > span:first-child, #home-specs__title > span:first-child > span:last-child, #home-specs__title> span:last-child");for(let i=0;i<_domTitleTexts.length;i++)_domTitleTextSplitTexts.push(SplitText.create(_domTitleTexts[i],{type:"words,chars",charsClass:"char",autoSplit:!1}));_domLogo=_domTitle$3.querySelector("svg");let t=_domInner.querySelectorAll("#home-specs__list > ul > li");for(let i=0;i<t.length;i++)_items.push(new HomeSpecsItem(t[i],i))}init(){super.init()}resize(e,t){super.resize(e,t);for(let i=0;i<_items.length;i++)_items[i].resize(e,t);for(let i=0;i<_domTitleTextSplitTexts.length;i++)_domTitleTextSplitTexts[i].split()}update(e){if(properties.useMobileLayout,super.update(e),scrollManager.getDomRange(this.domContainer).isActive){const r=scrollManager.getDomRange(_domLogo);r.showScreenOffset>.2&&r.showScreenOffset<.8&&(_isLogoActive=!0),_logoTime=math.saturate(_logoTime+(_isLogoActive?e:0)),_domLogo.style.transform=`rotate(${scrollManager.scrollView*1e3}deg) scale(${math.fit(_logoTime,0,.5,.75,1)})`,_domLogo.style.opacity=math.fit(_logoTime,0,.5,0,1);for(let a=0;a<_domTitleTextSplitTexts.length;a++)_domTitleTextSplitTexts[a].chars.forEach((o,s)=>{let l=s/(_domTitleTextSplitTexts[a].chars.length-1);a==2?l=Math.abs(l-.5)*2:a==0&&(l=1-l);let c=math.fit(_logoTime,l*.3,l*.3+.7,0,1);o.style.opacity=c,o.style.filter=`blur(${math.fit(c,0,1,.1,0)}em)`});for(let a=0;a<_items.length;a++){let o=_items[a],s=scrollManager.getDomRange(o.domContainer);s.isActive?s.showScreenOffset>.25&&(o.isActive=!0):o.isActive=!1,o.update(e)}}else{_isLogoActive=!1,_logoTime=0;for(let r=0;r<_items.length;r++)_items[r].reset()}const i=scrollManager.getDomRange(_domImage);robot.xOffset=i.screenX,robot.yOffset=i.screenY,robot.width=i.width,robot.height=i.height,robot.isVisible=i.isActive}}const homeSpecsSection=new HomeSpecsSection,galleryTextures=[{texture:null,url:"gallery/4.webp",width:1600,height:970,mobileWidth:800,mobileHeight:485},{texture:null,url:"gallery/2.webp",width:1600,height:1067,mobileWidth:800,mobileHeight:533},{texture:null,url:"gallery/3.webp",width:1600,height:970,mobileWidth:800,mobileHeight:485},{texture:null,url:"gallery/1.webp",width:1600,height:970,mobileWidth:800,mobileHeight:485},{texture:null,url:"gallery/5.webp",width:1600,height:1067,mobileWidth:800,mobileHeight:533},{texture:null,url:"gallery/6.webp",width:1600,height:970,mobileWidth:800,mobileHeight:485}],galleryVert=`#define GLSLIFY 1
attribute vec3 position;attribute vec2 uv;varying vec2 v_uv;varying vec2 v_currentUv;varying vec2 v_nextUv;uniform float u_zoom;uniform vec2 u_currTextureSize;uniform vec2 u_nextTextureSize;uniform vec2 u_viewportResolution;uniform vec4 u_xywh;vec2 getCoverUv(vec2 uv,vec2 textureSize){vec2 _uv=uv-0.5;float containerRatio=u_xywh.z/u_xywh.w;float textureRatio=textureSize.x/textureSize.y;if(textureRatio>containerRatio){_uv=_uv*vec2(containerRatio/textureRatio,1.);}else{_uv=_uv*vec2(1.0,textureRatio/containerRatio);}return _uv*(1.0/u_zoom)+0.5;}void main(){vec2 pos=position.xy;pos*=u_xywh.zw/u_viewportResolution;vec2 centerPx=u_xywh.xy+u_xywh.zw*0.5;vec2 centerClip=(centerPx/u_viewportResolution)*2.0-1.0;centerClip.y*=-1.0;pos+=centerClip;gl_Position=vec4(pos,0.,1.);v_uv=uv;v_currentUv=getCoverUv(uv,u_currTextureSize);v_nextUv=getCoverUv(uv,u_nextTextureSize);}`,galleryFrag=`#define GLSLIFY 1
varying vec2 v_uv;varying vec2 v_currentUv;varying vec2 v_nextUv;uniform sampler2D u_currTexture;uniform sampler2D u_nextTexture;uniform vec2 u_currTextureSize;uniform vec2 u_nextTextureSize;uniform float u_ratio;uniform float u_opacity;
#include <getBlueNoise>
#include <sampleBlur>
#include <colorspace_pars_fragment>
float sat(float x){return clamp(x,0.,1.);}void main(){vec3 bNoise=getBlueNoise(gl_FragCoord.xy);float yStagger=.5;float t=smoothstep(0.,1.,u_ratio*(1.+yStagger)-v_uv.y*yStagger);vec2 nextUv=v_nextUv;nextUv-=0.5;nextUv=nextUv*(0.92+0.08*u_ratio);nextUv+=0.5;vec3 currTexture=sampleBlur(u_currTexture,v_currentUv,vec2(1.)/u_currTextureSize,30.*t,bNoise.z).rgb;vec3 nextTexture=sampleBlur(u_nextTexture,nextUv,vec2(1.)/u_nextTextureSize,30.*(1.-t),bNoise.z).rgb;vec3 color=mix(currTexture,nextTexture,t);gl_FragColor=sRGBTransferOETF(vec4(vec3(color),u_opacity));}`;let _mesh;class Gallery{container=new Object3D;isVisible=!1;width=0;height=0;xOffset=0;yOffset=0;imageIndex=0;nextImageIndex=0;ratio=0;zoom=0;pathBasedRatio=0;preInit(){_mesh=new Mesh(new PlaneGeometry(2,2),fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_ratio:{value:0},u_zoom:{value:1},u_currTexture:{value:null},u_currTextureSize:{value:new Vector2},u_nextTexture:{value:null},u_nextTextureSize:{value:new Vector2},u_viewportResolution:properties.sharedUniforms.u_viewportResolution,u_xywh:{value:new Vector4},u_opacity:{value:0}},blueNoise.sharedUniforms),transparent:!0,derivatives:!0,glslVersion:GLSL3,depthWrite:!1,depthTest:!1,transparent:!0,blending:CustomBlending,blendEquation:AddEquation,blendSrc:SrcAlphaFactor,blendDst:OneMinusSrcAlphaFactor,blendEquationAlpha:AddEquation,blendSrcAlpha:SrcAlphaFactor,blendDstAlpha:OneMinusSrcAlphaFactor,vertexShader:galleryVert,fragmentShader:galleryFrag})),_mesh.material.defines.BLUR_SAMPLE=16,_mesh.renderOrder=10,this.container.add(_mesh);for(const e in galleryTextures){const t=galleryTextures[e],i=browser.isMobile?properties.getMobileUrl(settings.TEXTURE_PATH+t.url):settings.TEXTURE_PATH+t.url,r=properties.loader.add(i,{type:"texture",minFilter:LinearFilter,magFilter:LinearFilter,colorSpace:SRGBColorSpace}).content;t.texture=r}}init(){}resize(e,t){}preUpdate(e){}update(e){const t=routeManager.currPath==="";this.pathBasedRatio=math.saturate(this.pathBasedRatio+(t?1:-1)*e*3.33);const i=this.isVisible&&this.pathBasedRatio>0;_mesh.visible=i,_mesh.material.uniforms.u_xywh.value.set(this.xOffset,this.yOffset,this.width,this.height),_mesh.material.uniforms.u_ratio.value=ease.cubicInOut(this.ratio),_mesh.material.uniforms.u_zoom.value=this.zoom,_mesh.material.uniforms.u_opacity.value=this.pathBasedRatio;const r=galleryTextures[this.imageIndex],a=galleryTextures[this.nextImageIndex];if(r){const o=browser.isMobile?[r.mobileWidth,r.mobileHeight]:[r.width,r.height];_mesh.material.uniforms.u_currTexture.value=r.texture,_mesh.material.uniforms.u_currTextureSize.value.set(o[0],o[1])}if(a){const o=browser.isMobile?[a.mobileWidth,a.mobileHeight]:[a.width,a.height];_mesh.material.uniforms.u_nextTextureSize.value.set(o[0],o[1]),_mesh.material.uniforms.u_nextTexture.value=a.texture}}}const gallery=new Gallery;let _domContainer$1,_galleryContainer,_galleryWrapper,_thumbnailButtons,_activeIndex=0,_nextIndex=0,_selectedIndex=0,_isInTransition=!1,_pendingIndex=null;class HomeGallerySection extends Section{preInit(e){super.preInit(e,"home-gallery"),_domContainer$1=this.domContainer,_galleryContainer=_domContainer$1.querySelector(".main-images-container"),_galleryWrapper=_domContainer$1.querySelector(".main-images-wrapper"),_thumbnailButtons=_domContainer$1.querySelectorAll(".thumbnail-button"),_thumbnailButtons.forEach(t=>{t.addEventListener("click",()=>this.onThumbnailClick(t))})}onThumbnailClick=e=>{const t=Number(e.dataset.index);if(t===_selectedIndex)return;_thumbnailButtons[_selectedIndex].classList.remove("is-active"),_thumbnailButtons[t].classList.add("is-active"),_selectedIndex=t;const i=_galleryWrapper.querySelector("img");if(i&&(i.src=e.querySelector("img").src),_isInTransition){_pendingIndex=t;return}this.switchToImage(t)};switchToImage=e=>{e!==_activeIndex&&(_nextIndex=e)};init(){super.init()}resize(e,t){super.resize(e,t)}update(e){super.update(e);const t=scrollManager.getDomRange(_galleryContainer);_nextIndex!==_activeIndex&&gallery.ratio!==1?(_isInTransition=!0,gallery.ratio=math.saturate(gallery.ratio+e)):(_isInTransition=!1,_activeIndex=_nextIndex,gallery.ratio=0,_pendingIndex!==null&&(this.switchToImage(_pendingIndex),_pendingIndex=null)),gallery.imageIndex=_activeIndex,gallery.nextImageIndex=_nextIndex,gallery.zoom=math.fit(t.ratio,-1,1,1.25,1),gallery.xOffset=t.screenX,gallery.yOffset=t.screenY,gallery.width=t.width,gallery.height=t.height,gallery.isVisible=t.isActive}}const homeGallerySection=new HomeGallerySection;class HomePage extends Page{path="";id="home";useWarmWhite=!1;preInit(){const e=this.domContainer;homeHeroSection.preInit(e),homeIntroSection.preInit(e),homeDroneSection.preInit(e),homeMotorSection.preInit(e),homeThesisSection.preInit(e),homeGallerySection.preInit(e),homeSpecsSection.preInit(e),homeBuildToSpecSection.preInit(e)}init(){homeHeroSection.init(),homeIntroSection.init(),homeDroneSection.init(),homeMotorSection.init(),homeThesisSection.init(),homeGallerySection.init(),homeSpecsSection.init(),homeBuildToSpecSection.init()}show(e,t,i){const r=e&&e.path!==""&&window.location.hash==="#jdm";r&&(scrollManager.scrollTo("home-motor",0,!0),history.replaceState(null,"",window.location.pathname+window.location.search),requestAnimationFrame(()=>{scrollManager.scrollTo("home-motor",0,!0)}));const a=()=>{i()};homeHeroSection.show(),homeMotorSection.show(),super.show(e,t,a,r)}hide(e,t,i){const r=()=>{i()};homeHeroSection.hide(),homeMotorSection.hide(),super.hide(e,t,r),this.useWarmWhite=!1,document.documentElement.classList.remove("use-warm-white")}resize(e,t){homeHeroSection.resize(e,t),homeIntroSection.resize(e,t),homeDroneSection.resize(e,t),homeMotorSection.resize(e,t),homeThesisSection.resize(e,t),homeGallerySection.resize(e,t),homeSpecsSection.resize(e,t),homeBuildToSpecSection.resize(e,t)}update(e){super.update(e),homeHeroSection.update(e),homeIntroSection.update(e),homeDroneSection.update(e),homeMotorSection.update(e),homeThesisSection.update(e),homeGallerySection.update(e),homeSpecsSection.update(e),homeBuildToSpecSection.update(e),document.documentElement.classList.toggle("use-warm-white",this.useWarmWhite)}}const homePage=new HomePage,droneVert=`#define GLSLIFY 1
attribute float Cd;attribute float part;varying vec3 v_viewNormal;varying vec2 v_uv;varying vec3 v_modelPosition;varying vec3 v_worldPosition;varying vec3 v_viewPosition;varying float v_ao;varying float v_part;
#ifdef IS_BLADE
attribute float side;uniform float u_spin;uniform float u_bladeOpacity;varying float v_opacity;vec4 quaternion(float angle,vec3 axis){angle*=.5;return vec4(axis*sin(angle),cos(angle));}vec3 qrotate(vec4 q,vec3 v){return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
#endif
void main(){vec3 pos=position;vec3 nor=normal;
#ifdef IS_BLADE
float side=sign(side);float spin=sign(u_spin)*sign(side)>.5 ?-abs(side)*u_spin : 0.;vec4 q=quaternion(spin,vec3(0.,1.,0.));pos=qrotate(q,pos);nor=qrotate(q,nor);v_opacity=smoothstep(0.1,0.01,abs(spin))*u_bladeOpacity;
#endif
vec4 viewPosition=modelViewMatrix*vec4(pos,1.0);gl_Position=projectionMatrix*viewPosition;v_viewNormal=normalMatrix*nor;v_uv=uv;v_modelPosition=position;v_worldPosition=(modelMatrix*vec4(pos,1.0)).xyz;v_viewPosition=-viewPosition.xyz;v_ao=Cd;v_part=part;}`,droneFrag=`#define GLSLIFY 1
varying vec3 v_viewNormal;varying vec3 v_viewPosition;varying vec3 v_worldPosition;varying float v_ao;varying float v_part;uniform float u_bgRatio;uniform vec3 u_bgColor;uniform sampler2D u_brdfTexture;uniform sampler2D u_diffuseTexture;uniform sampler2D u_specularTexture;
#ifdef IS_BLADE
varying float v_opacity;
#endif
vec3 inverseTransformDirection(in vec3 dir,in mat4 matrix){return normalize((vec4(dir,0.0)*matrix).xyz);}const float PI=3.14159265359;const float RECIPROCAL_PI=0.31830988618;const float RECIPROCAL_PI2=0.15915494;const float LN2=0.6931472;const float ENV_LODS=6.0;vec4 SRGBtoLinear(vec4 srgb){vec3 linOut=pow(srgb.xyz,vec3(2.2));return vec4(linOut,srgb.w);;}vec4 RGBMToLinear(in vec4 value){float maxRange=6.0;return vec4(value.xyz*value.w*maxRange,1.0);}vec2 cartesianToPolar(vec3 n){vec2 uv;uv.x=atan(n.z,n.x)*RECIPROCAL_PI2+0.5;uv.y=asin(n.y)*RECIPROCAL_PI+0.5;return uv;}void getIBLContribution(inout vec3 diffuse,inout vec3 specular,float NdV,float roughness,vec3 n,vec3 reflection,vec3 diffuseColor,vec3 specularColor){vec3 brdf=SRGBtoLinear(texture2D(u_brdfTexture,vec2(NdV,roughness))).rgb;vec3 diffuseLight=RGBMToLinear(texture2D(u_diffuseTexture,cartesianToPolar(n))).rgb;float blend=roughness*ENV_LODS;float level0=floor(blend);float level1=min(ENV_LODS,level0+1.0);blend-=level0;vec2 uvSpec=cartesianToPolar(reflection);uvSpec.y/=2.0;vec2 uv0=uvSpec;vec2 uv1=uvSpec;uv0/=pow(2.0,level0);uv0.y+=1.0-exp(-LN2*level0);uv1/=pow(2.0,level1);uv1.y+=1.0-exp(-LN2*level1);vec3 specular0=RGBMToLinear(texture2D(u_specularTexture,uv0)).rgb;vec3 specular1=RGBMToLinear(texture2D(u_specularTexture,uv1)).rgb;vec3 specularLight=mix(specular0,specular1,blend);diffuse=diffuseLight*diffuseColor;float reflectivity=pow((1.0-roughness),2.0)*0.05;specular=specularLight*(specularColor*brdf.x+brdf.y+reflectivity);}void main(){vec3 viewNormal=normalize(v_viewNormal);vec3 N=inverseTransformDirection(viewNormal,viewMatrix);vec3 lightPos=vec3(0.2,0.2,3.0)*10000.0;vec3 L=normalize(lightPos-v_worldPosition);vec3 V=normalize(-v_viewPosition);vec3 H=normalize(L+V);vec3 reflection=normalize(reflect(-V,N));float NdV=clamp(abs(dot(N,V)),0.001,1.0);float bodyPart=step(abs(v_part-0.0),0.5);float armsPart=step(abs(v_part-1.0),0.5);float headLightPart=step(abs(v_part-2.0),0.5);float bladesPart=step(abs(v_part-3.0),0.5);float roughness=0.0;float metalness=0.0;vec3 albedo=vec3(0.0);if(bodyPart>0.5){roughness=1.0;metalness=0.0;albedo=vec3(0.7);}if(armsPart>0.5){roughness=1.0;metalness=0.0;albedo=vec3(0.005);}if(headLightPart>0.5){roughness=0.0;metalness=0.0;albedo=0.5*vec3(0.3);}if(bladesPart>0.5){roughness=0.8;metalness=0.1;albedo=0.4*vec3(0.3);}
#ifdef IS_BLADE
roughness=max(roughness,1.-v_opacity);metalness*=v_opacity;
#endif
vec3 f0=vec3(0.04);vec3 diffuseColor=albedo*(vec3(1.0)-f0)*(1.0-metalness);vec3 specularColor=mix(f0,albedo,metalness);float specPow=mix(150.0,2.0,roughness);vec3 directDiff=diffuseColor*max(0.0,dot(N,L));vec3 directSpec=(specPow+8.0)/8.0*specularColor*pow(max(0.0,dot(N,H)),specPow);vec3 direct=directDiff+directSpec;vec3 diffuseIBL;vec3 specularIBL;getIBLContribution(diffuseIBL,specularIBL,NdV,roughness,N,reflection,diffuseColor,specularColor);vec3 color=0.0*albedo;color+=2.0*diffuseIBL+1.0*specularIBL;color+=0.0*directDiff+10.0*directSpec;color*=v_ao*v_ao;gl_FragColor=sRGBTransferOETF(vec4(color,1.0));gl_FragColor.rgb=mix(gl_FragColor.rgb,u_bgColor,u_bgRatio);
#ifdef IS_BLADE
gl_FragColor.a*=v_opacity*v_opacity;
#endif
}`,videoVert=`#define GLSLIFY 1
attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`,videoFrag=`#define GLSLIFY 1
#define PI 3.14159265359
uniform vec2 u_resolution;uniform vec2 u_videoSize;uniform sampler2D u_video;uniform sampler2D u_brush;uniform float u_ratio;uniform float u_bgRatio;uniform vec3 u_skyColor;uniform vec3 u_overlayColor;uniform vec3 u_bgColor;float sat(float x){return clamp(x,0.,1.);}float remap(float x,float inMin,float inMax,float outMin,float outMax){return(x-inMin)/(inMax-inMin)*(outMax-outMin)+outMin;}vec2 rotate2d(vec2 st,float angle){return mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*st;}
#include <colorspace_pars_fragment>
void main(){vec2 uv;vec2 st=gl_FragCoord.xy/u_resolution;float screenAr=u_resolution.x/u_resolution.y;float videoAr=u_videoSize.x/u_videoSize.y;if(screenAr>videoAr){uv=(st-0.5)*vec2(1.,videoAr/screenAr)+0.5;}else{uv=(st-0.5)*vec2(screenAr/videoAr,1.)+0.5;}vec2 brushUv=st;brushUv-=0.5;if(screenAr>1.0){brushUv.x*=screenAr;}else{brushUv.y/=screenAr;}brushUv+=0.5;float brush=texture2D(u_brush,brushUv*.7).r;vec2 brush2Uv=rotate2d(brushUv-0.5,PI*0.5)+0.5;float brush2=texture2D(u_brush,brush2Uv*0.5).r;float alphaSmoothFactor=0.8;float alphaSmoothFactor2=0.4;float r=mix(-alphaSmoothFactor,1.+alphaSmoothFactor,u_ratio);float alpha=max(0.5,smoothstep(r-alphaSmoothFactor,r+alphaSmoothFactor,brush2));float r2=mix(-alphaSmoothFactor2,1.+alphaSmoothFactor2,u_ratio*1.2-0.2);alpha=sat(alpha*smoothstep(r2-alphaSmoothFactor2,r2+alphaSmoothFactor2,brush));vec3 c=texture2D(u_video,uv).rgb;vec3 overlayColor=mix(u_overlayColor,u_skyColor,smoothstep(0.,0.5,1.-alpha));c=sRGBTransferOETF(vec4(mix(sRGBTransferEOTF(vec4(c,1.0)).rgb,overlayColor,0.3),1.0)).rgb;c=mix(c,u_bgColor,u_bgRatio);alpha*=(1.-u_ratio);gl_FragColor=vec4(vec3(c),alpha);}`,_meshes={},REF_PIXEL_HEIGHT=1648,REF_HEIGHT=2,VIRTUAL_HEIGHT=1*REF_HEIGHT,FADE_SCREEN=.5,FADE_SCREEN_HEIGHT=FADE_SCREEN*REF_HEIGHT,VIRTUAL_SCREEN_THRESHOLD=VIRTUAL_HEIGHT/(FADE_SCREEN_HEIGHT+VIRTUAL_HEIGHT);let _cloudContainer=new Object3D,_terrainContainer=new Object3D,_baseMesh,_droneContainer=new Object3D,_droneMesh,_droneBlades=[],_droneBladeContainers=[],_droneMaterial,_droneBladeMaterial,_videoMesh,_video;class Hero{container=new Object3D;startRatio=0;animation=0;isVisible=!1;activeRatio=0;pathBasedRatio=1;videoRatio=0;videoEl;sharedUniforms={u_offsetY:{value:0},u_maxOffsetY:{value:VIRTUAL_HEIGHT},u_bgRatio:{value:0},u_bgColor:{value:new Color("#000000")},u_bladeOpacity:{value:1}};videoInitialized=!1;sceneryReady=!1;preInitVideo(){if(this.videoInitialized)return;this.videoInitialized=!0,(settings.IS_DEV||settings.LOG)&&console.log("preInit"),_video=heroVideo.videoEl;const e=browser.isMobile?new Vector2(960,540):new Vector2(1920,1080),t=new DataTexture(new Uint8Array([255,255,255,255]),1,1);t.needsUpdate=!0,_videoMesh=new Mesh(fboHelper.triGeom,fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_video:{value:new VideoTexture(_video)},u_brush:{value:t},u_videoSize:{value:e},u_resolution:properties.sharedUniforms.u_resolution,u_ratio:{value:0},u_overlayColor:{value:new Color("#3F1507")},u_skyColor:{value:new Color("#25b5dc")},u_bgRatio:this.sharedUniforms.u_bgRatio,u_bgColor:this.sharedUniforms.u_bgColor}),vertexShader:videoVert,fragmentShader:videoFrag,derivatives:!0,glslVersion:GLSL3,transparent:!0,blending:NormalBlending,depthWrite:!1,depthTest:!1})),_videoMesh.renderOrder=101,_videoMesh.visible=!1,this.container.add(_terrainContainer),this.container.add(_videoMesh),this.container.add(_cloudContainer)}preInit(){this.preInitVideo(),this.pendingBrush=properties.loader.add(settings.TEXTURE_PATH+"hero/brush.png",{type:"texture",minFilter:LinearFilter,magFilter:LinearFilter,wrapT:RepeatWrapping,wrapS:RepeatWrapping}).content;for(let e in heroTextures){let t=heroTextures[e],i=browser.isMobile?properties.getMobileUrl(settings.TEXTURE_PATH+t.url):settings.TEXTURE_PATH+t.url;if(t.alphaUrl){let r=browser.isMobile?properties.getMobileUrl(settings.TEXTURE_PATH+t.alphaUrl):settings.TEXTURE_PATH+t.alphaUrl;t.texture=textureHelper.loadRGBATexture(i,r,{alphaChannelIndex:t.alphaChannelIndex,colorSpace:SRGBColorSpace,minFilter:LinearMipMapLinearFilter,wrapT:t.wrapT?RepeatWrapping:ClampToEdgeWrapping,isAlphaGreyScale:t.isAlphaGreyScale})}else t.texture=properties.loader.add(i,{type:"texture",colorSpace:SRGBColorSpace,wrapT:t.wrapT?RepeatWrapping:ClampToEdgeWrapping}).content}this.brdfTexture=properties.loader.add(settings.TEXTURE_PATH+"brdf.png",{type:"texture",colorSpace:LinearSRGBColorSpace}).content,this.diffuseTexture=properties.loader.add(settings.TEXTURE_PATH+"diffuse.png",{type:"texture",colorSpace:LinearSRGBColorSpace}).content,this.specularTexture=properties.loader.add(settings.TEXTURE_PATH+"specular.png",{type:"texture",colorSpace:LinearSRGBColorSpace}).content,this.brdfTexture.generateMipmaps=!1,this.diffuseTexture.generateMipmaps=!1,this.specularTexture.generateMipmaps=!1,this.container.add(this._createItem("base",100,heroTextures.BASE)),_baseMesh=_meshes.base,_baseMesh.material.defines.IS_BASE=!0,_baseMesh.material.uniforms.u_offsetY=this.sharedUniforms.u_offsetY,_baseMesh.material.uniforms.u_maxOffsetY=this.sharedUniforms.u_maxOffsetY,_baseMesh.material.uniforms.u_yOffsetRatio={value:0},_baseMesh.material.uniforms.u_fadeRatio={value:0},_baseMesh.material.uniforms.u_fadeScreen={value:FADE_SCREEN},_baseMesh.material.uniforms.u_skyColor1={value:new Color("#537c8a")},_baseMesh.material.uniforms.u_skyColor2={value:new Color("#7a8588")},_cloudContainer.add(this._createItem("cloud_c_0",111,heroTextures.CLOUD_C)),_cloudContainer.add(this._createItem("cloud_a_0",112,heroTextures.CLOUD_A)),_cloudContainer.add(this._createItem("cloud_b_0",113,heroTextures.CLOUD_B)),_cloudContainer.add(this._createItem("cloud_b_1",114,heroTextures.CLOUD_B)),_cloudContainer.add(this._createItem("cloud_b_2",116,heroTextures.CLOUD_B)),_cloudContainer.add(this._createItem("cloud_a_1",115,heroTextures.CLOUD_A)),_terrainContainer.add(this._createItem("terrain_bg",0,heroTextures.TERRAIN_BG)),properties.loader.add(settings.MODEL_PATH+"MOUNTAIN_FG.buf",{onLoad:this._onTerrainFgGeometryLoad.bind(this)}),_terrainContainer.add(_droneContainer),_droneContainer.position.set(.245836,.0369782,2.694),_droneContainer.quaternion.set(.117709,.23027,.0205328,.965763),_droneContainer.scale.setScalar(.01),_droneMaterial=new ShaderMaterial({uniforms:{u_brdfTexture:{value:this.brdfTexture},u_diffuseTexture:{value:this.diffuseTexture},u_specularTexture:{value:this.specularTexture},u_bgRatio:this.sharedUniforms.u_bgRatio,u_bgColor:this.sharedUniforms.u_bgColor},transparent:!0,vertexShader:droneVert,fragmentShader:droneFrag}),_droneBladeMaterial=new ShaderMaterial({uniforms:Object.assign({u_spin:{value:0},u_bladeOpacity:this.sharedUniforms.u_bladeOpacity},_droneMaterial.uniforms),vertexShader:droneVert,fragmentShader:droneFrag,transparent:!0,defines:{IS_BLADE:!0}}),_droneBladeMaterial.onBeforeRender=(e,t,i,r,a)=>{_droneBladeMaterial.uniforms.u_spin.value=a.__spin;let o=e.properties.get(_droneBladeMaterial).currentProgram;if(!o||!o.program)return;const s=e.getContext();s.useProgram(o.program),o.getUniforms().setValue(s,"u_spin",a.__spin)},properties.loader.add(settings.MODEL_PATH+"DRONE_BASE.buf",{onLoad:this._onDroneGeometryLoad.bind(this)}),properties.loader.add(settings.MODEL_PATH+"DRONE_BLADE.buf",{onLoad:this._onDroneBladeGeometryLoad.bind(this)})}_onDroneGeometryLoad(e){_droneMesh=new Mesh(e,_droneMaterial),_droneMesh.userData.id="drone",_droneMesh.renderOrder=200,_droneContainer.add(_droneMesh)}_onDroneBladeGeometryLoad(e){for(let t=0;t<4;t++){let i=new Mesh(e,_droneBladeMaterial);i.userData.id="drone_blade_"+t,i.renderOrder=200;let r=new Object3D;r.add(i),_droneContainer.add(r),_droneBlades.push(i),_droneBladeContainers.push(r)}_droneBladeContainers[0].position.set(-.328643,.020744,-.263813),_droneBladeContainers[0].quaternion.set(.0502849,-.00667536,.0471719,.997598),_droneBladeContainers[1].position.set(.330746,.0177429,-.262104),_droneBladeContainers[1].quaternion.set(-.00756536,.00908308,-.0413623,.999074),_droneBladeContainers[2].position.set(-.333027,.0549766,.254742),_droneBladeContainers[2].quaternion.set(-.0338038,-35806e-8,.0422962,.998533),_droneBladeContainers[3].position.set(.331454,.0522107,.254725),_droneBladeContainers[3].quaternion.set(0,0,-.0212894,.999773),_droneBlades[0].__angle=Math.PI/2,_droneBlades[1].__angle=0,_droneBlades[2].__angle=0,_droneBlades[3].__angle=Math.PI/2}_onTerrainFgGeometryLoad(e){_terrainContainer.add(this._createItem("terrain_fg",1,heroTextures.TERRAIN_FG,e));let t=_meshes.terrain_fg.material.uniforms,i=1;browser.isMobile&&(i=heroTextures.TERRAIN_FG.mobileWidth/heroTextures.TERRAIN_FG.mobileHeight/(heroTextures.TERRAIN_FG.width/heroTextures.TERRAIN_FG.height)),t.u_uvScale.value=new Vector2(1/i,1),_meshes.terrain_bg.position.x=.212379}_createItem(e,t=0,i,r){let a;browser.isMobile?a=new Vector2(i.mobileWidth,i.mobileHeight):a=new Vector2(i.width,i.height);let o=_meshes[e]=new Mesh(r||new PlaneGeometry(a.x/REF_PIXEL_HEIGHT*REF_HEIGHT,a.y/REF_PIXEL_HEIGHT*REF_HEIGHT),new ShaderMaterial({uniforms:{u_texture:{value:i.texture},u_textureSize:{value:a},u_opacity:{value:1},u_bgRatio:this.sharedUniforms.u_bgRatio,u_bgColor:this.sharedUniforms.u_bgColor,u_uvScale:{value:new Vector2(1,1)}},side:DoubleSide,transparent:!0,blending:CustomBlending,blendEquation:AddEquation,blendSrc:SrcAlphaFactor,blendDst:OneMinusSrcAlphaFactor,blendEquationAlpha:AddEquation,blendSrcAlpha:ZeroFactor,blendDstAlpha:OneFactor,depthWrite:!1,depthTest:!1,vertexShader:itemVert,fragmentShader:itemFrag}));return o.userData.id=e,o.renderOrder=t,o.visible=!1,o}init(){}resize(e,t){}preUpdate(e){this.startRatio,this.animation}update(e){if(!homePage.hasInitialized||!this.videoInitialized)return;const t=homePage.isActive;this.pathBasedRatio=math.saturate(this.pathBasedRatio+(t?1:-1)*e*3.33);const i=this.activeRatio*this.pathBasedRatio;if(this.isVisible=i>0,this.container.visible=this.isVisible,this.sharedUniforms.u_bgRatio.value=1-i,this.sharedUniforms.u_bgColor.value.copy(properties.bgColor),this.sharedUniforms.u_bgColor.value.convertLinearToSRGB(),!this.isVisible)return;if(_videoMesh.visible=!document.documentElement.classList.contains("hero-video-unavailable"),_videoMesh.material.uniforms.u_ratio.value=this.videoRatio,!this.sceneryReady){for(const h of this.container.children)h!==_videoMesh&&(h.visible=!1);return}_videoMesh.material.uniforms.u_brush.value=this.pendingBrush,_terrainContainer.visible=!0,_cloudContainer.visible=!0;let r=this.startRatio,a=this.animation,o=math.fit(a,0,VIRTUAL_SCREEN_THRESHOLD,0,1),s=math.fit(a,VIRTUAL_SCREEN_THRESHOLD-REF_HEIGHT/(FADE_SCREEN_HEIGHT+VIRTUAL_HEIGHT),1,0,1),l;l=_meshes.base,l.material.uniforms.u_yOffsetRatio.value=o,l.material.uniforms.u_offsetY.value=math.fit(o,0,1,0,VIRTUAL_HEIGHT),l.material.uniforms.u_fadeRatio.value=s;let c=input.easedMouseDynamics.default.value,d=c.x*properties.viewportWidth/properties.viewportHeight,f=c.y;d*=.01,f*=.01,l.visible=!0;let u=browser.isMobile?2:1;l=_meshes.cloud_c_0,l.scale.set(1.85,1.85,1).multiplyScalar(u),l.position.x=math.fit(r,0,1,.1,.1,ease.cubicOut),l.position.y=math.fit(r,0,1,-2.1,-.3,ease.cubicOut),l.position.y+=math.fit(o,0,1,0,VIRTUAL_HEIGHT*1.75),l.position.x-=d*.4,l.position.y-=f*.4,l.visible=!0,l=_meshes.cloud_a_0,l.scale.set(-1.5,1.5,1).multiplyScalar(u),l.position.x=math.fit(r,0,1,-2.4,-1.6,ease.cubicOut),l.position.y=math.fit(r,0,1,-1.5,-.6,ease.cubicOut),l.position.y+=math.fit(o,0,1,0,VIRTUAL_HEIGHT*2),l.position.x-=d*.5,l.position.y-=f*.5,l.visible=!0,l=_meshes.cloud_b_0,l.scale.set(-1.5,1.5,1).multiplyScalar(u),l.position.x=math.fit(r,0,1,1.7,1.3,ease.cubicOut),l.position.y=math.fit(r,0,1,-1.54,-.8,ease.cubicOut),l.position.y+=math.fit(o,0,1,0,VIRTUAL_HEIGHT*2.2),l.position.x-=d*.6,l.position.y-=f*.6,l.visible=!0,l=_meshes.cloud_b_1,l.scale.set(1,1,1).multiplyScalar(u),l.rotation.z=Math.PI,l.position.x=math.fit(r,0,1,1.7,1.55,ease.cubicOut),l.position.y=math.fit(r,0,1,1.5,1,ease.cubicOut),l.position.y+=math.fit(o,0,1,0,VIRTUAL_HEIGHT*2.4),l.position.x-=d*.7,l.position.y-=f*.7,l.visible=!0,l=_meshes.cloud_b_2,l.scale.set(1.7,1.7,1).multiplyScalar(u),l.position.x=-1.2,l.position.y=-1.7,l.position.y+=math.fit(o,0,1,-.1,VIRTUAL_HEIGHT*2.6),l.position.x-=d*.8,l.position.y-=f*.8,l.visible=!0,l=_meshes.cloud_a_1,l.scale.set(1.5,1.5,1).multiplyScalar(u),l.position.x=1,l.position.y=-2.2,l.position.y+=math.fit(o,0,1,0,VIRTUAL_HEIGHT*3),l.position.x-=d*1,l.position.y-=f*1,l.visible=!0,l=_meshes.terrain_bg,l.visible=!0,l=_meshes.terrain_fg,l.visible=!0,_terrainContainer.position.y=math.fit(o,0,1,-VIRTUAL_HEIGHT,0),_droneMesh.visible=!0,_videoMesh.visible=!document.documentElement.classList.contains("hero-video-unavailable");for(let h=0;h<_droneBlades.length;h++){let _=_droneBlades[h],v=Math.abs(scrollManager.scrollViewDelta)*12*(h%2?1:-1);_.__angle+=v,_.__angle+=30*e*(h%2?1:-1),_.rotation.y=_.__angle,_.__spin=math.clamp(v,-.5,.5)*math.fit(Math.abs(v),.1,1,0,1)*(h==1?-1:1)}this.sharedUniforms.u_bladeOpacity.value=math.fit(this.animation,2.8,3,1,0),_videoMesh.material.uniforms.u_ratio.value=this.videoRatio}}const hero=new Hero;function guardLoader(n,e,t=15e3){let i=!1;const r=new Set,a=n._createItem,o=()=>{i=!0;for(const s of[...r])s()};return n._createItem=function(...s){const l=a.apply(this,s),c=l.load,d=l._onLoad;let f=!1,u,h,_;const v=()=>{clearTimeout(u),h?.removeEventListener("error",p),_?.removeEventListener("error",p),_?.removeEventListener("load",S),r.delete(m)},m=()=>{f=!0,v(),_&&_.readyState!==4&&_.abort()},p=()=>{f||i||(o(),e(new Error(`Asset failed or timed out: ${l.url}`)))},S=()=>{_.status!==200&&p()};return l._onLoad=function(...M){if(!(f||i))try{return d.apply(this,M)}catch(y){i||(o(),e(y))}},l.onLoaded.addOnce(()=>{f=!0,v()}),l.load=function(...M){if(!i){r.add(m),u=setTimeout(p,t),h=this.content?.image||this.content,h?.addEventListener||(h=null),h?.addEventListener("error",p);try{const y=c.apply(this,M);return _=this.xmlhttp,f||(_?.addEventListener("error",p),_?.addEventListener("load",S)),y}catch{p()}}},l},o}class DeferredScene{state="idle";promise;constructor(e,t,i,r){Object.assign(this,{name:e,setup:t,initialize:i,object:r})}load(){return this.promise?this.promise:(this.state="loading",this.promise=new Promise(e=>{const t=quickLoader$1.create();t.maxActiveItems=2;let i=!1;const r=c=>{i||(i=!0,clearTimeout(s),o(),window.removeEventListener("atlas:stop-visuals",a),this.state=c?"ready":"failed",document.documentElement.classList.toggle(`scene-${this.name}-ready`,c),document.documentElement.dataset[`scene${this.name}`]=this.state,!c&&this.name!=="scenery"&&(this.object.visible=!1),e(c))},a=()=>r(!1),o=guardLoader(t,a,25e3),s=setTimeout(a,45e3);window.addEventListener("atlas:stop-visuals",a,{once:!0});const l=properties.loader;try{properties.loader=t,this.setup()}catch{r(!1)}finally{properties.loader=l}i||(this.name!=="scenery"&&(this.object.visible=!1),t.start(async c=>{if(!(c!==1||i))try{if(this.initialize(),await properties.renderer.compileAsync(this.object,properties.camera),i)return;this.object.visible=!0,r(!0)}catch{r(!1)}}))}),this.promise)}}const DEFAULT_POST_PROFILE=new PostProfile,MOTOR_POS_FROM=new Vector3(.244047,.036399,2.69772),MOTOR_QRIENT_FROM=new Quaternion(-.961332,-.0524059,.235295,.13316);class Visuals{container=new Object3D;cameraAnimation=new FrameAnimation;viewOffsetY=0;backgroundBusy=!1;preInit(){terrain.preInit(),this.container.add(terrain.container,engine.container,hero.container,gallery.container,robot.container),this.background=new DeferredScene("background",()=>terrain.loadTexture(),()=>terrain.activateTexture(),terrain.container),this.groups={scenery:new DeferredScene("scenery",()=>{hero.preInit()},()=>hero.init(),hero.container),engine:new DeferredScene("engine",()=>engine.preInit(),()=>{engine.init(),engine.resize(properties.width,properties.height)},engine.scene),gallery:new DeferredScene("gallery",()=>gallery.preInit(),()=>gallery.init(),gallery.container),robot:new DeferredScene("robot",()=>robot.preInit(),()=>robot.init(),robot.container)},routeManager.currPath===""&&this.prepareHome()}prepareHome(){this.homePrepared||(this.homePrepared=!0,this.cameraAnimation.preInit(cameraControls,settings.MODEL_PATH+"CAMERA.buf")),hero.preInitVideo()}init(){terrain.init()}resize(e,t){terrain.resize(e,t),this.groups.engine.state==="ready"&&engine.resize(e,t)}loadNext(){if(this.backgroundBusy||!properties.hasStarted||routeManager.currPath!==""||document.hidden)return;const e={scenery:"#home-drone",engine:"#home-motor",gallery:"#home-gallery",robot:"#home-specs"},t=Object.entries(this.groups).filter(([,a])=>a.state==="idle");t.sort(([a],[o])=>{const s=l=>{const c=document.querySelector(e[l])?.getBoundingClientRect();return c?c.bottom<0?1/0:Math.max(0,c.top-innerHeight):1/0};return s(a)-s(o)});const i=t[0];if(!i)return;const r=document.querySelector(e[i[0]])?.getBoundingClientRect();i[0]!=="scenery"&&r&&r.top>innerHeight*3||(this.backgroundBusy=!0,i[1].load().then(a=>{i[0]==="scenery"&&(hero.sceneryReady=a,hero.container.visible=!0),this.backgroundBusy=!1}))}preUpdate(e){if(postprocessing.blendProfile(DEFAULT_POST_PROFILE,1),this.cameraAnimation.frameCount){let t=math.fit(hero.animation,1,1.8,0,99);t=math.fit(hero.animation,2.2,3,t,149),this.cameraAnimation.applyTransform(t)}cameraControls.viewOffsetY=this.viewOffsetY,cameraControls.cameraLookStrength=math.fit(math.fit(hero.animation,1,2,0,1),0,1,0,.03),cameraControls.cameraDistance=math.fit(hero.animation,2,3,.05,.004),terrain.preUpdate(e),hero.videoInitialized&&hero.preUpdate(e),postprocessing.syncProfile(),engine.scene.scale.setScalar(6e-4),engine.scene.position.copy(MOTOR_POS_FROM),engine.scene.quaternion.copy(MOTOR_QRIENT_FROM)}update(e){terrain.update(e),hero.videoInitialized&&hero.update(e);for(const[t,i]of[["engine",engine],["gallery",gallery],["robot",robot]])this.groups[t].state==="ready"&&i.update(e);properties.startTime>1.5&&(this.background.state==="idle"&&this.background.load(),this.loadNext())}}const visuals=new Visuals;let _domContainer,_domTitle$2,_titleAnimation$2,_textAnimationList=[],_heroImgWrapper,_heroImg,backgroundYRatio$1=0,backgroundYFrom$1=0,backgroundYOnShow$1=0,isEntered$1=!1,prevIsEntered$1=!1;class ThesisHeroSection extends Section{preInit(e){super.preInit(e,"thesis-hero"),_domContainer=this.domContainer,_domTitle$2=_domContainer.querySelector("#thesis-hero__title"),_titleAnimation$2=new TitleAnimation(_domTitle$2);let t=_domContainer.querySelectorAll(".thesis-text");for(let i=0;i<t.length;i++)_textAnimationList.push(new ParagraphAnimation(t[i]));_heroImgWrapper=_domContainer.querySelector("#thesis-hero-img"),_heroImg=_heroImgWrapper.querySelector("img")}init(){super.init()}show(){isEntered$1=!0,prevIsEntered$1=!1,backgroundYOnShow$1=backgroundGrid.yOffset}hide(){isEntered$1=!1}resize(e,t){super.resize(e,t),_titleAnimation$2.resize(e,t);for(let i=0;i<_textAnimationList.length;i++)_textAnimationList[i].resize(e,t)}reset(){_titleAnimation$2.reset();for(let e=0;e<_textAnimationList.length;e++)_textAnimationList[e].reset()}update(e){properties.useMobileLayout,super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(_domTitle$2),r=math.fit(.1*thesisPage.pageTime,0,1,0,1),a=backgroundGrid.getElementYOffset(_domTitle$2);backgroundGrid.width=math.fit(r,0,1,backgroundGrid.width,i.width),backgroundGrid.height=math.fit(r,0,1,backgroundGrid.height,i.height),isEntered$1&&!prevIsEntered$1&&(Math.abs(a-backgroundYOnShow$1)<properties.viewportHeight*.35?(backgroundYFrom$1=backgroundYOnShow$1,backgroundYRatio$1=0):(backgroundYFrom$1=a,backgroundYRatio$1=1),prevIsEntered$1=isEntered$1),backgroundYRatio$1=backgroundYRatio$1+e*2,backgroundGrid.yOffset=math.fit(backgroundYRatio$1,0,1,backgroundYFrom$1,a,ease.expoOut),backgroundGrid.gradientRatio=math.fit(r,0,1,backgroundGrid.gradientRatio,0);let o=math.fit(thesisPage.pageTime,1,2,0,1);if(_heroImg.style.transform=`scale(${math.fit(thesisPage.pageTime,0,1,1.3,1,ease.cubicOut)})`,_heroImg.style.opacity=o,t.isActive){_titleAnimation$2.update(e);for(let s=0;s<_textAnimationList.length;s++)_textAnimationList[s].update(e)}else for(let s=0;s<_textAnimationList.length;s++)_textAnimationList[s].reset()}}const thesisHeroSection=new ThesisHeroSection;class ThesisPage extends Page{path="thesis";id="thesis";preInit(){const e=this.domContainer;thesisHeroSection.preInit(e)}init(){thesisHeroSection.init()}show(e,t,i){thesisHeroSection.reset(),thesisHeroSection.show(),super.show(e,t,i)}hide(e,t,i){thesisHeroSection.hide();const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i)}resize(e,t){thesisHeroSection.resize(e,t)}update(e){super.update(e),thesisHeroSection.update(e);const t=scrollManager.getDomRange(this.domContainer);terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2)}}const thesisPage=new ThesisPage;class LegalPage extends Page{constructor(e){super(),this.path=e,this.id=e}preInit(){this.domTitle=this.domContainer.querySelector(this.titleSelector||".legal-page__title"),this.domGridWidth=this.gridWidthSelector?this.domContainer.querySelector(this.gridWidthSelector):this.domTitle,this.titleAnimation=this.animateTitle===!1?null:new TitleAnimation(this.domTitle),this.backgroundYRatio=0,this.backgroundYFrom=0,this.backgroundYOnShow=0,this.isEntered=!1,this.prevIsEntered=!1}show(e,t,i){this.titleAnimation?.reset(),this.isEntered=!0,this.prevIsEntered=!1,this.backgroundYOnShow=backgroundGrid.yOffset,super.show(e,t,i)}hide(e,t,i){this.isEntered=!1;const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i)}resize(e,t){this.titleAnimation?.resize(e,t)}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(this.domTitle),r=scrollManager.getDomRange(this.domGridWidth).width,a=this.gridWidthExtra?Math.min(r+this.gridWidthExtra,properties.viewportWidth-64):r,o=math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(o,0,1,backgroundGrid.width,a),backgroundGrid.height=math.fit(o,0,1,backgroundGrid.height,i.height);const s=backgroundGrid.getElementYOffset(this.domTitle);this.isEntered&&!this.prevIsEntered&&(Math.abs(s-this.backgroundYOnShow)<properties.viewportHeight*.35?(this.backgroundYFrom=this.backgroundYOnShow,this.backgroundYRatio=0):(this.backgroundYFrom=s,this.backgroundYRatio=1),this.prevIsEntered=this.isEntered),this.backgroundYRatio+=e*2,backgroundGrid.yOffset=math.fit(this.backgroundYRatio,0,1,this.backgroundYFrom,s,ease.expoOut),backgroundGrid.gradientRatio=math.fit(o,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),i.isActive?this.titleAnimation?.update(e):this.titleAnimation?.reset()}}const termsAndConditionsPage=new LegalPage("terms-and-conditions"),privacyPolicyPage=new LegalPage("privacy-policy"),firstBlogPost={slug:"atlas-testing",title:"Atlas Testing",description:"We pushed the Atlas 3115 brushless DC motor to failure to understand its thermal limits, validate propulsion simulations, and improve motor design.",image:"/images/blog/tested-beyond-the-limit/hero.png",author:null,publishedDate:"2026-09-15"},researchPosts=[firstBlogPost].sort((n,e)=>(e.publishedDate||"").localeCompare(n.publishedDate||"")),researchIndexPage=new LegalPage("writing");researchIndexPage.id="research";researchIndexPage.titleSelector=".research-index__title";class ResearchArticlePage extends LegalPage{show(...e){backgroundGrid.showHorizontalLines=!1,super.show(...e),this.domContainer.querySelector("research-film")?.restart()}hide(...e){this.domContainer.querySelector("research-film")?.stop(),backgroundGrid.showHorizontalLines=!0,super.hide(...e)}}const researchArticlePages=researchPosts.map(n=>{const e=new ResearchArticlePage(`writing/${n.slug}`);return e.id=`research-${n.slug}`,e.titleSelector=".editorial-page__title",e.gridWidthSelector=".research-film__preview",e.gridWidthExtra=40,e.animateTitle=!1,e});let _domTitle$1,_titleAnimation$1,_descAnimation,_domLiList,backgroundYRatio=0,backgroundYFrom=0,backgroundYOnShow=0,isEntered=!1,prevIsEntered=!1;class ContactPage extends Page{path="contact";id="contact";contactForm=null;preInit(){const e=this.domContainer,t=e.querySelector("#contact-form__form");_domTitle$1=e.querySelector("#contact-hero__title"),_titleAnimation$1=new TitleAnimation(_domTitle$1),_descAnimation=new ParagraphAnimation(e.querySelector(".section__inner > .o-grid:nth-child(2)"),e.querySelectorAll("#contact-hero__desc, #contact-hero__desc_2")),_domLiList=e.querySelectorAll("#contact-hero__list li"),t&&(this.contactForm=new ContactForm(t,{fieldNames:["name","email","role","company","message"]}))}init(){}show(e,t,i){_titleAnimation$1.reset(),_descAnimation.reset(),isEntered=!0,prevIsEntered=!1,backgroundYOnShow=backgroundGrid.yOffset,super.show(e,t,i)}hide(e,t,i){isEntered=!1;const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i),this.contactForm?.cancelPending()}resize(e,t){_titleAnimation$1.resize(e,t),_descAnimation.resize(e,t)}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(_domTitle$1),r=math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(r,0,1,backgroundGrid.width,i.width),backgroundGrid.height=math.fit(r,0,1,backgroundGrid.height,i.height);const a=backgroundGrid.getElementYOffset(_domTitle$1);isEntered&&!prevIsEntered&&(Math.abs(a-backgroundYOnShow)<properties.viewportHeight*.35?(backgroundYFrom=backgroundYOnShow,backgroundYRatio=0):(backgroundYFrom=a,backgroundYRatio=1),prevIsEntered=isEntered),backgroundYRatio=backgroundYRatio+e*2,backgroundGrid.yOffset=math.fit(backgroundYRatio,0,1,backgroundYFrom,a,ease.expoOut),backgroundGrid.gradientRatio=math.fit(r,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),t.isActive?(_titleAnimation$1.update(e),_descAnimation.update(e)):_descAnimation.reset();let o=_descAnimation.activeTime-_descAnimation.wordCount*_descAnimation.wordStagger;for(let s=0;s<_domLiList.length;s++){let l=_domLiList[s],c=math.fit(o,s*.1,s*.1+.5,0,1);l.style.opacity=c}}}const contactPage=new ContactPage;let _domHero,_domTitle,_domProductsContent,_titleAnimation,prefersReducedMotion=!1;class OrderPage extends Page{path="order";id="order";inquiryForm=null;storefront=null;preInit(){const e=this.domContainer;_domHero=e.querySelector("#order-hero"),_domTitle=e.querySelector("#order-hero__title"),_domProductsContent=e.querySelector("[data-order-content]"),prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,_titleAnimation=new TitleAnimation(_domTitle);const t=e.querySelector("[data-order-inquiry-form]");t&&(this.inquiryForm=new OrderInquiryForm(t)),this.storefront=new OrderStorefront(e)}show(e,t,i){_titleAnimation.reset(),this.storefront?.activate(),super.show(e,t,i)}hide(e,t,i){this.inquiryForm?.cancelPending(),this.storefront?.deactivate();const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i)}resize(e,t){_titleAnimation.resize(e,t),prefersReducedMotion&&_domTitle.querySelectorAll(".char").forEach(i=>{i.style.transform="translateZ(0)"})}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(_domHero),r=scrollManager.getDomRange(_domProductsContent),a=prefersReducedMotion?1:math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(a,0,1,backgroundGrid.width,r.width),backgroundGrid.height=r.height;const s=-(r.screenY-backgroundGrid.viewportOffsetY+r.height*.5)+backgroundGrid.viewportHeight*.5;backgroundGrid.yOffset=s,backgroundGrid.gradientRatio=math.fit(a,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),i.isActive&&(prefersReducedMotion||_titleAnimation.update(e))}}const orderPage=new OrderPage;class ActuatorInterestPage extends Page{path="actuator-interest";id="actuator-interest";interestForm=null;preInit(){const e=this.domContainer;this.domHero=e.querySelector("#actuator-interest-hero"),this.domTitle=e.querySelector("#actuator-interest-hero__title"),this.titleAnimation=new TitleAnimation(this.domTitle),this.descAnimation=new ParagraphAnimation(e.querySelector(".actuator-interest-hero__intro"),e.querySelectorAll("#actuator-interest-hero__desc")),this.backgroundYRatio=0,this.backgroundYFrom=0,this.backgroundYOnShow=0,this.isEntered=!1,this.prevIsEntered=!1;const t=e.querySelector("#actuator-interest-form__form");t&&(this.interestForm=new ActuatorInterestForm(t))}show(e,t,i){this.titleAnimation.reset(),this.descAnimation.reset(),this.isEntered=!0,this.prevIsEntered=!1,this.backgroundYOnShow=backgroundGrid.yOffset,super.show(e,t,i)}hide(e,t,i){this.isEntered=!1,this.interestForm?.cancelPending();const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i)}resize(e,t){this.titleAnimation.resize(e,t),this.descAnimation.resize(e,t)}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(this.domHero),r=scrollManager.getDomRange(this.domTitle),a=math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(a,0,1,backgroundGrid.width,r.width),backgroundGrid.height=math.fit(a,0,1,backgroundGrid.height,r.height);const o=backgroundGrid.getElementYOffset(this.domTitle);this.isEntered&&!this.prevIsEntered&&(Math.abs(o-this.backgroundYOnShow)<properties.viewportHeight*.35?(this.backgroundYFrom=this.backgroundYOnShow,this.backgroundYRatio=0):(this.backgroundYFrom=o,this.backgroundYRatio=1),this.prevIsEntered=this.isEntered),this.backgroundYRatio+=e*2,backgroundGrid.yOffset=math.fit(this.backgroundYRatio,0,1,this.backgroundYFrom,o,ease.expoOut),backgroundGrid.gradientRatio=math.fit(a,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),i.isActive?(this.titleAnimation.update(e),this.descAnimation.update(e)):this.descAnimation.reset()}}const actuatorInterestPage=new ActuatorInterestPage;class NotFoundPage extends Page{path=/.*/;id="not-found";preInit(){this.domContent=this.domContainer.querySelector(".not-found-page__content"),this.domTitle=this.domContainer.querySelector("h1"),this.domMessage=this.domContainer.querySelector(".not-found-page__message"),this.domLink=this.domContainer.querySelector(".not-found-page__links"),this.titleAnimation=new TitleAnimation(this.domTitle),this.messageAnimation=new ParagraphAnimation(this.domMessage),this.backgroundYRatio=0,this.backgroundYFrom=0,this.backgroundYOnShow=0,this.isEntered=!1,this.prevIsEntered=!1,this.prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches}show(e,t,i){this.titleAnimation.reset(),this.messageAnimation.reset(),this.domLink.style.opacity=this.prefersReducedMotion?1:0,this.isEntered=!0,this.prevIsEntered=!1,this.backgroundYOnShow=backgroundGrid.yOffset,super.show(e,t,i)}hide(e,t,i){this.isEntered=!1;const r=e&&e.path!==""&&window.location.hash==="#jdm";gallery.isVisible=!1,robot.isVisible=!1,r?(hero.startRatio=1,hero.activeRatio=0,hero.videoRatio=0):(hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0),super.hide(e,t,i)}resize(e,t){this.titleAnimation.resize(e,t),this.messageAnimation.resize(e,t),this.prefersReducedMotion&&(this.domTitle.querySelectorAll(".char").forEach(i=>{i.style.transform="translateZ(0)"}),this.domMessage.querySelectorAll(".word").forEach(i=>{i.style.opacity=1}))}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(this.domContent),r=this.prefersReducedMotion?1:math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(r,0,1,backgroundGrid.width,i.width),backgroundGrid.height=math.fit(r,0,1,backgroundGrid.height,i.height);const a=backgroundGrid.getElementYOffset(this.domContent,.5);this.isEntered&&!this.prevIsEntered&&(Math.abs(a-this.backgroundYOnShow)<properties.viewportHeight*.35?(this.backgroundYFrom=this.backgroundYOnShow,this.backgroundYRatio=0):(this.backgroundYFrom=a,this.backgroundYRatio=1),this.prevIsEntered=this.isEntered),this.backgroundYRatio=this.prefersReducedMotion?1:this.backgroundYRatio+e*2,backgroundGrid.yOffset=math.fit(this.backgroundYRatio,0,1,this.backgroundYFrom,a,ease.expoOut),backgroundGrid.gradientRatio=math.fit(r,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),i.isActive&&!this.prefersReducedMotion&&(this.titleAnimation.update(e),this.messageAnimation.update(e),this.domLink.style.opacity=math.fit(this.pageTime,.35,.85,0,1,ease.expoOut))}}const notFoundPage=new NotFoundPage;class MotorProductPage extends Page{constructor(e){super(),this.productId=e,this.path=`motors/${e}`,this.id=`motor-${e}`}preInit(){this.domFrame=this.domContainer.querySelector(".motor-product-hero__frame"),this.domModel=this.domContainer.querySelector(".motor-product-hero__model"),this.titleAnimation=new TitleAnimation(this.domModel),this.storefront=new OrderStorefront(this.domContainer),this.backgroundYRatio=0,this.backgroundYFrom=0,this.backgroundYOnShow=0,this.isEntered=!1,this.prevIsEntered=!1,this.isMobile=window.matchMedia("(max-width: 767.98px)").matches,this.prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches}show(e,t,i){this.titleAnimation.reset(),this.isEntered=!0,this.prevIsEntered=!1,this.backgroundYOnShow=backgroundGrid.yOffset,this.storefront?.activate(),super.show(e,t,i)}hide(e,t,i){this.isEntered=!1,this.storefront?.deactivate(),gallery.isVisible=!1,robot.isVisible=!1,hero.startRatio=0,hero.animation=0,hero.activeRatio=1,hero.videoRatio=0,super.hide(e,t,i)}resize(e,t){this.isMobile=e<768,this.titleAnimation.resize(e,t),(this.prefersReducedMotion||this.isMobile)&&this.domModel.querySelectorAll(".char").forEach(i=>{i.style.transform="translateZ(0)"})}update(e){super.update(e);const t=scrollManager.getDomRange(this.domContainer),i=scrollManager.getDomRange(this.domFrame),r=this.prefersReducedMotion?1:math.fit(.1*this.pageTime,0,1,0,1);backgroundGrid.width=math.fit(r,0,1,backgroundGrid.width,i.width),backgroundGrid.height=math.fit(r,0,1,backgroundGrid.height,i.height);const a=backgroundGrid.getElementYOffset(this.domFrame,.5);if(this.isEntered&&!this.prevIsEntered){const o=Math.abs(a-this.backgroundYOnShow)<properties.viewportHeight*.35;this.backgroundYFrom=o?this.backgroundYOnShow:a,this.backgroundYRatio=o?0:1,this.prevIsEntered=!0}this.backgroundYRatio=this.prefersReducedMotion?1:this.backgroundYRatio+e*2,backgroundGrid.yOffset=math.fit(this.backgroundYRatio,0,1,this.backgroundYFrom,a,ease.expoOut),backgroundGrid.gradientRatio=math.fit(r,0,1,backgroundGrid.gradientRatio,0),terrain.activeRatio=math.saturate(terrain.activeRatio+(t.isActive?1:-1)*e*2),i.isActive&&!this.prefersReducedMotion&&!this.isMobile&&this.titleAnimation.update(e)}}const motor3115Page=new MotorProductPage("3115"),motor4112Page=new MotorProductPage("4112"),motor2207Page=new MotorProductPage("2207");class PageManager{pages={};pageList=[homePage,thesisPage,researchIndexPage,...researchArticlePages,contactPage,termsAndConditionsPage,privacyPolicyPage,orderPage,actuatorInterestPage,motor3115Page,motor4112Page,motor2207Page,notFoundPage];scrollTargetPage=null;domContainer=null;domInner=null;prevRoute=null;currRoute=null;_defaultRoute;_pendingRoute;_isHiding=!1;_isShowing=!1;_hasPreloaded=!0;onIdled=new MinSignal$2;NEEDS_LOG=settings.IS_DEV||settings.LOG;constructor(){this._defaultRoute=new Route(void 0),this.prevRoute=this.currRoute=this._defaultRoute;for(let e=0;e<this.pageList.length;e++){let t=this.pageList[e];this.pages[t.id]=t,routeManager.addPath(t.path,t)}}preInit(){this.domContainer=document.getElementById("pages-container"),routeManager.onRouteChanged.add(this._onRouteChanged,this),this._onRouteChanged(routeManager.currRoute)}get isIdle(){return!this._isHiding&&this._hasPreloaded&&!this._isShowing}_onRouteChanged(e){if(!this.isIdle)this._pendingRoute=e;else if(this.currRoute!==e){this.prevRoute=this.currRoute,this.currRoute=e;let t=this.currRoute.target;properties.hasInitialized&&(e.dom.ownerDocument!==document||!e.dom.isConnected)&&(e.dom.classList.add("is-preparing"),e.dom.inert=!0,this.domContainer.append(e.dom)),queuePageEssentials(e),properties.hasInitialized&&e.path===""&&visuals.prepareHome(),t.domContainer||(t.domContainer=this.currRoute.dom,this._log("preInit: "+this.currRoute.path),t.preInit(this.currRoute)),properties.hasInitialized?this._hasPreloaded=!1:this.scrollTargetPage=t,this.currRoute.hasContentPreloaded||(this._log("preInitContent: "+this.currRoute.path),t.preInitContent(this.currRoute)),properties.hasInitialized&&(this.domContainer.setAttribute("aria-busy","true"),properties.loader.start(i=>{i!==1||this._hasPreloaded||(this._hasPreloaded=!0,this._isHiding=!0,this.prevRoute.target.hide(this.prevRoute,this.currRoute,()=>{this._isHiding=!1,this.domContainer.removeAttribute("aria-busy"),this._onHideComplete()}))}))}}init(){this._initPage()}_initPage(){let e=this.currRoute.target;e.hasInitialized||(this._log("init: "+this.currRoute.path),e.init(this.currRoute),e.hasInitialized=!0),this.currRoute.hasContentPreloaded||(this.currRoute.hasContentPreloaded=!0,this._log("initContent: "+this.currRoute.path),e.initContent(this.currRoute))}_onHideComplete(){if(this._initPage(),this._isShowing=!0,this.prevRoute.target){let e=this.prevRoute.target;this._log("hide page complete: "+this.prevRoute.path),e.isActive=!1,e!==this.currRoute.target&&e.domContainer.remove(),e.onHideComplete(this.prevRoute,this.currRoute)}this._showPage()}resize(e,t){this.prevRoute.target&&this.prevRoute.target.isActive&&this.prevRoute.target!==this.currRoute.target&&this.prevRoute.target.resize(e,t),this.currRoute&&this.currRoute.target.isActive&&this.currRoute.target.resize(e,t)}start(){this._isShowing=!0,this._showPage()}_showPage(){let e=this.currRoute.target;this.currRoute.path===""?heroVideo.playVideo():heroVideo.stopVideo(),e.domContainer.classList.remove("is-preparing"),e.domContainer.inert=!1,e.isActive=!0,properties.hasInitialized&&e!==this.prevRoute.target&&this.domContainer.prepend(e.domContainer),document.title=this.currRoute.title,routeManager.applyDocumentMetadata(this.currRoute),this.scrollTargetPage=e,this._log("show page: "+this.currRoute.path),scrollManager.resize(properties.viewportWidth,properties.viewportHeight),scrollManager.scrollToPixel(0,!0),e.preShow(this.prevRoute,this.currRoute),e.resize(properties.viewportWidth,properties.viewportHeight),e.show(this.prevRoute,this.currRoute,this._onShowComplete.bind(this))}_onShowComplete(){if(this._isShowing=!1,this._log("==============="),this._pendingRoute){let e=this._pendingRoute;this._pendingRoute=null,this._onRouteChanged(e)}else this.onIdled.dispatch()}update(e){blurBox.reset(),this.prevRoute.target&&this.prevRoute.target.isActive&&this.prevRoute.target!==this.currRoute.target&&this.prevRoute.target.update(e),this.currRoute&&this.currRoute.target.isActive&&this.currRoute.target.update(e)}_log(e){this.NEEDS_LOG&&console.log("%cPageManager: "+e,"color: #fff;background-color:#00f")}}const pagesManager=new PageManager;let uuidHash=1;class ScrollPane{id=0;lockOnDirection=!0;isActive=!1;x;y;viewDom=window;contentDom;isVertical=!0;targetScrollPixel=0;scrollViewDelta=0;viewWidthPixel=0;viewHeightPixel=0;contentSize=0;contentSizePixel=0;scrollView=0;progress=0;minScrollPixel=.1;viewSizePixel=1;scrollMultiplier=1;domRanges=new Map;useResizeObserver=!0;tick=-1;lastResizeTick=-1;resizeObserveTick=-1;hasResizeObserved=!1;dragHistory=[];dragHistoryMaxTime=.1;isWheelScrolling=!1;frictionCoeffFrom=2.1;frictionCoeffTo=1.9;frictionCoeffWeightDivisor=5;minVelocity=-1;wheelEaseCoeff=12;scrollPixel=0;snapList=[];_skipNativeScroll=!1;init(e={}){"scrollRestoration"in history&&(history.scrollRestoration="manual"),Object.assign(this,e),this.contentDom&&(this.contentDom.style.position="relative",this.contentDom.style.transform="none"),this.contentDom&&this.useResizeObserver&&window.ResizeObserver&&new ResizeObserver(this._onResizeObserve.bind(this)).observe(this.contentDom),window.addEventListener("scroll",this._onNativeScroll.bind(this),{passive:!0}),document.documentElement.addEventListener("keydown",t=>{t.key==="ArrowUp"?this.scrollToPixel(this.scrollPixel-100):t.key==="ArrowDown"?this.scrollToPixel(this.scrollPixel+100):t.key==="PageUp"?this.scrollToPixel(this.scrollPixel-this.viewSizePixel):t.key==="PageDown"&&this.scrollToPixel(this.scrollPixel+this.viewSizePixel)})}_onNativeScroll(e){if(this._skipNativeScroll){this._skipNativeScroll=!1;return}const t=this.isVertical?window.scrollY:window.scrollX;this.scrollPixel=t,this.targetScrollPixel=t,this.velocityPixel=0}_onResizeObserve(){this.hasResizeObserved=!0,this.resizeObserveTick=this.tick}getDomRange(e,t=0,i=!1){let r=Array.isArray(e);r?(e[0].__uuid=e[0].__uuid||uuidHash++,e[1].__uuid=e[1].__uuid||uuidHash++):e.__uuid=e.__uuid||uuidHash++;let a=r?e[0].__uuid+"_"+e[1].__uuid:e.__uuid,o=this.domRanges.get(a);return o||this.domRanges.set(a,o=new ScrollDomRange(e,this.isVertical)),o.update(this.scrollPixel,this.viewSizePixel,t,i),o}scrollTo(e,t=0,i=!1){if(e=typeof e=="string"?document.getElementById(e)||document.getElementById(e.replace("-section","")):e,e){let r=this.getDomRange(e);this.scrollToPixel(r.top+t*this.viewSizePixel,i)}}scrollToPixel(e=0,t=!1){e=this._clampScrollPixel(e),t?(this.resetScroll(e),this.progress=this.contentSize>0?e/this.contentSizePixel:0):(this.resetScroll(this.scrollPixel),this.targetScrollPixel=e,this.isWheelScrolling=!0),this.syncDom()}getEaseInOutOffset(e,t,i=0,r=.5){let a=1.5+r,o=(a-1)*2+i,s=0,l=a,c=l+i,d=c+a,f=t*d/o,u=e+f*.5-t*.5,h=Math.min(1,u/f);if(h>0){let v=h*d;var _=v;if(v>s&&v<=l){let m=(v-s)/(l-s);_=math.cubicBezier(s,(l-s)/3+s,1,1,m)}else if(v>l&&v<=c)_=1;else if(v>c&&v<=d){let m=(v-c)/(d-c);_=math.cubicBezier(1,1,-(d-c)/3+2,2,m)}else v>d&&(_=v-o);return(v-_)/o*t}return 0}resize(e,t){if(this.domRanges.forEach(r=>{r.needsUpdate=!0}),this.viewDom===window)e=window.innerWidth,t=window.innerHeight;else{let r=this.viewDom.getBoundingClientRect();e=r.width,t=r.height}this.viewWidthPixel=e,this.viewHeightPixel=t;let i=this.isVertical?t:e;if(this.contentDom){let r=this.contentDom.getBoundingClientRect();this.contentSizePixel=this.isVertical?r.height:r.width,this.contentSize=Math.max(0,this.contentSizePixel/i-1),this.isVertical?(document.body.style.height=`${this.contentSizePixel}px`,document.body.style.width=""):(document.body.style.width=`${this.contentSizePixel}px`,document.body.style.height="")}this.targetScrollPixel=this.contentSizePixel*this.progress,this.resetScroll(this.targetScrollPixel),this.viewSizePixel=i,this.lastResizeTick=this.tick,this.syncDom()}_clampScrollPixel(e){const t=this.contentSizePixel-this.viewSizePixel;return math.clamp(e,0,Math.max(0,t))}resetScroll(e){this.targetScrollPixel=this.scrollPixel=e,this.velocityPixel=0,this.dragHistory.length=0}resetSnapList(){this.snapList.length=0}addToSnapList(e,t,i){this.snapList.push({pixel:e,paddingLeft:t,paddingRight:i})}update(e){this.hasResizeObserved&&(this.hasResizeObserved=!1,this.resizeObserveTick!==this.lastResizeTick&&this.resize(this.viewWidthPixel,this.viewHeightPixel));let t=this.scrollView,i=this.scrollPixel,r=input.isDown&&(!this.lockOnDirection&&(input.isDragScrollingY||input.isDragScrollingX)||this.isVertical&&input.isDragScrollingY||!this.isVertical&&input.isDragScrollingX),a=0;if(input.isDown&&!input.wasDown&&(this.dragHistory.length=0),this.isMoveable){let o=0;this.isVertical?input.isWheelScrolling||input.isDragScrollingY?o=input.deltaScrollY:!this.lockOnDirection&&input.isDragScrollingX&&(o=-input.deltaPixelXY.y+input.deltaWheel):input.isWheelScrolling||input.isDragScrollingX?o=input.deltaScrollX:!this.lockOnDirection&&input.isDragScrollingY&&(o=-input.deltaPixelXY.x+input.deltaWheel),input.isWheelScrolling&&(this.isWheelScrolling=!0);let s=properties.time;if(r){for(this.dragHistory.push({time:s,deltaTime:e,deltaPixel:o});this.dragHistory.length>0&&s-this.dragHistory[0].time>this.dragHistoryMaxTime;)this.dragHistory.shift();this.targetScrollPixel=this.scrollPixel,this.isWheelScrolling=!1,a=o}else if(input.isDown&&this.resetScroll(this.scrollPixel),this.isWheelScrolling){this.dragHistory.length=0,this.velocityPixel=0,this.targetScrollPixel+=o,this.targetScrollPixel=this._clampScrollPixel(this.targetScrollPixel);let l=this.targetScrollPixel-this.scrollPixel;a=l*(1-Math.exp(-this.wheelEaseCoeff*e)),Math.abs(l)<this.minScrollPixel&&(a=l,this.isWheelScrolling=!1)}else{if(this.dragHistory.length>0){let d=0,f=0;for(let u=0;u<this.dragHistory.length;u++){let h=this.dragHistory[u];if(h.time>0){let _=h.deltaPixel/h.deltaTime,v=h.deltaTime,m=this.dragHistory.length==1?1:(h.time-this.dragHistory[0].time)/this.dragHistoryMaxTime,p=v*m;f+=_*p,d+=p}}this.velocityPixel=f/d,this.dragHistory.length=0}let c=-math.mix(this.frictionCoeffFrom,this.frictionCoeffTo,math.clamp(Math.abs(this.velocityPixel/this.viewSizePixel/this.frictionCoeffWeightDivisor),0,1))*this.velocityPixel;this.velocityPixel+=c*e,a=this.velocityPixel*e}}this.scrollPixel=this._clampScrollPixel(this.scrollPixel+a),Math.abs(i-this.scrollPixel)>1&&(Math.abs(this.targetScrollPixel-this.scrollPixel)<0?this.scrollPixel=this.targetScrollPixel:this.scrollPixel=Math.round(this.scrollPixel)),this.scrollView=this.scrollPixel/this.viewSizePixel,this.scrollViewDelta=this.scrollView-t,this.progress=this.contentSize>0?this.scrollPixel/this.contentSizePixel:0,Math.abs(this.targetScrollPixel-this.scrollPixel)<this.minScrollPixel&&(this.scrollPixel=this.targetScrollPixel),Math.abs(this.velocityPixel)<=this.minVelocity&&(this.velocityPixel=0),this.isScrolling=this.targetScrollPixel!==this.scrollPixel||Math.abs(this.velocityPixel)>0,this.syncDom(),this.tick++}lastWrittenScroll=-1;syncDom(){if(!this.contentDom)return;Math.abs(this.scrollPixel-this.lastWrittenScroll)>.1?(this._skipNativeScroll=!0,this.lastWrittenScroll=this.scrollPixel,this.isVertical?window.scrollTo({top:this.scrollPixel,behavior:"instant"}):window.scrollTo({left:this.scrollPixel,behavior:"instant"})):this._skipNativeScroll=!1}get isMoveable(){return this.isActive&&pagesManager.isIdle&&this.contentSize>0&&(this.viewDom===window||input.hasThroughElem(this.viewDom,"down"))}}let _domScrollIndicator,_domScrollIndicatorBar,_scrollIndicatorMoveableHeight=1,_scrollIndicatorActiveRatio=0,_lastMouseInteractiveTime=-1/0,_isIndicatorActive,_scrollBarHeight;class ScrollManager extends ScrollPane{isBtn=!1;btnRatio=0;scrollBarCenter=0;init(){let e=document;super.init({contentDom:e.getElementById("site-content"),canOvershoot:!1}),_domScrollIndicator=e.getElementById("scroll-indicator"),_domScrollIndicatorBar=e.getElementById("scroll-indicator__bar"),input.onClicked.add(()=>{this.isBtn&&input.hasThroughElem(_domScrollIndicatorBar,"down")&&scrollManager.scrollTo("open-weight")})}resize(e,t){super.resize(e,t),_scrollBarHeight=_domScrollIndicatorBar.getBoundingClientRect().height,_scrollIndicatorMoveableHeight=_domScrollIndicator.getBoundingClientRect().height-_scrollBarHeight}update(e){let t=properties.useMobileLayout,i=!1;this.btnRatio=math.saturate(this.btnRatio+(this.isBtn?3:-3)*e),properties.useMobileLayout?(this.btnRatio=0,this.isBtn=!1):input.isDown&&input.hasThroughElem(_domScrollIndicatorBar,"down")&&(i=!0),i&&this.scrollToPixel(this.scrollPixel+input.deltaPixelXY.y*this.contentSize*(this.viewSizePixel/_scrollIndicatorMoveableHeight),!0),super.update(e,this.scrollValue),Math.abs(this.scrollViewDelta)>0?(_lastMouseInteractiveTime=properties.time,_isIndicatorActive=!0):properties.time>_lastMouseInteractiveTime+.5&&(_isIndicatorActive=!1),_scrollIndicatorActiveRatio=math.clamp(_scrollIndicatorActiveRatio+(_isIndicatorActive?2:-2)*e,0,1);let a=math.fit(properties.startTime,.5,1,100,0,ease.cubicInOut),o=_scrollIndicatorMoveableHeight*(this.scrollView/this.contentSize);_domScrollIndicatorBar.style.transform="translate3d("+a+"%,"+o+"px,0)",_domScrollIndicatorBar.style.opacity=t?_scrollIndicatorActiveRatio:1,_domScrollIndicatorBar.style.cursor=this.isBtn?"pointer":"default",this.scrollBarCenter=(o+_scrollBarHeight*.5)/properties.height}get isMoveable(){return super.isMoveable&&pagesManager.isIdle&&!siteHeader.isMenuActive&&!videoOverlay.isOpened}}const scrollManager=new ScrollManager,__vite_import_meta_env__={PUBLIC_SHOPIFY_API_VERSION:"2026-07",PUBLIC_SHOPIFY_STOREFRONT_TOKEN:"bd157807fa1d1114d34850fdaaed19e0",PUBLIC_SHOPIFY_STORE_DOMAIN:"atlas-motion-systems.myshopify.com"},REQUEST_TIMEOUT_MS=12e3,CART_FIELDS=`
	fragment AtlasCartFields on Cart {
		id
		checkoutUrl
		totalQuantity
		cost {
			subtotalAmount {
				amount
				currencyCode
			}
		}
		lines(first: 50) {
			nodes {
				id
				quantity
				cost {
					totalAmount {
						amount
						currencyCode
					}
				}
				merchandise {
					... on ProductVariant {
						id
						title
						sku
						selectedOptions {
							name
							value
						}
						availableForSale
						quantityAvailable
						price {
							amount
							currencyCode
						}
						product {
							handle
							title
						}
					}
				}
			}
		}
	}
`,CART_QUERY=`
	${CART_FIELDS}
	query AtlasCart($id: ID!) {
		cart(id: $id) {
			...AtlasCartFields
		}
	}
`,CART_CREATE_MUTATION=`
	${CART_FIELDS}
	mutation AtlasCartCreate($input: CartInput!) {
		cartCreate(input: $input) {
			cart {
				...AtlasCartFields
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`,CART_LINES_ADD_MUTATION=`
	${CART_FIELDS}
	mutation AtlasCartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
			cart {
				...AtlasCartFields
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`,CART_LINES_UPDATE_MUTATION=`
	${CART_FIELDS}
	mutation AtlasCartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
		cartLinesUpdate(cartId: $cartId, lines: $lines) {
			cart {
				...AtlasCartFields
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`,CART_LINES_REMOVE_MUTATION=`
	${CART_FIELDS}
	mutation AtlasCartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
			cart {
				...AtlasCartFields
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`;class ShopifyStorefrontError extends Error{constructor(e,t){super(t),this.name="ShopifyStorefrontError",this.code=e}}function normalizeStoreDomain(n){return String(n||"").trim().replace(/^https?:\/\//i,"").replace(/\/.*$/,"").toLowerCase()}function isInvalidCartError(n){return n.some(e=>/cart.+(invalid|not found|does not exist|expired)/i.test(e.message||"")||/CART.*(INVALID|NOT_FOUND|EXPIRED)/i.test(e.code||""))}function isProductUnavailableError(n){return n.some(e=>/(sold out|out of stock|not available|unavailable|insufficient inventory|quantity.+available)/i.test(e.message||"")||/(MERCHANDISE|PRODUCT|VARIANT).*(UNAVAILABLE|OUT_OF_STOCK)/i.test(e.code||""))}class ShopifyStorefrontApi{constructor(e={}){const t=__vite_import_meta_env__||{};this.storeDomain=normalizeStoreDomain(e.storeDomain||t.PUBLIC_SHOPIFY_STORE_DOMAIN),this.publicToken=String(e.publicToken||t.PUBLIC_SHOPIFY_STOREFRONT_TOKEN||"").trim(),this.apiVersion=String(e.apiVersion||t.PUBLIC_SHOPIFY_API_VERSION||"").trim(),this.isConfigured=/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(this.storeDomain)&&!!this.publicToken&&/^\d{4}-(01|04|07|10)$/.test(this.apiVersion)}async loadProducts(e){const t=[...new Set(e)].filter(o=>/^[a-z0-9][a-z0-9-]*$/.test(o));if(t.length!==e.length)throw new ShopifyStorefrontError("PRODUCT_CONFIGURATION_ERROR","Product configuration is invalid.");const r=`
			fragment AtlasProductFields on Product {
				id
				handle
				title
				availableForSale
				variants(first: 10) {
					nodes {
						id
						title
						sku
						selectedOptions {
							name
							value
						}
						availableForSale
						quantityAvailable
						price {
							amount
							currencyCode
						}
					}
				}
			}
			query AtlasProducts {
				${t.map((o,s)=>`product${s}: product(handle: ${JSON.stringify(o)}) { ...AtlasProductFields }`).join(`
`)}
			}
		`,a=await this._request(r);return new Map(Object.values(a).filter(Boolean).map(o=>[o.handle,o]))}async getCart(e){return(await this._request(CART_QUERY,{id:e})).cart||null}async createCart(e=[]){const t=await this._request(CART_CREATE_MUTATION,{input:{lines:e}});return this._readCartMutation(t.cartCreate)}async addCartLines(e,t){const i=await this._request(CART_LINES_ADD_MUTATION,{cartId:e,lines:t});return this._readCartMutation(i.cartLinesAdd)}async updateCartLines(e,t){const i=await this._request(CART_LINES_UPDATE_MUTATION,{cartId:e,lines:t});return this._readCartMutation(i.cartLinesUpdate)}async removeCartLines(e,t){const i=await this._request(CART_LINES_REMOVE_MUTATION,{cartId:e,lineIds:t});return this._readCartMutation(i.cartLinesRemove)}_readCartMutation(e){const t=e?.userErrors||[];if(t.length>0){const i=isInvalidCartError(t)?"CART_INVALID":isProductUnavailableError(t)?"PRODUCT_UNAVAILABLE":"CART_UPDATE_FAILED";throw new ShopifyStorefrontError(i,"Cart update failed.")}if(!e?.cart)throw new ShopifyStorefrontError("CART_INVALID","Cart is no longer available.");return e.cart}async _request(e,t={}){if(!this.isConfigured)throw new ShopifyStorefrontError("STORE_CONFIGURATION_ERROR","Store configuration is unavailable.");const i=new AbortController,r=globalThis.setTimeout(()=>i.abort(),REQUEST_TIMEOUT_MS);try{const a=await fetch(`https://${this.storeDomain}/api/${this.apiVersion}/graphql.json`,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.publicToken},body:JSON.stringify({query:e,variables:t}),cache:"no-store",signal:i.signal}),o=await a.json().catch(()=>null);if(!a.ok||!o)throw new ShopifyStorefrontError("STORE_REQUEST_FAILED","Store request failed.");if(o.errors?.length){const s=isInvalidCartError(o.errors)?"CART_INVALID":"STORE_REQUEST_FAILED";throw new ShopifyStorefrontError(s,"Store request failed.")}return o.data}catch(a){throw a instanceof ShopifyStorefrontError?a:new ShopifyStorefrontError("CONNECTION_ERROR","Store connection failed.")}finally{globalThis.clearTimeout(r)}}}const MIN_QUANTITY=1,DEFAULT_MAX_QUANTITY=10,DEFAULT_UNITS_PER_PACK=4,MAX_DISPLAY_QUANTITY=99,CART_STORAGE_KEY="atlas.shopify.cartId.v1",FOCUSABLE_SELECTOR=["a[href]","button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(","),moneyFormatters=new Map,cartViews=new Set;let sharedCart,cartQueue=Promise.resolve();async function acquireCart(){const n=cartQueue;let e;return cartQueue=new Promise(t=>{e=t}),await n,e}function clampQuantity(n,e=DEFAULT_MAX_QUANTITY){const t=Number.isFinite(Number(n))?Number(n):MIN_QUANTITY;return Math.min(e,Math.max(MIN_QUANTITY,Math.round(t)))}function formatMoney(n,e="—"){const t=Number(n?.amount),i=String(n?.currencyCode||"").toUpperCase();if(!Number.isFinite(t)||!/^[A-Z]{3}$/.test(i))return e;if(!moneyFormatters.has(i))try{moneyFormatters.set(i,new Intl.NumberFormat("en-US",{style:"currency",currency:i}))}catch{return e}return moneyFormatters.get(i).format(t)}function getSafeCheckoutUrl(n){try{const e=new URL(n);return e.protocol==="https:"?e.href:null}catch{return null}}function isStoredCartId(n){return typeof n=="string"&&n.length<=768&&/^gid:\/\/shopify\/Cart\/\S{10,}$/i.test(n)}function normalizeKv(n){return String(n||"").trim().replace(/\s*kv$/i,"")}function getVariantKv(n){const e=(n?.selectedOptions||[]).find(t=>/^kv$/i.test(t?.name||""));return normalizeKv(e?.value||"")}function getOrderKey(n,e){return`${n}:${e}`}function getDisplaySku(n){return String(n||"").trim().replace(/-4PK$/i,"")}class OrderStorefront{domContainer=null;domDrawer=null;domDrawerPanel=null;domOpenButtons=[];domCloseButton=null;domItems=null;domEmpty=null;domSubtotal=null;domMessage=null;domAvailability=null;domCheckout=null;domCountList=[];domLive=null;domLineTemplate=null;domBackgroundElements=[];api=new ShopifyStorefrontApi;products=new Map;productsByHandle=new Map;order=new Map;selectedQuantities=new Map;backgroundInertState=new Map;cart=null;isInitializing=!0;isActive=!1;isMutationPending=!1;mutationProductId=null;isDrawerOpen=!1;drawerReturnFocusTarget=null;scrollWasActive=!0;resizeFrame=0;resizeTimer=0;_onClickBound=null;_onKeyDownBound=null;constructor(e){e.__orderStorefront=this,this.domContainer=e,this.domDrawer=e.querySelector("[data-order-drawer]"),this.domDrawerPanel=this.domDrawer?.querySelector(".order-drawer__panel"),this.domOpenButtons=[...e.querySelectorAll("[data-order-open]")],this.domCloseButton=this.domDrawer?.querySelector(".order-drawer__close"),this.domItems=this.domDrawer?.querySelector("[data-order-items]"),this.domEmpty=this.domDrawer?.querySelector("[data-order-empty]"),this.domSubtotal=this.domDrawer?.querySelector("[data-order-subtotal]"),this.domMessage=this.domDrawer?.querySelector("[data-order-message]"),this.domAvailability=this.domDrawer?.querySelector("[data-order-availability]"),this.domCheckout=this.domDrawer?.querySelector("[data-order-checkout]"),this.domCountList=[...e.querySelectorAll("[data-order-count]")],this.domLive=e.querySelector("[data-order-live]"),this.domLineTemplate=e.querySelector("#order-line-template"),this.domBackgroundElements=[...new Set([document.querySelector("#site-header"),document.querySelector("#site-mobile-menu"),document.querySelector("#site-footer"),e.querySelector("[data-order-background]"),...e.querySelectorAll("#order-hero, .order-products-section, [data-order-open]")].filter(Boolean))],this._readProducts(),this._onClickBound=this._onClick.bind(this),this._onKeyDownBound=this._onKeyDown.bind(this),this.domContainer.addEventListener("click",this._onClickBound),document.addEventListener("keydown",this._onKeyDownBound),this.domDrawerPanel?.addEventListener("wheel",t=>t.stopPropagation(),{passive:!0}),this._renderOrder(),this._initializeStorefront()}_readProducts(){this.domContainer.querySelectorAll("[data-order-product]").forEach(t=>{const i=t.dataset.productId,r=t.dataset.shopifyHandle,a=t.dataset.shopifySku,o=Number(t.dataset.productMaxQuantity),s=Number(t.dataset.productUnitsPerPack),l=String(t.dataset.productOnlineKv||"").trim();let c={};try{c=JSON.parse(t.dataset.productKvDatasheets||"{}")}catch{c={}}const d=Number.isFinite(o)?Math.max(MIN_QUANTITY,Math.min(DEFAULT_MAX_QUANTITY,o)):DEFAULT_MAX_QUANTITY,f=Number.isFinite(s)&&s>0?s:DEFAULT_UNITS_PER_PACK;if(!i||!r||!a)return;const u={id:i,handle:r,sku:a,name:t.dataset.productName,specification:t.dataset.productSpecification,onlineKv:l,selectedKv:l,kvDatasheets:c,configuredMaxQuantity:d,unitsPerPack:f,maxQuantity:d,variantId:null,variantsByKv:new Map,variantsById:new Map,price:null,available:!1,state:"loading",domProduct:t};this.products.set(i,u),this.productsByHandle.set(r,u),this.selectedQuantities.set(i,MIN_QUANTITY),this._syncProductState(u)})}async _initializeStorefront(){if(!this.api.isConfigured){this._setAllProductsUnavailable("Online ordering is temporarily unavailable."),this._setDrawerMessage("Online ordering is temporarily unavailable."),this.isInitializing=!1,this._renderOrder();return}try{const e=await this.api.loadProducts([...this.productsByHandle.keys()]);this.products.forEach(t=>{this._applyShopifyProduct(t,e.get(t.handle))})}catch{this._setAllProductsUnavailable("Store availability could not be loaded. Please try again shortly."),this._setDrawerMessage("Online ordering is temporarily unavailable."),this._announce("Online ordering is temporarily unavailable."),this.isInitializing=!1,this._renderOrder();return}cartViews.add(this);try{await this._syncCart()}catch{this._setDrawerMessage("Your order could not be refreshed. Please try again.")}this.isInitializing=!1,this.products.forEach(e=>this._syncProductQuantityControls(e.id)),this._renderOrder()}async _syncCart(){const e=await acquireCart();try{await this._refreshCart()}finally{e()}}async _refreshCart(){const e=this._getStoredCartId()||sharedCart?.id;if(!e){this._applyCart(sharedCart||null);return}let t;try{t=await this.api.getCart(e)}catch(i){if(!(i instanceof ShopifyStorefrontError)||i.code!=="CART_INVALID")throw i}t?this._applyCart(t):(this._clearStoredCartId(),this._applyCart(sharedCart?{...sharedCart,id:null,checkoutUrl:null}:null))}_applyShopifyProduct(e,t){const i=t?.variants?.nodes||[];if(e.variantsByKv=new Map,e.variantsById=new Map,i.forEach(r=>{if(!r?.id)return;e.variantsById.set(r.id,r);const a=getVariantKv(r);a&&e.variantsByKv.set(a,r)}),e.shopifyAvailable=!!t?.availableForSale,i.length===0){this._setProductUnavailable(e,"This motor is temporarily unavailable.");return}this._applySelectedVariant(e)}_applySelectedVariant(e){const t=e.selectedKv?e.variantsByKv.get(normalizeKv(e.selectedKv)):[...e.variantsById.values()].find(o=>o.sku===e.sku)||[...e.variantsById.values()][0];if(!t?.id||!t.price){this._setProductUnavailable(e,"This motor is temporarily unavailable.");return}const i=Number(t.quantityAvailable),a=Number.isFinite(i)&&i>=0?Math.min(e.configuredMaxQuantity,Math.max(0,Math.floor(i))):e.configuredMaxQuantity;e.variantId=t.id,e.sku=t.sku||e.sku,e.price=t.price,e.maxQuantity=Math.max(MIN_QUANTITY,a),e.available=!!(e.shopifyAvailable&&t.availableForSale&&a>0),e.state=e.available?"available":"sold-out",this._syncProductState(e)}_markProductSoldOut(e,t=e.variantId,i=`${e.name} is sold out.`){e.variantId===t&&(e.available=!1,e.state="sold-out",e.maxQuantity=MIN_QUANTITY,this._syncProductState(e)),this.order.forEach(r=>{r.variantId===t&&(r.available=!1,r.state="sold-out",r.maxQuantity=MIN_QUANTITY)}),i&&this._announce(i)}_setAllProductsUnavailable(e){this.products.forEach(t=>this._setProductUnavailable(t,e))}_setProductUnavailable(e,t){e.available=!1,e.state="error",e.variantId=null,e.price=null;const i=e.domProduct.querySelector("[data-order-product-message]");i&&(i.textContent=t,i.hidden=!1),this._syncProductState(e)}_syncProductState(e){const t={loading:"Checking",available:"Available","sold-out":"Sold out",error:"Unavailable"};this.domContainer.querySelectorAll(`[data-product-id="${e.id}"]`).forEach(i=>{const r=i.querySelector("[data-order-product-status]"),a=i.querySelector("[data-order-product-status-text]"),o=i.querySelector("[data-order-product-price]"),s=i.querySelector("[data-order-product-unit-price]"),l=i.querySelector("[data-order-product-unit-price-container]"),c=i.querySelector("[data-order-product-message]"),d=i.querySelector("[data-order-purchase]"),f=i.querySelector("[data-order-sold-out]"),u=i.querySelectorAll("[data-order-product-sku-label]"),h=e.state==="sold-out",_=e.price;if(i.dataset.storeState=e.state,r?.setAttribute("data-state",e.state),a&&(a.textContent=t[e.state]||"Unavailable"),u.forEach(v=>{const m=getDisplaySku(e.sku);v.textContent=m?`SKU / ${m}`:"SKU / Unavailable"}),o&&(o.textContent=_?formatMoney(_):"—",o.setAttribute("aria-label",_?`Price ${formatMoney(_)}`:"Price unavailable")),s){const v=_?{amount:Number(_.amount)/e.unitsPerPack,currencyCode:_.currencyCode}:null,m=formatMoney(v);s.textContent=v?m:"—",l?.setAttribute("aria-label",v?`Price per motor ${m}`:"Per-motor price unavailable")}c&&e.state!=="error"&&(c.hidden=!0,c.textContent=""),d&&(d.hidden=!1),f&&(f.hidden=!h)}),this._syncProductQuantityControls(e.id)}_selectKvOption(e,t){const i=this.products.get(e?.dataset.productId),r=String(t?.dataset.kvValue||"").trim();if(!i||!r||this.isMutationPending||this.isInitializing||![...this.domContainer.querySelectorAll(`[data-product-id="${i.id}"] [data-order-kv-option]`)].some(s=>s.dataset.kvValue===r))return;i.selectedKv=r,i.variantsById.size>0&&this._applySelectedVariant(i),this.selectedQuantities.set(i.id,clampQuantity(this.selectedQuantities.get(i.id),i.maxQuantity));const o=i.kvDatasheets?.[r]||null;this.domContainer.querySelectorAll(`[data-specifications-product-id="${i.id}"] [data-specification-values]`).forEach(s=>{const l=JSON.parse(s.dataset.specificationValues);Object.hasOwn(l,r)&&(s.textContent=l[r])}),this.domContainer.querySelectorAll(`[data-product-id="${i.id}"]`).forEach(s=>{s.querySelectorAll("[data-order-kv-option]").forEach(l=>{const c=l.dataset.kvValue===r;l.classList.toggle("is-selected",c),l.setAttribute("aria-pressed",c?"true":"false")}),s.querySelectorAll("[data-order-product-selected-kv]").forEach(l=>{l.textContent=`${r}KV`})}),this.domContainer.querySelectorAll("[data-order-datasheet]").forEach(s=>{o?.datasheetUrl&&s.setAttribute("href",o.datasheetUrl),o?.datasheetFilename&&s.setAttribute("download",o.datasheetFilename)}),this._syncProductState(i),this._announce(`${i.name} ${r}KV selected.`)}activate(){this.isActive=!0,this.isInitializing||this._syncCart().catch(()=>{this._setDrawerMessage("Your order could not be refreshed. Please try again.")}),this._setOpenButtonState(!1),window.cancelAnimationFrame(this.resizeFrame),window.clearTimeout(this.resizeTimer),this.resizeFrame=window.requestAnimationFrame(()=>{scrollManager.resize(window.innerWidth,window.innerHeight),this.resizeTimer=window.setTimeout(()=>{scrollManager.resize(window.innerWidth,window.innerHeight)},300)})}deactivate(){this.isActive=!1,window.cancelAnimationFrame(this.resizeFrame),window.clearTimeout(this.resizeTimer),this.closeDrawer({restoreFocus:!1})}_onClick(e){const t=e.target.closest("button");if(t&&this.domContainer.contains(t)){if(t.matches("[data-order-open]")){this.openDrawer(t);return}if(t.matches("[data-order-checkout]")){this._checkout();return}if(t.matches("[data-order-close]")){this.closeDrawer();return}const i=t.closest("[data-product-id]");if(t.matches("[data-order-kv-option]")){this._selectKvOption(i,t);return}if(t.matches("[data-order-quantity-decrement]")){this._changeProductQuantity(i,-1);return}if(t.matches("[data-order-quantity-increment]")){this._changeProductQuantity(i,1);return}if(t.matches("[data-order-add]")){this._addProduct(i,t);return}const a=t.closest("[data-order-line]")?.dataset.orderKey;if(t.matches("[data-order-line-decrement]")){this._changeOrderQuantity(a,-1,t);return}if(t.matches("[data-order-line-increment]")){this._changeOrderQuantity(a,1,t);return}t.matches("[data-order-line-remove]")&&this._removeProduct(a);return}}_onKeyDown(e){if(this.isDrawerOpen){if(e.key==="Escape"){e.preventDefault(),this.closeDrawer();return}e.key==="Tab"&&this._trapFocus(this.domDrawerPanel,e)}}_trapFocus(e,t){const i=[...e.querySelectorAll(FOCUSABLE_SELECTOR)].filter(o=>o.getClientRects().length>0&&o.getAttribute("aria-hidden")!=="true");if(i.length===0){t.preventDefault(),e.focus();return}const r=i[0],a=i[i.length-1];t.shiftKey&&document.activeElement===r?(t.preventDefault(),a.focus()):!t.shiftKey&&document.activeElement===a&&(t.preventDefault(),r.focus())}_changeProductQuantity(e,t){const i=this.products.get(e?.dataset.productId);if(!i?.available||this.isMutationPending||this.isInitializing)return;const r=this.selectedQuantities.get(i.id)||MIN_QUANTITY,a=clampQuantity(r+t,i.maxQuantity);this.selectedQuantities.set(i.id,a),this._syncProductQuantityControls(i.id),t>0&&a===i.maxQuantity&&this._announce(`${i.name} online order limit reached. For more than ${i.maxQuantity} four-packs, request production pricing.`)}async _addProduct(e,t){const i=this.products.get(e?.dataset.productId);if(!i?.available||!i.variantId||this.isMutationPending||this.isInitializing)return;const r=clampQuantity(this.selectedQuantities.get(i.id),i.maxQuantity),a=getOrderKey(i.id,i.variantId);this._startMutation(i.id),this._setDrawerMessage("");const o=await acquireCart();try{await this._refreshCart();const s=this.order.get(a),l=this._buildCartLines({product:i,quantity:r});let c;this.cart?.id?s?c=await this._withCartRecovery(()=>this.api.updateCartLines(this.cart.id,[{id:s.lineId,quantity:r}]),l):c=await this._withCartRecovery(()=>this.api.addCartLines(this.cart.id,[{merchandiseId:i.variantId,quantity:r}]),l):c=await this.api.createCart(l);const d=i.selectedKv?`${i.name} ${i.selectedKv}KV`:i.name,f=r===i.maxQuantity?`${d} added to order at the online limit of ${i.maxQuantity} four-packs. Larger quantities use production pricing.`:`${d} added to order. ${r} four-pack${r===1?"":"s"} selected.`;this._applyCart(c,f),this.isActive&&this.openDrawer(t)}catch(s){this._handleProductUnavailableError(s,i)||(this._setDrawerMessage("The order could not be updated. Please try again."),this._announce("The order could not be updated. Please try again."))}finally{o(),this._finishMutation()}}async _changeOrderQuantity(e,t,i){let r=this.order.get(e);if(!r?.available||this.isMutationPending||this.isInitializing)return;const a=t>0?"[data-order-line-increment]":"[data-order-line-decrement]";this._startMutation(r.id),this._setDrawerMessage("");const o=await acquireCart();try{if(await this._refreshCart(),r=this.order.get(e),!r?.available)return;const s=clampQuantity(r.quantity+t,r.maxQuantity);if(s===r.quantity)return;const l=this._buildCartLines({orderKey:e,quantity:s}),c=this.cart?.id?await this._withCartRecovery(()=>this.api.updateCartLines(this.cart.id,[{id:r.lineId,quantity:s}]),l):await this.api.createCart(l),d=t>0&&s===r.maxQuantity?`${r.name} online order limit reached. For more than ${r.maxQuantity} four-packs, request production pricing.`:`${r.name} quantity updated to ${s}.`;this._applyCart(c,d)}catch(s){const l=this.products.get(r.id);this._handleProductUnavailableError(s,l,r.variantId)||(this._setDrawerMessage("The order could not be updated. Please try again."),this._announce("The order could not be updated. Please try again."))}finally{o(),this._finishMutation(),this._restoreLineFocus(e,a,i)}}_handleProductUnavailableError(e,t,i=t?.variantId){return!(e instanceof ShopifyStorefrontError)||e.code!=="PRODUCT_UNAVAILABLE"||!t?!1:(this._markProductSoldOut(t,i,`${t.name} sold out before the order could be updated.`),this._setDrawerMessage(`${t.name} is now sold out. Remove it from your order to continue.`),this._renderOrder(),!0)}async _removeProduct(e){let t=this.order.get(e);if(!t||this.isMutationPending||this.isInitializing)return;this._startMutation(t.id),this._setDrawerMessage("");const i=await acquireCart();try{if(await this._refreshCart(),t=this.order.get(e),!t)return;const r=this._buildCartLines({excludeOrderKey:e}),a=this.cart?.id?await this._withCartRecovery(()=>this.api.removeCartLines(this.cart.id,[t.lineId]),r):await this.api.createCart(r);this.selectedQuantities.set(t.id,MIN_QUANTITY),this._applyCart(a,`${t.name} removed from order.`)}catch{this._setDrawerMessage("The item could not be removed. Please try again."),this._announce("The item could not be removed. Please try again.")}finally{i(),this._finishMutation(),window.requestAnimationFrame(()=>{(this.domItems.querySelector("button")||this.domCloseButton)?.focus()})}}async _withCartRecovery(e,t){try{return await e()}catch(i){if(!(i instanceof ShopifyStorefrontError)||i.code!=="CART_INVALID")throw i;return this._clearStoredCartId(),this.api.createCart(t)}}_buildCartLines({orderKey:e=null,quantity:t=null,product:i=null,excludeOrderKey:r=null}={}){const a=new Map;if(this.order.forEach((o,s)=>{s===r||!o.variantId||!o.available||a.set(s,{merchandiseId:o.variantId,quantity:clampQuantity(o.quantity,o.maxQuantity)})}),i?.variantId&&i.available)a.set(getOrderKey(i.id,i.variantId),{merchandiseId:i.variantId,quantity:clampQuantity(t,i.maxQuantity)});else if(e&&a.has(e)){const o=this.order.get(e);a.set(e,{merchandiseId:o.variantId,quantity:clampQuantity(t,o.maxQuantity)})}return[...a.values()]}_applyCart(e,t,i=!0){this.cart=e,this.order.clear(),(e?.lines?.nodes||[]).forEach(r=>{const a=this.productsByHandle.get(r?.merchandise?.product?.handle),o=Number(r?.quantity);if(!a||!r?.id||!Number.isFinite(o)||o<MIN_QUANTITY)return;const s=r.merchandise.id,l=a.variantsById.get(s),c=getVariantKv(r.merchandise)||getVariantKv(l),d=Number(r.merchandise.quantityAvailable),u=Number.isFinite(d)&&d>=0?Math.min(a.configuredMaxQuantity,Math.max(0,Math.floor(d))):a.configuredMaxQuantity,h=Math.max(MIN_QUANTITY,u),_=r.merchandise.availableForSale!==!1&&u>0;_||this._markProductSoldOut(a,s,"");const v=getOrderKey(a.id,s),m={...a,lineId:r.id,orderKey:v,variantId:s,selectedKv:c,specification:c?`${c}KV`:a.specification,sku:r.merchandise.sku||l?.sku||a.sku,available:_,state:_?"available":"sold-out",maxQuantity:h,quantity:o,lineTotal:r.cost?.totalAmount};this.order.set(v,m),a.variantId===s&&this.selectedQuantities.set(a.id,clampQuantity(o,h))}),e?.id&&this._storeCartId(e.id),this.products.forEach(r=>this._syncProductQuantityControls(r.id)),this._renderOrder(t),i&&(sharedCart=e,cartViews.forEach(r=>{r!==this&&r._applyCart(e,void 0,!1)}))}_startMutation(e){this.isMutationPending=!0,this.mutationProductId=e,this.products.forEach(t=>this._syncProductQuantityControls(t.id)),this.domItems?.querySelectorAll("button").forEach(t=>{t.disabled=!0}),this._syncCheckoutState()}_finishMutation(){this.isMutationPending=!1,this.mutationProductId=null,this.products.forEach(e=>this._syncProductQuantityControls(e.id)),this._renderOrder()}_restoreLineFocus(e,t,i){window.requestAnimationFrame(()=>{([...this.domItems?.querySelectorAll("[data-order-line]")||[]].find(a=>a.dataset.orderKey===e)?.querySelector(t)||i||this.domCloseButton)?.focus()})}_syncProductQuantityControls(e){const t=this.products.get(e);if(!t)return;const i=clampQuantity(this.selectedQuantities.get(e),t.maxQuantity),r=t.available&&!this.isMutationPending&&!this.isInitializing;this.domContainer.querySelectorAll(`[data-product-id="${e}"]`).forEach(a=>{const o=a.querySelector("[data-order-quantity]"),s=a.querySelector("[data-order-quantity-decrement]"),l=a.querySelector("[data-order-quantity-increment]"),c=a.querySelector("[data-order-add]"),d=a.querySelector("[data-order-add-label]");!o||!s||!l||!c||!d||(o.textContent=String(i),o.setAttribute("aria-label",`${i} of ${t.maxQuantity} four-packs selected`),s.disabled=!r||i<=MIN_QUANTITY,l.disabled=!r||i>=t.maxQuantity,c.disabled=!r,this.isMutationPending&&this.mutationProductId===t.id?d.textContent="Updating order":t.state==="loading"?d.textContent="Checking availability":t.state==="sold-out"?d.textContent="Sold out":t.state==="error"?d.textContent="Unavailable":d.textContent="Add to order")})}_setDrawerMessage(e){this.domMessage&&(this.domMessage.textContent=e,this.domMessage.hidden=!e)}_announce(e){this.domLive&&(this.domLive.textContent=e)}_getStoredCartId(){try{const e=window.localStorage.getItem(CART_STORAGE_KEY);if(isStoredCartId(e))return e;e&&window.localStorage.removeItem(CART_STORAGE_KEY)}catch{}return null}_storeCartId(e){if(isStoredCartId(e))try{window.localStorage.setItem(CART_STORAGE_KEY,e)}catch{}}_clearStoredCartId(){try{window.localStorage.removeItem(CART_STORAGE_KEY)}catch{}}_clearCart(){this.cart=null,this.order.clear(),this._clearStoredCartId()}_checkout(){const e=getSafeCheckoutUrl(this.cart?.checkoutUrl),t=[...this.order.values()].some(i=>!i.available);!e||t||this.isMutationPending||Number(this.cart?.totalQuantity)<1||window.location.assign(e)}openDrawer(e){!this.domDrawer||this.isDrawerOpen||(this.isDrawerOpen=!0,this.drawerReturnFocusTarget=e||document.activeElement,this.scrollWasActive=scrollManager.isActive,scrollManager.isActive=!1,document.body.classList.add("is-order-drawer-open"),this._setBackgroundInert(!0),this.domDrawer.removeAttribute("inert"),this.domDrawer.setAttribute("aria-hidden","false"),this.domDrawer.classList.add("is-open"),this._setOpenButtonState(!0),window.requestAnimationFrame(()=>this.domCloseButton?.focus()))}closeDrawer({restoreFocus:e=!0}={}){!this.domDrawer||!this.isDrawerOpen||(this.isDrawerOpen=!1,document.body.classList.remove("is-order-drawer-open"),this.domDrawer.classList.remove("is-open"),this.domDrawer.setAttribute("aria-hidden","true"),this.domDrawer.setAttribute("inert",""),this._setOpenButtonState(!1),this._setBackgroundInert(!1),scrollManager.isActive=this.scrollWasActive,e&&this.drawerReturnFocusTarget?.isConnected&&this.drawerReturnFocusTarget.focus(),this.drawerReturnFocusTarget=null)}_setBackgroundInert(e){if(e){this.domBackgroundElements.forEach(t=>{this.backgroundInertState.has(t)||this.backgroundInertState.set(t,t.hasAttribute("inert")),t.setAttribute("inert","")});return}this.domBackgroundElements.forEach(t=>{this.backgroundInertState.get(t)||t.removeAttribute("inert")}),this.backgroundInertState.clear()}_setOpenButtonState(e){this.domOpenButtons.forEach(t=>{t.setAttribute("aria-expanded",e?"true":"false")})}_syncCheckoutState(){if(!this.domCheckout)return;const e=getSafeCheckoutUrl(this.cart?.checkoutUrl),t=[...this.order.values()].some(r=>!r.available),i=!!e&&Number(this.cart?.totalQuantity)>0&&!t&&!this.isMutationPending;this.domCheckout.disabled=!i,this.domCheckout.setAttribute("aria-disabled",i?"false":"true")}_renderOrder(e){if(!this.domItems||!this.domLineTemplate)return;this.domItems.replaceChildren(),[...this.order.values()].forEach((o,s)=>{const l=this.domLineTemplate.content.cloneNode(!0),c=l.querySelector("[data-order-line]"),d=l.querySelector("[data-order-line-quantity-group]"),f=l.querySelector("[data-order-line-decrement]"),u=l.querySelector("[data-order-line-increment]"),h=l.querySelector("[data-order-line-remove]"),_=l.querySelector("[data-order-line-availability]"),v=o.selectedKv?`Atlas ${o.name} ${o.selectedKv}KV`:`Atlas ${o.name}`;c.dataset.productId=o.id,c.dataset.orderKey=o.orderKey,c.classList.toggle("is-unavailable",!o.available),l.querySelector("[data-order-line-index]").textContent=String(s+1).padStart(2,"0"),l.querySelector("[data-order-line-name]").textContent=o.name,l.querySelector("[data-order-line-specification]").textContent=`${o.specification} / Four-pack`,l.querySelector("[data-order-line-price]").textContent=formatMoney(o.lineTotal),l.querySelector("[data-order-line-quantity]").textContent=String(o.quantity),_&&(_.hidden=o.available),d.setAttribute("aria-label",`Quantity of ${v} four-packs`),f.setAttribute("aria-label",`Decrease ${v} quantity`),u.setAttribute("aria-label",`Increase ${v} quantity`),h.setAttribute("aria-label",`Remove ${v} from order`),f.disabled=this.isMutationPending||!o.available||o.quantity<=MIN_QUANTITY,u.disabled=this.isMutationPending||!o.available||o.quantity>=o.maxQuantity,h.disabled=this.isMutationPending,this.domItems.append(l)}),this.domEmpty.hidden=this.order.size>0,this.domEmpty.textContent=this.isInitializing?"Checking your order…":"Your order is empty.",this.domSubtotal.textContent=this.cart?formatMoney(this.cart.cost?.subtotalAmount):formatMoney({amount:"0",currencyCode:"USD"},"$0.00");const t=[...this.order.values()].some(o=>!o.available);this.domAvailability&&(this.domAvailability.hidden=!t);const i=Number.isFinite(Number(this.cart?.totalQuantity))?Math.max(0,Number(this.cart.totalQuantity)):0,r=i>MAX_DISPLAY_QUANTITY?"99+":String(i).padStart(2,"0"),a=`${i} four-pack${i===1?"":"s"} in order`;this.domCountList.forEach(o=>{o.textContent=r,o.setAttribute("aria-label",a)}),this._syncCheckoutState(),e&&this._announce(e)}}export{visuals as $,RawShaderMaterial as A,BufferGeometry as B,NoBlending as C,blitFrag as D,postprocessing as E,FloatType as F,GLSL3 as G,HalfFloatType as H,PerspectiveCamera as I,Matrix4 as J,Color as K,LineSegments as L,Mesh as M,NoColorSpace as N,Object3D as O,Points as P,Scene as Q,RGBAIntegerFormat as R,SplitText as S,Texture as T,UnsignedIntType as U,Vector3 as V,WebGLRenderer as W,textureHelper as X,blueNoise as Y,screenPaint as Z,cameraControls as _,browser as a,routeManager as a0,siteHeader as a1,siteMobileMenu as a2,heroVideo as a3,guardLoader as a4,scrollManager as a5,pagesManager as a6,Tween as a7,ContactForm as a8,OrderInquiryForm as a9,ActuatorInterestForm as aa,OrderStorefront as ab,backgroundGrid as b,BufferAttribute as c,Sphere as d,ease as e,Box3 as f,MeshNormalMaterial as g,LineBasicMaterial as h,input as i,PointsMaterial as j,fboHelper as k,UnsignedByteType as l,math as m,RGBAFormat as n,LinearMipMapLinearFilter as o,properties as p,LinearFilter as q,LinearMipMapNearestFilter as r,settings as s,NearestMipMapLinearFilter as t,NearestMipMapNearestFilter as u,RedFormat as v,RGFormat as w,RGBFormat as x,Vector2 as y,shaderHelper as z};
