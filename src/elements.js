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
 * @param {Cookie} cookie
 * @param {(e: InputEvent) => void} onChangeSwitchFeature
 * @returns
 */
export function toFeatureListItem({ name, value }, onChangeSwitchFeature) {
  const listItem = document.createElement("li");
  const div = document.createElement("div");
  const label = createLabel(name);
  const checkbox = createCheckbox(name, value);

  checkbox.addEventListener("change", onChangeSwitchFeature);

  div.appendChild(label);
  div.appendChild(checkbox);

  listItem.appendChild(div);

  return listItem;
}
