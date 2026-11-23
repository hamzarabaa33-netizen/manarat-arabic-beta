/* المنارة — V0.21
   مرصد تربوي مستند إلى أسئلة وتصحيحات BEM الموثقة أدناه.
   لا ينقل نصوص الاختبارات أو يستنتج قواعد لم يتم التحقق منها.
   التعلّم هنا تكيّف محلي محدود وفق ملاحظات الأستاذ، لا تدريب نموذج لغوي. */
(function(root){"use strict";
const references=[
 {year:2024,id:"bem-2024",name:"شهادة التعليم المتوسط — لغة عربية 2024",
  questionUrl:"https://dzexam1.com/wp-content/uploads/2024/06/arabic.pdf11.pdf",
  correctionUrl:"https://www.bem-algerie.net/sujets/2024/2024-ar-sol.pdf",
  verifiedFrom:"موضوع منشور وتصحيح نموذجي منشور؛ راجِع النسخة الرسمية عند التعارض",
  architecture:{first:4,second:8,integration:8,total:20},
  descriptors:[
   {domain:"فهم",description:"فهم السند وعنوانه، تحديد معلومات وأسباب ونتائج، توظيف مفردة"},
   {domain:"لغة",description:"إعراب مفصل، المحل الإعرابي للجمل، جدول شواهد من النص"},
   {domain:"فن",description:"صورة بيانية مع شرح وأثر، محسن بديعي، مؤشرات النمط"},
   {domain:"إدماج",description:"سياق ثم سند وتعليمة تحدد المهمة والحجم والمطالب، وتصحيح بمعايير"}
  ],
  rubric:{relevance:3,coherence:2,language:2,craft:1}
 },
 {year:2025,id:"bem-2025",name:"شهادة التعليم المتوسط — لغة عربية 2025",
  questionUrl:null,
  correctionUrl:"https://www.dzeducative.com/wp-content/uploads/2025/06/ar-cor-bem-2025.pdf",
  verifiedFrom:"التصحيح النموذجي المنشور؛ لم تُفحص نسخة الموضوع المستقلة بعد",
  architecture:{first:4,second:8,integration:8,total:20},
  descriptors:[
   {domain:"فهم",description:"أسئلة معلومة من السند، تعليل واستدلال وتقدير قيمة"},
   {domain:"لغة",description:"استخراج الممنوع من الصرف وتعليل علة منعه"},
   {domain:"فن",description:"استعارة مع شرحها، أسلوب إنشائي وتحديد نوعه"},
   {domain:"إدماج",description:"المفاضلة والتعليل مع نمط حجاجي غالب وخادم تفسيري، وشبكة تقويم مفصلة"}
  ],
  rubric:{relevance:3,coherence:2,language:2,craft:1}
 }
];
const methodologyUrl="https://asjp.cerist.dz/en/downArticle/184/12/1/188623";
const families={
 problem:{bloom:"فهم وتحديد",dimension:"مشكلة النص"},
 response:{bloom:"تحليل واستدلال",dimension:"موقف الشخصية"},
 value:{bloom:"استنتاج وتقويم",dimension:"قيمة النص"},
 event:{bloom:"فهم وتحديد",dimension:"تسلسل الأحداث"},
 character:{bloom:"تحليل واستدلال",dimension:"موقف الشخصية"},
 inference:{bloom:"استنتاج وتقويم",dimension:"قيمة النص"},
 gist:{bloom:"فهم وتركيب",dimension:"الفكرة المركزية"},
 evidence:{bloom:"تحليل واستدلال",dimension:"قرينة نصية"},
 title:{bloom:"ابتكار وتعليل",dimension:"عنوان بديل"},
 detail:{bloom:"تحليل",dimension:"الفكرة والتفصيل"},
 purpose:{bloom:"استنتاج",dimension:"غاية الكاتب"},
 causes:{bloom:"تحليل علاقات",dimension:"سبب ونتيجة"},
 paragraphs:{bloom:"مقارنة وتحليل",dimension:"بنية الفقرات"}
};
const variantTexts={
 problem:["حدّد الموقف الذي وضع الحمام في خطر عندما حضر الصياد، وادعم جوابك بشاهد من السند.",
 "بيّن المأزق الذي اعترض الحمام إثر نصب الشبكة، واستشهد بعبارة تدل عليه."],
 response:["حلّل موقف المطوّقة من الخطر، مستدلًّا بتوجيه ورد في المقتطف.",
 "وضح كيف دعت المطوّقة صاحباتها إلى مواجهة المأزق، مستشهدًا بقولها."],
 value:["علّل اختيار التعاون قيمةً مركزيةً في هذا المقتطف، مستدلًا بموقف المطوّقة.",
 "بيّن ما يستفاد من موقف المطوّقة، وعلّل ذلك بدليل من السند."],
 event:["بيّن الحدث الذي تبدأ عنده مشكلة المقتطف، مستشهدًا بعبارة منه.",
 "حدّد التحوّل الأول في مسار الأحداث، واستدل عليه من النص."],
 character:["حلّل تصرف إحدى الشخصيات أمام المشكلة وادعم إجابتك بدليل من السند.",
 "قارن بين المشكلة وموقف شخصية حاولت مواجهتها، اعتمادًا على ما ورد في المقتطف."],
 inference:["علّل القيمة الإنسانية التي يبرزها سلوك شخصية في المقتطف، مستدلًا بحدث منه.",
 "استنتج ما تعلّمته من تصرّف إحدى الشخصيات، واربطه بحدث ورد في النص."],
 gist:["بيّن الفكرة المركزية للسند في جملة موجزة، مستندًا إلى مضمونه.",
 "لخّص أهم قضية عرضها الكاتب، دون إضافة معلومات خارج النص."],
 evidence:["استدل على القضية الأساسية بعبارة صريحة من السند، ثم وضّح دلالتها.",
 "بيّن موقف الكاتب من القضية، وأثبت جوابك بدليل نصي."],
 title:["صُغ عنوانًا بديلًا يلائم مضمون السند، وعلّل اختيارك.",
 "اقترح عنوانًا معبّرًا عن قضية النص، ثم اذكر ما يبرّر اقتراحك."],
 detail:["ميّز بين الفكرة الأساسية وتفصيل يساندها في النص.",
 "بيّن معلومة تدعم القضية المركزية، مع توضيح العلاقة بينهما."],
 purpose:["استنتج غاية الكاتب من النص، وادعم جوابك بشاهد منه.",
 "علّل المقصد الذي يتوجه إليه السند، انطلاقًا من دلالة إحدى عباراته."]
};
const FEEDBACK_KEY="almanara-bem-question-feedback-v021";
function safeLoad(storage){
 try{const x=JSON.parse(storage.getItem(FEEDBACK_KEY)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch{return {}}
}
function safeSave(storage,store){try{storage.setItem(FEEDBACK_KEY,JSON.stringify(store));return true}catch{return false}}
function recordFeedback(storage,questionId,variant,approved){
 const store=safeLoad(storage),key=questionId+"|"+variant;
 const item=store[key]||{good:0,bad:0};
 if(approved)item.good=Math.min(10000,item.good+1);
 else item.bad=Math.min(10000,item.bad+1);
 store[key]=item;return safeSave(storage,store);
}
function variantScore(store,id,variant){
 const x=store[id+"|"+variant]||{good:0,bad:0};
 return x.good*2-x.bad*3;
}
function adaptReading(reading,storage){
 const saved=safeLoad(storage),usedVerbs=new Set();
 return reading.map(q=>{
  const variants=[q.text,...(variantTexts[q.id]||[])],unique=[...new Set(variants)];
  const ranked=unique.map((text,variant)=>({
   text,variant,verb:String(text).trim().split(/\s+/)[0].replace(/[.،:]/g,""),
   score:variantScore(saved,q.id,variant)
  })).sort((a,b)=>b.score-a.score||a.variant-b.variant);
  const selected=ranked.find(item=>!usedVerbs.has(item.verb))||ranked[0];
  usedVerbs.add(selected.verb);
  return {...q,text:selected.text,verb:selected.verb,sourceFamily:q.id,variant:selected.variant,
   bloom:families[q.id]?.bloom||"يحتاج تحديد المستوى المعرفي",
   dimension:families[q.id]?.dimension||q.skill||"غير مصنف"};
 });
}
function normalize(text){return String(text||"").normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ").trim();}
function audit(data){
 const {questions=[],passage="",sourceTitle="",author="",reference="",genre="",integration="",resources=[],previous="",level="الرابعة متوسط"}=data;
 const checks=[];
 const add=(id,ok,note,critical=false)=>checks.push({id,ok:!!ok,note,critical});
 add("source",sourceTitle.length>=3&&author.length>=3&&reference.length>=7&&passage.length>=80,
  "وجود سند فعلي ومرجع ومؤلف، ولا تعني الحقول وحدها إثبات صحة الإسناد.",true);
 add("narrative",genre!=="story"||/قال|قالت|فجأة|ثم|بعد ذلك|حكى|روى|خرج|دخل|رأى|رأت|وقع|وقعت/.test(passage),
  "قرائن سردية أولية فقط؛ لا تثبت اكتمال القصة أو ملاءمة مقتطفها.");
 add("count",questions.length>=3&&questions.length<=5,
  "توازن عدد أسئلة الفهم مع زمن التقويم؛ لا يُفرض عدد ثابت على كل الفروض.");
 add("anchoring",questions.every(q=>q.text.includes("السند")||q.text.includes("النص")||q.text.includes("المقتطف")||q.text.includes("المطوّقة")||q.text.includes("الحمام")||q.text.includes("الكاتب")),
  "ينبغي أن تتصل الأسئلة بالسند الحقيقي وأحداثه لا بنماذج عامة.");
 const domains=new Set(questions.map(q=>q.dimension||q.skill));
 add("skills",domains.size>=Math.min(3,questions.length),
  "تنويع المهارات المعرفية المطلوبة فعلًا، لا تنويع أفعال الأمر شكليًا فقط.");
 const verbs=questions.map(q=>q.verb).filter(Boolean);
 add("verbs",new Set(verbs).size===verbs.length,
  "تجنب تكرار صيغة الأمر الأساسية في مجموعة صغيرة من الأسئلة.");
 const previousNorm=normalize(previous);
 add("previous",!previousNorm||questions.every(q=>!previousNorm.includes(normalize(q.dimension||""))),
  "راجع المهارات المقوَّمة في الفرض السابق وتجنب تكرار نفس المهارة الفرعية.");
 add("writing",integration.includes("السياق:")&&integration.includes("التعليمة:")&&integration.length>120,
  "وضعية إنتاج كتابي كاملة بسياق وتعليمة محددين.");
 add("grammar",resources.length>0,
  "لم تُثبت موارد لغوية قابلة للتقويم؛ تُسمّى الوثيقة مسودة فهم، لا اختبارًا شاملًا.",true);
 add("grade",level==="الرابعة متوسط",
  "مخطط الأسئلة الحالي مخصص للرابعة متوسط، وليس لبقية المستويات.");
 const passed=checks.filter(x=>x.ok).length,critical=checks.filter(x=>x.critical&&!x.ok);
 return {checks,passed,total:checks.length,requiresReview:true,mayCallCompleteExam:critical.length===0,
  rubricHint:"في تصحيحي شهادة التعليم المتوسط 2024 و2025 للوضعية الإدماجية: الملاءمة 3، الانسجام 2، سلامة اللغة 2، الإبداع والإتقان 1 من مجموع 8. لا تُفرض هذه الأوزان رسميًا على فروض المؤسسة."};
}
root.ManaraBemMentor={references,methodologyUrl,FEEDBACK_KEY,adaptReading,recordFeedback,safeLoad,audit,families,version:"V0.21"};
})(typeof window==="object"?window:globalThis);
