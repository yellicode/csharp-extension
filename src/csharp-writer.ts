import * as elements from '@yellicode/elements';
import * as opts from './options';
import { CodeWriter, TextWriter, TypeNameProvider } from '@yellicode/templating';
import { CSharpTypeNameProvider } from './csharp-type-name-provider';
import { CSharpCommentWriter } from './comment-writer';
import { XmlDocUtility } from './xml-doc-utility';

export class CSharpWriter extends CodeWriter {
    private typeNameProvider: TypeNameProvider;
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
     * @param pack A package that represents the namespace.
     * @param contents A callback function that writes the namespace contents.
     * @param options An optional NamespaceOptions object.
     */
    public writeNamespaceBlock(pack: elements.Package, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): void;
    public writeNamespaceBlock(name: string, contents: (writer: CSharpWriter) => void): void;
    public writeNamespaceBlock(data: any, contents: (writer: CSharpWriter) => void, options?: opts.NamespaceOptions): void {
        if (!data) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.NamespaceFeatures.All : options.features;
        if (typeof data === 'string') {
            this.writeLine(`namespace ${data}`);
        }
        else if (elements.isPackage(data)) {           
            if (options.writeFullName) {
                const allPackages = data.getNestingPackages();
                allPackages.push(data);
                this.writeLine(`namespace ${allPackages.map(p => p.name).join('.')}`);
            }
            else this.writeLine(`namespace ${data.name}`);
        }
        this.writeCodeBlock(contents);
    };

    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    public writeClassBlock(cls: elements.Class, contents: (writer: CSharpWriter) => void, options?: opts.ClassOptions) {
        if (!cls) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;

        if (features & opts.ClassFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(cls.ownedComments);
        }

        this.writeIndent();
        this.writeAccessModifier(cls.visibility);
        if (cls.isAbstract) {
            this.write('abstract ');
        }
        if (options.isPartial) {
            this.write('partial ');
        }
        this.write(`class ${cls.name}`);
        let hasGeneralizations = false;
        if (features & opts.ClassFeatures.Generalizations) {
            hasGeneralizations = this.writeGeneralizations(cls.generalizations, options.inherits);
        }
        if (features & opts.ClassFeatures.InterfaceRealizations) {
            this.writeInterfaceRealizations(cls.interfaceRealizations, options.implements, hasGeneralizations);
        }
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
    }

    /**
    * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
    * This function does not write interface members.
    * @param iface The interface.
    * @param contents A callback function that writes the interface contents.
    * @param options An optional InterfaceOptions object.
    */
    public writeInterfaceBlock(iface: elements.Interface, contents: (writer: CSharpWriter) => void, options?: opts.InterfaceOptions) {
        if (!iface) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;

        if (features & opts.InterfaceFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(iface.ownedComments);
        }

        this.writeIndent();
        this.writeAccessModifier(iface.visibility);
        if (options.isPartial) {
            this.write('partial ');
        }
        this.write(`interface ${iface.name}`);
        if (features & opts.InterfaceFeatures.Generalizations) {
            this.writeGeneralizations(iface.generalizations, options.inherits);
        }
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
    }

    /**
    * Writes a block of code, wrapped in an enum declaration and opening and closing brackets. 
    * This function does not write enumeration members. Use the writeEnumMember function
    * to write each individual member or the writeEnumeration function to write the full enumeration.
    * @param element The enumeration.
    * @param contents A callback function that writes the enumeration contents.
    * @param options An optional EnumerationOptions object.
    */
    public writeEnumerationBlock(enumeration: elements.Enumeration, contents: (writer: CSharpWriter) => void, options?: opts.EnumOptions) {
        if (!enumeration) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;

        if (features & opts.EnumFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(enumeration.ownedComments);
        }

        this.writeIndent();
        this.writeAccessModifier(enumeration.visibility);
        this.write(`enum ${enumeration.name}`);
        this.writeEndOfLine();
        this.writeCodeBlock(contents);
    }

    /**
    * Writes a full enumeration, including members.   
    * @param element The enumeration.     
    * @param options An optional EnumOptions object.
    */
    public writeEnumeration(enumeration: elements.Enumeration, options?: opts.EnumOptions) {
        if (!enumeration) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;

        // Pass on enum features to enum member features
        let enumMemberFeatures = opts.EnumMemberFeatures.None;
        if (features & opts.EnumFeatures.XmlDocSummary) enumMemberFeatures |= opts.EnumMemberFeatures.XmlDocSummary;
        if (features & opts.EnumFeatures.Initializers) enumMemberFeatures |= opts.EnumMemberFeatures.Initializers;

        this.writeEnumerationBlock(enumeration, () => {
            enumeration.ownedLiterals.forEach((literal) => {
                this.writeEnumMember(literal, { features: enumMemberFeatures });
            })
        }, options);
    }

