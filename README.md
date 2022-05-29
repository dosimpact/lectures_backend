# lectures_backend

```py
from datetime import datetime
import backtrader as bt

# 3일 연속 하락하면, 구매한다.
# 그리고 5번의 클럭뒤에 파는 전략이다.

class TestStrategy(bt.Strategy):
    params = (
        ('exitbars', 5),
    )
    def __init__(self):
        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close
        self.order = None
        self.buyprice = None #
        self.buycomm = None #

    def log(self, txt, dt=None):
        dt = dt or self.datas[0].datetime.date(0)
        # self.datas[0].datetime[0].date 아님.!
        print('%s, %s, %s' % (dt.isoformat(),self.dataclose[0], txt))

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            return
        
        if order.status in [order.Completed]:
            if order.isbuy():
                self.log(
                    'BUY EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                    (order.executed.price,
                     order.executed.value,
                     order.executed.comm))
                self.buyprice = order.executed.price # 체결가?
                self.buycomm = order.executed.comm # commission

            elif order.issell():
                self.log('SELL EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                         (order.executed.price,
                          order.executed.value,
                          order.executed.comm))
            self.bar_executed = len(self)

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log('Order Canceled/Margin/Rejected')
        
        self.order = None
    
    def notify_trade(self, trade):
        if not trade.isclosed:
            return
        self.log('OPERATION PROFIT, GROSS %.2f, NET %.2f' %
                 (trade.pnl, trade.pnlcomm))
    
    def next(self):
        if self.order:
            return
        # Check if we are in the market
        # print("self.position",self.position)
        if not self.position:
            if self.dataclose[0] < self.dataclose[-1]:
                    if self.dataclose[-1] < self.dataclose[-2]:
                        self.log('BUY CREATE, %.2f' % self.dataclose[0])
                        self.order = self.buy()
        else:
            if len(self) >= (self.bar_executed + self.params.exitbars):
                self.log('SELL CREATE, %.2f' % self.dataclose[0])
                self.order = self.sell()


cerebro = bt.Cerebro()  # create a "Cerebro" engine instance

ticker = "QQQ"
df = yf.download(**{
    "tickers":ticker,
    "period":"1mo", # 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
    "interval":"1d", # 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
})
data = bt.feeds.PandasData(dataname = df) # df > bt 파싱
cerebro.adddata(data)  # Add the data feed

cerebro.addstrategy(TestStrategy)  # Add the trading strategy
cerebro.addsizer(bt.sizers.FixedSize, stake=10) # 한번 buy = 10주
cerebro.broker.setcommission(commission=0.001)
cerebro.run()
# cerebro.plot(volume=False, savefig=True, path=prefix_path+'backtrader-plot2.png')
# cerebro.plot()[0][0]
# df.head(20)
print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())
```