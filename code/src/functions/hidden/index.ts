import { publicSDK } from '@devrev/typescript-sdk';
import { GPTResponse } from './api/openai';
import { ApiUtils, HTTPResponse } from './api/devrev';
import { promptAnomaly, promptPartTag, promptTicket } from './utils/prompts';
import { getData } from './utils/getData';
import { checkJSON } from './utils/cleanData';

export const run = async (events: any[]) => {
  for (const event of events) {
    const analyzedReviews: string[] = [];
    //console.log("Event is:", event);
    const endpoint: string = event.execution_metadata.devrev_endpoint;
    const token: string = event.context.secrets.service_account_token;
    const openAIApiKey: string = event.input_data.keyrings.openai_api_key;
    const apiUtil: ApiUtils = new ApiUtils(endpoint, token);
    const snapInId = event.context.snap_in_id;
    const inputs = event.input_data.global_values;
    const tags = event.input_data.resources.tags;

    const GPT: GPTResponse = new GPTResponse(openAIApiKey);


    let postResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, 'Mining Your Hidden Diamond Mine -> The gems should be out soon now ! Please be patient', 1);
    if (!postResp.success) {
      console.error(`Error while creating timeline entry: ${postResp.message}`);
      continue;
    }
  
    // Get Parts
    const partsResponse = await apiUtil.getParts();
    if (!partsResponse.success) {
      console.error(`Error while fetching parts: ${partsResponse.message}`);
      continue;
      // Handle error if needed
    }

    const partsList = [];
    for (const part of partsResponse.data.parts) {
      const { name, description, id } = part;
      partsList.push({
        "name": name, 
        "description": description, 
        "id": id
      })
    }

    console.log(partsList);
    await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, JSON.stringify(partsList), 1);

  // Two Calls; 1st for -> denoising and anomaly reports based on individual streams, and 2nd one for clustering and ticket generation
  let allAnomalies:any = [];

  console.log("TO FIRST CALL");
  const data = getData();
  for (const userEvents of data) {

    try {
      const anomalyReport = await GPT.getGptResponse(promptAnomaly + JSON.stringify(userEvents));
      const userAnomaly = checkJSON(anomalyReport);
  
      allAnomalies = allAnomalies.concat(userAnomaly.anomalies);
      //console.log(userEvents)
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  }

  //let pos3tResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, JSON.stringify(allAnomalies), 1);


  // console.log("TO SECOND CALL");
  //   const ticketReport = await GPT.getGptResponse(promptTicket + JSON.stringify(allAnomalies));
  //   const loggedTickets = checkJSON(ticketReport);

  //   let pos2tResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, JSON.stringify(loggedTickets), 1);
  //   if (!pos2tResp.success) {
  //     console.error(`Error while creating timeline entry: ${pos2tResp.message}`);
  //     //continue;
  //   }

    console.log("TO THIRD CALL");
    //Final Call to tag tickets to Parts
    const finalPrompt: string = `${promptTicket}\n${JSON.stringify(partsList)}\n\nList of list of anomalies:\n${JSON.stringify(allAnomalies)}\nOutput:\n`;
    //stringify works for list ?
    const finalReport = await GPT.getGptResponse(finalPrompt);
    const finalTickets = checkJSON(finalReport);

    let pos3tResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, JSON.stringify(finalTickets), 1);
    if (!pos3tResp.success) {
      console.error(`Error while creating timeline entry: ${pos3tResp.message}`);
      //continue;
    }
    
    let createTicketResp: any = {};
    for (const ticket of finalTickets.tickets) {
      const { ticket_title, ticket_description, ticket_reasons_for_anomaly, ticket_enhancements, anomaly_score, part_id } = ticket;

      const score = parseInt(anomaly_score);
      let tag = '';
      if (score >= 9) {
        tag = 'anomaly-level_High';
      }

      else if (score >= 7) {
          tag = 'anomaly-level_Medium';
      }

      else {
          tag = 'anomaly-level_Low'
      }

      const ticket_body = `Anomaly: ${ticket_description}\n\nRoot Cause: ${ticket_reasons_for_anomaly}\n\nEnhancements (Suggestions): ${ticket_enhancements}\n\nAnomaly Score: ${anomaly_score}\n(A score of 10 indicates highly anomalous and a score of 0 indicates perfectly normal)`;
      createTicketResp = await apiUtil.createWork({
        title: ticket_title,
        tags: [tags[tag]], //This works right ? 
        body: ticket_body,
        type: publicSDK.WorkType.Ticket,
        owned_by: [inputs['default_owner_id']], // Generic
        applies_to_part: part_id // Some Sample Part I suppose (Utilities)
      });

      if (!createTicketResp.success) {
        console.error(`Error while creating ticket: ${createTicketResp.message}`);
        continue;
        // Handle error if needed
      }

      // Post a message with ticket ID.
      const ticketID = createTicketResp.data.work.id;
      const ticketCreatedMessage = `Created ticket: <${ticketID}> `;
      const postTicketResp: HTTPResponse  = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, ticketCreatedMessage, 1);
      if (!postTicketResp.success) {
        console.error(`Error while creating timeline entry: ${postTicketResp.message}`);
        continue;
      }
      
    }

}

};
export default run;

