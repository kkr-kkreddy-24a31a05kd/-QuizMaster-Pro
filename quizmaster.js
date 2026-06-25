/* QuizMaster Pro — Alpine.js app + client-side "backend" via localStorage.
 * Zero external deps beyond Tailwind/Alpine (loaded via CDN in index.html).
 */

/* -------- safe localStorage wrapper -------- */
const LS = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[LS.get] corrupt key, resetting:", key, e);
      try { localStorage.removeItem(key); } catch (_) {}
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { console.warn("[LS.set] failed:", key, e); return false; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch (_) {} },
};

/* -------- quiz content (compact but real) -------- */
const QUIZZES = {
  school: {
    title: "School (Grades 1–10)", icon: "🏫",
    subjects: {
      math:    { name: "Mathematics", questions: [
        { q: "What is 12 × 8?", options: ["86","96","104","112"], answer: 1 },
        { q: "Square root of 144?", options: ["10","11","12","14"], answer: 2 },
        { q: "Solve: 3x = 21", options: ["5","6","7","8"], answer: 2 },
        { q: "Area of rectangle 5×4?", options: ["9","20","25","45"], answer: 1 },
        { q: "Sum of angles in a triangle?", options: ["90°","180°","270°","360°"], answer: 1 },
      ]},
      english: { name: "English", questions: [
        { q: "Synonym of 'happy'?", options: ["sad","joyful","angry","tired"], answer: 1 },
        { q: "Antonym of 'big'?", options: ["huge","large","small","tall"], answer: 2 },
        { q: "Past tense of 'go'?", options: ["goed","went","gone","going"], answer: 1 },
        { q: "Plural of 'child'?", options: ["childs","childes","children","childer"], answer: 2 },
        { q: "Choose noun: She bought a ___.", options: ["beautifully","quickly","book","ran"], answer: 2 },
      ]},
      science: { name: "Science", questions: [
        { q: "H2O is the formula for?", options: ["Salt","Water","Oxygen","Hydrogen"], answer: 1 },
        { q: "Largest planet?", options: ["Earth","Mars","Jupiter","Saturn"], answer: 2 },
        { q: "Plants make food via?", options: ["Respiration","Photosynthesis","Digestion","Osmosis"], answer: 1 },
        { q: "Speed of light (approx)?", options: ["3×10^5 km/s","3×10^8 km/s","3×10^3 km/s","3×10^6 km/s"], answer: 0 },
        { q: "Unit of force?", options: ["Joule","Newton","Watt","Pascal"], answer: 1 },
      ]},
    },
  },
  intermediate: {
    title: "Intermediate (11–12)", icon: "📘",
    subjects: {
      physics: { name: "Physics", questions: [
        { q: "SI unit of electric current?", options: ["Volt","Ohm","Ampere","Watt"], answer: 2 },
        { q: "Acceleration due to gravity (m/s²)?", options: ["8.8","9.8","10.8","11.8"], answer: 1 },
        { q: "Newton's 2nd law?", options: ["F=ma","E=mc²","V=IR","P=VI"], answer: 0 },
        { q: "Frequency unit?", options: ["Hertz","Henry","Joule","Tesla"], answer: 0 },
        { q: "Sound is a ___ wave.", options: ["Transverse","Longitudinal","EM","Surface"], answer: 1 },
      ]},
      chemistry: { name: "Chemistry", questions: [
        { q: "Atomic number of Carbon?", options: ["4","6","8","12"], answer: 1 },
        { q: "pH of pure water?", options: ["1","7","10","14"], answer: 1 },
        { q: "NaCl is?", options: ["Salt","Sugar","Acid","Base"], answer: 0 },
        { q: "Noble gas?", options: ["H","O","He","N"], answer: 2 },
        { q: "Avogadro's number magnitude?", options: ["10^21","10^23","10^25","10^19"], answer: 1 },
      ]},
      maths: { name: "Mathematics", questions: [
        { q: "d/dx (x²)?", options: ["x","2x","x²","2"], answer: 1 },
        { q: "∫1 dx?", options: ["0","x+C","1","ln x"], answer: 1 },
        { q: "sin²θ + cos²θ = ?", options: ["0","1","2","tanθ"], answer: 1 },
        { q: "log(1) = ?", options: ["0","1","10","∞"], answer: 0 },
        { q: "Roots of x²-4=0?", options: ["0,4","±2","±4","2,4"], answer: 1 },
      ]},
    },
  },
  polytechnic: {
    title: "Polytechnic", icon: "🛠",
    subjects: {
      electrical: { name: "Electrical", questions: [
        { q: "Ohm's law?", options: ["V=IR","P=IV","F=ma","E=mc²"], answer: 0 },
        { q: "Unit of resistance?", options: ["Volt","Ohm","Ampere","Farad"], answer: 1 },
        { q: "AC stands for?", options: ["Active Current","Alternating Current","Average Current","Atomic Current"], answer: 1 },
        { q: "Transformer works on?", options: ["DC","AC","Both","Neither"], answer: 1 },
        { q: "Diode allows current in ___ direction.", options: ["both","one","none","random"], answer: 1 },
      ]},
      mechanical: { name: "Mechanical", questions: [
        { q: "Unit of pressure?", options: ["Pascal","Newton","Joule","Watt"], answer: 0 },
        { q: "Hardest natural material?", options: ["Iron","Diamond","Steel","Gold"], answer: 1 },
        { q: "First law of thermodynamics is about?", options: ["Entropy","Energy conservation","Pressure","Volume"], answer: 1 },
        { q: "IC engine cycle for petrol?", options: ["Diesel","Otto","Rankine","Brayton"], answer: 1 },
        { q: "Lathe is used for?", options: ["Welding","Turning","Drilling only","Casting"], answer: 1 },
      ]},
    },
  },
  btech: {
    title: "B.Tech / Engineering", icon: "🎓",
    subjects: {
      programming: { name: "Programming", questions: [
        { q: "Time complexity of binary search?", options: ["O(n)","O(log n)","O(n²)","O(1)"], answer: 1 },
        { q: "Which is OOP language?", options: ["C","Java","HTML","CSS"], answer: 1 },
        { q: "Stack is ___ structure.", options: ["FIFO","LIFO","Random","Sorted"], answer: 1 },
        { q: "SQL keyword to fetch?", options: ["GET","SELECT","FETCH","PULL"], answer: 1 },
        { q: "HTTP status 404?", options: ["OK","Not found","Server error","Redirect"], answer: 1 },
      ]},
      dbms: { name: "DBMS", questions: [
        { q: "Primary key is?", options: ["Unique identifier","Foreign","Index","Null"], answer: 0 },
        { q: "Normalization reduces?", options: ["Redundancy","Speed","Storage cost only","Security"], answer: 0 },
        { q: "ACID — A stands for?", options: ["Atomicity","Atomic","Allow","Audit"], answer: 0 },
        { q: "Join combines?", options: ["Rows","Tables","Columns of single","Indexes"], answer: 1 },
        { q: "NoSQL example?", options: ["MySQL","Postgres","MongoDB","Oracle"], answer: 2 },
      ]},
      networks: { name: "Networks", questions: [
        { q: "OSI layers count?", options: ["5","6","7","8"], answer: 2 },
        { q: "IP works at?", options: ["Data link","Network","Transport","Application"], answer: 1 },
        { q: "HTTPS uses port?", options: ["21","80","443","8080"], answer: 2 },
        { q: "TCP is?", options: ["Connectionless","Connection-oriented","Stateless","Broadcast"], answer: 1 },
        { q: "DNS translates?", options: ["IP→MAC","Name→IP","IP→Name only","MAC→IP"], answer: 1 },
      ]},
    },
  },
  competitive: {
    title: "Competitive Exams", icon: "🏅",
    subjects: {
      reasoning: { name: "Reasoning", questions: [
        { q: "Find odd: 2,4,8,14,32", options: ["4","8","14","32"], answer: 2 },
        { q: "If MONDAY=123456, then DAY=?", options: ["456","356","256","156"], answer: 0 },
        { q: "Next: 1,1,2,3,5,8,?", options: ["11","12","13","14"], answer: 2 },
        { q: "A is brother of B. B is sister of C. A is C's ?", options: ["Father","Brother","Uncle","Cousin"], answer: 1 },
        { q: "Mirror image of 'b' is?", options: ["d","p","q","b"], answer: 0 },
      ]},
      aptitude: { name: "Aptitude", questions: [
        { q: "20% of 250?", options: ["25","40","50","60"], answer: 2 },
        { q: "Simple interest on 1000 at 10% for 2y?", options: ["100","150","200","250"], answer: 2 },
        { q: "Average of 2,4,6,8,10?", options: ["5","6","7","8"], answer: 1 },
        { q: "Ratio 2:3 of 75?", options: ["25:50","30:45","20:55","35:40"], answer: 1 },
        { q: "Train 60km/h covers 30km in?", options: ["20m","30m","45m","60m"], answer: 1 },
      ]},
    },
  },
  gk: {
    title: "General Knowledge", icon: "🌍",
    subjects: {
      world: { name: "World", questions: [
        { q: "Capital of Japan?", options: ["Beijing","Seoul","Tokyo","Bangkok"], answer: 2 },
        { q: "Largest ocean?", options: ["Atlantic","Indian","Arctic","Pacific"], answer: 3 },
        { q: "Currency of UK?", options: ["Euro","Dollar","Pound","Yen"], answer: 2 },
        { q: "Eiffel Tower is in?", options: ["Rome","Paris","Berlin","Madrid"], answer: 1 },
        { q: "UN HQ is in?", options: ["Geneva","New York","Paris","London"], answer: 1 },
      ]},
      india: { name: "India", questions: [
        { q: "Capital of India?", options: ["Mumbai","Kolkata","New Delhi","Chennai"], answer: 2 },
        { q: "National animal?", options: ["Lion","Tiger","Elephant","Peacock"], answer: 1 },
        { q: "Father of the Nation?", options: ["Nehru","Patel","Gandhi","Bose"], answer: 2 },
        { q: "Longest river in India?", options: ["Yamuna","Ganga","Godavari","Krishna"], answer: 1 },
        { q: "India independence year?", options: ["1945","1947","1950","1962"], answer: 1 },
      ]},
    },
  },
};

