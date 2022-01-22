import type { Project } from "./global";
import slugifier from "./utils/slugifier";

export default class App {

    private projects: Project[]

    public selectedProject: Project

    constructor(projectName: string) {
        this.projects = this.loadProjects()
        this.selectedProject = this.loadProject(projectName)
    }

    private loadProjects() {
        // Imports any project file
        const projects = import.meta.glob("./projects/**/index.ts")

        // Gets Project name based on its file directory
        // Ex.:
        // File directory: /projects/0.1-Sample/index.ts
        // Project name: 0.1-Sample
        const regexProjectName = /\.\/projects\/(.*)\/index\.ts/

        return Object.keys(projects).map(
            (rawName) => {
                const name = rawName.replace(regexProjectName,"$1");
                const id = slugifier(name)

                return {
                    id,
                    name,
                    method: projects[rawName]
                }
            }
        ) as Project[]
    }

    private loadProject(projectName: string) {
        const fallbackProject = this.selectedProject ?? this.projects[0];

        const selectedProject = !projectName ? fallbackProject : this.projects.find(({id}) => id === projectName) ?? fallbackProject;

        return selectedProject;
    }

    private displayProjectsList(defaultProject?: string) {
        const selectTag = document.createElement("select");
        selectTag.id = "project";
        selectTag.append(...this.projects.map(project => {
            const optionTag = document.createElement("option");
            optionTag.setAttribute("value", slugifier(project.name))
            optionTag.innerText = project.name;
            return optionTag;
        }))
        selectTag.value = defaultProject;
        selectTag.addEventListener("change", (event) => this.navigateToProject((event.target as  HTMLSelectElement).value))
        document.body.append(selectTag);
    }

    private async startProject(project:Project) {
        const { setup, draw } = await project.method()

        window.setup = setup;
        
        window.draw = draw;
    }

    private setMain() {
        const mutationObserver = new MutationObserver((list, el) => {
            if(list?.[0]?.addedNodes?.[0]?.nodeName === "MAIN") {
                console.log(list?.[0]?.addedNodes?.[0]);
                (list?.[0]?.addedNodes?.[0] as HTMLDivElement).setAttribute("id", "project-container");
                el.disconnect()
            }
        })

        mutationObserver.observe(document.body, {
            childList: true,
            attributeFilter: ["main"],
        })
    }


    private navigateToProject(projectName: string) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("project", projectName)
        window.location.search = searchParams.toString()
    }

    public async start(projectName?: string) {
        this.displayProjectsList(projectName);
        await this.startProject(this.selectedProject)
        this.setMain()
    }

}