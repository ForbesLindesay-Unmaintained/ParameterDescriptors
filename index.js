//name is <dt>
//type is <dd>
//description is <dd>
//sub-params is <dd><dl>

function parse(arr, parent){
    var i, child;
    if(arguments.length === 1){
        parent = {children: []};
    }
    if(typeof arr[0] === "string"){
        //Add parameter as child of parent
        if(typeof arr[1] === "string" && typeof arr[2] === "string"){
            //has type and description
            child = {
                name: arr[0],
                type: arr[1],
                desc: arr[2],
                children: []
            };
        } else if (typeof arr[1] === "string"){
            //has type but no description
            child = {
                name: arr[0],
                type: arr[1],
                children: []
            };
        } else {
            //Nothing
            child = {
                name: arr[0],
                children: []
            };
        }
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
        ["arr", "Array", "The argument array to parse"],
        ["[parent]", "ArgumentDefinitionObject", "The parent argument Definition"],
        ["callback(err,res)", "function", "Callback Function", ["err", "Error"], [["res","result"]]]
    ];
    
parse(parse.argumentList);