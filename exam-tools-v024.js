/* منارة الاختبارات 0.24 — أدوات محلية مستقلة، لا تدعي وجود AI آلي. */
(function(){"use strict";
const $=id=>document.getElementById(id),paper=$("paper"),cor=$("correction"),output=$("output");
if(!paper||!cor||!output)return;
const BANK="manara_exam_bank_v024",DOCS="manara_exam_docs_v024",TPL="manara_exam_template_v024";
const E=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n};
const t=x=>String(x==null?"":x).trim();
const v=id=>t($(id)?.value);
const norm=s=>t(s).normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/\s+/g," ");
const uid=()=>String(Date.now())+"-"+Math.random().toString(36).slice(2,9);
const read=k=>{try{const x=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(x)?x:[]}catch{return []}};
const write=(k,x)=>{try{localStorage.setItem(k,JSON.stringify(x));return true}catch{alert("تعذر الحفظ؛ قد تكون ذاكرة المتصفح ممتلئة.");return false}};
const clean=html=>{const x=E("div");x.innerHTML=String(html||"").slice(0,300000);
 x.querySelectorAll("script,style,iframe,object,embed,svg,form,base,link,.question-tools").forEach(n=>n.remove());
 x.querySelectorAll("*").forEach(n=>[...n.attributes].forEach(a=>{if(/^on/i.test(a.name)||["href","src","srcset","style","formaction"].includes(a.name))n.removeAttribute(a.name)}));return x.innerHTML};
const style=E("style");style.textContent=[
'#examSuite{background:#fff;border:1px solid #cad9df;border-right:4px solid #1d666c;border-radius:12px;margin:16px 0;padding:14px 17px;box-shadow:0 4px 16px #102b460a}',
'#examSuite>summary{font-weight:800;font-size:17px;color:#173e56;cursor:pointer}',
'.suite-tabs,.suite-row,.question-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}',
'.suite-tabs button{font-size:13px;font-weight:700}.suite-tabs button.selected{background:#153c57;color:#fff;border-color:#153c57}',
'.suite-pane{border:1px solid #dbe5e9;background:#fbfdfd;border-radius:9px;padding:14px;margin-top:8px}',
'.suite-pane[hidden]{display:none!important}.suite-mini{font-size:12px;color:#607586}',
'.suite-row label,.suite-pane>label{flex:1;min-width:155px;display:flex;flex-direction:column;gap:3px;font-size:12px}',
'.suite-pane textarea{width:100%;min-height:82px;font-size:14px;line-height:1.8}',
'.suite-results{display:grid;gap:9px;margin:10px 0}.suite-entry{padding:11px;background:#fff;border:1px solid #d6e0e5;border-radius:9px}',
'.suite-entry p{font-size:12px;color:#536875;white-space:pre-line;overflow-wrap:anywhere}',
'.suite-msg{padding:8px 11px;background:#eaf5f1;border:1px solid #b9d5cb;border-radius:8px;color:#164f4a;font-size:13px;margin:8px 0}',
'.suite-msg.error{background:#fff3f0;border-color:#e8c1ba;color:#873a32}.suite-msg[hidden]{display:none!important}',
'.question-tools{justify-content:flex-end;padding:3px;margin:3px 0}.question-tools button{font-size:11px!important;padding:4px 7px!important;background:#f5f8f8}',
'.q-points{font-size:.75em;color:#263f50;margin-right:8px;white-space:nowrap}',
'body[data-manara-template="classic"] .paper h3{border-right:0;border-bottom:1px solid #333;background:#fff;color:#111}',
'body[data-manara-template="classic"] .paper .question{border-bottom:0}',
'body[data-manara-template="compact"] .paper{line-height:1.4;font-size:15px;padding:22px 24px}',
'body[data-manara-template="compact"] .paper .source{line-height:1.5;padding:7px}',
'body[data-manara-template="compact"] .paper .question{padding:3px 4px;margin:3px 0}',
'body[data-manara-template="modern"] .paper h3{background:#eaf2f4;border-right:5px solid #176e76;padding:5px 10px}',
'@media(max-width:700px){#examSuite{padding:10px}.suite-pane{padding:10px}.suite-tabs button{font-size:11px;padding:7px}}',
'@media print{#examSuite,.question-tools{display:none!important}body[data-manara-template="modern"] .paper h3{background:#fff;color:#111;border-color:#333}body[data-manara-template="compact"] .paper{font-size:13px}}'
].join("\n");document.head.append(style);
const suite=E("details");suite.id="examSuite";suite.open=true;
suite.append(E("summary","مختبر المنارة V0.24 — بنك الأسئلة والتدقيق والتحرير"));
suite.append(E("p","أدوات محلية للتجربة، مع الاستعانة الاختيارية بنموذج خارجي لإعادة صياغة سؤال واحد. التوليد الذكي المباشر يحتاج خادمًا مفعّلًا.","suite-mini"));
const tabs=E("div",undefined,"suite-tabs"),body=E("div"),note=E("div",undefined,"suite-msg");note.hidden=true;
suite.append(tabs,body,note);output.before(suite);
const panes={},names=[["audit","تدقيق المسودة"],["templates","قوالب A4"],["bank","بنك الأسئلة"],["docs","اختباراتي"],["edit","تحسين سؤال"]];
let current="audit",active=null;
function flash(s,error=false){note.hidden=false;note.className="suite-msg"+(error?" error":"");note.textContent=s}
function show(tab){current=tab;suite.open=true;for(const b of tabs.children)b.classList.toggle("selected",b.dataset.tab===tab);for(const p of body.children)p.hidden=p.dataset.pane!==tab;if(tab==="audit")audit();if(tab==="bank")renderBank();if(tab==="docs")renderDocs();if(tab==="edit")fillEditor()}
for(const [id,label] of names){const b=E("button",label);b.type="button";b.dataset.tab=id;b.onclick=()=>show(id);tabs.append(b);
 const p=E("div",undefined,"suite-pane");p.dataset.pane=id;body.append(p);panes[id]=p}
