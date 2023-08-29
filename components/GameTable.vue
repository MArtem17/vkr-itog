<template>
    <div width="100vw" height="100vh" v-if="loading">
        <v-card width="98vw" height="97vh" style="position: fixed; left: 1vw; top:0.5vh;" :class="{
                opacity: gameOver
            }">
            <v-item-group dark>
                <v-row v-for="(item, i) in 5" :key="i" style="font-size:2.8vw; height: 18vh;" class="mt-3">
                    <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                        <v-item>
                            <p style="height: 18vh; display:table-cell; vertical-align: middle; color: orange;">{{
                                game.categoryes[i]
                            }}</p>
                        </v-item>
                    </v-col>
                    <v-col cols="9" sm="9" md="9" lg="9" xl="9">
                        <v-row style=" height: 18vh;">
                            <v-col cols="1" sm="1" md="1" lg="1" xl="1"></v-col>
                            <v-col v-for="(item, j) in 5" :key="j" cols="2" sm="2" md="2" lg="2" xl="2">
                                <v-item style=" height: 18vh; display:table-cell; vertical-align: middle;">
                                    <v-btn :disabled="cust_question[j + i * 5] == '' || !stepClient || gameOver"
                                        color="orange" text height="7vh" @click="goQuest(j + i * 5 + 1)"
                                        style="font-size: 4vw;">{{
                                            cust_question[j + i * 5]
                                        }}
                                    </v-btn>
                                </v-item>
                            </v-col>
                            <v-col cols="1" sm="1" md="1" lg="1" xl="1"></v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-item-group>
            <v-btn color="orange" text @click="$parent.goToMenuPages"
                style="font-size: 2vw; position: absolute; bottom: 20px; right: 30px;" tile v-if="leading">
                Закончить игру
            </v-btn>
            <v-card-text text style="color: orange; font-size: 2.5vw; position: absolute; bottom: 20px; left: 150px;"
                v-if="!leading" :key="stepName">
                Ход
                команды: {{ stepName }}</v-card-text>
            <v-card-text class=" text--primary" style="position: absolute; bottom: 20px; font-size: 2.5vw;"
                v-if="stepClient && !leading">
                {{ minutes }} : <span v-if="seconds < 10">0</span>{{ seconds }}
            </v-card-text>
        </v-card>
        <div v-if="gameOver" style="position: relative; top:10vh; z-index: 1; margin-bottom: 10vh;">
            <v-row justify="center">
                <v-col cols="10" sm="8" md="6">
                    <v-card style="margin-top: 5vh; ">
                        <v-list>
                            <v-card-title class="orange darken-1">
                                <span class="text-h5 white--text">Результаты игры</span>
                                <v-spacer></v-spacer>
                                <v-btn @click="$parent.goToMenuPages()">В меню</v-btn>
                            </v-card-title>
                            <div v-for="(item, i) in countPlayers" :key="i">
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-icon style="font-size: 20px;" color="orange">{{ i + 1 }} место</v-icon>
                                    </v-list-item-action>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ scores[i].name }}</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-list-item-title>{{ scores[i].score }}</v-list-item-title>
                                    </v-list-item-action>
                                </v-list-item>

                                <v-divider inset v-if="i + 1 != countPlayers"></v-divider>
                            </div>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<style>
