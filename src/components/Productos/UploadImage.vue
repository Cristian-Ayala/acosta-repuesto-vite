<template>
  <el-upload
    ref="upload"
    v-model:file-list="fileList"
    action=""
    list-type="picture-card"
    :http-request="handleHttpRequest"
    :limit="1"
    :on-exceed="handleExceed"
    :on-success="handleOnSuccess"
    accept="image/jpeg,image/png,image/webp"
  >
    <el-icon><plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><download /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" width="85%" align-center append-to-body>
    <div class="parent">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>

<script setup>
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import imageCompression from "browser-image-compression";
import { genFileId } from "element-plus";
import { getCurrentInstance, ref, watch } from "vue";

const { appContext } = getCurrentInstance();

const optionsImgCompress = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 500,
  useWebWorker: true,
};

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue", "newPictureFlag"]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const fileList = ref();

const handlePictureCardPreview = (file) => {
  dialogVisible.value = true;
  if (file instanceof Blob) {
    const urlFile = URL.createObjectURL(file);
    dialogImageUrl.value = urlFile;
    return;
  }
  dialogImageUrl.value = file.url;
};

const handleDownload = async (file) => {
  if (!file.url && !file.name) return;

  // Replace fetch with customFetch
  try {
    const response = await appContext.config.globalProperties.$customFetch(
      file.url,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    // Get the response as a Blob
    const blob = await response.blob();

    // Create an object URL for the fetched resource
    const objectURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = objectURL;
    downloadLink.download = file.name;
    downloadLink.target = "_blank";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

const upload = ref();

const handleRemove = () => {
  upload.value.clearFiles();
};

const handleExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  upload.value.handleStart(file);
};

function cleanFileName(fileName) {
  const indexOfExtension = fileName.lastIndexOf(".");
  const fileNameWithoutExtension =
    indexOfExtension < 0 ? fileName : fileName.substring(0, indexOfExtension);
  const withoutAccents = fileNameWithoutExtension
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const withoutSpecialChars = withoutAccents.replace(/[^\w\s]/gi, "");
  const withoutSlashes = withoutSpecialChars.replace(/\//g, "");
  const withoutSpacesAndHyphens = withoutSlashes.replace(/[\s-.]+/g, "_");
  return `${withoutSpacesAndHyphens}${fileName.substring(indexOfExtension)}`;
}

function cleanBlobName(blob) {
  const fileWithNewName = new File([blob], cleanFileName(blob.name), {
    type: blob.type,
  });
  return fileWithNewName;
}

const handleOnSuccess = async (file) => {
  const compressedFile = await imageCompression(file, optionsImgCompress);
  emits("newPictureFlag");
  emits("update:modelValue", [cleanBlobName(compressedFile)]);
};

const handleHttpRequest = (options) => {
  const { file } = options;
  options.onSuccess(file);
};

watch(
  () => props.modelValue,
  async (arrFiles) => {
    if (!arrFiles || !arrFiles.length) return;
    const fileURL = arrFiles[0];

    if (
      typeof fileURL === "string" &&
      fileURL.includes("file-manager/photo/")
    ) {
      try {
        const response =
          await appContext.config.globalProperties.$customFetch(fileURL);
        if (!response.ok) {
          throw new Error("Failed to fetch the file.");
        }
        const blob = await response.blob();
        const fileName = fileURL.split("/file-manager/photo/")[1] || fileURL;
        const objectURL = URL.createObjectURL(blob);

        fileList.value = [
          {
            url: objectURL,
            name: fileName,
          },
        ];
      } catch (error) {
        console.error("Error fetching file:", error);
      }
      return;
    }
    if (fileURL instanceof Blob) {
      const urlFile = URL.createObjectURL(fileURL);
      fileList.value = [
        {
          url: urlFile,
          name: fileURL.name,
        },
      ];
      return;
    }
    fileList.value = [fileURL];
  },
);
</script>

<style scoped>
:deep(ul.el-upload-list.el-upload-list--picture-card > li + div) {
  display: none;
}
.parent {
  width: 100%; /* Set the width of the parent container */
  height: 100%; /* Set the height of the parent container */
}

.parent img {
  width: 100%;
  height: 100%;
}
</style>
