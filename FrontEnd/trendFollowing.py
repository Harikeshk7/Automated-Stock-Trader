import pandas as pd

TWOHRS = 120
total_capital = 10000
MAX_LINE = 73924

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
            with open('jsonLogFile.txt', 'a') as json_log:
                json_log.write(f'{stock_name} : Bought {numShares} shares at ${buyprice} at {buytime}, Sold {numShares} shares at ${exitprice} at {exittime}\n')
            actions.append({"type":"Bought", "price":buyprice, "shares":numShares, "time":buytime, "stock":stock_name})
            actions.append({"type":"Sold", "price":exitprice, "shares":numShares, "time":exittime, "stock":stock_name})


        else:
            rel_profit.append(0) # None
        line_offset = end_offset[i] + 1
    
    # Update Total Capital
    global total_capital
    total_capital += profit_dollar

    return actions

def find_max():

    line_num = 0
    stock_csv = pd.read_csv('SP_500_Index.csv')
    stockList = stock_csv['Symbol'].tolist()
    for stock in stockList:
        file = open('../test/%s.csv' % (stock))
        num_lines = len(file.readlines())
        line_num = max(num_lines, line_num)    

    return line_num


def macd_action(intraday, i, numShares, stock_name, actions, OwnedStockList):
    profitDollar = 0
    global total_capital
    first_val = intraday.iloc[i].macd_h
    second_val = intraday.iloc[i+1].macd_h
    if ((first_val < 0) and (second_val > 0)):
        #buy
        capital_spent = (second_val - first_val) * 100 + 100
        numShares = capital_spent/intraday.iloc[i+1].Open
        total_capital -= capital_spent
        if stock_name not in OwnedStockList:
            OwnedStockList.append(stock_name)
        actions.append({"type":"Bought", "price":intraday.iloc[i+1].Open, "shares":numShares, "time":intraday.iloc[i+1].Datetime, "stock":stock_name})
        with open('jsonLogFile.txt', 'a') as json_log:
            json_log.write(f'{stock_name} : Bought {numShares} shares at ${intraday.iloc[i+1].Open} at {intraday.iloc[i+1].Datetime}\n')
    elif((intraday.iloc[i].macd_h > 0) and (intraday.iloc[i+1].macd_h < 0) and (numShares != 0)):
        #sell
        profitDollar += ((numShares) * intraday.iloc[i+1].Open) # 
        total_capital += profitDollar
        profitDollar = 0
        if stock_name in OwnedStockList:
            OwnedStockList.remove(stock_name)
        actions.append({"type":"Sold", "price":intraday.iloc[i+1].Open, "shares":numShares, "time":intraday.iloc[i+1].Datetime, "stock":stock_name})
        with open('jsonLogFile.txt', 'a') as json_log:
            json_log.write(f'{stock_name} : Sold {numShares} shares at ${intraday.iloc[i+1].Open} at {intraday.iloc[i+1].Datetime}\n')
        numShares = 0
    return numShares, actions, OwnedStockList

def runAlgorithm(stockList):
    global total_capital
    with open('jsonLogFile.txt', 'w') as json_log:
        json_log.write('')

    OwnedStockList = []
    history = []
    stock_shares = {}
    numShares = 0
    actions = []
    for i in range(35,40):
        for j in stockList:
            file = open(f'test_copy/{j}.csv')
            intraday = pd.read_csv(file)
            if (j not in stock_shares):
                numShares = 0
                stock_shares[j] = 0
            else:
                numShares = stock_shares[j]
            # if statement to choose macd_action() or trendFollowing()
            numShares, actions, OwnedStockList = macd_action(intraday, i, numShares, j, actions, OwnedStockList)
            stock_shares[j] = numShares
            # Do buy/sell action based on macd_h
            if (i + 1 > len(intraday.index) and stock_shares[j] != 0):
                profitDollar += ((stock_shares[j]) * intraday.iloc[i+1].Open) # 
                total_capital += profitDollar
                profitDollar = 0
                actions.append({"type":"Sold", "price":intraday.iloc[i+1].Open, "shares":stock_shares[j], "time":intraday.iloc[i+1].Datetime, "stock":j})
                stockList.remove(j)
                del stock_shares[j]

    for key,value in stock_shares.items():
        file = open(f'test_copy/{key}.csv')
        intraday = pd.read_csv(file)
        if (value != 0):
            total_capital += ((value) * intraday.iloc[i+1].Open) # 
            actions.append({"type":"Sold", "price":intraday.iloc[i+1].Open, "shares":value, "time":intraday.iloc[i+1].Datetime, "stock":key})

    history += actions

    stockJson = {
                "total_capital" : total_capital, 
                "OwnedStockList" : OwnedStockList,
                "history" : history
                         }

    return stockJson