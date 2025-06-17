"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var React = require("react");

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _createForOfIteratorHelper(r, e) {
  var t =
    ("undefined" != typeof Symbol && r[Symbol.iterator]) || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length
            ? {
                done: true,
              }
            : {
                done: false,
                value: r[n++],
              };
        },
        e: function (r) {
          throw r;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    );
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return (a = r.done), r;
    },
    e: function (r) {
      (u = true), (o = r);
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    },
  };
}
function _iterableToArrayLimit(r, l) {
  var t =
    null == r
      ? null
      : ("undefined" != typeof Symbol && r[Symbol.iterator]) || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (((i = (t = t.call(r)).next), 0 === l));
      else
        for (
          ;
          !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l);
          f = !0
        );
    } catch (r) {
      (o = true), (n = r);
    } finally {
      try {
        if (!f && null != t.return && ((u = t.return()), Object(u) !== u))
          return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
  );
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return r;
  };
  var t,
    r = {},
    e = Object.prototype,
    n = e.hasOwnProperty,
    o = "function" == typeof Symbol ? Symbol : {},
    i = o.iterator || "@@iterator",
    a = o.asyncIterator || "@@asyncIterator",
    u = o.toStringTag || "@@toStringTag";
  function c(t, r, e, n) {
    return Object.defineProperty(t, r, {
      value: e,
      enumerable: !n,
      configurable: !n,
      writable: !n,
    });
  }
  try {
    c({}, "");
  } catch (t) {
    c = function (t, r, e) {
      return (t[r] = e);
    };
  }
  function h(r, e, n, o) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype);
    return (
      c(
        a,
        "_invoke",
        (function (r, e, n) {
          var o = 1;
          return function (i, a) {
            if (3 === o) throw Error("Generator is already running");
            if (4 === o) {
              if ("throw" === i) throw a;
              return {
                value: t,
                done: true,
              };
            }
            for (n.method = i, n.arg = a; ; ) {
              var u = n.delegate;
              if (u) {
                var c = d(u, n);
                if (c) {
                  if (c === f) continue;
                  return c;
                }
              }
              if ("next" === n.method) n.sent = n._sent = n.arg;
              else if ("throw" === n.method) {
                if (1 === o) throw ((o = 4), n.arg);
                n.dispatchException(n.arg);
              } else "return" === n.method && n.abrupt("return", n.arg);
              o = 3;
              var h = s(r, e, n);
              if ("normal" === h.type) {
                if (((o = n.done ? 4 : 2), h.arg === f)) continue;
                return {
                  value: h.arg,
                  done: n.done,
                };
              }
              "throw" === h.type &&
                ((o = 4), (n.method = "throw"), (n.arg = h.arg));
            }
          };
        })(r, n, new Context(o || [])),
        true,
      ),
      a
    );
  }
  function s(t, r, e) {
    try {
      return {
        type: "normal",
        arg: t.call(r, e),
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t,
      };
    }
  }
  r.wrap = h;
  var f = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var l = {};
  c(l, i, function () {
    return this;
  });
  var p = Object.getPrototypeOf,
    y = p && p(p(x([])));
  y && y !== e && n.call(y, i) && (l = y);
  var v =
    (GeneratorFunctionPrototype.prototype =
    Generator.prototype =
      Object.create(l));
  function g(t) {
    ["next", "throw", "return"].forEach(function (r) {
      c(t, r, function (t) {
        return this._invoke(r, t);
      });
    });
  }
  function AsyncIterator(t, r) {
    function e(o, i, a, u) {
      var c = s(t[o], t, i);
      if ("throw" !== c.type) {
        var h = c.arg,
          f = h.value;
        return f && "object" == typeof f && n.call(f, "__await")
          ? r.resolve(f.__await).then(
              function (t) {
                e("next", t, a, u);
              },
              function (t) {
                e("throw", t, a, u);
              },
            )
          : r.resolve(f).then(
              function (t) {
                (h.value = t), a(h);
              },
              function (t) {
                return e("throw", t, a, u);
              },
            );
      }
      u(c.arg);
    }
    var o;
    c(
      this,
      "_invoke",
      function (t, n) {
        function i() {
          return new r(function (r, o) {
            e(t, n, r, o);
          });
        }
        return (o = o ? o.then(i, i) : i());
      },
      true,
    );
  }
  function d(r, e) {
    var n = e.method,
      o = r.i[n];
    if (o === t)
      return (
        (e.delegate = null),
        ("throw" === n &&
          r.i.return &&
          ((e.method = "return"),
          (e.arg = t),
          d(r, e),
          "throw" === e.method)) ||
          ("return" !== n &&
            ((e.method = "throw"),
            (e.arg = new TypeError(
              "The iterator does not provide a '" + n + "' method",
            )))),
        f
      );
    var i = s(o, r.i, e.arg);
    if ("throw" === i.type)
      return (e.method = "throw"), (e.arg = i.arg), (e.delegate = null), f;
    var a = i.arg;
    return a
      ? a.done
        ? ((e[r.r] = a.value),
          (e.next = r.n),
          "return" !== e.method && ((e.method = "next"), (e.arg = t)),
          (e.delegate = null),
          f)
        : a
      : ((e.method = "throw"),
        (e.arg = new TypeError("iterator result is not an object")),
        (e.delegate = null),
        f);
  }
  function w(t) {
    this.tryEntries.push(t);
  }
  function m(r) {
    var e = r[4] || {};
    (e.type = "normal"), (e.arg = t), (r[4] = e);
  }
  function Context(t) {
    (this.tryEntries = [[-1]]), t.forEach(w, this), this.reset(true);
  }
  function x(r) {
    if (null != r) {
      var e = r[i];
      if (e) return e.call(r);
      if ("function" == typeof r.next) return r;
      if (!isNaN(r.length)) {
        var o = -1,
          a = function e() {
            for (; ++o < r.length; )
              if (n.call(r, o)) return (e.value = r[o]), (e.done = false), e;
            return (e.value = t), (e.done = true), e;
          };
        return (a.next = a);
      }
    }
    throw new TypeError(typeof r + " is not iterable");
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    c(v, "constructor", GeneratorFunctionPrototype),
    c(GeneratorFunctionPrototype, "constructor", GeneratorFunction),
    (GeneratorFunction.displayName = c(
      GeneratorFunctionPrototype,
      u,
      "GeneratorFunction",
    )),
    (r.isGeneratorFunction = function (t) {
      var r = "function" == typeof t && t.constructor;
      return (
        !!r &&
        (r === GeneratorFunction ||
          "GeneratorFunction" === (r.displayName || r.name))
      );
    }),
    (r.mark = function (t) {
      return (
        Object.setPrototypeOf
          ? Object.setPrototypeOf(t, GeneratorFunctionPrototype)
          : ((t.__proto__ = GeneratorFunctionPrototype),
            c(t, u, "GeneratorFunction")),
        (t.prototype = Object.create(v)),
        t
      );
    }),
    (r.awrap = function (t) {
      return {
        __await: t,
      };
    }),
    g(AsyncIterator.prototype),
    c(AsyncIterator.prototype, a, function () {
      return this;
    }),
    (r.AsyncIterator = AsyncIterator),
    (r.async = function (t, e, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(h(t, e, n, o), i);
      return r.isGeneratorFunction(e)
        ? a
        : a.next().then(function (t) {
            return t.done ? t.value : a.next();
          });
    }),
    g(v),
    c(v, u, "Generator"),
    c(v, i, function () {
      return this;
    }),
    c(v, "toString", function () {
      return "[object Generator]";
    }),
    (r.keys = function (t) {
      var r = Object(t),
        e = [];
      for (var n in r) e.unshift(n);
      return function t() {
        for (; e.length; )
          if ((n = e.pop()) in r) return (t.value = n), (t.done = false), t;
        return (t.done = true), t;
      };
    }),
    (r.values = x),
    (Context.prototype = {
      constructor: Context,
      reset: function (r) {
        if (
          ((this.prev = this.next = 0),
          (this.sent = this._sent = t),
          (this.done = false),
          (this.delegate = null),
          (this.method = "next"),
          (this.arg = t),
          this.tryEntries.forEach(m),
          !r)
        )
          for (var e in this)
            "t" === e.charAt(0) &&
              n.call(this, e) &&
              !isNaN(+e.slice(1)) &&
              (this[e] = t);
      },
      stop: function () {
        this.done = true;
        var t = this.tryEntries[0][4];
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (r) {
        if (this.done) throw r;
        var e = this;
        function n(t) {
          (a.type = "throw"), (a.arg = r), (e.next = t);
        }
        for (var o = e.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i[4],
            u = this.prev,
            c = i[1],
            h = i[2];
          if (-1 === i[0]) return n("end"), false;
          if (!c && !h) throw Error("try statement without catch or finally");
          if (null != i[0] && i[0] <= u) {
            if (u < c)
              return (this.method = "next"), (this.arg = t), n(c), true;
            if (u < h) return n(h), false;
          }
        }
      },
      abrupt: function (t, r) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var n = this.tryEntries[e];
          if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) {
            var o = n;
            break;
          }
        }
        o &&
          ("break" === t || "continue" === t) &&
          o[0] <= r &&
          r <= o[2] &&
          (o = null);
        var i = o ? o[4] : {};
        return (
          (i.type = t),
          (i.arg = r),
          o ? ((this.method = "next"), (this.next = o[2]), f) : this.complete(i)
        );
      },
      complete: function (t, r) {
        if ("throw" === t.type) throw t.arg;
        return (
          "break" === t.type || "continue" === t.type
            ? (this.next = t.arg)
            : "return" === t.type
              ? ((this.rval = this.arg = t.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === t.type && r && (this.next = r),
          f
        );
      },
      finish: function (t) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var e = this.tryEntries[r];
          if (e[2] === t) return this.complete(e[4], e[3]), m(e), f;
        }
      },
      catch: function (t) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var e = this.tryEntries[r];
          if (e[0] === t) {
            var n = e[4];
            if ("throw" === n.type) {
              var o = n.arg;
              m(e);
            }
            return o;
          }
        }
        throw Error("illegal catch attempt");
      },
      delegateYield: function (r, e, n) {
        return (
          (this.delegate = {
            i: x(r),
            r: e,
            n: n,
          }),
          "next" === this.method && (this.arg = t),
          f
        );
      },
    }),
    r
  );
}
function _slicedToArray(r, e) {
  return (
    _arrayWithHoles(r) ||
    _iterableToArrayLimit(r, e) ||
    _unsupportedIterableToArray(r, e) ||
    _nonIterableRest()
  );
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return (
      "Object" === t && r.constructor && (t = r.constructor.name),
      "Map" === t || "Set" === t
        ? Array.from(r)
        : "Arguments" === t ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(r, a)
          : void 0
    );
  }
}

