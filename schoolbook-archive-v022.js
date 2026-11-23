/* المنارة V0.22 — فهرس حقيقي من أصل الكتب الجزائرية القديمة
   Verified on 2026-11-23 from Archive.org full OCR pages, with links to scans.
   Not a curriculum certification or clean digital text. No book text is republished here.
*/
(function(root){"use strict";
const books=[
 {id:"al-mukhtar-4m-1986",name:"المختار للسنة الرابعة المتوسطة في القراءة والنصوص",
  country:"الجزائر",level:"الرابعة متوسط (المنهاج التاريخي)",year:"1986–1987",publisher:"المعهد التربوي الوطني",
  publisherStatus:"وفق بطاقة النشر",bookPages:180,
  viewer:"https://archive.org/details/lis_mt63/lis_mt6305?view=theater",
  ocr:"https://archive.org/stream/lis_mt63/lis_mt6305_djvu.txt",
  pdf:"https://archive.org/download/lis_mt63/lis_mt6305.pdf",
  metadata:"https://www.lisanarb.com/2023/03/pdf_834.html",
  note:"النص المستخرج آليًا من المسح متاح، لكنه يحتوي أخطاء OCR كثيرة؛ يطابق الأستاذ صفحته مع الصورة قبل اعتماد شاهد."
 },
 {id:"qiraa-8as-2000",name:"القراءة والنصوص العربية — السنة الثامنة من التعليم الأساسي",
  country:"الجزائر",level:"الثامنة أساسي (منهاج تاريخي)",year:"2000–2001",publisher:"الديوان الوطني للمطبوعات المدرسية",
  publisherStatus:"وفق بطاقة النشر وغلاف الكتاب",bookPages:228,
  viewer:"https://archive.org/details/lis_mr12/lisanarb.com_mr1204?view=theater",
  ocr:"https://archive.org/stream/lis_mr12/lisanarb.com_mr1204_djvu.txt",
  pdf:"https://archive.org/download/lis_mr12/lisanarb.com_mr1204.pdf",
  metadata:"https://mktbt.lisanarb.com/2024/07/8-pdf.html",
  note:"عُوينت مادة OCR وتثبت وجود نصوص من محور العلاقات الاجتماعية وفهرسها، لكن النصوص غير مصححة إملائيًا."
 }
];
const records=[
 {id:"old4-leaf",book:"al-mukhtar-4m-1986",title:"اللوحة الخالدة",genre:"story",pattern:"narrative",topics:["التضامن الإنساني","قضايا اجتماعية","القيم الإنسانية"],
  evidence:"النص يحمل أحداث مرض فتاة ورسّام يضحّي ليعيد إليها الأمل، ومعه أسئلة فهم عن الفعل الإنساني.",
  pageNote:"قرب الصفحات 37–39 من الطبعة؛ تحقق من رقم الصفحة في الصورة",
  author:"لم يُثبت مؤلف القصة الأصلي من مادة OCR وحدها",
  readiness:"original-scanned-ocr",matchesGrade:true,fit:"ملائم موضوعيًا للمراجعة، وليس حكمًا بتوافقه مع المنهاج الحالي",
  sourceAnchor:"اللوحة الخالدة"},
 {id:"old4-friends",book:"al-mukhtar-4m-1986",title:"أفضل الأصحاب",genre:"story",pattern:"narrative",topics:["التضامن الإنساني","قضايا اجتماعية","القيم الإنسانية"],
  evidence:"حكاية تعالج العفو عند المقدرة ومواقف الأصدقاء والمروءة، وقد وردت مع أسئلة مناقشة.",
  pageNote:"بعد نص اللوحة الخالدة في نحو الصفحة 40 وما بعدها؛ يلزم التثبت من رقم الصفحة",
  author:"الراوي أو الكاتب الأصلي غير محقق",
  readiness:"original-scanned-ocr",matchesGrade:true,fit:"المحور قريب من القيم الإنسانية؛ علاقته بالتضامن أقل مباشرة",
  sourceAnchor:"أفضل الأصحاب"},
 {id:"old4-animals",book:"al-mukhtar-4m-1986",title:"الحمامة والثعلب ومالك الحزين",genre:"story",pattern:"narrative",topics:["القيم الإنسانية","قضايا اجتماعية"],
  evidence:"حكاية على ألسنة الحيوان من كليلة ودمنة، تناقش الخديعة والنصيحة والنتائج.",
  pageNote:"قرب الصفحات 29–30؛ تحقق من رقم الصفحة",
  author:"عبد الله بن المقفع — كما يذكر تقديم الكتاب",
  readiness:"original-scanned-ocr",matchesGrade:true,fit:"ليست سندًا عن التضامن بمجرد ظهور الحمامة؛ تحتاج مطابقة موضوعية",
  sourceAnchor:"الحمامة والنعلب ومالك الحزين"},
 {id:"old4-freedom",book:"al-mukhtar-4m-1986",title:"الحرية والمسؤولية",genre:"expository",pattern:"directive",topics:["قضايا اجتماعية","القيم الإنسانية"],
  evidence:"نص موجه إلى علاقة الحرية بمصلحة الجماعة والمسؤولية؛ ليس قصة سردية مستقلة.",
  pageNote:"ضمن الصفحات الأولى بعد تقديم الكتاب؛ يحتاج تحديد الصفحة من الصورة",
  author:"تقديم وتفسير حول حديث نبوي في المصدر",
  readiness:"original-scanned-ocr",matchesGrade:true,fit:"لا يُعرض عند اشتراط القصة",
  sourceAnchor:"الحرية والمسؤولية"},
 {id:"old4-hafiz",book:"al-mukhtar-4m-1986",title:"الأخلاق والعلم — أبيات حافظ إبراهيم",genre:"poem",pattern:"argumentative",topics:["قضايا اجتماعية","القيم الإنسانية"],
  evidence:"أبيات لحافظ إبراهيم تناقش أثر الأخلاق في العلم والمال، مع تحليل وأسئلة.",
  pageNote:"قبل نص «اللوحة الخالدة» قرب الصفحات 32–36؛ تحقق من أرقام الصور",
  author:"حافظ إبراهيم",readiness:"original-scanned-ocr",matchesGrade:true,fit:"نص شعري لا يَعرض مكان القصة",
  sourceAnchor:"حافظ إبراهيم » شاعر"},
 {id:"old8-hatem",book:"qiraa-8as-2000",title:"حاتم الطائي يذبح فرسه",genre:"story",pattern:"narrative",
  topics:["التضامن الإنساني","القيم الإنسانية","قضايا اجتماعية"],
  evidence:"حكاية من محور العلاقات الاجتماعية عن إطعام المحتاجين في وقت الشدة، وتظهر أفعال حاتم وموقفه.",
  pageNote:"ص 83 بحسب فهرس الكتاب؛ تحقق من الصفحة المصوّرة",
  author:"خبر تاريخي — المصدر الأصلي للسرد لم يُتحقق من نسبة نصه",
  readiness:"original-scanned-ocr",matchesGrade:false,fit:"مرجع من الثامنة أساسي؛ مناسبة سنّه ولغته للرابعة متوسط تحتاج مراجعة",
  sourceAnchor:"حاتم الطائي يذبح فرسه"},
 {id:"old8-lioness",book:"qiraa-8as-2000",title:"حديث الأسوار واللبؤة والشعهر (العنوان كما ظهر في OCR)",genre:"story",pattern:"narrative",
  topics:["قضايا اجتماعية","القيم الإنسانية"],
  evidence:"قصة على ألسنة الحيوان من باب العلاقات الاجتماعية، تتناول الجزاء والعدل ومغزى «كما تدين تدان». عنوان الشخصيات يحتاج مراجعة الرسم الأصلي.",
  pageNote:"ص 73 بحسب فهرس الكتاب؛ عنوان OCR غير منقّح",
  author:"ابن المقفع / كليلة ودمنة بحسب إشارة بداية النص",readiness:"ocr-title-needs-check",matchesGrade:false,
  fit:"يحتاج تصحيح العنوان من صورة الصفحة قبل اعتماد البطاقة",sourceAnchor:"حديث الأسوار واللبؤة"},
 {id:"old8-figtree",book:"qiraa-8as-2000",title:"التينة الحمقاء",genre:"poem",pattern:"narrative",
  topics:["القيم الإنسانية","قضايا اجتماعية","الطبيعة والبيئة"],
  evidence:"قصيدة إيليا أبي ماضي تصوّر شجرة تبخل بخيرها، وهي شعر رغم وجود أحداث وشخصيات مجازية.",
  pageNote:"حوالي ص 79–82؛ يذكر الفهرس العنوان وظهرت الأبيات في الأصل",
  author:"إيليا أبو ماضي",readiness:"original-scanned-ocr",matchesGrade:false,
  fit:"نص شعري وليس قصة نثرية",sourceAnchor:"التينة الحمقاء"},
 {id:"old8-science",book:"qiraa-8as-2000",title:"أثر العلم في الحياة",genre:"article",pattern:"expository",
  topics:["العلم والتقدم التكنولوجي"],evidence:"مقال يناقش أثر العلم في الزراعة والطب والصناعة، مع مهام تحويل نحوي وبلاغة وتعبير.",
  pageNote:"من أوائل الكتاب في محور العلم والمعرفة؛ يراجع رقم الصفحة",
  author:"لم تُراجع نسبة القطعة إلى مؤلفها الأصلي",readiness:"original-scanned-ocr",matchesGrade:false,
  fit:"نص تفسيري وليس قصة",sourceAnchor:"أثر العلم في الحياة"},
 {id:"old8-hannibal",book:"qiraa-8as-2000",title:"حنبعل",genre:"play",pattern:"dialogue",
  topics:["شعوب العالم","القيم الإنسانية"],evidence:"مسرحية للمطالعة الموجّهة في آخر الكتاب، منظمة إلى فصول ومشاهد.",
  pageNote:"تبدأ قرابة ص 162 بحسب الفهرس",author:"أحمد توفيق المدني كما في تقديم الكتاب",
  readiness:"original-scanned-ocr",matchesGrade:false,fit:"مسرحية وليست قصة سردية في نتائج البحث",sourceAnchor:"حنبعل : بطل"}
];
const arabic=(s)=>String(s||"").normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").toLowerCase();
function requestedGenre(input){
 return ({story:"story",article:"article",speech:"speech",letter:"letter",poem:"poem",any:"any",expository:"expository",play:"play"})[input]||input;
}
function matchPattern(record,pattern){
 if(!pattern||pattern==="any")return true;
 const list={narrative:"narrative",descriptive:"descriptive",expository:"expository",argumentative:"argumentative",directive:"directive",dialogue:"dialogue"};
 return record.pattern===list[pattern];
}
function rank(topic,genre="story",pattern="narrative",level="الرابعة متوسط"){
 const wantedGenre=requestedGenre(genre),t=arabic(topic),words=t.split(/\s+/).filter(x=>x.length>3);
 const exactMatches=records.some(x=>(wantedGenre==="any"||x.genre===wantedGenre)&&matchPattern(x,pattern)&&x.topics.some(a=>arabic(a)===t));
 const results=[];
 for(const x of records){
  if(wantedGenre!=="any"&&x.genre!==wantedGenre)continue;
  if(!matchPattern(x,pattern))continue;
  const related=x.topics.some(a=>arabic(a)===t);
  const fuzzy=x.topics.some(a=>words.some(w=>arabic(a).includes(w)))||words.some(w=>arabic(x.title+" "+x.evidence).includes(w));
  const isLevelMatch=level==="الرابعة متوسط"&&x.matchesGrade;
  if(exactMatches?!related:(!related&&!fuzzy))continue;
  // Heuristic subject fit, not an official pedagogical rating.
  const subjectWeight=(t==="التضامن الانساني"?({"old4-leaf":24,"old8-hatem":20,"old4-friends":8}[x.id]||0):0);
  const score=(related?100:60)+(isLevelMatch?28:0)+(x.readiness==="original-scanned-ocr"?10:0)+subjectWeight;
  results.push({...x,bookInfo:books.find(b=>b.id===x.book),score,levelMatch:isLevelMatch,relation:related?"موضوع مستدل عليه من أحداث النص":"تقارب موضوعي يحتاج تحقق"});
 }
 return results.sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,"ar"));
}
root.ManaraSchoolbookArchive={books,records,rank,version:"V0.22",disclaimer:"وجود النص في نسخة الكتاب المصورة محقق؛ أما النص المستخرج آليًا ففيه أخطاء ويجب تدقيقه قبل اعتماد أي شاهد."};
})(typeof window==="object"?window:globalThis);
