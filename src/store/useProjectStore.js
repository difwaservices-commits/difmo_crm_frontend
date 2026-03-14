import { create } from 'zustand';
import { projectService, taskService } from '../services/project.service';

const useProjectStore = create((set, get) => ({
    projects: [],
    tasks: [],
    loading: false,
    error: null,

    fetchProjects: async (companyId) => {
        set({ loading: true, error: null });
        try {
            const response = await projectService.getAll(companyId);
            set({ projects: response.data || response || [], loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchTasks: async (projectId) => {
        set({ loading: true });
        try {
            const data = await taskService.getAll(projectId);
            set({ tasks: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createProject: async (projectData, companyId) => {
        try {
            await projectService.create(projectData);
            await get().fetchProjects(companyId);
        } catch (error) {
            throw error;
        }
    },

    updateProject: async (id, projectData, companyId) => {
        try {
            await projectService.update(id, projectData);
            await get().fetchProjects(companyId);
        } catch (error) {
            throw error;
        }
    },

    deleteProject: async (id, companyId) => {
        try {
            await projectService.delete(id);
            await get().fetchProjects(companyId);
        } catch (error) {
            throw error;
        }
    },

    createTask: async (taskData, projectId) => {
        try {
            await taskService.create(taskData);
            await get().fetchTasks(projectId);
        } catch (error) {
            throw error;
        }
    }
}));

export default useProjectStore;
