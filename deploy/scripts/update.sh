#!/bin/bash

# This file must be placed outside the root directory of the project, next to "passmeta-ui"
#

cd "$(dirname "$0")" || exit 1

# prepare temp directories
test -e ./passmeta-ui-tmp && rm -r ./passmeta-ui-tmp
test -e ./passmeta-ui-new && rm -r ./passmeta-ui-new

# get and unzip
wget -P ./passmeta-ui-tmp https://github.com/vlad120/PassMeta-WebApp/archive/refs/heads/master.zip || exit 1
unzip ./passmeta-ui-tmp/master.zip -d ./passmeta-ui-tmp || exit 1

# prepare files
mkdir ./passmeta-ui-new || exit 1
cp -a ./passmeta-ui-tmp/PassMeta-WebApp-master ./passmeta-ui-new || exit 1
cp ./passmeta-ui/deploy/.env.local ./passmeta-ui-new/deploy/.env.local
rm -r ./passmeta-ui-tmp

# stop services
bash ./passmeta-ui/deploy/scripts/stop.sh || exit 1

# swap new & current & old directories
rm -f -r ./passmeta-old
mv ./passmeta-ui ./passmeta-old || exit 1
mv ./passmeta-ui-new ./passmeta-ui || exit 1

# rebuild & start container
bash ./passmeta-ui/deploy/scripts/rebuild.sh || exit 1
echo "----"
echo "Successfully updated!"
read -p "Start service now? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
bash ./passmeta-ui/deploy/scripts/start.sh
fi
