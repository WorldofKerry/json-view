function c(e) {
  return Array.isArray(e) ? "array" : e === null ? "null" : typeof e;
}
function u(e) {
  return document.createElement(e);
}
function D(e, n, t) {
  return e.addEventListener(n, t), () => e.removeEventListener(n, t);
}
function g(e) {
  e.parentNode.removeChild(e);
}
const r = {
  HIDDEN: "hidden",
  CARET_ICON: "caret-icon",
  CARET_RIGHT: "fa-caret-right",
  CARET_DOWN: "fa-caret-down",
  ICON: "fas"
};
function I(e = {}) {
  const { key: n, size: t } = e;
  return `
    <div class="line">
      <div class="caret-icon"><i class="fas fa-caret-right"></i></div>
      <div class="json-key">${n}</div>
      <div class="json-size">${t}</div>
    </div>
  `;
}
function T(e = {}) {
  const { key: n, value: t, type: i } = e;
  return `
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${n}</div>
      <div class="json-separator">:</div>
      <div class="json-value json-${i}">${t}</div>
    </div>
  `;
}
function j() {
  const e = u("div");
  return e.className = "json-container", e;
}
function o(e) {
  e.children.forEach((n) => {
    n.el.classList.add(r.HIDDEN), n.isExpanded && o(n);
  });
}
function f(e) {
  e.children.forEach((n) => {
    n.el.classList.remove(r.HIDDEN), n.isExpanded && f(n);
  });
}
function d(e) {
  if (e.children.length > 0) {
    const n = e.el.querySelector("." + r.ICON);
    n && n.classList.replace(r.CARET_RIGHT, r.CARET_DOWN);
  }
}
function p(e) {
  if (e.children.length > 0) {
    const n = e.el.querySelector("." + r.ICON);
    n && n.classList.replace(r.CARET_DOWN, r.CARET_RIGHT);
  }
}
function y(e) {
  e.isExpanded ? (e.isExpanded = !1, p(e), o(e)) : (e.isExpanded = !0, d(e), f(e));
}
function m(e) {
  let n = u("div");
  const t = (l) => {
    const a = l.children.length;
    return l.type === "array" ? `[${a}]` : l.type === "object" ? `{${a}}` : null;
  };
  if (e.children.length > 0) {
    n.innerHTML = I({
      key: e.key,
      size: t(e)
    });
    const l = n.querySelector("." + r.CARET_ICON);
    e.dispose = D(l, "click", () => y(e));
  } else
    n.innerHTML = T({
      key: e.key,
      value: e.value === "" ? '""' : e.value,
      type: e.value === "{}" ? "object" : typeof e.value
    });
  const i = n.children[0];
  return e.parent !== null && i.classList.add(r.HIDDEN), i.style = "margin-left: " + e.depth * 18 + "px;", i;
}
function s(e, n) {
  n(e), e.children.length > 0 && e.children.forEach((t) => {
    s(t, n);
  });
}
function v(e = {}) {
  const n = (i) => c(i) === "object" && Object.keys(i).length === 0;
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
function E(e, n) {
  if (typeof e == "object")
    for (let t in e) {
      const i = v({
        value: e[t],
        key: t,
        depth: n.depth + 1,
        type: c(e[t]),
        parent: n
      });
      n.children.push(i), E(e[t], i);
    }
}
function h(e) {
  return typeof e == "string" ? JSON.parse(e) : e;
}
function N(e) {
  const n = h(e), t = v({
    value: n,
    key: c(n),
    type: c(n)
  });
  return E(n, t), t;
}
function k(e, n) {
  const t = h(e), i = N(t);
  return C(i, n), i;
}
function C(e, n) {
  const t = j();
  s(e, function(i) {
    i.el = m(i), t.appendChild(i.el);
  }), n.appendChild(t);
}
function x(e) {
  s(e, function(n) {
    n.el.classList.remove(r.HIDDEN), n.isExpanded = !0, d(n);
  });
}
function O(e) {
  s(e, function(n) {
    n.isExpanded = !1, n.depth > e.depth && n.el.classList.add(r.HIDDEN), p(n);
  });
}
function R(e) {
  s(e, (n) => {
    n.dispose && n.dispose();
  }), g(e.el.parentNode);
}
const H = {
  toggleNode: y,
  render: C,
  create: N,
  renderJSON: k,
  expand: x,
  collapse: O,
  traverse: s,
  destroy: R
};
export {
  O as collapse,
  N as create,
  H as default,
  R as destroy,
  x as expand,
  C as render,
  k as renderJSON,
  y as toggleNode,
  s as traverse
};
