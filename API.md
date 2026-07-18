# API Documentation

The application exposes the following web routes:

## 1. Dashboard Landing
Returns the main dashboard HTML content, displaying metrics, filter panels, transaction feed, and distribution charts.

- **URL:** `/`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (optional): Page index for pagination (default: `1`).
  - `search` (optional): Text filter matching expense descriptions.
  - `category` (optional): Category filter (e.g., `Food`, `Education`, etc.).
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** rendered HTML template.

---

## 2. Add Transaction
Validates input parameters and logs a new transaction item into the database.

- **URL:** `/add`
- **Method:** `POST`
- **Request Body (form-urlencoded / JSON):**
  - `description` (required): Name of expense (1 - 100 chars).
  - `amount` (required): Outflow value (number >= 0.01).
  - `category` (required): Class (must be one of: `Food`, `Education`, `Technology`, `Entertainment`, `Other`).
- **Success Response:**
  - **Code:** `302 Found` (Redirects to `/`)
- **Error Response:**
  - **Code:** `400 Bad Request`
  - **Content:** Rendered EJS with validation alerts.

---

## 3. Delete Transaction
Removes an existing transaction item from the database.

- **URL:** `/delete/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id` (required): Hexadecimal MongoDB ObjectId.
- **Success Response:**
  - **Code:** `302 Found` (Redirects to `/`)
- **Error Response:**
  - **Code:** `404 Not Found` (If transaction id does not exist)
