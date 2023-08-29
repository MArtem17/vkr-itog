<template>
    <div v-if="loading">
        <v-card width="98vw" height="98vh" style="margin-left: 1vw; margin-top:1vh;">
            <p class="text--primary text-center" style="font-size: 2.5vw;">
                {{ textQuestion }}
            </p>
            <v-img v-if="typeQuestion == 1" class="justify-center" max-height="40vh" max-width="50vw"
                style="margin: 3vh auto 10px;" :src="pathImage">
            </v-img>
            <v-img v-if="((typeQuestion == 2) && answerRight)" class="justify-center" max-height="40vh" max-width="50vw"
                style="margin: 3vh auto 10px;" :src="pathImage">
            </v-img>

            <v-card-text class=" text--primary text-center" style="font-size: 3vw;"
                v-if="leading && typeQuestion !== 3 && answerRight">
                <div>{{ answerText }}</div>
            </v-card-text>

            <div style="margin: 10vh 15vw 10vh 35vw;">
                <v-card-text class=" text--primary" style="font-size: 2vw;" v-if="leading && typeQuestion == 3"
                    v-for="(answerQuestion, i) in answerQuestions" :key="i">
                    <p :class="{ right: ((answerQuestion == answerText) && answerRight) }">{{ i + 1 }}) {{
                        answerQuestion }}
                    </p>
                </v-card-text>
            </div>
            <div v-if="!leading">
                <p class="text--primary text-center" v-for="(answerQuestion, i) in answerQuestions" :key="i"
                    style="font-size: 2.5vh;">
                    {{ i + 1 }}) {{ answerQuestion }}
                </p>
            </div>
            <v-card-text class=" text--primary" style="position: absolute; bottom:15vh; left:5vw; font-size: 4vw;"
                v-if="!answerRight">
                {{ minutes }} : <span v-if="seconds < 10">0</span>{{ seconds }}
            </v-card-text>
            <v-card-actions v-if="!leading">
                <v-item-group style="position: absolute; bottom:3vh; width: 100vw;">
                    <v-row>
                        <v-col v-for="(answerQuestion, i) in answerQuestions" :key="i" cols="3" sm="3" md="3" lg="3" xl="3">
                            <v-item>
                                <v-btn color="white" text @click="answerClick(i)"
                                    style="font-size: 3vh;  display: inline-block;" outlined width="20vw" height="4vh"
                                    :class="{
                                            select: (i == answerSelect), notRight: (i == answerSelectNotRight), yesRight: (i == answerSelectRight)
                                        }">
                                    {{ i + 1 }}
                                </v-btn>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-item-group>
            </v-card-actions>
            <v-card-actions class="justify-center" v-if="leading">
                <v-btn color="orange" text style="font-size: 2vw; position: fixed; bottom: 5vh; left: 35vw;"
                    class="pa-2 mr-16" tile @click="answer">
                    Показать правильный ответ
                </v-btn>
                <v-btn color="orange" text @click="exit" style="font-size: 2vw; position: fixed; bottom: 5vh; right: 5vw;"
                    class="pa-2 ml-16" tile>
                    Назад
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style>
.right {
    color: green;
}

.select {
    background: orange;
}

.notRight {
    background: red;
}

.yesRight {
    background: green;
}
</style>

