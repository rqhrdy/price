function calculatePrice(n) {
      return n*89.99;
}

// Note: This is example code. Each server platform and programming language has a different way of handling requests, making HTTP API calls, and serving responses to the browser.

// 1. Set up your server to make calls to PayPal

// 1a. Add your client ID and secret
PAYPAL_CLIENT = 'PAYPAL_SANDBOX_CLIENT';
PAYPAL_SECRET = 'PAYPAL_SANDBOX_SECRET';

// 1b. Point your server to the PayPal APIs
PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
PAYPAL_ORDER_API = 'https://api.sandbox.paypal.com/v2/checkout/orders/';

// 1c. Get an access token from the PayPal API
basicAuth = base64encode(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`);
auth = http.post(PAYPAL_OAUTH_API {
  headers: {
    Accept:        `application/json`,
    Authorization: `Basic ${ basicAuth }`
  },
  data: `grant_type=client_credentials`
});

// 2. Set up your server to receive a call from the client
async function handleRequest(request, response) {

  // 3. Call PayPal to set up a transaction
  order = http.post(PAYPAL_ORDER_API, {
    headers: {
      Accept:        `application/json`,
      Authorization: `Bearer ${ auth.access_token }`
    },
    data: {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '220.00'
        }
      }]
    }
  });

  // 4. Handle any errors from the call
  if (order.error) {
    console.error(order.error);
    return response.send(500);
  }

  // 5. Return a successful response to the client with the order ID
  response.send(200, {
    orderID: order.id
  });
}