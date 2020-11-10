import { User } from "../../../src/user/user.model";

export const seedUsers = async (): Promise<User[]> => {
  return User.query().insert([{
    id: "1cf34729-84ec-47a7-af0d-d1ee364adbfc",
    email: "bob@mail.com",
    // hash of 'secret'
    password: "$2a$10$MY39Nz2I04hXPKfhobwnyewuZp8qYkme.Hi2qDvQG6b.yFKNL/GPW",
    isEmailConfirmed: true
  }, {
    id: "be536d47-3957-446d-9f59-32e5af76d036",
    email: "alice@mail.com",
    password: "$2a$10$MY39Nz2I04hXPKfhobwnyewuZp8qYkme.Hi2qDvQG6b.yFKNL/GPW",
    isEmailConfirmed: true
  }, {
    id: "78a9343a-4244-4c7c-b71d-ad66e806c68a",
    email: "mike@mail.com",
    password: "$2a$10$MY39Nz2I04hXPKfhobwnyewuZp8qYkme.Hi2qDvQG6b.yFKNL/GPW",
    isEmailConfirmed: true
  }, {
    id: "cd37f927-fc2a-4cbf-81a3-1add3c92ae6f",
    email: "richard@mail.com",
    password: "$2a$10$MY39Nz2I04hXPKfhobwnyewuZp8qYkme.Hi2qDvQG6b.yFKNL/GPW",
    isEmailConfirmed: true
  }, {
    id: "921d9fff-700e-4538-b569-8674ab4c7b9b",
    email: "leo@mail.com",
    password: "$2a$10$MY39Nz2I04hXPKfhobwnyewuZp8qYkme.Hi2qDvQG6b.yFKNL/GPW",
    isEmailConfirmed: true
  }]);
};
