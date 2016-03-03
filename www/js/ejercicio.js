document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    $("#dialogPage").dialog();
    $('#home_network_button').bind("tap", function() {
        checkConnection();
        $.mobile.changePage('#dialogPage', 'pop', true, true);
    });
    $("#home_clearstorage_button").bind("tap", function() {
        window.localStorage.clear();
    });
    $("#home_seedgps_button").bind("tap", function() {
        window.localStorage.setItem('Rutina de Prueba',
            '[\
                    {\
                        "timestamp":1335700802000,\
                        "coords":{\
                            "heading":null,\
                            "altitude":null,\
                            "latitude":24.0232217,\
                            "longitude":-104.5569223,\
                            "accuracy":0,\
                            "speed":null,\
                            "altitudeAccuracy":null\
                        }\
                    },\
                    {\
                        "timestamp":1335721902000,\
                        "coords":{\
                            "heading":null,\
                            "altitude":null,\
                            "latitude":24.0253217,\
                            "longitude":-104.5668223,\
                            "accuracy":0,\
                            "speed":null,\
                            "altitudeAccuracy":null\
                        }\
                    }\
                ]');
    });
};

var track_id = "";
var watch_id = null;
var tracking_data = [];

$(document).on('pageshow', '#history', function() {
    /*
    tracks_recorded = window.localStorage.lenght;
    $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> rutinas guardadas");
    $("#history_tracklist").empty();
    for (i = 0; i < tracks_recorded; i++) {
        $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
    };
    $("#history_tracklist").listview('refresh');*/
    // Count the number of entries in localStorage and display this information to the user
    tracks_recorded = window.localStorage.length;
    $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> rutina(s) guardadas");
    $("#history_tracklist").empty();
    for (i = 0; i < tracks_recorded; i++) {
        $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
    }
    $("#history_tracklist").listview('refresh');
});

$('body').on('tap', '#history_tracklist li a', function() {
    /*$("#track_info").attr("track_id", $(this).text());*/
    $("#track_info").attr("track_id", $(this).text());
});

$('body').on('pageshow', '#track_info', function() {
    /*
    var key = $(this).attr("track_id");
    $("#track_info div[data-role=header] h1").text(key);
    var data = window.localStorage.getItem(key);
    data = JSON.parse(data);
    total_km = 0;
    for (i = 0; i < data.length; i++) {
        if (i == (data.length - 1)) {
            break;
        };
        total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
    };
    total_km_rounded = total_km.toFixed(2);
    start_time = new Date(data[0].timestamp).getTime();
    end_time = new Date(data[data.length - 1].timestamp).getTime();
    total_time_ms = end_time - start_time;
    total_time_s = total_time_ms / 1000;
    final_time_m = Math.floor(total_time_s / 1000);
    final_time_s = total_time_s - (final_time_m * 60);
    $("#track_info_info").html('Viajo <strong>' + total_km_rounded + '</strong> km en <strong>' + final_time_m + 'm</strong> y <strong>' + final_time_s + 's</strong>');
    var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);
    var myOptions = {
        zoom: 15,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var trackCoords = [];
    for (var i = 0; i < data.length; i++) {
        trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
    };
    var trackPath = new google.maps.Polyline({
        path: trackCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    trackPath.setMap(map);*/
    var key = $(this).attr("track_id");
    $("#track_info div[data-role=header] h1").text(key);
    var data = window.localStorage.getItem(key);
    data = JSON.parse(data);
    total_km = 0;
    for (i = 0; i < data.length; i++) {
        if (i == (data.length - 1)) {
            break;
        }
        total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
    }
    total_km_rounded = total_km.toFixed(2);
    start_time = new Date(data[0].timestamp).getTime();
    end_time = new Date(data[data.length - 1].timestamp).getTime();
    total_time_ms = end_time - start_time;
    total_time_s = total_time_ms / 1000;
    final_time_m = Math.floor(total_time_s / 60);
    final_time_s = total_time_s - (final_time_m * 60);
    $("#track_info_info").html('Viajó <strong>' + total_km_rounded + '</strong> km en <strong>' + final_time_m + 'm</strong> y <strong>' + final_time_s + 's</strong>');
    var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);
    var myOptions = {
        zoom: 15,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var trackCoords = [];
    for (i = 0; i < data.length; i++) {
        trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
    }
    var trackPath = new google.maps.Polyline({
        path: trackCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    trackPath.setMap(map);
});

$("#startTracking_start").bind("tap", function() {
    /*
    watch_id = navigator.geolocation.watchPosition(success, error, {
        frequency: 5000,
        enableHighAccuracy: true,
        maximumAge: 100,
        timeout: 60000
    });
    track_id = $("#track_id").val();
    $("#track_id").hide();
    $("#stratTracking_status").html("Registrando la rutina: <strong>" + track_id + "</strong>");*/
    watch_id = navigator.geolocation.watchPosition(
        function(position) {
            var copyPosition = {};
            copyPosition.coords = {};
            copyPosition.timestamp = position.timestamp;
            for (var property in position.coords) {
                if (position.coords[property] !== null) {
                    copyPosition.coords[property] = position.coords[property];
                };
            };
            tracking_data.push(copyPosition);
        },
        function(error) {
            console.log(error);
        }, { frequency: 5000, enableHighAccuracy: true, maximumAge: 100, timeout: 60000 });
    track_id = $("#track_id").val();
    $("#track_id").attr('disabled', 'disabled');
    $("#startTracking_status").html("Registrando la rutina: <strong>" + track_id + "</strong>");
});

$("#startTracking_stop").bind("tap", function() {
    /*
    navigator.geolocation.clearWatch(watch_id);
    window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
    watch_id = null;
    tracking_data = [];
    $("#track_id").val("").show();
    $("#startTracking_status").html("Termino de registrar la rutina: <strong>" + track_id + "</strong>");*/
    navigator.geolocation.clearWatch(watch_id);
    window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
    watch_id = null;
    tracking_data = [];
    $("#track_id").val("").removeAttr('disabled');
    $("#startTracking_status").html("Terminó de registrar la rutina: <strong>" + track_id + "</strong>");
});

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Desconocida';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI] = 'WiFi';
    states[Connection.CELL_2G] = 'Cell 2G';
    states[Connection.CELL_3G] = 'Cell 3G';
    states[Connection.CELL_4G] = 'Cell 4G';
    states[Connection.CELL] = 'Cell genérica';
    states[Connection.NONE] = 'Sin conexión';
    if (networkState === "none") {
        $("#home_network_button").removeClass("ui-icon-check").addClass("ui-icon-delete").text("Acceso a Internet deshabilitado");
    } else {
        $("#home_network_button").removeClass("ui-icon-delete").addClass("ui-icon-check").text("Acceso a Internet habilitado");
    };
    $("#dialogPageMessage").text("Tipo de conexión: " + states[networkState]);
};

function gps_distance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

function success(position) {
    var copyPosition = {};
    copyPosition.coords = {};
    copyPosition.timestamp = position.timestamp;
    for (var property in position.coords) {
        if (position.coords[property] !== null) {
            copyPosition.coords[property] = position.coords[property];
        };
    };
    tracking_data.push(copyPosition);
};

function error(error) {
    console.log(error);
}

var JSON;
if (!JSON) {
    JSON = {};
}

(function() {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function(key) {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function(key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ? walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
