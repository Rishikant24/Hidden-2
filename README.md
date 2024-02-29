## Hidden

Hidden allows you to analyze your user's event stream data, extract actionable insights and turn them into tickets on DevRev!

#### Setup

If you are a product owner and want to get insights from user emitted events. Please host a server where we can fetch events data in the following format:

```
key: {
    eventName: string;
    userId: string; (This can also be a session id)
  };
  value: {
    timestamp: number;
    eventValue: string;
    eventDescription: string;
  };
```

During installation of the snap in, you will be asked to provide a "Kafka URL", please paste the endpoint of the API responsible for giving this data. We will send a GET request to this endpoint. The rest is taken care by us!

#### How it works

We first group event data by the userId and then use prompting on GPT-3.5 (from OpenAI) to identify potential anomalies for each user. After getting a list of anomalies, we cluster similar anomalies into tickets, where we display the root cause, possible enhancements and a detailed description.

#### Architecture Diagram

![Architecture](./architecture.jpeg)

#### Dev Setup

If you are a developer and want to work on this. Please check out the [DevRev documentation](https://docs.devrev.ai/snap-ins) to set it up. We have also documented the important functions to make the code understandable.

#### Team

Rishikant (Rishikant24)

Vaishakh (Vaishakh-SM)
