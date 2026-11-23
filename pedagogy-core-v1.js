/* المنارة — نواة مرجعية تربوية V1 (2026-11-23)
 * مصدر رسمي: المخطط السنوي للغة العربية، الرابعة متوسط، وزارة التربية الجزائرية، سبتمبر 2018.
 * دليل بلوم: University of California, Davis — Bloom's Revised Taxonomy.
 * هذه بيانات مُستخلصة بشريًا من المصدر وليست محرك ذكاء اصطناعي ولا توثيقًا لخطط 2026–2027.
 */
(function(root){"use strict";
const documents=[
 {id:"dz-4am-ar-2018",title:"المخططات السنوية للغة العربية — الرابعة متوسط",organization:"وزارة التربية الوطنية، المفتشية العامة للبيداغوجيا ومديرية التعليم الأساسي",date:"سبتمبر 2018",type:"official-historical",
  url:"https://education.gov.dz/wp-content/uploads/2015/04/4-AM-lang-arabe.pdf",
  scope:"مخطط بناء التعلمات + التقويم البيداغوجي + المراقبة المستمرة",warning:"نسخة مؤرخة؛ تتحقق ملاءمتها للتدرج الحالي وللتوزيع الفعلي قبل تثبيت مورد."},
 {id:"bloom-ucd",title:"Bloom's Revised Taxonomy of Cognitive Processes",organization:"UC Davis Center for Educational Effectiveness",date:"مرجع منهجي جامعي",type:"university-methodology",url:"https://cee.ucdavis.edu/bloom",
  scope:"العمليات المعرفية الست؛ تحديد التصنيف بناءً على المهمة والإجابة لا فعل الأمر وحده"},
 {id:"bloom-cornell",title:"Bloom's Taxonomy",organization:"Cornell Center for Teaching Innovation",date:"مرجع منهجي جامعي",type:"university-methodology",url:"https://teaching.cornell.edu/resource/blooms-taxonomy",scope:"صياغة نتائج التعلم والأسئلة بأفعال إجرائية"},
 {id:"guide-manara-v1",title:"دليل المنارة لبناء الفروض والاختبارات وفق بلوم",organization:"دليل تطبيقي أصلي من إعداد المنارة",date:"23 نوفمبر 2026",type:"local-methodology",url:"pedagogy/building-exams-and-bloom-v1.md",
  scope:"تسلسل اختيار المصدر والموارد والأسئلة والإجابات والتنقيط والتدقيق"}
];
const bloom=[
 {id:"remember",name:"التذكر",evidence:"استرجاع حقيقة أو معلومة ظاهرة",verbs:["اذكر","حدّد","سمّ"]},
 {id:"understand",name:"الفهم",evidence:"تفسير معنى أو إعادة صياغة",verbs:["فسّر","اشرح","لخّص","بيّن"]},
 {id:"apply",name:"التطبيق",evidence:"استعمال مورد صحيح في وضعية جديدة",verbs:["وظّف","طبّق","أعرب"]},
 {id:"analyze",name:"التحليل",evidence:"الكشف عن علاقة الأجزاء أو السببية والبنية",verbs:["حلّل","قارن","ميّز"]},
 {id:"evaluate",name:"التقويم",evidence:"إصدار حكم معلل بمعيار ودليل",verbs:["قيّم","احكم","ناقش"]},
 {id:"create",name:"الإبداع",evidence:"بناء إنتاج أصيل يلتزم بقيود",verbs:["اكتب","أنشئ","صمّم"]}
];
/* Key task semantics for the CURRENT generator, not a linguistic diagnosis engine. */
const readingSkills={
 problem:{bloom:"understand",dimension:"تحديد مأزق السرد"},
 response:{bloom:"analyze",dimension:"تحليل موقف الشخصية"},
 value:{bloom:"evaluate",dimension:"حكم قيمي مع تعليل"},
 event:{bloom:"understand",dimension:"فهم تسلسل الأحداث"},
 character:{bloom:"analyze",dimension:"تحليل سلوك الشخصية"},
 inference:{bloom:"evaluate",dimension:"استنتاج قيمة وتعليلها"},
 gist:{bloom:"understand",dimension:"فهم الفكرة المركزية"},
 evidence:{bloom:"analyze",dimension:"الاستدلال بالقرينة"},
 title:{bloom:"create",dimension:"إنشاء عنوان جديد وتبريره"},
 detail:{bloom:"analyze",dimension:"تحليل علاقة فكرة بتفصيل"},
 purpose:{bloom:"analyze",dimension:"استنتاج مقصد الكاتب من شواهد"},
 causes:{bloom:"analyze",dimension:"تحليل السبب والنتيجة"},
 paragraphs:{bloom:"analyze",dimension:"مقارنة وظيفة أجزاء النص"}
};
/* Extracted orientation from SEPTEMBER 2018 4AM official plan.
 * 'readingPatterns' are for فهم المكتوب, not for all learning domains.
 * Actual taught content always takes precedence over inferred timing. */
const oldPlan4AM=[
 {segment:"قضايا اجتماعية",sequence:1,readingPatterns:["وصفي","توجيهي"],writingPatterns:["وصفي","توجيهي"],curriculumPeriod:"الأول",
  scope:"توجيهات مخطط 2018؛ ليست إثباتًا للمهارات المنجزة في القسم"},
 {segment:"الإعلام والمجتمع",sequence:2,readingPatterns:["حجاجي"],writingPatterns:["تفسيري","سردي"],curriculumPeriod:"الأول",
  scope:"قد يختلف نمط السند عن نمط الإنتاج داخل المقطع نفسه"},
 {segment:"التضامن الإنساني",sequence:3,readingPatterns:["تفسيري","توجيهي"],writingPatterns:["تفسيري","توجيهي"],curriculumPeriod:"الثاني",
  scope:"ميدان فهم المكتوب 2018 يؤكد التفسير والتوجيه؛ التقويم الكتابي للفصل الثاني يذكر السرد والحوار أيضًا"}
];
const patternNames={narrative:"سردي",descriptive:"وصفي",expository:"تفسيري",argumentative:"حجاجي",directive:"توجيهي",dialogue:"حواري",any:"غير محدد"};
function norm(s){return String(s||"").normalize("NFC").replace(/[أإآٱ]/g,"ا").replace(/[ًٌٍَُِّْـ]/g,"").replace(/\s+/g," ").trim()}
function findSegment(name){return oldPlan4AM.find(x=>norm(x.segment)===norm(name))||null}
function classifyQuestion(q){
 const rule=readingSkills[q.sourceFamily||q.id];
 if(!rule)return {name:"يتطلب تحليلًا",id:null,dimension:q.skill||"مهارة غير محددة",verified:false};
 const level=bloom.find(x=>x.id===rule.bloom);
 return {name:level.name,id:level.id,dimension:rule.dimension,verified:false,provenance:"تصنيف مبدئي بحسب المهارة المُعدة في قالب السؤال، ويحتاج تأكيدًا على مستوى النص والإجابة"};
}
function orderReading(questions,prior=""){
 // Ordered for guided progression; DO NOT silently substitute content or fabricate evidence.
 const rank={remember:0,understand:1,apply:2,analyze:3,evaluate:4,create:5};
 const normalizedPrevious=norm(prior);
 const enriched=questions.map((q,i)=>{
  const label=classifyQuestion(q);
  const repeated=normalizedPrevious.length>3&&normalizedPrevious.includes(norm(label.dimension));
  return {...q,bloomLevel:label.name,bloomId:label.id,bloomDimension:label.dimension,repeatedSkillWarning:repeated,_originalOrder:i};
 });
 return enriched.sort((a,b)=>(rank[a.bloomId]??20)-(rank[b.bloomId]??20)||a._originalOrder-b._originalOrder)
 .map(({_originalOrder,...item})=>item);
}
function auditContext({level="",segment="",kind="",genre="",pattern=""}={}){
 const findings=[];
 if(level!=="الرابعة متوسط"){
  findings.push({status:"pending",text:"تطبيق المرجعية التفصيلية لهذه السنة الدراسية غير متاح بعد؛ لا تعمم مخطط الرابعة متوسط على مستويات أخرى."});return findings;
 }
 const rec=findSegment(segment);
 if(!rec){
  findings.push({status:"pending",text:"المقطع غير موثق في فهرس المخطط الرسمي المحدود لسنة 2018؛ لا يعني ذلك أنه غير مقرر حاليًا."});return findings;
 }
 findings.push({status:"good",text:"وُجد المقطع «"+rec.segment+"» في المخطط الرسمي المؤرخ سبتمبر 2018 (المقطع "+rec.sequence+")."});
 const requested=patternNames[pattern]||pattern;
 if(pattern!=="any"&&requested&&!rec.readingPatterns.includes(requested)){
  findings.push({status:"pending",text:"في ميدان فهم المكتوب بمخطط 2018 يغلب على هذا المقطع: "+rec.readingPatterns.join(" و")+". اختيارك «"+requested+"» يحتاج مراجعة النوع والميدان، لكنه لا يُلغى تلقائيًا."});
 }
 if(rec.curriculumPeriod==="الثاني"&&String(kind).includes("الثلاثي الأول")){
  findings.push({status:"pending",text:"تنبيه زمني استرشادي: المخطط الرسمي 2018 يربط «"+rec.segment+"» بالمقاطع التالية للمرحلة الأولى. إذا دُرس في قسمك مبكرًا فاعتمد توزيعك الفعلي."});
 }
 return findings;
}
function auditReading(questions){
 const findings=[],array=questions.map(classifyQuestion),categories=new Set(array.filter(x=>x.id).map(x=>x.id));
 if(!questions.length) return [{status:"pending",text:"لا توجد أسئلة لتقييم تدرجها وفق بلوم."}];
 if(categories.size>=2){
  findings.push({status:"good",text:"مستويات الفهم المستهدفة متنوعة مبدئيًا: "+[...categories].map(id=>bloom.find(x=>x.id===id)?.name).join("، ")+". هذا تصنيف القصد التعليمي لا تدقيق استجابة التلميذ."});
 }else findings.push({status:"pending",text:"الأسئلة تستهدف مستوى معرفيًا واحدًا أو لا يمكن تصنيفها بدقة؛ تُراجع المهارات والأجوبة."});
 if(array.some(x=>!x.id))findings.push({status:"pending",text:"بعض الأسئلة لا تملك مهارة موثقة في قاموس بلوم؛ لا نصنفها بأفعال الأمر فقط."});
 if(questions.some(q=>q.repeatedSkillWarning))findings.push({status:"pending",text:"أشارت بيانات الفرض السابق إلى احتمال تكرار مهارة؛ تحقق من نوع المورد الفرعي المقوَّم."});
 return findings;
}
root.ManaraPedagogyCore={version:"1.0",documents,bloom,oldPlan4AM,findSegment,orderReading,auditReading,auditContext,classifyQuestion,methodologyGuide:"pedagogy/building-exams-and-bloom-v1.md"};
})(typeof window==="object"?window:globalThis);
