<template>
  <div id="pic" ref="pic" class="backIcon" :isClick="isClick">
    <slot></slot>
    <slot name="list" :is-top="isTop"></slot>
  </div>
</template>

<script>
export default {
  name: "DraggableButton",
  emits: ["updateIsShowPop", "update:isClick"],
  data() {
    return {
      isTop: true,
      flag: false,
      isClick: false,
      firstTime: "",
      lastTime: "",
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      x: "",
      y: "",
    };
  },
  created() {},
  mounted() {
    const moveDiv = document.querySelector("#pic");
    this.w = document.documentElement.clientWidth || document.body.clientWidth;
    this.h =
      document.documentElement.clientHeight || document.body.clientHeight;
    this.x = moveDiv.offsetWidth;
    this.y = moveDiv.offsetHeight;
    moveDiv.addEventListener("touchstart", this.down, { passive: false });
    moveDiv.addEventListener("touchmove", this.move, { passive: false });
    document.addEventListener("mousemove", this.move, { passive: false });
    moveDiv.addEventListener("mousedown", this.down, { passive: false });
    moveDiv.addEventListener("mouseup", this.end, { passive: false });
    moveDiv.addEventListener("touchend", this.end, { passive: false });
  },
  methods: {
    down(event) {
      const moveDiv = document.querySelector("#pic");
      let touch;
      this.flag = true;
      if (event.touches) {
        [touch] = event.touches;
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
      this.firstTime = new Date().getTime();
    },
    move(event) {
      if (this.flag) {
        this.$emit("updateIsShowPop", false);
        const moveDiv = document.querySelector("#pic");
        let touch;
        if (event.touches) {
          [touch] = event.touches;
        } else {
          touch = event;
        }
        event.preventDefault();
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        this.xPum = this.xPum > 0 ? this.xPum : 0;
        this.yPum = this.yPum > 0 ? this.yPum : 0;
        this.xPum = this.xPum > this.w - this.x ? this.w - this.x : this.xPum;
        this.yPum = this.yPum > this.h - this.y ? this.h - this.y : this.yPum;

        moveDiv.style.left = `${this.xPum}px`;
        moveDiv.style.top = `${this.yPum}px`;
        this.isTop = this.yPum > window.innerHeight / 2;
      }
    },
    end() {
      this.lastTime = new Date().getTime();
      if (this.lastTime - this.firstTime < 200) {
        this.isClick = true;
      } else {
        this.isClick = false;
      }
      this.$emit("update:isClick", this.isClick);
      this.flag = false;
    },
  },
};
</script>

<style scoped>
.backIcon {
  display: block;
  position: fixed;
  left: 80%;
  top: 90%;
  z-index: 9999;
  touch-action: none;
}

.backIcon img {
  width: 100%;
  height: 100%;
}
</style>
