webpackJsonp([2,5],{

/***/ 115:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(313);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(115)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/index.js!./app.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/index.js!./app.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(314);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(115)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/index.js!./theme.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/index.js!./theme.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(315);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(115)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!./styles.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!./styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "/**\r\n * Applies styles for users in high contrast mode. Note that this only applies\r\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\r\n * attribute, however Chrome handles high contrast differently.\r\n */\n/* Theme for the ripple elements.*/\n/** The mixins below are shared between md-menu and md-select */\n/**\r\n * This mixin adds the correct panel transform styles based\r\n * on the direction that the menu panel opens.\r\n */\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\r\n * Applies styles for users in high contrast mode. Note that this only applies\r\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\r\n * attribute, however Chrome handles high contrast differently.\r\n */\n/**\r\n * This mixin contains shared option styles between the select and\r\n * autocomplete components.\r\n */\n.mat-elevation-z0 {\n  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z1 {\n  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z2 {\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z3 {\n  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z4 {\n  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z5 {\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z6 {\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z7 {\n  box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z8 {\n  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z9 {\n  box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z10 {\n  box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z11 {\n  box-shadow: 0px 6px 7px -4px rgba(0, 0, 0, 0.2), 0px 11px 15px 1px rgba(0, 0, 0, 0.14), 0px 4px 20px 3px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z12 {\n  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z13 {\n  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z14 {\n  box-shadow: 0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z15 {\n  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z16 {\n  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z17 {\n  box-shadow: 0px 8px 11px -5px rgba(0, 0, 0, 0.2), 0px 17px 26px 2px rgba(0, 0, 0, 0.14), 0px 6px 32px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z18 {\n  box-shadow: 0px 9px 11px -5px rgba(0, 0, 0, 0.2), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z19 {\n  box-shadow: 0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 19px 29px 2px rgba(0, 0, 0, 0.14), 0px 7px 36px 6px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z20 {\n  box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z21 {\n  box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 21px 33px 3px rgba(0, 0, 0, 0.14), 0px 8px 40px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z22 {\n  box-shadow: 0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z23 {\n  box-shadow: 0px 11px 14px -7px rgba(0, 0, 0, 0.2), 0px 23px 36px 3px rgba(0, 0, 0, 0.14), 0px 9px 44px 8px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z24 {\n  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12); }\n\n.mat-ripple {\n  overflow: hidden; }\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible; }\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, -webkit-transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  -webkit-transform: scale(0);\n          transform: scale(0); }\n\n.mat-option {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n  line-height: 48px;\n  height: 48px;\n  padding: 0 16px;\n  font-size: 16px;\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n  text-align: left;\n  text-decoration: none;\n  position: relative;\n  cursor: pointer;\n  outline: none; }\n  .mat-option[disabled] {\n    cursor: default; }\n  [dir='rtl'] .mat-option {\n    text-align: right; }\n  .mat-option .mat-icon {\n    margin-right: 16px; }\n    [dir='rtl'] .mat-option .mat-icon {\n      margin-left: 16px; }\n  .mat-option[aria-disabled='true'] {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    cursor: default; }\n\n.mat-option-ripple {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0; }\n  @media screen and (-ms-high-contrast: active) {\n    .mat-option-ripple {\n      opacity: 0.5; } }\n\n.mat-option-pseudo-checkbox {\n  margin-right: 8px; }\n  [dir='rtl'] .mat-option-pseudo-checkbox {\n    margin-left: 8px;\n    margin-right: 0; }\n\n.cdk-visually-hidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  text-transform: none;\n  width: 1px; }\n\n.cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%; }\n\n.cdk-overlay-container {\n  position: fixed;\n  z-index: 1000; }\n\n.cdk-global-overlay-wrapper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  z-index: 1000; }\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  z-index: 1000; }\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  pointer-events: auto;\n  transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  opacity: 0; }\n  .cdk-overlay-backdrop.cdk-overlay-backdrop-showing {\n    opacity: 0.48; }\n\n.cdk-overlay-dark-backdrop {\n  background: rgba(0, 0, 0, 0.6); }\n\n.cdk-overlay-transparent-backdrop {\n  background: none; }\n\n/* $sidebar-panel\r\n ------------------------------------------*/\nmd-sidenav.sidebar-panel {\n  overflow-x: hidden;\n  width: 15rem;\n  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important; }\n  md-sidenav.sidebar-panel .mat-sidenav-focus-trap > .cdk-focus-trap-content {\n    position: relative; }\n  md-sidenav.sidebar-panel > nav {\n    min-width: 15rem; }\n  md-sidenav.sidebar-panel .mat-list-item .mat-list-item-content {\n    display: block;\n    height: auto;\n    max-height: 48px;\n    overflow: hidden;\n    padding: 0;\n    transition: max-height 0.3s cubic-bezier(0.35, 0, 0.25, 1); }\n  md-sidenav.sidebar-panel .mat-list-item {\n    background-color: transparent;\n    transition: background-color 0.3s cubic-bezier(0.35, 0, 0.25, 1); }\n  md-sidenav.sidebar-panel .mat-list-item.open > .mat-list-item-content {\n    max-height: 1000px;\n    background: rgba(0, 0, 0, 0.04); }\n  md-sidenav.sidebar-panel .mat-nav-list a {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 48px;\n    padding: 0 16px; }\n  md-sidenav.sidebar-panel .sub-menu {\n    padding-top: 0;\n    overflow: hidden;\n    transition: 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n    transition-property: max-height; }\n  md-sidenav.sidebar-panel .sub-menu a {\n    padding-left: 64px; }\n  md-sidenav.sidebar-panel .sub-menu .sub-menu a {\n    padding-left: 80px; }\n  md-sidenav.sidebar-panel .sub-menu .sub-menu .sub-menu a {\n    padding-left: 96px; }\n  md-sidenav.sidebar-panel .sub-menu .sub-menu .sub-menu .sub-menu a {\n    padding-left: 112px; }\n  md-sidenav.sidebar-panel .navigation md-icon:not(.menu-caret) {\n    margin-right: 24px; }\n  md-sidenav.sidebar-panel .navigation .menu-caret {\n    display: inline-block;\n    transition: -webkit-transform 300ms cubic-bezier(0.7, 0, 0.3, 1);\n    transition: transform 300ms cubic-bezier(0.7, 0, 0.3, 1);\n    transition: transform 300ms cubic-bezier(0.7, 0, 0.3, 1), -webkit-transform 300ms cubic-bezier(0.7, 0, 0.3, 1);\n    float: right ;\n    margin-left: 0.3125rem;\n    text-align: center; }\n  md-sidenav.sidebar-panel .navigation .open > .mat-list-item-content > [appAccordionToggle] > .menu-caret {\n    -webkit-transform: rotate(-180deg);\n    transform: rotate(-180deg); }\n  md-sidenav.sidebar-panel .navigation .menu-badge {\n    display: inline-block;\n    height: 16px;\n    min-width: 10px;\n    line-height: 18px;\n    text-align: center;\n    border-radius: 16px;\n    font-size: 10px;\n    font-weight: 700;\n    padding: 0 4px; }\n  md-sidenav.sidebar-panel .navigation .open > .mat-list-item-content > .sub-menu {\n    max-height: 1000px; }\n\n@media (min-width: 960px) {\n  /* Collapsed sidebar */\n  .collapsed-sidebar .mat-sidenav-backdrop {\n    display: none; }\n  .collapsed-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content {\n    margin-left: 80px !important; }\n  .collapsed-sidebar md-sidenav.sidebar-panel {\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important; }\n  .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) {\n    width: 80px; }\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .sub-menu {\n      display: none !important;\n      visibility: hidden; }\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a {\n      padding-right: 0;\n      padding-left: 0;\n      text-align: center; }\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > span:not(.menu-badge),\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > .menu-caret {\n      display: none; }\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > span.menu-badge {\n      position: absolute;\n      top: 10px;\n      right: 16px; }\n    .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > .material-icons {\n      width: 80px !important;\n      padding: 0;\n      margin: 0; }\n  /* Compact sidebar */\n  .compact-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content {\n    margin-left: 100px !important; }\n  .compact-sidebar md-sidenav.sidebar-panel {\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;\n    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important; }\n  .compact-sidebar md-sidenav.sidebar-panel {\n    width: 100px;\n    overflow: visible !important; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content {\n      height: 60px;\n      max-height: 60px;\n      -webkit-box-align: center;\n      -ms-flex-align: center;\n      -moz-align-items: center;\n      align-items: center;\n      -webkit-box-pack: center;\n      -ms-flex-pack: center;\n      -moz-justify-content: center;\n      justify-content: center; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item {\n      position: relative; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content {\n      overflow: visible; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a {\n      padding-right: 0;\n      padding-left: 0;\n      padding-top: 9px;\n      padding-bottom: 9px;\n      text-align: center;\n      box-sizing: content-box !important;\n      -ms-flex-direction: column !important;\n      -webkit-box-orient: vertical !important;\n      -webkit-box-direction: normal !important;\n              flex-direction: column !important;\n      height: 42px; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a > span:not(.menu-badge):not(.menu-caret) {\n      font-size: 12px; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a > span.menu-badge {\n      position: absolute;\n      top: 10px;\n      right: 16px; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a > .material-icons {\n      width: 100px !important;\n      padding: 0;\n      margin: 0; }\n    .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item:hover > .mat-list-item-content > .sub-menu {\n      display: block !important;\n      visibility: visible; }\n    .compact-sidebar md-sidenav.sidebar-panel .mat-list-item > .mat-list-item-content > a > .menu-caret,\n    .compact-sidebar md-sidenav.sidebar-panel .mat-list-item > .mat-list-item-content > a > [fxflex] {\n      display: none; }\n    .compact-sidebar md-sidenav.sidebar-panel .sub-menu {\n      display: none !important;\n      visibility: hidden;\n      background: white;\n      box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);\n      position: absolute;\n      top: 0;\n      left: 100%;\n      max-height: 300px;\n      overflow-x: hidden;\n      overflow-y: auto; }\n      .compact-sidebar md-sidenav.sidebar-panel .sub-menu a {\n        padding-left: 16px;\n        height: 36px; } }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .sub-menu a {\n  padding-right: 64px;\n  padding-left: 16px; }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .sub-menu .sub-menu a {\n  padding-right: 80px;\n  padding-left: 16px; }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .sub-menu .sub-menu .sub-menu a {\n  padding-right: 96px;\n  padding-left: 16px; }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .sub-menu .sub-menu .sub-menu .sub-menu a {\n  padding-right: 112px;\n  padding-left: 16px; }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .navigation md-icon:not(.menu-caret) {\n  margin-left: 24px;\n  margin-right: 0; }\n\n[dir=\"rtl\"] md-sidenav.sidebar-panel .navigation .menu-caret {\n  float: left ;\n  margin-right: 0.3125rem;\n  margin-left: 0; }\n\n@media (min-width: 960px) {\n  [dir=\"rtl\"].collapsed-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content, [dir=\"rtl\"] .collapsed-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content {\n    margin-left: 0 !important;\n    margin-right: 80px !important; }\n  [dir=\"rtl\"].collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > span.menu-badge, [dir=\"rtl\"] .collapsed-sidebar md-sidenav.sidebar-panel:not(:hover) .mat-list-item > .mat-list-item-content > a > span.menu-badge {\n    right: auto;\n    left: 16px; }\n  [dir=\"rtl\"].compact-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content, [dir=\"rtl\"] .compact-sidebar md-sidenav.sidebar-panel.mat-sidenav-opened ~ .mat-sidenav-content {\n    margin-left: auto !important;\n    margin-right: 100px !important; }\n  [dir=\"rtl\"].compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a > span.menu-badge, [dir=\"rtl\"] .compact-sidebar md-sidenav.sidebar-panel .navigation > .mat-list-item > .mat-list-item-content > a > span.menu-badge {\n    right: auto;\n    left: 16px; }\n  [dir=\"rtl\"].compact-sidebar md-sidenav.sidebar-panel .sub-menu, [dir=\"rtl\"] .compact-sidebar md-sidenav.sidebar-panel .sub-menu {\n    left: auto;\n    right: 100%; }\n    [dir=\"rtl\"].compact-sidebar md-sidenav.sidebar-panel .sub-menu a, [dir=\"rtl\"] .compact-sidebar md-sidenav.sidebar-panel .sub-menu a {\n      padding-left: 16px;\n      padding-right: 16px; }\n  .app-dark.compact-sidebar md-sidenav.sidebar-panel .sub-menu, .app-dark .compact-sidebar md-sidenav.sidebar-panel .sub-menu {\n    background: #424242; } }\n\n/* $main-panel\r\n ------------------------------------------*/\n.app-inner {\n  position: relative;\n  width: 100%;\n  max-width: 100%;\n  height: calc(100vh - 64px);\n  display: -webkit-box;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-direction: normal;\n  -webkit-box-orient: horizontal;\n  -moz-flex-direction: row;\n  -ms-flex-direction: row;\n  flex-direction: row; }\n\n@media (max-width: 600px) and (orientation: portrait) {\n  .app-inner {\n    height: calc(100vh - 56px); } }\n\n@media (max-width: 960px) and (orientation: landscape) {\n  .app-inner {\n    height: calc(100vh - 48px); } }\n\n/* Boxed layout*/\n.app.boxed {\n  overflow: hidden;\n  margin-right: auto;\n  margin-left: auto; }\n\n@media (min-width: 48em) {\n  .app.boxed {\n    max-width: 46.88rem; } }\n\n@media (min-width: 62rem) {\n  .app.boxed {\n    max-width: 60.63rem; } }\n\n@media (min-width: 75rem) {\n  .app.boxed {\n    max-width: 73.13rem; } }\n\n.mat-sidenav-content {\n  min-height: 100%;\n  box-sizing: border-box;\n  -webkit-box-direction: normal;\n  -webkit-box-orient: vertical;\n  -moz-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  display: -webkit-box;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -moz-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.33333rem; }\n  .mat-sidenav-content > .main-content {\n    box-sizing: border-box;\n    -webkit-box-direction: normal;\n    -webkit-box-orient: vertical;\n    -moz-flex-direction: column;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    display: -webkit-box;\n    display: -moz-flex;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-flex: 1;\n    -moz-flex: 1;\n    -ms-flex: 1;\n    flex: 1; }\n    .mat-sidenav-content > .main-content > .content-view {\n      position: relative;\n      box-sizing: border-box;\n      padding: 1rem;\n      -webkit-box-flex: 1;\n      -moz-flex: 1 0 auto;\n      -ms-flex: 1 0 auto;\n      flex: 1 0 auto; }\n\n.app-dark .mat-sidenav-content {\n  background-color: #353535; }\n\nbody {\n  background-color: #f1f1f1; }\n\n#taw-content {\n  padding-bottom: 100px; }\n\n#toast-container.toast-top-right {\n  top: 81px; }\n\n#toast-container .toast-success {\n  background-image: none !important;\n  padding-left: 16px; }\n  @media screen and (max-width: 767px) {\n    #toast-container .toast-success {\n      position: absolute;\n      right: 0; } }\n  #toast-container .toast-success h5 {\n    font-size: 17px; }\n  #toast-container .toast-success p {\n    font-size: 13px;\n    margin: 12px 0;\n    line-height: 17px; }\n  #toast-container .toast-success .toast-close-button {\n    position: absolute;\n    right: 8px;\n    top: 2px; }\n\n.dev-team-item .card-title {\n  display: block; }\n\n@media screen and (max-width: 767px) {\n  .container {\n    width: 100%;\n    padding-left: 16px;\n    padding-right: 16px; } }\n\n@media screen and (min-width: 768px) and (max-width: 1199px) {\n  .container {\n    width: 100%;\n    padding-left: 24px;\n    padding-right: 24px; } }\n\n@media screen and (min-width: 1200px) {\n  .container {\n    width: 1200px;\n    padding-left: 24px;\n    padding-right: 24px; } }\n\n#taw-header {\n  padding: 0;\n  height: 80px; }\n  #taw-header nav {\n    background: #ff8401;\n    background: linear-gradient(to bottom, #ff8401 0%, #fd4d00 100%);\n    height: 80px; }\n    #taw-header nav .logo-container {\n      padding-top: 10px; }\n      #taw-header nav .logo-container img {\n        line-height: 0;\n        width: 86px; }\n    #taw-header nav .giff-img {\n      width: 40px; }\n    #taw-header nav .search-section .search-top,\n    #taw-header nav .search-section .instruction {\n      line-height: 20px; }\n    #taw-header nav .search-section .search-top {\n      font-size: 18px;\n      padding: 15px 0 10px 10px;\n      border-bottom: #ffffff 1px solid; }\n    #taw-header nav .search-section .instruction {\n      font-size: 12px;\n      padding: 0 0 10px 10px; }\n    #taw-header nav .mic-icon {\n      line-height: 16px; }\n      #taw-header nav .mic-icon .btn {\n        background-color: #ffffff; }\n        #taw-header nav .mic-icon .btn .material-icons {\n          line-height: 40px;\n          height: 40px;\n          color: #fe6700; }\n\n.video-list-open .giff-img-wrapper {\n  display: none; }\n\n@media screen and (min-width: 768px) {\n  .giff-img-wrapper {\n    vertical-align: middle;\n    text-align: center;\n    min-height: 200px; } }\n\n@media screen and (max-width: 768px) {\n  .giff-img-wrapper {\n    padding-top: 40%; } }\n\n.giff-img-wrapper .spinner {\n  width: 100px;\n  height: 100px;\n  margin: 100px auto;\n  border-radius: 100%;\n  position: relative; }\n  .giff-img-wrapper .spinner .mic-icon {\n    display: block;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%); }\n  .giff-img-wrapper .spinner .double-bounce1,\n  .giff-img-wrapper .spinner .double-bounce2 {\n    background-color: #fe6700;\n    border-radius: 50%;\n    opacity: 0.8;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;\n    animation: sk-scaleout 1.0s infinite ease-in-out; }\n\n.giff-img-wrapper .material-icons {\n  line-height: 40px;\n  height: 40px;\n  color: #fe6700; }\n\n@-webkit-keyframes sk-scaleout {\n  0%,\n  100% {\n    -webkit-transform: scale(0); }\n  50% {\n    -webkit-transform: scale(1);\n    opacity: 0; } }\n\n@keyframes sk-scaleout {\n  0%,\n  100% {\n    -webkit-transform: scale(0);\n    transform: scale(0); }\n  50% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0; } }\n\n#footer {\n  position: fixed;\n  bottom: 0;\n  width: 100%; }\n  #footer .footerTop {\n    background-color: #333333;\n    padding-top: 5px;\n    padding-bottom: 5px; }\n    #footer .footerTop img {\n      width: 70px;\n      height: auto; }\n  #footer .footerBottom {\n    background-color: #282727;\n    padding-top: 24px;\n    padding-bottom: 24px; }\n    #footer .footerBottom span {\n      color: #b4b4b4;\n      font-size: 15px;\n      text-shadow: 2px 2px 0 #000000; }\n\n.row .list-view .video-list-item {\n  width: 100%; }\n  @media screen and (min-width: 768px) {\n    .row .list-view .video-list-item .card {\n      min-height: 300px; } }\n  .row .list-view .video-list-item .card .card-content {\n    word-wrap: break-word; }\n\n.row .video-list-item.even {\n  clear: both; }\n\n.row .video-list-item .btn-floating.halfway-fab {\n  position: absolute;\n  right: 24px;\n  bottom: -20px; }\n\n.row .video-list-item.activeClass .card {\n  transition: box-shadow .25s;\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); }\n\n.video-container {\n  margin-top: 10px; }\n", ""]);

