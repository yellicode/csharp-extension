import * as elements from '@yellicode/elements';
import * as opts from './options';
import { CodeWriter, TextWriter } from '@yellicode/core';
import { CSharpTypeNameProvider } from './csharp-type-name-provider';
import { CSharpCommentWriter } from './comment-writer';
import { XmlDocUtility } from './xml-doc-utility';
import { DefinitionBuilder } from './definition-builder';
import { NamespaceDefinition, ClassDefinition, AccessModifier, InterfaceDefinition, EnumDefinition, EnumMemberDefinition, MethodDefinition, ParameterDefinition, PropertyDefinition, StructDefinition } from './model';

/**
 * A CodeWriter for writing C# code from code generation templates. This writer can write classes, interfaces, structs and enumerations and also
 * contains functions for writing namespace blocks and using directives. The CSharpWriter is compatible with Yellicode models but can also work
 * independently.
 */
export class CSharpWriter extends CodeWriter {
    private typeNameProvider: CSharpTypeNameProvider;
    private definitionBuilder: DefinitionBuilder;
    private commentWriter: CSharpCommentWriter;

    /**
     * Constructor. Creates a new CSharpWriter instance using the TextWriter and options provided.
     * @param writer The template's current TextWriter.
     * @param options Optional: the global options for this writer.
     */
    constructor(writer: TextWriter, options?: opts.WriterOptions) {
        super(writer);
        if (!options) options = {};

        this.typeNameProvider = options.typeNameProvider || new CSharpTypeNameProvider(options.nullableReferenceTypes);
        this.definitionBuilder = new DefinitionBuilder(this.typeNameProvider);
        this.commentWriter = new CSharpCommentWriter(writer, options.maxCommentWidth || 100);
    }

    /**
     * Writes 1 or more using directives, each on a new line.
     * @param values A collection of strings, typically namespace names.
     */
    public writeUsingDirectives(...values: string[]): this {
        values.forEach(v => {
            this.writeLine(`using ${v};`);
        });
        return this;
    }

    /**
     * Writes an indented block of code, wrapped in opening and closing brackets.
     * @param contents A callback function that writes the contents.
     */
    public writeCodeBlock(contents: (writer: CSharpWriter) => void): this {
        this.writeLine('{');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
        return this;
    };

