/* المنارة: نصوص الكتب المحلية — أدوات بحث مستقلة، دون إرسال أو تخزين خارجي */
(function(root){
"use strict";
const groups={
 "قضايا اجتماعية":["الآفات الاجتماعية","المجتمع","الظواهر الاجتماعية","المشكلات الاجتماعية"],
 "الإعلام والمجتمع":["الإعلام","الصحافة","الخبر","التواصل","الصحف"],
 "التضامن الإنساني":["التضامن","التكافل","التعاون","التآزر","المساعدة","النجدة"],
 "شعوب العالم":["الشعوب","الثقافات","الحضارات","التنوع"],
 "العلم والتقدم التكنولوجي":["العلم","التقنية","الاختراعات","التكنولوجيا"],
 "التلوث البيئي":["البيئة","التلوث","الطبيعة","النفايات"],
 "الصناعات التقليدية":["التراث","الصناعة التقليدية","الحرف","الصناعات التقليدية"],
 "الهجرة الداخلية والخارجية":["الهجرة","المهاجر","الاغتراب","الوطن"]
};
function normalizeArabic(value){
 return String(value||"").normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g,"")
 .replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim().toLowerCase();
}
function termsFor(segment){
 const items=groups[segment]||[segment];
 return [...new Set(items.map(normalizeArabic).filter(x=>x.length>=3))];
}
function matchTerms(text,terms){
 const norm=normalizeArabic(text);
 return terms.filter(x=>norm.includes(normalizeArabic(x)));
}
function narrativeEvidence(text){
 const s=normalizeArabic(text);
 const time=["ذات يوم","في يوم من الايام","في صباح","فجاه","وبعد قليل","في المساء","بعد ذلك","في احد الايام","في تلك اللحظه","وما هي الا","وفي اليوم التالي","ثم"];
 const action=["قال","قالت","سأل","سألت","دخل","خرج","ذهب","ذهبت","عاد","عادت","وصل","رأى","راى","التقى","سمع","فزع","انقذ","اكتشف"];
 const presentTime=time.filter(x=>s.includes(normalizeArabic(x)));
 const presentAction=action.filter(x=>s.includes(normalizeArabic(x)));
 const explicit=/^\s*(?:قصة|حكاية|قصص|رواية)\b/.test(String(text||"").trim())||/(?:قصتنا|حكايتنا)/.test(s.slice(0,250));
 const essay=/^\s*(?:مقال|بحث|دراسة|تقرير)\b/.test(String(text||"").trim());
 return {time:presentTime,action:presentAction,explicit,essay,storyPossible:!essay&&(explicit||(presentTime.length>=1&&presentAction.length>=2))};
}
function scoreWindow(text,segment,genre="story"){
 const terms=termsFor(segment);
 const matched=matchTerms(text,terms);
 const narrative=narrativeEvidence(text);
 let suitable=matched.length>0;
 let reason=matched.length?"تطابق موضوعي أولي: "+matched.join("، "):"لا تظهر كلمات من الموضوع";
 if(genre==="story"){
  suitable=suitable&&narrative.storyPossible;
  reason+=narrative.storyPossible?"؛ قرائن قصصية تحتاج فحصًا بشريًا":"؛ لم تُرصد قرائن قصصية كافية";
 }else if(genre==="poem"){
  suitable=suitable&&/قصيده|شعر|ابيات|ديوان/.test(normalizeArabic(text.slice(0,260)));
  reason+=suitable?"؛ عنوان يوحي بالشعر":"؛ لم يظهر ما يدل بوضوح على الشعر";
 }else if(genre==="article"){
  suitable=suitable&&(/مقال|بحث|دراسه|تقرير/.test(normalizeArabic(text.slice(0,260)))||(!narrative.storyPossible&&text.length>400));
  reason+=suitable?"؛ مرشح مقالي غير مؤكّد":"؛ نوع المقال غير مؤكد";
 }else if(genre==="speech"){
  suitable=suitable&&/ايها|اخواني|الساده|الخطبه|الخطاب/.test(normalizeArabic(text.slice(0,260)));
  reason+=suitable?"؛ قرائن خطابية أولية":"؛ نمط الخطبة غير مؤكّد";
 }else if(genre==="letter"){
  suitable=suitable&&/عزيزي|عزيزتي|الرساله|تحيه طيبه|الي صديقي/.test(normalizeArabic(text.slice(0,260)));
  reason+=suitable?"؛ قرائن مراسلة أولية":"؛ نوع الرسالة غير مؤكّد";
 }
 const score=matched.length*12+(narrative.storyPossible&&genre==="story"?8:0)+(narrative.explicit&&genre==="story"?8:0);
 return {score,suitable,reason,narrative,matched};
}
function candidatesFromBook(book,segment,genre="story",maxWindows=1000){
 const pages=Array.isArray(book.pages)?book.pages:[];
 const c=[];
 for(let i=0;i<pages.length&&i<maxWindows;i++){
  // Preview may span adjacent pages: a story rarely fits in one short PDF page.
  const window=pages.slice(i,Math.min(i+3,pages.length));
  if(window.some((p,j)=>j>0&&Number(p.number)!==Number(window[j-1].number)+1))continue;
  const text=window.map(p=>String(p.text||"")).join("\n\n");
  if(text.length<90)continue;
  const evalResult=scoreWindow(text,segment,genre);
  if(!evalResult.suitable)continue;
  c.push({bookId:book.id,bookTitle:book.title,year:book.year||"",country:book.country||"",pageStart:window[0].number,pageEnd:window.at(-1).number,
    text,score:evalResult.score,reason:evalResult.reason,genre,originalAuthor:book.originalAuthor||"",bookPublisher:book.publisher||""});
 }
 return c.sort((a,b)=>b.score-a.score);
}
function rankBooks(books,segment,genre="story",limit=8){
 const all=books.flatMap(b=>candidatesFromBook(b,segment,genre));
 all.sort((a,b)=>b.score-a.score||String(a.bookTitle).localeCompare(String(b.bookTitle),"ar"));
 const chosen=[],byBook=new Map();
 for(const candidate of all){
  if(chosen.length>=limit)break;
  const used=byBook.get(candidate.bookId)||[];
  if(used.some(c=>Math.abs(c.pageStart-candidate.pageStart)<=3))continue;
  chosen.push(candidate);used.push(candidate);byBook.set(candidate.bookId,used);
 }
 return chosen;
}
root.ManaraBookCore={normalizeArabic,termsFor,matchTerms,narrativeEvidence,scoreWindow,candidatesFromBook,rankBooks};
})(typeof window==="object"?window:globalThis);
