<template>
    <div>
        <v-btn color="orange" @click="goToMenuPages"
            style="position: fixed; left: 5vw; top: 3vw; z-index: 1; font-size: 1.7vw;">В
            меню</v-btn>
        <p class="text--primary text-center" style="font-size: 3vw; margin: 3vh;">
            Доступные комнаты:
        </p>
        <div v-if="rooms.length">
            <v-card class="m-auto" max-width="80vw" v-for="(item, i) in rooms.length" :key="i"
                style="margin-top: 20px; margin-bottom: 2vh; margin-left: 10vw; font-size: 2vw;">
                <v-card-title>Комната №{{ rooms[i].room_id }}</v-card-title>
                <v-row>
                    <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                        <p style="margin-left: 10px;">
                            Тема игры: {{ rooms[i].room_theme }}
                        </p>
                    </v-col>

                    <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                        <p style="position: absolute; right: 10px;">
                            Количество игроков в комнате: {{ rooms[i].room_clientsId.length }}/{{
                                rooms[i].room_countPlayers
                            }}
                        </p>
                    </v-col>

                    <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                        <p style="margin-left: 10px;">
                            Автор темы: {{ rooms[i].room_theme_author }}
                        </p>
                    </v-col>

                    <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                        <v-card-actions style="position: absolute; right: 10px;">
                            <v-btn color="orange lighten-2" text style=" font-size: 1.7vw;" @click="joinRoom(i)">
                                Присоединиться
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
export default {
    name: "GameRoomsPages",
    computed: mapState(['rooms']),
    data: () => ({
    }),
    async beforeMount() {
        sessionStorage.removeItem('room')
        const response = await fetch('/GameRoomsPages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json()
        this.setRooms(result.data.rooms)
        this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
    },
    methods: {
        ...mapMutations(["setRooms"]),
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
        joinRoom(idx) {
            const room = {
                room_id: this.rooms[idx].room_id,
                socket: JSON.parse(sessionStorage.getItem('team')).team_socket_id,
                id: JSON.parse(sessionStorage.getItem('team')).team_id,
                name: JSON.parse(sessionStorage.getItem('team')).team_name
            }
            this.$socket.emit('joinRoom', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    sessionStorage.setItem('room', JSON.stringify(data))
                    const room = JSON.parse(sessionStorage.getItem('room'))
                    const team = JSON.parse(sessionStorage.getItem('team'))
                    const temp = {
                        ...team,
                        ...{
                            team_room: room.room_id
                        }
                    }
                    sessionStorage.setItem('team', JSON.stringify(temp))
                    if (this.leading) {
                        console.log("Вы присоединяетесь, а не ведущий")
                    } else {
                        setTimeout(() => { this.goToGameRoomPages(room.room_id); }, 300);
                    }
                }
            })
        },
        goToGameRoomPages(room_id) {
            this.$router.replace({
                name: "GameRoomPages",
                params: {
                    room_id: room_id
                }
            })
        },
        goToMenuPages() {
            this.$router.replace({
                name: "MenuPages"
            })
        },
    }
}
</script>