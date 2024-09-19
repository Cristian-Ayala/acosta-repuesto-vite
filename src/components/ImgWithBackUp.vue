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
import backupImg from "@/assets/img/cow512x512.png";

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
      currentSource: null,
    };
  },
  async mounted() {
    await this.getProtectedImg();
    if (this.backupSource == null || this.backupSource === "") return;
    this.backupImg = this.backupSource;
  },
  methods: {
    handleImageError() {
      // If there's an error loading the original image, switch to the backup image source.
      this.currentSource = this.backupImg;
    },
    async getProtectedImg() {
      try {
        const res = await this.$customFetch(this.source);
        const imgUrl = await res.text();
        this.currentSource = imgUrl;
      } catch (error) {
        this.handleImageError();
      }
    },
  },
};
</script>

<style scoped>
.image {
  width: 100%;
  max-height: 8rem;
  object-fit: cover;
}
.image-container {
  height: 8rem;
  display: flex;
}
</style>
