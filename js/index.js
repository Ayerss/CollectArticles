
/*
function storage(obj) {
  return new Promise(function (resolve) {
    chrome.storage.local.get(KEY, function(res) {
      const bookCon = `
    ${res[KEY] || ''}
    ${obj.title}
    ${obj.con}
    `;
      chrome.storage.local.set({
        [KEY]: bookCon
      }, function() {
        resolve()
      });
    });
  })
}
*/

function getDomText () {
  return new Promise(function (resolve, reject) {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendMessage(tab.id, {
        api: 'getText',
        titleDom: document.getElementById('titleDom').value,
        conDom: document.getElementById('conDom').value,
        nextDom: document.getElementById('nextDom').value,
        total: document.getElementById('num').value
      }, function() {
        resolve();
      });
    });
  })
}

function getToNext() {
  getDomText().then(function () {
    console.log('end');
  })
}

function clearStorage() {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      api: 'clear',
      name: document.getElementById('bookName').value
    });
  });
}


document.addEventListener('DOMContentLoaded', function() {
  const get2next = document.getElementById('get2next');
  const clear = document.getElementById('clear');
  get2next.addEventListener('click', getToNext, false);
  clear.addEventListener('click', clearStorage, false);
}, false);
