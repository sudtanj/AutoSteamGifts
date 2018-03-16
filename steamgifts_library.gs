function SteamGift(cookieId){
  this.cookie=cookieId;
  this.MAIN_URL = 'https://www.steamgifts.com';
  this.PAGING_URL = 'https://www.steamgifts.com/giveaways/search?page=';
  this.USER_AGENT = 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36';
  this.GLOBAL_HEADERS = {
    'User-Agent': this.USER_AGENT, 
    'Accept': 'application/json, text/javascript, */*; q=0.01', 
    'Accept-encoding': 'gzip, deflate', 
    'Connection': 'keep-alive', 
    'Cookie' : this.cookie,
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  };
  this.MAIN_REGEX = 'href="\/giveaway\/([a-zA-Z0-9]*?)\/[^\/]*?"';
  this.XSRF_REGEX = 'name="xsrf_token" value="([0-9a-zA-Z]*?)"';
  this.POINTS_REGEX = "<span class=\"nav__points\">([0-9]+)</span>";
  this.POINTS_RESPONSE_REGEX = "\"points\":\"([0-9]+)\"";
  this.TITLE_REGEX= 'href="\/giveaway\/([a-zA-Z0-9]*?)\/[^\/]*?">([^\<>]*)<';
  this.htmlData=null;
  this.giveawayData=new Array();
  this.xSRFCode=null;
  this.currentPoint=null;
  
  this.joinAllGiveaway = function(){
    this.getGiveawayList();
    for(i in this.giveawayData){
      if(this.getPoint()>0){
        this.joinGiveaway(this.giveawayData[i]);
      }
    }
  }
  this.getXSRF = function(){
    if(underscoreGS._isNull(this.xSRFCode))
      this.xSRFCode=this.getHtmlData().match(new RegExp(this.XSRF_REGEX,"i"))[1];
    return this.xSRFCode;
  }
  this.getPoint = function(){
    if(underscoreGS._isNull(this.currentPoint))
      this.currentPoint=parseInt(this.getHtmlData().match(new RegExp(this.POINTS_REGEX,"i"))[1]);
    return this.currentPoint;
  }
  this.joinGiveaway = function(code){
    if(this.getPoint()>0){
      var payload = {
        'xsrf_token':this.getXSRF(),
        'do':'entry_insert', 
        'code':code
      };
      var opt2 = {
        'method' : 'post',
        'payload' : payload,
        "headers":this.GLOBAL_HEADERS
      };
      var request = UrlFetchApp.fetch(this.MAIN_URL+'/ajax.php', opt2).getContentText();
      this.currentPoint=new RegExp(this.POINTS_RESPONSE_REGEX,"i").exec(request)[1];
    }
  }
  this.getGiveawayList = function(){
    var text=this.getHtmlData().match(new RegExp(this.TITLE_REGEX,"g"));
    //Logger.log(text);
    for(i in text){
      var temp=new RegExp(this.TITLE_REGEX,"i").exec(text[i]);
      if(this.giveawayData.indexOf(temp[1])==-1 && !underscoreGS._isEmpty(temp[2])){
        this.giveawayData.push(temp[1]);
        this.giveawayData.push(temp[2]);
      }
    }
  }
  this.getHtmlData = function(){
    if(underscoreGS._isNull(this.htmlData)){
      var opt2 = {
        "headers":this.GLOBAL_HEADERS
      };
      this.htmlData=UrlFetchApp.fetch(this.PAGING_URL+String("1"),opt2).getContentText();
    }
    return this.htmlData;
  }
}

function test(){
  var steam=new SteamGift("PHPSESSID=34d2mb7j8cqd2iq9a9g4qlgnhq3o9ct1hopnl94eeqrkfs7c4b4glpct0gnmlbks6ls43o8v5p5m8ap1e5meuhdgd4647c3t40drd00");
  //steam.joinAllGiveaway();
  //steam.getGiveawayList();
  //Logger.log(steam.giveawayData);
  //steam.joinGiveaway("m6Dp5");
  //var text='{"type":"success","entry_count":"1,031","points":"25"}';
  //Logger.log(new RegExp("\"points\":\"([0-9]+)\"","i").exec(text)[1]);
  //Logger.log(steam.getWebPage());
}
