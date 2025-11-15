import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { timeStamp } from "console";

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  try {
    console.log("Send feature trigger:", event);

    const userEmail = event.arguments.email;

    const message = {
      title: `Here is the feature you requested! ${event.arguments.id}`,
      body: `You requested to be notified about the feature with ID: ${event.arguments.id} which currently has ${event.arguments.voteCount} votes. Here's the additional text you provided: ${event.arguments.text}`,
      timeStamp: new Date().toISOString(),
    };

    console.log("Message to send:", message);

    const command = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      MessageAttributes: {
        to: {
          DataType: "String",
          StringValue: userEmail,
        },
      },
    });

    const response = await snsClient.send(command);
    console.log("SNS message sent successfully:", response);
    return true;
  } catch (error) {
    console.error("Error sending SNS message:", error);
    return false;
  }
};
