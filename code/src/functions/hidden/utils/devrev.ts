import { client, publicSDK } from '@devrev/typescript-sdk';
import { ApiUtils, HTTPResponse } from '../api/devrev';

export function getListFromPartsResponse(partsResponse: {
  data: publicSDK.PartsListResponse;
  message: string;
  success: boolean;
}) {
  const partsList = [];
  for (const part of partsResponse.data.parts) {
    const { name, description, id } = part;
    partsList.push({
      name: name,
      description: description,
      id: id,
    });
  }

  return partsList;
}

export async function createTickets(apiUtil: ApiUtils, snapInId: string, finalTickets: any, tags: any, inputs: any) {
  for (const ticket of finalTickets.tickets) {
    const {
      ticket_title,
      ticket_description,
      ticket_reasons_for_anomaly,
      ticket_enhancements,
      anomaly_score,
      part_id,
    } = ticket;

    const score = parseInt(anomaly_score);
    let tag = '';
    if (score >= 9) {
      tag = 'anomaly-level_High';
    } else if (score >= 7) {
      tag = 'anomaly-level_Medium';
    } else {
      tag = 'anomaly-level_Low';
    }

    const ticket_body = `Anomaly: ${ticket_description}\n\nRoot Cause: ${ticket_reasons_for_anomaly}\n\nEnhancements (Suggestions): ${ticket_enhancements}\n\nAnomaly Score: ${anomaly_score}\n(A score of 10 indicates highly anomalous and a score of 0 indicates perfectly normal)`;
    let createTicketResp = await apiUtil.createWork({
      title: ticket_title,
      tags: [tags[tag]], //This works right ?
      body: ticket_body,
      type: publicSDK.WorkType.Ticket,
      owned_by: [inputs['default_owner_id']], // Generic
      applies_to_part: part_id, // Some Sample Part I suppose (Utilities)
    });

    if (!createTicketResp.success) {
      console.error(`Error while creating ticket: ${createTicketResp.message}`);
      continue;
    }

    // Post a message with ticket ID.
    const ticketID = createTicketResp.data.work.id;
    const ticketCreatedMessage = `Created ticket: <${ticketID}> `;
    const postTicketResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(
      snapInId,
      ticketCreatedMessage,
      1
    );
    if (!postTicketResp.success) {
      console.error(`Error while creating timeline entry: ${postTicketResp.message}`);
      continue;
    }
  }
}
