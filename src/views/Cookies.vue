<template>
  <div class="containerCookie">
    <div class="row">
      <div class="col-sm text-center mt-3">
        <h2>Este sitio ocupa cookies</h2>
        <h5 class="font-weight-light mb-3">
          Por favor habilite las cookies para continuar.
        </h5>
        <button class="btn btn-dark btn-sm" id="stop" @click="onClickCookies()">
          Presiona aquí cuando las habilites
        </button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm text-center">
        <p>
          Información para habilitar cookies
          <a
            href="https://support.google.com/accounts/answer/61416?hl=es-419&co=GENIE.Platform%3DDesktop"
            target="_blank"
            >aquí</a
          >
          o
          <a
            href="https://support.cloudhq.net/how-to-enable-3rd-party-cookies-in-google-chrome-browser/"
            target="_blank"
            >aquí</a
          >
        </p>
        <h6 v-if="visible" class="visible">
          Todavía no tienes habilitadas las cookies
        </h6>
      </div>
    </div>
    <div style="align-self: center">
      <p id="3rd_party_cookie_test_results" class="loading">Probando&hellip;</p>
      <p id="3rd_party_cookie_test_error" class="error hidden">
        (Si este mensaje persiste, significa que las pruebas no pudieron ser completadas; no se pudo alcanzar
        las cookies de terceros, u otro problema ocurrió.)
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Cookies",
  data: () => {
    return {
      visible: false,
    };
  },
  created() {
    const url = this.$url + "/step1.js.php";
    var step1El = document.createElement("script");
    step1El.setAttribute("src", url);
    document.head.appendChild(step1El);
  },
  mounted() {
    var that = this;
    window._3rd_party_test_step1_loaded = function () {
      // At this point, a third-party domain has now attempted to set a cookie (if all went to plan!)
      var resultsEl = document.getElementById("3rd_party_cookie_test_results"),
        step2El = document.createElement("script");

      // Update loading / results message
      resultsEl.innerHTML = "Etapa uno completada, cargando etapa 2&hellip;";
      // And load the second part of the test (reading the cookie)
      const url = that.$url + "/step2.js.php";
      step2El.setAttribute("src", url);
      //   document.head.appendChild(step2El)
      resultsEl.appendChild(step2El);
    };
    window._3rd_party_test_step2_loaded = function (cookieSuccess) {
      var resultsEl = document.getElementById("3rd_party_cookie_test_results"),
        errorEl = document.getElementById("3rd_party_cookie_test_error");
      // Show message
      resultsEl.innerHTML = cookieSuccess
        ? "Las cookies de terceros estan <b>funcionando</b> en tu navegador."
        : "Las cookies de terceros estan <b>desabilitadas</b>.";

      // Done, so remove loading class
      resultsEl.className = resultsEl.className.replace(/\bloading\b/, " ");
      // And remove error message
      errorEl.className = "hidden";
    };
    window.setTimeout(function () {
      var errorEl = document.getElementById("3rd_party_cookie_test_error");
      if (errorEl.className.match(/\berror\b/)) {
        // Show error message
        errorEl.className = errorEl.className.replace(/\bhidden\b/, " ");
      }
    }, 7 * 1000); // 7 sec timeout
  },
  methods: {
    onClickCookies() {
      //   !timedOut ? this.$router.push({ path: "/login" }) : (this.visible = true);
      //this.$router.go();
      this.$router.push({ path: "/login" })
      console.log("click");
    },
  },
};
</script>
<style scoped>
.error {
  color: #c00;
}
.loading {
  color: #888;
}
.hidden {
  display: none;
}
/* ----------------------------------------------- */
.visible {
  border: 1px solid rgb(0, 0, 0);
  padding: 0.5rem;
  display: inline;
}
.containerCookie {
  height: 100vh;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  background: repeating-linear-gradient(
      112.5deg,
      rgba(1, 1, 1, 0.01) 0px 53px,
      rgba(0, 0, 0, 0.03) 53px 106px,
      rgba(0, 0, 0, 0.03) 106px 159px,
      rgba(1, 1, 1, 0.02) 159px 212px,
      rgba(1, 1, 1, 0.01) 212px 265px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.02) 0px 53px,
      rgba(0, 0, 0, 0.01) 53px 106px,
      rgba(1, 1, 1, 0.02) 106px 159px,
      rgba(1, 1, 1, 0.03) 159px 212px,
      rgba(0, 0, 0, 0.01) 212px 265px,
      rgba(0, 0, 0, 0.03) 265px 318px,
      rgba(1, 1, 1, 0.01) 318px 371px,
      rgba(0, 0, 0, 0) 371px 424px
    ),
    repeating-linear-gradient(
      67.5deg,
      rgba(0, 0, 0, 0.01) 0px 63px,
      rgba(0, 0, 0, 0.01) 63px 126px,
      rgba(0, 0, 0, 0.02) 126px 189px,
      rgba(1, 1, 1, 0.02) 189px 252px,
      rgba(0, 0, 0, 0) 252px 315px,
      rgba(1, 1, 1, 0.02) 315px 378px,
      rgba(0, 0, 0, 0.03) 378px 441px,
      rgba(0, 0, 0, 0.03) 441px 504px,
      rgba(1, 1, 1, 0.02) 504px 567px,
      rgba(1, 1, 1, 0) 567px 630px
    ),
    repeating-linear-gradient(
      22.5deg,
      rgba(1, 1, 1, 0.02) 0px 61px,
      rgba(0, 0, 0, 0) 61px 122px,
      rgba(1, 1, 1, 0) 122px 183px,
      rgba(0, 0, 0, 0.02) 183px 244px,
      rgba(0, 0, 0, 0.03) 244px 305px,
      rgba(0, 0, 0, 0.02) 305px 366px,
      rgba(1, 1, 1, 0) 366px 427px,
      rgba(1, 1, 1, 0) 427px 488px,
      rgba(0, 0, 0, 0.01) 488px 549px,
      rgba(0, 0, 0, 0.01) 549px 610px,
      rgba(0, 0, 0, 0.02) 610px 671px
    ),
    repeating-linear-gradient(135deg, white 0px 3px, transparent 3px 81px),
    repeating-linear-gradient(0deg, white 0px 2px, transparent 2px 43px),
    repeating-linear-gradient(90deg, white 0px 1px, transparent 1px 73px),
    repeating-linear-gradient(135deg, white 0px 2px, transparent 2px 73px),
    repeating-linear-gradient(0deg, white 0px 1px, transparent 1px 91px),
    repeating-linear-gradient(90deg, white 0px 2px, transparent 2px 47px),
    repeating-linear-gradient(135deg, white 0px 1px, transparent 1px 73px),
    repeating-linear-gradient(0deg, white 0px 2px, transparent 2px 95px),
    repeating-linear-gradient(90deg, white 0px 1px, transparent 1px 89px),
    repeating-linear-gradient(0deg, white 0px 1px, transparent 1px 43px),
    repeating-linear-gradient(0deg, white 0px 2px, transparent 2px 56px),
    repeating-linear-gradient(90deg, white 0px 1px, transparent 1px 19px),
    repeating-linear-gradient(45deg, white 0px 2px, transparent 2px 34px),
    repeating-linear-gradient(0deg, white 0px 2px, transparent 2px 71px),
    repeating-linear-gradient(90deg, white 0px 3px, transparent 3px 56px),
    linear-gradient(135deg, white, white);
}
button {
  margin-right: 10px;
  text-transform: uppercase;
}
</style>