<script>

import axios from 'axios';
import { router } from '../router';
import CartItem from '../components/CartItem.vue';
import { store } from '../store';

export default {

  name: 'InfoRestaurant',

  components: {

    // CartItem,

  },

  data() {


    return {

      store,

      restaurant: null,

      restaurantId: null,

      apiBaseUrl: 'http://127.0.0.1:8000/api',

      apiImageUrl: 'http://127.0.0.1:8000/storage/',

      // Elementi per la gestione del carrello
      // CartItems: [],
      totalCartPrice: 0,
      dishCounter: 1,

      // modale
      openClose: this.visible,


    }
  },

  mounted() {
    this.items = JSON.parse(localStorage.getItem('items')) || [];
    const storedTotalPrice = localStorage.getItem('totalCartPrice');
      if (storedTotalPrice !== null) {
        this.store.totalCartPrice = Number(storedTotalPrice);
      }
      const storedCartItems = localStorage.getItem('CartItems');
      if (storedCartItems) {
        this.store.CartItems = JSON.parse(storedCartItems);
      }
      console.log(this.store.CartItems);
      this.setupScrollListener();

  },

  created() {
    // recuperiamo il parametro dell'id del project dall'url
    // console.log(this.$route.params.id);

    // lo assegnamo alla variabile projectId
    this.restaurantId = this.$route.params.id;

    axios.get(this.apiBaseUrl + '/restaurant/' + this.restaurantId).then(res => {

      // console.log(res.data);

      if (res.data.success) {

        // se troviamo il project lo salviamo
        this.restaurant = res.data.result;

      } else {

        // torniamo indietro alla home
        this.$router.push({ name: 'home' });
      }

    })
  },

  watch:{
        visible: function(newVal, oldVal) {
            this.openClose = newVal;
            console.log('new ' + newVal + '==' + oldVal);
        }
  },

  methods: {

    scrollToTop() {
      const target = document.getElementById('target');
      if (target) {
        const offset = target.getBoundingClientRect().top;
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    },

    setupScrollListener() {
      window.addEventListener('scroll', this.handleScroll);
    },

    handleScroll() {
      const scrollTop = window.scrollY;
      const target = document.getElementById('target');
      const button = document.querySelector('.btn-color.rounded-pill');

      if (target && button) {
        const targetTop = target.getBoundingClientRect().top;
        if (scrollTop > targetTop) {
          button.style.display = 'block';
        } else {
          button.style.display = 'none';
        }
      }
    },
    


    // metodo che aggiorna il prezzo totale nel carrello quando viene aggiunto un piatto
    addToTotalCart(item) {
      this.store.totalCartPrice += Number(item.itemPrice);
      this.store.totalCartPrice = Number(this.store.totalCartPrice.toFixed(2));
      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
    },

    // metodo che aggiorna il prezzo totale nel carrello quando viene rimosso un piatto
    removeFromToTotalCart(index) {
      // this.store.totalCartPrice -= Number(this.store.CartItems[index].ItemTotalPrice);
        if (this.store.CartItems.length > 0 && index < this.store.CartItems.length) {
        this.store.totalCartPrice -= Number(this.store.CartItems[index].ItemTotalPrice);
          if (this.store.totalCartPrice < 0) {
            this.store.totalCartPrice = 0; // Resetto il prezzo totale a 0 se diventa negativo
          }
        }

        localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
    },

    // metodo che aggiunge un piatto al carrello
    addItem(dish) {
    console.log('Aggiunta di un piatto:', dish);
    if (this.store.CartItems.length > 0 && this.store.CartItems[0].restaurantId !== dish.restaurant_id) {
      console.log('Elementi nel carrello:', this.store.CartItems);
      this.OpenCloseFun();
      return;
    }


      // inizializzo la variabile currentDish nello store
      // con il piatto che viene passato come parametro al click del bottone 'aggiungi al carrello'
      this.store.currentDish = dish;

      this.store.currentIdRestaurant = dish.restaurant_id;
      // console.log('Intendevo questo',this.store.currentIdRestaurant)
      // console.log(this.store.currentDish);
      
      // dichiaro un oggetto che prende le informazione del mio piatto
      const newItem = {
        itemId : this.store.currentDish.id,
        itemName: this.store.currentDish.name,
        itemPrice : Number(this.store.currentDish.price),
        itemQuantity : 1,
        ItemTotalPrice : Number(this.store.currentDish.price),
        restaurantId: this.restaurant.id,
      }

      // controllo se il piatto esiste già all'interno del carrello
      const existingItem = this.store.CartItems.find(item => item.itemId === newItem.itemId);
      // se esiste
      if (existingItem) {
        // aumento la quantità
        existingItem.itemQuantity++;
        // aggiorno il prezzo totale dello stesso piatto all'interno del carello
        existingItem.ItemTotalPrice += existingItem.itemPrice;
        existingItem.ItemTotalPrice = Number(existingItem.ItemTotalPrice.toFixed(2));

      } else {
        // altrimenti aggiungo il nuovo piatto al carrello
        this.store.CartItems.push(newItem);

      }
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));
      // console.log(newItem)
      // aggiorno il prezzo totale del carrello
      this.addToTotalCart(newItem);
    },

    // metodo che rimuove tutta la quantità di uno stesso piatto
    removeItem(index) {
      // console.log(this.CartItems[index])
      // aggiorno il prezzo totale del carrello
      this.removeFromToTotalCart(index);
      this.store.CartItems.splice(index, 1);
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));
    },

    // metodo che aggiunge un singolo piatto già presente nel carrello
    addActualDish(index) {
      // aggiorno la quantità di quel piatto nel carrello
      this.store.CartItems[index].itemQuantity++;
      // aggiorno il prezzo totale dello stesso piatto all'interno del carello
      this.store.CartItems[index].ItemTotalPrice += this.store.CartItems[index].itemPrice;
      this.store.CartItems[index].ItemTotalPrice = Number(this.store.CartItems[index].ItemTotalPrice.toFixed(2));
      // aggiorno il prezzo totale del carrello
      this.addToTotalCart(this.store.CartItems[index]);

      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));
    },

    // metodo che rimuove un singolo piatto già presente nel carrello
    removeActualDish(index) {
      // controllo se la quantità di quel piatto nel carrello
      // è maggiore di 1
      if(this.store.CartItems[index].itemQuantity > 1) {
        // aggiorno la quantità di quel piatto nel carrello
        this.store.CartItems[index].itemQuantity--;
        // aggiorno il prezzo totale dello stesso piatto all'interno del carello
        this.store.CartItems[index].ItemTotalPrice -= this.store.CartItems[index].itemPrice;
        this.store.CartItems[index].ItemTotalPrice = Number(this.store.CartItems[index].ItemTotalPrice.toFixed(2));
        // aggiorno il prezzo totale del carrello
        this.store.totalCartPrice -= Number(this.store.CartItems[index].itemPrice);
      } else {
        // altrimenti rimuovo quel piatto dal carrello
        this.removeItem(index);
      }

      localStorage.setItem('totalCartPrice', this.store.totalCartPrice);
      localStorage.setItem('CartItems', JSON.stringify(this.store.CartItems));
    },

    // metodo che svuota il carrello quando l'utente effettua il pagamento
    clearCart() {
            this.store.CartItems.splice(0, this.store.CartItems.length);
            localStorage.setItem('CartItems', this.store.CartItems);
            this.store.totalCartPrice = 0;
            localStorage.setItem('totalCartPrice', 0);
            console.log(this.store.CartItems);
            console.log('carrello', this.store.totalCartPrice);
    },

    clearFromModal(){
      // this.clearCart()
      this.isCartEmpty = false
    },

    // metodo che gestisce il modale
    OpenCloseFun() {
      this.openClose = !this.openClose;
    //   if (this.openClose) {
    //   document.body.classList.add('overflow-hidden');
    // } else {
    //   document.body.classList.remove('overflow-hidden');
    // }
    },

  },
  computed: {
    // alla creazione riporto la quantità degli elementi nel carrello
    totalItems() {
      return this.store.CartItems.length;
    },
    // alla creazione riporto il prezzo totale del carrello
    totalPrice() {
    return this.CartItems.reduce((total, item) => total + item.ItemTotalPrice, 0);
  },
  },

}




