<template>
    <div>
        <Profile />
    </div>
</template>
<script>
import Profile from '@/components/Profile'
export default {
    name: "ProfilePages",
    data: () => ({
        boolProfilePages: true,
        comandName: "",
    }),
    components: {
        Profile
    },
    methods: {
        checkOnline(name) {
            const room = {
                name: name
            }
            console.log(room)
            this.$socket.emit('joinIOname', room, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                }
            })
        },
        goToMenuPages() {
            this.$router.replace({
                name: "MenuPages"
            })
        }
    },
    async beforeMount() {
        this.comandName = (this.$route.params.teamName ? this.$route.params.teamName : JSON.parse(sessionStorage.getItem('team')).team_name)
        this.checkOnline(JSON.parse(sessionStorage.getItem('team')).team_name)
    },
}

</script>