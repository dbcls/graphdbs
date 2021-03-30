#!/bin/bash -e

AG_RUNAS_USER=agraph
AG_DATA_DIR=/agraph/data
AG_CFG_FILE=/agraph/etc/agraph.cfg
AG_LOG_FILE=/agraph/data/agraph.log

# Make sure shared memory requirements are met.
shm_size=$(df -P /dev/shm | grep -v Filesystem | awk '{print $2}')

if [ "$shm_size" -lt 1048576 ]
then
    cat <<EOF
The container for AllegroGraph must be started with the following 
option in order to operate correctly:
--shm-size 1g 
EOF
    exit 1
fi

# Find all files not owned by $AG_RUNAS_USER in the /agraph/data and
# /agraph/etc directories (volume mount points) and change ownership
# to $AG_RUNAS_USER:$AG_RUNAS_GROUP.
find /agraph/data /agraph/etc \! -user agraph -exec sudo chown $AG_RUNAS_USER {} +
# Allow $AG_RUNAS_USER access to /agraph/lib/patches directory.
sudo chown $AG_RUNAS_USER /agraph/lib/patches

function file_env {
    local var="$1"
    local file_var="${var}_FILE"
    if [ "${!var:-}" ] && [ "${!file_var:-}" ]; then
      cat >&2 "$var and $file_var are exclusive"
      exit 1
    fi
    local val="${2:-}"
    if [ "${!var:-}" ]; then
      val="${!var}"
    elif [ "${!file_var:-}" ]; then
      val="$(< "${!file_var}")"
    fi
    unset "$file_var"
    export "$var"="$val"
}

# Configure agraph if $AG_CFG_FILE file does not exist.
if [ ! -f $AG_CFG_FILE ]
then
    file_env 'AGRAPH_SUPER_USER'
    file_env 'AGRAPH_SUPER_PASSWORD'
    if [ -z "$AGRAPH_SUPER_USER" ] || [ -z "$AGRAPH_SUPER_PASSWORD" ]; then
        AGRAPH_SUPER_USER=admin
        AGRAPH_SUPER_PASSWORD=$(tr -dc _A-Z-a-z-0-9 </dev/urandom | head -c16)
	cat <<EOF
No config file found and AGRAPH_SUPER_USER and AGRAPH_SUPER_PASSWORD
variables are not set. Superuser is configured with the following
generated credentials:

  User:     $AGRAPH_SUPER_USER
  Password: $AGRAPH_SUPER_PASSWORD

EOF
    fi
    /agraph/lib/configure-agraph                  \
        --non-interactive                         \
        --config-file    $AG_CFG_FILE             \
        --data-dir       $AG_DATA_DIR             \
        --log-dir        $AG_DATA_DIR             \
        --super-user     "$AGRAPH_SUPER_USER"     \
        --super-password "$AGRAPH_SUPER_PASSWORD" \
        --session-ports  10000-10034              \
        --runas-user     $AG_RUNAS_USER
    # Install license from a variable or from a file, if supplied.
    file_env 'AGRAPH_LICENSE'
    if [ -n "$AGRAPH_LICENSE" ]; then
        echo "$AGRAPH_LICENSE" >> $AG_CFG_FILE
    fi
fi

function terminate {
    echo Shutting down AllegroGraph
    /agraph/bin/agraph-control --config $AG_CFG_FILE stop
    exit 0
}

trap "echo Caught signal; terminate" SIGINT SIGTERM SIGQUIT

# If container's entrypoint is run without arguments, start
# AllegroGraph, otherwise interpret the arguments as a command to run.
if [ "$#" -ne "0" ]
then
    # Execute provided arguments.
    exec "$@"
else
    # Start AllegroGraph daemon.
    /agraph/bin/agraph-control --config $AG_CFG_FILE start
    # Monitor the logfile.
    # This pattern (& to put the process in the background and
    # then blocking using 'wait') appears to be the most reliable
    # way of getting bash to respond to signals.
    tail -f $AG_LOG_FILE &
    wait $!
fi