function R(p){const n=E("div",undefined,"suite-row");p.append(n);return n}
function B(p,label,fn){const b=E("button",label);b.type="button";b.onclick=fn;p.append(b);return b}
function F(p,label,tag="input",choices){const box=E("label",label),el=E(tag);
 if(tag==="select")for(const [value,text] of choices||[]){const o=E("option",text);o.value=value;el.append(o)}
 box.append(el);p.append(box);return el}
const templates=[["classic","رسمي أبيض وأسود"],["compact","اقتصادي مختصر"],["modern","كحلي هادئ"]];
const template=F(R(panes.templates),"قالب الطباعة","select",templates);template.value=localStorage.getItem(TPL)||"classic";
if(!templates.some(x=>x[0]===template.value))template.value="classic";
document.body.dataset.manaraTemplate=template.value;
template.onchange=()=>{document.body.dataset.manaraTemplate=template.value;try{localStorage.setItem(TPL,template.value)}catch{}flash("تغير شكل الورقة دون تغيير النصوص والأسئلة.")};
panes.templates.append(E("p","ثلاثة قوالب أصلية مستقلة عن محتوى الاختبار، اختر أحدها ثم افحص معاينة A4.","suite-mini"));
function sections(){return [...paper.querySelectorAll(":scope > section.question")]}
function qText(sec){const p=sec.querySelector(":scope > p");if(!p)return"";const copy=p.cloneNode(true);copy.querySelectorAll(".q-points").forEach(x=>x.remove());return t(copy.textContent)}
function source(){return t(paper.querySelector(".source")?.textContent)||v("passage")}
function install(){
 const answers=[...cor.querySelectorAll(":scope > p")];sections().forEach((sec,i)=>{
  if(!sec.hasAttribute("data-answer"))sec.dataset.answer=t(answers[i]?.textContent);
  if(!sec.hasAttribute("data-domain"))sec.dataset.domain=/السياق:|التعليمة:/.test(qText(sec))?"إدماج":/أعرب|البدل|الاستثناء|الممنوع|بلاغ|الصورة البيانية/.test(qText(sec))?"لغة":"فهم";
  if(sec.querySelector(".question-tools"))return;
  const tools=E("div",undefined,"question-tools");B(tools,"تحسين السؤال",()=>{active=sec;show("edit");suite.scrollIntoView({behavior:"smooth"})});
  B(tools,"حفظ في البنك",()=>saveQuestion(sec));sec.append(tools);
 });
}
function correction(){
 cor.replaceChildren(E("h2","التصحيح المقترح — للمراجعة قبل الاعتماد"));
 sections().forEach((sec,i)=>{const ans=t(sec.dataset.answer)||"لم تُعتمد إجابة بعد";
  const line=E("p",(i+1)+". "+qText(sec)+"\nالإجابة: "+ans+(t(sec.dataset.evidence)?"\nالشاهد: «"+t(sec.dataset.evidence)+"»":"")+(t(sec.dataset.points)?"\nالنقطة: "+sec.dataset.points:""));
  line.contentEditable="true";cor.append(line)});
 cor.append(E("p","راجع صحة الإجابات والإعراب والشواهد وملاءمة الموارد والتوزيع الفعلي. لا يشكل هذا التصحيح اعتمادًا رسميًا."));
}
const bankSearch=F(R(panes.bank),"بحث في الأسئلة"),bankList=E("div",undefined,"suite-results");panes.bank.append(bankList);
panes.bank.append(E("p","يمكنك حفظ أي سؤال من ورقة الاختبار الحالية. تُحفظ المواد محليًا على هذا الجهاز.","suite-mini"));
bankSearch.oninput=renderBank;
const bankNew=E("details");bankNew.append(E("summary","إنشاء سؤال في بنك الأسئلة"));
const bankNewQ=F(bankNew,"السؤال","textarea"),bankNewA=F(bankNew,"الإجابة المتوقعة","textarea");
const bankNewR=R(bankNew),bankNewDomain=F(bankNewR,"المجال","select",[["فهم","فهم"],["لغة","لغة"],["إدماج","إدماج"],["أخرى","أخرى"]]);
const bankNewSkill=F(bankNewR,"المهارة/المورد"),bankNewEvidence=F(bankNew,"شاهد حرفي إن وجد");
B(bankNew,"حفظ السؤال يدويًا",()=>{
 const q=t(bankNewQ.value);if(q.length<8){flash("اكتب سؤالًا صالحًا قبل حفظه.",true);return}
 const list=read(BANK);if(list.length>=200){flash("البنك ممتلئ؛ أنشئ نسخة احتياطية.",true);return}
 if(list.some(x=>norm(x.q)===norm(q))){flash("السؤال موجود في البنك بالفعل.");return}
 const record={id:uid(),q,answer:t(bankNewA.value),evidence:t(bankNewEvidence.value),skill:t(bankNewSkill.value),domain:bankNewDomain.value,level:v("chosenLevel"),sourceTitle:v("sourceTitle"),reference:v("reference"),date:new Date().toISOString()};
 if(write(BANK,[record,...list])){bankNewQ.value="";bankNewA.value="";bankNewEvidence.value="";renderBank();flash("أُضيف سؤال إلى البنك. لا تعتمد الإجابة دون مراجعة.")}
});
panes.bank.append(bankNew);
function saveQuestion(sec){
 const q=qText(sec);if(q.length<8){flash("السؤال غير مكتمل.",true);return}
 const all=read(BANK);if(all.some(x=>norm(x.q)===norm(q))){flash("السؤال محفوظ مسبقًا.");return}
 if(all.length>=200){flash("امتلأ البنك التجريبي؛ صدّره احتياطيًا أولًا.",true);return}
 const item={id:uid(),q,answer:t(sec.dataset.answer),evidence:t(sec.dataset.evidence),skill:t(sec.dataset.skill),domain:t(sec.dataset.domain)||"أخرى",level:v("chosenLevel"),sourceTitle:v("sourceTitle"),reference:v("reference"),date:new Date().toISOString()};
 if(write(BANK,[item,...all]))flash("حُفظ السؤال في البنك. تأكد من صحة الإجابة والشاهد قبل إعادة استعماله.");
}
function ensurePaper(){if(paper.children.length){output.hidden=false;return}
 paper.append(E("div","المؤسسة: ........................... السنة الدراسية: ................","doc-head"));
 const h=E("h2","مسودة اختبار من بنك الأسئلة — اللغة العربية");h.contentEditable="true";paper.append(h,E("h3","الأسئلة المنتقاة"));cor.replaceChildren(E("h2","التصحيح المقترح"));output.hidden=false}
