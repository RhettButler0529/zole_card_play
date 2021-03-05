const stripePaymentCallbackTest = (req, res) => {
    const stripe = require('stripe')('sk_test_51Gs5SYBMkkbrbQPOywuPuFzWZ8R3WI9M85HAHNvbAYPtVVNlx9uvwEXKns1uSqauzs9842DxrI2rDH0Ca0JiyGL800vnkFoUF9');
    const endpointSecret = 'whsec_98ewIHXnVROQjPfh9Mp1ApJfErrASUO4';

    const stripePaymentCallback = require("./stripePaymentCallback");

    return stripePaymentCallback(req, res, stripe, endpointSecret);
}

module.exports = stripePaymentCallbackTest;