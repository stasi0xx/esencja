// TypeScript
// src/utils/sanitizeHtml.ts
import DOMPurify from "dompurify";

const ALLOWED_CSS_PROPS = [
    "text-align",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "color",
    "background-color",
];

let hooksReady = false;
function ensureHooks() {
    if (hooksReady) return;

    DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
        if (data.attrName === "style") {
            const clean = data.attrValue
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((rule) => {
                    const [prop] = rule.split(":").map((s) => s.trim().toLowerCase());
                    return ALLOWED_CSS_PROPS.includes(prop);
                })
                .join("; ");
            if (clean) data.attrValue = clean;
            else data.keepAttr = false; // usuń style, jeśli nic dozwolonego nie zostało
        }
    });

    hooksReady = true;
}

export function sanitizeHtml(html: string) {
    ensureHooks();
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p","br","strong","em","u","s","blockquote",
            "ul","ol","li","a","img",
            "table","thead","tbody","tr","th","td",
            "h1","h2","h3","h4","h5","h6",
            "code","pre","hr","span","div"
        ],
        ALLOWED_ATTR: [
            "href","target","rel",
            "src","alt","title","width","height",
            "colspan","rowspan",
            "class","style" // kluczowe: pozwalamy na style (filtrowane hookiem)
        ],
        ALLOW_DATA_ATTR: false,
        // FORBID_TAGS: ["script","iframe","style"], // dodatkowa ochrona
    });
}