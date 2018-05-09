#!/bin/bash
# sh scripts/page/page_create.sh

API="http://localhost:4741"
URL_PATH="/pages"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "page": {
      "name": "'"${NAME}"'",
      "text": "'"${TEXT}"'"
    }
  }'

echo
