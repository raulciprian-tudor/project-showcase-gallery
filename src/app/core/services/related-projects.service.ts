import { Injectable } from '@angular/core';
import { GitHubRepo } from '../interface/project.interface';

/**
 * Service for finding related projects based on technology stack matching.
 */
@Injectable({
    providedIn: 'root'
})
export class RelatedProjectsService {
    /**
   * Finds related projects based on matching tech stack.
   * 
   * @param currentProject - The reference project
   * @param allProjects - Complete list of projects to search
   * @param maxResults - Maximum number of related projects to return (default: 4)
   * @returns GitHubRepo[] - Array of related projects sorted by relevance
   * 
   * Algorithm:
   * 1. Filters out current project and projects without tech stack
   * 2. Calculates match score based on number of matching technologies
   * 3. Sorts by match score (descending), then by star count (descending)
   * 4. Returns top N results
   */
    findRelatedProjects(currentProject: GitHubRepo, allProjects: GitHubRepo[], maxResults: number = 4): GitHubRepo[] {
        // Return empty if current project has no tech stack
        if (!currentProject.techStack || currentProject.techStack.length === 0) {
            return [];
        }

        const related = allProjects
            .filter(project => this.isRelatedProject(project, currentProject))
            .map(project => ({
                project,
                matchScore: this.calculateMatchScore(project, currentProject)
            }))
            .sort((a, b) => this.compareProjects(a, b))
            .slice(0, maxResults)
            .map(item => item.project)

        return related;
    }

    /**
   * Checks if a project is related to the current project.
   * 
   * @param project - Project to check
   * @param currentProject - Reference project
   * @returns boolean - true if projects share at least one technology
   */
    private isRelatedProject(project: GitHubRepo, currentProject: GitHubRepo): boolean {
        // Exclude the current project itself
        if (project.id === currentProject.id) {
            return false;
        }

        // Exclude projects without stack
        if (!project.techStack || project.techStack.length === 0) {
            return false;
        }

        // Check for at least one matching technology
        const matchingTech = project.techStack.filter(tech => currentProject.techStack?.includes(tech));
        return matchingTech.length > 0;
    }

    /**
   * Calculates match score based on number of shared technologies.
   * 
   * @param project - Project to score
   * @param currentProject - Reference project
   * @returns number - Count of matching technologies
   */
    private calculateMatchScore(project: GitHubRepo, currentProject: GitHubRepo): number {
        return project.techStack!.filter(tech =>
            currentProject.techStack?.includes(tech)
        ).length;
    }

    /**
     * Compares two projects for sorting.
     * Primary sort: Match score (descending)
     * Secondary sort: Star count (descending)
     * 
     * @param a - First project with match score
     * @param b - Second project with match score
     * @returns number - Comparison result for sort
     */
    private compareProjects(
        a: { project: GitHubRepo; matchScore: number },
        b: { project: GitHubRepo, matchScore: number }
    ): number {
        // Sort by match score first
        if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
        }

        // If match scores are equal, sort by stars
        return (b.project.stargazers_count || 0) - (a.project.stargazers_count || 0);
    }
}
