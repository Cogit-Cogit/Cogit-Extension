class GitHub {
  constructor(hook, token) {
    log('GitHub constructor', hook, token);
    this.update(hook, token);
  }

  update(hook, token) {
    this.hook = hook;
    this.token = token;
  }
  async createRepo(name, token, private) {
    return createRepo(name, token, private);
  }
}

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
      description: '코깃코깃 알고리즘 저장 레포지토리입니다.',
      private: private,
      auto_init: true,
    }),
    headers: {
      Authorization: `Bearer ${token}`, // Bearer or Token?
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  });
}
