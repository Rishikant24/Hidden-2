export function checkJSON(inputString: string | null) {
    if(inputString === null) return null;

    const startIndex = inputString.indexOf('{');
    const endIndex = inputString.lastIndexOf('}');
  
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      return JSON.parse(inputString.substring(startIndex, endIndex + 1));
    }
  
    // If no '{' or '}' found, or if '}' appears before '{' 
    return null;
  }
  
 
  