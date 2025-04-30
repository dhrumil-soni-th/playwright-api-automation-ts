import { test, expect } from '@playwright/test';

const loginPayload = {
    userEmail: "dksoni0812@gmail.com",
    userPassword: "Admin@123"
}

const createOrderPayload = { orders: [{ country: "India", productOrderedId: "67a8df1ac0d3e6622a297ccb" }] }

let token: string;
let orderId: string;

test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: loginPayload
    })
    // login Response should be 200
    expect(loginResponse.status()).toBe(200);
    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    const orderResponse = await request.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
        data: createOrderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    })
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = await orderResponseJson.orders[0];
});

test("Order validated on the UI which placed through the API", async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, token);
    await page.goto("https://rahulshettyacademy.com/client/");
    //const orderID = await createOrder(createOrderPayload);

    await page.getByRole('button', { name: 'ORDERS' }).click();
    // await page.locator("button[routerlink*='myorders']").click();
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

    await page.waitForTimeout(3000);

    const orderIDDetails = await page.locator(".col-text").textContent();
    expect(orderIDDetails).toContain(orderId);
})
