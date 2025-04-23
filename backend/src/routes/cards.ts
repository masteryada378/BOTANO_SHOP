// src/routes/cards.ts
import { Router } from "express";

const router = Router();

// TODO change any
let cards: any = [];

router.get("/", (_req, res) => {
    res.json(cards);
});

router.post("/", (req, res) => {
    const newCard = req.body;
    cards.push(newCard);
    res.status(201).json(newCard);
});

export default router;
