//## not necessary when we use entrypoints

db.auth('jose-admin', 'mkl3kj8n48yhn8')

db = db.getSiblingDB('red-kind-red')

db.createUser({
  user: 'jose',
  pwd: '12345',
  roles: [
    {
      role: 'readWrite',
      db: 'red-kind-red',
    },
  ],
});

// db.createUser(
//     {
//         user: "Jose",
//         pwd: "12345",
//         roles: [
//             {
//                 role: "readWriteAnyDatabase",
//                 db: "red-kind-red"
//             }
//         ]
//     }
// );
