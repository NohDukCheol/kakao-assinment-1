"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 text-center shadow">
        <h1 className="text-2xl font-bold text-red-500">
          Todo 데이터를 불러오지 못했습니다.
        </h1>

        <p className="mt-4 text-sm text-slate-500">{error.message}</p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}