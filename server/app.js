const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const db = require('./db')
const multer = require("multer")
const fs = require('fs')
const crypto = require("crypto")
const date = require('date-and-time')

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const { shuffle, result } = require('lodash')

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/NewThemePages', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let image = req.files.image;
            const path = 'assets/image/'
            var path1 = 'assets/image/' + image.name
            var name = image.name
            if (fs.existsSync(path1)) {
                var id = crypto.randomBytes(16).toString("hex");
                path1 = path + "(" + id + ")" + image.name
                name = "(" + id + ")" + image.name
                image.mv(path1)
            } else {
                image.mv(path1)
            }
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: name,
                    mimetype: image.mimetype,
                    size: image.size,
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/NewGamePages', async (req, res) => {
    var data = req.body
    if (data.leading) {
        const Themes = await db.query("SELECT theme_name FROM themes WHERE theme_verified = true OR theme_author = $1;", [data.author])
        res.send({
            status: true,
            message: 'Themes',
            data: {
                themes: Themes.rows
            }
        });
    } else {
        const Themes = await db.query("SELECT theme_name FROM themes WHERE theme_verified = true;", [])
        res.send({
            status: true,
            message: 'Themes',
            data: {
                themes: Themes.rows
            }
        });
    }
});
app.post('/GameTable', async (req, res) => {
    const theme_name = req.body.themeName
    const room_id = req.body.roomId
    const Categoryes = await db.query("SELECT theme_category1, theme_category2, theme_category3, theme_category4, theme_category5 FROM themes WHERE theme_name = $1; ", [theme_name])
    var result = []
    result.push(Categoryes.rows[0].theme_category1)
    result.push(Categoryes.rows[0].theme_category2)
    result.push(Categoryes.rows[0].theme_category3)
    result.push(Categoryes.rows[0].theme_category4)
    result.push(Categoryes.rows[0].theme_category5)
    var room = {}
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].room_id == room_id) {
            room = {
                room_id: gameRooms[i].room_id,
                room_theme: gameRooms[i].room_theme,
                room_questions: gameRooms[i].room_questions,
                room_current_question: gameRooms[i].room_current_question,
                room_leading: gameRooms[i].room_leading
            }
        }
    }
    res.send({
        status: true,
        message: 'Categoryes',
        data: {
            ...{ categoryes: result },
            ...room
        }
    });
});
app.post('/Question', async (req, res) => {
    const data = req.body
    if (!data.roomTheme || !data.numberQuestion) {
        res.send({
            status: false,
            message: 'Question and answers'
        });
        return
    }
    const themeIdBD = await db.query("SELECT theme_id FROM themes WHERE theme_name = $1; ", [data.roomTheme])
    const themeId = themeIdBD.rows[0].theme_id
    const questionBD = await db.query("SELECT question_id, question_type, question_text, question_image FROM questions WHERE theme_id = $1 AND question_number = $2; ", [themeId, data.numberQuestion])
    const question = questionBD.rows[0]
    const answersBD = await db.query("SELECT answer_id, question_id, answer_text, answer_right FROM answers WHERE question_id = $1 ; ", [question.question_id])
    const answerRight = answersBD.rows[0]
    var answersFalse = answersBD.rows.slice(1)
    answersFalse = shuffle(answersFalse)
    answersFalse = answersFalse.slice(0, 3)
    var answers = answersFalse
    answers.push(answerRight)
    answers = shuffle(answers)
    res.send({
        status: true,
        message: 'Question and answers',
        data: {
            ...question,
            ...{
                answers: answers
            }
        }
    });
});
app.post('/Menu', async (req, res) => {
    const data = req.body
    if (!data.name || !data.socket) {
        res.send({
            status: false,
            message: 'Menu'
        });
        return
    }
    var team = await db.query("SELECT * FROM teams WHERE team_name = $1; ", [data.name])
    team = team.rows[0]
    res.send({
        status: true,
        message: 'Menu',
        data: {
            ...{
                team: {
                    ...team,
                    team_socket_id: data.socket
                }
            }
        }
    });
});
app.post('/GameRoomPages', async (req, res) => {
    const data = req.body
    var room = {}
    var name = []
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].room_id == data.room_id) {
            for (var j = 0; j < gameRooms[i].room_clientsId.length; j++) {
                var sel = await db.query("SELECT team_name FROM teams WHERE team_id = $1; ", [gameRooms[i].room_clientsId[j]])
                name.push(sel.rows[0].team_name)
            }
            room = gameRooms[i]
        }
    }
    res.send({
        status: true,
        message: 'Game Rooms',
        data: {
            ...{
                room_id: room.room_id,
                comandName: name,
                room_theme: room.room_theme,
                room_countPlayers: room.room_countPlayers
            }
        }
    });
});
app.post('/GameRoomsPages', async (req, res) => {
    var rooms = []
    for (let i = 0; i < gameRooms.length; i++) {
        if ((gameRooms[i].room_leading == false) && (gameRooms[i].room_clientsId.length != gameRooms[i].room_countPlayers)) {
            rooms.push(gameRooms[i])
        }
    }
    res.send({
        status: true,
        message: 'Game Rooms',
        data: {
            ...{
                rooms: rooms
            }
        }
    });
});
app.post('/GiveRole', async (req, res) => {
    var result = await db.query("SELECT * FROM teams WHERE team_name != $1 AND team_request_role = $2; ", ['Admin', true])
    result = result.rows
    res.send({
        status: true,
        message: 'Give Role',
        data: {
            ...{
                teams: result
            }
        }
    });
});
app.post('/CheckNewTheme', async (req, res) => {
    var result = await db.query("SELECT * FROM themes WHERE theme_author != $1 AND theme_verified=$2", ['Admin', false])
    result = result.rows
    res.send({
        status: true,
        message: 'Check New Theme',
        data: {
            ...{
                themes: result
            }
        }
    });
});
app.post('/RequestRole', async (req, res) => {
    const data = req.body
    if (!data.name) {
        res.send({
            status: false,
            message: 'Request Role'
        });
        return
    }
    var result = await db.query("SELECT * FROM teams WHERE team_name = $1", [data.name])
    result = result.rows[0]
    res.send({
        status: true,
        message: 'Request Role',
        data: {
            ...{
                team: result
            }
        }
    });
});
app.post('/MenuPages', async (req, res) => {
    var result = await db.query("SELECT * FROM chat")
    result = result.rows
    res.send({
        status: true,
        message: 'Menu Pages',
        data: {
            ...{
                messages: result
            }
        }
    });
});
app.post('/Profile', async (req, res) => {
    if (!req.body.boolLoadInf) {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                let image = req.files.image;
                const path = 'assets/image/'
                var path1 = 'assets/image/' + image.name
                var name = image.name
                if (fs.existsSync(path1)) {
                    var id = crypto.randomBytes(16).toString("hex");
                    path1 = path + "(" + id + ")" + image.name
                    name = "(" + id + ")" + image.name
                    image.mv(path1)
                } else {
                    image.mv(path1)
                }
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: name,
                        mimetype: image.mimetype,
                        size: image.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        const data = req.body
        if (!data.teamName) {
            res.send({
                status: false,
                message: 'Profile'
            });
            return
        }
        var result = await db.query("SELECT * FROM teams WHERE team_name = $1; ", [data.teamName])
        var team = result.rows[0]
        res.send({
            status: true,
            message: 'Team Profile',
            data: {
                ...{
                    team: team
                }
            }
        });
    }
});

