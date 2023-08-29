<template>
    <div>
        <GameTable />
    </div>
</template>
<script>
import GameTable from '@/components/GameTable'
export default {
    name: "GameTablePages",
    components: {
        GameTable
    },
    methods: {
        goToQuestionPages(index) {
            sessionStorage.removeItem('time')
            sessionStorage.removeItem('timeSet')
            const room = {
                theme: JSON.parse(sessionStorage.getItem('room')).room_theme,
                id: JSON.parse(sessionStorage.getItem('room')).room_id,
                leading: this.leading,
                number: index
            }
            this.$socket.emit('transitionQuestion', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    sessionStorage.setItem('room', JSON.stringify(data))
                }
            })
            this.$router.replace({
                name: "QuestionPages",
                params: {
                    leading: this.leading,
                    numberQuestion: index
                }
            })
        },
        goToMenuPages() {
            const room = {
                id: JSON.parse(sessionStorage.getItem('room')).room_id,
            }
            var check = false
            sessionStorage.removeItem('room')
            sessionStorage.removeItem('time')
            sessionStorage.removeItem('timeSet')
            this.$socket.emit('gameOver', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    if (data.check) {
                        check = true
                    }
                    this.$router.replace({
                        name: "MenuPages",
                        params: {
                            check: check,
                        }
                    })
                } else {
                    this.$router.replace({
                        name: "MenuPages",
                        params: {
                            check: check,
                        }
                    })
                }
            })
        },
    },
    computed: {
        leading() {
            return this.$route.params.leading
        }
    }
}

</script>