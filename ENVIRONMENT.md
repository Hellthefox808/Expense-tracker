# Environment Variables Reference

The application uses environment variables to isolate configurations and protect secrets. A `.env` template is provided as `.env.example`.

## Settings Catalog

| Parameter | Type | Required | Default | Purpose |
| --------- | ---- | -------- | ------- | ------- |
| `PORT` | Integer | No | `3001` | Express server port listener. |
| `MONGO_URI`| URI String | Yes | - | Connection string for MongoDB (e.g. `mongodb://localhost:27017/expense_tracker`). |
| `NODE_ENV` | Enum String| No | `development`| Execution mode. Set to `production` or `test` depending on target environments. |

---

## Environment Verification

Check that variables loaded successfully by running:

```bash
# Start server and print active environment logs
npm run dev
```
The logs will confirm the loaded port and database connection target.
