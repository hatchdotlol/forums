# hatch forums
this is the repository for the backend and frontend of the hatch forums.

## routes
- GET `/`: forums home page.
- POST `api/new/topic`: route to create a new topic. user token should be in the `Token` header. body should contain `title`, `content` and `category` (as an ID) attributes.
- POST `api/new/post`: route to create a new post. user token should be in the `Token` header. body should contain `content` and `topic` (as an ID) attributes.
- POST `api/pin/topic`: route to pin a topic. user token should be in the `Token` header. body should contain `id` (topic ID) attributes.
- GET `/category/<category>`: category page. `<category>` is a unique ID applied to each forum category.
- GET `/topic/<topic>`: topic page. `<topic>` is a unique ID applied to each topic in the forums.
  