<script>
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
export default {
    data: () => ({
        textQuestion: "",
        imageQuestion: `usa.jpg`,
        answerQuestions: [],
        answerText: "",
        typeQuestion: 0,
        answersId: [],
        answerRight: false,
        loading: false,
        minutes: 1,
        seconds: 0,
        stopTimer: false,
        answerSelect: -1,
        answerSelectRight: -1,
        answerSelectNotRight: -1
    }),
    methods: {
        ...mapMutations(["setTeam"]),
        ...mapGetters(["getQuestionCurrent"]),
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
        exit() {
            this.stopTimer = true
            sessionStorage.removeItem('time')
            this.$parent.goToReplaceGameTable()
        },
        answer() {
            this.stopTimer = true
            this.answerRight = true
        },
        answerClick(i) {
            this.answerSelect = i
        },
        showAnswerRight(answer_id) {
            const answer = {
                id: answer_id,
                room_id: this.roomId,
                numberQuest: this.$route.params.numberQuestion ? this.$route.params.numberQuestion : JSON.parse(sessionStorage.getItem('room')).room_current_question,
                clientId: this.clientId
            }
            this.$socket.emit('checkAnswer', answer, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    for (let i = 0; i < this.answersId.length; i++) {
                        if (this.answersId[i] == data.id) {
                            this.answerSelectRight = i
                        }
                        if (data.id !== answer_id && answer_id == this.answersId[i]) {
                            this.answerSelectNotRight = i
                        }
                    }
                }
            })
        },
        timer() {
            if (this.seconds - 1 < 0) {
                if (this.minutes !== 0) {
                    this.seconds = 59
                    this.minutes = (this.minutes - 1 < 0) ? 0 : (this.minutes - 1)
                } else {
                    this.stopTimer = true
                    this.answerRight = true
                    if (!this.leading) {
                        if (this.answerSelect == -1) {
                            this.showAnswerRight(-1)
                        } else {
                            this.showAnswerRight(this.answersId[this.answerSelect])
                        }
                        setTimeout(() => { this.$parent.goToGameTable() }, 5000)
                    }
                }
            } else {
                this.seconds--;
            }
            const data = {
                seconds: this.seconds,
                minutes: this.minutes
            }
            if (!this.stopTimer) {
                sessionStorage.setItem('time', JSON.stringify(data))
                setTimeout(() => { this.timer() }, 1000)
            } else {
                sessionStorage.removeItem('time')
            }
        }
    },
    watch: {
        currentQuest(newVal, oldVal) {
            if (newVal == -1) {
                this.$parent.goToReplaceGameTable()
            }
        }
    },
    computed: {
        ...mapState(['currentQuest']),
        pathImage() {
            return require(`~/assets/image/${this.imageQuestion}`)
        },
        leading() {
            return JSON.parse(sessionStorage.getItem('room')).room_leading
        },
        themeName() {
            return JSON.parse(sessionStorage.getItem('room')).room_theme
        },
        roomId() {
            return JSON.parse(sessionStorage.getItem('room')).room_id
        },
        clientId() {
            return JSON.parse(sessionStorage.getItem('team')).team_id
        },
        currentQuest() {
            return this.getQuestionCurrent()
        }
    },

    async beforeMount() {
        sessionStorage.removeItem('time')
        sessionStorage.removeItem('timeSet')
        let data = {
            roomTheme: this.themeName,
            roomId: this.roomId,
            numberQuestion: this.$route.params.numberQuestion ? this.$route.params.numberQuestion : JSON.parse(sessionStorage.getItem('room')).room_current_question,
        }
        const response = await fetch('/Question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        if (result.status === false) {
            console.log('result status = ', result.status)
        } else if (result.status === true) {
            this.textQuestion = result.data.question_text
            this.imageQuestion = result.data.question_image
            for (let i = 0; i < result.data.answers.length; i++) {
                if (result.data.answers[i].answer_right == true) {
                    this.answerText = result.data.answers[i].answer_text
                    this.answerQuestions.push(result.data.answers[i].answer_text)
                    this.answersId.push(result.data.answers[i].answer_id)
                } else {
                    this.answerQuestions.push(result.data.answers[i].answer_text)
                    this.answersId.push(result.data.answers[i].answer_id)
                }
            }
            this.typeQuestion = result.data.question_type
        }
        if (!JSON.parse(sessionStorage.getItem('time'))) {
            const data = {
                minutes: 1,
                seconds: 0
            }
            sessionStorage.setItem('time', JSON.stringify(data))
        } else {
            this.seconds = JSON.parse(sessionStorage.getItem('time')).seconds
            this.minutes = JSON.parse(sessionStorage.getItem('time')).minutes
        }
        this.checkJoinRoom(JSON.parse(sessionStorage.getItem('room')).room_id)
        this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
        this.loading = true
        this.timer()
    }
}
</script>