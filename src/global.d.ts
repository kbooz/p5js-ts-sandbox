import "p5/global";

interface ExportedModule {
  draw: () => void;
  setup: () => void;
}

type Project = {
  id: string;
  name: string;
  method: () => Promise<ExportedModule>;
}

declare global {
  interface Window extends ExportedModule {
  }
  interface ImportMeta {
    glob: (path: string) => {[key: string]: () => Promise<ExportedModule>}
  }
}
