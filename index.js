exports.paramListClass = "param-list";
exports.paramSubListClass = "param-sub-list";
exports.paramNameClass = "param-name";
exports.paramTypeClass = "param-type";
exports.paramDescClass = "param-desc";
exports.paramDefaultClass = "param-default-value";

function parse(arr, parent){
    var i, child = {children:[]};
    if(arguments.length === 1){
        parent = {children: []};
    }
    if(typeof arr[0] === "string"){
        //Add parameter as child of parent
        if(!arr[0]) throw "Parameter name can't be empty";
        child.name = arr[0];
        if(typeof arr[1] === "string" && arr[1]) child.type = arr[1];
        else child.type = "...";
        if(typeof arr[1] === "string" && typeof arr[2] === "string" && arr[2])child.desc = arr[2];
        else child.desc = "&nbsp;";
        if(typeof arr[1] === "string" && typeof arr[2] === "string" && typeof arr[3] === "string" && arr[3])child.defaultVal = arr[3];
        else child.defaultVal = "&nbsp;";
        for (i = 0; i<arr.length; i++){
            if(Array.isArray(arr[i])){
                parse(arr[i], child);
            }
        }
        parent.children.push(child);
    }else{
        for(i = 0; i<arr.length; i++){
            parse(arr[i], parent);
        }
    }
    return parent.children;
}
parse.argumentList = [
        ["arr", "array", "The argument array to parse"],
        ["[parent]", "object", "The parent argument Definition"]
    ];
    
var indentSpace = (function(){
    var spaces = "                                                                                                                                                         ";
    return function (indent){
        return spaces.substring(0, indent * 4);
    };
}());
indentSpace.argumentList = [
        ["indent", "integer", "The number of tabs to indent, will return 4 times this many spaces"]
    ];
    
function render(argumentArray, indent, buffer){
    indent = indent||0;
    buffer = buffer||[];
    if(argumentArray.length > 0){
        buffer.push(indentSpace(indent) + '<dl class="'+exports.paramListClass+'">');
        for(var i = 0; i<argumentArray.length; i++){
            renderParam(argumentArray[i], indent + 1, buffer);
        }
        buffer.push(indentSpace(indent) + '</dl>');
    }
    return buffer;
}
render.argumentList = [
        ["argumentArray", "array", "The array containing definition(s) of parameters"],
        ["[indent]", "integer", "The current indentation level", "0"],
        ["[buffer]", "array", "The array to which lines are rendered", "[]"],
        ["returns", "array", "The array of lines rendered"]
    ];
function renderParam(argument, indent, buffer){
    buffer.push(indentSpace(indent) + '<dt class="'+exports.paramNameClass+'">' + argument.name + '</dt>');
    if(argument.type){
        var lowerType = argument.type.toLowerCase();
        var useTypeClass = /^[a-z]*$/.test(lowerType);
        buffer.push(indentSpace(indent) + '<dd class="'+exports.paramTypeClass + (useTypeClass?' ' + exports.paramTypeClass + '-' + lowerType:'') + '">' + argument.type + '</dd>');
    }
    if(argument.desc) buffer.push(indentSpace(indent) + '<dd class="'+exports.paramDescClass+'">' + argument.desc + '</dd>');
    if(argument.defaultVal) buffer.push(indentSpace(indent) + '<dd class="'+exports.paramDefaultClass + '">'+(argument.defaultVal === "&nbsp;"?'':'default: ') + argument.defaultVal + '</dd>');
    if(argument.children.length){
        buffer.push(indentSpace(indent) + '<dd class="'+exports.paramSubListClass+'">');
        render(argument.children, indent+1, buffer);
        buffer.push(indentSpace(indent) + '</dd>');
    }
    return buffer;
}


function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
}

exports.parse = parse;
exports.render = function(argumentArray){return render(argumentArray).join("\n");};
exports.ParseAndRender = function(array){
    return exports.render(this.parse(array));
};
exports.jsonParseAndRender = function(text){
    text = trim(text);
    return exports.ParseAndRender(JSON.parse(text));
};