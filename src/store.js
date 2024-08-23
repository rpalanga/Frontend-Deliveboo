import { reactive } from "vue";


export const store = reactive({

    currentDish : {},
    CartItems: [],
    totalCartPrice: 0,
    currentIdRestaurant: null,

    lastOrder: [],

})