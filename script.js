//////////////////////////////////////////////////
// Список заметок для инициализации

let initialNotes = [
    {
      title: "Купить продукты",
      text: "Список продуктов...",
    },
    {
      title: "Заказать фильтры",
      text: "Воздушный фильтр салона, воздушный фильтр двигателя, масляный фильтр",
    },
    {
      title: "Помыть машину",
      text: "Записаться на мойку, номер телефона 77-77-77",
    }
];

///////////////////////////////////////////////////
// Функции для открытия и закрытия модального окна

function openModal(element) {

    setTimeout(() => {
      element.classList.add('popup_is-opened');
    }, 50);
    document.addEventListener('keydown', handleEscape);
    element.addEventListener('click', handleOverlay);
  
}
  
function closeModal(element) {

    element.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
    element.removeEventListener('click', handleOverlay);

}
  
function handleEscape(event) {
  
    if (event.key === "Escape") {
      closeModal(document.querySelector('.popup_is-opened'));
    }
  
}
  
function handleOverlay(event) {
  
    if (event.target.classList.contains('popup')) {
      closeModal(event.currentTarget);
    }
  
}

//////////////////////////////////////////////////////////////

const addButton = document.querySelector('.add_button');
const notePopup = document.querySelector('.popup');
const titleInput = notePopup.querySelector('.popup__input_type_title');
const textInput = notePopup.querySelector('.popup__input_type_text');
const closeButton = document.querySelector('.popup__close-button');
const notesContainer = document.querySelector('.notes-list');
const formElement = document.forms.editnote;

addButton.addEventListener('click', () => openModal(notePopup));
closeButton.addEventListener('click', () => closeModal(notePopup));

function createNoteElement(noteTitle, noteText) {

    const noteTemplate = document.querySelector('#note-template').content;
    const noteElement = noteTemplate.querySelector('.note').cloneNode(true);
    const deleteNoteButton = noteElement.querySelector('.note__delete-button');
    const editNoteButton = noteElement.querySelector('.note__edit-button');
  
    noteElement.querySelector('.note__title').textContent = noteTitle;
    noteElement.querySelector('.note__text').textContent = noteText;
  
    deleteNoteButton.addEventListener('click', () => deleteNote(noteElement));
    editNoteButton.addEventListener('click', () => editNote(noteElement));

    return noteElement;

}

function deleteNote(noteElement) {

    noteElement.remove();
    saveNotes();

}

function createNote(noteTitle, noteText) {

    const noteElement = createNoteElement(noteTitle, noteText);
    notesContainer.prepend(noteElement);
    saveNotes();

}

function createNotes(notes) {

    notes.forEach(note => {
        const noteElement = createNoteElement(note.title, note.text);
        notesContainer.append(noteElement);
    });

}

function handleNewNoteSubmit(event) {

    event.preventDefault();
    createNote(titleInput.value, textInput.value);
    closeModal(notePopup);
    formElement.reset();

}

formElement.addEventListener('submit', handleNewNoteSubmit);

function saveNotes() {
  const notes = Array.from(notesContainer.querySelectorAll('.note')).map(note => ({
    title: note.querySelector('.note__title').textContent,
    text: note.querySelector('.note__text').textContent
  }));
  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem('notes');
  return savedNotes ? JSON.parse(savedNotes) : createNotes(initialNotes);
}

function editNote(noteElement) {
  titleInput.value = noteElement.querySelector('.note__title').textContent;
  textInput.value = noteElement.querySelector('.note__text').textContent;
  openModal(notePopup);

  formElement.removeEventListener('submit', handleNewNoteSubmit);
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    noteElement.querySelector('.note__title').textContent = titleInput.value;
    noteElement.querySelector('.note__text').textContent = textInput.value;
    saveNotes();
    closeModal(notePopup);
    formElement.reset();
  });
}

function init () {
    const notes = loadNotes();
    createNotes(notes);
}

init ();