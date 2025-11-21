import "./Toggle.css";

/**
 * Toggle Switch between coin types
 */
export const Toggle = ({ value = "C", onChange, disabled = false, coinCImage = "/coinC.png", coinSImage = "/coinS.png" }) => {
    const handleToggle = () => {
        if (disabled || !onChange) return;
        onChange(value === "C" ? "S" : "C");
    };

    const isC = value === "C";
    const coin = isC ? "c" : "s";

    return (
        <div className="toggle-container">
            <button
                type="button"
                className={`toggle-switch toggle-switch--${coin} ${disabled ? "toggle-switch--disabled" : ""}`}
                onClick={handleToggle}
                disabled={disabled}
                aria-label={`Toggle coin type to ${isC ? "S" : "C"}`}
            >
                <div className="toggle-track">
                    <div className={`toggle-active-side toggle-active-side--${coin}`}></div>

                    <div className={`toggle-coin-container toggle-coin-container--${coin}`}>
                        <img
                            src={coinCImage}
                            alt="Coin C"
                            className={`toggle-coin-icon ${isC ? "toggle-coin-icon--visible" : "toggle-coin-icon--hidden"}`}
                            onError={(e) => {
                                e.target.style.display = "none";
                                const fallback = e.target.nextElementSibling;
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                        <span className={`toggle-coin-fallback ${isC ? "toggle-coin-fallback--visible" : ""}`} style={{ display: "none" }}>
                            C
                        </span>

                        <img
                            src={coinSImage}
                            alt="Coin S"
                            className={`toggle-coin-icon ${!isC ? "toggle-coin-icon--visible" : "toggle-coin-icon--hidden"}`}
                            onError={(e) => {
                                e.target.style.display = "none";
                                const fallback = e.target.nextElementSibling;
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                        <span className={`toggle-coin-fallback ${!isC ? "toggle-coin-fallback--visible" : ""}`} style={{ display: "none" }}>
                            S
                        </span>
                    </div>
                </div>
            </button>
        </div>
    );
};
