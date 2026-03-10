/**
 * useCheckoutForm — хук для управління формою оформлення замовлення.
 *
 * Чому хук, а не логіка в компоненті?
 * — SRP: компонент рендерить UI, хук — бізнес-логіка форми та валідація.
 *   Хук можна тестувати ізольовано без рендеру компонента.
 *
 * Патерн помилок:
 * — errors — Record<keyof CheckoutFormData, string>.
 *   При handleChange помилка поля знімається — real-time feedback для юзера.
 *   При submit — validate() перевіряє всі поля одразу.
 */

import { useState } from "react";
import type { CheckoutFormData } from "../types/checkout";
import { INITIAL_FORM_DATA } from "../types/checkout";

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

interface UseCheckoutFormReturn {
    formData: CheckoutFormData;
    errors: FormErrors;
    handleChange: (field: keyof CheckoutFormData, value: string) => void;
    validate: () => boolean;
}

/** Regexp для базової валідації UA-номера телефону */
const UA_PHONE_RE = /^(\+?38)?0\d{9}$/;

/** Regexp для базової валідації email */
const EMAIL_RE = /.+@.+\..+/;

export const useCheckoutForm = (): UseCheckoutFormReturn => {
    const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Знімаємо помилку поля при редагуванні — не блокуємо юзера
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Валідує всі поля форми.
     * Повертає true якщо форма валідна.
     * При помилках — записує повідомлення в errors і повертає false.
     */
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
            newErrors.customerName = "Введіть ваше ім'я (мінімум 2 символи)";
        }

        // Видаляємо пробіли і дефіси для перевірки
        const cleanPhone = formData.customerPhone.replace(/[\s\-()]/g, "");
        if (!cleanPhone || !UA_PHONE_RE.test(cleanPhone)) {
            newErrors.customerPhone = "Введіть коректний номер телефону (+380XXXXXXXXX)";
        }

        if (!formData.customerEmail.trim() || !EMAIL_RE.test(formData.customerEmail)) {
            newErrors.customerEmail = "Введіть коректний email";
        }

        if (!formData.deliveryMethod) {
            newErrors.deliveryMethod = "Оберіть спосіб доставки";
        }

        // Адреса потрібна для всіх способів доставки, крім самовивозу
        const isPickup = formData.deliveryMethod === "pickup";
        if (!isPickup && (!formData.deliveryAddress.trim() || formData.deliveryAddress.trim().length < 5)) {
            newErrors.deliveryAddress = "Введіть адресу доставки";
        }

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = "Оберіть спосіб оплати";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return { formData, errors, handleChange, validate };
};
