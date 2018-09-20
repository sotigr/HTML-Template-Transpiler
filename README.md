# HTML-Template-Transpiler
Converts html templates to javascript generator functions

## Raw code generation
```javascript
//Example html template
let stringTemplate = `
    <div class="this-is-a-class">
        <span>Hello sir</span>
    </div>
    <span>loololo</span>
`;

//Creating a transpiler instance
let transpiler = new TemplateTranspiler.Parser();

//Passing the template as an argument to 
//the transpiler's parser
let rawJsCode = transpiler.Parse(stringTemplate);

//Printing the resault
console.log(rawJsCode);
```

## Generator functions

```javascript
let stringTemplate = `
    <div class="this-is-a-class">
        <span>Hello sir</span>
    </div>
    <span>loololo</span>
`;
 
let transpiler = new TemplateTranspiler.Parser();

//Generating the generator function
transpiler.GenerateDrawerFuction("myFunction", stringTemplate);

//The function is now generated and can be accessed from
//TemplateTranspiler.Functions...

//Calling the generated function
//This will render and append the transpiled template
//in the body of the document
TemplateTranspiler.Functions.myFunction(document.body);
```
