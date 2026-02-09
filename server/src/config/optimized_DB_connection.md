Usage:

```javascript
import db from './path/to/database';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database';

async function startServer() {
  try {
    await db.connect(MONGO_URI);
    // Start your Express/other server here
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

startServer();
```
### Key optimizations:

- Singleton pattern prevents multiple connections
- Connection pooling (5-10 connections) for concurrent requests
- Event listeners for connection monitoring
- Graceful shutdown on SIGINT
- Error handling with proper logging
- Reuse detection to avoid redundant connections
- Timeout configurations for better reliability