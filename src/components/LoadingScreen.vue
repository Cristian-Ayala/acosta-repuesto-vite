<template>
  <div id="loadingPage" transition="fade">
    <div id="container">
      <div class="a1">
        <div class="mo-boy"></div>
        <div class="mo-girl"></div>
        <div class="mo-mo"></div>
        <div class="mo-wheel2"></div>
        <div class="mo-wheel1"></div>
      </div>
      <div class="motor_shadow"></div>
      <i class="smoke smoke_1"></i>
      <i class="smoke smoke_2"></i>
    </div>
    <h4>Acosta Repuestos</h4>
  </div>
</template>

<script>


export default {
  name: "LoadingScreen",
};
</script>

<style scoped>
h4 {
  text-transform: uppercase;
  font-weight: 700;
  font-family: Poppins, sans-serif;
  color: #e10d2dbd;
  position: absolute;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-shadow: 0px 0px 20px rgb(255 0 0 / 50%);
}
#loadingPage {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: #fff;
  z-index: 100;
}

#container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 74.5px;
  height: 40px;
}

.a1 {
  animation: a_motor_man 0.5s linear infinite;
}

.mo-sprite,
.mo-boy,
.mo-girl,
.mo-mo,
.mo-wheel1,
.mo-wheel2 {
  background-image: url("/img/people.png");
  background-repeat: no-repeat;
  background-size: 75px;
  position: absolute;
}

.mo-boy {
  background-position: 0 0;
  height: 68px;
  width: 32px;
  top: -34px;
  left: 28px;
  z-index: 4;
}

.mo-girl {
  background-position: 0 -69px;
  height: 70px;
  width: 30px;
  top: -37px;
  left: 7px;
  z-index: 5;
}

.mo-mo {
  background-position: 0 -138.5px;
  height: 40px;
  width: 75px;
  z-index: 3;
}

.mo-wheel1,
.mo-wheel2 {
  background-image: url("/img/wheel.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
}

.mo-wheel1 {
  height: 21px;
  width: 21px;
  top: 26px;
  left: 54px;
  z-index: -2;
  animation: rotate 1s linear infinite;
}

.mo-wheel2 {
  height: 21px;
  width: 21px;
  top: 26px;
  left: 0px;
  z-index: -2;
  animation: rotate 1s linear infinite;
}

.motor_shadow {
  display: block;
  height: 8px;
  width: 80px;
  position: absolute;
  bottom: -12px;
  left: -2px;
  background: #000000;
  border-radius: 80px/8px;
  opacity: 0.3;
  z-index: 1;
  animation: a_motor_hook 1s 0s linear infinite alternate;
}

.smoke {
  display: block;
  height: 8px;
  width: 8px;
  background: #9a9a9a;
  border-radius: 8px;
  position: absolute;
  left: -10px;
  top: 34px;
  opacity: 0;
}

.smoke_1 {
  animation: a_smoke 1s 0.1s linear infinite;
}

.smoke_2 {
  animation: a_smoke 1s 0.5s linear infinite;
}

@keyframes a_motor_hook {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes a_motor_wrap {
  0% {
    transform: rotate(-35deg);
    opacity: 0;
  }
  5% {
    transform: rotate(-35deg);
    opacity: 1;
  }
  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes a_motor_handle {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(1px, 1px);
  }
  50% {
    transform: translate(-2px, -4px);
  }
  75% {
    transform: translate(1px, 0px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes a_wheel_front {
  0% {
    transform: translate(0, 0) scale(1, 1);
  }
  25% {
    transform: translate(1px, 1px) scale(1.07, 0.98);
  }
  50% {
    transform: translate(-1px, -1px) scale(0.96, 1.06);
  }
  75% {
    transform: translate(1px, 0px) scale(1.05, 0.99);
  }
  100% {
    transform: translate(0, 0) scale(1, 1);
  }
}
@keyframes a_smoke {
  0% {
    transform: scale(0.5) translate(0, 0);
    opacity: 0;
  }
  25% {
    transform: translate(-6px, 0px);
    opacity: 1;
  }
  50% {
    transform: translate(-12px, -4px);
    opacity: 1;
  }
  75% {
    transform: translate(-18px, -12px);
    opacity: 0.5;
  }
  100% {
    transform: scale(1) translate(-22px, -16px);
    opacity: 0;
  }
}
@keyframes a_motor_body {
  0% {
    transform: translate(0, 0) scale(1, 1);
  }
  25% {
    transform: translate(1px, 1px) scale(1.02, 0.99);
  }
  50% {
    transform: translate(-1px, -3px) scale(0.97, 1.03);
  }
  75% {
    transform: translate(1px, 0px) scale(1.01, 1);
  }
  100% {
    transform: translate(0, 0) scale(1, 1);
  }
}
@keyframes a_motor_penguin {
  0% {
    transform: translate(0, 0) scale(1, 1);
  }
  25% {
    transform: translate(1px, 1px) scale(1.05, 0.98);
  }
  50% {
    transform: translate(-1px, -4px) scale(0.96, 1.07);
  }
  75% {
    transform: translate(1px, 0px) scale(1.03, 0.99);
  }
  100% {
    transform: translate(0, 0) scale(1, 1);
  }
}
@keyframes a_motor_man {
  0% {
    transform: translate(0, 0) scale(1, 1);
  }
  25% {
    transform: translate(0px, 1px) scale(1.02, 0.99);
  }
  50% {
    transform: translate(0px, -2px) scale(0.97, 1.03);
  }
  75% {
    transform: translate(0px, 0px) scale(1.01, 1);
  }
  100% {
    transform: translate(0, 0) scale(1, 1);
  }
}
@keyframes a_motor_man_head {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(8deg);
  }
  50% {
    transform: rotate(-6deg);
  }
  75% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
