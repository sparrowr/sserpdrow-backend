# Sserpdrow Backend

This is a Sserpdrow (Wordpress backwards) team project built at General
Assembly's Web Development Immersive.

This repository is the backend or API of the project. The client
or frontend of the project is [here](https://github.com/tautology-club/client-sserpdrow).

## Components of this Project

The early drafts of the frontend client are [here](https://github.com/tautology-club/sserpdrow-client).

The current frontend client repository is [here](https://github.com/tautology-club/client-sserpdrow).

The backend API repository is [here](https://github.com/tautology-club/sserpdrow-backend).

The deployed frontend client is [here](https://tautology-club.github.io/client-sserpdrow/).

The deployed backend API is [here](https://pacific-lake-39293.herokuapp.com/).

## Structure of this Repository

Dependencies are stored in [`package.json`](package.json).

The most important file for understanding the structure of the template is
[`server.js`](server.js). This is where the actual Express [`app`](app) object
is created, where the middlewares and routes are registered, and more.

The [`app`](app) directory contains models and route files. Models are simply
Mongoose models. Route files are somewhat similar to controllers in Rails, but
they cover more functionality, including serialization and deciding which HTTP
verbs to accept and what to do with them.

The [`config`](config) directory holds just `db.js`, which is where we specify the name
and URL of our database.

The [`lib`](lib) directory is for code that will be used in other places in the
application. The token authentication code is stored in [`lib/auth.js`](lib/auth.js). The
other files in [`lib`](lib) deal with error handling. [`custom_errors.js`](lib/custom_errors.js) is where all
the different custom classes of errors are created. There are also some functions
defined here that are used elsewhere to check for errors. [`lib/error_handler.js`](lib/error_handler.js)
is a function that is used in all the client's `.catch`es. It catches errors, and
sets the response status code based on what type of error got thrown.

To deploy this API locally on your computer, run `npm run server`.

## User Stories

1. As a site administrator, I want to be able to update my site.
1. As an organization leader, I want to be able to create blog posts.
1. As an organization leader, I want to be able to edit existing blog posts.
1. As an organization leader, I want to be able to delete existing blog posts.
1. As a site administrator evaluating different content management systems, I want to be able to view example sites that use this tool.
1. As a site visitor, I want to be able to view sites from the organizations I am interested in.
1. As a site administrator, I want to be able to make new websites.
1. As a site administrator, I don't want any unauthorized person to modify our site.
1. As a site administrator, I want to be able to authorize specific colleagues of mine to edit our site.


## Entity Relationship Diagram (ERD)

The Entity Relationship Diagram for this project is on Google Drive [here](https://docs.google.com/drawings/d/1jn4k_PMXCKAuehTMH49wN9eVOWAJZEgRgSuc3mUt1fE/edit?usp=sharing).

## Development Process Notes

We used pair programming and version control extensively for this project. We
tracked our progress by frequently updating a roadmap document in Google Drive,
which is available [here](https://docs.google.com/document/d/1zdjX9aileNQHbDQVtufrlsvDyM5cQxRPhey_Hl8q9ao/edit?usp=sharing).

## Unsolved Problems and Possible Future Tasks

1. At present, our "pages" aren't really web pages - it's not possible to visit a subdomain for a specific "page."
1. "Pages" and "blogs" aren't connected in any meaningful way - it would be great if they were linked to each other.
1. Authentication is currently done through code hand-rolled by General Assembly instructors. Among other problems, this code never checks if the content in the "password" and "confirm password" boxes on the signup page are the same.
1. It isn't possible yet for users to share ownership of pages or blogs with each other, making our project fairly useless for organizations or teams.

## API Specifications and Routes

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

#### POST /sign-up

Request:

```sh
curl --include --request POST http://localhost:4741/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
scripts/auth/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST http://localhost:4741/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
scripts/auth/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH http://localhost:4741/change-password/ \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa scripts/auth/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE http://localhost:4741/sign-out/ \
  --header "Authorization: Token token=$TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa scripts/auth/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

### Pages

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/pages`             | `pages#create`    |
| GET   | `/pages`             | `pages#find`    |
| GET  | `/pages/:id` | `pages#findById`  |
| PATCH | `/pages/:id`        | `pages#update`   |
| DELETE | `/pages/:id`        | `pages#remove`   |

#### POST /pages

Request:

```sh
curl --include --request POST http://localhost:4741/create \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "page": {
      "name": "'"${NAME}"'",
      "text": "'"${TEXT}"'"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa NAME='page name' TEXT='page text' sh scripts/page/page_create.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "page": {
    "name": "page name",
    "text": "page text"
  }
}
```

#### GET /pages

Request:

```sh
curl --include --request GET http://localhost:4741/pages \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa sh scripts/page/page_index.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "page": {
    "id": 0,
    "name": "something",
    "text": "something else"
  },
  "page": {
    "id": 1,
    "name": "page name",
    "text": "page text"
  }
}
```

#### GET /pages/:id

Request:

```sh
curl --include --request GET "http://localhost:4741/pages/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=0 sh scripts/page/page_show.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "page": {
    "id": 0,
    "name": "something",
    "text": "something else"
  }
}
```

#### PATCH `/pages/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/pages/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{
    "page": {
      "name": "'"${NAME}"'",
      "text": "'"${TEXT}"'"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=2 NAME='tautology club' TEXT='the first rule of tautology club is the first rule of tautology club' sh scripts/page/page_update.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "page": {
    "id": 2,
    "name": "tautology club",
    "text": "the first rule of tautology club is the first rule of tautology club"
  }
}
```

#### DELETE `/pages/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/pages/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=2 sh scripts/page/page_destroy.sh
```

Response:

```md
HTTP/1.1 204 NO CONTENT
Content-Type: application/json; charset=utf-8
```

## Blogs

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/blogs`             | `blogs#create`    |
| GET   | `/blogs`             | `blogs#find`    |
| GET  | `/blogs/:id` | `blogs#findById`  |
| PATCH | `/blogs/:id`        | `blogs#update`   |
| DELETE | `/blogs/:id`        | `blogs#remove`   |

#### POST /blogs

Request:

```sh
curl --include --request POST http://localhost:4741/create \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "blog": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa TITLE='blog title' BODY='blog body' sh scripts/blog/blog_create.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "blog": {
    "title": "blog title",
    "body": "blog body"
  }
}
```

#### GET /blogs

Request:

```sh
curl --include --request GET http://localhost:4741/blogs \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa sh scripts/blog/blog_index.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "blog": {
    "id": 0,
    "title": "something",
    "body": "something else"
  },
  "blog": {
    "id": 1,
    "title": "blog title",
    "body": "blog body"
  }
}
```

#### GET /blogs/:id

Request:

```sh
curl --include --request GET "http://localhost:4741/blogs/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=0 sh scripts/blog/blog_show.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "blog": {
    "id": 0,
    "title": "something",
    "body": "something else"
  }
}
```

#### PATCH `/blogs/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/blogs/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{
    "blog": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=2 TITLE='tautology club' BODY='the first rule of tautology club is the first rule of tautology club' sh scripts/blog/blog_update.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "blog": {
    "id": 2,
    "title": "tautology club",
    "body": "the first rule of tautology club is the first rule of tautology club"
  }
}
```

#### DELETE `/blogs/:id`

Request:

```sh
curl --include --request PATCH "http://localhost:4741/blogs/${ID}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa ID=2 sh scripts/blog/blog_destroy.sh
```

Response:

```md
HTTP/1.1 204 NO CONTENT
Content-Type: application/json; charset=utf-8
```

## Credits

- This was derived from the [GA template](https://git.generalassemb.ly/ga-wdi-boston/express-api-template)
- It was designed based on [this list of requirements](https://git.generalassemb.ly/ga-wdi-boston/team-project/blob/master/requirements.md)
- - Our team name comes from [this comic](https://xkcd.com/703/)

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
  alternative licensing, please contact legal@ga.co.
