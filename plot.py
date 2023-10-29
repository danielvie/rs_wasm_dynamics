import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file
df = pd.read_csv('output.csv')

# Extract t and x1 columns
t = df['t']
x1 = df['x1']
x2 = df['x2']

# Create a plot
plt.figure(figsize=(10, 6))
plt.plot(t, x1, label='x1')
plt.plot(t, x2, label='x2')
plt.xlabel('t')
plt.ylabel('x1')
plt.title('Plot of x1 vs t')
plt.legend()
plt.grid(True)

# Show the plot
plt.show()