.opacity {
    opacity: 0.3;
}
</style>
<script>
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
export default {
    data: () => ({
        game: {
            categoryes: ["", "", "", "", ""]
        },
        stepClient: false,
        loading: false,
        countPlayers: 0,
        gameOver: false,
        scores: [],
        stepName: "",
        minutes: 0,
        seconds: 30,
        stopTimer: true,
        boolStep: false
    }),
    watch: {
        currentQuest(newVal, oldVal) {
            if (newVal != -1) {
                sessionStorage.removeItem('timeSet')
                this.stopTimer = true
                this.$parent.goToQuestionPages(newVal)
            }
        },
        room(newVal, oldVal) {
            var step = this.step
            var room = this.room
            sessionStorage.setItem('room', JSON.stringify(newVal))
            for (let i = 0; i < newVal.room_clientsId.length; i++) {
                if (step == i) {
                    this.stepName = newVal.room_clientsName[i]
                }
            }
            for (let i = 0; i < newVal.room_clientsId.length; i++) {
                if ((this.teamId == newVal.room_clientsId[i]) && step == i) {
                    this.stepClient = true
                    if (!this.leading && this.stopTimer) {
                        const time = {
                            minutes: 0,
                            seconds: 30
                        }
                        sessionStorage.setItem('timeSet', JSON.stringify(time))
                        this.seconds = JSON.parse(sessionStorage.getItem('timeSet')).seconds
                        this.minutes = JSON.parse(sessionStorage.getItem('timeSet')).minutes
                        this.stopTimer = false
                        this.boolStep = false
                        this.timer()
                    }
                    break
                } else {
                    this.stopTimer = true
                    sessionStorage.removeItem('timeSet')
                    this.stepClient = false
                }
            }
        },
        cust_question(newVal, oldVal) {
            if (!this.leading) {
                var count = 0
                for (let i = 0; i < newVal.length; i++) {
                    if (newVal[i] == "") {
                        count++
                    }
                }
                if (count == 3) {
                    this.stopTimer = true
                    sessionStorage.removeItem('time')
                    var massScore = []
                    var massScoreRoom = []
                    var massName = []
                    const room = {
                        id: JSON.parse(sessionStorage.getItem('room')).room_id
                    }
                    this.$socket.emit('checkScore', room, data => {
                        if (typeof data === 'string') {
                            console.error(data)
                        } else if (typeof data === 'object') {
                            for (let i = 0; i < data.room_clientsScore.length; i++) {
                                massScore.push(data.room_clientsScore[i])
                                massScoreRoom.push(data.room_clientsScore[i])
                                massName.push(data.room_clientsName[i])
                            }
                            massScore.sort(function (a, b) {
                                return b - a
                            })
                        }
                        this.scores = []
                        for (let i = 0; i < massScore.length; i++) {
                            for (let j = 0; j < massScoreRoom.length; j++) {
                                if (massScore[i] == massScoreRoom[j]) {
                                    this.scores.push({
                                        name: massName[j],
                                        score: massScoreRoom[j]
                                    })
                                    massName.splice(j, 1)
                                    massScoreRoom.splice(j, 1)
                                    break
                                }
                            }
                        }
                        this.setRoom0({})
                        this.gameOver = true
                    })
                }
            }
        }
    },
    mounted() {
        var step = this.step
        var room = this.room
        sessionStorage.setItem('room', JSON.stringify(room))
        for (let i = 0; i < room.room_clientsId.length; i++) {
            if (step == i) {
                this.stepName = room.room_clientsName[i]
            }
        }
        for (let i = 0; i < room.room_clientsId.length; i++) {
            if ((this.teamId == room.room_clientsId[i]) && step == i) {
                this.stepClient = true
                if (!this.leading && this.stopTimer) {
                    const time = {
                        minutes: 0,
                        seconds: 30
                    }
                    sessionStorage.setItem('timeSet', JSON.stringify(time))
                    this.seconds = JSON.parse(sessionStorage.getItem('timeSet')).seconds
                    this.minutes = JSON.parse(sessionStorage.getItem('timeSet')).minutes
                    this.stopTimer = false
                    this.boolStep = false
                    this.timer()
                }
                break
            } else {
                this.stopTimer = true
                sessionStorage.removeItem('timeSet')
                this.stepClient = false
            }
        }
    },
    computed: {
        ...mapState(['cust_question', 'room1']),
        leading() {
            return JSON.parse(sessionStorage.getItem('room')).room_leading
        },
        themeName() {
            return JSON.parse(sessionStorage.getItem('room')).room_theme
        },
        roomId() {
            return JSON.parse(sessionStorage.getItem('room')).room_id
        },
        teamId() {
            return JSON.parse(sessionStorage.getItem('team')).team_id
        },
        currentQuest() {
            return this.getQuestionCurrent()
        },
        step() {
            return this.getStep()
        },
        room() {
            return this.getRoom1()
        }
    },
    async beforeMount() {
        this.stepClient = false
        this.setRoom1(JSON.parse(sessionStorage.getItem('room')))
        let data = {
            themeName: this.themeName,
            roomId: this.roomId
        }
        const response = await fetch('/GameTable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        this.game.categoryes = result.data.categoryes
        this.setCustQuestion(result.data.room_questions)
        this.countPlayers = JSON.parse(sessionStorage.getItem('room')).room_countPlayers
        this.checkJoinRoom(JSON.parse(sessionStorage.getItem('room')).room_id)
        this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
        this.loading = true
    },
    methods: {
        ...mapMutations(["setCustQuestion", "setRoom1", "setRoom0"]),
        ...mapGetters(["getQuestionCurrent", "getStep", "getRoom1"]),
        checkJoinRoom(id) {
            const room = {
                id: id,
                sock_id: JSON.parse(sessionStorage.getItem('team')).team_socket_id
            }
            this.$socket.emit('joinIO', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    sessionStorage.setItem('room', JSON.stringify(data.room))
                    var team = JSON.parse(sessionStorage.getItem('team'))
                    team.team_socket_id = data.sock
                    sessionStorage.setItem('team', JSON.stringify(team))
                }
            })
        },
        checkOnline(name) {
            const room = {
                name: name
            }
            this.$socket.emit('joinIOname', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                }
            })
        },
        goQuest(i) {
            this.stopTimer = true
            sessionStorage.removeItem('timeSet')
            this.$parent.goToQuestionPages(i)
        },
        timer() {
            if (this.seconds - 1 < 0) {
                if (this.minutes !== 0) {
                    this.seconds = 59
                    this.minutes = (this.minutes - 1 < 0) ? 0 : (this.minutes - 1)
                } else {
                    this.stopTimer = true
                    this.stepClient = false
                    this.next()
                    sessionStorage.removeItem('timeSet')
                    this.boolStep = false
                    return
                }
            } else {
                this.seconds--;
            }
            const data = {
                seconds: this.seconds,
                minutes: this.minutes
            }
            if (!this.stopTimer) {
                sessionStorage.setItem('timeSet', JSON.stringify(data))
                setTimeout(() => { this.timer() }, 1000)
            } else {
                sessionStorage.removeItem('timeSet')
            }
        },
        next() {
            sessionStorage.removeItem('timeSet')
            const room = {
                id: JSON.parse(sessionStorage.getItem('room')).room_id,
                step: this.room.room_clientStep,
                bool: true
            }
            this.$socket.emit('nextStep', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    sessionStorage.setItem('room', JSON.stringify(data))
                }
            })
        },
    }
}
</script>