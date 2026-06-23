"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  is_completed: boolean;
  date: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");
  }

  return API_URL;
}

export default function TodoActionButtons({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggleTodo = async () => {
    setIsLoading(true);

    await fetch(`${getApiUrl()}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_completed: !todo.is_completed,
      }),
    });

    setIsLoading(false);
    router.refresh();
  };

  const deleteTodo = async () => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");

    if (!isConfirmed) return;

    setIsLoading(true);

    await fetch(`${getApiUrl()}/todos/${todo.id}`, {
      method: "DELETE",
    });

    setIsLoading(false);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={toggleTodo}
        disabled={isLoading}
        className="rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white disabled:bg-slate-300"
      >
        {todo.is_completed ? "취소" : "완료"}
      </button>

      <Link
        href={`/todos/${todo.id}`}
        className="rounded bg-slate-600 px-3 py-1 text-sm font-bold text-white"
      >
        수정
      </Link>

      <button
        type="button"
        onClick={deleteTodo}
        disabled={isLoading}
        className="rounded bg-red-500 px-3 py-1 text-sm font-bold text-white disabled:bg-slate-300"
      >
        삭제
      </button>
    </div>
  );
}