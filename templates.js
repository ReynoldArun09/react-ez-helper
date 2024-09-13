import { detectProjectType } from "./index.js";

const {isTypeScript, isNextJs} = detectProjectType

export const templates = {
    component: (name, cssImport) => `${cssImport ? cssImport : ""}
  
  ${isTypeScript ? `interface ${name}Props {}\n\n` : ""}function ${name}(${
      isTypeScript ? `props: ${name}Props` : ""
    }) {
    return (
      <section>
        <h1>${name} Component</h1>
      </section>
    );
  }
  
  export default ${name};
  `,
    hook: (name) => `import { useState } from 'react';
  
  ${isTypeScript ? `interface ${name}Props {}\n\n` : ""}function use${name}() {
    const [state, setState] = useState${
      isTypeScript ? `<${name}Props>` : ""
    }(null);
  
    // Add your hook logic here
  
    return { state, setState };
  }
  
  export default use${name};
  `,
    page: (name, cssImport) => `${cssImport ? cssImport : ""}
  
  ${isTypeScript ? `interface ${name}Props {}\n\n` : ""}${
      isNextJs && nextJsStructure !== "app"
        ? `const ${name} = (${isTypeScript ? `props: ${name}Props` : ""}) => {`
        : isNextJs && nextJsStructure === "app"
        ? `export default function ${name}(${
            isTypeScript ? `props: ${name}Props` : ""
          }) {`
        : `function ${name}(${isTypeScript ? `props: ${name}Props` : ""}) {`
    }
    return (
      <section>
        <h1>${name} Page</h1>
      </section>
    );
  }
  
  ${isNextJs && nextJsStructure === "app" ? "" : `\nexport default ${name};`}
  `,
    css: () => `/* Add your styles here */`,
    scss: () => `/* Add your styles here */`,
  };
