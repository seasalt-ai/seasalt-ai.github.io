const initScroll = (()=>{
  const handlerList = [];

  body.addEventListener('scroll', (e) => {
    handlerList.forEach((func) => {
      if (typeof func === 'function') {
        func.call(body, e)
      }
    })
  });

  body.addEventListener('resize', (e) => {
    handlerList.forEach((func) => {
      if (typeof func === 'function') {
        func.call(body, e)
      }
    })
  });

  function initScroll(containerSelector, sectionClass) {
    const { body } = document;

    // 滾動到的 section 加入 .actived ，畫面外的移除 .actived
    const onScroll = (e) => {
      const container = document.querySelector(containerSelector);
      if (!container) {
        return false;
      }
      const { clientHeight, scrollHeight, scrollTop } = body;
      const { offsetTop: containerTop, parentElement } = container;
      const { offsetTop: parentTop } = parentElement ?? {};
      const offsetTop = (containerTop ?? 0) + (parentTop ?? 0);
      const viewTop = scrollTop - offsetTop;
      // Array.from
      const sections = [].slice.call(container.children).filter((elm) => elm.classList.contains(sectionClass));
      sections.forEach((elm, index) => {
        const { offsetTop, clientHeight: elmHeight } = elm;
        if ((viewTop + clientHeight) > offsetTop
        && viewTop < (offsetTop + elmHeight * 0.5)) {
          elm.classList.add('actived');
        } else if ((viewTop + clientHeight) <= offsetTop
        || viewTop >= (offsetTop + elmHeight)) {
          elm.classList.remove('actived');
        }
      });
    // console.log('debug : clientHeight, scrollHeight, scrollTop', clientHeight, scrollHeight, scrollTop);
    };
    handlerList.push(onScroll);
    onScroll();
  }

  return initScroll;
})();

initScroll('#content', 'career-mission-section');
initScroll('#content', 'career-vision-section');
initScroll('.career-detail-section', 'career-department-title');
initScroll('.career-detail-section', 'career-position-item');
