<template>
  <div class="container-fluid px-xl-5">
    <div
      style="
        box-shadow: 0 0.125rem 0.8rem rgba(0, 0, 0, 0.1);
        margin-top: 1rem;
        border-radius: 25px;
        overflow: hidden;
      "
    >
      <img
        src="../assets/img/acosta.webp"
        alt="acosta img"
        style="max-width: 100%"
      />
    </div>
    <h1 style="text-align: center; margin-top: 2rem; margin-bottom: 0">
      Esto es lo que puedes hacer:
    </h1>
    <div class="cuadros-home">
      <div class="cuadro1-home">
        <router-link to="/productos">
          <img src="../assets/img/1.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Productos
          </div>
          <div class="cuadros-text-home">
            {{ isAbleToDo.productos }}
          </div>
        </router-link>
      </div>
      <div class="cuadro2-home">
        <router-link to="/marcas">
          <img src="../assets/img/2.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Marcas
          </div>
          <div class="cuadros-text-home">
            {{ isAbleToDo.marcas }}
          </div>
        </router-link>
      </div>
    </div>
    <div class="cuadros-home">
      <div class="cuadro3-home">
        <router-link to="/categorias">
          <img src="../assets/img/3.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Categorias
          </div>
          <div class="cuadros-text-home">
            {{ isAbleToDo.categorias }}
          </div>
        </router-link>
      </div>
      <div class="cuadro4-home">
        <router-link to="/ordenes">
          <img src="../assets/img/4.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Ordenes
          </div>
          <div class="cuadros-text-home">{{ isAbleToDo.ordenes }}</div>
        </router-link>
      </div>
      <div class="cuadro5-home">
        <router-link to="/estadisticas">
          <img src="../assets/img/5.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Estadisticas
          </div>
          <div class="cuadros-text-home">{{ isAbleToDo.estadisticas }}</div>
        </router-link>
      </div>
      <div class="cuadro6-home">
        <router-link to="/clientes">
          <img src="../assets/img/6.webp" alt="..." style="max-width: 100%" />
          <div
            class="font-weight-bold d-block"
            style="margin: 1rem; font-size: 2.5rem"
          >
            Clientes
          </div>
          <div class="cuadros-text-home">
            {{ isAbleToDo.clientes }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

const ableToModifyLabels = {
  productos: "Editar, eliminar, agregar o listar",
  marcas: "Editar, eliminar, agregar o listar",
  categorias: "Editar, eliminar, agregar o listar",
  ordenes: "Editar, agregar o listar",
  estadisticas: "Ver estadísticas de venta",
  clientes: "Editar, eliminar, agregar o listar",
};
const notAbleToModifyLabels = {
  productos: "Listar",
  marcas: "Listar",
  categorias: "Listar",
  ordenes: "Editar, agregar o listar",
  estadisticas: "Ver estadísticas de venta",
  clientes: "Editar, eliminar, agregar o listar",
};

export default {
  name: "HomeBar",
  data() {
    return {
      isAbleToDo: {
        productos: "",
        marcas: "",
        categorias: "",
        ordenes: "",
        estadisticas: "",
        clientes: "",
      },
    };
  },
  computed: {
    ...mapState("auth", ["isAbleToModify"]),
  },
  watch: {
    isAbleToModify: {
      handler(conditional) {
        if (conditional) {
          this.isAbleToDo = ableToModifyLabels;
          return;
        }
        this.isAbleToDo = notAbleToModifyLabels;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
a:hover,
a:focus {
  color: #ffffff;
  text-decoration: none;
}
a {
  color: #212529;
}
</style>
