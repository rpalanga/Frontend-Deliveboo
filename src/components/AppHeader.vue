<script>
export default {
  name: 'AppHeader',
};
</script>

<template>
  <div class="container-fluid px-0 personal_shadow">
    <nav class="navbar navbar-expand-md navbar-light bg-faded">
      <div class="container-fluid d-flex justify-content-between">
        <router-link :to="{name: 'home'}" class="navbar-brand d-flex align-items-center">
          <img style="filter: invert(1);" class="img-fluid w-50 personal_logo d-none d-md-block" src="/images/wowdelive.svg" alt="logo">
          <img id="mobile" style="width: 100%;" class="img-fluid personal_logo d-block d-md-none" src="/images/wd-small.svg" alt="logo">
        </router-link>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="http://127.0.0.1:8000/register" target="_blank" class="btn btn-light rounded-2 px-4"><i class="fa-solid fa-lock fw-bold"></i> Area Riservata</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>


<style scoped lang="scss">
@use '../styles/variables' as *;

.personal_shadow {
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.navbar {
  padding: 1rem 0;

  background-color: $secondColor;
}

@media screen and (min-width: 320px) and (max-width: 428px){

  .navbar-brand{
    height: 38px;
    width: 50%;
    padding: 0 10px;

    #mobile{
      width: 100%;
    }
  }

}

</style>
