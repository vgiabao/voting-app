import {
  SNSClient,
  PublishCommand,
  SubscribeCommand,
} from "@aws-sdk/client-sns";

export const handler = async (event: any) => {
  console.log("Post confirmation trigger:", event);

  const userEmail = event.request.userAttributes.email;
  console.log("User email:", userEmail);

  const topicArn = process.env.SNS_TOPIC_ARN;
  console.log("SNS Topic ARN:", topicArn);

  const snsClient = new SNSClient({ region: process.env.AWS_REGION });

  try {
    const filterPolicy = {
      to: [userEmail],
    };

    const subscribeParams = new SubscribeCommand({
      Protocol: "email",
      TopicArn: topicArn,
      Endpoint: userEmail,
      ReturnSubscriptionArn: true,
      Attributes: {
        FilterPolicy: JSON.stringify(filterPolicy),
        FilterPolicyScope: "MessageAttributes",
      },
    });

    const response = await snsClient.send(subscribeParams);
    console.log(
      "Successfully subscribed email to topic:",
      response.SubscriptionArn
    );

    return event;
  } catch (error) {
    console.error("Error creating SNS subscription:", error);
    throw error;
  }
};
