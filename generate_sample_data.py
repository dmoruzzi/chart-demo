import random
from pathlib import Path
import json
from datetime import datetime, timedelta
import argparse

def generate_data_for_day(date_str: str, app_names: list, minutes: int = 15):
    start_time = datetime.strptime(date_str, "%Y-%m-%d")
    data = {}
    
    for i in range(0, 24 * (60 // minutes)):  # 24 hours * intervals per hour
        current_time = start_time + timedelta(minutes=minutes * i)
        time_str = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        data[time_str] = {app: random.randint(0, 100) for app in app_names}
    return data

def main():
    parser = argparse.ArgumentParser(description="Generate random data for a date range.")
    parser.add_argument("--start-date", type=str, required=True, help="Start date in YYYY-MM-DD format")
    parser.add_argument("--end-date", type=str, required=True, help="End date in YYYY-MM-DD format")
    parser.add_argument("--output-file", type=str, required=True, help="Path to the output JSON file")
    parser.add_argument("--apps", type=str, required=True, help="Comma-separated list of application names")
    parser.add_argument("--minutes", type=int, default=15, help="Number of minutes per interval")

    args = parser.parse_args()

    start_date = datetime.strptime(args.start_date, "%Y-%m-%d")
    end_date = datetime.strptime(args.end_date, "%Y-%m-%d")
    app_names = args.apps.split(",")

    if start_date > end_date:
        raise ValueError("End date must be after start date")
    
    if args.minutes < 1:
        raise ValueError("Minutes must be at least 1")
    
    if args.minutes > 60:
        raise ValueError("Minutes must be at most 60")

    export_file = Path(args.output_file)
    Path(export_file.parent).mkdir(parents=True, exist_ok=True)

    data = {}
    current_date = start_date

    while current_date <= end_date:  # Include the end date
        date_str = current_date.strftime("%Y-%m-%d")
        data[date_str] = generate_data_for_day(date_str, app_names, args.minutes)
        current_date += timedelta(days=1)

    json.dump(data, open(export_file, "w"))


if __name__ == "__main__":
    main()
