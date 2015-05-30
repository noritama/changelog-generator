# changelog-generator
Generate All Changelog for github project.

## Install

```
npm install changelog-generator
```

## Usage

```js
require('changelog-generator')(function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }                                                                                                                           
  
  process.exit(0);
});
```

or add npm script

```package.json
{
  "scripts": {
    "changelog": "node -e \"require('changelog-generator)()'\""
  }
}
```

## License
MIT
