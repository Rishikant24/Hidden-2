import { ApiUtils } from './api/devrev';
import { GPTResponse } from './api/openai';
import { identifyAnomalies } from './pipeline/getAnomalies';
import { getFinalTickets } from './pipeline/getTickets';
import { createTickets } from './utils/devrev';
import { getKafkaData } from './utils/getData';

export const run = async (events: any[]) => {
  for (const event of events) {
    const endpoint: string = event.execution_metadata.devrev_endpoint;
    const token: string = event.context.secrets.service_account_token;
    const openAIApiKey: string = event.input_data.keyrings.openai_api_key;
    const apiUtil: ApiUtils = new ApiUtils(endpoint, token);
    const snapInId = event.context.snap_in_id;
    const inputs = event.input_data.global_values;
    const tags = event.input_data.resources.tags;
    const GPT: GPTResponse = new GPTResponse(openAIApiKey);

    await apiUtil.postTextMessageWithVisibilityTimeout(
      snapInId,
      'Mining Your Hidden Diamond Mine -> The gems should be out soon now! Please be patient',
      1
    );

    const partsList = await apiUtil.getParts();

    const kafkaData = await getKafkaData(inputs['kafka_url']);
    
    let allAnomalies = await identifyAnomalies(GPT, kafkaData);

    const finalTickets = await getFinalTickets(GPT, partsList, allAnomalies);

    await createTickets(apiUtil, snapInId, finalTickets, tags, inputs);
  }
};
export default run;
