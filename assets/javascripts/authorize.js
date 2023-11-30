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

/* 깃허브 엑세스 토큰 발급 */
function getAccessToken(code) {
  console.log('토큰');
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
      if (response.ok) {
        response.json().then((data) => {
          const accessToken = data.access_token;
          chrome.storage.local.set({ cogit_token: accessToken });
          getUserInfo(accessToken);
        });
        window.close();
      } else {
        throw new Error('토큰을 요청하지 못했습니다.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/* user 정보 가지고 오기*/
function getUserInfo(accessToken) {
  console.log('user id');
  fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const gitHubId = data.login;
          chrome.storage.local.set({ cogit_id: gitHubId });
          chrome.storage.local.get('cogit_id').then((result) => {});
        });
      } else {
        throw new Error('사용자 정보를 가져오지 못하였습니다.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/* Check for open pipe */
if (
  window.location.host === 'github.com' &&
  window.location.href.includes('?code=')
) {
  const link = window.location.href;
  // pipe_cogit 정보가 있으면 (현재 로그인 중이면)
  chrome.storage.local.get('pipe_cogit', (data) => {
    if (data && data.pipe_cogit) {
      const code = parseAccessCode(link);
      if (code != null) {
        // 인가코드를 통해, git api 요청(엑세스토큰)
        getAccessToken(code);
        chrome.storage.local.set({ pipe_cogit: false });
      }
    }
  });
}
