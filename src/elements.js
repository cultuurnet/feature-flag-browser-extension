/**
 * @typedef {{ name: string; value: string }} Cookie
 */

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
  label.innerText = name;
  label.htmlFor = "checkbox-feature-" + name;
  return label;
}

/**
 *
 * @param {string} name
 * @returns {HTMLButtonElement}
 */
function createButton(name, onClick) {
  const button = document.createElement("button");
  button.innerText = name;
  button.addEventListener("click", onClick);
  return button;
}

/**
 *
 * @param {Cookie} cookie
 * @param {string} productPrefix
 * @param {(e: InputEvent) => void} onChangeSwitchFeature
 * @param {(name: string) => void} onDeleteFeature
 * @returns
 */
export function toFeatureListItem(
  { name, value },
  productPrefix,
  onChangeSwitchFeature,
  onDeleteFeature
) {
  const listItem = document.createElement("li");
  const div = document.createElement("div");
  const nameWithoutPrefix = name.replace(productPrefix, "");
  const label = createLabel(nameWithoutPrefix);
  const checkbox = createCheckbox(nameWithoutPrefix, value);
  const deleteButton = createButton("🗑", () => onDeleteFeature(name));
  deleteButton.classList.add("transparent", "small");

  checkbox.addEventListener("change", onChangeSwitchFeature);

  div.appendChild(checkbox);
  div.appendChild(label);

  listItem.appendChild(div);

  listItem.appendChild(deleteButton);

  return listItem;
}
