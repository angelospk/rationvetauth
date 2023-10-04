/**
 * @param {string} text
 */
export function normalizeGreek(text) {
    console.log(text);
    text = text.replace(/Ά|Α|ά/g, 'α')
        .replace(/Έ|Ε|έ/g, 'ε')
        .replace(/Ή|Η|ή/g, 'η')
        .replace(/Ί|Ϊ|Ι|ί|ΐ|ϊ/g, 'ι')
        .replace(/Ό|Ο|ό/g, 'ο')
        .replace(/Ύ|Ϋ|Υ|ύ|ΰ|ϋ/g, 'υ')
        .replace(/Ώ|Ω|ώ/g, 'ω')
        .replace(/Σ|ς/g, 'σ');
    return text;
}