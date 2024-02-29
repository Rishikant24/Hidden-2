import { GPTResponse } from '../api/openai';
import { promptTicket } from '../constants/prompts';
import { checkJSON } from '../utils/cleanData';

/**
 * Generates the final ticket body after clustering using GPT.
 * @param GPT An instance of GPTResponse class.
 * @param promptTicket The prompt for generating the final report.
 * @param partsList List of UI parts.
 * @param allAnomalies List of anomalies.
 * @returns The final ticket body after clustering.
 */
export async function getFinalTickets(GPT: GPTResponse, partsList: any[] | null, allAnomalies: any[]): Promise<any> {
  // Construct the final prompt
  const finalPrompt: string = `${promptTicket}\n${JSON.stringify(
    partsList
  )}\n\nList of list of anomalies:\n${JSON.stringify(allAnomalies)}\nOutput:\n`;

  try {
    const unParsedTickets = await GPT.getGptResponse(finalPrompt);

    // Parse the final report JSON
    const tickets = checkJSON(unParsedTickets);

    return tickets;
  } catch (error) {
    console.error(error);
    return null;
  }
}
