import Url from "url";

class Http {
  constructor () {
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'api.producthunt.com'
    };

    this.body = {
      'client_id': '(API KEY)',
      'client_secret': '(API SECRET)',
      'grant_type': 'client_credentials'
    }
  }

  get (params) {
    let copyParams = { ...params };
    const data = copyParams && copyParams.data ? copyParams.data : {};
    const query = Url.format({ query: data });
    let url = `http://family.rambler.ru${copyParams.url}${query ? query : ''}`;

    return fetch(url, {
      method: "GET",
      headers: { ...this.headers },
      body: { ...this.body }
    }).then((response) => response.json());
  }

  post (params) {
    let copyParams = { ...params };
    let url = `http://family.rambler.ru${copyParams.url}`;
    let body = copyParams.data ? copyParams.data : '';
    copyParams.body = JSON.stringify(body);

    return fetch(url, {
      method: "POST",
      headers: { ...this.headers },
      body: {
        ...this.body,
        ...copyParams.body
      }
    }).then((response) => response.json());
  }
}

let server = new Http();
export { server as Http };