    /**
     * Writes an individual enumeration member.
     * @param literal The EnumerationLiteral for which to write the member.
     * @param options An optional EnumMemberOptions object.
     */
    public writeEnumMember(literal: elements.EnumerationLiteral, options?: opts.EnumMemberOptions) {
        if (!literal) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumMemberFeatures.All : options.features;
        const isLast = literal.enumeration.ownedLiterals.indexOf(literal) === literal.enumeration.ownedLiterals.length - 1;

        if (features & opts.EnumMemberFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(literal.ownedComments);
        }
        this.writeIndent();
        this.write(literal.name);
        if ((features & opts.EnumMemberFeatures.Initializers) && literal.specification) {
            let initialValue = literal.specification.getStringValue();
            this.write(` = ${initialValue}`);
        }
        if (!isLast) {
            this.write(',');
        }
        this.writeEndOfLine();
    }

    /**
    * Writes a method declaration without a body.
    * @param operation The operation for which to write the method.
    * @param options An optional MethodOptions object.
    */
    public writeInterfaceMethod(operation: elements.Operation, options?: opts.MethodOptions): void {
        if (!operation) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.MethodFeatures.All : options.features;

        if (features & opts.MethodFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(operation.ownedComments);
        }
        if (features & opts.MethodFeatures.XmlDocParameters) {
            this.writeXmlDocParameters(operation);
        }
        if (features & opts.MethodFeatures.XmlDocReturns) {
            this.writeXmlDocReturns(operation);
        }
        this.writeIndent();
        // Write the return type
        this.write(`${this.getMethodReturnType(operation, options)} `);
        this.write(`${operation.name}(`);
        this.writeInOutParameters(operation.ownedParameters, options);
        this.write(');');
        this.writeEndOfLine();
    }

    /**
    * Writes an indented block of code, wrapped in a method declaration and opening and closing brackets. 
    * @param operation The operation for which to write the method.
    * @param contents A callback function that writes the operation contents.
    * @param options An optional MethodOptions object.
    */
    public writeClassMethodBlock(operation: elements.Operation, contents: (writer: CSharpWriter) => void, options?: opts.MethodOptions): void {
        if (!operation) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.MethodFeatures.All : options.features;

        if (features & opts.MethodFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(operation.ownedComments);
        }
        if (features & opts.MethodFeatures.XmlDocParameters) {
            this.writeXmlDocParameters(operation);
        }
        if (features & opts.MethodFeatures.XmlDocReturns) {
            this.writeXmlDocReturns(operation);
        }
        this.writeIndent();
        this.writeAccessModifier(operation.visibility);

        if (operation.isStatic) {
            this.write('static ');
        }
        else if (operation.isAbstract) {
            this.write('abstract ');
        }
        else if (options.virtual) {
            this.write('virtual ');
        }
        this.write(`${this.getMethodReturnType(operation, options)} `);
        this.write(`${operation.name}(`);
        this.writeInOutParameters(operation.ownedParameters, options);
        this.write(')');
        if (operation.isAbstract) {
            this.write(';');
            this.writeEndOfLine();
        }
        else {
            this.writeEndOfLine();
            this.writeCodeBlock(contents);
        }
    }

    /**
 * Writes an auto property with a getter and (if the property is not ReadOnly) a setter.     
 * This function can be used for both Classes and Interfaces. 
 */
    public writeAutoProperty(property: elements.Property, options?: opts.PropertyOptions) {
        if (!property) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.PropertyFeatures.All : options.features;
        const ownerIsInterface = elements.isInterface(property.owner);

        if (features & opts.PropertyFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(property.ownedComments);
        }
        // Start a new, indented line        
        this.writeIndent();
        // Access modifier
        if (!ownerIsInterface && (features & opts.PropertyFeatures.AccessModifier)) {
            this.writeAccessModifier(property.visibility);
        }
        // Virtual
        if (options.virtual) {
            this.write('virtual ');
        }
        // Type
        var typeName = this.getTypeName(property) || 'object';
        if (property.isMultivalued()) {
            this.write(CSharpWriter.createCollectionType(typeName, options.collectionType));
        }
        else {
            this.write(typeName);
            if ((features & opts.PropertyFeatures.OptionalModifier) && property.lower === 0 && CSharpTypeNameProvider.canBeNullable(property.type)) {
                this.write('?');
            }
        }
        // Name               
        this.write(` ${property.name}`);
        this.write(property.isReadOnly ? ' {get;}' : ' {get; set;}');
        this.writeEndOfLine();
    }

    /**
     * Gets a string containing the return type of the method. If the return type cannot be determined, 
     * the string 'void' is returned. If the method returns a collection, a collection type is returned
     * based on the provided options.
     * @param operation The operation.
     * @param options An optional MethodOptions object.
     */
    public getMethodReturnType(operation: elements.Operation, options?: opts.MethodOptions): string {
        if (!operation) throw 'The operation is null or undefined.';

        const returnParameter = operation.getReturnParameter();        
        if (!returnParameter) return 'void';
        
        const typeName = this.getTypeName(returnParameter);
        if (!typeName) return 'void'; // the type could not be mapped 
        if (!options) options = {};
        return operation.isMultivalued() ? CSharpWriter.createCollectionType(typeName, options.collectionType) : typeName;
    }