</script>


<template>
  <div class="container">
    <router-link :to="{ name: 'home' }" class="btn btn-primary btn-color mt-3">
      <i class="fa-solid fa-arrow-left"></i> Torna ai ristoranti
    </router-link>
    <div id="top-info" class="row my-3 animate__animated animate__zoomIn">
      <div id="prova" class="col-12 position-relative">
        
        <div id="title-box" class="z-1">
          <h1 class=" fw-bold m-0">{{ restaurant.name }}</h1>
          <h4 class="fw-normal"> {{ restaurant.description }}</h4>
        </div>
        <img id="rest-img" :src="restaurant.img.includes('https') ? restaurant.img : this.apiImageUrl + restaurant.img"
        class="card-img-top" alt="...">
        <section class="z-1 p-2">
          <div id="contact" class="d-flex flex-column justify-content-between gap-2">
            <h5 class="text-uppercase">Contatti: </h5>
            <p class="mb-0"><i class="fa-solid fa-map-location-dot"></i> {{ restaurant.address }}</p>
            <p class="mb-0"> <img class="img-fluid" src="/images/vat.svg" alt=""> {{ restaurant.vat }}</p>
            <p class="mb-0"><i class="fa-solid fa-phone"></i> {{ restaurant.phone_number }}</p>
          </div>
        </section>
        
      </div>
    </div>

    <div class="row d-flex justify-content-center row-gap-4 py-5">
      <!-- COLONNA PIATTI -->
      <div class="col-md-7">
        <ul id="menu" class="list-group list-group-flush animate__animated animate__slideInLeft">
          <li id="dish-menu" class="row list-group-item d-flex justify-content-between align-items-center" v-for="dish in restaurant.dishes">
            <!-- Colonna per l'immagine -->
            <div id="img-col" class="col-4">
              <img style="max-height: 124px;" class="img-fluid h-100 w-100 object-fit-cover" :src="dish.img.includes('https') ? dish.img : this.apiImageUrl + dish.img" alt="">
            </div>
            <!-- Colonna per il nome e il prezzo -->
            <div id="name-col" class="col d-flex flex-column justify-content-center">
              <span class="fw-bold">{{ dish.name }}</span>
              <span>€{{ dish.price }}</span>
            </div>
            <!-- Colonna per il pulsante -->
            <div id="btn-col" class="col d-flex align-items-center">
              <button @click="addItem(dish)" class="btn-color btn btn-primary ms-auto" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Aggiungi al carrello
              </button>
            </div>
          </li>
        </ul>
      </div>


      <!-- COLONNA CARRELLO -->
      <div class="col-md-5">
        <div class="card animate__animated animate__slideInRight">
          <div class="card-header">
            <h2>Carrello</h2>
          </div>
          <ul class="list-group list-group-flush cart">
            <li v-for="(item, index) in store.CartItems" :key="index" class="list-group-item d-flex flex-column flex-xl-row justify-content-between align-items-center row-gap-2">
              <div class="dish-info d-flex gap-3 align-self-start">
                {{ item.itemName }} <br>   <span class=" fw-light ">{{ item.itemQuantity }} x €{{ item.itemPrice }}</span> 
              </div>
              <div class="dish-options d-flex align-self-start">
                <div class="add-remove">
                  <button type="button" @click="removeActualDish(index)" class="btn btn-success btn-color remove"><i class="fa-solid fa-minus"></i></button>
                  <strong class="px-2">{{ item.itemQuantity }}</strong>
                  <button type="button" @click="addActualDish(index)" class="btn btn-success btn-color add"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="btn btn-danger float-end" @click="removeItem(index)">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </li>
          </ul>
          <div id="target" class="card-footer">
            <p>
              Totale prezzo: €{{ store.totalCartPrice.toFixed(2) }}
            </p>
            <div id="btn-box" class="d-flex justify-content-between">
              <div class="checkout border-0 btn btn-primary btn-pay" v-if="store.CartItems.length > 0">
                <router-link class=" text-decoration-none" 
                  :to="{ name: 'payment'}">
                  <span class="text-white text-decoration-none"><i class="fa-solid fa-wallet"></i> Procedi al pagamento</span>
                </router-link>
              </div>
              <button v-if="store.CartItems.length > 0" class="btn btn-danger" @click="clearCart()"><i class="fa-solid fa-trash-can"></i> Svuota il carrello</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Modale -->
    <div v-if="openClose" class="modal-backdrop" @click="OpenCloseFun()"></div>
    <div v-if="openClose" class="modal fade show animate__animated animate__fadeIn"
      tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog"
      style="display:block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <h1 class="modal-title fw-bold fs-5" id="exampleModalLabel"><i class="fa-solid fa-triangle-exclamation"></i> ATTENZIONE <i class="fa-solid fa-triangle-exclamation"></i></h1>
            <!-- <button type="button" class="btn-close" @click="OpenCloseFun()" aria-label="Close"></button> -->
          </div>
          <div class="modal-body">
            <div v-if="store.CartItems.length > 0">
              <strong>Stai cercando di inserire un piatto di un altro ristorante!</strong> <br>
              Svuota il carrello oppure procedi all'ordine sulla pagina del ristorante specifico.
            </div>
            <div v-else>
              <p>Hai eliminato il carrello, ora puoi procedere con l'ordine</p>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="OpenCloseFun()" type="button" class="btn btn-secondary">Chiudi</button>
            <button v-if="store.CartItems.length > 0" class="btn btn-danger" @click="clearCart()"><i class="fa-solid fa-trash-can"></i> Svuota il carrello</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <div class="text-center position-fixed bottom-0 end-0 p-1" data-bs-spy="scroll">
      <button @click="scrollToTop" class="btn btn-primary btn-color rounded-pill btn-lg"><i class="fa-solid fa-arrow-up fa-beat"></i></button>
    </div>


    
  </div>
