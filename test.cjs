'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const test = require('node:test');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const nodes = new Map();
const context = {document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',addEventListener(){}});return nodes.get(id);}},setTimeout};
vm.createContext(context);
vm.runInContext(script.replace(/  render\(\);\s*\}\)\(\);\s*$/,'  globalThis.testAPI={QUESTIONS,score,complete,chartGeometry,profileSVG};\n  render();\n})();'),context);
const api=context.testAPI;
const allD=()=>Array.from({length:28},()=>({same:3,diff:2}));
test('28 questions, four unique choices and original data retained',()=>{
  assert.equal(api.QUESTIONS.length,28);
  for(const q of api.QUESTIONS){assert.equal(q.length,4);assert.equal(q.map(o=>o.weight).sort().join(''),'1234');}
  assert.equal(JSON.stringify(api.QUESTIONS),JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname,'questions.json'),'utf8'))));
});
test('Raw counts conserve totals and preserve negative scores',()=>{
  const result=api.score(allD());assert.equal(result.groups.D.net,28);assert.equal(result.groups.C.net,-28);
  assert.equal(Object.values(result.groups).reduce((s,g)=>s+g.same,0),28);
  assert.equal(Object.values(result.groups).reduce((s,g)=>s+g.diff,0),28);
  assert.equal(Object.values(result.groups).reduce((s,g)=>s+g.net,0),0);
});
test('Tied top groups are retained',()=>{
  const result=api.score(Array.from({length:28},(_,i)=>({same:i<14?3:4,diff:i<14?1:2})));
  assert.equal(result.leading.join(','),'D,I');
});
test('Balanced answers produce zero for every group',()=>{
  const result=api.score(Array.from({length:28},(_,i)=>({same:i%4+1,diff:(i+1)%4+1})));
  assert.equal(result.balanced,true);assert.equal(result.leading.join(','),'D,I,S,C');
});
test('Missing and contradictory answers cannot be scored',()=>{
  assert.throws(()=>api.score([]));
  for(const invalid of [{same:1,diff:1},{same:0,diff:2},{same:1,diff:5}]){const a=allD();a[4]=invalid;assert.throws(()=>api.score(a));assert.equal(api.complete(invalid),false);}
});
test('Net chart uses fixed -28..28 axis and exact endpoint coordinates',()=>{
  const g=api.chartGeometry(api.score(allD()).groups,'net');
  assert.equal(g.min,-28);assert.equal(g.max,28);assert.equal(g.zero,170);
  assert.equal(g.points.map(p=>p.key).join(','),'D,I,S,C');
  assert.equal(g.points.map(p=>p.value).join(','),'28,0,0,-28');
  assert.equal(g.points.map(p=>p.y).join(','),'40,170,170,300');
});
test('Small scores do not stretch chart axes',()=>{
  const groups=Object.fromEntries(['D','I','S','C'].map((key,i)=>[key,{net:[1,-1,0,0][i],same:7,diff:7}]));
  const g=api.chartGeometry(groups,'net');assert.equal(g.min,-28);assert.equal(g.max,28);
  assert.ok(g.points[0].y>160 && g.points[0].y<170);assert.ok(g.points[1].y>170 && g.points[1].y<180);
});
test('Same and diff charts both use fixed 0..28 axis',()=>{
  for(const mode of ['same','diff']){const g=api.chartGeometry(api.score(allD()).groups,mode);assert.equal(g.min,0);assert.equal(g.max,28);assert.equal(g.zero,300);assert.ok(g.points.every(p=>p.y>=40&&p.y<=300));}
});
test('SVG exposes four exact labeled data points and an accessible description',()=>{
  const svg=api.profileSVG(api.score(allD()).groups,'net');
  assert.equal((svg.match(/class="profile-point"/g)||[]).length,4);
  assert.ok(svg.includes('data-group="D" data-value="28"'));assert.ok(svg.includes('data-group="C" data-value="-28"'));
  assert.ok(svg.includes('<title id="line-title">'));assert.ok(svg.includes('<desc id="line-description">'));
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));assert.ok(svg.includes('chưa tương đương biểu đồ Vita Share'));
  assert.doesNotMatch(svg,/<script|<foreignObject|(?:src|href)\s*=/i);
  assert.ok(svg.includes('Chủ động &amp; quyết đoán'));
  assert.doesNotMatch(svg,/&(?!amp;|lt;|gt;|quot;|#39;)/);
  assert.ok(svg.includes('Thống kê thô · Chưa tương đương biểu đồ Vita Share</text>'));
});
test('Exact script/style CSP hashes and blocked connections are retained',()=>{
  const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  for(const [source,kind] of [[script,'script'],[css,'style']])assert.ok(csp.includes(`${kind}-src 'sha256-${crypto.createHash('sha256').update(source).digest('base64')}'`));
  for(const rule of ["default-src 'none'","connect-src 'none'","form-action 'none'","base-uri 'none'"])assert.ok(csp.includes(rule));
});
test('App has no network APIs, external resources, persistence or identity fields',()=>{
  assert.doesNotMatch(script,/\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|serviceWorker)\b|document\.cookie/);
  assert.doesNotMatch(html,/<(?:script|img|iframe|link|audio|video|source)\b[^>]*(?:src|href)\s*=/i);
  assert.doesNotMatch(html,/<form\b|type=["'](?:email|password|tel)["']/i);
  assert.doesNotMatch(html,/(?:src|href)=["'](?:https?:)?\/\//i);
});
test('Hosted privacy limitations and independent scoring remain disclosed',()=>{
  assert.ok(script.includes('nhà cung cấp hosting có thể ghi nhận IP'));
  assert.ok(script.includes('chưa tương đương biểu đồ chuẩn hóa của Vita Share'));
  assert.ok(html.includes('Không gửi câu trả lời.'));
});
