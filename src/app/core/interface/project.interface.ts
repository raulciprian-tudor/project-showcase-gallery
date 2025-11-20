export interface ProjectInterface {
  id: string;
  name: string;
  techStack: string;
  description: string;
}

export interface ProjectFilterInterface {
  name?: string;
  techStack?: string;
}

export interface ProjectSortOptions {
  field: 'name';
  direction: 'asc' | 'desc';
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  topics: string[],
  created_at: string;
  updated_at: string;
  homepage: string;
  stargazers_count: number;
  techStack: [],
}