/* -------- Alpine app -------- */
function QuizMasterApp() {
  return {
    QUIZZES,
    view: "home",
    showCert: false,
    user: { name: "Guest", xp: 0, badges: [] },
    history: [],
    quiz: { categoryKey:"", subjectKey:"", categoryTitle:"", subjectName:"",
            questions: [], index: 0, score: 0, picked: null, answered: false,
            timeLeft: 0, startedAt: 0, _timer: null },
    result: { score:0, total:0, percent:0, xp:0, duration:0, categoryTitle:"", subjectName:"", categoryKey:"", subjectKey:"" },
    features: [
      { i:"🎮", t:"Gamified XP", d:"Earn XP and climb the ranks with every correct answer." },
      { i:"🏆", t:"Leaderboard", d:"Compete with mock players and watch your name rise." },
      { i:"📊", t:"Analytics", d:"See accuracy, streaks and history at a glance." },
      { i:"🎖", t:"Certificates", d:"Download printable certificates of achievement." },
      { i:"📱", t:"Responsive", d:"Beautiful on phones, tablets and desktops." },
      { i:"💾", t:"Offline-ready", d:"Progress persists in your browser — no server needed." },
    ],

    init() {
      const u = LS.get("qmp_user", null);
      if (u && typeof u === "object") this.user = Object.assign(this.user, u);
      this.history = LS.get("qmp_history", []) || [];
      // safety: persist on unload
      window.addEventListener("beforeunload", () => this.save());
    },

    save() {
      LS.set("qmp_user", this.user);
      LS.set("qmp_history", this.history);
    },

    resetAll() {
      LS.remove("qmp_user"); LS.remove("qmp_history");
      this.user = { name: "Guest", xp: 0, badges: [] };
      this.history = [];
      this.view = "home";
    },

    /* ---- quiz flow ---- */
    startQuiz(categoryKey, subjectKey) {
      const cat = QUIZZES[categoryKey]; if (!cat) return;
      const sub = cat.subjects[subjectKey]; if (!sub) return;
      const shuffled = sub.questions.slice().sort(() => Math.random() - 0.5);
      this.quiz = {
        categoryKey, subjectKey,
        categoryTitle: cat.title, subjectName: sub.name,
        questions: shuffled, index: 0, score: 0,
        picked: null, answered: false,
        timeLeft: shuffled.length * 20,
        startedAt: Date.now(), _timer: null,
      };
      this.showCert = false;
      this.view = "quiz";
      if (this.quiz._timer) clearInterval(this.quiz._timer);
      this.quiz._timer = setInterval(() => {
        this.quiz.timeLeft--;
        if (this.quiz.timeLeft <= 0) { clearInterval(this.quiz._timer); this.finish(); }
      }, 1000);
    },

    currentQ() { return this.quiz.questions[this.quiz.index]; },

    pick(i) {
      if (this.quiz.answered) return;
      this.quiz.picked = i;
      this.quiz.answered = true;
      if (i === this.currentQ().answer) this.quiz.score++;
    },

    next() {
      if (this.quiz.index + 1 < this.quiz.questions.length) {
        this.quiz.index++; this.quiz.picked = null; this.quiz.answered = false;
      } else {
        this.finish();
      }
    },

    quitQuiz() {
      if (!confirm("Quit this quiz? Progress will be lost.")) return;
      clearInterval(this.quiz._timer);
      this.view = "categories";
    },

    finish() {
      clearInterval(this.quiz._timer);
      const total = this.quiz.questions.length;
      const percent = Math.round((this.quiz.score / total) * 100);
      const duration = Math.round((Date.now() - this.quiz.startedAt) / 1000);
      const xp = this.quiz.score * 10 + (percent === 100 ? 25 : 0);
      this.user.xp += xp;
      // badges
      if (percent === 100 && !this.user.badges.includes("Perfect Score")) this.user.badges.push("Perfect Score");
      if (this.user.xp >= 100 && !this.user.badges.includes("Centurion")) this.user.badges.push("Centurion");
      if (this.user.xp >= 500 && !this.user.badges.includes("XP Master")) this.user.badges.push("XP Master");

      this.result = {
        score: this.quiz.score, total, percent, xp, duration,
        categoryTitle: this.quiz.categoryTitle, subjectName: this.quiz.subjectName,
        categoryKey: this.quiz.categoryKey, subjectKey: this.quiz.subjectKey,
      };
      this.history.push({
        id: Date.now(), ...this.result,
        date: new Date().toISOString(),
      });
      this.save();
      this.view = "result";
    },

    /* ---- helpers ---- */
    formatTime(s) {
      s = Math.max(0, s|0);
      const m = String(Math.floor(s/60)).padStart(2,"0");
      const r = String(s%60).padStart(2,"0");
      return m+":"+r;
    },
    avgPercent() {
      if (!this.history.length) return 0;
      return Math.round(this.history.reduce((a,h)=>a+h.percent,0) / this.history.length);
    },
    rank() {
      const x = this.user.xp;
      if (x >= 1000) return "Grandmaster";
      if (x >=  500) return "Master";
      if (x >=  250) return "Expert";
      if (x >=  100) return "Skilled";
      if (x >=   25) return "Apprentice";
      return "Novice";
    },
    leaderboard() {
      const mock = [
        { name: "Aarav",   xp: 1240, quizzes: 28, avg: 91 },
        { name: "Diya",    xp:  980, quizzes: 22, avg: 88 },
        { name: "Rohan",   xp:  760, quizzes: 18, avg: 84 },
        { name: "Mei",     xp:  640, quizzes: 16, avg: 80 },
        { name: "Liam",    xp:  510, quizzes: 14, avg: 77 },
        { name: "Sara",    xp:  420, quizzes: 12, avg: 74 },
        { name: "Karan",   xp:  300, quizzes:  9, avg: 71 },
        { name: "Anika",   xp:  220, quizzes:  7, avg: 68 },
        { name: "Vivaan",  xp:  140, quizzes:  5, avg: 65 },
      ];
      const you = { name: this.user.name || "You", xp: this.user.xp,
                    quizzes: this.history.length, avg: this.avgPercent(), you: true };
      return mock.concat([you]).sort((a,b) => b.xp - a.xp);
    },

    /* ---- certificate ---- */
    downloadCertificate() {
      // Use native print → user can choose "Save as PDF"
      window.print();
    },
  };
}

// expose globally so Alpine x-data="QuizMasterApp()" can resolve
window.QuizMasterApp = QuizMasterApp;