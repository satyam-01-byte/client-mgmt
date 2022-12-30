const {projects, clients} = require('../sampleData.js');

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql');

// mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
    })
});

// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    })
});

// query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            },
        },
        client: {
            type: ClientType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            },
        },
        project: {
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        }
    }
});

// mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                phone: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            },
        },
        updateClient: {
            type: ClientType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                phone: {type: GraphQLString},
            },
            resolve(parent, args) {
                return Client.findByIdAndUpdate(args.id, {
                    name: args.name && args.name,
                    email: args.email && args.email,
                    phone: args.phone && args.phone,
                });
            },
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Client.findByIdAndDelete(args.id);
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            },
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    name: args.name && args.name,
                    description: args.description && args.description,
                    status: args.status && args.status,
                });
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});