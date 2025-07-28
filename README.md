# meta-photo-api

A backend API built with Node.js and Fastify. It consumes data from an external service (JSONPlaceholder), enriches it by combining photo, album, and user information.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### **Prerequisites**

- Node.js (v18.x or higher)

- `npm` or `yarn`

### **Installation & Setup**

1. **Clone the repository:**
   branch: master.

   ```bash
   git clone [https://github.com/maxzam/meta-photo-api.git](https://github.com/maxzam/meta-photo-api.git)
   cd meta-photo-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   - **For development (with hot-reloading):**

     ```bash
     npm run dev
     ```

   - **For production:**
     First, compile the TypeScript code to JavaScript:

     ```bash
     npm run build
     ```

     Then, start the server:

     ```bash
     npm start
     ```

4. The server will be available at `http://localhost:3000` (or the port you configured).

## API Documentation

The API exposes the following main endpoint:

#### `GET /externalapi/photos`

Retrieves a list of photos enriched with their corresponding album and user information.

**Query Parameters:**

- `title` (string, optional): Filters by text contained in the photo's title.

- `album.title` (string, optional): Filters by text contained in the album's title.

- `album.user.email` (string, optional): Filters by the user's exact email address.

- `limit` (number, optional): The maximum number of results per page. **Default: 25**.

- `offset` (number, optional): The number of records to skip (for pagination). **Default: 0**.

**Example Request:**

```
http://localhost:3000/externalapi/photos?album.title=quidem&limit=10&offset=0
```
