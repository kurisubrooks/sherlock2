#!/bin/bash
bl=/etc/nginx/snippets/blockips.conf
modified=false

if [ "$EUID" -ne 0 ]; then
    echo "Sudo Required"; exit
fi

if [ ! -f "$bl" ]; then
    echo "$bl is not a valid file"; exit
fi

if [ ! -w "$bl" ]; then
    echo "$bl is not writable"; exit
fi

for ip in "$@"; do
    if [[ $ip =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        ln="deny $ip;"
        if ! grep -Fxq "$ln" "$bl"; then
            echo "$ln" >> "$bl"
            echo "$ip added to $bl"
            modified=true
        else
            echo "$ip is already blocked"
        fi
    else
        echo "$ip is not a valid ip"
    fi
done

if [ "$modified" = true ]; then
    if nginx -t; then
        echo "nginx: config OK"
        if nginx -s reload
        then
            echo "nginx: reloaded successfully"
        else
            echo "nginx: unable to reload"
        fi
    else
        echo "nginx: config FAIL"
    fi
else
    echo "No changes made, aborting..."
fi
