const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const out = __dirname;
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
const css = fs.readFileSync(path.join(__dirname, 'style-source.css'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'chart-source.css'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, 'app-source.js'), 'utf8').replace('/* QUESTION_DATA */ []', JSON.stringify(questions));
const hash = text => crypto.createHash('sha256').update(text).digest('base64');
const policy = `default-src 'none'; script-src 'sha256-${hash(app)}'; style-src 'sha256-${hash(css)}'; connect-src 'none'; img-src data:; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta name="color-scheme" content="light"><meta name="description" content="Trắc nghiệm DISC 28 câu với biểu đồ D-I-S-C. Tính kết quả ngay trong trình duyệt, không cần họ tên hay email."><meta name="theme-color" content="#255747"><title>DISC riêng tư — Khám phá xu hướng của bạn</title><style>${css}</style></head>
<body><header class="site-header"><div class="brand"><span class="brand-mark" aria-hidden="true">d.</span><span><b>DISC</b><small>RIÊNG TƯ</small></span></div><span class="privacy-badge"><span aria-hidden="true">●</span> Chạy trên máy của bạn</span></header>
<main id="app" tabindex="-1"></main>
<footer class="site-footer"><span>28 câu hỏi · 4 xu hướng hành vi · Một khoảng lặng cho bản thân.</span><span>Không tài khoản. Không gửi câu trả lời.</span></footer>
<dialog id="reset-dialog" aria-labelledby="reset-title"><h2 id="reset-title">Xóa bài làm này?</h2><p>Câu trả lời và kết quả đang mở sẽ được xóa. Bạn có thể bắt đầu một bài mới ngay sau đó.</p><div class="dialog-actions"><button id="reset-cancel" class="button secondary">Giữ lại</button><button id="reset-confirm" class="button danger">Xóa và bắt đầu lại</button></div></dialog>
<noscript><div class="noscript">Cần bật JavaScript để tính kết quả ngay trên máy. Trang không cần kết nối Internet.</div></noscript><script>${app}</script></body></html>`;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'questions.json'), JSON.stringify(questions, null, 2) + '\n');
console.log("Built offline index.html");
