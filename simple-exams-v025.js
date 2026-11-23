/* واجهة الاختبارات المبسطة V0.25 — منفصلة بصريًا عن منصة المذكرات. */
(function(){"use strict";
const $=id=>document.getElementById(id);
const main=document.querySelector("main"),home=$("simpleExamHome"),output=$("output");
if(!main||!home||!output)return;
for(const n of [...main.children]){
 if(n===home||n===output||n.id==="examSuite"||n.tagName==="HEADER")continue;
 n.classList.add("simple-legacy");
}
const $v=id=>String($(id)?.value||"").trim();
const msg=(s,bad=false)=>{const e=$("simpleState");e.textContent=s;e.classList.toggle("simple-error",bad);};
const sourceDetails=$("simpleSourceDetails");
const expert=$("simpleExpert");
const samplePage="كليلة ودمنة/باب الحمامة المطوقة";
const sampleUrl="https://ar.wikisource.org/wiki/كليلة_ودمنة/باب_الحمامة_المطوقة";
let busy=false;
function setBusy(val){
 busy=val;
 for(const id of ["simpleCreate","simpleSample"])$(id).disabled=val;
}
function sync(){
 $("chosenLevel").value=$v("simpleLevel");
 $("kind").value=$v("simpleKind");
 $("quickRequest").value=$v("simplePrompt");
 const chosen=$v("simpleSegment");
 if([...$("chosenSegment").options].some(o=>o.value===chosen))$("chosenSegment").value=chosen;
 if($v("simplePassage")){
  $("passage").value=$v("simplePassage");
  $("sourceTitle").value=$v("simpleTitle");
  $("reference").value=$v("simpleReference");
  $("author").value=$v("simpleAuthor");
 }
 const prompt=$v("simplePrompt");
 $("mode").value=/متنوع|متوازن|تدرج|بلوم/.test(prompt)?"balanced":/حلل|حلّل|علل|علّل|استنتج/.test(prompt)?"analysis":/طبق|طبّق|وظف|وظّف/.test(prompt)?"application":"balanced";
 $("requestedGenre").value="story";
 $("requestedPattern").value="narrative";
}
function ready(){
 if($v("simpleLevel")!=="الرابعة متوسط"){
  msg("يُختبر المحرك حاليًا للرابعة متوسط فقط؛ لا نولّد اختبارًا بمستوى غير مدقق.",true);return false;
 }
 const passage=$v("simplePassage")||$v("passage");
 if(passage.length<80){
  sourceDetails.open=true;
  msg("يلزم سند حقيقي قبل توليد أسئلة مرتبطة به. الصق سندك هنا، أو اختر «تجربة بسند موثق».",true);
  $("simplePassage").focus();return false;
 }
 return true;
}
function create(){
 if(!ready())return;
 try{
  sync();
  $("generate").click();
  if(output.hidden||!$("paper").querySelector(".question")){
   msg("لم تُنتج المسودة. افتح الأدوات المتقدمة لمراجعة التنبيهات.",true);return;
  }
  document.body.classList.add("exam-generated");
  msg("أُنشئت مسودة أولية قابلة للتحرير. تنبيه: أسئلة اللغة والتصحيح الكامل والتنقيط لا تزال تحتاج مراجعة تربوية، فلا تعتمدها كتقويم نهائي.");
  output.scrollIntoView({behavior:"smooth",block:"start"});
 }catch(err){msg("تعذر إنشاء المسودة: "+err.message,true);}
}
$("simpleCreate").onclick=create;
$("simpleSample").onclick=async()=>{
 if(busy)return;
 if($v("simpleLevel")!=="الرابعة متوسط"){msg("المثال المتاح موجّه حاليًا للرابعة متوسط.",true);return}
 setBusy(true);msg("أجلب مقتطفًا أصيلًا من «كليلة ودمنة» عبر ويكي مصدر؛ لا أؤلف نصًا بدل المصدر.");
 try{
  const url="https://ar.wikisource.org/w/api.php?"+new URLSearchParams({
   action:"parse",page:samplePage,prop:"text",format:"json",formatversion:"2",origin:"*"
  }).toString();
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);
  let response;
  try{response=await fetch(url,{signal:controller.signal,credentials:"omit"});}
  finally{clearTimeout(timeout)}
  if(!response.ok)throw Error("لم يستجب مصدر النص.");
  const data=await response.json(),html=typeof data.parse?.text==="string"?data.parse.text:data.parse?.text?.["*"];
  if(!html)throw Error("لم تُسترجع فقرات السند.");
  const doc=new DOMParser().parseFromString(html,"text/html");
  const root=doc.querySelector(".mw-parser-output")||doc.body;
  const p=[...root.querySelectorAll("p")].map(el=>String(el.textContent||"").replace(/\[[0-9]+\]/g,"").replace(/\s+/g," ").trim()).filter(x=>x.length>105);
  const start=p.length>=5?1:0;
  const excerpt=p.slice(start,start+3).join("\n\n").slice(0,1900);
  if(excerpt.length<180||!/الصياد|الحمام|المطوقة/.test(excerpt))throw Error("تعذر التحقق من متن القصة المسترجع.");
  $("simplePassage").value=excerpt;
  $("simpleTitle").value="كليلة ودمنة — باب الحمامة المطوقة";
  $("simpleAuthor").value="عبد الله بن المقفع (نقل النص إلى العربية)";
  $("simpleReference").value=sampleUrl;
  sourceDetails.open=false;
  create();
 }catch(err){
  sourceDetails.open=true;
  msg("تعذر جلب النص الموثق تلقائيًا: "+err.message+". افتح المصدر الأصلي أو استخدم سندًا لديك؛ لن نضع نصًا مختلقًا.",true);
 }finally{setBusy(false)}
};
$("simpleFind").onclick=()=>{
 document.body.classList.add("exam-show-expert");
 expert.textContent="إخفاء الأدوات المتقدمة";
 $("chosenLevel").value=$v("simpleLevel");
 $("chosenSegment").value=$v("simpleSegment");
 $("searchSegment").click();
 $("segmentStarter").scrollIntoView({behavior:"smooth",block:"start"});
 msg("اختر سندًا موثقًا من النتائج؛ بعد مراجعته يمكن استعماله في مسودة الاختبار.");
};
expert.onclick=()=>{
 const open=document.body.classList.toggle("exam-show-expert");
 expert.textContent=open?"إخفاء الأدوات المتقدمة":"عرض الأدوات المتقدمة";
 if(open)$("segmentStarter").scrollIntoView({behavior:"smooth",block:"start"});
 else home.scrollIntoView({behavior:"smooth",block:"start"});
};
$("simpleSourceToggle").onclick=()=>{
 sourceDetails.open=!sourceDetails.open;
 if(sourceDetails.open)$("simplePassage").focus();
};
$("simpleSourceOriginal").href=sampleUrl;
if($("paper").querySelector(".question")&&!output.hidden)document.body.classList.add("exam-generated");
msg("اختر «تجربة بسند موثق» للمشاهدة الفورية، أو أدخل سندك ثم اضغط «إنشاء مسودة». محرك الذكاء الاصطناعي السحابي غير مفعّل بعد.");
})();