## Contents
* [ClassOptions](#class-options) interface
* [CollectionType](#collection-type) enumeration
* [CSharpTypeNameProvider](#c-sharp-type-name-provider) class
* [CSharpWriter](#c-sharp-writer) class
* [CSReservedKeywordTransform](#cs-reserved-keyword-transform) class
* [EnumFeatures](#enum-features) enumeration
* [EnumMemberFeatures](#enum-member-features) enumeration
* [EnumMemberOptions](#enum-member-options) interface
* [EnumOptions](#enum-options) interface
* [InterfaceFeatures](#interface-features) enumeration
* [InterfaceOptions](#interface-options) interface
* [MethodFeatures](#method-features) enumeration
* [MethodOptions](#method-options) interface
* [NamespaceFeatures](#namespace-features) enumeration
* [NamespaceOptions](#namespace-options) interface
* [PropertyFeatures](#property-features) enumeration
* [PropertyOptions](#property-options) interface
* [WriterOptions](#writer-options) interface
## <a name="class-options"></a> ClassOptions interface

### ClassOptions.features: ClassFeatures
Defines the class features to write. The default is ClassFeatures.All.
### ClassOptions.implements: string
Any additional interface names that the class should implement.
### ClassOptions.inherits: string
Any additional class names that the class should inherit from.
### ClassOptions.noPartial: boolean
Indicates if the "partial" prefix must be omitted. The default is false.

## <a name="collection-type"></a> CollectionType enumeration
Enumerates the possible collection types to generated for properties and parameters.

* ICollection
* IEnumerable
* IList

## <a name="c-sharp-type-name-provider"></a> CSharpTypeNameProvider class

### CSharpTypeNameProvider.canBeNullable(type) : boolean
* type: Type
### CSharpTypeNameProvider.getDataTypeName(typedElement) : string
* typedElement: TypedElement

## <a name="c-sharp-writer"></a> CSharpWriter class

### CSharpWriter.constructor(writer, options) : CSharpWriter
Constructor. Creates a new CSharpWriter instance using the TextWriter and options provided.
* writer: TextWriter

   The template's current TextWriter.
* options: [WriterOptions](#writer-options)

   Optional: the global options for this writer.
### CSharpWriter.createCollectionType(typeName, collectionType) : string
* typeName: string
* collectionType: [CollectionType](#collection-type)
### CSharpWriter.getAccessModifierString(visibility) : string
* visibility: VisibilityKind
### CSharpWriter.getMethodReturnType(operation, options) : string
Gets a string containing the return type of the method. If the return type cannot be determined, 
the string 'void' is returned. If the method returns a collection, a collection type is returned
based on the provided options.
* operation: Operation

   The operation.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeAccessModifier(visibilityKind) : void
Writes the visibility to the output with a trailing whitespace. If the visibilty is null or 
not supported by C#, nothing will be written.
* visibilityKind: VisibilityKind

   A VisibilityKind value. This value can be null.
### CSharpWriter.writeAutoProperty(property, options) : void
Writes an auto property with a getter and (if the property is not ReadOnly) a setter.     
This function can be used for both Classes and Interfaces. 
* property: Property
* options: [PropertyOptions](#property-options)
### CSharpWriter.writeClassBlock(cls, contents, options) : void
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
* cls: Class

   The class.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the class contents.
* options: [ClassOptions](#class-options)

   An optional ClassOptions object.
### CSharpWriter.writeClassMethodBlock(operation, contents, options) : void
Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
* operation: Operation

   The operation for which to write the method.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the operation contents.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeCodeBlock(contents) : void
Writes an indented block of code, wrapped in opening and closing brackets. 
* contents: (writer: CSharpWriter) => void

   A callback function that writes the contents.
### CSharpWriter.writeDelimitedCommentLines(lines) : void
* lines: string
### CSharpWriter.writeDelimitedCommentParagraph(text) : void
* text: string
### CSharpWriter.writeEnumeration(enumeration, options) : void
Writes a full enumeration, including members.   
* enumeration: Enumeration
* options: [EnumOptions](#enum-options)

   An optional EnumOptions object.
### CSharpWriter.writeEnumerationBlock(enumeration, contents, options) : void
Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
This function does not write enumeration members. Use the writeEnumMember function
to write each individual member or the writeEnumeration function to write the full enumeration.
* enumeration: Enumeration
* contents: (writer: CSharpWriter) => void

   A callback function that writes the enumeration contents.
* options: [EnumOptions](#enum-options)

   An optional EnumerationOptions object.
### CSharpWriter.writeEnumMember(literal, options) : void
Writes an individual enumeration member.
* literal: EnumerationLiteral

   The EnumerationLiteral for which to write the member.
* options: [EnumMemberOptions](#enum-member-options)

   An optional EnumMemberOptions object.
### CSharpWriter.writeInOutParameters(params, options) : void
Writes the input and output parameters (all parameters except the return parameter) of a method.
* params: Parameter

   A collection of parameters.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeInterfaceBlock(iface, contents, options) : void
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: Interface

   The interface.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the interface contents.
* options: [InterfaceOptions](#interface-options)

   An optional InterfaceOptions object.
### CSharpWriter.writeInterfaceMethod(operation, options) : void
Writes a method declaration without a body.
* operation: Operation

   The operation for which to write the method.
* options: [MethodOptions](#method-options)

   An optional MethodOptions object.
### CSharpWriter.writeNamespaceBlock(name, contents) : void
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
* name: string
* contents: (writer: CSharpWriter) => void
### CSharpWriter.writeNamespaceBlock(pack, contents, options) : void
Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
* pack: Package

   A package that represents the namespace.
* contents: (writer: CSharpWriter) => void

   A callback function that writes the namespace contents.
* options: [NamespaceOptions](#namespace-options)

   An optional NamespaceOptions object.
### CSharpWriter.writeUsingDirectives(values) : void
Writes 1 or more using directives, each on a new line.
* values: string

   A collection of strings, typically namespace names.
### CSharpWriter.writeXmlDocLines(lines) : void
* lines: string
### CSharpWriter.writeXmlDocParagraph(text) : void
* text: string
### CSharpWriter.writeXmlDocParameters(element) : void
* element: Operation
### CSharpWriter.writeXmlDocReturns(element) : void
* element: Operation
### CSharpWriter.writeXmlDocSummary(comments) : void
* comments: Comment
### CSharpWriter.writeXmlDocSummary(text) : void
* text: string

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

## <a name="enum-features"></a> EnumFeatures enumeration

* None
* XmlDocSummary
* Initializers

   Writes enumeration member initializers. This flag only applies when values are provided in the model.
* All
* AllExceptXmlDocs

## <a name="enum-member-features"></a> EnumMemberFeatures enumeration

* None
* XmlDocSummary
* Initializers

   Writes enumeration member initializers. This flag only applies when values are provided in the model.
* All
* AllExceptXmlDocs

## <a name="enum-member-options"></a> EnumMemberOptions interface

### EnumMemberOptions.features: EnumMemberFeatures

## <a name="enum-options"></a> EnumOptions interface

### EnumOptions.features: EnumFeatures

## <a name="interface-features"></a> InterfaceFeatures enumeration

* None
* XmlDocSummary
* Generalizations
* All
* AllExceptXmlDocs

## <a name="interface-options"></a> InterfaceOptions interface

### InterfaceOptions.features: InterfaceFeatures
Defines the class features to write. The default is InterfaceFeatures.All.
### InterfaceOptions.inherits: string
Any additional interface names that the interface should inherit from.
### InterfaceOptions.noPartial: boolean
Indicates if the "partial" prefix must be omitted. The default is false.

## <a name="method-features"></a> MethodFeatures enumeration

* None
* XmlDocSummary
* XmlDocParameters
* XmlDocReturns
* AccessModifier

   The access modifier if the owner is not an Interface.
* All
* AllExceptXmlDocs

## <a name="method-options"></a> MethodOptions interface

### MethodOptions.collectionType: CollectionType
Sets the collection type to be generated for parameters in case they are multi-valued. The default is ICollection.
### MethodOptions.features: MethodFeatures
Sets the MethodFeatures. The default is MethodFeatures.All.
### MethodOptions.virtual: boolean
Indicates if the method should be made virtual. The default value is false. 

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

## <a name="property-features"></a> PropertyFeatures enumeration

* None
* XmlDocSummary
* AccessModifier

   The access modifier if the owner is not an Interface.
* OptionalModifier
* All
* AllExceptXmlDocs

## <a name="property-options"></a> PropertyOptions interface

### PropertyOptions.collectionType: CollectionType
Sets the collection type to be generated for the property in case it is multi-valued. The default value is ICollection.
### PropertyOptions.features: PropertyFeatures
Defines the property features to write. The default is PropertyFeatures.All.
### PropertyOptions.virtual: boolean
Indicates if the property should be made virtual. The default value is false. 

## <a name="writer-options"></a> WriterOptions interface

### WriterOptions.maxCommentWidth: integer
The maximum width of generated documentation comments before they are word-wrapped.
The default value is 100 characters.
### WriterOptions.typeNameProvider: TypeNameProvider
Sets an optional TypeNameProvider. By default, the CSharpTypeNameProvider is used.

