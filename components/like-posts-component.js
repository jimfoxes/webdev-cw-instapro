import { addLike, disLike, getPosts } from "../api.js";
import { getToken, setPostsList, page, user } from "../index.js";

export const initLikeListeners = (renderPostsPageComponent, pageUserId) => {
  const appEl = document.getElementById("app");


 
  
  const buttons = document.querySelectorAll('.like-button')

  buttons.forEach(button => {
    button.addEventListener("click", (event) => {
    event.stopPropagation();

    const postId = button.dataset.postId;
    const isLiked = button.dataset.isliked === "yes";

    if (user) {
      button.classList.add("like-Loading");
    }

    (isLiked ? disLike : addLike)({ postID: postId, token: getToken() })
      .then(() =>
        getPosts({
          token: getToken(),
          ...(page === "user-posts" && { userid: pageUserId }),
        })
      )
      .then((newPosts) => {
        button.classList.remove("like-Loading");
        setPostsList(newPosts);
        renderPostsPageComponent({
          appEl,
          ...(page === "user-posts" && { userPage: true }),
        });
      })
      .catch((error) => {
        if (error.message === 'Нет авторизации') {
          alert("Пожалуйста авторизуйтесь чтобы поставить лайк");
        }
      });

    });

  });


};

export function renderLikesText(likes) {
  const likesCount = likes.length;

  if (likesCount === 0) {
    return "0";
  } else if (likesCount === 1) {
    return `${likes[0].name}`;
  } else {
    const lastLikeUser = likes[likesCount - 1].name; // Имя последнего пользователя
    const otherLikesCount = likesCount - 1; // Количество остальных лайков
    return `${lastLikeUser} и ещё ${otherLikesCount}`;
  }
}
