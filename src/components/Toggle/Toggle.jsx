import "./Toggle.css";

/**
 * Toggle Switch between coin types
 */
export const Toggle = ({ value = "GC", onChange, disabled = false, coinCImage = "/coinGC.png", coinSImage = "/coinSC.png" }) => {
    const handleToggle = () => {
        if (disabled || !onChange) return;
        onChange(value === "GC" ? "SC" : "GC");
    };

    const isGC = value === "GC";
    const coin = isGC ? "gc" : "sc";

    return (
        <div className="toggle-container">
            <button
                type="button"
                className={`toggle-switch toggle-switch--${coin} ${disabled ? "toggle-switch--disabled" : ""}`}
                onClick={handleToggle}
                disabled={disabled}
                aria-label={`Toggle coin type to ${isGC ? "SC" : "GC"}`}
            >
                <div className="toggle-track">
                    <div className={`toggle-active-side toggle-active-side--${coin}`}></div>

                    <div className={`toggle-coin-container toggle-coin-container--${coin}`}>
                        <img src={coinCImage} alt="Coin GC" className={`toggle-coin-icon ${isGC ? "toggle-coin-icon--visible" : "toggle-coin-icon--hidden"}`} />
                        <img src={coinSImage} alt="Coin SC" className={`toggle-coin-icon ${!isGC ? "toggle-coin-icon--visible" : "toggle-coin-icon--hidden"}`} />
                    </div>
                </div>
            </button>
        </div>
    );
};
