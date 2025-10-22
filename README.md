# PostCrossing

A PostCrossing database design — where users send and receive postcards with people around the world.  
Each time a user sends a postcard, they become eligible to receive one from another random registered user.



## Overview

Integrated things in this project:
- RESTful API development using **Node.js** and **Express**
- **MongoDB** integration with **Mongoose**
- Realistic postcard-sending flow with automatic reciprocal postcards
- Auto-updated user statistics (sent, received, and country counts)
- Tested via **Thunder Client**



## Technology used

Backend : Node.js, Express 
Database :MongoDB (Mongoose ODM) 
Environment : dotenv 
API Testing : Thunder Client 
Browser Extension : Chrome (for tab sorting functionality) 



## Database models

### User
- `username`
- `email`
- `country`
- `address`
- Linked with `UserStats` and `Postcards`

### Postcard
- `postcardCode`
- `sender`
- `receiver`
- `message`
- `imageUrl`
- `status` → travelling / received
- Automatically updates sender & receiver stats on receipt

### UserStats
- `totalSent`
- `totalReceived`
- `countriesSentTo`
- `countriesReceivedFrom`

### SendRequest
- Handles postcard sending requests, recipient FIFO assignment, expiry, and address snapshots



## API Endpoints

### User Routes

POST | `/api/users/register` | Register a new user 
GET | `/api/users` | Get all registered users 

### Postcard Routes

POST | `/api/postcards/send` | Send a postcard |
GET | `/api/postcards/travelling/:userId` | View all postcards a user has sent (still travelling) |
GET | `/api/postcards/received/:userId` | View all postcards a user has received |
post | `/api/postcards/receive/:postcardId` | Mark a postcard as received & trigger a reciprocal postcard |

### Debuging routes
All are GET:
`/api/users/debug/all` | View all users (for debugging) |
`/api/postcards/debug/all` | View all postcards |
`/api/send_requests/debug/all` | View all send requests |
`/api/userstats` | View all user statistics |



## example request

### Send a Postcard

**Request**
```json
POST /api/postcards/send
{
  "senderId": "68f49f06466d3fe9219b227a",
  "receiverId": "68f49ba9466d3fe9219b225b",
  "message": "I'm sending you this from Mexico!",
  "imageUrl": "https://placehold.co/600x400?text=Postcard",
  "fromCountry": "Mexico",
  "toCountry": "Pakistan"
}

Response:
{
  "postcardCode": "ME-3023991",
  "sender": "68f49f06466d3fe9219b227a",
  "receiver": "68f49ba9466d3fe9219b225b",
  "status": "traveling",
  "message": "I'm sending you this from Mexico!"
}




Author : Arfa Riaz
COMSATS University Islamabad, Lahore