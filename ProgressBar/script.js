(function () {
  "use strict";

  let timerId;

  const get = (target) => {
    return document.querySelector(target);
  };

  const $progressBar = get(".progress-bar");

  const throttle = (callback, time) => {
    if (timerId) return;
    timerId = setTimeout(() => {
      callback();
      timerId = undefined;
    }, time);
  };

  //영역을 계산해서 보여줘야함
  //스크롤 전체 높이 -  보여지는 영역
  //스크롤 위치에 따라서 %로 계산되어야함
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollWidth = (scrollTop / height) * 100;
    $progressBar.style.width = scrollWidth + "%";
  };

  window.addEventListener("scroll", () => {
    throttle(onScroll, 100);
  });
})();
