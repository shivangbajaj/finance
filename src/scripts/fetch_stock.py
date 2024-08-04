# src/scripts/fetch_stock.py
import yfinance as yf
import sys
import json

def fetch_stock_data(ticker):
    stock = yf.Ticker(ticker)
    # Fetch data for the last 10 years
    hist = stock.history(period="10y")
    return hist.to_json()

if __name__ == "__main__":
    ticker = sys.argv[1]
    print(fetch_stock_data(ticker))
