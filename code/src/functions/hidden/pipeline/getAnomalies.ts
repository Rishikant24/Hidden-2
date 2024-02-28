import { GPTResponse } from '../api/openai';
import { promptAnomaly } from '../constants/prompts';
import { checkJSON } from '../utils/cleanData';

/**
 * Identifies anomalies from Kafka data using GPT.
 * @param GPT An instance of GPTResponse class.
 * @param kafkaData Data from Kafka to analyze for anomalies.
 * @param promptAnomaly The prompt for generating anomaly reports.
 * @returns An array of anomalies identified from Kafka data.
 */
export async function identifyAnomalies(GPT: GPTResponse, kafkaData: any[]): Promise<any[]> {
  let allAnomalies: any[] = [];

  // Identifying anomalies from Kafka Data
  for (const userEvents of kafkaData) {
    try {
      // Generate anomaly report using GPT
      const anomalyReport = await GPT.getGptResponse(promptAnomaly + JSON.stringify(userEvents));

      // Parse anomaly report JSON
      const userAnomaly = checkJSON(anomalyReport);

      if (userAnomaly && userAnomaly.anomalies) {
        allAnomalies = allAnomalies.concat(userAnomaly.anomalies);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return allAnomalies;
}
