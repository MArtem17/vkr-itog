<template>
    <div style="position: relative;">
        <client-only>
            <div :class="{
                opacity: input
            }" style="position: relative; top:0vh; width:100vw;">
                <v-toolbar color="orange" dark style="position: sticky; z-index: 1; top:0px; width: 100vw;" height="50vh"
                    max-height="50vh">
                    <v-toolbar-title style="font-size: 1.5vw">Знатоки</v-toolbar-title>

                    <v-divider class="mx-4" vertical></v-divider>

                    <span class="subheading" style="font-size: 1vw">web-приложение для интерактивной игры</span>

                    <v-spacer></v-spacer>

                    <v-toolbar-items>
                        <v-btn text @click="input = true" style="font-size: 1vw">
                            Войти
                        </v-btn>

                        <v-btn text @click="registration" style="font-size: 1vw">
                            Зарегистрироваться
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-main>
                    <v-card width="100vw" height="100vh">
                        <v-img class="white--text align-end" height="100%" :src="require(`~/assets/image/banner-home.jpg`)"
                            style="position: relative;">
                            <v-row style="position: absolute; width: 100vw; top:20vh;">
                                <v-col cols="5" sm="6" md="7" lg="7" xl="7"></v-col>
                                <v-col cols="7" sm="6" md="5" lg="5" xl="5">
                                    <p
                                        style="color: rgba(255, 255, 255, 0); font-size: 5vh; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: white;">
                                        <strong>WEB-ПРИЛОЖЕНИЕ <span style="font-size: 7vh;">ЗНАТОКИ</span></strong>
                                    </p>
                                    <p
                                        style="color: rgba(255, 255, 255, 0); font-size: 5vh; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: white;">
                                        <strong>ПРОВЕРЬ СВОИ ЗНАНИЯ!</strong>
                                    </p>
                                    <v-btn color="orange" class="mr-4" @click="input = true" style="font-size: 3vh">
                                        Войти
                                    </v-btn>

                                    <v-btn color="orange" class="mr-4" @click="registration" style="font-size: 3vh">
                                        Зарегистрироваться
                                    </v-btn>
                                    <br /><br />
                                    <a href="#rules" style="color: orange; font-size: 4vh;">подробнее</a>
                                </v-col>
                            </v-row>
                        </v-img>
                    </v-card>
                    <a name="rules"></a>
                    <v-container fluid style="margin-top: 5vh;">
                        <div>
                            <p class="text-center" style="font-size: 5vh;"><strong>Описание игры</strong></p>
                            <v-row>
                                <v-col cols="12" sm="12" md="7" lg="6" xl="6">
                                    <p>При регистрации, пользователь получает основной функционал:
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Профиль</v-list-item-title>
                                                <v-list-item-subtitle>Просмотр, изменение аватара и
                                                    пароля</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Игра в многопользовательском режиме</v-list-item-title>
                                                <v-list-item-subtitle>Создание новой или присоединение к уже существующей
                                                    комнате</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Права ведущего</v-list-item-title>
                                                <v-list-item-subtitle>Можно запросить права ведущего, для расширения
                                                    функционала</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Чат</v-list-item-title>
                                                <v-list-item-subtitle>Возможность общения с другими
                                                    игроками</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        При получении прав ведущего, функционал расширяется:

                                        <v-list-item three-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Игра в качестве ведущего</v-list-item-title>
                                                <v-list-item-subtitle>Возможность использовать приложение,
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>как техническое
                                                    оснащение для
                                                    интеллектуальной игры</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Новые темы</v-list-item-title>
                                                <v-list-item-subtitle>Возможность создавать новые темы для будущих
                                                    игр</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="12" md="5" lg="6" xl="6">
                                    <v-img :src="require(`~/assets/image/quiz-home.jpg`)"></v-img>
                                </v-col>
                            </v-row>


                            <p class="text-center" style="font-size: 5vh;"><strong>Правила игры</strong></p>
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-img :src="require(`~/assets/image/rules-home.jpeg`)"></v-img>
                                </v-col>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <p>Игра в многопользовательском режиме:
                                        <br><br>
                                    <ul>
                                        <li>Игра начинается как только в игровой комнате собралось нужное количество человек
                                        </li>
                                        <li>Игроки выбирают вопросы по очереди, пока выбирает один игрок, остальные ждут
                                        </li>
                                        <li>
                                            На выбор вопроса у игрока есть 30 секунд
                                        </li>
                                        <li>
                                            Если игрок не выбрал вопрос, то ход переходит следующему игроку
                                        </li>
                                        <li>После выбора вопроса одним из игроков, все участники игры видят выбранный
                                            вопрос, после чего выбирают правильный, по их мнению, ответ
                                        </li>
                                        <li>На вопрос всегда есть 4 варианта ответа, 1 из них верный, нужно выбрать кнопку с
                                            номером, соответствующим правильному ответу
                                        </li>
                                        <li>
                                            На ответ у игрока есть 1 минута, после чего будет показано был выбран правильный
                                            ответ или нет
                                        </li>
                                        <li>
                                            В случае правильного ответа, игрок получает то количество очков, сколько стоил
                                            вопрос
                                        </li>
                                        <li>
                                            В случае ошибки, игрок получает 0 очков
                                        </li>
                                        <li>Игра заканчавается после того как все вопросы были открыты</li>
                                    </ul><br>

                                    Игра в качестве ведущего:
                                    <ul>
                                        <li>В данном режиме нет автоматического подсчета очков и явного деления на команды
                                        </li>
                                        <li>Обязательно присутствие ведущего и членов жюри для подсчета очков</li>
                                        <li>Есть вопросы с варианами ответа и без них</li>
                                        <li>Нет временного ограничения на выбор вопроса</li>
                                        <li>На ответ всем командам, аналогично многопользовательскому режиму, дается 1
                                            минута
                                        </li>
                                        <li>Если все команды дали ответ быстрее окончания таймера, можно досрочно показать
                                            правильный ответ<br>
                                            После чего вернуться к игровому полю выбора вопросов</li>
                                        <li>Игра может закончитья в любой момент, на усмотрение ведущего</li>
                                    </ul>

                                    </p>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-main>

                <v-footer style="padding: 0px 0px;">
                    <v-card class="flex" flat tile style="width: 100vw;" color="orange">
                        <v-card-text class="py-2 white--text text-center">
                            <strong class="subheading text-center">Приложение разработано в рамках дипломной работы,
                                {{ new Date().getFullYear() }} — Макаров Артём Александрович</strong>
                        </v-card-text>
                    </v-card>
                </v-footer>
            </div>
            <v-card v-if="input" max-width="50vw"
                style="position: fixed; top: 20%; z-index:1; padding: 5vh 5vw; margin: auto 25vw;">
                <v-btn icon @click="input = false" style="position: absolute; right: 30px;">
                    <v-icon style="font-size: 40px;">mdi-close-circle-outline</v-icon>
                </v-btn>
                <v-form ref="form" v-model="valid" lazy-validation style="width: 40vw;">
                    <v-text-field v-model="name" :counter="15" :rules="nameRules" label="Название команды" required>
                    </v-text-field>
                    <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
                        :type="show ? 'text' : 'password'" label="Пароль" v-model="password" @click:append="show = !show"
                        required>
                    </v-text-field>
                    <v-alert dense text type="success" v-if="inputSuccess">
                        Вы успешно вошли
                    </v-alert>
                    <v-alert dense text type="error" v-if="inputErrorNoName">
                        Команды с таким названием не существует
                    </v-alert>
                    <v-alert dense text type="error" v-if="inputErrorPassward">
                        Неверный пароль
                    </v-alert>
                    <v-alert dense text type="error" v-if="inputErrorOnline">
                        Вы уже вошли с другого устройства
                    </v-alert>
                    <v-btn :disabled="!valid" color="orange" class="mr-4" @click.enter="enter">
                        Войти
                    </v-btn>

                    <v-btn color="orange" class="mr-4" @click="registration">
                        Зарегистрироваться
                    </v-btn>
                </v-form>
            </v-card>
        </client-only>
    </div>
