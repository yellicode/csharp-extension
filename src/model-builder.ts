import * as elements from '@yellicode/elements';
import * as opts from './options';
import { ClassDefinition, InterfaceDefinition } from './model';
import { Classifier } from '@yellicode/elements';

export class ModelBuilder {
    public static buildClassDefinition(type: elements.Type, options?: opts.ClassOptions): ClassDefinition {
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;

        const definition: ClassDefinition = { name: type.name };

        if (features & opts.ClassFeatures.XmlDocSummary) {
            definition.xmlDocSummary = ModelBuilder.buildXmlDocSummary(type);
        }

        definition.isPartial = options.isPartial;
        if (elements.isClassifier(type)) {
            definition.inherits = ModelBuilder.buildInherits(type, options.inherits);
        }

        if (elements.isClass(type)) {
            definition.isAbstract = type.isAbstract;
            definition.implements = ModelBuilder.buildImplements(type, options.implements);
        }
        return definition;
    }

    public static buildInterfaceDefinition(type: elements.Type, options?: opts.InterfaceOptions): InterfaceDefinition { 
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;

        const definition: InterfaceDefinition = { name: type.name };

        if (features & opts.InterfaceFeatures.XmlDocSummary) {
            definition.xmlDocSummary = ModelBuilder.buildXmlDocSummary(type);
        }

        definition.isPartial = options.isPartial;
        if (elements.isClassifier(type)) {
            definition.inherits = ModelBuilder.buildInherits(type, options.inherits);
        }      
        return definition;
    }

    private static buildInherits(type: Classifier, additional: string[] | undefined): string[] | undefined {
        const allNames: string[] = [];
        if (type.generalizations) {
            // todo: allow qualifiedName
            allNames.push(...type.generalizations.map(g => g.general.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames.length ? allNames : undefined;
    }

    private static buildImplements(type: elements.Class, additional: string[] | undefined): string[] | undefined {
        const allNames: string[] = [];
        if (type.interfaceRealizations) {
            // todo: allow qualifiedName 
            allNames.push(...type.interfaceRealizations.map(ir => ir.contract.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames.length ? allNames : undefined;
    }

    private static buildXmlDocSummary(element: elements.Element): string[] | undefined {
        if (!element.ownedComments || !element.ownedComments.length) {
            return;
        }

        return element.ownedComments.map(c => c.body);
    }
}