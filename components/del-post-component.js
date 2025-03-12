import { delPost } from "../api";
import { getToken, setPostsList, page } from "../index.js";

export const initDelListeners = () => {
  const menuButtons = document.querySelectorAll(".menu-button");
  const delButtons = document.querySelectorAll(".del-button");

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menu = button.nextElementSibling;
      menu.classList.toggle("hidden"); // Показываем/скрываем меню
    });
  });

  // Дополнительно: Закрыть меню при клике вне его
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-container")) {
      document.querySelectorAll(".menu").forEach((menu) => {
        menu.classList.add("hidden");
      });
    }
  });

  

  delButtons.forEach((delButton) => {
    const postId = delButton.dataset.postId;
    delButton.addEventListener("click", () => {
      delPost({ postID: postId, token: getToken() })
        .then(() =>
          getPosts({token: getToken(), ...(page === "user-posts" && { userid: pageUserId }),  })
        )
        .then((newPosts) => {
          setPostsList(newPosts);
          renderPostsPageComponent({
            appEl,
            ...(page === "user-posts" && { userPage: true }),
          });
        })
        .catch((error) => console.error("Ошибка при удалении:", error));
    });
  });
};