</template>



<style lang="scss" scoped>
@use '../styles/variables' as *;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}


#top-info{

  #rest-img{
    max-height: 500px;
    object-fit: cover;
  }
}

// MENU

#title-box{
  background-color: rgba(0, 0, 0, 0.484);
  color: white;
  position: absolute;
  top: 0;
  left: 12px;

  padding: 0.5rem;

  border-top-left-radius: 7px;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 7px;
}


section{
  color: white;
  background-color: rgba(0, 0, 0, 0.484);
  position: absolute;
  bottom: 0;
  right: 12px;
  min-width: 250px;
  border-top-left-radius: 7px;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 7px;

  #contact{

    img{
      height: 16px;
      width: auto;
      filter: invert(1);
    }
  }
}


#dish-menu {
  height: 140px;

}
.btn-color{
  background-color: $secondColor;
  border-color: $primaryColor;

  &:hover{
  background-color: $primaryColor;
  }
}


// CARRELLO

.cart{

  .dish-options{
    display: flex;
    align-items: center;
    gap: 20px;
  }

}
.btn-pay{
  background-color: $primaryColor;
  border-bottom: $secondColor;

  &:hover{
    background-color: #024849;
    border-color: $primaryColor;
  }
}
// -------------------------------------------------------------------------------------

// MEDIA QUERY

@media screen and (max-width:200px){

#title-box{
  position: static;
  width: 100%;
  
}

#prova{
  
  section{
    border-radius: 0;
    font-size: 14px;
  
    max-width: 150px !important;
    #contact{
      border-radius: 0;
      
      max-width: 150px !important;

      p {
        line-height: 1.5;
      }

    }
  }

}

}

@media screen and (min-width:316px) and (max-width:416px){

  #btn-box{
    flex-direction: column;
    gap: 10px;
  }

}

@media screen and (min-width:316px) and (max-width:515px){
  
}

@media screen and (max-width:768px){

  #title-box{
    top: 0;
    left: 12px;
    width: 75%;
  }

  section{

    position: static;

    background-color: rgba(0, 0, 0, 0.477);
    width: 100% !important;
    // color: black;

    border-radius: 0 0 10px 10px;

  }

  #rest-img{
    border-radius: 10px 10px 0 0;
    box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.56);
  }

}

@media screen and (min-width:768px) and (max-width:1200px){

  #btn-box{
    flex-direction: column;
    gap: 10px;
  }

}

@media screen and (min-width: 768px) {
  
  #rest-img{
    border-radius: 10px;
  }

}

</style>