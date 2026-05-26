#!/bin/bash
cd "$(dirname "$0")"
python3 update_gallery.py
echo "-----------------------------------"
echo "SUCCESS! Website Inventory Updated."
echo "You can close this window now."
echo "-----------------------------------"
