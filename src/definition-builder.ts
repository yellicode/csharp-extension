import * as elements from '@yellicode/elements';
import * as opts from './options';
import { ClassDefinition, InterfaceDefinition, EnumDefinition, EnumMemberDefinition, DefinitionBase, TypeDefinition, AccessModifier, NamespaceDefinition, MethodDefinition, ParameterDefinition, PropertyDefinition, StructDefinition } from './model';
import { ParameterDirectionKind } from '@yellicode/elements';
import { TypeNameProvider } from '@yellicode/templating';
import { CSharpTypeNameProvider } from './csharp-type-name-provider';

export class DefinitionBuilder {
    constructor(private typeNameProvider: TypeNameProvider) { }

    public buildNamespaceDefinition(pack: elements.Package, options?: opts.NamespaceOptions): NamespaceDefinition {
        if (!options) options = {};
        // We have no namespace features yet, but the NamespaceFeatures type is there for future extension
        const features = (options.features === undefined) ? opts.NamespaceFeatures.All : options.features;
        let name: string;
        if (options.writeFullName) {
            const allPackages = pack.getNestingPackages();
            allPackages.push(pack); // add the package itself
            name = allPackages.map(p => p.name).join('.');
        }
        else name = pack.name;
        return { name: name };
    }

    public buildClassDefinition(type: elements.Type, options?: opts.ClassOptions): ClassDefinition {
        // Initialize options and features
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;

        // Build the base definition
        const definition = DefinitionBuilder.buildTypeDefinition<ClassDefinition>(
            type, !!(features & opts.ClassFeatures.XmlDocSummary), options);

        // Build the class-specific definition
        definition.inherits = DefinitionBuilder.buildInherits(type, options.inherits);
        definition.implements = DefinitionBuilder.buildImplements(type, options.implements);
        if (elements.isClass(type)) {
            definition.isAbstract = type.isAbstract;
        }
        return definition;
    }

    public buildStructDefinition(type: elements.Type, options?: opts.StructOptions): StructDefinition {
        // Initialize options and features
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.StructFeatures.All : options.features;

        // Build the base definition
        const definition = DefinitionBuilder.buildTypeDefinition<StructDefinition>(
            type, !!(features & opts.StructFeatures.XmlDocSummary), options);

        // Build the struct-specific definition        
        definition.implements = DefinitionBuilder.buildImplements(type, options.implements);     
        return definition;
    }

    public buildInterfaceDefinition(type: elements.Type, options?: opts.InterfaceOptions): InterfaceDefinition {
        // Initialize options and features
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;

        // Build the base definition
        const definition = DefinitionBuilder.buildTypeDefinition<InterfaceDefinition>(
            type, !!(features & opts.InterfaceFeatures.XmlDocSummary), options);

        // Build the interface-specific definition
        definition.inherits = DefinitionBuilder.buildInherits(type, options.inherits);        

        return definition;
    }

    public buildEnumMemberDefinition(literal: elements.EnumerationLiteral, isLast?: boolean, options?: opts.EnumMemberOptions): EnumMemberDefinition {
        // Initialize options and features
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumMemberFeatures.All : options.features;
        const buildInitializers = !!(features & opts.EnumFeatures.Initializers);

        // Build the base definition
        const definition: EnumMemberDefinition = DefinitionBuilder.buildDefinitionBase<EnumMemberDefinition>(literal, !!(features & opts.EnumMemberFeatures.XmlDocSummary));

        // Build the member-specific definition
        definition.isLast = isLast || false;

        if (buildInitializers && literal.specification != null) { // using '!=' on purpose  
            const specification = literal.specification;
            definition.value = elements.isLiteralInteger(specification) ? specification.value : undefined;
        }

        return definition;
    }

    public buildEnumDefinition(type: elements.Type, options?: opts.EnumOptions): EnumDefinition {
        // Initialize options and features
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;

        // Build the base definition         
        const definition = DefinitionBuilder.buildDefinitionBase<EnumDefinition>(
            type, !!(features & opts.EnumFeatures.XmlDocSummary)
        );

        // Build the enum-specific definition
        definition.accessModifier = DefinitionBuilder.getAccessModifierString(type.visibility);

        // Build enum members
        if (elements.isEnumeration(type) && type.ownedLiterals) {
            const members: EnumMemberDefinition[] = [];
            // Pass on enum features to enum member features
            let memberFeatures = opts.EnumMemberFeatures.None;
            if (features & opts.EnumFeatures.XmlDocSummary) memberFeatures |= opts.EnumMemberFeatures.XmlDocSummary;
            if (features & opts.EnumFeatures.Initializers) memberFeatures |= opts.EnumMemberFeatures.Initializers;

            type.ownedLiterals.forEach((literal, index) => {
                let isLast: boolean = index === type.ownedLiterals.length - 1;
                const member = this.buildEnumMemberDefinition(literal, isLast, { features: memberFeatures });
                members.push(member);
            });

            definition.members = members;
        }
        return definition;
    }

    public buildPropertyDefinition(property: elements.Property, options?: opts.PropertyOptions): PropertyDefinition {
        // Initialize options and features
        if (!options) options = {};           
        const features = (options.features === undefined) ? opts.PropertyFeatures.All : options.features;
        const ownerIsInterface = elements.isInterface(property.owner);
        
        // Build the base definition         
        const definition = DefinitionBuilder.buildDefinitionBase<PropertyDefinition>(
            property, !!(features & opts.PropertyFeatures.XmlDocSummary)
        );

        // Build the property-specific definition
        const typename = this.getFullTypeName(property, options.collectionType || null, 'object')!;
        definition.accessModifier = DefinitionBuilder.getAccessModifierString(property.visibility);
        definition.isVirtual = options.virtual;
        definition.typeName = typename;

        if (!ownerIsInterface && (features & opts.PropertyFeatures.AccessModifier)) definition.accessModifier = DefinitionBuilder.getAccessModifierString(property.visibility);               

        if ((features & opts.PropertyFeatures.OptionalModifier) && 
            property.lower === 0 &&             
            CSharpTypeNameProvider.canBeNullable(property, typename)) {
            definition.isNullable = true;
        }
        
        definition.noSetter = property.isReadOnly || property.isDerived;       

        return definition;        
    }

