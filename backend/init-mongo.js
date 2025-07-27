// MongoDB initialization script
db = db.getSiblingDB('haat');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "location": "2dsphere" });
db.users.createIndex({ "role": 1 });

db.orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.orders.createIndex({ "vendor": 1, "status": 1 });
db.orders.createIndex({ "supplier": 1, "status": 1 });
db.orders.createIndex({ "delivery.address.coordinates": "2dsphere" });

db.reviews.createIndex({ "order": 1, "reviewer": 1 }, { unique: true });
db.reviews.createIndex({ "reviewee": 1, "status": 1, "createdAt": -1 });

print('Database initialized with indexes');
