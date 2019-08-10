//const { ApolloServer, makeExecutableSchema,mergeSchemas, gql  } = require('apollo-server');
//const { GraphQLUpload } = require('graphql-upload');
const express = require('express');
var bodyParser = require('body-parser')
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
 #scalar Upload

 type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  //Upload: GraphQLUpload,
  Query: {
    uploads: (parent, args) => {
        console.log("flag");
        return [{
            filename: "myfile.jpg",
            mimetype: "image/jpge",
            encoding: "."
        }];
    },
  },
  Mutation: {
    uploadFile: (parent, args) => {
      return args.file.then(file => {
        //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
        //file.stream is a node stream that contains the contents of the uploaded file
        //node stream api: https://nodejs.org/api/stream.html
        return file;
      });
    },
  },
};

// const resolveFunctions = {
//     JSON: GraphQLUpload
//   };
// const Schema = makeExecutableSchema({ typeDefs, resolveFunctions });
// const schema = mergeSchemas({
//     schemas:[
//         Schema
//     ],
//     resolvers:[
//       resolvers
//     ]
//   })

// const server = new ApolloServer({
//     schema : schema
//   });

// const server = new ApolloServer({
//     typeDefs,
//     resolvers
//   });
const server = new ApolloServer({ typeDefs, resolvers,
  context: ({req, res}) => (
    console.log(req.headers)
    ),
  introspection: true,
  playground: true,
  uploads:{
    maxFileSize: 100000000,
    maxFiles: 10
  } });
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

server.applyMiddleware({app, path: '/graphql', cors: true});
app.listen({ port: 4444 }, () =>
  console.log(`🚀 Server ready` )
);
// server.listen(4444).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });