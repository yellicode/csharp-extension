import * as model from '@yellicode/model';

import { DefaultTypeNameProvider } from '@yellicode/templating';

export class CSharpTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getDataTypeName(typedElement: model.TypedElement): string | null {
        if (!typedElement || !typedElement.type)
            return null;
        
        const t = typedElement.type;
        if (model.isPrimitiveBoolean(t)) return "bool";
        if (model.isPrimitiveInteger(t)) return "int";
        if (model.isPrimitiveReal(t)) return "double"; // By default, a real numeric literal on the right side of the assignment operator is treated as double (https://msdn.microsoft.com/en-us/library/b1e65aza.aspx)
        if (model.isPrimitiveString(t)) return "string";
        if (model.isPrimitiveObject(t)) return "object";
        
        return super.getDataTypeName(typedElement);
    }

    public static canBeNullable(type: model.Type | null): boolean {
        if (!type || type.name == null || model.isPrimitiveString(type) || model.isPrimitiveObject(type))
            return false;  // type has no name or is already nullable

        return model.isEnumeration(type) || model.isDataType(type); // isDataType includes PrimitiveType      
    }
}
