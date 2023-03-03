import csv
import pandas as pd
import datetime as dt
import os
#DAYS = 93
TWOHRS = 120
total_capital = 25000

def Trend(df, entry, exit, stock_name): # Gets called for each day for all S&P500 stocks, 
    line_offset = 0
    
    # run initial for loop to find all times when day updates, and store line number in list for end of day offsets
    end_offset = []
    compare_date = df.iloc[0].Datetime.split(' ')[0] # comparisson

    for index, row in df.iterrows():
        
        if (df.iloc[index].Datetime.split(' ')[0] != compare_date):
            compare_date = df.iloc[index].Datetime.split(' ')[0]
            end_offset.append(index+1)
                
        #check if date updates
    rel_profit = []
    profit_dollar = 0
    total_shares = 0
    actions = []
    for i in range(len(end_offset)): # Can optimize by not having to loop through every row, instead a static 120 days, and can just skip lines 
        
        #if (df.iloc[index].Datetime.split(' ')[0] != compare_date):
            # date updates, then we increase line offset to current line)) 
        ret_2hrs = df.iloc[TWOHRS + line_offset].Open/df.iloc[line_offset].Open - 1 # Percentage change after 2 hours for every day
        tickret = df.Open.pct_change() 
            
            #buying condition
            
        if ret_2hrs > entry: 
            #buy asset in the next minute
            buyprice = df.iloc[TWOHRS + 1 + line_offset].Open
            buytime = df.iloc[TWOHRS + 1 + line_offset].Datetime

            # get return after asset bought
            cumulated = (tickret.loc[buytime:df.iloc[end_offset[i]].Datetime] + 1).cumprod() - 1 # add offset to buytim:, so that it only checks for the day
            
            exittime = cumulated[(cumulated < -exit) | (cumulated > exit)].first_valid_index() # either bad case of asset dropping by 1%, or good case if asset rises by 1%
            # if asset does not move, sell at the end of the day
            if exittime == None:
                exitprice = df.iloc[end_offset[i]-2].Open
                exittime = df.iloc[end_offset[i]-2].Datetime
            else:
                exitprice = df.loc[exittime + 1].Open

            numShares = 500/buyprice
            total_shares += numShares
            profit_dollar += ((numShares) * exitprice) - 500 # 
            
            rel_profit.append((exitprice - buyprice)/buyprice) # Instead of storing percentage, let's append 500$
            
            # Create Json here of buy/sell action for a single day 
            #json_log.write(f'{stock_name} : Bought {numShares} at {buyprice} at {buytime}, Sold {numShares} at {exitprice} at {exittime}')
            with open('jsonLogFile.txt', 'a') as json_log:
                json_log.write(f'{stock_name} : Bought {numShares} shares at ${buyprice} at {buytime}, Sold {numShares} shares at ${exitprice} at {exittime}\n')
            actions.append(['Buy', buyprice, numShares, buytime])
            actions.append(['Sell', exitprice, numShares, exittime])


        else:
            rel_profit.append(0) # None
        line_offset = end_offset[i] + 1
    
    # print(f'Total profits from {stock_name} : {profit_dollar}, {sum(rel_profit)}')
    # Create json for each stock 
    stockJson = {}
    OwnedStockList = []
    global total_capital
    total_capital += profit_dollar
    if stock_name not in stockJson:
        #stockJson = {f'{stock_name}' : {'total_shares' : f'{total_shares}', 'profit_dollar' : f'{profit_dollar}'}, 'history' : f'{actions}', 'OwnedStocksList' : f'{OwnedStocksList}'} 
        stockJson = {
                    "total_capital" : total_capital, 
                    "OwnedStockList" : OwnedStockList,
                    "history" : {stock_name : {"actions" : actions}}
                    }
                    
        

    #print(stockJson)
    return stockJson

def main_trendFollowing(stockList):
    JsonList = []

    with open('jsonLogFile.txt', 'w') as json_log:
        json_log.write('')

    #stock_csv = pd.read_csv('Stocks in the SP 500 Index.csv')
    #stock = stock_csv['Symbol'].tolist()

    # file = open('../test/XOM.csv')
    # intraday = pd.read_csv(file)
    # stockJson = Trend(intraday, 0.02, 0.01, 'XOM')
    for j in stockList:
        file = open('../test/%s.csv' % (j))
        intraday = pd.read_csv(file)
        stockJson = Trend(intraday, 0.02, 0.01, j)
        JsonList.append(stockJson)
    
    return JsonList

# if __name__ == "__main__":
#     main_trendFollowing()

        

