class GitHub {
  constructor(hook, token) {
    console.log('GitHub constructor', hook, token);
    this.update(hook, token);
  }

  update(hook, token) {
    this.hook = hook;
    this.token = token;
  }

  async getReference() {
    // hook, token, branch
    return getReference(this.hook, this.token);
  }

  async createBlob(content, path) {
    // hook, token, content, path
    return createBlob(this.hook, this.token, content, path);
  }

  async createTree(refSHA, tree_items) {
    // hook, token, baseSHA, tree_items
    console.log(
      'GitHub createTree',
      'refSHA:',
      refSHA,
      'tree_items:',
      tree_items
    );
    return createTree(this.hook, this.token, refSHA, tree_items);
  }

  async createCommit(message, treeSHA, refSHA) {
    // hook, token, message, tree, parent
    console.log(
      'GitHub createCommit',
      'message:',
      message,
      'treeSHA:',
      treeSHA,
      'refSHA:',
      refSHA
    );
    return createCommit(this.hook, this.token, message, treeSHA, refSHA);
  }

  async updateHead(ref, commitSHA) {
    // hook, token, commitSHA, force = true)
    console.log('GitHub updateHead', 'ref:', ref, 'commitSHA:', commitSHA);
    return updateHead(this.hook, this.token, ref, commitSHA, true);
  }
}

/**
 * repo reference 요청 함수
 * @param {String} hook - userName/repoName
 * @param {String} token - github accessToken
 */
async function getReference(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}/git/refs/heads/main`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return { refSHA: data.object.sha, ref: data.ref };
    });
}

/**
 * 업로드할 파일 blob 생성
 * @param {String} hook - userName/userRepo
 * @param {String} token - github accessToken
 * @param {String} content - 파일 내용
 * @param {String} path - 업로드할 경로
 * @returns
 */
async function createBlob(hook, token, content, path) {
  return fetch(`https://api.github.com/repos/${hook}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({
      content: b64EncodeUnicode(content),
      encoding: 'base64',
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return { path, sha: data.sha, mode: '100644', type: 'blob' };
    });
}

/**
 * 파일 tree sha 생성
 * @param {String} hook
 * @param {String} token
 * @param {String} refSHA - 업로드할 repo의 reference sha
 * @param {String} tree_items - 업로드할 파일의 정보를 담은 배열
 * @returns
 */
async function createTree(hook, token, refSHA, tree_items) {
  console.log(refSHA, tree_items);
  console.log(token);
  return fetch(`https://api.github.com/repos/${hook}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ tree: tree_items, base_tree: refSHA }),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}

/**
 * git 커밋 생성
 * @param {*} hook
 * @param {*} token
 * @param {*} message - 커밋 메시지
 * @param {*} treeSHA
 * @param {*} refSHA
 * @returns
 */
async function createCommit(hook, token, message, treeSHA, refSHA) {
  return fetch(`https://api.github.com/repos/${hook}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSHA, parents: [refSHA] }),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}

/**
 * 커밋 후 푸시 (head 업데이트)
 * @param {*} hook
 * @param {*} token
 * @param {*} ref
 * @param {*} commitSHA
 * @param {*} force
 * @returns
 */
async function updateHead(hook, token, ref, commitSHA, force = true) {
  return fetch(`https://api.github.com/repos/${hook}/git/${ref}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSHA, force }),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}
