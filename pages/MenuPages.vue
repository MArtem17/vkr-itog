<template>
  <div v-if="loading" style="min-height: 550px;">
    <client-only>
      <v-row style="margin: 0px 0px; position: relative;">
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-card :class="{ opacity: (boolRequestRole || boolGiveRole || boolCheckNewTheme) }"
            style="position: relative; margin: 10vh 5vw 0px; min-height: 400px; height: 80vh; max-height: 80vh; min-width: 400px; ">
            <v-card-title class="orange darken-1">
              <span class="text-h5 white--text" style="margin: 0px auto;">Меню</span>
            </v-card-title>
            <div>
              <Menu />
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-card :class="{ opacity: (boolRequestRole || boolGiveRole || boolCheckNewTheme) }"
            style="position: relative; margin: 10vh 5vw  0px; min-height: 400px; height: 80vh; max-height: 80vh; min-width: 40vw;">
            <v-card-title class="orange darken-1">
              <span class="text-h5 white--text" style="margin: 0px auto;">Чат между игроками</span>
            </v-card-title>
            <div style="position: absolute; min-height: 250px; height: 60vh; max-height: 60vh; width: 100%;"
              class="c-chat" ref="block">
              <Message v-for="(message, i) in messages" :key="i" :name="message.msg_author" :text="message.msg_text"
                :owner="message.msg_author == name" />
            </div>
            <div style="position: absolute; width:100%; bottom: 0px;">
              <v-text-field solo v-model="message" :append-outer-icon="'mdi-send'" filled clear-icon="mdi-close-circle"
                clearable label="Введите сообщение" background-color="grey darken-3" hide-details=false type="text"
                @click:append-outer="sendMessage" @click:clear="clearMessage"
                style="position: absolute; width:100%; bottom: 0px;"></v-text-field>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <div style="position: fixed; width: 100vw; top:5vh; z-index: 1; margin-bottom: 10vh;" v-if="boolRequestRole">
        <RequestRole />
      </div>
      <div style="position: fixed; width: 100vw; top:5vh; z-index: 1; margin-bottom: 10vh;" v-if="boolGiveRole">
        <GiveRole />
      </div>
      <div style="position: fixed; width: 100vw; top:5vh; z-index: 1; margin-bottom: 10vh;" v-if="boolCheckNewTheme">
        <CheckNewTheme />
      </div>
    </client-only>
  </div>
</template>

<style>
.opacity {
  opacity: 0.3;
}

.c-chat {
  overflow-y: auto;
}
</style>

<script>
import Menu from '@/components/Menu'
import RequestRole from '@/components/RequestRole'
import GiveRole from '@/components/GiveRole'
import CheckNewTheme from '@/components/CheckNewTheme'
import Message from "@/components/Message"
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
export default {
  data: () => ({
    boolCheckNewTheme: false,
    boolGiveRole: false,
    boolRequestRole: false,
    message: "",
    loading: false,
    name: ""
  }),
  name: "MenuPages",
  components: {
    Menu, RequestRole, GiveRole, CheckNewTheme, Message
  },
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      });
    }
  },
  async beforeMount() {
    sessionStorage.removeItem('room')
    const response = await fetch('/MenuPages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json()
    this.name = JSON.parse(sessionStorage.getItem('team')).team_name
    this.setMessages(result.data.messages)
    this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
    if (this.checkBool) {
      this.boolCheckNewTheme = true
    }
    this.loading = true
  },
  mounted() {
    addEventListener('keydown', (event) => {
      if (event.key == 'Enter') {
        this.sendMessage();
      }
    });
  },
  methods: {
    ...mapMutations(["setMessages"]),
    clearMessage() {
      this.message = ''
    },
    sendMessage() {
      if (this.message != "") {
        const message = {
          author: JSON.parse(sessionStorage.getItem('team')).team_name,
          text: this.message
        }
        this.$socket.emit('message', message, data => {
          if (typeof data === 'string') {
            console.error(data)
          } else {
          }
        })
        this.message = ''
      }
    },
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
    check(themeName) {
      this.$router.replace({
        name: "NewGamePages",
        params: {
          leading: true,
          check: true,
          themeCheck: themeName
        }
      })
    },
    goToNewGamePages(leading) {
      this.$router.replace({
        name: "NewGamePages",
        params: {
          leading: leading
        }
      })
    },
    goToProfilePages() {
      this.$router.replace({
        name: "ProfilePages",
        params: {
          teamName: JSON.parse(sessionStorage.getItem('team')).team_name
        }
      })
    },
    async goToNewThemePages() {
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
      var leading = JSON.parse(sessionStorage.getItem('team')).team_leading
      if (leading) {
        this.$router.replace({ name: "NewThemePages" })
      }
    },
    goToGameRoomsPages() {
      this.$router.replace({ name: "GameRoomsPages" })
    },
    goToExit() {
      const team = {
        name: JSON.parse(sessionStorage.getItem('team')).team_name,
      }
      sessionStorage.removeItem('team')
      this.$socket.emit('goHome', team, data => {
        if (typeof data === 'string') {
          console.error(data)
        } else {
          sessionStorage.removeItem('team')
          this.$router.replace({
            name: "index"
          })
        }
      })
      this.$router.replace({ name: "index" })
    },
    goToRequestRole() {
      this.boolRequestRole = true
    },
    goToGiveRole() {
      this.boolGiveRole = true
    },
    goToCheckNewTheme() {
      this.boolCheckNewTheme = true
    },
    close() {
      this.boolRequestRole = false
      this.boolGiveRole = false
      this.boolCheckNewTheme = false
    }
  },
  computed: {
    ...mapState(['team', "messages"]),
    checkBool() {
      return this.$route.params.check
    }
  }
}

</script>