import * as elements from '@yellicode/elements';

import { DefaultTypeNameProvider } from '@yellicode/templating';

export class CSharpTypeNameProvider extends DefaultTypeNameProvider {
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

    public static canBeNullable(type: elements.Type | null): boolean {
        // TODO: this function should use the mapped type name!
        
        if (!type || type.name == null || elements.isPrimitiveString(type) || elements.isPrimitiveObject(type))
            return false;  // type has no name or is already nullable

        return elements.isEnumeration(type) || elements.isDataType(type); // isDataType includes PrimitiveType      
    }
}
