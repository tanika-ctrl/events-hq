#!/usr/bin/env python3
"""Extract April 2026 data from MSB sheet in Subsurface Timesheet"""

import pandas as pd

file_path = 'Subsurface Timesheet Vs009cw.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    print("=== SHEET NAMES ===")
    print(xl.sheet_names)
    print()

    df = pd.read_excel(file_path, sheet_name='MSB')
    print("=== MSB SHEET INFO ===")
    print(f"Dimensions: {df.shape[0]} rows x {df.shape[1]} columns")
    print(f"\nColumn names:")
    for i, col in enumerate(df.columns, 1):
        print(f"  {i}. {col}")

    print("\n=== SAMPLE DATA (first 5 rows) ===")
    print(df.head().to_string())

    print("\n=== MONTH/YEAR VALUES ===")
    print(df['Month/Year'].dropna().unique())

    print("\n=== FILTERING FOR APRIL 2026 ===")
    april_mask = df['Month/Year'].astype(str).str.contains('April 2026|Apr 2026|2026-04|04-2026', case=False, na=False)
    april_data = df[april_mask]

    print(f"Found {len(april_data)} rows for April 2026\n")

    if len(april_data) > 0:
        target_cols = ['Date', 'Month/Year', 'Client', 'Type of Work', 'Description', 'Initials', 'Tier', 'Hours Spent']
        available_cols = [col for col in target_cols if col in df.columns]

        print("=== APRIL 2026 DATA ===")
        print(april_data[available_cols].to_string())

        print("\n=== EXPORT TO CSV ===")
        april_data[available_cols].to_csv('April_2026_MSB_Data.csv', index=False)
        print("Saved to: April_2026_MSB_Data.csv")
    else:
        print("No April 2026 entries found.")
        print("\nAll Month/Year values in sheet:")
        print(df['Month/Year'].value_counts())

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
