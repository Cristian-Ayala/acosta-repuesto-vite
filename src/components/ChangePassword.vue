<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog v-model="showModalLocal" title="Cambiar contraseña" width="90%">
    <div class="card-body">
      <el-form
        ref="formDatos"
        :model="objChangePwd"
        :rules="rules"
        label-width="auto"
        label-position="top"
        size="default"
        status-icon
      >
        <el-form-item
          v-if="usrSelected?.id != null"
          label="ID del usuario:"
          prop="idUser"
        >
          <el-input
            v-model="objChangePwd.idUser"
            type="text"
            placeholder="ID usuario"
            disabled
          />
        </el-form-item>
        <el-form-item v-else label="Contraseña actual:" prop="oldPassword">
          <el-input
            v-model="objChangePwd.oldPassword"
            type="password"
            placeholder="Ingrese su contraseña actual"
            show-password
          />
        </el-form-item>
        <el-form-item label="Contraseña Nueva:" prop="newPassword">
          <el-input
            v-model="objChangePwd.newPassword"
            type="password"
            placeholder="Ingrese la nueva contraseña"
            show-password
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeChangePassword')"> Cancelar </el-button>
        <el-button type="primary" @click="changePassword(formDatos)">
          Guardar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, getCurrentInstance, reactive, ref, watch } from "vue";

const { appContext } = getCurrentInstance();
const emit = defineEmits(["closeChangePassword"]);

const prop = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  usrSelected: {
    type: Object,
    default: () => ({}),
  },
});

const showModalLocal = computed({
  get() {
    return prop.showModal;
  },
  set() {
    emit("closeChangePassword");
  },
});

const formDatos = ref();
const objChangePwd = reactive({
  newPassword: "",
});

const rules = reactive({
  newPassword: [
    { required: true, message: "Ingrese la nueva contraseña", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "Debe ser más larga que 6 caracteres y menos de 20",
      trigger: "blur",
    },
  ],
});

watch(
  () => prop.usrSelected,
  (usr) => {
    if (!usr) {
      objChangePwd.oldPassword = "";
      rules.oldPassword = [
        {
          required: true,
          message: "Ingrese su contraseña actual",
          trigger: "blur",
        },
        {
          min: 6,
          max: 20,
          message: "Debe ser más larga que 6 caracteres y menos de 20",
          trigger: "blur",
        },
      ];
      return;
    }
    objChangePwd.idUser = usr.id;
    rules.idUser = [
      {
        required: true,
        message: "ID del usuario es requerido",
        trigger: "change",
      },
    ];
  },
  { immediate: true, deep: true },
);

async function changePwdUsrAdminReset() {
  const url = `${import.meta.env.VITE_NESTJS_DOMAIN}/auth/change-password-admin`;
  const res = await appContext.config.globalProperties.$customFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objChangePwd),
  });
  const data = await res.json();
  if (res.status === 200) {
    ElMessage.success({ message: data.message, duration: 6500 });
    emit("closeChangePassword");
  } else throw new Error(data.message);
}

async function changePwdUsr() {
  const url = `${import.meta.env.VITE_NESTJS_DOMAIN}/auth/change-password`;
  const res = await appContext.config.globalProperties.$customFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objChangePwd),
  });
  const data = await res.json();
  if (res.status === 200) {
    ElMessage.success({ message: data.message, duration: 6500 });
    emit("closeChangePassword");
  } else throw new Error(data.message);
}

async function changePassword(formEl) {
  await formEl.validate(async (valid) => {
    if (!valid) {
      ElMessage.error({ message: "Error en los campos", duration: 6500 });
      return;
    }
    try {
      if (prop.usrSelected.id) await changePwdUsrAdminReset();
      else await changePwdUsr();
    } catch (error) {
      ElMessage.error({ message: error, duration: 6500 });
      emit("closeChangePassword");
    }
  });
}
</script>

<style scoped></style>
