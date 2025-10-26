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
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/users/register` | Register a new user |
| GET | `/api/users` | Get all registered users |

### Postcard Routes
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/postcards/send` | Send a postcard |
| GET | `/api/postcards/travelling/:userId` | View all postcards a user has sent (still travelling) |
| GET | `/api/postcards/received/:userId` | View all postcards a user has received |
| PATCH | `/api/postcards/receive/:postcardId` | Mark a postcard as received & trigger a reciprocal postcard |

### Debug Routes
| Endpoint | Description |
|-----------|-------------|
| `/api/users/debug/all` | View all users (for debugging) |
| `/api/postcards/debug/all` | View all postcards |
| `/api/send_requests/debug/all` | View all send requests |
| `/api/userstats` | View all user statistics |



## Project Setup
1️. Clone the repository
git clone https://github.com/yourusername/postcrossing.git
cd postcrossing

2️. Install dependencies
npm install

3️. Create .env file
MONGO_URI=your_mongodb_connection_string
PORT=5000

4️. Run the server
nodemon app.js

You should see
🚀 Server running on port 5000
✅ MongoDB connected

## PostCrossing tab sorter extension

(My extension works on Chrome, to use it on Firefox simple edit the version in manifest file.)
i. Click Extentions' icon in your browser
ii. Go to Manage extensions
iii. Turn on Dev Mode
iv. Load the postcrossing-sorter-extension folder
v. Extension added. Enjoy. (Make sure Service Worker is not inactive in Manage Extensions)

Author : Arfa Riaz
COMSATS University Islamabad, Lahore
October 2025
