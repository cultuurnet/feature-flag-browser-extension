import { getAllCookies, getBrowserApis, getUrl } from "./browser.js";
import { toFeatureListItem } from "./elements.js";

const browserApis = getBrowserApis();

/**
 * @typedef {{ name: string; value: string }} Cookie
 */

const ProductPrefixes = {
  UIT_DATABANK: "ff_",
  UIT_IN_VLAANDEREN: "uiv_ff_",
  CUSTOM: "custom",
};

// HTML ELEMENTS
const featuresList = document.getElementById("features-list");
const productSelect = document.getElementById("product-select");
const productInput = document.getElementById("product-input");

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
  const listItems = allCookies
    .filter(isFeatureFlag)
    .map((cookie) => toFeatureListItem(cookie, handleChangeSwitchFeature));

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

  await browserApis.cookies.set({
    url,
    name: feature,
    value: `${isEnabled}`,
    path: "/",
    expirationDate,
  });
}

async function initialize() {
  productInput.value = ProductPrefixes.UIT_IN_VLAANDEREN;
  await loadFeatureFlags();
}

// LISTENERS
// cookies.addChangeListener(loadFeatureFlags);
productInput.addEventListener("input", handleInputChangeProduct);
productSelect.addEventListener("input", handleChangeProductSelection);

initialize();
