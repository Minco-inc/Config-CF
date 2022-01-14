# Config.CF
The simple super-lightweight ini-like config library.

## Installation
### Config.CF
```bash
npm i config.cf
```
### CF.cli
```bash
npm i config.cf -g
```

## Usage
### Config CF
This is the basic of the library.
```js
const Config = require('config-cf');
const fs = require('fs');

let file = fs.readFileSync('config.cf', 'utf-8');
let config = Config.parse(file);
console.log(config);

let str = Config.stringify(config);
console.log(str);

// Config.toJSON(...);
// Config.fromJSON(...);
```
### CF.cli
You can use CF.cli to make configuring easier.
```bash
cf form.cff
```

## Syntax
### CF
This is the syntax of the CF file.
```ini
[Section]
prop=value
prop1=value

# Comment
<= Long
 = Comment
 =>

[Section1]
prop1=value
prop2=value
```
This will convert to:
```js
{
    section: {
        prop: 'value',
        prop1: 'value'
    },
    section1: {
        prop1: 'value',
        prop2: 'value'
    }
}
```
### CCF
CCF file is for configuring CF.cli, this have information about config.
```ini
>target.cf
[Section]
prop1=What is prop1?
prop2=What is prop2?
prop3=What is prop3?

[Section1]
prop1=What is prop1?
propN=What is propN?
```
CF.cli will ask like:
```
[Section] What is prop1?
[Section] What is prop2?
[Section] What is prop3?
[Section1] What is prop1?
[Section1] What is propN?
```

## Future Updates
- Read function: `Config.read('config.cf')`
- And some performance improvements!

## Issues
Feel free to make issues. I want to improve my library!

Thanks for using.
