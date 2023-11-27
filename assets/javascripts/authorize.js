const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const CLIENT_ID = '8f0485d786b3f5eba00e';
const GITHUB_CLIENT_SECRET = '45ef1ad0380204292293bacc888173c17d039ad5';

// url 인가코드 파싱
function parseAccessCode(url) {
  if (url.match(/\?error=(.+)/)) {
    // TODO: 오류 알림을 띄우고 창을 닫아야함
    return null;
  } else {
    // eslint-disable-next-line
    const accessCode = url.match(/\?code=([\w\/\-]+)/);
    if (accessCode) {
      return accessCode[1];
    }
  }
}

function getAccessToken(code) {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    }),
  })
    .then((response) => {
      response.json().then((data) => {
        const accessToken = data.access_token;
        chrome.storage.local.set({ cogit_token: accessToken });
        // chrome.storage.local.get(['cogit_token'],(data) => {
        //   console.log(data.cogit_token);  
        // })
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
/* Check for open pipe */
if (window.location.host === 'github.com' && window.location.href.includes('?code=')) {
  const link = window.location.href;
  // pipe_cogit 정보가 있으면 (현재 로그인 중이면)
  chrome.storage.local.get('pipe_cogit', (data) => {
    if (data && data.pipe_cogit) {
      const code = parseAccessCode(link);
      if (code != null) {
        // 인가코드를 통해, git api 요청(엑세스토큰)
        getAccessToken(code);
      }
    }
  });
}
