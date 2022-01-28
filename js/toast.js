const toast = (() => {

  const select = (selector) => document.querySelectorAll(selector);

  const types = {
    success: 'success',
    fail: 'fail',
  };

  const returnFunction = ({
    type = types.success,
    text = '',
    duration = 2000,
  } = {}) => {
    const toastDiv = select('.popup-toast-overlay');
    const titleDiv = select('.popup-toast-title');
    const textDiv = select('.popup-toast-text');
    toastDiv?.forEach((div) => {
      div?.classList?.remove('is-hidden');
      div?.classList?.remove('is-success');
      div?.classList?.remove('is-fail');
      div?.classList?.add(
        type === types.success
        ? 'is-success'
        : type === types.fail
          ? 'is-fail'
          : ''
      );
    })

    titleDiv?.forEach((div) => {
      div.innerText = type === types.success
        ? 'Success!'
        : type === types.fail
          ? 'Error!'
          : '';
    })

    textDiv?.forEach((div) => {
      div.innerText = text;
    })

    setTimeout(() => {
      toastDiv?.forEach((div) => {
        div?.classList?.add('is-hidden');
      })
    }, duration);
  };

  returnFunction.types = types;

  return returnFunction;
})();