<template>
    <div v-if="loading">
        <v-row justify="center">
            <v-col cols="10" sm="8" md="6">
                <v-card style="margin-top: 5vh; " :class="{
                        opacity: newPassword
                    }">
                    <v-card-title class="orange darken-1">
                        <span class="text-h5 white--text">{{ team.team_name }}</span>

                        <v-spacer></v-spacer>


                        <v-btn v-if="$parent.$data.boolProfilePages" @click="$parent.goToMenuPages()">В меню</v-btn>
                        <v-btn icon v-if="!$parent.$data.boolProfilePages" @click="$parent.closeProfile()">
                            <v-icon style="font-size: 50px;">mdi-close-circle-outline</v-icon>
                        </v-btn>

                    </v-card-title>

                    <v-list>
                        <v-list-item v-if="$parent.$data.boolProfilePages">
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-account-key</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Изменить пароль</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="newPassword = true">
                                    <v-icon style="font-size: 40px;">mdi-account-cog</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider inset v-if="$parent.$data.boolProfilePages"></v-divider>

                        <v-list-item>
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-star-half-full</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Рейтинг команды:</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-rating readonly v-model="team.team_rating" background-color="white"
                                    color="yellow accent-4" dense half-increments size="20"></v-rating>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-counter</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Количество игр:</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-title style="font-size: 30px;">{{ team.team_count_game }}</v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-trophy</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Рекордный счет:</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-title style="font-size: 30px;">{{ team.team_maximum_score
                                }}</v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-trophy-award</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Средний счет за игру:</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-title style="font-size: 30px;">{{ team.team_average_score
                                }}</v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-action>
                                <v-icon style="font-size: 40px;" color="orange">mdi-monitor-eye</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Право быть ведущим:</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-title style="font-size: 30px;">{{ team.team_leading }}</v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-file-input v-if="$parent.$data.boolProfilePages"
                        style="margin-bottom: -80px; position: relative; z-index: 1; width: 100px" accept="image/*"
                        type="file" name="image" />
                    <v-btn v-if="$parent.$data.boolProfilePages && boolImgBtn" color="orange" @click="uploadImage"
                        style="margin-bottom: -60px; margin-left: 120px; position: relative; z-index: 1;">Загрузить
                        фото</v-btn>
                    <v-btn v-if="$parent.$data.boolProfilePages && boolImgBtnNew" color="orange" @click="uploadImage"
                        style="margin-bottom: -60px;margin-left: 120px; position: relative; z-index: 1;">Обновить
                        фото</v-btn>
                    <v-img :src="team.team_image" height="200px"></v-img>
                </v-card>
                <div v-if="newPassword" style="position: relative; top:-80vh; z-index: 1; margin-bottom: 10vh;">
                    <v-card max-width="40vw" style="margin: auto auto;">
                        <v-card-title class="orange darken-1">
                            <span class="text-h5 white--text">Изменение пароля</span>
                        </v-card-title>
                        <v-form ref="form" v-model="valid" lazy-validation
                            style="width: 30vw; margin: auto auto; height: 40vh; position: relative;">
                            <v-text-field :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :rules="oldPasswordRules"
                                :type="show2 ? 'text' : 'password'" label="Текущий пароль" v-model="oldpassword"
                                @click:append="show2 = !show2" required v-if="!oldPass">
                            </v-text-field>

                            <v-btn color="orange" class="mr-4" @click="oldPassCheck" v-if="!oldPass"
                                style="position: absolute; bottom: 50px;">
                                Далее
                            </v-btn>

                            <v-text-field v-if="oldPass" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="passwordRules" :type="show ? 'text' : 'password'" label="Придумайте новый пароль"
                                v-model="password" @click:append="show = !show" required>
                            </v-text-field>

                            <v-text-field v-if="password && password.length >= 4 && password.length <= 15 && oldPass"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules1"
                                :type="show1 ? 'text' : 'password'" label="Подтвердите пароль" v-model="password1"
                                @click:append="show1 = !show1" required>
                            </v-text-field>
                            <v-alert dense text type="success" v-if="newPasswordSuccess">
                                Вы успешно изменили пароль
                            </v-alert>
                            <v-alert dense text type="error" v-if="newPasswordError">
                                Введенные пароли не совпадают
                            </v-alert>
                            <v-alert dense text type="error" v-if="oldPasswordError">
                                Неверный пароль
                            </v-alert>
                            <v-btn :disabled="!valid" color="orange" class="mr-4" @click="newPass" v-if="oldPass"
                                style="position: absolute; bottom: 50px;">
                                Изменить пароль
                            </v-btn>
                            <v-btn color="orange" class="mr-4" @click="exit"
                                style="position: absolute; bottom: 50px; right: 50px;">
                                Назад в профиль
                            </v-btn>
                        </v-form>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
