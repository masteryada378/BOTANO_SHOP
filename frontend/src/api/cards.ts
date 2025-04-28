export async function getCards() {
    const res = await fetch("http://localhost:5005/cards");
    if (!res.ok) throw new Error("Failed to fetch cards");
    return res.json();
}

export async function createCard(title: string, price: number, image?: string) {
    await fetch("http://localhost:5005/cards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, price, image }),
    });
}
