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
        //requestCogitLogin(code);
        //TODO: 인가코드를 통해, git api 요청(엑세스토큰)
      }
    }
  });
}
