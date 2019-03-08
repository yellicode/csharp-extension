import * as elements from '@yellicode/elements';
import { RenamingTransform, RenameTargets } from '@yellicode/templating';
import { isReservedKeyword } from './utils';

/**
 * Prefixes reserved C# keywords with a "@". This applies to:
 * - Class names
 * - Interface names
 * - Enumeration names
 * - Attribute names
 * - Operation names
 * - Operation parameter names
 */
export class CSReservedKeywordTransform extends RenamingTransform {
    constructor(targets: RenameTargets = RenameTargets.all) {
        super(targets);
    }

    protected rename(name: string, target: elements.Element): string {
        if (!isReservedKeyword(name))
            return name;

        return `@${name}`;
    }
}