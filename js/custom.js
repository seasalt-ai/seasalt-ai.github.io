const initScroll = (() => {
  const handlerList = [];

  body.addEventListener("scroll", (e) => {
    handlerList.forEach((func) => {
      if (typeof func === "function") {
        func.call(body, e);
      }
    });
  });

  body.addEventListener("resize", (e) => {
    handlerList.forEach((func) => {
      if (typeof func === "function") {
        func.call(body, e);
      }
    });
  });

  function initScroll(containerSelector, sectionClass, offset = 0) {
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
      const sections = [].slice
        .call(container.children)
        .filter((elm) => elm.classList.contains(sectionClass));
      sections.forEach((elm, index) => {
        const { offsetTop, clientHeight: elmHeight } = elm;
        if (
          viewTop + clientHeight + offset > offsetTop &&
          viewTop + offset < offsetTop + elmHeight * 0.5
        ) {
          elm.classList.add("actived");
        } else if (
          viewTop + clientHeight + offset <= offsetTop ||
          viewTop + offset >= offsetTop + elmHeight
        ) {
          elm.classList.remove("actived");
        }
      });
      // console.log('debug : clientHeight, scrollHeight, scrollTop', clientHeight, scrollHeight, scrollTop);
    };
    handlerList.push(onScroll);
    onScroll();
  }

  return initScroll;
})();

// const initVideo = ({ containerSelector, videoSelector }) => {
//   const select = (selector) => document.querySelectorAll(selector);

//   const containers = select(containerSelector);
//   const videos = select(videoSelector);

//   const playingList = Array(Math.max(containers.length, videos.length)).fill(
//     false
//   );

//   containers.forEach((container, index) => {
//     container.addEventListener("click", () => {
//       const video = videos[index];
//       if (!video) {
//         return;
//       }
//       const isPlaying = playingList[index];
//       const classMethod = isPlaying ? "remove" : "add";
//       const playMethod = isPlaying ? "pause" : "play";

//       container?.classList?.[classMethod]("is-playing");
//       video[playMethod]();

//       if (isPlaying) {
//         playingList[index] = false;
//       } else {
//         playingList[index] = true;
//       }
//     });
//   });
// };

