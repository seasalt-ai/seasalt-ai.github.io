const bindWidgets = (() => {
  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => document.querySelectorAll(selector);

  const SEASALT_BOT_URL =
    "https://chat.seasalt.ai/chat/9e4cef8823b94d019b954db6f4328a93";
  const channelTypes = {
    facebook: "facebook",
    instagram: "instagram",
    line: "line",
    voice: "voice",
    webchat: "webchat",
    whatsapp: "whatsapp",
  };

  const widgetContainer = select("#sui-right-widgets");

  const init = () => {
    // bindWidgets
    bindWidgetContent(channelTypes.webchat);
    bindWidgetContent(channelTypes.line, "https://lin.ee/fFNydh0a");
    bindWidgetContent(
      channelTypes.facebook,
      "https://mobile.facebook.com/profile.php?id=106953261045343"
    );
    bindWidgetContent(
      channelTypes.whatsapp,
      "https://api.whatsapp.com/send/?phone=%2B14252987474&text&type=phone_number&app_absent=0"
    );
    bindWidgetContent(
      channelTypes.instagram,
      "https://www.instagram.com/seasalt.ai/"
    );
    bindWidgetContent(channelTypes.voice);

    // for mobile use --- start
    const widgetBtn = select("#sui-widget-btn");

    const handleWidgetBtnClick = () => {
      const widgetIcons = selectAll(".widget-btn");

      if (widgetBtn.className == "is-closed") {
        widgetIcons?.forEach((div) => {
          div?.classList?.remove("show");
        });
        widgetBtn.classList.remove("is-closed");
        select("#sui-webchat").style.display = "none";
      } else {
        widgetIcons?.forEach((div) => {
          div?.classList?.add("show");
        });
        widgetBtn.classList.add("is-closed");
      }
    };

    widgetBtn.addEventListener("click", handleWidgetBtnClick);
    // for mobile use --- end
  };

  const bindWidgetContent = (channel, url = "") => {
    if (channel === channelTypes.webchat) {
      const webChatButton = document.createElement("button");
      webChatButton.id = "sui-webchat-btn";
      webChatButton.className = "widget-btn";

      const iframeContainer = document.createElement("iframe");
      iframeContainer.id = "sui-webchat";
      iframeContainer.src = SEASALT_BOT_URL;

      const handleClick = () => {
        const widgetIcons = selectAll(".widget-btn");

        if (iframeContainer.src !== SEASALT_BOT_URL) {
          iframeContainer.src = SEASALT_BOT_URL;
        }
        if (iframeContainer.style.display !== "block") {
          iframeContainer.style.display = "block";
          widgetIcons?.forEach((div) => {
            div?.classList?.add("show-iframe");
          });
        } else {
          iframeContainer.style.display = "none";
          widgetIcons?.forEach((div) => {
            div?.classList?.remove("show-iframe");
          });
        }
      };
      webChatButton.addEventListener("click", handleClick);

      widgetContainer.prepend(iframeContainer);
      widgetContainer.prepend(webChatButton);

      // for bubble message
      const tooltipElement = document.querySelector('#sui-widget-tooltip');
      const handleTooltipClose = () => {
        tooltipElement.style.display = 'none';
      }
      const tooltipCloseButton = document.querySelector('#sui-widget-tooltip-close');
      tooltipCloseButton.addEventListener('click', handleTooltipClose);

      tooltipElement.style.display = 'block';
      const handleAutoCloseTooltip = () => {
          const closeMilliseconds =
            Number(30) * 1000;
          setTimeout(() => {
            handleTooltipClose();
          }, closeMilliseconds);
      }      
      handleAutoCloseTooltip()

    } else if (channel === channelTypes.voice) {
      const callButton = document.createElement("a");
      callButton.id = "sui-voice-btn";
      callButton.className = "widget-btn";

      const callFormIframeContainer = document.createElement("iframe");
      callFormIframeContainer.id = "sui-call-form";

      const handleClick = () => {
        const widgetIcons = Array.from(
          document.querySelectorAll(".widget-btn")
        ).filter((btn) => btn.id !== callButton.id);
        const webChatButton = select("#sui-webchat-btn");
        if (
          callFormIframeContainer.src !==
          "https://docs.google.com/forms/d/e/1FAIpQLSe1Z3Yq1u4w-eMZvCYdLoexkFRiJNirN7Ksr6I_et15DJBobA/viewform"
        ) {
          callFormIframeContainer.src =
            "https://docs.google.com/forms/d/e/1FAIpQLSe1Z3Yq1u4w-eMZvCYdLoexkFRiJNirN7Ksr6I_et15DJBobA/viewform";
        }
        if (callFormIframeContainer.style.display !== "block") {
          callFormIframeContainer.style.display = "block";
          widgetIcons?.forEach((div) => {
            div?.classList?.add("show-iframe");
          });
          webChatButton.classList.add("show-call-form");
          callButton.classList.add("show-call-form");
          callFormIframeContainer.classList.add("show-call-form");
        } else {
          callFormIframeContainer.style.display = "none";
          widgetIcons?.forEach((div) => {
            div?.classList?.remove("show-iframe");
          });
          webChatButton.classList.remove("show-call-form");
          callButton.classList.remove("show-call-form");
          callFormIframeContainer.classList.remove("show-call-form");
        }
      };
      callButton.addEventListener("click", handleClick);

      widgetContainer.prepend(callFormIframeContainer);
      widgetContainer.prepend(callButton);
    } else {
      const widgetButton = document.createElement("a");
      widgetButton.id = `sui-${channel}-btn`;
      widgetButton.className = "widget-btn";
      widgetButton.href = url;
      widgetButton.rel = "noopener noreferrer";
      widgetButton.target = "_blank";

      widgetContainer.prepend(widgetButton);
    }
  };

  return { init, channelTypes };
})();
