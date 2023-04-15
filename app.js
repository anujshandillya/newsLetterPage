const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(__dirname+"/signUp.html");
});

app.post("/", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const listId = "86dd652a64";

    const url = "https://us21.api.mailchimp.com/3.0/lists/"+listId;

    const options = {
        method: "POST",
        auth: "anujshandillya:d71f0ef08d3e70b57d116d713cdd5b86-us21"
    }

    let code = 500;

    const request = https.request(url, options, (response) => {

        code = response.statusCode;

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });

        if(code === 200) {
            res.sendFile(__dirname + "/success.html");
        }else {
            res.sendFile(__dirname + "/failure.html");
        }

    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req,res) => {
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("server initiated");
})

//  mailchimpt api key
//  d71f0ef08d3e70b57d116d713cdd5b86-us21

// list id: 86dd652a64