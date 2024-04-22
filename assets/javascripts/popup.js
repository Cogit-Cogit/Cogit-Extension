const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const REDIRECT_URL = 'https://github.com'; // 변경 필요
const SCOPES = [
  'repo',
  'admin:repo_hook',
  'admin:org',
  'admin:public_key',
  'admin:org_hook',
  'user',
  'project',
];

document.addEventListener('DOMContentLoaded', function () {
  let imageLogo = document.getElementById('imageLogo');
  let text = document.querySelector('#active p');
  chrome.storage.local.get('active', function (result) {
    if (result.active) {
      if (result.active == 'active') {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activation';
        text.style.color = '#F79F5F';
      } else {
        imageLogo.src = './assets/images/pets_grey.png';
        text.textContent = 'deactivation';
        text.style.color = '#D9D9D9';
      }
    } else {
      chrome.storage.local.set({ active: 'active' }).then(() => {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activation';
        text.style.color = '#F79F5F';
      });
    }
  });

  const activeBtn = document.getElementById('active');

  activeBtn.addEventListener('click', function () {
    chrome.storage.local.get('active', function (result) {
      if (result.active == 'active') {
        imageLogo.src = './assets/images/pets_grey.png';
        text.textContent = 'deactivation';
        text.style.color = '#D9D9D9';
        chrome.storage.local.set({ active: 'deactive' });
      } else {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activation';
        text.style.color = '#F79F5F';
        chrome.storage.local.set({ active: 'active' });
      }
    });
  });

  function login() {
    let url = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=`;
    for (let i = 0; i < SCOPES.length; i++) {
      url += SCOPES[i] + ' ';
    }
    console.log('login');
    chrome.storage.local.set({ 'pipe_cogit': true }, () => {
      // opening pipe temporarily
      chrome.tabs.create({ url, selected: true }, function () {
        window.close();
      });
    });
  }

  const loginButton = document.getElementById('authenticate');
  loginButton.addEventListener('click', login);

  chrome.storage.local.get('cogit_id', function (data) {
    console.log(data.cogit_id);
    if (data.cogit_id) {
      // cogit 인증 데이터가 존재하면, 로그인 버튼 숨김
      var authModeElement = document.getElementById('auth_mode');
      if (authModeElement) {
        authModeElement.style.display = 'none';
        document.getElementById('cogitLink').style.display = 'block';
      }
    }
  });

  const cogitLink = document.getElementById('cogitLink');
  cogitLink.addEventListener('click', function () {
    chrome.storage.local.remove('cogit_token');
    chrome.storage.local.remove('cogit_id');
    window.close();
  });
});
