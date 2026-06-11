def calculate_emission(quantity: float, co2e_per_unit: float) -> float:
    """
    Calculates the total CO2e footprint for an activity.
    Guarantees that the returned value is always a positive float or 0.0.
    """
    # Reject negative quantities or negative emission factors gracefully
    if quantity < 0 or co2e_per_unit < 0:
        return 0.0
        
    return float(quantity * co2e_per_unit)
