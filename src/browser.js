/**
 * @typedef {{ name: string; value: string }} Cookie
 */

export function getBrowserApis() {
  let browserApis;
  try {
    browserApis = browser;
  } catch {
    browserApis = chrome;
  }
  return browserApis;
}

const browserApis = getBrowserApis();

/**
 *
 * @returns {Promise<string>}
 */
export async function getUrl() {
  // this is only in the case the app gets run outside of the extension ecosystem
  if (!browserApis.tabs) {
    const href = window.location.href;
    const url = new URL(href);
    return url.hostname;
  }

  return new Promise((resolve, reject) => {
    try {
      browserApis.tabs.query(
        {
          currentWindow: true,
          active: true,
        },
        (tabs) => {
          const tab = tabs.pop();
          resolve(tab.url ?? "http://127.0.0.1:5500/");
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @returns {Promise<Cookie[]>} cookies
 */
export async function getAllCookies() {
  const url = await getUrl();
  return new Promise((resolve, reject) => {
    try {
      browserApis.cookies.getAll({ url }, (cookies) => {
        resolve(cookies);
      });
    } catch (error) {
      reject(error);
    }
  });
}