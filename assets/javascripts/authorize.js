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

// 코깃코깃 서비스 로그인
function requestCogitLogin(code) {
  fetch(`https://cogit.kr/api/auth/regist?code=${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 여기에 추가: CORS 문제를 해결하기 위한 헤더
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  }).then((response) => {
    if (response.status !== 200) {
      console.error('유저 등록에 실패했습니다.');
      return;
    }
    // 읽기 함수 정의
    chrome.storage.local.set(
      {
        cogit: {
          Authorization: response.headers.get('Authorization'),
          RefreshToken: response.headers.get('RefreshToken'),
        },
      },
      () => {
        // 저장 되었는지 확인
        chrome.storage.local.get('cogit', (data) => {
          // 로컬스토리지에 cogit 데이터 등록
          localStorage.setItem('cogit', JSON.stringify(data.cogit)); //토큰
          console.log('코깃코깃 로그인 성공');

          response.json().then((res) => {
            localStorage.setItem('cogit_member', JSON.stringify(res.data)); //멤버 정보
          });
        });
      }
    );
  });
  chrome.storage.local.remove('pipe_cogit');
}

/* Check for open pipe */
if (window.location.host === 'cogit.kr' && window.location.href.includes('?code=')) {
  const link = window.location.href;
  chrome.storage.local.get('pipe_cogit', (data) => {
    if (data && data.pipe_cogit) {
      const code = parseAccessCode(link);
      if (code != null) {
        requestCogitLogin(code);
      }
    }
  });
}

function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('cogit', function (result) {
      const cogitData = result.cogit;

      if (!cogitData || !cogitData.RefreshToken) {
        console.log('리프레시 토큰이 없습니다.');
        reject('리프레시 토큰이 없습니다.');
        return;
      }

      const refreshToken = cogitData.RefreshToken;

      fetch('https://cogit.kr/api/auth/refresh', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          RefreshToken: refreshToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('리프레시 토큰 요청에 실패했습니다.');
          }

          const newAuthorization = response.headers.get('Authorization');

          chrome.storage.local.set(
            {
              cogit: {
                ...cogitData,
                Authorization: newAuthorization,
              },
            },
            () => {
              // 저장되었는지 확인
              chrome.storage.local.get('cogit', (data) => {
                // 로컬스토리지에 cogit 데이터 갱신
                localStorage.setItem('cogit', JSON.stringify(data.cogit));
                resolve(newAuthorization); // Promise에 새로운 토큰 반환
              });
            }
          );
        })
        .catch((error) => {
          // console.error(error);
          console.error('코깃코깃 로그인 실패');
          reject(error); // Promise 실패
        });
    });
  });
}
