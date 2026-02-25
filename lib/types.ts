export type Job = {
  id: string;
  company: string;
  position: string;
  status: string;
  salary?: string | null;
  location?: string | null;
  jobType?: string | null;
  url?: string | null;
  jobMode?: string | null;
  description?: string | null;
  order: number;
  columnId: string;
};

export type Column = {
  id: string;
  name: string;
  boardId: string;
  order: number;
  jobs: Job[];
  createdAt: Date;
  updatedAt: Date;
};

export type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
};
