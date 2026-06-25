import pandas as pd
import sys

file_path = '/Users/tanikafacey/Desktop/Cowork/Subsurface Timesheet Vs009cw.xlsx'

xl = pd.ExcelFile(file_path)
print(f"Sheets: {xl.sheet_names}\n")

df = pd.read_excel(file_path, sheet_name='MSB')
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}\n")

print("Sample data (first 5 rows):")
print(df.head().to_string())

print("\n\nMonth/Year column unique values:")
print(df['Month/Year'].unique())

print("\n\nFiltering for April 2026...")
april_2026 = df[df['Month/Year'].astype(str).str.contains('April 2026|Apr 2026|2026-04|04-2026', case=False, na=False)]
print(f"Found {len(april_2026)} rows for April 2026")

if len(april_2026) > 0:
    target_cols = ['Date', 'Month/Year', 'Client', 'Type of Work', 'Description', 'Initials', 'Tier', 'Hours Spent']
    available_cols = [col for col in target_cols if col in april_2026.columns]
    print(f"\nAvailable target columns: {available_cols}")
    print(f"\nApril 2026 Data:\n")
    print(april_2026[available_cols].to_string())
else:
    print("No April 2026 entries found. Let me check all unique Month/Year values:")
    print(df['Month/Year'].value_counts())
