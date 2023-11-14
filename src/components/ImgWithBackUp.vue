<template>
  <div class="image-container">
    <img
      alt="Image"
      :src="currentSource"
      class="image"
      @error="handleImageError()"
    />
  </div>
</template>

<script>
import backupImg from "@/assets/img/moto.png";

export default {
  name: "ImgWithBackUp",
  props: {
    source: {
      type: String,
      required: true,
    },
    backupSource: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      backupImg,
      currentSource: this.source,
    };
  },
  mounted() {
    if (this.backupSource == null || this.backupSource === "") return;
    this.backupImg = this.backupSource;
  },
  methods: {
    handleImageError() {
      // If there's an error loading the original image, switch to the backup image source.
      this.currentSource = this.backupImg;
    },
  },
};
</script>

<style scoped>
.image {
  width: 100%;
  max-height: 7.5rem;
}
.image-container {
  height: 7.5rem;
  display: flex;
}
</style>
