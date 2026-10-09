const D=window.VOCAB_DATA;const T=D.topics,W=D.words,$=s=>document.querySelector(s),app=$('#app');
const byId={},TW={};T.forEach(t=>TW[t.id]=[]);W.forEach(w=>{byId[w.id]=w;TW[w.t].push(w)});
const tinfo=id=>T.find(t=>t.id===id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>esc(s).replace(/\*\*(.+?)\*\*(\w*)/g,'<b>$1$2</b>'),sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const CFG=window.BETMA_CONFIG||{},UK='betma_vl_users',CK='betma_vl_cur',PK='betma_vl_pending';let KEY='',U=null,S={};
const jget=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const blank=()=>({learned:{},flag:{},mem:{},wrong:{},pos:{},tests:{},last:null});let users=jget(UK,[]);S=blank();
function useUser(u){U=u;KEY='betma_vl_v1:'+u.id;S=Object.assign(blank(),jget(KEY,{}));LV=null;TEST=null;RQ=null;try{localStorage.setItem(CK,u.id)}catch(e){}}
let flushing=false;async function flush(){if(!CFG.ENDPOINT||flushing)return;flushing=true;const rest=[];for(const r of jget(PK,[])){try{await fetch(CFG.ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(r)})}catch(e){rest.push(r)}}jset(PK,rest);flushing=false}
function sendReg(r){if(!CFG.ENDPOINT)return;const q=jget(PK,[]);q.push(r);jset(PK,q);flush()}
function renderWho(){$('#who').innerHTML=U?`<span>👤 ${esc(U.name)}</span><button class="btn sm" data-sw="1">Đổi người dùng</button>`:''}
const YEARS=['Sinh viên năm 1','Sinh viên năm 2','Sinh viên năm 3','Sinh viên năm 4','Sinh viên năm 5 trở lên','Không phải sinh viên'];
function gate(){const ex=users.length?`<div class="c w mt"><h2>Tiếp tục trên thiết bị này</h2><div class="row">${users.map(u=>`<button class="btn" data-u="${u.id}">👤 ${esc(u.name)}</button>`).join('')}</div></div>`:'';
view(`<section class="hero"><div class="tag">Beginner to Master</div><h1 tabindex="-1">Đăng ký để bắt đầu học</h1><p>Điền thông tin để lưu tiến độ học từ vựng TOEIC cùng BETMA ENGLISH.</p></section>${ex}
<form id="rg" class="c w mt" novalidate><h2>${users.length?'Đăng ký người dùng mới':'Thông tin của bạn'}</h2>
<div class="fld"><label for="f1">Họ và tên</label><input id="f1" autocomplete="name" required><div class="er" id="e1" role="alert"></div></div>
<div class="fld"><label for="f2">Số điện thoại</label><input id="f2" type="tel" inputmode="tel" autocomplete="tel" placeholder="0901234567" required><div class="er" id="e2" role="alert"></div></div>
<div class="fld"><label for="f3">Email</label><input id="f3" type="email" autocomplete="email" required><div class="er" id="e3" role="alert"></div></div>
<div class="fld"><label for="f4">Bạn là sinh viên năm mấy?</label><select id="f4" required><option value="">Chọn…</option>${YEARS.map(y=>`<option>${y}</option>`).join('')}</select><div class="er" id="e4" role="alert"></div></div>
<input id="f5" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp">
<label class="chk"><input type="checkbox" id="f6"> <span>Tôi đồng ý để BETMA ENGLISH lưu họ tên, số điện thoại, email và năm học của tôi để hỗ trợ học tập và liên hệ.</span></label><div class="er" id="e6" role="alert"></div>
<button class="btn p mt" id="sb" type="submit">Bắt đầu học</button>
${CFG.ENDPOINT?'':'<p class="note mt">Chế độ thử nghiệm: thông tin chỉ được lưu trên thiết bị này, chưa gửi về Google Sheet.</p>'}</form>`);
$('#rg').onsubmit=e=>{e.preventDefault();const v=i=>$('#f'+i).value.trim(),name=v(1).replace(/\s+/g,' '),phone=v(2).replace(/[\s.\-()]/g,''),email=v(3),year=v(4),er={};
if(name.length<2||/[0-9@]/.test(name))er[1]='Vui lòng nhập họ và tên.';
if(!/^(0|\+?84)\d{9}$/.test(phone))er[2]='Số điện thoại chưa đúng (ví dụ 0901234567).';
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))er[3]='Email chưa đúng định dạng.';
if(!year)er[4]='Vui lòng chọn năm học.';if(!$('#f6').checked)er[6]='Bạn cần đồng ý để tiếp tục.';
[1,2,3,4,6].forEach(i=>$('#e'+i).textContent=er[i]||'');const bad=[1,2,3,4,6].find(i=>er[i]);if(bad){$(bad===6?'#f6':'#f'+bad).focus();return}
if($('#f5').value)return;
const old=users.find(x=>x.phone===phone);if(old){useUser(old);toast('Chào mừng bạn quay lại!');go2();return}
const u={id:'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,phone,email,year,ts:new Date().toISOString()};
if(!users.length){const o=localStorage.getItem('betma_vl_v1');if(o)try{localStorage.setItem('betma_vl_v1:'+u.id,o)}catch(x){}}
users.push(u);jset(UK,users);sendReg({...u,source:location.host});useUser(u);toast('Đăng ký thành công. Chúc bạn học tốt!');go2()}}
function go2(){if(location.hash==='#/'||!location.hash)router();else location.hash='#/'}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.className='show';clearTimeout(toastT);toastT=setTimeout(()=>t.className='',3200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Không thể lưu tiến độ trên trình duyệt này. Bạn vẫn có thể tiếp tục học.')}}
function ask(m,ok){return new Promise(r=>{const d=$('#dlg');d.querySelector('p').textContent=m;d.querySelector('.ok').textContent=ok||'OK';d.onclose=()=>r(d.returnValue==='ok');d.showModal()})}
const cnt=t=>TW[t].filter(w=>S.learned[w.id]).length,total=()=>W.filter(w=>S.learned[w.id]).length,best=t=>S.tests[t]?S.tests[t].best:null;
function status(t){const n=cnt(t);if(!n)return['Chưa bắt đầu','s0'];if(n>=TW[t].length&&best(t)>=80)return['Hoàn thành','s2'];return['Đang học','s1']}
const wst=w=>S.mem[w.id]?'Đã ghi nhớ':S.flag[w.id]?'Cần ôn tập':S.learned[w.id]?'Đã học':'Chưa học';
const pct=(a,b)=>Math.round(a/b*100),bar=p=>`<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;
/* speech */
let voice;function pv(){try{const v=speechSynthesis.getVoices();const us=v.filter(x=>/^en[-_]US/i.test(x.lang));voice=us.find(x=>/Google|Natural|Aria|Jenny|Samantha|Ava/i.test(x.name))||us[0]||v.find(x=>/^en/i.test(x.lang))}catch(e){}}
if('speechSynthesis' in window){pv();speechSynthesis.onvoiceschanged=pv}
function speak(t,b){if(!('speechSynthesis' in window)){toast('Trình duyệt chưa hỗ trợ phát âm. Bạn vẫn có thể tiếp tục học.');return}
if(!voice)pv();const sp=speechSynthesis;sp.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.85;if(voice){u.voice=voice;u.lang=voice.lang}if(b)b.classList.add('on');u.onend=u.onerror=()=>b&&b.classList.remove('on');setTimeout(()=>{if(sp.paused)sp.resume();sp.speak(u)},60)}
const sayBtn=w=>`<button class="btn sm say" data-say="${esc(w.w)}" aria-label="Phát âm ${esc(w.w)}">🔊 Nghe</button>`;
/* distractors & cloze */
const ps=p=>p.replace(/\./g,'').split('/');
function pick(a,k){const A=ps(a.pos),ok=x=>x.id!==a.id&&x.w.toLowerCase()!==a.w.toLowerCase(),dj=x=>!ps(x.pos).some(p=>A.includes(p)),T1=TW[a.t].filter(ok),A1=W.filter(ok),out=[],seen=new Set([a.w.toLowerCase()]);
for(const list of [T1.filter(dj),A1.filter(dj),T1,A1])for(const x of sh(list)){if(out.length>=k)return out;if(!seen.has(x.w.toLowerCase())){seen.add(x.w.toLowerCase());out.push(x)}}return out}
function infl(w,s,cap){let r=w;if(s==='s')r=/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':/(s|x|ch|sh)$/.test(w)?w+'es':w+'s';else if(s)r=w+s;return cap?r[0].toUpperCase()+r.slice(1):r}
const plain=w=>{const m=w.en.match(/\*\*(.+?)\*\*(\w*)/);return m&&!m[2]&&m[1].toLowerCase()===w.w.toLowerCase()};
function mkTest(t){const qs=sh(TW[t].filter(plain)).slice(0,20).map(w=>{const m=w.en.match(/\*\*(.+?)\*\*(\w*)/),suf=m[2],cap=/^[A-Z]/.test(m[1]),opts=sh([w,...pick(w,3)]).map(x=>({id:x.id,t:infl(x.w,suf,cap)}));
return{id:w.id,txt:w.en.replace(/\*\*(.+?)\*\*(\w*)/,'______'),opts,ans:opts.findIndex(o=>o.id===w.id)}});return{t,qs,a:Array(qs.length).fill(-1),i:0,done:false}}
/* state */
let TEST=null,LV=null,RV={f:'learned',t:'all',q:''},RQ=null;
const L='ABCD';
function view(h){app.innerHTML=h}
/* dashboard */
function dash(){const n=total(),tt=W.length;let tgt=S.last&&tinfo(S.last)?S.last:(T.find(t=>cnt(t.id)<TW[t.id].length)||T[0]).id;const tn=tinfo(tgt),c=cnt(tgt),fl=Object.keys(S.flag).length,wr=Object.keys(S.wrong).length;
view(`<section class="hero"><div class="tag">Learn Smart. Remember More.</div><h1>Chinh phục từ vựng TOEIC 500+</h1><p>Học mỗi ngày một chút, tiến gần hơn đến mục tiêu TOEIC của bạn</p><a class="btn p" href="#/learn/${tgt}">${n?'Tiếp tục học':'Bắt đầu học'}</a></section>
<div class="stats"><div class="c stat"><b>${T.length}</b><span>Chủ đề</span></div><div class="c stat"><b>${tt}</b><span>Từ vựng</span></div><div class="c stat"><b>${n}</b><span>Từ đã học</span></div><div class="c stat"><b>${pct(n,tt)}%</b><span>Hoàn thành tổng thể</span></div></div>
${bar(pct(n,tt))}
<div class="grid mt"><div class="c w"><h3>Chủ đề gần nhất</h3>${n?`<p><b>${tn.name}</b><br><span class="muted">${c}/${TW[tgt].length} từ đã học</span></p><a class="btn" href="#/learn/${tgt}">Tiếp tục học</a>`:`<p class="muted">Bạn chưa bắt đầu học. Hãy chọn một chủ đề bên dưới hoặc nhấn “Bắt đầu học” để vào chủ đề đầu tiên.</p>`}</div>
<div class="c w"><h3>Ôn tập từ vựng</h3><p class="muted">${fl} từ cần ôn tập · ${wr} từ sai trong bài kiểm tra</p><a class="btn" href="#/review">Mở khu vực ôn tập</a></div></div>
<h2 class="mt">Các chủ đề</h2><div class="grid">${T.map(t=>{const c=cnt(t.id),[s,k]=status(t.id);return`<article class="c w"><div class="row" style="justify-content:space-between"><span class="badge ${k}">${s}</span><span class="muted small">${TW[t.id].length} từ</span></div><h3 class="mt">${t.name}</h3><p class="muted">${t.desc}</p>${bar(pct(c,TW[t.id].length))}<p class="small muted">${c}/${TW[t.id].length} từ · ${pct(c,TW[t.id].length)}%</p><div class="row"><a class="btn p" href="#/learn/${t.id}">${c?'Tiếp tục học':'Bắt đầu học'}</a><a class="btn" href="#/topic/${t.id}">Chi tiết</a></div></article>`}).join('')}</div>
<p class="note mt">Tiến độ được lưu trên trình duyệt của thiết bị này và không tự đồng bộ sang thiết bị khác. Xóa dữ liệu trình duyệt sẽ làm mất tiến độ.</p>`)}
/* topic page */
function topic(id){const t=tinfo(id),c=cnt(id),n=TW[id].length,[s,k]=status(id),ts=S.tests[id],ok=c>=n;
view(`<a href="#/">← Tất cả chủ đề</a><div class="row mt" style="justify-content:space-between"><div><h1 tabindex="-1">${t.name}</h1><p class="muted">${t.desc}</p></div><span class="badge ${k}">${s}</span></div>${bar(pct(c,n))}<p class="small muted">${c}/${n} từ đã học · ${pct(c,n)}%</p>
<div class="row"><a class="btn p" href="#/learn/${id}">${c?'Tiếp tục học':'Bắt đầu học'}</a>${ok?`<a class="btn" href="#/test/${id}">Làm bài kiểm tra</a>`:`<span class="btn" aria-disabled="true" role="link">🔒 Làm bài kiểm tra</span>`}<button class="btn" data-reset="${id}">Bắt đầu lại chủ đề</button></div>
${ok?'':`<p class="note mt">Bài kiểm tra sẽ mở khóa khi bạn học đủ ${n} từ của chủ đề này (còn ${n-c} từ).</p>`}
<div class="c w mt"><h3>Kết quả bài kiểm tra</h3>${ts?`<p>Điểm cao nhất: <b>${ts.best}/100</b> · ${ts.attempts.length} lần làm · Lần gần nhất: ${ts.attempts[ts.attempts.length-1].s}/100 ${ts.best>=80?'· <b>Đã đạt</b>':'· Chưa đạt (cần ≥ 80)'}</p>`:`<p class="muted">Chưa có kết quả. Đạt từ 80/100 để hoàn thành chủ đề.</p>`}</div>
<h2 class="mt">Danh sách từ</h2><div class="pills">${TW[id].map(w=>`<span class="pill ${S.mem[w.id]?'m':S.flag[w.id]?'f':S.learned[w.id]?'l':''}" title="${wst(w)}">${esc(w.w)}</span>`).join('')}</div><p class="small muted">Vàng: đã học · Xanh: đã ghi nhớ · Đỏ: cần ôn tập · Xám: chưa học</p>`)}
/* flashcards */
function learn(id){const ws=TW[id];if(!LV||LV.t!==id)LV={t:id,i:Math.min(S.pos[id]||0,ws.length-1),done:false};S.last=id;save();drawLearn()}
function drawLearn(){const id=LV.t,ws=TW[id],t=tinfo(id),n=ws.length;
if(LV.done){view(`<a href="#/topic/${id}">← ${t.name}</a><div class="c w mt" style="text-align:center"><div style="font-size:3rem">🎉</div><h1 tabindex="-1">Bạn đã học xong ${n} từ!</h1><p class="muted">Bài kiểm tra 20 câu của chủ đề “${t.name}” đã được mở khóa.</p><div class="row" style="justify-content:center"><a class="btn p" href="#/test/${id}">Làm bài kiểm tra</a><button class="btn" id="again">Học lại từ đầu</button><a class="btn" href="#/topic/${id}">Về chủ đề</a></div></div>`);$('#again').onclick=()=>{LV.i=0;LV.done=false;S.pos[id]=0;save();drawLearn()};return}
const w=ws[LV.i],p=pct(cnt(id),n);
view(`<a href="#/topic/${id}">← ${t.name}</a><h1 tabindex="-1" class="mt" style="font-size:1.2rem">${t.name}</h1><div class="row small muted" style="justify-content:space-between"><span>Đã học ${cnt(id)}/${n}</span><span>${wst(w)}</span></div>${bar(p)}
<div class="wrap"><div class="card" id="fc"><div class="face front" id="ff"><div class="cnt">${LV.i+1}/${n}</div><div class="w1">${esc(w.w)}</div><div class="pos">(${esc(w.pos)})</div><div class="ipa">${esc(w.ipa)}</div><div><button class="btn sm say" data-say="${esc(w.w)}" aria-label="Phát âm ${esc(w.w)}">🔊 Phát âm</button></div><p class="ex">${fmt(w.en)}</p><div class="hint">Nhấn để xem nghĩa tiếng Việt</div></div>
<div class="face back" id="fb" aria-hidden="true"><div class="cnt">${LV.i+1}/${n}</div><div><b class="w1" style="font-size:1.6rem">${esc(w.w)}</b> <span class="pos">(${esc(w.pos)})</span></div><div class="mean">${esc(w.vi)}</div><div><span class="chip">Ghi nhớ: ${esc(w.w)}</span></div><p class="ex">${fmt(w.en)}</p><p class="muted"><b>Dịch câu:</b> ${esc(w.ev)}</p></div></div></div>
<div class="ctl"><button class="btn" id="pv" ${LV.i?'':'disabled'}>← Từ trước</button><button class="btn" id="fl">↻ Lật thẻ</button><button class="btn say" data-say="${esc(w.w)}">🔊 Phát âm</button><button class="btn p" id="nx">${LV.i<n-1?'Từ tiếp theo →':'Hoàn thành →'}</button></div>
<div class="ctl mt"><button class="btn sm ${S.flag[w.id]?'on':''}" id="fg" aria-pressed="${!!S.flag[w.id]}">⚑ ${S.flag[w.id]?'Đang cần ôn tập':'Đánh dấu cần ôn tập'}</button><button class="btn sm ${S.mem[w.id]?'on':''}" id="mm" aria-pressed="${!!S.mem[w.id]}">✓ ${S.mem[w.id]?'Đã ghi nhớ':'Đánh dấu đã nhớ'}</button></div><p class="small muted" style="text-align:center">Phím tắt: ← → chuyển từ · Phím cách: lật thẻ</p>`);
$('#fc').onclick=e=>{if(!e.target.closest('button'))flip()};$('#fl').onclick=flip;$('#pv').onclick=()=>go(-1);$('#nx').onclick=()=>go(1);
$('#fg').onclick=()=>{S.flag[w.id]?delete S.flag[w.id]:(S.flag[w.id]=1,delete S.mem[w.id]);save();keep()};
$('#mm').onclick=()=>{S.mem[w.id]?delete S.mem[w.id]:(S.mem[w.id]=1,S.learned[w.id]=1,delete S.flag[w.id]);save();keep()}}
function keep(){const f=$('#fc').classList.contains('fl');drawLearn();if(f)flip(true)}
function flip(x){const c=$('#fc');if(!c)return;const on=x===true?true:!c.classList.contains('fl');c.classList.toggle('fl',on);$('#ff').setAttribute('aria-hidden',on);$('#fb').setAttribute('aria-hidden',!on)}
function go(d){if(!LV||LV.done)return;const id=LV.t,n=TW[id].length;if(d>0){S.learned[TW[id][LV.i].id]=1;if(LV.i<n-1){LV.i++;S.pos[id]=LV.i}else{S.pos[id]=n-1;if(cnt(id)>=n){LV.done=true;toast('Chúc mừng! Bạn đã hoàn thành chủ đề.')}else{toast('Bạn chưa học đủ các từ. Hãy quay lại các từ trước.');}}}else if(LV.i>0){LV.i--;S.pos[id]=LV.i}save();drawLearn()}
/* test */
function test(id){const n=TW[id].length;if(cnt(id)<n){view(`<a href="#/topic/${id}">← ${tinfo(id).name}</a><div class="c w mt"><h1 tabindex="-1">🔒 Bài kiểm tra đang khóa</h1><p>Bạn cần học đủ ${n} flashcard của chủ đề này để mở khóa bài kiểm tra. Hiện còn <b>${n-cnt(id)}</b> từ.</p><a class="btn p" href="#/learn/${id}">Tiếp tục học</a></div>`);return}
if(!TEST||TEST.t!==id)TEST=mkTest(id);drawTest()}
function drawTest(){const X=TEST,id=X.t;if(X.done)return result();const q=X.qs[X.i],ans=X.a.filter(v=>v>=0).length;
view(`<a href="#/topic/${id}">← ${tinfo(id).name}</a><h1 tabindex="-1" class="mt" style="font-size:1.2rem">Kiểm tra: ${tinfo(id).name}</h1><div class="row small muted" style="justify-content:space-between"><span>Câu ${X.i+1}/${X.qs.length}</span><span>Đã trả lời ${ans}/${X.qs.length}</span></div>${bar(pct(ans,X.qs.length))}
<p class="q">${esc(q.txt)}</p><div role="group" aria-label="Đáp án">${q.opts.map((o,k)=>`<button class="opt ${X.a[X.i]===k?'sel':''}" data-o="${k}" aria-pressed="${X.a[X.i]===k}"><b>${L[k]}.</b> ${esc(o.t)}</button>`).join('')}</div>
<div class="dots">${X.qs.map((_,k)=>`<button data-q="${k}" class="${X.a[k]>=0?'a':''} ${k===X.i?'cur':''}" aria-label="Câu ${k+1}${X.a[k]>=0?' đã trả lời':''}">${k+1}</button>`).join('')}</div>
<div class="row"><button class="btn" id="tp" ${X.i?'':'disabled'}>← Câu trước</button><button class="btn" id="tn" ${X.i<X.qs.length-1?'':'disabled'}>Câu sau →</button><span style="flex:1"></span><button class="btn p" id="ts">Nộp bài</button></div>`);
$('#tp').onclick=()=>{X.i--;drawTest()};$('#tn').onclick=()=>{X.i++;drawTest()};
$('#ts').onclick=async()=>{const u=X.qs.length-ans;if(await ask(u?`Bạn còn ${u} câu chưa trả lời (tính là sai). Vẫn nộp bài?`:'Bạn chắc chắn muốn nộp bài?','Nộp bài')){submit()}}}
function submit(){const X=TEST,id=X.t;let c=0;X.qs.forEach((q,k)=>{if(X.a[k]===q.ans){c++;delete S.wrong[q.id]}else S.wrong[q.id]=1});const s=Math.round(c/X.qs.length*100),o=S.tests[id]||{best:0,attempts:[]};o.attempts.push({s,c,at:Date.now()});o.best=Math.max(o.best,s);S.tests[id]=o;X.done=true;X.c=c;X.s=s;save();drawTest()}
function result(){const X=TEST,id=X.t,n=X.qs.length,ok=X.s>=80;
view(`<a href="#/topic/${id}" data-clear>← ${tinfo(id).name}</a><div class="c w mt" style="text-align:center"><h1 tabindex="-1">Kết quả bài kiểm tra</h1><div class="score">${X.s}<small style="font-size:1.2rem">/100</small></div><p>${ok?'🎉 <b>Đạt</b> — bạn đã hoàn thành bài kiểm tra của chủ đề này.':'Chưa đạt. Bạn cần từ 80/100 để hoàn thành. Hãy ôn lại và thử lại nhé!'}</p><p class="muted">Đúng: <b>${X.c}</b> · Sai: <b>${n-X.c}</b> · Tỷ lệ chính xác: <b>${pct(X.c,n)}%</b></p>
<div class="row" style="justify-content:center"><button class="btn p" id="rt">Làm lại bài kiểm tra</button>${X.c<n?`<a class="btn" href="#/review?f=wrong&t=${id}">Ôn tập câu sai</a>`:''}<a class="btn" href="#/topic/${id}">Quay về chủ đề</a></div></div>
<h2 class="mt">Đáp án và giải thích</h2>${X.qs.map((q,k)=>{const w=byId[q.id],g=X.a[k],right=g===q.ans,others=q.opts.filter((o,j)=>j!==q.ans).map(o=>`${esc(o.t)} = ${esc(byId[o.id].vi)}`).join('; ');
return`<div class="c w res ${right?'ok':'no'}"><p class="small muted">Câu ${k+1} · ${right?'✓ Đúng':g<0?'✗ Chưa trả lời':'✗ Sai'}</p><p class="ex">${fmt(w.en)}</p><p class="muted small">${esc(w.ev)}</p>${right?'':`<p class="small">${g<0?'Bạn chưa chọn đáp án.':`Bạn chọn: <b>${L[g]}. ${esc(q.opts[g].t)}</b>`}</p>`}<p class="small">Đáp án đúng: <b>${L[q.ans]}. ${esc(q.opts[q.ans].t)}</b></p><p class="small"><b>${esc(w.w)}</b> (${esc(w.pos)}) ${esc(w.ipa)}: ${esc(w.vi)}.<br><span class="muted">Các lựa chọn khác: ${others}.</span></p></div>`}).join('')}`);
$('#rt').onclick=()=>{TEST=mkTest(id);drawTest();scrollTo(0,0)}}
/* review */
function rvList(){const f=RV.f,q=RV.q.trim().toLowerCase();const src={learned:S.learned,flag:S.flag,wrong:S.wrong,mem:S.mem}[f];
return W.filter(w=>src[w.id]&&(RV.t==='all'||w.t===RV.t)&&(!q||w.w.toLowerCase().includes(q)||w.vi.toLowerCase().includes(q)))}
function review(qs){const p=new URLSearchParams(qs||'');if(p.get('f'))RV.f=p.get('f');if(p.get('t'))RV.t=p.get('t');RQ=null;
view(`<h1 tabindex="-1">Ôn tập từ vựng</h1><div class="row"><select id="rf" aria-label="Loại từ">${[['learned','Đã học'],['flag','Cần ôn tập'],['wrong','Sai trong bài kiểm tra'],['mem','Đã ghi nhớ']].map(([v,l])=>`<option value="${v}" ${RV.f===v?'selected':''}>${l} (${Object.keys(S[v==='flag'?'flag':v]).filter(i=>byId[i]).length})</option>`).join('')}</select><select id="rt2" aria-label="Chủ đề"><option value="all">Tất cả chủ đề</option>${T.map(t=>`<option value="${t.id}" ${RV.t===t.id?'selected':''}>${t.name}</option>`).join('')}</select><input id="rs" type="search" placeholder="Tìm từ hoặc nghĩa…" value="${esc(RV.q)}" aria-label="Tìm kiếm"></div><div id="rl" class="mt"></div>`);
$('#rf').onchange=e=>{RV.f=e.target.value;rl()};$('#rt2').onchange=e=>{RV.t=e.target.value;rl()};$('#rs').oninput=e=>{RV.q=e.target.value;rl()};rl()}
function rl(){const l=rvList(),el=$('#rl');RQ=null;
el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="muted">${l.length} từ</span>${l.length?`<button class="btn p sm" id="qq">⚡ Kiểm tra nhanh (${Math.min(10,l.length)} từ)</button>`:''}</div>`+(l.length?l.map(w=>`<details data-id="${w.id}"><summary><b>${esc(w.w)}</b><span class="muted">${esc(w.ipa)} (${esc(w.pos)})</span><span class="sp"></span><span class="badge">${wst(w)}</span><button class="btn sm say" data-say="${esc(w.w)}" aria-label="Phát âm ${esc(w.w)}">🔊</button></summary><p><b>${esc(w.vi)}</b></p><p class="ex">${fmt(w.en)}</p><p class="muted small">${esc(w.ev)}</p><div class="row"><button class="btn sm ${S.flag[w.id]?'on':''}" data-fg="${w.id}">${S.flag[w.id]?'Bỏ đánh dấu cần ôn':'Đánh dấu cần ôn'}</button><button class="btn sm ${S.mem[w.id]?'on':''}" data-mm="${w.id}">${S.mem[w.id]?'Bỏ đã nhớ':'Đã nhớ'}</button>${S.wrong[w.id]?`<button class="btn sm" data-wr="${w.id}">Xóa khỏi danh sách sai</button>`:''}</div></details>`).join(''):`<div class="c w"><p class="muted">Chưa có từ nào trong danh sách này. ${RV.f==='learned'?'Hãy bắt đầu học một chủ đề để từ vựng xuất hiện ở đây.':'Từ sẽ xuất hiện khi bạn đánh dấu hoặc làm bài kiểm tra.'}</p></div>`);
const q=$('#qq');if(q)q.onclick=()=>{const ids=sh(l).slice(0,10).map(w=>w.id);RQ={ids,i:0,s:0,sel:-1};drawRQ()}}
function drawRQ(){const el=$('#rl'),R=RQ;if(R.i>=R.ids.length){el.innerHTML=`<div class="c w" style="text-align:center"><h2>Kết quả: ${R.s}/${R.ids.length}</h2><p class="muted">Từ trả lời đúng được đánh dấu “đã ghi nhớ”, từ sai được đưa vào “cần ôn tập”.</p><button class="btn p" id="rb">Quay lại danh sách</button></div>`;$('#rb').onclick=()=>review();return}
const w=byId[R.ids[R.i]];if(!R.o)R.o=sh([w,...pick(w,3)]);
el.innerHTML=`<div class="c w"><p class="small muted">Câu ${R.i+1}/${R.ids.length} · Chọn từ tiếng Anh phù hợp với nghĩa</p>${bar(pct(R.i,R.ids.length))}<p class="mean mt">${esc(w.vi)} <span class="pos small">(${esc(w.pos)})</span></p>${R.o.map((o,k)=>`<button class="opt ${R.sel<0?'':o.id===w.id?'ok':k===R.sel?'no':''}" data-rq="${k}" ${R.sel>=0?'disabled':''}><b>${L[k]}.</b> ${esc(o.w)}</button>`).join('')}${R.sel>=0?`<p class="ex">${fmt(w.en)}</p><button class="btn p" id="rn">${R.i<R.ids.length-1?'Câu tiếp →':'Xem kết quả'}</button>`:''}</div>`;
const nb=$('#rn');if(nb)nb.onclick=()=>{R.i++;R.sel=-1;R.o=null;drawRQ()}}
/* events */
document.addEventListener('click',async e=>{const t=e.target.closest('button,a');if(!t)return;
if(t.dataset.u){const u=users.find(x=>x.id===t.dataset.u);if(u){useUser(u);go2()}return}
if(t.dataset.sw){U=null;try{localStorage.removeItem(CK)}catch(x){}location.hash='#/';router();return}
if(t.dataset.say){e.preventDefault();e.stopPropagation();speak(t.dataset.say,t);return}
if(t.dataset.reset){const id=t.dataset.reset;if(await ask(`Xóa toàn bộ tiến độ, trạng thái từ và kết quả kiểm tra của chủ đề “${tinfo(id).name}” để học lại từ đầu?`,'Xóa và bắt đầu lại')){TW[id].forEach(w=>{delete S.learned[w.id];delete S.flag[w.id];delete S.mem[w.id];delete S.wrong[w.id]});delete S.pos[id];delete S.tests[id];LV=null;TEST=null;save();toast('Đã đặt lại chủ đề.');router()}return}
if(t.dataset.fg){S.flag[t.dataset.fg]?delete S.flag[t.dataset.fg]:(S.flag[t.dataset.fg]=1,delete S.mem[t.dataset.fg]);save();keepOpen(t)}
if(t.dataset.mm){const i=t.dataset.mm;S.mem[i]?delete S.mem[i]:(S.mem[i]=1,delete S.flag[i]);save();keepOpen(t)}
if(t.dataset.wr){delete S.wrong[t.dataset.wr];save();keepOpen(t)}
if(t.dataset.o!==undefined&&TEST){TEST.a[TEST.i]=+t.dataset.o;drawTest()}
if(t.dataset.q!==undefined&&TEST){TEST.i=+t.dataset.q;drawTest()}
if(t.dataset.rq!==undefined&&RQ&&RQ.sel<0){const R=RQ,w=byId[R.ids[R.i]],k=+t.dataset.rq;R.sel=k;if(R.o[k].id===w.id){R.s++;S.mem[w.id]=1;S.learned[w.id]=1;delete S.flag[w.id];delete S.wrong[w.id]}else{S.flag[w.id]=1;delete S.mem[w.id]}save();drawRQ()}});
function keepOpen(t){const d=t.closest('details'),id=d&&d.dataset.id,r=RV.f;const open=[...document.querySelectorAll('details[open]')].map(x=>x.dataset.id);rl();document.querySelectorAll('details').forEach(x=>{if(open.includes(x.dataset.id))x.open=true})}
document.addEventListener('keydown',e=>{if(!LV||LV.done||!location.hash.startsWith('#/learn/'))return;const a=document.activeElement;if(a&&/INPUT|SELECT|TEXTAREA/.test(a.tagName))return;
if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}else if(e.key===' '&&!(a&&/BUTTON|A|SUMMARY/.test(a.tagName))){e.preventDefault();flip()}});
/* router */
function router(){const h=location.hash.slice(1)||'/',[p,q]=h.split('?'),a=p.split('/').filter(Boolean),r=a[0]||'',id=a[1];
if('speechSynthesis' in window)speechSynthesis.cancel();
renderWho();if(!U){gate();document.title='Đăng ký · BETMA Vocabulary Lab';scrollTo(0,0);return}
if(r!=='test'&&TEST&&TEST.done)TEST=null;if(r!=='learn')LV=null;
$('#n1').removeAttribute('aria-current');$('#n2').removeAttribute('aria-current');(r==='review'?$('#n2'):$('#n1')).setAttribute('aria-current','page');
try{if(!r)dash();else if(r==='review')review(q);else if(tinfo(id)&&r==='topic')topic(id);else if(tinfo(id)&&r==='learn')learn(id);else if(tinfo(id)&&r==='test')test(id);else view(`<div class="err"><h1>Không tìm thấy trang</h1><p>Đường dẫn không hợp lệ.</p><a class="btn p" href="#/">Về trang chính</a></div>`)}
catch(e){console.error(e);view(`<div class="err"><h1>Đã có lỗi xảy ra</h1><p>Rất tiếc, trang này không tải được. Tiến độ của bạn vẫn được giữ nguyên.</p><a class="btn p" href="#/">Về trang chính</a></div>`)}
document.title=(r==='review'?'Ôn tập':tinfo(id)?tinfo(id).name:'Trang chủ')+' · BETMA Vocabulary Lab';scrollTo(0,0);const h1=app.querySelector('h1');if(h1&&r){h1.setAttribute('tabindex','-1');h1.focus({preventScroll:true})}}
{const u=users.find(x=>x.id===localStorage.getItem(CK));if(u)useUser(u)}flush();addEventListener('hashchange',router);router();
