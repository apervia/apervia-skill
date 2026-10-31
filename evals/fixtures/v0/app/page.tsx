export default async function Page() {
  const res = await fetch("https://api.quotable.example.com/random", { cache: "no-store" });
  const quote = await res.json();
  return <main><h1>{process.env.NEXT_PUBLIC_BOARD_TITLE}</h1><p>{quote.content}</p></main>;
}
