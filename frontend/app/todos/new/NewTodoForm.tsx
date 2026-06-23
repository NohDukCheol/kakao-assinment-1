"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");
  }

  return API_URL;
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

export default function NewTodoForm() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [date, setDate] = useState(getToday());
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text.trim() === "") {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch(`${getApiUrl()}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        date,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage("Todo 생성에 실패했습니다.");
      return;
    }

    router.push("/todos");
    router.refresh();
  };

  return (
    <form onSubmit={createTodo} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-600">
          할 일
        </label>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="할 일을 입력하세요"
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

      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white disabled:bg-slate-300"
      >
        {isSubmitting ? "생성 중..." : "Todo 생성"}
      </button>
    </form>
  );
}