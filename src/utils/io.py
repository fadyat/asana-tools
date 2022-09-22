from typing import BinaryIO

import pandas

from src import settings

__all__ = ('csv_file_to_dataframe',)


def csv_file_to_dataframe(
    file: str | BinaryIO,
    separator: str = settings.CSV_SEPERATOR,
):
    dataframe = pandas.read_csv(file, sep=separator)
    dataframe.columns = dataframe.columns.str.lower().str.strip()
    return dataframe.where(pandas.notnull(dataframe), None)
