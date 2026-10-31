import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.MY_OPENAI_KEY, baseURL: "https://api.openai.com/v1" });
export async function POST(req: Request) {
  const { text } = await req.json();
  const out = await client.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: "Summarise: " + text }] });
  return Response.json({ summary: out.choices[0].message.content });
}
