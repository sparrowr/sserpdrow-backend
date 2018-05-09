#!/bin/bash
# sh scripts/page/page_destroy.sh

API="http://localhost:4741"
URL_PATH="/blogs"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
