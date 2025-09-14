import { WizardStore } from "@/lib/store/wizard";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: Partial<WizardStore>;
}

class ProjectService {
  private storageKey = "kosim_projects";

  async saveProject(name: string, data: Partial<WizardStore>): Promise<Project> {
    const projects = await this.getProjects();
    const now = new Date().toISOString();
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
      data
    };

    projects.push(newProject);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    
    return newProject;
  }

  async updateProject(id: string, data: Partial<WizardStore>): Promise<Project> {
    const projects = await this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }

    const updatedProject: Project = {
      ...projects[projectIndex],
      updatedAt: new Date().toISOString(),
      data
    };

    projects[projectIndex] = updatedProject;
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    
    return updatedProject;
  }

  async getProjects(): Promise<Project[]> {
    const projectsJson = localStorage.getItem(this.storageKey);
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) ?? null;
  }

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
  }
}

export const projectService = new ProjectService();
