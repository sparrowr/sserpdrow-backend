#!/bin/sh
# sh scripts/page/page_index.sh

API="http://localhost:4741"
URL_PATH="/blogs"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
