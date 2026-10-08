const FilterBar = ({ filters, current, onChange }) => (
  <div className="filter-bar">
    <span>Lọc:</span>
    {Object.entries(filters).map(([key, { label }]) => (
      <button
        key={key}
        className={`filter-btn ${current === key ? 'active' : ''}`}
        onClick={() => onChange(key)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default FilterBar;
