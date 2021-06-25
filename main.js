const Discord = require("discord.js")    
const client = new Discord.Client()   
const config = require("./config.js") 
const a = require("./config.js") 
const fs = require("fs")
const db = require("quick.db")   
const moment = require("moment")
require("moment-duration-format")
require('./util/Loader.js')(client)


client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
fs.readdir('./commands/', (err, files) => { 
  if (err) console.error(err) 
  console.log(`${files.length} komut yüklenecek.`)
  files.forEach(f => {
    let props = require(`./commands/${f}`)
    console.log(`${props.config.name} komutu yüklendi.`)
    client.commands.set(props.config.name, props)
    props.config.aliases.forEach(alias => {       
      client.aliases.set(alias, props.config.name)
    })
  })
})

client.nike = `<a:nike:856880850008670218>`

client.login(process.env.TOKEN)

client.on("message", async message => {
if(message.content.toLowerCase() === "tag" && message.content === ".tag") {
message.channel.send(config.Taglar.map(xd => `\`${xd}\``).join("**,** "))
}
})

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date)
  var msecs = Math.abs(new Date() - startedAt)

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365))
  msecs -= years * 1000 * 60 * 60 * 24 * 365
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30))
  msecs -= months * 1000 * 60 * 60 * 24 * 30
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7))
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24))
  msecs -= days * 1000 * 60 * 60 * 24
  const hours = Math.floor(msecs / (1000 * 60 * 60))
  msecs -= hours * 1000 * 60 * 60
  const mins = Math.floor((msecs / (1000 * 60)))
  msecs -= mins * 1000 * 60
  const secs = Math.floor(msecs / 1000)
  msecs -= secs * 1000

  var string = ""
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`

  string = string.trim()
  return `\`${string} önce\``
}

Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds()

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık")
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi")

  if (!format) {
    format = "dd MM yyyy"
  }
  format = format.replace("mm", month.toString().padStart(2, "0"))
  format = format.replace("MM", monthNames[month])
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString())
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2))
  }
  
  format = format.replace("dd", day.toString().padStart(2, "0"))
  format = format.replace("DD", dayNames[weekDay])

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'))
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12
    if (hours === 0) hours = 12
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'))
  }
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'))
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'))
  return format
}

client.on("guildMemberAdd", async member => {
if (db.fetch(`jailli.${member.id}`)) {
member.guild.channels.cache.get(config.jailLog).send(new Discord.MessageEmbed().setFooter("Developed by Reawen.").setColor("010000").setTimestamp().setDescription(`
${client.emojis.cache.get(config.no)} ${member} ( \`${member.id}\` ) isimli kullanıcı jailli iken çıkıp girdiği için tekrar jaillendi!
`))
member.roles.set([a.jailRolu])
} else if (db.fetch(`muteli.${member.id}`)) {
member.guild.channels.cache.get(config.muteLog).send(new Discord.MessageEmbed().setFooter("Developed by Reawen.").setColor("010000").setTimestamp().setDescription(`
${client.emojis.cache.get(config.no)} ${member} ( \`${member.id}\` ) isimli kullanıcı muteli iken çıkıp girdiği için tekrar mutelendi!
`))
member.roles.add(a.muteRolu)
} else {
client.channels.cache.get(a.welcomeLog).send(`
${client.nike}  Sunucumuza hoş geldin, ${member}! Seninle beraber **${member.guild.memberCount}** adet üyeye ulaştık!

${a.welcomeSes.map(qwee => `<#${qwee}>`).join(", ")} odalarında isim yaş verip kayıt olabilirsin!

Hesabını **${new Date(member.user.createdTimestamp).toTurkishFormatDate()}** (**${client.tarihHesapla(member.user.createdAt)}**) tarihinde oluşturmuşsun!

<@&${a.kayitSorumlusu}> rolündeki arkadaşlarımız seninle ilgilenecektir, iyi eğlenceler!
`)
}
  
if (member.roles.cache.has(a.Special.booster)) {
member.roles.set([a.Special.booster, a.kayitsizRolu])
} else if (a.Taglar.some(rea => member.user.tag.includes(rea))) {
member.roles.set([a.Special.tagges, a.kayitsizRolu])
} else {
member.roles.set([a.kayitsizRolu])
}
})
