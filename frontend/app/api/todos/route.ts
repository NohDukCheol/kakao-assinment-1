const BACKEND_URL = process.env.BACKEND_URL;

function getBackendUrl() {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL 환경변수가 설정되지 않았습니다.");
  }

  return BACKEND_URL;
}

export async function GET() {
  const response = await fetch(`${getBackendUrl()}/todos`, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${getBackendUrl()}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}