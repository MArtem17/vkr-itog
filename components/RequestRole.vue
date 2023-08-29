<template>
    <v-row justify="center">
        <v-col cols="10" sm="8" md="6">
            <v-card>
                <v-card-title class="orange darken-1">
                    <span class="text-h5 white--text">Запрос роли ведущего</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="$parent.close()">Закрыть</v-btn>
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation style="width: 40vw; margin: 5vh auto;">
                    <v-textarea v-model="textRequest" required outlined :counter="500" :rules="textRules" clearable
                        name="input-text" label="Опишите для чего вам нужна роль ведущего"
                        placeholder="Хочу провести мероприятие с использованием данного приложения"></v-textarea>

                    <v-alert dense text type="success" v-if="!boolBtn" style="margin-bottom: 5vh;">
                        Запрос отправлен, ожидайте решение Администратора, если разрешение будет получено, функционал будет
                        активирован автоматически<br>
                        Вы можете изменить текст своего запроса, для уточнения ваших целей
                    </v-alert>
                    <v-btn v-if="boolBtn" :disabled="!valid" color="orange" class="mr-4" @click="requestRole()"
                        style="margin-bottom: 5vh;">
                        Отправить запрос
                    </v-btn>
                    <v-btn v-if="!boolBtn" :disabled="!valid" color="orange" class="mr-4" @click="requestRole()"
                        style="margin-bottom: 5vh;">
                        Обновить запрос
                    </v-btn>
                </v-form>
            </v-card>
        </v-col>
    </v-row>
</template>

<style></style>

<script>

export default {
    data: () => ({
        textRequest: "",
        boolBtn: true,
        valid: false,
        textRules: [
            v => !!v || 'Опишите для чего вам нужна роль ведущего',
            v => (v && v.length <= 500 && v.length >= 0) || 'Описание не должно превышать 500 символов',
        ],
    }),
    methods: {
        requestRole() {
            if (this.textRequest.length <= 500) {
                const team = {
                    text: this.textRequest,
                    id: JSON.parse(sessionStorage.getItem('team')).team_id,
                }
                this.$socket.emit('requestRole', team, data => {
                    if (typeof data === 'string') {
                        console.error(data)
                    } else if (typeof data === 'object') {
                        this.boolBtn = false
                    }
                })
            }
        }
    },
    async beforeMount() {
        let data = {
            name: JSON.parse(sessionStorage.getItem('team')).team_name
        }
        const response = await fetch('/RequestRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        if (result.data.team.team_request_role) {
            this.boolBtn = false
            this.textRequest = result.data.team.team_text_request_role
        } else {
            this.boolBtn = true
        }
        this.leading = JSON.parse(sessionStorage.getItem('team')).team_leading
        this.name = JSON.parse(sessionStorage.getItem('team')).team_name
        this.loading = true
    }
}
</script>