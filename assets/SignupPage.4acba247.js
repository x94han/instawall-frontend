import{Q as n,a as o}from"./QCardSection.b4764d2d.js";import{Q as t,n as w}from"./notifyApiError.22ce61ab.js";import{b0 as V,F as _,r as g,D as b,H as h,I as x,N as d,J as l,K as r,L as i,b1 as Q,aY as q,Q as m}from"./index.ef0b161e.js";import{Q as v}from"./QForm.29410c8f.js";const N={class:"bg-grey-1 fullscreen q-pa-md scroll flex justify-center items-center"},C={style:{width:"350px","max-width":"350px"}},S=d("h1",{class:"text-h3 text-grand-hotel q-my-lg"},"Instawall",-1),z=d("div",{class:"self-center"},"\u5DF2\u7D93\u6709\u5E33\u865F\u55CE\uFF1F",-1),I={__name:"SignupPage",setup(B){const p=V(),c=_(),u=g(!1),s=b({email:"",screenName:"",password:"",passwordConfirm:""}),f=async y=>{u.value=!0;try{await c.signup(s),p.push({name:"HomePage"})}catch(a){w(a)}finally{u.value=!1}};return(y,a)=>(h(),x("div",N,[d("div",C,[l(n,{flat:"",bordered:"",class:"text-center q-mb-md"},{default:r(()=>[l(o,{class:"column"},{default:r(()=>[S]),_:1}),l(o,null,{default:r(()=>[l(v,{onSubmit:f,class:"column q-gutter-sm"},{default:r(()=>[l(t,{modelValue:s.email,"onUpdate:modelValue":a[0]||(a[0]=e=>s.email=e),modelModifiers:{trim:!0},type:"email",square:"",outlined:"",dense:"","lazy-rules":"",rules:[e=>i(Q)(e)||"\u8ACB\u8F38\u5165\u6B63\u78BA\u683C\u5F0F"],placeholder:"\u96FB\u5B50\u90F5\u4EF6\u5730\u5740"},null,8,["modelValue","rules"]),l(t,{modelValue:s.screenName,"onUpdate:modelValue":a[1]||(a[1]=e=>s.screenName=e),modelModifiers:{trim:!0},type:"screenName",square:"",outlined:"",dense:"","lazy-rules":"",rules:[e=>e&&e.length>=2||"\u66B1\u7A31\u9700\u5927\u65BC\u5169\u500B\u5B57"],placeholder:"\u66B1\u7A31"},null,8,["modelValue","rules"]),l(t,{modelValue:s.password,"onUpdate:modelValue":a[2]||(a[2]=e=>s.password=e),modelModifiers:{trim:!0},type:"password",square:"",outlined:"",dense:"","lazy-rules":"",rules:[e=>i(q)(e)||"\u5BC6\u78BC\u9577\u5EA6\u9700\u5927\u65BC\u516B\u78BC\u4E14\u6578\u5B57\u8207\u82F1\u6587\u6216\u7B26\u865F\u6DF7\u5408"],placeholder:"\u5BC6\u78BC"},null,8,["modelValue","rules"]),l(t,{modelValue:s.passwordConfirm,"onUpdate:modelValue":a[3]||(a[3]=e=>s.passwordConfirm=e),modelModifiers:{trim:!0},type:"password",square:"",outlined:"",dense:"","lazy-rules":"",rules:[e=>e===s.password||"\u5BC6\u78BC\u8F38\u5165\u4E0D\u4E00\u81F4"],placeholder:"\u78BA\u8A8D\u5BC6\u78BC"},null,8,["modelValue","rules"]),l(m,{label:"\u8A3B\u518A",type:"submit",color:"primary"})]),_:1})]),_:1})]),_:1}),l(n,{flat:"",bordered:"",class:"text-center"},{default:r(()=>[l(o,{class:"row justify-center"},{default:r(()=>[z,l(m,{flat:"",color:"primary",label:"\u767B\u5165",to:"/login"})]),_:1})]),_:1})])]))}};export{I as default};