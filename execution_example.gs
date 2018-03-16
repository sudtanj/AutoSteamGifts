var steam = new SteamLibrary.Steam([Cookie-id]);
var database=steam.getDatabase();

function execute(){
  var steamgift = new SteamGiftsLibrary.SteamGift(PropertiesService.getScriptProperties().getProperty("cookie"));
  steamgift.getGiveawayList();
  for(i=0;i<steamgift.giveawayData.length;i+=2){
    if(ArrayLib.indexOf(database, -1, steamgift.giveawayData[i+1])==-1){
      steamgift.joinGiveaway(steamgift.giveawayData[i]);
      Logger.log(steamgift.giveawayData[i+1]);
    }
  }
  time();
}

function time(){
  eval(UrlFetchApp.fetch("http://momentjs.com/downloads/moment.js").getContentText());
  var date=moment().add(1, 'day').toDate();
  date.setHours(Math.floor((Math.random() * 23) + 1));
  date.setMinutes(Math.floor((Math.random() * 59) + 1));
  var trigger = ScriptApp.getProjectTriggers();
  for (i in trigger)
    ScriptApp.deleteTrigger(trigger[i]);
  ScriptApp.newTrigger("execute").timeBased().at(date).create();
}

function updateSteamList(){
  eval(JSONQBridge.includeLibrary());
  var json=JSON.parse(steam.getGamesList());
  var data=jsonQ(json).find("name").value();
  var temp=null;
  for (i in data){
      temp=new Array();
      temp.push(data[i]);
      temp.push("");
      database.push(temp);
  }
  steam.updateDatabase(database);
}

function doGet(e){
  return HtmlService.createHtmlOutput(" <xmp>"+execute()+" </xmp>");
}