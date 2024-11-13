const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { userInfo } = require('os');

const app = express();
const dbPath = path.join(__dirname, "oscowl.db");
let db = null;

app.use(express.json());
app.use(cors());

const initializeDbServer = async() => {
    try {
        db = open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log('http server run at 3000 port');
        })
    }catch(e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDbServer();

app.post("/register/", async(request, response) => {
    try {
        const {userDetails} = request.body;
        const {username, password, name, gender} = userDetails;
        const encryptPassword = await bcrypt.hash(password, 10);
        const checkUserDetails = `SELECT * FROM users WHERE username = '${username}';`;
        const checkedDbUser = await db.run(checkUserDetails);
        if (checkedDbUser === undefined) {
            if (password.length < 6) {
                response.status(400);
                response.send("Password is too short");
            }else {
                const addUserQuery = `
                    INSERT INTO
                        users (username, password, name, gender)
                    VALUES
                        (
                            '${username}',
                            '${encryptPassword}',
                            '${name}',
                            '${gender}');`
                await db.run(addUserQuery);
                response.status(200);
                response.send('user successfully signup');

            }
        }else {
            response.status(400);
            response.send("already user exits");
        }
    }catch(e) {
        console.log(`error: ${e.message}`);
    }

});

app.post("/login/", async(request, response) => {
    try {
        const {loginDetails} = request.body;
        const {username, password} = loginDetails;
        const checkSingupUser = `SELECT * From users WHERE username = '${username}';`;
        const dbUser = await db.run(checkSingupUser);
        if (dbUser === undefined) {
            response.status(400);
            response.send('Invalid User');
        }else {
            const isPasswordMatches = await bcrypt.compare(password, dbUser.password);
            if (isPasswordMatches === true) {
                const payload = {
                    username: username
                };
                const loggedToken = jwt.sign(payload, "My_Secret_Key");
                const token = {
                    loggedToken: loggedToken 
                }
                response.status(200);
                response.send(token);
            }else {
                response.status(400);
                response.send('invalid user');
            }
        }
    }catch(e) {
        console.log(e.message);
    }
});

const authentication = (request, response, next) => {
    let loggedToken;
    const authHeader = request.headers["authorization"];
    if (authHeader === undefined) {
        response.status(401);
        response.send("Invalid logged token");
    }else {
        loggedToken = authHeader.split(" ")[1];
        jwt.verify(loggedToken, "My_Secret_Key", async(error, payload) => {
            if(error) {
                response.status(400);
                response.send("invalid logged token");
            }else {
                request.username = payload.username;
                next();
            }
        })
    }
}

// create todo api 
app.post("/todo/", authentication, async(request, response) => {
    try {
        const {todoDetails} = request.body;
        const {todoId, todoName, status} = todoDetails;
        const addTodoQuery = `
            INSERT INTO
                todo (id, todo_name, status)
            VALUES
                (
                    '${todoId}',
                    '${todoName}',
                    '${status}'
            );
        `;
        await db.run(addTodoQuery);
        response.send("successfuly add todo");
    }catch(e) {
        console.log(`error: ${e.message}`);
    }
});

//get todo Details
app.get("/todo/", authentication, async(request, response) => {
    try {
        const getTodoQuery = `SELECT * FROM todo;`;
        const todoDetailsArray = await db.all(getTodoQuery);
        response.send(todoDetailsArray);
    }catch(e) {
        console.log(e.message);
    }
});

// update todo details 
app.put("/todo/:todoId/", authentication, async(request, response) => {
    try {
        const {todoDetails} = request.body;
        const {todoId} = request.params;
        const {status} = todoDetails;
        const updateTodoQuery = `
            UPDATE
                todo
            SET 
                status = '${status}'
            WHERE 
                id = '${todoId}';
        `;
        await db.run(updateTodoQuery);
        response.send("update todo successfully");
    }catch(e) {
        console.log(`error: ${e.message}`);
    }
});

// delete todo query
app.delete("/todo/:todoId/", async(request, response) => {
    try {
        const {todoId} = request.params;
        const deleteTodoQuery = `
            DELETE FROM
                todo
            WHERE 
                id = '${todoId}';
        `;
        await db.run(deleteTodoQuery);
        response.send("delete todo successfully");
    }catch(e) {
        console.log(e.message);
    }
});

//profile management 

app.post("/users/", authentication, async(request, response) => {
    try {
        const {userDetails} = request.body;
        const {username, password, name, gender} = userDetails;
        const encrytedPassword = await bcrypt.hash(password, 10);
        const addUserInUsersQuery = `
        INSERT INTO
            users (username, password, name, gender)
        VALUES
            (
                '${username}',
                '${encrytedPassword}',
                '${name}',
                '${gender}'
        );`;
        await db.run(addUserInUsersQuery);
        response.send("user add successfully");
    }catch(e) {
        console.log(e.message);
    }
});

app.get("/users/", authentication, async(request, response) => {
    try {
        const getUsersQuery = `SELECT * FROM users;`;
        const usersArray = await db.all(getUsersQuery);
        response.send(usersArray);
    }catch(e) {
        console.log(e.message);
    }
});

app.put("/users/:userId/", authentication, async(request, response) => {
    try {
        const {userId} = request.params;
        const userDetails = request.body;
        const {id, username, password, name, gender} = userDetails;
        const encryptPassword = await bcrypt.hash(password, 10);
        const updateUserQuery = `
        UPDATE
            users
        SET
            id = '${id}',
            username = '${username}',
            password = '${encryptPassword}',
            name = '${name}',
            gender = '${gender}'
        WHERE 
            id = '${userId}';`;
        await db.run(updateUserQuery);
        response.send("update user details successfully");
    }catch(e) {
        console.log(e.message);
    }
});

app.delete("/users/:userId", authentication, async(request, response) => {
    try {
        const {userId} = request.params;
        const deleteUserQuery = `
        DELETE FROM
            users
        WHERE 
            id = '${userId}';`;
        await db.run(deleteUserQuery);
        response.send("delete user successfully");
    }catch(e) {
        console.log(e.message);
    }
});

module.exports = app;