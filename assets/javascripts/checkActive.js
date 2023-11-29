function checkActive(callback) { //코깃 활성화 여부
  chrome.storage.local.get('active', function (result) {
    if (result.active && result.active == 'active') {
      callback(true);
    } else {
      callback(false);
    }
  });
}