var Toolbar = function Toolbar(_ref) {
  var onBold = _ref.onBold,
    onItalic = _ref.onItalic,
    onUnderline = _ref.onUnderline,
    onBulletList = _ref.onBulletList,
    onNumberedList = _ref.onNumberedList,
    onCreateLink = _ref.onCreateLink,
    onInsertVariable = _ref.onInsertVariable,
    onToggleSnippets = _ref.onToggleSnippets,
    showSnippets = _ref.showSnippets,
    variablePrefix = _ref.variablePrefix,
    variableSuffix = _ref.variableSuffix,
    onKeyDown = _ref.onKeyDown;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "gravy-toolbar",
      role: "toolbar",
      "aria-label": "Text formatting tools",
      onKeyDown: onKeyDown,
    },
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onBold,
        className: "toolbar-btn",
        title: "Bold (Ctrl+B)",
        "aria-label": "Toggle bold formatting",
        type: "button",
      },
      /*#__PURE__*/ React.createElement("strong", null, "B"),
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onItalic,
        className: "toolbar-btn",
        title: "Italic (Ctrl+I)",
        "aria-label": "Toggle italic formatting",
        type: "button",
      },
      /*#__PURE__*/ React.createElement("em", null, "I"),
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onUnderline,
        className: "toolbar-btn",
        title: "Underline (Ctrl+U)",
        "aria-label": "Toggle underline formatting",
        type: "button",
      },
      /*#__PURE__*/ React.createElement("u", null, "U"),
    ),
    /*#__PURE__*/ React.createElement("div", {
      className: "toolbar-divider",
      "aria-hidden": "true",
    }),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onBulletList,
        className: "toolbar-btn",
        title: "Bullet List",
        "aria-label": "Insert bullet list",
        type: "button",
      },
      "\u2022",
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onNumberedList,
        className: "toolbar-btn",
        title: "Numbered List",
        "aria-label": "Insert numbered list",
        type: "button",
      },
      "1.",
    ),
    /*#__PURE__*/ React.createElement("div", {
      className: "toolbar-divider",
      "aria-hidden": "true",
    }),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onCreateLink,
        className: "toolbar-btn",
        title: "Insert Link",
        "aria-label": "Insert hyperlink",
        type: "button",
      },
      "\uD83D\uDD17",
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onInsertVariable,
        className: "toolbar-btn",
        title: "Insert Variable",
        "aria-label": "Insert variable placeholder using "
          .concat(variablePrefix)
          .concat(variableSuffix, " format"),
        type: "button",
      },
      variablePrefix,
      variableSuffix,
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: onToggleSnippets,
        className: "toolbar-btn",
        title: "Insert Snippet",
        "aria-label": "Insert text snippet",
        "aria-expanded": showSnippets,
        type: "button",
      },
      "\uD83D\uDCDD",
    ),
  );
};

