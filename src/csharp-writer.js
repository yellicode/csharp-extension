"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("@yellicode/model");
const opts = require("./options");
const templating_1 = require("@yellicode/templating");
const csharp_type_name_provider_1 = require("./csharp-type-name-provider");
const comment_writer_1 = require("./comment-writer");
const xml_doc_utility_1 = require("./xml-doc-utility");
// TODO: how to deal with (namespace) prefixes for type names?
// TODO: way to build safe names
// TODO: allow virtual modifier on properties (e.g. Entity Framework) and methods
// TODO: property initializers
// TODO: pass writer and element to 'block' callback functions (see TypeScriptWriter)
class CSharpWriter extends templating_1.CodeWriter {
    /**
     * Constructor. Creates a new CSharpWriter instance using the TextWriter and options provided.
     * @param writer The template's current TextWriter.
     * @param options Optional: the global options for this writer.
     */
    constructor(writer, options) {
        super(writer);
        if (!options)
            options = {};
        this.typeNameProvider = options.typeNameProvider || new csharp_type_name_provider_1.CSharpTypeNameProvider();
        this.commentWriter = new comment_writer_1.CSharpCommentWriter(writer, this.typeNameProvider, options.maxCommentWidth || 100);
    }
    /**
     * Writes 1 or more using directives, each on a new line.
     * @param values A collection of strings, typically namespace names.
     */
    writeUsingDirectives(...values) {
        values.forEach(v => {
            this.writeLine(`using ${v};`);
        });
    }
    /**
     * Writes an indented block of code, wrapped in opening and closing brackets.
     * @param contents A callback function that writes the contents.
     */
    writeCodeBlock(contents) {
        this.writeLine('{');
        this.increaseIndent();
        if (contents)
            contents();
        this.decreaseIndent();
        this.writeLine('}');
    }
    ;
    writeNamespaceBlock(data, contents, options) {
        if (!data)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.NamespaceFeatures.All : options.features;
        if (typeof data === 'string') {
            this.writeLine(`namespace ${data}`);
        }
        else if (model.isPackage(data)) {
            if (features & opts.NamespaceFeatures.XmlDocSummary) {
                this.writeXmlDocSummary(data.ownedComments);
            }
            if (options.writeFullName) {
                const allPackages = data.getNestingPackages();
                allPackages.push(data);
                this.writeLine(`namespace ${allPackages.map(p => p.name).join('.')}`);
            }
            else
                this.writeLine(`namespace ${data.name}`);
        }
        this.writeCodeBlock(contents);
    }
    ;
    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    writeClassBlock(cls, contents, options) {
        if (!cls)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;
        if (features & opts.ClassFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(cls.ownedComments);
        }
        this.writeIndent();
        this.writeAccessModifier(cls.visibility);
        if (cls.isAbstract) {
            this.write('abstract ');
        }
        if (options.noPartial !== true) {
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
    writeInterfaceBlock(iface, contents, options) {
        if (!iface)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;
        if (features & opts.InterfaceFeatures.XmlDocSummary) {
            this.writeXmlDocSummary(iface.ownedComments);
        }
        this.writeIndent();
        this.writeAccessModifier(iface.visibility);
        if (options.noPartial !== true) {
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
    writeEnumerationBlock(enumeration, contents, options) {
        if (!enumeration)
            return;
        if (!options)
            options = {};
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
    writeEnumeration(enumeration, options) {
        if (!enumeration)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;
        // Pass on enum features to enum member features
        let enumMemberFeatures = opts.EnumMemberFeatures.None;
        if (features & opts.EnumFeatures.XmlDocSummary)
            enumMemberFeatures |= opts.EnumMemberFeatures.XmlDocSummary;
        if (features & opts.EnumFeatures.Initializers)
            enumMemberFeatures |= opts.EnumMemberFeatures.Initializers;
        this.writeEnumerationBlock(enumeration, () => {
            enumeration.ownedLiterals.forEach((literal) => {
                this.writeEnumMember(literal, { features: enumMemberFeatures });
            });
        }, options);
    }
    /**
     * Writes an individual enumeration member.
     * @param literal The EnumerationLiteral for which to write the member.
     * @param options An optional EnumMemberOptions object.
     */
    writeEnumMember(literal, options) {
        if (!literal)
            return;
        if (!options)
            options = {};
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
    writeInterfaceMethod(operation, options) {
        if (!operation)
            return;
        if (!options)
            options = {};
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
    writeClassMethodBlock(operation, contents, options) {
        if (!operation)
            return;
        if (!options)
            options = {};
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
    writeAutoProperty(property, options) {
        if (!property)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.PropertyFeatures.All : options.features;
        const ownerIsInterface = model.isInterface(property.owner);
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
        var typeName = this.getTypeName(property.type) || 'object';
        if (property.isMultivalued()) {
            this.write(CSharpWriter.createCollectionType(typeName, options.collectionType));
        }
        else {
            this.write(typeName);
            if ((features & opts.PropertyFeatures.OptionalModifier) && property.lower === 0 && csharp_type_name_provider_1.CSharpTypeNameProvider.canBeNullable(property.type)) {
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
    getMethodReturnType(operation, options) {
        if (!operation)
            throw 'The operation is null or undefined.';
        const returnType = operation.getReturnType();
        if (!returnType)
            return 'void';
        const typeName = this.getTypeName(returnType);
        if (!typeName)
            return 'void'; // the type could not be mapped 
        if (!options)
            options = {};
        return operation.isMultivalued() ? CSharpWriter.createCollectionType(typeName, options.collectionType) : typeName;
    }
    /**
     * Writes the input and output parameters (all parameters except the return parameter) of a method.
     * @param params A collection of parameters.
     * @param options An optional MethodOptions object.
     */
    writeInOutParameters(params, options) {
        if (!params)
            return;
        if (!options)
            options = {};
        let i = 0;
        params.forEach((p) => {
            if (p.direction === model.ParameterDirectionKind.return)
                return;
            if (i > 0) {
                this.write(', ');
            }
            if (p.direction === model.ParameterDirectionKind.out) {
                this.write('out ');
            }
            else if (p.direction === model.ParameterDirectionKind.inout) {
                this.write('ref '); // The ref keyword can be used for both value- and reference types
            }
            const typeName = this.getTypeName(p.type) || 'object';
            if (p.isMultivalued()) {
                this.write(CSharpWriter.createCollectionType(typeName, options.collectionType));
            }
            else {
                this.write(typeName);
                if (p.lower === 0 && csharp_type_name_provider_1.CSharpTypeNameProvider.canBeNullable(p.type)) {
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
    writeAccessModifier(visibilityKind) {
        const accessModifierString = CSharpWriter.getAccessModifierString(visibilityKind);
        if (!accessModifierString)
            return;
        this.write(accessModifierString);
        this.writeWhiteSpace();
    }
    writeGeneralizations(generalizations, additional) {
        const allNames = [];
        if (generalizations) {
            allNames.push(...generalizations.map(g => this.getTypeName(g.general)));
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
    writeInterfaceRealizations(realizations, additional, hasGeneralizations) {
        const allNames = [];
        if (realizations) {
            allNames.push(...realizations.map(ir => this.getTypeName(ir.contract)));
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
    getTypeName(type) {
        if (!type)
            return null;
        if (!this.typeNameProvider)
            return type.name;
        return this.typeNameProvider.getTypeName(type);
    }
    writeXmlDocSummary(data) {
        const lines = [];
        lines.push('<summary>');
        if (typeof data == 'string') {
            lines.push(data);
        }
        else {
            lines.push(...data.map((c) => c.body));
        }
        lines.push('</summary>');
        this.commentWriter.writeCommentLines(lines, '/// ');
    }
    writeXmlDocParameters(element) {
        this.writeXmlDocLines(xml_doc_utility_1.XmlDocUtility.getXmlDocLinesForParameters(element.getInputParameters()));
    }
    writeXmlDocReturns(element) {
        var returnParameter = element.getReturnParameter();
        if (!returnParameter)
            return;
        this.writeXmlDocLines([xml_doc_utility_1.XmlDocUtility.getXmlDocLineForParameter(returnParameter)]);
    }
    writeXmlDocParagraph(text) {
        if (text == null)
            return;
        const lines = [text];
        this.commentWriter.writeCommentLines(lines, '/// ');
    }
    writeXmlDocLines(lines) {
        if (lines == null)
            return;
        this.commentWriter.writeCommentLines(lines, '/// ');
    }
    writeDelimitedCommentParagraph(text) {
        this.commentWriter.writeDelimitedCommentParagraph(text);
    }
    writeDelimitedCommentLines(lines) {
        this.commentWriter.writeDelimitedCommentLines(lines);
    }
    //#endregion Xml Docs    
    joinWrite(collection, separator, getStringFunc) {
        let isFirst = true;
        collection.forEach(c => {
            const value = getStringFunc(c);
            if (!value)
                return;
            if (isFirst) {
                isFirst = false;
            }
            else
                this.write(separator);
            this.write(value);
        });
    }
    static getAccessModifierString(visibility) {
        switch (visibility) {
            case model.VisibilityKind.public:
                return 'public';
            case model.VisibilityKind.private:
                return 'private';
            case model.VisibilityKind.protected:
                return 'protected';
            case model.VisibilityKind.package:
                return 'internal';
            default:
                return null;
        }
    }
    static createCollectionType(typeName, collectionType) {
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
exports.CSharpWriter = CSharpWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NoYXJwLXdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNzaGFycC13cml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBMEM7QUFDMUMsa0NBQWtDO0FBQ2xDLHNEQUFpRjtBQUNqRiwyRUFBcUU7QUFDckUscURBQXVEO0FBQ3ZELHVEQUFrRDtBQUVsRCw4REFBOEQ7QUFDOUQsZ0NBQWdDO0FBQ2hDLGlGQUFpRjtBQUNqRiw4QkFBOEI7QUFDOUIscUZBQXFGO0FBRXJGLGtCQUEwQixTQUFRLHVCQUFVO0lBSXhDOzs7O09BSUc7SUFDSCxZQUFZLE1BQWtCLEVBQUUsT0FBNEI7UUFDeEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLElBQUksSUFBSSxrREFBc0IsRUFBRSxDQUFDO1FBQ2pGLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxvQ0FBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxlQUFlLElBQUksR0FBRyxDQUFDLENBQUM7SUFDaEgsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9CQUFvQixDQUFDLEdBQUcsTUFBZ0I7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxRQUFvQjtRQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7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