import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodoById } from "../../actions";
import EditTodoForm from "./EditTodoForm";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodoById(todoId);

  if (!todo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-600">Todo 수정</h1>

          <Link href="/todos" className="text-sm font-bold text-slate-500">
            목록으로
          </Link>
        </div>

        <EditTodoForm todo={todo} />
      </section>
    </main>
  );
}