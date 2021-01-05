<template>
  <header class="bg-white">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="logoUrl+'images/logo.png'" alt="" class="img-fluid">
      </router-link>
      <button class="navbar-toggler" data-toggle="collapse" data-target="rm_navbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="rm_navbar">
        <ul class="navbar-nav ml-auto">
          <li v-for="(route, i) in routes" :key="i" class="nav-item">
            <router-link :to="route.link" class="nav-link" active-class="active" exact>
              <span>{{ route.title }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <a :href="`${baseUrl}logout`" class="nav-link">logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data:() => ({
    routes: [
      {
        title: 'Home',
        link: '/'
      },
      {
        title: 'Reports',
        link: '/reports'
      }
    ],
    baseUrl: document.getElementById('APP_API_URL').value.replace('api/','')
  })
}
</script>

<style lang="scss" scoped>
.navbar-brand{
    img {
      width:100px;
      transition:.5s;
      @media(min-width:992px) {
        width:200px;
      }
    }
  }
  .active {
    @media(min-width:992px) {
      background-color:  #38c172;
      border-radius: 5px;
      color: white !important;
    }
  }
</style>
