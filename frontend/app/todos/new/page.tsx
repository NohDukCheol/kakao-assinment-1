import Link from "next/link";
import NewTodoForm from "./NewTodoForm";

export default function NewTodoPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-600">Todo 생성</h1>

          <Link href="/todos" className="text-sm font-bold text-slate-500">
            목록으로
          </Link>
        </div>

        <NewTodoForm />
      </section>
    </main>
  );
}