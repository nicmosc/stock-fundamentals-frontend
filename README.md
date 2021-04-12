# Stock Fundamentals Frontend

Link: https://thestocksdepot.com / https://nicmosc.github.io/stock-fundamentals-frontend/

## How are stock values computed?

All data is obtained from Yahoo Finance.

For each stock, we first look at the following:
- Estimated growth rate (5 years)
- EPS
- PE ratio
- Current stock price

The growth rate is either computed from fundamentals (if available) otherwise extracted from the analysis value. Here is the formula for the growth rate:
```
(Net Income - Dividends - Depreciation & Amortization) / (Shareholders' Equity + Long-Term Debt)
```

Once we have all the parameters, we project the estimated EPS over 10 years, using the growth rate.

For example (NETFLIX, 12/04/2021):

**EPS: 6.08**, **GR: 44.43%, PE: 64**

Year 1 | Year	2	| Year 3 | Year	4 | Year 5 | Year	6 | Year 7 | Year 8 | Year	9 | Year	10
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
$6.08 | $8.78	| $12.68	| $18.32	| $26.46	| $38.21	| $55.19	| $79.71	| $115.12	| $166.27

Then we compute the estimated stock price equivalent for the 10 year mark, based on the _current_ PE ratio (this PE ratio is obviously not going to remain the same, but it's a good indication of how much each share should be worth).

With our example above, it would give an estimated share price in 10 years of: `$166.27 x 64 = $10,641.44`

We then provide a "rate of return" value we, as the investor, would like to achieve by investing in this stock over the next 10 years. Let's take 20% as an example. We then work our way back over the 10 years using the given return. In this case it would be (read from right to left)

Year 1 | Year	2	| Year 3 | Year	4 | Year 5 | Year	6 | Year 7 | Year 8 | Year	9 | Year	10
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
$1,003.48 |	$1,304.53 |	$1,695.89 |	$2,204.65 |	$2,866.05 |	$3,725.86 |	$4,843.62 |	$6,296.71 |	$8,185.72 |	$10,641.44

Each year previous year price is divided by the given growth rate: `Year(n - 1) / (1 + GR)`.

We're not done though. We then use the "margin of safety" as a measure of "how certain one is that the stock, at its given price, will achieve the wanted return". A margin of safety of 50% means there's a 50/50 chance the stock will perform well, and this obviously affects the final price as we multiply by this value: `$1,003.48 * 0.5 = $501.74`.

Given that the current price of NFLX is $555.31 the stock is considered slightly overvalued.

Here is the full table for this process:

Key | Value |  | Year 1 | Year	2	| Year 3 | Year	4 | Year 5 | Year	6 | Year 7 | Year 8 | Year	9 | Year	10
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
EPS  ttm |	6.08
Growth Rate |	44.43% |	|	$6.08 | $8.78	| $12.68	| $18.32	| $26.46	| $38.21	| $55.19	| $79.71	| $115.12	| $166.27
Minimum Rate of Return | 	30% | **Est	$1,003.48** |	$1,003.48 |	$1,304.53 |	$1,695.89 |	$2,204.65 |	$2,866.05 |	$3,725.86 |	$4,843.62 |	$6,296.71 |	$8,185.72 |	$10,641.44
Margin of Safety |	50% |	**With safety	$501.74**									
P/E ratio	| 64 |	_Current	$555.31_

## What about the results on the list?
As you adjust the parameters you might notice that the given list of stocks is quite small. This is because of a few reasons:
- We first filter out any stock that does not provide enough data, that is, it's missing any data point required for the calculation above 
- We then filter out any stock that might have weak fundamentals, that is:
   - Growth rate <= 0
   - Profit margins <= 0
   - Current stock price < 5$ (penny stocks)
   - Revenue growth < 10%
- Of all the above, only those stocks whose estimated "fair" price is lower than the current price (i.e. discounted) are shown.

As you change the parameters you might see more or less stocks since the "fair" price varies according to the results you want to see out of your portfolio.

---

Based on this particular method: https://www.youtube.com/watch?v=nX2DcXOrtuo&t=224s&ab_channel=InvestingwithTom
