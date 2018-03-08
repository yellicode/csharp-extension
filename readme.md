# C# extension for Yellicode
Yellicode lets you build your own code generators with TypeScript. It consists of a Node.js CLI (Command Line Interface) as well as extensible APIs, making it easy for developers to create, share and re-use code generators.

Check out [our website](https://www.yellicode.com) for more.

This extension contains a CSharpWriter class and other utilities that make is easier to generate C# code from a Yellicode template.

License: MIT

## Using the C# package
### Prerequisites
In order to run a code generation template, you must have the CLI installed (@yellicode/cli) globally and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

You should also have the *@yellicode/model* package installed in your working directory:
```
npm install @yellicode/model --save-dev
```

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/csharp --save-dev
```

### Sample template
This template generates a C# code file with all classes in the model and, for each class, writes an auto-property for each class attribute.

```ts
import { Generator, TextWriter } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';
import * as model from '@yellicode/model';

Generator.generateFromModel({outputFile: './MyClasses.cs'}, (textWriter: TextWriter, pack: model.Package) => {
    const writer = new CSharpWriter(textWriter); 
    writer.writeUsingDirectives('System', 'System.Collections.Generic'); 
    writer.writeEndOfLine();
    writer.writeNamespaceBlock(pack, () => {        
        pack.getAllClasses().forEach(c => {           
            writer.writeClassBlock(c, () => {
                c.ownedAttributes.forEach(att => {
                    writer.writeAutoProperty(att);
                })
            })            
            writer.writeEndOfLine();
        });
    });
});
```

### API Documentation
For all CSharpWriter functions and options, check out the [API documentation](https://github.com/yellicode/yellicode-csharp/blob/master/docs/api.md).