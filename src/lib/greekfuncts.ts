import type { AnimalReqs, Feed, Req, State } from "./stores/types";

/**Delete accents from greek text
 * @param {string} text - 
 * @returns {string} - Normalized text
 */
export function normalizeGreek(text: string) {
  text = text.replace(/Ά|Α|ά/g, 'α')
    .replace(/Έ|Ε|έ/g, 'ε')
    .replace(/Ή|Η|ή/g, 'η')
    .replace(/Ί|Ϊ|Ι|ί|ΐ|ϊ/g, 'ι')
    .replace(/Ό|Ο|ό/g, 'ο')
    .replace(/Ύ|Ϋ|Υ|ύ|ΰ|ϋ/g, 'υ')
    .replace(/Ώ|Ω|ώ/g, 'ω')
    .replace(/Σ|ς/g, 'σ');
  return text as string;
}
/**
@param {object} inputObj - Input object of requirements to be transformed
 * @returns {object} - Transformed object
 */
export function transformObject(inputObj: object) {
  const outputObj: AnimalReqs = { reqs: [], fractions: {} };

  for (const [key, value] of Object.entries(inputObj)) {
    // Initialize the object to hold 'value' and 'type' for each key
    let transformedValue: Req = { Title: "", type: "", value: 0 };

    // Check if value is a number
    if (typeof value === 'number') {
      transformedValue.value = value;
      transformedValue.type = '=';
    }
    // Check if value is a string
    else if (typeof value === 'string') {
      // Check for '<' followed by a number
      if (value.startsWith('<')) {
        transformedValue.value = parseFloat(value.substring(1));
        transformedValue.type = '<';
      }
      // Check for '-' between two numbers
      else if (value.includes('-')) {
        const [lower, upper] = value.split('-').map(Number);
        transformedValue.value = lower;
        transformedValue.type = '-';
        transformedValue.topValue = upper;
      }
      else if (value.startsWith('>')) {
        transformedValue.value = parseFloat(value.substring(1));
        transformedValue.type = '>';
      }
      // Handle other cases
      else {
        // Custom handling for other cases can go here
      }
    }
    transformedValue.Title = key;
    // Add transformed value to the 'reqs' object
    outputObj.reqs.push(transformedValue);
  }

  return outputObj as AnimalReqs;
}
/** 
@param {object} inputObj - Input object of requirements to be reverse transformed
 * @returns {object} - Reverse Transformed object
 */
export function reverseTransformObject(inputObj: AnimalReqs): object {
  const outputObj: { [key: string]: string } = {};

  for (const req of inputObj.reqs) {
    // Check the 'type' and reverse transform the value accordingly
    switch (req.type) {
      case '=':
        outputObj[req.Title] = req.value;
        break;
      case '<':
        outputObj[req.Title] = `<${req.value}`;
        break;
      case '-':
        if (req.topValue !== undefined) {
          outputObj[req.Title] = `${req.value}-${req.topValue}`;
        }
        break;
      case '>':
        outputObj[req.Title] = `>${req.value}`;

        break;
      default:
        // Handle other types if needed
        break;
    }
  }

  return outputObj;
}

/** returns integer or fixed up to 2 decimals number
@param {number}  - number to be formatted
* @returns {string} - fixed number
*/
export function formatNumber(number: number | undefined | null) {
  if (number === undefined || number === null) return '';
  return Number.isInteger(number) ? number.toString() : number.toFixed(2);
}


