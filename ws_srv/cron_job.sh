#!/bin/bash
# cleanup exited docker containers
EXITED_CONTAINERS=$(docker ps -a | grep Exited | awk '{ print $1 }')
if [ -z "$EXITED_CONTAINERS" ]
then
        echo "No exited containers to clean"
else
        docker rm $EXITED_CONTAINERS
fi
 
# renew certbot certificate
iptables-save > iptables-rules-backup # save iptables
iptables -I INPUT -p tcp --dport 80 -j ACCEPT # temporarily allow anything on port 80
docker compose -f /root/orefmap/server/docker-compose.yaml run --rm certbot
docker compose -f /root/orefmap/server/docker-compose.yaml exec nginx nginx -s reload
iptables-restore < iptables-rules-backup # restore iptables
rm -f iptables-rules-backup # remove iptables backup