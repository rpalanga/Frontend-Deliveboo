<script>

import axios from 'axios';

import AppRestaurant from '../components/AppRestaurant.vue';
import SplashPage from './SplashPage.vue';

export default{

    name: 'HomePage',

    components: {
        AppRestaurant,
        SplashPage
    },

    data() {
        return {
            
            // array contenente la lista di tutti iristoranti 
            // risultante dalla chiamata API
            restaurants: [],

            // array contenente la lista di tutte le tipologie dei  
            // ristoranti risultante dalla chiamata API
            typologies: [],

            // array che contiene le tipologie di ristorante
            // scelte dall'utente
            checkBoxValue: [],

            // variabile che tiene traccia della paginazione
            apiPageNumber: 1,

            // link ai vari endpoint dell'api per vedere le varie pagine dei post
            apiLinks: [],

            // link base per la chiamata api
            apiBaseUrl: 'http://127.0.0.1:8000/api',

            // link base per la chiamata api per le immagini
            apiImageUrl: 'http://127.0.0.1:8000/storage/',

            isTypologiesCollapsed: false,

            // splash page
            isLoading: true,
            loadingCounter: 0,
            
            // errori ristoranti non trovati
            restaurantsLoaded: false,
            restaurantsEmpty: false,

        }
    },

    mounted() {
        this.incrementLoading();
        
        // richiamo api che mostra tutte le tipologie
        axios.get(this.apiBaseUrl + '/typologies').then(res => {
            // console.log(res.data.results);
            
            this.typologies = res.data.results;

            this.decrementLoading();
            
            // console.log(this.typologies);
        });
        
        // this.incrementLoading();
        // richiamo api che mostra tutti i ristoranti
        this.apiCall();
    },

    created() {
        this.incrementLoading();
        axios.get(this.apiBaseUrl + '/restaurant', {
            params: {
                page: this.apiPageNumber,
        },
        }).then((res) => {
            this.apiLinks = res.data.results.links;
            this.restaurantsLoaded = true;
            this.restaurantsEmpty = res.data.results.data.length === 0;
            this.decrementLoading();
        }).catch(() => {
            this.restaurantsLoaded = true;
            this.restaurantsEmpty = true;
            this.decrementLoading();
        });
    },

    methods: {
        apiCall(){
            this.incrementLoading();

            
            const params = {
                page: this.apiPageNumber,
            };
            
            // Combino le tipologie selezionate in una stringa separata da virgole
            if (this.checkBoxValue.length > 0) {
                params.typologies = this.checkBoxValue.join(',');
            }
            
            axios.get(this.apiBaseUrl + '/restaurant', { params })
            .then((res) => {
                this.restaurants = res.data.results.data;
                this.apiLinks = res.data.results.links;
                this.restaurantsLoaded = true;
                this.restaurantsEmpty = this.restaurants.length === 0;
                this.decrementLoading();
            })
            .catch(() => {
                this.restaurantsLoaded = true;
                this.restaurantsEmpty = true;
                this.decrementLoading();
            });
            
            // axios.get(this.apiBaseUrl + '/restaurant', {
            //     params: {
            //         page: this.apiPageNumber
            //     }
            // }).then(res => {
            //     // console.log(res.data.results.links)

            //     this.restaurants = res.data.results.data;
            //     this.apiLinks = res.data.results.links;

            // })
        },


        // funzione che filtra i ristoranti in base alle tipologie scelte nella checkbox
        apiFilterByTypes(){
            // this.apiPageNumber = 1;
            // if(this.checkBoxValue.length > 0) {
            //     axios.get(this.apiBaseUrl + '/restaurant?typologies=' + this.checkBoxValue, {
            //         params: {
            //             page: this.apiPageNumber
            //         }
            //     }).then(res => {
            //         // console.log(res.data.results)
    
            //         this.restaurants = res.data.results.data;
            //         this.apiLinks = res.data.results.links;
    
            //         // console.log(this.checkBoxValue)
            //     })

            // } else {
            //     this.apiCall();
            // }
            
            // Reimposto il numero di pagina a 1 per i risultati filtrati
            this.apiPageNumber = 1; 
             // Chiama apiCall con i parametri aggiornati
            this.apiCall();
        },

        // metodo che gestisce la paginazione
        changeApiPage(pageNumber) {
            // console.log(pageNumber);
            if(pageNumber == '&laquo; Previous') {

                this.apiPageNumber = Number(this.apiPageNumber) - 1;

            } else if(pageNumber == 'Next &raquo;'){

                this.apiPageNumber = Number(this.apiPageNumber) + 1;

            } else {
                
                this.apiPageNumber = pageNumber;

            }

            this.apiCall();
        },

        toggleTypologies() {
            this.isTypologiesCollapsed = !this.isTypologiesCollapsed;
        },

        // incremento il counter di chiamate api per gestire la splash page
        incrementLoading(){
        this.loadingCounter++;
        // console.log('Increment Loading:', this.loadingCounter);
        },

        // diminuisco il counter di chiamate api per gestire la splash page
        decrementLoading(){
            this.loadingCounter--;
            // console.log('Decrement Loading:', this.loadingCounter);
            if (this.loadingCounter > 0) {
                this.isLoading = false;
                // console.log('Loading Finished:', this.isLoading); 
            }
        }
    },

}

