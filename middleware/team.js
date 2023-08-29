export default function ({ store, redirect }) {
    if (typeof window !== 'undefined') {
        if (!Object.keys(store.state.team).length) {
            if (localStorage.getItem('team') == undefined) {
                redirect('/?massege=noTeam')
            } else {
                store.state.team = localStorage.getItem(JSON.parse('team'))
            }
        }
    }
}
