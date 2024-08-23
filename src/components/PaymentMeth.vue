<script>
import axios from 'axios';
import dropin from 'braintree-web-drop-in';
import { store } from '../store';
import { router } from '../router';

// importo la libreria Vuelidate 2
import { required, email, helpers, minLength, maxLength, alpha, numeric } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';


export default {
  name: 'PaymentMeth',
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  
  data() {
    return {
      store,
      clientToken: null,
      instance: null,
      paymentSuccess: false,
      FormData: {
        customer_name: '',
        customer_lastname: '',
        customer_email: '',
        customer_address: '',
        customer_phone: '',
        order_total: localStorage.getItem('totalCartPrice') || 0,
      },
      dishes: JSON.parse(localStorage.getItem('CartItems')) || [],
    };
  },
  // validazioni per i campi di input
  validations() {
    return {
      FormData: {
        customer_name: { 
          required: helpers.withMessage('Il campo Nome è obbligatorio.', required),
          minLength: helpers.withMessage('Il Nome deve avere almeno 2 caratteri.', minLength(2)),
          maxLength: helpers.withMessage('Il Nome non può superare i 30 caratteri.', maxLength(30)),
          alpha: helpers.withMessage('Il Nome deve contenere solo lettere.', alpha)
        },
        customer_lastname: { 
          required: helpers.withMessage('Il campo Cognome è obbligatorio.', required),
          minLength: helpers.withMessage('Il Cognome deve avere almeno 2 caratteri.', minLength(2)),
          maxLength: helpers.withMessage('Il Cognome non può superare i 30 caratteri.', maxLength(30)),
          // alpha: helpers.withMessage('Il Cognome deve contenere solo lettere.', alpha)
        },
        customer_email: { 
          required: helpers.withMessage('Il campo Email è obbligatorio.', required), 
          email: helpers.withMessage('L\'email deve essere valida.', email),
        },
        customer_address: { 
          required: helpers.withMessage('Il campo Indirizzo è obbligatorio.', required),
          minLength: helpers.withMessage('L\'Indirizzo deve avere almeno 5 caratteri.', minLength(5))
        },
        customer_phone: {
          required: helpers.withMessage('Il campo Telefono è obbligatorio.', required),
          numeric: helpers.withMessage('Devi inserire solo numeri', numeric),
          minLength: helpers.withMessage('Il numero di telefono deve avere almeno 10 caratteri.', minLength(10)),
          maxLength: helpers.withMessage('Il numero di telefono non può superare i 10 caratteri.', maxLength(10)),
        },

      },
    };
  },

  mounted() {
    this.scrollToTop();
    this.paymentSuccess = false;
    this.getClientToken();
    this.items = JSON.parse(localStorage.getItem('items')) || [];
    
    const storedTotalPrice = localStorage.getItem('totalCartPrice');
    if (storedTotalPrice !== null) {
      this.store.totalCartPrice = Number(storedTotalPrice);
    }

    const storedCartItems = localStorage.getItem('CartItems');
    if (storedCartItems) {
      this.store.CartItems = JSON.parse(storedCartItems);
    }
  },
  methods: {
    getClientToken() {
      axios.get('http://127.0.0.1:8000/api/braintree/token')
        .then(response => {
          this.clientToken = response.data.token;
          this.initializeDropin();
        })
        .catch(error => {
          console.error('Fallita la richiesta del client token', error);
        });
    },

    initializeDropin() {
      dropin.create({
        authorization: this.clientToken,
        container: '#dropin-container',
      }, (err, instance) => {
        if (err) {
          console.error(err);
          return;
        }
        this.instance = instance;
      });
    },

    submitPayment() {
      this.FormData.order_total = this.store.totalCartPrice;

      // const form = document.getElementById('myForm');

    //   if (this.v$.$invalid) {
    //     alert('Compilare tutti i campi correttamente!');
    //   return;
    // }

      this.instance.requestPaymentMethod((err, payload) => {
        if (err) {
          console.error(err);
          return;
        }
        const paymentData = {
          ...this.FormData,
          paymentMethodNonce: payload.nonce,
          orderData: JSON.stringify(this.dishes.map(dish => ({
            dish_id: dish.itemId,
            quantity: dish.itemQuantity,
          }))),
        };

        console.log('Dati del pagamento inviati:', paymentData);

        this.paymentSuccess = true;
        this.store.lastOrder = JSON.parse(localStorage.getItem('CartItems'));  // Recupera lo stato originale del carrello
        localStorage.setItem('lastOrder', JSON.stringify(this.store.lastOrder));
        axios.post('http://127.0.0.1:8000/api/braintree/checkout', paymentData)
          .then(res => {
            console.log('Pagamento avvenuto con successo', res);
            this.$router.push({name : 'payment-success'});
            // if(this.paymentSuccess) this.clearCart();
            // this.clearCart();
          })
          .catch(error => {
            console.error('Pagamento fallito', error.response.data);
          });
      });
    },

    increaseQuantity(index) {
      const item = this.store.CartItems[index];
      item.itemQuantity++;
      item.ItemTotalPrice += item.itemPrice;
      item.ItemTotalPrice = Number(item.ItemTotalPrice.toFixed(2));

      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));

      this.store.totalCartPrice += Number(item.itemPrice);
      this.store.totalCartPrice = Number(this.store.totalCartPrice.toFixed(2));
      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);

      
    },

    decreaseQuantity(index) {
      const item = this.store.CartItems[index];
      if (item.itemQuantity > 1) {
        item.itemQuantity--;
        item.ItemTotalPrice -= item.itemPrice;
        item.ItemTotalPrice = Number(item.ItemTotalPrice.toFixed(2));
        this.store.totalCartPrice -= Number(item.itemPrice);
      } else {
        this.removeItem(index);
      }

      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));

     
    },

    removeItem(index) {
      const item = this.store.CartItems[index];
      this.store.totalCartPrice -= Number(item.ItemTotalPrice);
      this.store.CartItems.splice(index, 1);
      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));

     
    },

    saveCart() {
      localStorage.setItem('CartItems', JSON.stringify(this.dishes));
    },

    clearCart() {
      this.store.CartItems = [];
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));
      localStorage.setItem('totalCartPrice', 0);
    },

    // funzioni per validare il form in tempo reale usando il metodo touch()
    validateField(field) {
      this.v$.$touch();
      this.v$[field].$touch();
    },

    validateForm() {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        this.submitPayment();
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>


<template>
  <div class="container position-relative" :class="paymentSuccess ? 'disabled' : ''">
    <div class="spin spinner-border text-success" role="status" v-if="paymentSuccess">
      <span class="visually-hidden">Loading...</span>
    </div>
    <form @submit.prevent="validateForm" method="POST" id="myForm">
      <div class="user-info p-2 rounded-2">
        <h3>Informazioni personali</h3>
        <!-- Nome -->
        <div class="mb-3">
          <label for="customer_name" class="form-label">Nome:</label>
          <input 
            type="text" 
            class="form-control" 
            id="customer_name" 
            name="customer_name" 
            v-model="FormData.customer_name" 
            @input="v$.FormData.customer_name.$touch()" 
            :class="{'is-invalid': v$.FormData.customer_name.$error}"
            autofocus
            required>
          <div v-if="v$.FormData.customer_name.$error" class="invalid-feedback">{{ v$.FormData.customer_name.$errors[0].$message }}</div>
        </div>
        
        <!-- Cognome -->
        <div class="mb-3">
          <label for="customer_lastname" class="form-label">Cognome:</label>
          <input 
            type="text" 
            class="form-control" 
            id="customer_lastname" 
            name="customer_lastname" 
            v-model="FormData.customer_lastname" 
            @input="v$.FormData.customer_lastname.$touch()" 
            :class="{'is-invalid': v$.FormData.customer_lastname.$error}"
            required>
          <div v-if="v$.FormData.customer_lastname.$error" class="invalid-feedback">{{ v$.FormData.customer_lastname.$errors[0].$message }}</div>
        </div>
        
        <!-- Email -->
        <div class="mb-3">
          <label for="customer_email" class="form-label">Email:</label>
          <input 
            type="email" 
            class="form-control" 
            id="customer_email" 
            name="customer_email" 
            v-model="FormData.customer_email" 
            @input="v$.FormData.customer_email.$touch()" 
            :class="{'is-invalid': v$.FormData.customer_email.$error}"
            required>
          <div v-if="v$.FormData.customer_email.$error" class="invalid-feedback">{{ v$.FormData.customer_email.$errors[0].$message }}</div>
        </div>
        
        <!-- Indirizzo -->
        <div class="mb-3">
          <label for="customer_address" class="form-label">Indirizzo:</label>
          <input 
            type="text" 
            class="form-control" 
            id="customer_address" 
            name="customer_address" 
            v-model="FormData.customer_address" 
            @input="v$.FormData.customer_address.$touch()" 
            :class="{'is-invalid': v$.FormData.customer_address.$error}"
            required>
          <div v-if="v$.FormData.customer_address.$error" class="invalid-feedback">{{ v$.FormData.customer_address.$errors[0].$message }}</div>
        </div>
        
        <!-- Telefono -->
        <div class="mb-3">
          <label for="customer_phone" class="form-label">Telefono:</label>
          <input 
            type="text" 
            class="form-control" 
            id="customer_phone" 
            name="customer_phone" 
            v-model="FormData.customer_phone" 
            @input="v$.FormData.customer_phone.$touch()" 
            :class="{'is-invalid': v$.FormData.customer_phone.$error}"
            required>
          <div v-if="v$.FormData.customer_phone.$error" class="invalid-feedback">{{ v$.FormData.customer_phone.$errors[0].$message }}</div>
        </div>
      </div>
    </form>

    <div class="order-details rounded-2 my-3 p-3">
      <h3>Riepilogo ordine</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Piatto</th>
              <th scope="col">Quantità</th>
              <th scope="col">Prezzo Totale</th>
              <th scope="col">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dish, index) in store.CartItems" :key="dish.itemId">
              <td>{{ dish.itemName }}</td>
              <td>{{ dish.itemQuantity }}</td>
              <td>{{ dish.itemName }} X {{ dish.itemQuantity }} = €{{ dish.ItemTotalPrice.toFixed(2) }}</td>
              <td class="d-flex gap-2">
                <button type="button" class="btn btn-success fw-bold" @click="increaseQuantity(index)"><i class="fa-solid fa-plus"></i></button>
                <button type="button" class="btn btn-success fw-bold" @click="decreaseQuantity(index)"><i class="fa-solid fa-minus"></i></button>
                <button type="button" class="btn btn-danger fw-bold" @click="removeItem(index)"><i class="fa-solid fa-trash-can"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
        <p>Totale: {{ store.totalCartPrice }}€</p>
      </div>
    
    <div class="user-info rounded-2 p-3 mb-3" v-if="store.CartItems.length > 0">
      <h3 class="mb-0">Pagamento</h3>
      <div id="dropin-container"></div>
      <button id="submit-button" @click="validateForm" class="btn btn-success btn-lg my-3">Acquista</button>
    </div>
    <div v-else>
      <!-- Alert Bootstrap 5 -->
      <div id="alert" class="alert alert-success alert-dismissible fade show position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center" role="alert">
        <img src="/images/cart2.png" alt="">
        <h2 class="my-3"><strong>Attenzione!!!</strong> Carrello vuoto :(</h2>
        <router-link id="link" :to="{ name: 'home' }" class="text-black text-decoration-none btn btn-info btn-lg fw-bold fs-3">
          <i class="fa-solid fa-arrow-left fa-beat me-2"></i> Torna al ristorante <i class="fa-solid fa-utensils"></i>
        </router-link>
      </div>
    </div>
    
    <div id="try"></div>
  </div>
</template>



<style lang="scss">
@use '../styles/variables' as *;

.user-info, .order-details{
  border: 3px solid $primaryColor;
}

.disabled{
  pointer-events: none;

  opacity: 50%;
}

.spin {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50%, -50%;
}

#alert{

  width: 100%;
  height: 100%;

  img{
    filter: invert(1);
    width: auto;
    height: 200px;
  }

  #link{
    background-color: $secondColor;
    border: solid $primaryColor;
  
    &:hover{
      transition: .3 ease-in-out;
    background-color: $thirdColor;
    border: solid $primaryColor;
    }
  }

}


</style>