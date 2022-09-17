import pandas

from src import settings


def csv_file_to_dataframe(
    file_path: str,
    separator: str = settings.CSV_SEPERATOR,
):
    dataframe = pandas.read_csv(file_path, sep=separator)
    dataframe.columns = dataframe.columns.str.lower().str.strip()
    return dataframe.where(pandas.notnull(dataframe), None)


if __name__ == '__main__':
    dataframe = csv_file_to_dataframe(f'../../{settings.DATA_CSV_FILE_NAME}')
