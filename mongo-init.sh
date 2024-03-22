#!/bin/bash
# Configure the database

set -e

NEW_DB=""
NEW_DB_USER=""
NEW_DB_USER_PASSWORD=""

if [[ $NODE_ENV == "development" ]]; then
  NEW_DB="$API_DB"
  NEW_DB_USER="$API_DB_USER"
  NEW_DB_USER_PASSWORD="$API_DB_PASSWORD"

elif [[ $NODE_ENV == "production" ]]; then
  NEW_DB="$API_PROD_DB"
  NEW_DB_USER="$API_PROD_DB_USER"
  NEW_DB_USER_PASSWORD="$API_PROD_DB_PASSWORD"

elif [[ $NODE_ENV == "test" ]]; then
  NEW_DB="$API_TEST_DB"
  NEW_DB_USER="$API_TEST_DB_USER"
  NEW_DB_USER_PASSWORD="$API_TEST_DB_PASSWORD"
fi

# Connect to MongoDB and configure the database
mongo -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" <<EOF
print('Configuring $NEW_DB_USER...');
print('');

print("Creating '$NEW_DB'...");
print('');
db = db.getSiblingDB('$NEW_DB');

// Check if the user already exists
print("Checking if user '$NEW_DB_USER' already exists");
print('');
userExists = db.system.users.findOne({ user: '$NEW_DB_USER' });
print('');
if (!userExists) {
  // Create the user with read-write access to the 'api' database
  print('User does not exist. Creating user...');
  print('');
  
  db.createUser({
    user: '$NEW_DB_USER',
    pwd: '$NEW_DB_USER_PASSWORD',
    roles: [
      { role: 'readWrite', db: '$NEW_DB' }
    ]
  });

  print("Successfully created user '$NEW_DB_USER' with read-write access to the api database.");
} else {
  print("User '$NEW_DB_USER' already exists. Skipping creation.");
}
EOF
