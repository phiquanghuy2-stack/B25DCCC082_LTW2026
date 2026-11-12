const Supports = ({ status, used, onPreview, onInsurance, onHint }) => (
  <div className="supports">
    <span className="supports-label">Quyền trợ giúp:</span>
    <button type="button" disabled={used.preview || status !== 'betting'} onClick={onPreview}>
      Xem trước
    </button>
    <button
      type="button"
      disabled={used.insurance || (status !== 'betting' && status !== 'answering')}
      onClick={onInsurance}
    >
      {used.insurance ? 'Đã bảo hiểm' : 'Bảo hiểm'}
    </button>
    <button type="button" disabled={used.hint || status !== 'answering'} onClick={onHint}>
      Gợi ý
    </button>
  </div>
);

export default Supports;
