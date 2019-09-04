// implement your API here
const express = require("express");
const db = require('./data/db.js');

const server = express();
// const port = 8000;

server.use(express.json());

//req obj- all information that comes in with user request
//res obj- The information to specify your response
// server.get('/', (req, res) => {
//     res.status(200).json({api: 'up...'})
// });

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

server.post("/api/users", (req, res) => {
    const user = req.body;
    const name = req.body.name;
    const bio = req.body.bio;

    if (!name || !bio) {
        res.status(400).json({message: "Please provide name and bio for the user." })
    } 
    db.insert(user)
        .then(userID => {
            db.findById(userID.id)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the user to the database" });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        })
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});


server.delete("/api/users/:id", (req, res) => {
    const id =req.paramas.id;

    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The user could not be removed" })
        });
});

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id
    const name = req.body.name;
    const bio = req.body.bio;

    if(!name && !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } 
    db.update(id, name, bio)
        .then( (edited) => {
            if (edited) {
                db.findById(id)
                    .then(user => {
                        res.status(200).json(user);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "The user information could not be modified." })
                    });
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The user information could not be modified." })
        });
});


server.listen(8000, () => console.log('Server running on port 8000'));