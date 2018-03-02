"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("@yellicode/model");
class XmlDocUtility {
    static getXmlDocLineForParameter(parameter) {
        const commentBodies = XmlDocUtility.joinCommentBodies(parameter);
        return parameter.direction === model.ParameterDirectionKind.return ? `<returns>${commentBodies}</returns>`
            : `<param name=\"${parameter.name}\">${commentBodies}</param>`;
    }
    static getXmlDocLinesForParameters(parameters) {
        if (parameters == null)
            return [];
        var lines = [];
        parameters.forEach((p) => {
            lines.push(XmlDocUtility.getXmlDocLineForParameter(p));
        });
        return lines;
    }
    static joinCommentBodies(element) {
        if (!element.ownedComments)
            return '';
        const bodies = element.ownedComments.map((c) => c.body);
        return bodies.join(' ');
    }
}
exports.XmlDocUtility = XmlDocUtility;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLWRvYy11dGlsaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsieG1sLWRvYy11dGlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTBDO0FBRTFDO0lBQ1csTUFBTSxDQUFDLHlCQUF5QixDQUFDLFNBQTBCO1FBQzlELE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLGFBQWEsWUFBWTtZQUN0RyxDQUFDLENBQUMsaUJBQWlCLFNBQVMsQ0FBQyxJQUFJLE1BQU0sYUFBYSxVQUFVLENBQUM7SUFDdkUsQ0FBQztJQUVNLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxVQUE2QjtRQUNuRSxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFZCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQWtCLEVBQUUsRUFBRTtZQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQXNCO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUVKO0FBeEJELHNDQXdCQyJ9