export declare namespace Type {
  interface ToDoList {
    data: ToDo[];
  }
  interface ToDo {
    id: string;
    todo: string;
    isComplete: boolean;
    createAt: string;
  }
  interface ToDoInput {
    id?: string;
    todo?: string;
    isComplete?: boolean;
    createAt?: string;
  }
  interface UpdateData {
    id?: string;
    todo?: string;
    isComplete?: boolean;
  }
}
