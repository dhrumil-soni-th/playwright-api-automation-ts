import { endPointUtils } from "./endPointUtils.ts";

export const getToken = async ({ request, loginPayload }): Promise<string> => {
    const response = await request.post(endPointUtils.loginEndPoint, {
        data: loginPayload
    })

    const body = await response.json();
    if (!response.ok()) throw new Error(`Login failed with status ${response.status()}`);
    const token = body.token;
    return token;
}

export const createOrder = async ({ request, token, createOrderPayload }): Promise<string> => {
    const response = await request.post(endPointUtils.createOrderEndPoint, {
        data: createOrderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    })
    const body = await response.json();
    if (!response.ok()) throw new Error(`Order creation failed: ${JSON.stringify(body)}`);
    const orderId = await body.orders[0];
    console.log(`Order Id: ${orderId}`);
    return orderId;
}
