import quantstats as qs
import pandas as _pd
import numpy as _np
import yfinance as _yf
import os
from datetime import date


def download_returns(ticker, period="max"):
    if isinstance(period, _pd.DatetimeIndex):
        p = {"start": period[0]}
    else:
        p = {"period": period}
    return _yf.Ticker(ticker).history(**p)["Close"].pct_change()


# extend pandas functionality with metrics, etc.
qs.extend_pandas()

# fetch the daily returns for a stock
stock = qs.utils.download_returns("FB")

# show sharpe ratio
print(qs.stats.sharpe(stock))
# or using extend_pandas() :)
stock.sharpe()

sh = qs.plots.snapshot(
    stock,
    title="Facebook Performance",
    savefig={"fname": os.path.join("static", "Facebook-Performance.png")},
)


# save static/
qs.reports.html(
    stock,
    benchmark="^KS11",
    output=True,
    download_filename=f"static/qs-report-{date.today().isoformat()}.html",
)
