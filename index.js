const Twitter = require('twit');
const escpos = require('escpos-print');

const filter = ['#NationalTacoDay'];
const printer_ip = "xxx.xxx.xxx.xxx";
const printer_port = 9100;

async function printer()
{
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    const stream = client.stream('statuses/filter', { track: filter })
    const adapter = new escpos.Adapters.Network(printer_ip, printer_port)
    const printer = await new escpos.Printer(adapter, "CP865").open()

    console.log("Connected to printer...");
    stream.on('tweet', async tweet => {
        await printer
            .writeLine(`User: @${tweet.user.screen_name}`)
            .writeLine(`Time: ${tweet.created_at}`)
            .feed(1)
            .writeLine(tweet.text)
            .feed(4)
            .cut(true)
            .flush();
    })
}

printer();
