#!/usr/bin/env python3
"""
Mr. Marsh Test Delay Predictor
A fun predictor to guess if Mr. Marsh will delay the test, inspired by snow day predictors.
"""

import random
import datetime

def predict_test_delay():
    """
    Predicts if Mr. Marsh will delay the test based on various factors.
    """
    today = datetime.date.today()
    day_of_week = today.weekday()  # 0=Monday, 6=Sunday

    # Factors that might influence the prediction
    factors = {
        'weekday': day_of_week < 5,  # More likely on weekdays
        'random_chance': random.random() > 0.7,  # 30% base chance
        'moon_phase': random.choice([True, False]),  # Random moon phase effect
        'coffee_level': random.randint(1, 10) > 5,  # If coffee is low, maybe delay
    }

    # Calculate probability
    probability = sum(factors.values()) / len(factors)

    # Decision
    will_delay = probability > 0.5 or random.random() < 0.3  # Add some randomness

    return will_delay, probability

def main():
    print("🌨️ Mr. Marsh Test Delay Predictor ❄️")
    print("=" * 40)

    will_delay, prob = predict_test_delay()

    if will_delay:
        print("🎉 Good news! Mr. Marsh is likely to delay the test!")
        print("📚 Use this extra time to study... or relax!")
    else:
        print("📝 Bad news! The test is probably happening as scheduled.")
        print("🧠 Better hit the books!")

    print(f"Probability of delay: {prob:.2f}")
    print("\nRemember, this is just for fun! Always check official announcements.")

if __name__ == "__main__":
    main()