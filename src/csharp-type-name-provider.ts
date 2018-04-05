import * as model from '@yellicode/model';

import { DefaultTypeNameProvider } from '@yellicode/templating';

export class CSharpTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getDataTypeName(type: model.DataType): string | null {
        if (model.isPrimitiveBoolean(type)) return "bool";
        if (model.isPrimitiveInteger(type)) return "int";
        if (model.isPrimitiveReal(type)) return "double"; // By default, a real numeric literal on the right side of the assignment operator is treated as double (https://msdn.microsoft.com/en-us/library/b1e65aza.aspx)
        if (model.isPrimitiveString(type)) return "string";
        if (model.isPrimitiveObject(type)) return "object";
        return super.getDataTypeName(type);
    }

    public static canBeNullable(type: model.Type | null): boolean {
        if (!type || type.name == null || model.isPrimitiveString(type) || model.isPrimitiveObject(type))
            return false;  // type has no name or is already nullable

        return model.isEnumeration(type) || model.isDataType(type); // isDataType includes PrimitiveType      
    }
}
