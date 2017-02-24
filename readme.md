# Syntax Basics

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/ParameterDescriptors.svg)](https://greenkeeper.io/)

This module produces an html definition list for parameters from a json array.

The JSON array should be of the following form:

```javascript
[["Arg0","type","Description of Arg0"],
 ["[Arg1]","type","Description of Arg1", "default"]]
```

Not that the order of the items is important.  They must be in the order:
name, type, description, default.  You don't have to provide all these arguments,
but you must not miss one of them out, if you wish to omit one of the values, you
can include the empty string for everything except name.

e.g.

```javascript
[["Arg0", "", "We don't know what type this is"],
 ["Arg2", "descriptionless", "", "0"]];
```

# Installation

Install using npm:

    npm install parameter-descriptors

Require in:

    require("parameter-descriptors").jsonParseAndRender


# Public Methods

## parse(InputArray)

Parse the input array to produce a new tree which is expanded:

Would turn:

```javascript
[["Arg0","object"],
 ["Arg1","object","A description of arg1"],
 ["callback(err,resA,resB)","function","The callback",
    ["err","exception","An error if thrown"],
    [["resA","number","A number at random"],
     ["resB","boolean","true or false"]]
 ]]
```

Into:

```javascript
[{name:"Arg0",type:"object",desc:"&nbsp;",defaultVal:"&nbsp;", children:[]},
 {name:"Arg1",type:"object",desc:"A description of arg1",defaultVal:"&nbsp;", children:[]},
 {name:"callback(err,resA,resB)",type:"function",desc:"The callback",defaultVal:"&nbsp;", children:[
     {"children":[],"name":"err","type":"exception","desc":"An error if thrown","defaultVal":"&nbsp;"},
     {"children":[],"name":"resA","type":"number","desc":"A number at random","defaultVal":"&nbsp;"},
     {"children":[],"name":"resB","type":"boolean","desc":"true or false","defaultVal":"&nbsp;"}],
 }]
```

This nesting can be continued indefinitely.

## render(ParsedArray)

Render the output of the parse function as a string.  Continuing the previous example would give:

```html
<dl class="param-list">
    <dt class="param-name">Arg0</dt>
    <dd class="param-type param-type-object">object</dd>
    <dd class="param-desc">&nbsp;</dd>
    <dd class="param-default-value">default: &nbsp;</dd>
    <dt class="param-name">Arg1</dt>
    <dd class="param-type param-type-object">object</dd>
    <dd class="param-desc">A description of arg1</dd>
    <dd class="param-default-value">default: &nbsp;</dd>
    <dt class="param-name">callback(err,resA,resB)</dt>
    <dd class="param-type param-type-function">function</dd>
    <dd class="param-desc">The callback</dd>
    <dd class="param-default-value">default: &nbsp;</dd>
    <dd class="param-sub-list">
        <dl class="param-list">
            <dt class="param-name">err</dt>
            <dd class="param-type param-type-exception">exception</dd>
            <dd class="param-desc">An error if thrown</dd>
            <dd class="param-default-value">default: &nbsp;</dd>
            <dt class="param-name">resA</dt>
            <dd class="param-type param-type-number">number</dd>
            <dd class="param-desc">A number at random</dd>
            <dd class="param-default-value">default: &nbsp;</dd>
            <dt class="param-name">resB</dt>
            <dd class="param-type param-type-boolean">boolean</dd>
            <dd class="param-desc">true or false</dd>
            <dd class="param-default-value">default: &nbsp;</dd>
        </dl>
    </dd>
</dl>
```

This prints out remarcably nicely using the default-styles.css style sheet.

It is also OK in GitHub.  If you're looking at the page of this, you'll see it printed nicely,
If you're reading the markdown file GitHub, it should at least be readable.

## jsonParseAndRender(text)

Does the whole process from a JSON string which it parses, then renders and returns the resulting html.

## Default Classes

By default, the following classes are used, but they can be easily overrided.

```javascript
exports.paramListClass = "param-list";
exports.paramSubListClass = "param-sub-list";
exports.paramNameClass = "param-name";
exports.paramTypeClass = "param-type";
exports.paramDescClass = "param-desc";
exports.paramDefaultClass = "param-default-value";
```

For any type which contains only letters ([a-zA-Z]*), the type is also given the class

    exports.paramTypeClass + "-" + type.toLowerCase()
    
Typically something like "param-type-array".

## Colours for types

The css file has default colourings for the following types:

 - object
 - array
 - number
 - int
 - integer
 - string
 - function
 - boolean
 - regexp
