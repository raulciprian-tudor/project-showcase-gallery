export interface ProjectInterface {
  id: string;
  name: string;
  createdDate?: Date;
  developer: string;
  techStack: string;
  status?: string;
}

export interface ProjectFilterInterface {
  name?: string;
  createdDate?: Date;
  developer?: string;
  techStack?: string;
  status?: string;
}

export interface ProjectSortOptions {
  field: 'name' | 'createdDate';
  direction: 'asc' | 'desc';
}
