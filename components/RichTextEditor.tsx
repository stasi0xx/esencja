// src/components/RichTextEditor.tsx
import { useMemo } from "react";
import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.css";

type Props = {
    value: string;
    onChange: (next: string) => void;
    onBlurChange?: (finalValue: string) => void; // opcjonalnie: zapis na blur
    height?: number;
};

export function RichTextEditor({ value, onChange, onBlurChange, height = 360 }: Props) {
    const config = useMemo(
        () => ({
            readonly: false,
            height,
            toolbarSticky: false,
            spellcheck: true,
            // Uproszczony pasek narzędzi – dopasuj do potrzeb
            buttons:
                "bold,italic,underline,strikethrough,|,ul,ol,|,h1,h2,paragraph,|,link,image,table,|,left,center,right,|,undo,redo,eraser",
            // Czyść wklejane treści
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: "insert_clear_html",
            cleanHTML: {
                removeTags: ["script", "style", "iframe"],
                fillEmptyParagraph: false,
            },
            link: { noFollow: true, openInNewTab: true },
            // Nie zapisuj obrazów jako base64
            uploader: { insertImageAsBase64URI: false },
            // Opcjonalne: usuń przyciski, których nie chcesz
            removeButtons: ["file", "video"],
        }),
        [height]
    );

    return (
        <JoditEditor
            value={value}
            config={config as any}
            // onChange strzela często — dobra do “live preview”
            onChange={(html: string) => onChange(html)}
            // Możesz dodatkowo zapisywać na blur, aby ograniczyć setState
            onBlur={(newContent: string) => onBlurChange?.(newContent)}
        />
    );
}