import fetch from 'node-fetch';
import * as url from 'url';

describe('node-fetch', () => {

  it('node fetch parse url', async () => {
    const originUrl = 'https://hacker.com!.inflearn.com';
    const response = await fetch(originUrl);
  });

  it('URL Parse', () => {
    const hostname = 'hacker.com!.inflearn.com';
    const originUrl = `https://${hostname}`;
    const requestUrl = url.parse(originUrl);

    expect(requestUrl.hostname).toBe(hostname);
  });
});