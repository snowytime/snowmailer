import { builder, snowmailer } from "./index.js";
import { EmailError } from "./types.js";

export const confirmationTemplate = async ({
    orderId,
    trackId,
}: {
    orderId: string;
    trackId: string;
}) => {
    // we can run any kind of logic in here
    if (!orderId) throw new EmailError({ message: "orderId is required" });
    return {
        subject: `Order Confirmation #${orderId}`,
        template: await builder(/* html */ `
            <style>
                h1 {
                    color: red;
                    font-size: 20px;
                }
                .id {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 1px;
                    color: transparent;
                    user-select: none;
                    display: none;
                }
            </style>
            <body>
                <h1 style="font-size: 30px">Order Confirmation</h1>
                <p>Thank you for your order!</p>
                <p>Order ID: ${orderId}</p>
                <code class="id">${trackId}</code>
            </body>
            `),
    };
};

const main = async () => {
    const start = performance.now();
    // every successful email will return a transaction id that you can save and even use in your template
    const id = await snowmailer(async (transactionId) => {
        const { subject, template } = await confirmationTemplate({
            orderId: "o-124",
            trackId: transactionId,
        });
        // must return a Mail object
        return {
            to: "snaer@ualberta.ca",
            subject,
            html: template,
        };
    });
    const duration = performance.now() - start;
    console.log({ duration, id });
};

main();
