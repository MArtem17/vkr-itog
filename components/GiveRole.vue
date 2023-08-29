<template>
    <client-only>
        <div v-if="loading">
            <v-row justify="center">
                <v-col cols="11" sm="10" md="8">
                    <v-card>
                        <v-list>
                            <v-card-title class="orange darken-1">
                                <span class="text-h5 white--text">Управление ролями</span>
                                <v-spacer></v-spacer>
                                <v-btn @click="$parent.close()">Закрыть</v-btn>
                            </v-card-title>
                            <div v-for="(item, i) in teams.length" :key="i">
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-checkbox v-model="leadingRole[i]" color="orange" :value=teams[i].team_name
                                            hide-details></v-checkbox>
                                    </v-list-item-action>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ teams[i].team_name }}</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-content>
                                        <v-textarea readonly v-model="teams[i].team_text_request_role" outlined
                                            name="input-text"></v-textarea>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-divider inset v-if="i + 1 != teams.length"></v-divider>
                            </div>
                        </v-list>
                        <v-alert dense text type="success" v-if="!boolBtn">
                            Изменения сохранены
                        </v-alert>
                        <v-btn color="orange" class="mr-4" @click="giveRole()" style="margin: 10px 10px;">
                            Сохранить изменения
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </client-only>
</template>

<script>

export default {
    data: () => ({
        teams: [],
        leadingRole: [],
        boolBtn: true,
        loading: false
    }),
    methods: {
        giveRole() {
            var boolLeading = []
            var teamName = []
            for (let i = 0; i < this.leadingRole.length; i++) {
                if (this.leadingRole[i] == "" || this.leadingRole[i] == null) {
                    boolLeading.push(false)
                } else {
                    boolLeading.push(true)
                }
                teamName.push(this.teams[i].team_name)
            }
            const teams = {
                boolLeading: boolLeading,
                teamName: teamName,
            }
            this.$socket.emit('giveRole', teams, data => {
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
        const response = await fetch('/GiveRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json()
        for (let i = 0; i < result.data.teams.length; i++) {
            this.teams.push(result.data.teams[i])
            if (result.data.teams[i].team_leading) {
                this.leadingRole.push(result.data.teams[i].team_name)
            } else {
                this.leadingRole.push("")
            }
        }
        this.loading = true
    }
}
</script>