<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">Actualizar</h6>
          </div>
          <div class="card-body">
            <i class="fas fa-sync fa-10x animationColor" aria-hidden="true"></i>
            <button
              class="bubbly-button gradient-btn-outlined button-four"
              @click="animateButton()"
            >
              <span> Click para actualizar </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ActualizarView",

  data: () => ({}),
  computed: {},
  methods: {
    animateButton() {
      window.location.reload(true);
    },
  },
};
</script>

<style scoped>
.cuerpo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
:deep(.card-body) {
  min-height: 75vh;
  text-align: center;
  text-align: -webkit-center;
  /* Verticall align */
  flex-direction: column;
  display: flex;
  justify-content: center;
}
/* cambiar color a icono */
.animationColor {
  animation: Color 4s ease-in-out infinite;
  text-shadow: 10px 10px #f0f0f0;
}
@keyframes Color {
  0% {
    color: #b21322;
  }

  20% {
    color: #ba1f28;
  }

  40% {
    color: #c3292e;
  }

  60% {
    color: #cb3234;
  }

  80% {
    color: #c3292e;
  }

  100% {
    color: #b21322;
  }
}
/* fin de cambiar color a icono */

/* Boton de actualizar  */
.button-four {
  background: linear-gradient(-45deg, #833ab4, #fd1d1d, #fcb045);
}
.bubbly-button {
  box-shadow: 0 4px 12px 0 rgba(152, 160, 180, 10);
  margin-top: 100px;
  margin-bottom: 60px;
  font-family: "Poppins";
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 6px;
  background-size: 400% 400%;
  color: #212529;
  text-transform: uppercase;
  border: 0;
  padding: 13px 30px;
  font-size: 15px;
  animation: Gradient 10s ease infinite;
}
.bubbly-button:hover {
  background-size: 150% 150%;
}

.gradient-btn-outlined {
  animation: Gradient 10s ease infinite;
  position: relative;
}
.gradient-btn-outlined span {
  position: relative;
  z-index: 2;
}
.gradient-btn-outlined::after {
  content: "";
  position: absolute;
  border-radius: 4px;
  z-index: 0;
  background: rgb(255, 255, 255);
  top: 2px;
  bottom: 2px;
  right: 2px;
  left: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
}
@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>