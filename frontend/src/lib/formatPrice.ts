/**
 * Утиліта форматування цін в гривнях.
 *
 * Чому Intl.NumberFormat, а не .toLocaleString?
 * — Intl.NumberFormat більш ефективний при повторних викликах (кешується рушієм).
 *   Також явна локаль "uk-UA" гарантує пробіл як роздільник тисяч (1 299, не 1,299).
 *
 * Чому окремий файл?
 * — Ціни відображаються у 5+ місцях: CatalogCard, ProductDetail, CartItemRow,
 *   CartPage, CheckoutPage. Один формат — один файл (DRY).
 *
 * Приклади:
 *   formatPrice(1299)    → "1 299 грн"
 *   formatPrice(99.5)    → "99,5 грн"
 *   formatPrice(1000000) → "1 000 000 грн"
 */
const priceFormatter = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatPrice = (value: number): string =>
    `${priceFormatter.format(value)} грн`;
