const TemplateTranspiler = {};
TemplateTranspiler.Functions = {};

TemplateTranspiler.UID = class UID {

    static generate(){

        let s4 = ()=>{
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          
            for (var i = 0; i < 5; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
        }
        return s4() + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() + s4() + s4();

    }

}


TemplateTranspiler.Parser = class Parser {

    constructor(){

        //The dom parser is used to read the input template
        this._domParser = new DOMParser();

        //Creates a random nameset for all elements parsed by each instance
        //to avoid possible conflicts
        this._random_name = TemplateTranspiler.UID.generate();

        //tag_count is the unique identifier for each tag parsed by each instance
        this._tag_count = 0;

        this.TemplateInstanceList = [];
 
    }

    TranspileNode(node, parentName){

        //Generating a unique name for the element
        let current_name = "a_" + this._random_name + "_" + this._tag_count++;

        //Initializing a viriable for the generated code
        let final = "";
        
        if (node.nodeName == "#comment")
            return final; 
    
        if (node.nodeName == "#text"){
            if (node.data.replace(/[\r\n]+/g,' ').trim() == "")
                return "";
            final += "var " + current_name + " = " + "document.createElement('SPAN');";
            final += current_name + ".innerHTML += '"+ node.data.replace(/[\r\n]+/g,' ') + "';";
            final +=  parentName + ".appendChild("+current_name+");";  
            return final;
        }
        //Creates the element 
        final += "var " + current_name + " = " + "document.createElement('"+node.tagName.toUpperCase()+"');";
        
        //Parsing and transfering arguments
        let len = node.attributes.length;
        for (let i = 0; i < len; i++){

            final += current_name + ".setAttribute('"+node.attributes[i].name+"', '"+node.attributes[i].value+"');"

        };
 
        //Parsing children if any
        if (node.childNodes.length > 0)
        {
            let len = node.childNodes.length;
            for (let i=0; i<len ;i++){

                final += this.TranspileNode(node.childNodes[i], current_name);
 
            };
         
        }
        else{ 
            //If there are no children then add the innerHTML
            
            final += current_name + ".textContent = '" + node.innerHTML.replace(/[\r\n]+/g,' ') + "';";
        }

        //Append to parent
        if (node.hasAttribute("eid"))
        { 
            final += parentName + ".appendChild("+current_name+");"; 
            final += "childObjects." + node.getAttribute("eid") + " = " + current_name + ";";
        }
        else
        { 
            final +=  parentName + ".appendChild("+current_name+");";  
        }

        //return the generated javascript for this node
        return final;

    }
    
    Parse(template){

        //Cleans the instance list
        this.TemplateInstanceList = [];

        //Feeds the template in the dom parser.
        let parsedTemplate = this._domParser.parseFromString(template, "text/html"); 

        let transpiled = "";
        let len = parsedTemplate.body.childNodes.length;
        for (let i = 0; i<len;i++){
            //generating the javascript code for each child
            //of the root of the document
            transpiled += this.TranspileNode(parsedTemplate.body.childNodes[i], "target");
        } 
        
        return transpiled;

    }

    GenerateDrawerFuction(functionName, template){
        let parsed = this.Parse(template);

        let final = `
            TemplateTranspiler.Functions.${functionName} = function(target){
                return new Promise(function(resolve, reject){ 
                    var childObjects = {};
                    ${parsed}
                    resolve(childObjects); 
                });
            };
        `;
    
        let script = document.createElement("SCRIPT");
  
        script.innerHTML = final;
        document.head.appendChild(script); 

    }
 
}
 