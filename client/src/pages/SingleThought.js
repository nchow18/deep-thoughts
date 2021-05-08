import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';

const SingleThought = props => {

  const { id: thoughtId } = useParams();
  console.log(thoughtId);
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading..</div>
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
  
};

// <ReactionList **reactions** = {thought.reactions}, the variable: reactions is transfered to ReactionList/index.js as an array prop, const ReactionList = ({ reactions }) =>

export default SingleThought;
