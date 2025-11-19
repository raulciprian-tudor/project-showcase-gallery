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
