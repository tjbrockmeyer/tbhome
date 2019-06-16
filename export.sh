#!/bin/bash

# Build and copy the React project onto the Pi
cd ./home/build && \
npm run build && \
zip -r ./build.zip ./* && \
scp ./build.zip pi:/tmp/tb.home-home.zip && \

# Copy the API project onto the Pi
cd ../../api && \
zip -r ./api.zip src index.js package.json && \
scp ./api.zip pi:/home/pi/Coding/node.js/api.zip && \

ssh pi "\
  # Move the React project from /tmp/ to the Apache2 folder and unzip it.
  cd /var/www/tb.home/home && \
  sudo mv /tmp/tb.home-home.zip ./home.zip && \
  sudo unzip -o ./home.zip && \
  sudo rm -r ./home.zip && \

  # Move the API project to the node.js directory, unzip it and install.
  cd /home/pi/Coding/node.js
  unzip -o ./api.zip -d ./tb.home-api && \
  rm ./api.zip && \
  cd ./tb.home-api && \
  echo npm install && \
  npm install && \
  npm update && \
  sudo systemctl restart tb.home-api.service && \
  sudo systemctl restart apache2" && \
echo Export complete.
