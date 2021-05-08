import gql from 'graphql-tag';

// wrap entire query code in tagged template literal using imported gql function, now we can import the query function by name and use it anywhere in the front end application
export const QUERY_THOUGHTS = gql`
    query thoughts($username: String) {
        thoughts(username: $username) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
                createdAt
                username
                reactionBody
            }
        }
    }
`;