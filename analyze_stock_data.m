% Load new stock data
data = readtable('public/stock_data.csv'); % Make sure this file is updated with new data
dates = datetime(data.Date, 'InputFormat', 'yyyy-MM-dd');
prices = data.Close;

% Calculate daily percentage change
priceChange = diff(prices) ./ prices(1:end-1) * 100;

% Define thresholds for significant changes
threshold = 5; % 5% rise or fall

% Find significant changes
significantChangeIndices = find(abs(priceChange) >= threshold);

% Get pivotal dates and prices
pivotalDates = dates(significantChangeIndices + 1);
pivotalPrices = prices(significantChangeIndices + 1);

% Save pivotal points to a CSV file
pivotalData = table(pivotalDates, pivotalPrices);
writetable(pivotalData, 'public/pivotal_points.csv');

disp('Pivotal Points saved to public/pivotal_points.csv');
