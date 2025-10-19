PostCrossing:

Users send and receive postcards from all over the world. Sending a postcard automatically makes the sender an eligable receiver, who will indefinately get a postcart from some other registered user. 


API:

API handles user registartion, seeing all users, postcard sending, receiving, random selection of receiver for sending postcard, viewing traveling and received postcards, auto-update of user statistics, and making reciprocal postcards upon receival.

API is made to work by = Node.js, Express
Database used = MongoDB
Evvironment Variables = dotenv
API testing = Thunder Client


Models:

User: uusername, email, country, address (linked with stats and postcards)

Postcard: postcardCode, sender, receiver, message, imageURL, status (travelling, received) <- auto-updates on receival.

UserStats: totalsent, totalReceived, countriesSentTo, countriesReceivedFrom.


API Endpoints:

-- User Routes --
1. register a new user: POST /api/users/register
2. get all registered users: GET /api/users

-- Postcard Routes --
1. send a postcard: /api/postcards/send
2. all travelling postcards sent by a user: /api/postcards/travelling/:userId
3. all received postcards of a user: /api/postcards/received/:userId
4. Mark postcard as received and trigger reciprocal postcard: /api/postcards/receive/:postcardId


Sample:

send a postcard

-- request --

POST /api/postcards/send
{
  "senderId": "68f49f06466d3fe9219b227a",
  "receiverId": "68f49ba9466d3fe9219b225b",
  "message": "I'm sending you this from mehico!",
  "imageUrl": "https://placehold.co/600x400?text=Postcard",
  "fromCountry": "Mexico",
  "toCountry": "Pakistan"
}

-- response --

{
  "postcardCode": "ME-3023991",
  "sender": "68f49f06466d3fe9219b227a",
  "receiver": "68f49ba9466d3fe9219b225b",
  "status": "traveling",
  "message": "'m sending you this from mehico!"
}



Author

Arfa Riaz
University Project | COMSATS Lahore
October 2025