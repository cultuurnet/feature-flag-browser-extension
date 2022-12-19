/**
 * @typedef {{ name: string; value: string }} Cookie
 */

const ProductPrefixes = {
  UIT_DATABANK: "ff_",
  UIT_IN_VLAANDEREN: "uiv_ff_",
  CUSTOM: "custom",
};

/**
 *
 * @returns {Promise<string>}
 */
async function getUrl() {
  // this is only in the case the app gets run outside of the extension ecosystem
  if (!chrome.tabs) {
    const href = window.location.href;
    const url = new URL(href);
    return url.hostname;
  }

  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  const tab = tabs.pop();
  return tab.url ?? "http://127.0.0.1:5500/";
}

/**
 *
 * @returns {Promise<Cookie[]>} cookies
 */
async function getAllCookies() {
  const url = await getUrl();
  return await chrome.cookies.getAll({ url });
}

// HTML ELEMENTS
const featuresList = document.getElementById("features-list");
const productSelect = document.getElementById("product-select");
const productInput = document.getElementById("product-input");

// LISTENERS
// cookies.addChangeListener(loadFeatureFlags);
productInput.addEventListener("input", handleInputChangeProduct);
productSelect.addEventListener("input", handleChangeProductSelection);

/**
 *
 * @param {Cookie} cookie
 */
function isFeatureFlag({ name }) {
  if (!productInput.value) return false;
  return name.startsWith(productInput.value);
}

async function loadFeatureFlags() {
  const allCookies = await getAllCookies();
  const listItems = allCookies.filter(isFeatureFlag).map(toFeatureListItem);

  featuresList.replaceChildren(...listItems);
}

/**
 *
 * @param {InputEvent} e
 */
function handleInputChangeProduct(e) {
  e.preventDefault();
  loadFeatureFlags();
}

/**
 *
 * @param {string} name
 * @param {string} value
 * @returns {HTMLInputElement}
 */
function createCheckbox(name, value) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = name;
  checkbox.checked = value === "true";
  checkbox.id = "checkbox-feature-" + name;
  return checkbox;
}

/**
 *
 * @param {string} name
 * @returns {HTMLLabelElement}
 */
function createLabel(name) {
  const label = document.createElement("label");
  label.innerText = name + ": ";
  label.htmlFor = "checkbox-feature-" + name;
  return label;
}

/**
 *
 * @param {InputEvent} e
 */
async function handleChangeProductSelection(e) {
  e.preventDefault();

  if (e.target.value === "custom") {
    productInput.classList.remove("hide");
  } else {
    productInput.classList.add("hide");
  }

  productInput.value = e.target.value;
  await loadFeatureFlags();
}

/**
 *
 * @param {InputEvent} e
 */
async function handleChangeSwitchFeature(e) {
  e.preventDefault();

  const feature = e.target.name;
  const isEnabled = e.target.checked;

  const url = await getUrl();

  // make feature flag expire in one year
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  const expirationDate = today.getTime() / 1000;

  await chrome.cookies.set({
    url,
    name: feature,
    value: `${isEnabled}`,
    path: "/",
    expirationDate,
  });
}

/**
 *
 * @param {Cookie} cookie
 * @returns {HTMLLIElement}
 */
function toFeatureListItem({ name, value }) {
  const listItem = document.createElement("li");
  const div = document.createElement("div");
  const label = createLabel(name);
  const checkbox = createCheckbox(name, value);

  checkbox.addEventListener("change", handleChangeSwitchFeature);

  div.appendChild(label);
  div.appendChild(checkbox);

  listItem.appendChild(div);

  return listItem;
}

async function initialize() {
  productInput.value = ProductPrefixes.UIT_IN_VLAANDEREN;
  await loadFeatureFlags();
}

initialize();
