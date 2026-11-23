import test from "node:test";
import assert from "node:assert/strict";
import app,{validateInput,checkQuestions,safeEq,norm} from "./worker.mjs";
const origin="https://hamzarabaa33-netizen.github.io";
const source=("قررت التلميذات التعاون فجمعن الكتب وساعدن زميلتهن على مراجعة الدروس في المكتبة. ").repeat(4);
const makeInput=()=>({
 passage:source,grade:"الرابعة متوسط",segment:"التضامن الإنساني",kind:"اختبار الثلاثي الأول",
 genre:"story",pattern:"narrative",sourceTitle:"نص تعليمي للاختبار",
 sourceAuthor:"",sourceReference:"",taughtResources:[],previous:""
});
const reading=(id,evidence)=>({id,domain:"reading",bloom:"فهم",skill:"الفهم القرائي",
 instruction:"بيّن كيف تعاونت التلميذات.",evidence,expectedAnswer:"تعاونت التلميذات في المراجعة.",
 points:4,rationale:"فهم معنى التعاون في الحدث"});
test("normalize tolerates Arabic diacritics",()=>assert.equal(norm("تَعَاوُنٌ"),"تعاون"));
test("rejects missing and oversized source",()=>{
 assert.ok(validateInput({...makeInput(),passage:"قصير"}));
 assert.ok(validateInput({...makeInput(),passage:"ن".repeat(11000)}));
 assert.equal(validateInput(makeInput()),null);
});
test("prevents fabricated quotes and unconfirmed grammar",()=>{
 const draft={questions:[reading("a","قررت التلميذات التعاون"),reading("b","شاهد لا يوجد في النص"),
  {...reading("c","قررت التلميذات التعاون"),domain:"language"}],
  writing:{context:"سياق",instruction:"تعليمة",criteria:["اتساق"],suggestedPoints:8}};
 const result=checkQuestions(draft,source,[]);
 assert.deepEqual(result.questions.map(x=>x.id),["a"]);
 assert.ok(result.findings.some(x=>x.questionId==="b"&&x.severity==="error"));
 assert.ok(result.findings.some(x=>x.questionId==="c"&&x.severity==="warning"));
});
test("compares access tokens safely",()=>{
 assert.equal(safeEq("secret-123","secret-123"),true);
 assert.equal(safeEq("secret-123","secret-124"),false);
});
test("GET health reports inactive secrets",async()=>{
 const response=await app.fetch(new Request("https://worker.example/health",{headers:{Origin:origin}}),{});
 assert.equal(response.status,200);
 assert.equal((await response.json()).configured,false);
});
test("rejects unauthorized attempts without model request",async()=>{
 const response=await app.fetch(new Request("https://worker.example/generate",{
  method:"POST",headers:{Origin:origin,"x-manara-token":"wrong","content-type":"application/json"},body:JSON.stringify(makeInput())}),
  {OPENAI_API_KEY:"private-server-key",TEACHER_ACCESS_TOKEN:"right"});
 assert.equal(response.status,401);
});
test("model-backed flow yields only exact grounded questions and explicit audit",async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{
  calls++;
  const payload=calls===1?{
   examTitle:"مسودة اختبار فصلي",sourceNotes:[],questions:[
    reading("read1","قررت التلميذات التعاون"),reading("hallucinated","أحداث لم ترد مطلقا")],
   writing:{context:"موقف مدرسي واقعي",instruction:"اكتب قصة تبين فيها أهمية التعاون",criteria:["الاتساق","سلامة اللغة"],suggestedPoints:8}
  }:{approved:false,findings:[{questionId:"read1",severity:"warning",reason:"يلزم تدقيق الإجابة والسلم."}]};
  return new Response(JSON.stringify({status:"completed",output:[{type:"message",content:[{type:"output_text",text:JSON.stringify(payload)}]}]}),{status:200});
 };
 try{
  const request=new Request("https://worker.example/generate",{method:"POST",headers:{"Origin":origin,
   "x-manara-token":"owner-secret","content-type":"application/json"},body:JSON.stringify(makeInput())});
  const response=await app.fetch(request,{OPENAI_API_KEY:"private-server-key",TEACHER_ACCESS_TOKEN:"owner-secret"});
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.status,"teacher-review-required");
  assert.equal(body.questions.length,1);
  assert.ok(body.findings.some(x=>x.questionId==="hallucinated"));
  assert.equal(body.verification.sourceVerified,false);
  assert.equal(body.verification.curriculumVerified,false);
  assert.equal(calls,2);
 }finally{globalThis.fetch=original}
});
