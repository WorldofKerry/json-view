function u(e) {
  return Array.isArray(e) ? "array" : e === null ? "null" : typeof e;
}
function f(e) {
  return document.createElement(e);
}
function T(e, n, t) {
  return e.addEventListener(n, t), () => e.removeEventListener(n, t);
}
function D(e) {
  e.parentNode.removeChild(e);
}
const i = {
  HIDDEN: "hidden",
  CARET_ICON: "caret-icon",
  CARET_RIGHT: "fa-caret-right",
  CARET_DOWN: "fa-caret-down",
  ICON: "fas",
  CONTAINER: "json-container"
};
function j(e = {}) {
  const { key: n, size: t, isExpanded: s = !1 } = e;
  return `
    <div class="line">
      <div class="caret-icon"><i class="fas ${s ? i.CARET_DOWN : i.CARET_RIGHT}"></i></div>
      <div class="json-key">${n}</div>
      <div class="json-size">${t}</div>
    </div>
  `;
}
function m(e = {}) {
  const { key: n, value: t, type: s } = e;
  return `
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${n}</div>
      <div class="json-separator">:</div>
      <div class="json-value ${s}">${t}</div>
    </div>
  `;
}
function x() {
  const e = f("div");
  return e.className = i.CONTAINER, e;
}
function p(e) {
  e.children.forEach((n) => {
    n.el && n.el.classList.add(i.HIDDEN), n.isExpanded && p(n);
  });
}
function d(e) {
  e.children.forEach((n) => {
    n.el && n.el.classList.remove(i.HIDDEN), n.isExpanded && d(n);
  });
}
function y(e) {
  if (e.children.length > 0 && e.el) {
    const n = e.el.querySelector("." + i.ICON);
    n && n.classList.replace(i.CARET_RIGHT, i.CARET_DOWN);
  }
}
function E(e) {
  if (e.children.length > 0 && e.el) {
    const n = e.el.querySelector("." + i.ICON);
    n && n.classList.replace(i.CARET_DOWN, i.CARET_RIGHT);
  }
}
function v(e) {
  e.isExpanded ? (e.isExpanded = !1, E(e), p(e)) : (e.isExpanded = !0, y(e), d(e));
}
function O(e) {
  let n = f("div");
  const t = (r) => {
    const o = r.children.length;
    return r.type === "array" ? `[${o}]` : r.type === "object" ? `{${o}}` : null;
  }, s = (r) => {
    switch (r.type) {
      case "string":
        return r.value ? `${r.value}` : '""';
      case "number":
      case "boolean":
      case "null":
        return `${r.value}`;
      case "array":
        return `[${r.children.length}]`;
      case "object":
        return `{${r.children.length}}`;
      default:
        return `${r.value}`;
    }
  }, c = (r) => {
    switch (r.type) {
      case "string":
      case "number":
      case "boolean":
      case "null":
      case "array":
      case "object":
        return `json-${r.type}`;
      default:
        return `json-${typeof r.value}`;
    }
  };
  if (e.children.length > 0) {
    n.innerHTML = j({
      key: e.key,
      size: t(e),
      isExpanded: e.isExpanded
    });
    const r = n.querySelector("." + i.CARET_ICON);
    e.dispose = T(r, "click", () => v(e));
  } else
    n.innerHTML = m({
      key: e.key,
      value: s(e),
      type: c(e)
    });
  const a = n.children[0];
  return e.parent !== null && (e.isExpanded ? a.classList.remove(i.HIDDEN) : a.classList.add(i.HIDDEN)), a.style = "margin-left: " + e.depth * 18 + "px;", a;
}
function l(e, n, t = 1 / 0, s = 0) {
  n(e), s < t && e.children.length > 0 && e.children.forEach((c) => {
    l(c, n, t, s + 1);
  });
}
function h(e = {}) {
  const n = (s) => u(s) === "object" && Object.keys(s).length === 0;
  let t = e.hasOwnProperty("value") ? e.value : null;
  return n(t) && (t = "{}"), {
    key: e.key || null,
    parent: e.parent || null,
    value: t,
    isExpanded: e.isExpanded || !1,
    type: e.type || null,
    children: e.children || [],
    el: e.el || null,
    depth: e.depth || 0,
    dispose: null
  };
}
function N(e, n) {
  if (typeof e == "object")
    for (let t in e) {
      const s = h({
        value: e[t],
        key: t,
        depth: n.depth + 1,
        type: u(e[t]),
        parent: n
      });
      n.children.push(s), N(e[t], s);
    }
}
function C(e) {
  return typeof e == "string" ? JSON.parse(e) : e;
}
function I(e) {
  const n = C(e), t = h({
    value: n,
    key: u(n),
    type: u(n)
  });
  return N(n, t), t;
}
function R(e, n) {
  const t = C(e), s = I(t);
  return g(s, n), s;
}
function g(e, n) {
  const t = x();
  l(e, function(s) {
    s.el = O(s), t.appendChild(s.el);
  }), n.appendChild(t);
}
function $(e, n = 1 / 0) {
  l(e, function(t) {
    t.el && t.el.classList.remove(i.HIDDEN), t.isExpanded = !0, y(t);
  }, n);
}
function k(e, n = 1 / 0) {
  l(e, function(t) {
    t.isExpanded = !1, t.depth > e.depth && t.el && t.el.classList.add(i.HIDDEN), E(t);
  }, n);
}
function A(e) {
  l(e, (n) => {
    n.dispose && n.dispose();
  }), D(e.el.parentNode);
}
const H = {
  toggleNode: v,
  render: g,
  create: I,
  renderJSON: R,
  expand: $,
  collapse: k,
  traverse: l,
  destroy: A
};
export {
  k as collapse,
  I as create,
  H as default,
  A as destroy,
  $ as expand,
  g as render,
  R as renderJSON,
  v as toggleNode,
  l as traverse
};