var RoomId = 0
var gameRooms = []
var clientOnline = []
async function createRoom(roomTheme, clientsSocket, clientsId, clientsScore, clientStep, leading, countPlayers, clientName, author) {
    RoomId++
    const newRoom = {
        room_id: RoomId,
        room_theme: roomTheme,
        room_theme_author: author,
        room_clientsSocket: [clientsSocket],
        room_clientsId: [clientsId],
        room_clientsScore: [clientsScore],
        room_clientsName: [clientName],
        room_clientStep: clientStep,
        room_questions: ["100", "200", "300", "400", "500", "100", "200", "300", "400", "500", "100", "200", "300", "400", "500", "100", "200", "300", "400", "500", "100", "200", "300", "400", "500"],
        room_current_question: -1,
        room_leading: leading,
        room_countPlayers: leading ? 1 : countPlayers
    }
    return newRoom
}
const m = (name, text, id) => ({ name, text, id })
async function inputTeam(name, password) {
    const team = await db.query('SELECT * FROM teams WHERE team_name=$1', [name])
    if (team.rows[0]) {
        if (team.rows[0].team_password == password) {
            return team.rows[0]
        } else {
            return 2
        }
    } else {
        return 3
    }
}

async function registrationTeam(name, password, password1) {
    const team = await db.query('SELECT * FROM teams WHERE team_name=$1', [name])
    if (team.rows[0]) {
        return 1
    } else {
        if (password == password1) {
            const newTeam = await db.query("INSERT INTO teams(team_name, team_password, team_rating, team_average_score, team_maximum_score, team_leading, team_image, team_count_game, team_request_role, team_text_request_role)	VALUES($1, $2, 0,0,0, false, 'default-img.png', 0, false, '') RETURNING *", [name, password])
            return newTeam.rows[0]
        } else {
            return 2
        }
    }
}
async function checkTheme(name) {
    const theme = await db.query('SELECT * FROM themes WHERE theme_name=$1', [name])
    if (theme.rows[0]) {
        return 1
    } else {
        return 2
    }
}
async function createNewTheme(name, category1, category2, category3, category4, category5, author, verified) {
    const newTheme = await db.query("INSERT INTO themes(theme_name, theme_category1, theme_category2, theme_category3, theme_category4, theme_category5, theme_author, theme_verified) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [name, category1, category2, category3, category4, category5, author, verified])
    return newTheme.rows[0].theme_id
}

async function addQuestion(themeId, type, textQuestion, image, number, answerQuestionRight, answerQuestionVar1, answerQuestionVar2, answerQuestionVar3, answerQuestionVar4, answerQuestionVar5, answerQuestionVar6, answerQuestionVar7) {
    const newQuestion = await db.query("INSERT INTO questions(theme_id, question_type, question_text, question_image, question_number) VALUES($1, $2, $3, $4, $5) RETURNING *", [themeId, type, textQuestion, image, number])
    const questionId = newQuestion.rows[0].question_id
    const newAnswer1 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionRight, true])
    const newAnswer2 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar1, false])
    const newAnswer3 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar2, false])
    const newAnswer4 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar3, false])
    const newAnswer5 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar4, false])
    const newAnswer6 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar5, false])
    const newAnswer7 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar6, false])
    const newAnswer8 = await db.query("INSERT INTO answers(question_id, answer_text, answer_right) VALUES($1, $2, $3) RETURNING *", [questionId, answerQuestionVar7, false])
}