    public buildMethodDefinition(operation: elements.Operation, options?: opts.MethodOptions): MethodDefinition {
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.MethodFeatures.All : options.features;
        const ownerIsInterface = elements.isInterface(operation.owner);

        // Build the base definition         
        const definition = DefinitionBuilder.buildDefinitionBase<MethodDefinition>(
            operation, !!(features & opts.MethodFeatures.XmlDocSummary)
        );

        definition.isConstructor = operation.isConstructor;        
        definition.isStatic = operation.isStatic;
        definition.isPartial = options.isPartial;

        if (!operation.isConstructor) {
            definition.isAbstract = !options.virtual && operation.isAbstract;
            definition.isVirtual = options.virtual;        
        }
        if (!ownerIsInterface) definition.accessModifier = DefinitionBuilder.getAccessModifierString(operation.visibility);        
        
        // Get the return type and documentation
        if (!operation.isConstructor) {
            var returnParameter = operation.getReturnParameter();
            if (returnParameter) {
                definition.returnTypeName = this.getFullTypeName(returnParameter, options.collectionType || null);
                if (features & opts.MethodFeatures.XmlDocReturns) {
                    definition.xmlDocReturns = DefinitionBuilder.buildXmlDocSummary(operation);
                }
            }    
        }      
        
        // Build parameter definitions      
        definition.parameters = this.buildParameterDefinitions(operation.ownedParameters, options);
        return definition;
    }

    public buildParameterDefinitions(params: elements.Parameter[], options?: opts.MethodOptions): ParameterDefinition[] {
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.MethodFeatures.All : options.features;

        const inOutParameters: ParameterDefinition[] = [];
        if (!params) 
            return inOutParameters;

        params.forEach(p => {
            if (p.direction === ParameterDirectionKind.return) return;
            const typeName = this.getFullTypeName(p, options!.collectionType || null, 'object')!;
            const paramDefinition: ParameterDefinition = DefinitionBuilder.buildDefinitionBase<ParameterDefinition>(p, !!(features & opts.MethodFeatures.XmlDocParameters));
            paramDefinition.isOutput = p.direction === elements.ParameterDirectionKind.out;
            paramDefinition.isReference = p.direction === elements.ParameterDirectionKind.inout;
            paramDefinition.isNullable = p.lower === 0 && CSharpTypeNameProvider.canBeNullable(p, typeName);
            paramDefinition.typeName = typeName;
            inOutParameters.push(paramDefinition);
        });
        return inOutParameters;
    }

    private static buildInherits(type: elements.Type, additional: string[] | undefined): string[] | undefined {        
        if (!elements.isClassifier(type)) {
            return;
        }

        const allNames: string[] = [];
        if (type.generalizations) {
            // todo: allow qualifiedName
            allNames.push(...type.generalizations.map(g => g.general.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames.length ? allNames : undefined;
    }

    private static buildImplements(type: elements.Type, additional: string[] | undefined): string[] | undefined {
        if (!elements.isBehavioredClassifier(type)) {
            return;
        }
        const allNames: string[] = [];
        if (type.interfaceRealizations) {
            // todo: allow qualifiedName 
            allNames.push(...type.interfaceRealizations.map(ir => ir.contract.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames.length ? allNames : undefined;
    }

    private static buildXmlDocSummary(element: elements.Element): string[] | undefined {
        if (!element.ownedComments || !element.ownedComments.length) {
            return;
        }

        return element.ownedComments.map(c => c.body);
    }

    private static buildTypeDefinition<TDefinition extends TypeDefinition>(
        type: elements.Type,
        buildXmlDocSummary: boolean | undefined,
        options: { isPartial?: boolean, inherits?: string[] }): TDefinition {

        var definition = DefinitionBuilder.buildDefinitionBase<TDefinition>(type, buildXmlDocSummary);

        definition.accessModifier = DefinitionBuilder.getAccessModifierString(type.visibility);
        definition.isPartial = options.isPartial;
        return definition;
    }

    private static buildDefinitionBase<TDefinition extends DefinitionBase>(element: elements.NamedElement, buildXmlDocSummary: boolean | undefined): TDefinition {
        var definition = {
            name: element.name,
            xmlDocSummary: buildXmlDocSummary ? DefinitionBuilder.buildXmlDocSummary(element) : undefined
        }
        return definition as TDefinition;
    }

    public static getAccessModifierString(visibility: elements.VisibilityKind | null): AccessModifier | undefined {
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
                return undefined;
        }
    }

    private getFullTypeName(typedElement: elements.TypedElement, collectionType: opts.CollectionType | null, fallback?: string): string | undefined {
        const typeName = this.typeNameProvider.getTypeName(typedElement) || fallback;
        if (!typeName) 
            return; // no type name and no fallback

        if (elements.isMultiplicityElement(typedElement) && typedElement.isMultivalued()) {
            switch (collectionType) {
                case opts.CollectionType.IList:
                    return `IList<${typeName}>`;
                case opts.CollectionType.IEnumerable:
                    return `IEnumerable<${typeName}>`;
                default:
                    return `ICollection<${typeName}>`;
            }
        }
        else return typeName;
    }
}