var Benchmark     = require('benchmark'),
    suite         = new Benchmark.Suite,
    dominantColor = require('dominant-color'),
    ColorThief    = require('color-thief'),
    colorThief    = new ColorThief(),
    fs            = require('fs'),
    rgbHex        = require('rgb-hex'),
    image         = '/home/hrvoje/code/hack/blenda/public/images/raw/onrighttrack.jpg'

// add tests
suite.add('dominant color', function() {
  dominantColor(image)
})
.add('color thief', function() {
  var image = fs.readFileSync(imagePath);
  var rgb = colorThief.getColor(image);
  rgbHex(rgb)
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
