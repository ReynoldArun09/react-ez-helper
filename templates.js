import { isNextJs, isTypescript, nextJsStructure } from "./index.js";

export const templates = {
  component: (name, cssImport) => `${cssImport ? cssImport : ""}
${isTypescript ? `interface ${name}Props {}\n\n` : ""}
export default function ${name}(${isTypescript ? `props: ${name}Props` : ""}) {
    return (
        <section>
            <h1>${name} Component</h1>
        </section>
    );
}`,
  hook: (name) => `import { useState } from 'react';
  
${isTypescript ? `interface ${name}Props {}\n\n` : ""}const use${name} = () => {
    const [state, setState] = useState${
      isTypescript ? `<${name}Props>` : ""
    }(null);
  
    // Add your hook logic here
  
    return { state, setState };
}
  
export default use${name};
  `,
  page: (name, cssImport) => `${cssImport ? cssImport : ""}
${isTypescript ? `interface ${name}Props {}\n\n` : ""}
export default function ${name}(${
    isTypescript ? `props: ${name}Props` : ""
}) {
    return (
        <section>
              <h1>${name} Component</h1>
        </section>
    );
}`,
  css: () => `/* Add your styles here */`,
  scss: () => `/* Add your styles here */`,
};
