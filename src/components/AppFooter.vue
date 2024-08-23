<script>
export default {
  name: 'AppFooter',

  methods: {
    scrollToTop() {
      const target = document.querySelector('#target'); // Sostituisci con l'ID del tuo elemento target
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

  }
  
};
</script>

<template>
  
  <footer class="text-center text-white">

    <div class="container py-2">
      <h3 class="p-2 mb-0">WOWDELIVE Un servizio del quale non riuscirai più a fare a meno!</h3>
    </div>
    <hr class="mt-0">

    <!-- Grid container -->
    <div class="container py-1">

      
      <section>
        
        <div class="row text-start">

          <!--nav-->
          <div class="col-lg-4 col-md-4 mb-2 mb-md-0">
            <h5 class="text-uppercase mb-1">Navigazione Rapida</h5>

            <ul class="list-unstyled mb-0">
              <li>
                <a href="#!" class="text-white link-hover">Home</a>
              </li>
              <li>
                <a href="#!" class="text-white link-hover">Ordina Ora</a>
              </li>
              <li>
                <a href="#!" class="text-white link-hover">Registra il tuo ristorante</a>
              </li>
              <li>
                <a href="#!" class="text-white link-hover">Contattaci</a>
              </li>
            </ul>
          </div>
          <!--nav-->

          <!--Privacy-->
          <div class="col-lg-4 col-md-4 mb-2 mb-md-0">
            <h5 class="text-uppercase mb-1">Sicurezza e Privacy</h5>

            <ul class="list-unstyled mb-0">
              <li>
                <a href="#!" class="text-white link-hover">Termini e Condizioni</a>
              </li>
              <li>
                <a href="#!" class="text-white link-hover">Politica sulla Privacy</a>
              </li>
              <li>
                <a href="#!" class="text-white link-hover">Politica sui Cookie</a>
              </li>
            </ul>
          </div>
          <!--Privacy-->

          <!-- Section: Text -->
          <div class="col-lg-4 col-md-4 mb-2 mb-md-0">

            <h5 class="text-uppercase mb-1">Contatti</h5>

            <ul class="list-unstyled mb-0">
              <li>
                <p class="mb-1 link-hover" style="cursor: pointer;"><i class="fa-solid fa-house pe-1"></i> Indirizzo: Via Roma, 101, 00100 Roma, Italia</p>
              </li>
              <li>
                <p class="mb-1 link-hover" style="cursor: pointer;"><i class="fa-solid fa-phone pe-1"></i> Contatto: +39 06 12345678</p>
              </li>
              <li>
                <p class="mb-1 link-hover" style="cursor: pointer;"><i class="fa-regular fa-envelope pe-1"></i> Email: info@wowdelive.it</p>
              </li>
              <li>
                <p class="mb-1">Grazie per aver scelto WOWDELIVE!</p>
              </li>
            </ul>

          </div>
          <!-- Section: Text -->

        </div>
        
      </section>
      
    </div>
    <!-- Grid container -->
  <hr>

    <div class="container pb-2">
      
      <section class="d-flex justify-content-center justify-content-center py-2">
        
        <div class="me-5 d-none d-lg-block p-1">
          <span>Seguici sui nostri social:</span>
        </div>
        
  
        <div class="d-flex gap-2">
          <a href="#" class="text-reset">
            <i class="fa-brands fa-facebook-f p-1 hover-icon"></i>
          </a>
          <a href="#" class="text-reset">
            <i class="fa-brands fa-x-twitter p-1 hover-icon"></i>
          </a>
          <a href="#" class="text-reset">
            <i class="fa-brands fa-google p-1 hover-icon"></i>
          </a>
          <a href="#" class="text-reset">
            <i class="fa-brands fa-instagram p-1 hover-icon"></i>
          </a>
          <a href="#" class="text-reset">
            <i class="fa-brands fa-linkedin p-1 hover-icon"></i>
          </a>
          <a href="#" class="text-reset">
            <i class="fa-brands fa-github p-1 hover-icon"></i>
          </a>
        </div>
      </section>
      

    </div>

    

    <!-- Copyright -->
    <div class="text-center p-1" style="background-color: rgba(0, 0, 0, 0.2)">
      © 2024 WOWDELIVE
      <small class="text-white">Tutti i diritti riservati.</small>
    </div>
    <!-- Copyright -->

  </footer>

</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

footer {
  background-color: $primaryColor;

  .btn-color{
  background-color: $secondColor;
  border-color: $primaryColor;

  &:hover{
    background-color: $primaryColor;
  }
}
  
}

.link-hover{
  text-decoration: none;

  &:hover{
    text-decoration: underline;
  }
}

.hover-icon{

  height: 20px;
  width: 20px;
  
  border: 1px solid transparent;
  border-radius: 50%;
  transition: .3s ease-in-out;


  
  &:hover{
    transition: .3s ease-in-out;
    border: 1px solid grey;
  }
}


</style>