var Editor = /*#__PURE__*/ React.forwardRef(function (_ref, ref) {
  var placeholder = _ref.placeholder,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    onInput = _ref.onInput,
    onKeyDown = _ref.onKeyDown,
    onMouseUp = _ref.onMouseUp,
    ariaLabel = _ref["aria-label"];
  // Debounced input handler
  var inputTimeout;
  var handleInput = React.useCallback(
    function (e) {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(function () {
        if (onInput) {
          onInput(e);
        }
      }, 100);
    },
    [onInput],
  );
  return /*#__PURE__*/ React.createElement("div", {
    ref: ref,
    className: "gravy-content ".concat(className),
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: handleInput,
    onKeyDown: onKeyDown,
    onMouseUp: onMouseUp,
    "data-placeholder": placeholder,
    role: "textbox",
    "aria-multiline": "true",
    "aria-label": ariaLabel || placeholder,
    tabIndex: 0,
  });
});
Editor.displayName = "Editor";

var SnippetDropdown = function SnippetDropdown(_ref) {
  var snippets = _ref.snippets,
    onInsertSnippet = _ref.onInsertSnippet,
    onClose = _ref.onClose,
    isVisible = _ref.isVisible;
  var _useState = React.useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    snippetSearch = _useState2[0],
    setSnippetSearch = _useState2[1];

  // Filter snippets with error handling
  var filteredSnippets = snippets.filter(function (snippet) {
    try {
      return (
        snippet.title.toLowerCase().includes(snippetSearch.toLowerCase()) ||
        snippet.content.toLowerCase().includes(snippetSearch.toLowerCase())
      );
    } catch (error) {
      console.error("Error filtering snippets:", error);
      return false;
    }
  });

  // Handle snippet insertion
  var handleSnippetClick = function handleSnippetClick(snippet) {
    onInsertSnippet(snippet);
    setSnippetSearch("");
  };

  // Handle keyboard navigation for snippets
  var handleSnippetKeyDown = function handleSnippetKeyDown(e, snippet) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSnippetClick(snippet);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(
    function () {
      var handleClickOutside = function handleClickOutside(event) {
        try {
          var snippetDropdown = event.target.closest(
            ".gravy-snippets-dropdown",
          );
          var snippetButton = event.target.closest(
            '.toolbar-btn[title="Insert Snippet"]',
          );
          if (!snippetDropdown && !snippetButton) {
            onClose();
          }
        } catch (error) {
          console.error("Error handling click outside:", error);
        }
      };
      if (isVisible) {
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
          return document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    },
    [isVisible, onClose],
  );

  // Reset search when dropdown closes
  React.useEffect(
    function () {
      if (!isVisible) {
        setSnippetSearch("");
      }
    },
    [isVisible],
  );
  if (!isVisible) return null;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "gravy-snippets-dropdown",
      role: "listbox",
      "aria-label": "Available snippets",
    },
    /*#__PURE__*/ React.createElement("input", {
      type: "text",
      placeholder: "Search snippets...",
      value: snippetSearch,
      onChange: function onChange(e) {
        return setSnippetSearch(e.target.value);
      },
      className: "snippet-search",
      autoFocus: true,
      "aria-label": "Search snippets",
    }),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "snippet-list",
      },
      filteredSnippets.length > 0
        ? filteredSnippets.map(function (snippet, index) {
            return /*#__PURE__*/ React.createElement(
              "div",
              {
                key: index,
                className: "snippet-item",
                onClick: function onClick() {
                  return handleSnippetClick(snippet);
                },
                role: "option",
                tabIndex: 0,
                onKeyDown: function onKeyDown(e) {
                  return handleSnippetKeyDown(e, snippet);
                },
                "aria-label": "Insert snippet: ".concat(snippet.title),
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "snippet-title",
                },
                snippet.title,
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "snippet-preview",
                },
                snippet.content.replace(/<[^>]*>/g, "").substring(0, 50),
                "...",
              ),
            );
          })
        : /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "snippet-item snippet-empty",
              role: "option",
            },
            "No snippets found",
          ),
    ),
  );
};

