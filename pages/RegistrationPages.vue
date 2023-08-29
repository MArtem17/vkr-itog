<template>
    <v-form ref="form" v-model="valid" lazy-validation style="width: 40vw; margin: 30vh auto;">
        <v-text-field v-model="name" :counter="15" :rules="nameRules" label="Название команды" required>
        </v-text-field>

        <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
            :type="show ? 'text' : 'password'" label="Пароль" v-model="password" @click:append="show = !show" required>
        </v-text-field>

        <v-text-field v-if="password && password.length >= 4 && password.length <= 15"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules1" :type="show1 ? 'text' : 'password'"
            label="Подтвердите пароль" v-model="password1" @click:append="show1 = !show1" required>
        </v-text-field>
        <v-alert dense text type="success" v-if="registrationSuccess">
            Вы успешно зарегестрировались
        </v-alert>
        <v-alert dense text type="error" v-if="registrationErrorPassword">
            Введенные пароли не совпадают
        </v-alert>
        <v-alert dense text type="error" v-if="registrationErrorName">
            Команда с таким названием уже существует
        </v-alert>
        <v-btn :disabled="!valid" color="orange" class="mr-4" @click="registration">
            Зарегистрироваться
        </v-btn>
        <v-btn color="orange" class="mr-4" @click="exit">
            Назад
        </v-btn>
    </v-form>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: "RegistrationPages",
    data: () => ({
        valid: false,
        show: false,
        show1: false,
        registrationSuccess: false,
        registrationErrorName: false,
        registrationErrorPassword: false,
        name: '',
        nameRules: [
            v => !!v || 'Придумайте название команды',
            v => (v && v.length <= 15) || 'Название команды не должно превышать 15 символов',
        ],
        password: '',
        password1: '',
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
        sessionStorage.removeItem('room')
        sessionStorage.removeItem('time')
        sessionStorage.removeItem('timeSet')
        sessionStorage.removeItem('team')
    },
    methods: {
        ...mapMutations(["setTeam"]),
        registration() {
            if (this.$refs.form.validate()) {
                const team = {
                    name: this.name,
                    password: this.password,
                    password1: this.password1
                }
                this.$socket.emit('registrationTeam', team, data => {
                    if (typeof data === 'string') {
                        console.error(data)
                    } else if (typeof data === 'number') {
                        if (data == 1) {
                            this.registrationSuccess = false;
                            this.registrationErrorPassward = false;
                            this.registrationErrorName = true;
                            this.password = ""
                            this.password1 = ""
                            this.name = ""
                        }
                        if (data == 2) {
                            this.registrationSuccess = false;
                            this.registrationErrorNoName = false;
                            this.registrationErrorPassward = true;
                            this.passward1 = ""
                            this.password = ""
                        }
                    } else {
                        const team1 = data
                        this.setTeam(team1)
                        this.registrationErrorNoName = false;
                        this.registrationErrorPassward = false;
                        this.registrationSuccess = true;
                        sessionStorage.setItem('team', JSON.stringify(team1))
                        setTimeout(() => { this.goToMenuPages(); }, 700);
                    }
                })
            }
        },
        goToMenuPages() {
            this.$router.replace({
                name: "MenuPages"
            })
        },
        exit() {
            this.$router.replace({
                name: "index"
            })
        }
    }
}
</script>