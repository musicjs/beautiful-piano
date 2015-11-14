# Beautiful Piano

This library provides a JavaScript API to generate HTML markup for a
beautiful musical keyboard. It comes with a CSS file which makes

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
- `options` Options object with either an `octaves` property or a `range` property.
You can also pass a `namesMode` property.
	- `octaves` - A positive integer, the amount of octaves to generate, starts always with an __A__ and ends with a __C__
	- `range` - Options object with a custm range, h
		- `startKey` - A string, key where the piano should start
		- `startOctave` - An integer on which octave the piano should start
		- `endKey` - A string, key where the piano should end
		- `endOctave` - An integer on which octave the piano should end
	- `namesMode` - A string, either `sharp` or `flat` when names for the black keys are shown



### Demo

See the demo on [rawgit](https://rawgit.com/MusicJS/beautiful-piano/master/demo/index.html)

## WTF? I can't hear anything!

This library provides just a visual interface.
Playing a sound while pressing a key is comming soon as an extra module.


## Credits
All visual credits goes to [Taufik Nurrohman](https://github.com/tovic)

I started with the style sheets from his codepen and modified it for more dynamic
use cases.
