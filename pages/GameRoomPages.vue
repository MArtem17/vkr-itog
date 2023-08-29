<template>
    <div v-if="loading">
        <div style="position: relative; top:5vh; z-index: 1; margin-bottom: 10vh;" v-if="boolProfile">
            <Profile />
        </div>
        <div style="position: fixed; top:0vh; width:100vw;" :class="{
                opacity: boolProfile
            }">
            <p class="text--primary text-center" style="font-size: 4vw;">
                Тема игры: {{ room.room_theme }}
            </p>
            <p class="text--primary text-center" style="font-size: 2vw;">
                Количество игроков в комнате: {{ countPlayers }}/{{
                    roomCountPlayersRes
                }}
            </p>
            <div style="margin-top: 10vh;">
                <v-card class="m-auto" max-width="80vw" max-height="10vh" v-for="(item, i) in countPlayers" :key="i"
                    style="margin-top: 2vh; margin-left: 10vw; font-size: 1.7vw;">
                    <v-row>
                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                            <p style="margin-left: 10px;">
                                Название команды: {{ room.comandName[i] }}
                            </p>
                        </v-col>

                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                            <v-btn color="orange" class="mr-4" @click="profileComand(i)"
                                style="position: absolute; right: 10px;  font-size: 1.5vw; margin-top: 0.3vh;">
                                Профиль команды
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </div>
            <v-btn color="orange" class="mr-4" @click="leaveRoom"
                style="position:fixed; bottom: 5vh; right: 10vw; margin-top: 10vh; margin-left: 10vw; font-size: 1.5vw; ">
                Выйти из комнаты
            </v-btn>
        </div>
    </div>
</template>

<style>
.opacity {
    opacity: 0.3;
}
</style>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
import Profile from '@/components/Profile'
export default {
    name: "GameRoomPages",
    components: {
        Profile
    },
    watch: {
        countPlayers(newVal, oldVal) {
            if (newVal == this.roomCountPlayersRes) {
                this.goToGameTablePages()
            }
        }
    },
    mounted() {
        if (this.roomCountPlayersRes) {
            if (this.countPlayers == this.roomCountPlayersRes) {
                this.goToGameTablePages()
            }
        }
    },
    computed: {
        ...mapState(['room']),
        countPlayers() {
            return this.countPlayersInRoom()
        },
        roomCountPlayersRes() {
            return this.countPlayersRes()
        },
        margin() {
            return this.countPlayers * 10 + 15
        }
    },
    data: () => ({
        loading: false,
        boolProfilePages: false,
        boolProfile: false,
        comandName: ""
    }),
    async beforeMount() {
        let data = {
            room_id: JSON.parse(sessionStorage.getItem('room')).room_id
        }
        const response = await fetch('/GameRoomPages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        this.setRoom(result.data)
        this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
        setTimeout(() => { this.loading = true }, 300)
    },
    methods: {
        ...mapMutations(["setRoom"]),
        ...mapGetters(["countPlayersInRoom", "countPlayersRes"]),
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
        profileComand(i) {
            this.comandName = this.room.comandName[i]
            this.boolProfile = true
        },
        closeProfile() {
            this.boolProfile = false
            this.comandName = ""
        },
        leaveRoom() {
            const room = {
                room_id: JSON.parse(sessionStorage.getItem('room')).room_id,
                socket: JSON.parse(sessionStorage.getItem('team')).team_socket_id,
                id: JSON.parse(sessionStorage.getItem('team')).team_id,
            }
            this.$socket.emit('leaveRoom', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else {
                    sessionStorage.removeItem('room')
                    this.$router.replace({
                        name: "GameRoomsPages"
                    })
                }
            })
        },
        goToGameTablePages() {
            const room = {
                id: this.room.room_id ? this.room.room_id : JSON.parse(sessionStorage.getItem('room')).room_id
            }
            this.$socket.emit('transitionGame', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                }
            })
            this.$router.replace({
                name: "GameTablePages",
                params: {
                    leading: false
                }
            })
        },
    }
}
</script>