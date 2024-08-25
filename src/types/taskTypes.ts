export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
}

export interface AddTaskData {
  userId?: string;
  title: string;
  description?: string;
  status: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
}

export interface EditTaskData {
  title?: string;
  description?: string;
  status?: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
}
