
const CASES = [
  {
    id: "ankle",
    title: "إصابة في الكاحل (التواء)",
    description: "إرشادات سريعة عند التواء الكاحل",
    steps: [
      "أبعد الشخص عن أي مصدر خطورة.",
      "اجلس المريض وارفع القدم قليلاً، ضع ثلجاً ملفوفاً على المكان ٢٠ دقيقة.",
      "ثبت الكاحل بضماد مرن لتقليل التورم.",
      "اطلب فحص طبي إذا استمر الألم أو ظهرت كدمات كبيرة."
    ]
  },
  {
    id: "low_bp",
    title: "انخفاض ضغط الدم (دوخة وإغماء محتمل)",
    description: "إذا شعر الشخص بدوخة أو غثيان",
    steps: [
      "اطلب منه الجلوس أو الاستلقاء مع رفع الساقين قليلاً.",
      "افتح الملابس الضيقة وتأكد من تهوية المكان.",
      "أعطه ماء إن لم يكن فاقد الوعي.",
      "راقب التنفس واطلب مساعدة طبية إن لم تتحسن الحالة."
    ]
  },
  {
    id: "high_sugar",
    title: "ارتفاع/انخفاض السكر",
    description: "علامات تغير مستوى السكر",
    steps: [
      "إن كان منخفضاً أعطه سكر سريع الامتصاص (عصير، غلوكوز).",
      "إذا كان مرتفعًا طالب مساعدة طبية وابعاده عن المشروبات الغازية.",
      "راقب الوعي والتنفس.",
      "احرص على توثيق الأعراض وإبلاغ الطاقم الطبي عند الوصول."
    ]
  }
];

// عناصر DOM
const emergencyBtn = document.getElementById("emergencyBtn");
const casesSection = document.getElementById("casesSection");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const readBtn = document.getElementById("readBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

// Fill cases dynamically
function renderCases(){
  casesList.innerHTML = "";
  CASES.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.title}</h3><p>${c.description}</p><button data-id="${c.id}">اختر</button>`;
    casesList.appendChild(card);
  });
}
renderCases();

// أحداث
emergencyBtn.addEventListener("click", ()=>{
  casesSection.classList.remove("hidden");
  stepsSection.classList.add("hidden");
  window.scrollTo({top: casesSection.offsetTop-20, behavior:'smooth'});
});

casesList.addEventListener("click", (e)=>{
  const id = e.target.getAttribute("data-id");
  if(!id) return;
  const chosen = CASES.find(x=>x.id===id);
  showSteps(chosen);
});

function showSteps(caseObj){
  caseTitle.textContent = caseObj.title;
  stepsList.innerHTML = "";
  caseObj.steps.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  casesSection.classList.add("hidden");
  stepsSection.classList.remove("hidden");
  window.scrollTo({top: stepsSection.offsetTop-20, behavior:'smooth'});
  // اقرأ أول خطوة تلقائيًا
  speak(caseObj.steps.join("، ثم "));
}

// Text-to-Speech (بسيط، يعمل في معظم المتصفحات الحديثة)
let utterance = null;
function speak(text){
  stopSpeak();
  if(!("speechSynthesis" in window)) return alert("ميزة النطق غير مدعومة في متصفحك");
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA"; // اضبطي اللغة العربية الخليجية
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function stopSpeak(){
  if(window.speechSynthesis && window.speechSynthesis.speaking){
    window.speechSynthesis.cancel();
  }
}

readBtn.addEventListener("click", ()=>{
  const items = Array.from(stepsList.children).map(li=>li.textContent);
  speak(items.join("، ثم "));
});
stopBtn.addEventListener("click", stopSpeak);
backBtn.addEventListener("click", ()=>{
  stepsSection.classList.add("hidden");
  casesSection.classList.remove("hidden");
  window.scrollTo({top: casesSection.offsetTop-20, behavior:'smooth'});
});


if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.lang = "ar-SA";
  recognizer.continuous = false;
  recognizer.interimResults = false;
  
  emergencyBtn.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
    recognizer.start();
  });
  recognizer.onresult = (ev) => {
    const text = ev.results[0][0].transcript;
 
    const low = text.toLowerCase();
    if(low.includes("كاحل")||low.includes("التواء")) showSteps(CASES[0]);
    else if(low.includes("ضغط")||low.includes("دوخة")) showSteps(CASES[1]);
    else if(low.includes("سكر")||low.includes("غازة")) showSteps(CASES[2]);
  };
}

