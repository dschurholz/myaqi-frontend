from __future__ import with_statement
import json
from fabric.api import env
from fabric.api import *

from fabric.colors import green, red, yellow


def prod():
    try:
        prod_server_file = open('prod-server.json', 'r')
        prod_server = json.loads(prod_server_file.read())
    except Exception as e:
        print(red(e))
    else:
        env.hosts = [prod_server["host"]]
        env.remote_admin = prod_server["remote_admin"]
        env.branch = prod_server["branch"]
        env.core_dir = prod_server["core_dir"]
        env.git_deployment_key = prod_server["git_deployment_key"]
        env.is_production = True


def update_repo():
    """
    Updates the git repository with the branch attached to this server
    (see environmets.py)
    """
    print(green("Updating repo"))
    ssh_bypass = (
        "ssh-agent bash -c 'ssh-add %s;" % env.git_deployment_key)
    run(ssh_bypass + " git fetch --all'")
    run('git checkout %s' % env.branch)
    run(ssh_bypass + " git pull origin %s'" % env.branch)


def update_dependencies():
    """
    Updates the npm modules required by this server
    (see environmets.py)
    """
    print(green("Updating dependencies"))
    run('npm install')


def build():
    """
    Build production version of the app.
    (see environmets.py)
    """
    print(green("Building MyAQI app"))
    run('yarn build')


def restart_nginx():
    """
    Restart Nginx server.
    (see environmets.py)
    """
    print(green("Restarting NGINX"))
    output = sudo('nginx -t', warn_only=True)
    if not output.failed:
        print(green('NGINX Syntax is correct'))
        sudo('service nginx restart')
    else:
        print(red('NGINX syntax is incorrect'))


def deploy():
    """
    Deploys the system to a specified server (check envrionments.py)
    """
    if env.is_production and not prompt(
            red("Do you REALLY wanna deploy to PRODUCTION SERVER? "
                "Type 'yes' if you know what are you doing."
                )).lower() == 'yes':
        return

    with cd(env.core_dir):
        update_repo()
        if prompt(
            yellow("Run 'npm install'? "
                   "Type 'yes' if you know what are you doing."
                   )).lower() == 'yes':
            update_dependencies()
        if prompt(
            yellow("Run 'yarn build'? "
                   "Type 'yes' if you know what are you doing."
                   )).lower() == 'yes':
            build()
        restart_nginx()
