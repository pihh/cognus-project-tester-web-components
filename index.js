class CognusCard extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", e => {
      if (this.href) {
        window.location.href = this.href;
      }
      if (this.action) {
        this[action]();
      }
    });
  }

  static get observedAttributes() {
    return ["name", "category", "action", "href"];
  }
  //
  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this._updateRendering();
  }
  connectedCallback() {
    const template = `
    <div
      class="w-full md:mx-1 bg-white rounded-lg p-6 cursor-pointer shadow-md"
    >
      <div class="relative">
        <div class="text-gray-700 ellipsis">${this.category}</div>
        <h2 class="text-lg font-semibold">${this.name}</h2>
        <div
          class="p-0 items-center text-indigo-600 leading-none lg:rounded-full flex lg:inline-flex "
          role="alert"
        >
          <span class="flex rounded-full py-1 mr-3">${this.action}</span>
          <svg
            class="fill-current opacity-75 h-4 w-4 mb-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    `;

    this.innerHTML = template;
  }

  get href() {
    return this.getAttribute("href");
  }

  set href(v) {
    this.setAttribute("href", v);
  }

  get action() {
    return this.getAttribute("action") || "Run";
  }

  set action(v) {
    this.setAttribute("action", v);
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(v) {
    this.setAttribute("name", v);
  }

  get category() {
    return this.getAttribute("category");
  }

  set category(v) {
    this.setAttribute("category", v);
  }

  _updateRendering() {
    //console.log("Update rendering");
  }
}

class CognusDescription extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["title", "description"];
  }
  //
  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this._updateRendering();
  }
  connectedCallback() {
    let title = "";
    if (this.title) {
      title = `<div class="font-bold text-xl mb-3">${this.title}</div>`;
    }
    const template = `
      ${title}
      <p class="text-gray-700 text-base ">${this.description}</p> `;

    this.innerHTML = template;
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(v) {
    this.setAttribute("title", v);
  }

  get description() {
    return this.getAttribute("description");
  }

  set description(v) {
    this.setAttribute("description", v);
  }

  _updateRendering() {
    //.log("Update rendering");
  }
}

class CognusHr extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const template = `
      <hr class="border-gray-400" />
    `;

    this.innerHTML = template;
  }
}

class CognusLi extends HTMLElement {
  constructor() {
    super();
  }
  get text() {
    return this.getAttribute("text");
  }
  set text(v) {
    return this.setAttribute("text", v);
  }
  connectedCallback() {
    const template = `
      <li class="text-gray-700 flex mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 float-left mr-2 mt-1" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z" fill="#5a67d8"/></svg>
        <img
          src="https://cdn.jsdelivr.net/gh/pihh/cognus-project-tester-web-components/icons/checkmark-solid.svg"
          class="h-5 float-left mr-2 mt-1"
        >${this.text}</li>
    `;

    this.innerHTML = template;
  }
}

class CognusRepeat extends HTMLElement {
  constructor() {
    super();
  }
  createdCallback() {
    if (this.getAttribute("shadow")) {
      this.attachShadow({ mode: "open" });
    } else {
      if (!this.template) this.template = this.innerHTML;
      this.render();
    }
  }
  attachedCallback() {
    this.render();
  }
  render() {
    if (!this.template) this.template = this.innerHTML;

    const content = CognusRepeat.fromJson(this.getAttribute("content"));
    const element = this.getAttribute("element");
    const template = this.template;

    let html = element !== null ? "<" + element.toLowerCase() + ">" : "";

    if (Array.isArray(content)) {
      content.forEach(function(item) {
        html += CognusRepeat.interpolate(template, item);
      });
    } else {
      throw new Error("Content should be an Array of objects.");
    }
    html += element !== null ? "</" + element.toLowerCase() + ">" : "";
    if (this.getAttribute("shadow")) {
      this.shadowRoot.innerHTML = html;
      this.innerHTML = "";
    } else {
      this.innerHTML = html;
    }
  }
  attributeChangedCallback(name) {
    console.log({ name });
    switch (name) {
      case "content":
        this.render();
        break;
    }
  }
  static interpolate(template, obj) {
    if (typeof obj == "object") {
      for (var key in obj) {
        const find = "${" + key + "}";
        if (template.indexOf(find) > -1) {
          template = template.replace(find, obj[key]);
          delete obj[key];
        }
      }
    }
    return template;
  }
  static fromJson(str) {
    let obj = null;
    if (typeof str == "string") {
      try {
        obj = JSON.parse(str);
      } catch (e) {
        throw new Error("Invalid JSON string provided. ");
      }
    }
    return obj;
  }
}

customElements.define("cognus-li", CognusLi);
customElements.define("cognus-hr", CognusHr);
customElements.define("cognus-description", CognusDescription);
customElements.define("cognus-card", CognusCard);
// customElements.define("cognus-repeat", CognusRepeat);

document.registerElement("cognus-repeat", CognusRepeat);

