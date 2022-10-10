import axios from 'axios';

import PouchDB from 'pouchdb-browser';
import router from '../../router/index';
// PouchDB.plugin(require('pouchdb-authentication').default);
const axios1 = axios.create({
  withCredentials: true,
});
let remoteUsuarios;
const remotedb = async (url) => {
  remoteUsuarios = await new PouchDB(`${url}marcas`, {
    skip_setup: true,
  });
};
export default () => ({
    namespaced: true,
    state: {
      localUsuarios: null,
      PouchDB,
      usuario: {},
      usuarios: [],
      showModalEdit: false,
      actualUser: {},
    },
    mutations: {
      clearData(state) {
        state.usuario = {};
      },
      setUser(state, user) {
        state.usuario = user;
      },
      setModalEditShow(state, value) {
        console.log('Click');
        state.showModalEdit = value;
      },
      alertNotification(state, { message, duration }) {
        this.$awn.alert(message, {
          durations: {
            success: duration,
          },
        });
      },
      successNotification(state, { message, duration, tittle }) {
        this.$awn.success(message, {
          durations: {
            success: duration,
          },
          labels: {
            success: tittle,
          },
        });
      },
    },
    actions: {
      createRegistro({ state, dispatch, commit }) {
        remoteUsuarios
          .signUp(state.usuario.nickname, state.usuario.password)
          .then(() => {
            dispatch('getAll').then(() =>
              commit('successNotification', {
                message: 'Usuario creado con éxito',
                tittle: 'EXITO',
                duration: 4000,
              }),
            );
          })
          .catch((err) => {
            console.log(JSON.stringify(err));
            let mensaje = '';
            if (err.error === 'conflict') {
              mensaje = 'El usuario ya existe.';
            } else if (err.error === 'forbidden') {
              mensaje = 'Existen caracteres que no son válidos en el usuario.';
            }

            commit('alertNotification', {
              message: `Error al crear usuario<br>${  mensaje}`,
              duration: 4000,
            });
          });
      },
      getAll({ state }) {
        axios1({
          method: 'GET',
          url: `${this.$url  }_users/_all_docs`,
        })
          .then((res) => {
            if (res.status === 200) {
              const rows = res.data.rows || [];
              state.usuarios = rows.filter((usr) => usr.id.includes('org'));
            }
          })
          .catch((error) => {
            console.error(JSON.stringify(error));
          });
      },
      editRegistro({ state, commit, dispatch }) {
        if (state.usuario.password) {
          remoteUsuarios
            .changePassword(
              state.usuario.id.substring(17),
              state.usuario.password,
            )
            .then((res) => {
              console.log(JSON.stringify(res));
              commit('clearData');
              dispatch('getAll').then(() =>
                commit('successNotification', {
                  message: 'Contraseña modificada con éxito',
                  tittle: 'EXITO',
                  duration: 4000,
                }),
              );
            })
            .catch((err) => {
              console.log(JSON.stringify(err));
              let mensajeError = '';
              if (err.name === 'not_found') {
                // typo, or you don't have the privileges to see this user
                mensajeError =
                  'Contraseña no valida o no tiene permisos de edición.';
              } else {
                // some other error
                mensajeError = JSON.stringify(err);
              }
              commit('alertNotification', {
                message: `Error al editar la contraseña<br>${  mensajeError}`,
                duration: 4000,
              });
            });
        } else {
          remoteUsuarios
            .changeUsername(
              state.usuario.id.substring(17),
              state.usuario.nombre,
            )
            .then((res) => {
              console.log(JSON.stringify(res));
              commit('clearData');
              dispatch('getAll').then(() =>
                commit('successNotification', {
                  message: 'Nombre de usuario editado con éxito',
                  tittle: 'EXITO',
                  duration: 4000,
                }),
              );
            })
            .catch((err) => {
              console.log(JSON.stringify(err));
              let mensajeError = '';
              if (err.name === 'not_found') {
                // typo, or you don't have the privileges to see this user
                mensajeError =
                  'Nombre de usuario no valido o no tiene permisos de edición.';
              } else if (err.taken) {
                // auth error, make sure that 'batman' isn't already in DB
                mensajeError = 'Asegurese que el usuario sea único.';
              } else {
                // some other error
                mensajeError = JSON.stringify(err);
              }
              commit('alertNotification', {
                message:
                  `Error al editar el nombre de usuario<br>${  mensajeError}`,
                duration: 4000,
              });
            });
        }
      },
      removeRegistro({ state, commit, dispatch }) {
        remoteUsuarios
          .deleteUser(state.usuario.id.substring(17))
          .then((res) => {
            console.log(JSON.stringify(res));
            commit('clearData');
            dispatch('getAll').then(() =>
              commit('successNotification', {
                message: 'Nombre de usuario eliminado con éxito',
                tittle: 'EXITO',
                duration: 4000,
              }),
            );
          })
          .catch((err) => {
            commit('alertNotification', {
              message: `Error al eliminar el usuario<br>${  JSON.stringify(err)}`,
              duration: 4000,
            });
          });
      },
      initDBUsuarios({ state, dispatch }) {
        // Se agrega el nombre de la DB ("marca") en la función del inicio por eso no se pasa acá
        remotedb(this.$url)
          .then(() => {
            remoteUsuarios
              .getSession()
              .then((response) => {
                if (response.userCtx.name) {
                  state.actualUser.user = response.userCtx.name;
                  state.actualUser.roles = response.userCtx.roles;
                  if (state.actualUser.roles && state.actualUser.roles.length) {
                    dispatch('getAll');
                  }
                } else {
                  throw new Error(JSON.stringify('No hay usuario'));
                }
              })
              .catch(() => {
                // console.log("No hay sesión");
                router
                  .push({
                    path: '/login',
                  })
                  .catch(() => {});
              });
          })
          .catch(console.log);
      },
      logout() {
        // console.log('out');
        // const timeOut = setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000); // wait 1 seconds
        // remoteUsuarios.logout().then(() => {
        //     clearTimeout(timeOut);
        //     router.push({
        //         path: "/login"
        //     }).catch(console.error);
        // }).catch((error) => {
        //     console.error(error);
        //     window.location.reload(true);
        // });
      },
    },
  });
