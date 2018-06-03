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
        B: ['Ais', 'B']
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
        var octname = nameOctaves ? octaveIndex : '';
        if (notation === 'scientific') {
            return key + octname;
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
    var namesMode = null; // show sharps as default
    var nameOctaves = true; 
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

    if (options.namesMode)  {
        namesMode = options.namesMode;
    }

    if (options.lang === 'de') {
        lang = 'de';
    }

    if (options.nameOctaves === false) {
        nameOctaves = false
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
                // sharp is the default
                var displayBlackKey = blackKeyNameMap[lang][n][0];
                switch(namesMode) {
                    case 'flat':
                        displayBlackKey = blackKeyNameMap[lang][n][1];
                        break;
                    case 'both':
                        displayBlackKey = blackKeyNameMap[lang][n][0] + ' ' + blackKeyNameMap[lang][n][1];
                        break;  
                }
                var blackIpnName = blackKeyNameMap['de'][n][0].replace('is', '#');
                keyElementArray.push('<li class="oct' + o + '"><div data-ipn="' + n+o + '" data-keyname="' +  displayWhiteKey + '" class="anchor key white ' + n+o + '"></div><span data-ipn="' + blackIpnName+o + '" data-keyname="' + displayBlackKey + '" class="key black ' + blackNames.join(' ') + '"></span></li>');
            } else {
                keyElementArray.push('<li class="oct' + o + '"><div data-ipn="' + n+o + '" data-keyname="' + displayWhiteKey + '" class="anchor key white ' + n+o + '"></div></li>');
            }
            if (firstOccurrence) {
                firstOccurrence = false;
            }
        }
        startKey = 'C'; // continue next octave from C
    }

    var pianoclass = namesMode && namesMode.length > 0 ? 'piano-show-names' : '';
    var pianoWrapper = domify('<ul id="beautiful-piano" class="' + pianoclass + '">\n  ' + keyElementArray.join('\n  ') + '</ul>')
    var keydoms = pianoWrapper.getElementsByClassName('key');

    // Add our event handlers
    for (var kid=0; kid < keydoms.length; kid++){
        var dataipn = keydoms[kid].getAttribute('data-ipn');
        if (onKeyDown) keydoms[kid].onmousedown = onKeyDown.bind(null, dataipn);
        if (onKeyUp) keydoms[kid].onmouseup = onKeyUp.bind(null, dataipn);
        if (onKeyClick) keydoms[kid].onclick = onKeyClick.bind(null, dataipn);
    }

    parent.appendChild(pianoWrapper);
}
