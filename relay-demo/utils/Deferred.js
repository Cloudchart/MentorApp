class Deferred {

  constructor() {
    this._settled = false;
    this._promise = new Promise((resolve, reject) => {
      this._resolve = (resolve: any);
      this._reject = (reject: any);
    });
  }

  getPromise() {
    return this._promise;
  }

  resolve(value) {
    this._settled = true;
    this._resolve(value);
  }

  reject(reason) {
    this._settled = true;
    this._reject(reason);
  }

  then() {
    return Promise.prototype.then.apply(this._promise, arguments);
  }

  done() {
    Promise.prototype.done.apply(this._promise, arguments);
  }

  isSettled() {
    return this._settled;
  }
}

export default Deferred
