export const promptAnomaly = `You are an expert in deriving feedback, spotting anomalies and generating insights based on events and their corresponding time stamps emitted by an user based on their UX on an app. Given below is a list of event names and their descriptions along with their time of occurrence. This data corresponds to the actions performed by different users during their session using an application. What can you derive from this and give me suggestions to improve UX from this data. 

Input Format is in JSON in the following format:

{
        "key": {
            "eventName": "Waitlist_button_click",
            "userId": "session_1708809346920_lhe2f1qi0os"
        },
        "value": {
            "timestamp": 1708809522800,
            "eventValue": "",
            "eventDescription": "Clicked the button on the front of the home page which is meant for joining a waitlist. Ideally this is clicked only once"
        }
    },

….

Key contains the name of the event and the userId, values record the time of occurrence (timestamp) and what the event does in event description.


If you spot an anomaly in event & time analysis, you can categorize into one of the 
(Anomalies could be some of the following): faulty button, under-utilized spaces, better placement of components, embedded video insights, unusual drop-off points and potential reasons to name a few.

I want you to create a ticket for any anomaly that you spot. The ticket should contain the following fields: 
Title
Description: should  contain details regarding what the potential anomaly is, why it is classified as one, good insights, and any recommendable enhancements. make sure the description is very very extensive, consisting of reasons for classification as anomaly, explaining what the anomaly indicates, possible feedbacks, insights enhancements to resolve such anomalies.
Anomaly Score: rate the anomaly that you have identified bw 0 to 10, with 0 being completely normal and 10 being highly anomalous.

The output should be strictly JSON with the below format:

{
	“anomalies”:[
			{
				anomaly_title: “string”
				anomaly_description: “string”
				anomaly_score: “string”
			}
]
}  


Give me the output for the following input:

`;
export const promptsTicket = `You are given a list containing a list of anomalies. Based on anomaly descriptions you need to create tickets. Each anomaly need not have a ticket, you need to cluster similar anomalies, and create a single ticket for them, i.e., you can group multiple anomalies under ONE ticket based on similarity you can look out for similar problems being pointed out or similar suggestions being hinted at in the anomaly descriptions. The tickets have a ticket_title (title of the ticket), ticket_anomaly (which talks about the anomaly being identified), ticket_reasons (why such behavior is considered anomalous and out of the normal) and ticket_enhancements (give suggestions, improvements, enhancements which could tackle such anomalous behaviors), anomaly_score( which is the average of all the anomalies in the cluster being used to create the ticket) fields. The tickets need to be solid and useful ! Make Daddy Proud
This is the input format is :
[
   [
       {
           anomaly_title: “string”
           anomaly_description: “string”
           anomaly_score: “string”
       },

       ...
   ],

   [
       {
           anomaly_title: “string”
           anomaly_description: “string”
           anomaly_score: “string”
       },

       ...
   ],
   ...

]
I want the output format to be in JSON in the following structure:

{
   “tickets”:[
           {
               ticket_title: “string”
               ticket_anomaly: "string" (explain the anomaly, that you are logging the ticket for)
               ticket_reasons: "string" (explain why this behavior is anomalous and not considered normal )
               ticket_enhancements: "string" (explain how this problem could be tackled, by suggesting improvements, enhancements of particular components, etc.)
               anomaly_score: “string”
           }
]
} 

Give me the output for the following input:

`;


export const promptPartTag = `You will be given a list of parts and a list of tickets. Your job is to analyze each ticket based on its fields, and tag it to the part that  the ticket corresponds the most to ! If no such part exists, you can always tag it to the UX_General part. You need to just append the part under as a new ticket field. Keep the rest of the ticket fields exactly the same, and use them for only your inference, and assistance in tagging the right parts. Use the part names and descriptions to understand what they do and infer and tag them to the tickets.



Input Format: 

List of parts:
[
    {
        "name": "string", 
        "description": "string", 
        "display_id": "string", 
        "id": "string"
    },
    {
        "name": "string", 
        "description": "string", 
        "display_id": "string", 
        "id": "string"
    }
    ...
]

Tickets:

{
    “tickets”:[
            {
                ticket_title: “string”
                ticket_anomaly: "string" 
                ticket_reasons: "string" 
                ticket_enhancements: "string" 
                anomaly_score: “string”
            }
 ]
 } 

 OutPut Format: (Return JSON of Tickets, with assigned part as an additional field)


 {
    “tickets”:[
            {
                ticket_title: “string”
                ticket_anomaly: "string" 
                ticket_reasons: "string"                
     	    ticket_enhancements: "string"
                anomaly_score: “string”
                assigned_part: {
                    "name": "string", 
                    "description": "string", 
                    "display_id": "string", 
                    "id": "string"
                }
            }
 ]
 }

Remember make no changes to the content of any of the fields ticket or part !  you are just appending the most suited part as a field into the ticket, that’s it. Now go and make daddy proud.


Solve this:
Here is the Input:

List of Parts:

`;


export const promptTicket:string = `You are a product manager. You have a list of anomalies observed in the UI data along with the various parts of the UI. Some of the anomalies might mean the same thing. Can you turn them into a list of tickets, linked to the appropriate part?

Input Format: 

List of parts:
[
    {
        "name": "string", 
        "description": "string", 
        "display_id": "string", 
        "id": "string"
    },
    {
        "name": "string", 
        "description": "string", 
        "display_id": "string", 
        "id": "string"
    }
    ...
]

List of list of anomalies:
[
  [
      {
          anomaly_title: “string”
          anomaly_description: “string”
          anomaly_score: “string”
      },

      ...
  ],

  [
      {
          anomaly_title: “string”
          anomaly_description: “string”
          anomaly_score: “string”
      },

      ...
  ],
  ...

]

 Output Format: (Return JSON of Tickets)

 {
    “tickets”:[
            {
                ticket_title: “string”
                ticket_description: "string" 
                ticket_reasons_for_anomaly: "string"                
     	        ticket_enhancements: "string"
                anomaly_score: “string”
                part_id: “string”
            }
 ]
 }

 ----------------------------------

 Here is the List of parts:

`;