// SIMPLE BAR
/**
 * SimpleBar.js - v4.2.3
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */
try {
  // BOOT SIMPLE BAR
  window.onload = function() {
    setTimeout(function() {
      !(function(t, e) {
        "object" == typeof exports && "undefined" != typeof module
          ? (module.exports = e())
          : "function" == typeof define && define.amd
          ? define(e)
          : ((t = t || self).SimpleBar = e());
      })(this, function() {
        "use strict";
        var t = function(t) {
            if ("function" != typeof t)
              throw TypeError(String(t) + " is not a function");
            return t;
          },
          e = function(t) {
            try {
              return !!t();
            } catch (t) {
              return !0;
            }
          },
          i = {}.toString,
          r = function(t) {
            return i.call(t).slice(8, -1);
          },
          n = "".split,
          s = e(function() {
            return !Object("z").propertyIsEnumerable(0);
          })
            ? function(t) {
                return "String" == r(t) ? n.call(t, "") : Object(t);
              }
            : Object,
          o = function(t) {
            if (null == t) throw TypeError("Can't call method on " + t);
            return t;
          },
          a = function(t) {
            return Object(o(t));
          },
          l = Math.ceil,
          c = Math.floor,
          u = function(t) {
            return isNaN((t = +t)) ? 0 : (t > 0 ? c : l)(t);
          },
          h = Math.min,
          f = function(t) {
            return t > 0 ? h(u(t), 9007199254740991) : 0;
          },
          d = function(t) {
            return "object" == typeof t ? null !== t : "function" == typeof t;
          },
          p =
            Array.isArray ||
            function(t) {
              return "Array" == r(t);
            },
          v =
            "undefined" != typeof globalThis
              ? globalThis
              : "undefined" != typeof window
              ? window
              : "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : {};
        function g(t, e) {
          return t((e = { exports: {} }), e.exports), e.exports;
        }
        var b,
          m,
          y,
          x,
          E =
            "object" == typeof window && window && window.Math == Math
              ? window
              : "object" == typeof self && self && self.Math == Math
              ? self
              : Function("return this")(),
          w = !e(function() {
            return (
              7 !=
              Object.defineProperty({}, "a", {
                get: function() {
                  return 7;
                }
              }).a
            );
          }),
          O = E.document,
          _ = d(O) && d(O.createElement),
          S =
            !w &&
            !e(function() {
              return (
                7 !=
                Object.defineProperty(
                  ((t = "div"), _ ? O.createElement(t) : {}),
                  "a",
                  {
                    get: function() {
                      return 7;
                    }
                  }
                ).a
              );
              var t;
            }),
          L = function(t) {
            if (!d(t)) throw TypeError(String(t) + " is not an object");
            return t;
          },
          A = function(t, e) {
            if (!d(t)) return t;
            var i, r;
            if (
              e &&
              "function" == typeof (i = t.toString) &&
              !d((r = i.call(t)))
            )
              return r;
            if ("function" == typeof (i = t.valueOf) && !d((r = i.call(t))))
              return r;
            if (
              !e &&
              "function" == typeof (i = t.toString) &&
              !d((r = i.call(t)))
            )
              return r;
            throw TypeError("Can't convert object to primitive value");
          },
          M = Object.defineProperty,
          k = {
            f: w
              ? M
              : function(t, e, i) {
                  if ((L(t), (e = A(e, !0)), L(i), S))
                    try {
                      return M(t, e, i);
                    } catch (t) {}
                  if ("get" in i || "set" in i)
                    throw TypeError("Accessors not supported");
                  return "value" in i && (t[e] = i.value), t;
                }
          },
          W = function(t, e) {
            return {
              enumerable: !(1 & t),
              configurable: !(2 & t),
              writable: !(4 & t),
              value: e
            };
          },
          T = w
            ? function(t, e, i) {
                return k.f(t, e, W(1, i));
              }
            : function(t, e, i) {
                return (t[e] = i), t;
              },
          R = function(t, e) {
            try {
              T(E, t, e);
            } catch (i) {
              E[t] = e;
            }
            return e;
          },
          j = g(function(t) {
            var e = E["__core-js_shared__"] || R("__core-js_shared__", {});
            (t.exports = function(t, i) {
              return e[t] || (e[t] = void 0 !== i ? i : {});
            })("versions", []).push({
              version: "3.0.1",
              mode: "global",
              copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
            });
          }),
          C = 0,
          N = Math.random(),
          z = function(t) {
            return "Symbol(".concat(
              void 0 === t ? "" : t,
              ")_",
              (++C + N).toString(36)
            );
          },
          D = !e(function() {
            return !String(Symbol());
          }),
          V = j("wks"),
          I = E.Symbol,
          B = function(t) {
            return V[t] || (V[t] = (D && I[t]) || (D ? I : z)("Symbol." + t));
          },
          P = B("species"),
          H = function(t, e) {
            var i;
            return (
              p(t) &&
                ("function" != typeof (i = t.constructor) ||
                (i !== Array && !p(i.prototype))
                  ? d(i) && null === (i = i[P]) && (i = void 0)
                  : (i = void 0)),
              new (void 0 === i ? Array : i)(0 === e ? 0 : e)
            );
          },
          F = function(e, i) {
            var r = 1 == e,
              n = 2 == e,
              o = 3 == e,
              l = 4 == e,
              c = 6 == e,
              u = 5 == e || c,
              h = i || H;
            return function(i, d, p) {
              for (
                var v,
                  g,
                  b = a(i),
                  m = s(b),
                  y = (function(e, i, r) {
                    if ((t(e), void 0 === i)) return e;
                    switch (r) {
                      case 0:
                        return function() {
                          return e.call(i);
                        };
                      case 1:
                        return function(t) {
                          return e.call(i, t);
                        };
                      case 2:
                        return function(t, r) {
                          return e.call(i, t, r);
                        };
                      case 3:
                        return function(t, r, n) {
                          return e.call(i, t, r, n);
                        };
                    }
                    return function() {
                      return e.apply(i, arguments);
                    };
                  })(d, p, 3),
                  x = f(m.length),
                  E = 0,
                  w = r ? h(i, x) : n ? h(i, 0) : void 0;
                x > E;
                E++
              )
                if ((u || E in m) && ((g = y((v = m[E]), E, b)), e))
                  if (r) w[E] = g;
                  else if (g)
                    switch (e) {
                      case 3:
                        return !0;
                      case 5:
                        return v;
                      case 6:
                        return E;
                      case 2:
                        w.push(v);
                    }
                  else if (l) return !1;
              return c ? -1 : o || l ? l : w;
            };
          },
          q = B("species"),
          $ = {}.propertyIsEnumerable,
          Y = Object.getOwnPropertyDescriptor,
          X = {
            f:
              Y && !$.call({ 1: 2 }, 1)
                ? function(t) {
                    var e = Y(this, t);
                    return !!e && e.enumerable;
                  }
                : $
          },
          G = function(t) {
            return s(o(t));
          },
          K = {}.hasOwnProperty,
          U = function(t, e) {
            return K.call(t, e);
          },
          J = Object.getOwnPropertyDescriptor,
          Q = {
            f: w
              ? J
              : function(t, e) {
                  if (((t = G(t)), (e = A(e, !0)), S))
                    try {
                      return J(t, e);
                    } catch (t) {}
                  if (U(t, e)) return W(!X.f.call(t, e), t[e]);
                }
          },
          Z = j("native-function-to-string", Function.toString),
          tt = E.WeakMap,
          et = "function" == typeof tt && /native code/.test(Z.call(tt)),
          it = j("keys"),
          rt = {},
          nt = E.WeakMap;
        if (et) {
          var st = new nt(),
            ot = st.get,
            at = st.has,
            lt = st.set;
          (b = function(t, e) {
            return lt.call(st, t, e), e;
          }),
            (m = function(t) {
              return ot.call(st, t) || {};
            }),
            (y = function(t) {
              return at.call(st, t);
            });
        } else {
          var ct = it[(x = "state")] || (it[x] = z(x));
          (rt[ct] = !0),
            (b = function(t, e) {
              return T(t, ct, e), e;
            }),
            (m = function(t) {
              return U(t, ct) ? t[ct] : {};
            }),
            (y = function(t) {
              return U(t, ct);
            });
        }
        var ut,
          ht,
          ft = {
            set: b,
            get: m,
            has: y,
            enforce: function(t) {
              return y(t) ? m(t) : b(t, {});
            },
            getterFor: function(t) {
              return function(e) {
                var i;
                if (!d(e) || (i = m(e)).type !== t)
                  throw TypeError("Incompatible receiver, " + t + " required");
                return i;
              };
            }
          },
          dt = g(function(t) {
            var e = ft.get,
              i = ft.enforce,
              r = String(Z).split("toString");
            j("inspectSource", function(t) {
              return Z.call(t);
            }),
              (t.exports = function(t, e, n, s) {
                var o = !!s && !!s.unsafe,
                  a = !!s && !!s.enumerable,
                  l = !!s && !!s.noTargetGet;
                "function" == typeof n &&
                  ("string" != typeof e || U(n, "name") || T(n, "name", e),
                  (i(n).source = r.join("string" == typeof e ? e : ""))),
                  t !== E
                    ? (o ? !l && t[e] && (a = !0) : delete t[e],
                      a ? (t[e] = n) : T(t, e, n))
                    : a
                    ? (t[e] = n)
                    : R(e, n);
              })(Function.prototype, "toString", function() {
                return (
                  ("function" == typeof this && e(this).source) || Z.call(this)
                );
              });
          }),
          pt = Math.max,
          vt = Math.min,
          gt =
            ((ut = !1),
            function(t, e, i) {
              var r,
                n = G(t),
                s = f(n.length),
                o = (function(t, e) {
                  var i = u(t);
                  return i < 0 ? pt(i + e, 0) : vt(i, e);
                })(i, s);
              if (ut && e != e) {
                for (; s > o; ) if ((r = n[o++]) != r) return !0;
              } else
                for (; s > o; o++)
                  if ((ut || o in n) && n[o] === e) return ut || o || 0;
              return !ut && -1;
            }),
          bt = function(t, e) {
            var i,
              r = G(t),
              n = 0,
              s = [];
            for (i in r) !U(rt, i) && U(r, i) && s.push(i);
            for (; e.length > n; )
              U(r, (i = e[n++])) && (~gt(s, i) || s.push(i));
            return s;
          },
          mt = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf"
          ],
          yt = mt.concat("length", "prototype"),
          xt = {
            f:
              Object.getOwnPropertyNames ||
              function(t) {
                return bt(t, yt);
              }
          },
          Et = { f: Object.getOwnPropertySymbols },
          wt = E.Reflect,
          Ot =
            (wt && wt.ownKeys) ||
            function(t) {
              var e = xt.f(L(t)),
                i = Et.f;
              return i ? e.concat(i(t)) : e;
            },
          _t = function(t, e) {
            for (var i = Ot(e), r = k.f, n = Q.f, s = 0; s < i.length; s++) {
              var o = i[s];
              U(t, o) || r(t, o, n(e, o));
            }
          },
          St = /#|\.prototype\./,
          Lt = function(t, i) {
            var r = Mt[At(t)];
            return (
              r == Wt || (r != kt && ("function" == typeof i ? e(i) : !!i))
            );
          },
          At = (Lt.normalize = function(t) {
            return String(t)
              .replace(St, ".")
              .toLowerCase();
          }),
          Mt = (Lt.data = {}),
          kt = (Lt.NATIVE = "N"),
          Wt = (Lt.POLYFILL = "P"),
          Tt = Lt,
          Rt = Q.f,
          jt = function(t, e) {
            var i,
              r,
              n,
              s,
              o,
              a = t.target,
              l = t.global,
              c = t.stat;
            if ((i = l ? E : c ? E[a] || R(a, {}) : (E[a] || {}).prototype))
              for (r in e) {
                if (
                  ((s = e[r]),
                  (n = t.noTargetGet ? (o = Rt(i, r)) && o.value : i[r]),
                  !Tt(l ? r : a + (c ? "." : "#") + r, t.forced) &&
                    void 0 !== n)
                ) {
                  if (typeof s == typeof n) continue;
                  _t(s, n);
                }
                (t.sham || (n && n.sham)) && T(s, "sham", !0), dt(i, r, s, t);
              }
          },
          Ct = F(2);
        jt(
          {
            target: "Array",
            proto: !0,
            forced: !((ht = "filter"),
            !e(function() {
              var t = [];
              return (
                ((t.constructor = {})[q] = function() {
                  return { foo: 1 };
                }),
                1 !== t[ht](Boolean).foo
              );
            }))
          },
          {
            filter: function(t) {
              return Ct(this, t, arguments[1]);
            }
          }
        );
        var Nt = function(t, i) {
            var r = [][t];
            return (
              !r ||
              !e(function() {
                r.call(
                  null,
                  i ||
                    function() {
                      throw 1;
                    },
                  1
                );
              })
            );
          },
          zt = [].forEach,
          Dt = F(0),
          Vt = Nt("forEach")
            ? function(t) {
                return Dt(this, t, arguments[1]);
              }
            : zt;
        jt(
          { target: "Array", proto: !0, forced: [].forEach != Vt },
          { forEach: Vt }
        );
        jt(
          { target: "Array", proto: !0, forced: Nt("reduce") },
          {
            reduce: function(e) {
              return (function(e, i, r, n, o) {
                t(i);
                var l = a(e),
                  c = s(l),
                  u = f(l.length),
                  h = o ? u - 1 : 0,
                  d = o ? -1 : 1;
                if (r < 2)
                  for (;;) {
                    if (h in c) {
                      (n = c[h]), (h += d);
                      break;
                    }
                    if (((h += d), o ? h < 0 : u <= h))
                      throw TypeError(
                        "Reduce of empty array with no initial value"
                      );
                  }
                for (; o ? h >= 0 : u > h; h += d)
                  h in c && (n = i(n, c[h], h, l));
                return n;
              })(this, e, arguments.length, arguments[1], !1);
            }
          }
        );
        var It = k.f,
          Bt = Function.prototype,
          Pt = Bt.toString,
          Ht = /^\s*function ([^ (]*)/;
        !w ||
          "name" in Bt ||
          It(Bt, "name", {
            configurable: !0,
            get: function() {
              try {
                return Pt.call(this).match(Ht)[1];
              } catch (t) {
                return "";
              }
            }
          });
        var Ft =
            Object.keys ||
            function(t) {
              return bt(t, mt);
            },
          qt = Object.assign,
          $t =
            !qt ||
            e(function() {
              var t = {},
                e = {},
                i = Symbol();
              return (
                (t[i] = 7),
                "abcdefghijklmnopqrst".split("").forEach(function(t) {
                  e[t] = t;
                }),
                7 != qt({}, t)[i] ||
                  "abcdefghijklmnopqrst" != Ft(qt({}, e)).join("")
              );
            })
              ? function(t, e) {
                  for (
                    var i = a(t),
                      r = arguments.length,
                      n = 1,
                      o = Et.f,
                      l = X.f;
                    r > n;

                  )
                    for (
                      var c,
                        u = s(arguments[n++]),
                        h = o ? Ft(u).concat(o(u)) : Ft(u),
                        f = h.length,
                        d = 0;
                      f > d;

                    )
                      l.call(u, (c = h[d++])) && (i[c] = u[c]);
                  return i;
                }
              : qt;
        jt(
          { target: "Object", stat: !0, forced: Object.assign !== $t },
          { assign: $t }
        );
        var Yt = "\t\n\v\f\r                　\u2028\u2029\ufeff",
          Xt = "[" + Yt + "]",
          Gt = RegExp("^" + Xt + Xt + "*"),
          Kt = RegExp(Xt + Xt + "*$"),
          Ut = E.parseInt,
          Jt = /^[-+]?0[xX]/,
          Qt =
            8 !== Ut(Yt + "08") || 22 !== Ut(Yt + "0x16")
              ? function(t, e) {
                  var i = (function(t, e) {
                    return (
                      (t = String(o(t))),
                      1 & e && (t = t.replace(Gt, "")),
                      2 & e && (t = t.replace(Kt, "")),
                      t
                    );
                  })(String(t), 3);
                  return Ut(i, e >>> 0 || (Jt.test(i) ? 16 : 10));
                }
              : Ut;
        jt({ global: !0, forced: parseInt != Qt }, { parseInt: Qt });
        var Zt,
          te,
          ee = RegExp.prototype.exec,
          ie = String.prototype.replace,
          re = ee,
          ne =
            ((Zt = /a/),
            (te = /b*/g),
            ee.call(Zt, "a"),
            ee.call(te, "a"),
            0 !== Zt.lastIndex || 0 !== te.lastIndex),
          se = void 0 !== /()??/.exec("")[1];
        (ne || se) &&
          (re = function(t) {
            var e,
              i,
              r,
              n,
              s = this;
            return (
              se &&
                (i = new RegExp(
                  "^" + s.source + "$(?!\\s)",
                  function() {
                    var t = L(this),
                      e = "";
                    return (
                      t.global && (e += "g"),
                      t.ignoreCase && (e += "i"),
                      t.multiline && (e += "m"),
                      t.unicode && (e += "u"),
                      t.sticky && (e += "y"),
                      e
                    );
                  }.call(s)
                )),
              ne && (e = s.lastIndex),
              (r = ee.call(s, t)),
              ne && r && (s.lastIndex = s.global ? r.index + r[0].length : e),
              se &&
                r &&
                r.length > 1 &&
                ie.call(r[0], i, function() {
                  for (n = 1; n < arguments.length - 2; n++)
                    void 0 === arguments[n] && (r[n] = void 0);
                }),
              r
            );
          });
        var oe = re;
        jt(
          { target: "RegExp", proto: !0, forced: /./.exec !== oe },
          { exec: oe }
        );
        var ae = function(t, e, i) {
            return (
              e +
              (i
                ? (function(t, e, i) {
                    var r,
                      n,
                      s = String(o(t)),
                      a = u(e),
                      l = s.length;
                    return a < 0 || a >= l
                      ? i
                        ? ""
                        : void 0
                      : (r = s.charCodeAt(a)) < 55296 ||
                        r > 56319 ||
                        a + 1 === l ||
                        (n = s.charCodeAt(a + 1)) < 56320 ||
                        n > 57343
                      ? i
                        ? s.charAt(a)
                        : r
                      : i
                      ? s.slice(a, a + 2)
                      : n - 56320 + ((r - 55296) << 10) + 65536;
                  })(t, e, !0).length
                : 1)
            );
          },
          le = function(t, e) {
            var i = t.exec;
            if ("function" == typeof i) {
              var n = i.call(t, e);
              if ("object" != typeof n)
                throw TypeError(
                  "RegExp exec method returned something other than an Object or null"
                );
              return n;
            }
            if ("RegExp" !== r(t))
              throw TypeError("RegExp#exec called on incompatible receiver");
            return oe.call(t, e);
          },
          ce = B("species"),
          ue = !e(function() {
            var t = /./;
            return (
              (t.exec = function() {
                var t = [];
                return (t.groups = { a: "7" }), t;
              }),
              "7" !== "".replace(t, "$<a>")
            );
          }),
          he = !e(function() {
            var t = /(?:)/,
              e = t.exec;
            t.exec = function() {
              return e.apply(this, arguments);
            };
            var i = "ab".split(t);
            return 2 !== i.length || "a" !== i[0] || "b" !== i[1];
          }),
          fe = function(t, i, r, n) {
            var s = B(t),
              o = !e(function() {
                var e = {};
                return (
                  (e[s] = function() {
                    return 7;
                  }),
                  7 != ""[t](e)
                );
              }),
              a =
                o &&
                !e(function() {
                  var e = !1,
                    i = /a/;
                  return (
                    (i.exec = function() {
                      return (e = !0), null;
                    }),
                    "split" === t &&
                      ((i.constructor = {}),
                      (i.constructor[ce] = function() {
                        return i;
                      })),
                    i[s](""),
                    !e
                  );
                });
            if (
              !o ||
              !a ||
              ("replace" === t && !ue) ||
              ("split" === t && !he)
            ) {
              var l = /./[s],
                c = r(s, ""[t], function(t, e, i, r, n) {
                  return e.exec === oe
                    ? o && !n
                      ? { done: !0, value: l.call(e, i, r) }
                      : { done: !0, value: t.call(i, e, r) }
                    : { done: !1 };
                }),
                u = c[0],
                h = c[1];
              dt(String.prototype, t, u),
                dt(
                  RegExp.prototype,
                  s,
                  2 == i
                    ? function(t, e) {
                        return h.call(t, this, e);
                      }
                    : function(t) {
                        return h.call(t, this);
                      }
                ),
                n && T(RegExp.prototype[s], "sham", !0);
            }
          };
        fe("match", 1, function(t, e, i) {
          return [
            function(e) {
              var i = o(this),
                r = null == e ? void 0 : e[t];
              return void 0 !== r ? r.call(e, i) : new RegExp(e)[t](String(i));
            },
            function(t) {
              var r = i(e, t, this);
              if (r.done) return r.value;
              var n = L(t),
                s = String(this);
              if (!n.global) return le(n, s);
              var o = n.unicode;
              n.lastIndex = 0;
              for (var a, l = [], c = 0; null !== (a = le(n, s)); ) {
                var u = String(a[0]);
                (l[c] = u),
                  "" === u && (n.lastIndex = ae(s, f(n.lastIndex), o)),
                  c++;
              }
              return 0 === c ? null : l;
            }
          ];
        });
        var de = Math.max,
          pe = Math.min,
          ve = Math.floor,
          ge = /\$([$&`']|\d\d?|<[^>]*>)/g,
          be = /\$([$&`']|\d\d?)/g;
        fe("replace", 2, function(t, e, i) {
          return [
            function(i, r) {
              var n = o(this),
                s = null == i ? void 0 : i[t];
              return void 0 !== s ? s.call(i, n, r) : e.call(String(n), i, r);
            },
            function(t, n) {
              var s = i(e, t, this, n);
              if (s.done) return s.value;
              var o = L(t),
                a = String(this),
                l = "function" == typeof n;
              l || (n = String(n));
              var c = o.global;
              if (c) {
                var h = o.unicode;
                o.lastIndex = 0;
              }
              for (var d = []; ; ) {
                var p = le(o, a);
                if (null === p) break;
                if ((d.push(p), !c)) break;
                "" === String(p[0]) && (o.lastIndex = ae(a, f(o.lastIndex), h));
              }
              for (var v, g = "", b = 0, m = 0; m < d.length; m++) {
                p = d[m];
                for (
                  var y = String(p[0]),
                    x = de(pe(u(p.index), a.length), 0),
                    E = [],
                    w = 1;
                  w < p.length;
                  w++
                )
                  E.push(void 0 === (v = p[w]) ? v : String(v));
                var O = p.groups;
                if (l) {
                  var _ = [y].concat(E, x, a);
                  void 0 !== O && _.push(O);
                  var S = String(n.apply(void 0, _));
                } else S = r(y, a, x, E, O, n);
                x >= b && ((g += a.slice(b, x) + S), (b = x + y.length));
              }
              return g + a.slice(b);
            }
          ];
          function r(t, i, r, n, s, o) {
            var l = r + t.length,
              c = n.length,
              u = be;
            return (
              void 0 !== s && ((s = a(s)), (u = ge)),
              e.call(o, u, function(e, o) {
                var a;
                switch (o.charAt(0)) {
                  case "$":
                    return "$";
                  case "&":
                    return t;
                  case "`":
                    return i.slice(0, r);
                  case "'":
                    return i.slice(l);
                  case "<":
                    a = s[o.slice(1, -1)];
                    break;
                  default:
                    var u = +o;
                    if (0 === u) return e;
                    if (u > c) {
                      var h = ve(u / 10);
                      return 0 === h
                        ? e
                        : h <= c
                        ? void 0 === n[h - 1]
                          ? o.charAt(1)
                          : n[h - 1] + o.charAt(1)
                        : e;
                    }
                    a = n[u - 1];
                }
                return void 0 === a ? "" : a;
              })
            );
          }
        });
        for (var me in {
          CSSRuleList: 0,
          CSSStyleDeclaration: 0,
          CSSValueList: 0,
          ClientRectList: 0,
          DOMRectList: 0,
          DOMStringList: 0,
          DOMTokenList: 1,
          DataTransferItemList: 0,
          FileList: 0,
          HTMLAllCollection: 0,
          HTMLCollection: 0,
          HTMLFormElement: 0,
          HTMLSelectElement: 0,
          MediaList: 0,
          MimeTypeArray: 0,
          NamedNodeMap: 0,
          NodeList: 1,
          PaintRequestList: 0,
          Plugin: 0,
          PluginArray: 0,
          SVGLengthList: 0,
          SVGNumberList: 0,
          SVGPathSegList: 0,
          SVGPointList: 0,
          SVGStringList: 0,
          SVGTransformList: 0,
          SourceBufferList: 0,
          StyleSheetList: 0,
          TextTrackCueList: 0,
          TextTrackList: 0,
          TouchList: 0
        }) {
          var ye = E[me],
            xe = ye && ye.prototype;
          if (xe && xe.forEach !== Vt)
            try {
              T(xe, "forEach", Vt);
            } catch (t) {
              xe.forEach = Vt;
            }
        }
        var Ee = "Expected a function",
          we = NaN,
          Oe = "[object Symbol]",
          _e = /^\s+|\s+$/g,
          Se = /^[-+]0x[0-9a-f]+$/i,
          Le = /^0b[01]+$/i,
          Ae = /^0o[0-7]+$/i,
          Me = parseInt,
          ke = "object" == typeof v && v && v.Object === Object && v,
          We =
            "object" == typeof self && self && self.Object === Object && self,
          Te = ke || We || Function("return this")(),
          Re = Object.prototype.toString,
          je = Math.max,
          Ce = Math.min,
          Ne = function() {
            return Te.Date.now();
          };
        function ze(t, e, i) {
          var r,
            n,
            s,
            o,
            a,
            l,
            c = 0,
            u = !1,
            h = !1,
            f = !0;
          if ("function" != typeof t) throw new TypeError(Ee);
          function d(e) {
            var i = r,
              s = n;
            return (r = n = void 0), (c = e), (o = t.apply(s, i));
          }
          function p(t) {
            var i = t - l;
            return void 0 === l || i >= e || i < 0 || (h && t - c >= s);
          }
          function v() {
            var t = Ne();
            if (p(t)) return g(t);
            a = setTimeout(
              v,
              (function(t) {
                var i = e - (t - l);
                return h ? Ce(i, s - (t - c)) : i;
              })(t)
            );
          }
          function g(t) {
            return (a = void 0), f && r ? d(t) : ((r = n = void 0), o);
          }
          function b() {
            var t = Ne(),
              i = p(t);
            if (((r = arguments), (n = this), (l = t), i)) {
              if (void 0 === a)
                return (function(t) {
                  return (c = t), (a = setTimeout(v, e)), u ? d(t) : o;
                })(l);
              if (h) return (a = setTimeout(v, e)), d(l);
            }
            return void 0 === a && (a = setTimeout(v, e)), o;
          }
          return (
            (e = Ve(e) || 0),
            De(i) &&
              ((u = !!i.leading),
              (s = (h = "maxWait" in i) ? je(Ve(i.maxWait) || 0, e) : s),
              (f = "trailing" in i ? !!i.trailing : f)),
            (b.cancel = function() {
              void 0 !== a && clearTimeout(a),
                (c = 0),
                (r = l = n = a = void 0);
            }),
            (b.flush = function() {
              return void 0 === a ? o : g(Ne());
            }),
            b
          );
        }
        function De(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        function Ve(t) {
          if ("number" == typeof t) return t;
          if (
            (function(t) {
              return (
                "symbol" == typeof t ||
                ((function(t) {
                  return !!t && "object" == typeof t;
                })(t) &&
                  Re.call(t) == Oe)
              );
            })(t)
          )
            return we;
          if (De(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = De(e) ? e + "" : e;
          }
          if ("string" != typeof t) return 0 === t ? t : +t;
          t = t.replace(_e, "");
          var i = Le.test(t);
          return i || Ae.test(t)
            ? Me(t.slice(2), i ? 2 : 8)
            : Se.test(t)
            ? we
            : +t;
        }
        var Ie = function(t, e, i) {
            var r = !0,
              n = !0;
            if ("function" != typeof t) throw new TypeError(Ee);
            return (
              De(i) &&
                ((r = "leading" in i ? !!i.leading : r),
                (n = "trailing" in i ? !!i.trailing : n)),
              ze(t, e, { leading: r, maxWait: e, trailing: n })
            );
          },
          Be = "Expected a function",
          Pe = NaN,
          He = "[object Symbol]",
          Fe = /^\s+|\s+$/g,
          qe = /^[-+]0x[0-9a-f]+$/i,
          $e = /^0b[01]+$/i,
          Ye = /^0o[0-7]+$/i,
          Xe = parseInt,
          Ge = "object" == typeof v && v && v.Object === Object && v,
          Ke =
            "object" == typeof self && self && self.Object === Object && self,
          Ue = Ge || Ke || Function("return this")(),
          Je = Object.prototype.toString,
          Qe = Math.max,
          Ze = Math.min,
          ti = function() {
            return Ue.Date.now();
          };
        function ei(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        function ii(t) {
          if ("number" == typeof t) return t;
          if (
            (function(t) {
              return (
                "symbol" == typeof t ||
                ((function(t) {
                  return !!t && "object" == typeof t;
                })(t) &&
                  Je.call(t) == He)
              );
            })(t)
          )
            return Pe;
          if (ei(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = ei(e) ? e + "" : e;
          }
          if ("string" != typeof t) return 0 === t ? t : +t;
          t = t.replace(Fe, "");
          var i = $e.test(t);
          return i || Ye.test(t)
            ? Xe(t.slice(2), i ? 2 : 8)
            : qe.test(t)
            ? Pe
            : +t;
        }
        var ri = function(t, e, i) {
            var r,
              n,
              s,
              o,
              a,
              l,
              c = 0,
              u = !1,
              h = !1,
              f = !0;
            if ("function" != typeof t) throw new TypeError(Be);
            function d(e) {
              var i = r,
                s = n;
              return (r = n = void 0), (c = e), (o = t.apply(s, i));
            }
            function p(t) {
              var i = t - l;
              return void 0 === l || i >= e || i < 0 || (h && t - c >= s);
            }
            function v() {
              var t = ti();
              if (p(t)) return g(t);
              a = setTimeout(
                v,
                (function(t) {
                  var i = e - (t - l);
                  return h ? Ze(i, s - (t - c)) : i;
                })(t)
              );
            }
            function g(t) {
              return (a = void 0), f && r ? d(t) : ((r = n = void 0), o);
            }
            function b() {
              var t = ti(),
                i = p(t);
              if (((r = arguments), (n = this), (l = t), i)) {
                if (void 0 === a)
                  return (function(t) {
                    return (c = t), (a = setTimeout(v, e)), u ? d(t) : o;
                  })(l);
                if (h) return (a = setTimeout(v, e)), d(l);
              }
              return void 0 === a && (a = setTimeout(v, e)), o;
            }
            return (
              (e = ii(e) || 0),
              ei(i) &&
                ((u = !!i.leading),
                (s = (h = "maxWait" in i) ? Qe(ii(i.maxWait) || 0, e) : s),
                (f = "trailing" in i ? !!i.trailing : f)),
              (b.cancel = function() {
                void 0 !== a && clearTimeout(a),
                  (c = 0),
                  (r = l = n = a = void 0);
              }),
              (b.flush = function() {
                return void 0 === a ? o : g(ti());
              }),
              b
            );
          },
          ni = "Expected a function",
          si = "__lodash_hash_undefined__",
          oi = "[object Function]",
          ai = "[object GeneratorFunction]",
          li = /^\[object .+?Constructor\]$/,
          ci = "object" == typeof v && v && v.Object === Object && v,
          ui =
            "object" == typeof self && self && self.Object === Object && self,
          hi = ci || ui || Function("return this")();
        var fi = Array.prototype,
          di = Function.prototype,
          pi = Object.prototype,
          vi = hi["__core-js_shared__"],
          gi = (function() {
            var t = /[^.]+$/.exec((vi && vi.keys && vi.keys.IE_PROTO) || "");
            return t ? "Symbol(src)_1." + t : "";
          })(),
          bi = di.toString,
          mi = pi.hasOwnProperty,
          yi = pi.toString,
          xi = RegExp(
            "^" +
              bi
                .call(mi)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?"
                ) +
              "$"
          ),
          Ei = fi.splice,
          wi = Wi(hi, "Map"),
          Oi = Wi(Object, "create");
        function _i(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Si(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Li(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Ai(t, e) {
          for (var i, r, n = t.length; n--; )
            if ((i = t[n][0]) === (r = e) || (i != i && r != r)) return n;
          return -1;
        }
        function Mi(t) {
          return (
            !(!Ri(t) || ((e = t), gi && gi in e)) &&
            ((function(t) {
              var e = Ri(t) ? yi.call(t) : "";
              return e == oi || e == ai;
            })(t) ||
            (function(t) {
              var e = !1;
              if (null != t && "function" != typeof t.toString)
                try {
                  e = !!(t + "");
                } catch (t) {}
              return e;
            })(t)
              ? xi
              : li
            ).test(
              (function(t) {
                if (null != t) {
                  try {
                    return bi.call(t);
                  } catch (t) {}
                  try {
                    return t + "";
                  } catch (t) {}
                }
                return "";
              })(t)
            )
          );
          var e;
        }
        function ki(t, e) {
          var i,
            r,
            n = t.__data__;
          return ("string" == (r = typeof (i = e)) ||
          "number" == r ||
          "symbol" == r ||
          "boolean" == r
          ? "__proto__" !== i
          : null === i)
            ? n["string" == typeof e ? "string" : "hash"]
            : n.map;
        }
        function Wi(t, e) {
          var i = (function(t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return Mi(i) ? i : void 0;
        }
        function Ti(t, e) {
          if ("function" != typeof t || (e && "function" != typeof e))
            throw new TypeError(ni);
          var i = function() {
            var r = arguments,
              n = e ? e.apply(this, r) : r[0],
              s = i.cache;
            if (s.has(n)) return s.get(n);
            var o = t.apply(this, r);
            return (i.cache = s.set(n, o)), o;
          };
          return (i.cache = new (Ti.Cache || Li)()), i;
        }
        function Ri(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        (_i.prototype.clear = function() {
          this.__data__ = Oi ? Oi(null) : {};
        }),
          (_i.prototype.delete = function(t) {
            return this.has(t) && delete this.__data__[t];
          }),
          (_i.prototype.get = function(t) {
            var e = this.__data__;
            if (Oi) {
              var i = e[t];
              return i === si ? void 0 : i;
            }
            return mi.call(e, t) ? e[t] : void 0;
          }),
          (_i.prototype.has = function(t) {
            var e = this.__data__;
            return Oi ? void 0 !== e[t] : mi.call(e, t);
          }),
          (_i.prototype.set = function(t, e) {
            return (this.__data__[t] = Oi && void 0 === e ? si : e), this;
          }),
          (Si.prototype.clear = function() {
            this.__data__ = [];
          }),
          (Si.prototype.delete = function(t) {
            var e = this.__data__,
              i = Ai(e, t);
            return !(
              i < 0 || (i == e.length - 1 ? e.pop() : Ei.call(e, i, 1), 0)
            );
          }),
          (Si.prototype.get = function(t) {
            var e = this.__data__,
              i = Ai(e, t);
            return i < 0 ? void 0 : e[i][1];
          }),
          (Si.prototype.has = function(t) {
            return Ai(this.__data__, t) > -1;
          }),
          (Si.prototype.set = function(t, e) {
            var i = this.__data__,
              r = Ai(i, t);
            return r < 0 ? i.push([t, e]) : (i[r][1] = e), this;
          }),
          (Li.prototype.clear = function() {
            this.__data__ = {
              hash: new _i(),
              map: new (wi || Si)(),
              string: new _i()
            };
          }),
          (Li.prototype.delete = function(t) {
            return ki(this, t).delete(t);
          }),
          (Li.prototype.get = function(t) {
            return ki(this, t).get(t);
          }),
          (Li.prototype.has = function(t) {
            return ki(this, t).has(t);
          }),
          (Li.prototype.set = function(t, e) {
            return ki(this, t).set(t, e), this;
          }),
          (Ti.Cache = Li);
        var ji = Ti,
          Ci = (function() {
            if ("undefined" != typeof Map) return Map;
            function t(t, e) {
              var i = -1;
              return (
                t.some(function(t, r) {
                  return t[0] === e && ((i = r), !0);
                }),
                i
              );
            }
            return (function() {
              function e() {
                this.__entries__ = [];
              }
              return (
                Object.defineProperty(e.prototype, "size", {
                  get: function() {
                    return this.__entries__.length;
                  },
                  enumerable: !0,
                  configurable: !0
                }),
                (e.prototype.get = function(e) {
                  var i = t(this.__entries__, e),
                    r = this.__entries__[i];
                  return r && r[1];
                }),
                (e.prototype.set = function(e, i) {
                  var r = t(this.__entries__, e);
                  ~r
                    ? (this.__entries__[r][1] = i)
                    : this.__entries__.push([e, i]);
                }),
                (e.prototype.delete = function(e) {
                  var i = this.__entries__,
                    r = t(i, e);
                  ~r && i.splice(r, 1);
                }),
                (e.prototype.has = function(e) {
                  return !!~t(this.__entries__, e);
                }),
                (e.prototype.clear = function() {
                  this.__entries__.splice(0);
                }),
                (e.prototype.forEach = function(t, e) {
                  void 0 === e && (e = null);
                  for (var i = 0, r = this.__entries__; i < r.length; i++) {
                    var n = r[i];
                    t.call(e, n[1], n[0]);
                  }
                }),
                e
              );
            })();
          })(),
          Ni =
            "undefined" != typeof window &&
            "undefined" != typeof document &&
            window.document === document,
          zi =
            "undefined" != typeof global && global.Math === Math
              ? global
              : "undefined" != typeof self && self.Math === Math
              ? self
              : "undefined" != typeof window && window.Math === Math
              ? window
              : Function("return this")(),
          Di =
            "function" == typeof requestAnimationFrame
              ? requestAnimationFrame.bind(zi)
              : function(t) {
                  return setTimeout(function() {
                    return t(Date.now());
                  }, 1e3 / 60);
                },
          Vi = 2;
        var Ii = 20,
          Bi = [
            "top",
            "right",
            "bottom",
            "left",
            "width",
            "height",
            "size",
            "weight"
          ],
          Pi = "undefined" != typeof MutationObserver,
          Hi = (function() {
            function t() {
              (this.connected_ = !1),
                (this.mutationEventsAdded_ = !1),
                (this.mutationsObserver_ = null),
                (this.observers_ = []),
                (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
                (this.refresh = (function(t, e) {
                  var i = !1,
                    r = !1,
                    n = 0;
                  function s() {
                    i && ((i = !1), t()), r && a();
                  }
                  function o() {
                    Di(s);
                  }
                  function a() {
                    var t = Date.now();
                    if (i) {
                      if (t - n < Vi) return;
                      r = !0;
                    } else (i = !0), (r = !1), setTimeout(o, e);
                    n = t;
                  }
                  return a;
                })(this.refresh.bind(this), Ii));
            }
            return (
              (t.prototype.addObserver = function(t) {
                ~this.observers_.indexOf(t) || this.observers_.push(t),
                  this.connected_ || this.connect_();
              }),
              (t.prototype.removeObserver = function(t) {
                var e = this.observers_,
                  i = e.indexOf(t);
                ~i && e.splice(i, 1),
                  !e.length && this.connected_ && this.disconnect_();
              }),
              (t.prototype.refresh = function() {
                this.updateObservers_() && this.refresh();
              }),
              (t.prototype.updateObservers_ = function() {
                var t = this.observers_.filter(function(t) {
                  return t.gatherActive(), t.hasActive();
                });
                return (
                  t.forEach(function(t) {
                    return t.broadcastActive();
                  }),
                  t.length > 0
                );
              }),
              (t.prototype.connect_ = function() {
                Ni &&
                  !this.connected_ &&
                  (document.addEventListener(
                    "transitionend",
                    this.onTransitionEnd_
                  ),
                  window.addEventListener("resize", this.refresh),
                  Pi
                    ? ((this.mutationsObserver_ = new MutationObserver(
                        this.refresh
                      )),
                      this.mutationsObserver_.observe(document, {
                        attributes: !0,
                        childList: !0,
                        characterData: !0,
                        subtree: !0
                      }))
                    : (document.addEventListener(
                        "DOMSubtreeModified",
                        this.refresh
                      ),
                      (this.mutationEventsAdded_ = !0)),
                  (this.connected_ = !0));
              }),
              (t.prototype.disconnect_ = function() {
                Ni &&
                  this.connected_ &&
                  (document.removeEventListener(
                    "transitionend",
                    this.onTransitionEnd_
                  ),
                  window.removeEventListener("resize", this.refresh),
                  this.mutationsObserver_ &&
                    this.mutationsObserver_.disconnect(),
                  this.mutationEventsAdded_ &&
                    document.removeEventListener(
                      "DOMSubtreeModified",
                      this.refresh
                    ),
                  (this.mutationsObserver_ = null),
                  (this.mutationEventsAdded_ = !1),
                  (this.connected_ = !1));
              }),
              (t.prototype.onTransitionEnd_ = function(t) {
                var e = t.propertyName,
                  i = void 0 === e ? "" : e;
                Bi.some(function(t) {
                  return !!~i.indexOf(t);
                }) && this.refresh();
              }),
              (t.getInstance = function() {
                return (
                  this.instance_ || (this.instance_ = new t()), this.instance_
                );
              }),
              (t.instance_ = null),
              t
            );
          })(),
          Fi = function(t, e) {
            for (var i = 0, r = Object.keys(e); i < r.length; i++) {
              var n = r[i];
              Object.defineProperty(t, n, {
                value: e[n],
                enumerable: !1,
                writable: !1,
                configurable: !0
              });
            }
            return t;
          },
          qi = function(t) {
            return (t && t.ownerDocument && t.ownerDocument.defaultView) || zi;
          },
          $i = Ji(0, 0, 0, 0);
        function Yi(t) {
          return parseFloat(t) || 0;
        }
        function Xi(t) {
          for (var e = [], i = 1; i < arguments.length; i++)
            e[i - 1] = arguments[i];
          return e.reduce(function(e, i) {
            return e + Yi(t["border-" + i + "-width"]);
          }, 0);
        }
        function Gi(t) {
          var e = t.clientWidth,
            i = t.clientHeight;
          if (!e && !i) return $i;
          var r = qi(t).getComputedStyle(t),
            n = (function(t) {
              for (
                var e = {}, i = 0, r = ["top", "right", "bottom", "left"];
                i < r.length;
                i++
              ) {
                var n = r[i],
                  s = t["padding-" + n];
                e[n] = Yi(s);
              }
              return e;
            })(r),
            s = n.left + n.right,
            o = n.top + n.bottom,
            a = Yi(r.width),
            l = Yi(r.height);
          if (
            ("border-box" === r.boxSizing &&
              (Math.round(a + s) !== e && (a -= Xi(r, "left", "right") + s),
              Math.round(l + o) !== i && (l -= Xi(r, "top", "bottom") + o)),
            !(function(t) {
              return t === qi(t).document.documentElement;
            })(t))
          ) {
            var c = Math.round(a + s) - e,
              u = Math.round(l + o) - i;
            1 !== Math.abs(c) && (a -= c), 1 !== Math.abs(u) && (l -= u);
          }
          return Ji(n.left, n.top, a, l);
        }
        var Ki =
          "undefined" != typeof SVGGraphicsElement
            ? function(t) {
                return t instanceof qi(t).SVGGraphicsElement;
              }
            : function(t) {
                return (
                  t instanceof qi(t).SVGElement &&
                  "function" == typeof t.getBBox
                );
              };
        function Ui(t) {
          return Ni
            ? Ki(t)
              ? (function(t) {
                  var e = t.getBBox();
                  return Ji(0, 0, e.width, e.height);
                })(t)
              : Gi(t)
            : $i;
        }
        function Ji(t, e, i, r) {
          return { x: t, y: e, width: i, height: r };
        }
        var Qi = (function() {
            function t(t) {
              (this.broadcastWidth = 0),
                (this.broadcastHeight = 0),
                (this.contentRect_ = Ji(0, 0, 0, 0)),
                (this.target = t);
            }
            return (
              (t.prototype.isActive = function() {
                var t = Ui(this.target);
                return (
                  (this.contentRect_ = t),
                  t.width !== this.broadcastWidth ||
                    t.height !== this.broadcastHeight
                );
              }),
              (t.prototype.broadcastRect = function() {
                var t = this.contentRect_;
                return (
                  (this.broadcastWidth = t.width),
                  (this.broadcastHeight = t.height),
                  t
                );
              }),
              t
            );
          })(),
          Zi = (function() {
            return function(t, e) {
              var i,
                r,
                n,
                s,
                o,
                a,
                l,
                c =
                  ((r = (i = e).x),
                  (n = i.y),
                  (s = i.width),
                  (o = i.height),
                  (a =
                    "undefined" != typeof DOMRectReadOnly
                      ? DOMRectReadOnly
                      : Object),
                  (l = Object.create(a.prototype)),
                  Fi(l, {
                    x: r,
                    y: n,
                    width: s,
                    height: o,
                    top: n,
                    right: r + s,
                    bottom: o + n,
                    left: r
                  }),
                  l);
              Fi(this, { target: t, contentRect: c });
            };
          })(),
          tr = (function() {
            function t(t, e, i) {
              if (
                ((this.activeObservations_ = []),
                (this.observations_ = new Ci()),
                "function" != typeof t)
              )
                throw new TypeError(
                  "The callback provided as parameter 1 is not a function."
                );
              (this.callback_ = t),
                (this.controller_ = e),
                (this.callbackCtx_ = i);
            }
            return (
              (t.prototype.observe = function(t) {
                if (!arguments.length)
                  throw new TypeError(
                    "1 argument required, but only 0 present."
                  );
                if (
                  "undefined" != typeof Element &&
                  Element instanceof Object
                ) {
                  if (!(t instanceof qi(t).Element))
                    throw new TypeError(
                      'parameter 1 is not of type "Element".'
                    );
                  var e = this.observations_;
                  e.has(t) ||
                    (e.set(t, new Qi(t)),
                    this.controller_.addObserver(this),
                    this.controller_.refresh());
                }
              }),
              (t.prototype.unobserve = function(t) {
                if (!arguments.length)
                  throw new TypeError(
                    "1 argument required, but only 0 present."
                  );
                if (
                  "undefined" != typeof Element &&
                  Element instanceof Object
                ) {
                  if (!(t instanceof qi(t).Element))
                    throw new TypeError(
                      'parameter 1 is not of type "Element".'
                    );
                  var e = this.observations_;
                  e.has(t) &&
                    (e.delete(t),
                    e.size || this.controller_.removeObserver(this));
                }
              }),
              (t.prototype.disconnect = function() {
                this.clearActive(),
                  this.observations_.clear(),
                  this.controller_.removeObserver(this);
              }),
              (t.prototype.gatherActive = function() {
                var t = this;
                this.clearActive(),
                  this.observations_.forEach(function(e) {
                    e.isActive() && t.activeObservations_.push(e);
                  });
              }),
              (t.prototype.broadcastActive = function() {
                if (this.hasActive()) {
                  var t = this.callbackCtx_,
                    e = this.activeObservations_.map(function(t) {
                      return new Zi(t.target, t.broadcastRect());
                    });
                  this.callback_.call(t, e, t), this.clearActive();
                }
              }),
              (t.prototype.clearActive = function() {
                this.activeObservations_.splice(0);
              }),
              (t.prototype.hasActive = function() {
                return this.activeObservations_.length > 0;
              }),
              t
            );
          })(),
          er = "undefined" != typeof WeakMap ? new WeakMap() : new Ci(),
          ir = (function() {
            return function t(e) {
              if (!(this instanceof t))
                throw new TypeError("Cannot call a class as a function.");
              if (!arguments.length)
                throw new TypeError("1 argument required, but only 0 present.");
              var i = Hi.getInstance(),
                r = new tr(e, i, this);
              er.set(this, r);
            };
          })();
        ["observe", "unobserve", "disconnect"].forEach(function(t) {
          ir.prototype[t] = function() {
            var e;
            return (e = er.get(this))[t].apply(e, arguments);
          };
        });
        var rr = void 0 !== zi.ResizeObserver ? zi.ResizeObserver : ir,
          nr = !(
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
          );
        function sr() {
          if ("undefined" == typeof document) return 0;
          var t = document.body,
            e = document.createElement("div"),
            i = e.style;
          (i.position = "fixed"),
            (i.left = 0),
            (i.visibility = "hidden"),
            (i.overflowY = "scroll"),
            t.appendChild(e);
          var r = e.getBoundingClientRect().right;
          return t.removeChild(e), r;
        }
        var or = (function() {
          function t(e, i) {
            var r = this;
            (this.onScroll = function() {
              r.scrollXTicking ||
                (window.requestAnimationFrame(r.scrollX),
                (r.scrollXTicking = !0)),
                r.scrollYTicking ||
                  (window.requestAnimationFrame(r.scrollY),
                  (r.scrollYTicking = !0));
            }),
              (this.scrollX = function() {
                r.axis.x.isOverflowing &&
                  (r.showScrollbar("x"), r.positionScrollbar("x")),
                  (r.scrollXTicking = !1);
              }),
              (this.scrollY = function() {
                r.axis.y.isOverflowing &&
                  (r.showScrollbar("y"), r.positionScrollbar("y")),
                  (r.scrollYTicking = !1);
              }),
              (this.onMouseEnter = function() {
                r.showScrollbar("x"), r.showScrollbar("y");
              }),
              (this.onMouseMove = function(t) {
                (r.mouseX = t.clientX),
                  (r.mouseY = t.clientY),
                  (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                    r.onMouseMoveForAxis("x"),
                  (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                    r.onMouseMoveForAxis("y");
              }),
              (this.onMouseLeave = function() {
                r.onMouseMove.cancel(),
                  (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                    r.onMouseLeaveForAxis("x"),
                  (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                    r.onMouseLeaveForAxis("y"),
                  (r.mouseX = -1),
                  (r.mouseY = -1);
              }),
              (this.onWindowResize = function() {
                (r.scrollbarWidth = sr()), r.hideNativeScrollbar();
              }),
              (this.hideScrollbars = function() {
                (r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect()),
                  (r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect()),
                  r.isWithinBounds(r.axis.y.track.rect) ||
                    (r.axis.y.scrollbar.el.classList.remove(
                      r.classNames.visible
                    ),
                    (r.axis.y.isVisible = !1)),
                  r.isWithinBounds(r.axis.x.track.rect) ||
                    (r.axis.x.scrollbar.el.classList.remove(
                      r.classNames.visible
                    ),
                    (r.axis.x.isVisible = !1));
              }),
              (this.onPointerEvent = function(t) {
                var e, i;
                (r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect()),
                  (r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect()),
                  (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                    (i = r.isWithinBounds(r.axis.x.scrollbar.rect)),
                  (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                    (e = r.isWithinBounds(r.axis.y.scrollbar.rect)),
                  (e || i) &&
                    (t.preventDefault(),
                    t.stopPropagation(),
                    "mousedown" === t.type &&
                      (e && r.onDragStart(t, "y"), i && r.onDragStart(t, "x")));
              }),
              (this.drag = function(e) {
                var i = r.axis[r.draggedAxis].track,
                  n = i.rect[r.axis[r.draggedAxis].sizeAttr],
                  s = r.axis[r.draggedAxis].scrollbar,
                  o = r.contentWrapperEl[r.axis[r.draggedAxis].scrollSizeAttr],
                  a = parseInt(r.elStyles[r.axis[r.draggedAxis].sizeAttr], 10);
                e.preventDefault(), e.stopPropagation();
                var l =
                  ((("y" === r.draggedAxis ? e.pageY : e.pageX) -
                    i.rect[r.axis[r.draggedAxis].offsetAttr] -
                    r.axis[r.draggedAxis].dragOffset) /
                    (n - s.size)) *
                  (o - a);
                "x" === r.draggedAxis &&
                  ((l =
                    r.isRtl && t.getRtlHelpers().isRtlScrollbarInverted
                      ? l - (n + s.size)
                      : l),
                  (l =
                    r.isRtl && t.getRtlHelpers().isRtlScrollingInverted
                      ? -l
                      : l)),
                  (r.contentWrapperEl[
                    r.axis[r.draggedAxis].scrollOffsetAttr
                  ] = l);
              }),
              (this.onEndDrag = function(t) {
                t.preventDefault(),
                  t.stopPropagation(),
                  r.el.classList.remove(r.classNames.dragging),
                  document.removeEventListener("mousemove", r.drag, !0),
                  document.removeEventListener("mouseup", r.onEndDrag, !0),
                  (r.removePreventClickId = window.setTimeout(function() {
                    document.removeEventListener("click", r.preventClick, !0),
                      document.removeEventListener(
                        "dblclick",
                        r.preventClick,
                        !0
                      ),
                      (r.removePreventClickId = null);
                  }));
              }),
              (this.preventClick = function(t) {
                t.preventDefault(), t.stopPropagation();
              }),
              (this.el = e),
              this.flashTimeout,
              this.contentEl,
              this.contentWrapperEl,
              this.offsetEl,
              this.maskEl,
              this.globalObserver,
              this.mutationObserver,
              this.resizeObserver,
              this.scrollbarWidth,
              (this.minScrollbarWidth = 20),
              (this.options = Object.assign({}, t.defaultOptions, i)),
              (this.classNames = Object.assign(
                {},
                t.defaultOptions.classNames,
                this.options.classNames
              )),
              this.isRtl,
              (this.axis = {
                x: {
                  scrollOffsetAttr: "scrollLeft",
                  sizeAttr: "width",
                  scrollSizeAttr: "scrollWidth",
                  offsetAttr: "left",
                  overflowAttr: "overflowX",
                  dragOffset: 0,
                  isOverflowing: !0,
                  isVisible: !1,
                  forceVisible: !1,
                  track: {},
                  scrollbar: {}
                },
                y: {
                  scrollOffsetAttr: "scrollTop",
                  sizeAttr: "height",
                  scrollSizeAttr: "scrollHeight",
                  offsetAttr: "top",
                  overflowAttr: "overflowY",
                  dragOffset: 0,
                  isOverflowing: !0,
                  isVisible: !1,
                  forceVisible: !1,
                  track: {},
                  scrollbar: {}
                }
              }),
              (this.removePreventClickId = null),
              this.el.SimpleBar ||
                ((this.recalculate = Ie(this.recalculate.bind(this), 64)),
                (this.onMouseMove = Ie(this.onMouseMove.bind(this), 64)),
                (this.hideScrollbars = ri(
                  this.hideScrollbars.bind(this),
                  this.options.timeout
                )),
                (this.onWindowResize = ri(this.onWindowResize.bind(this), 64, {
                  leading: !0
                })),
                (t.getRtlHelpers = ji(t.getRtlHelpers)),
                this.init());
          }
          (t.getRtlHelpers = function() {
            var e = document.createElement("div");
            e.innerHTML =
              '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
            var i = e.firstElementChild;
            document.body.appendChild(i);
            var r = i.firstElementChild;
            i.scrollLeft = 0;
            var n = t.getOffset(i),
              s = t.getOffset(r);
            i.scrollLeft = 999;
            var o = t.getOffset(r);
            return {
              isRtlScrollingInverted: n.left !== s.left && s.left - o.left != 0,
              isRtlScrollbarInverted: n.left !== s.left
            };
          }),
            (t.initHtmlApi = function() {
              (this.initDOMLoadedElements = this.initDOMLoadedElements.bind(
                this
              )),
                "undefined" != typeof MutationObserver &&
                  ((this.globalObserver = new MutationObserver(function(e) {
                    e.forEach(function(e) {
                      Array.prototype.forEach.call(e.addedNodes, function(e) {
                        1 === e.nodeType &&
                          (e.hasAttribute("data-simplebar")
                            ? !e.SimpleBar && new t(e, t.getElOptions(e))
                            : Array.prototype.forEach.call(
                                e.querySelectorAll("[data-simplebar]"),
                                function(e) {
                                  !e.SimpleBar && new t(e, t.getElOptions(e));
                                }
                              ));
                      }),
                        Array.prototype.forEach.call(e.removedNodes, function(
                          t
                        ) {
                          1 === t.nodeType &&
                            (t.hasAttribute("data-simplebar")
                              ? t.SimpleBar && t.SimpleBar.unMount()
                              : Array.prototype.forEach.call(
                                  t.querySelectorAll("[data-simplebar]"),
                                  function(t) {
                                    t.SimpleBar && t.SimpleBar.unMount();
                                  }
                                ));
                        });
                    });
                  })),
                  this.globalObserver.observe(document, {
                    childList: !0,
                    subtree: !0
                  })),
                "complete" === document.readyState ||
                ("loading" !== document.readyState &&
                  !document.documentElement.doScroll)
                  ? window.setTimeout(this.initDOMLoadedElements)
                  : (document.addEventListener(
                      "DOMContentLoaded",
                      this.initDOMLoadedElements
                    ),
                    window.addEventListener(
                      "load",
                      this.initDOMLoadedElements
                    ));
            }),
            (t.getElOptions = function(t) {
              return Array.prototype.reduce.call(
                t.attributes,
                function(t, e) {
                  var i = e.name.match(/data-simplebar-(.+)/);
                  if (i) {
                    var r = i[1].replace(/\W+(.)/g, function(t, e) {
                      return e.toUpperCase();
                    });
                    switch (e.value) {
                      case "true":
                        t[r] = !0;
                        break;
                      case "false":
                        t[r] = !1;
                        break;
                      case void 0:
                        t[r] = !0;
                        break;
                      default:
                        t[r] = e.value;
                    }
                  }
                  return t;
                },
                {}
              );
            }),
            (t.removeObserver = function() {
              this.globalObserver.disconnect();
            }),
            (t.initDOMLoadedElements = function() {
              document.removeEventListener(
                "DOMContentLoaded",
                this.initDOMLoadedElements
              ),
                window.removeEventListener("load", this.initDOMLoadedElements),
                Array.prototype.forEach.call(
                  document.querySelectorAll("[data-simplebar]"),
                  function(e) {
                    e.SimpleBar || new t(e, t.getElOptions(e));
                  }
                );
            }),
            (t.getOffset = function(t) {
              var e = t.getBoundingClientRect();
              return {
                top:
                  e.top +
                  (window.pageYOffset || document.documentElement.scrollTop),
                left:
                  e.left +
                  (window.pageXOffset || document.documentElement.scrollLeft)
              };
            });
          var e = t.prototype;
          return (
            (e.init = function() {
              (this.el.SimpleBar = this),
                nr &&
                  (this.initDOM(),
                  (this.scrollbarWidth = sr()),
                  this.recalculate(),
                  this.initListeners());
            }),
            (e.initDOM = function() {
              var t = this;
              if (
                Array.prototype.filter.call(this.el.children, function(e) {
                  return e.classList.contains(t.classNames.wrapper);
                }).length
              )
                (this.wrapperEl = this.el.querySelector(
                  "." + this.classNames.wrapper
                )),
                  (this.contentWrapperEl = this.el.querySelector(
                    "." + this.classNames.contentWrapper
                  )),
                  (this.offsetEl = this.el.querySelector(
                    "." + this.classNames.offset
                  )),
                  (this.maskEl = this.el.querySelector(
                    "." + this.classNames.mask
                  )),
                  (this.contentEl = this.el.querySelector(
                    "." + this.classNames.contentEl
                  )),
                  (this.placeholderEl = this.el.querySelector(
                    "." + this.classNames.placeholder
                  )),
                  (this.heightAutoObserverWrapperEl = this.el.querySelector(
                    "." + this.classNames.heightAutoObserverWrapperEl
                  )),
                  (this.heightAutoObserverEl = this.el.querySelector(
                    "." + this.classNames.heightAutoObserverEl
                  )),
                  (this.axis.x.track.el = this.findChild(
                    this.el,
                    "." +
                      this.classNames.track +
                      "." +
                      this.classNames.horizontal
                  )),
                  (this.axis.y.track.el = this.findChild(
                    this.el,
                    "." + this.classNames.track + "." + this.classNames.vertical
                  ));
              else {
                for (
                  this.wrapperEl = document.createElement("div"),
                    this.contentWrapperEl = document.createElement("div"),
                    this.offsetEl = document.createElement("div"),
                    this.maskEl = document.createElement("div"),
                    this.contentEl = document.createElement("div"),
                    this.placeholderEl = document.createElement("div"),
                    this.heightAutoObserverWrapperEl = document.createElement(
                      "div"
                    ),
                    this.heightAutoObserverEl = document.createElement("div"),
                    this.wrapperEl.classList.add(this.classNames.wrapper),
                    this.contentWrapperEl.classList.add(
                      this.classNames.contentWrapper
                    ),
                    this.offsetEl.classList.add(this.classNames.offset),
                    this.maskEl.classList.add(this.classNames.mask),
                    this.contentEl.classList.add(this.classNames.contentEl),
                    this.placeholderEl.classList.add(
                      this.classNames.placeholder
                    ),
                    this.heightAutoObserverWrapperEl.classList.add(
                      this.classNames.heightAutoObserverWrapperEl
                    ),
                    this.heightAutoObserverEl.classList.add(
                      this.classNames.heightAutoObserverEl
                    );
                  this.el.firstChild;

                )
                  this.contentEl.appendChild(this.el.firstChild);
                this.contentWrapperEl.appendChild(this.contentEl),
                  this.offsetEl.appendChild(this.contentWrapperEl),
                  this.maskEl.appendChild(this.offsetEl),
                  this.heightAutoObserverWrapperEl.appendChild(
                    this.heightAutoObserverEl
                  ),
                  this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
                  this.wrapperEl.appendChild(this.maskEl),
                  this.wrapperEl.appendChild(this.placeholderEl),
                  this.el.appendChild(this.wrapperEl);
              }
              if (!this.axis.x.track.el || !this.axis.y.track.el) {
                var e = document.createElement("div"),
                  i = document.createElement("div");
                e.classList.add(this.classNames.track),
                  i.classList.add(this.classNames.scrollbar),
                  e.appendChild(i),
                  (this.axis.x.track.el = e.cloneNode(!0)),
                  this.axis.x.track.el.classList.add(
                    this.classNames.horizontal
                  ),
                  (this.axis.y.track.el = e.cloneNode(!0)),
                  this.axis.y.track.el.classList.add(this.classNames.vertical),
                  this.el.appendChild(this.axis.x.track.el),
                  this.el.appendChild(this.axis.y.track.el);
              }
              (this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector(
                "." + this.classNames.scrollbar
              )),
                (this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector(
                  "." + this.classNames.scrollbar
                )),
                this.options.autoHide ||
                  (this.axis.x.scrollbar.el.classList.add(
                    this.classNames.visible
                  ),
                  this.axis.y.scrollbar.el.classList.add(
                    this.classNames.visible
                  )),
                this.el.setAttribute("data-simplebar", "init");
            }),
            (e.initListeners = function() {
              var t = this;
              this.options.autoHide &&
                this.el.addEventListener("mouseenter", this.onMouseEnter),
                ["mousedown", "click", "dblclick"].forEach(function(e) {
                  t.el.addEventListener(e, t.onPointerEvent, !0);
                }),
                ["touchstart", "touchend", "touchmove"].forEach(function(e) {
                  t.el.addEventListener(e, t.onPointerEvent, {
                    capture: !0,
                    passive: !0
                  });
                }),
                this.el.addEventListener("mousemove", this.onMouseMove),
                this.el.addEventListener("mouseleave", this.onMouseLeave),
                this.contentWrapperEl.addEventListener("scroll", this.onScroll),
                window.addEventListener("resize", this.onWindowResize),
                (this.resizeObserver = new rr(this.recalculate)),
                this.resizeObserver.observe(this.el),
                this.resizeObserver.observe(this.contentEl);
            }),
            (e.recalculate = function() {
              var t = this.heightAutoObserverEl.offsetHeight <= 1,
                e = this.heightAutoObserverEl.offsetWidth <= 1;
              (this.elStyles = window.getComputedStyle(this.el)),
                (this.isRtl = "rtl" === this.elStyles.direction),
                (this.contentEl.style.padding =
                  this.elStyles.paddingTop +
                  " " +
                  this.elStyles.paddingRight +
                  " " +
                  this.elStyles.paddingBottom +
                  " " +
                  this.elStyles.paddingLeft),
                (this.wrapperEl.style.margin =
                  "-" +
                  this.elStyles.paddingTop +
                  " -" +
                  this.elStyles.paddingRight +
                  " -" +
                  this.elStyles.paddingBottom +
                  " -" +
                  this.elStyles.paddingLeft),
                (this.contentWrapperEl.style.height = t ? "auto" : "100%"),
                (this.placeholderEl.style.width = e
                  ? this.contentEl.offsetWidth + "px"
                  : "auto"),
                (this.placeholderEl.style.height =
                  this.contentEl.scrollHeight + "px"),
                (this.axis.x.isOverflowing =
                  this.contentWrapperEl.scrollWidth >
                  this.contentWrapperEl.offsetWidth),
                (this.axis.y.isOverflowing =
                  this.contentWrapperEl.scrollHeight >
                  this.contentWrapperEl.offsetHeight),
                (this.axis.x.isOverflowing =
                  "hidden" !== this.elStyles.overflowX &&
                  this.axis.x.isOverflowing),
                (this.axis.y.isOverflowing =
                  "hidden" !== this.elStyles.overflowY &&
                  this.axis.y.isOverflowing),
                (this.axis.x.forceVisible =
                  "x" === this.options.forceVisible ||
                  !0 === this.options.forceVisible),
                (this.axis.y.forceVisible =
                  "y" === this.options.forceVisible ||
                  !0 === this.options.forceVisible),
                this.hideNativeScrollbar(),
                (this.axis.x.track.rect = this.axis.x.track.el.getBoundingClientRect()),
                (this.axis.y.track.rect = this.axis.y.track.el.getBoundingClientRect()),
                (this.axis.x.scrollbar.size = this.getScrollbarSize("x")),
                (this.axis.y.scrollbar.size = this.getScrollbarSize("y")),
                (this.axis.x.scrollbar.el.style.width =
                  this.axis.x.scrollbar.size + "px"),
                (this.axis.y.scrollbar.el.style.height =
                  this.axis.y.scrollbar.size + "px"),
                this.positionScrollbar("x"),
                this.positionScrollbar("y"),
                this.toggleTrackVisibility("x"),
                this.toggleTrackVisibility("y");
            }),
            (e.getScrollbarSize = function(t) {
              void 0 === t && (t = "y");
              var e,
                i = this.scrollbarWidth
                  ? this.contentWrapperEl[this.axis[t].scrollSizeAttr]
                  : this.contentWrapperEl[this.axis[t].scrollSizeAttr] -
                    this.minScrollbarWidth,
                r = this.axis[t].track.rect[this.axis[t].sizeAttr];
              if (this.axis[t].isOverflowing) {
                var n = r / i;
                return (
                  (e = Math.max(~~(n * r), this.options.scrollbarMinSize)),
                  this.options.scrollbarMaxSize &&
                    (e = Math.min(e, this.options.scrollbarMaxSize)),
                  e
                );
              }
            }),
            (e.positionScrollbar = function(e) {
              void 0 === e && (e = "y");
              var i = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
                r = this.axis[e].track.rect[this.axis[e].sizeAttr],
                n = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                s = this.axis[e].scrollbar,
                o = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                a =
                  (o =
                    "x" === e &&
                    this.isRtl &&
                    t.getRtlHelpers().isRtlScrollingInverted
                      ? -o
                      : o) /
                  (i - n),
                l = ~~((r - s.size) * a);
              (l =
                "x" === e &&
                this.isRtl &&
                t.getRtlHelpers().isRtlScrollbarInverted
                  ? l + (r - s.size)
                  : l),
                (s.el.style.transform =
                  "x" === e
                    ? "translate3d(" + l + "px, 0, 0)"
                    : "translate3d(0, " + l + "px, 0)");
            }),
            (e.toggleTrackVisibility = function(t) {
              void 0 === t && (t = "y");
              var e = this.axis[t].track.el,
                i = this.axis[t].scrollbar.el;
              this.axis[t].isOverflowing || this.axis[t].forceVisible
                ? ((e.style.visibility = "visible"),
                  (this.contentWrapperEl.style[this.axis[t].overflowAttr] =
                    "scroll"))
                : ((e.style.visibility = "hidden"),
                  (this.contentWrapperEl.style[this.axis[t].overflowAttr] =
                    "hidden")),
                this.axis[t].isOverflowing
                  ? (i.style.display = "block")
                  : (i.style.display = "none");
            }),
            (e.hideNativeScrollbar = function() {
              if (
                ((this.offsetEl.style[this.isRtl ? "left" : "right"] =
                  this.axis.y.isOverflowing || this.axis.y.forceVisible
                    ? "-" +
                      (this.scrollbarWidth || this.minScrollbarWidth) +
                      "px"
                    : 0),
                (this.offsetEl.style.bottom =
                  this.axis.x.isOverflowing || this.axis.x.forceVisible
                    ? "-" +
                      (this.scrollbarWidth || this.minScrollbarWidth) +
                      "px"
                    : 0),
                !this.scrollbarWidth)
              ) {
                var t = [this.isRtl ? "paddingLeft" : "paddingRight"];
                (this.contentWrapperEl.style[t] =
                  this.axis.y.isOverflowing || this.axis.y.forceVisible
                    ? this.minScrollbarWidth + "px"
                    : 0),
                  (this.contentWrapperEl.style.paddingBottom =
                    this.axis.x.isOverflowing || this.axis.x.forceVisible
                      ? this.minScrollbarWidth + "px"
                      : 0);
              }
            }),
            (e.onMouseMoveForAxis = function(t) {
              void 0 === t && (t = "y"),
                (this.axis[t].track.rect = this.axis[
                  t
                ].track.el.getBoundingClientRect()),
                (this.axis[t].scrollbar.rect = this.axis[
                  t
                ].scrollbar.el.getBoundingClientRect()),
                this.isWithinBounds(this.axis[t].scrollbar.rect)
                  ? this.axis[t].scrollbar.el.classList.add(
                      this.classNames.hover
                    )
                  : this.axis[t].scrollbar.el.classList.remove(
                      this.classNames.hover
                    ),
                this.isWithinBounds(this.axis[t].track.rect)
                  ? (this.showScrollbar(t),
                    this.axis[t].track.el.classList.add(this.classNames.hover))
                  : this.axis[t].track.el.classList.remove(
                      this.classNames.hover
                    );
            }),
            (e.onMouseLeaveForAxis = function(t) {
              void 0 === t && (t = "y"),
                this.axis[t].track.el.classList.remove(this.classNames.hover),
                this.axis[t].scrollbar.el.classList.remove(
                  this.classNames.hover
                );
            }),
            (e.showScrollbar = function(t) {
              void 0 === t && (t = "y");
              var e = this.axis[t].scrollbar.el;
              this.axis[t].isVisible ||
                (e.classList.add(this.classNames.visible),
                (this.axis[t].isVisible = !0)),
                this.options.autoHide && this.hideScrollbars();
            }),
            (e.onDragStart = function(t, e) {
              void 0 === e && (e = "y");
              var i = this.axis[e].scrollbar.el,
                r = "y" === e ? t.pageY : t.pageX;
              (this.axis[e].dragOffset =
                r - i.getBoundingClientRect()[this.axis[e].offsetAttr]),
                (this.draggedAxis = e),
                this.el.classList.add(this.classNames.dragging),
                document.addEventListener("mousemove", this.drag, !0),
                document.addEventListener("mouseup", this.onEndDrag, !0),
                null === this.removePreventClickId
                  ? (document.addEventListener("click", this.preventClick, !0),
                    document.addEventListener(
                      "dblclick",
                      this.preventClick,
                      !0
                    ))
                  : (window.clearTimeout(this.removePreventClickId),
                    (this.removePreventClickId = null));
            }),
            (e.getContentElement = function() {
              return this.contentEl;
            }),
            (e.getScrollElement = function() {
              return this.contentWrapperEl;
            }),
            (e.removeListeners = function() {
              var t = this;
              this.options.autoHide &&
                this.el.removeEventListener("mouseenter", this.onMouseEnter),
                ["mousedown", "click", "dblclick"].forEach(function(e) {
                  t.el.removeEventListener(e, t.onPointerEvent, !0);
                }),
                ["touchstart", "touchend", "touchmove"].forEach(function(e) {
                  t.el.removeEventListener(e, t.onPointerEvent, {
                    capture: !0,
                    passive: !0
                  });
                }),
                this.el.removeEventListener("mousemove", this.onMouseMove),
                this.el.removeEventListener("mouseleave", this.onMouseLeave),
                this.contentWrapperEl.removeEventListener(
                  "scroll",
                  this.onScroll
                ),
                window.removeEventListener("resize", this.onWindowResize),
                this.mutationObserver && this.mutationObserver.disconnect(),
                this.resizeObserver.disconnect(),
                this.recalculate.cancel(),
                this.onMouseMove.cancel(),
                this.hideScrollbars.cancel(),
                this.onWindowResize.cancel();
            }),
            (e.unMount = function() {
              this.removeListeners(), (this.el.SimpleBar = null);
            }),
            (e.isChildNode = function(t) {
              return (
                null !== t && (t === this.el || this.isChildNode(t.parentNode))
              );
            }),
            (e.isWithinBounds = function(t) {
              return (
                this.mouseX >= t.left &&
                this.mouseX <= t.left + t.width &&
                this.mouseY >= t.top &&
                this.mouseY <= t.top + t.height
              );
            }),
            (e.findChild = function(t, e) {
              var i =
                t.matches ||
                t.webkitMatchesSelector ||
                t.mozMatchesSelector ||
                t.msMatchesSelector;
              return Array.prototype.filter.call(t.children, function(t) {
                return i.call(t, e);
              })[0];
            }),
            t
          );
        })();
        return (
          (or.defaultOptions = {
            autoHide: !0,
            forceVisible: !1,
            classNames: {
              contentEl: "simplebar-content",
              contentWrapper: "simplebar-content-wrapper",
              offset: "simplebar-offset",
              mask: "simplebar-mask",
              wrapper: "simplebar-wrapper",
              placeholder: "simplebar-placeholder",
              scrollbar: "simplebar-scrollbar",
              track: "simplebar-track",
              heightAutoObserverWrapperEl:
                "simplebar-height-auto-observer-wrapper",
              heightAutoObserverEl: "simplebar-height-auto-observer",
              visible: "simplebar-visible",
              horizontal: "simplebar-horizontal",
              vertical: "simplebar-vertical",
              hover: "simplebar-hover",
              dragging: "simplebar-dragging"
            },
            scrollbarMinSize: 25,
            scrollbarMaxSize: 0,
            timeout: 1e3
          }),
          nr && or.initHtmlApi(),
          or
        );
      });

      new SimpleBar(document.getElementById("container"));
    }, 10);
  };
} catch (ex) {}
