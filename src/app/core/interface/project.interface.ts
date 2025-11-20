export interface ProjectFilterState {
  searchTerm: string;
  selectedTechs: string[];
  sortOption: string;
  viewMode: 'grid' | 'list';
}

export interface GitHubRepo {
  id: number;
  name?: string;
  description?: string;
  url?: string;
  language?: string;
  topics?: string[],
  created_at?: string;
  updated_at?: string;
  homepage?: string;
  stargazers_count?: number;
  techStack?: string[],
}