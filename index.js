var domify = require('domify');

var keys = {
    en: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    de: ['C', 'D', 'E', 'F', 'G', 'A', 'H']
};

var keyReverseMap = {
    en: {
        C: 0,
        D: 1,
        E: 2,
        F: 3,
        G: 4,
        A: 5,
        B: 6
    },
    de: {
        C: 0,
        D: 1,
        E: 2,
        F: 3,
        G: 4,
        A: 5,
        H: 6
    }
};

var keysLength = keys.en.length;

// black keys belongs to the previous white key
// It's the DOM representation
// avoid here to use #, because it's not a valid CSS selector
var blackKeyMap = {
    en: {
        C: false,
        D: ['C#', 'Db'],
        E: ['D#', 'Eb'],
        F: false,
        G: ['F#', 'Gb'],
        A: ['G#', 'Ab'],
        B: ['A#', 'Bb']
    },
    de: {
        C: false,
        D: ['Cis', 'Des'],
        E: ['Dis', 'Es'],
        F: false,
        G: ['Fis', 'Ges'],
        A: ['Gis', 'As'],
        B: ['As', 'B']
    }
};

var octaves = [0,1,2,3,4,5,6,7,8,9,10];

module.exports = function(parent, options) {
    if (options == null) {options = {}}

    var lang = 'en';
    var startKey = 'A';
    var startOctave = 3;
    var endKey = 'C'
    var endOctave = 5;
    var namesMode = 0; // show sharps as default
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
    var keyElementArray = [];
    var firstOccurrence = true;
    for (var o=startOctave; o<=endOctave; o++) {
        for (var k=keyReverseMap.en[startKey]; k<(o === endOctave ? keyReverseMap.en[endKey]+1 : keysLength); k++) {
            var n = keys.en[k]; // key name
            var displayWhiteKey = keys[lang][k] + o;
            if (blackKeyMap.en[n] && !firstOccurrence) {
                var blackNames = blackKeyMap.en[n].map(function(k) {return k+o});
                var displayBlackKey = blackKeyMap[lang][n][namesMode];
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
