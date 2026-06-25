const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('Minecraft Launcher Backend is running!');
});

// Create new user
app.post('/api/users', async (req, res) => {
  const { username, display_name, account_type, minecraft_uuid } = req.body;

  const launcher_uuid = uuidv4();

  try {
    const result = await pool.query(
      `INSERT INTO users (launcher_uuid, username, display_name, account_type, minecraft_uuid)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [launcher_uuid, username, display_name, account_type, minecraft_uuid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
