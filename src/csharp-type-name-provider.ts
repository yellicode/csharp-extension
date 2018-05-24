import * as elements from '@yellicode/elements';

import { DefaultTypeNameProvider } from '@yellicode/templating';

export class CSharpTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getDataTypeName(typedElement: elements.TypedElement): string | null {
        if (!typedElement || !typedElement.type)
            return null;
        
        const t = typedElement.type;
        if (elements.isPrimitiveBoolean(t)) return "bool";
        if (elements.isPrimitiveInteger(t)) return "int";
        if (elements.isPrimitiveReal(t)) return "double"; // By default, a real numeric literal on the right side of the assignment operator is treated as double (https://msdn.microsoft.com/en-us/library/b1e65aza.aspx)
        if (elements.isPrimitiveString(t)) return "string";
        if (elements.isPrimitiveObject(t)) return "object";
        
        return super.getDataTypeName(typedElement);
    }

    public static canBeNullable(type: elements.Type | null): boolean {
        if (!type || type.name == null || elements.isPrimitiveString(type) || elements.isPrimitiveObject(type))
            return false;  // type has no name or is already nullable

        return elements.isEnumeration(type) || elements.isDataType(type); // isDataType includes PrimitiveType      
    }
}
