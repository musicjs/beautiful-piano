# Beautiful Piano

[![npm version](https://img.shields.io/npm/v/beautiful-piano.svg)](https://www.npmjs.com/package/beautiful-piano)
[![npm dependencies](https://img.shields.io/david/MusicJS/beautiful-piano.svg)](https://david-dm.org/MusicJS/beautiful-piano)
[![npm dev dependencies](https://img.shields.io/david/dev/MusicJS/beautiful-piano.svg)](https://david-dm.org/MusicJS/beautiful-piano#info=devDependencies)

This library provides a JavaScript API to generate HTML markup for a
beautiful musical keyboard. It comes with a CSS file which makes it so nice.

## Setup
Either embed the file from the `dist` directory via script tag in your HTML:

```
<script src="beautiful-piano/dist/piano.js"></script>
```

Then you can access to the global variable `piano`.

Otherwise install it via npm `npm i beautiful-piano`

Don't forget to include the CSS file, for instance:

```
<link rel="stylesheet" href="beautiful-piano/styles.css">
```

## Usage

```
piano(document.querySelector('body'), {octaves: 3});
```

## API

### piano(parent, options)

__Arguments:__
- `parent` - DOM element where to inject the piano
- `options` Options object, `octaves` and `range` property can't be used in combination
You can also pass a `namesMode` property.
	- `octaves` - A positive integer, the amount of octaves to generate,
	starts always with an __A__ and ends with a __C__, min: 1, max: 9
	- `range` - Options object with a custom range
		- `startKey` - A string, key where the piano should start, `A-H`
		- `startOctave` - An integer on which octave the piano should start, min: 0, max: 10
		- `endKey` - A string, key where the piano should end, `A-H`
		- `endOctave` - An integer on which octave the piano should end, min: 0, max: 10
	- `namesMode` - A string, either `sharp` or `flat` when names for the black keys are shown
	- `lang` - A string, either `en` or `de` to swap __H__ and __B__
	- `notation` - A string, either `scientific` or `helmholz` will be used for octave notation

You can toggle the pressed effect of each key with CSS class.
For instance: `document.querySelector('.C4').classList.add('active')`

### Demo

See the demo on [rawgit](https://rawgit.com/MusicJS/beautiful-piano/master/demo/index.html)

## WTF? I can't hear anything!

This library provides just a visual interface.
Playing a sound while pressing a key is comming soon as an extra module.


## Credits
All visual credits goes to [Taufik Nurrohman](https://github.com/tovic)

I started with the style sheets from his codepen and modified it for more dynamic
use cases.
