import { ParameterDefinition, DefinitionBase, MethodDefinition } from './model';

export class XmlDocUtility {
    public static getXmlDocLineForParameter(parameter: ParameterDefinition): string | null {
        if (!parameter.xmlDocSummary) return null;

        const commentBodies = XmlDocUtility.joinCommentBodies(parameter.xmlDocSummary);
        return `<param name=\"${parameter.name}\">${commentBodies}</param>`;       
    }

    public static getXmlDocLineForReturnParameter(method: MethodDefinition): string | null {
        if (!method.xmlDocReturns) return null;

        const commentBodies = XmlDocUtility.joinCommentBodies(method.xmlDocReturns);
        return `<returns>${commentBodies}</returns>`;
    }

    public static getXmlDocLinesForInOutParameters(parameters: ParameterDefinition[]): string[] {
        if (!parameters)
            return [];

        var lines: string[] = [];
        parameters.forEach((p: ParameterDefinition) => {
            const l = XmlDocUtility.getXmlDocLineForParameter(p);            
            if (l) lines.push(l);
        });        
        return lines;
    }

    private static joinCommentBodies(bodies: string[]): string {
        if (!bodies) return '';        
        return bodies.join(' ');
    }
}