export function parseSTEPFile(fileContent) {
  // Split file content into lines
  const lines = fileContent.toString().split(";");
  
  let PRODUCT_DEFINITIONS = [];
  let NEXT_ASSEMBLY_USAGE_OCCURRENCE = [];

  // Parse file content
  lines.forEach(line => {
    const lineString = line.replace(/[\r\n]+/gm, "");
    
    if (lineString.includes("PRODUCT_DEFINITION(")) {
      PRODUCT_DEFINITIONS.push(lineString);
    } else if (lineString.includes("NEXT_ASSEMBLY_USAGE_OCCURRENCE(")) {
      NEXT_ASSEMBLY_USAGE_OCCURRENCE.push(lineString);
    }
  });

  // Parse relations and products
  const relations = parseNextAssemblyUsage(NEXT_ASSEMBLY_USAGE_OCCURRENCE);
  const products = parseProductDefinition(PRODUCT_DEFINITIONS);

  // Convert to brick format
  return convertToBricks(products, relations);
}

function parseNextAssemblyUsage(assemblies) {
  return assemblies.map(element => {
    const endOfKey = element.indexOf("=");
    const newKey = element.slice(1, endOfKey);
    let newName, upperPart, lowerPart;

    const entries = element.split(",");
    entries.forEach(entry => {
      if (entry.includes("'")) {
        newName = entry.replace(/['\)]/g, "");
      } else if (entry.includes("#") && !upperPart) {
        upperPart = entry.replace(/[#]/g, "");
      } else if (entry.includes("#")) {
        lowerPart = entry.replace(/[#]/g, "");
      }
    });

    return {
      key: newKey,
      container: upperPart,
      contains: lowerPart,
      containedName: newName
    };
  });
}

function parseProductDefinition(products) {
  return products.map(element => {
    const endOfKey = element.indexOf("=");
    const newKey = element.slice(1, endOfKey);
    let newName;

    const entries = element.split(",");
    entries.forEach(entry => {
      if (entry.includes("'")) {
        newName = entry.replace(/['\)]/g, "");
      }
    });

    return {
      key: newKey,
      name: newName
    };
  });
}

function convertToBricks(products, relations) {
  // Convert STEP assembly structure to brick dimensions
  const bricks = products.map(product => {
    // Basic conversion - you may want to adjust this based on your needs
    return {
      x: 1,
      z: 1,
      name: product.name,
      customBrick: true
    };
  });

  return bricks;
}