var useSelection = function useSelection(editorRef) {
  var _useState = React.useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    currentRange = _useState2[0],
    setCurrentRange = _useState2[1];

  // Save the current text selection/range for later restoration
  var saveSelection = React.useCallback(function () {
    try {
      var selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setCurrentRange(selection.getRangeAt(0).cloneRange());
      }
    } catch (error) {
      console.error("Error saving selection:", error);
    }
  }, []);

  // Restore a previously saved text selection/range
  var restoreSelection = React.useCallback(
    function () {
      try {
        if (currentRange && editorRef.current) {
          var selection = window.getSelection();
          selection.removeAllRanges();
          try {
            selection.addRange(currentRange);
          } catch (error) {
            // If the range is invalid, position cursor at end
            var newRange = document.createRange();
            newRange.selectNodeContents(editorRef.current);
            newRange.collapse(false);
            selection.addRange(newRange);
          }
        }
      } catch (error) {
        console.error("Error restoring selection:", error);
      }
    },
    [currentRange, editorRef],
  );

  // Handle mouse up events to automatically save the current selection
  var handleMouseUp = React.useCallback(
    function () {
      saveSelection();
    },
    [saveSelection],
  );
  return {
    currentRange: currentRange,
    saveSelection: saveSelection,
    restoreSelection: restoreSelection,
    handleMouseUp: handleMouseUp,
  };
};

var useFormatting = function useFormatting(
  editorRef,
  updateContent,
  saveSelection,
  restoreSelection,
) {
  // Apply HTML formatting (bold, italic, etc.) to the currently selected text
  var applyFormat = React.useCallback(
    function (tag) {
      var attributes =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      try {
        saveSelection();
        var selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        var range = selection.getRangeAt(0);
        if (range.collapsed) return;
        var element = document.createElement(tag);
        Object.entries(attributes).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          element.setAttribute(key, value);
        });
        try {
          range.surroundContents(element);
        } catch (e) {
          // Fallback if range spans multiple elements
          element.appendChild(range.extractContents());
          range.insertNode(element);
        }
        selection.removeAllRanges();
        updateContent();
        restoreSelection();
      } catch (error) {
        console.error("Error applying format:", error);
      }
    },
    [saveSelection, restoreSelection, updateContent],
  );

  // Toggle bold formatting on selected text
  var toggleBold = React.useCallback(
    function () {
      return applyFormat("strong");
    },
    [applyFormat],
  );

  // Toggle italic formatting on selected text
  var toggleItalic = React.useCallback(
    function () {
      return applyFormat("em");
    },
    [applyFormat],
  );

  // Toggle underline formatting on selected text
  var toggleUnderline = React.useCallback(
    function () {
      return applyFormat("u");
    },
    [applyFormat],
  );

  // Insert a list (ordered or unordered) at the current cursor position
  var insertList = React.useCallback(
    function () {
      var ordered =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;
      try {
        saveSelection();
        var selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        var range = selection.getRangeAt(0);
        var listElement = document.createElement(ordered ? "ol" : "ul");
        var listItem = document.createElement("li");
        if (range.collapsed) {
          listItem.appendChild(document.createTextNode("\xA0"));
        } else {
          listItem.appendChild(range.extractContents());
        }
        listElement.appendChild(listItem);
        range.insertNode(listElement);

        // Position cursor in the list item
        var newRange = document.createRange();
        newRange.setStart(listItem, listItem.childNodes.length);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        updateContent();
      } catch (error) {
        console.error("Error inserting list:", error);
      }
    },
    [saveSelection, updateContent],
  );

  // Insert an unordered (bullet) list
  var insertBulletList = React.useCallback(
    function () {
      return insertList(false);
    },
    [insertList],
  );

  // Insert an ordered (numbered) list
  var insertNumberedList = React.useCallback(
    function () {
      return insertList(true);
    },
    [insertList],
  );

  // Validate if a string is a valid URL (with protocol auto-detection)
  var isValidUrl = React.useCallback(function (string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Try adding protocol if missing
      try {
        new URL("https://" + string);
        return true;
      } catch (_) {
        return false;
      }
    }
  }, []);

  // Create a hyperlink from the currently selected text
  var createLink = React.useCallback(
    function () {
      try {
        saveSelection();
        var selection = window.getSelection();
        if (
          !selection ||
          selection.rangeCount === 0 ||
          selection.toString() === ""
        ) {
          alert("Please select some text first");
          return;
        }
        var url = prompt("Enter URL:");
        if (url && isValidUrl(url)) {
          restoreSelection();
          applyFormat("a", {
            href: url,
          });
        } else if (url) {
          alert("Please enter a valid URL (e.g., https://example.com)");
        }
      } catch (error) {
        console.error("Error creating link:", error);
      }
    },
    [saveSelection, restoreSelection, applyFormat, isValidUrl],
  );
  return {
    toggleBold: toggleBold,
    toggleItalic: toggleItalic,
    toggleUnderline: toggleUnderline,
    insertBulletList: insertBulletList,
    insertNumberedList: insertNumberedList,
    createLink: createLink,
    applyFormat: applyFormat,
  };
};

