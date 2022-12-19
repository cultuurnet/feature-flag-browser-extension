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

/**
 *
 * @param {string} featureName
 * @param {boolean} isEnabled
 * @returns {Promise<unknown>}
 */
export async function setCookie(featureName, isEnabled) {
  const url = await getUrl();

  // make feature flag expire in one year
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  const expirationDate = today.getTime() / 1000;

  return new Promise((resolve, reject) => {
    try {
      browserApis.cookies.set({
        url,
        name: featureName,
        value: `${isEnabled}`,
        path: "/",
        expirationDate,
      });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {string} featureName
 * @returns {Promise<unknown>}
 */
export async function removeCookie(featureName) {
  const url = await getUrl();

  return new Promise((resolve, reject) => {
    try {
      browserApis.cookies.remove({ url, name: featureName }, () => resolve());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {string} name
 * @returns {Promise<unknown>}
 */
export async function getItemFromStorage(name) {
  return new Promise((resolve, reject) => {
    try {
      browserApis.storage.local.get(name, resolve);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {string} name
 * @param {string} value
 * @returns {Promise<unknown>}
 */
export async function setItemToStorage(name, value) {
  return new Promise((resolve, reject) => {
    try {
      browserApis.storage.local.set({ [name]: value }, resolve);
    } catch (error) {
      reject(error);
    }
  });
}
