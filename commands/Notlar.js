const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db")
const moment = require("moment")
const conf = require('../config.js');

module.exports.run = async (client, message, args) => {

let reawEmbed = new Discord.MessageEmbed().setColor("f1f1f1").setFooter("Developed by Reawen.").setTimestamp().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
let embed = reawEmbed;

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

let notlar = db.get(`notlar.${member.id}`) || [];
notlar.reverse();
let listeliSicil = notlar.length < 1 ? "Uyarı geçmişi bulunamadı!" : notlar.map((value) => `<@!${value.Yetkili}>: **${value.Sebep}**`).join("\n")
                                                                        
  
message.channel.send(reawEmbed.setDescription(`
:no_entry_sign: ${member} isimli kullanıcının uyarı geçmişi:

${listeliSicil}

\`Toplam Ceza Puanı:\` **${db.fetch(`cezaPuani.${member.id}`) || "0"}.**
`))
};

exports.config = {
  name: "notlar",
  guildOnly: false,
  aliases: ["notes", "uyarilar", "uyarılar"],
};