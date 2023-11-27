const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const CLIENT_ID = '8f0485d786b3f5eba00e';
const GITHUB_CLIENT_SECRET = '45ef1ad0380204292293bacc888173c17d039ad5';

// url 인가코드 파싱
function parseAccessCode(url) {
  console.log('인가코드 파싱하러 들어왔다?');
  if (url.match(/\?error=(.+)/)) {
    // TODO: 오류 알림을 띄우고 창을 닫아야함
    return null;
  } else {
    console.log('인가코드가 있다?');
    // eslint-disable-next-line
    const accessCode = url.match(/\?code=([\w\/\-]+)/);
    if (accessCode) {
      return accessCode[1];
    }
  }
}


function getAccessToken(code) {
  console.log('엑세스 코드 가지러 간다');
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: {
      client_id: CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code  
    }
  })
    .then((response) => {
      console.log(response);
    })
    // .then(response => response.json())
    // .then(data => {
      
    //   const accessToken = data.access_token
    //   console.log('Access Token:', accessToken);
    // })
    .catch(error => {
      console.error('Error:', error);
    })

}
/* Check for open pipe */
if (
  window.location.host === 'github.com' &&
  window.location.href.includes('?code=')
) {
  console.log('깃허브고 코드가 있다?');
  const link = window.location.href;
  // pipe_cogit 정보가 있으면 (현재 로그인 중이면)
  chrome.storage.local.get('pipe_cogit', (data) => {
    if (data && data.pipe_cogit) {
      console.log('pipe_cogit이 있다?');
      const code = parseAccessCode(link);
      if (code != null) {
        console.log('코드가 널이 아니다?');
        console.log(code);
        //requestCogitLogin(code);
        getAccessToken(code);

        //TODO: 인가코드를 통해, git api 요청(엑세스토큰)
      }
    }
  });
}
