const Logic = require('logic.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!";
const help = "<battle> is WEAPON:SHIELD+HULL so.. !BAT9:2000,DUL5:1200 V MAB4:15000,LAS5:12000 I remember you! try !me Nicknames for CERBS:SEN,GUA,INT So...you can do !me V 1SEN,2GUA,1INT ALSO !debug <battle> in #bot-test"
const DB = require('mypg.js');

//CONSOLE_LOG=true;

var http = require("http");
setInterval(function() {
    http.get("http://prosp-discord.herokuapp.com");
}, 300000); // every 5 minutes (300000)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  if (msg.content.startsWith(prefix)){
    if(msg.content === '!help') {
      msg.reply(help)
    } else if (msg.content.startsWith('!debug')) {
      if(msg.channel.id == "497132715179507712") {
        inStr = msg.content.substring(6)
        process.stdout.write("DOING: " + inStr)
        ret = Logic.doSim(inStr,true)
        longStr = ret[0]
        outcome = ret[1]
        msg.reply(longStr.substring(0,1500))
        for(i=0;i<longStr.length;i+=1500) {
          msg.reply(longStr.substring(i,i+1500))
        }
        msg.reply(outcome)
      }
    } else if (msg.content.startsWith('!me')) {
      var user = msg.author.username
      DB.getUser(user,function(data) {
        if(data == null) {
          console.log("user "+user+" not found")
          if (msg.content.startsWith('!me ships')) {
              DB.setUser(user,msg.content.substring(9))
              msg.reply("OK, your ships have been set! Type !me ships to see your ships")
          } else {
            msg.reply("I don't know you, tell me your ships using !me ships <ships>")
          }
        } else {
          console.log("user "+user+" found")
          if(msg.content.startsWith("!me ships")) {
            if(msg.content == "!me ships") { 
              DB.getUser(user,function(data){
                msg.reply(user + "'s ships: "+data)
	      })
            } else { 
              DB.updateUser(user,msg.content.substring(9))
              msg.reply("OK, your ships have been set! Type !me ships to see your ships")
            }
          } else {
  	    //then run a battle
            if(msg.content.startsWith("!me V")) { 
              var inStr = data + " V " + msg.content.substring(5)
              process.stdout.write("DOING: " + inStr)
              msg.reply("DOING: ("+user+") " + inStr)
              msg.reply(Logic.doSim(inStr,user,false)) 
            }
          }
        }
      });
    } else {
      inStr = msg.content.substring(1)
      process.stdout.write("DOING: " + inStr)
      msg.reply(Logic.doSim(inStr,"Side 1",false)) 
    }
  }
});

client.login('NDk3MTI0MDc4Nzc2NDgzODQw.DpapVw.I3JHFPIGe463-UjrvCMnGA5O4kk');
