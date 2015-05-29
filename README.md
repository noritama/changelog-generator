# changelog-generator
Generate All Changelog for github project.

## Install

```
npm install changelog-generator
```

## Usage

```js
var generate = require('changelog-generator');

var url;
try {
  // https://github.com/noritama/changelog-generator
  url = require('./package.json').homepage;
} catch(e) {
  console.error('package.json repository.url load failure.');
  process.exit(1);
}
 
generate(url, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }                                                                                                                                                                                                                                                                         
  process.exit(0);
});
```

## License
MIT
