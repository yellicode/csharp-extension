import * as elements from '@yellicode/elements';
import * as opts from './options';
import { CodeWriter, TextWriter, TypeNameProvider } from '@yellicode/templating';
import { CSharpTypeNameProvider } from './csharp-type-name-provider';
import { CSharpCommentWriter } from './comment-writer';
import { XmlDocUtility } from './xml-doc-utility';
import { DefinitionBuilder } from './definition-builder';
import { NamespaceDefinition, ClassDefinition, AccessModifier, InterfaceDefinition, EnumDefinition, EnumMemberDefinition, MethodDefinition, ParameterDefinition, PropertyDefinition, StructDefinition } from './model';

export class CSharpWriter extends CodeWriter {
    private typeNameProvider: TypeNameProvider;
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

        this.typeNameProvider = options.typeNameProvider || new CSharpTypeNameProvider();
        this.definitionBuilder = new DefinitionBuilder(this.typeNameProvider);
        this.commentWriter = new CSharpCommentWriter(writer, this.typeNameProvider, options.maxCommentWidth || 100);
    }

    /**
     * Writes 1 or more using directives, each on a new line.
     * @param values A collection of strings, typically namespace names.
     */
    public writeUsingDirectives(...values: string[]): void {
        values.forEach(v => {
            this.writeLine(`using ${v};`);
        });
    }

    /**
     * Writes an indented block of code, wrapped in opening and closing brackets. 
     * @param contents A callback function that writes the contents.
     */
    public writeCodeBlock(contents: (writer: CSharpWriter) => void): void {
        this.writeLine('{');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    };

    /**
     * Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
     * @param definition The namespace definition. Not that an XML doc summary is not supported. 
     * @param contents A callback function that writes the namespace contents.
     */
    public writeNamespaceBlock(definition: NamespaceDefinition, contents: (writer: CSharpWriter) => void): void;
    /**
     * Writes an indented block of code, wrapped in a namespace declaration and opening and closing brackets. 
     * @param pack A package or model that represents the namespace.
     * @param contents A callback function that writes the namespace contents.
     * @param options An optional NamespaceOptions object.
     */
    public writeNamespaceBlock(pack: elements.Package, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): void;  
    public writeNamespaceBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): void {
        if (!data) return;

        const definition: NamespaceDefinition = (elements.isPackage(data)) ? 
            this.definitionBuilder.buildNamespaceDefinition(data, options) :
            data;

        this.writeLine(`namespace ${definition.name}`);
        this.writeCodeBlock(contents);
    };

    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
     * This function does not write class members.
     * @param definition The class definition.
     * @param contents A callback function that writes the class contents.
     */
    public writeClassBlock(definition: ClassDefinition, contents: (writer: CSharpWriter) => void): void; 
      /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    public writeClassBlock(cls: elements.Class, contents: (writer: CSharpWriter) => void, options?: opts.ClassOptions): void; 
    public writeClassBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.ClassOptions): void {
        if (!data) return;

        const definition: ClassDefinition = (elements.isType(data)) ?
            this.definitionBuilder.buildClassDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        this.writeIndent();
        this.writeAccessModifier(definition);
        if (definition.isAbstract) {
            this.write('abstract ');
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
    }

     /**
     * Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
     * This function does not write struct members.
     * @param definition The struct definition.
     * @param contents A callback function that writes the struct contents.
     */
    public writeStructBlock(definition: StructDefinition, contents: (writer: CSharpWriter) => void): void; 
      /**
     * Writes a block of code, wrapped in a struct declaration and opening and closing brackets. 
     * This function does not write struct members.
     * @param cls The struct type.
     * @param contents A callback function that writes the struct contents.
     * @param options An optional StructOptions object.
     */
    public writeStructBlock(cls: elements.Type, contents: (writer: CSharpWriter) => void, options?: opts.StructOptions): void; 
    public writeStructBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.StructOptions): void {
        if (!data) return;

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
    }

    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
     * This function does not write interface members.
     * @param definition The interface definition.
     * @param contents  A callback function that writes the interface contents.
     */
    public writeInterfaceBlock(definition: InterfaceDefinition, contents: (writer: CSharpWriter) => void): void;
    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
     * This function does not write interface members.
     * @param iface The interface.
     * @param contents A callback function that writes the interface contents.
     * @param options An optional InterfaceOptions object.
     */
    public writeInterfaceBlock(iface: elements.Interface, contents: (writer: CSharpWriter) => void, options?: opts.InterfaceOptions): void;
    public writeInterfaceBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.InterfaceOptions): void {
        if (!data) return;

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
    }
  
    /**
     * Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
     * This function does not write enumeration members. Use the writeEnumMember function
     * to write each individual member or the writeEnumeration function to write the full enumeration.
     * @param definition The enumeration definition.
     * @param contents A callback function that writes the enumeration contents.
     */
    public writeEnumerationBlock(definition: EnumDefinition, contents: (writer: CSharpWriter) => void): void
    /**
    * Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
    * This function does not write enumeration members. Use the writeEnumMember function
    * to write each individual member or the writeEnumeration function to write the full enumeration.
    * @param element The enumeration.
    * @param contents A callback function that writes the enumeration contents.
    * @param options An optional EnumerationOptions object.
    */
    public writeEnumerationBlock(enumeration: elements.Enumeration, contents: (writer: CSharpWriter) => void, options?: opts.EnumOptions): void
    public writeEnumerationBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.EnumOptions): void {
        if (!data) return;

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
    }

    /**
     *  Writes a full enumeration, including members.   
     * @param definition The enumeration definition.
     */
    public writeEnumeration(definition: EnumDefinition): void;
    /**
     * Writes a full enumeration, including members.   
     * @param element The enumeration.     
     * @param options An optional EnumOptions object.
     */
    public writeEnumeration(enumeration: elements.Enumeration, options?: opts.EnumOptions): void
    public writeEnumeration(data: any, options?: opts.EnumOptions): void {
        if (!data) return;

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
    }

    /**
     * Writes an individual enumeration member.
     * @param definition The enumeration member definition.
     */
    public writeEnumMember(definition: EnumMemberDefinition): void
    /**
     * Writes an individual enumeration member.
     * @param literal The EnumerationLiteral for which to write the member.
     * @param options An optional EnumMemberOptions object.
     * @param isLast Set to true if this is the last member of the enumeration to be written (avoiding
     * a trailing comma). 
     */ 
    public writeEnumMember(literal: elements.EnumerationLiteral, options?: opts.EnumMemberOptions, isLast?: boolean): void
    public writeEnumMember(data: any, options?: opts.EnumMemberOptions, isLast?: boolean): void {
        if (!data) return;

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
    }

    /**
     * Writes a method declaration without a body. Use this function to generate interface methods.
     * @param definition The method definition.
     */
    public writeMethodDeclaration(definition: MethodDefinition): void 
     /**
    * Writes a method declaration without a body. Use this function to generate interface methods.
    * @param operation The operation for which to write the method.
    * @param options An optional MethodOptions object.
    */
    public writeMethodDeclaration(operation: elements.Operation, options?: opts.MethodOptions): void 
    public writeMethodDeclaration(data: any, options?: opts.MethodOptions): void {
        if (!data) return;
      
        const definition: MethodDefinition = (elements.isOperation(data)) ?
            this.definitionBuilder.buildMethodDefinition(data, options) :
            data;

        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        if (definition.parameters) {
            this.writeXmlDocLines(XmlDocUtility.getXmlDocLinesForInOutParameters(definition.parameters));
        }                
     
        const xmlDocReturns = XmlDocUtility.getXmlDocLineForReturnParameter(definition);
        if (xmlDocReturns) {
            this.writeXmlDocLines([xmlDocReturns]);
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
    }
    
    /**
    * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
    * @param method The operation for which to write the method.
    * @param contents A callback function that writes the operation contents. This callback will not be invoked
    * if the method is abstract.
     */
    public writeMethodBlock(method: MethodDefinition, contents: (writer: CSharpWriter) => void): void
    /**
    * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
    * @param operation The operation for which to write the method.
    * @param contents A callback function that writes the operation contents. This callback will not be invoked
    * if the method is abstract.
    * @param options An optional MethodOptions object.
    */
    public writeMethodBlock(operation: elements.Operation, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): void
    public writeMethodBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): void {
        if (!data) return;
      
        const definition: MethodDefinition = (elements.isOperation(data)) ?
            this.definitionBuilder.buildMethodDefinition(data, options) :
            data;

        // Write the documentation
        if (definition.xmlDocSummary) {
            this.writeXmlDocSummary(definition.xmlDocSummary);
        }

        if (definition.parameters) {            
            this.writeXmlDocLines(XmlDocUtility.getXmlDocLinesForInOutParameters(definition.parameters));
        }                
     
        const xmlDocReturns = definition.isConstructor ? null : XmlDocUtility.getXmlDocLineForReturnParameter(definition);
        if (xmlDocReturns) {
            this.writeXmlDocLines([xmlDocReturns]);
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
    }
    
    /**
     * Writes the input and output parameters of a method.
     * @param params The parameter definitions.   
     */
    public writeInOutParameters(params: ParameterDefinition[]): void
      /**
     * Writes the input and output parameters (all parameters except the return parameter) of a method.
     * @param params A collection of parameters.
     * @param options An optional MethodOptions object.
     */
    public writeInOutParameters(params: elements.Parameter[], options?: opts.MethodOptions): void
    public writeInOutParameters(data: any, options?: opts.MethodOptions): void {
        if (!data || !data.length) // without at least 1 element, we cannot determine the type
            return;

        const definitions: ParameterDefinition[] = elements.isParameter(data[0] as any) ? 
            this.definitionBuilder.buildParameterDefinitions(data as elements.Parameter[]) : data;

        if (!definitions.length) 
            return;

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
            i++;
        });
    }

    /**
     * Writes an auto property with a getter and a setter. 
     * @param property The property definition.
     */
    public writeAutoProperty(property: PropertyDefinition): void;
     /**
     * Writes an auto property with a getter and - if the property is not ReadOnly or Derived - a setter.     
     * This function can be used for both Class- and and Interface properties. 
     */
    public writeAutoProperty(property: elements.Property, options?: opts.PropertyOptions): void;
    public writeAutoProperty(data: any, options?: opts.PropertyOptions): void {
        if (!data) return;
     
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
        this.writeEndOfLine(' }');             
    }

   /**
    *  Writes a property code block using optional callback functions for writing the getter and setter contents.
    * @param property The property definition.
    * @param getterContents An optional callback function that writes the getter code.
    * @param setterContents An optional callback function that writes the setter code. 
    */
    public writePropertyBlock(property: PropertyDefinition, getterContents: () => void | null, setterContents: () => void | null): void
    /**
    *  Writes a property code block using optional callback functions for writing the getter and setter contents.
    * @param property The property.
    * @param getterContents An optional callback function that writes the getter code.
    * @param setterContents An optional callback function that writes the setter code.
    * @param options An optional PropertyOptions object.
    */
    public writePropertyBlock(property: elements.Property, getterContents: () => void | null, setterContents: () => void | null, options?: opts.PropertyOptions): void
    public writePropertyBlock(data: any, getterContents: () => void | null, setterContents: () => void | null, options?: opts.PropertyOptions): void {
        if (!data) return;

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
    public writeAccessModifier(definition: {accessModifier?: AccessModifier}): void;
    /**
    * Writes the visibility to the output with a trailing whitespace. If the visibilty is null or 
    * not supported by C#, nothing will be written.
    * @param visibilityKind A VisibilityKind value. This value can be null.
    */
    public writeAccessModifier(visibilityKind: elements.VisibilityKind | null): void;
    public writeAccessModifier(data: any | null): void {
        if (!data) return;

        const accessModifier: AccessModifier | undefined = (typeof data == 'number') ?
            DefinitionBuilder.getAccessModifierString(data as elements.VisibilityKind) : // VisibilityKind
            data.accessModifier // TypeDefinition
      
        if (!accessModifier)
            return;

        this.write(accessModifier);
        this.writeWhiteSpace();
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
    public writeInterfaceMethod(operation: elements.Operation, options?: opts.MethodOptions): void {
        console.warn('writeInterfaceMethod is deprecated. Use the writeMethodDeclaration() function instead. ');
        this.writeMethodDeclaration(operation, options);
    }

    /**
     * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
     * @deprecated Use the writeMethodBlock() function instead.     
     */
    public writeClassMethodBlock(operation: elements.Operation, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): void {
        console.warn('writeClassMethodBlock is deprecated. Use the writeMethodBlock() function instead. ');     
        this.writeMethodBlock(operation, contents, options);
    }
    // #endregion deprecated

    //#region Xml Docs
    public writeXmlDocSummary(comments: string[]): void;
    public writeXmlDocSummary(text: string): void;
    public writeXmlDocSummary(element: elements.Element): void;
    public writeXmlDocSummary(data: any) {        
        if (elements.isNamedElement(data)) { // we have no isElement check, but this will do            
            data = DefinitionBuilder.buildXmlDocSummary(data);
        }

        if (!data) return;
        
        const lines: string[] = [];
        lines.push('<summary>')
        if (typeof data == 'string') {
            // string
            lines.push(data);
        } else {
            // string[]           
            lines.push(...data);
        }
        lines.push('</summary>')
        this.commentWriter.writeCommentLines(lines, '/// ');
    } 

    public writeXmlDocParagraph(text: string) {
        if (text == null) return;
        const lines = [text];
        this.commentWriter.writeCommentLines(lines, '/// ');
    }

    public writeXmlDocLines(lines: string[]) {
        if (lines == null) return;
        this.commentWriter.writeCommentLines(lines, '/// ');
    }

    public writeDelimitedCommentParagraph(text: string) {
        this.commentWriter.writeDelimitedCommentParagraph(text);
    }

    public writeDelimitedCommentLines(lines: string[]) {
        this.commentWriter.writeDelimitedCommentLines(lines);
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
}