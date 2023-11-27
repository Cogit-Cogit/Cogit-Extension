/**
 * Github 레포지토리 생성 함수
 * @param {string} name - 생성할 레포 이름
 * @param {string} token - github access token
 * @param {string} private - 생성할 레포 private 여부
 */
async function createRepo(name, token, private) {
  return fetch(`https://api.github.com/user/repos`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      description: 'CogitCogit Repository',
      private: private, // 리포지토리를 비공개로 만들려면 true로 설정
      auto_init: true, // 레포지토리 초기화 스크립트를 사용하려면 true로 설정 (선택 사항)
    }),
    headers: {
      Authorization: `Bearer ${token}`, // Bearer or Token?
      Accept: 'application/vnd.github.v3+json',
      'Content-type': 'application/json',
    },
  }).then((res) => {
    console.log(res);
    return true;
  });
}

/**
 * Github 레포지토리 요청 함수
 * @param {string} name - 확인할 user repo
 * @param {string} token - github access token
 */
async function getRepo(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Bearer or Token?
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  }).then((res) => {
    console.log(res.status);
    if (res.status === 200) {
      console.log(res.status, 'asdasd');
      return true;
    } else {
      console.log(res.status, 'bbb');
      return false;
    }
  });
}

async function createHook() {
  chrome.storage.local.get('cogit_token').then(async (data) => {
    console.log(data.cogit_token);
    // TODO: user name 가져오기
    const user = '';
    const name = document.getElementById('name').value;
    console.log(name);
    // TODO: name이 영어로만 이루어져있는지 확인
    if (name === '') {
      return;
    }
    const token = data.cogit_token;
    const existRepo = await getRepo(`${user}/${name}`, token);
    if (existRepo) {
    } else {
      createRepo(name, token, true);
    }
  });
}

const hookButton = document.getElementById('hook_button');
hookButton.addEventListener('click', createHook);
