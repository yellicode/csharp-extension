## Contents
* [ClassDefinition](#class-definition) interface
* [ClassOptions](#class-options) interface
* [CollectionType](#collection-type) enumeration
* [CSharpTypeNameProvider](#c-sharp-type-name-provider) class
* [CSharpWriter](#c-sharp-writer) class
* [CSReservedKeywordTransform](#cs-reserved-keyword-transform) class
* [DefinitionBase](#definition-base) interface
* [EnumDefinition](#enum-definition) interface
* [EnumFeatures](#enum-features) enumeration
* [EnumMemberDefinition](#enum-member-definition) interface
* [EnumMemberFeatures](#enum-member-features) enumeration
* [EnumMemberOptions](#enum-member-options) interface
* [EnumOptions](#enum-options) interface
* [InterfaceDefinition](#interface-definition) interface
* [InterfaceFeatures](#interface-features) enumeration
* [InterfaceOptions](#interface-options) interface
* [MethodDefinition](#method-definition) interface
* [MethodFeatures](#method-features) enumeration
* [MethodOptions](#method-options) interface
* [NamespaceDefinition](#namespace-definition) interface
* [NamespaceFeatures](#namespace-features) enumeration
* [NamespaceOptions](#namespace-options) interface
* [ParameterDefinition](#parameter-definition) interface
* [PropertyDefinition](#property-definition) interface
* [PropertyFeatures](#property-features) enumeration
* [PropertyOptions](#property-options) interface
* [StructDefinition](#struct-definition) interface
* [StructFeatures](#struct-features) enumeration
* [StructOptions](#struct-options) interface
* [TypeDefinition](#type-definition) interface
* [WriterOptions](#writer-options) interface
## <a name="class-definition"></a> ClassDefinition interface
Represents a C# class.

### ClassDefinition.name: string
Get or sets the name of the code element. This field is required.
### ClassDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### ClassDefinition.accessModifier: any
Gets the type's access modifier. By default, no access modifier will be written.
### ClassDefinition.isPartial: boolean
Indicates whether the type should be written with the 'partial' keyword. 
The default value is false.
### ClassDefinition.implements: string
Contains the names of the interfaces that the class should implement. 
This field is optional.
### ClassDefinition.inherits: string
Contains the names of the classes from which the class should inherit. 
This field is optional.
### ClassDefinition.isAbstract: boolean
Indicates whether the class should be abstract. 
The default value is false.
### ClassDefinition.methods: MethodDefinition
Gets the class methods. 
### ClassDefinition.properties: PropertyDefinition
Gets the class properties.

## <a name="class-options"></a> ClassOptions interface

### ClassOptions.features: ClassFeatures
Defines the class features to write. The default is ClassFeatures.All.
### ClassOptions.implements: string
Any additional interface names that the class should implement.
### ClassOptions.inherits: string
Any additional class names that the class should inherit from.
### ClassOptions.isAbstract: boolean
Indicates if the class should be made abstract. 
By default, the value of the 'Abstract' class setting in the model is used.
### ClassOptions.isPartial: boolean
Indicates if the class must be prefixed with the "partial" keyword.

## <a name="collection-type"></a> CollectionType enumeration
Enumerates the possible collection types to generated for properties and parameters.

* ICollection
* IEnumerable
* IList

## <a name="c-sharp-type-name-provider"></a> CSharpTypeNameProvider class

### CSharpTypeNameProvider.canBeNullable(typedElement, csTypeName) : boolean
* typedElement: TypedElement
* csTypeName: string
### CSharpTypeNameProvider.getTypeNameForType(type, isDataType) : string
* type: Type
* isDataType: boolean

## <a name="c-sharp-writer"></a> CSharpWriter class
A CodeWriter for writing C# code from code generation templates. This writer can write classes, interfaces, structs and enumerations and also
contains functions for writing namespace blocks and using directives. The CSharpWriter is compatible with Yellicode models but can also work
independently.

### CSharpWriter.constructor(writer, options) : CSharpWriter
Constructor. Creates a new CSharpWriter instance using the TextWriter and options provided.
* writer: object

   The template's current TextWriter.
* options: [WriterOptions](#writer-options)

   Optional: the global options for this writer.
### CSharpWriter.getTypeName(typedElement) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* typedElement: TypedElement

   Any element that has a type, such as a Property or Parameter.
### CSharpWriter.getTypeName(type) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* type: Type

   Any element that derives from Type.
### CSharpWriter.writeAccessModifier(definition) : this
Writes the type's access modifier to the output with a trailing whitespace.
Writes the visibility to the output with a trailing whitespace. If the visibilty is null or 
not supported by C#, nothing will be written.
* definition: { accessModifier?: AccessModifier; }

   The type definition.
### CSharpWriter.writeAccessModifier(visibilityKind) : this
Writes the type's access modifier to the output with a trailing whitespace.
Writes the visibility to the output with a trailing whitespace. If the visibilty is null or 
not supported by C#, nothing will be written.
* visibilityKind: VisibilityKind

   A VisibilityKind value. This value can be null.
### CSharpWriter.writeAutoProperty(property) : this
Writes an auto property with a getter and a setter. 
Writes an auto property with a getter and - if the property is not ReadOnly or Derived - a setter.     
This function can be used for both Class- and and Interface properties. 
* property: [PropertyDefinition](#property-definition)

   The property definition.
### CSharpWriter.writeAutoProperty(property, options) : this
Writes an auto property with a getter and a setter. 
Writes an auto property with a getter and - if the property is not ReadOnly or Derived - a setter.     
This function can be used for both Class- and and Interface properties. 
* property: Property
* options: [PropertyOptions](#property-options)
### CSharpWriter.writeClassBlock(definition, contents) : this
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
* definition: [ClassDefinition](#class-definition)

   The class definition.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the class contents.
### CSharpWriter.writeClassBlock(cls, contents, options) : this
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
* cls: Class

   The class.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the class contents.
* options: [ClassOptions](#class-options)

   An optional ClassOptions object.
### CSharpWriter.writeClassMethodBlock(operation, contents, options) : this
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
* operation: Operation
* contents: (writer: CSharpWriter) => void
* options: [MethodOptions](#method-options)
### CSharpWriter.writeCodeBlock(contents) : this
Writes an indented block of code, wrapped in opening and closing brackets. 
* contents: (writer: CSharpWriter) => void

   A callback function that writes the contents.
### CSharpWriter.writeDelimitedCommentLines(paragraph) : this
* paragraph: string
### CSharpWriter.writeDelimitedCommentParagraph(paragraph) : this
Writes a paragraph of comments, delimited by a '\/\*' and a '\*\/', each other line starting with a '*'.
* paragraph: string
### CSharpWriter.writeDelimitedCommentParagraph(paragraph) : this
Writes a paragraph of comments, delimited by a '\/\*' and a '\*\/', each other line starting with a '*'.
* paragraph: string

   The paragraph to write.
### CSharpWriter.writeEnumeration(enumeration, options) : this
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* enumeration: Enumeration
* options: [EnumOptions](#enum-options)

   An optional EnumOptions object.
### CSharpWriter.writeEnumeration(definition) : this
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* definition: [EnumDefinition](#enum-definition)

   The enumeration definition.
### CSharpWriter.writeEnumerationBlock(enumeration, contents, options) : this
Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
This function does not write enumeration members. Use the writeEnumMember function
to write each individual member or the writeEnumeration function to write the full enumeration.
Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
This function does not write enumeration members. Use the writeEnumMember function
to write each individual member or the writeEnumeration function to write the full enumeration.
* enumeration: Enumeration
* contents: (writer: CSharpWriter) => void

   A callback function that writes the enumeration contents.
* options: [EnumOptions](#enum-options)

   An optional EnumerationOptions object.
### CSharpWriter.writeEnumerationBlock(definition, contents) : this
Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
This function does not write enumeration members. Use the writeEnumMember function
to write each individual member or the writeEnumeration function to write the full enumeration.
Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
This function does not write enumeration members. Use the writeEnumMember function
to write each individual member or the writeEnumeration function to write the full enumeration.
* definition: [EnumDefinition](#enum-definition)

   The enumeration definition.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the enumeration contents.
### CSharpWriter.writeEnumMember(definition) : this
Writes an individual enumeration member.
Writes an individual enumeration member.
* definition: [EnumMemberDefinition](#enum-member-definition)

   The enumeration member definition.
### CSharpWriter.writeEnumMember(literal, options, isLast) : this
Writes an individual enumeration member.
Writes an individual enumeration member.
* literal: EnumerationLiteral

   The EnumerationLiteral for which to write the member.
* options: [EnumMemberOptions](#enum-member-options)

   An optional EnumMemberOptions object.
* isLast: boolean

   Set to true if this is the last member of the enumeration to be written (avoidinga trailing comma). 
### CSharpWriter.writeInOutParameters(params) : this
Writes the input and output parameters of a method.
Writes the input and output parameters (all parameters except the return parameter) of a method.
* params: [ParameterDefinition](#parameter-definition)

   The parameter definitions.   
### CSharpWriter.writeInOutParameters(params, options) : this
Writes the input and output parameters of a method.
Writes the input and output parameters (all parameters except the return parameter) of a method.
* params: Parameter

   A collection of parameters.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeInterfaceBlock(definition, contents) : this
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* definition: [InterfaceDefinition](#interface-definition)

   The interface definition.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the interface contents.
### CSharpWriter.writeInterfaceBlock(iface, contents, options) : this
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: Interface

   The interface.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the interface contents.
* options: [InterfaceOptions](#interface-options)

   An optional InterfaceOptions object.
### CSharpWriter.writeInterfaceMethod(operation, options) : this
Writes a method declaration without a body.
* operation: Operation
* options: [MethodOptions](#method-options)
### CSharpWriter.writeMethodBlock(method, contents) : this
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
* method: [MethodDefinition](#method-definition)

   The operation for which to write the method.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the operation contents. This callback will not be invokedif the method is abstract.
### CSharpWriter.writeMethodBlock(operation, contents, options) : this
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
* operation: Operation

   The operation for which to write the method.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the operation contents. This callback will not be invokedif the method is abstract.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeMethodDeclaration(definition) : this
Writes a method declaration without a body. Use this function to generate interface methods.
Writes a method declaration without a body. Use this function to generate interface methods.
* definition: [MethodDefinition](#method-definition)

   The method definition.
### CSharpWriter.writeMethodDeclaration(operation, options) : this
Writes a method declaration without a body. Use this function to generate interface methods.
Writes a method declaration without a body. Use this function to generate interface methods.
* operation: Operation

   The operation for which to write the method.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeNamespaceBlock(definition, contents) : this
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
* definition: [NamespaceDefinition](#namespace-definition)

   The namespace definition. Not that an XML doc summary is not supported. 
* contents: (writer: CSharpWriter) => void

   A callback function that writes the namespace contents.
### CSharpWriter.writeNamespaceBlock(pack, contents, options) : this
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
* pack: Package

   A package or model that represents the namespace.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the namespace contents.
* options: [NamespaceOptions](#namespace-options)

   An optional NamespaceOptions object.
### CSharpWriter.writePropertyBlock(property, getterContents, setterContents) : this
Writes a property code block using optional callback functions for writing the getter and setter contents.
Writes a property code block using optional callback functions for writing the getter and setter contents.
* property: [PropertyDefinition](#property-definition)

   The property definition.
* getterContents: () => void

   An optional callback function that writes the getter code.
* setterContents: () => void

   An optional callback function that writes the setter code. 
### CSharpWriter.writePropertyBlock(property, getterContents, setterContents, options) : this
Writes a property code block using optional callback functions for writing the getter and setter contents.
Writes a property code block using optional callback functions for writing the getter and setter contents.
* property: Property

   The property.
* getterContents: () => void

   An optional callback function that writes the getter code.
* setterContents: () => void

   An optional callback function that writes the setter code.
* options: [PropertyOptions](#property-options)

   An optional PropertyOptions object.
### CSharpWriter.writeStructBlock(definition, contents) : this
Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
This function does not write struct members.
Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
This function does not write struct members.
* definition: [StructDefinition](#struct-definition)

   The struct definition.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the struct contents.
### CSharpWriter.writeStructBlock(cls, contents, options) : this
Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
This function does not write struct members.
Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
This function does not write struct members.
* cls: Type

   The struct type.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the struct contents.
* options: [StructOptions](#struct-options)

   An optional StructOptions object.
### CSharpWriter.writeUsingDirectives(values) : this
Writes 1 or more using directives, each on a new line.
* values: string

   A collection of strings, typically namespace names.
### CSharpWriter.writeXmlDocLines(lines) : this
Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
* lines: string
### CSharpWriter.writeXmlDocParagraph(paragraph) : this
Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '. 
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
* paragraph: string

   The paragraph to write.
### CSharpWriter.writeXmlDocParagraph(paragraph) : this
Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '. 
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
* paragraph: string
### CSharpWriter.writeXmlDocSummary(element) : this
Writes a <summary> XML doc tag from an array of string comments. Each comment will be written on a new line.
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
Writes a <summary> XML doc tag from a string. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
Writes a <summary> XML doc tag from the element's ownedComments. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
(default: 100 characters).
* element: Element
### CSharpWriter.writeXmlDocSummary(paragraph) : this
Writes a <summary> XML doc tag from an array of string comments. Each comment will be written on a new line.
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
Writes a <summary> XML doc tag from a string. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
Writes a <summary> XML doc tag from the element's ownedComments. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
(default: 100 characters).
* paragraph: string
### CSharpWriter.writeXmlDocSummary(paragraph) : this
Writes a <summary> XML doc tag from an array of string comments. Each comment will be written on a new line.
The output will be word-wrapped to the current maxCommentWith specified in the writer options 
(default: 100 characters).
Writes a <summary> XML doc tag from a string. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
Writes a <summary> XML doc tag from the element's ownedComments. The output will be word-wrapped to the 
current maxCommentWith specified in the writer options.
(default: 100 characters).
* paragraph: string

   A string array of comments.

## <a name="cs-reserved-keyword-transform"></a> CSReservedKeywordTransform class
Prefixes reserved C# keywords with a "@". This applies to:
- Class names
- Interface names
- Enumeration names
- Attribute names
- Operation names
- Operation parameter names

### CSReservedKeywordTransform.rename(name, target) : string
* name: string
* target: Element

## <a name="definition-base"></a> DefinitionBase interface
The base interface for all C# definitions. 

### DefinitionBase.name: string
Get or sets the name of the code element. This field is required.
### DefinitionBase.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.

## <a name="enum-definition"></a> EnumDefinition interface
Represents a C# enumeration.

### EnumDefinition.name: string
Get or sets the name of the code element. This field is required.
### EnumDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### EnumDefinition.accessModifier: any
Gets the type's access modifier. By default, no access modifier will be written.
### EnumDefinition.members: EnumMemberDefinition
Gets the enum members.

## <a name="enum-features"></a> EnumFeatures enumeration

* None
* XmlDocSummary
* Initializers

   Writes enumeration member initializers. This flag only applies when values are provided in the model.
* All

## <a name="enum-member-definition"></a> EnumMemberDefinition interface
Represents a C# enumeration member.

### EnumMemberDefinition.name: string
Get or sets the name of the code element. This field is required.
### EnumMemberDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### EnumMemberDefinition.isLast: boolean
Indicates if the member is the last member of the containing enumeration.
This value is only used to control if a delimiter is written.
### EnumMemberDefinition.value: integer
Gets the numeric value of the member. 
This field is optional. By default, no value will be written.

## <a name="enum-member-features"></a> EnumMemberFeatures enumeration

* None
* XmlDocSummary
* Initializers

   Writes enumeration member initializers. This flag only applies when values are provided in the model.
* All

## <a name="enum-member-options"></a> EnumMemberOptions interface

### EnumMemberOptions.features: EnumMemberFeatures

## <a name="enum-options"></a> EnumOptions interface

### EnumOptions.features: EnumFeatures

## <a name="interface-definition"></a> InterfaceDefinition interface
Represents a C# interface.

### InterfaceDefinition.name: string
Get or sets the name of the code element. This field is required.
### InterfaceDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### InterfaceDefinition.accessModifier: any
Gets the type's access modifier. By default, no access modifier will be written.
### InterfaceDefinition.isPartial: boolean
Indicates whether the type should be written with the 'partial' keyword. 
The default value is false.
### InterfaceDefinition.inherits: string
Contains the names of the interfaces from which the interfaces should inherit. 
This field is optional.
### InterfaceDefinition.methods: MethodDefinition
Gets the interface methods. 
### InterfaceDefinition.properties: PropertyDefinition
Gets the interface properties.

## <a name="interface-features"></a> InterfaceFeatures enumeration

* None
* XmlDocSummary
* Generalizations
* All

## <a name="interface-options"></a> InterfaceOptions interface

### InterfaceOptions.features: InterfaceFeatures
Defines the class features to write. The default is InterfaceFeatures.All.
### InterfaceOptions.inherits: string
Any additional interface names that the interface should inherit from.
### InterfaceOptions.isPartial: boolean
Indicates if the interface must be prefixed with the "partial" keyword.

## <a name="method-definition"></a> MethodDefinition interface
Represents a C# method.

### MethodDefinition.name: string
Get or sets the name of the code element. This field is required.
### MethodDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### MethodDefinition.accessModifier: any
Gets the method's access modifier. By default, no access modifier will be written.
### MethodDefinition.isAbstract: boolean
Indicates if the method should be an abstract method. This value
is ignored if the method is a static method. The default value is false.
### MethodDefinition.isConstructor: boolean
Indicates if the method is a constructor. The default value is false.
### MethodDefinition.isPartial: boolean
Indicates whether the method should be written with the 'partial' keyword. 
The default value is false.
### MethodDefinition.isStatic: boolean
Indicates if the method should be a static method. 
The default value is false.
### MethodDefinition.isVirtual: boolean
Indicates if the method should be a virtual method. This value
is ignored if the method is a static or abstract method. The default value is false.
### MethodDefinition.parameters: ParameterDefinition
Contains the method's input/output parameters.
### MethodDefinition.returnTypeName: string
The full type name of the method return type. If the method returns a collection,
the collection must be part of the name (e.g. 'List<string>'). If this value
is empty, the method will be 'void'.
### MethodDefinition.xmlDocReturns: string
Contains the documentation of the return value.

## <a name="method-features"></a> MethodFeatures enumeration

* None
* XmlDocSummary
* XmlDocParameters
* XmlDocReturns
* AccessModifier

   The access modifier if the owner is not an Interface.
* All

## <a name="method-options"></a> MethodOptions interface

### MethodOptions.collectionType: CollectionType
Sets the collection type to be generated for parameters in case they are multi-valued. The default is ICollection.
### MethodOptions.features: MethodFeatures
Sets the MethodFeatures. The default is MethodFeatures.All.
### MethodOptions.isAbstract: boolean
Indicates if the method should be made abstract. 
By default, the value of the 'Abstract' operation setting in the model is used.
### MethodOptions.isPartial: boolean
Indicates if the method must be prefixed with the "partial" keyword.
### MethodOptions.isVirtual: boolean
Indicates if the method should be made virtual. The default value is false. 

## <a name="namespace-definition"></a> NamespaceDefinition interface
Represents a C# namespace.

### NamespaceDefinition.name: string
Get or sets the name of the code element. This field is required.
### NamespaceDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.

## <a name="namespace-features"></a> NamespaceFeatures enumeration

* None
* All

## <a name="namespace-options"></a> NamespaceOptions interface

### NamespaceOptions.features: NamespaceFeatures
Defines the namespace features to write. The default is NamespaceFeatures.All.
### NamespaceOptions.writeFullName: boolean
Indicates if the fully-qualified namespace name should be written instead of only the current one.
The full name will be created from the names of the Package and it's ancestor packages.
The default value is false.

## <a name="parameter-definition"></a> ParameterDefinition interface
Represents a C# method parameter.

### ParameterDefinition.name: string
Get or sets the name of the code element. This field is required.
### ParameterDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### ParameterDefinition.defaultValue: string
Gets the default value of the parameter.
### ParameterDefinition.isNullable: boolean
Indicates if the parameter should be nullable. The caller should ensure that
the type specified by typeName is a nullable type. The default value is false.
### ParameterDefinition.isOutput: boolean
Indicates if the parameter is an output parameter. The default value is false.
### ParameterDefinition.isReference: boolean
Indicates if the parameter value should be passed by reference. The default value is false.
### ParameterDefinition.typeName: string
The full type name of the parameter. If the type is a collection,
the collection must be part of the name (e.g. 'List<string>').

## <a name="property-definition"></a> PropertyDefinition interface
Represents a C# property.

### PropertyDefinition.name: string
Get or sets the name of the code element. This field is required.
### PropertyDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### PropertyDefinition.accessModifier: any
Gets the property's access modifier. By default, no access modifier will be written.
### PropertyDefinition.defaultValue: string
The default value of the property.
### PropertyDefinition.hasGetter: boolean
Indicates if a property getter should be written. The default value is false.
### PropertyDefinition.hasSetter: boolean
Indicates if a property setter should be written. The default value is false.
### PropertyDefinition.isNullable: boolean
Indicates if the property should be nullable. The caller should ensure that
the type specified by typeName is a nullable type. The default value is false.
### PropertyDefinition.isVirtual: boolean
Indicates if the property should be a virtual property.
### PropertyDefinition.noGetter: boolean
Indicates if a property getter should be omitted. By default, a getter will be written. 
### PropertyDefinition.noSetter: boolean
Indicates if a property setter should be omitted. By default, a setter will be written.
### PropertyDefinition.typeName: string
The full type name of the property. If the type is a collection,
the collection must be part of the name (e.g. 'List<string>').

## <a name="property-features"></a> PropertyFeatures enumeration

* None
* XmlDocSummary
* AccessModifier

   The access modifier if the owner is not an Interface.
* OptionalModifier
* All

## <a name="property-options"></a> PropertyOptions interface

### PropertyOptions.collectionType: CollectionType
Sets the collection type to be generated for the property in case it is multi-valued. The default value is ICollection.
### PropertyOptions.features: PropertyFeatures
Defines the property features to write. The default is PropertyFeatures.All.
### PropertyOptions.virtual: boolean
Indicates if the property should be made virtual. The default value is false. 

## <a name="struct-definition"></a> StructDefinition interface
Represents a C# struct.

### StructDefinition.name: string
Get or sets the name of the code element. This field is required.
### StructDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### StructDefinition.accessModifier: any
Gets the type's access modifier. By default, no access modifier will be written.
### StructDefinition.isPartial: boolean
Indicates whether the type should be written with the 'partial' keyword. 
The default value is false.
### StructDefinition.implements: string
Contains the names of the interfaces that the struct should implement. 
This field is optional.
### StructDefinition.methods: MethodDefinition
Gets the struct methods. 
### StructDefinition.properties: PropertyDefinition
Gets the struct properties.

## <a name="struct-features"></a> StructFeatures enumeration

* None
* XmlDocSummary
* InterfaceRealizations
* All

## <a name="struct-options"></a> StructOptions interface

### StructOptions.features: StructFeatures
Defines the struct features to write. The default is StructFeatures.All.
### StructOptions.implements: string
Any additional interface names that the struct should implement.
### StructOptions.isPartial: boolean
Indicates if the struct must be prefixed with the "partial" keyword.

## <a name="type-definition"></a> TypeDefinition interface
The base interface for all C# type definitions, such as class- and interface
definitions.

### TypeDefinition.name: string
Get or sets the name of the code element. This field is required.
### TypeDefinition.xmlDocSummary: string
Gets the XML documentation summary of the element. Each string in this
array will be written on a new line. This field is optional.
### TypeDefinition.accessModifier: any
Gets the type's access modifier. By default, no access modifier will be written.
### TypeDefinition.isPartial: boolean
Indicates whether the type should be written with the 'partial' keyword. 
The default value is false.

## <a name="writer-options"></a> WriterOptions interface

### WriterOptions.maxCommentWidth: integer
The maximum width of generated documentation comments before they are word-wrapped.
The default value is 100 characters.
### WriterOptions.typeNameProvider: object
Sets an optional TypeNameProvider. By default, the CSharpTypeNameProvider is used.

