<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog v-model="showModalLocal" title="Agregar Usuarios" width="90%">
    <div class="card-body">
      <el-form
        ref="formDatos"
        :model="usrObj"
        :rules="rules"
        label-width="auto"
        label-position="top"
        size="default"
        status-icon
      >
        <el-form-item label="Nombre:" prop="name">
          <el-input
            v-model="usrObj.name"
            type="text"
            placeholder="Ingrese su nombre"
          />
        </el-form-item>
        <el-form-item label="Email:" prop="email">
          <el-input
            v-model="usrObj.email"
            type="text"
            placeholder="Ingrese el correo"
          />
        </el-form-item>
        <el-form-item
          v-if="usrSelected?.id != null"
          label="Activo:"
          prop="active"
        >
          <el-radio-group v-model="usrObj.active" size="large">
            <el-radio-button label="Activo" :value="true" />
            <el-radio-button label="Inactivo" :value="false" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else label="Contraseña:" prop="password">
          <el-input
            v-model="usrObj.password"
            type="password"
            placeholder="Ingrese la contraseña"
            show-password
          />
        </el-form-item>
        <el-form-item label="Sucursal:" prop="sucursal">
          <el-select
            v-model="usrObj.sucursal"
            placeholder="Seleccionar Sucursal"
            multiple
          >
            <el-option
              v-for="item in userProfile?.sucursal"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Rol:" prop="roles">
          <el-select
            v-model="usrObj.roles"
            placeholder="Seleccionar rol"
            multiple
            :multiple-limit="1"
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('close')"> Cancelar </el-button>
        <el-button type="primary" @click="manageUsr(formDatos)">
          Guardar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, getCurrentInstance, reactive, ref, watch } from "vue";
import { useStore } from "vuex";

const { appContext } = getCurrentInstance();
const store = useStore();
const emit = defineEmits(["close"]);

const prop = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  userProfile: {
    type: Object,
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
    emit("close");
  },
});

const roles = computed(() => {
  let tmpRoles = [];
  if (prop.userProfile?.roles.includes("admin")) {
    tmpRoles = ["gerente_area", "seller"];
  } else if (prop.userProfile?.roles.includes("gerente_area")) {
    tmpRoles = ["seller"];
  }

  return tmpRoles.map((role) => {
    let label = "";

    switch (role) {
      case "admin":
        label = "Administrador";
        break;
      case "gerente_area":
        label = "Gerente";
        break;
      case "seller":
        label = "Vendedor";
        break;
      default:
        label = "NO SELECCIONAR";
        break;
    }

    return { value: role, label };
  });
});

const formDatos = ref();
const usrObj = reactive({
  name: "",
  email: "",
  sucursal: "",
  roles: "",
});

const rules = reactive({
  name: [
    {
      required: true,
      message: "Ingrese su contraseña actual",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Ingrese la nueva contraseña",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Ingrese un correo válido",
      trigger: ["blur", "change"],
    },
  ],
  sucursal: [
    {
      required: true,
      message: "Seleccione una sucursal",
      trigger: "change",
    },
  ],
  roles: [
    {
      required: true,
      message: "Seleccione un rol",
      trigger: "change",
    },
  ],
});

watch(
  () => prop.usrSelected,
  (usr) => {
    if (!usr) {
      usrObj.password = "";
      rules.password = [
        {
          required: true,
          message: "Ingrese la nueva contraseña",
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
    usrObj.name = usr.name;
    usrObj.email = usr.email;
    usrObj.sucursal = usr.sucursal;
    usrObj.roles = usr.roles;
    usrObj.active = usr.active;
    rules.active = [
      {
        required: true,
        message: "Seleccione si el usuario está activo",
        trigger: "change",
      },
    ];
  },
  { immediate: true, deep: true },
);

async function createUsr() {
  const url = `${import.meta.env.VITE_NESTJS_DOMAIN}/auth/register`;
  const res = await appContext.config.globalProperties.$customFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usrObj),
  });
  const data = await res.json();
  if (res.status === 201) {
    ElMessage.success({ message: data.message, duration: 6500 });
    emit("close");
  } else throw new Error(data.message);
}

async function editUsr() {
  const res = await store.dispatch("users/updateUsr", {
    ...usrObj,
    id: prop.usrSelected.id,
  });
  if (res == null) throw new Error("al editar el usuario");
  emit("close");
}

async function manageUsr(formEl) {
  await formEl.validate(async (valid) => {
    try {
      if (!valid) {
        ElMessage.error({ message: "Error en los campos", duration: 6500 });
        return;
      }
      if (prop.usrSelected?.id != null) {
        editUsr();
      } else {
        createUsr();
      }
    } catch (error) {
      ElMessage.error({ message: error, duration: 6500 });
      emit("close");
    }
  });
}
</script>

<style scoped></style>
