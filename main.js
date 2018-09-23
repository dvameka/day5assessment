//load libraries
const express=require('express');
const path=require('path');
const cors=require('cors');
const request=require('request');
const qs = require('querystring');
const bodyParser = require('body-parser');
const hbs  = require('express-handlebars');

//Create an instance of express
const app=express();
app.use(cors());
app.use(bodyParser.json());

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
  }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Define routes
app.get("/api/search",(req,res,next)=>{
    const params = {
        api_key: 'wUmfQR2AH80n8BfXBvxkE4EWr10hj6JQ',
        q: req.query.searchStr,
        limit: req.query.count
    };

    const fixedWidthUrls = [];
    const giflist=[];


    res.status(200);
    console.log(params);
    
    request.get('https://api.giphy.com/v1/gifs/search', {qs: params},
           
                (err,respond, body)=>{

//                    const fixedWidthUrls = [];
                    let parsed = JSON.parse(body);
    //                console.log('Parsed data:', parsed.data);

                    const data = JSON.parse(body).data;
                    for (let d of data)
                        fixedWidthUrls.push(d.images.fixed_width.url);
 //                   resolve(this.saveToCache(searchTerm, fixedWidthUrls))
                        console.log(fixedWidthUrls);
 //                       res.send(`<h1>${fixedWidthUrls}</h1>`)
                        res.format({
                         'text/html':()=>{
                            res.render('search-giphy', { gifs: fixedWidthUrls });
                            },
                        'application/json':()=>{
                            res.json(fixedWidthUrls);
                            }
                        })
                }
                );
                
    //            res.render('search-giphy', { gifs: fixedWidthUrls[1] });
    console.log(">>>",giflist);
//    res.send('Here>>>');
//    res.send(`<h1>${parsed}</h1>`);
//    res.render('search-giphy', { gifs: giflist })
    
});

app.get((req,res)=>{
    res.status(404);
    res.type('text/html');
    res.end('<h1>Not Found</h1>');
})

//Start web server
//start server on port 3000 if undefined on command line
const PORT=parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000

app.listen(PORT, ()=>{
    console.info(`Application started on port ${PORT} at ${new Date()}`);
});