function insertQuestion(x){
 ensurePaper();const sec=E("section",undefined,"question"),p=E("p",x.q);p.contentEditable="true";sec.append(p,E("div",undefined,"answer-space"));
 sec.dataset.answer=x.answer||"";sec.dataset.evidence=x.evidence||"";sec.dataset.domain=x.domain||"أخرى";sec.dataset.skill=x.skill||"";
 const heading=[...paper.querySelectorAll(":scope > h3")].find(h=>/الوضعية الإدماجية|إنتاج كتابي/.test(h.textContent));
 paper.insertBefore(sec,heading||null);install();correction();flash("أدرج السؤال في ورقة الاختبار الحالية دون مساس بالأسئلة الأخرى.");
}
function renderBank(){
 bankList.replaceChildren();const term=norm(bankSearch.value).toLowerCase();
 const list=read(BANK).filter(x=>!term||norm([x.q,x.skill,x.sourceTitle].join(" ")).toLowerCase().includes(term));
 if(!list.length){bankList.append(E("p","البنك فارغ. أنشئ مسودة ثم احفظ الأسئلة التي تختارها.","suite-mini"));return}
 for(const x of list.slice(0,80)){
  const c=E("div",undefined,"suite-entry");c.append(E("strong",x.q),E("p",[x.domain,x.skill,x.level,x.sourceTitle].filter(Boolean).join(" • ")));
  const r=R(c);B(r,"إدراج",()=>insertQuestion(x));B(r,"حذف",()=>{if(!confirm("حذف السؤال من البنك فقط؟"))return;write(BANK,read(BANK).filter(y=>y.id!==x.id));renderBank()});bankList.append(c)}
}
const ePane=panes.edit;ePane.append(E("p","اختر «تحسين السؤال» تحت أي سؤال. يمكنك التعديل مباشرة، أو نقل طلب إلى ChatGPT أو Claude وإعادة النتيجة. لن تتبدل بقية الأسئلة.","suite-mini"));
const editQ=F(ePane,"نص السؤال","textarea"),editA=F(ePane,"الإجابة المقترحة","textarea");
const eR=R(ePane),editPoints=F(eR,"نقطة السؤال (اختيارية)"),editSkill=F(eR,"المورد/المهارة");
const prompt=F(ePane,"طلب مقترح لذكاء اصطناعي خارجي","textarea"),paste=F(ePane,"رد النموذج بصيغة JSON أو نص","textarea");
const eBtns=R(ePane);
function fillEditor(){if(!active||!paper.contains(active)){active=null;editQ.value="";editA.value="";editPoints.value="";editSkill.value="";return}
 editQ.value=qText(active);editA.value=t(active.dataset.answer);editPoints.value=t(active.dataset.points);editSkill.value=t(active.dataset.skill)}
