export type Job = {
  id: string;
  company: string;
  position: string;
  status: string;
  salary?: string;
  location?: string;
  type?: string;
  url?: string;
  description?: string;
  order: number;
  columnId?: string;
};

export type Column = {
  id: string;
  name: string;
  boardId: string;
  order: number;
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
