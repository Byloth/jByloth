"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 *                     jByloth v. 1.0.0
 *
 *                Written by Bilotta Matteo.
 *
 *  Copyright © 2015 - 2017, Bylothink. All rights reserved.
 */

// Checking if jQuery is available...
if (typeof jQuery === "undefined") {
    throw new Error("jQuery is required by jByloth to be executed.");
}

// TODO: Controllo la versione attuale di jQuery?

// jQuery Plugin definition:
(function (window, jQuery) {
    "use strict";

    // Private single instance constants:

    var EVENT_TIMEOUT = 500;
    var VERSION = "1.0.0";

    // Private single instance properties:
    var _resizingTimeout = void 0;
    var _scrollingTimeout = void 0;

    // Private single instance methods:
    var _isUndefined = function _isUndefined(obj) {
        return obj === undefined || typeof obj === "undefined";
    };
    var _isNull = function _isNull(obj) {
        return _isUndefined(obj) === true || obj === null;
    };
    var _isEmpty = function _isEmpty(obj) {
        if (_isNull(obj) === true || obj === false || obj === 0 || obj === "") {
            return true;
        } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
            return jQuery.isEmptyObject(obj);
        } else {
            return false;
        }
    };

    var _isDomElement = function _isDomElement(obj) {
        if (_isNull(obj) === false) {
            if ((typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object") {
                return obj instanceof HTMLElement;
            } else {
                return obj.nodeType === 1 && typeof obj.nodeName === "string";
            }
        } else {
            return false;
        }
    };

    var _loadCss = function _loadCss(uri, mediaQuery) {
        // TODO: Terminare l'implementazione di questo metodo.
        //
        var _link = jQuery("<link />");

        _link.attr("rel", "stylesheet");
        _link.attr("type", "text/css");
        _link.attr("href", uri);

        if (_isUndefined(mediaQuery) === false) {
            _link.attr("media", mediaQuery);
        }

        _link.on("load", function () {
            // TODO: Generare un evento di endLoading...
            //
            // console.debug("CSS '" + uri + "' was successfully loaded!");
        });

        jQuery("head").append(_link);
    };

    var _onResizing = function _onResizing() {
        if (_isNull(_resizingTimeout) === false) {
            clearTimeout(_resizingTimeout);
        }

        _resizingTimeout = setTimeout(function () {
            jQuery(window).trigger("resized");
        }, EVENT_TIMEOUT);
    };
    var _onScrolling = function _onScrolling() {
        if (_isNull(_scrollingTimeout) === false) {
            clearTimeout(_scrollingTimeout);
        }

        _scrollingTimeout = setTimeout(function () {
            jQuery(window).trigger("scrolled");
        }, EVENT_TIMEOUT);
    };

    var _parseInt = function _parseInt(value) {
        if (typeof value === "number") {
            return parseInt(value);
        } else if (typeof value === "string") {
            if (value.startsWith("0") === true) {
                value = value.substr(1);
            }

            var _hexValue = parseInt(value, 16);

            if (_hexValue.toString(16) === value.toLowerCase()) {
                return _hexValue;
            }
        }
    };
    var _parseFloat = function _parseFloat(value) {
        if (typeof value === "number") {
            return parseFloat(value);
        }
    };

    // Classes definitions:
    (function () {
        // Private single instance constants:
        var MIN_VALUE = 0;

        var MAX_ALPHA_VALUE = 1;
        var MAX_COLOR_VALUE = 255;

        // Private single instance methods:
        var _isAlphaValid = function _isAlphaValid(value) {
            var _parsedValue = _parseFloat(value);

            if (_isUndefined(_parsedValue) === false) {
                return _parsedValue >= MIN_VALUE && _parsedValue <= MAX_ALPHA_VALUE;
            } else {
                return false;
            }
        };
        var _isColorValid = function _isColorValid(value) {
            var _parsedValue = _parseInt(value);

            if (_isUndefined(_parsedValue) === false) {
                return _parsedValue >= MIN_VALUE && _parsedValue <= MAX_COLOR_VALUE;
            } else {
                return false;
            }
        };

        // Class definition:
        var Color = function Color(r, g, b, a) {
            // Private properties:
            var _this = this;

            var _r = void 0;
            var _g = void 0;
            var _b = void 0;
            var _a = void 0;

            // Private methods:
            var _init = function _init(props) {
                if (_isUndefined(props.r) === true) {
                    _r = 0;
                    _g = 0;
                    _b = 0;
                    _a = 1;
                } else if (_isColorValid(props.r) === true && _isColorValid(props.g) === true && _isColorValid(props.b) === true) {
                    _r = _parseInt(props.r);
                    _g = _parseInt(props.g);
                    _b = _parseInt(props.b);

                    if (_isAlphaValid(props.a) === true) {
                        _a = _parseFloat(props.a);
                    } else {
                        _a = 1;
                    }
                } else if (typeof props.r === "string") {
                    if (props.r.length === 6) {
                        var _matches = props.r.match(/.{1,2}/g);

                        _init({

                            r: _matches[0],
                            g: _matches[1],
                            b: _matches[2],
                            a: props.g
                        });
                    } else if (props.r.length === 3) {
                        var _matches2 = props.r.match(/.{1,1}/g);

                        _init({

                            r: _matches2[0] + _matches2[0],
                            g: _matches2[1] + _matches2[1],
                            b: _matches2[2] + _matches2[2],
                            a: props.g
                        });
                    } else {
                        throw new Error("Something went wrong!");
                    }
                } else {
                    throw new Error("Something went wrong!");
                }
            };

            // Public methods:
            _this.toString = function (forceRgbFormat, hideExtra) {
                if (_a != 1 || forceRgbFormat === true) {
                    if (hideExtra === true) {
                        if (_a != 1) {
                            return _r + ", " + _g + ", " + _b + ", " + _a;
                        } else {
                            return _r + ", " + _g + ", " + _b;
                        }
                    } else {
                        if (_a != 1) {
                            return "rgba(" + _r + ", " + _g + ", " + _b + ", " + _a + ")";
                        } else {
                            return "rgb(" + _r + ", " + _g + ", " + _b + ")";
                        }
                    }
                } else {
                    var _rString = _r.toString(16);
                    var _gString = _g.toString(16);
                    var _bString = _b.toString(16);

                    if (_rString.length === 1) {
                        _rString = "0" + _rString;
                    }
                    if (_gString.length === 1) {
                        _gString = "0" + _gString;
                    }
                    if (_bString.length === 1) {
                        _bString = "0" + _bString;
                    }

                    return "#" + _rString + _gString + _bString;
                }
            };

            // Object initialization...
            var _props = void 0;

            if ((typeof r === "undefined" ? "undefined" : _typeof(r)) === "object") {
                if (jQuery.isArray(r) === true) {
                    if (r.length === 3) {
                        _props = {

                            r: r[0],
                            g: r[1],
                            b: r[2],
                            a: g
                        };
                    } else {
                        throw new Error("Something went wrong!");
                    }
                } else {
                    _props = {

                        r: r.r,
                        g: r.g,
                        b: r.b,
                        a: _isUndefined(r.a) === false ? r.a : g
                    };
                }
            } else {
                _props = {

                    r: r,
                    g: g,
                    b: b,
                    a: a
                };
            }

            _init(_props);
        };

        // Exposing class...
        window.Color = Color;
    })();

    // TODO: SISTEMARE QUESTA ROBA!!! FA CAGARE!!!
    //
    // Methods definitions:
    // Private single instance constants:
    var ALLOWED_CHARS = [[48, 57], [65, 90], [97, 122]];
    var MAX_CHARS = 64;

    // String class:
    // Public static methods:
    String.random = function (length) {
        var _randomString = "";

        if (_isUndefined(length) === true) {
            length = MAX_CHARS;
        }

        for (var index = 0; index < length; index += 1) {
            var _charSet = Math.floor(Math.random() * ALLOWED_CHARS.length);

            var _minCode = ALLOWED_CHARS[_charSet][0];
            var _maxCode = ALLOWED_CHARS[_charSet][1] + 1;

            var _charCode = Math.floor(Math.random() * (_maxCode - _minCode) + _minCode);

            _randomString += String.fromCharCode(_charCode);
        }

        return _randomString;
    };

    // Public methods:
    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    String.prototype.contains = function (searchString) {
        return this.indexOf(searchString) !== -1;
    };

    String.prototype.endsWith = function (searchString) {
        var _sliceLength = -searchString.length;

        return this.slice(_sliceLength) === searchString;
    };

    String.prototype.escapeRegExp = function () {
        return this.replace(/[-.*+?()[\]{}/\\|^$]/g, "\\$&");
    };

    // Start listening for events...
    if (_isUndefined(window) === false) {
        jQuery(window).on("resize", _onResizing);
        jQuery(window).on("scroll", _onScrolling);
    }

    // Exposing jByloth's definitions...
    // jQuery definitions:
    // Properties:
    jQuery.jByloth = VERSION;

    // Methods:
    jQuery.isUndefined = function (obj) {
        return _isUndefined(obj);
    };
    jQuery.isNull = function (obj) {
        return _isNull(obj);
    };
    jQuery.isEmpty = function (obj) {
        return _isEmpty(obj);
    };

    jQuery.isDomElement = function (obj) {
        return _isDomElement(obj);
    };

    jQuery.loadCss = function (uri, mediaQuery) {
        return _loadCss(uri, mediaQuery);
    };

    jQuery.parseInt = function (value) {
        return _parseInt(value);
    };
    jQuery.parseFloat = function (value) {
        return _parseFloat(value);
    };
})(window, jQuery);
//# sourceMappingURL=jbyloth.js.map
