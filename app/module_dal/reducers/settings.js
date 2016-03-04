const settings = (state = {
  list: [
    {
      id: 0,
      name: 'Profile',
      screen: 'profile'
    },
    {
      id: 1,
      name: 'Explore',
      screen: 'explore_topic'
    },
    {
      id: 2,
      name: 'Your topics',
      screen: 'user_topics'
    },
    {
      id: 3,
      name: 'Subscription',
      screen: 'subscription'
    }
  ]
}, action) => {
  switch ( action.type ) {
    default:
      return { ...state }
  }
}

export default settings;