function makePrompt(){
 if(!active)return "اختر السؤال أولًا";
 return ["أنت خبير تقويم اللغة العربية بالجزائر. أعد صياغة السؤال المحدد فقط دون تغيير بقية الاختبار.",
 "المستوى: "+v("chosenLevel")+"، المقطع: "+v("segment")+"، الاختبار: "+v("kind"),
 "السؤال: "+qText(active),"الإجابة الحالية (غير معتمدة): "+t(active.dataset.answer),"المورد أو المهارة: "+t(active.dataset.skill),
 "ما قُوّم سابقًا: "+v("previous"),"السند الأصلي حرفيًا:\n"+source().slice(0,2200),
 "الشروط: فعل أمر واضح، تدرج معرفي حقيقي وفق بلوم، دليل حرفي لا يُختلق، إجابة نموذجية قابلة للتثبت، عدم تكرار نوع المورد الذي قوّمه الفرض السابق.",
 'أرجع JSON فقط: {"question":"...","answer":"...","evidence":"...","skill":"...","points":null}. لا تختلق مؤلفًا أو مصدرًا أو أحكامًا نحوية.'
 ].join("\n\n")}
B(eBtns,"إعداد طلب تحسين",()=>{prompt.value=makePrompt();flash("راجع الطلب ثم انسخه إلى النموذج الخارجي.")});
B(eBtns,"نسخ الطلب",async()=>{prompt.value=t(prompt.value)||makePrompt();try{await navigator.clipboard.writeText(prompt.value);flash("نُسخ الطلب.")}catch{prompt.focus();prompt.select();flash("تعذر النسخ الآلي، انسخ النص المحدد يدويًا.")}});
B(eBtns,"قراءة الرد الملصوق",()=>{
 const raw=t(paste.value).replace(/^ *```(?:json)?\s*/i,"").replace(/\s*```\s*$/,"");
 if(raw.length<8){flash("الصق الرد أولًا.",true);return}
 try{const x=JSON.parse(raw);if(typeof x.question!=="string"||x.question.length<8)throw Error("ليس سؤالًا صالحًا");
  editQ.value=x.question;if(typeof x.answer==="string")editA.value=x.answer;
  if(typeof x.skill==="string")editSkill.value=x.skill;
  if(typeof x.points==="number")editPoints.value=String(x.points);
  if(typeof x.evidence==="string"&&active)active.dataset.evidence=x.evidence;
  flash("قُرئ الرد. راجع السؤال والإجابة ثم طبّق التعديل.");
 }catch{editQ.value=raw;flash("أُدرج الرد كنص سؤال؛ اكتب الإجابة يدويًا إن لزم.")}});
