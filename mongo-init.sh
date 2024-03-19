#!/bin/bash
# Configure the database

set -e

mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD <<EOF
print('Configuring $API_DB_USER...');
print('');

print("Creating $API_DB...");
print('');
db = db.getSiblingDB('$API_DB');

// Check if the user already exists
print("Checking if user $API_DB_USER already exists")
print('');
userExists = db.system.users.findOne({ user: '$API_DB_USER' });
print('');
if (!userExists) {
  // Create the user with read-write access to the 'api' database
  print('User does not exist. Creating user...');
  print('');
  
  db.createUser({
    user: '$API_DB_USER',
    pwd: '$API_DB_PASSWORD',
    roles: [
      { role: 'readWrite', db: '$API_DB' }
    ]
  });

  print('Successfully created user $API_DB_USER with read-write access to the api database.');
} else {
  print('User $API_DB_USER already exists. Skipping creation.');
}
EOF
