<template>
    <v-container>
        <v-card v-if="info" min-height="500px" width="96vw" height="94vh"
            style="position: fixed; left: 2vw; top:2vh; z-index: 2;">
            <v-card-title class="orange darken-1">
                <span>Справочная информация</span>
                <v-spacer></v-spacer>

                <v-btn icon @click="info = false">
                    <v-icon style="font-size: 7vh;">mdi-close-circle-outline</v-icon>
                </v-btn>
            </v-card-title>
            <div style="overflow-y: auto; max-height: 80vh;">
                <h1 class="text-center"><strong>Создание новой темы</strong></h1>
                <ol>
                    <li>На первом этапе нужно придумать название темы, оно должно быть уникальным.
                    </li>
                    <li>Далее нужно придумать названия для 5 категорий, соответствующих теме.
                    </li>
                    <li>
                        После этого нужно нажать кнопку "Перейти к вводу вопросов", кнопка активна, только когда введены и
                        название новой темы и названия 5 категорий, если тема с таким названием уже существует, появится
                        соответствующее предупреждение.
                    </li>
                    <li>
                        Если проверка прошла успешно, открывается доступ к заполнению вопросов, каждая из 5 категорий
                        состоит из
                        5 вопросов разной сложности.
                    </li>
                    <li>
                        Для каждого вопроса необходимо заполнить следующие поля: <br>
                        <ul>
                            <li>
                                Тип вопроса
                            </li>
                            <li>
                                Текст вопроса
                            </li>
                            <li>
                                Текст правильного ответа
                            </li>
                            <li>
                                7 вариантов неправильных ответов
                            </li>
                            <li>
                                Если тип вопрос 1 или 2 типа необходимо загрузить изображение к вопросу, для этого нужно
                                выбрать
                                изображение со своего устройства и нажать кнопку "Загрузить". <br> Если вы захотели изменить
                                изображение то нужно выбрать новое изображение и нажать на кнопку "Обновить"
                            </li>
                        </ul>
                    </li>
                    <li>
                        Существует 3 типа вопросов: <br>
                        <ul>
                            <li>
                                1 тип - картинка отображается в вопросе, вариантов ответа нет
                            </li>
                            <li>
                                2 тип - картинка отображается в ответе, вариантов ответа нет
                            </li>
                            <li>
                                3 тип - картинка не требуется, предоставляется 4 варианта ответа
                            </li>
                            <li>
                                В многопользовательском режиме всегда предоставляется 4 варианта ответа на выбор,
                                изображения
                                так же отображаются
                            </li>
                        </ul>
                    </li>
                    <li>
                        Между вопросами можно переключаться при помощи кнопок внизу формы.
                    </li>
                    <li>
                        Когда все данные для 25 вопросов заполненны, нужно нажать кнопку "Создать тему". <br> Если тема
                        успешно создана, Вы переместитесь в главное меню. <br> Если возникли проблеммы Вы увидите сообщение
                        об ошибке.
                    </li>
                    <li>
                        Вы можете в любой момент прервать создание новой темы нажав кнопку "В меню", ВНИМАНИЕ, при этом
                        заполненные данные не сохранятся.
                    </li>
                </ol><br>
            </div>
        </v-card>
        <v-card v-if="!info" min-width="600px" min-height="700px" width="96vw" height="94vh"
            style="position: relative; z-index: 1;">
            <v-card-title class="orange darken-1">
                <span>Новая тема {{ themeName }}</span>
                <v-spacer></v-spacer>

                <v-btn @click="info = true" style="margin-right: 10px;">
                    Справка
                </v-btn>
                <v-btn @click="goToMenuPages()">
                    В меню
                </v-btn>
            </v-card-title>

            <v-form v-model="valid" lazy-validation ref="form">
                <div v-if="firstForm" width="90vw" height="80vh">
                    <v-row>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <v-text-field v-model="themeName" :rules="nameThemeRules" :counter="50" label="Название темы"
                                required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" v-for="(item, i) in 5" :key="i">
                            <v-text-field v-model="themeCategory[i]" :rules="categoryThemeRules" :counter="50"
                                :label="'Название ' + (i + 1) + ' категории'" required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-alert dense text type="error" v-if="newThemeNameError">
                        Такая тема уже существует
                    </v-alert>
                    <v-btn :disabled="!valid" color="orange" class="mr-4" @click="firstCheck"
                        style="position: absolute; bottom: 5vh; right: 5vw;">
                        Перейти к вводу вопросов
                    </v-btn>
                </div>
                <div v-else width="90vw" height="80vh">
                    <v-row class="text-center">
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <h3>Вопрос № {{ idx }}. Категория {{ themeCategory[parseInt(((idx - 1) / 5))] }} за {{ (((idx %
                                5)
                                *
                                100) ? ((idx % 5) * 100) : 500)
                            }}</h3>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-select width="90%" :items="items" label="Тип вопроса"
                                v-model="typeQuestion[idx - 1]"></v-select>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="textQuestion[idx - 1]" :rules="textQuestionRules"
                                :counter="500" label="Текст вопроса" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionRight[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст правильного ответа" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar1[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 1" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar2[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 2" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar3[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 3" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar4[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 4" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar5[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 5" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar6[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 6" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-text-field width="90%" v-model="answerQuestionVar7[idx - 1]" :rules="answerQuestionRules"
                                :counter="500" label="Текст не правильного ответа 7" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-file-input v-for="(item, i) in 25" :key="i" :class="{ hidden: (i != (idx - 1)) }"
                                :disabled="(typeQuestion[idx - 1] == 3)" width="90%" accept="image/*" type="file"
                                name="image" />
                        </v-col>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                            <v-btn :disabled="(typeQuestion[idx - 1] == 3)" v-if="!imageQuestion[idx - 1].length"
                                width="90%" color="orange" @click="uploadImage(idx - 1)">Загрузить </v-btn>
                            <v-btn v-else color="orange" @click="deleteImage(idx - 1)" width="90%"> Обновить </v-btn>
                        </v-col>
                    </v-row>
                    <div style="margin-top: 5vh;" class="text-center">
                        <v-pagination :total-visible="8" v-model="idx" class="my-4" :length="25"></v-pagination>
                    </div>
                    <v-alert dense text type="error" v-if="questionImage">
                        Загрузите картинки ко всем вопросам 1 и 2 типа
                    </v-alert>
                    <v-btn :disabled="!valid" color="orange" class="mr-4" @click="lastCheck"
                        style="position: absolute; bottom: 5vh; right: 5vw;">
                        Создать тему
                    </v-btn>
                </div>
            </v-form>

        </v-card>
    </v-container>
</template>

<style>
.hidden {
    width: 0px;
    height: 0px;
    margin: 0px 0px;
    padding: 0px 0px;
    opacity: 0;
}
</style>

<script>

export default {
    name: "NewThemePages",
    data: () => ({
        valid: false,
        idx: 1,
        info: true,
        questionImage: false,
        newThemeNameError: false,
        firstForm: true,
        items: ['1', '2', '3'],
        themeName: '',
        themeCategory: ['', '', '', '', ''],
        typeQuestion: [],
        textQuestion: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        imageQuestion: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionRight: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar1: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar2: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar3: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar4: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar5: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar6: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        answerQuestionVar7: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        nameThemeRules: [
            v => !!v || 'Введите название Вашей темы',
            v => v.length <= 50 || 'Масимум 50 символов',
        ],
        categoryThemeRules: [
            v => !!v || 'Введите название для категории',
            v => v.length <= 50 || 'Масимум 50 символов',
        ],
        textQuestionRules: [
            v => !!v || 'Введите текст вопроса',
            v => v.length <= 500 || 'Масимум 500 символов',
        ],
        answerQuestionRules: [
            v => !!v || 'Введите текст вопроса',
            v => v.length <= 500 || 'Масимум 500 символов',
        ]
    }),
    methods: {
        firstCheck() {
            if (this.themeName.length) {
                let k = 0
                for (let i = 0; i < this.themeCategory.length; i++) {
                    if (this.themeCategory[i].length < 1) {
                        k++
                    }
                }
                if (k == 0) {
                    const Theme = {
                        name: this.themeName
                    }
                    this.$socket.emit('checkTheme', Theme, data => {
                        if (typeof data === 'string') {
                            console.error(data)
                        } else if (typeof data === 'number') {
                            if (data == 1) {
                                this.newThemeNameError = true
                            }
                            if (data == 2) {
                                this.firstForm = false
                            }
                        }
                    })
                }
            }
        },
        lastCheck() {
            if (this.$refs.form.validate()) {
                for (let i = 0; i < this.imageQuestion.length; i++) {
                    if (this.imageQuestion[i] == '' && this.typeQuestion[i] != 3) {
                        this.questionImage = true
                        return
                    }
                    if (this.textQuestion[i] == '' || this.typeQuestion[i] == '' || this.answerQuestionRight[i] == '' || this.answerQuestionVar1[i] == '' || this.answerQuestionVar2[i] == '' || this.answerQuestionVar3[i] == '' || this.answerQuestionVar4[i] == '' || this.answerQuestionVar5[i] == '' || this.answerQuestionVar6[i] == '' || this.answerQuestionVar7[i] == '') {
                        this.questionImage = true
                        return
                    }
                }
                const newTheme = {
                    name: this.themeName,
                    author: JSON.parse(sessionStorage.getItem('team')).team_name,
                    categoryes: this.themeCategory,
                    typeQuestion: this.typeQuestion,
                    textQuestion: this.textQuestion,
                    imageQuestion: this.imageQuestion,
                    answerQuestionRight: this.answerQuestionRight,
                    answerQuestionVar1: this.answerQuestionVar1,
                    answerQuestionVar2: this.answerQuestionVar2,
                    answerQuestionVar3: this.answerQuestionVar3,
                    answerQuestionVar4: this.answerQuestionVar4,
                    answerQuestionVar5: this.answerQuestionVar5,
                    answerQuestionVar6: this.answerQuestionVar6,
                    answerQuestionVar7: this.answerQuestionVar7
                }
                this.$socket.emit('newTheme', newTheme, data => {
                    if (typeof data === 'string') {
                        console.error(data)
                    } else if (typeof data === 'number') {
                        if (data == 2) {
                            setTimeout(() => { this.goToMenuPages(); }, 700);
                        }
                    }
                })
            }
        },
        goToMenuPages() {
            this.$router.replace({
                name: "MenuPages"
            })
        },
        async uploadImage(idx) {
            const formData = new FormData();
            const fileField = document.querySelectorAll('input[type="file"]')
            formData.append('image', fileField[idx].files[0])
            try {
                const response = await fetch('/NewThemePages', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json()
                if (result.data) {
                    this.imageQuestion[idx] = result.data.name
                }
            } catch (error) {
                console.error('Ошибка:', error)
            }
            this.imageQuestion = [...this.imageQuestion]
        },
        deleteImage(idx) {
            this.imageQuestion[idx] = ''
            this.imageQuestion = [...this.imageQuestion]
        }
    }
}
</script>