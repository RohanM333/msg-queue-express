const amqp = require('amqplib/callback_api');

exports.placeOrder = (req, res) => {
    const order = req.body;
    publishOrder(order);
    res.status(201).send('Order placed successfully');
};

const publishOrder = (order) => {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            const queue = 'order_queue';

            channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), { persistent: true });
            console.log(' [x] Order sent to queue:', order);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
};
