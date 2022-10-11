FROM python:3.10-slim-buster

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

RUN pip install pipenv

WORKDIR /opt/app
ADD Pipfile /opt/app/Pipfile
ADD Pipfile.lock /opt/app/Pipfile.lock
RUN PIP_USER=1 \
    PIP_IGNORE_INSTALLED=1 \
    pipenv install --system --deploy --ignore-pipfile

ADD . /opt/app
RUN find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf
