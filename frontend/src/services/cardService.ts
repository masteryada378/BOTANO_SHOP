import axios from "axios";
import { Card } from "../types/Card";

const API_URL = "http://localhost:5005/cards";

export const fetchCards = async () => {
    const response = await axios.get<Card[]>(API_URL);
    return response.data;
};

export const updateCard = async (card: Card) => {
    await axios.put(`${API_URL}/${card.id}`, {
        title: card.title,
        price: card.price,
        image: card.image,
    });
};

// export const deleteCard = async (id: number) => {
//     console.log("js", id);
//     await axios.delete(`${API_URL}/${id}`);
// };

// export const deleteCard = async (id: number) => {
//     await axios.delete(`${API_URL}/${id.toString()}`); // Конвертація в рядок для URL
// };
export const deleteCard = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Full error context:", error);
        throw error;
    }
};
