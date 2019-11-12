import * as elements from '@yellicode/elements';

export class CSharpTypeNameProvider extends elements.DefaultTypeNameProvider {
    protected /*override*/ getTypeNameForType(type: elements.Type | null, isDataType: boolean): string | null {
        if (!type) return null;

        if (isDataType) {
            if (elements.isPrimitiveBoolean(type)) return "bool";
            if (elements.isPrimitiveInteger(type)) return "int";
            if (elements.isPrimitiveReal(type)) return "double"; // By default, a real numeric literal on the right side of the assignment operator is treated as double (https://msdn.microsoft.com/en-us/library/b1e65aza.aspx)
            if (elements.isPrimitiveString(type)) return "string";
            if (elements.isPrimitiveObject(type)) return "object";
        }

        return super.getTypeNameForType(type, isDataType);
    }

    public static canBeNullable(typedElement: elements.TypedElement, csTypeName: string): boolean {
        if (!typedElement || !csTypeName) 
            return false;

        // A collection cannot be nullable
        if (elements.isMultiplicityElement(typedElement) && typedElement.isMultivalued()){
            return false;
        }

        // Check the mapped type name (it could come from a custom TypeNameProvider) 
        switch (csTypeName) { // the following cannot be nullable:
            case 'string':
            case 'System.String':
            case 'object':
            case 'System.Object':
                return false;
        }

        // Check the type itself
        const type = typedElement.type;
        if (!type) return false;

        return elements.isEnumeration(type) || elements.isDataType(type); // isDataType includes PrimitiveType      
    }   
}
