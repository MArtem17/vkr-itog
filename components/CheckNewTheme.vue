<template>
    <div v-if="loading">
        <v-row justify="center">
            <v-col cols="11" sm="10" md="8">
                <v-card>
                    <v-list>
                        <v-card-title class="orange darken-1">
                            <span class="text-h5 white--text">Управление темами</span>
                            <v-spacer></v-spacer>
                            <v-btn @click="$parent.close()">Закрыть</v-btn>
                        </v-card-title>
                        <div v-for="(item, i) in themes.length" :key="i">
                            <v-list-item>
                                <v-list-item-action>
                                    <v-checkbox v-model="themeVerified[i]" color="orange" :value=themes[i].theme_name
                                        hide-details></v-checkbox>
                                </v-list-item-action>

                                <v-list-item-content>
                                    <v-list-item-title>Название темы: {{ themes[i].theme_name }}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-list-item-title>Автор: {{ themes[i].theme_author }}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-content>
                                    <v-btn color="orange" @click="$parent.check(themes[i].theme_name)">Проверить
                                        тему</v-btn>
                                </v-list-item-content>
                            </v-list-item>

                            <v-divider inset v-if="i + 1 != themes.length"></v-divider>
                        </div>
                    </v-list>
                    <v-alert dense text type="success" v-if="!boolBtn">
                        Изменения сохранены
                    </v-alert>
                    <v-btn color="orange" class="mr-4" @click="updateVerified()" style="margin: 10px 10px;">
                        Сохранить изменения
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>

export default {
    data: () => ({
        themes: [],
        themeVerified: [],
        boolBtn: true,
        loading: false
    }),
    methods: {
        updateVerified() {
            var themeVerified = []
            var themeId = []
            for (let i = 0; i < this.themeVerified.length; i++) {
                if (this.themeVerified[i] == "" || this.themeVerified[i] == null) {
                    themeVerified.push(false)
                } else {
                    themeVerified.push(true)
                }
                themeId.push(this.themes[i].theme_id)
            }
            const themes = {
                themeVerified: themeVerified,
                themeId: themeId,
            }
            console.log(themes)
            this.$socket.emit('updateVerified', themes, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    this.boolBtn = false
                    setTimeout(() => { this.boolBtn = true }, 3000)
                }
            })
        }
    },
    async beforeMount() {
        const response = await fetch('/CheckNewTheme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json()
        for (let i = 0; i < result.data.themes.length; i++) {
            this.themes.push(result.data.themes[i])
            if (result.data.themes[i].theme_verified) {
                this.themeVerified.push(result.data.themes[i].theme_verified)
            } else {
                this.themeVerified.push("")
            }
        }
        this.loading = true
    }
}
</script>