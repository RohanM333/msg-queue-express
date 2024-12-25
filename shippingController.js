const amqp = require('amqplib/callback_api');

exports.consumeOrders = () => {
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
            channel.prefetch(1);
            console.log(' [*] Waiting for orders in', queue);

            channel.consume(queue, (msg) => {
                const order = JSON.parse(msg.content.toString());
                console.log(' [x] Received order:', order);
                processShipping(order);

                channel.ack(msg);
            }, { noAck: false });
        });
    });
};

const processShipping = (order) => {
    console.log(' [x] Processing shipping for order:', order);
    // Logic to process shipping
};
