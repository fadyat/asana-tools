FROM python:3.10-slim-buster AS base
ENV PYROOT /pyroot
ENV PYTHONUSERBASE $PYROOT


FROM base AS builder
RUN pip install pipenv
COPY Pipfile* ./
RUN PIP_USER=1 PIP_IGNORE_INSTALLED=1 pipenv install --system --deploy --ignore-pipfile


FROM base
COPY --from=builder $PYROOT/lib/ $PYROOT/lib/
WORKDIR /opt/appls
COPY ./ ./