</template>

<style>
.opacity {
    opacity: 0.3;
}
</style>

<script>
import { mapMutations } from 'vuex'
export default {
    name: "index",
    sockets: {
        connect() {
            console.log("CLient IO connected")
        },
        disconnect() {
            console.log("Client IO disconected")
        }
    },
    mounted() {
        addEventListener('keydown', (event) => {
            if (event.key == 'Enter' && this.valid) {
                this.enter();
            }
        });
    },
    data: () => ({
        input: false,
        show: false,
        valid: false,
        inputSuccess: false,
        inputErrorNoName: false,
        inputErrorPassward: false,
        inputErrorOnline: false,
        name: '',
        nameRules: [
            v => !!v || 'Введите название команды',
            v => (v && v.length <= 15) || 'Название команды не должно превышать 15 символов',
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Введите пароль',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
        srcs: [
            `game-table-solo.png`, "question-solo.png",
            "game-table-multi.png", "question-multi.png",
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
        goToMenuPages() {
            this.$router.replace({
                name: "MenuPages"
            })
        },
        goToRegistationPages() {
            this.$router.replace({
                name: "RegistrationPages"
            })
        },
        enter() {
            if (this.$refs.form.validate()) {
                const team = {
                    name: this.name,
                    password: this.password
                }
                this.$socket.emit('inputTeam', team, data => {
                    if (typeof data === 'string') {
                        console.error(data)
                    } else if (typeof data === 'number') {
                        if (data == 2) {
                            this.inputErrorNoName = false;
                            this.inputSuccess = false;
                            this.inputErrorOnline = false;
                            this.inputErrorPassward = true;
                            this.password = ""
                        }
                        if (data == 3) {
                            this.inputErrorPassward = false;
                            this.inputSuccess = false;
                            this.inputErrorOnline = false;
                            this.inputErrorNoName = true;
                            this.name = ""
                            this.password = ""
                        }
                        if (data == 4) {
                            this.inputErrorPassward = false;
                            this.inputSuccess = false;
                            this.inputErrorNoName = false;
                            this.inputErrorOnline = true;
                            this.name = ""
                            this.password = ""
                        }
                    } else {
                        const team1 = data
                        this.setTeam(team1)
                        this.inputErrorNoName = false;
                        this.inputErrorPassward = false;
                        this.inputErrorOnline = false;
                        this.inputSuccess = true;
                        sessionStorage.setItem('team', JSON.stringify(team1))
                        setTimeout(() => { this.goToMenuPages(); }, 700);
                    }
                })
            }
        },
        registration() {
            this.goToRegistationPages()
        },
    },
}
</script>