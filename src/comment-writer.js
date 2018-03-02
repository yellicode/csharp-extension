"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
class CSharpCommentWriter {
    constructor(writer, typeNameProvider, maxCommentWidth) {
        this.writer = writer;
        this.typeNameProvider = typeNameProvider;
        this.maxCommentWidth = maxCommentWidth;
    }
    writeDelimitedCommentParagraph(text) {
        if (text == null)
            return;
        const lines = [text];
        this.writer.writeLine("/*");
        this.writeCommentLines(lines, "* ");
        this.writer.writeLine("*/");
    }
    writeDelimitedCommentLines(lines) {
        if (lines == null)
            return;
        this.writer.writeLine("/*");
        this.writeCommentLines(lines, "* ");
        this.writer.writeLine("*/");
    }
    writeCommentLines(lines, prefix) {
        if (!lines)
            return;
        lines.forEach(line => {
            if (line == null)
                return;
            if (this.maxCommentWidth > 0 && line.length > this.maxCommentWidth) {
                // See if we can split the line
                const split = templating_1.CodeWriterUtility.wordWrap(line, this.maxCommentWidth);
                split.forEach(s => {
                    this.writer.writeLine(`${prefix}${s}`);
                });
            }
            else
                this.writer.writeLine(`${prefix}${line}`);
        });
    }
}
exports.CSharpCommentWriter = CSharpCommentWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC13cml0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tZW50LXdyaXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNEQUF3RjtBQUV4RjtJQUVJLFlBQW9CLE1BQWtCLEVBQVUsZ0JBQWtDLEVBQVUsZUFBdUI7UUFBL0YsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBUTtJQUVuSCxDQUFDO0lBR00sOEJBQThCLENBQUMsSUFBWTtRQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRU0sMEJBQTBCLENBQUMsS0FBZTtRQUM3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDL0IsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEtBQWUsRUFBRSxNQUFlO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRW5CLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDYixNQUFNLENBQUM7WUFFWCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSwrQkFBK0I7Z0JBQy9CLE1BQU0sS0FBSyxHQUFhLDhCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUMvRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQztZQUNELElBQUk7Z0JBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXZDRCxrREF1Q0MifQ==