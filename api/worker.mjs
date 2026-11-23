/**
 * Manara AI backend, Cloudflare Worker. Public code contains NO secrets.
 * Env secrets: OPENAI_API_KEY, TEACHER_ACCESS_TOKEN. CORS only trusted site.
 */
const ORIGIN="https://hamzarabaa33-netizen.github.io";
const MAX_BODY=24000;
const coreFields={type:"object",additionalProperties:false,required:["id","domain","bloom","skill","instruction","evidence","expectedAnswer","points","rationale"],properties:{
 id:{type:"string"},domain:{type:"string",enum:["reading","language"]},
 bloom:{type:"string",enum:["تذكر","فهم","تطبيق","تحليل","تقويم","إبداع"]},
 skill:{type:"string"},instruction:{type:"string"},evidence:{type:"string"},
 expectedAnswer:{type:"string"},points:{type:"number"},rationale:{type:"string"}
}};
const OUTPUT_SCHEMA={type:"object",additionalProperties:false,required:["examTitle","questions","writing","sourceNotes"],properties:{
 examTitle:{type:"string"},questions:{type:"array",items:coreFields},sourceNotes:{type:"array",items:{type:"string"}},
 writing:{type:"object",additionalProperties:false,required:["context","instruction","criteria","suggestedPoints"],properties:{
 context:{type:"string"},instruction:{type:"string"},criteria:{type:"array",items:{type:"string"}},suggestedPoints:{type:"number"}
 }}
}};
const REVIEW_SCHEMA={type:"object",additionalProperties:false,required:["approved","findings"],properties:{
 approved:{type:"boolean"},findings:{type:"array",items:{type:"object",additionalProperties:false,required:["questionId","severity","reason"],properties:{
 questionId:{type:"string"},severity:{type:"string",enum:["info","warning","error"]},reason:{type:"string"}
 }}}
}};
const TEACHER_PROMPT="أنت مؤلف تقويمات للغة العربية في الجزائر. من النص المصدر الفعلي فقط أنشئ ثلاثة إلى خمسة أسئلة فهم متنوعة مع إجابة نموذجية وشاهد حرفي لكل سؤال. صنف المستوى المعرفي حسب عمل المتعلم الفعلي وفق بلوم المعدلة، لا فعل الأمر وحده. لا تنسخ أسئلة البيام، بل استلهم منهجية بنائها. لا تنشئ سؤال بناء لغوي إلا إذا زوّدك الأستاذ بمورد درسه فعلًا وكانت الظاهرة متحققة في شاهد صحيح من النص. اجعل البنية اللغوية فارغة عند انعدام الموارد. تجنب تعميم مخطط الرابعة متوسط المؤرخ 2018 على التوزيع الحقيقي 2026. أضف وضعية إدماجية كاملة بسياق واقعي ومطلوب واضح ومؤشرات تصحيح. أنتج إجابات تفصيلية قدر الإمكان، وتنقيطًا مقترحًا لا تدّعِ رسميته. لا تنسب مؤلفًا مجهولًا أو نصًا من خيالك. أرجع البيانات المطلوبة فقط.";
const REVIEW_PROMPT="أنت مدقق تربوي مستقل. راجع أسئلة الاختبار وأجوبتها ومطابقة الشواهد وأهداف بلوم وملاءمة الوضعية والموارد المدروسة. لا تزعم التحقق من المنهاج الرسمي الساري ما لم يتوافر. أعد ملاحظات دقيقة باللغة العربية؛ مرّر علامات إنذار للقواعد النحوية التي لا تثبتها الشواهد. لا تعطي موافقة تلقائية.";
function norm(t){return String(t||"").normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ").trim()}
function safeEq(a,b){if(typeof a!=="string"||typeof b!=="string")return false;const x=new TextEncoder().encode(a),y=new TextEncoder().encode(b);let v=x.length^y.length;for(let i=0;i<Math.max(x.length,y.length);i++)v|=(x[i]||0)^(y[i]||0);return v===0}
function headers(origin){return {"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...(origin===ORIGIN?{"access-control-allow-origin":origin,"access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type,x-manara-token","vary":"Origin"}:{})}}
function json(body,code,origin){return new Response(JSON.stringify(body),{status:code,headers:headers(origin)})}
function validateInput(d){
 if(!d||typeof d!=="object")return "بيانات غير صالحة.";
 if(typeof d.passage!=="string"||d.passage.length<180||d.passage.length>10500)return "نحتاج نصًا حقيقيًا بين 180 و10500 حرف.";
 for(const key of ["grade","segment","kind","genre"]){if(typeof d[key]!=="string"||d[key].length>140)return "الحقل "+key+" غير صالح."}
 if(typeof d.sourceTitle!=="string"||d.sourceTitle.length>240)return "عنوان النص غير صالح.";
 if(typeof d.sourceReference!=="string"||d.sourceReference.length>900)return "مرجع النص غير صالح.";
 if(typeof d.sourceAuthor!=="string"||d.sourceAuthor.length>150)return "المؤلف غير صالح.";
 if(!Array.isArray(d.taughtResources)||d.taughtResources.length>20||d.taughtResources.some(x=>typeof x!=="string"||x.length>120))return "الموارد المدروسة غير صالحة.";
 return null;
}
async function ask(env,instructions,input,schema,signal){
 const res=await fetch("https://api.openai.com/v1/responses",{method:"POST",signal,headers:{
  "authorization":"Bearer "+env.OPENAI_API_KEY,"content-type":"application/json"
 },body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-4o-mini",instructions,input:JSON.stringify(input),store:false,max_output_tokens:3000,text:{format:{type:"json_schema",name:"manara_exam",strict:true,schema}}})});
 if(!res.ok)throw Error("تعذر اتصال نموذج الذكاء الاصطناعي ("+res.status+").");
 const data=await res.json();
 if(data.status==="incomplete")throw Error("رد غير مكتمل من النموذج. اختر نصًا أقصر.");
 const t=(data.output||[]).flatMap(x=>(x.content||[]).filter(c=>c.type==="output_text").map(c=>c.text)).join("").trim();
 if(!t)throw Error("لم يُرجع النموذج اختبارًا منظّمًا.");
 try{return JSON.parse(t)}catch{throw Error("تعذرت قراءة الاستجابة المنظّمة.")}
}
function checkQuestions(draft,passage,taughtResources){
 const valid=[],findings=[],seen=new Set();let sum=0;
 const source=norm(passage);
 for(const item of draft.questions||[]){
  if(!item||!["reading","language"].includes(item.domain))continue;
  if(seen.has(item.id)){findings.push({questionId:item.id,severity:"error",reason:"سؤال مكرر."});continue}
  seen.add(item.id);
  if(norm(item.evidence).length<8||!source.includes(norm(item.evidence))){
   findings.push({questionId:item.id,severity:"error",reason:"الشاهد غير موجود في نص السند، فحُجب السؤال."});continue;
  }
  if(!String(item.instruction||"").trim()||!String(item.expectedAnswer||"").trim()){
   findings.push({questionId:item.id,severity:"error",reason:"السؤال أو الإجابة ناقصان."});continue;
  }
  const p=Number(item.points);
  if(!Number.isFinite(p)||p<0||p>8){findings.push({questionId:item.id,severity:"error",reason:"نقطة غير صالحة."});continue}
  if(item.domain==="language"&&!taughtResources.length){
   findings.push({questionId:item.id,severity:"warning",reason:"لم تُعرف الموارد المدروسة، فحُجب السؤال اللغوي."});continue;
  }
  sum+=p;valid.push({...item,points:p,grounded:true,needsTeacherReview:true});
 }
 if(!valid.some(x=>x.domain==="reading"))findings.push({questionId:"reading",severity:"error",reason:"لا توجد أسئلة فهم مسندة لشواهد حرفية."});
 if(!valid.some(x=>x.domain==="language"))findings.push({questionId:"language",severity:"warning",reason:"البناء اللغوي غير مُنجز؛ الناتج مسودة فهم وإنتاج كتابي."});
 const writingPoints=Number(draft.writing?.suggestedPoints||0);
 if(Math.abs(sum+writingPoints-20)>.01)findings.push({questionId:"marks",severity:"warning",reason:"مجموع النقاط المقترح "+(sum+writingPoints)+" وليس 20."});
 return {questions:valid,findings};
}
async function generate(input,env){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),48000);
 try{
  const context={grade:input.grade,segment:input.segment,kind:input.kind,genre:input.genre,
   pattern:input.pattern||"",sourceTitle:input.sourceTitle,sourceAuthor:input.sourceAuthor,
   sourceReference:input.sourceReference,taughtResources:input.taughtResources,previous:input.previous||"",
   curriculumCaveat:"الوثيقة الوزارية الرابعة متوسط 2018 مرجع تاريخي فقط، والتوزيع الفعلي للمعلم مقدّم.",
   passage:input.passage};
  const drafted=await ask(env,TEACHER_PROMPT,context,OUTPUT_SCHEMA,controller.signal);
  const verified=checkQuestions(drafted,input.passage,input.taughtResources);
  let reviewer={approved:false,findings:[{questionId:"review",severity:"warning",reason:"تعذر التدقيق المستقل الآلي، ويلزم تدقيق الأستاذ."}]};
  try{reviewer=await ask(env,REVIEW_PROMPT,{source:input.passage,questions:verified.questions,writing:drafted.writing,
     context:{grade:input.grade,segment:input.segment,taughtResources:input.taughtResources}},REVIEW_SCHEMA,controller.signal)}
  catch{} // A generated draft is never marked approved when review failed.
  const findings=[...verified.findings,...(reviewer.findings||[])].slice(0,60);
  if(!input.sourceAuthor||!input.sourceReference)findings.push({questionId:"source",severity:"warning",reason:"معلومات مصدر النص ناقصة؛ لا تعتمد الوثيقة."});
  return {status:"teacher-review-required",examTitle:drafted.examTitle,
    source:{title:input.sourceTitle,author:input.sourceAuthor,reference:input.sourceReference,passage:input.passage},
    questions:verified.questions,writing:drafted.writing,findings,
    verification:{evidenceChecked:true,independentReviewApproved:reviewer.approved===true,
      curriculumVerified:false,sourceVerified:false,gradingVerified:false}};
 }finally{clearTimeout(timer)}
}
export default {async fetch(request,env){
 const origin=request.headers.get("origin")||"",url=new URL(request.url);
 if(request.method==="OPTIONS")return origin===ORIGIN?new Response(null,{status:204,headers:headers(origin)}):json({error:"origin_not_allowed"},403,origin);
 if(request.method==="GET"&&url.pathname==="/health")return json({ok:true,service:"manara-ai-v023",configured:!!(env.OPENAI_API_KEY&&env.TEACHER_ACCESS_TOKEN)},200,origin);
 if(request.method!=="POST"||url.pathname!=="/generate")return json({error:"not_found"},404,origin);
 if(origin&&origin!==ORIGIN)return json({error:"origin_not_allowed"},403,origin);
 if(!env.OPENAI_API_KEY||!env.TEACHER_ACCESS_TOKEN)return json({error:"الخدمة غير مفعّلة: أضف المفتاح السري ورمز الأستاذ عند نشر Worker."},503,origin);
 if(!safeEq(request.headers.get("x-manara-token")||"",env.TEACHER_ACCESS_TOKEN))return json({error:"رمز دخول الأستاذ غير صحيح."},401,origin);
 if(Number(request.headers.get("content-length")||0)>MAX_BODY)return json({error:"الطلب كبير جدًا."},413,origin);
 let payload;try{const data=await request.text();if(data.length>MAX_BODY)return json({error:"الطلب كبير جدًا."},413,origin);payload=JSON.parse(data)}catch{return json({error:"بيانات JSON غير صالحة."},400,origin)}
 const err=validateInput(payload);if(err)return json({error:err},400,origin);
 try{return json(await generate(payload,env),200,origin)}
 catch(e){return json({error:e.name==="AbortError"?"انتهت المهلة؛ اختر نصًا أقصر.":String(e.message||"خطأ في الخدمة")},502,origin)}
}};
export {validateInput,checkQuestions,safeEq,norm};
