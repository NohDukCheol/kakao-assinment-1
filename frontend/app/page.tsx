import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Next.js Todo App
        </h1>

        <p className="text-slate-600 mb-6">
          Vite 기반 Todo 앱을 Next.js App Router와 FastAPI 구조로 다시 구현하는 과제입니다.
        </p>

        <div className="rounded-xl bg-blue-50 p-4 mb-6">
          <h2 className="font-bold text-blue-600 mb-2">구현 예정 기능</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>Todo 목록 조회</li>
            <li>Todo 생성</li>
            <li>Todo 수정</li>
            <li>Todo 완료 상태 변경</li>
            <li>Todo 삭제</li>
            <li>FastAPI 백엔드 연동</li>
          </ul>
        </div>

        <Link
          href="/todos"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-bold text-white"
        >
          Todo 목록으로 이동
        </Link>
      </section>
    </main>
  );
}