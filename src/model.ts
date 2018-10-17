export type accessModifier = 'public' | 'private' | 'protected' | 'internal' | 'protected internal' | 'private protected';

export interface DefinitionBase {
    name: string;
    xmlDocSummary?: string[];    
    accessModifier?: accessModifier;
}

export interface TypeDefinition extends DefinitionBase {
    isPartial?: boolean;
    inherits?: string[];    
}

export interface ClassDefinition extends TypeDefinition {
    isAbstract?: boolean;
    implements?: string[];
}

export interface InterfaceDefinition extends TypeDefinition {
}

// export interface StructDefinition extends TypeDefinition {
//     // A struct cannot inherit from another struct or class, and it cannot be the base of a class
// }