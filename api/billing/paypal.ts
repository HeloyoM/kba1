const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; // Use sandbox for development
const CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_SECRET;

/**
 * Generates an access token for PayPal API requests.
 */
async function generateAccessToken() {
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    console.log({ auth })
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    console.log({ response })
    const data = await response.json();
    console.log({ data })
    return data.access_token;
}

/**
 * Creates a PayPal order.
 * @param amount The amount to charge (as a string, e.g., "9.90").
 * @returns An object containing the order ID and approval URL.
 */
export async function createPayPalOrder(amount: string) {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'ILS',
                        value: amount,
                    },
                },
            ],
            application_context: {
                return_url: 'kba1://payment-success',
                cancel_url: 'kba1://payment-cancel',
            },
        }),
    });
    console.log({ response })
    const data = await response.json();
    console.log({ data })
    const approvalUrl = data.links.find((link: any) => link.rel === 'approve').href;
    return { id: data.id, approvalUrl };
}

/**
 * Captures a PayPal order after user approval.
 * @param orderId The ID of the order to capture.
 * @returns The captured order data.
 */
export async function capturePayPalOrder(orderId: string) {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    return data;
}
