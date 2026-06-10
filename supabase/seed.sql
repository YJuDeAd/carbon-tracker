-- Seed standard IPCC AR6 and EPA emission factors

INSERT INTO public.emission_factors (category, activity_type, co2e_per_unit, unit, source) VALUES
-- Food
('Food', 'Beef', 27.0, 'kg', 'IPCC AR6'),
('Food', 'Poultry', 6.9, 'kg', 'IPCC AR6'),
('Food', 'Pork', 7.6, 'kg', 'IPCC AR6'),
('Food', 'Fish', 3.0, 'kg', 'IPCC AR6'),
('Food', 'Dairy', 2.8, 'kg', 'IPCC AR6'),
('Food', 'Plant-based Meal', 2.0, 'kg', 'IPCC AR6'),

-- Transport
('Transport', 'Petrol Car', 0.19, 'km', 'EPA'),
('Transport', 'Diesel Car', 0.17, 'km', 'EPA'),
('Transport', 'Electric Car', 0.05, 'km', 'EPA'),
('Transport', 'Hybrid Car', 0.11, 'km', 'EPA'),
('Transport', 'Bus', 0.10, 'km', 'EPA'),
('Transport', 'Train', 0.04, 'km', 'EPA'),
('Transport', 'Bicycle/Walking', 0.0, 'km', 'EPA'),

-- Energy
('Energy', 'Grid Electricity', 0.38, 'kWh', 'EPA'),
('Energy', 'Natural Gas', 0.20, 'kWh', 'EPA'),
('Energy', 'Heating Oil', 0.26, 'kWh', 'EPA'),
('Energy', 'Renewable Energy', 0.0, 'kWh', 'EPA'),

-- Shopping
('Shopping', 'Clothing Item', 15.0, 'item', 'IPCC AR6'),
('Shopping', 'Electronics', 50.0, 'item', 'IPCC AR6'),
('Shopping', 'Furniture', 45.0, 'item', 'IPCC AR6'),

-- Travel
('Travel', 'Short-haul Flight', 0.15, 'km', 'EPA'),
('Travel', 'Long-haul Flight', 0.11, 'km', 'EPA'),
('Travel', 'Hotel Stay', 12.0, 'night', 'EPA');
