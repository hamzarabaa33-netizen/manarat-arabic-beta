/* V0.26 — نموذج اختبار جاهز مأخوذ من سند تراثي موثق، ليس مولد ذكاء اصطناعي. */
(function(){"use strict";
const $=id=>document.getElementById(id);
if(!$("simpleSample")||!$("simpleExamHome")||!$("paper"))return;
const SOURCE="https://ar.wikisource.org/wiki/كليلة_ودمنة/باب_الحمامة_المطوقة";
const TEXT=[
"ثم إن الصياد نصب شبكته، ونثر عليها الحب، وكمن قريبًا منها، فلم يلبث إلا قليلًا، حتى مرت به حمامة يقال لها المطوقة، وكانت سيدة الحمام ومعها حمام كثير؛ فعميت هي وصواحبها عن الشرك، فوقعن على الحب يلتقطنه فعلقن في الشبكة كلهن؛ وأقبل الصياد فرحًا مسرورًا. فجعلت كل حمامة تضطرب في حبائلها وتلتمس الخلاص لنفسها.",
"قالت المطوقة: لا تخاذلنا في المعالجة ولا تكن نفس إحداكن أهم إليها من نفس صاحبتها؛ ولكن نتعاون جميعًا فنقلع الشبكة فينجو بعضنا ببعض؛ فأقلعن الشبكة جميعهن بتعاونهن، وعلون في الجو.",
"فالتفتت المطوقة فرأت الصياد يتبعهن. فقالت للحمام: هذا الصياد مجد في طلبكن، فإن نحن أخذنا في الفضاء لم يخف عليه أمرنا ولم يزل يتبعنا، وإن نحن توجهنا إلى العمران خفي عليه أمرنا، وانصرف."
].join("\n\n");
const Q=[
{domain:"فهم",points:2,instruction:"حدّد الحيلة التي استعملها الصياد للإيقاع بالحمام.",answer:"نصب الصياد شبكته ونثر الحب فوقها وكمن قريبًا منها حتى تعلق الحمام بالشبكة.",evidence:"نصب شبكته، ونثر عليها الحب، وكمن قريبًا منها",skill:"فهم حدث مباشر"},
{domain:"فهم",points:2,instruction:"بيّن الخطة التي اقترحتها المطوقة للخروج من الشبكة.",answer:"دعت الحمام إلى التعاون ورفع الشبكة معًا والطيران بها بدل محاولة كل حمامة النجاة منفردة.",evidence:"ولكن نتعاون جميعًا فنقلع الشبكة فينجو بعضنا ببعض",skill:"استخلاص خطة من الحوار"},
{domain:"فهم",points:2,instruction:"علّل اقتراح المطوقة التوجه إلى العمران بدل البقاء في الفضاء.",answer:"لأن الصياد يستطيع متابعة الحمام في الفضاء المكشوف، بينما يخفي العمران اتجاهه ويجعله ينصرف.",evidence:"وإن نحن توجهنا إلى العمران خفي عليه أمرنا، وانصرف",skill:"تعليل استنتاج من السند"},
{domain:"فهم",points:2,instruction:"استنتج قيمة إنسانية تجسدت في تصرّف المطوقة، وادعم إجابتك بشاهد.",answer:"التعاون والتضامن؛ والدليل قول المطوقة: «ولكن نتعاون جميعًا فنقلع الشبكة فينجو بعضنا ببعض».",evidence:"ولكن نتعاون جميعًا فنقلع الشبكة فينجو بعضنا ببعض",skill:"استنتاج قيمة وتبريرها"},
{domain:"لغة",points:2,instruction:"أعرب الفعل «يلبث» في قول السارد: «فلم يلبث إلا قليلًا».",answer:"يلبثْ: فعل مضارع مجزوم بـ«لم»، وعلامة جزمه السكون الظاهر على آخره، والفاعل ضمير مستتر جوازًا تقديره «هو» يعود على الصياد. و«لم» حرف نفي وجزم وقلب.",evidence:"فلم يلبث إلا قليلًا",skill:"إعراب فعل مضارع مجزوم"},
{domain:"لغة",points:2,instruction:"استخرج من النص فعلًا ماضيًا، وبيّن علامة بنائه.",answer:"نصبَ: فعل ماضٍ مبني على الفتح الظاهر على آخره، وفاعله ضمير مستتر جوازًا تقديره «هو» يعود على الصياد. ويصح مثال آخر صحيح من النص مع إعرابه.",evidence:"الصياد نصب شبكته",skill:"بناء الفعل الماضي"},
{domain:"إدماج",points:8,instruction:"السياق: واجه مجموعة من التلاميذ صعوبة في إنجاز مشروع جماعي، فأراد كل واحد العمل وحده.\nالتعليمة: اكتب فقرة من 8 إلى 10 أسطر تقنعهم بأهمية التعاون، مستشهدًا بمثال من قصة الحمامة المطوقة، مع مراعاة ترابط الأفكار وسلامة اللغة.",answer:"لا توجد صياغة وحيدة للإنتاج الكتابي. سلم تجريبي مقترح من 8 نقاط: ملاءمة الموضوع ووضوح الحجة (3)، ترابط الأفكار (2)، سلامة اللغة (2)، حسن العرض والأسلوب (1). هذه شبكة تعليمية للتجربة، وليست تنقيطًا وزاريًا مقررًا لهذا الاختبار.",evidence:"",skill:"إنتاج كتابي حجاجي مرتبط بالسند"}
];
const N=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const Ed=(tag,text,cls)=>{const n=N(tag,text,cls);n.contentEditable="true";n.spellcheck=false;return n};
const S=(root,q,i)=>{const s=N("section",undefined,"question"),p=Ed("p",(i+1)+". "+q.instruction);
 s.append(p,N("div",undefined,"answer-space"));s.dataset.answer=q.answer;s.dataset.evidence=q.evidence;s.dataset.skill=q.skill;s.dataset.domain=q.domain;s.dataset.points=String(q.points);
 const tag=N("span"," ("+q.points+" ن)","q-points");tag.contentEditable="false";p.append(tag);root.append(s)};
const style=N("style");
style.textContent=[
"#simpleFind,#simpleSourceToggle{display:none!important}",
"#simpleExamHome .simple-extras{border-top:1px solid #e7ecef;padding-top:8px}",
"#simpleExamHome .simple-actions{margin-bottom:5px}",
"body.exam-generated #simpleExamHome>.simple-explainer{display:none}",
"body:not(.exam-show-expert) #report{display:none!important}",
"@media print{#simpleExamHome{display:none!important}}"
].join("\n");document.head.append(style);
$("simpleSample").textContent="شاهد اختبارًا تجريبيًا جاهزًا";
$("simpleCreate").textContent="أنشئ مسودة من سندي";
$("simpleSourceDetails").querySelector("summary").textContent="لديّ سند موثّق — سأدخله بنفسي (اختياري)";
function renderDemo(){
 const paper=$("paper"),cor=$("correction");paper.replaceChildren();cor.replaceChildren();
 const head=N("div",undefined,"doc-head");
 head.append(N("span","المؤسسة: ............................"),N("span","السنة الدراسية: ...................."));
 paper.append(head);
 paper.append(Ed("h2","نموذج اختبار تجريبي — اللغة العربية — الرابعة متوسط"));
 paper.append(Ed("p","الاسم واللقب: ...................................................  القسم: ............","candidate-line"));
 paper.append(Ed("p","نموذج تدريبي مُعد مسبقًا، لا يمثل اختبارًا رسميًا ولا نتيجة توليد آلي."));
 paper.append(Ed("h3","السند: من باب الحمامة المطوقة"));
 paper.append(Ed("div",TEXT,"source"));
 paper.append(Ed("p","المصدر: كليلة ودمنة، باب الحمامة المطوقة؛ النص العربي منقول عن ابن المقفع. مقتطفات منتقاة مع ضبط إملائي محدود، وليست الرواية الكاملة. المرجع: "+SOURCE,"source-ref"));
 paper.append(Ed("h3","الجزء الأول: البناء الفكري — 8 نقاط"));Q.slice(0,4).forEach((q,i)=>S(paper,q,i));
 paper.append(Ed("h3","الجزء الثاني: البناء اللغوي — 4 نقاط"));Q.slice(4,6).forEach((q,i)=>S(paper,q,i+4));
 paper.append(Ed("h3","الوضعية الإدماجية — 8 نقاط"));S(paper,Q[6],6);
 cor.append(Ed("h2","مفتاح إجابات النموذج التجريبي — خاص بالأستاذ"));
 Q.forEach((q,i)=>cor.append(Ed("p",(i+1)+". "+q.instruction+"\nالإجابة: "+q.answer+
  (q.evidence?"\nالدليل: «"+q.evidence+"»":"")+"\nالتنقيط: "+q.points+" نقاط.")));
 cor.append(Ed("p","المجموع التجريبي: 8 نقاط للبناء الفكري + 4 نقاط للبناء اللغوي + 8 نقاط للإدماج = 20 نقطة."));
 cor.append(Ed("p","هذا نموذج تعليمي فقط؛ تحقق من مطابقة الموارد لتوزيعك الفعلي قبل استعماله مع التلاميذ."));
 $("output").hidden=false;$("report").hidden=true;
 $("passage").value=TEXT;$("sourceTitle").value="باب الحمامة المطوقة";
 $("author").value="عبد الله بن المقفع (النص العربي من كليلة ودمنة)";$("reference").value=SOURCE;
 $("simplePassage").value=TEXT;$("simpleTitle").value="باب الحمامة المطوقة";
 $("simpleAuthor").value="عبد الله بن المقفع (النص العربي)";$("simpleReference").value=SOURCE;
 $("chosenLevel").value="الرابعة متوسط";$("simpleLevel").value="الرابعة متوسط";
 document.body.classList.add("exam-generated");
 if(window.ManaraExamV024)window.ManaraExamV024.audit();
 $("simpleState").textContent="ظهر نموذج تجريبي جاهز من سند تراثي موثق، مع 7 تعليمات وإجاباتها و20 نقطة مقترحة. يمكنك الآن تحريره وطباعته. ليس توليد ذكاء اصطناعي.";
 $("simpleState").classList.remove("simple-error");
 $("output").scrollIntoView({behavior:"smooth",block:"start"});
}
$("simpleSample").onclick=renderDemo;
$("simpleExamHome").append(N("p","لا حاجة إلى OCR أو تحميل الكتب في هذه التجربة. النموذج الجاهز مُعدّ مسبقًا، أما الإنشاء من سندك فيستخدم المحرك المحلي المحدود.","simple-hint"));
window.ManaraSampleExamV026={renderDemo,source:SOURCE};
})();