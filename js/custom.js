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

const initVideo = ({
  containerSelector,
  videoSelector,
}) => {
  const select = (selector) => document.querySelectorAll(selector);

  const containers = select(containerSelector);
  const videos = select(videoSelector);

  const playingList = Array(Math.max(containers.length, videos.length))
    .fill(false);

  containers.forEach((container, index) => {
    container.addEventListener('click', () => {
      const video = videos[index];
      if (!video) {
        return;
      }
      const isPlaying = playingList[index];
      const classMethod = isPlaying ? 'remove' : 'add';
      const playMethod = isPlaying ? 'pause' : 'play';

      container?.classList?.[classMethod]('is-playing');
      video[playMethod]();

      if (isPlaying) {
        playingList[index] = false;
      } else {
        playingList[index] = true;
      }
    })
  });
};

const calculateIndex = ({ clientWidth, scrollWidth, scrollLeft }, length) => {
  const margin = (35/375) * clientWidth;
  const width = scrollWidth - clientWidth - 2 * margin;
  const interval = width / (length <= 1 ? 1 : length - 1);
  // console.log(`debug -> onScroll -> { width, interval, clientWidth, scrollWidth, scrollLeft }`, { width, interval, clientWidth, scrollWidth, scrollLeft })
  const indexPrecomputed = Math.floor(0.5 + (scrollLeft - margin) / interval);
  const index = indexPrecomputed < 0
    ? 0
    : indexPrecomputed >= length
      ? length - 1
      : indexPrecomputed;

  return { index, interval, margin };
};

const initProductScroll = ({
  scrollSelector,
  productSelector,
  prevSelector,
  nextSelector,
  classList = []
}) => {
  const { body } = document;
  const scroll = document.querySelector(scrollSelector);
  const prev = document.querySelector(prevSelector);
  const next = document.querySelector(nextSelector);

  const { length } = classList;
  
  const onScroll = (e) => {
    const product = document.querySelector(productSelector);
    if (!product) {
      return false;
    }
    const { index, interval } = calculateIndex(scroll, length);
        
    classList.forEach((str, i) => {
      if (i === index) {
        product.classList.add(str);
      } else {
        product.classList.remove(str);
      }
    })

    // 現在無法禁用 ios overscroll，自動捲動會造成問題
    // if (e?.type === 'touchend') {
    //   setTimeout(() => {
    //     const { clientWidth, scrollWidth, scrollLeft } = scroll;
    //     const { index, interval, margin } = calculateIndex(scroll, length);
    //     scroll.scrollTo({
    //       left: index === 0
    //         ? 0
    //         : index >= length - 1
    //           ? scrollWidth - clientWidth
    //           : index * interval + margin,
    //       behavior: 'smooth',
    //     })
    //   }, 10);
    // }
  };

  if (typeof prev?.addEventListener === 'function') {
    prev.addEventListener('click', () => {
      // const { clientWidth, scrollWidth, scrollLeft } = scroll;
      const { index, interval, margin } = calculateIndex(scroll, length);
      scroll.scrollTo({
        left: index - 1 === 0
          ? 0
          : ( index - 1 ) * interval + margin,
        behavior: 'smooth',
      })
    });
  }

  if (typeof next?.addEventListener === 'function') {
    next.addEventListener('click', () => {
      const { clientWidth, scrollWidth, scrollLeft } = scroll;
      const { index, interval, margin } = calculateIndex(scroll, length);
      console.log(`debug -> next.addEventListener -> index`, index)
      scroll.scrollTo({
        left: index + 1 >= length - 1
          ? scrollWidth - clientWidth
          : ( index + 1 ) * interval + margin,
        behavior: 'smooth',
      })
    });
  }

  if (typeof scroll?.addEventListener === 'function') {
    scroll.addEventListener('scroll', onScroll);
    // body.addEventListener('touchend', onScroll);
    onScroll();
  }
}

/* ========================================================================= */
/*	Book a Demo
/* ========================================================================= */
const demoUrl = [
  'https://forms.gle/RdNoQYseQ8DVpTu66',
  'https://share.hsforms.com/1mqJbPiylRJuIP6VMo-n1DQ5jwqm'
]
function clickBookDemo() {
  const randomIndex = Math.floor(Math.random()*2);
  const bookDemoLink = demoUrl[randomIndex];
  window.open(bookDemoLink);
};

$(document).ready(function () {
  $('[id^=bookDemo_]').on('click', clickBookDemo);
});

/* ========================================================================= */
/*	email submit
/* ========================================================================= */

