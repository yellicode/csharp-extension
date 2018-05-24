import * as elements from '@yellicode/elements';
import { RenamingTransform, RenameTargets } from '@yellicode/templating';

const reservedKeywords = ["abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked", "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else",
    "enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for", "foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is", "lock", "long", "namespace", "new",
    "null", "object", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "short", "sizeof", "stackalloc", "static", "string",
    "struct", "switch", "this", "throw", "true", "try", "typeof", "uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual", "void", "volatile", "while"];

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
        if (reservedKeywords.indexOf(name) === -1)
            return name;

        return `@${name}`;
    }
}