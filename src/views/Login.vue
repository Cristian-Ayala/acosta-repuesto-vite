<template>
  <div class="wrapper">
    <div class="container">
      <h1>Bienvenido</h1>

      <form class="form" autocomplete="on">
        <input v-model="username" type="text" placeholder="Usuario">
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          autocomplete="on"
        >
        <button id="login-button" type="submit" @click.prevent="login()">
          Iniciar Sesión
        </button>
      </form>
      <h6 v-if="error">Usuario o contraseña incorrecta.</h6>
    </div>

    <ul class="bg-bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
// import PouchDB from 'pouchdb-browser';
// PouchDB.plugin(require("pouchdb-authentication").default);
// const remoteUsuarios = null;
// const remotedb = async (url) => {
//   remoteUsuarios = await new PouchDB(url + "marcas", {
//     skip_setup: true,
//   });
// };
export default {
  name: 'LoginIndex',
  components: {},
  data() {
    return {
      username: '',
      password: '',
      error: false,
    };
  },
  mounted() {
    // Trigger para comenzar script para probar si las cookies de terceros estan habilitadas
    const url = `${this.$url}/step1.js.php`;
    const step1El = document.createElement('script');
    step1El.setAttribute('src', url);
    document.body.appendChild(step1El);
    // Fin del trigger para comenzar script para probar si las cookies de terceros estan habilitadas
  },
  created() {
    // Inicio de script para probar si las cookies de terceros estan habilitadas
    const that = this;
    // eslint-disable-next-line 
    window._3rd_party_test_step1_loaded = function () {
      // At this point, a third-party domain has now attempted to set a cookie (if all went to plan!)
      const step2El = document.createElement('script');
      const url = `${that.$url}/step2.js.php`;
      step2El.setAttribute('src', url);
      document.head.appendChild(step2El);
    };
    // eslint-disable-next-line 
    window._3rd_party_test_step2_loaded = function (cookieSuccess) {
      // If true, the third-party domain cookies are enabled
      // If false, the third-party domain cookies are disable
      if(!cookieSuccess) that.$router.push({ path: '/cookies' });
    };
    // Fin de script para probar si las cookies de terceros estan habilitadas
    // remotedb(this.$url)
    //   .then((res) => {
    //     console.log(JSON.stringify(res));
    //   })
    //   .catch((err) => {
    //     console.log(JSON.stringify(err));
    //   });
  },
  methods: {
    async login() {
      // const settings = {
      //     method: 'POST',
      //     headers: {
      //         Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //         name: '',
      //         password: '',
      //     }),
      //     credentials: 'include',
      // };
      /**
       * * My man
       * ! deprecated
       * ? questions
       * TODO: Some task
       */
      try {
        // const fetchResponse = await fetch('https://www.couchdb.tk/_session', settings);
        // const data = await fetchResponse.json();
        // console.log(data);
        // this.$router.push({ path: '/' });
        window.console.log('hola');
        // const result = await remoteUsuarios.logIn(this.username, this.password)
        // if (result.ok) this.$router.push({ path: '/' });
      } catch (error) {
          console.error(JSON.stringify(error));
          this.error = true;        
      }
    },
    areCookiesEnabled() {
      try {
        document.cookie = 'cookietest=1';
        const cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return cookiesEnabled;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: 300;
}
body {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #ffffff;
  opacity: 1; /* Firefox */
}
body ::-webkit-input-placeholder {
  /* WebKit browsers */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
body :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
body ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
body :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
h1 {
  color: white;
}
h6 {
  color: rgb(255, 255, 255);
  border: 1px solid;
  display: inline;
  padding: 0.5rem;
}
.wrapper {
  background: #a35050;
  background: linear-gradient(to bottom right, #a35050 0%, #e35367 100%);
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.wrapper.form-success .container h1 {
  transform: translateY(85px);
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 0;
  height: 400px;
  text-align: center;
  align-self: center;
}
.container h1 {
  font-size: 40px;
  transition-duration: 1s;
  transition-timing-function: ease-in-put;
  font-weight: 200;
}
form {
  padding: 20px 0;
  position: relative;
  z-index: 2;
}
form input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  width: 250px;
  border-radius: 3px;
  padding: 10px 15px;
  margin: 0 auto 10px auto;
  display: block;
  text-align: center;
  font-size: 18px;
  color: white;
  transition-duration: 0.25s;
  font-weight: 300;
}
form input:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
form input:focus {
  background-color: white;
  width: 300px;
  color: #e35353;
}
form button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  background-color: white;
  border: 0;
  padding: 10px 15px;
  color: #e35353;
  border-radius: 3px;
  width: 250px;
  cursor: pointer;
  font-size: 18px;
  transition-duration: 0.25s;
}
form button:hover {
  background-color: #f5f7f9;
}
.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -50vh;
  -webkit-animation: square 25s infinite;
  animation: square 25s infinite;
  transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1) {
  left: 10%;
}
.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 17s;
  animation-duration: 17s;
}
.bg-bubbles li:nth-child(3) {
  left: 25%;
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}
.bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  -webkit-animation-duration: 22s;
  animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(5) {
  left: 70%;
}
.bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
.bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 7s;
  animation-delay: 7s;
}
.bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  -webkit-animation-delay: 15s;
  animation-delay: 15s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
}
.bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 10px;
  height: 10px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
  background-color: rgba(255, 255, 255, 0.3);
}
.bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 11s;
  animation-delay: 11s;
}
@-webkit-keyframes square {
  0% {
    transform: translateY(5vh);
  }
  100% {
    transform: translateY(-250vh) rotate(600deg);
  }
}
@keyframes square {
  0% {
    transform: translateY(5vh);
  }
  100% {
    transform: translateY(-250vh) rotate(600deg);
  }
}
</style>