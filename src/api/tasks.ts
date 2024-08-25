import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { Task, AddTaskData, EditTaskData } from "../types/taskTypes";

// Utility type to allow for partial updates, including nested objects
type FirestoreUpdate<T> = {
  [K in keyof T]?: T[K] extends object ? FirestoreUpdate<T[K]> : T[K];
};

// Fetch all tasks for a user
const fetchTasks = async (userId: string): Promise<Task[]> => {
  try {
    if (!userId) return [];

    const q = query(collection(db, "todos"), where("userId", "==", userId));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw new Error(
      `Unable to fetch tasks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Fetch a single task by its ID
const fetchTask = async (taskId: string): Promise<Task> => {
  try {
    const docRef = doc(db, "todos", taskId);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Task;
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error("Failed to fetch task:", error);
    throw new Error(
      `Unable to fetch task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Add a new task
const addTask = async (taskData: AddTaskData): Promise<void> => {
  try {
    const { title } = taskData;

    const tasksQuery = query(
      collection(db, "todos"),
      where("title", "==", title)
    );

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      tasksQuery
    );
    if (querySnapshot.empty) {
      await addDoc(collection(db, "todos"), taskData);
    } else {
      throw new Error("A task with the same title already exists.");
    }
  } catch (error) {
    console.error("Failed to add task:", error);
    throw new Error(
      `${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// Edit an existing task
const editTask = async (
  taskId: string,
  taskData: FirestoreUpdate<EditTaskData>
): Promise<void> => {
  try {
    const taskRef = doc(db, "todos", taskId);
    await updateDoc(taskRef, taskData);
  } catch (error) {
    console.error("Failed to edit task:", error);
    throw new Error(
      `Unable to edit task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Delete a task
const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "todos", taskId));
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error(
      `Unable to delete task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Toggle the status of a task
const toggleTaskStatus = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, "todos", taskId);
    const taskSnap: DocumentSnapshot<DocumentData> = await getDoc(taskRef);

    if (taskSnap.exists()) {
      await updateDoc(taskRef, {
        status: !taskSnap.data()?.status,
      });
    } else {
      throw new Error("Task not found for status toggle");
    }
  } catch (error) {
    console.error("Failed to toggle task status:", error);
    throw new Error(
      `Unable to toggle task status: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export {
  fetchTasks,
  deleteTask,
  toggleTaskStatus,
  addTask,
  editTask,
  fetchTask,
};
