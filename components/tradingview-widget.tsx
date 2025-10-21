"use client";

import React, { useEffect, useRef, memo } from "react";

const TradingViewWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";

    // Minified JSON string (TradingView requires this format)
    script.innerHTML =
      '{"symbols":[{"proName":"FOREXCOM:SPXUSD","title":"S&P 500 Index"},{"proName":"FOREXCOM:NSXUSD","title":"US 100 Cash CFD"},{"proName":"FX_IDC:EURUSD","title":"EUR/USD"},{"proName":"BITSTAMP:BTCUSD","title":"Bitcoin"},{"proName":"BITSTAMP:ETHUSD","title":"Ethereum"}],"colorTheme":"dark","isTransparent":true,"displayMode":"adaptive","showSymbolLogo":true,"locale":"en"}';

    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-black py-2 flex justify-center">
      <div
        ref={container}
        className="tradingview-widget-container"
        style={{ width: "100%", height: "48px", backgroundColor: "transparent" }}
      >
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
