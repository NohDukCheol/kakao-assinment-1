"use server";

export type Todo = {
  id: number;
  text: string;
  is_completed: boolean;
  date: string;
};

const BACKEND_URL = process.env.BACKEND_URL;

function getBackendUrl() {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL 환경변수가 설정되지 않았습니다.");
  }

  return BACKEND_URL;
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${getBackendUrl()}/todos`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getTodoById(todoId: string): Promise<Todo | null> {
  const todos = await getTodos();
  const todo = todos.find((item) => item.id === Number(todoId));

  return todo ?? null;
}