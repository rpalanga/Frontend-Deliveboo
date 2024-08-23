<script>
import { ref, watch } from 'vue';
// import { store } from '../store';

export default {

    name: 'CartItem',

    data() {
        return {

        //  store,


        }
    },
    mounted() {
        // const storedCart = localStorage.getItem('cart');
        // if (storedCart) {
        //     this.cart = JSON.parse(storedCart);
        // }
    },
    methods: {
        // addToCart(product) {
        //     // Controllare se il prodotto è già nel carrello
        //     const existingItem = cart.items.find(item => item.id === product.id);

        //     if (existingItem) {
        //         // Incrementare la quantità del prodotto esistente
        //         existingItem.quantity++;
        //     } else {
        //         // Aggiungere un nuovo oggetto al carrello
        //         cart.items.push({
        //             id: product.id,
        //             title: product.title,
        //             price: product.price,
        //             quantity: 1,
        //         });
        //     }
        //     // Aggiornare la quantità e il prezzo totali
        //     cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        //     cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        //     // Salvare il carrello in localStorage
        //     localStorage.setItem('cart', JSON.stringify(cart));
        // },

    },
}
</script>

<template>

    <div class="cart">
        <h2>Carrello</h2>
        <ul>
            <!-- <li v-for="item in this.store.cartItems" :key="item.id">
                {{ item.name }} 
                {{ item.price }} 
            </li> -->
        </ul>
        <div class="cart-totals">
            <!-- <p>Totale quantità: {{ cart.totalQuantity }}</p>
            <p>Prezzo totale: {{ cart.totalPrice | formatCurrency }}</p> -->
        </div>
    </div>

</template>

<style lang="scss"></style>