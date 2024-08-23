<script>

import PaymentMeth from '../components/PaymentMeth.vue';

export default {
    name: 'PaymentPage',
    components: { PaymentMeth },
}

</script>

<template>
    <div class="container animate__animated animate__backInUp">
        <router-link :to="{ name: 'home' }" class="btn btn-primary btn-color mt-3 ms-2 ">
            <i class="fa-solid fa-arrow-left"></i> Torna ai ristoranti
        </router-link>
        
        <h1 class="my-3 p-0 text-center">Benvenuto nella pagina di pagamento </h1>
        <PaymentMeth></PaymentMeth>

    </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.btn-color{
  background-color: $secondColor;
  border-color: $primaryColor;

  &:hover{
  background-color: $primaryColor;
  }
}


</style>

