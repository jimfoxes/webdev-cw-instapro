import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { initLikeListeners, renderLikesText } from "./like-posts-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { initDelListeners } from "./del-post-component.js";


let userId = () => { 
  if (user) {
    
    return user._id;
  }
}

export function renderPostsPageComponent({ appEl, userPage }) {

  console.log("Актуальный список постов:", posts);

  const postsHtml = posts
    .map((post) => {
      const likesText = renderLikesText(post.likes);
      const isLiked = post.isLiked;
      
      return `<li class="post">
                  <div class="post-header" data-user-id="${post.user.id}" ${userPage ? 'style="display: none"' : ''}>
                      <img src="${post.user.imageUrl}" class="post-header__user-image">
                      <p class="post-header__user-name">${post.user.name}</p>
                  </div>
                  <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                  </div>
                  <div class="post-bottom">
                    <div class="post-likes">
                        <button data-post-id="${post.id}" data-isliked = "${isLiked ? 'yes' : 'no' }" class="like-button">
                            <img src="./assets/images/${isLiked ? 'like-active.svg' : 'like-not-active.svg' }">
                        </button>
                        <p class="post-likes-text">
                            Нравится: <strong>${likesText}</strong>
                        </p>
                    </div>
                      <div class="menu-container" ${ (userId() === post.user.id && userPage) ? '' : 'style="display: none"'}>
                        <button class="menu-button">...</button>
                        <div class="menu hidden">
                          <button data-post-id="${post.id}" class="menu-item del-button">Удалить</button>
                        </div>
                      </div>
                  </div>
                      <p class="post-text">
                          <span class="user-name">${post.user.name}</span>
                          ${post.description}
                      </p>
                      <p class="post-date">
                      ${formatDistanceToNow(post.createdAt, {locale: ru})} назад
                      </p>
              </li>`
    })
    .join("")
  
  const postsUserHeader = `<div class="posts-user-header">
                  <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
                  <p class="posts-user-header__user-name">${posts[0].user.name}</p>
                  </div>
  `


  const appHtml = `
                  <div class="page-container">
                      <div class="header-container"></div>
                      ${userPage ? postsUserHeader : ""}
                      <ul class="posts">
                      ${postsHtml}
                      </ul>
                      <br>
                  </div>    
  `

  appEl.innerHTML = appHtml;
  

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const pageUserId = posts[0].user.id  

  initLikeListeners(renderPostsPageComponent, userPage ? pageUserId : undefined);
  initDelListeners(renderPostsPageComponent, userPage ? pageUserId : undefined)

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
