import { createRouter, createWebHistory } from 'vue-router';


// importo tutti i componenti che verranno utilizzati come pagina
import HomePage from './pages/HomePage.vue';
import InfoRestaurant from './pages/InfoRestaurant.vue';
import PaymentPage from './pages/PaymentPage.vue';
import PaymentApproved from './pages/PaymentApproved.vue';


const router = createRouter({
    history: createWebHistory(),

    // questo array conterrà tutte le rotte della nostra applicazione
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/restaurant/:id',
            name: 'info-restaurant',
            component: InfoRestaurant
        },

        {
            path: '/payment',
            name: 'payment',
            component: PaymentPage
        },

        {
            path: '/payment-success',
            name: 'payment-success',
            component: PaymentApproved,
        }
    ]

})

export { router };