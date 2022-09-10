import pandas


def csv_file_to_dataframe(
    file_path: str,
):
    return pandas.read_csv(file_path)


def get_email_column_values(
    dataframe: pandas.DataFrame,
    email_column: str = 'email',
) -> pandas.Series:
    return dataframe[email_column].to_list()
