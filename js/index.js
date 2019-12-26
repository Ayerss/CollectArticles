const KEY = '__bookConf';

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

function domTest() {
  const self = this;
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      api: 'actDom',
      dom: document.getElementById(self.getAttribute('aria-describedby')).value
    });
  });
}


function saveConf() {
  chrome.storage.local.set({
    [KEY]: [
      document.getElementById('titleDom').value,
      document.getElementById('conDom').value,
      document.getElementById('nextDom').value,
    ]
  });
}

function clearConf () {
  chrome.storage.local.set({
    [KEY]: Array(3).fill('')
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('get2next').addEventListener('click', getToNext, false);
  document.getElementById('clear').addEventListener('click', clearStorage, false);
  
  document.querySelectorAll('.badge').forEach(dom => {
    dom.addEventListener('click', domTest, false);
  });
  
  document.getElementById('saveConf').addEventListener('click', saveConf, false);
  document.getElementById('clearConf').addEventListener('click', clearConf, false);
  
  chrome.storage.local.get(KEY, function(res) {
    const val = res[KEY] || Array(3).fill('');
    document.getElementById('titleDom').value = val[0];
    document.getElementById('conDom').value = val[1];
    document.getElementById('nextDom').value = val[2];
  });
  
}, false);
