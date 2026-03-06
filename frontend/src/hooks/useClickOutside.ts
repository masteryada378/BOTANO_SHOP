/**
 * useClickOutside — хук для виявлення кліку поза вказаним DOM-елементом.
 *
 * Чому окремий хук?
 * — Логіка "клік поза контейнером → закрити" потрібна не тільки пошуку:
 *   dropdown меню, модальне вікно, color picker тощо.
 *   Хук ізолює цю поведінку (SRP) і дозволяє перевикористовувати її (DRY).
 *
 * Чому `mousedown`, а не `click`?
 * — `mousedown` спрацьовує раніше за `click` і раніше за `blur` інпуту.
 *   Це запобігає "мерехтінню" у випадках, коли blur інпуту і click відбуваються
 *   майже одночасно і можуть конфліктувати з логікою відкриття/закриття.
 */

import { useEffect, type RefObject } from "react";

/**
 * Підписується на `mousedown` на рівні документа.
 * Якщо клік стався поза `ref.current` — викликає `callback`.
 *
 * @param ref      — реф на DOM-елемент, що є "межею" (контейнер пошуку, dropdown тощо)
 * @param callback — функція, яку треба викликати при кліку поза межами
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      // Якщо ref ще не прив'язаний до DOM — нічого не робимо
      if (!ref.current) return;

      // contains() перевіряє, чи є event.target дочірнім елементом ref.current.
      // Якщо клік ВСЕРЕДИНІ контейнера — нічого не робимо.
      // Якщо клік ПОЗА — викликаємо callback (закриваємо dropdown/меню тощо).
      if (!ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Реєструємо listener на document, щоб перехопити будь-який клік на сторінці
    document.addEventListener("mousedown", handleMouseDown);

    // Cleanup: знімаємо listener при розмонтуванні або при зміні залежностей.
    // Без cleanup — кожен ре-рендер додаватиме новий listener → memory leak.
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };

    // ref.current не додаємо в deps — реф є стабільним об'єктом (лише .current змінюється).
    // callback може змінюватись при кожному рендері, тому включаємо його.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};
