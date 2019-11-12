import { TextWriter, CodeWriterUtility } from '@yellicode/core';

export class CSharpCommentWriter {

    constructor(private writer: TextWriter, private maxCommentWidth: number) {

    }

    public writeDelimitedCommentParagraph(text: string) {
        if (text == null) return;
        const lines = [text];
        this.writer.writeLine("/*");
        this.writeCommentLines(lines, "* ");
        this.writer.writeLine("*/")
    }

    public writeDelimitedCommentLines(lines: string[]) {
        if (lines == null) return;
        this.writer.writeLine("/*");
        this.writeCommentLines(lines, "* ");
        this.writer.writeLine("*/")
    }

    public writeCommentLines(lines: string[], prefix?: string) {
        if (!lines) return;

        lines.forEach(line => {
            if (line == null)
                return;

            if (this.maxCommentWidth > 0 && line.length > this.maxCommentWidth) {
                // See if we can split the line
                const split: string[] = CodeWriterUtility.wordWrap(line, this.maxCommentWidth);
                split.forEach(s => {
                    this.writer.writeLine(`${prefix}${s}`);
                })
            }
            else this.writer.writeLine(`${prefix}${line}`);
        });
    }
}