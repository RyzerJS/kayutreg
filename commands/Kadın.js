const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db")
const moment = require("moment")
const config = require('../config.js');
const conf = require('../config.js')
const a = require('../config.js');

module.exports.run = async (client, message, args) => {

let reawEmbed = new Discord.MessageEmbed().setColor("f1f1f1").setFooter("Developed by Reawen.").setTimestamp().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
let embed = reawEmbed;
  
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
let isim = args[1];
let yaş = args[2];

if(!isim || !yaş) {
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.no)} Bir isim/yaş belirtmelisiniz!`))
message.react(a.no);
};
  
if (!message.member.roles.cache.has(a.banSorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) {
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.no)} Bu komutu kullanmak için gerekli yetkilere sahip değilsiniz!`))
message.react(a.no);
return;
};

if (!member) {
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.no)} Geçerli bir üye belirtmelisiniz!`))
message.react(a.no);  
return;
};

if (member.id === message.author.id) {
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.no)} Kendinizi kayıt edemezsiniz!`))
message.react(a.no);  
return;
};

if (message.member.roles.highest.position <= member.roles.highest.position) {
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.no)} Belirttiğiniz üye sizden üst/eşit pozisyonda!`))
message.react(a.no);  
return;
};

member.roles.set(conf.kadınRolu)
member.setNickname(`${a.Taglar.some(ewq => member.user.tag.includes(ewq)) ? `Fix` : `•`} ${isim} | ${yaş}`).then(db.push(`isimler.${member.id}`, {Isim: member.displayName, Yetkili: message.member.id, Tarih: Date.now()}))
message.channel.send(reawEmbed.setDescription(`${client.emojis.cache.get(a.yes)} ${member} kullanıcısı ${conf.kadınRolu.map(qwe => `<@&${qwe}>`).join(", ")} rolleriyle **kadın** olarak kaydoldu ve ismi \`${a.Taglar.some(ewq => member.user.tag.includes(ewq)) ? `Fix` : `•`} ${isim} | ${yaş}\` olarak değiştrildi.`))
client.channels.cache.get(a.kayitLog).send(`${member} kayıt oldu. Hoşgeldin!`)
  
};

exports.config = {
  name: "kadın",
  guildOnly: true,
  aliases: ["kız", "kiz", "kadın", "kadin", "female", "k"],
};
