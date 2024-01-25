function mailerLiteSubscribers() {
  // The Google SpreadSheet
  // ID JEST W TYM MIEJSCU
  // https://docs.google.com/spreadsheets/d/ID_ARKUSZA/edit#gid=0
  let spreadsheet = SpreadsheetApp.openById('ID_ARKUSZA');

  // NAZWA ARKUSZA
  let sheet = spreadsheet.getSheetByName("Arkusz1");
  sheet.clear(); // Clear all data in Spreadsheet
  sheet.appendRow(["ID","Location", "Source / Medium", "Subscribed At", "Unsubscribed At", "Opened"])


  // Your personal API Key (sensitive, do not post)
  let apiKey = 'KLUCZ_API';
  
  // Mailer Lite API
  let baseURL = 'https://connect.mailerlite.com/api';
  let subscribers_endpoint = '/subscribers'
  let limit_per_page = 25
  let options = {"headers": {
    "Authorization": "Bearer "+ apiKey,
    }};
  let apiCall = function(endpoint, limit_per_page, additional=""){
		apiResponseSubscribers = UrlFetchApp.fetch(baseURL + endpoint+"?limit="+limit_per_page+additional, options);
		json = JSON.parse(apiResponseSubscribers);
		return json
	}

  // Make the call and save results array
let totalDownloaded=0
function getAllSubs (subscribers_endpoint_inside,limit_per_page_inside){
  let subscriber_list = apiCall(subscribers_endpoint_inside,limit_per_page_inside);
  Logger.log("Pobrano łącznie: "+totalDownloaded+" rekordów")
  let total = subscriber_list.data.length;
  
  if (total > 0) {
    for (i=0; i < total; i++){
      let c = subscriber_list.data[i];
      let report = [c.id, c.fields.country, c.source, c.subscribed_at, c.unsubscribed_at, c.opens_count ];
      // Write to SpreadSheet
      sheet.appendRow(report);
      totalDownloaded+=1
    }
  }
  if(subscriber_list.meta.next_cursor){
    getAllSubs(subscribers_endpoint_inside,limit_per_page_inside, "&cursor="+subscriber_list.meta.next_cursor)
  }else{
    Logger.log("Koniec pobierania. Pobrano łącznie "+totalDownloaded+" rekordów")
  }
}
getAllSubs(subscribers_endpoint,limit_per_page)


}