// 全螢幕影片
function initVideo({
  buttonSelector = '.index .header button.button-arrow',
  containerSelector = '.video-mask-container',
  videoSelector = '.video-mask-container .video-media-fullscreen',
  playSelector = '.video-mask-container .video-fullscreen-play',
  pauseSelector = '.video-mask-container .video-fullscreen-pause',
  progressSelector = '.video-mask-container .video-fullscreen-progress',
  closeSelector = 'label.menu-label',
}) {
  const select = (selector) => document.querySelectorAll(selector);
  // const { body } = document;
  const buttons = select(buttonSelector);
  const containers = select(containerSelector);
  const videos = select(videoSelector);
  const plays = select(playSelector);
  const pauses = select(pauseSelector);
  const progresses = select(progressSelector);
  const closes = select(closeSelector);

  // 影片時間事件
  const events = ['timeupdate', 'progress'];

  // 影片狀態紀錄
  const record = {
    show: false,
  };

  // 播放影片
  function playVideos(event) {
    const { currentTarget, target } = event;
    const dom = currentTarget ?? target;
    const { attributes } = dom ?? {};
    const { 'media-source': source, 'media-poster': poster } = attributes ?? {};
    const [{ value: videoSrc }, { value: imageSrc }] = [source ?? {}, poster ?? {}];
    
    videos.forEach((video) => {
      const currentSrc =  video.children?.[0]?.src.replace(/^(\/\/|https?):/, '') ?? '';
      const triggeredSrc = videoSrc?.replace(/^(\/\/|https?):/, '');

      if (imageSrc) {
        video.poster = imageSrc;
      }
      if (videoSrc && (currentSrc !== triggeredSrc)) {
        video.src = videoSrc;
      }
      // source 有快取 bug
      // if (videoSrc) {
      //   if (video.src) {
      //     video.src = videoSrc;
      //   } else if (currentSrc !== triggeredSrc) {
      //     const sourceDom = document.createElement('source');
      //     sourceDom.src = videoSrc;
      //     console.log(`debug -> videos.forEach -> sourceDom`, sourceDom)
      //     video.innerHTML = '';
      //     video.insertBefore(sourceDom, video.firstChild);
      //   }
      // }
      video.play()
        .catch((err) => {
          console.log('debug : playVideos -> err', err);
        });
      video.muted = false;
    });
  }

  // 暫停影片
  function pauseVideos() {
    videos.forEach((video) => {
      video.pause();
    });
  }

  // 改變 開啟/關閉 影片 class
  function toggleClasses() {
    const method = record.show ? 'add' : 'remove';
    containers.forEach((container) => {
      container.classList[method]('is-shown');
    });
    closes.forEach((close) => {
      close.classList[method]('is-close');
    });
  }

  // 關閉影片 popup
  function closeVideos(event) {
    if (record.show) {
      event.preventDefault();
      record.show = !1;
      toggleClasses();
      pauseVideos();
    }
  }

  // 按下 開啟影片 popup
  buttons.forEach((button) => {
    button.onclick = (e) => {
      const { attributes } = button ?? {};
      const { 'media-source': source } = attributes ?? {};
      const { value: videoSrc } = source;
      if (videoSrc) {
        record.show = !0;
        toggleClasses();
        playVideos(e);
      }
    };
  });

  // 按下 關閉影片 popup
  closes.forEach((close) => {
    close.onclick = closeVideos;
  });

  // 點影片背景
  containers.forEach((el) => {
    el.onclick = (e) => {
      const { target, srcElement, toElement } = e;
      const clickedElement = target ?? srcElement ?? toElement;
      if (el === clickedElement) {
        pauseVideos();
        closeVideos(e);
      }
    };
  });

  // 按下 播放影片
  plays.forEach((play) => {
    play.onclick = playVideos;
  });

  // 按下 暫停影片
  pauses.forEach((pause) => {
    pause.onclick = pauseVideos;
  });

  videos.forEach((video) => {
    video.onclick = (event) => {
      event.preventDefault();
      video[video.paused ? 'play' : 'pause']();
    };
  })

  // 按下進度條
  progresses.forEach((progress) => {
    progress.onclick = (event) => {
      event.preventDefault();
      const { offsetX, target, srcElement, toElement } = event;
      const timeRatio = offsetX / progress.clientWidth;
  
      videos.forEach((video) => {
        const { buffered, duration, currentTime } = video;
        video.currentTime = timeRatio * duration;
      })
    };
  });

  // 影片時間改變
  function updateBar({ currentTarget: video }) {
    progresses.forEach((progress) => {
      const { buffered, duration, currentTime } = video;
      const { length: bufferedLength } = buffered;
      // Array.from
      const loadedBars = [].slice.call(progress.children);
      while (loadedBars.length > bufferedLength) {
        const last = loadedBars.pop();
        last.remove();
      }
      while (loadedBars.length < bufferedLength) {
        const dom = document.createElement('div');
        dom.classList.add('loaded');
        progress.append(dom);
        loadedBars.push(dom);
      }
      for (let index = bufferedLength - 1; index >= 0; index--) {
        const loadedBar = loadedBars[index];
        const [start, end] = [buffered.start(index), buffered.end(index)];
        // console.log('debug : updateBar -> index, start, end, duration', index, start, end, duration);
        loadedBar.style.width = `${100 * (end - start) / duration}%`;
        loadedBar.style.left = `${start / duration}%`;
      }
      progress.style.setProperty('--time', `${100 * currentTime / duration}%`);
    });
  }
  // 影片時間改變事件
  events.forEach((evt) => {
    videos.forEach((video) => {
      video.addEventListener(evt, updateBar);
    });
  });
}

// white paer 頁面輸入
function initWhitePaper({
  list = [],
  selector = 'white-paper-data',
  inputSelector = '.whitepaper-form-input',
  buttonSelector = '.location-whitepaper-submit'
}) {
  const select = (selector) => document.querySelectorAll(selector);
  const buttons = select(buttonSelector);
  const formList = list
    .map((str) => {
      const div = document.querySelector(`[${selector}=${str}]`);
      const input = document.querySelector(`[${selector}=${str}] > ${inputSelector}`);
      const dataString = str;
      return { div, input, dataString };
    })
    .filter(({ div, input, dataString }) => div && input);

  formList.forEach(({ div, input }) => {
    input.addEventListener('change', () => {
      div.classList.remove('has-error');
    })
    input.addEventListener('input', () => {
      div.classList.remove('has-error');
    })
  });

  buttons.forEach(( button ) => {
    button.addEventListener('click', () => {
      let valid = true;
      const params = {};
      formList.forEach(({ div, input, dataString }) => {
        if (!input?.value
          || (dataString === 'mail' && !emailCheck(input?.value) )
        ) {
          div.classList.add('has-error');
          valid = false;
        } else {
          params[dataString] = input?.value;
        }
      });
      params['block'] = 'Voice_Index';
      if (valid) {
        $.post(
          "https://cors.seasalt.ai/https://script.google.com/macros/s/AKfycbzmVEBYVXnDqPCpeKjxP0SAX5dMNSy5OWEPj0w4OiPVOEifoRvPNLGq_bk9nKoMmZTa_Q/exec",
          params,
          (data) => {
            console.log(`debug -> button.addEventListener -> data`, data)
            toast({
              type: toast.types.success,
              text: 'Your submit is complete.',
            })
          }
        )
        .fail((err) => {
          const errorMessage = err?.message || err?.responseText || err?.statusText || 'error';
          toast({
            type: toast.types.fail,
            text: `Your submit is failed. ${errorMessage}`,
          })
        });
      }
    })
  })
}