<style>
.opacity {
    opacity: 0.05;
}
</style>
<script>
export default {
    data: () => ({
        team: {
            team_image: 'default-img.jpg'
        },
        loading: false,
        rating: 0,
        boolImgBtn: false,
        boolImgBtnNew: false,
        newPassword: false,
        oldPass: false,
        valid: false,
        show: false,
        show1: false,
        show2: false,
        newPasswordSuccess: false,
        newPasswordError: false,
        oldPasswordError: false,
        oldpassword: '',
        password: '',
        password1: '',
        oldPasswordRules: [
            v => !!v || 'Введите пароль',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
        passwordRules: [
            v => !!v || 'Придумайте пароль',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
        passwordRules1: [
            v => !!v || 'Введите пароль еще раз',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
    }),
    async beforeMount() {
        let data = {
            teamName: this.$parent.$data.comandName,
            boolLoadInf: true
        }
        const response = await fetch('/Profile', {
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
            this.team = result.data.team
            if (this.team.team_image == 'default-img.png') {
                this.boolImgBtnNew = false
                this.boolImgBtn = true
            } else {
                this.boolImgBtn = false
                this.boolImgBtnNew = true
            }
            this.team.team_image = require(`~/assets/image/${this.team.team_image}`)
            if (this.team.team_leading) {
                this.team.team_leading = "Да"
            } else {
                this.team.team_leading = "Нет"
            }
        }
        this.loading = true
    },
    methods: {
        async uploadImage() {
            const formData = new FormData();
            const fileField = document.querySelector('input[type="file"]')
            formData.append('image', fileField.files[0])
            try {
                const response = await fetch('/Profile', {
                    method: 'POST',
                    body: formData

                });
                const result = await response.json()
                if (result.data) {
                    const img = {
                        teamName: this.$parent.$data.comandName,
                        imageName: result.data.name
                    }
                    this.$socket.emit('imageProfile', img, data => {
                        if (typeof data === 'string') {
                            console.error(data)
                        } else if (typeof data === 'object') {
                            this.team = data
                            this.team.team_image = require(`~/assets/image/${this.team.team_image}`)
                        }
                    })
                }
            } catch (error) {
                console.error('Ошибка:', error)
            }
        },
        oldPassCheck() {
            const team = {
                id: JSON.parse(sessionStorage.getItem('team')).team_id,
                oldPass: this.oldpassword
            }
            this.$socket.emit('checkOldPassword', team, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'number') {
                    if (data == 1) {
                        this.newPasswordSuccess = false
                        this.newPasswordError = false
                        this.oldPasswordError = true
                        this.oldpassword = ""
                    }
                    if (data == 2) {
                        this.newPasswordSuccess = false
                        this.newPasswordError = false
                        this.oldPasswordError = false
                        this.oldPass = true
                        this.passward1 = ""
                        this.password = ""
                    }
                }
            })
        },
        newPass() {
            const team = {
                id: JSON.parse(sessionStorage.getItem('team')).team_id,
                password: this.password,
                password1: this.password1
            }
            this.$socket.emit('newPassword', team, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'number') {
                    if (data == 1) {
                        this.newPasswordSuccess = false
                        this.oldPasswordError = false
                        this.newPasswordError = true
                        this.password = ""
                        this.password1 = ""
                    }
                    if (data == 2) {
                        this.newPasswordError = false
                        this.oldPasswordError = false
                        this.newPasswordSuccess = true
                        setTimeout(() => { this.exit(); }, 500);
                    }
                }
            })
        },
        exit() {
            this.newPassword = false
            this.newPasswordSuccess = false
            this.newPasswordError = false
            this.oldPasswordError = false
            this.oldPass = false
        }
    }
}
</script>