var useVariables = function useVariables(
  editorRef,
  variablePrefix,
  variableSuffix,
  onVariablePrompt,
) {
  // Escape HTML content to prevent XSS attacks
  var escapeHtml = React.useCallback(function (text) {
    try {
      var div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    } catch (error) {
      console.error("Error escaping HTML:", error);
      return String(text).replace(/[&<>"']/g, function (_char) {
        var entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[_char];
      });
    }
  }, []);

  // Extract plain text content from HTML, removing all tags
  var extractPlainText = React.useCallback(function (html) {
    try {
      var tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    } catch (error) {
      console.error("Error extracting plain text:", error);
      return "";
    }
  }, []);

  // Find all variables in the editor content using regex pattern matching
  var getAllVariables = React.useCallback(
    function () {
      if (!editorRef.current) return [];
      try {
        // Get both HTML and plain text content for comprehensive detection
        var htmlContent = editorRef.current.innerHTML || "";
        var textContent = editorRef.current.textContent || "";

        // Escape delimiters for regex
        var escapedPrefix = variablePrefix.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        var escapedSuffix = variableSuffix.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        var regex = new RegExp(
          ""
            .concat(escapedPrefix, "([a-zA-Z_][a-zA-Z0-9_]*)")
            .concat(escapedSuffix),
          "g",
        );
        var variables = new Set();

        // Check both HTML and text content
        [htmlContent, textContent].forEach(function (content) {
          var match;
          while ((match = regex.exec(content)) !== null) {
            variables.add(match[1]);
          }
        });
        return Array.from(variables);
      } catch (error) {
        console.error("Error extracting variables:", error);
        return [];
      }
    },
    [editorRef, variablePrefix, variableSuffix],
  );

  // Replace variables in editor content with provided values
  var generatePopulatedContent = React.useCallback(
    function (variableValues) {
      if (!editorRef.current) return "";
      try {
        var content = editorRef.current.innerHTML;

        // Replace each variable with its value
        for (
          var _i = 0, _Object$entries = Object.entries(variableValues);
          _i < _Object$entries.length;
          _i++
        ) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            variable = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          var escapedPrefix = variablePrefix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          var escapedSuffix = variableSuffix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          var regex = new RegExp(
            "".concat(escapedPrefix).concat(variable).concat(escapedSuffix),
            "g",
          );

          // Escape HTML to prevent XSS
          var escapedValue = escapeHtml(value);
          content = content.replace(regex, escapedValue);
        }
        return content;
      } catch (error) {
        console.error("Error generating populated content:", error);
        return "";
      }
    },
    [editorRef, variablePrefix, variableSuffix, escapeHtml],
  );

  // Prompt user for variable values and generate populated content
  var populateVariables = React.useCallback(
    /*#__PURE__*/ _asyncToGenerator(
      /*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
        var variables,
          variableValues,
          allValuesProvided,
          _iterator,
          _step,
          variable,
          value,
          proceed,
          populatedContent;
        return _regeneratorRuntime().wrap(
          function _callee$(_context) {
            while (1)
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.prev = 0;
                  variables = getAllVariables();
                  if (!(variables.length === 0)) {
                    _context.next = 5;
                    break;
                  }
                  alert(
                    "No variables found in the template. Insert variables using the format "
                      .concat(variablePrefix, "variable_name")
                      .concat(variableSuffix),
                  );
                  return _context.abrupt("return", null);
                case 5:
                  variableValues = {};
                  allValuesProvided = true; // Prompt for each variable value using custom or default prompt
                  _iterator = _createForOfIteratorHelper(variables);
                  _context.prev = 8;
                  _iterator.s();
                case 10:
                  if ((_step = _iterator.n()).done) {
                    _context.next = 33;
                    break;
                  }
                  variable = _step.value;
                  value = void 0;
                  if (!onVariablePrompt) {
                    _context.next = 26;
                    break;
                  }
                  _context.prev = 14;
                  _context.next = 17;
                  return onVariablePrompt(
                    variable,
                    variablePrefix,
                    variableSuffix,
                  );
                case 17:
                  value = _context.sent;
                  _context.next = 24;
                  break;
                case 20:
                  _context.prev = 20;
                  _context.t0 = _context["catch"](14);
                  console.error(
                    "Error with custom variable prompt:",
                    _context.t0,
                  );
                  return _context.abrupt("return", null);
                case 24:
                  _context.next = 27;
                  break;
                case 26:
                  // Fall back to browser prompt
                  value = prompt(
                    "Enter value for "
                      .concat(variablePrefix)
                      .concat(variable)
                      .concat(variableSuffix, ":"),
                  );
                case 27:
                  if (!(value === null || value === undefined)) {
                    _context.next = 29;
                    break;
                  }
                  return _context.abrupt("return", null);
                case 29:
                  if (value === "") {
                    allValuesProvided = false;
                  }
                  variableValues[variable] = String(value);
                case 31:
                  _context.next = 10;
                  break;
                case 33:
                  _context.next = 38;
                  break;
                case 35:
                  _context.prev = 35;
                  _context.t1 = _context["catch"](8);
                  _iterator.e(_context.t1);
                case 38:
                  _context.prev = 38;
                  _iterator.f();
                  return _context.finish(38);
                case 41:
                  if (allValuesProvided) {
                    _context.next = 45;
                    break;
                  }
                  proceed = confirm(
                    "Some variables were left empty. Continue anyway?",
                  );
                  if (proceed) {
                    _context.next = 45;
                    break;
                  }
                  return _context.abrupt("return", null);
                case 45:
                  // Generate the populated content
                  populatedContent = generatePopulatedContent(variableValues);
                  return _context.abrupt("return", {
                    html: populatedContent,
                    variables: variableValues,
                    plainText: extractPlainText(populatedContent),
                  });
                case 49:
                  _context.prev = 49;
                  _context.t2 = _context["catch"](0);
                  console.error("Error populating variables:", _context.t2);
                  alert(
                    "An error occurred while populating variables. Please try again.",
                  );
                  return _context.abrupt("return", null);
                case 54:
                case "end":
                  return _context.stop();
              }
          },
          _callee,
          null,
          [
            [0, 49],
            [8, 35, 38, 41],
            [14, 20],
          ],
        );
      }),
    ),
    [
      getAllVariables,
      generatePopulatedContent,
      extractPlainText,
      variablePrefix,
      variableSuffix,
      onVariablePrompt,
    ],
  );

  // Insert a new variable placeholder at the current cursor position
  var insertVariable = React.useCallback(
    function (currentRange, saveSelection, restoreSelection, updateContent) {
      try {
        saveSelection();
        var variableName = prompt("Enter variable name:");
        if (!variableName || !variableName.trim()) return;

        // Input validation - only allow valid variable names
        var trimmedName = variableName.trim();
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
          alert(
            "Variable names must start with a letter or underscore and contain only letters, numbers, and underscores.",
          );
          return;
        }
        var selection = window.getSelection();
        if (currentRange) {
          selection.removeAllRanges();
          selection.addRange(currentRange);
        }
        var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range) {
          // Insert as plain text (bulletproof approach)
          var variableText = ""
            .concat(variablePrefix)
            .concat(trimmedName)
            .concat(variableSuffix);
          var textNode = document.createTextNode(variableText);
          range.deleteContents();
          range.insertNode(textNode);

          // Move cursor after the variable
          var newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
          updateContent();
        }
      } catch (error) {
        console.error("Error inserting variable:", error);
        alert("An error occurred while inserting the variable.");
      }
    },
    [variablePrefix, variableSuffix],
  );
  return {
    getAllVariables: getAllVariables,
    generatePopulatedContent: generatePopulatedContent,
    populateVariables: populateVariables,
    insertVariable: insertVariable,
    extractPlainText: extractPlainText,
    escapeHtml: escapeHtml,
  };
};

var useKeyboardShortcuts = function useKeyboardShortcuts(editorRef, handlers) {
  var toggleBold = handlers.toggleBold,
    toggleItalic = handlers.toggleItalic,
    toggleUnderline = handlers.toggleUnderline,
    onToolbarFocus = handlers.onToolbarFocus;

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) and accessibility features
  var handleKeyDown = React.useCallback(
    function (e) {
      try {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "b":
              e.preventDefault();
              toggleBold();
              break;
            case "i":
              e.preventDefault();
              toggleItalic();
              break;
            case "u":
              e.preventDefault();
              toggleUnderline();
              break;
            default:
              break;
          }
        }

        // Accessibility: Handle toolbar navigation with keyboard (F10)
        if (e.key === "F10" && e.target === editorRef.current) {
          e.preventDefault();
          if (onToolbarFocus) {
            onToolbarFocus();
          }
        }
      } catch (error) {
        console.error("Error handling key down:", error);
      }
    },
    [toggleBold, toggleItalic, toggleUnderline, onToolbarFocus, editorRef],
  );

  // Handle arrow key navigation within the toolbar for accessibility
  var handleToolbarKeyDown = React.useCallback(
    function (e) {
      try {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var buttons = Array.from(
            document.querySelectorAll(".gravy-toolbar .toolbar-btn"),
          );
          var currentIndex = buttons.indexOf(e.target);
          if (currentIndex !== -1) {
            e.preventDefault();
            var nextIndex = currentIndex + (e.key === "ArrowRight" ? 1 : -1);
            if (nextIndex >= buttons.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = buttons.length - 1;
            buttons[nextIndex].focus();
          }
        } else if (e.key === "Escape") {
          var _editorRef$current;
          e.preventDefault();
          (_editorRef$current = editorRef.current) === null ||
            _editorRef$current === void 0 ||
            _editorRef$current.focus();
        }
      } catch (error) {
        console.error("Error handling toolbar keyboard navigation:", error);
      }
    },
    [editorRef],
  );
  return {
    handleKeyDown: handleKeyDown,
    handleToolbarKeyDown: handleToolbarKeyDown,
  };
};

var useClipboard = function useClipboard() {
  // Copy content to clipboard with formatting, supporting modern and legacy browsers
  var copyToClipboard = React.useCallback(
    /*#__PURE__*/ (function () {
      var _ref = _asyncToGenerator(
        /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(content) {
          var clipboardItem, textArea, success;
          return _regeneratorRuntime().wrap(
            function _callee$(_context) {
              while (1)
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.prev = 0;
                    if (content) {
                      _context.next = 3;
                      break;
                    }
                    throw new Error("No content to copy");
                  case 3:
                    if (!(navigator.clipboard && navigator.clipboard.write)) {
                      _context.next = 8;
                      break;
                    }
                    clipboardItem = new ClipboardItem({
                      "text/html": new Blob([content.html], {
                        type: "text/html",
                      }),
                      "text/plain": new Blob([content.plainText], {
                        type: "text/plain",
                      }),
                    });
                    _context.next = 7;
                    return navigator.clipboard.write([clipboardItem]);
                  case 7:
                    return _context.abrupt("return", true);
                  case 8:
                    if (
                      !(navigator.clipboard && navigator.clipboard.writeText)
                    ) {
                      _context.next = 12;
                      break;
                    }
                    _context.next = 11;
                    return navigator.clipboard.writeText(content.plainText);
                  case 11:
                    return _context.abrupt("return", true);
                  case 12:
                    // Final fallback for older browsers
                    textArea = document.createElement("textarea");
                    textArea.value = content.plainText;
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.select();
                    success = document.execCommand("copy");
                    document.body.removeChild(textArea);
                    return _context.abrupt("return", success);
                  case 23:
                    _context.prev = 23;
                    _context.t0 = _context["catch"](0);
                    console.error("Error copying to clipboard:", _context.t0);
                    return _context.abrupt("return", false);
                  case 27:
                  case "end":
                    return _context.stop();
                }
            },
            _callee,
            null,
            [[0, 23]],
          );
        }),
      );
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })(),
    [],
  );
  return {
    copyToClipboard: copyToClipboard,
  };
};

