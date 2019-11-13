# C# extension for Yellicode
Generate C# code using powerful TypeScript code generation templates! This [Yellicode](https://www.yellicode.com) extension lets you generate C# classes, interfaces, enumerations, structs and their members from different kinds of models, using a fully typed code writer.

License: MIT

## About Yellicode
Yellicode lets you build your own code generation templates with TypeScript. It consists of a Node.js CLI and extensible APIs, making it easy for developers to create, share and re-use code generators for their favorite programming languages and frameworks.

Check out [our website](https://www.yellicode.com) for more.

## Using the C# package
### Prerequisites
In order to run a code generation template, you must have the CLI installed (@yellicode/cli) globally and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/csharp --save-dev
```
## Using the CSharpWriter
The main class for generating C# code is the `CSharpWriter`. The `CSharpWriter` can work with 2 different model kinds as input:
* A C# code definition. 
* A [Yellicode model](https://www.yellicode.com/docs/yellicode-models).

Most `CSharpWriter` functions have 2 overloads which can be used for each different kind of input. For example, the `writeClassBlock` function has the 
following overloads:
1. `public writeClassBlock(definition: ClassDefinition, contents: () => void): void;`
2. `public writeClassBlock(cls: elements.Class, contents: () => void, options?: opts.ClassOptions): void;`

The first overload accepts a `ClassDefinition`, which has the following structure (comments left out for brevity):

```ts
export interface ClassDefinition extends TypeDefinition {    
    isAbstract?: boolean;    
    implements?: string[];    
    inherits?: string[];    
    properties?: PropertyDefinition[];    
    methods?: MethodDefinition[];
}
```
When using this overload, you should build the definition in your code generation template. You can do this manually, but typically you would 
configure a JSON file as model (see the [Yellicode quick start](https://www.yellicode.com/docs/quickstart) for a how-to) and transform that JSON structure to a C# definition.

The second overload accepts a [class](https://www.yellicode.com/docs/api/model/class) instance from a Yellicode model and accepts an optional `ClassOptions` 
object to control code generation (internally, the Yellicode class is transformed to a `ClassDefinition`). 

## Examples
*Note: a ZIP archive with working examples is also [available for download here](https://github.com/yellicode/yellicode-csharp/blob/master/examples/yellicode-csharp-examples.zip).*

### Example using a C# code definition
This sample creates a simple C# definition of a *Task* class, which is then provided to the  `CSharpWriter`. You would typically create this definition from another
structure (your own JSON model, using the 'model' parameter).

```ts
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter, ClassDefinition, NamespaceDefinition } from '@yellicode/csharp';

Generator.generateFromModel({ outputFile: './custom-sample.cs' }, (output: TextWriter, model: any) => {

    // Build a C# definition in code. You could alternatively configure any JSON file as model 
    // and transform that data - available in the 'model' parameter - to a C# definition.
    const namespaceDefinition: NamespaceDefinition = { name: 'SampleNamespace' };    

    const classDefinition: ClassDefinition = {
        name: 'Task',
        accessModifier: 'public',
        xmlDocSummary: ['Represents an activity to be done.']
    };

    classDefinition.properties = [
        { name: 'TaskDescription', typeName: 'string', accessModifier: 'public', xmlDocSummary: ['Gets or sets a description of the task.'] },
        { name: 'IsFinished', typeName: 'bool', accessModifier: 'public', xmlDocSummary: ['Indicates if the task is finished.'] }
    ];

    // Write the namespace, the classes and its properties
    const csharp = new CSharpWriter(output);    
    csharp.writeNamespaceBlock(namespaceDefinition, () => {         
        csharp.writeClassBlock(classDefinition, () => {
            classDefinition.properties.forEach(p => {
                csharp.writeAutoProperty(p);
                csharp.writeLine();
            })
        });
    })
});

```
The generated C# code will look as follows:
```csharp
namespace SampleNamespace
{
	/// <summary>
	/// Represents an activity to be done.
	/// </summary>
	public class Task
	{
		/// <summary>
		/// Gets or sets a description of the task.
		/// </summary>
		public string TaskDescription { get;set; }

		/// <summary>
		/// Indicates if the task is finished.
		/// </summary>
		public bool IsFinished { get;set; }
	}
}
```
### Example using a Yellicode model
For navigating a Yellicode model in template code, you should also have the *@yellicode/elements* package installed in your working directory:
```
npm install @yellicode/elements --save-dev
```

This template generates a C# code file with all classes in the model and, for each class, writes an auto-property for each class attribute.

```ts
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';
import * as elements from '@yellicode/elements';

Generator.generateFromModel({ outputFile: './model-based-sample.cs' }, (output: TextWriter, model: elements.Model) => {
    const csharp = new CSharpWriter(output);   
    model.getAllClasses().forEach(cls => {
        csharp.writeClassBlock(cls, () => {
            cls.ownedAttributes.forEach(att => {
                csharp.writeAutoProperty(att);
                csharp.writeLine();
            });            
        }, { isPartial: true }); // marking the class 'partial'
        csharp.writeLine();
    });
});     
```

## API Documentation
For all CSharpWriter functions and options, check out the [API documentation](https://github.com/yellicode/yellicode-csharp/blob/master/docs/api.md).