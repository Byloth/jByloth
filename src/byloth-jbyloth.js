// Checking if jQuery is available...
    if (typeof(jQuery) === "undefined")
    {
        throw new Error("jQuery is required by jByloth to be executed.");
    }

    // TODO: Controllo la versione attuale di jQuery?

// jQuery Plugin definition:
    (function(window, jQuery)
    {
        "use strict";

        // Private single instance constants:
            const EVENT_TIMEOUT = 500;
            const VERSION = "1.0.1";

        // Private single instance properties:
            let _resizingTimeout;
            let _scrollingTimeout;

            let _$window = jQuery(window);

        // Private single instance methods:
            let _isUndefined = function(obj)
            {
                return ((obj === undefined) || (typeof(obj) === "undefined"));
            };
            let _isNull = function(obj)
            {
                return ((_isUndefined(obj) === true) || (obj === null));
            };
            let _isEmpty = function(obj)
            {
                if ((_isNull(obj) === true) || (obj === false) || (obj === 0) || (obj === ""))
                {
                    return true;
                }
                else if (typeof(obj) === "object")
                {
                    return jQuery.isEmptyObject(obj);
                }
                else
                {
                    return false;
                }
            };

            let _isDomElement = function(obj)
            {
                if (_isNull(obj) === false)
                {
                    if (typeof(HTMLElement) === "object")
                    {
                        return (obj instanceof HTMLElement);
                    }
                    else
                    {
                        return ((obj.nodeType === 1) && (typeof(obj.nodeName) === "string"));
                    }
                }
                else
                {
                    return false;
                }
            };

            let _onResizing = function()
            {
                if (_isNull(_resizingTimeout) === false)
                {
                    clearTimeout(_resizingTimeout);
                }

                _resizingTimeout = setTimeout(function()
                {
                    _$window.trigger("resized");

                }, EVENT_TIMEOUT);
            };
            let _onScrolling = function()
            {
                if (_isNull(_scrollingTimeout) === false)
                {
                    clearTimeout(_scrollingTimeout);
                }

                _scrollingTimeout = setTimeout(function()
                {
                    _$window.trigger("scrolled");

                }, EVENT_TIMEOUT);
            };

            let _parseInt = function(value)
            {
                if (typeof(value) === "number")
                {
                    return parseInt(value);
                }
                else if (typeof(value) === "string")
                {
                    if (value.startsWith("0") === true)
                    {
                        value = value.substr(1);
                    }

                    let hexValue = parseInt(value, 16);

                    if (hexValue.toString(16) === value.toLowerCase())
                    {
                        return hexValue;
                    }
                }
            };
            let _parseFloat = function(value)
            {
                if (typeof(value) === "number")
                {
                    return parseFloat(value);
                }
            };

        // Classes definitions:
            (function()
            {
                // Private single instance constants:
                    const MIN_VALUE = 0;

                    const MAX_ALPHA_VALUE = 1;
                    const MAX_COLOR_VALUE = 255;

                // Private single instance methods:
                    let _isAlphaValid = function(value)
                    {
                        let parsedValue = _parseFloat(value);

                        if (_isUndefined(parsedValue) === false)
                        {
                            return ((parsedValue >= MIN_VALUE) && (parsedValue <= MAX_ALPHA_VALUE));
                        }
                        else
                        {
                            return false;
                        }
                    };
                    let _isColorValid = function(value)
                    {
                        let parsedValue = _parseInt(value);

                        if (_isUndefined(parsedValue) === false)
                        {
                            return ((parsedValue >= MIN_VALUE) && (parsedValue <= MAX_COLOR_VALUE));
                        }
                        else
                        {
                            return false;
                        }
                    };

                // Class definition:
                    let Color = function(r, g, b, a)
                    {
                        // Private properties:
                            let _this = this;

                            let _r;
                            let _g;
                            let _b;
                            let _a;

                        // Private methods:
                            let _init = function(props)
                            {
                                if (_isUndefined(props.r) === true)
                                {
                                    _r = 0;
                                    _g = 0;
                                    _b = 0;
                                    _a = 1;
                                }
                                else if ((_isColorValid(props.r) === true) && (_isColorValid(props.g) === true) && (_isColorValid(props.b) === true))
                                {
                                    _r = _parseInt(props.r);
                                    _g = _parseInt(props.g);
                                    _b = _parseInt(props.b);

                                    if (_isAlphaValid(props.a) === true)
                                    {
                                        _a = _parseFloat(props.a);
                                    }
                                    else
                                    {
                                        _a = 1;
                                    }
                                }
                                else if (typeof(props.r) === "string")
                                {
                                    if (props.r.length === 6)
                                    {
                                        let matches = props.r.match(/.{1,2}/g);

                                        _init({

                                            r: matches[0],
                                            g: matches[1],
                                            b: matches[2],
                                            a: props.g
                                        });
                                    }
                                    else if (props.r.length === 3)
                                    {
                                        let matches = props.r.match(/.{1,1}/g);

                                        _init({

                                            r: matches[0] + matches[0],
                                            g: matches[1] + matches[1],
                                            b: matches[2] + matches[2],
                                            a: props.g
                                        });
                                    }
                                    else
                                    {
                                        throw new Error("Something went wrong!");
                                    }
                                }
                                else
                                {
                                    throw new Error("Something went wrong!");
                                }
                            };

                        // Public methods:
                            _this.toString = function(forceRgbFormat, hideExtra)
                            {
                                if ((_a !== 1) || (forceRgbFormat === true))
                                {
                                    if (hideExtra === true)
                                    {
                                        if (_a !== 1)
                                        {
                                            return _r + ", " + _g + ", " + _b + ", " + _a;
                                        }
                                        else
                                        {
                                            return _r + ", " + _g + ", " + _b;
                                        }
                                    }
                                    else
                                    {
                                        if (_a !== 1)
                                        {
                                            return "rgba(" + _r + ", " + _g + ", " + _b + ", " + _a + ")";
                                        }
                                        else
                                        {
                                            return "rgb(" + _r + ", " + _g + ", " + _b + ")";
                                        }
                                    }
                                }
                                else
                                {
                                    let r = _r.toString(16);
                                    let g = _g.toString(16);
                                    let b = _b.toString(16);

                                    if (r.length === 1)
                                    {
                                        r = "0"+ r;
                                    }
                                    if (g.length === 1)
                                    {
                                        g = "0"+ g;
                                    }
                                    if (b.length === 1)
                                    {
                                        b = "0"+ b;
                                    }

                                    return "#" + r + g + b;
                                }
                            };

                        // Object initialization...
                            let _props;

                            if (typeof(r) === "object")
                            {
                                if (jQuery.isArray(r) === true)
                                {
                                    if (r.length === 3)
                                    {
                                        _props = {

                                            r: r[0],
                                            g: r[1],
                                            b: r[2],
                                            a: g
                                        };
                                    }
                                    else
                                    {
                                        throw new Error("Something went wrong!");
                                    }
                                }
                                else
                                {
                                    _props = {

                                        r: r.r,
                                        g: r.g,
                                        b: r.b,
                                        a: (_isUndefined(r.a) === false)? r.a : g
                                    };
                                }
                            }
                            else
                            {
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
                    const ALLOWED_CHARS = [[48, 57], [65, 90], [97, 122]];
                    const MAX_CHARS = 64;

                // String class:
                    // Public static methods:
                        String.random = function(length)
                        {
                            let randomString = "";

                            if (_isUndefined(length) === true)
                            {
                                length = MAX_CHARS;
                            }

                            for (let index = 0; index < length; index += 1)
                            {
                                let charSet = Math.floor(Math.random() * ALLOWED_CHARS.length);

                                let minCode = ALLOWED_CHARS[charSet][0];
                                let maxCode = (ALLOWED_CHARS[charSet][1] + 1);

                                let charCode = Math.floor((Math.random() * (maxCode - minCode)) + minCode);

                                randomString += String.fromCharCode(charCode);
                            }

                            return randomString;
                        };

                    // Public methods:
                        String.prototype.capitalizeFirstLetter = function()
                        {
                            return this.charAt(0).toUpperCase() + this.slice(1);
                        };

                        String.prototype.contains = function(searchString)
                        {
                            return (this.indexOf(searchString) !== -1);
                        };

                        String.prototype.endsWith = function(searchString)
                        {
                            let sliceLength = -(searchString.length);

                            return (this.slice(sliceLength) === searchString);
                        };

                        String.prototype.escapeRegExp = function()
                        {
                            return this.replace(/[-.*+?()[\]{}/\\|^$]/g, "\\$&");
                        };

        // When jQuery is ready...
            jQuery(function()
            {
                // Start listening for events...
                    if (_isUndefined(window) === false)
                    {
                        _$window.on("resize", _onResizing);
                        _$window.on("scroll", _onScrolling);
                    }
            });

        // Exposing jByloth's definitions...
            // jQuery definitions:
                // Properties:
                    jQuery.jByloth = VERSION;

                // Methods:
                    jQuery.isUndefined = function(obj)
                    {
                        return _isUndefined(obj);
                    };
                    jQuery.isNull = function(obj)
                    {
                        return _isNull(obj);
                    };
                    jQuery.isEmpty = function(obj)
                    {
                        return _isEmpty(obj);
                    };

                    jQuery.isDomElement = function(obj)
                    {
                        return _isDomElement(obj);
                    };

                    jQuery.parseInt = function(value)
                    {
                        return _parseInt(value);
                    };
                    jQuery.parseFloat = function(value)
                    {
                        return _parseFloat(value);
                    };

    })(window, jQuery);