    /**
     * Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets.
     * @param definition The namespace definition. Not that an XML doc summary is not supported.
     * @param contents A callback function that writes the namespace contents.
     */
    public writeNamespaceBlock(definition: NamespaceDefinition, contents: (writer: CSharpWriter) => void): this;
    /**
     * Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets.
     * @param pack A package or model that represents the namespace.
     * @param contents A callback function that writes the namespace contents.
     * @param options An optional NamespaceOptions object.
     */
    public writeNamespaceBlock(pack: elements.Package, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): this;
    public writeNamespaceBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): this {
        if (!data) return this;

        const definition: NamespaceDefinition = (elements.isPackage(data)) ?
            this.definitionBuilder.buildNamespaceDefinition(data, options) :
            data;

        this.writeLine(`namespace ${definition.name}`);
        this.writeCodeBlock(contents);
        return this;
    };

    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
     * This function does not write class members.
     * @param definition The class definition.
     * @param contents A callback function that writes the class contents.
     */
    public writeClassBlock(definition: ClassDefinition, contents: (writer: CSharpWriter) => void): this;
    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    public writeClassBlock(cls: elements.Class, contents: (writer: CSharpWriter) => void, options?: opts.ClassOptions): this;
    public writeClassBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.ClassOptions): this {
        if (!data) return this;

        const definition: ClassDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildClassDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.writeAccessModifier(definition);
        if (definition.isStatic) {
            this.write('static ');
        }
        else if (definition.isAbstract) { // note that static classes cannot be abstract, hence the else-statement
            this.write('abstract ');
        }
        else if (definition.isSealed) {
            this.write('sealed ');
        }
        if (definition.isPartial) {
            this.write('partial ');
        }
        this.write(`class ${definition.name}`);
        let hasGeneralizations = false;
        hasGeneralizations = this.writeInherits(definition.inherits);
        this.writeImplements(hasGeneralizations, definition.implements);
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
        return this;
    }

    /**
    * Writes a block of code, wrapped in a struct declaration and opening and closing brackets.
    * This function does not write struct members.
    * @param definition The struct definition.
    * @param contents A callback function that writes the struct contents.
    */
    public writeStructBlock(definition: StructDefinition, contents: (writer: CSharpWriter) => void): this;
    /**
     * Writes a block of code, wrapped in a struct declaration and opening and closing brackets.
     * This function does not write struct members.
     * @param cls The struct type.
     * @param contents A callback function that writes the struct contents.
     * @param options An optional StructOptions object.
     */
    public writeStructBlock(cls: elements.Type, contents: (writer: CSharpWriter) => void, options?: opts.StructOptions): this;
    public writeStructBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.StructOptions): this {
        if (!data) return this;

        const definition: StructDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildStructDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.writeAccessModifier(definition);
        if (definition.isPartial) {
            this.write('partial ');
        }
        this.write(`struct ${definition.name}`);
        this.writeImplements(false, definition.implements);
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
        return this;
    }

    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets.
     * This function does not write interface members.
     * @param definition The interface definition.
     * @param contents  A callback function that writes the interface contents.
     */
    public writeInterfaceBlock(definition: InterfaceDefinition, contents: (writer: CSharpWriter) => void): this;
    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets.
     * This function does not write interface members.
     * @param iface The interface.
     * @param contents A callback function that writes the interface contents.
     * @param options An optional InterfaceOptions object.
     */
    public writeInterfaceBlock(iface: elements.Interface, contents: (writer: CSharpWriter) => void, options?: opts.InterfaceOptions): this;
    public writeInterfaceBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.InterfaceOptions): this {
        if (!data) return this;

        const definition: InterfaceDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildInterfaceDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.writeAccessModifier(definition);
        if (definition.isPartial) {
            this.write('partial ');
        }
        this.write(`interface ${definition.name}`);
        this.writeInherits(definition.inherits);
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
        return this;
    }

    /**
     * Writes a block of code, wrapped in an enum declaration and opening and closing brackets.
     * This function does not write enumeration members. Use the writeEnumMember function
     * to write each individual member or the writeEnumeration function to write the full enumeration.
     * @param definition The enumeration definition.
     * @param contents A callback function that writes the enumeration contents.
     */
    public writeEnumerationBlock(definition: EnumDefinition, contents: (writer: CSharpWriter) => void): this
    /**
    * Writes a block of code, wrapped in an enum declaration and opening and closing brackets.
    * This function does not write enumeration members. Use the writeEnumMember function
    * to write each individual member or the writeEnumeration function to write the full enumeration.
    * @param element The enumeration.
    * @param contents A callback function that writes the enumeration contents.
    * @param options An optional EnumerationOptions object.
    */
    public writeEnumerationBlock(enumeration: elements.Enumeration, contents: (writer: CSharpWriter) => void, options?: opts.EnumOptions): this
    public writeEnumerationBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.EnumOptions): this {
        if (!data) return this;

        const definition: EnumDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildEnumDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.writeAccessModifier(definition);
        this.write(`enum ${definition.name}`);
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
        return this;
    }

    /**
     *  Writes a full enumeration, including members.
     * @param definition The enumeration definition.
     */
    public writeEnumeration(definition: EnumDefinition): this;
    /**
     * Writes a full enumeration, including members.
     * @param element The enumeration.
     * @param options An optional EnumOptions object.
     */
    public writeEnumeration(enumeration: elements.Enumeration, options?: opts.EnumOptions): this
    public writeEnumeration(data: any, options?: opts.EnumOptions): this {
        if (!data) return this;

        const definition: EnumDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildEnumDefinition(data, options) :
            data;

        this.writeEnumerationBlock(definition, () => {
            if (definition.members) {
                definition.members.forEach(memberDefinition => {
                    this.writeEnumMember(memberDefinition);
                })
            }
        });
        return this;
    }

    /**
     * Writes an individual enumeration member.
     * @param definition The enumeration member definition.
     */
    public writeEnumMember(definition: EnumMemberDefinition): this
    /**
     * Writes an individual enumeration member.
     * @param literal The EnumerationLiteral for which to write the member.
     * @param options An optional EnumMemberOptions object.
     * @param isLast Set to true if this is the last member of the enumeration to be written (avoiding
     * a trailing comma).
     */
    public writeEnumMember(literal: elements.EnumerationLiteral, options?: opts.EnumMemberOptions, isLast?: boolean): this
    public writeEnumMember(data: any, options?: opts.EnumMemberOptions, isLast?: boolean): this {
        if (!data) return this;

        const definition: EnumMemberDefinition = (elements.isEnumerationLiteral(data)) ?
            this.definitionBuilder.buildEnumMemberDefinition(data, isLast, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.write(definition.name);
        if (definition.value != null) { // using '!=' on purpose
            this.write(` = ${definition.value}`);
        }
        if (!definition.isLast) {
            this.write(',');
        }
        this.writeEndOfLine();
        return this;
    }

    /**
     * Writes a method declaration without a body. Use this function to generate interface methods.
     * @param definition The method definition.
     */
    public writeMethodDeclaration(definition: MethodDefinition): this
    /**
   * Writes a method declaration without a body. Use this function to generate interface methods.
   * @param operation The operation for which to write the method.
   * @param options An optional MethodOptions object.
   */
    public writeMethodDeclaration(operation: elements.Operation, options?: opts.MethodOptions): this
    public writeMethodDeclaration(data: any, options?: opts.MethodOptions): this {
        if (!data) return this;

        const definition: MethodDefinition = (elements.isOperation(data)) ?
            this.definitionBuilder.buildMethodDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        if (definition.parameters) {
            this.writeXmlDocParagraph(XmlDocUtility.getXmlDocLinesForInOutParameters(definition.parameters));
        }

        const xmlDocReturns = XmlDocUtility.getXmlDocLineForReturnParameter(definition);
        if (xmlDocReturns) {
            this.writeXmlDocParagraph([xmlDocReturns]);
        }

        this.writeIndent();

        if (!definition.isPartial) {
            this.writeAccessModifier(definition); // Partial methods are implicitly private
        }

        if (definition.isStatic) {
            this.write('static ');
        }
        else if (definition.isAbstract) {
            this.write('abstract ');
        }
        else if (definition.isVirtual) {
            this.write('virtual ');
        }
        if (definition.isPartial) {
            this.write('partial ');
        }

        if (definition.isPartial) this.write('void '); // partial methods must return void, intentional trailing white space
        else this.write(`${definition.returnTypeName || 'void'} `); // intentional trailing white space

        this.write(`${definition.name}(`);
        if (definition.parameters) {
            this.writeInOutParameters(definition.parameters);
        }
        this.write(');');
        this.writeEndOfLine();
        return this;
    }

    /**
    * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets.
    * @param method The operation for which to write the method.
    * @param contents A callback function that writes the operation contents. This callback will not be invoked
    * if the method is abstract.
     */
    public writeMethodBlock(method: MethodDefinition, contents: (writer: CSharpWriter) => void): this
    /**
    * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets.
    * @param operation The operation for which to write the method.
    * @param contents A callback function that writes the operation contents. This callback will not be invoked
    * if the method is abstract.
    * @param options An optional MethodOptions object.
    */
    public writeMethodBlock(operation: elements.Operation, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): this
    public writeMethodBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): this {
        if (!data) return this;

        const definition: MethodDefinition = (elements.isOperation(data)) ?
            this.definitionBuilder.buildMethodDefinition(data, options) :
            data;

        // Write the documentation
        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        if (definition.parameters) {
            this.writeXmlDocParagraph(XmlDocUtility.getXmlDocLinesForInOutParameters(definition.parameters));
        }

        const xmlDocReturns = definition.isConstructor ? null : XmlDocUtility.getXmlDocLineForReturnParameter(definition);
        if (xmlDocReturns) {
            this.writeXmlDocParagraph([xmlDocReturns]);
        }

        // Start of the actual method
        this.writeIndent();
        if (!definition.isPartial) {
            this.writeAccessModifier(definition); // Partial methods are implicitly private
        }

        if (definition.isStatic) {
            this.write('static ');
        }
        else if (definition.isAbstract) {
            this.write('abstract ');
        }
        else if (definition.isVirtual) {
            this.write('virtual ');
        }
        if (definition.isPartial) {
            this.write('partial ');
        }
        // Write the return type
        if (!definition.isConstructor) {
            if (definition.isPartial) this.write('void '); // partial methods must return void, intentional trailing white space
            else this.write(`${definition.returnTypeName || 'void'} `); // intentional trailing white space
        }
        this.write(`${definition.name}(`);
        if (definition.parameters) {
            this.writeInOutParameters(definition.parameters);
        }
        this.write(')');
        if (definition.isAbstract) {
            this.writeEndOfLine(';');
        }
        else {
            this.writeEndOfLine();
            this.writeCodeBlock(contents);
        }
        return this;
    }

    /**
     * Writes the input and output parameters of a method.
     * @param params The parameter definitions.
     */
    public writeInOutParameters(params: ParameterDefinition[]): this
    /**
   * Writes the input and output parameters (all parameters except the return parameter) of a method.
   * @param params A collection of parameters.
   * @param options An optional MethodOptions object.
   */
    public writeInOutParameters(params: elements.Parameter[], options?: opts.MethodOptions): this
    public writeInOutParameters(data: any, options?: opts.MethodOptions): this {
        if (!data || !data.length) // without at least 1 element, we cannot determine the type
            return this;

        const definitions: ParameterDefinition[] = elements.isParameter(data[0] as any) ?
            this.definitionBuilder.buildParameterDefinitions(data as elements.Parameter[], options) : data;

        if (!definitions.length)
            return this;

        let i = 0;
        definitions.forEach(p => {
            if (i > 0) {
                this.write(', ');
            }
            if (p.isOutput) {
                this.write('out ');
            }
            else if (p.isReference) {
                this.write('ref '); // The ref keyword can be used for both value- and reference types
            }
            this.write(p.typeName);
            if (p.isNullable) {
                this.write('?');
            }
            this.write(` ${p.name}`);
            if (p.defaultValue) {
                this.write(` = ${p.defaultValue}`);
            }
            i++;
        });
        return this;
    }

    /**
     * Writes an auto property with a getter and a setter.
     * @param property The property definition.
     */
    public writeAutoProperty(property: PropertyDefinition): this;
    /**
    * Writes an auto property with a getter and - if the property is not ReadOnly or Derived - a setter.
    * This function can be used for both Class- and and Interface properties.
    */
    public writeAutoProperty(property: elements.Property, options?: opts.PropertyOptions): this;
    public writeAutoProperty(data: any, options?: opts.PropertyOptions): this {
        if (!data) return this;

        const definition: PropertyDefinition = (elements.isProperty(data)) ?
            this.definitionBuilder.buildPropertyDefinition(data, options) :
            data;

        if (definition.hasGetter != null) {
            console.warn('PropertyDefinition.hasGetter is deprecated. A getter is now written by default. Please use noGetter if you want to omit it.');
        }
        if (definition.hasSetter != null) {
            console.warn('PropertyDefinition.hasSetter is deprecated. A setter is now written by default. Please use noSetter if you want to omit it.');
        }

        this.writePropertyStart(definition);
        this.write(' { ');
        if (!definition.noGetter) this.write('get;');
        if (!definition.noSetter) {
            if (!definition.noGetter) this.write(' ');
            this.write('set;');
        };
        this.write(' }');
        if (definition.defaultValue !== undefined) {
            this.write(` = ${definition.defaultValue};`);
        }
        this.writeEndOfLine();
        return this;
    }

    /**
     *  Writes a property code block using optional callback functions for writing the getter and setter contents.
     * @param property The property definition.
     * @param getterContents An optional callback function that writes the getter code.
     * @param setterContents An optional callback function that writes the setter code.
     */
    public writePropertyBlock(property: PropertyDefinition, getterContents: () => void | null, setterContents: () => void | null): this
    /**
    *  Writes a property code block using optional callback functions for writing the getter and setter contents.
    * @param property The property.
    * @param getterContents An optional callback function that writes the getter code.
    * @param setterContents An optional callback function that writes the setter code.
    * @param options An optional PropertyOptions object.
    */
    public writePropertyBlock(property: elements.Property, getterContents: () => void | null, setterContents: () => void | null, options?: opts.PropertyOptions): this
    public writePropertyBlock(data: any, getterContents: () => void | null, setterContents: () => void | null, options?: opts.PropertyOptions): this {
        if (!data) return this;

        const definition: PropertyDefinition = (elements.isProperty(data)) ?
            this.definitionBuilder.buildPropertyDefinition(data, options) :
            data;

        this.writePropertyStart(definition);
        this.writeEndOfLine();
        this.writeCodeBlock(() => {
            if (getterContents) {
                this.writeLine('get')
                this.writeCodeBlock(getterContents);
            }
            if (setterContents) {
                this.writeLine('set')
                this.writeCodeBlock(setterContents);
            }
        });
        return this;
    }

    private writePropertyStart(definition: PropertyDefinition): void {
        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        // Start a new, indented line
        this.writeIndent();
        // Access modifier
        this.writeAccessModifier(definition);
        // Virtual
        if (definition.isVirtual) {
            this.write('virtual ');
        }
        // Type
        this.write(definition.typeName);
        if (definition.isNullable) {
            this.write('?');
        }
        // Name
        this.write(` ${definition.name}`);
    }

    /**
    * Writes the type's access modifier to the output with a trailing whitespace.
    * @param definition The type definition.
    */
    public writeAccessModifier(definition: { accessModifier?: AccessModifier }): this;
    /**
    * Writes the visibility to the output with a trailing whitespace. If the visibilty is null or
    * not supported by C#, nothing will be written.
    * @param visibilityKind A VisibilityKind value. This value can be null.
    */
    public writeAccessModifier(visibilityKind: elements.VisibilityKind | null): this;
    public writeAccessModifier(data: any | null): this {
        if (!data) return this;

        const accessModifier: AccessModifier | undefined = (typeof data == 'number') ?
            DefinitionBuilder.getAccessModifierString(data as elements.VisibilityKind) : // VisibilityKind
            data.accessModifier // TypeDefinition

        if (!accessModifier)
            return this;

        this.write(accessModifier);
        this.writeWhiteSpace();
        return this;
    }

    /**
     * Gets the name of the type. This function uses the current typeNameProvider for resolving
     * the type name.
     * @param type Any element that derives from Type.
     */
    public getTypeName(type: elements.Type | null): string | null;
    /**
    * Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
    * the type name.
    * @param typedElement Any element that has a type, such as a Property or Parameter.
    */
    public getTypeName(typedElement: elements.TypedElement | null): string | null;
    public getTypeName(element: any | null): string | null {
        if (!element)
            return null;

        return this.typeNameProvider.getTypeName(element);
    }

    // #region deprecated

    /**
     * Writes a method declaration without a body.
     * @deprecated Use the writeMethodDeclaration() function instead.
     */
    public writeInterfaceMethod(operation: elements.Operation, options?: opts.MethodOptions): this {
        console.warn('writeInterfaceMethod is deprecated. Use the writeMethodDeclaration() function instead. ');
        this.writeMethodDeclaration(operation, options);
        return this;
    }

    /**
     * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets.
     * @deprecated Use the writeMethodBlock() function instead.
     */
    public writeClassMethodBlock(operation: elements.Operation, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): this {
        console.warn('writeClassMethodBlock is deprecated. Use the writeMethodBlock() function instead. ');
        this.writeMethodBlock(operation, contents, options);
        return this;

    }
    // #endregion deprecated

    //#region Xml Docs

    /**
     * Writes a <summary> XML doc tag from an array of string comments. Each comment will be written on a new line.
     * The output will be word-wrapped to the current maxCommentWith specified in the writer options
     * (default: 100 characters).
     * @param paragraph A string array of comments.
     */
    public writeXmlDocSummary(paragraph: string[]): this;
    /**
     * Writes a <summary> XML doc tag from a string. The output will be word-wrapped to the
     * current maxCommentWith specified in the writer options.
     * @param comments The paragraph to write.
     */
    public writeXmlDocSummary(paragraph: string): this;
    /**
     * Writes a <summary> XML doc tag from the element's ownedComments. The output will be word-wrapped to the
     * current maxCommentWith specified in the writer options.
     * (default: 100 characters).
     * @param comments Any Yellicode model element.
     */
    public writeXmlDocSummary(element: elements.Element): this;
    public writeXmlDocSummary(data: any): this {
        if (elements.isNamedElement(data)) { // we have no isElement check, but this will do
            data = DefinitionBuilder.buildXmlDocSummary(data);
        }

        if (!data) return this;

        const array: string[] = [];
        array.push('<summary>')
        if (typeof data == 'string') {
            // string
            array.push(data);
        } else {
            // string[]
            array.push(...data);
        }
        array.push('</summary>')
        this.commentWriter.writeCommentLines(array, '/// ');
        return this;
    }

    /**
     * Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
     * The output will be word-wrapped to the current maxCommentWith specified in the writer options
     * (default: 100 characters).
     * @param line The paragraph to write.
     */
    public writeXmlDocParagraph(paragraph: string[]): this;
      /**
     * Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
     * The output will be word-wrapped to the current maxCommentWith specified in the writer options
     * (default: 100 characters).
     * @param paragraph The paragraph to write.
     */
    public writeXmlDocParagraph(paragraph: string): this;
    public writeXmlDocParagraph(data: any): this {
        if (data == null) return this;
        let lines: string[];

        if (typeof data == 'string') {
            lines = [data];
        }
        else lines = data;
        this.commentWriter.writeCommentLines(lines, '/// ');
        return this;
    }

    /**
     * Writes a paragraph of xml doc comments, each line starting with forward slashes '/// '.
     * @param lines
     * @deprecated Please use writeXmlDocParagraph instead.
     */
    public writeXmlDocLines(lines: string[]): this {
        console.warn('writeXmlDocLines is deprecated. Use the writeXmlDocParagraph() function instead.');

        if (lines == null) return this;
        this.commentWriter.writeCommentLines(lines, '/// ');
        return this;
    }

    /**
     * Writes a paragraph of comments, delimited by a '\/\*' and a '\*\/', each other line starting with a '*'.
     * @param paragraph The paragraph to write.
     */
    public writeDelimitedCommentParagraph(paragraph: string): this;
    public writeDelimitedCommentParagraph(paragraph: string[]): this;
    public writeDelimitedCommentParagraph(data: string | string[]): this {
        if (typeof data == 'string') {
            this.commentWriter.writeDelimitedCommentParagraph(data);
        }
        else this.commentWriter.writeDelimitedCommentLines(data);

        return this;
    }

    public writeDelimitedCommentLines(paragraph: string[]): this {
        console.warn('writeDelimitedCommentLines is deprecated. Use the writeDelimitedCommentParagraph() function instead.');
        this.commentWriter.writeDelimitedCommentLines(paragraph);
        return this;
    }

    //#endregion Xml Docs

    private joinWrite<TItem>(collection: TItem[], separator: string, getStringFunc: (item: TItem) => string | null) {
        let isFirst: boolean = true;
        collection.forEach(c => {
            const value = getStringFunc(c);
            if (!value) return;
            if (isFirst) {
                isFirst = false;
            }
            else this.write(separator);
            this.write(value);
        });
    }

    private writeInherits(inherits?: string[]): boolean {
        if (!inherits || !inherits.length)
            return false;

        this.write(' : ');
        this.joinWrite(inherits, ', ', name => name);
        return true;
    }

    private writeImplements(hasGeneralizations: boolean, impl?: string[]): boolean {
        if (!impl || !impl.length)
            return false;

        this.write(hasGeneralizations ? ', ' : ' : ');
        this.joinWrite(impl, ', ', name => name);
        return true;
    }


}