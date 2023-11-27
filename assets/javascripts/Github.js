class GitHub {
  constructor(hook, token) {
    log('GitHub constructor', hook, token);
    this.update(hook, token);
  }

  update(hook, token) {
    this.hook = hook;
    this.token = token;
  }
}