B(eBtns,"تطبيق على هذا السؤال فقط",()=>{
 if(!active||!paper.contains(active)){flash("اختر السؤال أولًا من الورقة.",true);return}
 const q=t(editQ.value),n=t(editPoints.value).replace(",",".");
 if(q.length<8){flash("نص السؤال ناقص.",true);return}
 if(n!==""&&(!Number.isFinite(Number(n))||Number(n)<0||Number(n)>20)){flash("نقطة السؤال يجب أن تكون بين 0 و20.",true);return}
 const p=active.querySelector(":scope > p");p.textContent=q;active.dataset.answer=t(editA.value);active.dataset.skill=t(editSkill.value);
 active.dataset.points=n===""?"":String(Number(n));
 if(n!==""){const badge=E("span"," ("+active.dataset.points+" ن)","q-points");badge.contentEditable="false";p.append(badge)}
 correction();audit();flash("عُدّل هذا السؤال فقط. راجع مفتاح التصحيح قبل الطباعة.");
});
const aPane=panes.audit,aList=E("div",undefined,"suite-results");aPane.append(aList);
B(R(aPane),"إعادة تدقيق البنية",audit);
function audit(){
 aList.replaceChildren();const all=sections(),src=source(),refs=v("reference"),issues=[],ok=[];
 if(src.length<80)issues.push("لا يوجد سند كافٍ (80 حرفًا على الأقل).");else ok.push("السند موجود للمراجعة ("+src.length+" حرفًا).");
 if(!refs)issues.push("مرجع النص غير مسجل في الحقول.");
 if(!all.length)issues.push("لم تُنشأ أسئلة بعد.");
 let total=0,marked=0,pending=0,missing=0,mismatch=0;
 for(const sec of all){
  const ans=t(sec.dataset.answer),score=t(sec.dataset.points),quote=t(sec.dataset.evidence);
  if(!ans||/يُراجع|يراجع|تراجع|تحتاج|يحتاج|لم يُتحق|لم تُراجع|غير مكتمل|إرشاد/.test(ans))pending++;
  if(score==="")missing++;else{total+=Number(score);marked++}
  if(quote&&src&&!norm(src).includes(norm(quote)))mismatch++;
 }
 if(pending)issues.push(pending+" إجابة تحتاج تحققًا أو تصحيحًا مكتملًا.");
 if(missing&&all.length)issues.push(missing+" سؤالًا بلا علامة مؤكدة؛ لا نفترض مجموعًا من 20.");
 if(mismatch)issues.push(mismatch+" شاهدًا لا يظهر حرفيًا في السند.");
 if(all.length)ok.push("الأسئلة: "+all.length+"، مجموع علامات "+marked+" أسئلة = "+total+".");
 for(const s of issues)aList.append(E("div","مراجعة ضرورية: "+s,"suite-entry"));
 for(const s of ok)aList.append(E("div","فحص أولي: "+s,"suite-entry"));
 if(!issues.length)aList.prepend(E("p","لا توجد أخطاء بنيوية ظاهرة، لكن صحة الإجابات والمنهاج لا تُثبت بهذه الفحوص.","suite-msg"));
 return {issues,ok};
}
const dPane=panes.docs,dR=R(dPane),docName=F(dR,"عنوان النسخة"),dList=E("div",undefined,"suite-results");
B(dR,"حفظ الاختبار الحالي",()=>{if(!paper.children.length){flash("لا توجد ورقة لحفظها.",true);return}
 const entry={id:uid(),title:t(docName.value)||t(paper.querySelector("h2")?.textContent)||"اختبار",date:new Date().toISOString(),paper:clean(paper.innerHTML),cor:clean(cor.innerHTML),template:template.value};
 if(write(DOCS,[entry,...read(DOCS)].slice(0,30))){renderDocs();flash("حُفظت المسودة في «اختباراتي» محليًا.")}});
