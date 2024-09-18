/* eslint-disable no-param-reassign */
function twoDecimalsOnly(value) {
  try {
    return Math.round(value * 100) / 100;
  } catch (error) {
    console.log(error);
    return 0.0;
  }
}

export default ({ app }) => {
  app.config.globalProperties.$twoDecimalsOnly = twoDecimalsOnly;
  app.config.globalProperties.$clientName = import.meta.env.VITE_CLIENT_NAME;
  app.config.globalProperties.$clientHomeImgName = import.meta.env.VITE_CLIENT_HOME_IMG_NAME;
  app.config.globalProperties.$clientSquare1ImgName = import.meta.env.VITE_CLIENT_SQUARE_1_IMG_NAME;
};
