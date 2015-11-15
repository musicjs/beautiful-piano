var domify = require('domify');

var blackKeyClassMap = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
};

var keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

var keyReverseMap = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
};

var keysLength = keys.length;

// black keys belongs to the previous white key
// It's the DOM representation
// avoid here to use #, because it's not a valid CSS selector
var blackKeyMap = {
    C: false,
    D: ['Cs', 'Db'],
    E: ['Ds', 'Eb'],
    F: false,
    G: ['Fs', 'Gb'],
    A: ['Gs', 'Ab'],
    B: ['As', 'Bb']
};

var convertAccidental = function(keyName) {
    return keyName.replace('s', '\u0023').replace('b', '\u266D');
}

var octaves = [0,1,2,3,4,5,6,7,8,9,10];

module.exports = function(parent, options) {
    if (options == null) {options = {}}

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
    if (options.namesMode != null) {
        if (options.namesMode === 'flat')  {
            namesMode = 1;
        }
    }
    var keyElementArray = [];
    var firstOccurrence = true;
    for (var o=startOctave; o<=endOctave; o++) {
        for (var k=keyReverseMap[startKey]; k<(o === endOctave ? keyReverseMap[endKey]+1 : keysLength); k++) {
            var n = keys[k]; // key name
            if (blackKeyMap[n] && !firstOccurrence) {
                var blackNames = blackKeyMap[n].map(function(k) {return k+o});
                keyElementArray.push('<li><div data-keyname=' +  n + o + ' class="anchor ' + n + o + '"></div><span data-keyname="' + convertAccidental(blackKeyMap[n][namesMode]) + '" class="' + blackNames.join(' ') + '"></span></li>');
            } else {
                keyElementArray.push('<li><div data-keyname=' + n + o + ' class="anchor ' + n + o + '"></div></li>');
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
