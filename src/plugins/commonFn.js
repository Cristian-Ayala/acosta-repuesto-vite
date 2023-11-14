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
};