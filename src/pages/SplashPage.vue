<script>

    export default {
        name: 'SplashPage',
    };

</script>


<template>

    <section id="splash-page" class="d-flex justify-content-center align-items-center bg-white w-100 h-100">
        <img src="/images/wowdelive.svg" class="animate__animated animate__heartBeat" alt="Loading..."/>
    </section>

</template>


<style lang="scss" scoped>

#splash-page {

    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    img{

        height: 150px;
        width: 150px;

    }    
}

</style>