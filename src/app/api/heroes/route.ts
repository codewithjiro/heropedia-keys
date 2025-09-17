export async function GET() {
  const apiKey = process.env.MY_KEY;
  const url = "https://ipt-keys.vercel.app/api/ping";

  const apiRes = await fetch(url, {
    headers: {
      "x-api-key": apiKey || "",
    },
  });

  // If the response is not JSON, return an error
  const contentType = apiRes.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await apiRes.text();
    console.error("API error response:", text);
    return new Response(text, { status: apiRes.status });
  }

  const response = await apiRes.json();

  // Transform response -> Hero[]
  const heroes = (response.data || []).map((hero: any) => ({
    id: Number(hero.id),
    heroName: hero.heroName,
    role: hero.role,
    pickRate: hero.pickRate,
    description: hero.description,
    heroImage: hero.heroImage,
  }));

  return Response.json(heroes, { status: apiRes.status });
}

export async function POST(request: Request) {
  const apiKey = process.env.MY_KEY;
  const { keyword } = await request.json();

  const url = "https://ipt-keys.vercel.app/api/echo";

  const apiRes = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postBody: keyword, 
      action: "search_heroes", 
    }),
  });

  // If the response is not JSON, return an error
  const contentType = apiRes.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await apiRes.text();
    console.error("API error response:", text);
    return new Response(text, { status: apiRes.status });
  }

  const response = await apiRes.json();

  const heroes =
    response.ok && response.hero
      ? [
          {
            id: Number(response.hero.id),
            heroName: response.hero.heroName,
            role: response.hero.role,
            pickRate: response.hero.pickRate,
            description: response.hero.description,
            heroImage: response.hero.heroImage,
          },
        ]
      : [];

  return Response.json(heroes, { status: apiRes.status });
}
