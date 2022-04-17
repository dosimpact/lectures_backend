import pandas as pd

df_from_excel = pd.read_excel(
    excel_dir,  # write your directory here
    sheet_name="Sheet1",
    header=2,
    # names = ['region', 'sales_representative', 'sales_amount'],
    dtype={
        "region": str,
        "sales_representative": np.int64,
        "sales_amount": float,
    },  # dictionary type
    index_col="id",
    na_values="NaN",
    thousands=",",
    nrows=10,
    comment="#",
)
