import csv
import random
import pandas as pd

pd.options.display.max_columns = 1

df = pd.read_csv('Flashcards.csv')
first_column = df.iloc[:, 0].tolist()
print(random.choice(first_column))
