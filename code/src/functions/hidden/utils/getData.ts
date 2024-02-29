import axios from 'axios';
import { testData } from '../constants/testData';

// Define the interface for Kafka events
interface KafkaEvent {
  key: {
    eventName: string;
    userId: string;
  };
  value: {
    timestamp: number;
    eventValue: string;
    eventDescription: string;
  };
}

/**
 * Fetches data from a Kafka topic.
 * If a Kafka URL is provided, fetches data from that URL.
 * If no Kafka URL is provided, uses test data instead.
 * @param kafkaURL The URL of the Kafka topic.
 * @returns An array of arrays containing Kafka messages, where each inner array represents a list of KafkaEvent.
 */
export async function getKafkaData(kafkaURL: string | undefined) {
  let kafkaMessages: KafkaEvent[];

  if (!kafkaURL) {
    // If no Kafka URL is provided, use test data
    kafkaMessages = testData;
  } else {
    const response = await axios.get<KafkaEvent[]>(kafkaURL);
    kafkaMessages = response.data; // Store fetched data
  }

  const resultObject: { [userId: string]: KafkaEvent[] } = {};

  kafkaMessages.forEach((item: KafkaEvent) => {
    const userId = item.key.userId;

    if (userId != null) {
      if (!resultObject[userId]) {
        resultObject[userId] = [];
      }

      resultObject[userId].push(item);
    }
  });

  const resultArray = Object.values(resultObject);

  return resultArray;
}
