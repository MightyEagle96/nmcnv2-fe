#!/bin/bash

# build.sh
echo "Running build..."
npm run build

echo "copying build folder..."
npm run copy-build


echo "Staging changes..."
git add .

echo "Committing changes..."
git commit -m "$1"

echo "Pushing to remote..."
git push origin main

 


echo "✅ Build, and Git push completed."