// exports


/***/ }),

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "/**\r\n * Applies styles for users in high contrast mode. Note that this only applies\r\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\r\n * attribute, however Chrome handles high contrast differently.\r\n */\n/* Theme for the ripple elements.*/\n/** The mixins below are shared between md-menu and md-select */\n/**\r\n * This mixin adds the correct panel transform styles based\r\n * on the direction that the menu panel opens.\r\n */\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\r\n * Applies styles for users in high contrast mode. Note that this only applies\r\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\r\n * attribute, however Chrome handles high contrast differently.\r\n */\n/**\r\n * This mixin contains shared option styles between the select and\r\n * autocomplete components.\r\n */\n.mat-elevation-z0 {\n  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z1 {\n  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z2 {\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z3 {\n  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z4 {\n  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z5 {\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z6 {\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z7 {\n  box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z8 {\n  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z9 {\n  box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z10 {\n  box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z11 {\n  box-shadow: 0px 6px 7px -4px rgba(0, 0, 0, 0.2), 0px 11px 15px 1px rgba(0, 0, 0, 0.14), 0px 4px 20px 3px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z12 {\n  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z13 {\n  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z14 {\n  box-shadow: 0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z15 {\n  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z16 {\n  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z17 {\n  box-shadow: 0px 8px 11px -5px rgba(0, 0, 0, 0.2), 0px 17px 26px 2px rgba(0, 0, 0, 0.14), 0px 6px 32px 5px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z18 {\n  box-shadow: 0px 9px 11px -5px rgba(0, 0, 0, 0.2), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z19 {\n  box-shadow: 0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 19px 29px 2px rgba(0, 0, 0, 0.14), 0px 7px 36px 6px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z20 {\n  box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z21 {\n  box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 21px 33px 3px rgba(0, 0, 0, 0.14), 0px 8px 40px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z22 {\n  box-shadow: 0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z23 {\n  box-shadow: 0px 11px 14px -7px rgba(0, 0, 0, 0.2), 0px 23px 36px 3px rgba(0, 0, 0, 0.14), 0px 9px 44px 8px rgba(0, 0, 0, 0.12); }\n\n.mat-elevation-z24 {\n  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12); }\n\n.mat-ripple {\n  overflow: hidden; }\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible; }\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, -webkit-transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  -webkit-transform: scale(0);\n          transform: scale(0); }\n\n.mat-option {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n  line-height: 48px;\n  height: 48px;\n  padding: 0 16px;\n  font-size: 16px;\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n  text-align: left;\n  text-decoration: none;\n  position: relative;\n  cursor: pointer;\n  outline: none; }\n  .mat-option[disabled] {\n    cursor: default; }\n  [dir='rtl'] .mat-option {\n    text-align: right; }\n  .mat-option .mat-icon {\n    margin-right: 16px; }\n    [dir='rtl'] .mat-option .mat-icon {\n      margin-left: 16px; }\n  .mat-option[aria-disabled='true'] {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    cursor: default; }\n\n.mat-option-ripple {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0; }\n  @media screen and (-ms-high-contrast: active) {\n    .mat-option-ripple {\n      opacity: 0.5; } }\n\n.mat-option-pseudo-checkbox {\n  margin-right: 8px; }\n  [dir='rtl'] .mat-option-pseudo-checkbox {\n    margin-left: 8px;\n    margin-right: 0; }\n\n.cdk-visually-hidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  text-transform: none;\n  width: 1px; }\n\n.cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%; }\n\n.cdk-overlay-container {\n  position: fixed;\n  z-index: 1000; }\n\n.cdk-global-overlay-wrapper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  z-index: 1000; }\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  z-index: 1000; }\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  pointer-events: auto;\n  transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  opacity: 0; }\n  .cdk-overlay-backdrop.cdk-overlay-backdrop-showing {\n    opacity: 0.48; }\n\n.cdk-overlay-dark-backdrop {\n  background: rgba(0, 0, 0, 0.6); }\n\n.cdk-overlay-transparent-backdrop {\n  background: none; }\n\n.mat-ripple-element {\n  background-color: rgba(0, 0, 0, 0.1); }\n\n.mat-option:hover:not(.mat-option-disabled), .mat-option:focus:not(.mat-option-disabled) {\n  background: rgba(0, 0, 0, 0.04); }\n\n.mat-option.mat-selected {\n  color: #f44336; }\n  .mat-option.mat-selected:not(.mat-option-multiple) {\n    background: rgba(0, 0, 0, 0.04); }\n\n.mat-option.mat-active {\n  background: rgba(0, 0, 0, 0.04);\n  color: rgba(0, 0, 0, 0.87); }\n\n.mat-option.mat-option-disabled {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mat-pseudo-checkbox {\n  color: rgba(0, 0, 0, 0.54); }\n  .mat-pseudo-checkbox::after {\n    color: #fafafa; }\n\n.mat-pseudo-checkbox-checked.mat-primary, .mat-pseudo-checkbox-indeterminate.mat-primary {\n  background: #f44336; }\n\n.mat-pseudo-checkbox-checked.mat-accent, .mat-pseudo-checkbox-indeterminate.mat-accent {\n  background: #2196f3; }\n\n.mat-pseudo-checkbox-checked.mat-warn, .mat-pseudo-checkbox-indeterminate.mat-warn {\n  background: #f44336; }\n\n.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {\n  background: #b0b0b0; }\n\n.mat-app-background {\n  background-color: #fafafa; }\n\n.mat-theme-loaded-marker {\n  display: none; }\n\n.mat-autocomplete-panel {\n  background: white;\n  color: rgba(0, 0, 0, 0.87); }\n  .mat-autocomplete-panel .mat-option.mat-selected:not(.mat-active) {\n    background: white;\n    color: rgba(0, 0, 0, 0.87); }\n\n.mat-button.mat-primary .mat-button-focus-overlay, .mat-icon-button.mat-primary .mat-button-focus-overlay, .mat-raised-button.mat-primary .mat-button-focus-overlay, .mat-fab.mat-primary .mat-button-focus-overlay, .mat-mini-fab.mat-primary .mat-button-focus-overlay {\n  background-color: rgba(244, 67, 54, 0.12); }\n\n.mat-button.mat-accent .mat-button-focus-overlay, .mat-icon-button.mat-accent .mat-button-focus-overlay, .mat-raised-button.mat-accent .mat-button-focus-overlay, .mat-fab.mat-accent .mat-button-focus-overlay, .mat-mini-fab.mat-accent .mat-button-focus-overlay {\n  background-color: rgba(33, 150, 243, 0.12); }\n\n.mat-button.mat-warn .mat-button-focus-overlay, .mat-icon-button.mat-warn .mat-button-focus-overlay, .mat-raised-button.mat-warn .mat-button-focus-overlay, .mat-fab.mat-warn .mat-button-focus-overlay, .mat-mini-fab.mat-warn .mat-button-focus-overlay {\n  background-color: rgba(244, 67, 54, 0.12); }\n\n.mat-button[disabled] .mat-button-focus-overlay, .mat-icon-button[disabled] .mat-button-focus-overlay, .mat-raised-button[disabled] .mat-button-focus-overlay, .mat-fab[disabled] .mat-button-focus-overlay, .mat-mini-fab[disabled] .mat-button-focus-overlay {\n  background-color: transparent; }\n\n.mat-button, .mat-icon-button {\n  background: transparent; }\n  .mat-button.mat-primary, .mat-icon-button.mat-primary {\n    color: #f44336; }\n  .mat-button.mat-accent, .mat-icon-button.mat-accent {\n    color: #2196f3; }\n  .mat-button.mat-warn, .mat-icon-button.mat-warn {\n    color: #f44336; }\n  .mat-button.mat-primary[disabled], .mat-button.mat-accent[disabled], .mat-button.mat-warn[disabled], .mat-button[disabled][disabled], .mat-icon-button.mat-primary[disabled], .mat-icon-button.mat-accent[disabled], .mat-icon-button.mat-warn[disabled], .mat-icon-button[disabled][disabled] {\n    color: rgba(0, 0, 0, 0.38); }\n\n.mat-icon-button.mat-primary .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.mat-icon-button.mat-accent .mat-ripple-element {\n  background-color: rgba(33, 150, 243, 0.26); }\n\n.mat-icon-button.mat-warn .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.mat-raised-button, .mat-fab, .mat-mini-fab {\n  color: rgba(0, 0, 0, 0.87);\n  background-color: white; }\n  .mat-raised-button.mat-primary, .mat-fab.mat-primary, .mat-mini-fab.mat-primary {\n    color: white; }\n  .mat-raised-button.mat-accent, .mat-fab.mat-accent, .mat-mini-fab.mat-accent {\n    color: white; }\n  .mat-raised-button.mat-warn, .mat-fab.mat-warn, .mat-mini-fab.mat-warn {\n    color: white; }\n  .mat-raised-button.mat-primary[disabled], .mat-raised-button.mat-accent[disabled], .mat-raised-button.mat-warn[disabled], .mat-raised-button[disabled][disabled], .mat-fab.mat-primary[disabled], .mat-fab.mat-accent[disabled], .mat-fab.mat-warn[disabled], .mat-fab[disabled][disabled], .mat-mini-fab.mat-primary[disabled], .mat-mini-fab.mat-accent[disabled], .mat-mini-fab.mat-warn[disabled], .mat-mini-fab[disabled][disabled] {\n    color: rgba(0, 0, 0, 0.38); }\n  .mat-raised-button.mat-primary, .mat-fab.mat-primary, .mat-mini-fab.mat-primary {\n    background-color: #f44336; }\n  .mat-raised-button.mat-accent, .mat-fab.mat-accent, .mat-mini-fab.mat-accent {\n    background-color: #2196f3; }\n  .mat-raised-button.mat-warn, .mat-fab.mat-warn, .mat-mini-fab.mat-warn {\n    background-color: #f44336; }\n  .mat-raised-button.mat-primary[disabled], .mat-raised-button.mat-accent[disabled], .mat-raised-button.mat-warn[disabled], .mat-raised-button[disabled][disabled], .mat-fab.mat-primary[disabled], .mat-fab.mat-accent[disabled], .mat-fab.mat-warn[disabled], .mat-fab[disabled][disabled], .mat-mini-fab.mat-primary[disabled], .mat-mini-fab.mat-accent[disabled], .mat-mini-fab.mat-warn[disabled], .mat-mini-fab[disabled][disabled] {\n    background-color: rgba(0, 0, 0, 0.12); }\n\n.mat-fab, .mat-mini-fab {\n  background-color: #2196f3;\n  color: white; }\n\n.mat-button-toggle {\n  color: rgba(0, 0, 0, 0.38); }\n  .mat-button-toggle.cdk-focused .mat-button-toggle-focus-overlay {\n    background-color: rgba(0, 0, 0, 0.06); }\n\n.mat-button-toggle-checked {\n  background-color: #e0e0e0;\n  color: black; }\n\n.mat-button-toggle-disabled {\n  background-color: #eeeeee;\n  color: rgba(0, 0, 0, 0.38); }\n  .mat-button-toggle-disabled.mat-button-toggle-checked {\n    background-color: #bdbdbd; }\n\n.mat-card {\n  background: white;\n  color: black; }\n\n.mat-card-subtitle {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mat-checkbox-frame {\n  border-color: rgba(0, 0, 0, 0.54); }\n\n.mat-checkbox-checkmark {\n  fill: #fafafa; }\n\n.mat-checkbox-checkmark-path {\n  stroke: #fafafa !important; }\n\n.mat-checkbox-mixedmark {\n  background-color: #fafafa; }\n\n.mat-checkbox-indeterminate.mat-primary .mat-checkbox-background, .mat-checkbox-checked.mat-primary .mat-checkbox-background {\n  background-color: #f44336; }\n\n.mat-checkbox-indeterminate.mat-accent .mat-checkbox-background, .mat-checkbox-checked.mat-accent .mat-checkbox-background {\n  background-color: #2196f3; }\n\n.mat-checkbox-indeterminate.mat-warn .mat-checkbox-background, .mat-checkbox-checked.mat-warn .mat-checkbox-background {\n  background-color: #f44336; }\n\n.mat-checkbox-disabled.mat-checkbox-checked .mat-checkbox-background, .mat-checkbox-disabled.mat-checkbox-indeterminate .mat-checkbox-background {\n  background-color: #b0b0b0; }\n\n.mat-checkbox-disabled:not(.mat-checkbox-checked) .mat-checkbox-frame {\n  border-color: #b0b0b0; }\n\n.mat-checkbox:not(.mat-checkbox-disabled).mat-primary .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.mat-checkbox:not(.mat-checkbox-disabled).mat-accent .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(33, 150, 243, 0.26); }\n\n.mat-checkbox:not(.mat-checkbox-disabled).mat-warn .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.mat-chip:not(.mat-basic-chip) {\n  background-color: #e0e0e0;\n  color: rgba(0, 0, 0, 0.87); }\n\n.mat-chip.mat-chip-selected:not(.mat-basic-chip) {\n  background-color: #808080;\n  color: rgba(255, 255, 255, 0.87); }\n  .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-primary {\n    background-color: #f44336;\n    color: white; }\n  .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-accent {\n    background-color: #2196f3;\n    color: white; }\n  .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-warn {\n    background-color: #f44336;\n    color: white; }\n\n.mat-dialog-container {\n  background: white; }\n\n.mat-icon.mat-primary {\n  color: #f44336; }\n\n.mat-icon.mat-accent {\n  color: #2196f3; }\n\n.mat-icon.mat-warn {\n  color: #f44336; }\n\n.mat-input-placeholder {\n  color: rgba(0, 0, 0, 0.38); }\n  .mat-focused .mat-input-placeholder {\n    color: #f44336; }\n    .mat-focused .mat-input-placeholder.mat-accent {\n      color: #2196f3; }\n    .mat-focused .mat-input-placeholder.mat-warn {\n      color: #f44336; }\n\n.mat-input-element:disabled {\n  color: rgba(0, 0, 0, 0.38); }\n\ninput.mat-input-element:-webkit-autofill + .mat-input-placeholder .mat-placeholder-required,\n.mat-focused .mat-input-placeholder.mat-float .mat-placeholder-required {\n  color: #2196f3; }\n\n.mat-input-underline {\n  border-color: rgba(0, 0, 0, 0.12); }\n  .mat-input-underline .mat-input-ripple {\n    background-color: #f44336; }\n    .mat-input-underline .mat-input-ripple.mat-accent {\n      background-color: #2196f3; }\n    .mat-input-underline .mat-input-ripple.mat-warn {\n      background-color: #f44336; }\n\n.mat-input-invalid .mat-input-placeholder,\n.mat-input-invalid .mat-placeholder-required {\n  color: #f44336; }\n\n.mat-input-invalid .mat-input-underline {\n  border-color: #f44336; }\n\n.mat-input-invalid .mat-input-ripple {\n  background-color: #f44336; }\n\n.mat-input-error {\n  color: #f44336; }\n\n.mat-list .mat-list-item, .mat-nav-list .mat-list-item {\n  color: black; }\n\n.mat-list .mat-subheader, .mat-nav-list .mat-subheader {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mat-divider {\n  border-top-color: rgba(0, 0, 0, 0.12); }\n\n.mat-nav-list .mat-list-item-content:hover, .mat-nav-list .mat-list-item-content.mat-list-item-focus {\n  background: rgba(0, 0, 0, 0.04); }\n\n.mat-menu-content {\n  background: white; }\n\n.mat-menu-item {\n  background: transparent;\n  color: rgba(0, 0, 0, 0.87); }\n  .mat-menu-item[disabled] {\n    color: rgba(0, 0, 0, 0.38); }\n  .mat-menu-item .mat-icon {\n    color: rgba(0, 0, 0, 0.54);\n    vertical-align: middle; }\n  .mat-menu-item:hover:not([disabled]), .mat-menu-item:focus:not([disabled]) {\n    background: rgba(0, 0, 0, 0.04); }\n\n.mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23ffcdd2%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.mat-progress-bar-buffer {\n  background-color: #ffcdd2; }\n\n.mat-progress-bar-fill::after {\n  background-color: #e53935; }\n\n.mat-progress-bar.mat-accent .mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23bbdefb%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.mat-progress-bar.mat-accent .mat-progress-bar-buffer {\n  background-color: #bbdefb; }\n\n.mat-progress-bar.mat-accent .mat-progress-bar-fill::after {\n  background-color: #1e88e5; }\n\n.mat-progress-bar.mat-warn .mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23ffcdd2%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.mat-progress-bar.mat-warn .mat-progress-bar-buffer {\n  background-color: #ffcdd2; }\n\n.mat-progress-bar.mat-warn .mat-progress-bar-fill::after {\n  background-color: #e53935; }\n\n.mat-progress-spinner path, .mat-spinner path {\n  stroke: #e53935; }\n\n.mat-progress-spinner.mat-accent path, .mat-spinner.mat-accent path {\n  stroke: #1e88e5; }\n\n.mat-progress-spinner.mat-warn path, .mat-spinner.mat-warn path {\n  stroke: #e53935; }\n\n.mat-radio-outer-circle {\n  border-color: rgba(0, 0, 0, 0.54); }\n  .mat-radio-checked .mat-radio-outer-circle {\n    border-color: #2196f3; }\n  .mat-radio-disabled .mat-radio-outer-circle {\n    border-color: rgba(0, 0, 0, 0.38); }\n\n.mat-radio-inner-circle {\n  background-color: #2196f3; }\n  .mat-radio-disabled .mat-radio-inner-circle {\n    background-color: rgba(0, 0, 0, 0.38); }\n\n.mat-radio-ripple .mat-ripple-element {\n  background-color: rgba(33, 150, 243, 0.26); }\n  .mat-radio-disabled .mat-radio-ripple .mat-ripple-element {\n    background-color: rgba(0, 0, 0, 0.38); }\n\n.mat-select-trigger {\n  color: rgba(0, 0, 0, 0.38); }\n  .mat-select:focus:not(.mat-select-disabled) .mat-select-trigger {\n    color: #f44336; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-trigger {\n    color: #f44336; }\n\n.mat-select-underline {\n  background-color: rgba(0, 0, 0, 0.12); }\n  .mat-select:focus:not(.mat-select-disabled) .mat-select-underline {\n    background-color: #f44336; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-underline {\n    background-color: #f44336; }\n\n.mat-select-arrow {\n  color: rgba(0, 0, 0, 0.38); }\n  .mat-select:focus:not(.mat-select-disabled) .mat-select-arrow {\n    color: #f44336; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-arrow {\n    color: #f44336; }\n\n.mat-select-content, .mat-select-panel-done-animating {\n  background: white; }\n\n.mat-select-value {\n  color: rgba(0, 0, 0, 0.87); }\n  .mat-select-disabled .mat-select-value {\n    color: rgba(0, 0, 0, 0.38); }\n\n.mat-sidenav-container {\n  background-color: #fafafa;\n  color: rgba(0, 0, 0, 0.87); }\n\n.mat-sidenav {\n  background-color: white;\n  color: rgba(0, 0, 0, 0.87); }\n  .mat-sidenav.mat-sidenav-push {\n    background-color: white; }\n\n.mat-sidenav-backdrop.mat-sidenav-shown {\n  background-color: rgba(0, 0, 0, 0.6); }\n\n.mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #2196f3; }\n\n.mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(33, 150, 243, 0.5); }\n\n.mat-slide-toggle:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(0, 0, 0, 0.06); }\n\n.mat-slide-toggle .mat-ripple-element {\n  background-color: rgba(33, 150, 243, 0.12); }\n\n.mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #f44336; }\n\n.mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(244, 67, 54, 0.5); }\n\n.mat-slide-toggle.mat-primary:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(0, 0, 0, 0.06); }\n\n.mat-slide-toggle.mat-primary .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.12); }\n\n.mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #f44336; }\n\n.mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(244, 67, 54, 0.5); }\n\n.mat-slide-toggle.mat-warn:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(0, 0, 0, 0.06); }\n\n.mat-slide-toggle.mat-warn .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.12); }\n\n.mat-disabled .mat-slide-toggle-thumb {\n  background-color: #bdbdbd; }\n\n.mat-disabled .mat-slide-toggle-bar {\n  background-color: rgba(0, 0, 0, 0.1); }\n\n.mat-slide-toggle-thumb {\n  background-color: #fafafa; }\n\n.mat-slide-toggle-bar {\n  background-color: rgba(0, 0, 0, 0.38); }\n\n.mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.mat-primary .mat-slider-track-fill, .mat-primary\n.mat-slider-thumb, .mat-primary\n.mat-slider-thumb-label {\n  background-color: #f44336; }\n\n.mat-accent .mat-slider-track-fill, .mat-accent\n.mat-slider-thumb, .mat-accent\n.mat-slider-thumb-label {\n  background-color: #2196f3; }\n\n.mat-warn .mat-slider-track-fill, .mat-warn\n.mat-slider-thumb, .mat-warn\n.mat-slider-thumb-label {\n  background-color: #f44336; }\n\n.mat-slider-focus-ring {\n  background-color: rgba(33, 150, 243, 0.2); }\n\n.mat-primary .mat-slider-thumb-label-text {\n  color: white; }\n\n.mat-accent .mat-slider-thumb-label-text {\n  color: white; }\n\n.mat-warn .mat-slider-thumb-label-text {\n  color: white; }\n\n.mat-slider:hover .mat-slider-track-background,\n.cdk-focused .mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.38); }\n\n.mat-slider-disabled .mat-slider-track-background,\n.mat-slider-disabled .mat-slider-track-fill,\n.mat-slider-disabled .mat-slider-thumb {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.mat-slider-disabled:hover .mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.mat-slider-min-value .mat-slider-focus-ring {\n  background-color: rgba(0, 0, 0, 0.12); }\n\n.mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb,\n.mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb-label {\n  background-color: black; }\n\n.mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb,\n.mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb-label {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.mat-slider-min-value:not(.mat-slider-thumb-label-showing) .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.26);\n  background-color: transparent; }\n\n.mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover .mat-slider-thumb, .mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.38); }\n\n.mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover.mat-slider-disabled .mat-slider-thumb, .mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused.mat-slider-disabled .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.26); }\n\n.mat-tab-nav-bar,\n.mat-tab-header {\n  border-bottom: 1px solid #e0e0e0; }\n  .mat-tab-group-inverted-header .mat-tab-nav-bar, .mat-tab-group-inverted-header\n  .mat-tab-header {\n    border-top: 1px solid #e0e0e0;\n    border-bottom: none; }\n\n.mat-tab-label:focus {\n  background-color: rgba(255, 205, 210, 0.3); }\n\n.mat-ink-bar {\n  background-color: #f44336; }\n\n.mat-tab-label, .mat-tab-link {\n  color: currentColor; }\n  .mat-tab-label.mat-tab-disabled, .mat-tab-link.mat-tab-disabled {\n    color: rgba(0, 0, 0, 0.38); }\n\n.mat-toolbar {\n  background: whitesmoke;\n  color: rgba(0, 0, 0, 0.87); }\n  .mat-toolbar.mat-primary {\n    background: #f44336;\n    color: white; }\n  .mat-toolbar.mat-accent {\n    background: #2196f3;\n    color: white; }\n  .mat-toolbar.mat-warn {\n    background: #f44336;\n    color: white; }\n\n.mat-tooltip {\n  background: rgba(97, 97, 97, 0.9); }\n\n.dark-theme .mat-ripple-element {\n  background-color: rgba(255, 255, 255, 0.1); }\n\n.dark-theme .mat-option:hover:not(.mat-option-disabled), .dark-theme .mat-option:focus:not(.mat-option-disabled) {\n  background: rgba(255, 255, 255, 0.04); }\n\n.dark-theme .mat-option.mat-selected {\n  color: #03a9f4; }\n  .dark-theme .mat-option.mat-selected:not(.mat-option-multiple) {\n    background: rgba(255, 255, 255, 0.04); }\n\n.dark-theme .mat-option.mat-active {\n  background: rgba(255, 255, 255, 0.04);\n  color: white; }\n\n.dark-theme .mat-option.mat-option-disabled {\n  color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-pseudo-checkbox {\n  color: rgba(255, 255, 255, 0.7); }\n  .dark-theme .mat-pseudo-checkbox::after {\n    color: #303030; }\n\n.dark-theme .mat-pseudo-checkbox-checked.mat-primary, .dark-theme .mat-pseudo-checkbox-indeterminate.mat-primary {\n  background: #03a9f4; }\n\n.dark-theme .mat-pseudo-checkbox-checked.mat-accent, .dark-theme .mat-pseudo-checkbox-indeterminate.mat-accent {\n  background: #4caf50; }\n\n.dark-theme .mat-pseudo-checkbox-checked.mat-warn, .dark-theme .mat-pseudo-checkbox-indeterminate.mat-warn {\n  background: #f44336; }\n\n.dark-theme .mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .dark-theme .mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {\n  background: #686868; }\n\n.dark-theme .mat-app-background {\n  background-color: #303030; }\n\n.dark-theme .mat-theme-loaded-marker {\n  display: none; }\n\n.dark-theme .mat-autocomplete-panel {\n  background: #424242;\n  color: white; }\n  .dark-theme .mat-autocomplete-panel .mat-option.mat-selected:not(.mat-active) {\n    background: #424242;\n    color: white; }\n\n.dark-theme .mat-button.mat-primary .mat-button-focus-overlay, .dark-theme .mat-icon-button.mat-primary .mat-button-focus-overlay, .dark-theme .mat-raised-button.mat-primary .mat-button-focus-overlay, .dark-theme .mat-fab.mat-primary .mat-button-focus-overlay, .dark-theme .mat-mini-fab.mat-primary .mat-button-focus-overlay {\n  background-color: rgba(3, 169, 244, 0.12); }\n\n.dark-theme .mat-button.mat-accent .mat-button-focus-overlay, .dark-theme .mat-icon-button.mat-accent .mat-button-focus-overlay, .dark-theme .mat-raised-button.mat-accent .mat-button-focus-overlay, .dark-theme .mat-fab.mat-accent .mat-button-focus-overlay, .dark-theme .mat-mini-fab.mat-accent .mat-button-focus-overlay {\n  background-color: rgba(76, 175, 80, 0.12); }\n\n.dark-theme .mat-button.mat-warn .mat-button-focus-overlay, .dark-theme .mat-icon-button.mat-warn .mat-button-focus-overlay, .dark-theme .mat-raised-button.mat-warn .mat-button-focus-overlay, .dark-theme .mat-fab.mat-warn .mat-button-focus-overlay, .dark-theme .mat-mini-fab.mat-warn .mat-button-focus-overlay {\n  background-color: rgba(244, 67, 54, 0.12); }\n\n.dark-theme .mat-button[disabled] .mat-button-focus-overlay, .dark-theme .mat-icon-button[disabled] .mat-button-focus-overlay, .dark-theme .mat-raised-button[disabled] .mat-button-focus-overlay, .dark-theme .mat-fab[disabled] .mat-button-focus-overlay, .dark-theme .mat-mini-fab[disabled] .mat-button-focus-overlay {\n  background-color: transparent; }\n\n.dark-theme .mat-button, .dark-theme .mat-icon-button {\n  background: transparent; }\n  .dark-theme .mat-button.mat-primary, .dark-theme .mat-icon-button.mat-primary {\n    color: #03a9f4; }\n  .dark-theme .mat-button.mat-accent, .dark-theme .mat-icon-button.mat-accent {\n    color: #4caf50; }\n  .dark-theme .mat-button.mat-warn, .dark-theme .mat-icon-button.mat-warn {\n    color: #f44336; }\n  .dark-theme .mat-button.mat-primary[disabled], .dark-theme .mat-button.mat-accent[disabled], .dark-theme .mat-button.mat-warn[disabled], .dark-theme .mat-button[disabled][disabled], .dark-theme .mat-icon-button.mat-primary[disabled], .dark-theme .mat-icon-button.mat-accent[disabled], .dark-theme .mat-icon-button.mat-warn[disabled], .dark-theme .mat-icon-button[disabled][disabled] {\n    color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-icon-button.mat-primary .mat-ripple-element {\n  background-color: rgba(3, 169, 244, 0.26); }\n\n.dark-theme .mat-icon-button.mat-accent .mat-ripple-element {\n  background-color: rgba(76, 175, 80, 0.26); }\n\n.dark-theme .mat-icon-button.mat-warn .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.dark-theme .mat-raised-button, .dark-theme .mat-fab, .dark-theme .mat-mini-fab {\n  color: white;\n  background-color: #424242; }\n  .dark-theme .mat-raised-button.mat-primary, .dark-theme .mat-fab.mat-primary, .dark-theme .mat-mini-fab.mat-primary {\n    color: white; }\n  .dark-theme .mat-raised-button.mat-accent, .dark-theme .mat-fab.mat-accent, .dark-theme .mat-mini-fab.mat-accent {\n    color: white; }\n  .dark-theme .mat-raised-button.mat-warn, .dark-theme .mat-fab.mat-warn, .dark-theme .mat-mini-fab.mat-warn {\n    color: white; }\n  .dark-theme .mat-raised-button.mat-primary[disabled], .dark-theme .mat-raised-button.mat-accent[disabled], .dark-theme .mat-raised-button.mat-warn[disabled], .dark-theme .mat-raised-button[disabled][disabled], .dark-theme .mat-fab.mat-primary[disabled], .dark-theme .mat-fab.mat-accent[disabled], .dark-theme .mat-fab.mat-warn[disabled], .dark-theme .mat-fab[disabled][disabled], .dark-theme .mat-mini-fab.mat-primary[disabled], .dark-theme .mat-mini-fab.mat-accent[disabled], .dark-theme .mat-mini-fab.mat-warn[disabled], .dark-theme .mat-mini-fab[disabled][disabled] {\n    color: rgba(255, 255, 255, 0.3); }\n  .dark-theme .mat-raised-button.mat-primary, .dark-theme .mat-fab.mat-primary, .dark-theme .mat-mini-fab.mat-primary {\n    background-color: #03a9f4; }\n  .dark-theme .mat-raised-button.mat-accent, .dark-theme .mat-fab.mat-accent, .dark-theme .mat-mini-fab.mat-accent {\n    background-color: #4caf50; }\n  .dark-theme .mat-raised-button.mat-warn, .dark-theme .mat-fab.mat-warn, .dark-theme .mat-mini-fab.mat-warn {\n    background-color: #f44336; }\n  .dark-theme .mat-raised-button.mat-primary[disabled], .dark-theme .mat-raised-button.mat-accent[disabled], .dark-theme .mat-raised-button.mat-warn[disabled], .dark-theme .mat-raised-button[disabled][disabled], .dark-theme .mat-fab.mat-primary[disabled], .dark-theme .mat-fab.mat-accent[disabled], .dark-theme .mat-fab.mat-warn[disabled], .dark-theme .mat-fab[disabled][disabled], .dark-theme .mat-mini-fab.mat-primary[disabled], .dark-theme .mat-mini-fab.mat-accent[disabled], .dark-theme .mat-mini-fab.mat-warn[disabled], .dark-theme .mat-mini-fab[disabled][disabled] {\n    background-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-fab, .dark-theme .mat-mini-fab {\n  background-color: #4caf50;\n  color: white; }\n\n.dark-theme .mat-button-toggle {\n  color: rgba(255, 255, 255, 0.3); }\n  .dark-theme .mat-button-toggle.cdk-focused .mat-button-toggle-focus-overlay {\n    background-color: rgba(255, 255, 255, 0.06); }\n\n.dark-theme .mat-button-toggle-checked {\n  background-color: #212121;\n  color: white; }\n\n.dark-theme .mat-button-toggle-disabled {\n  background-color: black;\n  color: rgba(255, 255, 255, 0.3); }\n  .dark-theme .mat-button-toggle-disabled.mat-button-toggle-checked {\n    background-color: #424242; }\n\n.dark-theme .mat-card {\n  background: #424242;\n  color: white; }\n\n.dark-theme .mat-card-subtitle {\n  color: rgba(255, 255, 255, 0.7); }\n\n.dark-theme .mat-checkbox-frame {\n  border-color: rgba(255, 255, 255, 0.7); }\n\n.dark-theme .mat-checkbox-checkmark {\n  fill: #303030; }\n\n.dark-theme .mat-checkbox-checkmark-path {\n  stroke: #303030 !important; }\n\n.dark-theme .mat-checkbox-mixedmark {\n  background-color: #303030; }\n\n.dark-theme .mat-checkbox-indeterminate.mat-primary .mat-checkbox-background, .dark-theme .mat-checkbox-checked.mat-primary .mat-checkbox-background {\n  background-color: #03a9f4; }\n\n.dark-theme .mat-checkbox-indeterminate.mat-accent .mat-checkbox-background, .dark-theme .mat-checkbox-checked.mat-accent .mat-checkbox-background {\n  background-color: #4caf50; }\n\n.dark-theme .mat-checkbox-indeterminate.mat-warn .mat-checkbox-background, .dark-theme .mat-checkbox-checked.mat-warn .mat-checkbox-background {\n  background-color: #f44336; }\n\n.dark-theme .mat-checkbox-disabled.mat-checkbox-checked .mat-checkbox-background, .dark-theme .mat-checkbox-disabled.mat-checkbox-indeterminate .mat-checkbox-background {\n  background-color: #686868; }\n\n.dark-theme .mat-checkbox-disabled:not(.mat-checkbox-checked) .mat-checkbox-frame {\n  border-color: #686868; }\n\n.dark-theme .mat-checkbox:not(.mat-checkbox-disabled).mat-primary .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(3, 169, 244, 0.26); }\n\n.dark-theme .mat-checkbox:not(.mat-checkbox-disabled).mat-accent .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(76, 175, 80, 0.26); }\n\n.dark-theme .mat-checkbox:not(.mat-checkbox-disabled).mat-warn .mat-checkbox-ripple .mat-ripple-element {\n  background-color: rgba(244, 67, 54, 0.26); }\n\n.dark-theme .mat-chip:not(.mat-basic-chip) {\n  background-color: #424242;\n  color: white; }\n\n.dark-theme .mat-chip.mat-chip-selected:not(.mat-basic-chip) {\n  background-color: #212121;\n  color: white; }\n  .dark-theme .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-primary {\n    background-color: #03a9f4;\n    color: white; }\n  .dark-theme .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-accent {\n    background-color: #4caf50;\n    color: white; }\n  .dark-theme .mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-warn {\n    background-color: #f44336;\n    color: white; }\n\n.dark-theme .mat-dialog-container {\n  background: #424242; }\n\n.dark-theme .mat-icon.mat-primary {\n  color: #03a9f4; }\n\n.dark-theme .mat-icon.mat-accent {\n  color: #4caf50; }\n\n.dark-theme .mat-icon.mat-warn {\n  color: #f44336; }\n\n.dark-theme .mat-input-placeholder {\n  color: rgba(255, 255, 255, 0.3); }\n  .mat-focused .dark-theme .mat-input-placeholder {\n    color: #03a9f4; }\n    .mat-focused .dark-theme .mat-input-placeholder.mat-accent {\n      color: #4caf50; }\n    .mat-focused .dark-theme .mat-input-placeholder.mat-warn {\n      color: #f44336; }\n\n.dark-theme .mat-input-element:disabled {\n  color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme input.mat-input-element:-webkit-autofill + .mat-input-placeholder .mat-placeholder-required,\n.dark-theme .mat-focused .mat-input-placeholder.mat-float .mat-placeholder-required {\n  color: #4caf50; }\n\n.dark-theme .mat-input-underline {\n  border-color: rgba(255, 255, 255, 0.12); }\n  .dark-theme .mat-input-underline .mat-input-ripple {\n    background-color: #03a9f4; }\n    .dark-theme .mat-input-underline .mat-input-ripple.mat-accent {\n      background-color: #4caf50; }\n    .dark-theme .mat-input-underline .mat-input-ripple.mat-warn {\n      background-color: #f44336; }\n\n.dark-theme .mat-input-invalid .mat-input-placeholder,\n.dark-theme .mat-input-invalid .mat-placeholder-required {\n  color: #f44336; }\n\n.dark-theme .mat-input-invalid .mat-input-underline {\n  border-color: #f44336; }\n\n.dark-theme .mat-input-invalid .mat-input-ripple {\n  background-color: #f44336; }\n\n.dark-theme .mat-input-error {\n  color: #f44336; }\n\n.dark-theme .mat-list .mat-list-item, .dark-theme .mat-nav-list .mat-list-item {\n  color: white; }\n\n.dark-theme .mat-list .mat-subheader, .dark-theme .mat-nav-list .mat-subheader {\n  color: rgba(255, 255, 255, 0.7); }\n\n.dark-theme .mat-divider {\n  border-top-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-nav-list .mat-list-item-content:hover, .dark-theme .mat-nav-list .mat-list-item-content.mat-list-item-focus {\n  background: rgba(255, 255, 255, 0.04); }\n\n.dark-theme .mat-menu-content {\n  background: #424242; }\n\n.dark-theme .mat-menu-item {\n  background: transparent;\n  color: white; }\n  .dark-theme .mat-menu-item[disabled] {\n    color: rgba(255, 255, 255, 0.3); }\n  .dark-theme .mat-menu-item .mat-icon {\n    color: white;\n    vertical-align: middle; }\n  .dark-theme .mat-menu-item:hover:not([disabled]), .dark-theme .mat-menu-item:focus:not([disabled]) {\n    background: rgba(255, 255, 255, 0.04); }\n\n.dark-theme .mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23b3e5fc%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.dark-theme .mat-progress-bar-buffer {\n  background-color: #b3e5fc; }\n\n.dark-theme .mat-progress-bar-fill::after {\n  background-color: #039be5; }\n\n.dark-theme .mat-progress-bar.mat-accent .mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23c8e6c9%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.dark-theme .mat-progress-bar.mat-accent .mat-progress-bar-buffer {\n  background-color: #c8e6c9; }\n\n.dark-theme .mat-progress-bar.mat-accent .mat-progress-bar-fill::after {\n  background-color: #43a047; }\n\n.dark-theme .mat-progress-bar.mat-warn .mat-progress-bar-background {\n  background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23ffcdd2%27%2F%3E%3C%2Fsvg%3E\"); }\n\n.dark-theme .mat-progress-bar.mat-warn .mat-progress-bar-buffer {\n  background-color: #ffcdd2; }\n\n.dark-theme .mat-progress-bar.mat-warn .mat-progress-bar-fill::after {\n  background-color: #e53935; }\n\n.dark-theme .mat-progress-spinner path, .dark-theme .mat-spinner path {\n  stroke: #039be5; }\n\n.dark-theme .mat-progress-spinner.mat-accent path, .dark-theme .mat-spinner.mat-accent path {\n  stroke: #43a047; }\n\n.dark-theme .mat-progress-spinner.mat-warn path, .dark-theme .mat-spinner.mat-warn path {\n  stroke: #e53935; }\n\n.dark-theme .mat-radio-outer-circle {\n  border-color: rgba(255, 255, 255, 0.7); }\n  .mat-radio-checked .dark-theme .mat-radio-outer-circle {\n    border-color: #4caf50; }\n  .mat-radio-disabled .dark-theme .mat-radio-outer-circle {\n    border-color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-radio-inner-circle {\n  background-color: #4caf50; }\n  .mat-radio-disabled .dark-theme .mat-radio-inner-circle {\n    background-color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-radio-ripple .mat-ripple-element {\n  background-color: rgba(76, 175, 80, 0.26); }\n  .mat-radio-disabled .dark-theme .mat-radio-ripple .mat-ripple-element {\n    background-color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-select-trigger {\n  color: rgba(255, 255, 255, 0.3); }\n  .mat-select:focus:not(.mat-select-disabled) .dark-theme .mat-select-trigger {\n    color: #03a9f4; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .dark-theme .mat-select-trigger {\n    color: #f44336; }\n\n.dark-theme .mat-select-underline {\n  background-color: rgba(255, 255, 255, 0.12); }\n  .mat-select:focus:not(.mat-select-disabled) .dark-theme .mat-select-underline {\n    background-color: #03a9f4; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .dark-theme .mat-select-underline {\n    background-color: #f44336; }\n\n.dark-theme .mat-select-arrow {\n  color: rgba(255, 255, 255, 0.3); }\n  .mat-select:focus:not(.mat-select-disabled) .dark-theme .mat-select-arrow {\n    color: #03a9f4; }\n  .mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .dark-theme .mat-select-arrow {\n    color: #f44336; }\n\n.dark-theme .mat-select-content, .dark-theme .mat-select-panel-done-animating {\n  background: #424242; }\n\n.dark-theme .mat-select-value {\n  color: white; }\n  .mat-select-disabled .dark-theme .mat-select-value {\n    color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-sidenav-container {\n  background-color: #303030;\n  color: white; }\n\n.dark-theme .mat-sidenav {\n  background-color: #424242;\n  color: white; }\n  .dark-theme .mat-sidenav.mat-sidenav-push {\n    background-color: #424242; }\n\n.dark-theme .mat-sidenav-backdrop.mat-sidenav-shown {\n  background-color: rgba(189, 189, 189, 0.6); }\n\n.dark-theme .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #a5d6a7; }\n\n.dark-theme .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(165, 214, 167, 0.5); }\n\n.dark-theme .mat-slide-toggle:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-slide-toggle .mat-ripple-element {\n  background-color: rgba(165, 214, 167, 0.12); }\n\n.dark-theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #81d4fa; }\n\n.dark-theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(129, 212, 250, 0.5); }\n\n.dark-theme .mat-slide-toggle.mat-primary:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-slide-toggle.mat-primary .mat-ripple-element {\n  background-color: rgba(129, 212, 250, 0.12); }\n\n.dark-theme .mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {\n  background-color: #ef9a9a; }\n\n.dark-theme .mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {\n  background-color: rgba(239, 154, 154, 0.5); }\n\n.dark-theme .mat-slide-toggle.mat-warn:not(.mat-checked) .mat-ripple-element {\n  background-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-slide-toggle.mat-warn .mat-ripple-element {\n  background-color: rgba(239, 154, 154, 0.12); }\n\n.dark-theme .mat-disabled .mat-slide-toggle-thumb {\n  background-color: #424242; }\n\n.dark-theme .mat-disabled .mat-slide-toggle-bar {\n  background-color: rgba(255, 255, 255, 0.12); }\n\n.dark-theme .mat-slide-toggle-thumb {\n  background-color: #bdbdbd; }\n\n.dark-theme .mat-slide-toggle-bar {\n  background-color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.mat-primary .dark-theme .mat-slider-track-fill, .mat-primary\n.dark-theme .mat-slider-thumb, .mat-primary\n.dark-theme .mat-slider-thumb-label {\n  background-color: #03a9f4; }\n\n.mat-accent .dark-theme .mat-slider-track-fill, .mat-accent\n.dark-theme .mat-slider-thumb, .mat-accent\n.dark-theme .mat-slider-thumb-label {\n  background-color: #4caf50; }\n\n.mat-warn .dark-theme .mat-slider-track-fill, .mat-warn\n.dark-theme .mat-slider-thumb, .mat-warn\n.dark-theme .mat-slider-thumb-label {\n  background-color: #f44336; }\n\n.dark-theme .mat-slider-focus-ring {\n  background-color: rgba(76, 175, 80, 0.2); }\n\n.mat-primary .dark-theme .mat-slider-thumb-label-text {\n  color: white; }\n\n.mat-accent .dark-theme .mat-slider-thumb-label-text {\n  color: white; }\n\n.mat-warn .dark-theme .mat-slider-thumb-label-text {\n  color: white; }\n\n.dark-theme .mat-slider:hover .mat-slider-track-background,\n.dark-theme .cdk-focused .mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.38); }\n\n.dark-theme .mat-slider-disabled .mat-slider-track-background,\n.dark-theme .mat-slider-disabled .mat-slider-track-fill,\n.dark-theme .mat-slider-disabled .mat-slider-thumb {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.dark-theme .mat-slider-disabled:hover .mat-slider-track-background {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.dark-theme .mat-slider-min-value .mat-slider-focus-ring {\n  background-color: rgba(0, 0, 0, 0.12); }\n\n.dark-theme .mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb,\n.dark-theme .mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb-label {\n  background-color: black; }\n\n.dark-theme .mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb,\n.dark-theme .mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb-label {\n  background-color: rgba(0, 0, 0, 0.26); }\n\n.dark-theme .mat-slider-min-value:not(.mat-slider-thumb-label-showing) .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.26);\n  background-color: transparent; }\n\n.dark-theme .mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover .mat-slider-thumb, .dark-theme .mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.38); }\n\n.dark-theme .mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover.mat-slider-disabled .mat-slider-thumb, .dark-theme .mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused.mat-slider-disabled .mat-slider-thumb {\n  border-color: rgba(0, 0, 0, 0.26); }\n\n.dark-theme .mat-tab-nav-bar,\n.dark-theme .mat-tab-header {\n  border-bottom: 1px solid black; }\n  .mat-tab-group-inverted-header .dark-theme .mat-tab-nav-bar, .mat-tab-group-inverted-header\n  .dark-theme .mat-tab-header {\n    border-top: 1px solid black;\n    border-bottom: none; }\n\n.dark-theme .mat-tab-label:focus {\n  background-color: rgba(179, 229, 252, 0.3); }\n\n.dark-theme .mat-ink-bar {\n  background-color: #03a9f4; }\n\n.dark-theme .mat-tab-label, .dark-theme .mat-tab-link {\n  color: currentColor; }\n  .dark-theme .mat-tab-label.mat-tab-disabled, .dark-theme .mat-tab-link.mat-tab-disabled {\n    color: rgba(255, 255, 255, 0.3); }\n\n.dark-theme .mat-toolbar {\n  background: #212121;\n  color: white; }\n  .dark-theme .mat-toolbar.mat-primary {\n    background: #03a9f4;\n    color: white; }\n  .dark-theme .mat-toolbar.mat-accent {\n    background: #4caf50;\n    color: white; }\n  .dark-theme .mat-toolbar.mat-warn {\n    background: #f44336;\n    color: white; }\n\n.dark-theme .mat-tooltip {\n  background: rgba(97, 97, 97, 0.9); }\n", ""]);

// exports


/***/ }),

/***/ 315:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Material+Icons);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Roboto:400,300);", ""]);

// module
exports.push([module.i, "html, body {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n\r\n  font-family: Roboto, Arial, sans-serif;\r\n  margin: 0;\r\n  height: 100%;\r\n}\r\n", ""]);

// exports


/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(215);
__webpack_require__(214);
module.exports = __webpack_require__(213);


/***/ })

},[583]);
//# sourceMappingURL=styles.bundle.js.map