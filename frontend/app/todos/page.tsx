import Link from "next/link";
import { getTodos } from "../actions";
import TodoActionButtons from "./TodoActionButtons";

export default async function TodoListPage() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Todo List</h1>
            <p className="mt-1 text-sm text-slate-500">
              actions.ts에서 FastAPI 서버 데이터를 불러옵니다.
            </p>
          </div>

          <Link
            href="/todos/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white"
          >
            새 Todo
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="rounded-xl bg-slate-50 py-10 text-center text-slate-400">
            등록된 Todo가 없습니다.
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p
                    className={`font-bold ${
                      todo.is_completed
                        ? "text-slate-400 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {todo.text}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{todo.date}</p>
                </div>

                <TodoActionButtons todo={todo} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}