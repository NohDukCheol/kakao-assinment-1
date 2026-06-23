export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-blue-600">Todo List</h1>

        <div className="mt-6 rounded-xl bg-slate-50 py-10 text-center text-slate-400">
          Todo 데이터를 불러오는 중입니다...
        </div>
      </section>
    </main>
  );
}