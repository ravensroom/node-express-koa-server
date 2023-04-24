#!/bin/sh
cd /home/raven/project/node-backend/blog-node/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log