#!/bin/bash

# Script to create Django superuser
# This will be run interactively

cd backend
source venv/bin/activate

echo "Creating Django superuser for admin access..."
echo "You will be prompted for username, email, and password."
echo ""

python manage.py createsuperuser
