/**
 * Enumerates the valid C# access modifiers.
 */
export type AccessModifier = 'public' | 'private' | 'protected' | 'internal' | 'protected internal' | 'private protected';

/**
 * The base interface for all C# definitions. 
 */
export interface DefinitionBase {
    /**
     * Get or sets the name of the code element. This field is required.
     */
    name: string;
    /**
     * Gets the XML documentation summary of the element. Each string in this
     * array will be written on a new line. This field is optional.
     */
    xmlDocSummary?: string[];
}

/**
 * Represents a C# namespace.
 */
export interface NamespaceDefinition extends DefinitionBase {
    // Nothing specific yet.
}

/**
 * The base interface for all C# type definitions, such as class- and interface
 * definitions.
 */
export interface TypeDefinition extends DefinitionBase {
    /**
     * Gets the type's access modifier. By default, no access modifier will be written.
     */
    accessModifier?: AccessModifier;
    /**
     * Indicates whether the type should be written with the 'partial' keyword. 
     * The default value is false.
     */
    isPartial?: boolean;
}

/**
 * Represents a C# struct.
 */
export interface StructDefinition extends TypeDefinition {
    /**
     * Contains the names of the interfaces that the struct should implement. 
     * This field is optional.
     */
    implements?: string[];
    /**
    * Gets the struct properties.
    */
    properties?: PropertyDefinition[];
    /**
     * Gets the struct methods. 
     */
    methods?: MethodDefinition[];
}

/**
 * Represents a C# class.
 */
export interface ClassDefinition extends TypeDefinition {
    /**
     * Indicates whether the class should be abstract. 
     * The default value is false.
     */
    isAbstract?: boolean;
    /**
    * Contains the names of the interfaces that the class should implement. 
    * This field is optional.
    */
    implements?: string[];
    /**
     * Contains the names of the classes from which the class should inherit. 
     * This field is optional.
     */
    inherits?: string[];
    /**
     * Gets the class properties.
     */
    properties?: PropertyDefinition[];
    /**
     * Gets the class methods. 
     */
    methods?: MethodDefinition[];
}

/**
 * Represents a C# interface.
 */
export interface InterfaceDefinition extends TypeDefinition {
    /**
    * Contains the names of the interfaces from which the interfaces should inherit. 
    * This field is optional.
    */
    inherits?: string[];
    /**
    * Gets the interface properties.
    */
    properties?: PropertyDefinition[];
    /**
     * Gets the interface methods. 
     */
    methods?: MethodDefinition[];
}

/**
 * Represents a C# enumeration member.
 */
export interface EnumMemberDefinition extends DefinitionBase {
    /**
     * Gets the numeric value of the member. 
     * This field is optional. By default, no value will be written.
     */
    value?: number;
    /**
     * Indicates if the member is the last member of the containing enumeration.
     * This value is only used to control if a delimiter is written.
     */
    isLast?: boolean;
}

/**
 * Represents a C# enumeration.
 */
export interface EnumDefinition extends DefinitionBase {
    // Note: an enum cannot be partial, therefore we cannot extend TypeDefinition

    /**
     * Gets the type's access modifier. By default, no access modifier will be written.
     */
    accessModifier?: AccessModifier;
    /**
     * Gets the enum members.
     */
    members: EnumMemberDefinition[];
}

/**
 * Represents a C# method.
 */
export interface MethodDefinition extends DefinitionBase {
    /**
     * The full type name of the method return type. If the method returns a collection,
     * the collection must be part of the name (e.g. 'List<string>'). If this value
     * is empty, the method will be 'void'.
     */
    returnTypeName?: string;
    /**
     * Contains the documentation of the return value.
     */
    xmlDocReturns?: string[];
    /**
     * Contains the method's input/output parameters.
     */
    parameters?: ParameterDefinition[];
    /**
    * Gets the method's access modifier. By default, no access modifier will be written.
    */
    accessModifier?: AccessModifier;
    /**
     * Indicates if the method should be a static method. 
     * The default value is false.
     */
    isStatic?: boolean;
    /**
     * Indicates if the method should be an abstract method. This value
     * is ignored if the method is a static method. The default value is false.
     */
    isAbstract?: boolean;
    /**
    * Indicates if the method should be a virtual method. This value
    * is ignored if the method is a static or abstract method. The default value is false.
    */
    isVirtual?: boolean;
    /**
     * Indicates if the method is a constructor. The default value is false.
     */
    isConstructor?: boolean;
    /**
     * Indicates whether the method should be written with the 'partial' keyword. 
     * The default value is false.
     */
    isPartial?: boolean;
}

/**
 * Represents a C# method parameter.
 */
export interface ParameterDefinition extends DefinitionBase {
    /**
     * The full type name of the parameter. If the type is a collection,
     * the collection must be part of the name (e.g. 'List<string>').
     */
    typeName: string;
    /**
     * Indicates if the parameter is an output parameter. The default value is false.
     */
    isOutput?: boolean;
    /**
     * Indicates if the parameter value should be passed by reference. The default value is false.
     */
    isReference?: boolean;
    /**
     * Indicates if the parameter should be nullable. The caller should ensure that
     * the type specified by typeName is a nullable type. The default value is false.
     */
    isNullable?: boolean;
}

/**
 * Represents a C# property.
 */
export interface PropertyDefinition extends DefinitionBase {
    /**
      * The full type name of the property. If the type is a collection,
      * the collection must be part of the name (e.g. 'List<string>').
      */
    typeName: string;
    /**
     * Gets the prooperty's access modifier. By default, no access modifier will be written.
     */
    accessModifier?: AccessModifier;
    /**
     * Indicates if a property getter should be written. The default value is false.
     * @deprecated A getter is now written by default. Please use noGetter if you want to omit the getter. 
     */
    hasGetter?: boolean;
    /**
     * Indicates if a property getter should be omitted. By default, a getter will be written. 
     */
    noGetter?: boolean;
    /**
     * Indicates if a property setter should be written. The default value is false.
     * @deprecated A setter is now written by default. Please use noSetter if you want to omit the setter. 
     */
    hasSetter?: boolean;
    /**
     * Indicates if a property setter should be omitted. By default, a setter will be written.
     */
    noSetter?: boolean;
    /**
     * Indicates if the property should be a virtual property.
     */
    isVirtual?: boolean;
    /**
    * Indicates if the property should be nullable. The caller should ensure that
    * the type specified by typeName is a nullable type. The default value is false.
    */
    isNullable?: boolean;
}