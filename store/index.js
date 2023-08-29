export const state = () => ({
    team: {},
    messages: [],
    rooms: [],
    room: {
        room_id: "",
        room_theme: "",
        comandName: [],
        room_countPlayers: 0
    },
    room1: {
        room_id: "",
        room_theme: "",
        room_clientsSocket: [],
        room_clientsId: [],
        room_clientsScore: [],
        room_clientStep: "",
        room_questions: [],
        room_current_question: -1,
        room_leading: false,
        room_countPlayers: -1
    },
    cust_question: [],
    currentQuest: "",
    step: 0,
})

export const getters = {
    countPlayersInRoom(state) {
        return state.room.comandName.length
    },
    countPlayersRes(state) {
        return state.room.room_countPlayers
    },
    getQuestion(state) {
        return state.cust_question
    },
    getQuestionCurrent(state) {
        return state.currentQuest
    },
    getRoom(state) {
        return state.room
    },
    getRoom1(state) {
        return state.room1
    },
    getStep(state) {
        return state.step
    }
}

export const mutations = {
    setTeam(state, team) {
        state.team = team
    },
    setRooms(state, rooms) {
        state.rooms = []
        for (let i = 0; i < rooms.length; i++) {
            state.rooms.push(rooms[i])
        }
    },
    setMessages(state, messages) {
        state.messages = []
        for (let i = 0; i < messages.length; i++) {
            state.messages.push(messages[i])
        }
    },
    setRoom(state, room) {
        state.room = room
        console.log(state.room)
    },
    setRoom0(state, room) {
        state.room = room
    },
    setRoom1(state, room) {
        state.room1 = room
    },
    setCustQuestion(state, mass) {
        state.cust_question = mass
    },
    SOCKET_newMessage(state, message) {
        state.messages.push(message)
    },
    SOCKET_createNewRoom(state, room) {
        state.rooms.push(room)
    },
    SOCKET_joinToGameRoomLoad(state, room) {
        state.room = room
    },
    SOCKET_leaveGameRoomLoad(state, rooms) {
        state.rooms = []
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].room_countPlayers != rooms[i].room_clientsId.length) {
                state.rooms.push(rooms[i])
            }
        }
    },
    SOCKET_transitQuest(state, game) {
        state.currentQuest = game.room_current_question
    },
    SOCKET_transitTable(state, room) {
        state.currentQuest = -1
        state.step = room.room_clientStep
        state.room1 = room
    },
    SOCKET_nextStepClient(state, room) {
        state.step = room.room_clientStep
        state.room1 = room
        sessionStorage.setItem('room', JSON.stringify(room))
    },
    SOCKET_custQuest(state, room) {
        state.room1 = room
    },
    SOCKET_step(state, room) {
        state.room1 = room
    },
    SOCKET_start(state, val) {
        state.startGame = val
    }
}

// export const actions = {
//     SOCKET_newMessage(ctx, data) {
//         console.log('Message received', data)
//     },
//     SOCKET_createNewRoom(state, room) {
//         console.log("room", room)
//         console.log("state", state.rooms)
//     },
//     SOCKET_joinToGameRoomLoad(state, room) {
//         console.log("room1", room)
//         console.log("state1", state.room)
//     },
//     SOCKET_step(state, room) {
//         console.log("room1", room)
//     },
//     SOCKET_transitTable(state, room) {
//         console.log("trT", room)
//     },
//     SOCKET_nextStepClient(state, room) {
//         console.log("nextStep", room)
//     }
// }