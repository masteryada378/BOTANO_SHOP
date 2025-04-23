export async function getCards() {
    const res = await fetch("http://localhost:5005/cards");
    if (!res.ok) throw new Error("Failed to fetch cards");
    return res.json();
}
