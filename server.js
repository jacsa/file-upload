const { ApolloServer, makeExecutableSchema,mergeSchemas, gql  } = require('apollo-server');
const { GraphQLUpload } = require('graphql-upload');

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
        console.log("Entro a la consulta");
        return [{
            filename: "Mi prueba",
            mimetype: "Simon",
            encoding: "Esta mera"
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

const server = new ApolloServer({
    typeDefs,
    resolvers
  });

server.listen(4444).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});