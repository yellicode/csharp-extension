import * as model from '@yellicode/model';

export class XmlDocUtility {
    public static getXmlDocLineForParameter(parameter: model.Parameter): string {
        const commentBodies = XmlDocUtility.joinCommentBodies(parameter);
        return parameter.direction === model.ParameterDirectionKind.return ? `<returns>${commentBodies}</returns>`
            : `<param name=\"${parameter.name}\">${commentBodies}</param>`;
    }

    public static getXmlDocLinesForParameters(parameters: model.Parameter[]): string[] {
        if (parameters == null)
            return [];

        var lines: string[] = [];
        parameters.forEach((p: model.Parameter) => {
            lines.push(XmlDocUtility.getXmlDocLineForParameter(p));
        });
        return lines;
    }

    private static joinCommentBodies(element: model.Element): string {
        if (!element.ownedComments) return '';
        const bodies = element.ownedComments.map((c: model.Comment) => c.body);
        return bodies.join(' ');
    }
}