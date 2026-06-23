"use client";

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

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();

  const [text, setText] = useState(todo.text);
  const [date, setDate] = useState(todo.date);
  const [isCompleted, setIsCompleted] = useState(todo.is_completed);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text.trim() === "") {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch(`${getApiUrl()}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        date,
        is_completed: isCompleted,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage("Todo 수정에 실패했습니다.");
      return;
    }

    router.push("/todos");
    router.refresh();
  };

  return (
    <form onSubmit={updateTodo} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-600">
          할 일
        </label>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-600">
          날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(event) => setIsCompleted(event.target.checked)}
        />
        완료 처리
      </label>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white disabled:bg-slate-300"
      >
        {isSubmitting ? "수정 중..." : "Todo 수정"}
      </button>
    </form>
  );
}