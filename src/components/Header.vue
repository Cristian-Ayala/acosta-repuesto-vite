<template>
  <div>
    <header class="header">
      <nav class="navbar navbar-expand-lg px-4 py-2 bg-white shadow">
        <div id="menuToggle">
          <input v-model="setSideBar" type="checkbox" />
          <span></span>
          <span></span>
          <span></span>
        </div>
        <router-link to="/">
          <a class="navbar-brand font-weight-bold text-uppercase text-base">
            Acosta Repuestos</a
          >
        </router-link>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "HeaderComp",
  props: {
    isLeftSideBarActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggleSideBar"],
  computed: {
    setSideBar: {
      // getter
      get() {
        return this.isLeftSideBarActive;
      },
      // setter
      set() {
        this.$emit("toggleSideBar");
      },
    },
  },
  methods: {
    sidebarClass() {
      const elementDOM =
        document.getElementsByClassName("sidebar")[0].classList;
      elementDOM.toggle("d-none");
    },
  },
};
</script>

<style scoped>
#menuToggle {
  padding-top: 0.3rem;
}

#menuToggle input {
  display: flex;
  width: 40px;
  height: 32px;
  position: absolute;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
}

#menuToggle span {
  display: flex;
  width: 29px;
  height: 2px;
  margin-bottom: 5px;
  background: #000000;
  border-radius: 3px;
  z-index: 1;
  transform-origin: 5px 0px;
  transition:
    transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    opacity 0.55s ease;
}

#menuToggle span:first-child {
  transform-origin: 0% 0%;
}

#menuToggle span:nth-last-child(3) {
  transform-origin: 0% 100%;
}

#menuToggle input:checked ~ span:nth-last-child(1) {
  opacity: 1;
  transform: translate(-3px, -1px) rotate(-45deg);
  background: #36383f;
}

#menuToggle input:checked ~ span:nth-last-child(2) {
  opacity: 0;
  transform: rotate(45deg) translate(0, -1px);
  background: #36383f;
}
#menuToggle input:checked ~ span:nth-last-child(3) {
  opacity: 1;
  transform: translate(-2px, -4px) rotate(45deg);
  background: #36383f;
}
/* transform: rotate(-45deg) translate(0, 20px);
  -webkit-transform-origin-y: 23px; */
</style>