B(dR,"نسخة احتياطية JSON",()=>{
 const data=JSON.stringify({schema:"manara-exams-v024",bank:read(BANK),docs:read(DOCS)}),url=URL.createObjectURL(new Blob([data],{type:"application/json;charset=utf-8"}));
 const a=E("a");a.href=url;a.download="المنارة-اختباراتي-نسخة-احتياطية.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800);flash("طُلب تنزيل النسخة الاحتياطية؛ تحقق من ظهورها على الجهاز.")});
const restoreFile=E("input");restoreFile.type="file";restoreFile.accept=".json,application/json";
const restoreLabel=E("label","استيراد نسخة احتياطية سابقة (يستبدل البيانات المحلية)");restoreLabel.append(restoreFile);
dPane.append(restoreLabel,dList,E("p","الاختبارات محفوظة على المتصفح الحالي فقط، وليست مزامنة سحابية. صدّر نسخة احتياطية دوريًا.","suite-mini"));
restoreFile.onchange=async()=>{
 const file=restoreFile.files?.[0];if(!file)return;
 try{
  if(file.size>2500000)throw Error("حجم الملف أكبر من الحد المسموح.");
  const x=JSON.parse(await file.text());
  if(x.schema!=="manara-exams-v024"||!Array.isArray(x.bank)||!Array.isArray(x.docs))throw Error("هذه ليست نسخة احتياطية مدعومة.");
  if(x.bank.length>200||x.docs.length>30)throw Error("عدد السجلات أكبر من الحد المسموح.");
  if(x.bank.some(b=>!b||typeof b.id!=="string"||typeof b.q!=="string"||b.q.length>3000))throw Error("بيانات بنك الأسئلة تالفة.");
  if(x.docs.some(d=>!d||typeof d.title!=="string"||typeof d.paper!=="string"||d.paper.length>300000||typeof d.cor!=="string"))throw Error("بيانات الاختبارات غير صالحة.");
  if(!confirm("سيستبدل الاستيراد بنك الأسئلة والاختبارات المخزّنة على هذا المتصفح. هل تؤكد؟"))return;
  const bankData=x.bank.map(b=>({id:b.id.slice(0,100),q:t(b.q),answer:t(b.answer).slice(0,6000),evidence:t(b.evidence).slice(0,1000),skill:t(b.skill).slice(0,200),domain:t(b.domain).slice(0,50),level:t(b.level).slice(0,80),sourceTitle:t(b.sourceTitle).slice(0,300),reference:t(b.reference).slice(0,900),date:t(b.date).slice(0,80)}));
  const docData=x.docs.map(d=>({id:t(d.id).slice(0,100),title:t(d.title).slice(0,150),date:t(d.date).slice(0,80),paper:clean(d.paper),cor:clean(d.cor),template:templates.some(t=>t[0]===d.template)?d.template:"classic"}));
  const beforeBank=localStorage.getItem(BANK),beforeDocs=localStorage.getItem(DOCS);
  if(!write(BANK,bankData)||!write(DOCS,docData)){
   if(beforeBank===null)localStorage.removeItem(BANK);else localStorage.setItem(BANK,beforeBank);
   if(beforeDocs===null)localStorage.removeItem(DOCS);else localStorage.setItem(DOCS,beforeDocs);
   throw Error("تعذر حفظ البيانات المستوردة.");
  }
  renderBank();renderDocs();flash("استُعيدت الاختبارات وبنك الأسئلة من النسخة الاحتياطية.");
 }catch(e){flash("تعذر الاستيراد: "+e.message,true)}
 finally{restoreFile.value=""}
};
function renderDocs(){
 dList.replaceChildren();const list=read(DOCS);
 if(!list.length){dList.append(E("p","لا توجد اختبارات محفوظة بعد.","suite-mini"));return}
 for(const x of list){
  const c=E("div",undefined,"suite-entry");c.append(E("strong",x.title),E("p",x.date||""));const r=R(c);
  B(r,"فتح",()=>{if(!confirm("فتح نسخة محفوظة يستبدل محتوى الورقة الحالية. هل تريد المتابعة؟"))return;
   paper.innerHTML=clean(x.paper);cor.innerHTML=clean(x.cor);template.value=templates.some(z=>z[0]===x.template)?x.template:"classic";document.body.dataset.manaraTemplate=template.value;
   output.hidden=false;active=null;install();show("audit");flash("فُتحت النسخة؛ راجع الأسئلة قبل الطباعة.")});
  B(r,"نسخ",()=>{const y={...x,id:uid(),title:x.title+" — نسخة",date:new Date().toISOString()};write(DOCS,[y,...read(DOCS)].slice(0,30));renderDocs()});
  B(r,"حذف",()=>{if(!confirm("حذف هذه النسخة المحفوظة من المتصفح؟"))return;write(DOCS,read(DOCS).filter(y=>y.id!==x.id));renderDocs()});
  dList.append(c);
 }
}
const observer=new MutationObserver(list=>{
 if(list.some(m=>m.target===paper&&m.type==="childList"))queueMicrotask(()=>{install();if(current==="audit")audit()});
});
observer.observe(paper,{childList:true});
install();show("audit");
document.addEventListener("click",event=>{
 const target=event.target.closest?.("button");
 if(!target||!["word","print","aiPrint","aiPrintTop"].includes(target.id)||output.hidden)return;
 const findings=audit();
 if(findings.issues.length&&!confirm("توجد "+findings.issues.length+" نقاط تحتاج مراجعة قبل التصدير:\n• "+findings.issues.join("\n• ")+"\n\nهل تريد تصدير المسودة رغم ذلك؟")){
  event.preventDefault();event.stopImmediatePropagation();
  flash("أُوقف التصدير إلى حين مراجعة تنبيهات التدقيق.");
  suite.open=true;show("audit");
 }
},true);
window.ManaraExamV024={audit,renderBank,renderDocs,version:"0.24"};
})();