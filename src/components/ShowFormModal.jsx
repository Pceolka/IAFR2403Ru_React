import ShowForm from './ShowForm.jsx';

// Окно с формой; по клику на фон не закрывается, чтобы не потерять введённые данные
function ShowFormModal({ show, genreOptions, onSubmit, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal modal--form" role="dialog" aria-modal="true" aria-labelledby="show-form-title">
        <button type="button" className="modal__close" aria-label="Закрыть форму" onClick={onClose}>
          ×
        </button>
        <ShowForm
          initialShow={show}
          genreOptions={genreOptions}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default ShowFormModal;
