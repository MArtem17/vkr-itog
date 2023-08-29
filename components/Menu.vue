<template>
    <div>
        <client-only>
            <div v-if="loading">
                <div class="text-center" style="margin: 5vh auto;">
                    <div class="btn">
                        <v-btn @click="$parent.$parent.goToNewGamePages(false)" rounded color="orange" dark width="40vh"
                            height="5vh" style="min-width: 300px;">
                            Создать новую игру
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn @click="$parent.$parent.goToGameRoomsPages()" rounded color="orange" dark width="40vh"
                            height="5vh" style="min-width: 300px;">
                            Присоединиться к игре
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn @click="$parent.$parent.goToProfilePages()" rounded color="orange" dark width="40vh"
                            height="5vh" style="min-width: 300px;">
                            Посмотреть свой профиль
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn :disabled="!leading" @click="$parent.$parent.goToNewThemePages()" rounded color="orange" dark
                            width="40vh" height="5vh" style="min-width: 300px;">
                            Создать новую тему
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn :disabled="!leading" @click="$parent.$parent.goToNewGamePages(true)" rounded color="orange"
                            dark width="40vh" height="5vh" style="min-width: 300px;">
                            Начать игру в роли ведущего
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn v-if="!leading" @click="$parent.$parent.goToRequestRole()" rounded color="orange" dark
                            width="40vh" height="5vh" style="min-width: 300px;">
                            Запросить права ведущего
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn v-if="name == 'Admin'" @click="$parent.$parent.goToGiveRole()" rounded color="orange" dark
                            width="40vh" height="5vh" style="min-width: 300px;">
                            Выдать права ведущего
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn v-if="name == 'Admin'" @click="$parent.$parent.goToCheckNewTheme()" rounded color="orange"
                            dark width="40vh" height="5vh" style="min-width: 300px;">
                            Проверить новые темы
                        </v-btn>
                    </div>
                    <div class="btn">
                        <v-btn @click="$parent.$parent.goToExit()" rounded color="orange" dark width="40vh" height="5vh"
                            style="min-width: 300px;">
                            Выйти
                        </v-btn>
                    </div>
                </div>
            </div>
        </client-only>
    </div>
</template>

<style>
.btn {
    margin: 10px auto;
}
</style>

<script>
export default {
    data: () => ({
        leading: false,
        name: "",
        loading: false
    }),
    async beforeMount() {
        sessionStorage.removeItem('room')
        let data = {
            name: JSON.parse(sessionStorage.getItem('team')).team_name,
            socket: JSON.parse(sessionStorage.getItem('team')).team_socket_id,
        }
        const response = await fetch('/Menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        sessionStorage.setItem('team', JSON.stringify(result.data.team))
        this.leading = JSON.parse(sessionStorage.getItem('team')).team_leading
        this.name = JSON.parse(sessionStorage.getItem('team')).team_name
        this.loading = true
    }
}
</script>