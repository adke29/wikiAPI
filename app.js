const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config()

//setup express
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//setup mongoose
//mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
mongoose.connect(process.env.DATABASE_URI);
const articleSchema = new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true}
});
const Articles = mongoose.model("articles",articleSchema);

app.get("/",(req,res)=>{
    res.send("Welcome to Wiki DB");
})


//Routing
app.route("/articles")
.get((req,res)=>{
    console.log("New Request")
    Articles.find({}).then((articles)=>{
        res.send(articles);
    })
})
.post(async (req,res)=>{
    console.log("New Post!!");
    newArticle = new Articles({
        title: req.body.title,
        content: req.body.content
    });
    await newArticle.save().then(()=>{
        res.send("New post Created!!");
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(400);
    });   
})
.delete((req,res)=>{
    Articles.deleteMany({}).then(()=>{
        res.send("Successfully deleted: " + targetId);
    }).catch(()=>{
        res.send(400);
    })
});



app.route("/articles/:articlesId")
.get((req,res)=>{
    Articles.findOne({_id:req.params.articlesId}).then((article)=>{
        res.send(article);
    })

})
.put((req,res)=>{
    Articles.findOneAndUpdate(
        {_id:req.params.articlesId},
        {
            title: req.body.title,
            content: req.body.content
        },
        { new: true, overwrite: true }
        ).then(()=>{
            res.send(req.params.articlesId + " successfully updated")
        }).catch((err) =>{
            console.log(err)
            res.sendStatus(400);
        })
})
.patch((req,res)=>{
    Articles.findOneAndUpdate({_id:req.params.articlesId},{$set:req.body}).then(()=>{
        res.send(req.params.articlesId + " successfully updated")})
        .catch((err) =>{
            console.log(err)
            res.sendStatus(400);
        })
})
.delete((req,res)=>{
    console.log(req.params.articlesId)
    Articles.deleteOne({_id:req.params.articlesId}).then(()=>{
        res.send("Successfully deleted: ");
    }).catch(()=>{
        res.sendStatus(400);
    })
})

//listen
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running");
});