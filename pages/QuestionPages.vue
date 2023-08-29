<template>
    <div>
        <Question />
    </div>
</template>
<script>
import Question from '@/components/Question'
import { mapGetters } from 'vuex'
export default {
    name: "QuestionPages",
    components: {
        Question
    },
    methods: {
        ...mapGetters(["getRoom1"]),
        goToGameTable() {
            const room = {
                theme: JSON.parse(sessionStorage.getItem('room')).room_theme,
                id: JSON.parse(sessionStorage.getItem('room')).room_id,
                leading: this.leading,
                step: this.room.room_clientStep
            }
            this.$socket.emit('transitionGameTable', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    sessionStorage.setItem('room', JSON.stringify(data))
                }
            })
        },
        goToReplaceGameTable() {
            this.$router.replace({
                name: "GameTablePages",
                leading: this.leading
            })
        }
    },
    computed: {
        leading() {
            return this.$route.params.leading
        },
        room() {
            return this.getRoom1()
        }
    },
}

</script>