import pandas as pd

def main():
    stock_csv = pd.read_csv('SP_500_Index.csv')
    stockList = stock_csv['Symbol'].tolist()
    for j in stockList:
        file = open('../test_copy/%s.csv' % (j))
        intraday = pd.read_csv(file)
        k = intraday['Close'].ewm(span=12, adjust=False, min_periods=12).mean()
        d = intraday['Close'].ewm(span=26, adjust=False, min_periods=26).mean()
        macd = k - d
        macd_s = macd.ewm(span=9, adjust=False, min_periods=9).mean()
        macd_h = macd - macd_s
        intraday['macd'] = intraday.index.map(macd)
        intraday['macd_h'] = intraday.index.map(macd_h)
        intraday['macd_s'] = intraday.index.map(macd_s)
        pd.set_option("display.max_columns", None)     
        intraday.to_csv('../test_copy/%s.csv' % (j), index=False) # add script in BackEnd folder that when run, will add macd signals to all csv files 

if __name__ == "__main__":
    main()