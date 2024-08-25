import { mixed, object, ref, string } from "yup";

export interface LoginSchema {
  email: string;
  password: string;
}

export interface CreateAccountSchema {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangeUserDataSchema {
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
}

export interface CreateTaskSchema {
  title: string;
  description?: string | null;
  priority: "high" | "medium" | "low";
  dueDate: string;
}

// Define the schemas with types
export const loginSchema = object<LoginSchema>({
  email: string()
    .required("This field is required")
    .email("Valid email is required"),
  password: string().required("This field is required"),
});

export const createAccountSchema = object<CreateAccountSchema>({
  firstName: string().required("This field is required").min(3),
  lastName: string(),
  email: string()
    .required("This field is required")
    .email("Valid email is required"),
  password: string().required("This field is required").min(3),
  confirmPassword: string()
    .required("You must confirm your password")
    .oneOf([ref("password")], "Passwords must match"),
});

export const changeUserDataSchema = object<ChangeUserDataSchema>({
  firstName: string().required("This field is required").min(3),
  lastName: string(),
  email: string()
    .required("This field is required")
    .email("Valid email is required"),
  password: string(),
});

export const createTaskSchema = object<CreateTaskSchema>({
  title: string()
    .required("This field is required")
    .min(3, "Minimum text length is 3 characters"),
  description: string().nullable(),
  priority: mixed<"high" | "medium" | "low">()
    .required("This field is required")
    .oneOf(["high", "medium", "low"], "Invalid priority selected"),
  dueDate: string().required("This field is required"),
});