    /**
     * Writes the input and output parameters (all parameters except the return parameter) of a method.
     * @param params A collection of parameters.
     * @param options An optional MethodOptions object.
     */
    public writeInOutParameters(params: elements.Parameter[], options?: opts.MethodOptions): void {
        if (!params)
            return;

        if (!options) options = {};

        let i = 0;
        params.forEach((p: elements.Parameter) => {
            if (p.direction === elements.ParameterDirectionKind.return)
                return;

            if (i > 0) {
                this.write(', ');
            }
            if (p.direction === elements.ParameterDirectionKind.out) {
                this.write('out ');
            }
            else if (p.direction === elements.ParameterDirectionKind.inout) {
                this.write('ref '); // The ref keyword can be used for both value- and reference types
            }
            const typeName = this.getTypeName(p) || 'object';
            if (p.isMultivalued()) {
                this.write(CSharpWriter.createCollectionType(typeName, options!.collectionType));
            }
            else {
                this.write(typeName);
                if (p.lower === 0 && CSharpTypeNameProvider.canBeNullable(p.type)) {
                    this.write('?');
                }
            }
            this.write(` ${p.name}`);
            i++;
        });
    }

    /**
    * Writes the visibility to the output with a trailing whitespace. If the visibilty is null or 
    * not supported by C#, nothing will be written.
    * @param visibilityKind A VisibilityKind value. This value can be null.
    */
    public writeAccessModifier(visibilityKind: elements.VisibilityKind | null): void {
        const accessModifierString = CSharpWriter.getAccessModifierString(visibilityKind);
        if (!accessModifierString)
            return;
        this.write(accessModifierString);
        this.writeWhiteSpace();
    }

    private writeGeneralizations(generalizations: elements.Generalization[], additional: string[] | undefined): boolean {
        const allNames: string[] = [];
        if (generalizations) {
            // todo: allow qualifiedName and extend typeNameProvider with getGeneralTypeName?
            allNames.push(...generalizations.map(g => g.general.name)); 
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return false;

        this.write(' : ');
        this.joinWrite(allNames, ', ', name => name);
        return true;
    }

    private writeInterfaceRealizations(realizations: elements.InterfaceRealization[], additional: string[] | undefined, hasGeneralizations: boolean): boolean {
        const allNames: string[] = [];
        if (realizations) {
            // todo: allow qualifiedName and extend typeNameProvider with getInterfaceTypeName?
            allNames.push(...realizations.map(ir => ir.contract.name)); 
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return false;

        this.write(hasGeneralizations ? ', ' : ' : ');
        this.joinWrite(allNames, ', ', name => name);
        return true;
    }

    private getTypeName(typedElement: elements.TypedElement | null): string | null {
        if (!typedElement) return null;
        return this.typeNameProvider ? this.typeNameProvider.getTypeName(typedElement) : typedElement.getTypeName();        
    }

    //#region Xml Docs
    public writeXmlDocSummary(comments: elements.Comment[]): void;
    public writeXmlDocSummary(text: string): void;
    public writeXmlDocSummary(data: any) {
        const lines: string[] = [];
        lines.push('<summary>')
        if (typeof data == 'string') {
            lines.push(data);
        } else {
            if (!data || data.length === 0) return;
            lines.push(...data.map((c: elements.Comment) => c.body));
        }
        lines.push('</summary>')
        this.commentWriter.writeCommentLines(lines, '/// ');
    }

    public writeXmlDocParameters(element: elements.Operation) {
        this.writeXmlDocLines(XmlDocUtility.getXmlDocLinesForParameters(element.getInputParameters()));
    }

    public writeXmlDocReturns(element: elements.Operation) {
        var returnParameter = element.getReturnParameter();
        if (!returnParameter) return;

        this.writeXmlDocLines([XmlDocUtility.getXmlDocLineForParameter(returnParameter)]);
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

    public static getAccessModifierString(visibility: elements.VisibilityKind | null): string | null {
        switch (visibility) {
            case elements.VisibilityKind.public:
                return 'public';
            case elements.VisibilityKind.private:
                return 'private';
            case elements.VisibilityKind.protected:
                return 'protected';
            case elements.VisibilityKind.package:
                return 'internal';
            default:
                return null;
        }
    }

    public static createCollectionType(typeName: string, collectionType?: opts.CollectionType): string {
        switch (collectionType) {
            case opts.CollectionType.IList:
                return `IList<${typeName}>`;
            case opts.CollectionType.IEnumerable:
                return `IEnumerable<${typeName}>`;
            default:
                return `ICollection<${typeName}>`;
        }
    }
}