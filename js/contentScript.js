const doc = document;
const KEY = '__book';
const EVALKEY = '__bookEval';
const KEYTOTAL = '__bookTotal';

function SingleChapter(titleDom, conDom) {
  let content = window.localStorage.getItem(KEY) || '';
  window.localStorage.setItem(KEY,
`
${content}
${titleDom ? doc.querySelector(titleDom).textContent : ''}
${conDom ? doc.querySelector(conDom).textContent : ''}
`);
}

function tapNextBtn(dom) {
  doc.querySelector(dom).click();
}

function applyDom(dom) {
  let dialog = document.createElement('div');
  dialog.innerHTML = `
    <strong onclick="this.parentNode.remove()">关闭</strong>
    <p style="font-size: 12px;margin-top: 20px">${doc.querySelector(dom).textContent}</p>
  `;
  
  dialog.setAttribute('style', `
    position:fixed;
    padding: 20px;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: #fff;
    overflow: auto;
    transform: translate(-50%, -50%);
    box-shadow: 5px 10px 15px 2px rgba(0,0,0,0.1);
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
  `);
  doc.body.append(dialog);
}

chrome.extension.onMessage.addListener(function(req, send, sendMsg) {
  if (req.api === 'getText') {
    window.localStorage.setItem(KEYTOTAL, req.total - 1);
    window.localStorage.setItem(EVALKEY,`
      SingleChapter('${req.titleDom}', '${req.conDom}');
      tapNextBtn('${req.nextDom}');
    `);
    SingleChapter(req.titleDom, req.conDom);
    tapNextBtn(req.nextDom);
    sendMsg();
  }
  else if (req.api === 'clear') {
    let a = document.createElement('a');
    a.download = req.name + '.txt';
    var blob = new Blob([window.localStorage.getItem(KEY)], {
      type: 'text/ms-txt'
    });
    a.href = window.URL.createObjectURL(blob);
    a.click();
    window.localStorage.removeItem(KEY);
  } else if (req.api === 'actDom') {
    applyDom(req.dom);
    sendMsg();
  }
});

window.onload = function () {
  let total = Number(window.localStorage.getItem(KEYTOTAL) || 0);
  if (total > 0) {
    window.localStorage.setItem(KEYTOTAL, total - 1);
    eval(window.localStorage.getItem(EVALKEY))
  } else {
    window.localStorage.removeItem(KEYTOTAL);
    window.localStorage.removeItem(EVALKEY);
  }
};

console.log('init book2txt');
