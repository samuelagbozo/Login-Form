export default function LightMode({ isLight, onToggle }) {
  return (
    <label className="theme-switch">
      <input
        className="theme-switch__checkbox"
        type="checkbox"
        checked={isLight}
        onChange={onToggle}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      />
      <span className="theme-switch__container" aria-hidden="true">
        <span className="theme-switch__clouds" />
        <span className="theme-switch__stars-container">
          <i />
          <i />
          <i />
        </span>
        <span className="theme-switch__circle-container">
          <span className="theme-switch__sun-moon-container">
            <span className="theme-switch__moon">
              <i className="theme-switch__spot" />
              <i className="theme-switch__spot" />
              <i className="theme-switch__spot" />
            </span>
          </span>
        </span>
      </span>
    </label>
  );
}
