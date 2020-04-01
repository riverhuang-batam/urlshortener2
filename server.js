const express = require('express');
const mongoose = require('mongoose')
const ShortUrl =require('./models/shortUrl')
const app = express();
mongoose.connect('mongodb+srv://admin:Firewall@421@shop-restful-api-howto.mongodb.net/urlshortener?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
})
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection established successfully")
})
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.get('/', async (req,res) =>{
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shorturls', async (req, res) =>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) =>{
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000, console.log('server is running'))