"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("@yellicode/model");
const templating_1 = require("@yellicode/templating");
class CSharpTypeNameProvider extends templating_1.DefaultTypeNameProvider {
    getPrimitiveTypeName(type) {
        if (model.isPrimitiveBoolean(type))
            return "bool";
        if (model.isPrimitiveInteger(type))
            return "int";
        if (model.isPrimitiveReal(type))
            return "double"; // By default, a real numeric literal on the right side of the assignment operator is treated as double (https://msdn.microsoft.com/en-us/library/b1e65aza.aspx)
        if (model.isPrimitiveString(type))
            return "string";
        if (model.isPrimitiveObject(type))
            return "object";
        return super.getPrimitiveTypeName(type);
    }
    static canBeNullable(type) {
        if (!type || type.name == null || model.isPrimitiveString(type) || model.isPrimitiveObject(type))
            return false; // type has no name or is already nullable
        return model.isEnumeration(type) || model.isDataType(type); // isDataType includes PrimitiveType      
    }
}
exports.CSharpTypeNameProvider = CSharpTypeNameProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NoYXJwLXR5cGUtbmFtZS1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNzaGFycC10eXBlLW5hbWUtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBMEM7QUFFMUMsc0RBQWdFO0FBRWhFLDRCQUFvQyxTQUFRLG9DQUF1QjtJQUN4QyxvQkFBb0IsQ0FBQyxJQUF5QjtRQUNqRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxnS0FBZ0s7UUFDbE4sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBdUI7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUUsMENBQTBDO1FBRTdELE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywwQ0FBMEM7SUFDMUcsQ0FBQztDQUNKO0FBaEJELHdEQWdCQyJ9