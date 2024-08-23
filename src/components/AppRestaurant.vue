<script>

export default {
  name: 'AppRestaurant',

  props: {
    restaurant: Object,
  },

  data() {
    return {
      apiImageUrl: 'http://127.0.0.1:8000/storage/',
    };
  },

  methods: {
    getImageUrl(imageUrl) {
      return imageUrl.includes('https') ? imageUrl : this.apiImageUrl + imageUrl;
    },
  },
};
</script>

<template>

  <router-link  :to="{ name: 'info-restaurant', params: { id: restaurant.id } }"
  class="restaurant rounded-3 mb-5">
    <img class="rounded-2 w-100 h-100 object-fit-cover " :src="getImageUrl(restaurant.img)" alt="immagine ristorante">
    <div class="restauran-info gap-2 bg-white rounded-2 p-2">
        <div class="info-top d-flex flex-column justify-content-start">
            <div class="info">
              <div class="restaurant-name text-black fw-bold">
                  {{ restaurant.name }}
              </div>
              <div style="font-size: .7em;" class="restaurant-address text-secondary">
                {{ restaurant.address }}
              </div>
              <!-- <div style="font-size: .7em;" class="restaurant-phone text-secondary">
                <i class="fa-solid fa-phone"></i>
                {{ restaurant.phone_number }}
              </div> -->
              <div class="d-flex gap-1 mt-1" v-if="restaurant.typologies.length">
                <span 
                    v-for="(typology, index) in restaurant.typologies" 
                    :key="index" 
                    style="background-color: #40A578;"
                    class="badge">
                    {{ typology.type }}
                </span>
              </div>
            </div>
        </div>
    </div>  
  </router-link>

</template>
  

  
<style scoped lang="scss">
@use '../styles/variables' as *;

.restaurant{
  position: relative;

  height: 150px;
  // min-width: 300px;

  border: 3px solid transparent;

  &:hover{
    border: 3px solid $primaryColor;
  }

  .restauran-info{
    width: 90%;
    // height: 97px;
    
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);

    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  }
}

// MEDIA QUERY

@media screen and (max-width:200px){

    .restauran-info{
      display: none;
    }

}

@media (max-width: 951px){
  .restaurant{
    width: 100%;
  }
}

@media (min-width: 952px) and (max-width: 1352px) {
  .restaurant{
    width: 50%;
  }
}


</style>