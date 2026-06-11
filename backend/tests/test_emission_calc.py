import pytest
from hypothesis import given, strategies as st
from services.emission_calc import calculate_emission

# 1. Unit Tests (Known Input/Output)
def test_emission_calc_transport():
    # Car commute: 10 miles * 0.4 kg/mile
    assert calculate_emission(10.0, 0.4) == 4.0

def test_emission_calc_food():
    # Beef meal: 1 serving * 3.5 kg/serving
    assert calculate_emission(1.0, 3.5) == 3.5

def test_emission_calc_energy():
    # Grid Electricity: 50 kWh * 0.4 kg/kWh
    assert calculate_emission(50.0, 0.4) == 20.0

def test_emission_calc_shopping():
    # Fast Fashion: 2 items * 5.0 kg/item
    assert calculate_emission(2.0, 5.0) == 10.0

def test_emission_calc_travel():
    # Flight: 1000 miles * 0.2 kg/mile
    assert calculate_emission(1000.0, 0.2) == 200.0

# 2. Property-Based Tests
@given(
    st.floats(min_value=-1000.0, max_value=1000.0, allow_nan=False, allow_infinity=False),
    st.floats(min_value=-10.0, max_value=10.0, allow_nan=False, allow_infinity=False)
)
def test_emission_never_negative(quantity, factor):
    result = calculate_emission(quantity, factor)
    assert isinstance(result, float)
    assert result >= 0.0

@given(st.floats(min_value=-1000.0, max_value=-0.1))
def test_negative_quantity_returns_zero(quantity):
    assert calculate_emission(quantity, 1.0) == 0.0

@given(st.floats(min_value=-10.0, max_value=-0.1))
def test_negative_factor_returns_zero(factor):
    assert calculate_emission(1.0, factor) == 0.0
