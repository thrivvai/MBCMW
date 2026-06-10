-- MathWorld Demo Question Set — 10 financial math questions for live battles.
-- Run this after migrations to have a pre-built set ready for demos.

INSERT INTO question_sets (id, title, grade_band, questions)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Money Moves: The Demo Battle',
  '6-8',
  '[
    {
      "id": "q1",
      "text": "You earn $12 per hour and work 5 hours on Saturday. How much do you make?",
      "type": "multiple_choice",
      "options": ["$48", "$55", "$60", "$72"],
      "correct": "$60",
      "hint": "Multiply your hourly rate by the number of hours worked.",
      "explanation": "$12 × 5 = $60. Always multiply rate × time to find total earnings.",
      "timeLimitSeconds": 15
    },
    {
      "id": "q2",
      "text": "A $80 backpack is on sale for 25% off. What is the sale price?",
      "type": "numeric",
      "correctNumeric": 60,
      "acceptableRange": [59.99, 60.01],
      "hint": "Find 25% of $80, then subtract it from the original price.",
      "explanation": "25% of $80 = $20 off. $80 − $20 = $60.",
      "timeLimitSeconds": 20
    },
    {
      "id": "q3",
      "text": "You have $100. You spend $34.75 at the store. How much is left?",
      "type": "multiple_choice",
      "options": ["$64.25", "$65.25", "$74.25", "$74.75"],
      "correct": "$65.25",
      "hint": "Subtract the amount spent from your starting balance.",
      "explanation": "$100.00 − $34.75 = $65.25. Watch the cents!",
      "timeLimitSeconds": 15
    },
    {
      "id": "q4",
      "text": "You save $35 every week. How many weeks until you have $280?",
      "type": "numeric",
      "correctNumeric": 8,
      "acceptableRange": [7.99, 8.01],
      "hint": "Divide the goal amount by your weekly savings.",
      "explanation": "$280 ÷ $35 = 8 weeks.",
      "timeLimitSeconds": 15
    },
    {
      "id": "q5",
      "text": "Which is the BEST value for your money?",
      "type": "multiple_choice",
      "options": ["3 for $6.00 ($2.00 each)", "5 for $9.50 ($1.90 each)", "8 for $14.40 ($1.80 each)", "12 for $21.00 ($1.75 each)"],
      "correct": "12 for $21.00 ($1.75 each)",
      "hint": "Divide the total price by the number of items to find the unit price.",
      "explanation": "$21 ÷ 12 = $1.75 each — the lowest unit price wins.",
      "timeLimitSeconds": 20
    },
    {
      "id": "q6",
      "text": "You deposit $500 into a savings account earning 4% annual interest. What is your balance after 1 year?",
      "type": "numeric",
      "correctNumeric": 520,
      "acceptableRange": [519.99, 520.01],
      "hint": "Multiply $500 by 4%, then add that to your original deposit.",
      "explanation": "4% of $500 = $20 interest. $500 + $20 = $520.",
      "timeLimitSeconds": 20
    },
    {
      "id": "q7",
      "text": "You make $15 per hour. After 25% taken out for taxes, what is your take-home pay per hour?",
      "type": "multiple_choice",
      "options": ["$10.50", "$11.00", "$11.25", "$12.00"],
      "correct": "$11.25",
      "hint": "If 25% is taken out, you keep 75% of your pay.",
      "explanation": "$15 × 0.75 = $11.25. You keep 75% after a 25% tax.",
      "timeLimitSeconds": 15
    },
    {
      "id": "q8",
      "text": "A $60 restaurant bill is split equally between 4 friends. Each person adds a 15% tip on their share. How much does each person pay total?",
      "type": "numeric",
      "correctNumeric": 17.25,
      "acceptableRange": [17.24, 17.26],
      "hint": "First find each person''s share, then calculate 15% tip on that amount.",
      "explanation": "$60 ÷ 4 = $15 each. Tip = $15 × 15% = $2.25. Total = $15 + $2.25 = $17.25.",
      "timeLimitSeconds": 25
    },
    {
      "id": "q9",
      "text": "You borrow $200 at 10% yearly interest. You pay it all back after exactly 1 year. How much do you pay in total?",
      "type": "multiple_choice",
      "options": ["$210", "$220", "$240", "$200"],
      "correct": "$220",
      "hint": "Calculate the interest (10% of $200), then add it to the amount borrowed.",
      "explanation": "Interest = $200 × 10% = $20. Total = $200 + $20 = $220.",
      "timeLimitSeconds": 15
    },
    {
      "id": "q10",
      "text": "Your monthly income is $1,800. Rent costs $700 and food costs $300. What percent of your income is LEFT after paying just these two expenses?",
      "type": "multiple_choice",
      "options": ["39%", "44%", "50%", "56%"],
      "correct": "44%",
      "hint": "Add up the expenses, subtract from income, then divide by income.",
      "explanation": "$700 + $300 = $1,000 spent. $1,800 − $1,000 = $800 left. $800 ÷ $1,800 ≈ 44%.",
      "timeLimitSeconds": 25
    }
  ]'
);
