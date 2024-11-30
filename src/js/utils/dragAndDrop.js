/**
 * Добавляет обработчики событий для перетаскивания и сброса элементов.(Drag-and-drop)
 *
 * @param {HTMLElement} container - Контейнер, содержащий элементы для перетаскивания.
 * @param {function} dragStart - Функция, вызываемая при начале перетаскивания.
 * @param {function} dragOver - Функция, вызываемая при наведении на элемент во время перетаскивания.
 * @param {function} drop - Функция, вызываемая при сбросе элемента.
 * @param {function} dragEnd - Функция, вызываемая при завершении перетаскивания.
 */

export function addDragAndDropHandlers(container, dragStart, dragOver, drop, dragEnd) {
  const blocks = container.querySelectorAll("[draggable=true]");

  blocks.forEach((block) => {
    block.addEventListener("dragstart", (event) => dragStart(event, block));
    block.addEventListener("dragover", (event) => dragOver(event));
    block.addEventListener("drop", (event) => drop(event));
    block.addEventListener("dragend", (event) => dragEnd(event, block));
  });
}

/**
 * Обрабатывает событие начала перетаскивания.
 *
 * @param {DragEvent} event - Событие перетаскивания.
 * @param {HTMLElement} block - Элемент, который перетаскивается.
 */
export function dragStart(event, block) {
  event.dataTransfer.setData("text/plain", block.id);
  block.classList.add("drop--dragging");
  block.parentNode.classList.add("drop");
  const allBlocks = block.parentNode.querySelectorAll("[draggable=true]");
  allBlocks.forEach((b) => {
    if (b !== block) {
      b.classList.add("drop--dragging-out");
    }
  });
}

/**
 * Обрабатывает событие перетаскивания над элементом.
 *
 * @param {DragEvent} event - Событие перетаскивания.
 */
export function dragOver(event) {
  event.preventDefault();
  const targetBlock = event.target.closest("[draggable=true]");
  if (!targetBlock) return;
  const allBlocks = targetBlock.parentNode.querySelectorAll("[draggable=true]");
  allBlocks.forEach((b) => b.classList.remove("drop--dragging-over"));
  targetBlock.classList.add("drop--dragging-over");
}

/**
 * Обрабатывает событие сброса элемента.
 *
 * @param {DragEvent} event - Событие сброса.
 */
export function drop(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedId);

  if (draggedElement) {
    const targetBlock = event.target.closest("[draggable=true]");
    const parent = targetBlock ? targetBlock.parentNode : null;

    if (parent && draggedElement !== targetBlock) {
      const allBlocks = parent.querySelectorAll("[draggable=true]");
      allBlocks.forEach((b) => b.classList.remove("drop--dragging-over"));
      parent.removeChild(draggedElement);
      parent.append(draggedElement, targetBlock);
    }
  }
}

/**
 * Обрабатывает событие завершения перетаскивания.
 *
 * @param {DragEvent} event - Событие завершения перетаскивания.
 * @param {HTMLElement} block - Элемент, который был перетаскиваемым.
 */
export function dragEnd(event, block) {
  event.preventDefault();
  block.classList.remove("drop--dragging");
  block.parentNode.classList.remove("drop");
  block.classList.remove("drop--dragging-over");
  const allBlocks = block.parentNode.querySelectorAll("[draggable=true]");
  allBlocks.forEach((b) => {
    b.classList.remove("drop--dragging-out");
    b.classList.remove("drop--dragging-over");
  });
}
