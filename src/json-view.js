import "./style.css";

import { detach, element, listen } from "./utils/dom";
import getDataType from "./utils/getDataType";

const classes = {
  HIDDEN: "hidden",
  CARET_ICON: "caret-icon",
  CARET_RIGHT: "fa-caret-right",
  CARET_DOWN: "fa-caret-down",
  ICON: "fas",
  CONTAINER: "json-container",
};

function expandedTemplate(params = {}) {
  const { key, size, isExpanded = false } = params;
  const caretIconClass = isExpanded ? classes.CARET_DOWN : classes.CARET_RIGHT;
  return `
    <div class="line">
      <div class="caret-icon"><i class="fas ${caretIconClass}"></i></div>
      <div class="json-key">${key}</div>
      <div class="json-size">${size}</div>
    </div>
  `;
}

function notExpandedTemplate(params = {}) {
  const { key, value, type } = params;
  return `
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${key}</div>
      <div class="json-separator">:</div>
      <div class="json-value ${type}">${value}</div>
    </div>
  `;
}

function createContainerElement() {
  const el = element("div");
  el.className = classes.CONTAINER;
  return el;
}

function hideNodeChildren(node) {
  node.children.forEach((child) => {
    child.el && child.el.classList.add(classes.HIDDEN);
    if (child.isExpanded) {
      hideNodeChildren(child);
    }
  });
}

function showNodeChildren(node) {
  node.children.forEach((child) => {
    child.el && child.el.classList.remove(classes.HIDDEN);
    if (child.isExpanded) {
      showNodeChildren(child);
    }
  });
}

function setCaretIconDown(node) {
  if (node.children.length > 0 && node.el) {
    const icon = node.el.querySelector("." + classes.ICON);
    if (icon) {
      icon.classList.replace(classes.CARET_RIGHT, classes.CARET_DOWN);
    }
  }
}

function setCaretIconRight(node) {
  if (node.children.length > 0 && node.el) {
    const icon = node.el.querySelector("." + classes.ICON);
    if (icon) {
      icon.classList.replace(classes.CARET_DOWN, classes.CARET_RIGHT);
    }
  }
}

export function toggleNode(node) {
  if (node.isExpanded) {
    node.isExpanded = false;
    setCaretIconRight(node);
    hideNodeChildren(node);
  } else {
    node.isExpanded = true;
    setCaretIconDown(node);
    showNodeChildren(node);
  }
}

/**
 * Create node html element
 * @param {object} node
 * @return html element
 */
function createNodeElement(node) {
  let el = element("div");

  const getSizeString = (node) => {
    const len = node.children.length;
    if (node.type === "array") return `[${len}]`;
    if (node.type === "object") return `{${len}}`;

    return null;
  };

  const getValueString = (node) => {
    switch (node.type) {
      case "string":
        return node.value ? `${node.value}` : '""';

      case "number":
      case "boolean":
      case "null":
        return `${node.value}`;

      case "array":
        return `[${node.children.length}]`;

      case "object":
        return `{${node.children.length}}`;

      default:
        return `${node.value}`;
    }
  };

  const getTypeString = (node) => {
    switch (node.type) {
      case "string":
      case "number":
      case "boolean":
      case "null":
      case "array":
      case "object":
        return `json-${node.type}`;
      default:
        return `json-${typeof node.value}`;
    }
  };

  if (node.children.length > 0) {
    el.innerHTML = expandedTemplate({
      key: node.key,
      size: getSizeString(node),
      isExpanded: node.isExpanded,
    });
    const caretEl = el.querySelector("." + classes.CARET_ICON);
    node.dispose = listen(caretEl, "click", () => toggleNode(node));
  } else {
    el.innerHTML = notExpandedTemplate({
      key: node.key,
      value: getValueString(node),
      type: getTypeString(node),
    });
  }

  const lineEl = el.children[0];

  if (node.parent !== null) {
    if (node.isExpanded) {
      lineEl.classList.remove(classes.HIDDEN);
    } else {
      lineEl.classList.add(classes.HIDDEN);
    }
  }

  lineEl.style = "margin-left: " + node.depth * 18 + "px;";

  return lineEl;
}

/**
 * Recursively traverse Tree object
 * @param {Object} node
 * @param {Callback} callback - Receives node and current depth as arguments
 * @param {number} currentDepth - Current depth in traversal (internal use)
 */
export function traverse(node, callback, depth = 0) {
  callback(node, depth);
  node.children.forEach((child) => {
    traverse(child, callback, depth + 1);
  });
}

/**
 * Create node object
 * @param {object} opt options
 * @return {object}
 */
function createNode(opt = {}) {
  const isEmptyObject = (value) => {
    return getDataType(value) === "object" && Object.keys(value).length === 0;
  };

  let value = opt.hasOwnProperty("value") ? opt.value : null;

  if (isEmptyObject(value)) {
    value = "{}";
  }

  return {
    key: opt.key || null,
    parent: opt.parent || null,
    value: value,
    isExpanded: opt.isExpanded || false,
    type: opt.type || null,
    children: opt.children || [],
    el: opt.el || null,
    depth: opt.depth || 0,
    dispose: null,
  };
}

/**
 * Create subnode for node
 * @param {object} Json data
 * @param {object} node
 */
function createSubnode(data, node) {
  if (typeof data === "object") {
    for (let key in data) {
      const child = createNode({
        value: data[key],
        key: key,
        depth: node.depth + 1,
        type: getDataType(data[key]),
        parent: node,
      });
      node.children.push(child);
      createSubnode(data[key], child);
    }
  }
}

function getJsonObject(data) {
  return typeof data === "string" ? JSON.parse(data) : data;
}

/**
 * Create tree
 * @param {object | string} jsonData
 * @return {object}
 */
export function create(jsonData) {
  const parsedData = getJsonObject(jsonData);
  const rootNode = createNode({
    value: parsedData,
    key: getDataType(parsedData),
    type: getDataType(parsedData),
  });
  createSubnode(parsedData, rootNode);
  return rootNode;
}

/**
 * Render JSON string into DOM container
 * @param {string | object} jsonData
 * @param {htmlElement} targetElement
 * @return {object} tree
 */
export function renderJSON(jsonData, targetElement) {
  const parsedData = getJsonObject(jsonData);
  const tree = create(parsedData);
  render(tree, targetElement);

  return tree;
}

/**
 * Render tree into DOM container
 * @param {object} tree
 * @param {htmlElement} targetElement
 */
export function render(tree, targetElement) {
  const containerEl = createContainerElement();

  traverse(tree, function (node) {
    node.el = createNodeElement(node);
    containerEl.appendChild(node.el);
  });

  targetElement.appendChild(containerEl);
}

export function expand(node, maxDepth = Infinity) {
  traverse(node, function (child, depth) {
    if (depth < maxDepth) {
      child.isExpanded = true;
      setCaretIconDown(child);
    }
    if (depth <= maxDepth) {
      child.el && child.el.classList.remove(classes.HIDDEN);
    }
  });
}

export function collapse(node) {
  traverse(node, function (child) {
    child.isExpanded = false;
    if (child.depth > node.depth) {
      child.el && child.el.classList.add(classes.HIDDEN);
    }
    setCaretIconRight(child);
  });
}

export function destroy(tree) {
  traverse(tree, (node) => {
    if (node.dispose) {
      node.dispose();
    }
  });
  detach(tree.el.parentNode);
}

/**
 * Export public interface
 */
export default {
  toggleNode,
  render,
  create,
  renderJSON,
  expand,
  collapse,
  traverse,
  destroy,
};
