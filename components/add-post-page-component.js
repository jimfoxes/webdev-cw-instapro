import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";


const sanitizeHtml = (value) => {
  return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста

    let imageUrl = "";

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container"></div>
        </div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    let textareaValue = document.querySelector(".textarea").value

    document.getElementById("add-button").addEventListener("click", () => {
      let textareaValue = document.querySelector(".textarea").value
      onAddPostClick({        
        description: sanitizeHtml(textareaValue),
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
