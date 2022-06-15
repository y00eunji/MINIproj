(function () {
  "use strict";

  const get = function (target) {
    return document.querySelector(target);
  };

  let currentPage = 1; //첫번째 페이지부터니깐 1이고 다음 페이지 가지고오게 되면 점점 증가함
  let total = 10; //현재 페이지가 담을 수 있는 수 (기본값이고 밑에서 데이터 불러올때마다 늘림 )
  const limit = 10;
  const end = 100; // 데이터의 총갯수

  const $posts = get(".posts");
  const $loader = get(".loader");

  /* 로딩이미지 */
  const hideLoader = () => {
    $loader.classList.remove("show");
  };

  const showLoader = () => {
    $loader.classList.add("show");
  };

  const showPosts = (posts) => {
    posts.forEach((post) => {
      // post div를 하나 만들어줄 거임
      const $post = document.createElement("div");
      $post.classList.add("post");
      $post.innerHTML = `
          <div class="header">
            <div class="id">${post.id}.</div>
            <div class="title">${post.title}</div>
          </div>
          <div class="body">${post.body}</div>
      `;
      $posts.appendChild($post);
    });
  };

  //데이터 가져오기
  const getPosts = async (page, limit) => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`; // limit을 10로 잡아줌
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("에러가 발생했습니다.");
    }
    return await response.json();
  };

  //데이터 표시해주기
  const loadPosts = async (page, limit) => {
    showLoader(); // 로딩 엘레먼트 보여줌
    try {
      const response = await getPosts(page, limit);
      showPosts(response);
    } catch (error) {
      console.error(error.message);
    } finally {
      hideLoader(); // 로딩 엘레먼트 숨기기
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (total === end) {
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      //데이터를 불러올 때 겹치면 안되니깐 5px은 빼줌
      currentPage++;
      total += 10;
      loadPosts(currentPage, limit);
      return;
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    loadPosts(currentPage, limit);
    window.addEventListener("scroll", handleScroll); // scroll할때 handleScroll함수 발생
  });
})();