async function createTeam(team, id) {
    const newTeam = {
        team_average_score: team.team_average_score,
        team_count_game: team.team_count_game,
        team_id: team.team_id,
        team_image: team.team_image,
        team_leading: team.team_leading,
        team_maximum_score: team.team_maximum_score,
        team_name: team.team_name,
        team_rating: team.team_rating,
        team_request_role: team.team_request_role,
        team_text_request_role: team.team_text_request_role,
        team_socket_id: id,
        team_room: undefined
    }
    return newTeam
}

io.on('connection', socket => {
    socket.join('0')
    socket.on("joinIO", (data, cb) => {
        if (!data.id || !data.sock_id) {
            return cb("Данные не корректны")
        }
        socket.leave('0')
        socket.join(data.id.toString())
        for (let i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomId == data.id) {
                for (let j = 0; j < gameRooms[i].clientsSocket.length; j++) {
                    if (gameRooms[i].clientsSocket[j] == data.sock_id) {
                        gameRooms[i].clientsSocket[j] = socket.id
                        var data = {
                            sock: socket.id,
                            room: gameRooms[i]
                        }
                        cb(data)
                    }
                }
            }
        }
    })
    socket.on("joinIOname", (data, cb) => {
        if (!data.name) {
            return cb("Данные не корректны")
        }
        var bool = false
        for (let i = 0; i < clientOnline.length; i++) {
            if (data.name == clientOnline[i].name) {
                bool = true
            }
        }
        if (!bool) {
            clientOnline.push({ name: data.name, id: socket.id })
        }
    })
    socket.on("inputTeam", (data, cb) => {
        if (!data.name || !data.password) {
            return cb("Данные не корректны")
        }
        (async () => {
            let res = await inputTeam(data.name, data.password)
            for (let i = 0; i < clientOnline.length; i++) {
                if (data.name == clientOnline[i].name) {
                    cb(4)
                    return
                }
            }
            if (typeof res === 'object') {
                let newTeam = await createTeam(res, socket.id)
                socket.join('0')
                clientOnline.push({ name: data.name, id: socket.id })
                cb(newTeam)
            } else {
                cb(res)
            }
        })()
    })
    socket.on("goHome", (data, cb) => {
        if (!data.name) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < clientOnline.length; i++) {
                if (data.name == clientOnline[i].name) {
                    clientOnline.splice(i, 1)
                }
            }
            cb(1)
        })()
    })
    socket.on("registrationTeam", (data, cb) => {
        if (!data.name || !data.password || !data.password1) {
            return cb("Данные не корректны")
        }
        (async () => {
            let res = await registrationTeam(data.name, data.password, data.password1)
            let newTeam = await createTeam(res, socket.id)
            socket.join('0')
            clientOnline.push({ name: data.name, id: socket.id })
            cb(newTeam)
        })()
    })
    socket.on("checkTheme", (data, cb) => {
        if (!data.name) {
            return cb("Данные не корректны")
        }
        (async () => {
            let res = await checkTheme(data.name)
            cb(res)
        })()
    })
    socket.on("newTheme", (data, cb) => {
        if (!data.name || !data.categoryes[0] || !data.categoryes[1] || !data.categoryes[2] || !data.categoryes[3] || !data.categoryes[4]) {
            return cb("Данные не корректны")
        }
        for (let i = 0; i < 25; i++) {
            if ((data.typeQuestion[i] != 3 && !data.imageQuestion[i]) || !data.typeQuestion[i] || !data.textQuestion[i] || !data.answerQuestionRight[i] || !data.answerQuestionVar1[i] || !data.answerQuestionVar2[i] || !data.answerQuestionVar3[i] || !data.answerQuestionVar4[i] || !data.answerQuestionVar5[i] || !data.answerQuestionVar6[i] || !data.answerQuestionVar7[i]) {
                return cb("Данные не корректны")
            }
        }
        (async () => {
            var verified = false
            if (data.author == "Admin")
                verified = true
            let theme = await createNewTheme(data.name, data.categoryes[0], data.categoryes[1], data.categoryes[2], data.categoryes[3], data.categoryes[4], data.author, verified)
            for (let i = 0; i < 25; i++) {
                let res = await addQuestion(theme, data.typeQuestion[i], data.textQuestion[i], data.imageQuestion[i], i + 1, data.answerQuestionRight[i], data.answerQuestionVar1[i], data.answerQuestionVar2[i], data.answerQuestionVar3[i], data.answerQuestionVar4[i], data.answerQuestionVar5[i], data.answerQuestionVar6[i], data.answerQuestionVar7[i])
            }
            cb(2)
        })()
    })
    socket.on("createRoom", (data, cb) => {
        if (!data.theme || !data.socket || !data.id || !data.name) {
            return cb("Данные не корректны")
        }
        (async () => {
            var author = await db.query("SELECT theme_author FROM themes WHERE theme_name = $1; ", [data.theme])
            author = author.rows[0].theme_author
            const room = await createRoom(data.theme, data.socket, data.id, 0, 0, data.leading, data.countPlayer, data.name, author)
            var room1 = {
                ...room,
                checkTheme: false
            }
            gameRooms.push(room1)
            if (!data.leading) {
                socket.to('0').emit("createNewRoom", room1)
            }
            if (data.leading) {
                socket.leave('0')
                socket.join(room.room_id.toString())
            }
            cb(room1)
        })()
    })
    socket.on("createCheckRoom", (data, cb) => {
        if (!data.theme || !data.socket || !data.id || !data.name) {
            return cb("Данные не корректны")
        }
        (async () => {
            var author = await db.query("SELECT theme_author FROM themes WHERE theme_name = $1; ", [data.theme])
            author = author.rows[0].theme_author
            const room = await createRoom(data.theme, data.socket, data.id, 0, 0, data.leading, data.countPlayer, data.name, author)
            var room1 = {
                ...room,
                checkTheme: true
            }
            gameRooms.push(room1)
            if (!data.leading) {
                socket.to('0').emit("createNewRoom", room1)
            }
            if (data.leading) {
                socket.leave('0')
                socket.join(room1.room_id.toString())
            }
            cb(room1)
        })()
    })
    socket.on("joinRoom", (data, cb) => {
        if (!data.room_id || !data.socket || !data.id || !data.name) {
            return cb("Данные не корректны")
        }
        (async () => {
            var room = {}
            var name = []
            var res = {}
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.room_id) {
                    if (gameRooms[i].room_clientsSocket.length >= gameRooms[i].room_countPlayers) {
                        return cb(2)
                    }
                    gameRooms[i].room_clientsSocket.push(data.socket)
                    gameRooms[i].room_clientsId.push(data.id)
                    gameRooms[i].room_clientsName.push(data.name)
                    gameRooms[i].room_clientsScore.push(0)
                    room = gameRooms[i]
                    for (var j = 0; j < gameRooms[i].room_clientsId.length; j++) {
                        var sel = await db.query("SELECT team_name FROM teams WHERE team_id = $1; ", [gameRooms[i].room_clientsId[j]])
                        name.push(sel.rows[0].team_name)
                    }
                    res = {
                        room_id: room.room_id,
                        comandName: name,
                        room_theme: room.room_theme,
                        room_countPlayers: room.room_countPlayers
                    }
                }
            }
            socket.to('0').emit("joinToGameRoomLoad", res)
            cb(room)
        })()
    })
    socket.on("leaveRoom", (data, cb) => {
        if (!data.room_id || !data.socket || !data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.room_id) {
                    for (let j = 0; j < gameRooms[i].room_clientsId.length; j++) {
                        if (gameRooms[i].room_clientsId[j] = data.id) {
                            gameRooms[i].room_clientsId.splice(j, 1)
                            gameRooms[i].room_clientsName.splice(j, 1)
                            gameRooms[i].room_clientsSocket.splice(j, 1)
                            gameRooms[i].room_clientsScore.splice(j, 1)
                        }
                    }
                    if (!gameRooms[i].room_clientsId.length) {
                        gameRooms.splice(i, 1)
                    }
                    socket.to('0').emit("leaveGameRoomLoad", gameRooms)
                }
            }
            cb(1)
        })()
    })
    socket.on("transitionQuestion", (data, cb) => {
        if (!data.theme || !data.id || !data.number) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    gameRooms[i].room_current_question = data.number
                    gameRooms[i].room_questions[data.number - 1] = ''
                    socket.to(data.id.toString()).emit("transitQuest", gameRooms[i])
                    cb(gameRooms[i])
                }
            }
            cb(1)
        })()
    })
    socket.on("transitionGameTable", (data, cb) => {
        if (!data.theme || !data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    gameRooms[i].room_current_question = -1
                    if (data.step + 1 < gameRooms[i].room_countPlayers) {
                        gameRooms[i].room_clientStep = data.step + 1
                    } else {
                        gameRooms[i].room_clientStep = 0
                    }
                    socket.to(data.id.toString()).broadcast.emit("transitTable", gameRooms[i])
                    cb(gameRooms[i])
                }
            }
            cb(1)
        })()
    })
    socket.on("nextStep", (data, cb) => {
        if (!data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    if (data.bool) {
                        if (data.step + 1 < gameRooms[i].room_countPlayers) {
                            gameRooms[i].room_clientStep = data.step + 1
                        } else {
                            gameRooms[i].room_clientStep = 0
                        }
                        io.in(data.id.toString()).emit("nextStepClient", gameRooms[i])
                        cb(gameRooms[i])
                    } else {
                        socket.in(data.id.toString()).emit("nextStepClient", gameRooms[i])
                        cb(gameRooms[i])
                    }
                }
            }
            cb(1)
        })()
    })
    socket.on("transitionGame", (data, cb) => {
        if (!data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            socket.leave('0')
            socket.join(data.id.toString())
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    socket.in(data.id.toString()).emit("step", gameRooms[i])
                }
            }
            cb(1)
        })()
    })
    socket.on("gameOver", (data, cb) => {
        if (!data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            var lenRoom = io.sockets.adapter.rooms[data.id.toString()]
            socket.leave(data.id.toString())
            socket.join('0')
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    if (!gameRooms[i].room_leading) {
                        if (lenRoom.length == 1) {
                            for (let j = 0; j < gameRooms[i].room_clientsId.length; j++) {
                                var oldScore = await db.query("SELECT team_rating, team_average_score, team_maximum_score, team_count_game FROM teams WHERE team_id = $1 ", [gameRooms[i].room_clientsId[j]])
                                oldScore = oldScore.rows[0]
                                if (gameRooms[i].room_clientsScore[j] > oldScore.team_maximum_score) {
                                    var updateMax = await db.query("UPDATE teams SET team_maximum_score=$1 WHERE team_id = $2 ", [gameRooms[i].room_clientsScore[j], gameRooms[i].room_clientsId[j]])
                                }
                                var mid = (oldScore.team_average_score * oldScore.team_count_game + gameRooms[i].room_clientsScore[j]) / (oldScore.team_count_game + 1)
                                mid = parseFloat(mid.toFixed(1))
                                var updateMid = await db.query("UPDATE teams SET team_average_score=$1 WHERE team_id = $2 ", [mid, gameRooms[i].room_clientsId[j]])
                                var updateCount = await db.query("UPDATE teams SET team_count_game=$1 WHERE team_id = $2 ", [oldScore.team_count_game + 1, gameRooms[i].room_clientsId[j]])
                                var rating = (((oldScore.team_count_game + 1) * mid) / ((oldScore.team_count_game + 1) * 7500)) * 5
                                rating = Math.round(rating)
                                var updeteRating = await db.query("UPDATE teams SET team_rating=$1 WHERE team_id = $2", [rating, gameRooms[i].room_clientsId[j]])
                            }
                            gameRooms.splice(i, 1)
                        }
                    } else {
                        if (gameRooms[i].checkTheme) {
                            gameRooms.splice(i, 1)
                            var check = {
                                check: true
                            }
                            cb(check)
                        } else {
                            gameRooms.splice(i, 1)
                        }
                    }
                }
            }
            cb(1)
        })()
    })
    socket.on("checkScore", (data, cb) => {
        if (!data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.id) {
                    cb(gameRooms[i])
                }
            }
            cb(1)
        })()
    })
    socket.on("checkAnswer", (data, cb) => {
        if (!data.id || !data.room_id || !data.numberQuest || !data.clientId) {
            return cb("Данные не корректны")
        }
        (async () => {
            const answerRight = await db.query("SELECT answer_id FROM answers WHERE question_id = $1 AND answer_right = $2; ", [data.numberQuest, true])
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].room_id == data.room_id) {
                    for (let j = 0; j < gameRooms[i].room_clientsSocket.length; j++) {
                        if (gameRooms[i].room_clientsId[j] == data.clientId) {
                            var cust_num = data.numberQuest % 5
                            var cust = 0
                            if (cust_num == 0) {
                                cust = 500
                            } else {
                                cust = cust_num * 100
                            }
                            if (answerRight.rows[0].answer_id == data.id) {
                                gameRooms[i].room_clientsScore[j] += cust
                            } else {
                                gameRooms[i].room_clientsScore[j] += 0
                            }
                            const res = {
                                id: answerRight.rows[0].answer_id
                            }
                            cb(res)
                        }
                    }
                    socket.to(data.room_id.toString()).emit("custQuest", gameRooms[i])
                }
            }

            //console.log(gameRooms)
            cb(1)
        })()
    })
    socket.on("imageProfile", (data, cb) => {
        if (!data.teamName || !data.imageName) {
            return cb("Данные не корректны")
        }
        (async () => {
            const team = await db.query("UPDATE teams SET team_image=$1 WHERE team_name = $2; ", [data.imageName, data.teamName])
            cb(team)
        })()
    })
    socket.on("requestRole", (data, cb) => {
        if (!data.text || !data.id) {
            return cb("Данные не корректны")
        }
        (async () => {
            const team = await db.query("UPDATE teams SET team_request_role=$1, team_text_request_role=$2 WHERE team_id = $3; ", [true, data.text, data.id])
            cb(team)
        })()
    })
    socket.on("giveRole", (data, cb) => {
        if (!data.boolLeading || !data.teamName) {
            return cb("Данные не корректны")
        }
        (async () => {
            var team = {}
            for (let i = 0; i < data.teamName.length; i++) {
                team = await db.query("UPDATE teams SET team_leading=$1 WHERE team_name = $2; ", [data.boolLeading[i], data.teamName[i]])
            }
            cb(team)
        })()
    })
    socket.on("updateVerified", (data, cb) => {
        if (!data.themeVerified || !data.themeId) {
            return cb("Данные не корректны")
        }
        (async () => {
            var theme = {}
            for (let i = 0; i < data.themeId.length; i++) {
                theme = await db.query("UPDATE themes SET theme_verified=$1 WHERE theme_id = $2; ", [data.themeVerified[i], data.themeId[i]])
            }
            cb(theme)
        })()
    })
    socket.on("checkOldPassword", (data, cb) => {
        if (!data.id || !data.oldPass) {
            return cb("Данные не корректны")
        }
        (async () => {
            var pass = await db.query("SELECT team_password FROM teams WHERE team_id=$1; ", [data.id])
            if (data.oldPass == pass.rows[0].team_password) {
                cb(2)
            } else {
                cb(1)
            }
        })()
    })
    socket.on("newPassword", (data, cb) => {
        if (!data.id || !data.password || !data.password) {
            return cb("Данные не корректны")
        }
        (async () => {
            if (data.password == data.password1) {
                var pass = await db.query("UPDATE teams SET team_password=$1 WHERE team_id = $2; ", [data.password, data.id])
                cb(2)
            } else {
                cb(1)
            }
        })()
    })
    socket.on('message', (data, cb) => {
        if (!data.author || !data.text) {
            return cb("Данные не корректны")
        }
        (async () => {
            const now = new Date()
            const value = date.format(now, 'YYYY/MM/DD HH:mm:ss')
            var msg = await db.query("INSERT INTO chat(msg_author, msg_text, msg_date) VALUES($1, $2, $3); ", [data.author, data.text, value])
            const message = {
                msg_author: data.author,
                msg_text: data.text,
                msg_date: value
            }
            io.in('0').emit("newMessage", message)
        })()
    })
    socket.on('disconnect', () => {
        for (let i = 0; i < clientOnline.length; i++) {
            if (socket.id == clientOnline[i].id) {
                clientOnline.splice(i, 1)
            }
        }
        for (let i = 0; i < gameRooms.length; i++) {
            for (let j = 0; j < gameRooms[i].room_clientsId.length; j++) {
                if (socket.id == gameRooms[i].room_clientsId[j]) {
                    socket.leave(gameRooms[i].roomId.toString())
                }
            }
        }
    })

})


module.exports = {
    app, server
}