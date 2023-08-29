<template>
    <client-only>
        <div v-if="loading">
            <v-form ref="form" style="width: 40vw; margin: 30vh auto;">

                <v-select :items="themes" label="Выберите тему" v-model="theme"></v-select>

                <v-select v-if="!leading" :items="counts" label="Выберите количество игроков" v-model="count"></v-select>

                <v-btn color="orange" class="mr-4" @click="create">
                    Создать
                </v-btn>
                <v-btn color="orange" class="mr-4" @click="exit">
                    Назад
                </v-btn>
            </v-form>
        </div>
    </client-only>
</template>
<script>
export default {
    name: "NewGamePages",
    data: () => ({
        theme: "",
        count: 2,
        themes: [],
        counts: [2, 3, 4, 5, 6, 7, 8],
        loading: false
    }),
    async beforeMount() {
        if (this.check == true) {
            this.checked(this.themeCheck)
        } else {
            let data = {
                leading: this.leading,
                author: this.sessionName
            }
            const response = await fetch('/NewGamePages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json()
            for (let i = 0; i < result.data.themes.length; i++) {
                this.themes.push(result.data.themes[i].theme_name)
            }
            this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
            this.loading = true
        }
    },
    methods: {
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
        checked(name) {
            const room = {
                theme: this.themeCheck,
                socket: JSON.parse(sessionStorage.getItem('team')).team_socket_id,
                id: JSON.parse(sessionStorage.getItem('team')).team_id,
                countPlayer: 1,
                leading: true,
                name: JSON.parse(sessionStorage.getItem('team')).team_name
            }
            this.$socket.emit('createCheckRoom', room, data => {
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
                    this.goToGameTablePages()
                }
            })
        },
        create() {
            if (this.theme != "") {
                const room = {
                    theme: this.theme,
                    socket: JSON.parse(sessionStorage.getItem('team')).team_socket_id,
                    id: JSON.parse(sessionStorage.getItem('team')).team_id,
                    countPlayer: this.count,
                    leading: this.leading,
                    name: JSON.parse(sessionStorage.getItem('team')).team_name
                }
                this.$socket.emit('createRoom', room, data => {
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
                            setTimeout(() => { this.goToGameTablePages(); }, 300);
                        } else {
                            setTimeout(() => { this.goToGameRoomPages(room.room_id); }, 300);
                        }
                    }
                })
            }
        },
        goToGameTablePages() {
            this.$router.replace({
                name: "GameTablePages",
                params: {
                    leading: this.leading
                }
            })
        },
        goToGameRoomPages(id) {
            this.$router.replace({
                name: "GameRoomPages",
                params: {
                    room_id: id
                }
            })
        },
        exit() {
            this.$router.replace({
                name: "MenuPages"
            })
        }
    },
    computed: {
        leading() {
            return this.$route.params.leading
        },
        check() {
            return this.$route.params.check
        },
        themeCheck() {
            return this.$route.params.themeCheck
        },
        sessionName() {
            return JSON.parse(sessionStorage.getItem('team')).team_name
        }
    }
}
</script>