var useEditorContent = function useEditorContent(initialValue, onChange) {
  var _useState = React.useState(initialValue),
    _useState2 = _slicedToArray(_useState, 2),
    content = _useState2[0],
    setContent = _useState2[1];
  var editorRef = React.useRef(null);
  var isUpdatingRef = React.useRef(false);

  // Update the content state when editor content changes
  var updateContent = React.useCallback(
    function () {
      if (editorRef.current && !isUpdatingRef.current) {
        try {
          var newContent = editorRef.current.innerHTML;
          setContent(newContent);
          if (onChange) {
            onChange(newContent);
          }
        } catch (error) {
          console.error("Error updating content:", error);
        }
      }
    },
    [onChange],
  );

  // Set editor content programmatically (used by the ref API)
  var setEditorContent = React.useCallback(
    function (newContent) {
      try {
        if (editorRef.current) {
          isUpdatingRef.current = true;
          editorRef.current.innerHTML = newContent || "";
          setContent(newContent || "");
          if (onChange) {
            onChange(newContent || "");
          }
          isUpdatingRef.current = false;
        }
      } catch (error) {
        console.error("Error setting content:", error);
      }
    },
    [onChange],
  );

  // Get the current HTML content from the editor
  var getContent = React.useCallback(function () {
    return editorRef.current ? editorRef.current.innerHTML : "";
  }, []);

  // Set initial content with error handling
  React.useEffect(
    function () {
      try {
        if (editorRef.current && initialValue && !content) {
          isUpdatingRef.current = true;
          editorRef.current.innerHTML = initialValue;
          setContent(initialValue);
          isUpdatingRef.current = false;
        }
      } catch (error) {
        console.error("Error setting initial content:", error);
      }
    },
    [initialValue, content],
  );
  return {
    content: content,
    editorRef: editorRef,
    updateContent: updateContent,
    setEditorContent: setEditorContent,
    getContent: getContent,
  };
};

