const stripePaymentCallbackLive = (req, res) => {
    const stripe = require('stripe')('sk_live_QS5djxTzXf8Cyp7QTw0HDdgE00E38z9TGN');
    const endpointSecret = 'whsec_PtUSgH3NGubCCKbXgFCSpIaPdOADfXwk';

    const stripePaymentCallback = require("./stripePaymentCallback");

    return stripePaymentCallback(req, res, stripe, endpointSecret);
}

module.exports = stripePaymentCallbackLive;