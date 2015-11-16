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
    var keyElementArray = [];
    var firstOccurrence = true;
    for (var o=startOctave; o<=endOctave; o++) {
        for (var k=keyReverseMap[startKey]; k<(o === endOctave ? keyReverseMap[endKey]+1 : keysLength); k++) {
            var n = keys.en[k]; // key name
            var displayWhiteKey = getCurrentNotation(keys[lang][k], o);
            if (blackKeyMap[n] && !firstOccurrence) {
                var blackNames = blackKeyMap[n].map(function(k) {return k+o});
                var displayBlackKey = blackKeyNameMap[lang][n][namesMode];
                keyElementArray.push('<li><div data-keyname=' +  displayWhiteKey + ' class="anchor ' + n + o + '"></div><span data-keyname="' + displayBlackKey + '" class="' + blackNames.join(' ') + '"></span></li>');
            } else {
                keyElementArray.push('<li><div data-keyname=' + displayWhiteKey + ' class="anchor ' + n + o + '"></div></li>');
            }
            if (firstOccurrence) {
                firstOccurrence = false;
            }
        }
        startKey = 'C'; // continue next octave from C
    }
    var pianoWrapper = domify('<ul id="beautiful-piano">\n  ' + keyElementArray.join('\n  ') + '</ul>')
    parent.appendChild(pianoWrapper);
}
