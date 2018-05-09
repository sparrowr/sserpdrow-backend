#!/bin/bash
# sh scripts/page/page_update.sh

API="http://localhost:4741"
URL_PATH="/pages"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "page": {
      "text": "'"${TEXT}"'"
    }
  }'

echo
