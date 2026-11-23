/* المنارة V0.23 — AI examination workshop, structured output, A4 printer.
 * Works as an optional enhancement: existing local draft generation remains available.
 * API secrets never appear in public page code or localStorage.
 */
(function(){"use strict";
const $=id=>document.getElementById(id);
const STORAGE_ENDPOINT="manara_worker_endpoint_v023";
const STORAGE_RESOURCES="manara_taught_resources_v023";
const STORAGE_PRINT="manara_print_job_v023";
const API_TIMEOUT=60000;
const mk=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const setStatus=(message,error=false)=>{const box=$("aiStatus");if(box){box.textContent=message;box.className="ai-state"+(error?" error":"")}};
function rawInput(id){return String($(id)?.value||"").trim()}
function sourceSegment(){return rawInput("segment")||rawInput("chosenSegment")||"غير محدد"}
function cleanedExcerpt(full,max=2200){
 const s=String(full||"").replace(/\r/g,"").split("\n").filter(x=>!/^\s*[٠-٩0-9]{1,4}\s*$/.test(x)).join("\n");
 const clean=s.replace(/\n{3,}/g,"\n\n").trim();
 if(clean.length<=max)return {passage:clean,clipped:false};
 let i=Math.max(clean.lastIndexOf(".",max),clean.lastIndexOf("؟",max),clean.lastIndexOf("؛",max));
 if(i<max*.65)i=clean.lastIndexOf(" ",max);
 return {passage:clean.slice(0,i>max*.65?i+1:max).trim(),clipped:true};
}
function config(){
 const endpoint=rawInput("aiEndpoint").replace(/\/+$/g,"");
 if(!endpoint||!/^https:\/\/[\w.-]+(?::\d+)?(?:\/[\w/-]*)?$/i.test(endpoint))return {error:"لم يُربط خادم الذكاء الاصطناعي بعد؛ أدخل رابط Worker الآمن في الإعدادات."};
 const token=rawInput("aiTeacherToken");
 if(token.length<8)return {error:"أدخل رمز دخول الأستاذ المخصص للخادم. لا تضع مفتاح OpenAI هنا."};
 return {endpoint,token};
}
async function health(){
 const endpoint=rawInput("aiEndpoint").replace(/\/+$/g,"");
 if(!/^https:\/\/[\w.-]+/i.test(endpoint)){setStatus("أدخل رابط Worker آمنًا يبدأ بـhttps://",true);return}
 setStatus("التحقق من حالة الخدمة...");
 try{
  const response=await fetch(endpoint+"/health",{cache:"no-store"});
  const result=await response.json();
  setStatus(result.ok&&result.configured?"خادم توليد الاختبارات متصل ومهيأ.":"الخادم معروف لكن مفاتيح التشغيل لم تُفعّل بعد.",!result.configured);
 }catch{setStatus("لم أتمكن من الوصول إلى الخادم. تأكد من نشر Worker ورابطه.",true)}
}
function payload(){
 const excerpts=cleanedExcerpt(rawInput("passage"));
 const resources=rawInput("aiTaughtResources").split(/[,،;\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,20);
 return {excerpt:excerpts,body:{
  grade:rawInput("chosenLevel"),segment:sourceSegment(),kind:rawInput("kind"),genre:rawInput("requestedGenre"),
  pattern:rawInput("requestedPattern"),sourceTitle:rawInput("sourceTitle"),sourceAuthor:rawInput("author"),
  sourceReference:rawInput("reference"),previous:rawInput("previous"),
  taughtResources:resources,passage:excerpts.passage
 }};
}
function appendEditable(root,tag,content,cls){
 const x=mk(tag,content,cls);x.contentEditable="true";x.spellcheck=false;root.append(x);return x;
}
function renderAIExam(result,clipped){
 const source=result.source||{},questions=Array.isArray(result.questions)?result.questions:[],writing=result.writing||{};
 const paper=$("paper"),cor=$("correction");paper.replaceChildren();cor.replaceChildren();
 const header=mk("div",undefined,"doc-head");header.append(mk("span","المؤسسة: ................................"),mk("span","السنة الدراسية: ..........................."));paper.append(header);
 appendEditable(paper,"h2",result.examTitle||"مسودة اختبار بالذكاء الاصطناعي");
 appendEditable(paper,"p","مسودة تحتاج مراجعة الأستاذ؛ لا تُعد اختبارًا نهائيًا مصححًا.");
 appendEditable(paper,"p","المستوى: "+rawInput("chosenLevel")+" — المقطع: "+sourceSegment());
 if(source.author)appendEditable(paper,"p","المؤلف أو الناقل: "+source.author,"author-line");
 if(rawInput("authorBio"))appendEditable(paper,"p","لمحة عن المؤلف: "+rawInput("authorBio"),"author-biography");
 appendEditable(paper,"h3","السند: "+(source.title||"سند غير معنون"));
 appendEditable(paper,"div",source.passage||"","source");
 if(clipped)appendEditable(paper,"p","تنبيه: اقتُطع النص من بداية سند طويل. ينبغي التأكد من اكتمال فكرته وأحداثه قبل اعتماده.","source-note");
 appendEditable(paper,"p","المصدر: "+(source.reference||"لم يوثّق بعد"),"source-ref");
 const groups=[{domain:"reading",title:"الجزء الأول: البناء الفكري"},{domain:"language",title:"الجزء الثاني: البناء اللغوي"}];
 let counter=1;
 for(const group of groups){
  const items=questions.filter(q=>q.domain===group.domain);
  if(!items.length)continue;
  appendEditable(paper,"h3",group.title);
  for(const q of items){
   const sec=mk("section",undefined,"question");
   appendEditable(sec,"p",(counter++)+". "+q.instruction+" ("+q.points+" ن)");sec.append(mk("div",undefined,"answer-space"));paper.append(sec);
  }
 }
 appendEditable(paper,"h3","الوضعية الإدماجية — إنتاج كتابي");
 const writingSec=mk("section",undefined,"question");
 appendEditable(writingSec,"p","السياق: "+String(writing.context||"")+"\nالتعليمة: "+String(writing.instruction||"")+
  "\nالنقطة المقترحة: "+String(writing.suggestedPoints||0)+" ن");
 paper.append(writingSec);
 appendEditable(cor,"h2","مفتاح الإجابات المقترح — خاص بالأستاذ");
 for(const q of questions){
  appendEditable(cor,"p",q.id+" — "+q.instruction+"\nالإجابة: "+q.expectedAnswer+
   "\nالشاهد: «"+q.evidence+"»\nالمهارة: "+q.skill+" — بلوم: "+q.bloom+" — "+q.points+" نقطة");
 }
 appendEditable(cor,"h3","مؤشرات تقويم الإنتاج الكتابي");
 for(const c of writing.criteria||[])appendEditable(cor,"p","• "+c);
 appendEditable(cor,"p","ينبغي التحقق من العلامات والأحكام والموارد وتوزيع الأستاذ الفعلي. هذه إجابات مولدة لا اعتماد رسمي.");
 $("output").hidden=false;$("report").hidden=true;
 $("aiOutput").hidden=false;
 const notices=$("aiFindings");notices.replaceChildren();
 notices.append(mk("b","تم توليد مسودة: "+questions.length+" أسئلة ذات شواهد في النص. يلزم تدقيق الأستاذ."));
 if(!questions.some(x=>x.domain==="language"))notices.append(mk("p","البناء اللغوي غير مكتمل؛ لم تثبت موارد دراسية صالحة للاستعمال."));
 for(const n of (result.findings||[]).slice(0,12))
   notices.append(mk("p",(n.severity==="error"?"تحقق ضروري: ":n.severity==="warning"?"مراجعة: ":"معلومة: ")+n.reason));
 $("paper").scrollIntoView({behavior:"smooth",block:"start"});
}
function textOf(el){return String(el?.innerText||el?.textContent||"").trim()}
function toBlocks(article){
 const blocks=[];
 for(const node of article.children){
  const tag=node.tagName?.toUpperCase()||"",cls=String(node.className||"");
  if(cls.includes("doc-head")){blocks.push({kind:"head",text:textOf(node)});continue}
  if(cls.includes("author-line")){blocks.push({kind:"author-line",text:textOf(node)});continue}
  if(cls.includes("author-biography")){blocks.push({kind:"bio",text:textOf(node)});continue}
  if(cls.includes("source-ref")){blocks.push({kind:"source-ref",text:textOf(node)});continue}
  if(cls.includes("source")){blocks.push({kind:"source",text:textOf(node)});continue}
  if(cls.includes("question")){
   const p=node.querySelector("p");if(p)blocks.push({kind:/السياق:/.test(textOf(p))?"writing":"question",text:textOf(p)});
   for(const tbl of node.querySelectorAll("table")){
    const rows=[...tbl.rows].map(row=>[...row.cells].map(cell=>textOf(cell)));
    blocks.push({kind:"table",text:"",rows});
   }continue;
  }
  const kind=tag==="H2"?"title":tag==="H3"?"section":cls.includes("note")?"note":"paragraph";
  blocks.push({kind,text:textOf(node)});
 }
 return blocks;
}
function exportPrint(){
 if(!$("paper")?.children?.length){setStatus("لا توجد ورقة للاطلاع الطباعي بعد.",true);return}
 const job={schema:"manara-a4-v1",created:new Date().toISOString(),blocks:toBlocks($("paper")),
  correctionBlocks:toBlocks($("correction")),includeCorrection:!!$("includeCorrection")?.checked};
 try{localStorage.setItem(STORAGE_PRINT,JSON.stringify(job));
  window.open("exam-print-v023.html","_blank","noopener");
  setStatus("فُتحت معاينة الطباعة A4. تحفظ الورقة الحالية كما حرّرتها، وتُفصل الإجابات اختياريًا.");
 }catch{setStatus("تعذر حفظ نسخة الطباعة داخل المتصفح.",true)}
}
async function generateAI(){
 const cfg=config();if(cfg.error){setStatus(cfg.error,true);$("aiSettings").open=true;return}
 const {body,excerpt}=payload();
 if(body.passage.length<180){setStatus("لم يُحدّد نص أصيل كافٍ. اختر سندًا من مكتبة المنارة أولًا ثم أنشئ الاختبار.",true);return}
 const btn=$("aiGenerate");btn.disabled=true;
 setStatus(excerpt.clipped?"يجري تحليل مقتطف من النص الطويل. سنعرض تنبيهًا إلى احتمال عدم اكتماله.":"يجري إنشاء الأسئلة وربطها بالشواهد ثم التدقيق المستقل...");
 const controller=new AbortController(),kill=setTimeout(()=>controller.abort(),API_TIMEOUT);
 try{
  localStorage.setItem(STORAGE_ENDPOINT,cfg.endpoint);localStorage.setItem(STORAGE_RESOURCES,rawInput("aiTaughtResources"));
  const res=await fetch(cfg.endpoint+"/generate",{method:"POST",signal:controller.signal,headers:{
    "content-type":"application/json","x-manara-token":cfg.token},body:JSON.stringify(body)});
  const ans=await res.json();if(!res.ok)throw Error(ans.error||"فشل توليد الاختبار.");
  if(!Array.isArray(ans.questions)||!ans.questions.length)throw Error("لم تُنتج أسئلة ذات شواهد صحيحة. راجع السند والموارد ثم أعد المحاولة.");
  renderAIExam(ans,excerpt.clipped);
  setStatus("أُنشئت "+ans.questions.length+" أسئلة موثقة بشواهد حرفية مع إجابات ومؤشرات مراجعة. لا تزال بحاجة إلى تصحيح الأستاذ.");
 }catch(e){setStatus(e.name==="AbortError"?"انتهت المهلة؛ اختصر السند ثم أعد المحاولة.":String(e.message||e),true)}
 finally{clearTimeout(kill);btn.disabled=false}
}
function setup(){
 const section=$("aiStudio");if(!section)return;
 const endpoint=$("aiEndpoint"),resources=$("aiTaughtResources");
 endpoint.value=localStorage.getItem(STORAGE_ENDPOINT)||"";
 resources.value=localStorage.getItem(STORAGE_RESOURCES)||"";
 $("aiGenerate").onclick=generateAI;$("aiHealth").onclick=health;
 $("aiPrint").onclick=exportPrint;
 $("aiPrintTop").onclick=exportPrint;
 const print=$("print");if(print)print.title="الطباعة القديمة ما زالت متاحة، واستخدم زر A4 للمحرك المتخصص.";
 setStatus(endpoint.value?"الخادم محدد؛ يمكنك فحص الاتصال ثم إنشاء اختبار ذكي.":"تم تجهيز محرك التوليد، لكنه يحتاج نشر الخادم الآمن لمرة واحدة. زر المسودة المحلية يعمل دون اتصال.");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
window.ManaraV023={cleanedExcerpt,toBlocks};
})();
