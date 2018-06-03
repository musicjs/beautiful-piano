(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.piano = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var domify = require('domify');

var keys = {
    en: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    de: ['C', 'D', 'E', 'F', 'G', 'A', 'H']
};

var keyReverseMap = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
};

var keysLength = keys.en.length;

// black keys belongs to the previous white key
// It's the DOM representation
// avoid here to use #, because it's not a valid CSS selector
var blackKeyNameMap = {
    en: {
        C: false,
        D: ['&nbsp;C#', '&nbsp;Db'],
        E: ['&nbsp;D#', '&nbsp;Eb'],
        F: false,
        G: ['&nbsp;F#', '&nbsp;Gb'],
        A: ['&nbsp;G#', '&nbsp;Ab'],
        B: ['&nbsp;A#', '&nbsp;Bb']
    },
    de: {
        C: false,
        D: ['Cis', 'Des'],
        E: ['Dis', '&nbsp;Es'],
        F: false,
        G: ['Fis', 'Ges'],
        A: ['Gis', '&nbsp;As'],
        B: ['Ais', '&nbsp;&nbsp;B']
    }
};
var blackKeyMap = {
    C: false,
    D: ['Cs', 'Db'],
    E: ['Ds', 'Eb'],
    F: false,
    G: ['Fs', 'Gb'],
    A: ['Gs', 'Ab'],
    B: ['As', 'Bb']
};

// scientific notation
var octaves = [0,1,2,3,4,5,6,7,8,9,10];

// https://de.wikipedia.org/wiki/Tonsymbol#Deutsche_Tonbezeichnungen
var helmholtzNotation = [
    {index: 2, upper: true},
    {index: 1, upper: true},
    {index: null, upper: true},
    {index: null, upper: false},
    {index: 1, upper: false},
    {index: 2, upper: false},
    {index: 3, upper: false},
    {index: 4, upper: false},
    {index: 5, upper: false},
    {index: 6, upper: false},
    {index: 7, upper: false},
]

module.exports = function(parent, options) {
    var getCurrentNotation = function(key, octaveIndex) {
        if (notation === 'scientific') {
            return key + octaveIndex;
        }
        var result = helmholtzNotation[octaveIndex];
        if (result.upper) {
            return key.toUpperCase() + (result.index ? result.index : '')
        } else {
            return key.toLowerCase() + (result.index ? result.index : '')
        }
    }

    if (options == null) {options = {}}

    var lang = 'en';
    var startKey = 'A';
    var startOctave = 3;
    var endKey = 'C'
    var endOctave = 5;
    var namesMode = 0; // show sharps as default
    var notation = 'scientific';

    var onKeyDown = null;
    var onKeyUp = null;
    var onKeyClick = null;

    if (options.octaves != null) {
        if (options.octaves <= 0) {
            console.warn('octaves need to be a positive number!');
        }
        var o = parseInt(options.octaves);
        var oHalf = Math.floor(o/2);
        if (o % 2 === 1) {
            startOctave = 3 - oHalf;
            endOctave = 4 + oHalf + 1;
        } else {
            startOctave = 3 - oHalf;
            endOctave = 4 + oHalf;
        }
        while (startOctave < 0) {
            startOctave++;
            endOctave++;
        }

    } else if (options.range != null) {
        startKey = options.range.startKey;
        startOctave = parseInt(options.range.startOctave);
        endKey = options.range.endKey;
        endOctave = parseInt(options.range.endOctave);

    }

    if (options.namesMode === 'flat')  {
        namesMode = 1;
    }

    if (options.lang === 'de') {
        lang = 'de';
    }

    if (options.notation === 'helmholz') {
        notation = 'helmholz';
    }
    if (options.onKeyClick && 'function' === typeof options.onKeyClick){
        onKeyClick = options.onKeyClick;
    }
    if (options.onKeyDown && 'function' === typeof options.onKeyDown){
        onKeyDown = options.onKeyDown;
    }
    if (options.onKeyUp && 'function' === typeof options.onKeyUp){
        onKeyUp = options.onKeyUp;
    }
    var keyElementArray = [];
    var firstOccurrence = true;
    for (var o=startOctave; o<=endOctave; o++) {
        for (var k=keyReverseMap[startKey]; k<(o === endOctave ? keyReverseMap[endKey]+1 : keysLength); k++) {
            var n = keys.en[k]; // key name
            var displayWhiteKey = getCurrentNotation(keys[lang][k], o);
            if (blackKeyMap[n] && !firstOccurrence) {
                var blackNames = blackKeyMap[n].map(function(k) {return k+o});
                var displayBlackKey = blackKeyNameMap[lang][n][namesMode];
                var blackIpnName = blackKeyNameMap['de'][n][0].replace('is', '#')
                keyElementArray.push('<li><div data-ipn="' + n+o + '" data-keyname="' +  displayWhiteKey + '" class="anchor key white ' + n+o + '"></div><span data-ipn="' + blackIpnName+o + '" data-keyname="' + displayBlackKey + '" class="key black ' + blackNames.join(' ') + '"></span></li>');
            } else {
                keyElementArray.push('<li><div data-ipn="' + n+o + '" data-keyname="' + displayWhiteKey + '" class="anchor key ' + n+o + '"></div></li>');
            }
            if (firstOccurrence) {
                firstOccurrence = false;
            }
        }
        startKey = 'C'; // continue next octave from C
    }
    var pianoWrapper = domify('<ul id="beautiful-piano">\n  ' + keyElementArray.join('\n  ') + '</ul>')
    var keydoms = pianoWrapper.getElementsByClassName('key');

    // Add our event handlers
    for (var kid=0; kid < keydoms.length; kid++){
        if (onKeyDown) keydoms[kid].onmousedown = onKeyDown;
        if (onKeyUp) keydoms[kid].onmouseup = onKeyUp;
        if (onKeyClick) keydoms[kid].onclick = onKeyClick;
    }

    parent.appendChild(pianoWrapper);
}

},{"domify":2}],2:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}]},{},[1])(1)
});
