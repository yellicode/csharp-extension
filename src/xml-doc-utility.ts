import * as elements from '@yellicode/elements';

export class XmlDocUtility {
    public static getXmlDocLineForParameter(parameter: elements.Parameter): string {
        const commentBodies = XmlDocUtility.joinCommentBodies(parameter);
        return parameter.direction === elements.ParameterDirectionKind.return ? `<returns>${commentBodies}</returns>`
            : `<param name=\"${parameter.name}\">${commentBodies}</param>`;
    }

    public static getXmlDocLinesForParameters(parameters: elements.Parameter[]): string[] {
        if (parameters == null)
            return [];

        var lines: string[] = [];
        parameters.forEach((p: elements.Parameter) => {
            lines.push(XmlDocUtility.getXmlDocLineForParameter(p));
        });
        return lines;
    }

    private static joinCommentBodies(element: elements.Element): string {
        if (!element.ownedComments) return '';
        const bodies = element.ownedComments.map((c: elements.Comment) => c.body);
        return bodies.join(' ');
    }
}