var GravyJS = /*#__PURE__*/ React.forwardRef(function (_ref, ref) {
  var _ref$initialValue = _ref.initialValue,
    initialValue = _ref$initialValue === void 0 ? "" : _ref$initialValue,
    onChange = _ref.onChange,
    _ref$snippets = _ref.snippets,
    snippets = _ref$snippets === void 0 ? [] : _ref$snippets,
    _ref$placeholder = _ref.placeholder,
    placeholder =
      _ref$placeholder === void 0 ? "Start typing..." : _ref$placeholder,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    _ref$variablePrefix = _ref.variablePrefix,
    variablePrefix =
      _ref$variablePrefix === void 0 ? "[[" : _ref$variablePrefix,
    _ref$variableSuffix = _ref.variableSuffix,
    variableSuffix =
      _ref$variableSuffix === void 0 ? "]]" : _ref$variableSuffix,
    onVariablePrompt = _ref.onVariablePrompt;
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    showSnippets = _useState2[0],
    setShowSnippets = _useState2[1];

  // Custom hooks
  var _useEditorContent = useEditorContent(initialValue, onChange),
    editorRef = _useEditorContent.editorRef,
    updateContent = _useEditorContent.updateContent,
    setEditorContent = _useEditorContent.setEditorContent,
    getContent = _useEditorContent.getContent;
  var _useSelection = useSelection(editorRef),
    currentRange = _useSelection.currentRange,
    saveSelection = _useSelection.saveSelection,
    restoreSelection = _useSelection.restoreSelection,
    handleMouseUp = _useSelection.handleMouseUp;
  var _useVariables = useVariables(
      editorRef,
      variablePrefix,
      variableSuffix,
      onVariablePrompt,
    ),
    populateVariables = _useVariables.populateVariables,
    insertVariable = _useVariables.insertVariable,
    getAllVariables = _useVariables.getAllVariables,
    generatePopulatedContent = _useVariables.generatePopulatedContent;
  var _useFormatting = useFormatting(
      editorRef,
      updateContent,
      saveSelection,
      restoreSelection,
    ),
    toggleBold = _useFormatting.toggleBold,
    toggleItalic = _useFormatting.toggleItalic,
    toggleUnderline = _useFormatting.toggleUnderline,
    insertBulletList = _useFormatting.insertBulletList,
    insertNumberedList = _useFormatting.insertNumberedList,
    createLink = _useFormatting.createLink;
  var _useClipboard = useClipboard(),
    copyToClipboard = _useClipboard.copyToClipboard;

  // Focus the first button in the toolbar (used for F10 accessibility)
  var handleToolbarFocus = React.useCallback(function () {
    var firstToolbarButton = document.querySelector(
      ".gravy-toolbar .toolbar-btn",
    );
    if (firstToolbarButton) {
      firstToolbarButton.focus();
    }
  }, []);
  var _useKeyboardShortcuts = useKeyboardShortcuts(editorRef, {
      toggleBold: toggleBold,
      toggleItalic: toggleItalic,
      toggleUnderline: toggleUnderline,
      onToolbarFocus: handleToolbarFocus,
    }),
    handleKeyDown = _useKeyboardShortcuts.handleKeyDown,
    handleToolbarKeyDown = _useKeyboardShortcuts.handleToolbarKeyDown;

  // Insert a snippet's content at the current cursor position
  var insertSnippet = React.useCallback(
    function (snippet) {
      try {
        saveSelection();
        var selection = window.getSelection();
        if (currentRange) {
          selection.removeAllRanges();
          selection.addRange(currentRange);
        }
        var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range) {
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = snippet.content;
          var fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          range.deleteContents();
          range.insertNode(fragment);

          // Move cursor to end of inserted content
          var newRange = document.createRange();
          newRange.setStartAfter(fragment);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        setShowSnippets(false);
        updateContent();
      } catch (error) {
        console.error("Error inserting snippet:", error);
      }
    },
    [saveSelection, currentRange, updateContent],
  );

  // Handle the variable insertion button click
  var handleInsertVariable = React.useCallback(
    function () {
      insertVariable(
        currentRange,
        saveSelection,
        restoreSelection,
        updateContent,
      );
    },
    [
      insertVariable,
      currentRange,
      saveSelection,
      restoreSelection,
      updateContent,
    ],
  );

  // Toggle the snippet dropdown visibility
  var handleToggleSnippets = React.useCallback(
    function () {
      setShowSnippets(!showSnippets);
    },
    [showSnippets],
  );

  // Close the snippet dropdown
  var handleCloseSnippets = React.useCallback(function () {
    setShowSnippets(false);
  }, []);

  // Handle input events from the editor and update content
  var handleEditorInput = React.useCallback(
    function () {
      updateContent();
    },
    [updateContent],
  );

  // Expose methods through ref
  React.useImperativeHandle(
    ref,
    function () {
      return {
        populateVariables: populateVariables,
        getContent: getContent,
        setContent: setEditorContent,
        getAllVariables: getAllVariables,
        generatePopulatedContent: generatePopulatedContent,
        copyToClipboard: copyToClipboard,
      };
    },
    [
      populateVariables,
      getContent,
      setEditorContent,
      getAllVariables,
      generatePopulatedContent,
      copyToClipboard,
    ],
  );
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "gravy-editor ".concat(className),
    },
    /*#__PURE__*/ React.createElement(Toolbar, {
      onBold: toggleBold,
      onItalic: toggleItalic,
      onUnderline: toggleUnderline,
      onBulletList: insertBulletList,
      onNumberedList: insertNumberedList,
      onCreateLink: createLink,
      onInsertVariable: handleInsertVariable,
      onToggleSnippets: handleToggleSnippets,
      showSnippets: showSnippets,
      variablePrefix: variablePrefix,
      variableSuffix: variableSuffix,
      onKeyDown: handleToolbarKeyDown,
    }),
    /*#__PURE__*/ React.createElement(Editor, {
      ref: editorRef,
      placeholder: placeholder,
      onInput: handleEditorInput,
      onKeyDown: handleKeyDown,
      onMouseUp: handleMouseUp,
      "aria-label": placeholder,
    }),
    /*#__PURE__*/ React.createElement(SnippetDropdown, {
      snippets: snippets,
      onInsertSnippet: insertSnippet,
      onClose: handleCloseSnippets,
      isVisible: showSnippets,
    }),
  );
});
GravyJS.displayName = "GravyJS";

exports.default = GravyJS;
//# sourceMappingURL=index.js.map
