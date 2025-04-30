import { test, expect } from '@playwright/test';
import { getToken, createOrder } from '../utils/apiUtils.ts';
import { loginPayload, createOrderPayload } from '../utils/requestPayload.ts';
import { injectTokenToLocalStorage } from '../utils/storageUtils.ts';

let token: string;
let orderId: string;

test.beforeAll(async ({ request }) => {
    token = await getToken({ request, loginPayload });
    orderId = await createOrder({ request, token, createOrderPayload });
});

test("Order validated on the UI which placed through the API", async ({ page }) => {

    await injectTokenToLocalStorage(page, token);
    await page.goto("https://rahulshettyacademy.com/client/");

    await page.getByRole('button', { name: 'ORDERS' }).click();
    await page.locator("tbody").waitFor();
    const orders = page.locator("tbody tr");
    const orderCount = await orders.count();

    for (let i = 0; i < orderCount; i++) {
        const orderText = await orders.nth(i).locator("th").textContent();
        if (orderText === orderId) {
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }

    await page.waitForTimeout(2000);

    const orderIDDetails = await page.locator(".col-text").textContent();
    expect(orderIDDetails).toContain(orderId);
})
