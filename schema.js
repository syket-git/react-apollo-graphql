const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLSting,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLScalarType
} = require('graphql');


//LaunchType

const LaunchType = new GraphQLObjectType({
  name: 'LaunchType',
  fields: () =>  ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: {type: RocketType}
  })
});


//RocketType

const RocketType = new GraphQLObjectType({
    name: 'RocketType',
    fields: () => ({
        rocket_id: {type: GraphQLString},
        rocket_name: {type: GraphQLString},
        rocket_type: {type: GraphQLString}
    })
})



//RootType

const RootType = new GraphQLObjectType({
    name: "RootType", 
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parentValue, args){
                return axios.get("https://api.spacexdata.com/v3/launches")
                .then(res => res.data)
            } 
            
        }, 
        launch:{
            type: LaunchType, 
            args: {flight_number: {type: GraphQLInt}}, 
            resolve(parentValue, args){
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                .then(res => res.data)
            }
        },
        rockets:{
            type: new GraphQLList(RocketType), 
            resolve(parentValue, args){
                return axios.get("https://api.spacexdata.com/v3/rockets")
                .then(res=> res.data);
            }
        }, 
        rocket:{
            type: RocketType, 
            args: {rocket_id: {type: GraphQLString}}, 
            resolve(parentValue, args){
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.rocket_id}`)
                .then(res => res.data)
            }
        }
    }

})



module.exports = new GraphQLSchema({
    query: RootType
})