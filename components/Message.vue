<template>
    <div class="wrap">
        <div class="mes" :class="{ owner }">
            <small>
                <strong>{{ name }}</strong>
            </small>
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        text: String,
        owner: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.wrap {
    display: flex;
    flex-direction: column;
}

.mes {
    padding: 1rem;
    width: 60%;
    margin: 0 1rem;
    box-shadow: 0 1px 0 0 rgba(50, 50, 50, 0.3);
    border-radius: 4px;
    background: orange;
    color: white;
    position: relative;
    margin-bottom: 1rem;
}

p {
    margin-bottom: 0;
}

.owner {
    background: #ffffff;
    color: #000000;
    align-self: flex-end;
}
</style>