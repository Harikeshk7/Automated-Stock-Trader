import csv
import pandas as pd
import datetime as dt
import os
#DAYS = 93
TWOHRS = 120
total_capital = 1000

def Trend(df, entry, exit, stock_name): # Gets called for each day for all S&P500 stocks, 
    line_offset = 0
    
    # run initial for loop to find all times when day updates, and store line number in list for end of day offsets
    end_offset = []
    compare_date = df.iloc[0].Datetime.split(' ')[0] # comparisson
    for index, row in df.iterrows():
        
        if (df.iloc[index].Datetime.split(' ')[0] != compare_date):
            if ((index + 1 < len(df)) and (df.iloc[index].Timestamp - df.iloc[index-1].Timestamp) > 3600):
                compare_date = df.iloc[index+1].Datetime.split(' ')[0]
                end_offset.append(index+1)
        
        #check if date updates
    rel_profit = []
    profit_dollar = 0
    total_shares = 0
    actions = []
    for i in range(len(end_offset)): # Can optimize by not having to loop through every row, instead a static 120 days, and can just skip lines 
        
        ret_2hrs = df.iloc[TWOHRS + line_offset - 2].Open/df.iloc[line_offset - 2].Open - 1 # Percentage change after 2 hours for every day
        tickret = df.Open.pct_change() 
            
            #buying condition
        if ret_2hrs > entry: 
            #buy asset in the next minute
            buyprice = df.iloc[TWOHRS + line_offset -1].Open
            buytime = df.iloc[TWOHRS + line_offset - 1].Datetime

            # get return after asset bought
            cumulated = (tickret.iloc[TWOHRS + line_offset -1:end_offset[i]-2] + 1).cumprod() - 1 # add offset to buytim:, so that it only checks for the day
            exittime = cumulated[(cumulated < -exit) | (cumulated > exit)].first_valid_index() # either bad case of asset dropping by 1%, or good case if asset rises by 1%
            # if asset does not move, sell at the end of the day
            if exittime == None:
                exitprice = df.iloc[end_offset[i]-2].Open
                exittime = df.iloc[end_offset[i]-2].Datetime
            else:
                exitprice = df.iloc[exittime - 1].Open
                exittime = df.iloc[exittime - 1].Datetime

            numShares = 500/buyprice
            total_shares += numShares
            profit_dollar += ((numShares) * exitprice) - 500 # 
            
            rel_profit.append((exitprice - buyprice)/buyprice) # Instead of storing percentage, let's append 500$
            
            # Create Json here of buy/sell action for a single day 
            #json_log.write(f'{stock_name} : Bought {numShares} at {buyprice} at {buytime}, Sold {numShares} at {exitprice} at {exittime}')
            with open('jsonLogFile.txt', 'a') as json_log:
                json_log.write(f'{stock_name} : Bought {numShares} shares at ${buyprice} at {buytime}, Sold {numShares} shares at ${exitprice} at {exittime}\n')
            actions.append({"type":'Bought', "price":buyprice, "shares":numShares, "time":buytime, "stock":stock_name})
            actions.append({"type":'Sold', "price":exitprice, "shares":numShares, "time":exittime, "stock":stock_name})


        else:
            rel_profit.append(0) # None
        line_offset = end_offset[i] + 1
    
    # Update Total Capital
    global total_capital
    total_capital += profit_dollar

    #print(f'Total profits from {stock_name} : {profit_dollar}, {sum(rel_profit)}, {total_capital}')
    return actions

def main_trendFollowing(stockList):

    with open('jsonLogFile.txt', 'w') as json_log:
        json_log.write('')

    # stock_csv = pd.read_csv('SP_500_Index.csv')
    # stockList = stock_csv['Symbol'].tolist()

    # file = open('../test/XOM.csv')
    # intraday = pd.read_csv(file)
    # stockJson = Trend(intraday, 0.02, 0.01, 'XOM')
    history = []
    OwnedStockList = []
    for j in stockList:
        # Automated-Stock-Trader\test
        print(type(j))
        # file = open(f'Automated-Stock-Trader/test/{j}.csv' )
        file = open(f'test/{j}.csv')
        # Accessing the db
        intraday = pd.read_csv(file)
        actions = Trend(intraday, 0.02, 0.01, j)
        history += actions
    stockJson = {
                "total_capital" : total_capital, 
                "OwnedStockList" : OwnedStockList,
                "history" : history
            }
    return stockJson

# if __name__ == "__main__":
#     main()

        