</script>



<template>
    <div id="box" class="container-fluid mb-5 mt-3">

        <SplashPage v-if="isLoading"></SplashPage>

        <!-- row -->
        <div v-else class="row d-flex flex-column flex-sm-row mx-1">
            <button style="max-height: 50.89px;" class="btn btn-light col-12 mb-3 bg-white" disabled>
                <h3 class="col-12 mb-1">RISTORANTI</h3>
            </button>

            <!-- sezione lista delle tipologie -->
            <div class="col-12 col-md-3 restaurant-typologies d-flex flex-column animate__animated animate__zoomInLeft">
                
                <button class="mb-3 btn btn-outline-secondary d-flex justify-content-between align-items-center" type="button" role="button" @click="toggleTypologies">
                    <h3 class="mb-1 text-uppercase">filtra</h3>
                    <i class="fa-solid fa-arrow-down-wide-short"></i>
                </button>

                <div class="d-flex flex-wrap flex-md-column flex-lg-row row align-items-center justify-content-evenly row-gap-2">
                    <div v-for="typology in typologies" class="Type col-6 form-check form-switch rounded-2" v-bind:class="{ 'd-flex d-sm-none': isTypologiesCollapsed, 'd-none d-sm-flex': !isTypologiesCollapsed }">
                        <input class="form-check-input switch" type="checkbox" role="switch" :value="typology.type" :id="typology.type" :name="typology.type" v-model="checkBoxValue" @change="apiFilterByTypes()">
                        <label class="Labell form-check-label d-flex align-items-center" :for="typology.type">{{typology.type}}</label>
                    </div>
                </div>

            </div>

            <!-- sezione lista dei ristoranti -->
            <div v-if="restaurantsLoaded && restaurants.length > 0" class="col-12 col-md-9 restaurants-list d-flex flex-column row-cols-3 align-items-start flex-md-row flex-wrap animate__animated animate__zoomInDown">
                
                <AppRestaurant v-for="restaurant in restaurants" :key="restaurant.id" :restaurant="restaurant"></AppRestaurant>

                <!-- sezione per la paginazione -->
                <div class="pages text-white col-12 justify-content-center gap-2">
                <div class="previous" :class="apiPageNumber == 1 ? 'none' : ''" @click="changeApiPage(apiLinks[0].label)">
                    <i class="fa-solid fa-arrow-left" :class="apiPageNumber == 1 ? 'none' : ''"></i>
                </div>

                <div class="next" :class="apiPageNumber == apiLinks.length - 2 ? 'none' : ''" @click="changeApiPage(apiLinks[apiLinks.length - 1].label)">
                    <i class="fa-solid fa-arrow-right" :class="apiPageNumber == apiLinks.length - 2 ? 'none' : ''"></i>
                </div>
                </div>
            </div>

            <div v-else-if="restaurantsLoaded && restaurantsEmpty" class="col-12 col-md-9 animate__animated animate__jackInTheBox">
                <h1 class="text-center">Nessun ristorante trovato!!</h1>
                <div class="container-fluid d-flex justify-content-center">
                <img class="img-fluid" src="/images/404.webp" alt="">
                </div>
            </div>

            <div v-else class="col-12 text-center">
                <h1 class="alert">Caricamento ristoranti in corso...</h1>
            </div>
            
        </div>

    </div>
</template>




<style scoped lang="scss">
@use '../styles/variables' as *;


.Type{   
    display: flex;
    align-items: center;
    gap: 15px;

    height: 50px;
    width: 140px;

    .form-check-input{
        & svg{
            fill: #40A578;
        }

        &:focus{
            box-shadow: $focus-ring-box-shadow;
        }

        &:checked {
          background-color: #40A578;
          border-color: #006769;
        }

        &:not(:checked) {
          background-color: #fff;
          border-color: lightgrey;

        }
        
    }


    .Labell{
        width: 140px;
        height: 50px;
    }
}


.btn-color{
  background-color: $secondColor;
  border-color: $primaryColor;

  &:hover{
    background-color: $primaryColor;
  }
}

.pages {
    display: flex;
    justify-content: center;
    gap: 10px;

    .previous, .next {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 30px;
        height: 30px;
        background-color: $primaryColor;

        padding: 8px;

        border-radius: 10px;

        transition: all .3s ease;

        cursor: pointer;

        &:hover, &.active{
            background-color: #9DDE8B;
        }

        &.none {
            display: none;
        }
    }
}


</style>