const calculateIndex = ({ clientWidth, scrollWidth, scrollLeft }, length) => {
  const margin = (35 / 375) * clientWidth;
  const width = scrollWidth - clientWidth - 2 * margin;
  const interval = width / (length <= 1 ? 1 : length - 1);
  // console.log(`debug -> onScroll -> { width, interval, clientWidth, scrollWidth, scrollLeft }`, { width, interval, clientWidth, scrollWidth, scrollLeft })
  const indexPrecomputed = Math.floor(0.5 + (scrollLeft - margin) / interval);
  const index =
    indexPrecomputed < 0
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
  classList = [],
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
    });

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

  if (typeof prev?.addEventListener === "function") {
    prev.addEventListener("click", () => {
      // const { clientWidth, scrollWidth, scrollLeft } = scroll;
      const { index, interval, margin } = calculateIndex(scroll, length);
      scroll.scrollTo({
        left: index - 1 === 0 ? 0 : (index - 1) * interval + margin,
        behavior: "smooth",
      });
    });
  }

  if (typeof next?.addEventListener === "function") {
    next.addEventListener("click", () => {
      const { clientWidth, scrollWidth, scrollLeft } = scroll;
      const { index, interval, margin } = calculateIndex(scroll, length);
      console.log(`debug -> next.addEventListener -> index`, index);
      scroll.scrollTo({
        left:
          index + 1 >= length - 1
            ? scrollWidth - clientWidth
            : (index + 1) * interval + margin,
        behavior: "smooth",
      });
    });
  }

  if (typeof scroll?.addEventListener === "function") {
    scroll.addEventListener("scroll", onScroll);
    // body.addEventListener('touchend', onScroll);
    onScroll();
  }
};

/* ========================================================================= */
/*	Book a Demo
/* ========================================================================= */

const eventNameUrlMapping = {
  mail_submit:
    'https://cdn.forms-content.sg-form.com/9fc07fb0-cfff-11ec-aa53-6a68201efa16',
  book_a_demo:
    'https://docs.google.com/forms/d/e/1FAIpQLSfFXRa-A1z91vQZ6Xs2FtrSTc2AFpZ97U5SWBYlpsIW5T-yrg/viewform?embedded=true',
  voice_intelligence_white_paper: 'https://cdn.forms-content.sg-form.com/4de7f466-cffd-11ec-aa53-6a68201efa16'
};

const openFormPopup = (e) => {
  e.preventDefault()
  const iframe = document.querySelector('#form-popup-iframe');
  iframe.onload = () => {
    const popup = document.querySelector('.form-popup');
    popup.classList.add('form-popup--display');
    const popupOuter = document.querySelector('.form-popup__background');
    const closeButton = document.querySelector('.form-popup__closeBtn');
    const closeFormHandler = () => {
      popup.classList.remove('form-popup--display');
    };

    closeButton.addEventListener('click', closeFormHandler);
    popupOuter.addEventListener('click', closeFormHandler);
  };

  const eventName = e.currentTarget.getAttribute('data-event-name');
  iframe.src = eventNameUrlMapping[eventName];
};

function clickBookDemo() {
  const bookDemoLink = 'https://forms.gle/RdNoQYseQ8DVpTu66';
  window.open(bookDemoLink);
}

$(document).ready(function () {
  $('[id^=bookDemo_]').on('click', openFormPopup);
});



/* ========================================================================= */
/*	email submit
/* ========================================================================= */

var timeoutForError;
var timeoutForShow;
function displayMessage(elementId, isError) {
  const $messageElement = $("#" + elementId);
  let msg = $messageElement.attr("data-successMsg");

  if (isError) {
    msg = $messageElement.attr("data-errorMsg");
    $messageElement.addClass("errorMsg");

    if (timeoutForError) clearTimeout(timeoutForError);
    timeoutForError = setTimeout(() => {
      $messageElement.removeClass("errorMsg");
    }, 5000);
  }

  $messageElement.text(msg);
  $messageElement.addClass("show");

  if (timeoutForShow) clearTimeout(timeoutForShow);
  timeoutForShow = setTimeout(() => {
    $messageElement.removeClass("show");
  }, 5000);
}

