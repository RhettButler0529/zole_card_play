const initStripePayment = (req, res) => {

    const cors = require('cors')({ origin: true });
    const { admin } = require('../admin');    

    cors(req, res, () => {
        const {
            product,
        } = req.body.data;


        if (!req.headers['origin']) {
            return res.status(200).send({ data: 'no origin in header' });
        }

        var stripe;

        const testEnv = req.headers['origin'].includes("localhost") || req.headers['origin'].includes("dev.spelezoli");
        
        if (testEnv) {
            stripe = require('stripe')('sk_test_51Gs5SYBMkkbrbQPOywuPuFzWZ8R3WI9M85HAHNvbAYPtVVNlx9uvwEXKns1uSqauzs9842DxrI2rDH0Ca0JiyGL800vnkFoUF9');
        }else{
            stripe = require('stripe')('sk_live_QS5djxTzXf8Cyp7QTw0HDdgE00E38z9TGN');
        }

        const tokenId = req.get('Authorization').split('Bearer ')[1];

        admin.auth().verifyIdToken(tokenId)
            .then((decoded) => {
                if (!decoded.uid) {
                    return res.status(200).send({ data: 'no auth token' });
                }

                var priceId;

                if (testEnv) {
                    if (product === 1) {
                        priceId = "price_1GsRZVBMkkbrbQPOiCWwFJdY";
                    } else if (product === 2) {
                        priceId = "price_1GsRaEBMkkbrbQPOmi5CSaTH";
                    } else if (product === 3) {
                        priceId = "price_1GsRamBMkkbrbQPOuez8KuvY";
                    } else if (product === 4) {
                        priceId = "price_1GsRbEBMkkbrbQPOZAbEtZFk";
                    } else if (product === 5) {
                        priceId = "price_1GsRbgBMkkbrbQPOOaPKAyez";
                    }
                } else {
                    if (product === 1) {
                        priceId = "price_1GspJ6BMkkbrbQPO3pjJxWV5";
                    } else if (product === 2) {
                        priceId = "price_1GspJiBMkkbrbQPOR6I12ICJ";
                    } else if (product === 3) {
                        priceId = "price_1GspKIBMkkbrbQPOlA6sHqer";
                    } else if (product === 4) {
                        priceId = "price_1GspKmBMkkbrbQPOmW2IsbLj";
                    } else if (product === 5) {
                        priceId = "price_1GspLPBMkkbrbQPOyh6HF1YY";
                    }
                }

                stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price: priceId,
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: `${req.headers['origin']}`,
                    cancel_url: `${req.headers['origin']}`,
                }).then((session) => {
                    admin.database().ref(`users/${decoded.uid}`).once('value').then((user) => {
                        admin.database().ref(`initiatedPayments/stripe-${session.id}`).update({
                            id: session.id,
                            paymentIntent: session.payment_intent,
                            provider: 'stripe',
                            userName: user.name || '',
                            userUid: decoded.uid,
                            productNr: product,
                            productLink: '',
                            dateInitiated: Date.now(),
                            status: 'initiated',
                        }).then(() => {
                            res.status(200).send({ data: { status: 'success', id: session.id } });
                        });
                    });
                }).catch((err) => {
                    res.status(200).send({ data: { status: 'error', error: err.message } });
                });
            })
            .catch((err) => {
                res.status(200).send({ data: { status: 'error', error: err.message } });
            });
    });
};

module.exports = initStripePayment;