var timeoutForError;
var timeoutForShow;
function displayMessage(elementId, isError) {
  const $messageElement = $('#' + elementId);
  let msg = $messageElement.attr('data-successMsg');

  if (isError) {
    msg = $messageElement.attr('data-errorMsg');
    $messageElement.addClass('errorMsg');

    if (timeoutForError) clearTimeout(timeoutForError);
    timeoutForError = setTimeout(() => {
      $messageElement.removeClass('errorMsg');
    },5000)
  }

  $messageElement.text(msg);
  $messageElement.addClass('show');

  if (timeoutForShow) clearTimeout(timeoutForShow);
  timeoutForShow = setTimeout(() => {
    $messageElement.removeClass('show');
  },5000)
}

function writeToGoogleForm(type, email, msgElementId, inputElementId) {
  $.get("https://script.google.com/macros/s/AKfycbzmVEBYVXnDqPCpeKjxP0SAX5dMNSy5OWEPj0w4OiPVOEifoRvPNLGq_bk9nKoMmZTa_Q/exec", { block: type, mail: email },
  function(data){
    displayMessage(msgElementId, false)
    $(`#${inputElementId}`).val('');
  });
}

// whitePaper submit
$('#hero-section-submit-button').click(function (e) {
  e.preventDefault();
  let $emailInput = $('#hero-section__email');
  let email = $emailInput.val();
  
  if (email.trim() !== "") {
    if (!emailCheck(email)) {
      writeToGoogleForm('whitePaper', email, 'whitePaper-submit-message', 'hero-section__email')
    } else {
      displayMessage('whitePaper-submit-message', true);
    }
  }
});

// footer email submit
$('#footer-links-form-submit').click(function (e) {
  e.preventDefault();
  let $emailInput = $('#footer-links-email__input');
  let email = $emailInput.val();

  if (email.trim() !== "") {
    if (!emailCheck(email)) {
      writeToGoogleForm('email_list', email, 'submit-message', 'footer-links-email__input')
    } else {
      displayMessage('submit-message', true);
    }
  }
});

// location-based messaging whitePaper submit
$('#location-based-submit-button').click(function (e) {
  e.preventDefault();
  let $emailInput = $('#location-based__email');
  let email = $emailInput.val();

  if (email.trim() !== "") {
    if (!emailCheck(email)) {
      writeToGoogleForm('LBM_whitepager', email, 'location-based-submit-message', 'location-based__email')
    } else {
      displayMessage('location-based-submit-message', true);
    }
  }
});

/* ========================================================================= */
/*	first section(hero-section) description typing animation
/* ========================================================================= */

$(window).load(function() {
  // scroll effect
  initScroll('#content', 'career-mission-section');
  initScroll('#content', 'career-vision-section');
  initScroll('.career-detail-section', 'career-department-title');
  initScroll('.career-detail-section', 'career-position-item');

  initScroll('.location-based-messaging', 'location-based-section');

  initProductScroll({
    scrollSelector: '.seaSuite-container__subModuleList',
    productSelector: '.seaSuite-container__img',
    prevSelector: '.seaSuite-container__content .prev-btn',
    nextSelector: '.seaSuite-container__content .next-btn',
    classList: [
      'selected-1',
      'selected-2',
      'selected-3',
    ]
  });

  
  $('.seaSuite-container__content .zoom-btn').click(function (){
    $('.seaSuite-container__img').toggleClass('is-full-mode');
    $('.seaSuite-container__img').toggleClass('is-zoom-mode');
  })

  // $('seasalt-header-settings is-closed')

  $('.page-sidebar-hamburger').click(function (){
    $(this).toggleClass('is-closed');
    $('.seasalt-header-settings').toggleClass('is-opened');
    $('.seasalt-header-settings').toggleClass('is-closed');
  })

  if (typeof $('.section-video-container.is-mobile').slick === 'function') {
    $('.section-video-container.is-mobile').slick({
      dots: true,
      arrows: false,
    });
  }

  // initialize videos' play and pause
  initVideo({
    containerSelector: '.location-section-video .section-video-card',
    videoSelector: '.location-section-video .video-card-video',
  })
  
  // typing text animate
  const heroSectionTyingArea = document.querySelector('#hero-section__paragraph');
  
  if (!heroSectionTyingArea) return;
  var textCount = 0;

  setTypingAnimate();
  
  heroSectionTyingArea.addEventListener("animationend", setTypingAnimate, false);

  function setTypingAnimate() {
    const $heroSectionTyping = $('#hero-section__paragraph');
    $heroSectionTyping.removeClass('typingAnimate'+ textCount.toString());
    if (textCount === 3) {
      textCount = 1;
    } else {
      textCount += 1;
    }
    let content = $heroSectionTyping.attr('data-text'+ textCount.toString());
    $heroSectionTyping.text(content);
    $heroSectionTyping.addClass('typingAnimate'+ textCount.toString());
  }
});