function writeToGoogleForm(type, email, msgElementId, inputElementId) {
  $.get(
    "https://cors.seasalt.ai/https://script.google.com/macros/s/AKfycbzmVEBYVXnDqPCpeKjxP0SAX5dMNSy5OWEPj0w4OiPVOEifoRvPNLGq_bk9nKoMmZTa_Q/exec",
    { block: type, mail: email },
    function (data) {
      displayMessage(msgElementId, false);
      $(`#${inputElementId}`).val("");
    }
  );
}

// whitePaper submit
$("#hero-section-submit-button").click(function (e) {
  e.preventDefault();
  let $emailInput = $("#hero-section__email");
  let email = $emailInput.val();

  if (email.trim() !== "") {
    if (emailCheck(email)) {
      writeToGoogleForm(
        "whitePaper",
        email,
        "whitePaper-submit-message",
        "hero-section__email"
      );
    } else {
      displayMessage("whitePaper-submit-message", true);
    }
  }
});

// footer email submit
$('#footer-links-form-submit').click((e) => {
  openFormPopup(e);
});

$('#get-voice-intelligence-white-paper').click(e => {
  openFormPopup(e);
})

// location-based messaging whitePaper submit
$("#location-based-submit-button").click(function (e) {
  e.preventDefault();
  let $emailInput = $("#location-based__email");
  let email = $emailInput.val();

  if (email.trim() !== "") {
    if (emailCheck(email)) {
      writeToGoogleForm(
        "LBM_whitepager",
        email,
        "location-based-submit-message",
        "location-based__email"
      );
    } else {
      displayMessage("location-based-submit-message", true);
    }
  }
});

$(window).load(function () {
  // scroll effect
  initScroll("#content", "career-mission-section");
  initScroll("#content", "career-vision-section");
  initScroll(".career-detail-section", "career-department-title");
  initScroll(".career-detail-section", "career-position-item");

  initScroll(".location-based-messaging", "location-based-section");

  initScroll("#content", "managed", -150);
  initScroll("#content", "managed-what", -150);
  initScroll("#content", "managed-do", -150);
  initScroll("#content", "timeshare", -150);
  initScroll("#content", "agents", -150);
  initScroll("#content", "workforce", -150);
  initScroll("#content", "scale", -150);
  initScroll("#content", "powered", -150);

  initScroll("#content .inner-header", "workforce");
  initScroll("#content .inner-header", "powered");

  initProductScroll({
    scrollSelector: ".seaSuite-container__subModuleList",
    productSelector: ".seaSuite-container__img",
    prevSelector: ".seaSuite-container__content .prev-btn",
    nextSelector: ".seaSuite-container__content .next-btn",
    classList: ["selected-1", "selected-2", "selected-3"],
  });

  initWhitePaper({
    list: ['mail', 'block', 'first', 'last', 'company', 'designation', 'phone', 'country']
  })

  $(".seaSuite-container__content .zoom-btn").click(function () {
    $(".seaSuite-container__img").toggleClass("is-full-mode");
    $(".seaSuite-container__img").toggleClass("is-zoom-mode");
  });

  // $('seasalt-header-settings is-closed')

  $(".page-sidebar-hamburger").click(function () {
    $(this).toggleClass("is-closed");
    $(".seasalt-header-settings").toggleClass("is-opened");
    $(".seasalt-header-settings").toggleClass("is-closed");
  });

  if (typeof $(".section-video-container.is-mobile").slick === "function") {
    $(".section-video-container.is-mobile").slick({
      dots: true,
      arrows: false,
    });
  }

  // initialize videos' play and pause
  // initVideo({
  //   containerSelector: ".location-section-video .section-video-card",
  //   videoSelector: ".location-section-video .video-card-video",
  // });
  initVideo({
    buttonSelector: ".location-section-video .section-video-card",
  });

  // first section(hero-section) description typing animation
  const heroSectionTyingArea = document.querySelector(
    "#hero-section__paragraph"
  );

  if (!heroSectionTyingArea) return;
  var textCount = 0;

  setTypingAnimate();

  heroSectionTyingArea.addEventListener(
    "animationend",
    setTypingAnimate,
    false
  );

  function setTypingAnimate() {
    const $heroSectionTyping = $("#hero-section__paragraph");
    $heroSectionTyping.removeClass("typingAnimate" + textCount.toString());
    if (textCount === 3) {
      textCount = 1;
    } else {
      textCount += 1;
    }
    let content = $heroSectionTyping.attr("data-text" + textCount.toString());
    $heroSectionTyping.text(content);
    $heroSectionTyping.addClass("typingAnimate" + textCount.toString());
  }
});
