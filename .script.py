import fileinput
import logging
import os
import re
import subprocess

# import backoff
import fire

logger = logging.getLogger(__name__)


def get_pipfile_sections():
    result = subprocess.run(['cat', 'Pipfile'], stdout=subprocess.PIPE)
    decoded = result.stdout.decode('utf-8')
    sections_regex = r'\[.*]'

    sections = tuple(
        map(lambda x: re.sub(r'[\[\]]]*', '', x), re.findall(sections_regex, decoded))
    )

    sections_data = tuple(
        map(lambda x: tuple(x.strip().splitlines()), re.split(sections_regex, decoded))
    )[1:]

    return dict(zip(sections, sections_data))


def get_section_data(
    section: str,
    sections_data: dict,
):
    return sections_data.get(section)


def get_pipenv_dependencies(
    dev_only: bool = False,
):
    command = ['pipenv', 'requirements']
    if dev_only:
        command.append('--dev-only')

    result = subprocess.run(command, stdout=subprocess.PIPE)
    specified_dependencies = tuple(
        filter(lambda line: '==' in line, result.stdout.decode('utf-8').splitlines())
    )

    return tuple(dependency.split(';')[0] for dependency in specified_dependencies)


def parse_pipenv_dependencies(
    section_dependencies: tuple[str],
):
    dependencies = {}
    for dependency in section_dependencies:
        name, version = dependency.split('==')
        dependencies[name] = version

    return dependencies


def parse_pipfile_dependencies(
    section_dependencies: tuple[str],
):
    dependencies = {}
    for dependency in section_dependencies:
        name, version = dependency.split(' = ')
        dependencies[name] = version

    return dependencies


def specify_versions_in_pipfile(
    dev: bool = False,
):
    pipfile_sections = get_pipfile_sections()
    section = 'dev-packages' if dev else 'packages'
    pipfile_dependencies = get_section_data(section, pipfile_sections)
    parsed_pipfile_dependencies = parse_pipfile_dependencies(pipfile_dependencies)
    pipenv_dependencies = get_pipenv_dependencies(dev)
    parsed_pipenv_dependencies = parse_pipenv_dependencies(pipenv_dependencies)

    for dependency, version in parsed_pipfile_dependencies.items():
        pipenv_version = parsed_pipenv_dependencies.get(dependency, version)
        parsed_pipfile_dependencies[dependency] = pipenv_version

    return parsed_pipfile_dependencies


def specified_version_to_pipfile_string(
    specified_versions: dict,
):
    dependencies = tuple(
        f'{dependency} = "=={version}"'
        for dependency, version in specified_versions.items()
    )
    return os.linesep.join(dependencies)


def replacing_outdated_dependencies_in_file(
    pipfile: fileinput.FileInput,
    specified_versions: str,
    section: str,
):
    while pipfile_line := pipfile.readline():
        print(pipfile_line, end='')
        if pipfile_line.strip() == section:
            break

    print(specified_versions, end=f'{os.linesep * 2}')

    while pipfile_line := pipfile.readline():
        if pipfile_line[0] == '[':
            print(pipfile_line, end='')
            break

    while pipfile_line := pipfile.readline():
        print(pipfile_line, end='')


def backup_extension_resolver(
    dev: bool = False,
):
    return '-dev.bak' if dev else '.bak'


def store_handler(store_all: bool = False, dev: bool = False):
    store_dependencies_versions(dev, backup_extension_resolver(dev))

    if store_all:
        store_dependencies_versions(not dev, backup_extension_resolver(not dev))


# @backoff.on_exception(backoff.expo, FileExistsError, max_tries=5)
def store_dependencies_versions(
    dev: bool = False,
    backup_ext: str = '.bak',
):
    logger.info('Starting to store dependencies versions...')
    specified_versions = specified_version_to_pipfile_string(
        specify_versions_in_pipfile(dev)
    )
    section = 'dev-packages' if dev else 'packages'
    try:
        with fileinput.input(
            'Pipfile', inplace=True, encoding='utf-8', backup=backup_ext
        ) as pipfile:
            replacing_outdated_dependencies_in_file(
                pipfile, specified_versions, f'[{section}]'
            )
    except (FileExistsError,) as e:
        logger.exception('Failed to store dependencies versions: %s', e)

    logger.info('Finished storing dependencies versions...')


if __name__ == '__main__':
    fire.Fire({'store': store_handler})
