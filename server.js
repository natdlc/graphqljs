var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// input MessageInput {
// 	content: String
// 	author: String
// }

// type Message {
// 	id: ID!
// 	content: String
// 	author: String
// }

// type Query {
// 	getMessage(id: ID!): Message
// }

// type Mutation {
// 	createMessage(input: MessageInput): Message
// 	updateMessage(id: ID!, input: MessageInput): Message
// }

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	input StudentInput {
		id: ID!
		name: String!
		course: String!
	}

	type Student {
		id: ID!
		name: String!
		course: String!
	}

	type Query {
		getStudent(id: ID!): Student
		getAllStudents: [Student]
	}

	type Mutation {
		registerStudent(student: StudentInput): Student
	}
`);

// The root provides a resolver function for each API endpoint
let fakeDB = {};
var root = {
	getStudent: ({ id }) => {
		return fakeDB[id];
	},
	getAllStudents: () => {
		return Object.entries(fakeDB).map((student) => student[1]);
	},
	registerStudent: ({ student }) => {
		fakeDB[student.id] = student;
		return fakeDB[student.id];
	},
};

var app = express();
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");

// var { graphql, buildSchema } = require("graphql");

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String,
//     hi: String
//   }
// `);

// // The rootValue provides a resolver function for each API endpoint
// var rootValue = {
// 	hello: () => {
// 		return "Hello world!";
// 	},
// 	hi: () => {
// 		return "Hi world!";
// 	},
// };

// // Run the GraphQL query '{ hello }' and print out the response
// graphql({
// 	schema,
// 	source: "{ hello }",
// 	rootValue,
// }).then((response) => {
// 	console.log(response);
// });

// graphql({
// 	schema,
// 	source: "{ hi }",
// 	rootValue,
// }).then((response) => {
// 	console.log(response);
// });
